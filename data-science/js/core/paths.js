/**
 * توليد الروابط. كل صفحة تعرّف data-root في <body> (المسافة إلى جذر data-science/).
 * نفس أنماط الروابط يستخدمها tools/build-pages.mjs عند توليد الصفحات.
 */
export const ROOT = document.body.dataset.root || './';

export const url = (path = '') => ROOT + path;

export const coursePage = (course) => url(`courses/course-${course}.html`);

export const lessonPage = (course, lesson) => url(`lessons/${course}/lesson-${lesson}.html`);

export const quizPage = (quiz) => url(`exercises/quiz-${quiz}.html`);

export const roadmapPage = (anchor = '') => url(`roadmap.html${anchor ? '#' + anchor : ''}`);

export const homePage = (anchor = '') => url(`index.html${anchor ? '#' + anchor : ''}`);

export const contentUrl = (path) => url(`content/${path}`);
