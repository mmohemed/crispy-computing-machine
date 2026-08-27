'use strict';

module.exports = {
  slug: '07-joins',
  title: 'الربط بين الجداول: JOIN',
  summary: 'دمج البيانات من عدة جداول: INNER و LEFT و RIGHT و FULL، والربط الذاتي، والأخطاء التي تضاعف نتائجك.',
  duration: 55,
  level: 'متوسط',
  tags: ['JOIN', 'العلاقات'],
  objectives: [
    'تربط جدولين أو أكثر باستعلام واحد.',
    'تفرّق بين أنواع الربط الأربعة.',
    'تستخدم الربط الذاتي.',
    'تتجنّب مضاعفة الصفوف عند الربط المتعدّد.',
    'تكتب استعلامات تقارير مركّبة.'
  ],
  quickRef: [
    { code: 'INNER JOIN … ON …', desc: 'المتطابق في الجدولين' },
    { code: 'LEFT JOIN', desc: 'كل صفوف اليسار + المطابق' },
    { code: 'RIGHT JOIN', desc: 'كل صفوف اليمين + المطابق' },
    { code: 'FULL OUTER JOIN', desc: 'كل الصفوف من الطرفين' },
    { code: 'CROSS JOIN', desc: 'كل التوافيق الممكنة' },
    { code: 'USING (col)', desc: 'اختصار عند تطابق الاسم' },
    { code: 'AS alias', desc: 'اسم مختصر للجدول' }
  ],
  blocks: [
    { t: 'h2', text: 'لماذا نربط؟' },
    { t: 'p', text: 'البيانات موزّعة على جداول لتجنّب التكرار: الطلب يحمل `customer_id` لا اسم العميل كاملاً. لكن التقرير يحتاج **الاسم**. الربط هو الجسر.' },
    { t: 'code', lang: 'sql', code: `
-- بلا ربط: أرقام بلا معنى
SELECT id, customer_id, total FROM orders;

-- مع ربط: تقرير مفهوم
SELECT
  o.id,
  c.name AS customer,
  c.city,
  o.total
FROM orders o
JOIN customers c ON c.id = o.customer_id;` },
    { t: 'note', title: 'الأسماء المختصرة', text: '`FROM orders o` تعطي الجدول اسماً مختصراً. مع ثلاثة جداول أو أكثر تصبح ضرورية لتقصير الاستعلام وتوضيح مصدر كل عمود.' },

    { t: 'h2', text: '`INNER JOIN` — التقاطع' },
    { t: 'p', text: 'يُرجع الصفوف التي لها **مطابق في الجدولين معاً**. أي صف بلا مطابق يُستبعد. وهو الافتراضي: `JOIN` وحدها تعني `INNER JOIN`.' },
    { t: 'code', lang: 'sql', code: `
SELECT
  o.id       AS order_id,
  c.name     AS customer,
  o.total
FROM orders o
INNER JOIN customers c ON c.id = o.customer_id
ORDER BY o.total DESC;` },
    { t: 'demo', title: 'ما يحدث في INNER JOIN', height: 380,
      css: 'table{width:100%;border-collapse:collapse;font-size:.82em;margin-bottom:10px}th{background:#6a5acd;color:#fff;padding:6px 9px;text-align:right}td{padding:5px 9px;border-bottom:1px solid #e2e8f0}b{display:block;font-size:.78em;color:#64748b;margin-bottom:4px}.x{background:#fee2e2;color:#991b1b}.ok{background:#dcfce7}',
      html: '<b>customers</b><table><tr><th>id</th><th>name</th></tr><tr class="ok"><td>1</td><td>سارة</td></tr><tr class="ok"><td>2</td><td>خالد</td></tr><tr class="x"><td>3</td><td>نورة (بلا طلبات)</td></tr></table><b>orders</b><table><tr><th>id</th><th>customer_id</th><th>total</th></tr><tr class="ok"><td>101</td><td>1</td><td>450</td></tr><tr class="ok"><td>102</td><td>1</td><td>230</td></tr><tr class="ok"><td>103</td><td>2</td><td>899</td></tr></table><b>النتيجة — نورة استُبعدت</b><table><tr><th>order_id</th><th>customer</th><th>total</th></tr><tr><td>101</td><td>سارة</td><td>450</td></tr><tr><td>102</td><td>سارة</td><td>230</td></tr><tr><td>103</td><td>خالد</td><td>899</td></tr></table>' },

    { t: 'h2', text: '`LEFT JOIN` — كل صفوف اليسار' },
    { t: 'p', text: 'يُرجع **كل** صفوف الجدول الأيسر، ومعها المطابق من الأيمن إن وُجد، وإلا فقيم `NULL`.' },
    { t: 'code', lang: 'sql', code: `
SELECT
  c.name,
  COUNT(o.id)                        AS order_count,
  COALESCE(SUM(o.total), 0)          AS total_spent
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY total_spent DESC;` },
    { t: 'demo', title: 'نورة تظهر بأصفار', height: 220,
      css: 'table{width:100%;border-collapse:collapse;font-size:.86em}th{background:#6a5acd;color:#fff;padding:7px 10px;text-align:right}td{padding:6px 10px;border-bottom:1px solid #e2e8f0}.z{background:#fef3c7}',
      html: '<table><tr><th>name</th><th>order_count</th><th>total_spent</th></tr><tr><td>خالد</td><td>1</td><td>899</td></tr><tr><td>سارة</td><td>2</td><td>680</td></tr><tr class="z"><td>نورة</td><td>0</td><td>0</td></tr></table>' },
    { t: 'tip', text: 'استخدم `LEFT JOIN` كلّما أردت الاحتفاظ بكل صفوف الجدول الرئيسي حتى لو لم يكن لها بيانات مرتبطة — تقارير «كل العملاء حتى من لم يشترِ» و«كل المنتجات حتى ما لم يُبَع».' },

    { t: 'h3', text: 'إيجاد الصفوف بلا مطابق' },
    { t: 'code', lang: 'sql', code: `
-- العملاء الذين لم يطلبوا قط
SELECT c.id, c.name, c.email
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- المنتجات التي لم تُبَع أبداً
SELECT p.id, p.name, p.stock
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
WHERE oi.id IS NULL;` },
    { t: 'note', title: 'نمط مهم جداً', text: '`LEFT JOIN` مع `WHERE right.id IS NULL` هو النمط القياسي لإيجاد «ما ليس له مطابق». احفظه — ستستخدمه كثيراً.' },

    { t: 'h2', text: 'بقية الأنواع' },
    { t: 'table', head: ['النوع', 'يُرجع'], rows: [
      ['`INNER JOIN`', 'المتطابق في الجدولين فقط'],
      ['`LEFT JOIN`', 'كل اليسار + المطابق من اليمين'],
      ['`RIGHT JOIN`', 'كل اليمين + المطابق من اليسار'],
      ['`FULL OUTER JOIN`', 'كل الصفوف من الطرفين'],
      ['`CROSS JOIN`', 'كل التوافيق الممكنة (حاصل ضرب ديكارتي)']
    ]},
    { t: 'code', lang: 'sql', code: `
-- RIGHT JOIN — نادر الاستخدام
SELECT c.name, o.total
FROM orders o
RIGHT JOIN customers c ON c.id = o.customer_id;
-- يكافئ: FROM customers c LEFT JOIN orders o …

-- FULL OUTER JOIN — غير مدعوم في MySQL
SELECT c.name, o.total
FROM customers c
FULL OUTER JOIN orders o ON o.customer_id = c.id;

-- CROSS JOIN — كل التوافيق
SELECT s.size, cl.color
FROM sizes s
CROSS JOIN colors cl;
-- 4 مقاسات × 5 ألوان = 20 صفاً` },
    { t: 'tip', text: 'استخدم `LEFT JOIN` دائماً بدل `RIGHT JOIN`: القراءة من اليسار لليمين أكثر طبيعية، وكل `RIGHT JOIN` يمكن إعادة كتابته كـ `LEFT JOIN` بتبديل ترتيب الجدولين.' },
    { t: 'danger', title: 'خطر CROSS JOIN غير المقصود', text: 'نسيان شرط `ON` يحوّل الربط إلى `CROSS JOIN`: جدولان بألف صف لكل منهما يعطيان **مليون صف**. راجع دائماً وجود `ON` في كل ربط.' },

    { t: 'h2', text: 'ربط عدة جداول' },
    { t: 'code', lang: 'sql', code: `
SELECT
  o.id                          AS order_id,
  c.name                        AS customer,
  c.city,
  p.name                        AS product,
  cat.name                      AS category,
  oi.quantity,
  oi.unit_price,
  oi.quantity * oi.unit_price   AS line_total
FROM orders o
JOIN customers   c   ON c.id   = o.customer_id
JOIN order_items oi  ON oi.order_id = o.id
JOIN products    p   ON p.id   = oi.product_id
LEFT JOIN categories cat ON cat.id = p.category_id
WHERE o.status = 'delivered'
  AND o.ordered_at >= '2026-01-01'
ORDER BY o.ordered_at DESC, p.name;` },
    { t: 'p', text: 'اقرأ الاستعلام كسلسلة: ابدأ بالطلبات، أضف بيانات العميل، ثم عناصر الطلب، ثم بيانات المنتج، ثم التصنيف. كل `JOIN` يوسّع الصورة.' },
    { t: 'warn', title: 'ترتيب الربط مع LEFT JOIN', text: 'إن وضعت `LEFT JOIN` ثم `INNER JOIN` بعده على الجدول نفسه، فقد يُلغي الثاني أثر الأول ويحوّله عملياً إلى `INNER`. رتّب الروابط بحيث تأتي الخارجية في النهاية.' },

    { t: 'h2', text: 'مضاعفة الصفوف — الفخّ الكبير' },
    { t: 'danger', title: 'أخطر خطأ في التقارير', text: 'عند ربط جدول بعلاقة «واحد إلى متعدّد»، **يتكرّر صف الأب** لكل ابن. فإذا جمعت عموداً من الأب، حصلت على مجموع مضخّم — وهذا خطأ صامت يمرّ بلا ملاحظة.' },
    { t: 'demo', title: 'كيف يحدث التضخيم', height: 360,
      css: 'table{width:100%;border-collapse:collapse;font-size:.82em;margin-bottom:10px}th{background:#6a5acd;color:#fff;padding:6px 9px;text-align:right}td{padding:5px 9px;border-bottom:1px solid #e2e8f0}b{display:block;font-size:.78em;color:#64748b;margin-bottom:4px}.d{background:#fee2e2}',
      html: '<b>orders — طلب واحد بإجمالي 1000</b><table><tr><th>id</th><th>total</th></tr><tr><td>101</td><td>1000</td></tr></table><b>order_items — ثلاثة عناصر</b><table><tr><th>order_id</th><th>product_id</th><th>qty</th></tr><tr><td>101</td><td>5</td><td>2</td></tr><tr><td>101</td><td>8</td><td>1</td></tr><tr><td>101</td><td>9</td><td>3</td></tr></table><b>بعد JOIN — total تكرّر ثلاث مرات!</b><table><tr><th>order_id</th><th>total</th><th>product_id</th></tr><tr class="d"><td>101</td><td>1000</td><td>5</td></tr><tr class="d"><td>101</td><td>1000</td><td>8</td></tr><tr class="d"><td>101</td><td>1000</td><td>9</td></tr></table><p style="color:#dc2626;font-size:.82em;margin:0"><b>SUM(total) = 3000</b> بدل 1000!</p>' },
    { t: 'code', lang: 'sql', title: 'الحلول الثلاثة', code: `
-- ✗ خطأ: تضخيم
SELECT c.name, SUM(o.total)
FROM customers c
JOIN orders o      ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY c.id, c.name;

-- ✓ الحل 1: احذف الربط غير اللازم
SELECT c.name, SUM(o.total)
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;

-- ✓ الحل 2: DISTINCT داخل التجميع
SELECT
  c.name,
  SUM(DISTINCT o.total) AS revenue,   -- حذر: يخطئ لو تساوت المبالغ
  COUNT(DISTINCT o.id)  AS order_count
FROM customers c
JOIN orders o       ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY c.id, c.name;

-- ✓ الحل 3: جمّع أولاً ثم اربط — الأصحّ
SELECT c.name, agg.revenue, agg.order_count
FROM customers c
JOIN (
  SELECT customer_id,
         SUM(total) AS revenue,
         COUNT(*)   AS order_count
  FROM orders
  GROUP BY customer_id
) agg ON agg.customer_id = c.id;` },
    { t: 'tip', text: 'القاعدة الوقائية: قبل أي `SUM` في استعلام فيه أكثر من ربط، اسأل نفسك «هل تكرّرت صفوف الجدول الذي أجمع منه؟». وللتأكّد شغّل الاستعلام بلا تجميع وعدّ الصفوف.' },

    { t: 'h2', text: 'الربط الذاتي' },
    { t: 'p', text: 'ربط الجدول بنفسه — مفيد للبنى الهرمية والمقارنات الداخلية.' },
    { t: 'code', lang: 'sql', title: 'الموظّف ومديره', code: `
SELECT
  e.name       AS employee,
  m.name       AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id
ORDER BY m.name, e.name;` },
    { t: 'code', lang: 'sql', title: 'التصنيفات والتصنيفات الفرعية', code: `
SELECT
  parent.name AS category,
  child.name  AS subcategory
FROM categories parent
JOIN categories child ON child.parent_id = parent.id
ORDER BY parent.name, child.name;` },
    { t: 'p', text: 'المفتاح هنا: أسماء مختصرة **مختلفة** للجدول نفسه (`e` و `m`)، وإلا لم يعرف المحرّك أي نسخة تقصد.' },

    { t: 'h2', text: '`USING` و `NATURAL JOIN`' },
    { t: 'code', lang: 'sql', code: `
-- إن تطابق اسم العمود في الجدولين
SELECT * FROM orders JOIN customers USING (customer_id);

-- يكافئ
SELECT * FROM orders o JOIN customers c ON c.customer_id = o.customer_id;

-- NATURAL JOIN — يربط تلقائياً بكل الأعمدة المتطابقة الأسماء
SELECT * FROM orders NATURAL JOIN customers;` },
    { t: 'danger', title: 'تجنّب NATURAL JOIN', text: 'يربط بكل عمود يتطابق اسمه في الجدولين — بما فيها `id` و `created_at`! إضافة عمود جديد باسم مشترك قد تكسر الاستعلام بصمت. اكتب `ON` صراحةً دائماً.' },

    { t: 'h2', text: 'تقارير مركّبة' },
    { t: 'code', lang: 'sql', title: 'تقرير مبيعات لكل تصنيف ومدينة', code: `
SELECT
  cat.name                                   AS category,
  c.city,
  COUNT(DISTINCT o.id)                       AS orders,
  SUM(oi.quantity)                           AS units,
  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS revenue
FROM order_items oi
JOIN orders     o   ON o.id   = oi.order_id
JOIN customers  c   ON c.id   = o.customer_id
JOIN products   p   ON p.id   = oi.product_id
JOIN categories cat ON cat.id = p.category_id
WHERE o.status NOT IN ('cancelled', 'refunded')
  AND o.ordered_at >= '2026-01-01'
GROUP BY cat.id, cat.name, c.city
HAVING SUM(oi.quantity * oi.unit_price) > 1000
ORDER BY revenue DESC;` },
    { t: 'code', lang: 'sql', title: 'المنتجات التي لم تُبَع هذا العام', code: `
SELECT p.id, p.name, p.price, p.stock
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o
       ON o.id = oi.order_id
      AND o.ordered_at >= '2026-01-01'
WHERE p.is_active = TRUE
  AND o.id IS NULL
ORDER BY p.stock DESC;` },
    { t: 'note', text: 'لاحظ وضع شرط التاريخ في `ON` لا في `WHERE`: لو وضعناه في `WHERE` لتحوّل `LEFT JOIN` إلى `INNER JOIN` عملياً واختفت الصفوف التي نبحث عنها.' },

    { t: 'exercise',
      title: 'تمرين: تقارير مترابطة',
      brief: 'اكتب اثني عشر استعلام ربط على قاعدة المتجر.',
      requirements: [
        'كل الطلبات مع اسم العميل ومدينته.',
        'كل عناصر الطلبات مع اسم المنتج والتصنيف.',
        'كل العملاء مع عدد طلباتهم — بمن فيهم من لم يطلب.',
        'العملاء الذين لم يطلبوا قط.',
        'المنتجات التي لم تُبَع أبداً.',
        'إجمالي إنفاق كل عميل — احذر التضخيم.',
        'أفضل خمسة منتجات مبيعاً مع اسم تصنيفها.',
        'الإيراد لكل تصنيف مرتّباً تنازلياً.',
        'الإيراد لكل مدينة مع عدد العملاء وعدد الطلبات.',
        'تفاصيل طلب واحد كاملة: العميل والمنتجات والكميات والإجماليات.',
        'ربط ذاتي: التصنيفات مع تصنيفاتها الفرعية.',
        'المنتجات التي لم تُبَع في 2026 (استخدم شرط التاريخ في `ON`).'
      ],
      hints: [
        '«لم يطلب قط» = `LEFT JOIN` + `WHERE o.id IS NULL`.',
        'قبل أي `SUM` تحقّق من عدم تكرار الصفوف.',
        'الربط الذاتي يحتاج اسمين مختصرين مختلفين.'
      ],
      solution: { lang: 'sql', code: `
-- 1) الطلبات مع بيانات العميل
SELECT o.id, o.ordered_at, c.name AS customer, c.city, o.total, o.status
FROM orders o
JOIN customers c ON c.id = o.customer_id
ORDER BY o.ordered_at DESC;

-- 2) عناصر الطلبات مع المنتج والتصنيف
SELECT
  oi.order_id, p.name AS product, cat.name AS category,
  oi.quantity, oi.unit_price,
  oi.quantity * oi.unit_price AS line_total
FROM order_items oi
JOIN products p       ON p.id = oi.product_id
LEFT JOIN categories cat ON cat.id = p.category_id
ORDER BY oi.order_id;

-- 3) كل العملاء وعدد طلباتهم
SELECT c.id, c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY order_count DESC;

-- 4) العملاء بلا طلبات
SELECT c.id, c.name, c.email, c.city
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- 5) المنتجات التي لم تُبَع
SELECT p.id, p.name, p.price, p.stock
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
WHERE oi.id IS NULL
ORDER BY p.stock DESC;

-- 6) إجمالي الإنفاق — بلا تضخيم
SELECT c.name, COUNT(o.id) AS orders, ROUND(SUM(o.total), 2) AS spent
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status NOT IN ('cancelled', 'refunded')
GROUP BY c.id, c.name
ORDER BY spent DESC;

-- 7) أفضل خمسة منتجات
SELECT
  p.name, cat.name AS category,
  SUM(oi.quantity) AS units_sold,
  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS revenue
FROM order_items oi
JOIN products p       ON p.id = oi.product_id
JOIN orders   o       ON o.id = oi.order_id
LEFT JOIN categories cat ON cat.id = p.category_id
WHERE o.status NOT IN ('cancelled', 'refunded')
GROUP BY p.id, p.name, cat.name
ORDER BY revenue DESC
LIMIT 5;

-- 8) الإيراد لكل تصنيف
SELECT
  cat.name AS category,
  COUNT(DISTINCT o.id) AS orders,
  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS revenue
FROM order_items oi
JOIN products p       ON p.id = oi.product_id
JOIN orders   o       ON o.id = oi.order_id
JOIN categories cat   ON cat.id = p.category_id
WHERE o.status NOT IN ('cancelled', 'refunded')
GROUP BY cat.id, cat.name
ORDER BY revenue DESC;

-- 9) الإيراد لكل مدينة
SELECT
  c.city,
  COUNT(DISTINCT c.id) AS customers,
  COUNT(DISTINCT o.id) AS orders,
  ROUND(COALESCE(SUM(o.total), 0), 2) AS revenue
FROM customers c
LEFT JOIN orders o
       ON o.customer_id = c.id
      AND o.status NOT IN ('cancelled', 'refunded')
GROUP BY c.city
ORDER BY revenue DESC;

-- 10) تفاصيل طلب كامل
SELECT
  o.id AS order_id, o.ordered_at, o.status,
  c.name AS customer, c.phone, c.city,
  p.name AS product, oi.quantity, oi.unit_price,
  oi.quantity * oi.unit_price AS line_total,
  o.total AS order_total
FROM orders o
JOIN customers   c  ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products    p  ON p.id = oi.product_id
WHERE o.id = 101;

-- 11) ربط ذاتي: التصنيفات الفرعية
SELECT
  parent.name AS category,
  child.name  AS subcategory
FROM categories parent
LEFT JOIN categories child ON child.parent_id = parent.id
WHERE parent.parent_id IS NULL
ORDER BY parent.name, child.name;

-- 12) لم تُبَع في 2026 — الشرط في ON
SELECT p.id, p.name, p.stock
FROM products p
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o
       ON o.id = oi.order_id
      AND o.ordered_at >= '2026-01-01'
      AND o.ordered_at <  '2027-01-01'
WHERE p.is_active = TRUE
  AND o.id IS NULL
ORDER BY p.stock DESC;` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق بين `INNER JOIN` و `LEFT JOIN`؟', options: ['لا فرق', 'الأول يستبعد ما لا مطابق له، والثاني يبقي كل صفوف اليسار', 'العكس', 'الثاني أسرع'], answer: 1,
        explain: '`LEFT JOIN` يملأ الأعمدة غير المطابقة بـ `NULL` بدل استبعاد الصف.' },
      { q: 'كيف تجد العملاء الذين لم يطلبوا قط؟', options: ['`INNER JOIN` + `WHERE`', '`LEFT JOIN` مع `WHERE orders.id IS NULL`', '`NOT JOIN`', 'مستحيل'], answer: 1,
        explain: 'النمط القياسي لإيجاد «ما ليس له مطابق».' },
      { q: 'ما سبب تضخيم `SUM` عند ربط عدة جداول؟', options: ['خطأ في المحرّك', 'تكرار صف الأب لكل ابن في علاقة واحد إلى متعدّد', 'نوع البيانات', 'الفهارس'], answer: 1,
        explain: 'الحل: جمّع في استعلام فرعي ثم اربط، أو احذف الربط غير اللازم.' },
      { q: 'لماذا نتجنّب `NATURAL JOIN`؟', options: ['بطيء', 'يربط بكل عمود متطابق الاسم فقد يكسر الاستعلام عند إضافة عمود', 'غير مدعوم', 'أطول'], answer: 1,
        explain: 'الربط الضمني خطر؛ اكتب `ON` صراحةً دائماً.' },
      { q: 'أين تضع شرطاً إضافياً على الجدول الأيمن في `LEFT JOIN`؟', options: ['في `WHERE`', 'في `ON` — وإلا تحوّل الربط إلى `INNER` عملياً', 'في `HAVING`', 'لا فرق'], answer: 1,
        explain: 'شرط في `WHERE` على عمود قد يكون `NULL` يستبعد الصفوف غير المطابقة.' }
    ]}
  ]
};
