/**
 * صفحة الدرس: Sidebar للوحدات والدروس + محتوى الدرس + محرر + تمرين + سؤال فهم + تنقل.
 */
import { boot } from './boot.js';
import { courseLessons, getCourse, isPublished, loadLesson } from '../core/catalog.js';
import { $, escapeHtml, inline, joinLines, minutesLabel } from '../core/dom.js';
import { coursePage, lessonPage, quizPage, roadmapPage, homePage } from '../core/paths.js';
import { STATUS_ICON, courseProgress, lessonStates, progress, progressBar, moduleProgress } from '../core/progress-store.js';
import { renderBlocks } from '../components/blocks.js';
import { bindCopy, codeBlock, renderQuestion } from '../components/quiz.js';
import { createPlayground } from '../components/code-editor.js';

const { course: COURSE_SLUG, lesson: LESSON_SLUG } = document.body.dataset;

const SECTION_META = {
    concept: { icon: 'fas fa-book-open', cls: 'concept' },
    why: { icon: 'fas fa-bullseye', cls: 'why', title: 'لماذا نستخدمه؟' },
    when: { icon: 'fas fa-clock', cls: 'when', title: 'متى نستخدمه؟' },
    example: { icon: 'fas fa-flask', cls: 'example' },
    notes: { icon: 'fas fa-lightbulb', cls: 'notes', title: 'ملاحظات مهمة' },
    mistakes: { icon: 'fas fa-bug', cls: 'mistakes', title: 'أخطاء شائعة وكيف تتجنبها' },
};

/* ------------------------------------------------------------------ Sidebar */
function renderSidebar(course, activeSlug) {
    const states = lessonStates(course);
    const p = courseProgress(course);
    const quizState = (quiz) => progress.getQuiz(quiz.slug)?.passed ? STATUS_ICON.quizPassed : STATUS_ICON.quiz;

    const modules = course.modules.map((mod, mi) => {
        const containsActive = mod.lessons.some((l) => l.slug === activeSlug);
        const mp = moduleProgress(mod);
        const items = mod.lessons.map((l) => {
            const st = states[l.slug];
            const active = l.slug === activeSlug ? ' is-active' : '';
            if (st === 'planned') {
                return `<li class="is-planned">
                    <span>${STATUS_ICON.planned}<span>${escapeHtml(l.title)}</span></span></li>`;
            }
            return `<li class="is-${st}${active}">
                <a href="${lessonPage(course.slug, l.slug)}" ${active ? 'aria-current="page"' : ''}>${STATUS_ICON[st]}<span>${escapeHtml(l.title)}</span></a></li>`;
        }).join('');
        const quiz = mod.quiz
            ? (isPublished(mod.quiz)
                ? `<li><a href="${quizPage(mod.quiz.slug)}">${quizState(mod.quiz)}<span>${escapeHtml(mod.quiz.title)}</span></a></li>`
                : `<li class="is-planned"><span>${STATUS_ICON.planned}<span>${escapeHtml(mod.quiz.title)}</span></span></li>`)
            : '';
        const count = mp.total ? ` <small>(${mp.done}/${mp.total})</small>` : '';
        return `<details class="side-module" ${containsActive ? 'open' : ''}>
            <summary><span>الوحدة ${mi + 1}: ${escapeHtml(mod.title)}${count}</span><i class="fas fa-chevron-down c-chevron"></i></summary>
            <ul class="side-lessons">${items}${quiz}</ul>
        </details>`;
    }).join('');

    return `
        <a class="sidebar-course" href="${coursePage(course.slug)}"><i class="${escapeHtml(course.icon)}"></i> ${escapeHtml(course.title)}</a>
        ${progressBar(p)}
        ${modules}`;
}

/* ------------------------------------------------------------------ Sections */
function sectionHead(meta, title) {
    return `<h2><span class="sec-ic"><i class="${meta.icon}"></i></span>${inline(title)}</h2>`;
}

