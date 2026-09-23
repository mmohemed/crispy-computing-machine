# بنية ملفات المحتوى

كل المحتوى موجود في `content/` كملفات JSON. هذه الملفات هي **مصدر الحقيقة**: الصفحات تقرؤها، وأداة الفحص تتحقق منها، و Seeder قاعدة البيانات مستقبلاً ينقلها كما هي (انظر `db-schema.sql`).

```
content/
├── catalog.json                         المنهج كله: المسار، المستويات، الكورسات، الوحدات، عناوين الدروس، المشاريع، التقنيات
├── courses/{course}.json                تفاصيل صفحة الكورس (للكورسات التي فيها دروس منشورة)
├── lessons/{course}/{lesson}.json       محتوى الدرس الكامل
└── quizzes/{quiz}.json                  اختبار وحدة أو اختبار نهائي
```

## catalog.json

```jsonc
{
  "track": { "slug", "title", "title_en", "description" },
  "learning_path": [ { "key", "level", "icon", "title", "title_en", "courses": ["slug"], "summary" } ],
  "levels": [ { "number", "slug", "icon", "title", "title_en", "elective", "courses": ["slug"], "summary", "description", "outcome" } ],
  "courses": [ {
      "slug", "code", "level", "icon", "title", "title_en", "difficulty", "hours",
      "prerequisites": ["course-slug"], "summary",
      "modules": [ {
          "slug", "title", "title_en", "description?",
          "lessons": [ { "slug", "title", "title_en", "minutes", "status": "published | planned" } ],
          "quiz": null | { "slug", "title", "status" }
      } ],
      "final_exam?": { "slug", "title", "status" }
  } ],
  "projects": [ { "number", "slug", "icon", "difficulty", "title", "problem", "dataset", "after", "level", "tools": [] } ],
  "technologies": [ { "name", "icon", "level", "core", "role", "where" } ]
}
```

- `status: "published"` يعني أن الدرس مكتمل ويمكن دراسته. `planned` يظهر في المنهج كعنوان فقط بدون رابط.
- الـ `slug` للدرس فريد على مستوى المسار كله.

## درس: `lessons/{course}/{lesson}.json`

```jsonc
{
  "slug": "python-variables", "course": "python-basics", "module": "python-fundamentals",
  "order": 3, "title": "المتغيرات", "title_en": "Variables", "minutes": 20, "level": "مبتدئ",
  "objectives": ["..."],
  "sections": [
    { "type": "concept",  "title": "...", "body": [BLOCK, ...] },
    { "type": "why",      "body": [BLOCK, ...] },
    { "type": "when",     "body": [BLOCK, ...] },
    { "type": "example",  "title": "...", "intro?": [BLOCK], "code": ["سطر", "سطر"],
      "language?": "python | text", "label?": "...", "run?": true, "stdin?": ["..."],
      "explanation": [ { "code": "جزء من الكود", "text": "شرحه" } ],
      "expected_output": ["سطر", "سطر"], "output_varies?": false,
      "after?": [BLOCK], "run_note?": "..." },
    { "type": "notes",    "items": ["..."] },
    { "type": "mistakes", "items": [ { "title", "wrong?": [..], "error?": "رسالة الخطأ", "error_type?": "NameError", "why", "fix?": [..] } ] }
  ],
  "exercise": {
    "title", "prompt": [BLOCK], "requirements": ["..."],
    "starter_code": [..], "tests": [..], "solution": [..], "hints": ["..."],
    "solution_explanation?": [BLOCK], "stdin?": [..]
  },
  "check": QUESTION,
  "summary": ["..."]
}
```

### الكتل BLOCK

| الشكل | يُعرض كـ |
|---|---|
| `"نص"` | فقرة. تدعم `` `كود` `` و `**عريض**` فقط (كل شيء آخر يُهرَّب) |
| `{ "h": "عنوان" }` | عنوان فرعي |
| `{ "list": [..] }` / `{ "ol": [..] }` | قائمة نقطية / مرقمة |
| `{ "table": { "head": [..], "rows": [[..]] } }` | جدول |
| `{ "code": [..], "language?": "python", "label?": "..." }` | كتلة كود للقراءة |
| `{ "output": [..], "label?": "..." }` | صندوق مخرجات |

### اختبارات التمرين `tests`

كود Python يُشغَّل بعد كود الطالب **في نفس النطاق**، فيستطيع الوصول إلى متغيراته ودواله. متاح له أيضاً:

- `__output__`: كل ما طبعه كود الطالب.
- `__code__`: نص كود الطالب (للتحقق من استخدام أسلوب معين).

كل `assert` يجب أن يحمل رسالة عربية واضحة تُعرض للطالب عند الفشل.

## سؤال: QUESTION

```jsonc
{ "id": "q1", "type": "mcq",            "prompt", "options": [..], "answer": 1, "explanation", "lesson?": "slug" }
{ "id": "q2", "type": "predict_output", "prompt", "code": [..], "options": ["الناتج بالضبط", ..], "answer": 0, "explanation" }
{ "id": "q3", "type": "true_false",     "prompt", "answer": false, "explanation" }
{ "id": "q4", "type": "write_code",     "prompt", "starter_code": [..], "tests": [..], "solution": [..], "hints": [..], "explanation" }
{ "id": "q5", "type": "fix_code",       "prompt", "starter_code": [الكود الخاطئ], "tests": [..], "solution": [..], "hints": [..], "explanation" }
```

- في `predict_output` كل خيار هو **الناتج الحرفي** (الأسطر مفصولة بـ `\n`)، وأداة الفحص تتأكد أن الخيار الصحيح يطابق الناتج الفعلي.
- `lesson` في أسئلة الاختبار تُستخدم لاقتراح الدروس التي يراجعها الطالب عند الخطأ.

## اختبار: `quizzes/{quiz}.json`

```jsonc
{ "slug", "course", "module", "title", "intro": ["..."], "questions": [QUESTION, ...] }
```

اختبار الوحدة يحتاج 10 أسئلة على الأقل، ويشمل الأنواع الخمسة كلها.

## قواعد النشر (تفرضها `tools/check_content.py`)

1. الدرس المنشور فيه كل الأقسام: `concept` و `why` و `when` و `example` و `notes` و `mistakes`، ثم التمرين وسؤال الفهم والخلاصة.
2. كل مثال Python قابل للتشغيل يطبع `expected_output` حرفياً.
3. كل حل نموذجي يجتاز اختباراته، والكود الابتدائي لا يجتازها.
4. كل خطأ شائع له `error_type` يسبب فعلاً هذا النوع من الأخطاء، وتصحيحه يعمل.
5. لا نصوص وهمية: Lorem ipsum، Coming Soon، "سيتم إضافة"، "درس تجريبي"...
