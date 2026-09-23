# CodeWay Data Science: البنية التقنية

## المبادئ

1. **المحتوى بيانات، والصفحات قوالب.** كل درس ملف JSON واحد. صفحات HTML لكل درس صغيرة جداً ويولّدها `tools/build-pages.mjs`، وتحدد فقط أي درس تعرض.
2. **الهوية البصرية في مكان واحد.** `css/tokens.css` فيه الألوان والتدرجات والزوايا والخطوط الأصلية، وكل الملفات الأخرى تستخدم هذه المتغيرات.
3. **كل ما سيأتي من الخادم لاحقاً خلف واجهة ثابتة:** قراءة المحتوى (`js/core/catalog.js`)، والتقدّم (`js/core/progress-store.js`)، وتشغيل الكود (`js/runners/runner.js`).
4. **لا يُنشر محتوى لم يُتحقق منه.** `tools/check_content.py` يشغّل كل مثال وحل وخطأ شائع بنفس المحرك المستخدم في المتصفح.

## الملفات

```
data-science/
├── index.html                 بوابة المسار
├── roadmap.html               المنهج الكامل
├── courses/                   course-{slug}.html              (مولّدة)
├── lessons/{course}/          lesson-{slug}.html              (مولّدة)
├── exercises/                 quiz-{slug}.html                (مولّدة)
├── content/                   JSON: المصدر الوحيد للمحتوى (انظر CONTENT-SCHEMA.md)
├── css/
│   ├── tokens.css             Design tokens
│   ├── base.css               الخلفية المتحركة، الهيدر، القوائم، الفوتر، التجاوب
│   ├── components.css         Hero، الأزرار، البطاقات، التقدّم، مسار التعلم، المستويات
│   └── lesson.css             صفحة الكورس، صفحة الدرس، المحرر، الأسئلة
├── js/
│   ├── core/                  config · paths · dom · catalog · progress-store
│   ├── components/            layout · blocks · code-editor · quiz
│   ├── runners/               runner · pyodide-runner · pyodide-worker · python_harness.py · remote-runner
│   └── pages/                 boot · landing · roadmap · course · lesson · quiz
├── tools/                     build-pages.mjs · check_content.py
└── docs/                      هذا الملف · CONTENT-SCHEMA.md · db-schema.sql
```

## تدفق الصفحة

```
lesson-python-variables.html
  <body data-course="python-basics" data-lesson="python-variables" data-root="../../">
        │
        ▼
js/pages/lesson.js ── boot() ── catalog.json ──► الهيدر والفوتر (layout.js)
        │
        ├── content/lessons/python-basics/python-variables.json
        ├── progress-store  ──► ✓ / ▶ / 🔒 في الـ Sidebar وزر الإكمال
        └── code-editor ──► runner.run() ──► Pyodide Worker ──► python_harness.run()
```

## تشغيل الكود

| المشغّل | أين يُنفَّذ الكود | متى |
|---|---|---|
| `pyodide` | داخل متصفح الطالب (WebAssembly في Web Worker) | الافتراضي الآن لـ Python |
| `remote` | خادم تنفيذ معزول عبر `POST CONFIG.remote.endpoint` | عند إضافة Backend |

- **العقد الموحد:** `run({ code, tests, stdin })` تُرجع `{ stdout, error: {type, message, line, text} | null, tests: {passed, message} | null, durationMs }`.
- **المهلة:** 12 ثانية (`CONFIG.execution.timeoutMs`). عند تجاوزها يُنهى الـ Worker ويُنشأ غيره عند التشغيل التالي، لذلك لا تتجمد الصفحة مع حلقة لا نهائية.
- **المكتبات:** `loadPackagesFromImports` يحمّل NumPy و Pandas و Matplotlib و Scikit-learn من CDN الخاص بـ Pyodide عند استيرادها أول مرة.
- **`python_harness.py`** هو نفسه في المتصفح وفي أداة الفحص: يلتقط المخرجات، ويوحّد شكل الأخطاء، ويدعم `input()` من مربع المدخلات، ويشغّل اختبارات التمرين مع `__output__` و `__code__`.
- **ملفات البيانات:** الدرس أو السؤال أو المشروع يحدد `files: ["datasets/store_sales.csv"]`، فيحمّلها الـ Worker مرة واحدة ويكتبها في نظام ملفات Pyodide قبل التشغيل، فيقرأها الكود باسمها مباشرة.
- **الرسوم:** الـ harness يستخدم واجهة Matplotlib الخلفية `Agg`، ويحوّل كل رسم إلى صورة PNG يعرضها المحرر أسفل المخرجات.
- **لغات أخرى:** SQL (مستوى 4) تُضاف بمشغّل `sqljs` (SQLite بتقنية WebAssembly) يطبق نفس الدالة `run()` ويُسجَّل في `runner.js` و `CONFIG.runners.sql`.

