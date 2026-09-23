#!/usr/bin/env python3
"""
فاحص المحتوى: يمنع نشر أي درس ناقص أو كود لا يعمل كما هو مكتوب.

يفحص:
  1. سلامة الكتالوج: slugs فريدة، وكل درس منشور له ملف JSON وصفحة HTML.
  2. اكتمال كل درس منشور: الشرح، لماذا، متى، مثال، ملاحظات، أخطاء شائعة، تمرين، سؤال، خلاصة.
  3. عدم وجود نصوص وهمية (Lorem ipsum، Coming Soon، ...).
  4. التنفيذ الفعلي باستخدام نفس harness المستخدم في المتصفح:
     - كل مثال يطبع "النتيجة المتوقعة" المكتوبة في الدرس بالضبط.
     - كل حل نموذجي يجتاز اختبارات تمرينه، والكود الابتدائي لا يجتازها.
     - كل "كود خاطئ" له error_type يسبب فعلاً هذا النوع من الأخطاء.
     - إجابات أسئلة "ما ناتج الكود" تطابق الناتج الفعلي.

    python3 tools/check_content.py
"""
import json
import os
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'js', 'runners'))
import python_harness  # noqa: E402

REQUIRED_SECTIONS = ['concept', 'why', 'when', 'example', 'notes', 'mistakes']
FORBIDDEN = ['lorem ipsum', 'coming soon', 'سيتم إضافة', 'سيُضاف لاحقاً', 'درس تجريبي', 'هذا مثال فقط', 'todo', 'tbd']

errors = []
checked = {'lessons': 0, 'examples': 0, 'exercises': 0, 'mistakes': 0, 'questions': 0}


def fail(where, msg):
    errors.append(f'{where}: {msg}')


def lines(value):
    if value is None:
        return None
    return '\n'.join(value) if isinstance(value, list) else str(value)


