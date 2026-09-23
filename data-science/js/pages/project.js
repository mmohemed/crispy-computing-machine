/**
 * صفحة المشروع: الفكرة، المشكلة، الـ Dataset، المطلوب، دورة حياة المشروع خطوة بخطوة،
 * نقاط تحقق تُصحّح تلقائياً، مساحة عمل، المخرجات، معايير التقييم، والحل النموذجي.
 */
import { boot } from './boot.js';
import { loadProject } from '../core/catalog.js';
import { $, escapeHtml, inline, joinLines } from '../core/dom.js';
import { coursePage, homePage, url } from '../core/paths.js';
import { progress, progressBar } from '../core/progress-store.js';
import { renderBlocks } from '../components/blocks.js';
import { bindCopy, codeBlock } from '../components/quiz.js';
import { createPlayground } from '../components/code-editor.js';

const PROJECT_SLUG = document.body.dataset.project;
const DIFF_CLASS = { 'مبتدئ': '', 'متوسط': '', 'متقدم': 'advanced', 'ختامي': 'capstone' };

function stageStatus(p) {
    const done = p.lifecycle.filter((s) => progress.getProject(p.slug).steps[s.key]).length;
    return { done, total: p.lifecycle.length, percent: Math.round((done / p.lifecycle.length) * 100) };
}