### متطلبات أمان خادم التنفيذ (remote)

- حاوية جديدة لكل تنفيذ (Docker مع gVisor، أو Firecracker، أو Judge0 مُدار)، بمستخدم غير root.
- بلا شبكة، ونظام ملفات للقراءة فقط مع مجلد مؤقت صغير يُحذف بعد التنفيذ.
- حدود: CPU (ثانية إلى ثانيتين)، وذاكرة (256MB)، وعدد عمليات، وحجم مخرجات.
- الاختبارات `tests` تبقى على الخادم عند استخدامه ولا تُرسل للمتصفح.
- لا يُنفّذ كود الطالب أبداً داخل عملية تطبيق Laravel نفسها (لا `exec` ولا `shell_exec` على كود المستخدم).

## التقدّم

`ProgressStore` (الآن `LocalProgressStore` في متصفح الطالب):

| الدالة | لاحقاً في الـ API |
|---|---|
| `markComplete(lesson)` / `isCompleted` | جدول `progress` |
| `saveExercise(lesson, passed)` | جدول `submissions` |
| `saveQuizAttempt(quiz, {score,total,passed})` | جدول `quiz_attempts` |
| `saveCode(key, code)` / `getCode` | جدول `saved_code` |
| `setLast(course, lesson)` | "تابع من حيث توقفت" |

**سياسة القفل:** الدروس داخل الكورس تُفتح بالتتابع. الدرس المقفل يعرض بوابة فيها "اذهب إلى درسك الحالي" أو "اعرض الدرس على أي حال" (قفل مرن للمتعلم صاحب الخبرة). المستويات والكورسات **موصى بترتيبها وليست مقفلة**.

## الربط مع Laravel لاحقاً

1. **Seeder** يقرأ `content/catalog.json` وملفات الدروس ويملأ الجداول في `db-schema.sql`.
2. **API للقراءة:** `GET /api/v1/catalog`، `GET /api/v1/courses/{slug}`، `GET /api/v1/lessons/{course}/{slug}`، `GET /api/v1/quizzes/{slug}`، بنفس أشكال JSON الحالية. التعديل الوحيد في الواجهة هو دالة `loadJSON` في `catalog.js`.
3. **API للتقدّم:** `ApiProgressStore` بنفس دوال `LocalProgressStore`.
4. **التنفيذ:** `CONFIG.runners.python = 'remote'` و `CONFIG.remote.endpoint = '/api/v1/run'`.
5. **المسارات:** Blade/Inertia تعرض نفس القوالب على `/data-science/courses/{slug}` و `/data-science/lessons/{course}/{slug}`.

## التحقق من المحتوى

| الأداة | ماذا تفعل |
|---|---|
| `tools/check_content.py` | اكتمال كل درس واختبار ومشروع، والنصوص الوهمية، وتشغيل كل مثال وحل وخطأ شائع بـ CPython |
| `tools/check_in_pyodide.mjs` | تشغيل نفس المحتوى داخل Pyodide الحقيقي (WebAssembly 32-bit) ومقارنة المخرجات حرفياً |

الفحص الثاني كشف فروقاً حقيقية بين المنصتين، وعولجت في الدروس نفسها: النوع الافتراضي للأعداد الصحيحة في NumPy (`int32` في المتصفح)، وحجم الذاكرة في `info()`، وسلوك المصفوفة المنفردة، وترتيب القيم المتساوية في الفرز.

## المشاريع

`content/projects/{slug}.json` فيه: الفكرة، والمشكلة، وأسئلة العمل، والـ Dataset مع قاموس أعمدته، والمطلوب، والمهارات، و**دورة حياة المشروع** (مراحل، لكل مرحلة هدف ومهام وتلميح وحل نموذجي يُشغَّل بعد `solution_prelude`)، و**نقاط تحقق** تُصحّح تلقائياً، وكود مساحة العمل، والمخرجات، ومعايير التقييم (مجموع أوزانها 100). الصفحة `projects/project-{slug}.html` يولّدها `build-pages.mjs` للمشاريع المنشورة.

## إضافة درس جديد

1. أنشئ `content/lessons/{course}/{slug}.json` حسب `CONTENT-SCHEMA.md`.
2. غيّر `status` للدرس في `catalog.json` إلى `"published"`.
3. `node tools/build-pages.mjs` لتوليد الصفحة.
4. `python3 tools/check_content.py`، ولا يُنشر الدرس إلا إذا نجح الفحص.
