'use strict';

module.exports = {
  slug: '09-indexes',
  title: 'الفهارس والأداء',
  summary: 'لماذا يبطؤ الاستعلام وكيف تسرّعه: الفهارس وأنواعها، وقراءة خطة التنفيذ، وقواعد التحسين.',
  duration: 50,
  level: 'متقدم',
  tags: ['الأداء', 'الفهارس'],
  objectives: [
    'تفهم كيف يعمل الفهرس ولماذا يسرّع البحث.',
    'تنشئ فهارس مفردة ومركّبة.',
    'تقرأ خطة التنفيذ وتكتشف المسح الكامل.',
    'تعرف متى يضرّ الفهرس ولا ينفع.',
    'تكتب استعلامات صديقة للفهارس.'
  ],
  quickRef: [
    { code: 'CREATE INDEX idx ON t (col)', desc: 'فهرس مفرد' },
    { code: 'CREATE INDEX ON t (a, b)', desc: 'فهرس مركّب' },
    { code: 'CREATE UNIQUE INDEX', desc: 'فهرس فريد' },
    { code: 'EXPLAIN SELECT …', desc: 'خطة التنفيذ' },
    { code: 'EXPLAIN ANALYZE', desc: 'الخطة مع التنفيذ الفعلي' },
    { code: 'DROP INDEX idx', desc: 'حذف فهرس' }
  ],
  blocks: [
    { t: 'h2', text: 'المشكلة: المسح الكامل' },
    { t: 'p', text: 'بلا فهرس، للعثور على صف يقرأ المحرّك **كل صفوف الجدول** واحداً واحداً. هذا يُسمّى **المسح الكامل** (Full Table Scan). مع ألف صف لا تلاحظ، ومع عشرة ملايين ينهار التطبيق.' },
    { t: 'demo', title: 'أثر الفهرس على زمن البحث', height: 260,
      css: 'table{width:100%;border-collapse:collapse;font-size:.86em}th{background:#6a5acd;color:#fff;padding:8px 10px;text-align:right}td{padding:7px 10px;border-bottom:1px solid #e2e8f0}.s{color:#dc2626;font-weight:700}.f{color:#059669;font-weight:700}',
      html: '<table><tr><th>عدد الصفوف</th><th>بلا فهرس</th><th>مع فهرس</th></tr><tr><td>1,000</td><td>2 مللي ثانية</td><td class="f">0.1 مللي</td></tr><tr><td>100,000</td><td>180 مللي ثانية</td><td class="f">0.3 مللي</td></tr><tr><td>1,000,000</td><td class="s">1.8 ثانية</td><td class="f">0.4 مللي</td></tr><tr><td>10,000,000</td><td class="s">18 ثانية</td><td class="f">0.5 مللي</td></tr></table><p style="color:#64748b;font-size:.82em;margin-top:10px">أرقام تقريبية للتوضيح — لاحظ أن الفهرس ينمو لوغاريتمياً بينما المسح ينمو خطياً.</p>' },
    { t: 'p', text: 'الفهرس بنية بيانات إضافية (شجرة B-Tree غالباً) تحتفظ بقيم عمود مرتّبة مع مؤشّر لموضع الصف. البحث فيها يشبه البحث في فهرس كتاب: تقفز مباشرة بدل تقليب كل الصفحات.' },

    { t: 'h2', text: 'إنشاء الفهارس' },
    { t: 'code', lang: 'sql', code: `
-- فهرس مفرد
CREATE INDEX idx_customers_city ON customers (city);

-- فهرس فريد — يفرض عدم التكرار أيضاً
CREATE UNIQUE INDEX idx_users_email ON users (email);

-- فهرس مركّب
CREATE INDEX idx_orders_customer_date
  ON orders (customer_id, ordered_at DESC);

-- فهرس جزئي — على جزء من الصفوف (PostgreSQL)
CREATE INDEX idx_active_products
  ON products (name)
  WHERE is_active = TRUE;

-- فهرس على تعبير
CREATE INDEX idx_users_lower_email ON users (LOWER(email));

-- الحذف
DROP INDEX idx_customers_city;

-- عرض الفهارس
SHOW INDEX FROM orders;              -- MySQL
SELECT * FROM pg_indexes WHERE tablename = 'orders';  -- PostgreSQL` },
    { t: 'note', title: 'فهارس تلقائية', text: 'المفتاح الأساسي وقيد `UNIQUE` يُنشئان فهرساً تلقائياً. أما **المفاتيح الأجنبية فلا** في معظم الأنظمة — وهذا سبب شائع جداً لبطء عمليات الربط والحذف. أنشئ فهارسها يدوياً.' },

    { t: 'h2', text: 'الفهرس المركّب وقاعدة البادئة' },
    { t: 'p', text: 'الفهرس على `(a, b, c)` يشبه دليل هاتف مرتّباً بالاسم الأول ثم الأخير ثم المدينة. يفيدك إن بحثت بالاسم الأول، أو الأول والأخير، لكنه **لا يفيد** إن بحثت بالمدينة وحدها.' },
    { t: 'code', lang: 'sql', code: `
CREATE INDEX idx_orders ON orders (customer_id, status, ordered_at);` },
    { t: 'demo', title: 'متى يُستخدم الفهرس المركّب؟', height: 280,
      css: 'table{width:100%;border-collapse:collapse;font-size:.84em}th{background:#6a5acd;color:#fff;padding:7px 10px;text-align:right}td{padding:6px 10px;border-bottom:1px solid #e2e8f0}code{font-family:monospace;direction:ltr;display:inline-block;font-size:.88em}.y{color:#059669;font-weight:700}.n{color:#dc2626;font-weight:700}.p{color:#d97706;font-weight:700}',
      html: '<table><tr><th>شرط الاستعلام</th><th>يستخدم الفهرس؟</th></tr><tr><td><code>WHERE customer_id = 5</code></td><td class="y">✓ كاملاً</td></tr><tr><td><code>WHERE customer_id = 5 AND status = \'paid\'</code></td><td class="y">✓ كاملاً</td></tr><tr><td><code>WHERE customer_id = 5 AND ordered_at &gt; …</code></td><td class="p">✓ جزئياً</td></tr><tr><td><code>WHERE status = \'paid\'</code></td><td class="n">✗ لا</td></tr><tr><td><code>WHERE ordered_at &gt; …</code></td><td class="n">✗ لا</td></tr></table>' },
    { t: 'tip', text: 'رتّب أعمدة الفهرس المركّب: **الأكثر انتقائية أولاً** (العمود الذي يقلّص النتائج أكثر)، ثم أعمدة المساواة، ثم أعمدة المدى (`>` و `BETWEEN`) في النهاية.' },

    { t: 'h2', text: 'قراءة خطة التنفيذ' },
    { t: 'code', lang: 'sql', code: `
EXPLAIN SELECT * FROM orders WHERE customer_id = 5;

-- مع تنفيذ فعلي وقياس الزمن
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 5;` },
    { t: 'demo', title: 'خطة بلا فهرس ومع فهرس', height: 300,
      css: 'pre{background:#0f1729;color:#e2e8f0;padding:12px;border-radius:10px;direction:ltr;text-align:left;font-family:monospace;font-size:.78em;line-height:1.8;margin:0 0 10px;overflow-x:auto}.bad{color:#fca5a5}.good{color:#86efac}b{display:block;font-size:.8em;color:#64748b;margin-bottom:4px}',
      html: '<b>بلا فهرس</b><pre><span class="bad">Seq Scan on orders</span>  (cost=0.00..18334.00 rows=12 width=64)\n  Filter: (customer_id = 5)\n  <span class="bad">Rows Removed by Filter: 999988</span>\n  Execution Time: <span class="bad">142.8 ms</span></pre><b>مع فهرس</b><pre><span class="good">Index Scan using idx_orders_customer</span>  (cost=0.42..8.44 rows=12 width=64)\n  Index Cond: (customer_id = 5)\n  Execution Time: <span class="good">0.09 ms</span></pre>' },
    { t: 'table', head: ['ما تراه في الخطة', 'المعنى', 'الحكم'], rows: [
      ['`Seq Scan` / `ALL`', 'مسح كامل للجدول', '⚠️ ابحث عن فهرس مفقود'],
      ['`Index Scan`', 'استخدام الفهرس ثم قراءة الصف', '✅ جيد'],
      ['`Index Only Scan`', 'كل البيانات من الفهرس نفسه', '✅ ممتاز'],
      ['`Bitmap Heap Scan`', 'فهرس مع نتائج كثيرة', '✅ مقبول'],
      ['`Nested Loop`', 'ربط بحلقة متداخلة', 'جيد للنتائج القليلة'],
      ['`Hash Join`', 'ربط بجدول تجزئة', 'جيد للنتائج الكثيرة'],
      ['`Rows Removed by Filter` كبير', 'قرأ كثيراً ورمى كثيراً', '⚠️ يحتاج فهرساً']
    ]},
    { t: 'tip', text: 'ليس كل مسح كامل سيّئاً: في جدول من 500 صف، المسح أسرع من الفهرس لأن الجدول كله يدخل الذاكرة. المحسّن يعرف ذلك ويختار بحكمة.' },

    { t: 'h2', text: 'ما يعطّل الفهرس' },
    { t: 'compare', lang: 'sql', bad: {
      code: '-- ✗ دالة على العمود\nWHERE YEAR(ordered_at) = 2026\n\n-- ✗ نمط يبدأ بـ %\nWHERE name LIKE \'%سماعة%\'\n\n-- ✗ عملية حسابية\nWHERE price * 1.15 > 500\n\n-- ✗ نوع مختلف\nWHERE customer_id = \'5\'   -- نصّ مع عمود رقمي',
      why: 'في كل حالة يجب على المحرّك حساب التعبير لكل صف، فلا يستطيع استخدام القيم المرتّبة في الفهرس.'
    }, good: {
      code: '-- ✓ مدى على العمود مباشرة\nWHERE ordered_at >= \'2026-01-01\'\n  AND ordered_at <  \'2027-01-01\'\n\n-- ✓ نمط يبدأ بنص\nWHERE name LIKE \'سماعة%\'\n\n-- ✓ انقل الحساب للطرف الآخر\nWHERE price > 500 / 1.15\n\n-- ✓ نوع مطابق\nWHERE customer_id = 5',
      why: 'العمود يبقى نظيفاً على يسار المقارنة، فيستطيع المحرّك القفز في الفهرس مباشرة.'
    }},
    { t: 'danger', title: 'القاعدة الذهبية', text: '**اترك العمود عارياً**. أي دالة أو عملية حسابية أو تحويل نوع على العمود في `WHERE` يعطّل الفهرس. انقل العملية إلى الطرف الآخر من المقارنة.' },

    { t: 'h2', text: 'تكلفة الفهارس' },
    { t: 'p', text: 'الفهرس ليس مجانياً. كل فهرس:' },
    { t: 'ul', items: [
      '**يشغل مساحة** — قد تصل إلى حجم الجدول نفسه.',
      '**يبطئ الكتابة** — كل `INSERT` و `UPDATE` و `DELETE` يجب أن يحدّث كل الفهارس.',
      '**يستهلك ذاكرة** — الفهارس المستخدمة تُحمَّل في الذاكرة.',
      '**يحتاج صيانة** — يتفتّت مع الوقت ويحتاج إعادة بناء.'
    ]},
    { t: 'warn', title: 'لا تفهرس كل شيء', text: 'جدول بعشرين فهرساً قد تكون الكتابة فيه أبطأ عشر مرات. القاعدة: افهرس ما تبحث به فعلاً، وراجع الفهارس دورياً واحذف ما لا يُستخدم.' },
    { t: 'code', lang: 'sql', title: 'اكتشاف الفهارس غير المستخدمة (PostgreSQL)', code: `
SELECT
  schemaname,
  relname   AS table_name,
  indexrelname AS index_name,
  idx_scan  AS times_used,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;` },

    { t: 'h2', text: 'ماذا تفهرس؟' },
    { t: 'table', head: ['افهرس', 'لا تفهرس'], rows: [
      ['أعمدة `WHERE` المتكرّرة', 'أعمدة نادرة الاستخدام في البحث'],
      ['**المفاتيح الأجنبية** (مهم جداً)', 'أعمدة بقيم قليلة التنوّع (نعم/لا)'],
      ['أعمدة `JOIN`', 'جداول صغيرة جداً'],
      ['أعمدة `ORDER BY` المتكرّرة', 'أعمدة تُحدَّث باستمرار'],
      ['أعمدة `UNIQUE`', 'أعمدة نصّية طويلة جداً']
    ]},
    { t: 'note', title: 'الانتقائية', text: 'الفهرس مفيد حين يقلّص النتائج بقوة. فهرس على عمود `is_active` (قيمتان فقط) قليل الفائدة لأنه يُرجع نصف الجدول. أما فهرس على `email` (كل قيمة فريدة) فمثالي.' },

    { t: 'h2', text: 'الفهرس المغطّي' },
    { t: 'code', lang: 'sql', code: `
-- الاستعلام المتكرّر
SELECT customer_id, ordered_at, total
FROM orders
WHERE customer_id = 5
ORDER BY ordered_at DESC;

-- فهرس يغطّي كل ما يحتاجه الاستعلام
CREATE INDEX idx_orders_covering
  ON orders (customer_id, ordered_at DESC, total);` },
    { t: 'p', text: 'حين يحوي الفهرس **كل الأعمدة المطلوبة**، لا يحتاج المحرّك قراءة الجدول أصلاً — يجيب من الفهرس مباشرة. هذا ما يُسمّى `Index Only Scan` وهو أسرع أنواع الوصول.' },
    { t: 'tip', text: 'هذا سبب إضافي لتجنّب `SELECT *`: يمنع الفهرس المغطّي لأنه يطلب أعمدة ليست في الفهرس.' },

    { t: 'h2', text: 'قواعد تحسين عامة' },
    { t: 'steps', items: [
      '**قِس أولاً**: لا تحسّن بالتخمين. استخدم `EXPLAIN ANALYZE` واعرف أين الوقت يذهب فعلاً.',
      '**افهرس المفاتيح الأجنبية** — أكثر تحسين مُهمَل وأكبر أثراً.',
      '**اطلب ما تحتاجه فقط**: أعمدة محدّدة، و`LIMIT` حين يكفي.',
      '**رشّح مبكراً**: `WHERE` قبل `HAVING`، وقلّص الصفوف قبل الربط.',
      '**اترك العمود عارياً** في شروط `WHERE`.',
      '**تجنّب `OFFSET` الكبير**: استخدم الترقيم بالمفتاح في الجداول الضخمة.',
      '**حدّث الإحصاءات**: `ANALYZE table_name` ليتخذ المحسّن قرارات صحيحة.',
      '**راقب الاستعلامات البطيئة**: فعّل سجلّ الاستعلامات البطيئة في الإنتاج.'
    ]},
    { t: 'code', lang: 'sql', title: 'الترقيم بالمفتاح', code: `
-- ✗ بطيء مع الأرقام الكبيرة
SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 100000;

-- ✓ سريع دائماً
SELECT * FROM orders
WHERE id > 100000        -- آخر معرّف من الصفحة السابقة
ORDER BY id
LIMIT 20;` },

    { t: 'h2', text: 'حالة عملية' },
    { t: 'code', lang: 'sql', title: 'قبل التحسين', code: `
-- 3.2 ثانية على جدول بمليون طلب
SELECT
  c.name,
  COUNT(*) AS orders,
  SUM(o.total) AS revenue
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE YEAR(o.ordered_at) = 2026
  AND o.status = 'delivered'
GROUP BY c.id, c.name
ORDER BY revenue DESC
LIMIT 20;` },
    { t: 'code', lang: 'sql', title: 'بعد التحسين', code: `
-- 1) فهرس على المفتاح الأجنبي
CREATE INDEX idx_orders_customer ON orders (customer_id);

-- 2) فهرس مركّب للشرط
CREATE INDEX idx_orders_status_date
  ON orders (status, ordered_at) INCLUDE (customer_id, total);

-- 3) إزالة الدالة عن العمود
SELECT
  c.name,
  COUNT(*) AS orders,
  SUM(o.total) AS revenue
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.ordered_at >= '2026-01-01'
  AND o.ordered_at <  '2027-01-01'
  AND o.status = 'delivered'
GROUP BY c.id, c.name
ORDER BY revenue DESC
LIMIT 20;

-- النتيجة: 0.08 ثانية — أسرع بأربعين مرة` },

    { t: 'exercise',
      title: 'تمرين: تشخيص وتحسين',
      brief: 'حلّل استعلامات بطيئة وحسّنها بالفهارس وإعادة الكتابة.',
      requirements: [
        'أنشئ فهارس لكل المفاتيح الأجنبية في قاعدة المتجر.',
        'أنشئ فهرساً فريداً على بريد العميل ورمز المنتج.',
        'أنشئ فهرساً مركّباً على `orders(customer_id, ordered_at DESC)`.',
        'أنشئ فهرساً جزئياً على المنتجات النشطة فقط.',
        'أعد كتابة `WHERE YEAR(ordered_at) = 2026` بصيغة صديقة للفهرس.',
        'أعد كتابة `WHERE price * 1.15 > 500` بصيغة صديقة للفهرس.',
        'أعد كتابة `WHERE LOWER(email) = "x"` بطريقتين: تعديل الاستعلام أو فهرس على تعبير.',
        'استبدل `LIMIT 20 OFFSET 100000` بالترقيم بالمفتاح.',
        'اكتب استعلاماً يستفيد من فهرس مغطٍّ واذكر أعمدة الفهرس.',
        'اكتب أمر `EXPLAIN` لكل استعلام واذكر ما تتوقّع رؤيته.',
        'اذكر ثلاثة أعمدة **لا** ينبغي فهرستها ولماذا.'
      ],
      hints: [
        'اترك العمود عارياً في يسار المقارنة دائماً.',
        'الفهرس المغطّي يحوي كل أعمدة `SELECT` و `WHERE`.',
        'الأعمدة قليلة التنوّع (نعم/لا) ضعيفة الانتقائية.'
      ],
      solution: { lang: 'sql', code: `
-- ===== 1) فهارس المفاتيح الأجنبية =====
CREATE INDEX idx_products_category  ON products (category_id);
CREATE INDEX idx_orders_customer    ON orders (customer_id);
CREATE INDEX idx_items_order        ON order_items (order_id);
CREATE INDEX idx_items_product      ON order_items (product_id);

-- ===== 2) فهارس فريدة =====
CREATE UNIQUE INDEX idx_customers_email ON customers (email);
CREATE UNIQUE INDEX idx_products_sku    ON products (sku);

-- ===== 3) فهرس مركّب =====
CREATE INDEX idx_orders_customer_date
  ON orders (customer_id, ordered_at DESC);

-- ===== 4) فهرس جزئي =====
CREATE INDEX idx_products_active_name
  ON products (name)
  WHERE is_active = TRUE;

-- ===== 5) التاريخ: من دالة إلى مدى =====
-- ✗ قبل
-- WHERE YEAR(ordered_at) = 2026
-- ✓ بعد
SELECT * FROM orders
WHERE ordered_at >= '2026-01-01'
  AND ordered_at <  '2027-01-01';

-- ===== 6) نقل العملية الحسابية =====
-- ✗ قبل:  WHERE price * 1.15 > 500
-- ✓ بعد
SELECT * FROM products
WHERE price > 500 / 1.15;

-- ===== 7) البريد: طريقتان =====
-- (أ) خزّن البريد بحروف صغيرة دائماً واستعلم مباشرة
SELECT * FROM customers WHERE email = 'sara@example.com';

-- (ب) أو فهرس على تعبير
CREATE INDEX idx_customers_lower_email ON customers (LOWER(email));
SELECT * FROM customers WHERE LOWER(email) = 'sara@example.com';

-- ===== 8) الترقيم بالمفتاح =====
-- ✗ قبل
-- SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 100000;
-- ✓ بعد
SELECT * FROM orders
WHERE id > 100000
ORDER BY id
LIMIT 20;

-- ===== 9) الفهرس المغطّي =====
CREATE INDEX idx_orders_covering
  ON orders (customer_id, ordered_at DESC, status, total);

-- هذا الاستعلام يُجاب من الفهرس وحده: Index Only Scan
SELECT customer_id, ordered_at, status, total
FROM orders
WHERE customer_id = 5
ORDER BY ordered_at DESC
LIMIT 10;

-- ===== 10) خطط التنفيذ =====
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 5;
-- متوقّع: Index Scan using idx_orders_customer

EXPLAIN ANALYZE
SELECT * FROM orders WHERE YEAR(ordered_at) = 2026;
-- متوقّع: Seq Scan — الدالة عطّلت الفهرس

EXPLAIN ANALYZE
SELECT customer_id, total FROM orders WHERE customer_id = 5;
-- متوقّع: Index Only Scan مع الفهرس المغطّي

/* ===== 11) أعمدة لا تُفهرَس =====

  1. is_active (BOOLEAN)
     انتقائية ضعيفة جداً: قيمتان فقط، والفهرس يُرجع نصف الجدول
     فيفضّل المحسّن المسح الكامل أصلاً.
     الاستثناء: فهرس جزئي WHERE is_active = TRUE مفيد.

  2. description (TEXT طويل)
     الفهرس سيكون ضخماً، والبحث فيه بـ LIKE '%...%' لن يستخدمه.
     البديل الصحيح: فهرسة النص الكامل (Full-Text Search).

  3. updated_at إن كان يُحدَّث مع كل عملية
     كل تحديث يعيد ترتيب الفهرس، فتصبح تكلفة الكتابة عالية
     بلا مقابل إن لم نبحث بهذا العمود فعلاً.
*/` } },

    { t: 'quiz', items: [
      { q: 'ما الفهرس الذي **لا** يُنشأ تلقائياً في معظم الأنظمة؟', options: ['المفتاح الأساسي', 'المفتاح الأجنبي', 'قيد UNIQUE', 'كلها تلقائية'], answer: 1,
        explain: 'إهماله من أشهر أسباب بطء الربط والحذف؛ أنشئه يدوياً دائماً.' },
      { q: 'لماذا `WHERE YEAR(date) = 2026` بطيئة؟', options: ['الدالة بطيئة', 'وجود دالة على العمود يعطّل استخدام الفهرس', 'خطأ صياغة', 'تحتاج تحويلاً'], answer: 1,
        explain: 'اترك العمود عارياً واستخدم مدى تواريخ بدلاً منها.' },
      { q: 'ما معنى قاعدة البادئة في الفهرس المركّب `(a, b, c)`؟', options: ['يعمل مع أي عمود', 'يعمل مع a، أو a+b، أو a+b+c — لا مع b أو c وحدهما', 'يعمل مع c فقط', 'لا قاعدة'], answer: 1,
        explain: 'الترتيب في الفهرس هرمي كدليل الهاتف: الاسم الأول ثم الأخير.' },
      { q: 'ما تكلفة إضافة فهرس؟', options: ['لا تكلفة', 'مساحة إضافية وبطء في عمليات الكتابة', 'بطء في القراءة', 'استهلاك شبكة'], answer: 1,
        explain: 'كل `INSERT`/`UPDATE`/`DELETE` يجب أن يحدّث كل الفهارس.' },
      { q: 'ما `Index Only Scan`؟', options: ['مسح كامل', 'إجابة الاستعلام من الفهرس وحده دون قراءة الجدول', 'فهرس معطّل', 'ربط'], answer: 1,
        explain: 'يحدث حين يحوي الفهرس كل الأعمدة المطلوبة — أسرع أنواع الوصول.' }
    ]}
  ]
};
