'use strict';

module.exports = {
  slug: '10-project',
  title: 'مشروع: صفحة هبوط متكاملة',
  summary: 'بناء صفحة هبوط احترافية متجاوبة بالوضع الليلي، تطبّق كل ما تعلّمته في المسار.',
  duration: 120,
  level: 'احترافي',
  tags: ['مشروع', 'تطبيق'],
  objectives: [
    'تخطّط صفحة هبوط بأقسامها المعتادة.',
    'تدمج كل أدوات Tailwind في مشروع واحد.',
    'تبني واجهة متجاوبة تماماً وبوضع ليلي.',
    'تحقّق معايير إمكانية الوصول والأداء.',
    'تنشر المشروع على الإنترنت.'
  ],
  quickRef: [
    { code: 'الترويسة', desc: 'شعار + قائمة + تبديل الثيم' },
    { code: 'البطل', desc: 'عنوان + وصف + دعوة لإجراء' },
    { code: 'المميزات', desc: 'شبكة بطاقات بأيقونات' },
    { code: 'الأسعار', desc: 'ثلاث باقات مع تمييز الأوسط' },
    { code: 'الأسئلة', desc: 'details/summary' },
    { code: 'الفوتر', desc: 'روابط + حقوق' }
  ],
  blocks: [
    { t: 'h2', text: 'ما ستبنيه' },
    { t: 'p', text: 'صفحة هبوط لمنتج تقني اسمه **نَسَق**: منصة إدارة مشاريع عربية. صفحة واحدة كاملة تعرض كل ما يجيده مطوّر واجهات.' },
    { t: 'note', title: 'قاعدة الورشة', text: 'اقرأ المواصفات كاملة، خطّط الأقسام على ورقة، ثم ابنِ قسماً قسماً واختبره على ثلاثة أحجام قبل الانتقال. لا تنظر للحل قبل إنهاء محاولتك.' },

    { t: 'h2', text: 'الأقسام المطلوبة' },
    { t: 'table', head: ['القسم', 'المحتوى', 'التحدّي التقني'], rows: [
      ['**الترويسة**', 'شعار + قائمة + زر ثيم + زر تسجيل', 'لاصقة بضبابية، قائمة جوال'],
      ['**البطل**', 'شارة + عنوان + وصف + زرّان + صورة', 'شبكة تتحوّل، عنوان متدرّج الحجم'],
      ['**الشعارات**', 'شعارات عملاء', 'شبكة متجاوبة بشفافية'],
      ['**المميزات**', 'ستّ بطاقات بأيقونات', 'شبكة 1→2→3، تأثير group'],
      ['**كيف يعمل**', 'ثلاث خطوات مرقّمة', 'خطّ رابط بين الخطوات'],
      ['**الأسعار**', 'ثلاث باقات', 'تمييز الباقة الوسطى بالحجم واللون'],
      ['**آراء العملاء**', 'ثلاث شهادات', 'اقتباس + صورة + تقييم نجوم'],
      ['**الأسئلة**', 'خمسة أسئلة', '`details` مع دوران السهم'],
      ['**دعوة أخيرة**', 'عنوان + زر', 'خلفية متدرّجة'],
      ['**الفوتر**', 'أربعة أعمدة + حقوق', 'شبكة متجاوبة']
    ]},

    { t: 'h2', text: 'المتطلّبات التقنية' },
    { t: 'h3', text: 'التصميم' },
    { t: 'ul', items: [
      'لوحة ألوان مخصّصة في `@theme` (لا `blue` الافتراضي).',
      'خط عربي محمّل بثلاثة أوزان.',
      'وضع ليلي كامل يعمل تلقائياً ويدوياً مع حفظ التفضيل.',
      'نظام مسافات متّسق — لا قيم عشوائية إلا بمبرّر.'
    ]},
    { t: 'h3', text: 'التجاوب' },
    { t: 'ul', items: [
      'يعمل بامتياز من 375 بكسل إلى 1920.',
      'لا تمرير أفقي على أي حجم.',
      'قائمة جوال تعمل (يمكن بـ `details` بلا جافاسكربت).',
      'أحجام الخطوط متدرّجة عبر نقاط التوقف.'
    ]},
    { t: 'h3', text: 'إمكانية الوصول' },
    { t: 'ul', items: [
      'رابط تخطٍّ إلى المحتوى.',
      '`focus-visible` واضح على كل عنصر تفاعلي.',
      'تباين ألوان يحقّق المستوى AA.',
      'كل الأيقونات الزخرفية بـ `aria-hidden`.',
      'كل الحركات محمية بـ `motion-safe`/`motion-reduce`.',
      'ترتيب عناوين منطقي: `h1` واحد ثم `h2` للأقسام.'
    ]},

    { t: 'h2', text: 'نقطة الانطلاق' },
    { t: 'code', lang: 'css', title: 'src/style.css', code: `
@import "tailwindcss";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  --color-brand-50:  #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-300: #a5b4fc;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --color-brand-700: #4338ca;
  --color-brand-900: #312e81;

  --color-surface: #ffffff;
  --color-canvas:  #f8fafc;
  --color-ink:     #0f172a;
  --color-muted:   #64748b;
  --color-line:    #e2e8f0;

  --font-sans: 'Cairo', 'Segoe UI', sans-serif;

  --animate-fade-up: fade-up .6s ease-out both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@layer base {
  [data-theme='dark'] {
    --color-surface: #111a2e;
    --color-canvas:  #0a0f1e;
    --color-ink:     #e8edf9;
    --color-muted:   #a9b6d3;
    --color-line:    #22304f;
  }

  body {
    @apply bg-canvas font-sans text-ink antialiased;
    line-height: 1.9;
  }

  h1, h2, h3 { line-height: 1.3; }

  :focus-visible {
    @apply outline-2 outline-offset-2 outline-brand-500;
  }
}

@utility container-page {
  margin-inline: auto;
  max-width: 80rem;
  padding-inline: --spacing(4);
}` },
    { t: 'code', lang: 'html', title: 'الهيكل العام', code: `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>نَسَق — إدارة مشاريعك بالعربية</title>
  <meta name="description" content="منصة عربية لإدارة المشاريع والمهام مع فريقك.">
  <link rel="stylesheet" href="/dist/style.css">
</head>
<body>
  <a href="#main" class="sr-only focus:not-sr-only …">تخطّي إلى المحتوى</a>

  <header>…</header>

  <main id="main">
    <section id="hero">…</section>
    <section id="logos">…</section>
    <section id="features">…</section>
    <section id="how">…</section>
    <section id="pricing">…</section>
    <section id="testimonials">…</section>
    <section id="faq">…</section>
    <section id="cta">…</section>
  </main>

  <footer>…</footer>

  <script src="/src/theme.js"></script>
</body>
</html>` },
    { t: 'code', lang: 'js', title: 'src/theme.js', code: `
(function () {
  const KEY = 'theme';

  // تطبيق التفضيل المحفوظ قبل الرسم
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) document.documentElement.dataset.theme = saved;
  } catch (e) {}

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-theme-toggle]')) return;

    const isDark = document.documentElement.dataset.theme === 'dark'
      || (!document.documentElement.dataset.theme
          && matchMedia('(prefers-color-scheme: dark)').matches);

    const next = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;

    try { localStorage.setItem(KEY, next); } catch (e) {}
  });
})();` },

    { t: 'h2', text: 'مقتطف مرجعي: قسم الأسعار' },
    { t: 'code', lang: 'html', code: `
<section id="pricing" class="py-20">
  <div class="container-page">

    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-extrabold sm:text-4xl">أسعار بسيطة وواضحة</h2>
      <p class="mt-4 text-muted">ابدأ مجاناً وارتقِ حين تحتاج.</p>
    </div>

    <div class="mt-12 grid gap-6 md:grid-cols-3 md:items-center">

      <!-- المجانية -->
      <div class="rounded-2xl border border-line bg-surface p-8">
        <h3 class="text-lg font-bold">المجانية</h3>
        <p class="mt-4 text-4xl font-extrabold">0 <span class="text-base font-normal text-muted">ر.س</span></p>
        <ul class="mt-6 space-y-3 text-muted">
          <li class="flex gap-2"><span class="text-emerald-500" aria-hidden="true">✓</span> 3 مشاريع</li>
          <li class="flex gap-2"><span class="text-emerald-500" aria-hidden="true">✓</span> عضوان</li>
        </ul>
        <button class="mt-8 w-full rounded-lg border-2 border-brand-500 py-3 font-bold text-brand-600">
          ابدأ مجاناً
        </button>
      </div>

      <!-- الاحترافية — مميّزة -->
      <div class="relative rounded-2xl border-2 border-brand-500 bg-surface p-8 shadow-xl shadow-brand-500/20 md:scale-105">
        <span class="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1 text-sm font-bold text-white">
          الأكثر شيوعاً
        </span>
        <h3 class="text-lg font-bold">الاحترافية</h3>
        <p class="mt-4 text-4xl font-extrabold">49 <span class="text-base font-normal text-muted">ر.س/شهرياً</span></p>
        <ul class="mt-6 space-y-3 text-muted">
          <li class="flex gap-2"><span class="text-emerald-500" aria-hidden="true">✓</span> مشاريع غير محدودة</li>
          <li class="flex gap-2"><span class="text-emerald-500" aria-hidden="true">✓</span> 20 عضواً</li>
        </ul>
        <button class="mt-8 w-full rounded-lg bg-brand-600 py-3 font-bold text-white transition hover:bg-brand-700">
          جرّبها 14 يوماً
        </button>
      </div>

      <!-- الشركات -->
      <div class="rounded-2xl border border-line bg-surface p-8">
        <h3 class="text-lg font-bold">الشركات</h3>
        <p class="mt-4 text-4xl font-extrabold">199 <span class="text-base font-normal text-muted">ر.س/شهرياً</span></p>
        <ul class="mt-6 space-y-3 text-muted">
          <li class="flex gap-2"><span class="text-emerald-500" aria-hidden="true">✓</span> كل شيء</li>
          <li class="flex gap-2"><span class="text-emerald-500" aria-hidden="true">✓</span> مدير حساب</li>
        </ul>
        <button class="mt-8 w-full rounded-lg border-2 border-brand-500 py-3 font-bold text-brand-600">
          تواصل معنا
        </button>
      </div>

    </div>
  </div>
</section>` },
    { t: 'demo', title: 'شكل قسم الأسعار', height: 400,
      css: '.g{display:grid;gap:14px}@media(min-width:520px){.g{grid-template-columns:repeat(3,1fr);align-items:center}}.p{border:1px solid #e2e8f0;border-radius:16px;background:#fff;padding:18px;text-align:center}.f{position:relative;border:2px solid #6366f1;box-shadow:0 12px 32px rgba(99,102,241,.2)}@media(min-width:520px){.f{transform:scale(1.06)}}.tag{position:absolute;inset-block-start:-12px;inset-inline-start:50%;transform:translateX(50%);background:#6366f1;color:#fff;border-radius:999px;padding:3px 14px;font-size:.72em;font-weight:700;white-space:nowrap}h4{margin:0;font-size:.95em}.pr{margin:10px 0;font-size:1.7rem;font-weight:800}.pr small{font-size:.5em;font-weight:400;color:#64748b}button{width:100%;border-radius:8px;padding:9px;font-weight:700;font-family:inherit;cursor:pointer;font-size:.85em}.o{background:transparent;border:2px solid #6366f1;color:#4f46e5}.s{background:#4f46e5;color:#fff;border:0}',
      html: '<div class="g"><div class="p"><h4>المجانية</h4><p class="pr">0 <small>ر.س</small></p><button class="o">ابدأ مجاناً</button></div><div class="p f"><span class="tag">الأكثر شيوعاً</span><h4>الاحترافية</h4><p class="pr">49 <small>ر.س</small></p><button class="s">جرّبها</button></div><div class="p"><h4>الشركات</h4><p class="pr">199 <small>ر.س</small></p><button class="o">تواصل</button></div></div>' },

    { t: 'h2', text: 'مقتطف: قائمة الجوال بلا جافاسكربت' },
    { t: 'code', lang: 'html', code: `
<details class="group md:hidden">
  <summary class="cursor-pointer list-none p-2 text-2xl" aria-label="القائمة">
    <span class="group-open:hidden" aria-hidden="true">☰</span>
    <span class="hidden group-open:inline" aria-hidden="true">✕</span>
  </summary>

  <nav class="absolute inset-x-0 top-16 border-b border-line bg-surface p-4">
    <ul class="flex flex-col gap-2">
      <li><a class="block rounded-lg p-3 hover:bg-canvas" href="#features">المميزات</a></li>
      <li><a class="block rounded-lg p-3 hover:bg-canvas" href="#pricing">الأسعار</a></li>
      <li><a class="block rounded-lg p-3 hover:bg-canvas" href="#faq">الأسئلة</a></li>
    </ul>
  </nav>
</details>` },
    { t: 'tip', text: 'حيلة أنيقة: `details` تعطيك قائمة جوال تعمل بلوحة المفاتيح وقارئات الشاشة بلا سطر جافاسكربت واحد.' },

    { t: 'h2', text: 'قائمة المراجعة النهائية' },
    { t: 'steps', items: [
      'الصفحة تعمل على 375 و 768 و 1440 و 1920 بلا تمرير أفقي.',
      'الوضع الليلي يعمل تلقائياً ويدوياً ويحفظ التفضيل.',
      'التنقّل بمفتاح Tab يصل لكل عنصر تفاعلي بمؤشّر واضح.',
      'رابط التخطّي يظهر عند أول ضغطة Tab.',
      'كل الحركات تتوقّف مع `prefers-reduced-motion`.',
      'Lighthouse: 90+ في Performance و Accessibility و SEO.',
      'حجم CSS المضغوط أقل من 20 كيلوبايت.',
      'لا اسم صنف مبني ديناميكياً.',
      'الأصناف مرتّبة بـ Prettier.',
      'الصفحة منشورة على رابط حقيقي.'
    ]},

    { t: 'exercise',
      title: 'المشروع الكامل',
      brief: 'نفّذ صفحة هبوط «نَسَق» بكل المواصفات أعلاه.',
      requirements: [
        'الأقسام العشرة كلها.',
        'كل المتطلّبات التقنية (تصميم، تجاوب، وصول).',
        'قائمة المراجعة كلها ✓.',
        'منشورة على Netlify أو Vercel أو GitHub Pages.'
      ],
      hints: [
        'ابنِ قسماً واحداً كاملاً واختبره على ثلاثة أحجام قبل التالي.',
        'ابدأ بالجوال دائماً ثم أضف البادئات.',
        'استخدم `container-page` لكل قسم لتوحيد الحاوية.',
        'اختبر الوضع الليلي بعد كل قسم لا في النهاية.',
        'إن تعثّرت في موضوع، عد إلى درسه لا إلى بداية المسار.'
      ],
      solution: { lang: 'html', title: 'مقتطف: الترويسة والبطل', code: `
<body class="bg-canvas font-sans text-ink">

  <a href="#main"
     class="sr-only focus:not-sr-only focus:absolute focus:start-1/2 focus:top-2
            focus:-translate-x-1/2 focus:rounded-lg focus:bg-brand-600
            focus:px-5 focus:py-2 focus:font-bold focus:text-white">
    تخطّي إلى المحتوى
  </a>

  <!-- ===== الترويسة ===== -->
  <header class="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-lg">
    <div class="container-page flex h-16 items-center justify-between gap-4">

      <a href="/" class="flex items-center gap-2 text-xl font-extrabold">
        <span class="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white"
              aria-hidden="true">ن</span>
        نَسَق
      </a>

      <nav class="hidden gap-6 text-muted md:flex">
        <a class="transition hover:text-brand-600" href="#features">المميزات</a>
        <a class="transition hover:text-brand-600" href="#pricing">الأسعار</a>
        <a class="transition hover:text-brand-600" href="#faq">الأسئلة</a>
      </nav>

      <div class="flex items-center gap-2">
        <button data-theme-toggle
                class="grid h-10 w-10 place-items-center rounded-lg border border-line
                       transition hover:bg-canvas"
                aria-label="تبديل الوضع الليلي">
          <span class="dark:hidden" aria-hidden="true">🌙</span>
          <span class="hidden dark:inline" aria-hidden="true">☀️</span>
        </button>

        <a href="#cta"
           class="hidden rounded-lg bg-brand-600 px-5 py-2.5 font-bold text-white
                  transition hover:bg-brand-700 sm:inline-block">
          ابدأ مجاناً
        </a>

        <details class="group md:hidden">
          <summary class="cursor-pointer list-none p-2 text-2xl" aria-label="القائمة">
            <span class="group-open:hidden" aria-hidden="true">☰</span>
            <span class="hidden group-open:inline" aria-hidden="true">✕</span>
          </summary>
          <nav class="absolute inset-x-0 top-16 border-b border-line bg-surface p-4">
            <ul class="flex flex-col gap-1">
              <li><a class="block rounded-lg p-3 hover:bg-canvas" href="#features">المميزات</a></li>
              <li><a class="block rounded-lg p-3 hover:bg-canvas" href="#pricing">الأسعار</a></li>
              <li><a class="block rounded-lg p-3 hover:bg-canvas" href="#faq">الأسئلة</a></li>
            </ul>
          </nav>
        </details>
      </div>
    </div>
  </header>

  <main id="main">

    <!-- ===== البطل ===== -->
    <section class="relative overflow-hidden py-16 sm:py-24">
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_70%_-10%,var(--color-brand-100),transparent)]
                  dark:bg-[radial-gradient(60rem_30rem_at_70%_-10%,var(--color-brand-900),transparent)]"></div>

      <div class="container-page grid items-center gap-12 lg:grid-cols-2">

        <div class="motion-safe:animate-fade-up">
          <span class="inline-flex items-center gap-2 rounded-full border border-brand-300
                       bg-brand-50 px-4 py-1.5 text-sm font-bold text-brand-700
                       dark:bg-brand-900 dark:text-brand-100">
            <span aria-hidden="true">✨</span> الإصدار الثاني متاح الآن
          </span>

          <h1 class="mt-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            أدِر مشاريعك
            <span class="bg-gradient-to-l from-brand-500 to-fuchsia-500 bg-clip-text text-transparent">
              بالعربية
            </span>
          </h1>

          <p class="mt-6 max-w-prose text-lg text-muted">
            منصة تخطيط ومتابعة مصمّمة للفرق العربية من الأساس: واجهة من
            اليمين لليسار، تقاويم هجرية وميلادية، ودعم بلغتك.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#cta"
               class="rounded-xl bg-brand-600 px-8 py-4 text-center font-bold text-white
                      shadow-lg shadow-brand-500/30 transition
                      hover:bg-brand-700 motion-safe:hover:-translate-y-0.5">
              ابدأ مجاناً — بلا بطاقة
            </a>
            <a href="#features"
               class="rounded-xl border-2 border-line px-8 py-4 text-center font-bold
                      transition hover:border-brand-500 hover:text-brand-600">
              شاهد المميزات
            </a>
          </div>

          <p class="mt-6 text-sm text-muted">
            انضمّ إلى أكثر من 12,000 فريق عربي
          </p>
        </div>

        <div class="motion-safe:animate-fade-up">
          <div class="aspect-video rounded-2xl border border-line bg-surface p-3 shadow-2xl">
            <div class="h-full rounded-xl bg-gradient-to-br from-brand-400 to-fuchsia-500"></div>
          </div>
        </div>

      </div>
    </section>

    <!-- بقية الأقسام تتبع النمط نفسه -->

  </main>
</body>` },
      solutionNote: 'بقية الأقسام تتبع النمط ذاته: `container-page` للحاوية، عنوان `h2` موسّط، ثم شبكة متجاوبة بالمحتوى.'
    },

    { t: 'h2', text: 'النشر' },
    { t: 'code', lang: 'bash', code: `
# البناء
npx @tailwindcss/cli -i src/style.css -o dist/style.css --minify

# النشر على Netlify
npx netlify-cli deploy --prod --dir=.

# أو على Vercel
npx vercel --prod

# أو GitHub Pages
git add . && git commit -m "صفحة الهبوط" && git push` },

    { t: 'h2', text: 'ماذا بعد؟' },
    { t: 'p', text: 'أنهيت مسار Tailwind: الفلسفة والمسافات والألوان والطباعة والتخطيط والحالات والتجاوب والتأثيرات والتخصيص والمكوّنات. أنت الآن قادر على بناء أي واجهة بسرعة واتّساق.' },
    { t: 'ul', items: [
      '**shadcn/ui** — مكوّنات جاهزة تنسخها إلى مشروعك وتملكها بالكامل.',
      '**Headless UI** — مكوّنات تفاعلية بلا أنماط، تنسّقها بـ Tailwind.',
      '**Framer Motion** — حركات متقدّمة تتكامل مع Tailwind.',
      '**Tailwind UI** — قوالب رسمية مدفوعة عالية الجودة.',
      '**بناء نظام تصميم كامل** لفريقك بالمبادئ التي تعلّمتها.'
    ]},

    { t: 'quiz', items: [
      { q: 'ما ترتيب البناء الصحيح في التصميم المتجاوب؟', options: ['الحاسوب ثم الجوال', 'الجوال أولاً ثم إضافة نقاط التوقف', 'عشوائي', 'اللوحي أولاً'], answer: 1,
        explain: 'يتوافق مع منطق Tailwind ويقلّل الأصناف المطلوبة.' },
      { q: 'كيف تبني قائمة جوال بلا جافاسكربت؟', options: ['بـ checkbox مخفي', 'بعنصر `details` و `summary`', 'بـ CSS فقط', 'مستحيل'], answer: 1,
        explain: '`details` تأتي بدعم لوحة المفاتيح وقارئات الشاشة مجاناً.' },
      { q: 'أين تُحفظ تفضيلات الثيم؟', options: ['في الخادم', 'في `localStorage` مع تطبيقها قبل الرسم', 'في ملف', 'لا تُحفظ'], answer: 1,
        explain: 'التطبيق المبكر يمنع ومضة الوضع الفاتح قبل تحميل السكربت.' },
      { q: 'ما الهدف المعقول لحجم CSS في صفحة هبوط؟', options: ['أقل من 5kb', 'أقل من 20kb مضغوطة', 'أقل من 200kb', 'لا يهم'], answer: 1,
        explain: 'Tailwind تولّد المستخدم فقط، فصفحة كاملة تبقى عادةً تحت 20 كيلوبايت.' },
      { q: 'ما أول ما تختبره بعد إنهاء كل قسم؟', options: ['السرعة', 'التجاوب على ثلاثة أحجام والوضع الليلي', 'السيو', 'الطباعة'], answer: 1,
        explain: 'الاختبار المبكر والمتكرّر أرخص بكثير من إصلاح كل شيء في النهاية.' }
    ]}
  ]
};
