'use strict';

module.exports = {
  slug: '14-head-meta',
  title: 'وسوم meta والمحارف الخاصة',
  summary: 'ضبط بطاقة هوية صفحتك: الوصف، بطاقات المشاركة الاجتماعية، الأيقونات، والرموز التي لا تُكتب مباشرة.',
  duration: 40,
  level: 'متوسط',
  tags: ['meta', 'SEO'],
  objectives: [
    'تكتب وسوم `<head>` الأساسية لأي صفحة إنتاجية.',
    'تضبط بطاقة المشاركة على مواقع التواصل بـ Open Graph.',
    'تعرف كيف تمنع فهرسة صفحة معيّنة.',
    'تكتب الرموز الخاصة بشكل صحيح (`&lt;` و `&amp;` و `&nbsp;`).',
    'تختار بين الرابط القانوني ونسخ اللغات المختلفة.'
  ],
  quickRef: [
    { code: '<meta name="description">', desc: 'الوصف في نتائج البحث' },
    { code: '<meta property="og:title">', desc: 'عنوان بطاقة المشاركة' },
    { code: '<meta name="robots" content="noindex">', desc: 'منع الفهرسة' },
    { code: '<link rel="canonical">', desc: 'العنوان الأصلي للمحتوى' },
    { code: '&lt; &gt; &amp;', desc: 'أقواس الوسوم وعلامة و' },
    { code: '&nbsp;', desc: 'مسافة غير قابلة للكسر' }
  ],
  blocks: [
    { t: 'h2', text: '`<head>` هو بطاقة هوية الصفحة' },
    { t: 'p', text: 'لا يراه المستخدم مباشرة، لكنه يحدّد كيف تظهر صفحتك في نتائج البحث، وكيف تبدو حين يشاركها أحدهم في واتساب أو تويتر، وكيف يتعامل معها المتصفح. إهماله يعني أن تظهر صفحتك بشكل عشوائي في كل هذه الأماكن.' },

    { t: 'h2', text: 'الحد الأدنى لأي صفحة إنتاجية' },
    { t: 'code', lang: 'html', title: 'قالب head متكامل', code: `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>دليل تعلّم HTML للمبتدئين | كود واي</title>
  <meta name="description"
        content="دليل عربي متدرّج لتعلّم HTML من الصفر: الوسوم والنماذج والعناصر الدلالية مع أمثلة عملية.">

  <link rel="canonical" href="https://example.com/html-guide">
  <meta name="theme-color" content="#6366f1">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <link rel="stylesheet" href="/css/style.css">
</head>` },

    { t: 'h3', text: 'كتابة `<title>` جيّد' },
    { t: 'ul', items: [
      'بين 50 و 60 حرفاً — ما زاد يُقتطع في نتائج البحث.',
      'الأهم أولاً: ضع الكلمة المفتاحية في البداية لا في النهاية.',
      'فريد لكل صفحة — لا تكرّر نفس العنوان في الموقع كله.',
      'النمط الشائع: `موضوع الصفحة | اسم الموقع`.'
    ]},
    { t: 'compare', lang: 'html', bad: {
      code: '<title>الصفحة الرئيسية</title>\n<title>مرحباً بكم في موقعنا الإلكتروني الرسمي الذي يقدّم لكم أفضل الخدمات</title>',
      why: 'الأول عام لا يميّز شيئاً، والثاني طويل يُقتطع ولا يحوي كلمة مفتاحية واضحة.'
    }, good: {
      code: '<title>دورة HTML للمبتدئين — 20 درساً بالعربية | كود واي</title>',
      why: 'محدّد، يبدأ بالموضوع، بطول مناسب، ويحمل اسم الموقع.'
    }},

    { t: 'h3', text: 'الوصف `description`' },
    { t: 'p', text: 'لا يؤثّر مباشرة في الترتيب، لكنه **النص الإعلاني** الذي يقرؤه المستخدم قبل أن يقرّر النقر. طوله المثالي بين 120 و 160 حرفاً، وينبغي أن يصف محتوى الصفحة بدقّة ويحوي دعوة ضمنية للنقر.' },

    { t: 'h2', text: 'بطاقات المشاركة: Open Graph' },
    { t: 'p', text: 'حين يشارك أحدهم رابطك في تطبيق محادثة أو شبكة اجتماعية، يقرأ التطبيق وسوم Open Graph ليبني بطاقة معاينة. بدونها تظهر البطاقة فارغة أو بمحتوى عشوائي.' },
    { t: 'code', lang: 'html', code: `
<meta property="og:type" content="article">
<meta property="og:url" content="https://example.com/html-guide">
<meta property="og:title" content="دليل تعلّم HTML للمبتدئين">
<meta property="og:description" content="عشرون درساً عربياً متدرّجاً مع أمثلة وتمارين.">
<meta property="og:image" content="https://example.com/images/og-html.png">
<meta property="og:image:alt" content="غلاف دورة HTML بالعربية">
<meta property="og:locale" content="ar_AR">
<meta property="og:site_name" content="كود واي">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="دليل تعلّم HTML للمبتدئين">
<meta name="twitter:description" content="عشرون درساً عربياً متدرّجاً مع أمثلة وتمارين.">
<meta name="twitter:image" content="https://example.com/images/og-html.png">` },
    { t: 'demo', title: 'شكل البطاقة الناتجة', height: 300,
      css: '.card{max-width:400px;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;background:#fff}.img{height:150px;background:linear-gradient(135deg,#6366f1,#ec4899);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800}.body{padding:12px 14px}.u{color:#94a3b8;font-size:.8em;text-transform:uppercase}.t{font-weight:800;margin:4px 0}.d{color:#64748b;font-size:.9em}',
      html: '<div class="card"><div class="img">og:image</div><div class="body"><div class="u">example.com</div><div class="t">دليل تعلّم HTML للمبتدئين</div><div class="d">عشرون درساً عربياً متدرّجاً مع أمثلة وتمارين.</div></div></div>' },
    { t: 'warn', text: 'روابط `og:image` و `og:url` يجب أن تكون **مطلقة** وكاملة (تبدأ بـ https). المسارات النسبية لا تعمل هنا لأن الخدمة تقرأ الصفحة من خادمها لا من متصفحك. المقاس الموصى به للصورة: 1200×630 بكسل.' },

    { t: 'h2', text: 'التحكّم في محركات البحث' },
    { t: 'code', lang: 'html', code: `
<!-- الافتراضي: افهرس واتبع الروابط -->
<meta name="robots" content="index, follow">

<!-- منع الفهرسة (صفحات النتائج، لوحة التحكّم، صفحات الشكر) -->
<meta name="robots" content="noindex, nofollow">

<!-- منع حفظ نسخة مخبّأة أو عرض معاينة كبيرة -->
<meta name="robots" content="noarchive, max-image-preview:large">` },
    { t: 'p', text: 'و`<link rel="canonical">` يحلّ مشكلة المحتوى المكرّر: إذا كانت نفس الصفحة متاحة على عدة عناوين (مع معاملات بحث مثلاً)، فالرابط القانوني يخبر محرك البحث أيها الأصل الذي يجب فهرسته.' },

    { t: 'h3', text: 'صفحات بعدة لغات' },
    { t: 'code', lang: 'html', code: `
<link rel="alternate" hreflang="ar" href="https://example.com/ar/guide">
<link rel="alternate" hreflang="en" href="https://example.com/en/guide">
<link rel="alternate" hreflang="x-default" href="https://example.com/guide">` },

    { t: 'h2', text: 'وسوم meta أخرى مفيدة' },
    { t: 'table', head: ['الوسم', 'وظيفته'], rows: [
      ['`<meta name="author">`', 'كاتب الصفحة'],
      ['`<meta name="theme-color">`', 'لون شريط المتصفح على الجوال'],
      ['`<meta name="color-scheme" content="light dark">`', 'إعلان دعم الوضعين الفاتح والداكن'],
      ['`<meta http-equiv="refresh" content="5;url=…">`', 'إعادة توجيه بعد مدة — يُفضَّل توجيه الخادم بدلها'],
      ['`<link rel="manifest" href="…">`', 'ملف تعريف تطبيق الويب التقدّمي'],
      ['`<link rel="preconnect" href="…">`', 'تهيئة الاتصال المبكر بنطاق خارجي'],
      ['`<link rel="preload" as="font" …>`', 'تحميل مورد حرج مبكراً']
    ]},

    { t: 'h2', text: 'المحارف الخاصة (Entities)' },
    { t: 'p', text: 'بعض الرموز لها معنى خاص في HTML، فلا يمكن كتابتها مباشرة. لو كتبت `<p>` داخل النص فسيحاول المتصفح تفسيرها كوسم. الحل: كتابتها كـ **كيان** يبدأ بـ `&` وينتهي بـ `;`.' },
    { t: 'table', head: ['الرمز', 'الكيان', 'لماذا؟'], rows: [
      ['`<`', '`&lt;`', 'يبدأ وسماً'],
      ['`>`', '`&gt;`', 'ينهي وسماً'],
      ['`&`', '`&amp;`', 'يبدأ كياناً'],
      ['`"`', '`&quot;`', 'يحدّد قيم السمات'],
      ['مسافة غير قابلة للكسر', '`&nbsp;`', 'تمنع فصل كلمتين على سطرين'],
      ['`©`', '`&copy;`', 'حقوق النشر'],
      ['`®` `™`', '`&reg;` `&trade;`', 'علامات تجارية'],
      ['`—`', '`&mdash;`', 'شرطة طويلة'],
      ['`…`', '`&hellip;`', 'علامة الحذف'],
      ['`×`', '`&times;`', 'علامة الضرب'],
      ['`←` `→`', '`&larr;` `&rarr;`', 'أسهم']
    ]},
    { t: 'code', lang: 'html', title: 'عرض كود داخل نص', code: `
<p>لكتابة فقرة استخدم الوسم &lt;p&gt; وأغلقه بـ &lt;/p&gt;.</p>
<p>الشركة &amp; الشركاء &copy; 2026</p>
<p>الطول 50&nbsp;سم — لن ينفصل الرقم عن الوحدة.</p>` },
    { t: 'demo', title: 'النتيجة', height: 190,
      html: '<p>لكتابة فقرة استخدم الوسم &lt;p&gt; وأغلقه بـ &lt;/p&gt;.</p><p>الشركة &amp; الشركاء &copy; 2026</p><p>الطول 50&nbsp;سم — لن ينفصل الرقم عن الوحدة.</p>' },
    { t: 'tip', text: 'مع `charset="UTF-8"` تستطيع كتابة معظم الرموز مباشرة (© × ← ✓ 😀) بلا كيانات. الكيانات ضرورية فقط للرموز الأربعة الأولى: `<` و `>` و `&` و `"`، ولـ `&nbsp;` لأنها مسافة غير مرئية.' },
    { t: 'warn', title: 'لا تفرط في `&nbsp;`', text: 'استخدامها لصنع مسافات بين العناصر خطأ شائع — المسافات وظيفة CSS. استخدمها فقط لمنع كسر السطر بين شيئين مترابطين: «50 سم»، «د. أحمد»، «صفحة 12».' },

    { t: 'exercise',
      title: 'تمرين: رأس صفحة إنتاجي كامل',
      brief: 'اكتب `<head>` كاملاً لصفحة مقال في مدونة تقنية عربية.',
      requirements: [
        'الترميز وviewport وعنوان بين 50 و 60 حرفاً.',
        'وصف بين 120 و 160 حرفاً.',
        'رابط قانوني `canonical`.',
        'مجموعة Open Graph كاملة (نوع، رابط، عنوان، وصف، صورة مطلقة، نص بديل للصورة، لغة).',
        'بطاقة تويتر من نوع `summary_large_image`.',
        'أيقونة موقع ولون ثيم.',
        'رابط بديل للنسخة الإنجليزية بـ `hreflang`.',
        'في `<body>` فقرة تشرح استخدام الوسم `<article>` مع كتابة أقواسه بالكيانات.'
      ],
      hints: [
        'روابط og يجب أن تكون مطلقة تبدأ بـ https.',
        'احسب طول العنوان فعلياً — لا تخمّن.',
        '`&lt;article&gt;` هي الطريقة الصحيحة لعرض الوسم كنص.'
      ],
      solution: { lang: 'html', code: `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>العناصر الدلالية في HTML: دليل عملي | مدونة التقنية</title>
  <meta name="description"
        content="شرح عملي للعناصر الدلالية في HTML وكيف تحسّن هيكل صفحتك وإمكانية الوصول وترتيبك في محركات البحث، مع أمثلة قابلة للتطبيق.">

  <link rel="canonical" href="https://tech-blog.example.com/ar/semantic-html">
  <link rel="alternate" hreflang="ar" href="https://tech-blog.example.com/ar/semantic-html">
  <link rel="alternate" hreflang="en" href="https://tech-blog.example.com/en/semantic-html">

  <meta property="og:type" content="article">
  <meta property="og:url" content="https://tech-blog.example.com/ar/semantic-html">
  <meta property="og:title" content="العناصر الدلالية في HTML: دليل عملي">
  <meta property="og:description" content="كيف تحسّن العناصر الدلالية هيكل صفحتك وإمكانية الوصول والسيو.">
  <meta property="og:image" content="https://tech-blog.example.com/images/og-semantic.png">
  <meta property="og:image:alt" content="مخطّط يوضّح هيكل صفحة بعناصر دلالية">
  <meta property="og:locale" content="ar_AR">
  <meta property="og:site_name" content="مدونة التقنية">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="العناصر الدلالية في HTML: دليل عملي">
  <meta name="twitter:description" content="كيف تحسّن العناصر الدلالية هيكل صفحتك وإمكانية الوصول والسيو.">
  <meta name="twitter:image" content="https://tech-blog.example.com/images/og-semantic.png">

  <meta name="theme-color" content="#6366f1">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
</head>

<body>
  <p>
    استخدم &lt;article&gt; لأي محتوى مستقل بذاته، وأغلقه دائماً بـ &lt;/article&gt;.
    &copy; 2026 مدونة التقنية &amp; شركاؤها.
  </p>
</body>` } },

    { t: 'quiz', items: [
      { q: 'ما الطول المناسب تقريباً لوسم `<title>`؟', options: ['10 أحرف', '50–60 حرفاً', '300 حرف', 'لا يهم'], answer: 1,
        explain: 'ما زاد عن ذلك يُقتطع في نتائج البحث، فتضيع نهاية العنوان.' },
      { q: 'لماذا يجب أن يكون رابط `og:image` مطلقاً؟', options: ['ليكون أسرع', 'لأن الخدمة تقرأ الصفحة من خادمها ولا تعرف مسارك النسبي', 'لأن المتصفح يتطلّب ذلك', 'لتقليل الحجم'], answer: 1,
        explain: 'روبوت الشبكة الاجتماعية يجلب الصفحة بمعزل عن سياق متصفحك، فلا يستطيع حلّ المسار النسبي.' },
      { q: 'كيف تكتب علامة `&` داخل نص HTML؟', options: ['`&`', '`&amp;`', '`&and;`', '`\\&`'], answer: 1,
        explain: 'علامة `&` تبدأ كياناً، لذا تُكتب هي نفسها ككيان `&amp;`.' },
      { q: 'ما وظيفة `<link rel="canonical">`؟', options: ['تسريع التحميل', 'تحديد العنوان الأصلي للمحتوى لتفادي مشكلة التكرار', 'تغيير اللغة', 'منع الفهرسة'], answer: 1,
        explain: 'حين يتاح نفس المحتوى على عدة عناوين، يخبر الرابط القانوني محرك البحث أيها الأصل.' },
      { q: 'متى تستخدم `&nbsp;`؟', options: ['لصنع مسافات بين الأقسام', 'لمنع كسر السطر بين شيئين مترابطين مثل «50 سم»', 'بدل الفقرات', 'لتوسيط النص'], answer: 1,
        explain: 'المسافات التخطيطية وظيفة CSS؛ المسافة غير القابلة للكسر لحالة دلالية محدّدة.' }
    ]}
  ]
};
