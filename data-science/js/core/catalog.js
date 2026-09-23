/**
 * قراءة المحتوى. كل الدوال هنا تقرأ ملفات JSON من content/.
 * عند الانتقال إلى Backend يكفي أن تُرجع نفس الأشكال من API (مثلاً /api/v1/catalog).
 */
import { contentUrl } from './paths.js';

const cache = new Map();

export async function loadJSON(path) {
    if (!cache.has(path)) {
        cache.set(path, fetch(contentUrl(path)).then((res) => {
            if (!res.ok) throw new Error(`تعذّر تحميل ${path} (${res.status})`);
            return res.json();
        }));
    }
    return cache.get(path);
}

export const loadCatalog = () => loadJSON('catalog.json');
export const loadCourseDetails = (course) => loadJSON(`courses/${course}.json`);
export const loadLesson = (course, lesson) => loadJSON(`lessons/${course}/${lesson}.json`);
export const loadQuiz = (quiz) => loadJSON(`quizzes/${quiz}.json`);

export const isPublished = (item) => item && item.status === 'published';

export function getCourse(catalog, slug) {
    return catalog.courses.find((c) => c.slug === slug) || null;
}

export function getLevel(catalog, number) {
    return catalog.levels.find((l) => l.number === number) || null;
}

/** كل دروس الكورس بالترتيب، مع معلومات الوحدة. */
export function courseLessons(course) {
    const out = [];
    course.modules.forEach((mod, mi) => {
        mod.lessons.forEach((lesson, li) => {
            out.push({ ...lesson, module: mod, moduleIndex: mi, indexInModule: li, index: out.length });
        });
    });
    return out;
}

export function publishedLessons(course) {
    return courseLessons(course).filter(isPublished);
}

export function courseCounts(course) {
    const lessons = courseLessons(course);
    return {
        modules: course.modules.length,
        lessons: lessons.length,
        published: lessons.filter(isPublished).length,
        minutes: lessons.reduce((s, l) => s + (l.minutes || 0), 0),
        quizzes: course.modules.filter((m) => m.quiz).length + (course.final_exam ? 1 : 0),
    };
}

export function isCoursePublished(course) {
    return courseLessons(course).some(isPublished);
}

/** أرقام حقيقية تُحسب من المحتوى المنشور (لا أرقام مستخدمين مفترضة). */
export function catalogStats(catalog) {
    let lessons = 0;
    let published = 0;
    let quizzes = 0;
    for (const c of catalog.courses) {
        const counts = courseCounts(c);
        lessons += counts.lessons;
        published += counts.published;
        quizzes += c.modules.filter((m) => isPublished(m.quiz)).length;
    }
    return {
        levels: catalog.levels.length,
        courses: catalog.courses.length,
        lessons,
        published,
        quizzes,
        projects: catalog.projects.length,
    };
}

export function levelOfCourse(catalog, course) {
    return getLevel(catalog, course.level);
}
