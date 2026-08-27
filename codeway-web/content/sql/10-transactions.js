'use strict';

module.exports = {
  slug: '10-transactions',
  title: 'المعاملات وسلامة البيانات ومشروع',
  summary: 'ضمان تنفيذ العمليات المترابطة كوحدة واحدة، ومستويات العزل، ثم مشروع قاعدة بيانات متكامل.',
  duration: 90,
  level: 'متقدم',
  tags: ['المعاملات', 'مشروع'],
  objectives: [
    'تستخدم المعاملات لضمان اتساق البيانات.',
    'تفهم خصائص ACID الأربع.',
    'تعرف مستويات العزل ومشكلات التزامن.',
    'تتعامل مع الأقفال والجمود.',
    'تبني قاعدة بيانات كاملة لمشروع حقيقي.'
  ],
  quickRef: [
    { code: 'BEGIN;', desc: 'بدء معاملة' },
    { code: 'COMMIT;', desc: 'تثبيت التغييرات' },
    { code: 'ROLLBACK;', desc: 'التراجع عن الكل' },
    { code: 'SAVEPOINT name', desc: 'نقطة حفظ داخلية' },
    { code: 'SELECT … FOR UPDATE', desc: 'قفل الصفوف' },
    { code: 'SET TRANSACTION ISOLATION', desc: 'مستوى العزل' }
  ],
  blocks: [
    { t: 'h2', text: 'المشكلة: العمليات نصف المكتملة' },
    { t: 'p', text: 'تحويل مبلغ بين حسابين يتطلّب عمليتين: خصم من الأول وإضافة للثاني. ماذا لو انقطعت الكهرباء بينهما؟ اختفى المال.' },
    { t: 'code', lang: 'sql', code: `
-- ✗ خطر: عمليتان منفصلتان
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
-- 💥 انقطاع هنا يعني ضياع 1000 ريال
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;` },
    { t: 'code', lang: 'sql', title: 'الحل: معاملة', code: `
BEGIN;

UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;

COMMIT;   -- إمّا تنجح العمليتان معاً أو لا شيء` },
    { t: 'p', text: 'المعاملة تجعل مجموعة العمليات **وحدة ذرّية**: إمّا تُنفَّذ كلها أو لا تُنفَّذ أي منها. لا حالة وسطى.' },

    { t: 'h2', text: 'خصائص ACID' },
    { t: 'features', items: [
      { icon: 'box', title: 'الذرّية (Atomicity)', text: 'كل العمليات أو لا شيء. فشل واحدة يُلغي الجميع.' },
      { icon: 'shield', title: 'الاتساق (Consistency)', text: 'القاعدة تنتقل من حالة صحيحة إلى حالة صحيحة، وكل القيود محفوظة.' },
      { icon: 'users', title: 'العزل (Isolation)', text: 'المعاملات المتزامنة لا يرى بعضها التغييرات غير المثبَّتة.' },
      { icon: 'database', title: 'الديمومة (Durability)', text: 'بعد `COMMIT` تبقى البيانات حتى لو انقطعت الكهرباء فوراً.' }
    ]},

    { t: 'h2', text: 'التحكّم في المعاملة' },
    { t: 'code', lang: 'sql', code: `
BEGIN;                    -- أو START TRANSACTION

  UPDATE products SET stock = stock - 2 WHERE id = 5;
  INSERT INTO order_items (order_id, product_id, quantity)
  VALUES (101, 5, 2);

COMMIT;                   -- تثبيت

-- أو التراجع
BEGIN;
  DELETE FROM orders WHERE id = 101;
ROLLBACK;                 -- كأن شيئاً لم يكن` },
    { t: 'code', lang: 'sql', title: 'نقاط الحفظ', code: `
BEGIN;

  INSERT INTO orders (customer_id, total) VALUES (1, 0);
  SAVEPOINT order_created;

  INSERT INTO order_items (order_id, product_id, quantity)
  VALUES (101, 999, 1);       -- منتج غير موجود

  ROLLBACK TO SAVEPOINT order_created;   -- تراجع جزئي

  INSERT INTO order_items (order_id, product_id, quantity)
  VALUES (101, 5, 1);         -- المنتج الصحيح

COMMIT;` },
    { t: 'tip', text: 'نقاط الحفظ مفيدة في العمليات الطويلة: تتراجع عن جزء دون إلغاء كل ما أنجزته قبله.' },

    { t: 'h2', text: 'مشكلات التزامن' },
    { t: 'table', head: ['المشكلة', 'ما يحدث'], rows: [
      ['**القراءة الوسخة** (Dirty Read)', 'معاملة تقرأ بيانات لم تُثبَّت بعد، وقد يُتراجَع عنها'],
      ['**القراءة غير المتكرّرة**', 'قراءة نفس الصف مرتين تعطي نتيجتين مختلفتين'],
      ['**القراءة الشبحية** (Phantom)', 'تكرار نفس الاستعلام يُرجع صفوفاً جديدة أضافها آخرون'],
      ['**التحديث المفقود**', 'معاملتان تحدّثان نفس الصف فيضيع أحد التحديثين']
    ]},
    { t: 'demo', title: 'التحديث المفقود', height: 320,
      css: 'table{width:100%;border-collapse:collapse;font-size:.82em}th{background:#6a5acd;color:#fff;padding:7px 9px;text-align:right}td{padding:6px 9px;border-bottom:1px solid #e2e8f0;vertical-align:top}.a{background:#eef2ff}.b{background:#fef3c7}.r{color:#dc2626;font-weight:700}',
      html: '<table><tr><th>الوقت</th><th>المعاملة أ</th><th>المعاملة ب</th></tr><tr><td>1</td><td class="a">قرأت stock = 10</td><td></td></tr><tr><td>2</td><td></td><td class="b">قرأت stock = 10</td></tr><tr><td>3</td><td class="a">كتبت stock = 10 − 2 = 8</td><td></td></tr><tr><td>4</td><td></td><td class="b">كتبت stock = 10 − 3 = 7</td></tr><tr><td>5</td><td colspan="2" class="r">النتيجة 7 — والصحيح 5! ضاع خصم المعاملة أ</td></tr></table>' },
    { t: 'code', lang: 'sql', title: 'الحلّان', code: `
-- ✓ الحل 1: تحديث ذرّي — الأبسط والأفضل
UPDATE products SET stock = stock - 2 WHERE id = 5 AND stock >= 2;

-- ✓ الحل 2: قفل الصف
BEGIN;
  SELECT stock FROM products WHERE id = 5 FOR UPDATE;
  -- الصف مقفل الآن، أي معاملة أخرى تنتظر
  UPDATE products SET stock = 8 WHERE id = 5;
COMMIT;` },

    { t: 'h2', text: 'مستويات العزل' },
    { t: 'table', head: ['المستوى', 'قراءة وسخة', 'غير متكرّرة', 'شبحية', 'الأداء'], rows: [
      ['`READ UNCOMMITTED`', 'ممكنة', 'ممكنة', 'ممكنة', 'الأسرع'],
      ['`READ COMMITTED`', 'لا', 'ممكنة', 'ممكنة', 'سريع — افتراضي PostgreSQL'],
      ['`REPEATABLE READ`', 'لا', 'لا', 'ممكنة', 'متوسّط — افتراضي MySQL'],
      ['`SERIALIZABLE`', 'لا', 'لا', 'لا', 'الأبطأ — عزل كامل']
    ]},
    { t: 'code', lang: 'sql', code: `
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

BEGIN;
  -- عملياتك
COMMIT;` },
    { t: 'tip', text: 'المستوى الافتراضي يكفي في 95٪ من الحالات. ارفعه فقط للعمليات المالية الحرجة، وتذكّر أن العزل الأعلى يعني تنافساً أكبر على الأقفال وأداءً أقل.' },

    { t: 'h2', text: 'الأقفال والجمود' },
    { t: 'code', lang: 'sql', code: `
-- قفل حصري للكتابة
SELECT * FROM products WHERE id = 5 FOR UPDATE;

-- قفل مشترك للقراءة
SELECT * FROM products WHERE id = 5 FOR SHARE;

-- بلا انتظار — يفشل فوراً إن كان مقفلاً
SELECT * FROM products WHERE id = 5 FOR UPDATE NOWAIT;

-- تخطّي المقفل
SELECT * FROM jobs WHERE status = 'pending'
FOR UPDATE SKIP LOCKED LIMIT 1;` },
    { t: 'danger', title: 'الجمود (Deadlock)', text: 'معاملة أ قفلت الصف 1 وتنتظر الصف 2، ومعاملة ب قفلت الصف 2 وتنتظر الصف 1. كلاهما ينتظر الآخر إلى الأبد. المحرّك يكتشف ذلك ويُفشل إحداهما.' },
    { t: 'code', lang: 'sql', title: 'الوقاية: ترتيب موحّد للقفل', code: `
-- ✓ اقفل دائماً بترتيب المعرّف تصاعدياً
BEGIN;
  SELECT * FROM accounts
  WHERE id IN (1, 2)
  ORDER BY id
  FOR UPDATE;

  UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
  UPDATE accounts SET balance = balance + 1000 WHERE id = 2;
COMMIT;` },
    { t: 'ul', items: [
      '**اقفل بترتيب موحّد** في كل الكود — أهم قاعدة وقائية.',
      '**اجعل المعاملات قصيرة**: لا تنتظر إدخال المستخدم داخل معاملة مفتوحة.',
      '**لا تستدعِ خدمات خارجية** داخل معاملة.',
      '**أعد المحاولة** عند اكتشاف الجمود — إنه أمر متوقّع لا خطأ برمجي.'
    ]},

    { t: 'h2', text: 'معاملة عملية كاملة' },
    { t: 'code', lang: 'sql', title: 'إتمام طلب شراء', code: `
BEGIN;

-- 1) قفل المنتجات المطلوبة بترتيب ثابت
SELECT id, stock, price
FROM products
WHERE id IN (5, 8)
ORDER BY id
FOR UPDATE;

-- 2) التحقّق من توفّر الكمية
-- يتم في كود التطبيق بعد قراءة النتيجة أعلاه

-- 3) إنشاء الطلب
INSERT INTO orders (customer_id, status, total)
VALUES (1, 'pending', 0)
RETURNING id;   -- 101

-- 4) إضافة العناصر بأسعار وقت الشراء
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT 101, id, 2, price FROM products WHERE id = 5
UNION ALL
SELECT 101, id, 1, price FROM products WHERE id = 8;

-- 5) خصم المخزون مع التحقّق الذرّي
UPDATE products SET stock = stock - 2 WHERE id = 5 AND stock >= 2;
UPDATE products SET stock = stock - 1 WHERE id = 8 AND stock >= 1;
-- إن أرجع أيّهما صفر صفوف، فالكمية غير كافية → ROLLBACK

-- 6) حساب الإجمالي
UPDATE orders
SET total = (
  SELECT SUM(quantity * unit_price)
  FROM order_items WHERE order_id = 101
)
WHERE id = 101;

-- 7) تأكيد الدفع
UPDATE orders
SET status = 'paid', paid_at = CURRENT_TIMESTAMP
WHERE id = 101 AND status = 'pending';

COMMIT;` },
    { t: 'note', text: 'لاحظ نمط `AND stock >= 2` في التحديث: يجعل التحقّق والخصم عملية ذرّية واحدة، فلا يمكن لمعاملة أخرى أن تتسلّل بينهما.' },

    { t: 'h2', text: 'المشروع: قاعدة بيانات منصة تعليمية' },
    { t: 'p', text: 'الآن تبني قاعدة بيانات كاملة تطبّق كل ما تعلّمته في المسار.' },
    { t: 'h3', text: 'المتطلّبات' },
    { t: 'table', head: ['الكيان', 'الوصف'], rows: [
      ['`instructors`', 'المدرّبون: الاسم، البريد، السيرة'],
      ['`categories`', 'تصنيفات هرمية (تصنيف رئيسي وفرعي)'],
      ['`courses`', 'الدورات: العنوان، السعر، المستوى، المدرّب، التصنيف'],
      ['`lessons`', 'دروس كل دورة بترتيب ومدة'],
      ['`students`', 'الطلاب'],
      ['`enrollments`', 'التسجيلات مع نسبة التقدّم'],
      ['`lesson_progress`', 'تقدّم الطالب في كل درس'],
      ['`reviews`', 'التقييمات والمراجعات'],
      ['`payments`', 'المدفوعات']
    ]},
    { t: 'h3', text: 'المطلوب' },
    { t: 'ol', items: [
      '**المخطّط**: كل الجداول بأنواع بيانات مناسبة وقيود كاملة.',
      '**العلاقات**: مفاتيح أجنبية بسلوك حذف مدروس لكل علاقة.',
      '**البيانات**: 5 مدرّبين، 10 دورات، 40 درساً، 20 طالباً، 50 تسجيلاً، 30 مراجعة.',
      '**الفهارس**: على كل المفاتيح الأجنبية وأعمدة البحث المتكرّرة.',
      '**العروض**: `course_stats` و `student_dashboard`.',
      '**التقارير**: عشرة استعلامات تحليلية.',
      '**المعاملة**: عملية تسجيل طالب في دورة مع الدفع كوحدة ذرّية.'
    ]},

    { t: 'exercise',
      title: 'المشروع الكامل',
      brief: 'ابنِ قاعدة بيانات المنصة التعليمية كاملة.',
      requirements: [
        'المخطّط كاملاً مع كل القيود.',
        'بيانات تجريبية واقعية بالأعداد المذكورة.',
        'كل الفهارس اللازمة مع تعليق يبرّر كلاً منها.',
        'العرضان المطلوبان.',
        'التقارير العشرة: أفضل الدورات، أنشط الطلاب، الإيراد الشهري، متوسّط التقييم لكل مدرّب، الدورات بلا تسجيلات، الطلاب المتعثّرون، شجرة التصنيفات، معدّل الإكمال، أفضل المدرّبين إيراداً، الدورات الأعلى تقييماً بأكثر من خمس مراجعات.',
        'معاملة التسجيل مع الدفع مع معالجة الفشل.'
      ],
      hints: [
        'التصنيفات الهرمية تحتاج `parent_id` يشير للجدول نفسه.',
        'استخدم `WITH RECURSIVE` لشجرة التصنيفات.',
        'معدّل الإكمال = عدد الدروس المكتملة ÷ إجمالي دروس الدورة.',
        'راجع دروس الفهارس والمعاملات قبل البدء.'
      ],
      solution: { lang: 'sql', code: `
-- ============ المخطّط ============

CREATE TABLE instructors (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(150) NOT NULL,
  email     VARCHAR(255) NOT NULL UNIQUE,
  bio       TEXT,
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id        SERIAL PRIMARY KEY,
  parent_id INT,
  name      VARCHAR(100) NOT NULL,
  slug      VARCHAR(100) NOT NULL UNIQUE,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE courses (
  id            SERIAL PRIMARY KEY,
  instructor_id INT NOT NULL,
  category_id   INT,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  price         DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  level         VARCHAR(20) NOT NULL DEFAULT 'beginner'
                CHECK (level IN ('beginner','intermediate','advanced')),
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE RESTRICT,
  FOREIGN KEY (category_id)   REFERENCES categories(id)  ON DELETE SET NULL
);

CREATE TABLE lessons (
  id           SERIAL PRIMARY KEY,
  course_id    INT NOT NULL,
  title        VARCHAR(200) NOT NULL,
  duration_min INT NOT NULL CHECK (duration_min > 0),
  position     INT NOT NULL,

  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE (course_id, position)
);

CREATE TABLE students (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE enrollments (
  id          SERIAL PRIMARY KEY,
  student_id  INT NOT NULL,
  course_id   INT NOT NULL,
  enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,

  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE,
  UNIQUE (student_id, course_id)
);

CREATE TABLE lesson_progress (
  id            SERIAL PRIMARY KEY,
  enrollment_id INT NOT NULL,
  lesson_id     INT NOT NULL,
  completed_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id)     REFERENCES lessons(id)     ON DELETE CASCADE,
  UNIQUE (enrollment_id, lesson_id)
);

CREATE TABLE reviews (
  id         SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  course_id  INT NOT NULL,
  rating     INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE,
  UNIQUE (student_id, course_id)
);

CREATE TABLE payments (
  id         SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  course_id  INT NOT NULL,
  amount     DECIMAL(8,2) NOT NULL CHECK (amount >= 0),
  method     VARCHAR(20) NOT NULL CHECK (method IN ('card','transfer','wallet')),
  status     VARCHAR(20) NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending','completed','failed','refunded')),
  paid_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE RESTRICT
);

-- ============ الفهارس ============

-- المفاتيح الأجنبية: تسرّع الربط والحذف
CREATE INDEX idx_courses_instructor  ON courses (instructor_id);
CREATE INDEX idx_courses_category    ON courses (category_id);
CREATE INDEX idx_lessons_course      ON lessons (course_id);
CREATE INDEX idx_enroll_student      ON enrollments (student_id);
CREATE INDEX idx_enroll_course       ON enrollments (course_id);
CREATE INDEX idx_progress_enrollment ON lesson_progress (enrollment_id);
CREATE INDEX idx_reviews_course      ON reviews (course_id);
CREATE INDEX idx_payments_student    ON payments (student_id);

-- البحث المتكرّر عن الدورات المنشورة
CREATE INDEX idx_courses_published ON courses (is_published, created_at DESC)
  WHERE is_published = TRUE;

-- تقارير الإيراد الشهري
CREATE INDEX idx_payments_date_status ON payments (paid_at, status);

-- ============ العروض ============

CREATE VIEW course_stats AS
SELECT
  c.id,
  c.title,
  c.price,
  c.level,
  i.name                                   AS instructor,
  COUNT(DISTINCT e.id)                     AS students_count,
  COUNT(DISTINCT l.id)                     AS lessons_count,
  COALESCE(SUM(l.duration_min), 0)         AS total_minutes,
  ROUND(AVG(r.rating), 2)                  AS avg_rating,
  COUNT(DISTINCT r.id)                     AS reviews_count
FROM courses c
JOIN instructors i        ON i.id = c.instructor_id
LEFT JOIN lessons l       ON l.course_id = c.id
LEFT JOIN enrollments e   ON e.course_id = c.id
LEFT JOIN reviews r       ON r.course_id = c.id
GROUP BY c.id, c.title, c.price, c.level, i.name;

CREATE VIEW student_dashboard AS
SELECT
  s.id            AS student_id,
  s.name          AS student_name,
  c.id            AS course_id,
  c.title         AS course_title,
  e.enrolled_at,
  COUNT(DISTINCT lp.lesson_id)                       AS completed_lessons,
  COUNT(DISTINCT l.id)                               AS total_lessons,
  ROUND(100.0 * COUNT(DISTINCT lp.lesson_id)
        / NULLIF(COUNT(DISTINCT l.id), 0), 1)        AS progress_pct
FROM students s
JOIN enrollments e         ON e.student_id = s.id
JOIN courses c             ON c.id = e.course_id
LEFT JOIN lessons l        ON l.course_id = c.id
LEFT JOIN lesson_progress lp
       ON lp.enrollment_id = e.id AND lp.lesson_id = l.id
GROUP BY s.id, s.name, c.id, c.title, e.enrolled_at;

-- ============ التقارير ============

-- 1) أفضل الدورات
SELECT title, students_count, avg_rating, instructor
FROM course_stats
ORDER BY students_count DESC
LIMIT 10;

-- 2) أنشط الطلاب
SELECT
  s.name,
  COUNT(DISTINCT e.course_id)      AS courses,
  COUNT(lp.id)                     AS lessons_completed
FROM students s
JOIN enrollments e      ON e.student_id = s.id
LEFT JOIN lesson_progress lp ON lp.enrollment_id = e.id
GROUP BY s.id, s.name
ORDER BY lessons_completed DESC
LIMIT 10;

-- 3) الإيراد الشهري
SELECT
  EXTRACT(YEAR  FROM paid_at) AS year,
  EXTRACT(MONTH FROM paid_at) AS month,
  COUNT(*)                    AS payments,
  ROUND(SUM(amount), 2)       AS revenue
FROM payments
WHERE status = 'completed'
GROUP BY 1, 2
ORDER BY 1, 2;

-- 4) متوسّط تقييم كل مدرّب
SELECT
  i.name,
  COUNT(DISTINCT c.id)     AS courses,
  ROUND(AVG(r.rating), 2)  AS avg_rating,
  COUNT(r.id)              AS reviews
FROM instructors i
JOIN courses c      ON c.instructor_id = i.id
LEFT JOIN reviews r ON r.course_id = c.id
GROUP BY i.id, i.name
HAVING COUNT(r.id) > 0
ORDER BY avg_rating DESC;

-- 5) الدورات بلا تسجيلات
SELECT c.id, c.title, c.price
FROM courses c
LEFT JOIN enrollments e ON e.course_id = c.id
WHERE e.id IS NULL AND c.is_published = TRUE;

-- 6) الطلاب المتعثّرون (أقل من 20٪ بعد شهر)
SELECT student_name, course_title, progress_pct, enrolled_at
FROM student_dashboard
WHERE progress_pct < 20
  AND enrolled_at < CURRENT_DATE - INTERVAL '30 days'
ORDER BY progress_pct;

-- 7) شجرة التصنيفات
WITH RECURSIVE tree AS (
  SELECT id, name, parent_id, 1 AS level, CAST(name AS TEXT) AS path
  FROM categories WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.name, c.parent_id, t.level + 1, t.path || ' > ' || c.name
  FROM categories c JOIN tree t ON t.id = c.parent_id
  WHERE t.level < 5
)
SELECT level, path FROM tree ORDER BY path;

-- 8) معدّل الإكمال لكل دورة
SELECT
  course_title,
  COUNT(*)                     AS enrollments,
  ROUND(AVG(progress_pct), 1)  AS avg_progress,
  SUM(CASE WHEN progress_pct = 100 THEN 1 ELSE 0 END) AS completed
FROM student_dashboard
GROUP BY course_id, course_title
ORDER BY avg_progress DESC;

-- 9) أفضل المدرّبين إيراداً
SELECT
  i.name,
  COUNT(DISTINCT p.id)   AS sales,
  ROUND(SUM(p.amount),2) AS revenue
FROM instructors i
JOIN courses c  ON c.instructor_id = i.id
JOIN payments p ON p.course_id = c.id AND p.status = 'completed'
GROUP BY i.id, i.name
ORDER BY revenue DESC;

-- 10) الأعلى تقييماً بأكثر من خمس مراجعات
SELECT title, avg_rating, reviews_count, students_count
FROM course_stats
WHERE reviews_count > 5
ORDER BY avg_rating DESC, reviews_count DESC;

-- ============ معاملة التسجيل مع الدفع ============

BEGIN;

  -- 1) تسجيل الدفعة
  INSERT INTO payments (student_id, course_id, amount, method, status)
  SELECT 3, 7, price, 'card', 'completed'
  FROM courses WHERE id = 7 AND is_published = TRUE;

  -- إن لم يُدرَج شيء فالدورة غير منشورة → ROLLBACK

  -- 2) إنشاء التسجيل
  INSERT INTO enrollments (student_id, course_id)
  VALUES (3, 7)
  ON CONFLICT (student_id, course_id) DO NOTHING;

  -- 3) التحقّق من النجاح قبل التثبيت
  -- في كود التطبيق: إن كان عدد الصفوف المتأثّرة صفراً → ROLLBACK

COMMIT;` },
      solutionNote: 'المشروع أساس حقيقي لأي منصة تعليمية. طوّره: أضف الشهادات، والاختبارات، والكوبونات، وسجلّ النشاط.'
    },

    { t: 'h2', text: 'ماذا بعد؟' },
    { t: 'p', text: 'أنهيت مسار SQL: التصميم والقيود والاستعلام والتجميع والربط والاستعلامات الفرعية والفهارس والمعاملات. هذه أساسيات صلبة تكفي لبناء وصيانة قواعد بيانات تطبيقات حقيقية.' },
    { t: 'ul', items: [
      '**دوال النوافذ** (`ROW_NUMBER`, `RANK`, `LAG`, `LEAD`) للتحليلات المتقدّمة.',
      '**التطبيع** (Normalization) وأشكاله الثلاثة الأولى.',
      '**الإجراءات المخزّنة والمشغّلات** (Triggers).',
      '**النسخ الاحتياطي والاستعادة** — لا تؤجّل تعلّمها.',
      '**التوسّع**: النسخ المتماثل (Replication) والتقسيم (Sharding).',
      '**قواعد NoSQL** ومتى تكون أنسب من العلائقية.'
    ]},

    { t: 'quiz', items: [
      { q: 'ما معنى «الذرّية» في ACID؟', options: ['السرعة', 'كل عمليات المعاملة تُنفَّذ أو لا يُنفَّذ أي منها', 'العزل', 'الحفظ'], answer: 1,
        explain: 'لا حالة وسطى: إمّا نجاح كامل أو تراجع كامل.' },
      { q: 'ما «التحديث المفقود»؟', options: ['حذف صف', 'معاملتان تقرآن ثم تكتبان فيضيع أحد التحديثين', 'خطأ اتصال', 'قفل'], answer: 1,
        explain: 'الحل: تحديث ذرّي `SET stock = stock - 2` أو قفل الصف بـ `FOR UPDATE`.' },
      { q: 'ما أفضل وقاية من الجمود (Deadlock)؟', options: ['معاملات أطول', 'قفل الموارد بترتيب موحّد في كل الكود', 'إلغاء الأقفال', 'عزل أقل'], answer: 1,
        explain: 'الترتيب الموحّد يمنع الانتظار المتبادل من الأساس.' },
      { q: 'ماذا يفعل `SELECT … FOR UPDATE`؟', options: ['يحدّث الصف', 'يقفل الصفوف فتنتظرها المعاملات الأخرى حتى انتهاء معاملتك', 'ينسخ الصف', 'يحذفه'], answer: 1,
        explain: 'قفل حصري يمنع القراءة للتحديث من معاملات أخرى.' },
      { q: 'لماذا يجب أن تبقى المعاملات قصيرة؟', options: ['للذاكرة', 'لأنها تحتفظ بالأقفال فتعطّل بقية المعاملات', 'للشبكة', 'للسجلّات'], answer: 1,
        explain: 'لا تنتظر إدخال مستخدم أو خدمة خارجية داخل معاملة مفتوحة.' }
    ]}
  ]
};
