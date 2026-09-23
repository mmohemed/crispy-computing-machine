-- ============================================================================
-- CodeWay · Data Science — مخطط قاعدة البيانات المقترح
--
-- كل جدول يقابل ملفات content/ الحالية مباشرة (slug = اسم الملف)، فالنقل
-- إلى Laravel أو أي Backend يتم بـ Seeder يقرأ ملفات JSON دون إعادة كتابة المحتوى.
-- الصيغة: PostgreSQL / MySQL 8 (أنواع JSON مدعومة في الاثنين).
-- ============================================================================

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,
    email           VARCHAR(190) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- catalog.json → track
CREATE TABLE tracks (
    id              BIGSERIAL PRIMARY KEY,
    slug            VARCHAR(80) NOT NULL UNIQUE,          -- data-science
    title           VARCHAR(160) NOT NULL,
    title_en        VARCHAR(160),
    description     TEXT
);

-- catalog.json → levels[]
CREATE TABLE levels (
    id              BIGSERIAL PRIMARY KEY,
    track_id        BIGINT NOT NULL REFERENCES tracks(id),
    number          SMALLINT NOT NULL,                    -- 0..10
    slug            VARCHAR(80) NOT NULL,
    title           VARCHAR(160) NOT NULL,
    title_en        VARCHAR(160),
    icon            VARCHAR(80),
    summary         TEXT,
    description     TEXT,
    outcome         TEXT,
    elective        BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (track_id, number)
);

