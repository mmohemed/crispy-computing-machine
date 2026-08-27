'use strict';

module.exports = {
  slug: '08-subqueries',
  title: 'الاستعلامات الفرعية والعروض و CTE',
  summary: 'استعلامات داخل استعلامات، والعروض المحفوظة، وتعبيرات الجداول المشتركة التي تجعل الاستعلامات المعقّدة مقروءة.',
  duration: 50,
  level: 'متقدم',
  tags: ['استعلامات فرعية', 'CTE'],
  objectives: [
    'تكتب استعلامات فرعية في المواضع المختلفة.',
    'تستخدم `EXISTS` و `IN` بوعي بالفروق.',
    'تنشئ عروضاً لتبسيط الاستعلامات المتكرّرة.',
    'تستخدم `WITH` لتقسيم الاستعلامات المعقّدة.',
    'تكتب استعلامات تكرارية للبنى الهرمية.'
  ],
  quickRef: [
    { code: 'WHERE x IN (SELECT …)', desc: 'فرعي في الشرط' },
    { code: 'WHERE EXISTS (SELECT 1 …)', desc: 'فحص الوجود' },
    { code: 'FROM (SELECT …) AS t', desc: 'فرعي كجدول' },
    { code: 'SELECT (SELECT …) AS c', desc: 'فرعي كعمود' },
    { code: 'CREATE VIEW v AS …', desc: 'عرض محفوظ' },
    { code: 'WITH t AS (…) SELECT …', desc: 'تعبير جدول مشترك' },
    { code: 'WITH RECURSIVE', desc: 'استعلام تكراري' }
  ],
  blocks: [
    { t: 'h2', text: 'ما الاستعلام الفرعي؟' },
    { t: 'p', text: 'استعلام `SELECT` داخل استعلام آخر. يُنفَّذ أولاً وتُستخدم نتيجته في الاستعلام الخارجي.' },
    { t: 'code', lang: 'sql', code: `
-- المنتجات الأغلى من المتوسّط
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products)
ORDER BY price DESC;` },
    { t: 'p', text: 'الاستعلام الداخلي يُرجع رقماً واحداً (المتوسّط)، فيُستخدم في المقارنة. هذا ما يُسمّى **استعلاماً فرعياً قياسياً**.' },

    { t: 'h2', text: 'المواضع الأربعة' },
    { t: 'h3', text: '1. في `WHERE`' },
    { t: 'code', lang: 'sql', code: `
-- قيمة واحدة
SELECT * FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- قائمة قيم
SELECT * FROM customers
WHERE id IN (
  SELECT DISTINCT customer_id
  FROM orders
  WHERE total > 5000
);

-- النفي
SELECT * FROM products
WHERE id NOT IN (SELECT product_id FROM order_items);` },
    { t: 'danger', title: 'فخّ NOT IN مع NULL', text: 'إن أرجع الاستعلام الفرعي قيمة `NULL` واحدة، فإن `NOT IN` **لا تُرجع أي صف** إطلاقاً. أضف `WHERE col IS NOT NULL` داخل الاستعلام الفرعي، أو استخدم `NOT EXISTS` بدلاً منه.' },

    { t: 'h3', text: '2. في `FROM` — جدول مشتقّ' },
    { t: 'code', lang: 'sql', code: `
SELECT
  city,
  AVG(order_count) AS avg_orders_per_customer
FROM (
  SELECT c.city, c.id, COUNT(o.id) AS order_count
  FROM customers c
  LEFT JOIN orders o ON o.customer_id = c.id
  GROUP BY c.city, c.id
) AS per_customer
GROUP BY city;` },
    { t: 'note', text: 'الجدول المشتقّ **يجب** أن يحمل اسماً بديلاً (`AS per_customer`) وإلا رفض المحرّك الاستعلام.' },

    { t: 'h3', text: '3. في `SELECT` — عمود محسوب' },
    { t: 'code', lang: 'sql', code: `
SELECT
  c.name,
  c.city,
  (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id)     AS order_count,
  (SELECT MAX(ordered_at) FROM orders o WHERE o.customer_id = c.id) AS last_order
FROM customers c;` },
    { t: 'warn', title: 'الاستعلام المترابط بطيء', text: 'هذا النوع يُنفَّذ **مرة لكل صف** في الاستعلام الخارجي. مع عشرة آلاف عميل يعني عشرين ألف استعلام فرعي. البديل الأسرع دائماً: `LEFT JOIN` مع `GROUP BY`.' },
    { t: 'compare', lang: 'sql', bad: {
      code: 'SELECT\n  c.name,\n  (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS cnt\nFROM customers c;',
      why: 'استعلام فرعي لكل صف — بطيء جداً مع البيانات الكبيرة.'
    }, good: {
      code: 'SELECT c.name, COUNT(o.id) AS cnt\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.id, c.name;',
      why: 'مسح واحد للجدولين مع تجميع — أسرع بمراحل.'
    }},

    { t: 'h3', text: '4. في `HAVING`' },
    { t: 'code', lang: 'sql', code: `
SELECT category_id, AVG(price) AS avg_price
FROM products
GROUP BY category_id
HAVING AVG(price) > (SELECT AVG(price) FROM products);` },

    { t: 'h2', text: '`EXISTS` مقابل `IN`' },
    { t: 'code', lang: 'sql', code: `
-- بـ IN
SELECT * FROM customers c
WHERE c.id IN (SELECT customer_id FROM orders);

-- بـ EXISTS — غالباً أسرع
SELECT * FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);

-- النفي
SELECT * FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);` },
    { t: 'table', head: ['الوجه', '`IN`', '`EXISTS`'], rows: [
      ['يُرجع', 'قائمة قيم', 'صح أو خطأ'],
      ['يتوقّف عند', 'بناء القائمة كاملة', '**أول مطابقة**'],
      ['مع `NULL`', '**فخّ خطر** في `NOT IN`', 'آمن تماماً'],
      ['الأداء', 'جيد مع القوائم الصغيرة', 'أفضل مع الجداول الكبيرة'],
      ['الأنسب لـ', 'قائمة ثابتة معروفة', 'فحص الوجود المترابط']
    ]},
    { t: 'tip', text: 'داخل `EXISTS` اكتب `SELECT 1` لا `SELECT *` — المحرّك لا يهتم بالأعمدة أصلاً، بل بوجود صف واحد على الأقل.' },

    { t: 'h2', text: 'العروض (Views)' },
    { t: 'p', text: 'العرض استعلام **محفوظ باسم** تستخدمه كأنه جدول. لا يخزّن بيانات بل يُنفَّذ عند كل استدعاء.' },
    { t: 'code', lang: 'sql', code: `
CREATE VIEW active_products AS
SELECT id, name, price, stock, category_id
FROM products
WHERE is_active = TRUE AND deleted_at IS NULL;

-- الاستخدام كجدول عادي
SELECT * FROM active_products WHERE price < 500;

-- عرض أعقد
CREATE VIEW order_summary AS
SELECT
  o.id,
  o.ordered_at,
  o.status,
  c.name  AS customer_name,
  c.city,
  COUNT(oi.id)                       AS item_count,
  SUM(oi.quantity)                   AS total_quantity,
  SUM(oi.quantity * oi.unit_price)   AS calculated_total
FROM orders o
JOIN customers   c  ON c.id = o.customer_id
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.ordered_at, o.status, c.name, c.city;

-- تعديل وحذف
CREATE OR REPLACE VIEW active_products AS SELECT … ;
DROP VIEW active_products;` },
    { t: 'features', items: [
      { icon: 'zap', title: 'تبسيط', text: 'استعلام معقّد يُكتب مرة ويُستخدم بسطر.' },
      { icon: 'shield', title: 'أمان', text: 'امنح صلاحية على العرض بدل الجدول لإخفاء أعمدة حسّاسة.' },
      { icon: 'refresh', title: 'اتّساق', text: 'منطق العمل في مكان واحد بدل تكراره في كل تطبيق.' },
      { icon: 'box', title: 'تجريد', text: 'تغيّر بنية الجداول دون كسر الاستعلامات المعتمدة على العرض.' }
    ]},
    { t: 'warn', title: 'العرض ليس ذاكرة تخزين', text: 'يُنفَّذ استعلامه في كل مرة، فلا يحسّن الأداء بذاته. إن احتجت تسريعاً حقيقياً استخدم **العرض المُجسَّد** (Materialized View) الذي يخزّن النتيجة فعلاً ويُحدَّث عند الطلب — متاح في PostgreSQL وOracle.' },

    { t: 'h2', text: 'تعبيرات الجداول المشتركة (CTE)' },
    { t: 'p', text: 'توجيه `WITH` يعرّف نتيجة مؤقتة باسم، تُستخدم في نفس الاستعلام. الفائدة الكبرى: **تحويل استعلام متشابك إلى خطوات مقروءة**.' },
    { t: 'code', lang: 'sql', code: `
WITH customer_totals AS (
  SELECT
    customer_id,
    COUNT(*)   AS order_count,
    SUM(total) AS total_spent
  FROM orders
  WHERE status NOT IN ('cancelled', 'refunded')
  GROUP BY customer_id
)
SELECT
  c.name,
  c.city,
  ct.order_count,
  ct.total_spent
FROM customers c
JOIN customer_totals ct ON ct.customer_id = c.id
WHERE ct.total_spent > 5000
ORDER BY ct.total_spent DESC;` },
    { t: 'code', lang: 'sql', title: 'عدة CTE متسلسلة', code: `
WITH
monthly_sales AS (
  SELECT
    EXTRACT(YEAR  FROM ordered_at) AS year,
    EXTRACT(MONTH FROM ordered_at) AS month,
    SUM(total) AS revenue
  FROM orders
  WHERE status NOT IN ('cancelled', 'refunded')
  GROUP BY 1, 2
),
avg_monthly AS (
  SELECT AVG(revenue) AS avg_revenue FROM monthly_sales
)
SELECT
  ms.year,
  ms.month,
  ROUND(ms.revenue, 2) AS revenue,
  ROUND(am.avg_revenue, 2) AS avg_revenue,
  ROUND(100.0 * (ms.revenue - am.avg_revenue) / am.avg_revenue, 1) AS pct_vs_avg
FROM monthly_sales ms
CROSS JOIN avg_monthly am
ORDER BY ms.year, ms.month;` },
    { t: 'table', head: ['الوجه', 'استعلام فرعي', 'CTE'], rows: [
      ['القراءة', 'متداخل يصعب تتبّعه', '**خطوات متسلسلة واضحة**'],
      ['إعادة الاستخدام', 'يُكتب في كل موضع', 'يُعرَّف مرة ويُستخدم مراراً'],
      ['التكرار الذاتي', 'غير ممكن', 'ممكن بـ `RECURSIVE`'],
      ['التشخيص', 'صعب', 'شغّل كل خطوة وحدها'],
      ['الأداء', 'متقارب غالباً', 'متقارب غالباً']
    ]},
    { t: 'tip', text: 'قاعدة عملية: إن تجاوز استعلامك ثلاثين سطراً أو احتوى استعلامين فرعيين متداخلين، حوّله إلى CTE. زميلك — وأنت بعد شهر — ستشكران نفسيكما.' },

    { t: 'h2', text: 'الاستعلامات التكرارية' },
    { t: 'p', text: '`WITH RECURSIVE` يحلّ مشكلة البنى الهرمية غير محدّدة العمق: شجرة تصنيفات، هيكل تنظيمي، سلسلة تعليقات.' },
    { t: 'code', lang: 'sql', code: `
WITH RECURSIVE category_tree AS (
  -- الحالة الأساسية: الجذور
  SELECT id, name, parent_id, 1 AS level, name AS path
  FROM categories
  WHERE parent_id IS NULL

  UNION ALL

  -- الخطوة التكرارية: الأبناء
  SELECT
    c.id,
    c.name,
    c.parent_id,
    ct.level + 1,
    ct.path || ' > ' || c.name
  FROM categories c
  JOIN category_tree ct ON ct.id = c.parent_id
)
SELECT level, path
FROM category_tree
ORDER BY path;` },
    { t: 'demo', title: 'ناتج الاستعلام التكراري', height: 250,
      css: 'table{width:100%;border-collapse:collapse;font-size:.86em}th{background:#6a5acd;color:#fff;padding:7px 10px;text-align:right}td{padding:6px 10px;border-bottom:1px solid #e2e8f0}code{font-family:monospace;direction:ltr;display:inline-block}',
      html: '<table><tr><th>level</th><th>path</th></tr><tr><td>1</td><td>إلكترونيات</td></tr><tr><td>2</td><td>إلكترونيات &gt; صوتيات</td></tr><tr><td>3</td><td>إلكترونيات &gt; صوتيات &gt; سماعات</td></tr><tr><td>2</td><td>إلكترونيات &gt; حواسيب</td></tr><tr><td>1</td><td>ملابس</td></tr></table>' },
    { t: 'danger', title: 'احذر الحلقة اللانهائية', text: 'إن كانت بياناتك تحوي دورة (تصنيف أبوه ابنه) فسيدور الاستعلام إلى ما لا نهاية. أضف حدّاً للعمق: `WHERE level < 10` داخل الجزء التكراري.' },

    { t: 'h2', text: 'مثال شامل' },
    { t: 'code', lang: 'sql', title: 'تحليل شرائح العملاء', code: `
WITH
customer_stats AS (
  SELECT
    c.id,
    c.name,
    c.city,
    COUNT(o.id)                        AS order_count,
    COALESCE(SUM(o.total), 0)          AS total_spent,
    MAX(o.ordered_at)                  AS last_order
  FROM customers c
  LEFT JOIN orders o
         ON o.customer_id = c.id
        AND o.status NOT IN ('cancelled', 'refunded')
  WHERE c.deleted_at IS NULL
  GROUP BY c.id, c.name, c.city
),
segmented AS (
  SELECT
    *,
    CASE
      WHEN order_count = 0                          THEN 'لم يشترِ'
      WHEN total_spent >= 10000                     THEN 'عميل ذهبي'
      WHEN total_spent >= 3000                      THEN 'عميل فضّي'
      WHEN last_order < CURRENT_DATE - INTERVAL '180 days' THEN 'خامل'
      ELSE 'عميل عادي'
    END AS segment
  FROM customer_stats
)
SELECT
  segment,
  COUNT(*)                       AS customers,
  ROUND(AVG(total_spent), 2)     AS avg_spent,
  ROUND(SUM(total_spent), 2)     AS segment_revenue
FROM segmented
GROUP BY segment
ORDER BY segment_revenue DESC;` },

    { t: 'exercise',
      title: 'تمرين: تحليلات متقدّمة',
      brief: 'اكتب عشرة استعلامات متقدّمة باستخدام الاستعلامات الفرعية والعروض و CTE.',
      requirements: [
        'المنتجات الأغلى من متوسّط سعر تصنيفها (استعلام فرعي مترابط).',
        'العملاء الذين طلبوا منتجاً من التصنيف 1 (بـ `EXISTS`).',
        'العملاء الذين لم يطلبوا قط (بـ `NOT EXISTS`).',
        'أعلى ثلاثة منتجات مبيعاً في كل تصنيف.',
        'عرض `active_products` يخفي المنتجات المعطّلة والمحذوفة.',
        'عرض `order_summary` يجمع بيانات الطلب مع العميل وعدد العناصر.',
        'CTE يحسب إجمالي إنفاق كل عميل ثم يصنّفه إلى شرائح.',
        'CTE متعدّد: المبيعات الشهرية ثم مقارنتها بالمتوسّط العام.',
        'استعلام تكراري يبني شجرة التصنيفات بمساراتها الكاملة.',
        'مقارنة أداء: نفس التقرير مرة باستعلام فرعي مترابط ومرة بـ `JOIN`.'
      ],
      hints: [
        '«الأغلى من متوسّط تصنيفه» يحتاج استعلاماً فرعياً يشير للعمود الخارجي.',
        'الجدول المشتقّ في `FROM` يحتاج اسماً بديلاً إلزامياً.',
        'أضف حدّ عمق في الاستعلام التكراري للأمان.'
      ],
      solution: { lang: 'sql', code: `
-- 1) أغلى من متوسّط تصنيفه
SELECT p.name, p.price, p.category_id
FROM products p
WHERE p.price > (
  SELECT AVG(p2.price)
  FROM products p2
  WHERE p2.category_id = p.category_id
)
ORDER BY p.category_id, p.price DESC;

-- 2) من طلب من التصنيف 1
SELECT c.id, c.name
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN products p     ON p.id = oi.product_id
  WHERE o.customer_id = c.id
    AND p.category_id = 1
);

-- 3) من لم يطلب قط
SELECT c.id, c.name, c.email
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);

-- 4) أعلى ثلاثة في كل تصنيف
WITH ranked AS (
  SELECT
    p.category_id,
    p.name,
    SUM(oi.quantity) AS units,
    ROW_NUMBER() OVER (
      PARTITION BY p.category_id
      ORDER BY SUM(oi.quantity) DESC
    ) AS rn
  FROM order_items oi
  JOIN products p ON p.id = oi.product_id
  JOIN orders   o ON o.id = oi.order_id
  WHERE o.status NOT IN ('cancelled', 'refunded')
  GROUP BY p.category_id, p.id, p.name
)
SELECT category_id, name, units
FROM ranked
WHERE rn <= 3
ORDER BY category_id, units DESC;

-- 5) عرض المنتجات النشطة
CREATE OR REPLACE VIEW active_products AS
SELECT id, name, sku, price, stock, category_id
FROM products
WHERE is_active = TRUE;

-- 6) عرض ملخّص الطلبات
CREATE OR REPLACE VIEW order_summary AS
SELECT
  o.id,
  o.ordered_at,
  o.status,
  c.name AS customer_name,
  c.city,
  COUNT(oi.id)                     AS item_count,
  COALESCE(SUM(oi.quantity), 0)    AS total_quantity,
  o.total
FROM orders o
JOIN customers c        ON c.id = o.customer_id
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.ordered_at, o.status, c.name, c.city, o.total;

-- 7) شرائح العملاء
WITH customer_stats AS (
  SELECT
    c.id, c.name, c.city,
    COUNT(o.id)               AS order_count,
    COALESCE(SUM(o.total), 0) AS total_spent
  FROM customers c
  LEFT JOIN orders o
         ON o.customer_id = c.id
        AND o.status NOT IN ('cancelled', 'refunded')
  GROUP BY c.id, c.name, c.city
)
SELECT
  name, city, order_count, total_spent,
  CASE
    WHEN order_count = 0      THEN 'لم يشترِ'
    WHEN total_spent >= 10000 THEN 'ذهبي'
    WHEN total_spent >= 3000  THEN 'فضّي'
    ELSE 'عادي'
  END AS segment
FROM customer_stats
ORDER BY total_spent DESC;

-- 8) المبيعات الشهرية مقابل المتوسّط
WITH
monthly AS (
  SELECT
    EXTRACT(YEAR  FROM ordered_at) AS y,
    EXTRACT(MONTH FROM ordered_at) AS m,
    SUM(total) AS revenue
  FROM orders
  WHERE status NOT IN ('cancelled', 'refunded')
  GROUP BY 1, 2
),
overall AS (
  SELECT AVG(revenue) AS avg_rev FROM monthly
)
SELECT
  mo.y, mo.m,
  ROUND(mo.revenue, 2) AS revenue,
  ROUND(ov.avg_rev, 2) AS average,
  ROUND(100.0 * (mo.revenue - ov.avg_rev) / NULLIF(ov.avg_rev, 0), 1) AS pct_diff
FROM monthly mo
CROSS JOIN overall ov
ORDER BY mo.y, mo.m;

-- 9) شجرة التصنيفات
WITH RECURSIVE tree AS (
  SELECT id, name, parent_id, 1 AS level, CAST(name AS TEXT) AS path
  FROM categories
  WHERE parent_id IS NULL

  UNION ALL

  SELECT c.id, c.name, c.parent_id, t.level + 1, t.path || ' > ' || c.name
  FROM categories c
  JOIN tree t ON t.id = c.parent_id
  WHERE t.level < 10          -- حدّ أمان
)
SELECT level, path
FROM tree
ORDER BY path;

-- 10) مقارنة الأداء
-- (أ) استعلام فرعي مترابط — أبطأ
SELECT
  c.name,
  (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS order_count
FROM customers c;

-- (ب) بالربط والتجميع — أسرع
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;

-- استخدم EXPLAIN لمقارنة الخطتين
-- EXPLAIN ANALYZE SELECT …;` } },

    { t: 'quiz', items: [
      { q: 'ما فخّ `NOT IN` مع الاستعلامات الفرعية؟', options: ['بطيء', 'إن أرجع الفرعي `NULL` واحدة لا تُرجع الجملة أي صف', 'لا يعمل', 'يحتاج فهرساً'], answer: 1,
        explain: 'استخدم `NOT EXISTS` أو استبعد `NULL` داخل الاستعلام الفرعي.' },
      { q: 'لماذا `EXISTS` غالباً أسرع من `IN`؟', options: ['أقصر', 'يتوقّف عند أول مطابقة بدل بناء القائمة كاملة', 'يستخدم فهرساً', 'لا فرق'], answer: 1,
        explain: 'ويتجنّب أيضاً مشكلة `NULL` تماماً.' },
      { q: 'هل يخزّن العرض (View) البيانات؟', options: ['نعم', 'لا — يُنفَّذ استعلامه عند كل استدعاء', 'أحياناً', 'يعتمد'], answer: 1,
        explain: 'للتخزين الفعلي استخدم العرض المُجسَّد (Materialized View).' },
      { q: 'ما الفائدة الأهم لـ CTE؟', options: ['السرعة', 'تحويل استعلام متشابك إلى خطوات مقروءة قابلة للتشخيص', 'الأمان', 'الحجم'], answer: 1,
        explain: 'الأداء متقارب غالباً؛ المكسب الحقيقي في الوضوح وقابلية الصيانة.' },
      { q: 'متى تحتاج `WITH RECURSIVE`؟', options: ['مع الجداول الكبيرة', 'مع البنى الهرمية غير محدّدة العمق كشجرة التصنيفات', 'مع التجميع', 'مع الفهارس'], answer: 1,
        explain: 'يبني النتيجة طبقة بعد طبقة حتى تنتهي الأبناء.' }
    ]}
  ]
};
