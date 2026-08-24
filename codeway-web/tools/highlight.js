/**
 * مُلوِّن صياغة خفيف يعمل وقت البناء (بدون أي اعتماد خارجي).
 * يدعم: html, css, js, json, bash, text
 */
'use strict';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);
const span = (cls, text) => `<span class="tok-${cls}">${esc(text)}</span>`;

/* ------------------------------------------------------------------ */
/* محرّك عام يعتمد قواعد regex مرتّبة بالأولوية                          */
/* ------------------------------------------------------------------ */
function runRules(code, rules) {
  let out = '';
  let i = 0;

  outer: while (i < code.length) {
    for (const rule of rules) {
      rule.re.lastIndex = i;
      const m = rule.re.exec(code);
      if (m && m.index === i && m[0].length) {
        out += rule.cls ? span(rule.cls, m[0]) : esc(m[0]);
        i += m[0].length;
        continue outer;
      }
    }
    out += esc(code[i]);
    i++;
  }
  return out;
}

const sticky = (source) => new RegExp(source, 'gy');

/* ------------------------------------------------------------------ */
/* JavaScript / TypeScript                                             */
/* ------------------------------------------------------------------ */
const JS_KEYWORDS =
  'const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|' +
  'new|class|extends|super|this|typeof|instanceof|in|of|try|catch|finally|throw|' +
  'async|await|yield|import|export|from|default|delete|void|static|get|set|' +
  'interface|type|enum|implements|public|private|protected|readonly|as|namespace';

