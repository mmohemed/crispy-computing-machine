'use strict';

module.exports = {
  slug: '06-aggregate',
  title: 'الدوال التجميعية و GROUP BY',
  summary: 'تلخيص البيانات: العدّ والجمع والمتوسّط، والتجميع حسب فئة، والترشيح على المجموعات بـ HAVING.',
  duration: 50,
  level: 'متوسط',
  tags: ['التجميع', 'التقارير'],
  objectives: [
    'تستخدم دوال التجميع الخمس.',
    'تجمّع الصفوف حسب عمود أو أكثر.',
    'تفرّق بين `WHERE` و `HAVING`.',
    'تكتب تقارير إحصائية مركّبة.',
    'تتجنّب أخطاء التجميع الشائعة.'
  ],
  quickRef: [
    { code: 'COUNT(*) / COUNT(col)', desc: 'عدّ الصفوف / القيم غير الفارغة' },
    { code: 'SUM(col)', desc: 'المجموع' },
    { code: 'AVG(col)', desc: 'المتوسّط' },
    { code: 'MIN / MAX', desc: 'الأصغر / الأكبر' },
    { code: 'GROUP BY col', desc: 'التجميع' },
    { code: 'HAVING cond', desc: 'ترشيح المجموعات' },
    { code: 'COUNT(DISTINCT col)', desc: 'عدّ القيم المميّزة' }
  ],
  blocks: [
    { t: 'h2', text: 'دوال التجميع' },
    { t: 'p', text: 'تأخذ **مجموعة صفوف** وتُرجع **قيمة واحدة**. بلا `GROUP BY` تعامل الجدول كله كمجموعة واحدة.' },
    { t: 'code', lang: 'sql', code: `
SELECT COUNT(*)      AS total_products,
       SUM(stock)    AS total_stock,
       AVG(price)    AS average_price,
       MIN(price)    AS cheapest,
       MAX(price)    AS most_expensive
FROM products;` },
    { t: 'demo', title: 'النتيجة: صف واحد', height: 180,
      css: 'table{width:100%;border-collapse:collapse;font-size:.88em}th{background:#6a5acd;color:#fff;padding:8px 10px;text-align:right}td{padding:8px 10px;border-bottom:1px solid #e2e8f0}',
      html: '<table><tr><th>total_products</th><th>total_stock</th><th>average_price</th><th>cheapest</th><th>most_expensive</th></tr><tr><td>142</td><td>3,847</td><td>487.23</td><td>25.00</td><td>4,999.00</td></tr></table>' },

    { t: 'h3', text: 'فروق COUNT المهمة' },
    { t: 'code', lang: 'sql', code: `
SELECT
  COUNT(*)               AS all_rows,        -- كل الصفوف
  COUNT(phone)           AS with_phone,      -- يتجاهل NULL
  COUNT(DISTINCT city)   AS unique_cities    -- المدن المميّزة
FROM customers;` },
    { t: 'demo', title: 'الفرق عملياً', height: 280,
      css: 'table{width:100%;border-collapse:collapse;font-size:.86em;margin-bottom:10px}th{background:#6a5acd;color:#fff;padding:7px 10px;text-align:right}td{padding:6px 10px;border-bottom:1px solid #e2e8f0}.n{color:#94a3b8;font-style:italic}b{display:block;font-size:.8em;color:#64748b;margin-bottom:4px}',
      html: '<b>البيانات</b><table><tr><th>id</th><th>name</th><th>phone</th><th>city</th></tr><tr><td>1</td><td>سارة</td><td>0501111</td><td>الرياض</td></tr><tr><td>2</td><td>خالد</td><td class="n">NULL</td><td>جدة</td></tr><tr><td>3</td><td>نورة</td><td>0553333</td><td>الرياض</td></tr></table><b>النتيجة</b><table><tr><th>COUNT(*)</th><th>COUNT(phone)</th><th>COUNT(DISTINCT city)</th></tr><tr><td>3</td><td>2</td><td>2</td></tr></table>' },
    { t: 'warn', title: 'كل دوال التجميع تتجاهل NULL', text: 'عدا `COUNT(*)`. فلو كان عمود `discount` فارغاً في نصف الصفوف، فإن `AVG(discount)` تحسب متوسّط النصف الآخر فقط. إن أردت اعتبار الفارغ صفراً استخدم `AVG(COALESCE(discount, 0))`.' },

    { t: 'h2', text: 'التجميع بـ GROUP BY' },
    { t: 'p', text: 'يقسّم الصفوف إلى مجموعات بحسب قيمة عمود، ثم يطبّق دالة التجميع على كل مجموعة على حدة.' },
    { t: 'code', lang: 'sql', code: `
SELECT
  city,
  COUNT(*)       AS customer_count,
  AVG(balance)   AS avg_balance
FROM customers
GROUP BY city
ORDER BY customer_count DESC;` },
    { t: 'demo', title: 'من صفوف إلى مجموعات', height: 320,
      css: 'table{width:100%;border-collapse:collapse;font-size:.85em;margin-bottom:10px}th{background:#6a5acd;color:#fff;padding:7px 10px;text-align:right}td{padding:6px 10px;border-bottom:1px solid #e2e8f0}b{display:block;font-size:.8em;color:#64748b;margin-bottom:4px}.g1{background:#eef2ff}.g2{background:#fef3c7}',
      html: '<b>قبل التجميع</b><table><tr><th>name</th><th>city</th><th>balance</th></tr><tr class="g1"><td>سارة</td><td>الرياض</td><td>1200</td></tr><tr class="g2"><td>خالد</td><td>جدة</td><td>850</td></tr><tr class="g1"><td>نورة</td><td>الرياض</td><td>600</td></tr><tr class="g2"><td>فهد</td><td>جدة</td><td>1450</td></tr><tr class="g1"><td>ريم</td><td>الرياض</td><td>300</td></tr></table><b>بعد GROUP BY city</b><table><tr><th>city</th><th>customer_count</th><th>avg_balance</th></tr><tr class="g1"><td>الرياض</td><td>3</td><td>700.00</td></tr><tr class="g2"><td>جدة</td><td>2</td><td>1150.00</td></tr></table>' },

    { t: 'h3', text: 'القاعدة الذهبية' },
    { t: 'danger', title: 'كل عمود في SELECT إمّا مجمَّع أو في GROUP BY', text: 'لا يمكن اختيار عمود عادي مع دالة تجميع دون إدراجه في `GROUP BY`. السبب منطقي: لو كان لمدينة الرياض ثلاثة عملاء، فأيّ اسم يعرض المحرّك؟ لا إجابة صحيحة.' },
    { t: 'compare', lang: 'sql', bad: {
      code: 'SELECT city, name, COUNT(*)\nFROM customers\nGROUP BY city;',
      why: 'خطأ: `name` ليس مجمَّعاً ولا في `GROUP BY`. لأي اسم من الثلاثة يعرض؟'
    }, good: {
      code: 'SELECT city, COUNT(*) AS cnt\nFROM customers\nGROUP BY city;\n\n-- أو إن أردت الأسماء\nSELECT city, STRING_AGG(name, \', \') AS names, COUNT(*)\nFROM customers\nGROUP BY city;',
      why: 'إمّا تحذف العمود، أو تجمّعه بدالة مثل `STRING_AGG` تدمج القيم في نص واحد.'
    }},
    { t: 'note', text: 'MySQL تسمح بذلك افتراضياً في بعض الإصدارات وتُرجع قيمة عشوائية — سلوك خطر. الأنظمة الملتزمة بالمعيار (PostgreSQL) ترفضه بخطأ صريح، وهذا أفضل.' },

    { t: 'h3', text: 'التجميع بعدة أعمدة' },
    { t: 'code', lang: 'sql', code: `
SELECT
  city,
  status,
  COUNT(*)   AS order_count,
  SUM(total) AS revenue
FROM orders o
JOIN customers c ON c.id = o.customer_id
GROUP BY city, status
ORDER BY city, revenue DESC;` },
    { t: 'p', text: 'التجميع بعمودين ينشئ مجموعة لكل **تركيبة** فريدة منهما: الرياض/مدفوع، الرياض/ملغى، جدة/مدفوع… وهكذا.' },

    { t: 'h2', text: '`HAVING` — ترشيح المجموعات' },
    { t: 'code', lang: 'sql', code: `
SELECT
  city,
  COUNT(*) AS customer_count
FROM customers
GROUP BY city
HAVING COUNT(*) >= 10
ORDER BY customer_count DESC;` },
    { t: 'table', head: ['الوجه', '`WHERE`', '`HAVING`'], rows: [
      ['متى تُنفَّذ', 'قبل التجميع', 'بعد التجميع'],
      ['تعمل على', 'الصفوف المفردة', 'المجموعات'],
      ['دوال التجميع', '**ممنوعة**', 'مسموحة'],
      ['الأداء', 'أسرع — تقلّل الصفوف مبكراً', 'أبطأ'],
      ['مثال', '`WHERE price > 100`', '`HAVING COUNT(*) > 5`']
    ]},
    { t: 'code', lang: 'sql', title: 'استخدامهما معاً', code: `
SELECT
  category_id,
  COUNT(*)   AS product_count,
  AVG(price) AS avg_price
FROM products
WHERE is_active = TRUE          -- ترشيح الصفوف أولاً
GROUP BY category_id
HAVING AVG(price) > 200         -- ثم ترشيح المجموعات
ORDER BY avg_price DESC;` },
    { t: 'tip', text: 'قاعدة الأداء: ضع في `WHERE` كل ما يمكن وضعه فيه. ترشيح مليون صف إلى ألف **قبل** التجميع أسرع بكثير من تجميع المليون ثم ترشيح النتيجة.' },
    { t: 'compare', lang: 'sql', bad: {
      code: 'SELECT category_id, COUNT(*)\nFROM products\nGROUP BY category_id\nHAVING category_id IN (1, 2, 3);',
      why: 'شرط على عمود عادي وُضع في `HAVING`: يجمّع الجدول كله ثم يرمي أغلبه.'
    }, good: {
      code: 'SELECT category_id, COUNT(*)\nFROM products\nWHERE category_id IN (1, 2, 3)\nGROUP BY category_id;',
      why: 'الترشيح المبكر يقلّص العمل كثيراً.'
    }},

    { t: 'h2', text: 'دوال تجميع إضافية' },
    { t: 'code', lang: 'sql', code: `
-- دمج القيم في نص واحد
SELECT category_id, STRING_AGG(name, ', ') AS products     -- PostgreSQL
FROM products GROUP BY category_id;

SELECT category_id, GROUP_CONCAT(name SEPARATOR ', ')      -- MySQL
FROM products GROUP BY category_id;

-- الوسيط والانحراف
SELECT
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) AS median_price,
  STDDEV(price)  AS price_stddev,
  VARIANCE(price) AS price_variance
FROM products;

-- التجميع الشرطي — قوي جداً
SELECT
  category_id,
  COUNT(*)                                             AS total,
  COUNT(*) FILTER (WHERE stock = 0)                    AS out_of_stock,
  COUNT(*) FILTER (WHERE price > 1000)                 AS premium
FROM products
GROUP BY category_id;

-- المكافئ في MySQL
SELECT
  category_id,
  COUNT(*)                                             AS total,
  SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END)           AS out_of_stock
FROM products
GROUP BY category_id;` },

    { t: 'h2', text: 'تقارير عملية' },
    { t: 'code', lang: 'sql', title: 'المبيعات الشهرية', code: `
SELECT
  EXTRACT(YEAR  FROM ordered_at) AS year,
  EXTRACT(MONTH FROM ordered_at) AS month,
  COUNT(*)                       AS order_count,
  COUNT(DISTINCT customer_id)    AS unique_customers,
  ROUND(SUM(total), 2)           AS revenue,
  ROUND(AVG(total), 2)           AS avg_order_value,
  MAX(total)                     AS largest_order
FROM orders
WHERE status NOT IN ('cancelled', 'refunded')
  AND ordered_at >= '2026-01-01'
GROUP BY EXTRACT(YEAR FROM ordered_at), EXTRACT(MONTH FROM ordered_at)
ORDER BY year, month;` },
    { t: 'demo', title: 'ناتج تقرير المبيعات', height: 250,
      css: 'table{width:100%;border-collapse:collapse;font-size:.84em}th{background:#6a5acd;color:#fff;padding:7px 9px;text-align:right}td{padding:6px 9px;border-bottom:1px solid #e2e8f0}tr:nth-child(even) td{background:#f8fafc}',
      html: '<table><tr><th>year</th><th>month</th><th>orders</th><th>customers</th><th>revenue</th><th>avg</th></tr><tr><td>2026</td><td>1</td><td>284</td><td>197</td><td>142,300</td><td>501.06</td></tr><tr><td>2026</td><td>2</td><td>312</td><td>214</td><td>168,940</td><td>541.47</td></tr><tr><td>2026</td><td>3</td><td>398</td><td>256</td><td>221,650</td><td>556.91</td></tr></table>' },
    { t: 'code', lang: 'sql', title: 'أفضل المنتجات مبيعاً', code: `
SELECT
  p.name,
  SUM(oi.quantity)                    AS units_sold,
  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS revenue,
  COUNT(DISTINCT oi.order_id)         AS order_count
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN orders o   ON o.id = oi.order_id
WHERE o.status NOT IN ('cancelled', 'refunded')
GROUP BY p.id, p.name
HAVING SUM(oi.quantity) > 10
ORDER BY revenue DESC
LIMIT 10;` },
    { t: 'code', lang: 'sql', title: 'العملاء الأكثر إنفاقاً', code: `
SELECT
  c.name,
  c.city,
  COUNT(o.id)               AS order_count,
  ROUND(SUM(o.total), 2)    AS lifetime_value,
  ROUND(AVG(o.total), 2)    AS avg_order,
  MAX(o.ordered_at)         AS last_order_date
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'delivered'
GROUP BY c.id, c.name, c.city
HAVING SUM(o.total) > 5000
ORDER BY lifetime_value DESC;` },

    { t: 'h2', text: 'أخطاء شائعة' },
    { t: 'ul', items: [
      '**عمود غير مجمَّع في `SELECT`** بلا وجوده في `GROUP BY`.',
      '**دالة تجميع في `WHERE`** — مكانها `HAVING`.',
      '**شرط عادي في `HAVING`** — يجب أن يكون في `WHERE` للأداء.',
      '**نسيان أن `NULL` يُتجاهَل** في المتوسّط والمجموع.',
      '**`COUNT(col)` بدل `COUNT(*)`** حين تريد عدّ كل الصفوف.',
      '**التجميع على عمود بلا فهرس** في جدول ضخم — بطيء جداً.'
    ]},

    { t: 'exercise',
      title: 'تمرين: لوحة تقارير المتجر',
      brief: 'اكتب اثني عشر تقريراً إحصائياً على قاعدة المتجر.',
      requirements: [
        'إحصاءات عامة: عدد المنتجات، مجموع المخزون، متوسّط السعر، الأغلى والأرخص.',
        'عدد العملاء الكلي، وعدد من لديهم جوال، وعدد المدن المميّزة.',
        'عدد المنتجات ومتوسّط السعر لكل تصنيف، مرتّبة تنازلياً.',
        'التصنيفات التي فيها أكثر من خمسة منتجات نشطة فقط.',
        'عدد الطلبات وإجمالي الإيراد لكل حالة.',
        'المبيعات الشهرية: العدد، الإيراد، متوسّط الطلب، عدد العملاء المميّزين.',
        'أفضل عشرة منتجات مبيعاً بالكمية والإيراد.',
        'العملاء الذين أنفقوا أكثر من 5000 مرتّبين تنازلياً.',
        'لكل مدينة: عدد العملاء، عدد الطلبات، الإيراد.',
        'عدد المنتجات النافدة والمتوفّرة في كل تصنيف في صف واحد.',
        'متوسّط عدد العناصر في الطلب الواحد.',
        'التصنيفات التي متوسّط أسعارها أعلى من متوسّط أسعار المتجر كله.'
      ],
      hints: [
        'ضع الشروط العادية في `WHERE` والشروط على الدوال في `HAVING`.',
        '`SUM(CASE WHEN … THEN 1 ELSE 0 END)` للعدّ الشرطي.',
        'التقرير الأخير يحتاج استعلاماً فرعياً في `HAVING`.'
      ],
      solution: { lang: 'sql', code: `
-- 1) إحصاءات عامة للمنتجات
SELECT
  COUNT(*)             AS total_products,
  SUM(stock)           AS total_stock,
  ROUND(AVG(price), 2) AS avg_price,
  MIN(price)           AS cheapest,
  MAX(price)           AS most_expensive
FROM products
WHERE is_active = TRUE;

-- 2) إحصاءات العملاء
SELECT
  COUNT(*)                  AS total_customers,
  COUNT(phone)              AS with_phone,
  COUNT(DISTINCT city)      AS unique_cities
FROM customers
WHERE deleted_at IS NULL;

-- 3) إحصاءات لكل تصنيف
SELECT
  category_id,
  COUNT(*)             AS product_count,
  ROUND(AVG(price), 2) AS avg_price,
  SUM(stock)           AS total_stock
FROM products
WHERE is_active = TRUE
GROUP BY category_id
ORDER BY product_count DESC;

-- 4) التصنيفات الكبيرة فقط
SELECT category_id, COUNT(*) AS product_count
FROM products
WHERE is_active = TRUE
GROUP BY category_id
HAVING COUNT(*) > 5
ORDER BY product_count DESC;

-- 5) الطلبات حسب الحالة
SELECT
  status,
  COUNT(*)             AS order_count,
  ROUND(SUM(total), 2) AS revenue,
  ROUND(AVG(total), 2) AS avg_order
FROM orders
GROUP BY status
ORDER BY revenue DESC;

-- 6) المبيعات الشهرية
SELECT
  EXTRACT(YEAR  FROM ordered_at) AS year,
  EXTRACT(MONTH FROM ordered_at) AS month,
  COUNT(*)                       AS order_count,
  COUNT(DISTINCT customer_id)    AS unique_customers,
  ROUND(SUM(total), 2)           AS revenue,
  ROUND(AVG(total), 2)           AS avg_order_value
FROM orders
WHERE status NOT IN ('cancelled', 'refunded')
GROUP BY EXTRACT(YEAR FROM ordered_at), EXTRACT(MONTH FROM ordered_at)
ORDER BY year, month;

-- 7) أفضل عشرة منتجات
SELECT
  p.name,
  SUM(oi.quantity)                           AS units_sold,
  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN orders   o ON o.id = oi.order_id
WHERE o.status NOT IN ('cancelled', 'refunded')
GROUP BY p.id, p.name
ORDER BY revenue DESC
LIMIT 10;

-- 8) كبار العملاء
SELECT
  c.name,
  COUNT(o.id)            AS order_count,
  ROUND(SUM(o.total), 2) AS lifetime_value
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'delivered'
GROUP BY c.id, c.name
HAVING SUM(o.total) > 5000
ORDER BY lifetime_value DESC;

-- 9) الإحصاءات حسب المدينة
SELECT
  c.city,
  COUNT(DISTINCT c.id)   AS customers,
  COUNT(o.id)            AS orders,
  ROUND(COALESCE(SUM(o.total), 0), 2) AS revenue
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.city
ORDER BY revenue DESC;

-- 10) النافد والمتوفّر لكل تصنيف
SELECT
  category_id,
  COUNT(*)                                        AS total,
  SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END)      AS out_of_stock,
  SUM(CASE WHEN stock > 0 THEN 1 ELSE 0 END)      AS in_stock
FROM products
WHERE is_active = TRUE
GROUP BY category_id;

-- 11) متوسّط عناصر الطلب
SELECT ROUND(AVG(item_count), 2) AS avg_items_per_order
FROM (
  SELECT order_id, COUNT(*) AS item_count
  FROM order_items
  GROUP BY order_id
) AS per_order;

-- 12) تصنيفات فوق المتوسّط العام
SELECT
  category_id,
  ROUND(AVG(price), 2) AS avg_price
FROM products
WHERE is_active = TRUE
GROUP BY category_id
HAVING AVG(price) > (SELECT AVG(price) FROM products WHERE is_active = TRUE)
ORDER BY avg_price DESC;` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق بين `COUNT(*)` و `COUNT(col)`؟', options: ['لا فرق', 'الأولى تعدّ كل الصفوف والثانية تتجاهل `NULL`', 'العكس', 'الثانية أسرع'], answer: 1,
        explain: 'كل دوال التجميع تتجاهل `NULL` عدا `COUNT(*)`.' },
      { q: 'أين تضع شرطاً على دالة تجميع؟', options: ['`WHERE`', '`HAVING`', '`SELECT`', '`ORDER BY`'], answer: 1,
        explain: '`WHERE` تُنفَّذ قبل التجميع فلا تعرف نتيجة الدالة بعد.' },
      { q: 'لماذا يُرفض عمود غير مجمَّع خارج `GROUP BY`؟', options: ['قيد تقني', 'لأنه لا توجد قيمة واحدة صحيحة تمثّل المجموعة', 'للأداء', 'لا يُرفض'], answer: 1,
        explain: 'إن كان للمجموعة عدة قيم، أيّها يعرض المحرّك؟ السؤال بلا إجابة.' },
      { q: 'أيهما أفضل للأداء؟', options: ['`HAVING category_id = 1`', '`WHERE category_id = 1`', 'سواء', 'حسب الجدول'], answer: 1,
        explain: 'الترشيح قبل التجميع يقلّص الصفوف مبكراً فيقلّ العمل كثيراً.' },
      { q: 'ماذا يفعل `GROUP BY city, status`؟', options: ['يجمّع بالمدينة فقط', 'ينشئ مجموعة لكل تركيبة فريدة من المدينة والحالة', 'يخطئ', 'يجمّع بالحالة'], answer: 1,
        explain: 'التجميع بعدة أعمدة يعتمد التركيبة الفريدة منها جميعاً.' }
    ]}
  ]
};