def load(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return json.load(f)


def run(code, tests=None, stdin=None):
    # كل تشغيل في مجلد مؤقت نظيف (مثل بيئة المتصفح)
    cwd = os.getcwd()
    with tempfile.TemporaryDirectory() as tmp:
        os.chdir(tmp)
        try:
            return python_harness.run(code, tests=tests, stdin=stdin)
        finally:
            os.chdir(cwd)


def scan_placeholders(where, obj):
    text = json.dumps(obj, ensure_ascii=False).lower()
    for word in FORBIDDEN:
        if word in text:
            fail(where, f'يحتوي نصاً وهمياً ممنوعاً: "{word}"')


def check_lesson(course_slug, meta):
    where = f'lesson {course_slug}/{meta["slug"]}'
    rel = f'content/lessons/{course_slug}/{meta["slug"]}.json'
    if not os.path.exists(os.path.join(ROOT, rel)):
        fail(where, f'منشور في الكتالوج لكن الملف {rel} غير موجود')
        return
    page = f'lessons/{course_slug}/lesson-{meta["slug"]}.html'
    if not os.path.exists(os.path.join(ROOT, page)):
        fail(where, f'الصفحة {page} غير موجودة (شغّل node tools/build-pages.mjs)')

    lesson = load(rel)
    checked['lessons'] += 1
    scan_placeholders(where, lesson)

    for key in ['slug', 'title', 'title_en', 'minutes', 'objectives', 'sections', 'exercise', 'check', 'summary']:
        if not lesson.get(key):
            fail(where, f'الحقل {key} مفقود أو فارغ')
    if lesson.get('slug') != meta['slug']:
        fail(where, 'slug في الملف لا يطابق الكتالوج')
    if lesson.get('title') != meta['title']:
        fail(where, f'العنوان في الملف ({lesson.get("title")}) لا يطابق الكتالوج ({meta["title"]})')

    types = [s.get('type') for s in lesson.get('sections', [])]
    for t in REQUIRED_SECTIONS:
        if t not in types:
            fail(where, f'ينقصه قسم من نوع {t}')

    for i, sec in enumerate(lesson.get('sections', [])):
        swhere = f'{where} section#{i}'
        if sec['type'] == 'example':
            if not sec.get('code') or not sec.get('explanation'):
                fail(swhere, 'المثال يحتاج code و explanation')
            lang = sec.get('language', 'python')
            if lang == 'python' and sec.get('run', True):
                checked['examples'] += 1
                res = run(lines(sec['code']), stdin=lines(sec.get('stdin')))
                if res['error']:
                    fail(swhere, f'المثال يسبب خطأ: {res["error"]}')
                elif not sec.get('output_varies'):
                    expected = (lines(sec.get('expected_output')) or '').rstrip('\n')
                    actual = res['stdout'].rstrip('\n')
                    if expected != actual:
                        fail(swhere, f'الناتج الفعلي لا يطابق المتوقع\n--- expected\n{expected}\n--- actual\n{actual}')
            elif lang == 'python' and sec.get('expected_output') is None:
                fail(swhere, 'مثال Python غير قابل للتشغيل يحتاج expected_output')
        if sec['type'] == 'mistakes':
            for j, m in enumerate(sec.get('items', [])):
                if not m.get('why'):
                    fail(f'{swhere} mistake#{j}', 'ينقصه شرح why')
                if m.get('error_type'):
                    checked['mistakes'] += 1
                    res = run(lines(m['wrong']))
                    got = res['error']['type'] if res['error'] else None
                    if got != m['error_type']:
                        fail(f'{swhere} mistake#{j}', f'الكود الخاطئ يجب أن يسبب {m["error_type"]} لكنه سبب {got}')
                if m.get('fix') and m.get('error_type'):
                    res = run(lines(m['fix']))
                    if res['error']:
                        fail(f'{swhere} mistake#{j}', f'كود التصحيح نفسه يسبب خطأ: {res["error"]}')

    ex = lesson.get('exercise') or {}
    check_code_task(f'{where} exercise', ex.get('starter_code'), ex.get('tests'), ex.get('solution'), ex.get('stdin'))
    if not ex.get('hints'):
        fail(f'{where} exercise', 'التمرين يحتاج تلميحاً واحداً على الأقل')
    if not ex.get('requirements'):
        fail(f'{where} exercise', 'التمرين يحتاج قائمة المطلوب requirements')
    check_question(f'{where} check', lesson.get('check') or {})


def check_code_task(where, starter, tests, solution, stdin=None):
    if not (starter and tests and solution):
        fail(where, 'يحتاج starter_code و tests و solution')
        return
    checked['exercises'] += 1
    res = run(lines(solution), tests=lines(tests), stdin=lines(stdin))
    if res['error'] or not (res['tests'] and res['tests']['passed']):
        fail(where, f'الحل النموذجي لا يجتاز الاختبارات: {res["error"] or res["tests"]}')
    res = run(lines(starter), tests=lines(tests), stdin=lines(stdin))
    if res['tests'] and res['tests']['passed']:
        fail(where, 'الكود الابتدائي يجتاز الاختبارات بدون حل؛ الاختبارات ضعيفة')


def check_question(where, q):
    checked['questions'] += 1
    t = q.get('type')
    if not q.get('prompt') or not q.get('explanation'):
        fail(where, 'السؤال يحتاج prompt و explanation')
    if t in ('mcq', 'predict_output'):
        opts = q.get('options') or []
        if len(opts) < 2 or not isinstance(q.get('answer'), int) or not 0 <= q['answer'] < len(opts):
            fail(where, 'خيارات أو رقم الإجابة غير صالح')
            return
        if len(set(opts)) != len(opts):
            fail(where, 'خيارات مكررة')
        if t == 'predict_output':
            res = run(lines(q['code']))
            actual = res['stdout'].rstrip('\n') if not res['error'] else None
            if actual != opts[q['answer']]:
                fail(where, f'الإجابة المعلّمة ({opts[q["answer"]]!r}) لا تطابق الناتج الفعلي ({actual!r})')
    elif t == 'true_false':
        if not isinstance(q.get('answer'), bool):
            fail(where, 'إجابة صح/خطأ يجب أن تكون true أو false')
    elif t in ('write_code', 'fix_code'):
        check_code_task(where, q.get('starter_code'), q.get('tests'), q.get('solution'))
    else:
        fail(where, f'نوع سؤال غير معروف: {t}')


def main():
    catalog = load('content/catalog.json')
    scan_placeholders('catalog', catalog)

    seen = {}
    level_numbers = {lv['number'] for lv in catalog['levels']}
    course_slugs = {c['slug'] for c in catalog['courses']}
    for lv in catalog['levels']:
        for slug in lv['courses']:
            if slug not in course_slugs:
                fail(f'level {lv["number"]}', f'كورس غير معروف {slug}')
    for node in catalog['learning_path']:
        for slug in node['courses']:
            if slug not in course_slugs:
                fail(f'path {node["key"]}', f'كورس غير معروف {slug}')

    for course in catalog['courses']:
        cwhere = f'course {course["slug"]}'
        if course['level'] not in level_numbers:
            fail(cwhere, 'مستوى غير معروف')
        for p in course.get('prerequisites', []):
            if p not in course_slugs:
                fail(cwhere, f'متطلب غير معروف {p}')
        any_published = False
        for mod in course['modules']:
            for lesson in mod['lessons']:
                if lesson['slug'] in seen:
                    fail(cwhere, f'slug مكرر {lesson["slug"]} (موجود أيضاً في {seen[lesson["slug"]]})')
                seen[lesson['slug']] = course['slug']
                if lesson['status'] == 'published':
                    any_published = True
                    check_lesson(course['slug'], lesson)
            quiz = mod.get('quiz')
            if quiz and quiz['status'] == 'published':
                rel = f'content/quizzes/{quiz["slug"]}.json'
                if not os.path.exists(os.path.join(ROOT, rel)):
                    fail(cwhere, f'الاختبار {quiz["slug"]} منشور لكن {rel} غير موجود')
                    continue
                data = load(rel)
                scan_placeholders(f'quiz {quiz["slug"]}', data)
                if len(data['questions']) < 10:
                    fail(f'quiz {quiz["slug"]}', 'اختبار الوحدة يحتاج 10 أسئلة على الأقل')
                kinds = {q['type'] for q in data['questions']}
                for k in ('mcq', 'true_false', 'predict_output', 'write_code', 'fix_code'):
                    if k not in kinds:
                        fail(f'quiz {quiz["slug"]}', f'ينقصه سؤال من نوع {k}')
                ids = [q['id'] for q in data['questions']]
                if len(ids) != len(set(ids)):
                    fail(f'quiz {quiz["slug"]}', 'معرّفات أسئلة مكررة')
                for q in data['questions']:
                    if q.get('lesson') and q['lesson'] not in seen:
                        fail(f'quiz {quiz["slug"]} {q["id"]}', f'درس غير معروف {q["lesson"]}')
                    check_question(f'quiz {quiz["slug"]} {q["id"]}', q)
                if not os.path.exists(os.path.join(ROOT, f'exercises/quiz-{quiz["slug"]}.html')):
                    fail(cwhere, f'صفحة الاختبار exercises/quiz-{quiz["slug"]}.html غير موجودة')
        if any_published:
            rel = f'content/courses/{course["slug"]}.json'
            if not os.path.exists(os.path.join(ROOT, rel)):
                fail(cwhere, f'الكورس فيه دروس منشورة لكن {rel} غير موجود')
            else:
                details = load(rel)
                scan_placeholders(cwhere, details)
                for key in ['intro', 'description', 'objectives', 'prerequisites', 'audience', 'skills', 'assessment', 'projects']:
                    if not details.get(key):
                        fail(cwhere, f'تفاصيل الكورس ينقصها {key}')

    # كل ملف درس موجود يجب أن يكون منشوراً في الكتالوج
    lessons_dir = os.path.join(ROOT, 'content', 'lessons')
    for course_slug in os.listdir(lessons_dir):
        for fname in os.listdir(os.path.join(lessons_dir, course_slug)):
            slug = fname[:-5]
            if seen.get(slug) != course_slug:
                fail(f'content/lessons/{course_slug}/{fname}', 'ملف درس غير موجود في الكتالوج')

    summary = ', '.join(f'{v} {k}' for k, v in checked.items())
    if errors:
        print(f'✗ {len(errors)} مشكلة ({summary}):\n')
        for e in errors:
            print(' -', e)
        sys.exit(1)
    print(f'✓ المحتوى سليم: {summary}')


if __name__ == '__main__':
    main()
