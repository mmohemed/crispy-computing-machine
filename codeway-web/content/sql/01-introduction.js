'use strict';

module.exports = {
  slug: '01-introduction',
  title: 'مقدمة في قواعد البيانات العلائقية',
  summary: 'لماذا نحتاج قاعدة بيانات، وما معنى «علائقية»، ومفاهيم الجدول والصف والعمود والمفاتيح.',
  duration: 40,
  level: 'مبتدئ',
  tags: ['مفاهيم', 'أساسيات'],
  objectives: [
    'تشرح لماذا لا تكفي الملفات لتخزين البيانات.',
    'تفهم معنى «علائقية» وأصل التسمية.',
    'تعرف مصطلحات: جدول، صف، عمود، مفتاح أساسي وأجنبي.',
    'تميّز بين أشهر أنظمة إدارة قواعد البيانات.',
    'تهيّئ بيئة تجربة وتكتب أول استعلام.'
  ],
  quickRef: [
    { code: 'TABLE', desc: 'جدول = كيان (منتجات، عملاء)' },
    { code: 'ROW / RECORD', desc: 'صف = سجل واحد' },
    { code: 'COLUMN / FIELD', desc: 'عمود = خاصية' },
    { code: 'PRIMARY KEY', desc: 'معرّف فريد للصف' },
    { code: 'FOREIGN KEY', desc: 'مرجع لصف في جدول آخر' },
    { code: 'SELECT … FROM …', desc: 'أبسط استعلام' }
  ],
  blocks: [
    { t: 'h2', text: 'لماذا لا نكتفي بالملفات؟' },
    { t: 'p', text: 'تخيّل متجراً يخزّن بياناته في ملف نصي. ستواجه فوراً:' },
    { t: 'ul', items: [
      '**البحث بطيء**: للعثور على طلب واحد تقرأ الملف كله.',
      '**التزامن مستحيل**: موظفان يعدّلان في اللحظة نفسها فتضيع تعديلات أحدهما.',
      '**لا سلامة**: لا شيء يمنع إدخال «عمر = -5» أو طلب لعميل غير موجود.',
      '**التكرار**: اسم العميل مكرّر في كل طلب، فتغييره يعني تعديل مئات السطور.',
      '**لا استعلامات معقّدة**: «أعلى خمسة منتجات مبيعاً في الرياض هذا الشهر» تحتاج برنامجاً كاملاً.',
      '**لا تعافي**: انقطاع كهرباء أثناء الكتابة يفسد الملف.'
    ]},
    { t: 'p', text: '**نظام إدارة قواعد البيانات** (DBMS) يحلّ هذا كله: تخزين منظّم، بحث سريع بالفهارس، تحكّم بالتزامن، قيود سلامة، ولغة استعلام واحدة تعبّر عن أعقد الأسئلة.' },

    { t: 'h2', text: 'ما معنى «علائقية»؟' },
    { t: 'p', text: 'الاسم ليس نسبة إلى «العلاقات بين الجداول» كما يظنّ كثيرون، بل إلى مفهوم رياضي: **العلاقة** (Relation) هي مجموعة من الصفوف بنفس البنية — أي الجدول. النموذج وضعه إدجار كود عام 1970 وبُني على نظرية المجموعات.' },
    { t: 'p', text: 'الفكرة العملية: البيانات تُخزَّن في **جداول** ثنائية الأبعاد، ونربط بينها بقيم مشتركة لا بمؤشّرات.' },
    { t: 'demo', title: 'جدول = علاقة', height: 280,
      css: 'table{width:100%;border-collapse:collapse;font-size:.9em;margin-bottom:6px}th{background:#6a5acd;color:#fff;padding:9px 12px;text-align:right}td{padding:8px 12px;border-bottom:1px solid #e2e8f0}tr:nth-child(even) td{background:#f8fafc}b{display:block;font-size:.82em;color:#64748b;margin-bottom:6px}.note{font-size:.82em;color:#64748b}',
      html: '<b>جدول customers</b><table><tr><th>id</th><th>name</th><th>city</th><th>created_at</th></tr><tr><td>1</td><td>سارة عبدالله</td><td>الرياض</td><td>2026-01-12</td></tr><tr><td>2</td><td>خالد الأحمد</td><td>جدة</td><td>2026-02-03</td></tr><tr><td>3</td><td>نورة القحطاني</td><td>الدمام</td><td>2026-02-20</td></tr></table><p class="note">كل <b>صف</b> عميل واحد، وكل <b>عمود</b> خاصية، والعمود <code>id</code> هو <b>المفتاح الأساسي</b>.</p>' },

    { t: 'h2', text: 'المصطلحات الأساسية' },
    { t: 'table', head: ['المصطلح', 'المعنى', 'مثال'], rows: [
      ['**قاعدة بيانات**', 'حاوية تضمّ الجداول', '`shop_db`'],
      ['**جدول**', 'كيان له بنية ثابتة', '`customers`, `orders`'],
      ['**صف** (سجل)', 'مثيل واحد من الكيان', 'العميلة سارة'],
      ['**عمود** (حقل)', 'خاصية لها نوع بيانات', '`name` نصّي'],
      ['**مفتاح أساسي**', 'قيمة فريدة تميّز الصف', '`id`'],
      ['**مفتاح أجنبي**', 'عمود يشير لمفتاح أساسي في جدول آخر', '`orders.customer_id`'],
      ['**مخطّط** (Schema)', 'تعريف الجداول والأعمدة والعلاقات', 'بنية القاعدة كلها'],
      ['**استعلام**', 'سؤال تطرحه على البيانات', '`SELECT …`']
    ]},

    { t: 'h2', text: 'المفتاح الأساسي' },
    { t: 'p', text: 'عمود (أو مجموعة أعمدة) يميّز كل صف تمييزاً قاطعاً. شروطه: **فريد** لا يتكرّر، و**غير فارغ** أبداً، و**ثابت** لا يتغيّر مع الوقت.' },
    { t: 'compare', lang: 'sql', bad: {
      code: '-- ✗ البريد كمفتاح أساسي\nCREATE TABLE users (\n  email VARCHAR(255) PRIMARY KEY,\n  name  VARCHAR(100)\n);',
      why: 'البريد قد يتغيّر، وتغييره يعني تحديث كل الجداول التي تشير إليه.'
    }, good: {
      code: '-- ✓ معرّف صناعي\nCREATE TABLE users (\n  id    INT PRIMARY KEY AUTO_INCREMENT,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  name  VARCHAR(100) NOT NULL\n);',
      why: 'المعرّف الصناعي لا معنى له خارج القاعدة فلا يتغيّر أبداً، والبريد يبقى فريداً بقيد `UNIQUE`.'
    }},
    { t: 'tip', text: 'القاعدة الذهبية: استخدم معرّفاً **صناعياً** (رقم متزايد أو UUID) كمفتاح أساسي دائماً، واحفظ القيم ذات المعنى في أعمدة عادية بقيود مناسبة.' },

    { t: 'h2', text: 'المفتاح الأجنبي والعلاقات' },
    { t: 'p', text: 'المفتاح الأجنبي هو ما يربط الجداول: عمود في جدول يحمل قيمة مفتاح أساسي من جدول آخر.' },
    { t: 'demo', title: 'العلاقة بين العملاء والطلبات', height: 340,
      css: 'table{width:100%;border-collapse:collapse;font-size:.85em;margin-bottom:12px}th{background:#6a5acd;color:#fff;padding:8px 10px;text-align:right}td{padding:7px 10px;border-bottom:1px solid #e2e8f0}b{display:block;font-size:.8em;color:#64748b;margin-bottom:4px}.fk{background:#fef3c7;font-weight:700}.pk{background:#dbeafe;font-weight:700}.note{font-size:.8em;color:#64748b;margin:0}',
      html: '<b>customers (الأب)</b><table><tr><th>id</th><th>name</th></tr><tr><td class="pk">1</td><td>سارة</td></tr><tr><td class="pk">2</td><td>خالد</td></tr></table><b>orders (الابن)</b><table><tr><th>id</th><th>customer_id</th><th>total</th></tr><tr><td>101</td><td class="fk">1</td><td>450</td></tr><tr><td>102</td><td class="fk">1</td><td>230</td></tr><tr><td>103</td><td class="fk">2</td><td>899</td></tr></table><p class="note">🔵 مفتاح أساسي &nbsp;&nbsp; 🟡 مفتاح أجنبي — لسارة طلبان ولخالد طلب واحد.</p>' },
    { t: 'table', head: ['نوع العلاقة', 'المعنى', 'كيف تُنفَّذ'], rows: [
      ['**واحد إلى متعدّد**', 'عميل له عدة طلبات', 'مفتاح أجنبي في جدول الطلبات'],
      ['**متعدّد إلى متعدّد**', 'طلب فيه عدة منتجات والمنتج في عدة طلبات', 'جدول وسيط يربط بينهما'],
      ['**واحد إلى واحد**', 'مستخدم له ملف شخصي واحد', 'مفتاح أجنبي فريد `UNIQUE`']
    ]},
    { t: 'note', text: 'العلاقة **متعدّد إلى متعدّد** لا يمكن تمثيلها مباشرة، فنستخدم جدولاً وسيطاً: `order_items` يحمل `order_id` و `product_id` و`quantity`. سنعود لهذا بالتفصيل في درس JOIN.' },

    { t: 'h2', text: 'أنظمة إدارة قواعد البيانات' },
    { t: 'table', head: ['النظام', 'يتميّز بـ', 'الأنسب لـ'], rows: [
      ['**PostgreSQL**', 'الأكثر التزاماً بالمعايير، ميزات متقدّمة، JSON قوي', 'الخيار الافتراضي لمشروع جديد'],
      ['**MySQL / MariaDB**', 'انتشار هائل، سهل الاستضافة', 'مواقع ووردبريس والاستضافة المشتركة'],
      ['**SQLite**', 'ملف واحد، بلا خادم، مدمج', 'التعلّم، تطبيقات الجوال، المشاريع الصغيرة'],
      ['**SQL Server**', 'تكامل مع منصة مايكروسوفت', 'الأنظمة المؤسسية على .NET'],
      ['**Oracle**', 'أنظمة ضخمة جداً', 'البنوك والمؤسسات الكبرى']
    ]},
    { t: 'warn', title: 'لهجات مختلفة', text: 'SQL معيار، لكن لكل نظام **لهجته**: `AUTO_INCREMENT` في MySQL تقابل `SERIAL` في PostgreSQL و `AUTOINCREMENT` في SQLite. الأساسيات واحدة والتفاصيل تختلف — لهذا اقرأ توثيق نظامك.' },
    { t: 'tip', text: 'للتعلّم ابدأ بـ **SQLite**: لا تثبيت ولا خادم ولا إعداد. القاعدة كلها ملف واحد، وتستطيع تجربتها في المتصفح مباشرة عبر مواقع مثل SQLite Online أو DB Fiddle.' },

    { t: 'h2', text: 'أقسام لغة SQL' },
    { t: 'table', head: ['القسم', 'الاسم', 'الأوامر'], rows: [
      ['**DDL**', 'تعريف البيانات', '`CREATE`, `ALTER`, `DROP`'],
      ['**DML**', 'معالجة البيانات', '`INSERT`, `UPDATE`, `DELETE`'],
      ['**DQL**', 'الاستعلام', '`SELECT`'],
      ['**DCL**', 'التحكّم بالصلاحيات', '`GRANT`, `REVOKE`'],
      ['**TCL**', 'التحكّم بالمعاملات', '`COMMIT`, `ROLLBACK`']
    ]},
    { t: 'p', text: 'ستقضي 90٪ من وقتك في `SELECT` — لهذا سنخصّص له عدة دروس.' },

    { t: 'h2', text: 'أول استعلام' },
    { t: 'code', lang: 'sql', code: `
-- إنشاء جدول
CREATE TABLE customers (
  id      INTEGER PRIMARY KEY,
  name    TEXT NOT NULL,
  city    TEXT,
  balance REAL DEFAULT 0
);

-- إدخال بيانات
INSERT INTO customers (id, name, city, balance) VALUES
  (1, 'سارة عبدالله', 'الرياض', 1200),
  (2, 'خالد الأحمد',  'جدة',    850),
  (3, 'نورة القحطاني','الدمام',  0);

-- الاستعلام
SELECT name, city
FROM customers
WHERE balance > 0
ORDER BY balance DESC;` },
    { t: 'demo', title: 'ناتج الاستعلام', height: 200,
      css: 'table{width:100%;border-collapse:collapse;font-size:.9em}th{background:#6a5acd;color:#fff;padding:9px 12px;text-align:right}td{padding:8px 12px;border-bottom:1px solid #e2e8f0}',
      html: '<table><tr><th>name</th><th>city</th></tr><tr><td>سارة عبدالله</td><td>الرياض</td></tr><tr><td>خالد الأحمد</td><td>جدة</td></tr></table><p style="color:#64748b;font-size:.85em;margin-top:8px">نورة لم تظهر لأن رصيدها صفر، والترتيب تنازلي بالرصيد.</p>' },
    { t: 'p', text: 'لاحظ طبيعة اللغة: أنت تصف **ما تريد** لا **كيف تحصل عليه**. لا حلقات ولا شروط برمجية — المحرّك يقرّر أفضل طريقة للتنفيذ.' },

    { t: 'h2', text: 'اصطلاحات الكتابة' },
    { t: 'ul', items: [
      '**الكلمات المفتاحية بحروف كبيرة**: `SELECT` لا `select` — للتمييز البصري.',
      '**أسماء الجداول بصيغة الجمع**: `customers` لا `customer`.',
      '**أسماء الأعمدة بحروف صغيرة وشرطة سفلية**: `created_at` لا `CreatedAt`.',
      '**سطر لكل جملة رئيسية**: `SELECT` ثم `FROM` ثم `WHERE` كل في سطر.',
      '**الفاصلة المنقوطة** في نهاية كل أمر.',
      '**التعليقات**: `--` لسطر و `/* */` لعدة أسطر.'
    ]},
    { t: 'code', lang: 'sql', code: `
-- تعليق سطر واحد

/*
   تعليق
   متعدّد الأسطر
*/

SELECT
  c.name,
  c.city,
  c.balance
FROM customers AS c
WHERE c.balance > 500
  AND c.city = 'الرياض'
ORDER BY c.balance DESC
LIMIT 10;` },

    { t: 'h2', text: 'تهيئة بيئة التجربة' },
    { t: 'code', lang: 'bash', title: 'SQLite محلياً', code: `
# على ماك ولينكس غالباً مثبّت مسبقاً
sqlite3 --version

# إنشاء قاعدة والدخول إليها
sqlite3 shop.db

# داخل الصدفة
sqlite> .headers on
sqlite> .mode column
sqlite> .tables
sqlite> .schema customers
sqlite> .quit` },
    { t: 'tip', text: 'أدوات رسومية مفيدة: **DBeaver** (يدعم كل الأنظمة ومجاني)، و**TablePlus**، و**pgAdmin** لـ PostgreSQL. للتعلّم السريع بلا تثبيت: `sqliteonline.com` أو `db-fiddle.com`.' },

    { t: 'exercise',
      title: 'تمرين: تصميم قاعدة مكتبة',
      brief: 'صمّم مخطّط قاعدة بيانات لمكتبة — على الورق أولاً ثم بـ SQL.',
      requirements: [
        'حدّد الكيانات اللازمة: الكتب، المؤلّفون، الأعضاء، الإعارات.',
        'لكل كيان: ما الأعمدة المطلوبة وما نوع بيانات كل عمود؟',
        'حدّد المفتاح الأساسي لكل جدول.',
        'حدّد العلاقات: أي جدول يرتبط بأيّ وبأي نوع علاقة؟',
        'الكتاب قد يكون له عدة مؤلّفين والمؤلّف له عدة كتب — كيف تمثّل ذلك؟',
        'اكتب جمل `CREATE TABLE` لكل الجداول.',
        'أدخل ثلاثة صفوف تجريبية في كل جدول.',
        'اكتب استعلاماً يعرض عناوين الكتب المتاحة للإعارة.'
      ],
      hints: [
        'العلاقة متعدّد إلى متعدّد تحتاج جدولاً وسيطاً.',
        'الإعارة لها تاريخ بداية وتاريخ إرجاع (قد يكون فارغاً).',
        'استخدم معرّفات صناعية كمفاتيح أساسية.'
      ],
      solution: { lang: 'sql', code: `
-- ===== المؤلّفون =====
CREATE TABLE authors (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  nationality TEXT,
  birth_year INTEGER
);

-- ===== الكتب =====
CREATE TABLE books (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL,
  isbn        TEXT UNIQUE,
  published_year INTEGER,
  copies      INTEGER NOT NULL DEFAULT 1,
  available   INTEGER NOT NULL DEFAULT 1
);

-- ===== جدول وسيط: متعدّد إلى متعدّد =====
CREATE TABLE book_authors (
  book_id   INTEGER NOT NULL,
  author_id INTEGER NOT NULL,
  PRIMARY KEY (book_id, author_id),
  FOREIGN KEY (book_id)   REFERENCES books(id),
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

-- ===== الأعضاء =====
CREATE TABLE members (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  phone      TEXT,
  joined_at  TEXT NOT NULL
);

-- ===== الإعارات: واحد إلى متعدّد من الطرفين =====
CREATE TABLE loans (
  id          INTEGER PRIMARY KEY,
  book_id     INTEGER NOT NULL,
  member_id   INTEGER NOT NULL,
  loaned_at   TEXT NOT NULL,
  due_at      TEXT NOT NULL,
  returned_at TEXT,
  FOREIGN KEY (book_id)   REFERENCES books(id),
  FOREIGN KEY (member_id) REFERENCES members(id)
);

-- ===== بيانات تجريبية =====
INSERT INTO authors (id, name, nationality, birth_year) VALUES
  (1, 'غازي القصيبي', 'سعودي', 1940),
  (2, 'أحمد خالد توفيق', 'مصري', 1962),
  (3, 'رجاء عالم', 'سعودية', 1970);

INSERT INTO books (id, title, isbn, published_year, copies, available) VALUES
  (1, 'شقة الحرية', '9789953210001', 1994, 3, 2),
  (2, 'يوتوبيا', '9789953210002', 2008, 2, 0),
  (3, 'طوق الحمام', '9789953210003', 2010, 4, 4);

INSERT INTO book_authors (book_id, author_id) VALUES
  (1, 1), (2, 2), (3, 3);

INSERT INTO members (id, name, email, phone, joined_at) VALUES
  (1, 'سارة عبدالله', 'sara@example.com', '0501234567', '2026-01-10'),
  (2, 'خالد الأحمد',  'khalid@example.com','0559876543', '2026-02-01'),
  (3, 'نورة القحطاني','noura@example.com', '0533334444', '2026-02-15');

INSERT INTO loans (id, book_id, member_id, loaned_at, due_at, returned_at) VALUES
  (1, 1, 1, '2026-03-01', '2026-03-15', '2026-03-12'),
  (2, 2, 2, '2026-03-05', '2026-03-19', NULL),
  (3, 2, 3, '2026-03-06', '2026-03-20', NULL);

-- ===== الاستعلام المطلوب =====
SELECT title, available
FROM books
WHERE available > 0
ORDER BY title;` },
      solutionNote: 'لاحظ: `book_authors` مفتاحه الأساسي مركّب من عمودين — يمنع تكرار نفس الزوج.'
    },

    { t: 'quiz', items: [
      { q: 'ما أصل تسمية «قاعدة بيانات علائقية»؟', options: ['العلاقات بين الجداول', 'المفهوم الرياضي «العلاقة» أي الجدول نفسه', 'العلاقة بين المستخدمين', 'ربط الملفات'], answer: 1,
        explain: 'العلاقة (Relation) في نظرية المجموعات هي مجموعة صفوف بنفس البنية.' },
      { q: 'لماذا لا نستخدم البريد الإلكتروني كمفتاح أساسي؟', options: ['طويل', 'لأنه قد يتغيّر، وتغييره يعني تحديث كل المراجع', 'غير فريد', 'بطيء'], answer: 1,
        explain: 'المفتاح الأساسي يجب أن يكون ثابتاً؛ استخدم معرّفاً صناعياً واجعل البريد `UNIQUE`.' },
      { q: 'كيف تمثّل علاقة متعدّد إلى متعدّد؟', options: ['بمفتاح أجنبي واحد', 'بجدول وسيط يحمل مفتاحَي الجدولين', 'بعمود نصّي', 'لا يمكن'], answer: 1,
        explain: 'الجدول الوسيط يحوّلها إلى علاقتَي «واحد إلى متعدّد».' },
      { q: 'أي نظام هو الأنسب للتعلّم بلا تثبيت؟', options: ['Oracle', 'SQLite', 'SQL Server', 'MongoDB'], answer: 1,
        explain: 'SQLite قاعدة في ملف واحد بلا خادم ولا إعداد.' },
      { q: 'ما طبيعة لغة SQL؟', options: ['إجرائية: تصف كيف', 'تصريحية: تصف ما تريد ويقرّر المحرّك كيف', 'كائنية', 'وظيفية'], answer: 1,
        explain: 'تكتب ما تريده والمحسّن يختار خطة التنفيذ الأمثل.' }
    ]}
  ]
};
