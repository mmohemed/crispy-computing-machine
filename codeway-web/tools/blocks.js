/**
 * تحويل بلوكات المحتوى التعليمي إلى HTML.
 * كل درس عبارة عن مصفوفة بلوكات، وكل بلوك كائن فيه الحقل t (النوع).
 */
'use strict';

const { highlight, esc } = require('./highlight.js');
const { icon } = require('./icons.js');

/* ------------------------------------------------------------------ */
/* نص مضمّن مبسّط: `كود` **عريض** *مائل* [نص](رابط)                     */
/* ------------------------------------------------------------------ */
function inline(text) {
  let s = esc(String(text == null ? '' : text));
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/\n/g, '<br>');
  return s;
}

/* ------------------------------------------------------------------ */
/* بلوك كود                                                            */
/* ------------------------------------------------------------------ */
function codeBlock(b) {
  const lang = b.lang || 'html';
  const src = String(b.code).replace(/^\n/, '').replace(/\s+$/, '');
  const head =
    '<div class="code-head">' +
    '<span class="code-dots"><i></i><i></i><i></i></span>' +
    (b.title ? `<span class="code-title">${esc(b.title)}</span>` : '') +
    `<span class="code-lang">${esc(lang)}</span>` +
    (b.noCopy ? '' : `<button type="button" class="copy-btn">${icon('copy')} نسخ</button>`) +
    '</div>';

  return (
    '<div class="code-block">' + head +
    `<pre><code>${highlight(src, lang)}</code></pre>` +
    (b.caption ? `<div class="code-caption">${inline(b.caption)}</div>` : '') +
    '</div>'
  );
}

/* ------------------------------------------------------------------ */
/* عرض حي داخل إطار معزول                                              */
/* ------------------------------------------------------------------ */
const DEMO_BASE = `*{box-sizing:border-box}body{font-family:'Cairo','Segoe UI',Tahoma,sans-serif;margin:0;padding:18px;line-height:1.8;color:#0f172a;background:#fff}`;

/* يُحقن داخل كل عرض حيّ ليبلّغ الصفحة الأم بارتفاعه الحقيقي */
const DEMO_MEASURE =
  '(function(){function s(){try{parent.postMessage({cwHeight:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},"*")}catch(e){}}' +
  'window.addEventListener("load",s);setTimeout(s,60);setTimeout(s,400);' +
  'if(window.ResizeObserver){new ResizeObserver(s).observe(document.body)}})();';

function demoBlock(b) {
  const doc =
    '<!DOCTYPE html><html lang="ar" dir="' + (b.dir || 'rtl') + '"><head><meta charset="UTF-8">' +
    `<style>${DEMO_BASE}${b.css || ''}</style></head><body>` +
    (b.html || '') +
    (b.js ? `<script>${b.js}<\/script>` : '') +
    `<script>${DEMO_MEASURE}<\/script>` +
    '</body></html>';

  const srcdoc = doc.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    '<div class="demo">' +
    `<div class="demo-head">${icon('eye')} ${esc(b.title || 'النتيجة المباشرة')}</div>` +
    `<iframe title="${esc(b.title || 'عرض حي')}" loading="lazy" sandbox="allow-scripts" srcdoc="${srcdoc}" style="height:${b.height || 160}px"></iframe>` +
    (b.note ? `<div class="demo-note">${inline(b.note)}</div>` : '') +
    '</div>'
  );
}

/* ------------------------------------------------------------------ */
/* بقية البلوكات                                                       */
/* ------------------------------------------------------------------ */
const CALLOUTS = {
  note: { cls: 'callout-note', ico: 'info', label: 'معلومة' },
  tip: { cls: 'callout-tip', ico: 'bulb', label: 'نصيحة' },
  warn: { cls: 'callout-warn', ico: 'alert', label: 'انتبه' },
  danger: { cls: 'callout-danger', ico: 'x', label: 'خطأ شائع' }
};

