/**
 * مشغّل عن بُعد: يرسل الكود إلى Backend آمن لتنفيذه.
 *
 * العقد المتوقع من الـ API (يُفعّل بوضع runners.python = 'remote' و remote.endpoint في config.js):
 *
 *   POST {endpoint}
 *   { "language": "python", "code": "...", "tests": "..." | null, "stdin": "..." | null }
 *
 *   200 OK
 *   { "stdout": "...", "error": null | {type, message, line, text}, "tests": null | {passed, message} }
 *
 * متطلبات أمان الـ Backend (انظر docs/ARCHITECTURE.md):
 *   حاوية معزولة لكل تنفيذ (Docker + gVisor أو Judge0)، بلا شبكة، مع حدود CPU/ذاكرة/وقت،
 *   ونظام ملفات مؤقت يُحذف بعد التنفيذ. لا يُنفّذ كود الطالب أبداً داخل عملية سيرفر التطبيق.
 */
import { CONFIG } from '../core/config.js';

export function createRemoteRunner(language) {
    const listeners = new Set();
    const emit = (s, d) => listeners.forEach((fn) => fn(s, d));

    return {
        language,
        onStatus(fn) {
            listeners.add(fn);
            return () => listeners.delete(fn);
        },
        isReady: () => Boolean(CONFIG.remote.endpoint),
        async warmUp() {},
        async run({ code, tests = null, stdin = null }) {
            if (!CONFIG.remote.endpoint) {
                throw new Error('لم يُحدَّد عنوان خادم التنفيذ في CONFIG.remote.endpoint');
            }
            const started = performance.now();
            emit('running');
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), CONFIG.execution.timeoutMs + 3000);
            try {
                const res = await fetch(CONFIG.remote.endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...CONFIG.remote.headers },
                    body: JSON.stringify({ language, code, tests, stdin }),
                    signal: controller.signal,
                    credentials: 'same-origin',
                });
                if (!res.ok) throw new Error(`خادم التنفيذ أعاد الحالة ${res.status}`);
                const result = await res.json();
                return { ...result, durationMs: Math.round(performance.now() - started) };
            } catch (err) {
                return {
                    stdout: '',
                    error: { type: 'RunnerError', message: String(err.message || err), line: null, text: '' },
                    tests: null,
                    durationMs: Math.round(performance.now() - started),
                };
            } finally {
                clearTimeout(timer);
                emit('idle');
            }
        },
    };
}
