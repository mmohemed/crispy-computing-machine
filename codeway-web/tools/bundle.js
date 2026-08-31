#!/usr/bin/env node
/* ==========================================================================
   CodeWay Web — مُجمِّع الموقع في ملف واحد
   يحوّل الموقع متعدّد الصفحات إلى صفحة واحدة قابلة للتصفّح بموجّه داخلي،
   لمشاركته أو معاينته دون خادم ودون مجلّدات.
   الاستخدام:  node tools/bundle.js [الملف الناتج]
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const posix = path.posix;

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'preview.html');

/* ---------- اجمع كل الصفحات المُولَّدة ---------- */
function collectPages() {
  const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') && f !== 'preview.html');

  const tracksDir = path.join(ROOT, 'tracks');
  if (fs.existsSync(tracksDir)) {
    for (const track of fs.readdirSync(tracksDir)) {
      const dir = path.join(tracksDir, track);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const file of fs.readdirSync(dir)) {
        if (file.endsWith('.html')) pages.push(`tracks/${track}/${file}`);
      }
    }
  }

  // الرئيسية أولاً حتى تكون المسار الافتراضي
  return pages.sort((a, b) =>
    (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b))
  );
}

/* ---------- استخراج جزء من المستند ---------- */
function slice(html, openTag, closeTag) {
  const start = html.indexOf(openTag);
  if (start === -1) return null;
  const end = html.indexOf(closeTag, start);
  if (end === -1) return null;
  return html.slice(start, end + closeTag.length);
}

/* ---------- تحويل الروابط النسبية إلى مسارات الموجّه ---------- */
function rewriteLinks(html, pageDir, routes) {
  return html.replace(/href="([^"]*)"/g, (match, href) => {
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('data:')
    ) {
      return match;
    }

    const [file, hash] = href.split('#');
    const resolved = posix.normalize(posix.join(pageDir, file));

    if (!routes.has(resolved)) return match;

    return `href="#/${resolved}${hash ? '#' + hash : ''}" data-route`;
  });
}

/* ---------- البناء ---------- */
function build() {
  const pageFiles = collectPages();
  const routes = new Set(pageFiles);

  const css = ['theme.css', 'main.css', 'lesson.css']
    .map((f) => fs.readFileSync(path.join(ROOT, 'assets/css', f), 'utf8'))
    .join('\n');

  const js = ['app.js', 'lesson.js']
    .map((f) => fs.readFileSync(path.join(ROOT, 'assets/js', f), 'utf8'))
    .join('\n');

  let shellHeader = null;
  let shellFooter = null;
  const templates = [];

  for (const file of pageFiles) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const dir = posix.dirname(file) === '.' ? '' : posix.dirname(file);

    const main = slice(html, '<main id="main">', '</main>');
    if (!main) {
      console.warn(`⚠️  تُخطّي ${file} — لا يحتوي <main id="main">`);
      continue;
    }

    if (!shellHeader) {
      shellHeader = rewriteLinks(slice(html, '<header class="site-header">', '</header>'), dir, routes);
      shellFooter = rewriteLinks(slice(html, '<footer class="site-footer">', '</footer>'), dir, routes);
    }

    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].trim() : 'CodeWay Web';

    templates.push(
      `<template data-route="${file}" data-title="${title.replace(/"/g, '&quot;')}">` +
        rewriteLinks(main, dir, routes) +
        `</template>`
    );
  }

  const page = `<title>CodeWay Web</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap">

<script>
  /* الاتجاه واللغة: الغلاف الخارجي لا يمرّر سمات <html> فنضبطها هنا */
  document.documentElement.lang = 'ar';
  document.documentElement.dir = 'rtl';
</script>

<style>
/* احتياط لو تأخّر السكربت: الاتجاه من CSS أيضاً */
html { direction: rtl; }

${css}
/* ---------- إضافات نسخة الملف الواحد ---------- */
.bundle-hint {
  position: fixed; inset-block-end: 16px; inset-inline-start: 16px; z-index: 60;
  background: var(--surface-2); border: 1px solid var(--border);
  border-radius: 999px; padding: 8px 16px; font-size: .8rem; color: var(--text-muted);
  box-shadow: var(--shadow-md); pointer-events: none;
  opacity: 1; transition: opacity .4s ease;
}
.bundle-hint.hide { opacity: 0; }
</style>

${shellHeader}
<main id="main"></main>
${shellFooter}
<div class="bundle-hint">نسخة معاينة — كل الصفحات داخل ملف واحد</div>

<div hidden id="routes">
${templates.join('\n')}
</div>

<script>
${js}
</script>

<script>
/* ==========================================================================
   موجّه داخلي: يبدّل محتوى <main> بين الصفحات المضمّنة بلا إعادة تحميل
   ========================================================================== */
(function () {
  'use strict';

  var store = document.getElementById('routes');
  var main = document.getElementById('main');
  var DEFAULT = 'index.html';

  var pages = {};
  store.querySelectorAll('template[data-route]').forEach(function (t) {
    pages[t.getAttribute('data-route')] = t;
  });

  function parseHash() {
    var raw = location.hash.replace(/^#\\/?/, '');
    if (!raw) return { route: DEFAULT, anchor: '' };
    var parts = raw.split('#');
    var route = parts[0] || DEFAULT;
    return { route: pages[route] ? route : DEFAULT, anchor: parts[1] || '' };
  }

  function markActiveNav(route) {
    document.querySelectorAll('.main-nav a').forEach(function (a) {
      var target = (a.getAttribute('href') || '').replace(/^#\\//, '');
      var isHome = route === 'index.html';
      var hit = target === route ||
                (target === 'tracks.html' && route.indexOf('tracks/') === 0);
      a.classList.toggle('active', hit || (isHome && target === 'index.html'));
    });
  }

  var current = null;

  function render(scrollToTop) {
    var target = parseHash();
    var tpl = pages[target.route];
    if (!tpl) return;

    if (target.route !== current) {
      current = target.route;
      main.replaceChildren(tpl.content.cloneNode(true));
      document.title = tpl.getAttribute('data-title') || 'CodeWay Web';
      markActiveNav(target.route);

      if (window.CW && typeof window.CW.initPage === 'function') {
        window.CW.initPage(document);
      }
    }

    if (target.anchor) {
      var el = document.getElementById(target.anchor);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    }
    if (scrollToTop !== false) window.scrollTo({ top: 0 });
  }

  window.addEventListener('hashchange', function () { render(true); });
  render(false);

  /* أخفِ شارة المعاينة بعد قليل */
  setTimeout(function () {
    var hint = document.querySelector('.bundle-hint');
    if (hint) hint.classList.add('hide');
  }, 4000);
})();
</script>
`;

  fs.writeFileSync(OUT, page, 'utf8');

  const kb = Math.round(Buffer.byteLength(page) / 1024);
  console.log(`✅ ${path.relative(ROOT, OUT)} — ${templates.length} صفحة · ${(kb / 1024).toFixed(1)} ميغابايت`);
}

build();
