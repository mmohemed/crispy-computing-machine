/**
 * المنهج الكامل: كل المستويات والكورسات والوحدات والدروس، مع حالة كل درس.
 */
import { boot } from './boot.js';
import { courseCounts, getCourse, isCoursePublished, isPublished } from '../core/catalog.js';
import { $, escapeHtml, inline } from '../core/dom.js';
import { coursePage, lessonPage, quizPage } from '../core/paths.js';
import { STATUS_ICON, courseProgress, lessonStates, progressBar } from '../core/progress-store.js';

function courseRow(course, catalog) {
    const counts = courseCounts(course);
    const open = isCoursePublished(course);
    const states = lessonStates(course);
    const p = courseProgress(course);
    const prereqs = (course.prerequisites || []).map((s) => getCourse(catalog, s)).filter(Boolean);

    const modules = course.modules.map((m, mi) => `
        <div class="module-box">
            <h5>الوحدة ${mi + 1}: ${escapeHtml(m.title)}</h5>
            <ul class="lesson-mini">
                ${m.lessons.map((l) => {
                    const st = states[l.slug];
                    return st === 'planned'
                        ? `<li>${STATUS_ICON.planned}<span>${escapeHtml(l.title)}</span></li>`
                        : `<li>${STATUS_ICON[st]}<a href="${lessonPage(course.slug, l.slug)}">${escapeHtml(l.title)}</a></li>`;
                }).join('')}
                ${m.quiz ? (isPublished(m.quiz)
                    ? `<li>${STATUS_ICON.quiz}<a href="${quizPage(m.quiz.slug)}">${escapeHtml(m.quiz.title)}</a></li>`
                    : `<li>${STATUS_ICON.planned}<span>${escapeHtml(m.quiz.title)}</span></li>`) : ''}
            </ul>
        </div>`).join('');

    return `<details class="course-row" id="course-${course.slug}">
        <summary>
            <div class="c-icon"><i class="${escapeHtml(course.icon)}"></i></div>
            <div>
                <div class="c-title">${escapeHtml(course.code)} · ${escapeHtml(course.title)}<small>${escapeHtml(course.title_en)}</small></div>
                <div class="c-meta">
                    <span><i class="fas fa-signal"></i>${escapeHtml(course.difficulty)}</span>
                    <span><i class="far fa-clock"></i>${course.hours} ساعة</span>
                    <span><i class="fas fa-cubes"></i>${counts.modules} وحدات</span>
                    <span><i class="fas fa-book-open"></i>${counts.lessons} درساً</span>
                    ${open ? `<span class="lang-tag ok">${counts.published} درساً متاحاً للدراسة</span>` : ''}
                </div>
            </div>
            <i class="fas fa-chevron-down c-chevron"></i>
        </summary>
        <div class="c-body">
            <p class="c-summary">${inline(course.summary)}</p>
            ${prereqs.length ? `<p class="c-summary" style="margin-top:-6px"><strong style="color:var(--cw-gold)">يُفضّل قبله:</strong> ${prereqs.map((c) => `<a href="#course-${c.slug}">${escapeHtml(c.title)}</a>`).join('، ')}</p>` : ''}
            ${open ? `<div style="margin-bottom:16px">${progressBar(p)}</div>` : ''}
            <div class="module-list">${modules}</div>
            ${open ? `<div style="margin-top:18px"><a class="cw-btn sm primary" href="${coursePage(course.slug)}"><i class="fas fa-door-open"></i> ادخل الكورس</a></div>` : ''}
        </div>
    </details>`;
}

async function render(catalog) {
    const core = catalog.levels.filter((l) => !l.elective);
    const hours = catalog.courses.reduce((s, c) => s + c.hours, 0);
    const lessons = catalog.courses.reduce((s, c) => s + courseCounts(c).lessons, 0);

    $('#roadmap-summary').innerHTML = `
        <span class="lang-tag">${catalog.levels.length} مستوى</span>
        <span class="lang-tag">${catalog.courses.length} كورس</span>
        <span class="lang-tag">${lessons} درساً في المنهج</span>
        <span class="lang-tag gold">حوالي ${hours} ساعة دراسة</span>
        <span class="lang-tag magenta">المسار الأساسي: المستويات ${core.map((l) => l.number).join('، ')}</span>`;

    $('#roadmap').innerHTML = catalog.levels.map((lv) => `
        <section class="level-block" id="level-${lv.number}">
            <div class="level-dot">${lv.number}</div>
            <div class="level-head">
                <span class="level-no">LEVEL ${lv.number}${lv.elective ? ' · اختياري' : ''}</span>
                <h3>${escapeHtml(lv.title)} <small style="color:var(--cw-muted);font-size:1rem;font-weight:400">${escapeHtml(lv.title_en)}</small></h3>
            </div>
            <p class="level-desc">${inline(lv.description)}</p>
            <p class="level-desc"><strong style="color:var(--cw-cyan)">بعد هذا المستوى:</strong> ${inline(lv.outcome)}</p>
            ${lv.courses.map((s) => getCourse(catalog, s)).filter(Boolean).map((c) => courseRow(c, catalog)).join('')}
        </section>`).join('');

    if (location.hash) {
        const target = document.getElementById(location.hash.slice(1));
        if (target) {
            if (target.tagName === 'DETAILS') target.open = true;
            target.scrollIntoView();
        }
    }
}

boot('roadmap', render);