-- catalog.json → courses[]  +  content/courses/{slug}.json (details)
CREATE TABLE courses (
    id              BIGSERIAL PRIMARY KEY,
    level_id        BIGINT NOT NULL REFERENCES levels(id),
    slug            VARCHAR(80) NOT NULL UNIQUE,
    code            VARCHAR(10) NOT NULL,                 -- C10
    title           VARCHAR(160) NOT NULL,
    title_en        VARCHAR(160),
    icon            VARCHAR(80),
    difficulty      VARCHAR(40) NOT NULL,
    hours           SMALLINT NOT NULL,
    summary         TEXT,
    details         JSON,                                 -- intro, description, objectives, prerequisites, audience, skills, assessment, projects, after
    sort_order      SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE course_prerequisites (
    course_id       BIGINT NOT NULL REFERENCES courses(id),
    required_id     BIGINT NOT NULL REFERENCES courses(id),
    PRIMARY KEY (course_id, required_id)
);

-- catalog.json → courses[].modules[]
CREATE TABLE modules (
    id              BIGSERIAL PRIMARY KEY,
    course_id       BIGINT NOT NULL REFERENCES courses(id),
    slug            VARCHAR(80) NOT NULL,
    title           VARCHAR(160) NOT NULL,
    title_en        VARCHAR(160),
    description     TEXT,
    sort_order      SMALLINT NOT NULL,
    UNIQUE (course_id, slug)
);

-- catalog.json → modules[].lessons[]  +  content/lessons/{course}/{slug}.json
CREATE TABLE lessons (
    id              BIGSERIAL PRIMARY KEY,
    module_id       BIGINT NOT NULL REFERENCES modules(id),
    slug            VARCHAR(80) NOT NULL UNIQUE,
    title           VARCHAR(160) NOT NULL,
    title_en        VARCHAR(160),
    minutes         SMALLINT NOT NULL,
    level_label     VARCHAR(40),
    objectives      JSON,
    sections        JSON,                                 -- concept / why / when / example / notes / mistakes
    summary         JSON,
    status          VARCHAR(20) NOT NULL DEFAULT 'planned', -- planned | published
    sort_order      SMALLINT NOT NULL
);

-- تمرين الدرس (lesson.exercise) وأسئلة الاختبارات (quiz.questions[]) وسؤال الفهم (lesson.check)
CREATE TABLE quizzes (
    id              BIGSERIAL PRIMARY KEY,
    slug            VARCHAR(80) NOT NULL UNIQUE,
    course_id       BIGINT NOT NULL REFERENCES courses(id),
    module_id       BIGINT REFERENCES modules(id),        -- NULL = الاختبار النهائي للكورس
    kind            VARCHAR(20) NOT NULL,                 -- module | final
    title           VARCHAR(160) NOT NULL,
    intro           JSON,
    pass_ratio      DECIMAL(3,2) NOT NULL DEFAULT 0.70,
    status          VARCHAR(20) NOT NULL DEFAULT 'planned'
);

CREATE TABLE exercises (
    id              BIGSERIAL PRIMARY KEY,
    lesson_id       BIGINT REFERENCES lessons(id),        -- تمرين أو سؤال فهم داخل درس
    quiz_id         BIGINT REFERENCES quizzes(id),        -- سؤال في اختبار
    related_lesson_id BIGINT REFERENCES lessons(id),      -- الدرس المقترح للمراجعة عند الخطأ
    external_id     VARCHAR(40),                          -- q1, q2 ... / exercise / check
    type            VARCHAR(20) NOT NULL,                 -- lesson_exercise | mcq | true_false | predict_output | write_code | fix_code
    language        VARCHAR(20) NOT NULL DEFAULT 'python',
    title           VARCHAR(200),
    prompt          JSON NOT NULL,
    code            TEXT,                                 -- كود السؤال (predict_output)
    starter_code    TEXT,
    tests           TEXT,                                 -- لا تُرسل للمتصفح عند التحويل إلى تنفيذ على الخادم
    solution        TEXT,
    hints           JSON,
    explanation     TEXT,
    answer          JSON,                                 -- رقم الخيار أو true/false
    sort_order      SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE exercise_options (
    id              BIGSERIAL PRIMARY KEY,
    exercise_id     BIGINT NOT NULL REFERENCES exercises(id),
    text            TEXT NOT NULL,
    is_correct      BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order      SMALLINT NOT NULL
);

-- catalog.json → projects[]
CREATE TABLE datasets (
    id              BIGSERIAL PRIMARY KEY,
    slug            VARCHAR(80) NOT NULL UNIQUE,
    title           VARCHAR(160) NOT NULL,
    source          TEXT NOT NULL,                        -- مولّدة تعليمياً / scikit-learn / رابط رسمي
    license         VARCHAR(120) NOT NULL,
    redistributable BOOLEAN NOT NULL DEFAULT TRUE,
    columns         JSON,                                 -- قاموس الأعمدة
    file_path       VARCHAR(255)
);

CREATE TABLE projects (
    id              BIGSERIAL PRIMARY KEY,
    slug            VARCHAR(80) NOT NULL UNIQUE,
    number          SMALLINT NOT NULL,
    level_id        BIGINT NOT NULL REFERENCES levels(id),
    dataset_id      BIGINT REFERENCES datasets(id),
    title           VARCHAR(160) NOT NULL,
    difficulty      VARCHAR(40) NOT NULL,
    spec            JSON NOT NULL,                        -- الفكرة، المشكلة، المطلوب، الخطوات، المخرجات، الإرشادات
    rubric          JSON,                                 -- معايير التقييم
    status          VARCHAR(20) NOT NULL DEFAULT 'planned'
);

-- ---------------------------------------------------------------- تقدّم الطالب
-- يقابل LocalProgressStore في js/core/progress-store.js
CREATE TABLE progress (
    user_id         BIGINT NOT NULL REFERENCES users(id),
    lesson_id       BIGINT NOT NULL REFERENCES lessons(id),
    status          VARCHAR(20) NOT NULL,                 -- completed
    completed_at    TIMESTAMP,
    PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE submissions (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    exercise_id     BIGINT REFERENCES exercises(id),
    project_id      BIGINT REFERENCES projects(id),
    code            TEXT,
    answer          JSON,
    passed          BOOLEAN,
    score           DECIMAL(5,2),
    feedback        TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_attempts (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    quiz_id         BIGINT NOT NULL REFERENCES quizzes(id),
    score           SMALLINT NOT NULL,
    total           SMALLINT NOT NULL,
    passed          BOOLEAN NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saved_code (
    user_id         BIGINT NOT NULL REFERENCES users(id),
    code_key        VARCHAR(160) NOT NULL,                -- مثل python-variables:exercise
    code            TEXT NOT NULL,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, code_key)
);

CREATE TABLE certificates (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    course_id       BIGINT REFERENCES courses(id),
    track_id        BIGINT REFERENCES tracks(id),
    verification_code VARCHAR(40) NOT NULL UNIQUE,
    issued_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE achievements (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    kind            VARCHAR(60) NOT NULL,                 -- first_lesson, module_passed, streak_7 ...
    points          INT NOT NULL DEFAULT 0,
    earned_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
