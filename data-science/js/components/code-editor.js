/**
 * محرر الكود + زر التشغيل + لوحة المخرجات.
 *
 * يستخدم CodeMirror 5 إذا كان محمّلاً في الصفحة، وإلا يرجع إلى textarea عادية
 * حتى يبقى المحرر صالحاً للاستخدام إذا لم تُحمّل المكتبة.
 *
 *   const pg = createPlayground(container, {
 *       code, language: 'python', tests, stdin, storageKey,
 *       onResult(result) {}, checkLabel: 'تحقق من الحل'
 *   });
 */
import { escapeHtml } from '../core/dom.js';
import { progress } from '../core/progress-store.js';
import { ERROR_HINTS, getRunner } from '../runners/runner.js';

const LANG_LABEL = { python: 'Python', sql: 'SQL' };
const CM_MODE = { python: 'python', sql: 'text/x-sql' };

export function createEditor(host, { code = '', language = 'python', readOnly = false, onRun } = {}) {
    const textarea = document.createElement('textarea');
    textarea.className = 'cw-editor-fallback';
    textarea.value = code;
    textarea.spellcheck = false;
    textarea.setAttribute('dir', 'ltr');
    textarea.setAttribute('aria-label', 'محرر الكود');
    host.appendChild(textarea);

    if (window.CodeMirror) {
        const cm = window.CodeMirror.fromTextArea(textarea, {
            mode: CM_MODE[language] || language,
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            matchBrackets: true,
            autoCloseBrackets: true,
            styleActiveLine: true,
            readOnly,
            viewportMargin: Infinity,
            direction: 'ltr',
            extraKeys: {
                Tab: (c) => (c.somethingSelected() ? c.indentSelection('add') : c.replaceSelection('    ', 'end')),
                'Shift-Tab': (c) => c.indentSelection('subtract'),
                'Ctrl-Enter': () => onRun && onRun(),
                'Cmd-Enter': () => onRun && onRun(),
            },
        });
        // تحديث الحجم عندما يصبح المحرر مرئياً (مثلاً داخل details مغلقة)
        requestAnimationFrame(() => cm.refresh());
        return {
            getValue: () => cm.getValue(),
            setValue: (v) => cm.setValue(v),
            focus: () => cm.focus(),
            refresh: () => cm.refresh(),
            onChange: (fn) => cm.on('change', () => fn(cm.getValue())),
        };
    }

    textarea.readOnly = readOnly;
    textarea.rows = Math.min(24, Math.max(6, code.split('\n').length + 1));
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart: s, selectionEnd: en, value } = textarea;
            textarea.value = value.slice(0, s) + '    ' + value.slice(en);
            textarea.selectionStart = textarea.selectionEnd = s + 4;
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            onRun && onRun();
        }
    });
    return {
        getValue: () => textarea.value,
        setValue: (v) => { textarea.value = v; },
        focus: () => textarea.focus(),
        refresh: () => {},
        onChange: (fn) => textarea.addEventListener('input', () => fn(textarea.value)),
    };
}

function formatError(error) {
    const hint = ERROR_HINTS[error.type] || '';
    const lineInfo = error.line ? `السطر ${error.line}` : '';
    const lineText = error.text ? `\n    ${error.text.trim()}` : '';
    return `<span class="err">${escapeHtml(error.type)}: ${escapeHtml(error.message)}${escapeHtml(lineText)}</span>`
        + (hint || lineInfo ? `<span class="err-hint">${lineInfo ? `📍 ${lineInfo}. ` : ''}${escapeHtml(hint)}</span>` : '');
}

export function renderOutput(pre, result) {
    pre.classList.remove('muted');
    let html = '';
    if (result.stdout) html += escapeHtml(result.stdout);
    if (result.error) html += (html && !html.endsWith('\n') ? '\n' : '') + formatError(result.error);
    if (!html) {
        pre.classList.add('muted');
        html = 'انتهى التنفيذ بدون أي مخرجات. استخدم print() لعرض النتائج.';
    }
    pre.innerHTML = html;
}

/**
 * محرر تفاعلي كامل: محرر + أزرار + مدخلات اختيارية + مخرجات.
 */
