'use strict';

module.exports = {
  slug: '20-project',
  title: 'مشروع شامل: موقع شخصي كامل',
  summary: 'تطبيق كل ما تعلّمته في مشروع واحد: صفحة شخصية بأربعة أقسام وصفحة تواصل، بترميز دلالي متاح ومحسَّن.',
  duration: 120,
  level: 'احترافي',
  tags: ['مشروع', 'تطبيق'],
  objectives: [
    'تخطّط بنية موقع كامل قبل كتابة أي كود.',
    'تدمج كل ما درسته: الدلالة، النماذج، الوسائط، الوصول، والسيو.',
    'تنظّم ملفات المشروع بشكل احترافي.',
    'تدقّق عملك بقائمة مراجعة قبل النشر.',
    'تنشر موقعك على الإنترنت مجاناً.'
  ],
  quickRef: [
    { code: 'index.html', desc: 'الصفحة الرئيسية' },
    { code: 'assets/', desc: 'الموارد الثابتة' },
    { code: 'validator.w3.org', desc: 'تدقيق الترميز' },
    { code: 'Lighthouse', desc: 'تدقيق الأداء والوصول' },
    { code: 'GitHub Pages', desc: 'استضافة مجانية' }
  ],
  blocks: [
    { t: 'h2', text: 'المطلوب' },
    { t: 'p', text: 'هذا الدرس ليس شرحاً بل **ورشة عمل**. ستبني موقعاً شخصياً حقيقياً تضعه في معرض أعمالك. اقرأ المواصفات كاملة أولاً، خطّط على ورقة، ثم ابدأ الكتابة.' },
    { t: 'note', title: 'قاعدة الورشة', text: 'لا تنظر إلى الحل النهائي قبل أن تنهي محاولتك الكاملة. المشروع الذي تنسخه لا يعلّمك شيئاً؛ المشروع الذي تتعثّر فيه ثم تحلّه يبقى معك سنوات.' },

    { t: 'h2', text: 'المواصفات' },
    { t: 'h3', text: 'الملفات المطلوبة' },
    { t: 'code', lang: 'text', noCopy: true, code: `
portfolio/
├── index.html          الصفحة الرئيسية
├── contact.html        صفحة التواصل
├── assets/
│   ├── css/style.css   (ملف فارغ الآن — سنملؤه في مسار CSS)
│   ├── js/app.js       (ملف فارغ الآن)
│   └── images/
├── robots.txt
└── sitemap.xml` },

    { t: 'h3', text: 'الصفحة الرئيسية: خمسة أقسام' },
    { t: 'ol', items: [
      '**الترويسة**: شعار/اسمك + شريط تنقّل بقائمة روابط + رابط تخطٍّ للمحتوى.',
      '**التعريف (Hero)**: عنوان `h1` باسمك ومهنتك، فقرة تعريفية، صورتك، وزرّا دعوة لإجراء.',
      '**المهارات**: قائمة مهاراتك مع مستوى إتقان كل منها بعنصر `<meter>`.',
      '**المشاريع**: ثلاث بطاقات `<article>` لكل منها صورة وعنوان ووصف وتقنيات ورابط.',
      '**الخبرات**: قائمة وصف `<dl>` أو جدول زمني بالسنوات والمناصب.',
      '**التذييل**: روابط تواصل اجتماعي وحقوق.'
    ]},

    { t: 'h3', text: 'صفحة التواصل' },
    { t: 'ul', items: [
      'نموذج فيه: الاسم، البريد، الجوال، الموضوع (قائمة)، الرسالة، مربّع موافقة.',
      'كل حقل له `<label>` مرتبطة و`name` و`autocomplete` مناسبة.',
      'تحقّق مدمج كامل: `required` و `pattern` و `minlength`.',
      'الحقول مجمّعة في `<fieldset>` مع `<legend>`.',
      'خريطة مضمّنة بـ `<iframe>` مع `title`.',
      'بيانات الاتصال داخل `<address>`.'
    ]},

    { t: 'h3', text: 'متطلّبات تقنية إلزامية' },
    { t: 'table', head: ['المجال', 'المطلوب'], rows: [
      ['الهيكل', 'DOCTYPE، lang، dir، charset، viewport في كل صفحة'],
      ['الدلالة', '`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`'],
      ['العناوين', '`h1` واحد لكل صفحة وتسلسل بلا قفز'],
      ['الصور', '`alt` مناسب + `width`/`height` + `loading="lazy"` لغير الأولى'],
      ['الروابط', 'نصوص وصفية، والخارجية بـ `target="_blank" rel="noopener"`'],
      ['النماذج', 'تسميات مرتبطة وتحقّق مدمج'],
      ['الوصول', 'رابط تخطٍّ، `aria-label` للأزرار الأيقونية، ترتيب تنقّل سليم'],
      ['السيو', 'عنوان ووصف فريدان، Open Graph، canonical، JSON-LD من نوع `Person`'],
      ['الأداء', 'أبعاد محدّدة، `defer`، `preconnect` عند الحاجة']
    ]},

    { t: 'h2', text: 'خطة العمل' },
    { t: 'steps', items: [
      '**خطّط على ورقة**: ارسم مخطّطاً تقريبياً لكل صفحة وحدّد الأقسام قبل أي كود.',
      '**أنشئ الهيكل**: المجلدات والملفات الفارغة أولاً.',
      '**اكتب `<head>` كاملاً** لكل صفحة قبل المحتوى.',
      '**ابنِ قسماً واحداً في كل مرة** واختبره في المتصفح قبل الانتقال للتالي.',
      '**اربط الصفحتين** ببعضهما وتأكّد أن كل رابط يعمل.',
      '**دقّق**: مرّر الصفحتين على مدقّق W3C وأصلح كل خطأ.',
      '**اختبر لوحة المفاتيح**: تنقّل بـ Tab فقط في الموقع كله.',
      '**شغّل Lighthouse** واستهدف 90+ في الوصول والسيو.',
      '**انشر** على GitHub Pages.'
    ]},

    { t: 'h2', text: 'مقتطف مرجعي: هيكل الصفحة الرئيسية' },
    { t: 'p', text: 'هذا هيكل عام يوجّهك دون أن يحلّ المشروع مكانك — املأه بمحتواك أنت.' },
    { t: 'code', lang: 'html', title: 'الهيكل العام', code: `
<body>
  <a class="skip-link" href="#main">تخطّي إلى المحتوى</a>

  <header>
    <a href="index.html" class="logo">اسمك</a>
    <nav aria-label="التنقّل الرئيسي">
      <ul>
        <li><a href="#about" aria-current="page">عني</a></li>
        <li><a href="#skills">المهارات</a></li>
        <li><a href="#projects">المشاريع</a></li>
        <li><a href="contact.html">تواصل</a></li>
      </ul>
    </nav>
  </header>

  <main id="main">
    <section id="about">
      <h1>…</h1>
    </section>

    <section id="skills">
      <h2>المهارات</h2>
    </section>

    <section id="projects">
      <h2>المشاريع</h2>
      <article> … </article>
    </section>

    <section id="experience">
      <h2>الخبرات</h2>
    </section>
  </main>

  <footer>
    <nav aria-label="روابط التواصل"> … </nav>
    <p>© <time datetime="2026">2026</time> اسمك</p>
  </footer>
</body>` },

    { t: 'h2', text: 'أفكار للتوسّع' },
    { t: 'ul', items: [
      'أضف قسم أسئلة شائعة بـ `<details name="faq">` كأكورديون.',
      'أضف `<dialog>` يعرض تفاصيل كل مشروع عند النقر.',
      'أضف شهادات عملاء داخل `<blockquote>` مع `<cite>`.',
      'أضف نسخة إنجليزية واربطها بـ `hreflang`.',
      'أضف `<progress>` يوضّح نسبة اكتمال ملفك الشخصي.'
    ]},

    { t: 'h2', text: 'النشر على الإنترنت مجاناً' },
    { t: 'code', lang: 'bash', title: 'عبر GitHub Pages', code: `
# 1) أنشئ مستودعاً جديداً على GitHub باسم portfolio

# 2) في مجلد مشروعك
git init
git add .
git commit -m "الإصدار الأول من الموقع الشخصي"
git branch -M main
git remote add origin https://github.com/USERNAME/portfolio.git
git push -u origin main

# 3) من صفحة المستودع:
#    Settings ← Pages ← Source: main ← Save
#    سيصبح موقعك على:
#    https://USERNAME.github.io/portfolio/` },
    { t: 'tip', text: 'بدائل أخرى بالسهولة نفسها: **Netlify** و**Vercel** — تسحب من مستودعك مباشرة وتعيد النشر تلقائياً مع كل تعديل، وتعطيك شهادة HTTPS مجاناً.' },

    { t: 'exercise',
      title: 'المشروع الكامل',
      brief: 'نفّذ المواصفات أعلاه بالكامل. الحل المرفق هيكل مرجعي مختصر — لا تنظر إليه قبل إنهاء محاولتك.',
      requirements: [
        'الصفحتان كاملتان بكل الأقسام المطلوبة.',
        'صفر أخطاء في مدقّق W3C.',
        'الموقع قابل للتشغيل بلوحة المفاتيح وحدها.',
        'Lighthouse: 90+ في Accessibility و SEO.',
        'الموقع منشور على رابط حقيقي.'
      ],
      hints: [
        'ابدأ بالمحتوى الحقيقي لا بـ «نص تجريبي» — المحتوى الحقيقي يكشف مشاكل التصميم مبكراً.',
        'اختبر بعد كل قسم لا في النهاية.',
        'إن تعثّرت، عد إلى درس الموضوع بعينه لا إلى البداية.'
      ],
      solution: { lang: 'html', code: `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>سارة عبدالله — مطوّرة واجهات أمامية</title>
  <meta name="description"
        content="الموقع الشخصي لسارة عبدالله، مطوّرة واجهات أمامية: المهارات والمشاريع وطرق التواصل.">
  <link rel="canonical" href="https://sara.example.com/">

  <meta property="og:type" content="profile">
  <meta property="og:title" content="سارة عبدالله — مطوّرة واجهات أمامية">
  <meta property="og:description" content="مشاريع ومهارات في تطوير الويب.">
  <meta property="og:image" content="https://sara.example.com/assets/images/og.png">
  <meta property="og:url" content="https://sara.example.com/">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "سارة عبدالله",
    "jobTitle": "مطوّرة واجهات أمامية",
    "url": "https://sara.example.com/",
    "sameAs": ["https://github.com/sara", "https://linkedin.com/in/sara"]
  }
  </script>

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/css/style.css">
  <script src="assets/js/app.js" defer></script>
</head>

<body>
  <a class="skip-link" href="#main">تخطّي إلى المحتوى الرئيسي</a>

  <header>
    <a href="index.html" class="logo">سارة عبدالله</a>
    <nav aria-label="التنقّل الرئيسي">
      <ul>
        <li><a href="#about" aria-current="page">عني</a></li>
        <li><a href="#skills">المهارات</a></li>
        <li><a href="#projects">المشاريع</a></li>
        <li><a href="#experience">الخبرات</a></li>
        <li><a href="contact.html">تواصل</a></li>
      </ul>
    </nav>
  </header>

  <main id="main">
    <section id="about">
      <h1>سارة عبدالله — مطوّرة واجهات أمامية</h1>
      <p>
        أبني واجهات سريعة ومتاحة للجميع منذ ثلاث سنوات، وأهتم تحديداً
        بتجربة المستخدم العربي وبالأداء على الأجهزة الضعيفة.
      </p>
      <img src="assets/images/sara.jpg"
           alt="سارة عبدالله تعمل على حاسوبها المحمول"
           width="320" height="320" fetchpriority="high">
      <p>
        <a class="btn" href="contact.html">تواصل معي</a>
        <a class="btn" href="assets/cv.pdf" download>تحميل السيرة الذاتية (PDF)</a>
      </p>
    </section>

    <section id="skills">
      <h2>المهارات</h2>
      <ul class="skills">
        <li>
          <label for="s-html">HTML</label>
          <meter id="s-html" value="0.95" optimum="1">95٪</meter>
        </li>
        <li>
          <label for="s-css">CSS</label>
          <meter id="s-css" value="0.9" optimum="1">90٪</meter>
        </li>
        <li>
          <label for="s-js">JavaScript</label>
          <meter id="s-js" value="0.8" optimum="1">80٪</meter>
        </li>
      </ul>
    </section>

    <section id="projects">
      <h2>المشاريع</h2>

      <article>
        <h3>متجر «رفوف»</h3>
        <img src="assets/images/p1.jpg"
             alt="لقطة من صفحة المنتجات في متجر رفوف"
             width="600" height="400" loading="lazy">
        <p>متجر إلكتروني لبيع الكتب المستعملة بواجهة عربية متجاوبة.</p>
        <ul>
          <li>HTML</li><li>CSS Grid</li><li>JavaScript</li>
        </ul>
        <a href="https://github.com/sara/rufuf" target="_blank" rel="noopener">
          كود مشروع رفوف على GitHub
        </a>
      </article>

      <article>
        <h3>لوحة «نبض»</h3>
        <img src="assets/images/p2.jpg"
             alt="لوحة تحكّم تعرض رسوماً بيانية لمؤشرات الأداء"
             width="600" height="400" loading="lazy">
        <p>لوحة تحكّم لعرض مؤشرات الأداء مع دعم الوضع الليلي.</p>
        <ul><li>HTML</li><li>SVG</li><li>JavaScript</li></ul>
        <a href="https://nabd.example.com" target="_blank" rel="noopener">
          تجربة لوحة نبض مباشرة
        </a>
      </article>

      <article>
        <h3>موقع «حرف»</h3>
        <img src="assets/images/p3.jpg"
             alt="صفحة مقال في مدونة حرف بخط عربي واضح"
             width="600" height="400" loading="lazy">
        <p>مدونة عربية تركّز على قابلية القراءة والتصميم الطباعي.</p>
        <ul><li>HTML</li><li>CSS</li></ul>
        <a href="https://harf.example.com" target="_blank" rel="noopener">
          زيارة مدونة حرف
        </a>
      </article>
    </section>

    <section id="experience">
      <h2>الخبرات</h2>
      <dl>
        <dt><time datetime="2024">2024</time> — الآن</dt>
        <dd>مطوّرة واجهات أمامية في شركة «مدى» — بناء وصيانة منصة تعليمية.</dd>

        <dt><time datetime="2023">2023</time> — <time datetime="2024">2024</time></dt>
        <dd>مطوّرة مستقلة — تنفيذ مواقع تعريفية لعملاء في السعودية والأردن.</dd>
      </dl>
    </section>
  </main>

  <footer>
    <nav aria-label="روابط التواصل">
      <ul>
        <li><a href="https://github.com/sara" target="_blank" rel="noopener">GitHub</a></li>
        <li><a href="https://linkedin.com/in/sara" target="_blank" rel="noopener">LinkedIn</a></li>
        <li><a href="mailto:sara@example.com">البريد الإلكتروني</a></li>
      </ul>
    </nav>
    <p>© <time datetime="2026">2026</time> سارة عبدالله. جميع الحقوق محفوظة.</p>
  </footer>
</body>
</html>` },
      solutionNote: 'صفحة `contact.html` تُبنى بنفس الترويسة والتذييل، مع نموذج التواصل الكامل والخريطة المضمّنة وعنصر `<address>`.'
    },

    { t: 'h2', text: 'ماذا بعد؟' },
    { t: 'p', text: 'أنهيت الآن مسار HTML كاملاً: 20 درساً غطّت البنية والنصوص والوسائط والنماذج والدلالة وإمكانية الوصول والسيو والممارسات المهنية. موقعك الآن **صحيح البنية لكنه بلا تصميم**.' },
    { t: 'p', text: 'الخطوة التالية طبيعية: **مسار CSS**. ستأخذ هذا الموقع نفسه وتحوّله إلى واجهة احترافية متجاوبة بوضع ليلي — وستشكر نفسك على كل عنصر دلالي كتبته هنا، لأن التنسيق يصبح أسهل بكثير فوق بنية سليمة.' },
    { t: 'tip', text: 'احتفظ بهذا المشروع وطوّره مع كل مسار جديد: CSS يعطيه المظهر، وJavaScript يعطيه الحياة. في النهاية سيكون لديك مشروع واحد قوي يوثّق رحلتك كلها.' },

    { t: 'quiz', items: [
      { q: 'ما أول خطوة قبل كتابة أي كود في مشروع جديد؟', options: ['اختيار الألوان', 'تخطيط بنية الصفحات والأقسام', 'تثبيت المكتبات', 'شراء نطاق'], answer: 1,
        explain: 'التخطيط يوفّر إعادة كتابة كبيرة لاحقاً؛ البنية تسبق المظهر دائماً.' },
      { q: 'أي عنصر تستخدمه لعرض مستوى إتقان مهارة من 100٪؟', options: ['`<progress>`', '`<meter>`', '`<output>`', '`<data>`'], answer: 1,
        explain: '`meter` لقياس ضمن نطاق معروف؛ `progress` لمهمة تتقدّم نحو الاكتمال.' },
      { q: 'ما الحد الأدنى المستهدف في Lighthouse لإمكانية الوصول والسيو؟', options: ['50', '70', '90', '100 إلزامياً'], answer: 2,
        explain: '90+ هدف عملي واقعي يعني أن الأساسيات كلها سليمة.' },
      { q: 'لماذا نضع رابط التخطّي في أعلى الصفحة؟', options: ['لتحسين السيو', 'ليتجاوز مستخدم لوحة المفاتيح روابط القائمة المتكرّرة في كل صفحة', 'لتسريع التحميل', 'لتنسيق الترويسة'], answer: 1,
        explain: 'بدونه يمرّ المستخدم على كل رابط في القائمة في كل صفحة قبل بلوغ المحتوى.' },
      { q: 'ما القيمة الحقيقية لهذا المشروع؟', options: ['أنه سريع الإنجاز', 'أنه يدمج كل المهارات في سياق واحد ويصبح جزءاً من معرض أعمالك', 'أنه يغني عن بقية المسارات', 'أنه يعمل بلا CSS'], answer: 1,
        explain: 'المشاريع المتكاملة هي ما يثبّت المهارة وما يراه أصحاب العمل فعلاً.' }
    ]}
  ]
};
