'use strict';

module.exports = {
  slug: '17-seo',
  title: 'HTML وتحسين محركات البحث',
  summary: 'كيف يقرأ محرك البحث صفحتك، وما الذي يعتمد فيه على ترميزك أنت: العناوين، الروابط، البيانات المنظّمة، والسرعة.',
  duration: 45,
  level: 'متقدم',
  tags: ['SEO', 'الترميز'],
  objectives: [
    'تفهم مراحل الزحف والفهرسة والترتيب.',
    'تبني هيكل صفحة صديقاً لمحركات البحث.',
    'تكتب بيانات منظّمة بصيغة JSON-LD.',
    'تتجنّب الأخطاء التقنية التي تعطّل الفهرسة.',
    'تربط بين إمكانية الوصول والسيو.'
  ],
  quickRef: [
    { code: '<title> و meta description', desc: 'ما يظهر في نتيجة البحث' },
    { code: '<h1> واحد + تسلسل سليم', desc: 'مخطّط موضوع الصفحة' },
    { code: 'rel="canonical"', desc: 'النسخة الأصلية للمحتوى' },
    { code: 'robots.txt / sitemap.xml', desc: 'إرشاد الزاحف' },
    { code: 'application/ld+json', desc: 'بيانات منظّمة' },
    { code: 'rel="nofollow|sponsored|ugc"', desc: 'وصف طبيعة الرابط' }
  ],
  blocks: [
    { t: 'h2', text: 'كيف يعمل محرك البحث؟' },
    { t: 'steps', items: [
      '**الزحف (Crawling)** — روبوت يتتبّع الروابط ويحمّل صفحاتك. إن لم يصل إلى صفحة فهي غير موجودة بالنسبة له.',
      '**العرض (Rendering)** — ينفّذ جافاسكربت ليرى الصفحة كما يراها المستخدم. هذه المرحلة مكلفة وقد تتأخّر.',
      '**الفهرسة (Indexing)** — يحلّل المحتوى ويخزّنه في فهرس ضخم.',
      '**الترتيب (Ranking)** — عند بحث المستخدم، ترتّب الخوارزمية النتائج بمئات الإشارات.'
    ]},
    { t: 'p', text: 'دورك كمطوّر يتركّز في المراحل الثلاث الأولى: **اجعل صفحتك سهلة الزحف، سريعة العرض، واضحة الفهرسة**. أما الترتيب فتحكمه جودة المحتوى نفسه أساساً.' },
    { t: 'note', title: 'الحقيقة المزعجة', text: 'أفضل ترميز في العالم لن يرفع محتوىً رديئاً. السيو التقني **يزيل العوائق** أمام محتوى جيد، ولا يصنع قيمة من عدم.' },

    { t: 'h2', text: 'الأساسيات التي يقرؤها المحرك' },
    { t: 'table', head: ['العنصر', 'أثره', 'أفضل ممارسة'], rows: [
      ['`<title>`', 'قوي جداً — العنوان في النتيجة', 'فريد لكل صفحة، 50–60 حرفاً، الكلمة المفتاحية أولاً'],
      ['`meta description`', 'لا يرفع الترتيب لكنه يرفع نسبة النقر', '120–160 حرفاً، وصف دقيق وجذّاب'],
      ['`<h1>`', 'قوي — موضوع الصفحة', 'واحد لكل صفحة، مطابق لموضوعها'],
      ['`h2`–`h6`', 'متوسط — هيكل المحتوى', 'تسلسل منطقي بلا قفز'],
      ['`alt` للصور', 'يفهرس الصور ويدعم البحث المرئي', 'وصف دقيق لا حشو كلمات'],
      ['نص الروابط', 'يصف الوجهة للمحرك أيضاً', 'وصفي لا «اضغط هنا»'],
      ['العناصر الدلالية', 'تساعد على فهم بنية الصفحة', '`main`, `article`, `nav`, `header`']
    ]},

    { t: 'h2', text: 'الروابط: العملة الأساسية' },
    { t: 'code', lang: 'html', code: `
<!-- رابط داخلي عادي: ينقل قيمة ويساعد على اكتشاف الصفحات -->
<a href="/articles/css-grid">دليل CSS Grid</a>

<!-- رابط لا تضمنه ولا تريد تزكيته -->
<a href="https://example.com" rel="nofollow">مصدر خارجي</a>

<!-- رابط إعلاني مدفوع -->
<a href="https://sponsor.com" rel="sponsored">راعي المحتوى</a>

<!-- رابط من محتوى ينشره المستخدمون (تعليقات) -->
<a href="https://user-site.com" rel="ugc nofollow">موقع المعلّق</a>` },
    { t: 'ul', items: [
      '**الروابط الداخلية** تساعد الزاحف على اكتشاف صفحاتك وتوزّع أهميتها. اربط مقالاتك ببعضها بنصوص وصفية.',
      '`nofollow` — «لا تزكِّ هذا الرابط». استخدمه للروابط التي لا تضمنها.',
      '`sponsored` — للروابط المدفوعة. عدم وضعه على رابط مدفوع مخالفة صريحة.',
      '`ugc` — لروابط داخل محتوى ينشره المستخدمون.'
    ]},
    { t: 'warn', text: 'الرابط الذي يعتمد على جافاسكربت وحده (`<div onclick="location=…">`) قد لا يتبعه الزاحف. استخدم `<a href>` حقيقياً دائماً.' },

    { t: 'h2', text: 'ملفان يجب أن يكونا في جذر موقعك' },
    { t: 'code', lang: 'text', title: 'robots.txt', noCopy: true, code: `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /search?

Sitemap: https://example.com/sitemap.xml` },
    { t: 'code', lang: 'xml', title: 'sitemap.xml', code: `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-03-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/articles/html-guide</loc>
    <lastmod>2026-02-20</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>` },
    { t: 'note', text: '`robots.txt` يمنع **الزحف** لا الفهرسة. صفحة ممنوعة في robots.txt قد تظهر في النتائج بلا وصف إن أشارت إليها روابط خارجية. لمنع الفهرسة فعلاً استخدم `<meta name="robots" content="noindex">` — واحرص ألا تمنع الزاحف من قراءتها وإلا لن يرى وسم noindex أصلاً.' },

    { t: 'h2', text: 'البيانات المنظّمة (Structured Data)' },
    { t: 'p', text: 'ترميز إضافي يشرح لمحرك البحث **ما يعنيه** محتواك: هذا مقال، وهذا كاتبه، وهذه وصفة مدّتها 30 دقيقة. النتيجة: نتائج غنية (Rich Results) بنجوم تقييم وصور ومعلومات إضافية ترفع نسبة النقر كثيراً.' },
    { t: 'code', lang: 'html', title: 'JSON-LD — الصيغة الموصى بها', code: `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "دليل تعلّم HTML للمبتدئين",
  "description": "دليل عربي متدرّج لتعلّم HTML من الصفر.",
  "image": "https://example.com/images/cover.png",
  "datePublished": "2026-03-01",
  "dateModified": "2026-03-15",
  "author": {
    "@type": "Person",
    "name": "سارة عبدالله",
    "url": "https://example.com/authors/sara"
  },
  "publisher": {
    "@type": "Organization",
    "name": "كود واي",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "inLanguage": "ar"
}
</script>` },
    { t: 'code', lang: 'html', title: 'أسئلة شائعة — تظهر منسدلة في النتائج', code: `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "كم يستغرق تعلّم HTML؟",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "أسبوعان بمعدّل ساعة يومياً تكفيان لإتقان الأساسيات."
    }
  }]
}
</script>` },
    { t: 'table', head: ['النوع', 'يُستخدم لـ'], rows: [
      ['`Article` / `BlogPosting`', 'المقالات والتدوينات'],
      ['`Product` + `Offer`', 'صفحات المنتجات مع السعر والتوفّر'],
      ['`Recipe`', 'الوصفات مع المدة والمكوّنات'],
      ['`FAQPage`', 'الأسئلة الشائعة'],
      ['`BreadcrumbList`', 'مسار التنقّل في النتيجة'],
      ['`Organization` / `LocalBusiness`', 'بيانات الشركة والعنوان'],
      ['`Course`', 'الدورات التعليمية']
    ]},
    { t: 'danger', title: 'قاعدة صارمة', text: 'البيانات المنظّمة يجب أن تطابق ما يراه المستخدم على الصفحة **تماماً**. ترميز تقييم 5 نجوم لا وجود له في الصفحة يُعدّ تضليلاً وقد يعاقَب عليه الموقع بحرمانه من النتائج الغنية.' },

    { t: 'h2', text: 'السرعة وتجربة الصفحة' },
    { t: 'p', text: 'جوجل تقيس ثلاثة مؤشّرات تُسمّى **Core Web Vitals**، وهي إشارات ترتيب فعلية:' },
    { t: 'table', head: ['المؤشّر', 'يقيس', 'الهدف'], rows: [
      ['**LCP** (Largest Contentful Paint)', 'زمن ظهور أكبر عنصر مرئي', 'أقل من 2.5 ثانية'],
      ['**INP** (Interaction to Next Paint)', 'سرعة استجابة الصفحة للتفاعل', 'أقل من 200 مللي ثانية'],
      ['**CLS** (Cumulative Layout Shift)', 'مقدار قفز المحتوى أثناء التحميل', 'أقل من 0.1']
    ]},
    { t: 'p', text: 'ما تستطيع فعله في HTML مباشرة:' },
    { t: 'ul', items: [
      'حدّد `width` و `height` لكل صورة وإطار — يعالج **CLS** مباشرة.',
      '`loading="lazy"` لما هو خارج الشاشة، وتجنّبها للصورة الرئيسية — يحسّن **LCP**.',
      '`fetchpriority="high"` للصورة الرئيسية في أعلى الصفحة.',
      '`defer` على السكربتات كي لا توقف بناء الصفحة — يحسّن **INP**.',
      '`preconnect` للنطاقات الخارجية الحرجة (الخطوط مثلاً).',
      'احجز مساحة الإعلانات والودجات مسبقاً بـ CSS.'
    ]},
    { t: 'code', lang: 'html', code: `
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<img src="hero.webp" alt="…" width="1200" height="630"
     fetchpriority="high" decoding="async">

<script src="/js/app.js" defer></script>` },

    { t: 'h2', text: 'أخطاء تقنية شائعة تعطّل الفهرسة' },
    { t: 'ul', items: [
      '`<meta name="robots" content="noindex">` منسي من بيئة التطوير على الموقع الحي — يحذف موقعك من جوجل بالكامل.',
      'محتوى يظهر فقط بعد تنفيذ جافاسكربت ثقيل، فيراه الزاحف صفحة فارغة.',
      'روابط قانونية خاطئة تشير كل الصفحات إلى الرئيسية.',
      'صفحات مكرّرة بعناوين مختلفة (`?ref=`, `?utm=`) بلا `canonical`.',
      'روابط داخلية مكسورة تعطي 404.',
      'إعادة توجيه متسلسلة طويلة (A ← B ← C ← D).',
      'موقع بلا HTTPS، أو خليط من محتوى آمن وغير آمن.',
      'نص مخفي محشوّ بالكلمات المفتاحية — عقوبة مباشرة.'
    ]},

    { t: 'h2', text: 'إمكانية الوصول = سيو' },
    { t: 'p', text: 'لاحظ التطابق: النص البديل، والعناوين المتسلسلة، ونصوص الروابط الوصفية، والترميز الدلالي، وسرعة الصفحة — كلها بنود في قائمة إمكانية الوصول **وقائمة السيو معاً**. السبب بسيط: الزاحف «مستخدم أعمى» يقرأ صفحتك عبر ترميزها. من يخدم أحدهما يخدم الآخر تلقائياً.' },

    { t: 'exercise',
      title: 'تمرين: تحسين صفحة مقال للسيو',
      brief: 'حوّل الصفحة التالية إلى صفحة مُحسّنة تقنياً بالكامل.',
      starter: { lang: 'html', title: 'قبل التحسين', code: `
<html>
<head>
  <title>مقال</title>
</head>
<body>
  <div>وصفة الكبسة</div>
  <img src="kabsa.jpg">
  <div>تحتاج ساعة و15 دقيقة وتكفي 6 أشخاص</div>
  <div>اقرأ المزيد <a href="/more">هنا</a></div>
</body>
</html>` },
      requirements: [
        'رأس كامل: لغة واتجاه وترميز وviewport وعنوان ووصف ورابط قانوني.',
        'هيكل دلالي: `header` و `main` و `article` و `footer`.',
        'عنوان `<h1>` واحد وعناوين فرعية متسلسلة.',
        'صورة بنص بديل وصفي وأبعاد و`fetchpriority="high"`.',
        'استبدال «هنا» بنص رابط وصفي.',
        'بيانات منظّمة `Recipe` بصيغة JSON-LD تطابق المعروض.',
        'وسوم Open Graph أساسية.'
      ],
      hints: [
        'صيغة المدة في schema.org هي ISO 8601: `PT1H15M`.',
        'البيانات المنظّمة يجب أن تطابق المحتوى المرئي.',
        'الصورة الرئيسية لا توضع عليها `loading="lazy"`.'
      ],
      solution: { lang: 'html', code: `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>وصفة الكبسة السعودية بالدجاج خطوة بخطوة | مطبخنا</title>
  <meta name="description"
        content="طريقة عمل الكبسة السعودية بالدجاج في ساعة و15 دقيقة، تكفي 6 أشخاص، بمكوّنات بسيطة وخطوات مصوّرة.">

  <link rel="canonical" href="https://example.com/recipes/kabsa">

  <meta property="og:type" content="article">
  <meta property="og:title" content="وصفة الكبسة السعودية بالدجاج">
  <meta property="og:description" content="ساعة و15 دقيقة وتكفي 6 أشخاص.">
  <meta property="og:image" content="https://example.com/images/kabsa.jpg">
  <meta property="og:url" content="https://example.com/recipes/kabsa">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": "الكبسة السعودية بالدجاج",
    "image": "https://example.com/images/kabsa.jpg",
    "totalTime": "PT1H15M",
    "recipeYield": "6 أشخاص",
    "inLanguage": "ar",
    "author": { "@type": "Person", "name": "أم عبدالله" }
  }
  </script>
</head>

<body>
  <header>
    <nav aria-label="التنقّل الرئيسي">
      <ul>
        <li><a href="/">الرئيسية</a></li>
        <li><a href="/recipes">الوصفات</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h1>الكبسة السعودية بالدجاج</h1>

      <img src="kabsa.jpg"
           alt="طبق كبسة بالدجاج مزيّن بالمكسّرات والزبيب على أرز بسمتي"
           width="1200" height="800" fetchpriority="high" decoding="async">

      <p>
        مدة التحضير الكلية ساعة و15 دقيقة، والكمية تكفي 6 أشخاص.
      </p>

      <h2>المكوّنات</h2>
      <ul>
        <li>دجاجة كاملة مقطّعة</li>
        <li>ثلاثة أكواب أرز بسمتي</li>
      </ul>

      <p>
        <a href="/recipes/kabsa-tips">اقرأ أسرار الشيف لكبسة مثالية</a>
      </p>
    </article>
  </main>

  <footer>
    <p>© 2026 مطبخنا</p>
  </footer>
</body>
</html>` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق بين منع الزحف في robots.txt و`noindex`؟', options: ['لا فرق', 'robots.txt يمنع الزحف وقد تُفهرس الصفحة رغم ذلك، و`noindex` يمنع الفهرسة', 'العكس', 'كلاهما يحذف الصفحة'], answer: 1,
        explain: 'إن منعت الزحف فلن يرى الزاحف وسم noindex أصلاً. لمنع الفهرسة اسمح بالزحف وضع noindex.' },
      { q: 'أي صيغة توصي بها جوجل للبيانات المنظّمة؟', options: ['Microdata', 'RDFa', 'JSON-LD', 'XML'], answer: 2,
        explain: 'JSON-LD منفصل عن الترميز فلا يعقّد HTML، وهو الصيغة الموصى بها رسمياً.' },
      { q: 'أي مؤشّر تعالجه مباشرة بتحديد أبعاد الصور؟', options: ['LCP', 'INP', 'CLS', 'TTFB'], answer: 2,
        explain: 'حجز المساحة مسبقاً يمنع قفز المحتوى، وهو ما يقيسه CLS.' },
      { q: 'ما `rel` المناسبة لرابط إعلاني مدفوع؟', options: ['`nofollow` فقط', '`sponsored`', '`ugc`', 'لا شيء'], answer: 1,
        explain: '`sponsored` تصف الرابط المدفوع صراحةً، وعدم وضعها مخالفة لإرشادات جوجل.' },
      { q: 'لماذا يخدم تحسين إمكانية الوصول السيو أيضاً؟', options: ['مصادفة', 'لأن الزاحف يقرأ الصفحة عبر ترميزها كمستخدم لا يرى', 'لأن جوجل تعطي نقاطاً للألوان', 'لا علاقة بينهما'], answer: 1,
        explain: 'النص البديل والعناوين والدلالة ونصوص الروابط هي المدخلات نفسها لكليهما.' }
    ]}
  ]
};
