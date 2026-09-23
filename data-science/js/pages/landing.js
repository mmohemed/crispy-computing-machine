/**
 * بوابة مسار علم البيانات: الأرقام، تابع التعلم، مسار التعلم، المستويات، التقنيات، المشاريع.
 */
import { boot } from './boot.js';
import { catalogStats, courseCounts, getCourse, isCoursePublished, publishedLessons } from '../core/catalog.js';
import { $, $all, escapeHtml, inline } from '../core/dom.js';
import { coursePage, lessonPage, roadmapPage } from '../core/paths.js';
import { courseProgress, currentLesson, progress, progressBar } from '../core/progress-store.js';

const DIFF_CLASS = { 'مبتدئ': '', 'متوسط': '', 'متقدم': 'advanced', 'ختامي': 'capstone' };

function renderStats(catalog) {
    const s = catalogStats(catalog);
    $('#hero-stats').innerHTML = [
        [s.levels, 'مستوى تعليمي'],
        [s.courses, 'كورس في المنهج'],
        [s.published, 'درس متاح للدراسة'],
        [s.projects, 'مشروع تطبيقي'],
    ].map(([n, l]) => `<div class="hero-stat"><div class="number">${n}</div><div class="label">${l}</div></div>`).join('');
}

function renderContinue(catalog) {
    const last = progress.getLast();
    const host = $('#continue');
    let course = last ? getCourse(catalog, last.course) : null;
    if (!course) course = catalog.courses.find(isCoursePublished);
    if (!course) return;
    const cur = currentLesson(course);
    const p = courseProgress(course);
    const started = Boolean(last);
    const target = cur ? lessonPage(course.slug, cur.slug) : coursePage(course.slug);
    host.innerHTML = `<div class="glass-card continue-card">
        <div class="ic"><i class="${escapeHtml(course.icon)}"></i></div>
        <div>
            <h3>${started ? 'تابع من حيث توقفت' : 'ابدأ رحلتك من هنا'}: ${escapeHtml(course.title)}</h3>
            <p>${cur ? `الدرس ${started ? 'الحالي' : 'الأول'}: ${escapeHtml(cur.title)}` : 'أكملت كل الدروس المتاحة في هذا الكورس.'}</p>
            ${progressBar(p)}
        </div>
        <a class="cw-btn primary" href="${target}"><i class="fas fa-play"></i> ${started ? 'تابع التعلم' : 'ابدأ الآن'}</a>
    </div>`;
}

function nodeStatus(catalog, node) {
    const courses = node.courses.map((s) => getCourse(catalog, s)).filter(Boolean);
    const published = courses.flatMap((c) => publishedLessons(c));
    if (!published.length) return 'upcoming';
    const done = published.every((l) => progress.isCompleted(l.slug));
    const started = published.some((l) => progress.isCompleted(l.slug));
    const allLessonsPublished = courses.every((c) => courseCounts(c).published === courseCounts(c).lessons);
    if (done && allLessonsPublished) return 'done';
    if (started) return 'progress';
    return 'open';
}

function renderPath(catalog) {
    const nodes = catalog.learning_path;
    const statuses = nodes.map((n) => nodeStatus(catalog, n));
    // "أنت هنا": أول خطوة لم تكتمل ولها محتوى متاح
    let here = statuses.findIndex((s) => s === 'progress');
    if (here === -1) here = statuses.findIndex((s) => s === 'open');

    $('#learning-path').innerHTML = nodes.map((n, i) => {
        const st = statuses[i];
        const first = getCourse(catalog, n.courses[0]);
        const href = first && isCoursePublished(first) ? coursePage(first.slug) : roadmapPage(`course-${n.courses[0]}`);
        const cls = st === 'done' ? 'done' : i === here ? 'here' : '';
        const badge = i === here
            ? '<span class="here-badge"><i class="fas fa-location-dot"></i> أنت هنا</span>'
            : st === 'done'
                ? '<span class="lang-tag ok"><i class="fas fa-check"></i> أكملتها</span>'
                : `<span class="lang-tag muted">المستوى ${n.level}</span>`;
        return `<a class="path-node ${cls}" href="${href}">
            <span class="step-no">STEP ${String(i + 1).padStart(2, '0')}</span>
            <div class="node-head">
                <div class="node-icon"><i class="${escapeHtml(n.icon)}"></i></div>
                <h4>${escapeHtml(n.title)}<small>${escapeHtml(n.title_en)}</small></h4>
            </div>
            <p>${inline(n.summary)}</p>
            ${badge}
            <i class="fas fa-arrow-left arrow" aria-hidden="true"></i>
        </a>`;
    }).join('');
}