function renderExample(sec, idx) {
    const code = joinLines(sec.code);
    const explanation = (sec.explanation || []).map((e) =>
        `<li>${e.code ? `<code>${escapeHtml(e.code)}</code>` : '<span></span>'}<span>${inline(e.text)}</span></li>`).join('');
    const expected = sec.expected_output != null
        ? `<div class="sub-label"><i class="fas fa-terminal"></i> النتيجة المتوقعة</div>
           <div class="output-box"><div class="cb-head"><span>Output</span></div><pre>${escapeHtml(joinLines(sec.expected_output))}</pre></div>`
        : '';
    const runnable = sec.run !== false && (sec.language || 'python') === 'python';
    return `<section class="l-section example" id="example-${idx}">
        ${sectionHead(SECTION_META.example, sec.title || 'مثال عملي')}
        <div class="prose">${renderBlocks(sec.intro)}</div>
        ${codeBlock(code, { language: sec.language || 'python', label: sec.label || (sec.language && sec.language !== 'python' ? sec.language : 'Python') })}
        ${runnable ? `<div class="editor-toolbar"><button type="button" class="cw-btn sm try-btn" data-example="${idx}"><i class="fas fa-play"></i> جرّب المثال وعدّل عليه</button></div>
        <div class="try-host" data-example="${idx}"></div>` : ''}
        ${explanation ? `<div class="sub-label"><i class="fas fa-magnifying-glass"></i> شرح الكود</div><ul class="explain-list">${explanation}</ul>` : ''}
        ${expected}
        ${sec.after ? `<div class="prose" style="margin-top:16px">${renderBlocks(sec.after)}</div>` : ''}
        ${sec.run_note ? `<p class="section-lead" style="margin:14px 0 0;font-size:1rem"><i class="fas fa-circle-info"></i> ${inline(sec.run_note)}</p>` : ''}
    </section>`;
}

function renderMistakes(sec) {
    const items = sec.items.map((m) => `
        <div class="mistake">
            <h3><i class="fas fa-triangle-exclamation"></i> ${inline(m.title)}</h3>
            ${m.wrong ? codeBlock(m.wrong, { label: '✗ كود خاطئ', variant: 'wrong' }) : ''}
            ${m.error ? `<div class="m-error">${escapeHtml(m.error)}</div>` : ''}
            <p class="m-why">${inline(m.why)}</p>
            ${m.fix ? codeBlock(m.fix, { label: '✓ التصحيح', variant: 'right' }) : ''}
        </div>`).join('');
    return `<section class="l-section mistakes">${sectionHead(SECTION_META.mistakes, sec.title || SECTION_META.mistakes.title)}${items}</section>`;
}

function renderSection(sec, idx) {
    const meta = SECTION_META[sec.type];
    if (!meta) return '';
    if (sec.type === 'example') return renderExample(sec, idx);
    if (sec.type === 'mistakes') return renderMistakes(sec);
    if (sec.type === 'notes') {
        return `<section class="l-section notes">${sectionHead(meta, sec.title || meta.title)}
            <ul class="note-list">${sec.items.map((n) => `<li>${inline(n)}</li>`).join('')}</ul></section>`;
    }
    return `<section class="l-section ${meta.cls}">${sectionHead(meta, sec.title || meta.title)}
        <div class="prose">${renderBlocks(sec.body)}</div></section>`;
}

function renderExercise(ex) {
    return `<section class="l-section exercise" id="exercise">
        ${sectionHead({ icon: 'fas fa-dumbbell' }, `تمرين تطبيقي: ${ex.title}`)}
        <div class="prose">${renderBlocks(ex.prompt)}
            ${ex.requirements ? `<h3>المطلوب</h3><ol>${ex.requirements.map((r) => `<li>${inline(r)}</li>`).join('')}</ol>` : ''}
        </div>
        <div class="exercise-host"></div>
        <div class="editor-toolbar" style="margin-top:14px">
            ${ex.hints?.length ? '<button type="button" class="cw-btn sm hint-btn"><i class="fas fa-lightbulb"></i> تلميح</button>' : ''}
            <button type="button" class="cw-btn sm solution-btn"><i class="fas fa-key"></i> عرض الحل النموذجي</button>
        </div>
        <ul class="hint-list"></ul>
        <div class="solution-wrap"></div>
    </section>`;
}

/* ------------------------------------------------------------------ Navigation */
function neighbours(course, slug) {
    const all = courseLessons(course);
    const idx = all.findIndex((l) => l.slug === slug);
    const current = all[idx];
    const prevLesson = all.slice(0, idx).reverse().find(isPublished);

    let next = null;
    const lastInModule = current.indexInModule === current.module.lessons.length - 1;
    if (lastInModule && isPublished(current.module.quiz)) {
        next = { href: quizPage(current.module.quiz.slug), title: current.module.quiz.title };
    } else {
        const n = all.slice(idx + 1).find(isPublished);
        if (n) next = { href: lessonPage(course.slug, n.slug), title: n.title };
    }
    const prev = prevLesson
        ? { href: lessonPage(course.slug, prevLesson.slug), title: prevLesson.title }
        : { href: coursePage(course.slug), title: 'صفحة الكورس' };
    return { prev, next, current, index: idx, all };
}

