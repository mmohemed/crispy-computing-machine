/**
 * مشغّل Python داخل المتصفح.
 * - يعمل في Web Worker حتى لا تتجمد الصفحة.
 * - مهلة تنفيذ: إذا تجاوزها الكود يُنهى الـ Worker ويُعاد إنشاؤه عند التشغيل التالي.
 */
import { CONFIG } from '../core/config.js';

export function createPyodideRunner() {
    let worker = null;
    let ready = null;
    let seq = 0;
    const pending = new Map();
    const listeners = new Set();

    const emit = (status, detail) => listeners.forEach((fn) => fn(status, detail));

    function boot() {
        worker = new Worker(new URL('./pyodide-worker.js', import.meta.url));
        emit('loading');
        ready = new Promise((resolve, reject) => {
            worker.onmessage = (event) => {
                const msg = event.data;
                if (msg.type === 'ready') {
                    emit('ready', msg.version);
                    resolve();
                } else if (msg.type === 'init-error') {
                    emit('error', msg.message);
                    reject(new Error(msg.message));
                } else if (msg.type === 'result') {
                    const job = pending.get(msg.id);
                    if (job) {
                        pending.delete(msg.id);
                        job.resolve(msg.result);
                    }
                }
            };
            worker.onerror = (e) => {
                emit('error', e.message);
                reject(new Error(e.message || 'تعذّر تشغيل بيئة Python'));
            };
        });
        worker.postMessage({
            type: 'init',
            indexURL: CONFIG.pyodide.indexURL,
            harnessURL: new URL('./python_harness.py', import.meta.url).href,
        });
    }

    function reset() {
        if (worker) worker.terminate();
        worker = null;
        ready = null;
        for (const job of pending.values()) {
            job.resolve({
                stdout: '',
                error: { type: 'TimeoutError', message: `توقف التنفيذ بعد ${CONFIG.execution.timeoutMs / 1000} ثانية`, line: null, text: '' },
                tests: null,
            });
        }
        pending.clear();
    }

    return {
        language: 'python',

        onStatus(fn) {
            listeners.add(fn);
            return () => listeners.delete(fn);
        },

        isReady() {
            return Boolean(worker && ready);
        },

        async warmUp() {
            if (!worker) boot();
            return ready;
        },

        async run({ code, tests = null, stdin = null }) {
            if (!worker) boot();
            try {
                await ready;
            } catch (err) {
                reset();
                return {
                    stdout: '',
                    error: {
                        type: 'RunnerError',
                        message: 'تعذّر تحميل بيئة Python. تأكد من اتصالك بالإنترنت ثم أعد المحاولة.',
                        line: null,
                        text: '',
                    },
                    tests: null,
                    durationMs: 0,
                };
            }
            const id = ++seq;
            const started = performance.now();
            emit('running');
            const result = await new Promise((resolve) => {
                pending.set(id, { resolve });
                const timer = setTimeout(() => {
                    if (pending.has(id)) reset();
                }, CONFIG.execution.timeoutMs);
                pending.get(id).resolve = (r) => {
                    clearTimeout(timer);
                    resolve(r);
                };
                worker.postMessage({ type: 'run', id, code, tests, stdin });
            });
            emit('idle');
            return { ...result, durationMs: Math.round(performance.now() - started) };
        },
    };
}
