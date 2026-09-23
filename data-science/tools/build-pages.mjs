#!/usr/bin/env node
/**
 * يولّد صفحات HTML الخفيفة لكل كورس ودرس واختبار منشور في content/catalog.json.
 *
 * الصفحات لا تحتوي المحتوى نفسه؛ فقط تحدد أي درس تعرض (data-course / data-lesson)
 * ثم يقرأ js/pages/*.js المحتوى من content/. بهذا يبقى المحتوى في مكان واحد.
 *
 *   node tools/build-pages.mjs
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(join(ROOT, 'content/catalog.json'), 'utf8'));

const CDN = {
    fontawesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    fonts: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Tajawal:wght@300;400;500;700;800;900&display=swap',
    cm: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function head({ title, description, root, editor }) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <meta name="theme-color" content="#0a0f1f">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="${CDN.fonts}">
    <link rel="stylesheet" href="${CDN.fontawesome}">
${editor ? `    <link rel="stylesheet" href="${CDN.cm}/codemirror.min.css">\n` : ''}    <link rel="stylesheet" href="${root}css/tokens.css">
    <link rel="stylesheet" href="${root}css/base.css">
    <link rel="stylesheet" href="${root}css/components.css">
    <link rel="stylesheet" href="${root}css/lesson.css">
</head>`;
}

const editorScripts = `    <script src="${CDN.cm}/codemirror.min.js"></script>
    <script src="${CDN.cm}/mode/python/python.min.js"></script>
    <script src="${CDN.cm}/addon/edit/matchbrackets.min.js"></script>
    <script src="${CDN.cm}/addon/edit/closebrackets.min.js"></script>
    <script src="${CDN.cm}/addon/selection/active-line.min.js"></script>
`;

const noscript = '<noscript><div class="glass-card load-error"><h2>هذه الصفحة تحتاج JavaScript</h2><p>فعّل JavaScript في المتصفح لعرض الدروس وتشغيل الكود.</p></div></noscript>';

function coursePageHtml(course) {
    const root = '../';
    return `${head({ title: `${course.title} | CodeWay علم البيانات`, description: course.summary, root })}
<body data-page="course" data-root="${root}" data-course="${course.slug}">
    <header class="header" id="cw-header"></header>
    <main class="container" id="course-main">${noscript}</main>
    <footer class="footer" id="cw-footer"></footer>
    <script type="module" src="${root}js/pages/course.js"></script>
</body>
</html>
`;
}

function lessonPageHtml(course, lesson) {
    const root = '../../';
    return `${head({ title: `${lesson.title} | ${course.title} | CodeWay`, description: `${lesson.title} (${lesson.title_en}): درس من كورس ${course.title} في مسار CodeWay لعلم البيانات.`, root, editor: true })}
<body data-page="lesson" data-root="${root}" data-course="${course.slug}" data-lesson="${lesson.slug}">
    <header class="header" id="cw-header"></header>
    <div class="lesson-layout">
        <aside class="lesson-sidebar" id="lesson-sidebar" aria-label="محتوى الكورس"></aside>
        <main class="lesson-main" id="lesson-main">${noscript}</main>
    </div>
    <div class="sidebar-backdrop"></div>
    <footer class="footer" id="cw-footer"></footer>
${editorScripts}    <script type="module" src="${root}js/pages/lesson.js"></script>
</body>
</html>
`;
}

function quizPageHtml(course, quiz) {
    const root = '../';
    return `${head({ title: `${quiz.title} | ${course.title} | CodeWay`, description: `${quiz.title} في كورس ${course.title}.`, root, editor: true })}
<body data-page="quiz" data-root="${root}" data-quiz="${quiz.slug}">
    <header class="header" id="cw-header"></header>
    <main class="container" id="quiz-main" style="max-width:1000px">${noscript}</main>
    <footer class="footer" id="cw-footer"></footer>
${editorScripts}    <script type="module" src="${root}js/pages/quiz.js"></script>
</body>
</html>
`;
}

function projectPageHtml(project) {
    const root = '../';
    return `${head({ title: `${project.title} | مشاريع CodeWay`, description: project.problem, root, editor: true })}
<body data-page="project" data-root="${root}" data-project="${project.slug}">
    <header class="header" id="cw-header"></header>
    <main class="container" id="project-main">${noscript}</main>
    <footer class="footer" id="cw-footer"></footer>
${editorScripts}    <script type="module" src="${root}js/pages/project.js"></script>
</body>
</html>
`;
}

function write(rel, html, generated) {
    const path = join(ROOT, rel);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, html);
    generated.add(rel);
}

const generated = new Set();
for (const course of catalog.courses) {
    const lessons = course.modules.flatMap((m) => m.lessons);
    const published = lessons.filter((l) => l.status === 'published');
    if (!published.length) continue;

    write(`courses/course-${course.slug}.html`, coursePageHtml(course), generated);
    for (const lesson of published) {
        write(`lessons/${course.slug}/lesson-${lesson.slug}.html`, lessonPageHtml(course, lesson), generated);
    }
    const quizzes = [...course.modules.map((m) => m.quiz), course.final_exam].filter((q) => q && q.status === 'published');
    for (const quiz of quizzes) {
        write(`exercises/quiz-${quiz.slug}.html`, quizPageHtml(course, quiz), generated);
    }
}

for (const project of catalog.projects) {
    if (project.status === 'published') write(`projects/project-${project.slug}.html`, projectPageHtml(project), generated);
}

// حذف صفحات قديمة لم تعد منشورة
let removed = 0;
for (const dir of ['courses', 'exercises', 'projects']) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs)) {
        if (f.endsWith('.html') && !generated.has(`${dir}/${f}`)) { rmSync(join(abs, f)); removed += 1; }
    }
}
const lessonsDir = join(ROOT, 'lessons');
if (existsSync(lessonsDir)) {
    for (const c of readdirSync(lessonsDir)) {
        for (const f of readdirSync(join(lessonsDir, c))) {
            if (f.endsWith('.html') && !generated.has(`lessons/${c}/${f}`)) { rmSync(join(lessonsDir, c, f)); removed += 1; }
        }
    }
}

console.log(`generated ${generated.size} pages${removed ? `, removed ${removed} stale` : ''}`);
