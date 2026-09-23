/* eslint-env worker */
/**
 * Web Worker يشغّل Python عبر Pyodide (WebAssembly) داخل متصفح الطالب.
 * لا يصل أي كود إلى السيرفر. إذا علق الكود (حلقة لا نهائية) يُنهي المشغّل هذا الـ Worker.
 */
let pyodide = null;
let runFn = null;
let readyPromise = null;
const fileCache = new Map();

/** يكتب ملفات البيانات (مثل datasets/store_sales.csv) في نظام ملفات Pyodide قبل التشغيل. */
async function writeFiles(files) {
    for (const f of files || []) {
        if (!fileCache.has(f.url)) {
            const res = await fetch(f.url);
            if (!res.ok) throw new Error(`تعذّر تحميل ملف البيانات ${f.name} (${res.status})`);
            fileCache.set(f.url, new Uint8Array(await res.arrayBuffer()));
        }
        pyodide.FS.writeFile(f.name, fileCache.get(f.url));
    }
}

async function init(indexURL, harnessURL) {
    importScripts(indexURL + 'pyodide.js');
    pyodide = await self.loadPyodide({ indexURL });
    const harness = await (await fetch(harnessURL)).text();
    const ns = pyodide.globals.get('dict')();
    pyodide.runPython(harness, { globals: ns });
    runFn = ns.get('run');
    self.postMessage({ type: 'ready', version: pyodide.version });
}

self.onmessage = async (event) => {
    const msg = event.data;

    if (msg.type === 'init') {
        readyPromise = init(msg.indexURL, msg.harnessURL).catch((err) => {
            self.postMessage({ type: 'init-error', message: String(err && err.message ? err.message : err) });
            throw err;
        });
        return;
    }

    if (msg.type === 'run') {
        try {
            await readyPromise;
            // تحميل المكتبات المستوردة تلقائياً (numpy, pandas, ...) عند الحاجة
            await writeFiles(msg.files);
            await pyodide.loadPackagesFromImports(msg.code);
            if (msg.tests) await pyodide.loadPackagesFromImports(msg.tests);
            const pyResult = runFn(msg.code, msg.tests || null, msg.stdin || null);
            const result = pyResult.toJs({ dict_converter: Object.fromEntries });
            pyResult.destroy();
            self.postMessage({ type: 'result', id: msg.id, result });
        } catch (err) {
            self.postMessage({
                type: 'result',
                id: msg.id,
                result: {
                    stdout: '',
                    error: { type: 'RunnerError', message: String(err && err.message ? err.message : err), line: null, text: '' },
                    tests: null,
                },
            });
        }
    }
};
