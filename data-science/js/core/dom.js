/**
 * أدوات DOM صغيرة: الهروب من HTML، تنسيق نص الدروس، وتلوين الكود المعروض.
 * كل النصوص القادمة من ملفات المحتوى تمر عبر escapeHtml قبل إدخالها في الصفحة.
 */
export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** يحوّل نص الدرس إلى HTML آمن: `كود` و **عريض** فقط. */
export function inline(text) {
    return escapeHtml(text)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** يقبل الكود كنص أو كمصفوفة أسطر (الشكل المستخدم في ملفات JSON). */
export function joinLines(value) {
    if (value == null) return '';
    return Array.isArray(value) ? value.join('\n') : String(value);
}

export function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
}

export function $(sel, root = document) {
    return root.querySelector(sel);
}

export function $all(sel, root = document) {
    return [...root.querySelectorAll(sel)];
}

const PY_KEYWORDS = new Set(('False None True and as assert async await break class continue def del elif else except ' +
    'finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case').split(' '));
const PY_BUILTINS = new Set(('print len range int float str bool list dict set tuple type input sum min max abs round sorted ' +
    'enumerate zip open isinstance map filter any all reversed').split(' '));

/** تلوين خفيف لكود Python المعروض (للقراءة فقط). المحرر التفاعلي يستخدم CodeMirror. */
export function highlightPython(code) {
    const re = /(#[^\n]*)|([fFrRbB]{0,2}"""[\s\S]*?"""|[fFrRbB]{0,2}'''[\s\S]*?'''|[fFrRbB]{0,2}"(?:\\.|[^"\\\n])*"|[fFrRbB]{0,2}'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/g;
    let out = '';
    let last = 0;
    let m;
    while ((m = re.exec(code))) {
        out += escapeHtml(code.slice(last, m.index));
        const [tok, com, str, num, word] = m;
        if (com) out += `<span class="tok-com">${escapeHtml(com)}</span>`;
        else if (str) out += `<span class="tok-str">${escapeHtml(str)}</span>`;
        else if (num) out += `<span class="tok-num">${num}</span>`;
        else if (word) {
            const next = code.slice(re.lastIndex).match(/^\s*\(/);
            if (PY_KEYWORDS.has(word)) out += `<span class="tok-kw">${word}</span>`;
            else if (PY_BUILTINS.has(word)) out += `<span class="tok-bi">${word}</span>`;
            else if (next) out += `<span class="tok-fn">${word}</span>`;
            else out += word;
        } else out += escapeHtml(tok);
        last = re.lastIndex;
    }
    out += escapeHtml(code.slice(last));
    return out;
}

export function highlight(code, language = 'python') {
    return language === 'python' ? highlightPython(code) : escapeHtml(code);
}

/** يحوّل الأرقام إلى صيغة عربية مقروءة مع الإبقاء على الأرقام الغربية (0-9) كما في الواجهة الأصلية. */
export function minutesLabel(min) {
    if (min < 60) return `${min} دقيقة`;
    const h = Math.floor(min / 60);
    const r = min % 60;
    return r ? `${h} س ${r} د` : `${h} ساعة`;
}
