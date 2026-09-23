/**
 * إعدادات المنصة. هذا هو المكان الوحيد الذي يتغير عند ربط Backend لاحقاً.
 *
 * - runners: أي مشغّل يُستخدم لكل لغة ('pyodide' داخل المتصفح، أو 'remote' عبر API).
 * - remote.endpoint: عنوان API آمن لتنفيذ الكود (حاويات معزولة بلا شبكة وبحدود موارد).
 * - progress.backend: 'local' (متصفح الطالب) أو 'api' لاحقاً.
 */
export const CONFIG = {
    track: 'data-science',

    pyodide: {
        version: '0.27.7',
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/',
    },

    runners: {
        python: 'pyodide',
    },

    remote: {
        endpoint: null, // مثال لاحقاً: '/api/v1/run'
        headers: {},
    },

    execution: {
        timeoutMs: 12000,
    },

    progress: {
        backend: 'local',
        storageKey: 'codeway.ds.progress.v1',
    },

    quiz: {
        passRatio: 0.7,
    },
};
