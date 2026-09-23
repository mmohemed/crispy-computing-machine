/**
 * صفحة اختبار الوحدة: أسئلة متنوعة، تصحيح فوري مع الشرح، ونتيجة نهائية تُحفظ في التقدم.
 */
import { boot } from './boot.js';
import { courseLessons, getCourse, isPublished, loadQuiz } from '../core/catalog.js';
import { $, escapeHtml, inline } from '../core/dom.js';
import { CONFIG } from '../core/config.js';
import { coursePage, homePage, lessonPage, roadmapPage } from '../core/paths.js';
import { progress } from '../core/progress-store.js';
import { renderQuestion } from '../components/quiz.js';

const QUIZ_SLUG = document.body.dataset.quiz;

async function render(catalog) {
    const quiz = await loadQuiz(QUIZ_SLUG);
    const course = getCourse(catalog, quiz.course);
    const modIndex = course.modules.findIndex((m) => m.quiz && m.quiz.slug === QUIZ_SLUG);
    const mod = modIndex >= 0 ? course.modules[modIndex] : null;
    const scopeLabel = mod ? `اختبار الوحدة ${modIndex + 1}` : 'الاختبار النهائي';
    const total = quiz.questions.length;
    const passScore = Math.ceil(total * CONFIG.quiz.passRatio);
    const prev = progress.getQuiz(QUIZ_SLUG);

    // الدرس التالي بعد الوحدة
    const all = courseLessons(course);
    const nextLesson = mod ? all.find((l) => l.moduleIndex > modIndex && isPublished(l)) : null;

    document.title = `${quiz.title} | ${course.title} | CodeWay`;

    const main = $('#quiz-main');
    main.innerHTML = `
        <nav class="breadcrumb" aria-label="مسار التنقل">
            <a href="${homePage()}">علم البيانات</a><i class="fas fa-chevron-left sep"></i>
            <a href="${roadmapPage('level-' + course.level)}">المستوى ${course.level}</a><i class="fas fa-chevron-left sep"></i>
            <a href="${coursePage(course.slug)}">${escapeHtml(course.title)}</a><i class="fas fa-chevron-left sep"></i>
            <span>${scopeLabel}</span>
        </nav>
        <header class="lesson-head">
            <div class="kicker">${mod ? `الوحدة ${modIndex + 1}: ${escapeHtml(mod.title)}` : `${escapeHtml(course.title)}: كل الوحدات`}</div>
            <h1 class="gradient-text">${escapeHtml(quiz.title)}</h1>
            <div class="prose">${quiz.intro.map((t) => `<p>${inline(t)}</p>`).join('')}</div>
            <div class="lesson-meta">
                <span class="lang-tag">${total} سؤالاً</span>
                <span class="lang-tag gold">النجاح: ${passScore} إجابات صحيحة على الأقل</span>
                <span class="lang-tag magenta">اختيار · صح/خطأ · ناتج كود · كتابة كود · تصحيح كود</span>
                ${prev ? `<span class="lang-tag ${prev.passed ? 'ok' : 'muted'}">أفضل نتيجة سابقة: ${prev.best}/${prev.total}</span>` : ''}
            </div>
        </header>
        <div class="quiz-progress">
            <div class="progress"><div class="progress-track"><div class="progress-fill" id="qp-fill"></div></div>
            <span class="progress-label" id="qp-label">0/${total}</span></div>
        </div>
        <div id="questions"></div>
        <div id="quiz-result"></div>`;

    const answers = new Map();
    const wrap = $('#questions');
    quiz.questions.forEach((q, i) => {
        const card = document.createElement('article');
        wrap.appendChild(card);
        renderQuestion(card, q, {
            index: i,
            total,
            storagePrefix: `quiz:${QUIZ_SLUG}`,
            onAnswer: (correct) => {
                answers.set(q.id, correct);
                update();
            },
        });
    });

    function update() {
        const answered = answers.size;
        $('#qp-fill').style.width = `${Math.round((answered / total) * 100)}%`;
        $('#qp-label').textContent = `${answered}/${total}`;
        if (answered < total) return;

        const score = [...answers.values()].filter(Boolean).length;
        const passed = score >= passScore;
        progress.saveQuizAttempt(QUIZ_SLUG, { score, total, passed });
        const wrongLessons = quiz.questions
            .filter((q) => answers.get(q.id) === false && q.lesson)
            .map((q) => q.lesson);
        const review = [...new Set(wrongLessons)]
            .map((slug) => all.find((l) => l.slug === slug))
            .filter(Boolean);

        $('#quiz-result').innerHTML = `
            <section class="glass-card quiz-summary">
                <div class="score gradient-text">${score}/${total}</div>
                <p>${passed
                    ? (mod ? 'أحسنت! اجتزت اختبار الوحدة. أنت جاهز للانتقال إلى الوحدة التالية.' : 'أحسنت! اجتزت الاختبار النهائي للكورس. أنت جاهز للكورس التالي في المسار.')
                    : `تحتاج ${passScore} إجابات صحيحة على الأقل. راجع الدروس المقترحة ثم أعد المحاولة، فالهدف هو الفهم وليس الدرجة.`}</p>
                ${review.length ? `<p style="font-size:1rem">دروس ننصحك بمراجعتها: ${review.map((l) => `<a href="${lessonPage(course.slug, l.slug)}">${escapeHtml(l.title)}</a>`).join(' · ')}</p>` : ''}
                <div class="hero-actions" style="justify-content:center">
                    <button type="button" class="cw-btn" onclick="location.reload()"><i class="fas fa-rotate-right"></i> أعد الاختبار</button>
                    ${nextLesson
                        ? `<a class="cw-btn primary" href="${lessonPage(course.slug, nextLesson.slug)}"><i class="fas fa-arrow-left"></i> الوحدة التالية</a>`
                        : `<a class="cw-btn primary" href="${coursePage(course.slug)}"><i class="fas fa-graduation-cap"></i> صفحة الكورس</a>`}
                </div>
            </section>`;
        $('#quiz-result').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

boot('courses', render);