const jsRules = [
  { cls: 'comment', re: sticky('\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/') },
  { cls: 'string', re: sticky('`(?:\\\\[\\s\\S]|[^`\\\\])*`|"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'') },
  { cls: 'bool', re: sticky('\\b(?:true|false|null|undefined|NaN|Infinity)\\b') },
  { cls: 'keyword', re: sticky(`\\b(?:${JS_KEYWORDS})\\b`) },
  { cls: 'number', re: sticky('\\b0[xXbo][0-9a-fA-F_]+n?\\b|\\b\\d[\\d_]*(?:\\.\\d+)?(?:[eE][+-]?\\d+)?n?\\b') },
  { cls: 'func', re: sticky('[A-Za-z_$][\\w$]*(?=\\s*\\()') },
  { cls: 'prop', re: sticky('(?<=\\.)[A-Za-z_$][\\w$]*') },
  { cls: 'punct', re: sticky('[{}()\\[\\];,.:?=+\\-*/%<>!&|^~]+') },
  { cls: null, re: sticky('[A-Za-z_$][\\w$]*|\\s+') }
];

const highlightJS = (code) => runRules(code, jsRules);

/* ------------------------------------------------------------------ */
/* JSON                                                                */
/* ------------------------------------------------------------------ */
const jsonRules = [
  { cls: 'prop', re: sticky('"(?:\\\\.|[^"\\\\])*"(?=\\s*:)') },
  { cls: 'string', re: sticky('"(?:\\\\.|[^"\\\\])*"') },
  { cls: 'bool', re: sticky('\\b(?:true|false|null)\\b') },
  { cls: 'number', re: sticky('-?\\b\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\b') },
  { cls: 'punct', re: sticky('[{}\\[\\],:]') }
];
const highlightJSON = (code) => runRules(code, jsonRules);

/* ------------------------------------------------------------------ */
/* Bash                                                                */
/* ------------------------------------------------------------------ */
const bashRules = [
  { cls: 'comment', re: sticky('#[^\\n]*') },
  { cls: 'string', re: sticky('"(?:\\\\.|[^"\\\\])*"|\'[^\']*\'') },
  { cls: 'keyword', re: sticky('\\b(?:npm|npx|yarn|pnpm|git|node|cd|ls|mkdir|rm|cp|mv|echo|cat|curl|sudo|python3?|pip|docker|code)\\b') },
  { cls: 'attr', re: sticky('(?<=\\s)--?[\\w-]+') },
  { cls: 'number', re: sticky('\\b\\d+\\b') },
  { cls: 'punct', re: sticky('[|&;<>()$]') }
];
const highlightBash = (code) => runRules(code, bashRules);

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */
function highlightCSS(code) {
  let out = '';
  let i = 0;
  let depth = 0;

  const take = (re) => {
    re.lastIndex = i;
    const m = re.exec(code);
    return m && m.index === i ? m[0] : null;
  };

  while (i < code.length) {
    let m;

    if ((m = take(sticky('\\/\\*[\\s\\S]*?\\*\\/')))) { out += span('comment', m); i += m.length; continue; }
    if ((m = take(sticky('"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'')))) { out += span('string', m); i += m.length; continue; }
    if ((m = take(sticky('@[\\w-]+')))) { out += span('keyword', m); i += m.length; continue; }

    const ch = code[i];
    if (ch === '{') { depth++; out += span('punct', ch); i++; continue; }
    if (ch === '}') { depth = Math.max(0, depth - 1); out += span('punct', ch); i++; continue; }

    if (depth > 0) {
      if ((m = take(sticky('[-a-zA-Z_][\\w-]*(?=\\s*:)')))) { out += span('prop', m); i += m.length; continue; }
      if ((m = take(sticky('!important\\b')))) { out += span('keyword', m); i += m.length; continue; }
      if ((m = take(sticky('#[0-9a-fA-F]{3,8}\\b')))) { out += span('number', m); i += m.length; continue; }
      if ((m = take(sticky('-?\\b\\d*\\.?\\d+(?:px|em|rem|%|vh|vw|vmin|vmax|s|ms|deg|fr|ch|ex|pt|turn)?\\b')))) { out += span('number', m); i += m.length; continue; }
      if ((m = take(sticky('[a-zA-Z-]+(?=\\()')))) { out += span('func', m); i += m.length; continue; }
      if ((m = take(sticky('[{}();:,]')))) { out += span('punct', m); i += m.length; continue; }
      if ((m = take(sticky('[\\w-]+')))) { out += esc(m); i += m.length; continue; }
    } else {
      if ((m = take(sticky('[.#]?[\\w-]+(?:\\[[^\\]]*\\])?|::?[\\w-]+(?:\\([^)]*\\))?|\\*')))) { out += span('sel', m); i += m.length; continue; }
      if ((m = take(sticky('[>+~,]')))) { out += span('punct', m); i += m.length; continue; }
    }

    out += esc(ch);
    i++;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* HTML (مع تلوين محتوى style و script)                                */
/* ------------------------------------------------------------------ */
function highlightHTML(code) {
  let out = '';
  let i = 0;

  while (i < code.length) {
    const lt = code.indexOf('<', i);
    if (lt === -1) { out += esc(code.slice(i)); break; }
    out += esc(code.slice(i, lt));
    i = lt;

    // تعليق
    if (code.startsWith('<!--', i)) {
      const end = code.indexOf('-->', i);
      const stop = end === -1 ? code.length : end + 3;
      out += span('comment', code.slice(i, stop));
      i = stop;
      continue;
    }

    // DOCTYPE
    if (/^<!doctype/i.test(code.slice(i, i + 9))) {
      const end = code.indexOf('>', i);
      const stop = end === -1 ? code.length : end + 1;
      out += span('keyword', code.slice(i, stop));
      i = stop;
      continue;
    }

    const tagMatch = /^<\/?([A-Za-z][\w:-]*)/.exec(code.slice(i));
    if (!tagMatch) { out += esc('<'); i++; continue; }

    const tagName = tagMatch[1].toLowerCase();
    out += span('tag', tagMatch[0]);
    i += tagMatch[0].length;

    // سمات الوسم
    while (i < code.length && code[i] !== '>') {
      const rest = code.slice(i);
      let m;
      if ((m = /^\s+/.exec(rest))) { out += esc(m[0]); i += m[0].length; continue; }
      if ((m = /^[\w:@.\-]+/.exec(rest))) { out += span('attr', m[0]); i += m[0].length; continue; }
      if ((m = /^=/.exec(rest))) { out += span('punct', '='); i += 1; continue; }
      if ((m = /^"[^"]*"|^'[^']*'/.exec(rest))) { out += span('string', m[0]); i += m[0].length; continue; }
      if ((m = /^\//.exec(rest))) { out += span('tag', '/'); i += 1; continue; }
      out += esc(code[i]); i++;
    }
    if (code[i] === '>') { out += span('tag', '>'); i++; }

    // محتوى style / script
    if (tagName === 'style' || tagName === 'script') {
      const closeRe = new RegExp(`</${tagName}\\s*>`, 'i');
      const rest = code.slice(i);
      const cm = closeRe.exec(rest);
      const inner = cm ? rest.slice(0, cm.index) : rest;
      out += tagName === 'style' ? highlightCSS(inner) : highlightJS(inner);
      i += inner.length;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
const LANGS = {
  html: highlightHTML,
  xml: highlightHTML,
  css: highlightCSS,
  scss: highlightCSS,
  js: highlightJS,
  javascript: highlightJS,
  jsx: highlightJS,
  ts: highlightJS,
  typescript: highlightJS,
  json: highlightJSON,
  bash: highlightBash,
  sh: highlightBash,
  text: (c) => esc(c)
};

function highlight(code, lang) {
  const fn = LANGS[String(lang || 'text').toLowerCase()] || LANGS.text;
  return fn(code);
}

module.exports = { highlight, esc };
