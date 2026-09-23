/**
 * صفحة الكورس: مقدمة، أهداف، متطلبات، مهارات، محتوى الوحدات والدروس، التمارين، المشاريع.
 */
import { boot } from './boot.js';
import { courseCounts, getCourse, isPublished, loadCourseDetails } from '../core/catalog.js';
import { $, escapeHtml, inline, minutesLabel } from '../core/dom.js';
import { homePage, lessonPage, quizPage, roadmapPage } from '../core/paths.js';
import { STATUS_ICON, courseProgress, currentLesson, lessonStates, moduleProgress, progress, progressBar } from '../core/progress-store.js';

const COURSE_SLUG = document.body.dataset.course;

function syllabus(course) {
    const states = lessonStates(course);
    return course.modules.map((mod, mi) => {
        const mp = moduleProgress(mod);
        const minutes = mod.lessons.reduce((s, l) => s + (l.minutes || 0), 0);
        const lessons = mod.lessons.map((l, li) => {
            const st = states[l.slug];
            const inner = `${STATUS_ICON[st]}<span class="l-title">${li + 1}. ${escapeHtml(l.title)}${l.title_en ? `<small>${escapeHtml(l.title_en)}</small>` : ''}</span><span class="l-min">${l.minutes} د</span>`;
            return st === 'planned'
                ? `<li class="is-planned"><span>${inner}</span></li>`
                : `<li><a href="${lessonPage(course.slug, l.slug)}">${inner}</a></li>`;
        }).join('');
        let quiz = '';
        if (mod.quiz) {
            const qp = progress.getQuiz(mod.quiz.slug);
            const inner = `${qp?.passed ? STATUS_ICON.quizPassed : STATUS_ICON.quiz}<span class="l-title">${escapeHtml(mod.quiz.title)}${qp ? `<small>أفضل نتيجة ${qp.best}/${qp.total}</small>` : ''}</span><span class="l-min">اختبار</span>`;
            quiz = isPublished(mod.quiz)
                ? `<li class="is-quiz"><a href="${quizPage(mod.quiz.slug)}">${inner}</a></li>`
                : `<li class="is-quiz is-planned"><span>${inner}</span></li>`;
        }
        const openAttr = mp.total > 0 && mp.done < mp.total ? 'open' : '';
        return `<details class="syllabus-module" ${openAttr}>
            <summary>
                <span class="m-no">الوحدة ${mi + 1}</span>
                <span>${escapeHtml(mod.title)}</span>
                <span class="m-meta">${mod.lessons.length} دروس · ${minutesLabel(minutes)}</span>
                <i class="fas fa-chevron-down c-chevron"></i>
            </summary>
            ${mp.total ? `<div class="m-progress">${progressBar(mp)}</div>` : ''}
            ${mod.description ? `<p style="padding:0 22px;color:var(--cw-muted)">${inline(mod.description)}</p>` : ''}
            <ol class="syllabus-lessons" style="list-style:none">${lessons}${quiz}</ol>
        </details>`;
    }).join('');
}

