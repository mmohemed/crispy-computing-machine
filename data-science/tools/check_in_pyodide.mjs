#!/usr/bin/env node
/**
 * يشغّل كل أمثلة الدروس وحلولها وأسئلة "ما الناتج" داخل Pyodide الحقيقي (نفس محرك المتصفح)،
 * ويقارن الناتج بـ "النتيجة المتوقعة" المكتوبة في المحتوى.
 *
 * لماذا بالإضافة إلى check_content.py؟
 * Pyodide يعمل على WebAssembly بـ 32-bit، فقد تختلف بعض المخرجات عن CPython على جهاز 64-bit
 * (مثل نوع الأعداد الصحيحة الافتراضي في NumPy). هذه الأداة تضمن أن ما يراه الطالب في المتصفح
 * يطابق ما هو مكتوب في الدرس.
 *
 *   PYODIDE_DIR=/path/to/pyodide-0.27.7-full node tools/check_in_pyodide.mjs [course]
 *
 * PYODIDE_DIR: مجلد توزيعة Pyodide الكاملة (من إصدارات GitHub: pyodide-0.27.7.tar.bz2).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PYODIDE_DIR = process.env.PYODIDE_DIR;
const onlyCourse = process.argv[2] || null;

if (!PYODIDE_DIR || !existsSync(join(PYODIDE_DIR, 'pyodide.mjs'))) {
    console.error('حدد PYODIDE_DIR: مجلد توزيعة Pyodide الكاملة الذي يحتوي pyodide.mjs');
    process.exit(2);
}

const { loadPyodide } = await import(pathToFileURL(join(PYODIDE_DIR, 'pyodide.mjs')).href);
const pyodide = await loadPyodide({ indexURL: PYODIDE_DIR + '/' });
const ns = pyodide.globals.get('dict')();
pyodide.runPython(readFileSync(join(ROOT, 'js/runners/python_harness.py'), 'utf8'), { globals: ns });
const harnessRun = ns.get('run');
pyodide.runPython('import os, tempfile');

const lines = (v) => (v == null ? null : Array.isArray(v) ? v.join('\n') : String(v));
const errors = [];
const counts = { examples: 0, solutions: 0, predictions: 0, mistakes: 0 };

async function run(code, { tests = null, stdin = null, files = [] } = {}) {
    const dir = pyodide.runPython('d = tempfile.mkdtemp(); os.chdir(d); d');
    for (const rel of files) {
        pyodide.FS.writeFile(`${dir}/${basename(rel)}`, readFileSync(join(ROOT, rel)));
    }
    await pyodide.loadPackagesFromImports(code);
    if (tests) await pyodide.loadPackagesFromImports(tests);
    const res = harnessRun(code, tests, stdin);
    const out = res.toJs({ dict_converter: Object.fromEntries });
    res.destroy();
    return out;
}

function checkOutput(where, expected, res) {
    if (res.error) {
        errors.push(`${where}: خطأ في Pyodide: ${res.error.type}: ${res.error.message}`);
        return;
    }
    const exp = (lines(expected) || '').replace(/\n+$/, '');
    const act = res.stdout.replace(/\n+$/, '');
    if (exp !== act) errors.push(`${where}: الناتج في Pyodide لا يطابق المتوقع\n--- expected\n${exp}\n--- pyodide\n${act}`);
}

async function checkQuestion(where, q, files) {
    const f = [...files, ...(q.files || [])];
    if (q.type === 'predict_output') {
        counts.predictions += 1;
        const res = await run(lines(q.code), { files: f });
        const actual = res.error ? null : res.stdout.replace(/\n+$/, '');
        if (actual !== q.options[q.answer]) errors.push(`${where}: الإجابة (${q.options[q.answer]}) لا تطابق ناتج Pyodide (${actual})`);
    } else if (q.type === 'write_code' || q.type === 'fix_code') {
        counts.solutions += 1;
        const res = await run(lines(q.solution), { tests: lines(q.tests), files: f });
        if (res.error || !res.tests?.passed) errors.push(`${where}: الحل لا يجتاز الاختبارات في Pyodide: ${JSON.stringify(res.error || res.tests)}`);
    }
}

const catalog = JSON.parse(readFileSync(join(ROOT, 'content/catalog.json'), 'utf8'));
for (const course of catalog.courses) {
    if (onlyCourse && course.slug !== onlyCourse) continue;
    const dir = join(ROOT, 'content/lessons', course.slug);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).sort()) {
        const lesson = JSON.parse(readFileSync(join(dir, file), 'utf8'));
        const files = lesson.files || [];
        const where = `${course.slug}/${lesson.slug}`;
        for (const [i, sec] of lesson.sections.entries()) {
            if (sec.type === 'example' && sec.run !== false && (sec.language || 'python') === 'python') {
                counts.examples += 1;
                const res = await run(lines(sec.code), { stdin: lines(sec.stdin), files });
                if (sec.output_varies) {
                    if (res.error) errors.push(`${where} #${i}: خطأ في Pyodide: ${res.error.type}: ${res.error.message}`);
                } else checkOutput(`${where} #${i}`, sec.expected_output, res);
                if (sec.expects_chart && !(res.images || []).length) errors.push(`${where} #${i}: لم يُنتج رسماً في Pyodide`);
            }
            if (sec.type === 'mistakes') {
                for (const [j, m] of sec.items.entries()) {
                    if (!m.error_type) continue;
                    counts.mistakes += 1;
                    const res = await run(lines(m.wrong), { files });
                    const got = res.error ? res.error.type : null;
                    if (got !== m.error_type) errors.push(`${where} #${i} mistake ${j}: المتوقع ${m.error_type} وحدث في Pyodide ${got}`);
                }
            }
        }
        counts.solutions += 1;
        const ex = lesson.exercise;
        const res = await run(lines(ex.solution), { tests: lines(ex.tests), stdin: lines(ex.stdin), files });
        if (res.error || !res.tests?.passed) errors.push(`${where} exercise: الحل لا يجتاز الاختبارات في Pyodide: ${JSON.stringify(res.error || res.tests)}`);
        await checkQuestion(`${where} check`, lesson.check, files);
    }
    const quizzes = [...course.modules.map((m) => m.quiz), course.final_exam].filter((q) => q && q.status === 'published');
    for (const quiz of quizzes) {
        const data = JSON.parse(readFileSync(join(ROOT, 'content/quizzes', `${quiz.slug}.json`), 'utf8'));
        for (const q of data.questions) await checkQuestion(`quiz ${quiz.slug} ${q.id}`, q, []);
    }
}

const summary = Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ');
if (errors.length) {
    console.log(`✗ ${errors.length} اختلاف في Pyodide (${summary}):\n`);
    for (const e of errors) console.log(' -', e, '\n');
    process.exit(1);
}
console.log(`✓ كل المحتوى يعمل في Pyodide كما هو مكتوب: ${summary}`);
