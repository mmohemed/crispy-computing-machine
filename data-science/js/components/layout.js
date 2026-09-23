/**
 * الهيكل المشترك لكل الصفحات: الخلفية المتحركة، الهيدر بقوائمه المنسدلة، والفوتر.
 * يُكتب مرة واحدة هنا بدلاً من تكراره في كل ملف HTML.
 */
import { escapeHtml } from '../core/dom.js';
import { coursePage, homePage, roadmapPage, url } from '../core/paths.js';
import { isCoursePublished } from '../core/catalog.js';

const BG = `
<div class="animated-bg" aria-hidden="true">
    <div class="data-particles"></div>
    <div class="graph-lines"></div>
    <div class="floating-charts">
        <div class="chart-shape chart-shape1"></div>
        <div class="chart-shape chart-shape2"></div>
        <div class="chart-shape chart-shape3"></div>
    </div>
</div>`;

function navItem({ key, icon, label, href, active, items }) {
    const dd = items && items.length
        ? `<div class="dropdown" id="dd-${key}">${items.join('')}</div>`
        : '';
    return `<div class="nav-item" data-key="${key}">
        <a href="${href}" class="nav-link${active === key ? ' active' : ''}" ${dd ? `aria-haspopup="true" aria-expanded="false"` : ''}>
            <i class="${icon}"></i> ${label}
        </a>
        ${dd}
    </div>`;
}

function header(catalog, active) {
    const levelLinks = catalog.levels.map((l) =>
        `<a href="${roadmapPage('level-' + l.number)}"><i class="fas fa-layer-group"></i> المستوى ${l.number}: ${escapeHtml(l.title)}</a>`);

    const published = catalog.courses.filter(isCoursePublished);
    const courseLinks = [
        '<span class="dd-label">متاح للدراسة الآن</span>',
        ...published.map((c) => `<a href="${coursePage(c.slug)}"><i class="${escapeHtml(c.icon)}"></i> ${escapeHtml(c.title)}</a>`),
        `<a href="${roadmapPage()}"><i class="fas fa-list"></i> كل كورسات المنهج (${catalog.courses.length})</a>`,
    ];

    const pathLinks = [
        `<a href="${homePage('what')}"><i class="fas fa-circle-question"></i> ما هو علم البيانات؟</a>`,
        `<a href="${homePage('path')}"><i class="fas fa-route"></i> مسار التعلم</a>`,
        `<a href="${homePage('journey')}"><i class="fas fa-stairs"></i> من مبتدئ إلى محترف</a>`,
        `<a href="${homePage('prereqs')}"><i class="fas fa-list-check"></i> المتطلبات السابقة</a>`,
    ];

    const exploreLinks = [
        `<a href="${homePage('explore')}" data-tab="tech"><i class="fas fa-cubes"></i> الأدوات والتقنيات</a>`,
        `<a href="${homePage('explore')}" data-tab="projects"><i class="fas fa-project-diagram"></i> المشاريع</a>`,
        `<a href="${homePage('lifecycle')}"><i class="fas fa-arrows-spin"></i> دورة حياة المشروع</a>`,
    ];

    return `
        <a class="logo" href="${homePage()}" aria-label="CodeWay علم البيانات - الرئيسية">
            <div class="logo-icon"><i class="fas fa-chart-line"></i></div>
            <div class="logo-text">CODEWAY</div>
        </a>
        <div class="header-title">
            <a class="h-title" href="${homePage()}">علم البيانات</a>
            <div class="subtitle">DATA SCIENCE</div>
        </div>
        <button class="nav-toggle" type="button" aria-label="القائمة" aria-expanded="false"><i class="fas fa-bars"></i></button>
        <nav class="nav-menu" aria-label="التنقل الرئيسي">
            ${navItem({ key: 'path', icon: 'fas fa-route', label: 'المسار', href: homePage('path'), active, items: pathLinks })}
            ${navItem({ key: 'roadmap', icon: 'fas fa-layer-group', label: 'المنهج', href: roadmapPage(), active, items: levelLinks })}
            ${navItem({ key: 'courses', icon: 'fas fa-graduation-cap', label: 'الكورسات', href: roadmapPage(), active, items: courseLinks })}
            ${navItem({ key: 'explore', icon: 'fas fa-cubes', label: 'التقنيات والمشاريع', href: homePage('explore'), active, items: exploreLinks })}
        </nav>`;
}