async function render(catalog) {
    const course = getCourse(catalog, COURSE_SLUG);
    if (!course) throw new Error(`الكورس ${COURSE_SLUG} غير موجود`);
    const d = await loadCourseDetails(COURSE_SLUG);
    const counts = courseCounts(course);
    const p = courseProgress(course);
    const cur = currentLesson(course);
    const level = catalog.levels.find((l) => l.number === course.level);
    const prereqs = (course.prerequisites || []).map((slug) => catalog.courses.find((c) => c.slug === slug)).filter(Boolean);
    const nextCourses = (d.next_courses || []).map((slug) => catalog.courses.find((c) => c.slug === slug)).filter(Boolean);

    document.title = `${course.title} | CodeWay علم البيانات`;

    const cta = cur
        ? `<a class="cw-btn primary" href="${lessonPage(course.slug, cur.slug)}"><i class="fas fa-play"></i> ${p.done ? 'تابع التعلم' : 'ابدأ الكورس'}: ${escapeHtml(cur.title)}</a>`
        : `<a class="cw-btn primary" href="#syllabus"><i class="fas fa-trophy"></i> أكملت كل الدروس المتاحة</a>`;

    $('#course-main').innerHTML = `
        <nav class="breadcrumb" aria-label="مسار التنقل">
            <a href="${homePage()}">علم البيانات</a><i class="fas fa-chevron-left sep"></i>
            <a href="${roadmapPage('level-' + course.level)}">المستوى ${course.level}: ${escapeHtml(level?.title || '')}</a><i class="fas fa-chevron-left sep"></i>
            <span>${escapeHtml(course.title)}</span>
        </nav>

        <section class="course-hero">
            <div class="hero-section" style="grid-template-columns:1fr;margin:0;padding:44px">
                <div class="hero-content">
                    <span class="lang-tag gold">${escapeHtml(course.code)} · المستوى ${course.level}</span>
                    <h1 style="margin-top:14px">${escapeHtml(course.title)}</h1>
                    <div class="en-title">${escapeHtml(course.title_en)}</div>
                    <p class="lead">${inline(d.intro)}</p>
                    <div class="hero-actions">${cta}<a class="cw-btn" href="#syllabus"><i class="fas fa-list-ol"></i> محتوى الكورس</a></div>
                </div>
            </div>
            <aside class="glass-card">
                <div class="fact-grid">
                    <div class="fact"><div class="k"><i class="fas fa-signal"></i>المستوى</div><div class="v">${escapeHtml(course.difficulty)}</div></div>
                    <div class="fact"><div class="k"><i class="far fa-clock"></i>المدة التقريبية</div><div class="v">${course.hours} ساعة</div></div>
                    <div class="fact"><div class="k"><i class="fas fa-cubes"></i>الوحدات</div><div class="v">${counts.modules}</div></div>
                    <div class="fact"><div class="k"><i class="fas fa-book-open"></i>الدروس</div><div class="v">${counts.lessons}</div></div>
                    <div class="fact"><div class="k"><i class="fas fa-dumbbell"></i>التمارين</div><div class="v">${escapeHtml(d.exercises_label)}</div></div>
                    <div class="fact"><div class="k"><i class="fas fa-clipboard-check"></i>الاختبارات</div><div class="v">${counts.quizzes}</div></div>
                </div>
                <div class="k" style="color:var(--cw-muted);margin-bottom:8px">تقدّمك (${p.done} من ${p.total} درساً متاحاً)</div>
                ${progressBar(p)}
            </aside>
        </section>

        <div class="course-grid">
            <section class="glass-card">
                <h2><i class="fas fa-circle-info"></i> عن الكورس</h2>
                <div class="prose">${d.description.map((t) => `<p>${inline(t)}</p>`).join('')}</div>
            </section>
            <section class="glass-card">
                <h2><i class="fas fa-bullseye"></i> أهداف التعلم</h2>
                <ul class="check-list prose">${d.objectives.map((o) => `<li>${inline(o)}</li>`).join('')}</ul>
            </section>
            <section class="glass-card">
                <h2><i class="fas fa-list-check"></i> المتطلبات السابقة</h2>
                <ul class="check-list prose">
                    ${d.prerequisites.map((t) => `<li>${inline(t)}</li>`).join('')}
                    ${prereqs.map((c) => `<li>يُفضّل إنهاء <a href="${roadmapPage('course-' + c.slug)}">${escapeHtml(c.title)}</a> قبله.</li>`).join('')}
                </ul>
            </section>
            <section class="glass-card">
                <h2><i class="fas fa-user-graduate"></i> لمن هذا الكورس؟</h2>
                <ul class="check-list prose">${d.audience.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>
            </section>
        </div>

        <section class="glass-card course-section">
            <h2><i class="fas fa-screwdriver-wrench"></i> المهارات التي ستكتسبها</h2>
            <div class="tag-cloud">${d.skills.map((s) => `<span class="lang-tag">${escapeHtml(s)}</span>`).join('')}</div>
        </section>

        <section class="course-section" id="syllabus">
            <h2 class="section-title">محتوى الكورس</h2>
            <div class="legend">
                <span>${STATUS_ICON.completed} مكتمل</span>
                <span>${STATUS_ICON.current} الدرس الحالي</span>
                <span>${STATUS_ICON.locked} مقفل حتى تُكمل ما قبله</span>
                <span>${STATUS_ICON.planned} ضمن المنهج، يُفتح عند نشره</span>
            </div>
            ${syllabus(course)}
            ${course.final_exam ? `<div class="syllabus-module"><ol class="syllabus-lessons" style="list-style:none;padding-top:12px">
                <li class="is-quiz ${isPublished(course.final_exam) ? '' : 'is-planned'}">${isPublished(course.final_exam)
                    ? `<a href="${quizPage(course.final_exam.slug)}">${STATUS_ICON.quiz}<span class="l-title">${escapeHtml(course.final_exam.title)}</span><span class="l-min">اختبار نهائي</span></a>`
                    : `<span>${STATUS_ICON.planned}<span class="l-title">${escapeHtml(course.final_exam.title)}</span><span class="l-min">اختبار نهائي</span></span>`}</li>
            </ol></div>` : ''}
        </section>

        <div class="course-grid">
            <section class="glass-card">
                <h2><i class="fas fa-dumbbell"></i> التمارين والاختبارات</h2>
                <ul class="check-list prose">${d.assessment.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>
            </section>
            <section class="glass-card">
                <h2><i class="fas fa-project-diagram"></i> مشاريع الكورس</h2>
                ${d.projects.map((pr) => `<div style="margin-bottom:14px"><h3 style="color:var(--cw-text);font-size:1.15rem">${escapeHtml(pr.title)}</h3><p>${inline(pr.summary)}</p></div>`).join('')}
            </section>
        </div>

        ${nextCourses.length ? `<section class="glass-card course-section">
            <h2><i class="fas fa-forward"></i> بعد هذا الكورس</h2>
            <p>${inline(d.after)}</p>
            <div class="tag-cloud">${nextCourses.map((c) => `<a class="lang-tag" href="${roadmapPage('course-' + c.slug)}">${escapeHtml(c.title)} ←</a>`).join('')}</div>
        </section>` : ''}`;
}

boot('courses', render);