function renderLevels(catalog) {
    $('#levels-grid').innerHTML = catalog.levels.map((lv) => {
        const courses = lv.courses.map((s) => getCourse(catalog, s)).filter(Boolean);
        const cards = courses.map((c) => {
            const counts = courseCounts(c);
            const open = isCoursePublished(c);
            const href = open ? coursePage(c.slug) : roadmapPage(`course-${c.slug}`);
            return `<a class="lang-card is-link" href="${href}">
                <div class="lang-icon"><i class="${escapeHtml(c.icon)}"></i></div>
                <h4>${escapeHtml(c.title)}</h4>
                <p>${counts.lessons} درساً · ${c.hours} ساعة تقريباً</p>
                <span class="lang-tag ${open ? 'ok' : 'muted'}">${open ? `${counts.published} درساً متاحاً` : 'اطّلع على المنهج'}</span>
            </a>`;
        }).join('');
        return `<div class="domain-card" id="lv-${lv.number}">
            <div class="domain-header">
                <div class="domain-icon"><i class="${escapeHtml(lv.icon)}"></i></div>
                <div>
                    <span class="lang-tag gold">LEVEL ${lv.number}${lv.elective ? ' · اختياري' : ''}</span>
                    <h3>${escapeHtml(lv.title)}</h3>
                    <p>${inline(lv.summary)}</p>
                </div>
            </div>
            <div class="languages-grid">${cards}</div>
        </div>`;
    }).join('');
}

function renderTech(catalog) {
    $('#tech-grid').innerHTML = catalog.technologies.map((t) => `
        <a class="tool-card" href="${roadmapPage(`level-${t.level}`)}">
            <div class="tool-icon"><i class="${escapeHtml(t.icon)}"></i></div>
            <h3>${escapeHtml(t.name)}</h3>
            <p>${inline(t.role)}</p>
            <span class="lang-tag ${t.core ? '' : 'muted'}">${t.core ? 'أساسي في المسار' : 'اختياري'}</span>
            <div class="tool-where"><i class="fas fa-location-dot" style="color:var(--cw-gold)"></i> ${inline(t.where)}</div>
        </a>`).join('');
}

function renderProjects(catalog) {
    $('#projects-grid').innerHTML = catalog.projects.map((p) => `
        <article class="project-card">
            <div class="project-header">
                <div class="project-icon"><i class="${escapeHtml(p.icon)}"></i></div>
                <span class="project-level ${DIFF_CLASS[p.difficulty] || ''}">${escapeHtml(p.difficulty)}</span>
            </div>
            <h3>${p.number}. ${escapeHtml(p.title)}</h3>
            <p>${inline(p.problem)}</p>
            <div class="project-meta"><i class="fas fa-database"></i>${inline(p.dataset)}</div>
            <div class="project-meta"><i class="fas fa-flag"></i>بعد: ${escapeHtml(p.after)}</div>
            <div class="project-tech">${p.tools.map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}</div>
        </article>`).join('');
}

function bindTabs() {
    const buttons = $all('.filter-btn[data-tab]');
    const show = (tab) => {
        buttons.forEach((b) => {
            const on = b.dataset.tab === tab;
            b.classList.toggle('active', on);
            b.setAttribute('aria-selected', String(on));
        });
        $all('.tab-panel').forEach((p) => { p.hidden = p.id !== `tab-${tab}`; });
    };
    buttons.forEach((b) => b.addEventListener('click', () => show(b.dataset.tab)));
    window.addEventListener('cw:tab', (e) => show(e.detail));
    try {
        const saved = sessionStorage.getItem('cw.tab');
        if (saved) {
            show(saved);
            sessionStorage.removeItem('cw.tab');
        }
    } catch (e) { /* ignore */ }
}

async function render(catalog) {
    renderStats(catalog);
    renderContinue(catalog);
    renderPath(catalog);
    renderLevels(catalog);
    renderTech(catalog);
    renderProjects(catalog);
    bindTabs();
    window.addEventListener('cw:progress', () => { renderContinue(catalog); renderPath(catalog); });
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
}

boot('path', render);
