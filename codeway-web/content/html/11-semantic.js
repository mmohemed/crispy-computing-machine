'use strict';

module.exports = {
  slug: '11-semantic',
  title: 'العناصر الدلالية وهيكل الصفحة',
  summary: 'استبدال بحر الـ div بعناصر تحمل معنى: header و nav و main و article و section و aside و footer.',
  duration: 50,
  level: 'متوسط',
  tags: ['الدلالة', 'الهيكلة'],
  objectives: [
    'تبني هيكل صفحة كاملاً بعناصر دلالية.',
    'تفرّق بين `<article>` و `<section>` و `<div>`.',
    'تعرف قاعدة العنصر `<main>` الواحد.',
    'تستخدم `<nav>` و `<aside>` و `<footer>` في مواضعها.',
    'تدرك علاقة العناصر الدلالية بأدوار ARIA.'
  ],
  quickRef: [
    { code: '<header>', desc: 'ترويسة الصفحة أو القسم' },
    { code: '<nav>', desc: 'مجموعة روابط تنقّل رئيسية' },
    { code: '<main>', desc: 'المحتوى الرئيسي — مرة واحدة فقط' },
    { code: '<article>', desc: 'محتوى مستقل بذاته' },
    { code: '<section>', desc: 'قسم موضوعي له عنوان' },
    { code: '<aside>', desc: 'محتوى جانبي مكمّل' },
    { code: '<footer>', desc: 'تذييل الصفحة أو القسم' }
  ],
  blocks: [
    { t: 'h2', text: 'مشكلة «حساء الـ div»' },
    { t: 'p', text: 'قبل HTML5 كان كل شيء `<div>`: `<div class="header">` و `<div class="nav">` و `<div class="footer">`. المشكلة أن `class` مجرّد نص لا يفهمه أحد سواك — المتصفح وقارئ الشاشة ومحرك البحث يرون صناديق متطابقة بلا معنى.' },
    { t: 'p', text: 'العناصر الدلالية حلّت هذا: اسم العنصر نفسه صار يحمل المعنى، فيتحوّل إلى **معلم تنقّل** (Landmark) يستطيع مستخدم قارئ الشاشة القفز إليه مباشرة.' },
    { t: 'compare', lang: 'html', bad: {
      code: '<div class="header">\n  <div class="nav">…</div>\n</div>\n<div class="main">\n  <div class="post">…</div>\n</div>\n<div class="footer">…</div>',
      why: 'ستة صناديق متطابقة. قارئ الشاشة لا يستطيع تمييز أيها الترويسة وأيها المحتوى.'
    }, good: {
      code: '<header>\n  <nav>…</nav>\n</header>\n<main>\n  <article>…</article>\n</main>\n<footer>…</footer>',
      why: 'كل عنصر يعلن دوره. المستخدم يقفز مباشرة إلى «المحتوى الرئيسي» بضغطة واحدة.'
    }},

    { t: 'h2', text: 'الهيكل النموذجي' },
    { t: 'code', lang: 'html', title: 'هيكل صفحة مدونة', code: `
<body>
  <header>
    <h1>مدونة المطوّر</h1>
    <nav aria-label="التنقّل الرئيسي">
      <ul>
        <li><a href="/">الرئيسية</a></li>
        <li><a href="/articles">المقالات</a></li>
        <li><a href="/about">من نحن</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>كيف تتعلّم HTML بفعالية؟</h2>
        <p>بقلم سارة — <time datetime="2026-03-10">10 مارس 2026</time></p>
      </header>

      <section>
        <h3>ابدأ بالأساسيات</h3>
        <p>…</p>
      </section>

      <section>
        <h3>طبّق فوراً</h3>
        <p>…</p>
      </section>

      <footer>
        <p>الوسوم: HTML، تعلّم</p>
      </footer>
    </article>

    <aside aria-label="مقالات ذات صلة">
      <h2>اقرأ أيضاً</h2>
      <ul>
        <li><a href="/css">مدخل إلى CSS</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>© 2026 مدونة المطوّر</p>
  </footer>
</body>` },
    { t: 'demo', title: 'الهيكل مرئياً', height: 400,
      css: 'body{padding:10px}header,nav,main,article,aside,footer,section{border:2px dashed;border-radius:10px;padding:10px;margin-bottom:8px;position:relative}header{border-color:#6366f1}nav{border-color:#0ea5e9}main{border-color:#10b981}article{border-color:#f59e0b}section{border-color:#8b5cf6}aside{border-color:#ec4899}footer{border-color:#64748b}b{font-size:.78em;color:#475569;display:block;margin-bottom:6px}',
      html: '<header><b>header</b><nav><b>nav</b>روابط التنقّل</nav></header><main><b>main</b><article><b>article</b><section><b>section</b>قسم أول</section><section><b>section</b>قسم ثانٍ</section></article><aside><b>aside</b>مقالات ذات صلة</aside></main><footer><b>footer</b>© 2026</footer>' },

    { t: 'h2', text: 'شرح كل عنصر' },

    { t: 'h3', text: '`<header>` و `<footer>`' },
    { t: 'p', text: 'ليسا للصفحة فقط! يمكن لكل `<article>` أو `<section>` أن يكون له `header` و `footer` خاصان به. الترويسة تحوي عادةً عنواناً وبيانات تعريفية، والتذييل يحوي معلومات ختامية كالكاتب والوسوم والحقوق.' },
    { t: 'note', text: '`<header>` أو `<footer>` يصبح **معلماً** (Landmark) فقط حين يكون ابناً مباشراً لـ `<body>`. أما داخل `<article>` فهو مجرّد تجميع.' },

    { t: 'h3', text: '`<nav>`' },
    { t: 'p', text: 'للمجموعات **الرئيسية** من روابط التنقّل: القائمة الرئيسية، مسار التنقّل (Breadcrumb)، ترقيم الصفحات، فهرس المقال. ليست كل مجموعة روابط `<nav>` — روابط الفوتر المتفرّقة لا تحتاجها.' },
    { t: 'tip', text: 'إن كان في صفحتك أكثر من `<nav>`، أعطِ كلاً منها `aria-label` مميّزة كي يفرّق بينها قارئ الشاشة: «التنقّل الرئيسي»، «مسار التنقّل»، «ترقيم الصفحات».' },

    { t: 'h3', text: '`<main>`' },
    { t: 'p', text: 'المحتوى الفريد للصفحة — ما يميّزها عن بقية صفحات الموقع. القواعد صارمة:' },
    { t: 'ul', items: [
      '**عنصر `<main>` واحد ظاهر لكل صفحة**.',
      'لا يوضع داخل `<article>` أو `<section>` أو `<header>` أو `<footer>` أو `<nav>`.',
      'لا يحوي ما يتكرّر في كل صفحة كالشعار والقائمة الرئيسية والحقوق.'
    ]},
    { t: 'tip', text: 'أضف رابط تخطٍّ في أعلى الصفحة: `<a class="skip-link" href="#main">تخطّي إلى المحتوى</a>` — يوفّر على مستخدم لوحة المفاتيح عشرات الضغطات في كل صفحة.' },

    { t: 'h3', text: '`<article>` مقابل `<section>`' },
    { t: 'p', text: 'هذا أكثر سؤال يتكرّر. الاختبار العملي:' },
    { t: 'table', head: ['السؤال', 'الجواب يعني'], rows: [
      ['هل يبقى المحتوى مفهوماً لو اقتُطع ونُشر وحده (في قارئ RSS مثلاً)؟', 'نعم ← `<article>`'],
      ['هل هو جزء موضوعي من كلٍّ أكبر وله عنوان؟', 'نعم ← `<section>`'],
      ['هل أحتاجه فقط للتنسيق بـ CSS؟', 'نعم ← `<div>`']
    ]},
    { t: 'p', text: 'أمثلة على `<article>`: تدوينة، خبر، تعليق مستخدم، بطاقة منتج، تغريدة. وأمثلة على `<section>`: «آخر الأخبار»، «آراء العملاء»، فصل داخل مقال.' },
    { t: 'warn', text: 'قاعدة مهمة: **كل `<section>` يجب أن يحمل عنواناً** (`h2`–`h6`). إن لم يكن للقسم عنوان طبيعي فهو غالباً `<div>` لا `<section>`.' },
    { t: 'code', lang: 'html', title: 'مقالات داخل قسم', code: `
<section>
  <h2>أحدث المقالات</h2>

  <article>
    <h3>مدخل إلى Flexbox</h3>
    <p>…</p>
  </article>

  <article>
    <h3>فهم Grid في 10 دقائق</h3>
    <p>…</p>
  </article>
</section>` },

    { t: 'h3', text: '`<aside>`' },
    { t: 'p', text: 'محتوى **مكمّل** مرتبط بما حوله لكنه ليس جوهرياً: شريط جانبي، إعلان، تعريف بالكاتب، مقالات ذات صلة، تنويه جانبي داخل مقال. إن حُذف لا يفقد المحتوى الرئيسي معناه.' },

    { t: 'h2', text: 'عناصر دلالية أخرى مفيدة' },
    { t: 'code', lang: 'html', code: `
<figure>
  <img src="chart.png" alt="…">
  <figcaption>الشكل 2: النمو السنوي</figcaption>
</figure>

<details>
  <summary>ما هي مدة الدورة؟</summary>
  <p>ست ساعات موزّعة على عشرة دروس.</p>
</details>

<mark>نص مميّز</mark>
<time datetime="2026-05-01">أول مايو</time>
<address>
  للتواصل: <a href="mailto:hi@example.com">hi@example.com</a>
</address>` },
    { t: 'demo', title: 'details/summary — أكورديون بلا جافاسكربت', height: 220,
      css: 'details{border:1px solid #e2e8f0;border-radius:10px;padding:10px 14px;margin-bottom:8px;background:#f8fafc}summary{cursor:pointer;font-weight:700;color:#4f46e5}details[open] summary{margin-bottom:8px}',
      html: '<details><summary>ما هي مدة الدورة؟</summary><p>ست ساعات موزّعة على عشرة دروس.</p></details><details><summary>هل توجد شهادة؟</summary><p>نعم، بعد إكمال جميع الدروس والاختبارات.</p></details>' },
    { t: 'note', text: '`<details>` يعطيك عنصر طيّ وفتح كاملاً بلا سطر جافاسكربت واحد، ومتاحاً للوحة المفاتيح وقارئات الشاشة تلقائياً.' },

    { t: 'h2', text: 'متى يبقى `<div>` هو الصواب؟' },
    { t: 'p', text: 'حين لا يوجد عنصر دلالي مناسب وتحتاج غلافاً لغرض تنسيقي بحت — مثل حاوية تخطيط، أو صندوق تحتاجه لتطبيق `display: grid`. لا حرج في `<div>` حين يكون دوره تنسيقياً فعلاً؛ الخطأ هو استخدامه بدلاً من عنصر دلالي موجود.' },

    { t: 'h2', text: 'العلاقة بـ ARIA' },
    { t: 'p', text: 'كل عنصر دلالي يحمل **دوراً ضمنياً** (Implicit role) لا تحتاج لكتابته:' },
    { t: 'table', head: ['العنصر', 'الدور الضمني'], rows: [
      ['`<header>` (ابن body)', '`banner`'],
      ['`<nav>`', '`navigation`'],
      ['`<main>`', '`main`'],
      ['`<aside>`', '`complementary`'],
      ['`<footer>` (ابن body)', '`contentinfo`'],
      ['`<article>`', '`article`'],
      ['`<section>` (بعنوان)', '`region`']
    ]},
    { t: 'tip', text: 'القاعدة الأولى في ARIA: «لا تستخدم ARIA إن كان هناك عنصر HTML يؤدي الغرض». كتابة `<div role="navigation">` أسوأ من كتابة `<nav>`.' },

    { t: 'exercise',
      title: 'تمرين: إعادة بناء صفحة بعناصر دلالية',
      brief: 'حوّل الكود التالي المليء بـ div إلى هيكل دلالي سليم دون تغيير المحتوى.',
      starter: { lang: 'html', title: 'الكود قبل التحويل', code: `
<div class="top">
  <div class="logo">متجر التقنية</div>
  <div class="menu">
    <div><a href="/">الرئيسية</a></div>
    <div><a href="/products">المنتجات</a></div>
  </div>
</div>

<div class="content">
  <div class="product">
    <div class="title">سماعة لاسلكية</div>
    <div class="price">299 ريالاً</div>
    <div class="desc">وصف المنتج…</div>
    <div class="meta">أُضيف في 2026-02-01</div>
  </div>
  <div class="related">
    <div class="t">منتجات مشابهة</div>
    <div><a href="#">سماعة سلكية</a></div>
  </div>
</div>

<div class="bottom">جميع الحقوق محفوظة 2026</div>` },
      requirements: [
        'استخدم `header` و `nav` و `main` و `article` و `aside` و `footer`.',
        'شريط التنقّل قائمة `<ul>` بداخل `<nav>` مع `aria-label`.',
        'بطاقة المنتج `<article>` لها `header` و `footer` داخليان.',
        'التاريخ بعنصر `<time>` مع `datetime` صحيحة.',
        'العناوين بمستويات متسلسلة سليمة.'
      ],
      hints: [
        'بطاقة المنتج مفهومة وحدها لو نُشرت منفردة ← `article`.',
        '«منتجات مشابهة» محتوى مكمّل ← `aside`.',
        'كل `section` يحتاج عنواناً — إن لم يوجد فربما لا تحتاج `section` أصلاً.'
      ],
      solution: { lang: 'html', code: `
<header>
  <h1>متجر التقنية</h1>
  <nav aria-label="التنقّل الرئيسي">
    <ul>
      <li><a href="/">الرئيسية</a></li>
      <li><a href="/products">المنتجات</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <header>
      <h2>سماعة لاسلكية</h2>
      <p><strong>299 ريالاً</strong></p>
    </header>

    <p>وصف المنتج…</p>

    <footer>
      <p>أُضيف في <time datetime="2026-02-01">1 فبراير 2026</time></p>
    </footer>
  </article>

  <aside aria-label="منتجات مشابهة">
    <h2>منتجات مشابهة</h2>
    <ul>
      <li><a href="#">سماعة سلكية</a></li>
    </ul>
  </aside>
</main>

<footer>
  <p>جميع الحقوق محفوظة 2026</p>
</footer>` } },

    { t: 'quiz', items: [
      { q: 'كم عنصر `<main>` ظاهر يُسمح به في الصفحة؟', options: ['واحد', 'اثنان', 'ثلاثة', 'غير محدود'], answer: 0,
        explain: '`<main>` يمثّل المحتوى الرئيسي الفريد للصفحة، فلا معنى لتعدّده.' },
      { q: 'ما الاختبار الأدق للتفريق بين `article` و `section`؟', options: ['الحجم', 'هل يبقى المحتوى مفهوماً لو نُشر وحده؟', 'عدد الفقرات', 'وجود صورة'], answer: 1,
        explain: 'إن كان مستقلاً بذاته وقابلاً لإعادة النشر منفرداً فهو `article`؛ وإلا فهو `section` أو `div`.' },
      { q: 'ما الذي يجب أن يحتويه كل `<section>`؟', options: ['صورة', 'عنواناً', 'رابطاً', 'زراً'], answer: 1,
        explain: 'القسم بلا عنوان لا يمكن الإشارة إليه في مخطّط الصفحة، وغالباً يكون `div` تنسيقياً.' },
      { q: 'أي عبارة صحيحة عن `<aside>`؟', options: ['يجب أن يكون على يمين الصفحة', 'محتوى مكمّل يمكن حذفه دون فقد المعنى الرئيسي', 'يستخدم للتنقّل فقط', 'لا يُسمح به داخل article'], answer: 1,
        explain: 'الدلالة لا الموضع: محتوى مرتبط لكنه ليس جوهرياً. موضعه البصري شأن CSS.' },
      { q: 'ما القاعدة الأولى في ARIA؟', options: ['استخدمها في كل عنصر', 'لا تستخدم ARIA إن وُجد عنصر HTML يؤدي الغرض', 'استخدمها مع div فقط', 'ARIA تغني عن الدلالة'], answer: 1,
        explain: 'العناصر الدلالية تحمل أدوارها ضمناً، وARIA لسدّ الفجوات لا لتكرار ما هو موجود.' }
    ]}
  ]
};