function footer(catalog) {
    const published = catalog.courses.filter(isCoursePublished).slice(0, 4);
    return `
        <div class="footer-content">
            <div class="footer-col">
                <h4>CodeWay Data Science</h4>
                <p>مسار عربي منظم لتعلّم علم البيانات من الصفر حتى المستوى المتقدم: شرح، كود يعمل داخل المتصفح، تمارين، ومشاريع.</p>
            </div>
            <div class="footer-col">
                <h4>المسار</h4>
                <a href="${homePage('what')}">ما هو علم البيانات؟</a>
                <a href="${homePage('path')}">مسار التعلم</a>
                <a href="${roadmapPage()}">المنهج الكامل</a>
                <a href="${homePage('explore')}">المشاريع والتقنيات</a>
            </div>
            <div class="footer-col">
                <h4>ابدأ الدراسة</h4>
                ${published.map((c) => `<a href="${coursePage(c.slug)}">${escapeHtml(c.title)}</a>`).join('')}
            </div>
            <div class="footer-col">
                <h4>تواصل معنا</h4>
                <div class="social-icons">
                    <a href="https://github.com/" aria-label="GitHub" rel="noopener"><i class="fab fa-github"></i></a>
                    <a href="https://www.linkedin.com/" aria-label="LinkedIn" rel="noopener"><i class="fab fa-linkedin"></i></a>
                    <a href="https://www.youtube.com/" aria-label="YouTube" rel="noopener"><i class="fab fa-youtube"></i></a>
                    <a href="https://x.com/" aria-label="X" rel="noopener"><i class="fab fa-x-twitter"></i></a>
                </div>
            </div>
        </div>
        <div class="copyright">
            <i class="far fa-copyright"></i> ${new Date().getFullYear()} CodeWay Data Science. جميع الحقوق محفوظة
        </div>`;
}

function bindNav(root) {
    const headerEl = root;
    const toggle = headerEl.querySelector('.nav-toggle');
    toggle?.addEventListener('click', () => {
        const open = headerEl.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.innerHTML = open ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    });

    const touchLike = () => window.matchMedia('(hover: none), (max-width: 968px)').matches;

    headerEl.querySelectorAll('.nav-item').forEach((item) => {
        const link = item.querySelector('.nav-link');
        const dd = item.querySelector('.dropdown');
        if (!dd) return;
        link.addEventListener('click', (e) => {
            // على اللمس والجوال: أول ضغطة تفتح القائمة بدل الانتقال.
            if (touchLike() && !item.classList.contains('open')) {
                e.preventDefault();
                headerEl.querySelectorAll('.nav-item.open').forEach((o) => o !== item && o.classList.remove('open'));
                item.classList.add('open');
                link.setAttribute('aria-expanded', 'true');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!headerEl.contains(e.target)) {
            headerEl.querySelectorAll('.nav-item.open').forEach((o) => o.classList.remove('open'));
        }
    });

    // روابط تفتح تبويباً معيناً في الصفحة الرئيسية
    headerEl.querySelectorAll('[data-tab]').forEach((a) => {
        a.addEventListener('click', () => {
            try { sessionStorage.setItem('cw.tab', a.dataset.tab); } catch (err) { /* ignore */ }
            window.dispatchEvent(new CustomEvent('cw:tab', { detail: a.dataset.tab }));
            headerEl.classList.remove('nav-open');
        });
    });
}

export function renderLayout(catalog, { active = '' } = {}) {
    document.body.insertAdjacentHTML('afterbegin', BG);

    const headerEl = document.getElementById('cw-header');
    if (headerEl) {
        headerEl.innerHTML = header(catalog, active);
        bindNav(headerEl);
    }

    const footerEl = document.getElementById('cw-footer');
    if (footerEl) footerEl.innerHTML = footer(catalog);
}

export function renderError(target, error) {
    const isFile = location.protocol === 'file:';
    target.innerHTML = `<div class="glass-card load-error">
        <h2><i class="fas fa-triangle-exclamation"></i> تعذّر تحميل المحتوى</h2>
        <p>${escapeHtml(error.message || String(error))}</p>
        ${isFile ? `<p>افتح المنصة عبر خادم محلي بدلاً من فتح الملف مباشرة: <code>python3 -m http.server 8000</code> ثم <code>http://localhost:8000/data-science/</code></p>` : ''}
    </div>`;
}

export { url };
