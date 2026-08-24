/** الهيكل المشترك لكل صفحات الموقع (الترويسة، الفوتر، وسوم الرأس) */
'use strict';

const { icon } = require('./icons.js');
const { esc } = require('./highlight.js');

const SITE = {
  name: 'CodeWay Web',
  nameAr: 'كود واي — تطوير الويب',
  tagline: 'منصة عربية متكاملة لتعلّم تطوير الويب من الصفر إلى الاحتراف'
};

const NAV = [
  { href: 'index.html', label: 'الرئيسية', key: 'home' },
  { href: 'tracks.html', label: 'المسارات', key: 'tracks' },
  { href: 'roadmap.html', label: 'خريطة الطريق', key: 'roadmap' },
  { href: 'about.html', label: 'عن المنصة', key: 'about' }
];

function header(prefix, active) {
  const links = NAV.map((n) =>
    `<a href="${prefix}${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a>`
  ).join('');

  return `<a class="skip-link" href="#main">تخطّي إلى المحتوى</a>
<header class="site-header">
  <div class="container">
    <a class="brand" href="${prefix}index.html">
      <span class="brand-mark">${icon('code')}</span>
      <span class="brand-name">CodeWay<small>WEB DEVELOPMENT</small></span>
    </a>
    <nav class="main-nav" id="mainNav" aria-label="التنقّل الرئيسي">${links}</nav>
    <div class="header-actions">
      <button type="button" class="icon-btn theme-toggle" aria-label="تبديل الوضع الليلي">
        <span class="icon-sun">${icon('sun')}</span><span class="icon-moon">${icon('moon')}</span>
      </button>
      <button type="button" class="icon-btn nav-toggle" aria-controls="mainNav" aria-expanded="false" aria-label="فتح القائمة">${icon('menu')}</button>
    </div>
  </div>
</header>`;
}

function footer(prefix, tracks) {
  const ready = tracks.filter((t) => t.status === 'ready');
  const soon = tracks.filter((t) => t.status === 'soon').slice(0, 5);

  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col footer-about">
        <a class="brand" href="${prefix}index.html">
          <span class="brand-mark">${icon('code')}</span>
          <span class="brand-name">CodeWay<small>WEB DEVELOPMENT</small></span>
        </a>
        <p>${esc(SITE.tagline)}. محتوى عربي مفتوح المصدر، يعمل بلا إنترنت وبدون أي اعتماد خارجي.</p>
      </div>
      <div class="footer-col">
        <h4>المسارات المنشورة</h4>
        <ul>${ready.map((t) => `<li><a href="${prefix}tracks/${t.id}/index.html">${esc(t.name)}</a></li>`).join('')}</ul>
      </div>
      <div class="footer-col">
        <h4>قريباً</h4>
        <ul>${soon.map((t) => `<li><a href="${prefix}tracks.html#${t.id}">${esc(t.name)}</a></li>`).join('')}</ul>
      </div>
      <div class="footer-col">
        <h4>روابط</h4>
        <ul>
          <li><a href="${prefix}roadmap.html">خريطة الطريق</a></li>
          <li><a href="${prefix}about.html">عن المنصة</a></li>
          <li><a href="${prefix}tracks.html">كل المسارات</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© <span data-year>2026</span> ${esc(SITE.name)} — محتوى تعليمي عربي مفتوح المصدر.</p>
    </div>
  </div>
</footer>`;
}

/**
 * توليد صفحة HTML كاملة.
 * opts: { title, description, active, prefix, content, track, lessonCss, scripts }
 */
function page(opts) {
  const prefix = opts.prefix || '';
  const trackAttr = opts.track ? ` data-track="${opts.track}"` : '';

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl"${trackAttr}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description || SITE.tagline)}">
<meta name="author" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.description || SITE.tagline)}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#6366f1">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='24' fill='%236366f1'/%3E%3Ctext x='50' y='68' font-size='54' text-anchor='middle' fill='white' font-family='monospace'%3E%26lt;%2F%26gt;%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${prefix}assets/css/theme.css">
<link rel="stylesheet" href="${prefix}assets/css/main.css">
${opts.lessonCss ? `<link rel="stylesheet" href="${prefix}assets/css/lesson.css">` : ''}
<script>
/* منع وميض الثيم قبل تحميل السكربت الرئيسي */
(function(){try{var t=JSON.parse(localStorage.getItem('cw:theme'));if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();
</script>
</head>
<body>
${header(prefix, opts.active)}
<main id="main">
${opts.content}
</main>
${footer(prefix, opts.tracks || [])}
<button type="button" class="to-top" aria-label="العودة إلى الأعلى">${icon('arrow-up')}</button>
<script src="${prefix}assets/js/app.js"></script>
${(opts.scripts || []).map((s) => `<script src="${prefix}${s}"></script>`).join('\n')}
</body>
</html>`;
}

module.exports = { page, SITE, NAV };
