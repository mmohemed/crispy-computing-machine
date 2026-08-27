'use strict';

module.exports = {
  slug: '04-select',
  title: 'الاستعلام: SELECT و WHERE',
  summary: 'قلب SQL: اختيار الأعمدة، وترشيح الصفوف بكل أنواع الشروط، والتعامل مع النصوص والقوائم والمدَيات.',
  duration: 50,
  level: 'مبتدئ',
  tags: ['SELECT', 'الترشيح'],
  objectives: [
    'تختار أعمدة محدّدة وتسمّيها.',
    'ترشّح الصفوف بشروط بسيطة ومركّبة.',
    'تبحث في النصوص بأنماط.',
    'تتعامل مع القوائم والمدَيات و NULL.',
    'تفهم ترتيب تنفيذ الاستعلام.'
  ],
  quickRef: [
    { code: 'SELECT col FROM t', desc: 'اختيار أعمدة' },
    { code: 'AS alias', desc: 'تسمية بديلة' },
    { code: 'WHERE cond', desc: 'ترشيح الصفوف' },
    { code: 'AND / OR / NOT', desc: 'دمج الشروط' },
    { code: 'IN (a, b, c)', desc: 'ضمن قائمة' },
    { code: 'BETWEEN a AND b', desc: 'ضمن مدى' },
    { code: 'LIKE "%نص%"', desc: 'بحث نمطي' },
    { code: 'IS NULL', desc: 'فحص القيمة الفارغة' }
  ],
  blocks: [
    { t: 'h2', text: 'بنية الاستعلام' },
    { t: 'code', lang: 'sql', code: `
SELECT   الأعمدة
FROM     الجدول
WHERE    شرط الترشيح
GROUP BY التجميع
HAVING   شرط على المجموعات
ORDER BY الترتيب
LIMIT    عدد النتائج;` },
    { t: 'note', title: 'ترتيب التنفيذ يخالف ترتيب الكتابة', text: 'المحرّك ينفّذ: `FROM` ← `WHERE` ← `GROUP BY` ← `HAVING` ← `SELECT` ← `ORDER BY` ← `LIMIT`. لهذا **لا تستطيع** استخدام اسم بديل عرّفته في `SELECT` داخل `WHERE` — لأن `WHERE` تُنفَّذ قبله.' },

    { t: 'h2', text: 'اختيار الأعمدة' },
    { t: 'code', lang: 'sql', code: `
-- كل الأعمدة
SELECT * FROM products;

-- أعمدة محدّدة — الأفضل دائماً
SELECT name, price, stock FROM products;

-- أسماء بديلة
SELECT
  name        AS product_name,
  price * 1.15 AS price_with_vat,
  stock       AS "الكمية المتاحة"
FROM products;

-- تعبيرات محسوبة
SELECT
  name,
  price,
  stock,
  price * stock AS inventory_value
FROM products;

-- قيم ثابتة
SELECT name, 'ريال' AS currency FROM products;

-- قيم مميّزة بلا تكرار
SELECT DISTINCT city FROM customers;
SELECT DISTINCT city, country FROM customers;` },
    { t: 'warn', title: 'تجنّب `SELECT *` في التطبيقات', text: 'ينقل أعمدة لا تحتاجها فيستهلك شبكة وذاكرة، ويكسر كودك عند إضافة عمود جديد، ويمنع المحرّك من استخدام «الفهرس المغطّي». استخدمه للاستكشاف اليدوي فقط.' },
    { t: 'demo', title: 'الأسماء البديلة في الناتج', height: 240,
      css: 'table{width:100%;border-collapse:collapse;font-size:.88em}th{background:#6a5acd;color:#fff;padding:8px 12px;text-align:right}td{padding:7px 12px;border-bottom:1px solid #e2e8f0}tr:nth-child(even) td{background:#f8fafc}',
      html: '<table><tr><th>product_name</th><th>price_with_vat</th><th>inventory_value</th></tr><tr><td>سماعة لاسلكية</td><td>343.85</td><td>14950.00</td></tr><tr><td>لوحة مفاتيح</td><td>517.50</td><td>13500.00</td></tr><tr><td>ماوس لاسلكي</td><td>149.50</td><td>8450.00</td></tr></table>' },

    { t: 'h2', text: 'الترشيح بـ WHERE' },
    { t: 'h3', text: 'معاملات المقارنة' },
    { t: 'code', lang: 'sql', code: `
SELECT * FROM products WHERE price = 299;
SELECT * FROM products WHERE price > 500;
SELECT * FROM products WHERE price >= 500;
SELECT * FROM products WHERE price < 100;
SELECT * FROM products WHERE price <> 299;   -- لا يساوي
SELECT * FROM products WHERE price != 299;   -- نفس المعنى` },

    { t: 'h3', text: 'دمج الشروط' },
    { t: 'code', lang: 'sql', code: `
-- كلا الشرطين
SELECT * FROM products
WHERE price > 100 AND stock > 0;

-- أحد الشرطين
SELECT * FROM products
WHERE category_id = 1 OR category_id = 2;

-- النفي
SELECT * FROM products
WHERE NOT is_active;

-- الأقواس تحسم الأولوية — استخدمها دائماً
SELECT * FROM products
WHERE (category_id = 1 OR category_id = 2)
  AND price < 500;` },
    { t: 'danger', title: 'أولوية AND أعلى من OR', text: 'الشرط `a OR b AND c` يُفسَّر `a OR (b AND c)` لا `(a OR b) AND c`. هذا مصدر أخطاء منطقية يصعب اكتشافها. **ضع أقواساً صريحة دائماً** حتى لو لم تكن ضرورية.' },
    { t: 'demo', title: 'أثر الأقواس', height: 260,
      css: 'pre{background:#0f1729;color:#e2e8f0;padding:12px;border-radius:10px;direction:ltr;text-align:left;font-family:monospace;font-size:.82em;line-height:1.85;margin:0 0 10px;overflow-x:auto}.c{color:#fca5a5}.g{color:#86efac}',
      html: '<pre><span class="c">-- بلا أقواس: يُفسَّر خطأً</span>\nWHERE city = \'الرياض\' OR city = \'جدة\' AND price &lt; 500\n\n<span class="c">-- المعنى الفعلي:</span>\nWHERE city = \'الرياض\' OR (city = \'جدة\' AND price &lt; 500)\n<span class="c">-- كل منتجات الرياض تظهر مهما كان سعرها!</span></pre><pre><span class="g">-- بالأقواس: المعنى المقصود</span>\nWHERE (city = \'الرياض\' OR city = \'جدة\') AND price &lt; 500</pre>' },

    { t: 'h3', text: 'القوائم والمدَيات' },
    { t: 'code', lang: 'sql', code: `
-- ضمن قائمة
SELECT * FROM products WHERE category_id IN (1, 2, 5);
SELECT * FROM customers WHERE city IN ('الرياض', 'جدة', 'الدمام');

-- خارج القائمة
SELECT * FROM orders WHERE status NOT IN ('cancelled', 'refunded');

-- ضمن مدى — شامل الطرفين
SELECT * FROM products WHERE price BETWEEN 100 AND 500;
-- تكافئ: price >= 100 AND price <= 500

SELECT * FROM orders
WHERE ordered_at BETWEEN '2026-01-01' AND '2026-03-31';

-- خارج المدى
SELECT * FROM products WHERE price NOT BETWEEN 100 AND 500;` },
    { t: 'warn', title: 'فخّ BETWEEN مع التواريخ', text: '`BETWEEN "2026-01-01" AND "2026-03-31"` مع عمود `TIMESTAMP` **يستثني** كل ما بعد منتصف ليل 31 مارس. الأصح: `>= "2026-01-01" AND < "2026-04-01"`.' },

    { t: 'h3', text: 'القيم الفارغة' },
    { t: 'code', lang: 'sql', code: `
SELECT * FROM customers WHERE phone IS NULL;
SELECT * FROM customers WHERE phone IS NOT NULL;

-- استبدال NULL بقيمة
SELECT name, COALESCE(phone, 'غير متوفّر') AS phone
FROM customers;

-- انتبه: NOT IN مع NULL لا تُرجع شيئاً
SELECT * FROM products
WHERE category_id NOT IN (1, 2, NULL);   -- ✗ نتيجة فارغة دائماً!` },
    { t: 'note', text: 'سبب الفخّ الأخير: `NOT IN` تتحوّل إلى سلسلة `<>` مع `AND`، وأي مقارنة مع `NULL` تُنتج `NULL` فيصبح الشرط كله غير محقّق. تجنّب `NULL` داخل قوائم `NOT IN`.' },

    { t: 'h2', text: 'البحث النصّي بـ LIKE' },
    { t: 'code', lang: 'sql', code: `
-- % تعني أي عدد من المحارف (بما فيه صفر)
SELECT * FROM products WHERE name LIKE 'سماعة%';    -- يبدأ بـ
SELECT * FROM products WHERE name LIKE '%لاسلكي';   -- ينتهي بـ
SELECT * FROM products WHERE name LIKE '%لاسلكي%';  -- يحتوي

-- _ تعني محرفاً واحداً بالضبط
SELECT * FROM products WHERE sku LIKE 'SKU-00_';

-- النفي
SELECT * FROM products WHERE name NOT LIKE '%مستعمل%';

-- بلا حساسية لحالة الأحرف (PostgreSQL)
SELECT * FROM products WHERE name ILIKE '%laptop%';` },
    { t: 'demo', title: 'أنماط LIKE', height: 260,
      css: 'table{width:100%;border-collapse:collapse;font-size:.88em}th{background:#6a5acd;color:#fff;padding:8px 12px;text-align:right}td{padding:7px 12px;border-bottom:1px solid #e2e8f0}code{font-family:monospace;direction:ltr;display:inline-block;background:#f1f5f9;padding:2px 7px;border-radius:5px;font-size:.88em}',
      html: '<table><tr><th>النمط</th><th>يطابق</th><th>لا يطابق</th></tr><tr><td><code>\'سماعة%\'</code></td><td>سماعة لاسلكية</td><td>سماعات رأس</td></tr><tr><td><code>\'%لاسلكي%\'</code></td><td>ماوس لاسلكي</td><td>لوحة مفاتيح</td></tr><tr><td><code>\'SKU-00_\'</code></td><td>SKU-001</td><td>SKU-0012</td></tr><tr><td><code>\'a%b\'</code></td><td>ab, axxb</td><td>ba</td></tr></table>' },
    { t: 'danger', title: 'مشكلة الأداء', text: 'نمط يبدأ بـ `%` مثل `LIKE "%نص%"` **لا يستطيع استخدام الفهرس**، فيمسح المحرّك الجدول كله. مع مليون صف يصبح بطيئاً جداً. للبحث النصّي الجادّ استخدم فهرسة النص الكامل (Full-Text Search) أو محرك بحث مخصّص.' },

    { t: 'h2', text: 'التعامل مع التواريخ' },
    { t: 'code', lang: 'sql', code: `
-- مقارنة مباشرة
SELECT * FROM orders WHERE ordered_at >= '2026-01-01';

-- استخراج أجزاء
SELECT * FROM orders WHERE EXTRACT(YEAR FROM ordered_at) = 2026;
SELECT * FROM orders WHERE EXTRACT(MONTH FROM ordered_at) = 3;

-- MySQL
SELECT * FROM orders WHERE YEAR(ordered_at) = 2026;
SELECT * FROM orders WHERE DATE(ordered_at) = '2026-03-15';

-- آخر ثلاثين يوماً
SELECT * FROM orders
WHERE ordered_at >= CURRENT_DATE - INTERVAL '30 days';   -- PostgreSQL

SELECT * FROM orders
WHERE ordered_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);  -- MySQL` },
    { t: 'warn', title: 'لا تلفّ العمود بدالة', text: '`WHERE YEAR(ordered_at) = 2026` تمنع استخدام الفهرس لأن المحرّك يجب أن يحسب الدالة لكل صف. الأفضل: `WHERE ordered_at >= "2026-01-01" AND ordered_at < "2027-01-01"`.' },

    { t: 'h2', text: 'الترتيب والتحديد' },
    { t: 'code', lang: 'sql', code: `
-- ترتيب تصاعدي (الافتراضي)
SELECT * FROM products ORDER BY price;
SELECT * FROM products ORDER BY price ASC;

-- تنازلي
SELECT * FROM products ORDER BY price DESC;

-- عدة أعمدة
SELECT * FROM products ORDER BY category_id ASC, price DESC;

-- بترتيب العمود في SELECT
SELECT name, price FROM products ORDER BY 2 DESC;

-- موضع NULL
SELECT * FROM customers ORDER BY phone NULLS LAST;   -- PostgreSQL

-- التحديد
SELECT * FROM products ORDER BY price DESC LIMIT 10;
SELECT * FROM products ORDER BY price DESC LIMIT 10 OFFSET 20;  -- الصفحة الثالثة` },
    { t: 'tip', text: 'للترقيم (Pagination): الصفحة رقم `n` بحجم `s` تكون `LIMIT s OFFSET (n-1)*s`. لكن `OFFSET` الكبير بطيء لأن المحرّك يقرأ ويتخطّى؛ في الجداول الضخمة استخدم الترقيم بالمفتاح: `WHERE id > last_id ORDER BY id LIMIT 20`.' },

    { t: 'h2', text: 'استعلامات عملية' },
    { t: 'code', lang: 'sql', code: `
-- المنتجات المتاحة في نطاق سعري
SELECT name, price, stock
FROM products
WHERE is_active = TRUE
  AND stock > 0
  AND price BETWEEN 100 AND 1000
ORDER BY price ASC;

-- العملاء بلا رقم جوال في مدن محدّدة
SELECT name, email, city
FROM customers
WHERE city IN ('الرياض', 'جدة')
  AND phone IS NULL
  AND deleted_at IS NULL;

-- الطلبات النشطة هذا الشهر
SELECT id, customer_id, total, status
FROM orders
WHERE status NOT IN ('cancelled', 'refunded')
  AND ordered_at >= '2026-03-01'
  AND ordered_at <  '2026-04-01'
ORDER BY total DESC
LIMIT 20;

-- بحث في المنتجات
SELECT name, price
FROM products
WHERE (name LIKE '%سماعة%' OR sku LIKE '%SKU-00%')
  AND is_active = TRUE
ORDER BY name;` },

    { t: 'exercise',
      title: 'تمرين: استعلامات متجر',
      brief: 'اكتب اثني عشر استعلاماً على قاعدة المتجر.',
      requirements: [
        'كل المنتجات النشطة مرتّبة بالسعر تنازلياً.',
        'اسم المنتج وسعره شاملاً ضريبة 15٪ باسم بديل عربي.',
        'المنتجات التي سعرها بين 200 و 800 ومخزونها أكبر من صفر.',
        'المنتجات في التصنيفات 1 أو 3، بسعر أقل من 500 (انتبه للأقواس).',
        'العملاء الذين لا يملكون رقم جوال.',
        'المدن المميّزة التي ينتمي إليها العملاء بلا تكرار.',
        'المنتجات التي يحتوي اسمها كلمة «لاسلكي».',
        'المنتجات التي رمزها يبدأ بـ `SKU-00` ويليه رقم واحد.',
        'الطلبات التي حالتها ليست ملغاة ولا مستردّة.',
        'الطلبات في الربع الأول من 2026 (انتبه لفخّ BETWEEN).',
        'أغلى خمسة منتجات في التصنيف 2.',
        'الصفحة الثالثة من المنتجات بحجم صفحة 10.'
      ],
      hints: [
        'استخدم الأقواس صراحةً مع أي خليط من `AND` و `OR`.',
        'للتواريخ استخدم `>=` و `<` بدل `BETWEEN`.',
        '`_` في `LIKE` تطابق محرفاً واحداً بالضبط.'
      ],
      solution: { lang: 'sql', code: `
-- 1) المنتجات النشطة
SELECT name, price, stock
FROM products
WHERE is_active = TRUE
ORDER BY price DESC;

-- 2) السعر شاملاً الضريبة
SELECT
  name                        AS "المنتج",
  price                       AS "السعر",
  ROUND(price * 1.15, 2)      AS "السعر شامل الضريبة"
FROM products
WHERE is_active = TRUE;

-- 3) نطاق سعري ومخزون متاح
SELECT name, price, stock
FROM products
WHERE price BETWEEN 200 AND 800
  AND stock > 0
ORDER BY price;

-- 4) تصنيفات محدّدة بسعر أقل من 500
SELECT name, price, category_id
FROM products
WHERE (category_id = 1 OR category_id = 3)
  AND price < 500;

-- 5) عملاء بلا جوال
SELECT name, email, city
FROM customers
WHERE phone IS NULL
  AND deleted_at IS NULL;

-- 6) المدن المميّزة
SELECT DISTINCT city
FROM customers
WHERE city IS NOT NULL
ORDER BY city;

-- 7) بحث نصّي
SELECT name, price
FROM products
WHERE name LIKE '%لاسلكي%';

-- 8) نمط الرمز
SELECT name, sku
FROM products
WHERE sku LIKE 'SKU-00_';

-- 9) الطلبات النشطة
SELECT id, customer_id, total, status
FROM orders
WHERE status NOT IN ('cancelled', 'refunded');

-- 10) الربع الأول 2026 — بلا فخّ BETWEEN
SELECT id, total, ordered_at
FROM orders
WHERE ordered_at >= '2026-01-01'
  AND ordered_at <  '2026-04-01'
ORDER BY ordered_at;

-- 11) أغلى خمسة في التصنيف 2
SELECT name, price
FROM products
WHERE category_id = 2
ORDER BY price DESC
LIMIT 5;

-- 12) الصفحة الثالثة
SELECT name, price
FROM products
ORDER BY id
LIMIT 10 OFFSET 20;` } },

    { t: 'quiz', items: [
      { q: 'ما الترتيب الفعلي لتنفيذ الاستعلام؟', options: ['SELECT ثم FROM ثم WHERE', 'FROM ثم WHERE ثم SELECT ثم ORDER BY', 'WHERE ثم SELECT', 'عشوائي'], answer: 1,
        explain: 'لهذا لا يمكن استخدام اسم بديل من `SELECT` داخل `WHERE`.' },
      { q: 'كيف يُفسَّر `a OR b AND c`؟', options: ['`(a OR b) AND c`', '`a OR (b AND c)`', 'من اليسار لليمين', 'خطأ'], answer: 1,
        explain: 'أولوية `AND` أعلى؛ استخدم أقواساً صريحة دائماً.' },
      { q: 'لماذا `LIKE "%نص%"` بطيئة؟', options: ['طويلة', 'لا تستطيع استخدام الفهرس فيُمسح الجدول كله', 'تحتاج ترميزاً', 'غير مدعومة'], answer: 1,
        explain: 'الفهرس يعمل من بداية القيمة؛ البدء بـ `%` يعطّله.' },
      { q: 'ما مشكلة `BETWEEN "2026-01-01" AND "2026-03-31"` مع `TIMESTAMP`؟', options: ['لا مشكلة', 'تستثني ما بعد منتصف ليل 31 مارس', 'بطيئة', 'خطأ صياغة'], answer: 1,
        explain: 'الأصح: `>= "2026-01-01" AND < "2026-04-01"`.' },
      { q: 'لماذا نتجنّب `SELECT *` في التطبيقات؟', options: ['غير مدعوم', 'ينقل بيانات لا تحتاجها ويكسر الكود عند إضافة عمود ويمنع الفهرس المغطّي', 'أطول', 'لا سبب'], answer: 1,
        explain: 'حدّد الأعمدة التي تحتاجها فعلاً.' }
    ]}
  ]
};
