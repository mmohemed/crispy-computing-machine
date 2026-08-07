/*
 * يبني نسخة التطبيق في ملف HTML واحد يحتوي كل شيء (النص، الخطوط، التنسيقات، الشيفرة)،
 * فيمكن إرساله لأي شخص عبر واتساب أو البريد ويفتحه على جواله بلا إنترنت.
 *
 *   node quran/tools/build-single.js
 *   ← quran/dist/quran-app.html
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'dist');
const OUT_FILE = path.join(OUT_DIR, 'quran-app.html');

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

/* الخطوط تُدمج كـ data: URI حتى تعمل حتى عند فتح الملف من القرص */
function inlineFonts(css) {
  return css.replace(/url\('\.\.\/(fonts\/[^']+)'\)/g, (match, rel) => {
    const base64 = fs.readFileSync(path.join(ROOT, rel)).toString('base64');
    return "url('data:font/woff2;base64," + base64 + "')";
  });
}

/* منع إغلاق وسم <script> مبكراً لو ورد النص داخل الشيفرة */
const safeScript = (code) => code.replace(/<\/script/gi, '<\\/script');

let html = read('index.html');

// روابط لا معنى لها في ملف مستقل
html = html
  .replace(/[ \t]*<link rel="manifest"[^>]*>\n?/, '')
  .replace(/[ \t]*<link rel="apple-touch-icon"[^>]*>\n?/, '');

// التنسيقات
html = html.replace(
  /[ \t]*<link rel="stylesheet" href="css\/styles\.css"[^>]*>/,
  '  <style>\n' + inlineFonts(read('css/styles.css')) + '\n  </style>'
);

// الشيفرة وملف البيانات
html = html.replace(/[ \t]*<script src="([^"]+)"><\/script>\n?/g, (match, src) => {
  return '  <script>\n' + safeScript(read(src)) + '  </script>\n';
});

// روابط التنقّل الداخلية (#/...) طبيعية؛ الممنوع هو أي ملف محلي لم يُدمج
const leftovers = html.match(/(?:src|href)="(?!data:|https?:|#)[^"]+"/g);
if (leftovers) {
  throw new Error('بقيت روابط خارجية لم تُدمج: ' + leftovers.join(', '));
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, html);

console.log(
  'تم بناء ' + path.relative(process.cwd(), OUT_FILE) +
    ' — ' + (fs.statSync(OUT_FILE).size / 1048576).toFixed(2) + ' م.ب'
);