/* ------------------------------------------------------------------ Page */
async function render(catalog) {
    const course = getCourse(catalog, COURSE_SLUG);
    if (!course) throw new Error(`الكورس ${COURSE_SLUG} غير موجود في المنهج`);
    const lesson = await loadLesson(COURSE_SLUG, LESSON_SLUG);
    const nav = neighbours(course, LESSON_SLUG);
    const moduleNo = nav.current.moduleIndex + 1;

    document.title = `${lesson.title} | ${course.title} | CodeWay`;
    progress.setLast(course.slug, lesson.slug);

    const sidebar = $('#lesson-sidebar');
    const refreshSidebar = () => { sidebar.innerHTML = renderSidebar(course, lesson.slug); };
    refreshSidebar();

    const main = $('#lesson-main');
    const state = lessonStates(course)[lesson.slug];
    const current = courseLessons(course).find((l) => lessonStates(course)[l.slug] === 'current');

    const head = `
        <button type="button" class="cw-btn sm sidebar-toggle"><i class="fas fa-list"></i> محتوى الكورس</button>
        <nav class="breadcrumb" aria-label="مسار التنقل">
            <a href="${homePage()}">علم البيانات</a><i class="fas fa-chevron-left sep"></i>
            <a href="${roadmapPage('level-' + course.level)}">المستوى ${course.level}</a><i class="fas fa-chevron-left sep"></i>
            <a href="${coursePage(course.slug)}">${escapeHtml(course.title)}</a><i class="fas fa-chevron-left sep"></i>
            <span>الوحدة ${moduleNo}</span>
        </nav>
        <header class="lesson-head">
            <div class="kicker">الوحدة ${moduleNo}: ${escapeHtml(nav.current.module.title)} · الدرس ${nav.current.indexInModule + 1} من ${nav.current.module.lessons.length}</div>
            <h1 class="gradient-text">${escapeHtml(lesson.title)}</h1>
            <div class="en">${escapeHtml(lesson.title_en || '')}</div>
            <div class="lesson-meta">
                <span class="lang-tag"><i class="far fa-clock"></i> ${minutesLabel(lesson.minutes)}</span>
                <span class="lang-tag gold">${escapeHtml(lesson.level || course.difficulty)}</span>
                <span class="lang-tag magenta"><i class="fas fa-dumbbell"></i> تمرين + سؤال فهم</span>
                ${state === 'completed' ? '<span class="lang-tag ok"><i class="fas fa-check"></i> مكتمل</span>' : ''}
            </div>
            <div class="glass-card objectives">
                <h2><i class="fas fa-bullseye" style="color:var(--cw-cyan)"></i> بعد هذا الدرس ستكون قادراً على</h2>
                <ul class="check-list info-card" style="padding:0;border:none;background:none;backdrop-filter:none">${lesson.objectives.map((o) => `<li>${inline(o)}</li>`).join('')}</ul>
            </div>
        </header>`;

    const gate = state === 'locked' && current ? `
        <div class="glass-card lock-gate" id="lock-gate">
            <div class="lock-ic"><i class="fas fa-lock"></i></div>
            <h2>هذا الدرس مقفل حالياً</h2>
            <p>الدروس مبنية على بعضها. درسك الحالي هو «${escapeHtml(current.title)}». أكمله أولاً ليُفتح هذا الدرس.</p>
            <div class="actions">
                <a class="cw-btn sm primary" href="${lessonPage(course.slug, current.slug)}"><i class="fas fa-play"></i> اذهب إلى درسك الحالي</a>
                <button type="button" class="cw-btn sm" id="peek-btn"><i class="fas fa-eye"></i> اعرض الدرس على أي حال</button>
            </div>
        </div>` : '';

    const sections = lesson.sections.map((s, i) => renderSection(s, i)).join('');

    const body = `
        <div id="lesson-body" ${gate ? 'hidden' : ''}>
            ${sections}
            ${renderExercise(lesson.exercise)}
            <section class="l-section" id="check">
                ${sectionHead({ icon: 'fas fa-circle-question' }, 'سؤال سريع للتأكد من الفهم')}
                <div class="check-host"></div>
            </section>
            <section class="l-section">
                ${sectionHead({ icon: 'fas fa-list-check' }, 'الخلاصة')}
                <ul class="check-list prose" style="padding:0">${lesson.summary.map((s) => `<li>${inline(s)}</li>`).join('')}</ul>
            </section>
            <section class="l-section complete-bar" id="complete-bar"></section>
        </div>
        <nav class="lesson-nav" aria-label="التنقل بين الدروس">
            <a href="${nav.prev.href}"><span class="dir"><i class="fas fa-arrow-right"></i> السابق</span>${escapeHtml(nav.prev.title)}</a>
            ${nav.next
                ? `<a class="next" href="${nav.next.href}"><span class="dir">التالي <i class="fas fa-arrow-left"></i></span>${escapeHtml(nav.next.title)}</a>`
                : `<a class="next" href="${coursePage(course.slug)}"><span class="dir">انتهت الدروس المتاحة <i class="fas fa-arrow-left"></i></span>العودة إلى صفحة الكورس</a>`}
        </nav>`;

    main.innerHTML = head + gate + body;
    bindCopy(main);

    $('#peek-btn')?.addEventListener('click', () => {
        $('#lock-gate').remove();
        $('#lesson-body').hidden = false;
    });

    // جرّب المثال
    main.querySelectorAll('.try-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const i = Number(btn.dataset.example);
            const sec = lesson.sections[i];
            const host = main.querySelector(`.try-host[data-example="${i}"]`);
            createPlayground(host, {
                code: joinLines(sec.code),
                stdin: sec.stdin != null ? joinLines(sec.stdin) : null,
                files: lesson.files || [],
                storageKey: `${lesson.slug}:example-${i}`,
                title: 'عدّل على المثال',
            }).run();
            btn.parentElement.remove();
        });
    });

    // التمرين
    const ex = lesson.exercise;
    const exSection = $('#exercise');
    createPlayground(exSection.querySelector('.exercise-host'), {
        code: joinLines(ex.starter_code),
        tests: joinLines(ex.tests),
        stdin: ex.stdin != null ? joinLines(ex.stdin) : null,
        files: lesson.files || [],
        storageKey: `${lesson.slug}:exercise`,
        title: 'حلّ التمرين هنا',
        onResult: (result, withTests) => {
            if (withTests && result.tests) {
                progress.saveExercise(lesson.slug, result.tests.passed);
                if (result.tests.passed) renderComplete();
            }
        },
    });
    let hintIdx = 0;
    exSection.querySelector('.hint-btn')?.addEventListener('click', (e) => {
        const hints = ex.hints;
        if (hintIdx < hints.length) {
            exSection.querySelector('.hint-list').insertAdjacentHTML('beforeend',
                `<li><strong>تلميح ${hintIdx + 1}:</strong>${inline(hints[hintIdx])}</li>`);
            hintIdx += 1;
        }
        if (hintIdx >= hints.length) e.currentTarget.disabled = true;
    });
    exSection.querySelector('.solution-btn').addEventListener('click', (e) => {
        const wrap = exSection.querySelector('.solution-wrap');
        wrap.innerHTML = codeBlock(ex.solution, { label: 'الحل النموذجي', variant: 'right' })
            + (ex.solution_explanation ? `<div class="prose">${renderBlocks(ex.solution_explanation)}</div>` : '');
        bindCopy(wrap);
        e.currentTarget.hidden = true;
    });

    // سؤال الفهم
    renderQuestion(main.querySelector('.check-host'), { id: 'check', ...lesson.check }, {
        onAnswer: () => renderComplete(),
    });

    // زر الإكمال
    function renderComplete() {
        const bar = $('#complete-bar');
        const done = progress.isCompleted(lesson.slug);
        const exDone = progress.getExercise(lesson.slug)?.passed;
        const nextBtn = nav.next
            ? `<a class="cw-btn sm primary" href="${nav.next.href}"><i class="fas fa-arrow-left"></i> ${escapeHtml(nav.next.title)}</a>`
            : `<a class="cw-btn sm primary" href="${coursePage(course.slug)}"><i class="fas fa-flag-checkered"></i> صفحة الكورس</a>`;
        bar.innerHTML = done
            ? `<p><strong style="color:var(--cw-ok)"><i class="fas fa-circle-check"></i> أكملت هذا الدرس.</strong> تقدّمك محفوظ.</p>
               <div class="hero-actions">${nextBtn}<button type="button" class="cw-btn sm" id="undo-btn"><i class="fas fa-rotate-left"></i> تعليم كغير مكتمل</button></div>`
            : `<p>${exDone ? 'حللت التمرين بنجاح. ' : 'ننصحك بحل التمرين قبل المتابعة. '}عندما تنتهي من الدرس علّمه كمكتمل ليُفتح الدرس التالي.</p>
               <button type="button" class="cw-btn primary" id="complete-btn"><i class="fas fa-check"></i> أكملت الدرس</button>`;
        $('#complete-btn')?.addEventListener('click', () => {
            progress.markComplete(lesson.slug);
            refreshSidebar();
            renderComplete();
        });
        $('#undo-btn')?.addEventListener('click', () => {
            progress.markIncomplete(lesson.slug);
            refreshSidebar();
            renderComplete();
        });
    }
    renderComplete();

    // Sidebar على الجوال
    const toggle = main.querySelector('.sidebar-toggle');
    toggle.addEventListener('click', () => document.body.classList.add('sidebar-open'));
    document.querySelector('.sidebar-backdrop')?.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
}

boot('courses', render);