export function createPlayground(container, opts) {
    const {
        code = '',
        language = 'python',
        tests = null,
        stdin = null,
        storageKey = null,
        title = 'محرر الكود',
        checkLabel = 'تحقق من الحل',
        onResult = null,
    } = opts;

    const saved = storageKey ? progress.getCode(storageKey) : null;
    const initial = saved ?? code;

    container.innerHTML = `
        <div class="editor-box" dir="ltr">
            <div class="cb-head">
                <span><i class="fas fa-code"></i> ${escapeHtml(title)} · ${LANG_LABEL[language] || language}</span>
                <span class="cb-dots"><span></span><span></span><span></span></span>
            </div>
            <div class="editor-host"></div>
        </div>
        ${stdin !== null ? `<div class="stdin-box"><label>المدخلات (كل سطر يُقرأ بـ input() واحدة)</label><textarea dir="ltr" rows="2">${escapeHtml(stdin)}</textarea></div>` : ''}
        <div class="editor-toolbar">
            <button type="button" class="cw-btn sm primary run-btn"><i class="fas fa-play"></i> تشغيل الكود</button>
            ${tests ? `<button type="button" class="cw-btn sm check-btn"><i class="fas fa-circle-check"></i> ${escapeHtml(checkLabel)}</button>` : ''}
            <button type="button" class="cw-btn sm reset-btn" title="إرجاع الكود الأصلي"><i class="fas fa-rotate-left"></i> إعادة</button>
            <span class="run-status" aria-live="polite">Ctrl + Enter للتشغيل</span>
        </div>
        <div class="output-box" dir="ltr">
            <div class="cb-head"><span><i class="fas fa-terminal"></i> Output · المخرجات</span><span class="run-time"></span></div>
            <pre class="muted">اضغط "تشغيل الكود" لرؤية النتيجة هنا.</pre>
        </div>
        <div class="feedback" role="status"></div>`;

    const host = container.querySelector('.editor-host');
    const outPre = container.querySelector('.output-box pre');
    const status = container.querySelector('.run-status');
    const timeEl = container.querySelector('.run-time');
    const feedback = container.querySelector('.feedback');
    const runBtn = container.querySelector('.run-btn');
    const checkBtn = container.querySelector('.check-btn');
    const stdinEl = container.querySelector('.stdin-box textarea');

    let busy = false;
    const editor = createEditor(host, { code: initial, language, onRun: () => execute(false) });

    if (storageKey) {
        let t;
        editor.onChange((value) => {
            clearTimeout(t);
            t = setTimeout(() => progress.saveCode(storageKey, value), 400);
        });
    }

    async function execute(withTests) {
        if (busy) return;
        busy = true;
        runBtn.disabled = true;
        if (checkBtn) checkBtn.disabled = true;
        feedback.className = 'feedback';
        status.classList.add('loading');

        const runner = await getRunner(language);
        const off = runner.onStatus ? runner.onStatus((s) => {
            if (s === 'loading') status.textContent = 'جاري تجهيز بيئة Python (أول مرة فقط)…';
            if (s === 'running') status.textContent = 'جاري التشغيل…';
        }) : null;
        status.textContent = runner.isReady() ? 'جاري التشغيل…' : 'جاري تجهيز بيئة Python (أول مرة فقط)…';

        const result = await runner.run({
            code: editor.getValue(),
            tests: withTests ? tests : null,
            stdin: stdinEl ? stdinEl.value : null,
        });

        off && off();
        status.classList.remove('loading');
        status.textContent = result.error ? 'انتهى التنفيذ مع خطأ' : 'تم التشغيل ✓';
        timeEl.textContent = result.durationMs != null ? `${result.durationMs} ms` : '';
        renderOutput(outPre, result);

        if (withTests && result.tests) {
            feedback.classList.add('show', result.tests.passed ? 'ok' : 'bad');
            feedback.innerHTML = result.tests.passed
                ? '<strong>✓ أحسنت! حلّك صحيح.</strong> اجتاز كودك كل شروط التمرين.'
                : `<strong>✗ لم يكتمل الحل بعد.</strong> ${escapeHtml(result.tests.message)}`;
        }
        onResult && onResult(result, withTests);

        busy = false;
        runBtn.disabled = false;
        if (checkBtn) checkBtn.disabled = false;
    }

    runBtn.addEventListener('click', () => execute(false));
    checkBtn?.addEventListener('click', () => execute(true));
    container.querySelector('.reset-btn').addEventListener('click', () => {
        editor.setValue(code);
        if (storageKey) progress.clearCode(storageKey);
        outPre.className = 'muted';
        outPre.textContent = 'اضغط "تشغيل الكود" لرؤية النتيجة هنا.';
        feedback.className = 'feedback';
    });

    return { editor, run: () => execute(false), check: () => execute(true), setCode: (c) => editor.setValue(c) };
}
