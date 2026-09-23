/**
 * تتبع تقدّم الطالب.
 *
 * الواجهة (ProgressStore) ثابتة، والتخزين قابل للتبديل:
 *   - LocalProgressStore: متصفح الطالب (الآن).
 *   - لاحقاً ApiProgressStore بنفس الدوال يكتب في جداول progress و submissions.
 *
 * سياسة القفل: الدروس داخل الكورس تُفتح بالتتابع (✓ مكتمل، ▶ الحالي، 🔒 مقفل).
 * المستويات والكورسات موصى بترتيبها لكنها غير مقفلة.
 */
import { CONFIG } from './config.js';
import { courseLessons, isPublished } from './catalog.js';

class LocalProgressStore {
    constructor(key) {
        this.key = key;
        this.memory = null;
        this.state = this._load();
    }

    _empty() {
        return { version: 1, lessons: {}, exercises: {}, quizzes: {}, code: {}, last: null };
    }

    _load() {
        try {
            const raw = window.localStorage.getItem(this.key);
            if (raw) return { ...this._empty(), ...JSON.parse(raw) };
        } catch (e) {
            // التخزين غير متاح (نافذة خاصة مثلاً): نكمل في الذاكرة.
        }
        return this._empty();
    }

    _save() {
        try {
            window.localStorage.setItem(this.key, JSON.stringify(this.state));
        } catch (e) {
            // يبقى التقدم في الذاكرة لهذه الجلسة فقط.
        }
        window.dispatchEvent(new CustomEvent('cw:progress'));
    }

    isCompleted(lesson) {
        return Boolean(this.state.lessons[lesson]?.completedAt);
    }

    markComplete(lesson) {
        if (!this.isCompleted(lesson)) {
            this.state.lessons[lesson] = { completedAt: new Date().toISOString() };
            this._save();
        }
    }

    markIncomplete(lesson) {
        delete this.state.lessons[lesson];
        this._save();
    }

    saveExercise(lesson, passed) {
        const prev = this.state.exercises[lesson] || { attempts: 0, passed: false };
        this.state.exercises[lesson] = { attempts: prev.attempts + 1, passed: prev.passed || passed };
        this._save();
    }

    getExercise(lesson) {
        return this.state.exercises[lesson] || null;
    }

    saveQuizAttempt(quiz, { score, total, passed }) {
        const prev = this.state.quizzes[quiz] || { attempts: 0, best: 0, passed: false };
        this.state.quizzes[quiz] = {
            attempts: prev.attempts + 1,
            best: Math.max(prev.best, score),
            total,
            passed: prev.passed || passed,
            lastAt: new Date().toISOString(),
        };
        this._save();
    }

    getQuiz(quiz) {
        return this.state.quizzes[quiz] || null;
    }

    saveCode(key, code) {
        this.state.code[key] = code;
        try {
            window.localStorage.setItem(this.key, JSON.stringify(this.state));
        } catch (e) { /* ignore */ }
    }

    getCode(key) {
        return this.state.code[key] ?? null;
    }

    clearCode(key) {
        delete this.state.code[key];
        this._save();
    }

    setLast(course, lesson) {
        this.state.last = { course, lesson, at: new Date().toISOString() };
        this._save();
    }

    getLast() {
        return this.state.last;
    }
}

export const progress = new LocalProgressStore(CONFIG.progress.storageKey);

/**
 * حالة كل درس في الكورس:
 * completed | current | locked | planned
 */
export function lessonStates(course) {
    const states = {};
    let currentAssigned = false;
    for (const lesson of courseLessons(course)) {
        if (!isPublished(lesson)) {
            states[lesson.slug] = 'planned';
        } else if (progress.isCompleted(lesson.slug)) {
            states[lesson.slug] = 'completed';
        } else if (!currentAssigned) {
            states[lesson.slug] = 'current';
            currentAssigned = true;
        } else {
            states[lesson.slug] = 'locked';
        }
    }
    return states;
}

export function courseProgress(course) {
    const lessons = courseLessons(course).filter(isPublished);
    const done = lessons.filter((l) => progress.isCompleted(l.slug)).length;
    return {
        done,
        total: lessons.length,
        percent: lessons.length ? Math.round((done / lessons.length) * 100) : 0,
    };
}

export function moduleProgress(module) {
    const lessons = module.lessons.filter(isPublished);
    const done = lessons.filter((l) => progress.isCompleted(l.slug)).length;
    return { done, total: lessons.length, percent: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}

/** الدرس الذي يجب أن يكمل منه الطالب في هذا الكورس (أو null إذا أنهى المنشور كله). */
export function currentLesson(course) {
    const states = lessonStates(course);
    return courseLessons(course).find((l) => states[l.slug] === 'current') || null;
}

export const STATUS_ICON = {
    completed: '<span class="status-icon completed" title="مكتمل"><i class="fas fa-check"></i></span>',
    current: '<span class="status-icon current" title="الدرس الحالي"><i class="fas fa-play"></i></span>',
    locked: '<span class="status-icon locked" title="مقفل: أكمل الدروس السابقة"><i class="fas fa-lock"></i></span>',
    planned: '<span class="status-icon planned" title="ضمن المنهج"><i class="far fa-circle"></i></span>',
    quiz: '<span class="status-icon" title="اختبار"><i class="fas fa-clipboard-check"></i></span>',
    quizPassed: '<span class="status-icon completed" title="اجتزت الاختبار"><i class="fas fa-clipboard-check"></i></span>',
};

export function progressBar(p, { label = true } = {}) {
    return `<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p.percent}">
        <div class="progress-track"><div class="progress-fill" style="width:${p.percent}%"></div></div>
        ${label ? `<span class="progress-label">${p.percent}%</span>` : ''}
    </div>`;
}
