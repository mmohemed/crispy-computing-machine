'use strict';

module.exports = {
  slug: '05-functions',
  title: 'الدوال ومعالجة القيم',
  summary: 'دوال النصوص والأرقام والتواريخ، والتعبيرات الشرطية CASE، وتحويل الأنواع.',
  duration: 45,
  level: 'متوسط',
  tags: ['الدوال', 'المعالجة'],
  objectives: [
    'تعالج النصوص: القصّ والدمج والاستبدال.',
    'تجري عمليات رياضية وتقرّب الأرقام.',
    'تستخرج أجزاء التواريخ وتحسب الفروق.',
    'تكتب منطقاً شرطياً بـ `CASE`.',
    'تحوّل بين أنواع البيانات.'
  ],
  quickRef: [
    { code: 'CONCAT(a, b) أو a || b', desc: 'دمج نصوص' },
    { code: 'UPPER / LOWER / TRIM', desc: 'معالجة نصّية' },
    { code: 'SUBSTRING(s, from, len)', desc: 'اقتطاع' },
    { code: 'ROUND(n, d)', desc: 'تقريب' },
    { code: 'CURRENT_DATE / NOW()', desc: 'التاريخ الحالي' },
    { code: 'CASE WHEN … THEN … END', desc: 'منطق شرطي' },
    { code: 'CAST(x AS type)', desc: 'تحويل نوع' },
    { code: 'COALESCE(a, b)', desc: 'أول قيمة غير فارغة' }
  ],
  blocks: [
    { t: 'h2', text: 'دوال النصوص' },
    { t: 'code', lang: 'sql', code: `
-- الدمج
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;
SELECT first_name || ' ' || last_name AS full_name FROM users;  -- معيار SQL

-- حالة الأحرف
SELECT UPPER(code), LOWER(email) FROM users;

-- الطول
SELECT name, LENGTH(name) AS name_length FROM products;

-- إزالة المسافات
SELECT TRIM('  نص  ');        -- 'نص'
SELECT LTRIM(s), RTRIM(s);     -- من البداية أو النهاية

-- الاقتطاع
SELECT SUBSTRING(description, 1, 100) FROM products;
SELECT LEFT(name, 10), RIGHT(sku, 3) FROM products;

-- الاستبدال
SELECT REPLACE(phone, '-', '') FROM customers;

-- البحث عن موضع
SELECT POSITION('@' IN email) FROM users;

-- الحشو
SELECT LPAD(CAST(id AS TEXT), 6, '0') AS order_code FROM orders;
-- 42 → '000042'` },
    { t: 'demo', title: 'أمثلة تطبيقية', height: 260,
      css: 'table{width:100%;border-collapse:collapse;font-size:.86em}th{background:#6a5acd;color:#fff;padding:8px 10px;text-align:right}td{padding:7px 10px;border-bottom:1px solid #e2e8f0}code{font-family:monospace;direction:ltr;display:inline-block;font-size:.9em}',
      html: '<table><tr><th>التعبير</th><th>النتيجة</th></tr><tr><td><code>UPPER(\'sku-001\')</code></td><td>SKU-001</td></tr><tr><td><code>LENGTH(\'سماعة\')</code></td><td>5</td></tr><tr><td><code>SUBSTRING(\'CodeWay\',1,4)</code></td><td>Code</td></tr><tr><td><code>REPLACE(\'050-123\',\'-\',\'\')</code></td><td>050123</td></tr><tr><td><code>LPAD(\'42\',6,\'0\')</code></td><td>000042</td></tr><tr><td><code>TRIM(\'  نص  \')</code></td><td>نص</td></tr></table>' },
    { t: 'code', lang: 'sql', title: 'مثال عملي: توليد رمز طلب', code: `
SELECT
  id,
  'ORD-' || TO_CHAR(ordered_at, 'YYYYMM') || '-' || LPAD(id::TEXT, 5, '0')
    AS order_code
FROM orders;
-- ORD-202603-00042` },

    { t: 'h2', text: 'الدوال الرياضية' },
    { t: 'code', lang: 'sql', code: `
SELECT ROUND(299.567, 2);    -- 299.57
SELECT ROUND(299.567);       -- 300
SELECT CEIL(299.1);          -- 300 — التقريب لأعلى
SELECT FLOOR(299.9);         -- 299 — التقريب لأسفل
SELECT ABS(-50);             -- 50
SELECT POWER(2, 10);         -- 1024
SELECT SQRT(144);            -- 12
SELECT MOD(17, 5);           -- 2 — باقي القسمة
SELECT GREATEST(5, 12, 3);   -- 12
SELECT LEAST(5, 12, 3);      -- 3` },
    { t: 'code', lang: 'sql', title: 'حساب الخصم والضريبة', code: `
SELECT
  name,
  price                                    AS original,
  ROUND(price * (1 - discount / 100.0), 2) AS after_discount,
  ROUND(price * (1 - discount / 100.0) * 1.15, 2) AS with_vat
FROM products
WHERE discount > 0;` },
    { t: 'warn', title: 'فخّ القسمة الصحيحة', text: 'في معظم الأنظمة `10 / 3` بين عددين صحيحين تعطي `3` لا `3.33`. أضف `.0` لأحد الطرفين: `10 / 3.0` أو حوّل النوع: `CAST(10 AS DECIMAL) / 3`.' },

    { t: 'h2', text: 'دوال التواريخ' },
    { t: 'code', lang: 'sql', code: `
-- الوقت الحالي
SELECT CURRENT_DATE;        -- 2026-03-15
SELECT CURRENT_TIME;        -- 14:30:00
SELECT CURRENT_TIMESTAMP;   -- 2026-03-15 14:30:00
SELECT NOW();               -- MySQL و PostgreSQL

-- استخراج الأجزاء
SELECT EXTRACT(YEAR  FROM ordered_at) AS year,
       EXTRACT(MONTH FROM ordered_at) AS month,
       EXTRACT(DAY   FROM ordered_at) AS day,
       EXTRACT(DOW   FROM ordered_at) AS day_of_week
FROM orders;

-- MySQL
SELECT YEAR(ordered_at), MONTH(ordered_at), DAYNAME(ordered_at) FROM orders;

-- الحساب
SELECT ordered_at + INTERVAL '7 days'  AS due_date FROM orders;      -- PostgreSQL
SELECT DATE_ADD(ordered_at, INTERVAL 7 DAY) AS due_date FROM orders; -- MySQL

-- الفرق بين تاريخين
SELECT CURRENT_DATE - ordered_at::DATE AS days_ago FROM orders;      -- PostgreSQL
SELECT DATEDIFF(CURRENT_DATE, ordered_at) AS days_ago FROM orders;   -- MySQL

-- التنسيق
SELECT TO_CHAR(ordered_at, 'YYYY-MM-DD')     FROM orders;  -- PostgreSQL
SELECT DATE_FORMAT(ordered_at, '%Y-%m-%d')   FROM orders;  -- MySQL

-- التقريب لبداية الفترة
SELECT DATE_TRUNC('month', ordered_at) FROM orders;   -- PostgreSQL` },
    { t: 'code', lang: 'sql', title: 'حساب العمر ومدّة الاشتراك', code: `
SELECT
  name,
  birth_date,
  EXTRACT(YEAR FROM AGE(birth_date)) AS age,
  CURRENT_DATE - joined_at::DATE     AS days_as_member
FROM members;` },

    { t: 'h2', text: 'التعبيرات الشرطية' },
    { t: 'h3', text: '`CASE` — الشكل المبحوث' },
    { t: 'code', lang: 'sql', code: `
SELECT
  name,
  stock,
  CASE
    WHEN stock = 0        THEN 'نفدت الكمية'
    WHEN stock < 5        THEN 'كمية محدودة'
    WHEN stock < 20       THEN 'متوفّر'
    ELSE                       'متوفّر بكثرة'
  END AS stock_status
FROM products;` },
    { t: 'demo', title: 'ناتج CASE', height: 250,
      css: 'table{width:100%;border-collapse:collapse;font-size:.88em}th{background:#6a5acd;color:#fff;padding:8px 12px;text-align:right}td{padding:7px 12px;border-bottom:1px solid #e2e8f0}.b{font-weight:700}.r{color:#dc2626}.o{color:#d97706}.g{color:#059669}',
      html: '<table><tr><th>name</th><th>stock</th><th>stock_status</th></tr><tr><td>سماعة لاسلكية</td><td>0</td><td class="b r">نفدت الكمية</td></tr><tr><td>لوحة مفاتيح</td><td>3</td><td class="b o">كمية محدودة</td></tr><tr><td>ماوس لاسلكي</td><td>14</td><td class="b g">متوفّر</td></tr><tr><td>كابل USB</td><td>85</td><td class="b g">متوفّر بكثرة</td></tr></table>' },
    { t: 'h3', text: '`CASE` — الشكل البسيط' },
    { t: 'code', lang: 'sql', code: `
SELECT
  id,
  CASE status
    WHEN 'pending'   THEN 'قيد المراجعة'
    WHEN 'paid'      THEN 'مدفوع'
    WHEN 'shipped'   THEN 'تم الشحن'
    WHEN 'delivered' THEN 'تم التسليم'
    ELSE 'غير معروف'
  END AS status_ar
FROM orders;` },
    { t: 'code', lang: 'sql', title: 'استخدامات متقدّمة', code: `
-- في الترتيب: حالة مخصّصة
SELECT * FROM orders
ORDER BY
  CASE status
    WHEN 'pending' THEN 1
    WHEN 'paid'    THEN 2
    WHEN 'shipped' THEN 3
    ELSE 4
  END;

-- في التجميع: عدّ شرطي
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'paid'      THEN 1 ELSE 0 END) AS paid_count,
  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_count
FROM orders;

-- في التحديث
UPDATE products
SET price = CASE
  WHEN category_id = 1 THEN price * 1.10
  WHEN category_id = 2 THEN price * 1.15
  ELSE price
END;` },

    { t: 'h2', text: 'التعامل مع NULL' },
    { t: 'code', lang: 'sql', code: `
-- أول قيمة غير فارغة
SELECT COALESCE(phone, mobile, email, 'لا توجد وسيلة تواصل') FROM customers;

-- بديل بسيط
SELECT IFNULL(discount, 0) FROM orders;      -- MySQL
SELECT NVL(discount, 0) FROM orders;         -- Oracle

-- NULL إن تساوت القيمتان — مفيد لتفادي القسمة على صفر
SELECT total / NULLIF(quantity, 0) AS unit_price FROM order_items;` },
    { t: 'tip', text: '`NULLIF(x, 0)` حيلة أنيقة: تحوّل الصفر إلى `NULL` فتتجنّب خطأ القسمة على صفر، والنتيجة تصبح `NULL` بدل انهيار الاستعلام.' },

    { t: 'h2', text: 'تحويل الأنواع' },
    { t: 'code', lang: 'sql', code: `
SELECT CAST('123' AS INTEGER);
SELECT CAST(price AS TEXT);
SELECT CAST('2026-03-15' AS DATE);

-- اختصار PostgreSQL
SELECT price::TEXT, '123'::INT, ordered_at::DATE;

-- التحويل الضمني قد يفاجئك
SELECT '10' + 5;    -- 15 في MySQL، خطأ في PostgreSQL` },
    { t: 'warn', text: 'لا تعتمد على التحويل الضمني — يختلف بين الأنظمة وقد يعطي نتائج صامتة خاطئة. حوّل صراحةً بـ `CAST` دائماً.' },

    { t: 'h2', text: 'استعلام تقرير متكامل' },
    { t: 'code', lang: 'sql', code: `
SELECT
  'ORD-' || LPAD(o.id::TEXT, 6, '0')          AS order_code,
  UPPER(TRIM(c.name))                          AS customer,
  COALESCE(c.phone, c.email, '—')              AS contact,

  TO_CHAR(o.ordered_at, 'YYYY-MM-DD')          AS order_date,
  CURRENT_DATE - o.ordered_at::DATE            AS days_ago,

  ROUND(o.total, 2)                            AS total,
  ROUND(o.total * 0.15, 2)                     AS vat,
  ROUND(o.total * 1.15, 2)                     AS grand_total,

  CASE o.status
    WHEN 'pending'   THEN 'قيد المراجعة'
    WHEN 'paid'      THEN 'مدفوع'
    WHEN 'shipped'   THEN 'تم الشحن'
    WHEN 'delivered' THEN 'تم التسليم'
    ELSE 'ملغى'
  END                                          AS status_ar,

  CASE
    WHEN o.total >= 5000 THEN 'ذهبي'
    WHEN o.total >= 1000 THEN 'فضّي'
    ELSE 'عادي'
  END                                          AS tier

FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.ordered_at >= CURRENT_DATE - INTERVAL '90 days'
ORDER BY o.ordered_at DESC;` },

    { t: 'exercise',
      title: 'تمرين: تقرير مبيعات منسّق',
      brief: 'اكتب استعلامات تستخدم الدوال لإنتاج تقارير جاهزة للعرض.',
      requirements: [
        'اسم المنتج بحروف كبيرة مع طوله وعدد أحرفه.',
        'رمز منتج مركّب: `PRD-` + التصنيف + `-` + المعرّف محشوّاً إلى 5 خانات.',
        'السعر الأصلي والسعر بعد خصم 10٪ والسعر شاملاً ضريبة 15٪ — كلها مقرّبة لخانتين.',
        'تصنيف المخزون بـ `CASE` إلى أربع حالات عربية.',
        'وسيلة تواصل العميل: الجوال أو البريد أو نص بديل، بـ `COALESCE`.',
        'عمر الطلب بالأيام، وتاريخه بصيغة `YYYY-MM-DD`.',
        'تصنيف العميل إلى ذهبي/فضّي/عادي بحسب إجمالي طلبه.',
        'عدّ الطلبات المدفوعة والملغاة في صف واحد بـ `SUM(CASE …)`.',
        'متوسّط سعر الوحدة مع تفادي القسمة على صفر بـ `NULLIF`.',
        'ترتيب مخصّص للحالات بـ `CASE` داخل `ORDER BY`.'
      ],
      hints: [
        '`LPAD(CAST(id AS TEXT), 5, "0")` للحشو.',
        '`SUM(CASE WHEN cond THEN 1 ELSE 0 END)` للعدّ الشرطي.',
        'انتبه للقسمة الصحيحة: أضف `.0` أو حوّل النوع.'
      ],
      solution: { lang: 'sql', code: `
-- ===== 1) معلومات المنتج المنسّقة =====
SELECT
  UPPER(name)                                       AS product_upper,
  LENGTH(name)                                      AS name_length,
  'PRD-' || category_id || '-' ||
    LPAD(CAST(id AS TEXT), 5, '0')                  AS product_code,

  ROUND(price, 2)                                   AS original_price,
  ROUND(price * 0.90, 2)                            AS discounted_price,
  ROUND(price * 0.90 * 1.15, 2)                     AS final_with_vat,

  stock,
  CASE
    WHEN stock = 0  THEN 'نفدت الكمية'
    WHEN stock < 5  THEN 'كمية محدودة'
    WHEN stock < 20 THEN 'متوفّر'
    ELSE                 'متوفّر بكثرة'
  END                                               AS stock_status

FROM products
WHERE is_active = TRUE
ORDER BY price DESC;

-- ===== 2) تقرير الطلبات =====
SELECT
  'ORD-' || LPAD(CAST(o.id AS TEXT), 6, '0')        AS order_code,
  TRIM(c.name)                                      AS customer,
  COALESCE(c.phone, c.email, 'لا توجد وسيلة تواصل') AS contact,

  TO_CHAR(o.ordered_at, 'YYYY-MM-DD')               AS order_date,
  CURRENT_DATE - CAST(o.ordered_at AS DATE)         AS days_ago,

  ROUND(o.total, 2)                                 AS total,
  ROUND(o.total * 1.15, 2)                          AS grand_total,

  CASE o.status
    WHEN 'pending'   THEN 'قيد المراجعة'
    WHEN 'paid'      THEN 'مدفوع'
    WHEN 'shipped'   THEN 'تم الشحن'
    WHEN 'delivered' THEN 'تم التسليم'
    ELSE                  'ملغى'
  END                                               AS status_ar,

  CASE
    WHEN o.total >= 5000 THEN 'ذهبي'
    WHEN o.total >= 1000 THEN 'فضّي'
    ELSE                      'عادي'
  END                                               AS tier

FROM orders o
JOIN customers c ON c.id = o.customer_id
ORDER BY
  CASE o.status
    WHEN 'pending'   THEN 1
    WHEN 'paid'      THEN 2
    WHEN 'shipped'   THEN 3
    WHEN 'delivered' THEN 4
    ELSE 5
  END,
  o.ordered_at DESC;

-- ===== 3) ملخّص الحالات =====
SELECT
  COUNT(*)                                                    AS total_orders,
  SUM(CASE WHEN status = 'paid'      THEN 1 ELSE 0 END)       AS paid_count,
  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)       AS cancelled_count,
  SUM(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END)       AS pending_count,
  ROUND(
    100.0 * SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END)
    / NULLIF(COUNT(*), 0), 1
  )                                                           AS paid_percentage
FROM orders;

-- ===== 4) متوسّط سعر الوحدة بأمان =====
SELECT
  order_id,
  SUM(quantity * unit_price)                                  AS line_total,
  SUM(quantity)                                               AS total_qty,
  ROUND(
    SUM(quantity * unit_price) / NULLIF(SUM(quantity), 0), 2
  )                                                           AS avg_unit_price
FROM order_items
GROUP BY order_id;` } },

    { t: 'quiz', items: [
      { q: 'ماذا تعطي `10 / 3` بين عددين صحيحين في معظم الأنظمة؟', options: ['3.33', '3', 'خطأ', '4'], answer: 1,
        explain: 'القسمة الصحيحة تقتطع الكسر؛ أضف `.0` أو حوّل النوع.' },
      { q: 'ما وظيفة `COALESCE(a, b, c)`؟', options: ['جمع القيم', 'إرجاع أول قيمة غير فارغة', 'مقارنة', 'دمج نصوص'], answer: 1,
        explain: 'مفيدة لتوفير قيمة بديلة حين يكون العمود فارغاً.' },
      { q: 'كيف تتجنّب القسمة على صفر؟', options: ['بشرط `WHERE`', 'بـ `NULLIF(divisor, 0)`', 'بـ `CASE` فقط', 'لا يمكن'], answer: 1,
        explain: '`NULLIF` تحوّل الصفر إلى `NULL` فتصبح النتيجة `NULL` بدل الخطأ.' },
      { q: 'أين يمكن استخدام `CASE`؟', options: ['في `SELECT` فقط', 'في `SELECT` و `WHERE` و `ORDER BY` و `UPDATE`', 'في `WHERE` فقط', 'في الدوال فقط'], answer: 1,
        explain: '`CASE` تعبير يُرجع قيمة، فيصلح في أي موضع يقبل تعبيراً.' },
      { q: 'لماذا نتجنّب التحويل الضمني للأنواع؟', options: ['بطيء', 'يختلف بين الأنظمة وقد يعطي نتائج صامتة خاطئة', 'غير مدعوم', 'يحتاج فهرساً'], answer: 1,
        explain: '`"10" + 5` تعطي 15 في MySQL وخطأً في PostgreSQL.' }
    ]}
  ]
};
