'use strict';

module.exports = {
  slug: '03-dml',
  title: 'إدراج البيانات وتعديلها وحذفها',
  summary: 'أوامر INSERT و UPDATE و DELETE، والاحتياطات التي تمنعك من إتلاف بياناتك.',
  duration: 40,
  level: 'مبتدئ',
  tags: ['DML', 'البيانات'],
  objectives: [
    'تدرج صفوفاً مفردة ومتعدّدة.',
    'تحدّث البيانات بأمان.',
    'تحذف الصفوف مع فهم المخاطر.',
    'تستخدم الإدراج من استعلام.',
    'تتعامل مع التعارضات (Upsert).'
  ],
  quickRef: [
    { code: 'INSERT INTO t (cols) VALUES (…)', desc: 'إدراج' },
    { code: 'INSERT … SELECT …', desc: 'إدراج من استعلام' },
    { code: 'UPDATE t SET c = v WHERE …', desc: 'تحديث' },
    { code: 'DELETE FROM t WHERE …', desc: 'حذف' },
    { code: 'ON CONFLICT DO UPDATE', desc: 'إدراج أو تحديث' },
    { code: 'RETURNING *', desc: 'إرجاع الصفوف المتأثّرة' }
  ],
  blocks: [
    { t: 'h2', text: 'الإدراج' },
    { t: 'code', lang: 'sql', code: `
-- صف واحد بأعمدة محدّدة — الطريقة الموصى بها
INSERT INTO customers (name, email, city)
VALUES ('سارة عبدالله', 'sara@example.com', 'الرياض');

-- عدة صفوف دفعة واحدة — أسرع بكثير
INSERT INTO customers (name, email, city) VALUES
  ('خالد الأحمد',   'khalid@example.com', 'جدة'),
  ('نورة القحطاني', 'noura@example.com',  'الدمام'),
  ('فهد العتيبي',   'fahad@example.com',  'الرياض');

-- بلا تحديد الأعمدة — تجنّبها
INSERT INTO customers VALUES (1, 'سارة', 'sara@example.com', 'الرياض');` },
    { t: 'danger', title: 'حدّد الأعمدة دائماً', text: 'الإدراج بلا تحديد أعمدة يعتمد على **ترتيبها** في الجدول. إن أضاف زميلك عموداً جديداً أو غيّر الترتيب، سينكسر كل كود الإدراج لديك — وقد يدخل البيانات في أعمدة خاطئة بصمت.' },
    { t: 'tip', text: 'إدراج 1000 صف في أمر واحد أسرع عشرات المرات من 1000 أمر منفصل، لأن كل أمر يحمل تكلفة اتصال ومعاملة مستقلة.' },

    { t: 'h3', text: 'الإدراج من استعلام' },
    { t: 'code', lang: 'sql', code: `
-- نسخ صفوف من جدول لآخر
INSERT INTO customers_archive (id, name, email, city)
SELECT id, name, email, city
FROM customers
WHERE created_at < '2024-01-01';

-- إنشاء جدول من نتيجة استعلام
CREATE TABLE top_customers AS
SELECT * FROM customers WHERE total_spent > 10000;` },

    { t: 'h3', text: 'إرجاع الصفوف المدرجة' },
    { t: 'code', lang: 'sql', code: `
-- PostgreSQL و SQLite الحديثة
INSERT INTO orders (customer_id, total)
VALUES (1, 450.00)
RETURNING id, ordered_at;

-- MySQL
INSERT INTO orders (customer_id, total) VALUES (1, 450.00);
SELECT LAST_INSERT_ID();` },
    { t: 'p', text: '`RETURNING` مفيدة جداً: تحصل على المعرّف المولَّد والقيم الافتراضية في استعلام واحد بدل استعلامين.' },

    { t: 'h2', text: 'التحديث' },
    { t: 'code', lang: 'sql', code: `
-- تحديث عمود واحد
UPDATE products
SET price = 349.00
WHERE id = 5;

-- عدة أعمدة
UPDATE products
SET price = 349.00,
    stock = stock - 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 5;

-- تحديث بحساب من القيمة الحالية
UPDATE products
SET price = price * 0.9        -- خصم 10٪
WHERE category_id = 3;

-- تحديث بشرط مركّب
UPDATE orders
SET status = 'cancelled'
WHERE status = 'pending'
  AND ordered_at < CURRENT_DATE - INTERVAL '7 days';` },
    { t: 'danger', title: 'أخطر خطأ في SQL', text: '`UPDATE` بلا `WHERE` يحدّث **كل صفوف الجدول**. جملة واحدة منسية قد تدمّر قاعدة بيانات إنتاج كاملة. هذا ليس تحذيراً نظرياً — حدث لشركات كبرى.' },
    { t: 'code', lang: 'sql', title: 'عادة تحميك', code: `
-- 1) اكتب SELECT أولاً وتحقّق من الصفوف
SELECT * FROM products WHERE category_id = 3;

-- 2) عدّ الصفوف — هل العدد متوقّع؟
SELECT COUNT(*) FROM products WHERE category_id = 3;

-- 3) بعدها فقط حوّلها إلى UPDATE بنفس الشرط
UPDATE products SET price = price * 0.9 WHERE category_id = 3;` },
    { t: 'tip', text: 'في بيئة الإنتاج، شغّل التحديثات داخل معاملة: `BEGIN;` ثم `UPDATE` ثم تحقّق من النتيجة، ثم `COMMIT;` أو `ROLLBACK;` إن كانت خاطئة. سنفصّل المعاملات في الدرس العاشر.' },

    { t: 'h3', text: 'التحديث من جدول آخر' },
    { t: 'code', lang: 'sql', code: `
-- PostgreSQL
UPDATE products p
SET price = n.new_price
FROM new_prices n
WHERE p.id = n.product_id;

-- MySQL
UPDATE products p
JOIN new_prices n ON p.id = n.product_id
SET p.price = n.new_price;` },

    { t: 'h2', text: 'الحذف' },
    { t: 'code', lang: 'sql', code: `
-- حذف صف واحد
DELETE FROM customers WHERE id = 42;

-- حذف بشرط
DELETE FROM sessions
WHERE expires_at < CURRENT_TIMESTAMP;

-- حذف كل الصفوف (بطيء — يسجّل كل صف)
DELETE FROM logs;

-- تفريغ الجدول (سريع جداً — لا يمكن التراجع)
TRUNCATE TABLE logs;` },
    { t: 'table', head: ['الوجه', '`DELETE`', '`TRUNCATE`'], rows: [
      ['الشرط `WHERE`', 'مدعوم', 'غير مدعوم — يحذف الكل'],
      ['السرعة', 'بطيء مع الصفوف الكثيرة', 'فوري تقريباً'],
      ['التراجع في معاملة', 'ممكن', 'غير ممكن غالباً'],
      ['عدّاد `AUTO_INCREMENT`', 'يبقى كما هو', 'يُصفَّر'],
      ['المشغّلات (Triggers)', 'تُنفَّذ', 'لا تُنفَّذ']
    ]},
    { t: 'warn', title: 'الحذف الناعم بديل أفضل غالباً', text: 'بدل حذف البيانات فعلياً، أضف عمود `deleted_at`. تحتفظ بالسجلّ التاريخي، وتستطيع التراجع، ولا تكسر المفاتيح الأجنبية.' },
    { t: 'code', lang: 'sql', title: 'الحذف الناعم', code: `
-- بدل DELETE
UPDATE customers
SET deleted_at = CURRENT_TIMESTAMP
WHERE id = 42;

-- وفي كل الاستعلامات
SELECT * FROM customers WHERE deleted_at IS NULL;

-- أو أنشئ عرضاً يخفي المحذوفات
CREATE VIEW active_customers AS
SELECT * FROM customers WHERE deleted_at IS NULL;` },

    { t: 'h2', text: 'الإدراج أو التحديث (Upsert)' },
    { t: 'p', text: 'حالة شائعة: أدرج الصف إن لم يكن موجوداً، وحدّثه إن كان. الحلّ يختلف بين الأنظمة.' },
    { t: 'code', lang: 'sql', title: 'PostgreSQL و SQLite', code: `
INSERT INTO product_stats (product_id, views)
VALUES (5, 1)
ON CONFLICT (product_id)
DO UPDATE SET views = product_stats.views + 1;` },
    { t: 'code', lang: 'sql', title: 'MySQL', code: `
INSERT INTO product_stats (product_id, views)
VALUES (5, 1)
ON DUPLICATE KEY UPDATE views = views + 1;` },
    { t: 'code', lang: 'sql', title: 'تجاهل التعارض', code: `
-- لا تفعل شيئاً إن كان موجوداً
INSERT INTO tags (name) VALUES ('css')
ON CONFLICT (name) DO NOTHING;` },
    { t: 'note', text: 'شرط عمل Upsert وجود قيد `UNIQUE` أو `PRIMARY KEY` على العمود المذكور — هو ما يكتشف به المحرّك التعارض.' },

    { t: 'h2', text: 'سيناريو كامل' },
    { t: 'code', lang: 'sql', title: 'دورة حياة طلب', code: `
-- 1) إنشاء الطلب
INSERT INTO orders (customer_id, status, total)
VALUES (1, 'pending', 0)
RETURNING id;   -- لنفترض أنه 101

-- 2) إضافة العناصر
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES
  (101, 5, 2, 299.00),
  (101, 8, 1, 450.00);

-- 3) تحديث إجمالي الطلب
UPDATE orders
SET total = (
  SELECT SUM(quantity * unit_price)
  FROM order_items
  WHERE order_id = 101
)
WHERE id = 101;

-- 4) خصم المخزون
UPDATE products
SET stock = stock - (
  SELECT quantity FROM order_items
  WHERE order_id = 101 AND product_id = products.id
)
WHERE id IN (SELECT product_id FROM order_items WHERE order_id = 101);

-- 5) تأكيد الدفع
UPDATE orders
SET status = 'paid', paid_at = CURRENT_TIMESTAMP
WHERE id = 101 AND status = 'pending';` },
    { t: 'tip', text: 'لاحظ `AND status = "pending"` في الخطوة الأخيرة: تمنع تحديث طلب أُلغي أو دُفع مسبقاً. هذا نمط مهم يُسمّى **القفل المتفائل** ويحمي من حالات التسابق.' },

    { t: 'h2', text: 'أخطاء شائعة' },
    { t: 'compare', lang: 'sql', bad: {
      code: '-- ✗ نسيان WHERE\nUPDATE users SET is_admin = TRUE;\n\n-- ✗ مقارنة NULL\nDELETE FROM users WHERE deleted_at = NULL;\n\n-- ✗ إدراج بلا أعمدة\nINSERT INTO users VALUES (1, "سارة");',
      why: 'الأولى تجعل كل المستخدمين مدراء، والثانية لا تحذف شيئاً، والثالثة تنكسر عند أي تغيير في الجدول.'
    }, good: {
      code: '-- ✓\nUPDATE users SET is_admin = TRUE WHERE id = 1;\n\n-- ✓\nDELETE FROM users WHERE deleted_at IS NOT NULL;\n\n-- ✓\nINSERT INTO users (id, name) VALUES (1, "سارة");',
      why: 'شرط محدّد، ومقارنة NULL صحيحة، وأعمدة صريحة.'
    }},
    { t: 'ul', items: [
      'نسيان `WHERE` في `UPDATE` أو `DELETE`.',
      'استخدام `=` مع `NULL` بدل `IS`.',
      'الإدراج بلا تحديد أعمدة.',
      'تحديث سجلّ تاريخي بدل إنشاء سجلّ جديد.',
      'الحذف الفعلي حيث يكفي الحذف الناعم.',
      'إدراج آلاف الصفوف في أوامر منفصلة بدل دفعة واحدة.'
    ]},

    { t: 'exercise',
      title: 'تمرين: إدارة بيانات متجر',
      brief: 'نفّذ سلسلة عمليات على قاعدة المتجر التي بنيتها في الدرس السابق.',
      requirements: [
        'أدرج خمسة منتجات في أمر `INSERT` واحد.',
        'أدرج ثلاثة عملاء مع `RETURNING` لمعرّفاتهم (أو ما يعادلها).',
        'أنشئ طلباً لعميل، وأضف له ثلاثة عناصر، ثم حدّث إجماليه من عناصره.',
        'اخصم الكميات المطلوبة من مخزون المنتجات.',
        'ارفع سعر كل منتجات تصنيف معيّن بنسبة 15٪.',
        'ألغِ كل الطلبات المعلّقة الأقدم من ثلاثين يوماً.',
        'استخدم Upsert لتسجيل مشاهدة منتج: أدرج بعدّاد 1 أو زد العدّاد الحالي.',
        'طبّق الحذف الناعم على عميل بدل حذفه فعلياً.',
        'قبل كل `UPDATE` أو `DELETE`، اكتب `SELECT` مقابلاً في تعليق للتحقّق.'
      ],
      hints: [
        'الاستعلام الفرعي داخل `SET` يحسب الإجمالي من `order_items`.',
        'Upsert يحتاج قيد `UNIQUE` على العمود المستهدف.',
        'استخدم `CURRENT_DATE - INTERVAL` لحساب التواريخ.'
      ],
      solution: { lang: 'sql', code: `
-- ===== 1) إدراج منتجات =====
INSERT INTO products (category_id, name, sku, price, stock) VALUES
  (1, 'سماعة لاسلكية',  'SKU-001', 299.00, 50),
  (1, 'سماعة سلكية',    'SKU-002', 120.00, 80),
  (2, 'لوحة مفاتيح',    'SKU-003', 450.00, 30),
  (2, 'ماوس لاسلكي',    'SKU-004', 130.00, 65),
  (3, 'شاشة 27 بوصة',   'SKU-005', 1450.00, 12);

-- ===== 2) إدراج عملاء =====
INSERT INTO customers (name, email, phone, city) VALUES
  ('سارة عبدالله', 'sara@example.com',   '0501112222', 'الرياض'),
  ('خالد الأحمد',  'khalid@example.com', '0553334444', 'جدة'),
  ('نورة القحطاني','noura@example.com',  NULL,         'الدمام')
RETURNING id, name;

-- ===== 3) إنشاء طلب =====
INSERT INTO orders (customer_id, status, total)
VALUES (1, 'pending', 0)
RETURNING id;    -- افترض 101

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (101, 1, 2, 299.00),
  (101, 3, 1, 450.00),
  (101, 4, 3, 130.00);

-- التحقّق قبل التحديث
-- SELECT SUM(quantity * unit_price) FROM order_items WHERE order_id = 101;

UPDATE orders
SET total = (
  SELECT SUM(quantity * unit_price)
  FROM order_items
  WHERE order_id = 101
)
WHERE id = 101;

-- ===== 4) خصم المخزون =====
-- SELECT id, name, stock FROM products
-- WHERE id IN (SELECT product_id FROM order_items WHERE order_id = 101);

UPDATE products
SET stock = stock - (
  SELECT oi.quantity
  FROM order_items oi
  WHERE oi.order_id = 101 AND oi.product_id = products.id
)
WHERE id IN (
  SELECT product_id FROM order_items WHERE order_id = 101
);

-- ===== 5) رفع أسعار تصنيف =====
-- SELECT COUNT(*) FROM products WHERE category_id = 2;

UPDATE products
SET price = ROUND(price * 1.15, 2),
    updated_at = CURRENT_TIMESTAMP
WHERE category_id = 2;

-- ===== 6) إلغاء الطلبات القديمة =====
-- SELECT COUNT(*) FROM orders
-- WHERE status = 'pending' AND ordered_at < CURRENT_DATE - INTERVAL '30 days';

UPDATE orders
SET status = 'cancelled'
WHERE status = 'pending'
  AND ordered_at < CURRENT_DATE - INTERVAL '30 days';

-- ===== 7) تسجيل مشاهدة (Upsert) =====
CREATE TABLE IF NOT EXISTS product_stats (
  product_id INT PRIMARY KEY,
  views      INT NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO product_stats (product_id, views)
VALUES (1, 1)
ON CONFLICT (product_id)
DO UPDATE SET views = product_stats.views + 1;

-- ===== 8) حذف ناعم =====
ALTER TABLE customers ADD COLUMN deleted_at TIMESTAMP NULL;

-- SELECT id, name FROM customers WHERE id = 3;

UPDATE customers
SET deleted_at = CURRENT_TIMESTAMP
WHERE id = 3;

-- الاستعلامات اللاحقة تستثني المحذوفين
SELECT id, name, city
FROM customers
WHERE deleted_at IS NULL;` } },

    { t: 'quiz', items: [
      { q: 'ماذا يحدث عند `UPDATE users SET active = 0;` بلا `WHERE`؟', options: ['لا شيء', 'يُحدَّث كل صفوف الجدول', 'خطأ', 'يُحدَّث أول صف'], answer: 1,
        explain: 'أخطر خطأ في SQL؛ اكتب `SELECT` بنفس الشرط أولاً دائماً.' },
      { q: 'لماذا نحدّد الأعمدة في `INSERT`؟', options: ['أوضح فقط', 'لأن الإدراج بلا أعمدة يعتمد على ترتيبها فينكسر عند أي تغيير في الجدول', 'أسرع', 'إلزامي'], answer: 1,
        explain: 'قد يدخل البيانات في أعمدة خاطئة بصمت عند تغيّر البنية.' },
      { q: 'ما ميزة الحذف الناعم؟', options: ['أسرع', 'يحفظ السجلّ التاريخي ويسمح بالتراجع ولا يكسر المفاتيح الأجنبية', 'يوفّر مساحة', 'أبسط'], answer: 1,
        explain: 'البيانات المحذوفة نهائياً لا تعود؛ عمود `deleted_at` يحلّ ذلك.' },
      { q: 'ما شرط عمل Upsert؟', options: ['فهرس', 'وجود قيد `UNIQUE` أو `PRIMARY KEY` يكتشف به المحرّك التعارض', 'معاملة', 'لا شرط'], answer: 1,
        explain: 'بدون قيد فريد لا يعرف المحرّك أن الصف مكرّر.' },
      { q: 'ما الفرق الأهم بين `DELETE` و `TRUNCATE`؟', options: ['لا فرق', '`TRUNCATE` يحذف الكل بسرعة بلا شرط ولا يمكن التراجع عنه غالباً', 'العكس', '`DELETE` أسرع'], answer: 1,
        explain: '`TRUNCATE` لا يقبل `WHERE` ولا يشغّل المشغّلات ويصفّر العدّاد.' }
    ]}
  ]
};
