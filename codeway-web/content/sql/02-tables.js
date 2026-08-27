'use strict';

module.exports = {
  slug: '02-tables',
  title: 'إنشاء الجداول وأنواع البيانات والقيود',
  summary: 'تصميم جداول سليمة: اختيار أنواع البيانات، وفرض القيود التي تحمي بياناتك من الفساد.',
  duration: 45,
  level: 'مبتدئ',
  tags: ['DDL', 'التصميم'],
  objectives: [
    'تنشئ جداول بأنواع بيانات مناسبة.',
    'تختار النوع الصحيح لكل عمود.',
    'تفرض قيود السلامة على البيانات.',
    'تعدّل بنية جدول قائم.',
    'تفهم سلوك NULL وتتعامل معه.'
  ],
  quickRef: [
    { code: 'CREATE TABLE t ( … )', desc: 'إنشاء جدول' },
    { code: 'INT / VARCHAR / DATE', desc: 'أنواع شائعة' },
    { code: 'PRIMARY KEY', desc: 'مفتاح أساسي' },
    { code: 'NOT NULL', desc: 'يمنع القيمة الفارغة' },
    { code: 'UNIQUE', desc: 'يمنع التكرار' },
    { code: 'DEFAULT value', desc: 'قيمة افتراضية' },
    { code: 'CHECK (cond)', desc: 'شرط على القيمة' },
    { code: 'FOREIGN KEY … REFERENCES', desc: 'ربط بجدول آخر' }
  ],
  blocks: [
    { t: 'h2', text: 'إنشاء جدول' },
    { t: 'code', lang: 'sql', code: `
CREATE TABLE products (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(200) NOT NULL,
  sku         VARCHAR(50)  NOT NULL UNIQUE,
  description TEXT,
  price       DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock       INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  category_id INT,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES categories(id)
);` },
    { t: 'p', text: 'كل سطر يعرّف عموداً: اسمه، ثم نوعه، ثم قيوده. والقيود التي تخصّ عدة أعمدة تُكتب في النهاية.' },

    { t: 'h2', text: 'أنواع البيانات' },
    { t: 'h3', text: 'الأرقام' },
    { t: 'table', head: ['النوع', 'المدى / الدقة', 'متى'], rows: [
      ['`TINYINT`', '−128 إلى 127', 'أعمار، تقييمات، حالات'],
      ['`SMALLINT`', '±32,767', 'كميات صغيرة'],
      ['`INT`', '±2.1 مليار', '**الافتراضي** للمعرّفات والعدّادات'],
      ['`BIGINT`', '±9.2 كوينتليون', 'معرّفات أنظمة ضخمة'],
      ['`DECIMAL(p,s)`', 'دقيق تماماً', '**الأموال** — بلا استثناء'],
      ['`FLOAT` / `DOUBLE`', 'تقريبي', 'قياسات علمية فقط']
    ]},
    { t: 'danger', title: 'لا تستخدم FLOAT للأموال أبداً', text: 'الأعداد العشرية العائمة تقريبية: `0.1 + 0.2` لا تساوي `0.3` بالضبط. في نظام محاسبي تتراكم هذه الفروق حتى تظهر كأخطاء حقيقية. استخدم `DECIMAL(10,2)` دائماً للمبالغ.' },
    { t: 'code', lang: 'sql', code: `
price DECIMAL(10, 2)   -- 10 أرقام إجمالاً، منها 2 بعد الفاصلة
                       -- المدى: 99,999,999.99` },

    { t: 'h3', text: 'النصوص' },
    { t: 'table', head: ['النوع', 'الطول', 'متى'], rows: [
      ['`CHAR(n)`', 'ثابت — يُحشى بمسافات', 'رموز ثابتة الطول: `SA`, `M`/`F`'],
      ['`VARCHAR(n)`', 'متغيّر حتى n', '**الافتراضي** لمعظم النصوص'],
      ['`TEXT`', 'طويل جداً', 'مقالات، أوصاف، تعليقات'],
      ['`ENUM(…)`', 'قائمة محدّدة', 'حالات ثابتة (MySQL فقط)']
    ]},
    { t: 'code', lang: 'sql', code: `
name        VARCHAR(200)   -- اسم منتج
email       VARCHAR(255)   -- الطول القياسي للبريد
country     CHAR(2)        -- رمز الدولة: SA, EG
description TEXT           -- وصف طويل

-- في MySQL
status ENUM('pending', 'paid', 'shipped') NOT NULL DEFAULT 'pending'

-- في PostgreSQL — الأفضل: قيد CHECK
status VARCHAR(20) NOT NULL DEFAULT 'pending'
       CHECK (status IN ('pending', 'paid', 'shipped'))` },
    { t: 'tip', text: 'لا تبالغ في طول `VARCHAR`. `VARCHAR(255)` لكل شيء عادة سيّئة: الطول يوثّق نيّتك ويمنع بيانات غير منطقية. اسم المدينة لا يحتاج 255 محرفاً.' },

    { t: 'h3', text: 'التواريخ والأوقات' },
    { t: 'table', head: ['النوع', 'يخزّن', 'مثال'], rows: [
      ['`DATE`', 'تاريخ فقط', '`2026-03-15`'],
      ['`TIME`', 'وقت فقط', '`14:30:00`'],
      ['`DATETIME`', 'تاريخ ووقت', '`2026-03-15 14:30:00`'],
      ['`TIMESTAMP`', 'تاريخ ووقت مع منطقة زمنية', 'يُحوَّل إلى UTC'],
      ['`YEAR`', 'سنة فقط', '`2026`']
    ]},
    { t: 'warn', title: 'خزّن بـ UTC دائماً', text: 'خزّن كل الأوقات بتوقيت UTC وحوّلها للمنطقة المحلية عند **العرض** فقط. تخزين التوقيت المحلي يسبّب كوارث عند تغيّر التوقيت الصيفي أو عند وجود مستخدمين في مناطق مختلفة.' },
    { t: 'code', lang: 'sql', code: `
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
           ON UPDATE CURRENT_TIMESTAMP,
birth_date DATE,
deleted_at TIMESTAMP NULL     -- للحذف الناعم` },

    { t: 'h3', text: 'أنواع أخرى' },
    { t: 'code', lang: 'sql', code: `
is_active  BOOLEAN NOT NULL DEFAULT TRUE
metadata   JSON                    -- بيانات مرنة
avatar     BLOB                    -- ملف ثنائي (يُفضَّل تخزين المسار)
id         UUID DEFAULT gen_random_uuid()   -- PostgreSQL` },
    { t: 'tip', text: 'لا تخزّن الصور والملفات في قاعدة البيانات. خزّنها في نظام ملفات أو خدمة تخزين، واحفظ **المسار** فقط في القاعدة. القاعدة ستصبح ضخمة وبطيئة النسخ الاحتياطي بلا فائدة.' },

    { t: 'h2', text: 'القيود' },
    { t: 'p', text: 'القيد قاعدة تفرضها قاعدة البيانات على البيانات نفسها. أهميتها أنها **لا يمكن تجاوزها** مهما كان مصدر البيانات: تطبيقك، أو سكربت، أو مطوّر يكتب استعلاماً يدوياً.' },
    { t: 'table', head: ['القيد', 'يضمن'], rows: [
      ['`PRIMARY KEY`', 'فريد وغير فارغ — معرّف الصف'],
      ['`NOT NULL`', 'القيمة إلزامية'],
      ['`UNIQUE`', 'لا تتكرّر القيمة'],
      ['`DEFAULT`', 'قيمة تلقائية عند الإهمال'],
      ['`CHECK`', 'شرط منطقي على القيمة'],
      ['`FOREIGN KEY`', 'القيمة موجودة في الجدول المرجعي']
    ]},
    { t: 'code', lang: 'sql', title: 'أمثلة CHECK', code: `
CREATE TABLE orders (
  id       INT PRIMARY KEY,
  total    DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  discount DECIMAL(5,2)  DEFAULT 0 CHECK (discount BETWEEN 0 AND 100),
  quantity INT NOT NULL CHECK (quantity > 0),
  status   VARCHAR(20) NOT NULL DEFAULT 'pending'
           CHECK (status IN ('pending','paid','shipped','cancelled')),
  email    VARCHAR(255) CHECK (email LIKE '%@%.%'),

  -- قيد على عدة أعمدة
  ends_at   DATE,
  starts_at DATE,
  CHECK (ends_at > starts_at)
);` },
    { t: 'demo', title: 'القيد يرفض البيانات الفاسدة', height: 240,
      css: 'pre{background:#0f1729;color:#e2e8f0;padding:14px;border-radius:10px;direction:ltr;text-align:left;font-family:monospace;font-size:.84em;line-height:1.9;margin:0;overflow-x:auto}.e{color:#fca5a5}.g{color:#86efac}',
      html: '<pre>sqlite&gt; INSERT INTO orders (id, total, quantity)\n   ...&gt; VALUES (1, -50, 2);\n<span class="e">Error: CHECK constraint failed: total &gt;= 0</span>\n\nsqlite&gt; INSERT INTO orders (id, total, quantity)\n   ...&gt; VALUES (1, 450, 2);\n<span class="g">-- تم بنجاح</span></pre>' },

    { t: 'h2', text: 'المفاتيح الأجنبية وسلوك الحذف' },
    { t: 'code', lang: 'sql', code: `
CREATE TABLE order_items (
  id         INT PRIMARY KEY,
  order_id   INT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT NOT NULL CHECK (quantity > 0),

  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);` },
    { t: 'table', head: ['السلوك', 'ماذا يحدث عند حذف الصف الأب'], rows: [
      ['`RESTRICT` / `NO ACTION`', 'يمنع الحذف إن وُجدت صفوف تابعة — **الافتراضي**'],
      ['`CASCADE`', 'يحذف الصفوف التابعة معه'],
      ['`SET NULL`', 'يجعل المفتاح الأجنبي فارغاً (يتطلّب عموداً يقبل NULL)'],
      ['`SET DEFAULT`', 'يضبطه على القيمة الافتراضية']
    ]},
    { t: 'p', text: 'اختيار السلوك قرار تصميمي مهم:' },
    { t: 'ul', items: [
      'حذف **طلب** ← احذف `order_items` معه: `CASCADE` منطقي.',
      'حذف **منتج** له طلبات ← امنع الحذف: `RESTRICT` يحمي سجلّك التاريخي.',
      'حذف **تصنيف** ← اجعل منتجاته بلا تصنيف: `SET NULL`.'
    ]},
    { t: 'warn', title: 'CASCADE سلاح ذو حدّين', text: 'حذف صف واحد قد يحذف آلاف الصفوف عبر سلسلة من الجداول دون أن تشعر. استخدمه فقط حين تكون العلاقة **تركيبية** حقيقية (الابن لا معنى له بدون الأب).' },

    { t: 'h2', text: 'قيمة NULL' },
    { t: 'p', text: '`NULL` تعني «**قيمة غير معروفة**» لا «صفر» ولا «نص فارغ». هذا يغيّر سلوك المقارنات كلياً.' },
    { t: 'code', lang: 'sql', code: `
-- ✗ خطأ شائع: لا تُرجع شيئاً أبداً
SELECT * FROM users WHERE phone = NULL;

-- ✓ الصواب
SELECT * FROM users WHERE phone IS NULL;
SELECT * FROM users WHERE phone IS NOT NULL;

-- NULL في العمليات الحسابية ينتج NULL
SELECT 100 + NULL;        -- NULL
SELECT 'مرحبا' || NULL;   -- NULL

-- الدوال التي تتعامل معها
SELECT COALESCE(phone, 'غير متوفّر') FROM users;
SELECT IFNULL(discount, 0) FROM orders;
SELECT NULLIF(a, b);   -- NULL إن تساويا` },
    { t: 'demo', title: 'سلوك NULL', height: 250,
      css: 'table{width:100%;border-collapse:collapse;font-size:.88em}th{background:#6a5acd;color:#fff;padding:8px 12px;text-align:right}td{padding:7px 12px;border-bottom:1px solid #e2e8f0}code{font-family:monospace;font-size:.9em;direction:ltr;display:inline-block}',
      html: '<table><tr><th>التعبير</th><th>النتيجة</th></tr><tr><td><code>NULL = NULL</code></td><td>NULL (ليس TRUE!)</td></tr><tr><td><code>NULL IS NULL</code></td><td>TRUE ✓</td></tr><tr><td><code>5 + NULL</code></td><td>NULL</td></tr><tr><td><code>COUNT(col)</code></td><td>يتجاهل NULL</td></tr><tr><td><code>COUNT(*)</code></td><td>يعدّ كل الصفوف</td></tr><tr><td><code>COALESCE(NULL, 0)</code></td><td>0</td></tr></table>' },
    { t: 'tip', text: 'قلّل الأعمدة التي تقبل `NULL` قدر الإمكان. كل عمود يقبلها يضيف حالة يجب التعامل معها في كل استعلام وكل جزء من تطبيقك.' },

    { t: 'h2', text: 'تعديل بنية جدول' },
    { t: 'code', lang: 'sql', code: `
-- إضافة عمود
ALTER TABLE products ADD COLUMN weight DECIMAL(6,2);

-- حذف عمود
ALTER TABLE products DROP COLUMN weight;

-- تعديل نوع
ALTER TABLE products MODIFY COLUMN name VARCHAR(300);        -- MySQL
ALTER TABLE products ALTER COLUMN name TYPE VARCHAR(300);    -- PostgreSQL

-- إعادة تسمية
ALTER TABLE products RENAME COLUMN name TO title;
ALTER TABLE products RENAME TO items;

-- إضافة قيد
ALTER TABLE products ADD CONSTRAINT chk_price CHECK (price >= 0);
ALTER TABLE products ADD CONSTRAINT fk_cat
  FOREIGN KEY (category_id) REFERENCES categories(id);

-- حذف قيد
ALTER TABLE products DROP CONSTRAINT chk_price;

-- حذف جدول
DROP TABLE products;
DROP TABLE IF EXISTS products;

-- تفريغ جدول (أسرع من DELETE)
TRUNCATE TABLE products;` },
    { t: 'danger', title: 'احذر في الإنتاج', text: '`DROP TABLE` و `TRUNCATE` **لا رجعة فيهما**. وفي جدول كبير قد يقفل `ALTER TABLE` الجدول لدقائق فيتوقّف التطبيق. خذ نسخة احتياطية دائماً، ونفّذ التغييرات الكبيرة في نافذة صيانة.' },

    { t: 'h2', text: 'مخطّط كامل' },
    { t: 'code', lang: 'sql', title: 'متجر إلكتروني', code: `
CREATE TABLE categories (
  id   INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE customers (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  phone      VARCHAR(20),
  city       VARCHAR(80),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT,
  name        VARCHAR(200) NOT NULL,
  sku         VARCHAR(50) NOT NULL UNIQUE,
  price       DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock       INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE orders (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  total       DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  ordered_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

CREATE TABLE order_items (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  order_id   INT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),

  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  UNIQUE (order_id, product_id)
);` },
    { t: 'note', title: 'لماذا `unit_price` في `order_items`؟', text: 'لأن سعر المنتج قد يتغيّر لاحقاً. تخزين السعر **وقت الشراء** يحفظ السجلّ التاريخي صحيحاً — لو اعتمدنا على `products.price` لتغيّرت قيمة الفواتير القديمة عند كل تعديل سعر.' },

    { t: 'exercise',
      title: 'تمرين: مخطّط منصة تعليمية',
      brief: 'صمّم مخطّطاً كاملاً لمنصة دورات تعليمية.',
      requirements: [
        'جدول `instructors`: الاسم، البريد الفريد، السيرة، تاريخ الانضمام.',
        'جدول `courses`: العنوان، الوصف، السعر (`DECIMAL`)، المستوى (`CHECK` على ثلاث قيم)، المدرّب (مفتاح أجنبي)، هل منشورة، تاريخ الإنشاء.',
        'جدول `students`: الاسم، البريد الفريد، الجوال (اختياري)، تاريخ التسجيل.',
        'جدول `lessons`: العنوان، المدة بالدقائق (`CHECK > 0`)، الترتيب، معرّف الدورة.',
        'جدول `enrollments`: يربط الطالب بالدورة، تاريخ التسجيل، نسبة الإكمال (0–100).',
        'جدول `reviews`: التقييم (1–5)، التعليق، الطالب، الدورة.',
        'الطالب لا يسجّل في نفس الدورة مرتين، ولا يقيّمها مرتين.',
        'حذف دورة يحذف دروسها، لكن لا يُسمح بحذف مدرّب له دورات.',
        'أدخل بيانات تجريبية في كل جدول.',
        'أضف عموداً جديداً `certificate_url` إلى `enrollments` بأمر `ALTER`.'
      ],
      hints: [
        '«لا يسجّل مرتين» = قيد `UNIQUE` على عمودين معاً.',
        'استخدم `ON DELETE CASCADE` للدروس و`RESTRICT` للمدرّب.',
        'كل جدول يحتاج `created_at` عادةً.'
      ],
      solution: { lang: 'sql', code: `
-- ===== المدرّبون =====
CREATE TABLE instructors (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  bio        TEXT,
  joined_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===== الدورات =====
CREATE TABLE courses (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  instructor_id INT NOT NULL,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  price         DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  level         VARCHAR(20) NOT NULL DEFAULT 'beginner'
                CHECK (level IN ('beginner','intermediate','advanced')),
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE RESTRICT
);

-- ===== الطلاب =====
CREATE TABLE students (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  phone        VARCHAR(20),
  registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===== الدروس =====
CREATE TABLE lessons (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  course_id   INT NOT NULL,
  title       VARCHAR(200) NOT NULL,
  duration_min INT NOT NULL CHECK (duration_min > 0),
  position    INT NOT NULL DEFAULT 1,

  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE (course_id, position)
);

-- ===== التسجيلات =====
CREATE TABLE enrollments (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  student_id  INT NOT NULL,
  course_id   INT NOT NULL,
  enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  progress    INT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),

  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE,
  UNIQUE (student_id, course_id)
);

-- ===== المراجعات =====
CREATE TABLE reviews (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id  INT NOT NULL,
  rating     INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE,
  UNIQUE (student_id, course_id)
);

-- ===== بيانات تجريبية =====
INSERT INTO instructors (name, email, bio) VALUES
  ('سارة عبدالله', 'sara@codeway.sa', 'مطوّرة واجهات أمامية بخبرة خمس سنوات'),
  ('خالد الأحمد',  'khalid@codeway.sa', 'مهندس برمجيات ومدرّب معتمد');

INSERT INTO courses (instructor_id, title, price, level, is_published) VALUES
  (1, 'HTML من الصفر',   0,   'beginner',     TRUE),
  (1, 'CSS المتقدّم',    199, 'intermediate', TRUE),
  (2, 'Angular الكامل',  399, 'advanced',     FALSE);

INSERT INTO students (name, email, phone) VALUES
  ('نورة القحطاني', 'noura@example.com', '0501112222'),
  ('فهد العتيبي',   'fahad@example.com', NULL),
  ('ريم الدوسري',   'reem@example.com',  '0553334444');

INSERT INTO lessons (course_id, title, duration_min, position) VALUES
  (1, 'مقدمة في HTML', 40, 1),
  (1, 'هيكل المستند',  45, 2),
  (2, 'المحدّدات',     50, 1);

INSERT INTO enrollments (student_id, course_id, progress) VALUES
  (1, 1, 100),
  (2, 1, 45),
  (1, 2, 20);

INSERT INTO reviews (student_id, course_id, rating, comment) VALUES
  (1, 1, 5, 'شرح ممتاز ومتدرّج'),
  (2, 1, 4, 'جيد جداً لكن أتمنى أمثلة أكثر');

-- ===== تعديل البنية =====
ALTER TABLE enrollments ADD COLUMN certificate_url VARCHAR(500);` } },

    { t: 'quiz', items: [
      { q: 'أي نوع تستخدم لتخزين المبالغ المالية؟', options: ['`FLOAT`', '`DECIMAL(10,2)`', '`DOUBLE`', '`INT`'], answer: 1,
        explain: 'الأنواع العائمة تقريبية وتتراكم أخطاؤها؛ `DECIMAL` دقيق تماماً.' },
      { q: 'لماذا `WHERE phone = NULL` لا تعمل؟', options: ['خطأ صياغة', 'لأن `NULL` تعني «غير معروف» فالمقارنة تُرجع `NULL` لا `TRUE`', 'بطيئة', 'تحتاج فهرساً'], answer: 1,
        explain: 'استخدم `IS NULL` و `IS NOT NULL` دائماً.' },
      { q: 'ما أثر `ON DELETE CASCADE`؟', options: ['يمنع الحذف', 'يحذف الصفوف التابعة تلقائياً مع الأب', 'يجعلها NULL', 'لا شيء'], answer: 1,
        explain: 'قوي لكنه خطر: قد يحذف آلاف الصفوف عبر سلسلة علاقات.' },
      { q: 'لماذا نخزّن `unit_price` في `order_items`؟', options: ['للسرعة', 'لحفظ السعر وقت الشراء فلا تتغيّر الفواتير القديمة عند تعديل السعر', 'اختياري', 'لتوفير مساحة'], answer: 1,
        explain: 'السجلّ التاريخي يجب أن يبقى صحيحاً مهما تغيّرت البيانات الحالية.' },
      { q: 'كيف تمنع تسجيل الطالب في نفس الدورة مرتين؟', options: ['بالتطبيق فقط', 'بقيد `UNIQUE (student_id, course_id)`', 'بـ `PRIMARY KEY`', 'لا يمكن'], answer: 1,
        explain: 'القيد على مستوى القاعدة لا يمكن تجاوزه من أي مصدر.' }
    ]}
  ]
};
