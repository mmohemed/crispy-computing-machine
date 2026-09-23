/**
 * عرض الأسئلة بكل أنواعها:
 *   mcq · true_false · predict_output · write_code · fix_code
 * بعد الإجابة: صحيح/خطأ مع شرح السبب.
 */
import { escapeHtml, highlight, inline, joinLines } from '../core/dom.js';
import { createPlayground } from './code-editor.js';

export const TYPE_LABEL = {
    mcq: 'اختيار من متعدد',
    true_false: 'صح أم خطأ',
    predict_output: 'ما ناتج الكود؟',
    write_code: 'اكتب الكود',
    fix_code: 'صحّح الكود',
};

const KEYS = ['أ', 'ب', 'ج', 'د', 'هـ'];

export function codeBlock(code, { language = 'python', label = '', variant = '' } = {}) {
    const text = joinLines(code);
    return `<div class="code-block ${variant}">
        <div class="cb-head"><span>${escapeHtml(label || (language === 'python' ? 'Python' : language))}</span>
            <button type="button" class="icon-btn copy-btn" data-copy="${escapeHtml(text)}"><i class="far fa-copy"></i> نسخ</button></div>
        <pre><code>${highlight(text, language)}</code></pre>
    </div>`;
}

/** تفعيل أزرار النسخ داخل عنصر. */
export function bindCopy(root) {
    root.querySelectorAll('.copy-btn:not([data-bound])').forEach((btn) => {
        btn.dataset.bound = '1';
        btn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(btn.dataset.copy);
                btn.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
            } catch (e) {
                btn.innerHTML = 'انسخ يدوياً';
            }
            setTimeout(() => { btn.innerHTML = '<i class="far fa-copy"></i> نسخ'; }, 1500);
        });
    });
}

function optionLabel(q, opt) {
    // خيارات predict_output تُعرض ككود
    if (q.type === 'predict_output') return `<code>${escapeHtml(opt).replace(/\n/g, '<br>')}</code>`;
    return inline(opt);
}

/**
 * يرسم سؤالاً داخل container. onAnswer(correct) تُستدعى مرة واحدة عند أول إجابة نهائية.
 */
export function renderQuestion(container, q, { index = null, total = null, storagePrefix = null, onAnswer } = {}) {
    const number = index != null ? `السؤال ${index + 1}${total ? ` من ${total}` : ''}` : 'سؤال للتأكد من الفهم';
    container.className = 'q-card';
    const codeHtml = q.code ? codeBlock(q.code, { label: 'الكود' }) : '';

    container.innerHTML = `
        <div class="q-head">
            <span class="q-no">${number}</span>
            <span class="lang-tag">${TYPE_LABEL[q.type] || ''}</span>
        </div>
        <div class="q-text prose">${inline(q.prompt)}</div>
        ${codeHtml}
        <div class="q-body"></div>
        <div class="feedback" role="status"></div>`;
    bindCopy(container);

    const body = container.querySelector('.q-body');
    const feedback = container.querySelector('.feedback');
    let answered = false;

    const finish = (correct, extra = '') => {
        if (answered) return;
        answered = true;
        container.classList.add(correct ? 'correct' : 'wrong');
        feedback.className = `feedback show ${correct ? 'ok' : 'bad'}`;
        feedback.innerHTML = `<strong>${correct ? '✓ إجابة صحيحة.' : '✗ إجابة غير صحيحة.'}</strong> ${extra}${inline(q.explanation || '')}`;
        onAnswer && onAnswer(correct);
    };

    if (q.type === 'mcq' || q.type === 'predict_output' || q.type === 'true_false') {
        const options = q.type === 'true_false' ? ['صح', 'خطأ'] : q.options;
        const answerIndex = q.type === 'true_false' ? (q.answer ? 0 : 1) : q.answer;
        body.innerHTML = `<div class="q-options">${options.map((opt, i) => `
            <button type="button" class="q-option" data-i="${i}">
                <span class="opt-key">${KEYS[i] || i + 1}</span><span>${optionLabel(q, opt)}</span>
            </button>`).join('')}</div>`;
        body.querySelectorAll('.q-option').forEach((btn) => {
            btn.addEventListener('click', () => {
                if (answered) return;
                const i = Number(btn.dataset.i);
                body.querySelectorAll('.q-option').forEach((b) => { b.disabled = true; });
                body.querySelector(`[data-i="${answerIndex}"]`).classList.add('is-correct');
                if (i !== answerIndex) btn.classList.add('is-wrong');
                finish(i === answerIndex);
            });
        });
        return;
    }

    // write_code / fix_code: تُصحّح بالتشغيل الفعلي والاختبارات
    const pgHost = document.createElement('div');
    body.appendChild(pgHost);
    const hints = q.hints || [];
    const extras = document.createElement('div');
    extras.innerHTML = `
        <div class="editor-toolbar" style="margin-top:12px">
            ${hints.length ? '<button type="button" class="cw-btn sm hint-btn"><i class="fas fa-lightbulb"></i> تلميح</button>' : ''}
            <button type="button" class="cw-btn sm solution-btn" hidden><i class="fas fa-key"></i> عرض الحل النموذجي</button>
        </div>
        <ul class="hint-list"></ul>
        <div class="solution-wrap"></div>`;
    body.appendChild(extras);

    let failures = 0;
    createPlayground(pgHost, {
        code: joinLines(q.starter_code),
        tests: joinLines(q.tests),
        files: q.files || [],
        storageKey: storagePrefix ? `${storagePrefix}:${q.id}` : null,
        title: q.type === 'fix_code' ? 'صحّح هذا الكود' : 'اكتب حلك هنا',
        checkLabel: 'تحقق من الإجابة',
        onResult: (result, withTests) => {
            if (!withTests || !result.tests) return;
            if (result.tests.passed) {
                finish(true);
            } else {
                failures += 1;
                if (failures >= 1) extras.querySelector('.solution-btn').hidden = false;
            }
        },
    });

    let hintIdx = 0;
    extras.querySelector('.hint-btn')?.addEventListener('click', (e) => {
        if (hintIdx < hints.length) {
            extras.querySelector('.hint-list').insertAdjacentHTML('beforeend',
                `<li><strong>تلميح ${hintIdx + 1}:</strong>${inline(hints[hintIdx])}</li>`);
            hintIdx += 1;
        }
        if (hintIdx >= hints.length) e.currentTarget.disabled = true;
    });

    extras.querySelector('.solution-btn').addEventListener('click', (e) => {
        extras.querySelector('.solution-wrap').innerHTML = codeBlock(q.solution, { label: 'الحل النموذجي', variant: 'right' });
        bindCopy(extras);
        e.currentTarget.hidden = true;
        if (!answered) finish(false, 'اطّلعت على الحل قبل الوصول إليه. ');
    });
}