function render(blocks, ctx) {
  ctx = ctx || {};
  ctx.headings = ctx.headings || [];
  let out = '';
  let qz = 0;

  for (const b of blocks) {
    switch (b.t) {
      case 'h2':
      case 'h3': {
        const id = 'sec-' + (ctx.headings.length + 1);
        ctx.headings.push({ id, text: b.text, level: b.t === 'h2' ? 2 : 3 });
        out += `<${b.t} id="${id}">${inline(b.text)}</${b.t}>`;
        break;
      }

      case 'p':
        out += `<p>${inline(b.text)}</p>`;
        break;

      case 'ul':
        out += '<ul>' + b.items.map((i) => `<li>${inline(i)}</li>`).join('') + '</ul>';
        break;

      case 'ol':
        out += '<ol>' + b.items.map((i) => `<li>${inline(i)}</li>`).join('') + '</ol>';
        break;

      case 'steps':
        out += '<ol class="steps">' + b.items.map((i) => `<li>${inline(i)}</li>`).join('') + '</ol>';
        break;

      case 'code':
        out += codeBlock(b);
        break;

      case 'demo':
        out += demoBlock(b);
        break;

      case 'table':
        out +=
          '<div class="table-wrap"><table class="data"><thead><tr>' +
          b.head.map((h) => `<th>${inline(h)}</th>`).join('') +
          '</tr></thead><tbody>' +
          b.rows.map((r) => '<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') +
          '</tbody></table></div>';
        break;

      case 'note':
      case 'tip':
      case 'warn':
      case 'danger': {
        const c = CALLOUTS[b.t];
        out +=
          `<div class="callout ${c.cls}">` +
          `<div class="callout-title">${icon(c.ico)} ${esc(b.title || c.label)}</div>` +
          `<p>${inline(b.text)}</p></div>`;
        break;
      }

      case 'compare':
        out +=
          '<div class="compare">' +
          '<div class="compare-col compare-bad"><header>✗ خطأ</header>' +
          codeBlock({ code: b.bad.code, lang: b.bad.lang || b.lang || 'html', noCopy: true }) +
          (b.bad.why ? `<div class="why">${inline(b.bad.why)}</div>` : '') + '</div>' +
          '<div class="compare-col compare-good"><header>✓ صواب</header>' +
          codeBlock({ code: b.good.code, lang: b.good.lang || b.lang || 'html', noCopy: true }) +
          (b.good.why ? `<div class="why">${inline(b.good.why)}</div>` : '') + '</div>' +
          '</div>';
        break;

      case 'features':
        out +=
          '<div class="feature-grid">' +
          b.items.map((f) =>
            '<div class="feature">' +
            `<div class="fi">${icon(f.icon || 'zap')}</div>` +
            `<h4>${inline(f.title)}</h4><p>${inline(f.text)}</p></div>`
          ).join('') +
          '</div>';
        break;

      case 'quiz': {
        qz++;
        const items = b.items.map((q, qi) => {
          const opts = q.options.map((o, oi) =>
            '<label class="q-option">' +
            `<input type="radio" name="q${qz}_${qi}" value="${oi === q.answer ? 'correct' : 'wrong'}">` +
            `<span>${inline(o)}</span></label>`
          ).join('');
          return (
            '<div class="q-item">' +
            `<p class="q-text">${qi + 1}. ${inline(q.q)}</p>` +
            `<div class="q-options">${opts}</div>` +
            (q.explain ? `<div class="q-explain"><strong>الشرح:</strong> ${inline(q.explain)}</div>` : '') +
            '</div>'
          );
        }).join('');

        const hid = 'sec-' + (ctx.headings.length + 1);
        ctx.headings.push({ id: hid, text: b.title || 'اختبر فهمك', level: 2 });

        out +=
          `<section class="quiz"><h2 id="${hid}">${icon('target')} ${esc(b.title || 'اختبر فهمك')}</h2>` +
          items +
          '<div style="display:flex;gap:.7rem;flex-wrap:wrap">' +
          '<button type="button" class="btn btn-primary" data-quiz-check>' + icon('check') + ' تحقّق من الإجابات</button>' +
          '<button type="button" class="btn btn-ghost" data-quiz-reset>' + icon('refresh') + ' إعادة</button>' +
          '</div><div class="quiz-result" role="status"></div></section>';
        break;
      }

      case 'exercise': {
        const hid = 'sec-' + (ctx.headings.length + 1);
        ctx.headings.push({ id: hid, text: b.title || 'تمرين تطبيقي', level: 2 });
        out +=
          `<section class="exercise" id="${hid}">` +
          `<header>${icon('edit')}<h3>${esc(b.title || 'تمرين تطبيقي')}</h3></header>` +
          '<div class="exercise-body">' +
          (b.brief ? `<p>${inline(b.brief)}</p>` : '') +
          (b.requirements ? '<p><strong>المطلوب:</strong></p><ul>' + b.requirements.map((r) => `<li>${inline(r)}</li>`).join('') + '</ul>' : '') +
          (b.starter ? codeBlock({ ...b.starter, title: b.starter.title || 'نقطة البداية' }) : '') +
          (b.hints ? '<p><strong>تلميحات:</strong></p><ul class="hint-list">' + b.hints.map((h) => `<li>💡 ${inline(h)}</li>`).join('') + '</ul>' : '') +
          (b.solution
            ? '<details class="solution"><summary>عرض الحل المقترح</summary>' +
              codeBlock({ ...b.solution, title: b.solution.title || 'الحل' }) +
              (b.solutionNote ? `<div class="code-caption" style="background:var(--surface-2);color:var(--text-muted)">${inline(b.solutionNote)}</div>` : '') +
              '</details>'
            : '') +
          '</div></section>';
        break;
      }

      case 'html':
        out += b.html;
        break;

      default:
        throw new Error('نوع بلوك غير معروف: ' + b.t);
    }
  }

  return out;
}

/** تجريد الترميز المضمّن للحصول على نص عادي (يُستخدم في الفهرس) */
function plain(text) {
  return String(text == null ? '' : text)
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1');
}

module.exports = { render, inline, plain, codeBlock, esc };