async function render(catalog) {
    const p = await loadProject(PROJECT_SLUG);
    const meta = catalog.projects.find((x) => x.slug === PROJECT_SLUG) || {};
    const prelude = joinLines(p.solution_prelude);
    document.title = `${p.title} | مشاريع CodeWay`;

    const main = $('#project-main');
    main.innerHTML = `
        <nav class="breadcrumb" aria-label="مسار التنقل">
            <a href="${homePage()}">علم البيانات</a><i class="fas fa-chevron-left sep"></i>
            <a href="${homePage('explore')}" data-tab-link="projects">المشاريع</a><i class="fas fa-chevron-left sep"></i>
            <span>${escapeHtml(p.title)}</span>
        </nav>

        <section class="course-hero">
            <div class="hero-section" style="grid-template-columns:1fr;margin:0;padding:44px">
                <div class="hero-content">
                    <span class="project-level ${DIFF_CLASS[p.difficulty] || ''}">المشروع ${p.number} · ${escapeHtml(p.difficulty)}</span>
                    <h1 style="margin-top:14px">${escapeHtml(p.title)}</h1>
                    <div class="en-title">${escapeHtml(p.title_en)}</div>
                    <p class="lead">${inline(p.idea)}</p>
                    <div class="tag-cloud">${p.tools.map((t) => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}</div>
                </div>
            </div>
            <aside class="glass-card">
                <div class="fact-grid">
                    <div class="fact"><div class="k"><i class="fas fa-signal"></i>الصعوبة</div><div class="v">${escapeHtml(p.difficulty)}</div></div>
                    <div class="fact"><div class="k"><i class="far fa-clock"></i>المدة التقريبية</div><div class="v">${p.hours} ساعات</div></div>
                    <div class="fact"><div class="k"><i class="fas fa-database"></i>الصفوف</div><div class="v">${p.dataset.rows.toLocaleString('en-US')}</div></div>
                    <div class="fact"><div class="k"><i class="fas fa-flag"></i>ابدأه بعد</div><div class="v">${escapeHtml(meta.after || p.after)}</div></div>
                </div>
                <div class="k" style="color:var(--cw-muted);margin-bottom:8px">مراحل أنجزتها</div>
                <div id="project-progress"></div>
                <div class="hero-actions" style="margin-top:16px">
                    <a class="cw-btn sm primary" href="#workspace"><i class="fas fa-code"></i> مساحة العمل</a>
                    <a class="cw-btn sm" href="${url(p.dataset.file)}" download><i class="fas fa-download"></i> تحميل البيانات</a>
                </div>
            </aside>
        </section>

        <div class="course-grid">
            <section class="glass-card">
                <h2><i class="fas fa-triangle-exclamation"></i> المشكلة</h2>
                <div class="prose">${renderBlocks(p.problem)}</div>
            </section>
            <section class="glass-card">
                <h2><i class="fas fa-circle-question"></i> أسئلة العمل التي يجب أن تجيب عنها</h2>
                <ol class="prose" style="padding-right:22px">${p.questions.map((q) => `<li>${inline(q)}</li>`).join('')}</ol>
            </section>
        </div>

        <section class="glass-card course-section">
            <h2><i class="fas fa-database"></i> البيانات Dataset</h2>
            <div class="prose">${renderBlocks(p.dataset.description)}</div>
            <div class="table-wrap prose"><table>
                <thead><tr><th>العمود</th><th>النوع</th><th>الوصف</th></tr></thead>
                <tbody>${p.dataset.columns.map((c) => `<tr><td><code>${escapeHtml(c.name)}</code></td><td>${escapeHtml(c.type)}</td><td>${inline(c.description)}</td></tr>`).join('')}</tbody>
            </table></div>
            <p style="color:var(--cw-muted);font-size:.95rem"><i class="fas fa-scale-balanced" style="color:var(--cw-gold)"></i> المصدر والترخيص: ${inline(p.dataset.source)}</p>
        </section>

        <div class="course-grid">
            <section class="glass-card">
                <h2><i class="fas fa-list-check"></i> المطلوب</h2>
                <ul class="check-list prose">${p.requirements.map((r) => `<li>${inline(r)}</li>`).join('')}</ul>
            </section>
            <section class="glass-card">
                <h2><i class="fas fa-screwdriver-wrench"></i> المهارات المطلوبة</h2>
                <ul class="check-list prose">${p.skills.map((s) => `<li>${inline(s)}</li>`).join('')}</ul>
                ${p.prerequisite_note ? `<p class="prose" style="margin-top:10px">${inline(p.prerequisite_note)}</p>` : ''}
            </section>
        </div>

        <section class="course-section">
            <h2 class="section-title">خطوات الحل: دورة حياة المشروع</h2>
            <p class="section-lead">كل مرحلة فيها هدف ومهام. نفّذها في مساحة العمل، ثم علّمها كمنجزة. الحل النموذجي لكل مرحلة مخفي حتى تحاول بنفسك.</p>
            ${p.solution_prelude ? `<details class="syllabus-module"><summary><span class="m-no">الكود المشترك</span><span>تحميل البيانات والأعمدة الأساسية (يسبق كل خطوة في الحل)</span><i class="fas fa-chevron-down c-chevron"></i></summary><div style="padding:0 18px 12px">${codeBlock(p.solution_prelude, { label: 'prelude.py' })}</div></details>` : ''}
            <div id="lifecycle"></div>
        </section>

        <section class="course-section" id="checkpoints">
            <h2 class="section-title">نقاط تحقق تُصحّح تلقائياً</h2>
            <p class="section-lead">أرقام أساسية يجب أن يصل إليها تحليلك. إذا اجتزتها فأساس تحليلك صحيح.</p>
            <div id="checkpoint-list"></div>
        </section>

        <section class="l-section exercise" id="workspace">
            <h2><span class="sec-ic"><i class="fas fa-laptop-code"></i></span>مساحة العمل</h2>
            <div class="prose"><p>الملف <code>${escapeHtml(p.dataset.file.split('/').pop())}</code> متاح هنا. كودك يُحفظ في متصفحك تلقائياً. للمشروع الكامل ننصح بالعمل على جهازك في Jupyter أو VS Code، وتحميل البيانات من الزر أعلى الصفحة.</p></div>
            <div class="workspace-host"></div>
        </section>

        <div class="course-grid">
            <section class="glass-card">
                <h2><i class="fas fa-box-open"></i> المخرجات المطلوبة</h2>
                <ul class="check-list prose">${p.deliverables.map((d) => `<li>${inline(d)}</li>`).join('')}</ul>
            </section>
            <section class="glass-card">
                <h2><i class="fas fa-lightbulb"></i> إرشادات قبل البدء</h2>
                <ul class="check-list prose">${p.guidance.map((g) => `<li>${inline(g)}</li>`).join('')}</ul>
            </section>
        </div>

        <section class="glass-card course-section">
            <h2><i class="fas fa-clipboard-check"></i> معايير تقييم المشروع</h2>
            <div class="table-wrap prose"><table>
                <thead><tr><th>المعيار</th><th>الوزن</th><th>ممتاز</th><th>مقبول</th><th>يحتاج تحسين</th></tr></thead>
                <tbody>${p.rubric.map((r) => `<tr><td><strong>${escapeHtml(r.criterion)}</strong></td><td>${r.weight}%</td><td>${inline(r.excellent)}</td><td>${inline(r.acceptable)}</td><td>${inline(r.needs_work)}</td></tr>`).join('')}</tbody>
            </table></div>
        </section>

        <section class="l-section complete-bar" id="project-complete"></section>`;

    // دورة الحياة
    const lifecycle = $('#lifecycle');
    const renderLifecycle = () => {
        const state = progress.getProject(p.slug);
        lifecycle.innerHTML = p.lifecycle.map((s, i) => {
            const done = Boolean(state.steps[s.key]);
            return `<details class="syllabus-module" ${i === 0 ? 'open' : ''} id="stage-${s.key}">
                <summary>
                    <span class="status-icon ${done ? 'completed' : ''}">${done ? '<i class="fas fa-check"></i>' : i + 1}</span>
                    <span class="m-no">${escapeHtml(s.stage)}</span>
                    <span>${escapeHtml(s.title)}</span>
                    <i class="fas fa-chevron-down c-chevron" style="margin-right:auto"></i>
                </summary>
                <div style="padding:0 22px 20px">
                    <div class="prose">
                        <p><strong>الهدف:</strong> ${inline(s.goal)}</p>
                        <h3>المهام</h3>
                        <ol>${s.tasks.map((t) => `<li>${inline(t)}</li>`).join('')}</ol>
                        ${s.hint ? `<p style="color:var(--cw-gold)"><i class="fas fa-lightbulb"></i> ${inline(s.hint)}</p>` : ''}
                    </div>
                    <div class="editor-toolbar">
                        ${s.solution ? `<button type="button" class="cw-btn sm show-solution" data-key="${s.key}"><i class="fas fa-key"></i> عرض الحل النموذجي لهذه المرحلة</button>` : ''}
                        <button type="button" class="cw-btn sm ${done ? '' : 'primary'} toggle-stage" data-key="${s.key}">
                            <i class="fas ${done ? 'fa-rotate-left' : 'fa-check'}"></i> ${done ? 'تعليم كغير منجزة' : 'أنجزت هذه المرحلة'}
                        </button>
                    </div>
                    <div class="stage-solution" data-key="${s.key}"></div>
                </div>
            </details>`;
        }).join('');
        $('#project-progress').innerHTML = progressBar(stageStatus(p));
        bindLifecycle();
    };

    function bindLifecycle() {
        lifecycle.querySelectorAll('.toggle-stage').forEach((btn) => btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            progress.setProjectStep(p.slug, key, !progress.getProject(p.slug).steps[key]);
            const openKeys = [...lifecycle.querySelectorAll('details[open]')].map((d) => d.id);
            renderLifecycle();
            openKeys.forEach((id) => { const d = document.getElementById(id); if (d) d.open = true; });
            renderComplete();
        }));
        lifecycle.querySelectorAll('.show-solution').forEach((btn) => btn.addEventListener('click', () => {
            const s = p.lifecycle.find((x) => x.key === btn.dataset.key);
            const host = lifecycle.querySelector(`.stage-solution[data-key="${s.key}"]`);
            host.innerHTML = `
                <div class="prose">${renderBlocks(s.solution.explanation)}</div>
                ${codeBlock(s.solution.code, { label: 'الحل النموذجي', variant: 'right' })}
                ${s.solution.expected_output ? `<div class="output-box" dir="ltr"><div class="cb-head"><span>Output</span></div><pre>${escapeHtml(joinLines(s.solution.expected_output))}</pre></div>` : ''}
                <div class="editor-toolbar" style="margin-top:12px"><button type="button" class="cw-btn sm try-stage"><i class="fas fa-play"></i> شغّله في مساحة العمل</button></div>`;
            bindCopy(host);
            host.querySelector('.try-stage').addEventListener('click', () => {
                workspace.setCode(`${prelude}\n\n${joinLines(s.solution.code)}`);
                document.getElementById('workspace').scrollIntoView({ behavior: 'smooth' });
                workspace.run();
            });
            btn.remove();
        }));
    }

    // نقاط التحقق
    const cpList = $('#checkpoint-list');
    p.checkpoints.forEach((cp) => {
        const card = document.createElement('article');
        card.className = 'q-card';
        const passed = progress.getProject(p.slug).checkpoints?.[cp.key];
        card.innerHTML = `
            <div class="q-head"><span class="q-no">${escapeHtml(cp.title)}</span>${passed ? '<span class="lang-tag ok"><i class="fas fa-check"></i> اجتزتها</span>' : ''}</div>
            <div class="q-text prose">${inline(cp.prompt)}</div>
            <div class="cp-host"></div>`;
        cpList.appendChild(card);
        createPlayground(card.querySelector('.cp-host'), {
            code: joinLines(cp.starter_code),
            tests: joinLines(cp.tests),
            files: [p.dataset.file],
            storageKey: `project:${p.slug}:${cp.key}`,
            title: 'نقطة تحقق',
            onResult: (result, withTests) => {
                if (withTests && result.tests?.passed) {
                    progress.setProjectCheckpoint(p.slug, cp.key, true);
                    renderComplete();
                }
            },
        });
    });

    // مساحة العمل
    const workspace = createPlayground(main.querySelector('.workspace-host'), {
        code: joinLines(p.starter_code),
        files: [p.dataset.file],
        storageKey: `project:${p.slug}:workspace`,
        title: 'analysis.py',
    });

    // الإكمال
    function renderComplete() {
        const state = progress.getProject(p.slug);
        const st = stageStatus(p);
        const cps = p.checkpoints.filter((c) => state.checkpoints?.[c.key]).length;
        const ready = st.done === st.total && cps === p.checkpoints.length;
        const bar = $('#project-complete');
        bar.innerHTML = state.completedAt
            ? `<p><strong style="color:var(--cw-ok)"><i class="fas fa-trophy"></i> أكملت هذا المشروع.</strong> أضفه إلى الـ Portfolio الخاص بك على GitHub مع README يشرح النتائج.</p>
               <button type="button" class="cw-btn sm" id="undo-project"><i class="fas fa-rotate-left"></i> تعليم كغير مكتمل</button>`
            : `<p>المراحل المنجزة: ${st.done} من ${st.total} · نقاط التحقق: ${cps} من ${p.checkpoints.length}. ${ready ? 'كل شيء جاهز.' : 'أكمل المراحل ونقاط التحقق ثم علّم المشروع كمكتمل.'}</p>
               <button type="button" class="cw-btn primary" id="complete-project" ${ready ? '' : 'disabled'}><i class="fas fa-flag-checkered"></i> أكملت المشروع</button>`;
        $('#complete-project')?.addEventListener('click', () => { progress.completeProject(p.slug); renderComplete(); });
        $('#undo-project')?.addEventListener('click', () => { progress.completeProject(p.slug, false); renderComplete(); });
    }

    renderLifecycle();
    renderComplete();
    bindCopy(main);

    main.querySelector('[data-tab-link]')?.addEventListener('click', () => {
        try { sessionStorage.setItem('cw.tab', 'projects'); } catch (e) { /* ignore */ }
    });

    if (p.related_course) {
        main.insertAdjacentHTML('beforeend', `<p style="text-align:center;margin-top:20px"><a class="cw-btn sm" href="${coursePage(p.related_course)}"><i class="fas fa-graduation-cap"></i> راجع الكورس المرتبط</a></p>`);
    }
}

boot('explore', render);
