'use strict';

module.exports = {
  slug: '02-spacing-sizing',
  title: 'المسافات والأحجام',
  summary: 'مقياس المسافات، الحشو والهوامش بكل الاتجاهات، العرض والارتفاع، والقيم العشوائية.',
  duration: 40,
  level: 'مبتدئ',
  tags: ['المسافات', 'الأحجام'],
  objectives: [
    'تستخدم مقياس المسافات بثقة بلا رجوع للتوثيق.',
    'تطبّق الحشو والهوامش بكل الاتجاهات بما فيها المنطقية.',
    'تتحكّم في العرض والارتفاع والحدود القصوى.',
    'تستخدم `space-*` و `gap-*` لتباعد الأبناء.',
    'تستخدم القيم العشوائية عند الضرورة فقط.'
  ],
  quickRef: [
    { code: 'p-4 / px-4 / py-4', desc: 'حشو كامل / أفقي / رأسي' },
    { code: 'ps-4 / pe-4', desc: 'حشو منطقي (يتبع الاتجاه)' },
    { code: 'm-auto / mx-auto', desc: 'توسيط بالهامش' },
    { code: '-mt-4', desc: 'هامش سالب' },
    { code: 'w-full / w-1/2 / w-64', desc: 'العرض' },
    { code: 'min-h-screen', desc: 'ارتفاع أدنى بحجم الشاشة' },
    { code: 'gap-4 / space-y-4', desc: 'تباعد الأبناء' },
    { code: 'p-[13px]', desc: 'قيمة عشوائية' }
  ],
  blocks: [
    { t: 'h2', text: 'مقياس المسافات' },
    { t: 'p', text: 'أساس النظام كله. القيم مضاعفات `0.25rem` أي **4 بكسل**، فالرقم × 4 يعطيك البكسل مباشرة.' },
    { t: 'demo', title: 'المقياس كاملاً', height: 320,
      css: 'table{width:100%;border-collapse:collapse;font-size:.88em}td{padding:5px 10px;border-bottom:1px solid #f1f5f9}code{font-family:monospace;background:#f1f5f9;padding:2px 7px;border-radius:5px;font-size:.9em}.bar{background:#38bdf8;height:14px;border-radius:3px;display:inline-block}',
      html: '<table><tr><td><code>0</code></td><td>0</td><td></td></tr><tr><td><code>1</code></td><td>4px</td><td><span class="bar" style="width:4px"></span></td></tr><tr><td><code>2</code></td><td>8px</td><td><span class="bar" style="width:8px"></span></td></tr><tr><td><code>3</code></td><td>12px</td><td><span class="bar" style="width:12px"></span></td></tr><tr><td><code>4</code></td><td>16px</td><td><span class="bar" style="width:16px"></span></td></tr><tr><td><code>6</code></td><td>24px</td><td><span class="bar" style="width:24px"></span></td></tr><tr><td><code>8</code></td><td>32px</td><td><span class="bar" style="width:32px"></span></td></tr><tr><td><code>12</code></td><td>48px</td><td><span class="bar" style="width:48px"></span></td></tr><tr><td><code>16</code></td><td>64px</td><td><span class="bar" style="width:64px"></span></td></tr><tr><td><code>24</code></td><td>96px</td><td><span class="bar" style="width:96px"></span></td></tr></table>' },
    { t: 'note', text: 'القيم المتاحة: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96. القيود مقصودة: تمنعك من اختيار 13 بكسل عشوائياً فيبقى التصميم متّسقاً.' },

    { t: 'h2', text: 'الحشو (Padding)' },
    { t: 'code', lang: 'html', code: `
<div class="p-4">    <!-- كل الجهات -->
<div class="px-4">   <!-- يمين ويسار -->
<div class="py-4">   <!-- أعلى وأسفل -->

<div class="pt-4">   <!-- أعلى -->
<div class="pb-4">   <!-- أسفل -->
<div class="pr-4">   <!-- يمين -->
<div class="pl-4">   <!-- يسار -->

<!-- المنطقية: تتبع اتجاه الصفحة -->
<div class="ps-4">   <!-- البداية: يمين في RTL -->
<div class="pe-4">   <!-- النهاية: يسار في RTL -->

<!-- الجمع -->
<div class="px-6 py-3">
<div class="p-4 pt-8">   <!-- الأخيرة تتغلّب -->` },
    { t: 'tip', text: 'في المواقع العربية استخدم **الاتجاهات المنطقية** (`ps` و `pe` و `ms` و `me`) بدل `pr`/`pl`. هي تتبع `dir` تلقائياً، فيعمل تصميمك في العربية والإنجليزية بلا تعديل.' },
    { t: 'demo', title: 'الاتجاهات المنطقية في RTL', height: 200,
      css: '.b{border:2px dashed #38bdf8;border-radius:8px;margin-bottom:8px;background:#f0f9ff}.i{background:#0ea5e9;color:#fff;padding:8px;border-radius:5px;font-size:.85em}',
      html: '<div class="b" style="padding-inline-start:32px;padding-block:8px"><span class="i">ps-8 — الحشو من جهة البداية (اليمين)</span></div><div class="b" style="padding-inline-end:32px;padding-block:8px"><span class="i">pe-8 — الحشو من جهة النهاية (اليسار)</span></div>' },

    { t: 'h2', text: 'الهوامش (Margin)' },
    { t: 'code', lang: 'html', code: `
<div class="m-4">     <!-- كل الجهات -->
<div class="mx-auto"> <!-- توسيط أفقي -->
<div class="mt-8 mb-4">

<!-- هوامش سالبة: أضف - في البداية -->
<div class="-mt-4">
<div class="-mx-6">

<!-- منطقية -->
<div class="ms-4 me-2">` },
    { t: 'code', lang: 'html', title: 'التوسيط الكلاسيكي', code: '<div class="mx-auto max-w-3xl">\n  محتوى موسّط بعرض أقصى\n</div>' },
    { t: 'demo', title: 'mx-auto مع max-w', height: 180,
      css: '.o{background:#f1f5f9;padding:10px;border-radius:8px}.i{margin:0 auto;max-width:280px;background:#0ea5e9;color:#fff;padding:12px;border-radius:8px;text-align:center}',
      html: '<div class="o"><div class="i">mx-auto max-w-sm</div></div>' },

    { t: 'h2', text: 'تباعد الأبناء' },
    { t: 'p', text: 'بدل إضافة هامش لكل ابن، استخدم أدوات التباعد على الأب.' },
    { t: 'code', lang: 'html', code: `
<!-- gap: مع flex و grid — الأفضل -->
<div class="flex gap-4">
  <div>الأول</div>
  <div>الثاني</div>
</div>

<div class="grid grid-cols-3 gap-x-4 gap-y-6">…</div>

<!-- space: يضيف هامشاً لكل ابن عدا الأول -->
<div class="space-y-4">
  <p>فقرة</p>
  <p>فقرة</p>
</div>

<div class="flex space-x-4 rtl:space-x-reverse">…</div>` },
    { t: 'demo', title: 'gap مقابل space-y', height: 260,
      css: '.g{display:flex;gap:16px;margin-bottom:14px}.g>div{background:#0ea5e9;color:#fff;padding:10px 16px;border-radius:8px}.s>p{background:#f1f5f9;padding:10px;border-radius:8px;margin:0}.s>p+p{margin-top:16px}b{display:block;font-size:.85em;color:#64748b;margin-bottom:6px}',
      html: '<b>flex gap-4</b><div class="g"><div>الأول</div><div>الثاني</div><div>الثالث</div></div><b>space-y-4</b><div class="s"><p>فقرة أولى</p><p>فقرة ثانية</p><p>فقرة ثالثة</p></div>' },
    { t: 'warn', title: 'فضّل `gap`', text: '`space-x-*` يعتمد على الهوامش فيتعارض أحياناً مع الالتفاف (wrap) والاتجاه RTL. أما `gap` فيعمل بلا مفاجآت مع Flexbox و Grid. استخدم `gap` كخيار أول دائماً.' },

    { t: 'h2', text: 'العرض' },
    { t: 'code', lang: 'html', code: `
<!-- ثابت من المقياس -->
<div class="w-64">     <!-- 16rem = 256px -->
<div class="w-96">     <!-- 24rem = 384px -->

<!-- كسور -->
<div class="w-1/2">    <!-- 50% -->
<div class="w-1/3">    <!-- 33.333% -->
<div class="w-2/3">    <!-- 66.666% -->
<div class="w-full">   <!-- 100% -->

<!-- نسبة لنافذة العرض -->
<div class="w-screen"> <!-- 100vw -->

<!-- تلقائي -->
<div class="w-auto">
<div class="w-fit">    <!-- fit-content -->
<div class="w-min">    <!-- min-content -->
<div class="w-max">    <!-- max-content -->

<!-- الحدود -->
<div class="max-w-md">      <!-- 28rem -->
<div class="max-w-prose">   <!-- عرض قراءة مريح ~65 محرفاً -->
<div class="min-w-0">       <!-- مهم لمنع تجاوز flex -->` },
    { t: 'table', head: ['الصنف', 'القيمة'], rows: [
      ['`max-w-xs`', '20rem — 320px'],
      ['`max-w-sm`', '24rem — 384px'],
      ['`max-w-md`', '28rem — 448px'],
      ['`max-w-lg`', '32rem — 512px'],
      ['`max-w-xl`', '36rem — 576px'],
      ['`max-w-2xl`', '42rem — 672px'],
      ['`max-w-4xl`', '56rem — 896px'],
      ['`max-w-7xl`', '80rem — 1280px'],
      ['`max-w-prose`', '65 محرفاً — مثالي للنصوص الطويلة']
    ]},
    { t: 'tip', text: '`max-w-prose` كنز للمدونات: يضبط عرض النص عند نحو 65 محرفاً وهو العرض الأمثل لراحة القراءة حسب دراسات الطباعة.' },

    { t: 'h2', text: 'الارتفاع' },
    { t: 'code', lang: 'html', code: `
<div class="h-64">        <!-- 16rem -->
<div class="h-full">      <!-- 100% -->
<div class="h-screen">    <!-- 100vh -->
<div class="h-dvh">       <!-- 100dvh — أدق على الجوال -->

<div class="min-h-screen">
<div class="max-h-96 overflow-y-auto">

<!-- نسبة الأبعاد -->
<div class="aspect-video">   <!-- 16/9 -->
<div class="aspect-square">  <!-- 1/1 -->` },
    { t: 'warn', title: 'استخدم `dvh` على الجوال', text: '`h-screen` تعني `100vh`، وشريط عنوان المتصفح على الجوال يجعلها أطول من الشاشة الفعلية فيظهر تمرير غير مرغوب. البديل `h-dvh` يحسب الارتفاع الديناميكي الحقيقي.' },
    { t: 'demo', title: 'نسبة الأبعاد', height: 230,
      css: '.g{display:flex;gap:12px}.v{aspect-ratio:16/9;background:#0ea5e9;border-radius:10px;flex:2;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.85em}.s{aspect-ratio:1/1;background:#f472b6;border-radius:10px;flex:1;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.85em}',
      html: '<div class="g"><div class="v">aspect-video</div><div class="s">aspect-square</div></div>' },

    { t: 'h2', text: 'القيم العشوائية' },
    { t: 'p', text: 'حين لا يكفي المقياس، تستطيع كتابة أي قيمة بين قوسين مربّعين.' },
    { t: 'code', lang: 'html', code: `
<div class="p-[13px]">
<div class="w-[calc(100%-2rem)]">
<div class="h-[42vh]">
<div class="max-w-[850px]">
<div class="top-[117px]">

<!-- مع متغيّرات CSS -->
<div class="w-[var(--sidebar-width)]">` },
    { t: 'danger', title: 'استخدمها بحذر شديد', text: 'القيم العشوائية تُلغي فائدة النظام. إن وجدت نفسك تكتبها كثيراً، فالحل الصحيح **توسيع المقياس** في إعدادات الثيم لا نثر القيم في الترميز. اعتبرها استثناءً لا عادة.' },

    { t: 'h2', text: 'مثال عملي: تخطيط صفحة' },
    { t: 'code', lang: 'html', code: `
<body class="min-h-dvh bg-slate-50">

  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <span class="text-xl font-extrabold">شعار</span>
      <nav class="flex gap-6">
        <a href="#">الرئيسية</a>
        <a href="#">المنتجات</a>
      </nav>
    </div>
  </header>

  <main class="mx-auto max-w-7xl px-6 py-12">
    <div class="grid gap-8 lg:grid-cols-[280px_1fr]">

      <aside class="space-y-4">
        <div class="rounded-xl bg-white p-4 shadow-sm">التصنيفات</div>
        <div class="rounded-xl bg-white p-4 shadow-sm">السعر</div>
      </aside>

      <section class="space-y-6">
        <h1 class="text-3xl font-extrabold">المنتجات</h1>
        <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <!-- البطاقات -->
        </div>
      </section>

    </div>
  </main>

</body>` },

    { t: 'exercise',
      title: 'تمرين: تخطيط لوحة تحكّم',
      brief: 'ابنِ تخطيط لوحة تحكّم كاملاً بأدوات المسافات والأحجام فقط.',
      requirements: [
        'الصفحة بارتفاع أدنى يملأ الشاشة (`min-h-dvh`).',
        'ترويسة ثابتة الارتفاع بحشو مناسب ومحتوى موسّط بعرض أقصى.',
        'شريط جانبي بعرض ثابت 280 بكسل، ومحتوى رئيسي يأخذ الباقي.',
        'الشريط الجانبي يحوي 5 روابط بتباعد رأسي متساوٍ.',
        'المحتوى الرئيسي فيه أربع بطاقات إحصائية في شبكة بمسافات.',
        'صندوق نص طويل بعرض `max-w-prose` موسّط.',
        'استخدم الاتجاهات المنطقية (`ps`/`pe`/`ms`/`me`) لا `pl`/`pr`.',
        'استخدم `gap` لا `space-*` حيثما أمكن.',
        'قيمة عشوائية واحدة فقط، واكتب تعليقاً يبرّرها.'
      ],
      hints: [
        '`grid-cols-[280px_1fr]` تعطي عموداً ثابتاً وآخر مرناً.',
        '`mx-auto max-w-7xl px-6` هو النمط القياسي للحاوية.',
        'تذكّر: الرقم × 4 = بكسل.'
      ],
      solution: { lang: 'html', code: `
<body class="min-h-dvh bg-slate-50">

  <!-- الترويسة -->
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <span class="text-xl font-extrabold text-slate-900">لوحة التحكّم</span>
      <div class="flex items-center gap-4">
        <span class="text-sm text-slate-500">مرحباً، سارة</span>
        <div class="h-9 w-9 rounded-full bg-sky-600"></div>
      </div>
    </div>
  </header>

  <!-- الجسم -->
  <div class="mx-auto max-w-7xl px-6 py-8">
    <div class="grid gap-8 lg:grid-cols-[280px_1fr]">

      <!-- الشريط الجانبي -->
      <aside class="flex flex-col gap-2">
        <a class="rounded-lg bg-sky-600 px-4 py-3 font-bold text-white" href="#">نظرة عامة</a>
        <a class="rounded-lg px-4 py-3 text-slate-600 hover:bg-slate-100" href="#">الطلبات</a>
        <a class="rounded-lg px-4 py-3 text-slate-600 hover:bg-slate-100" href="#">المنتجات</a>
        <a class="rounded-lg px-4 py-3 text-slate-600 hover:bg-slate-100" href="#">العملاء</a>
        <a class="rounded-lg px-4 py-3 text-slate-600 hover:bg-slate-100" href="#">الإعدادات</a>
      </aside>

      <!-- المحتوى -->
      <main class="flex flex-col gap-8">

        <!-- الإحصائيات -->
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-xl border border-slate-200 bg-white p-5">
            <p class="text-sm text-slate-500">الطلبات اليوم</p>
            <p class="mt-2 text-3xl font-extrabold text-slate-900">128</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-5">
            <p class="text-sm text-slate-500">المبيعات</p>
            <p class="mt-2 text-3xl font-extrabold text-slate-900">42,300</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-5">
            <p class="text-sm text-slate-500">العملاء الجدد</p>
            <p class="mt-2 text-3xl font-extrabold text-slate-900">37</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-5">
            <p class="text-sm text-slate-500">معدّل الإرجاع</p>
            <p class="mt-2 text-3xl font-extrabold text-slate-900">2.4%</p>
          </div>
        </div>

        <!-- نص طويل بعرض قراءة مريح -->
        <section class="rounded-xl border border-slate-200 bg-white p-8">
          <h2 class="mb-4 text-2xl font-bold">ملخّص الأداء</h2>
          <p class="mx-auto max-w-prose leading-loose text-slate-600">
            ارتفعت المبيعات هذا الشهر بنسبة أربعة عشر بالمئة مقارنة بالشهر
            الماضي، ويعود ذلك أساساً إلى حملة الخصومات التي انطلقت مطلع
            الشهر واستهدفت فئة الملحقات.
          </p>
        </section>

        <!-- القيمة العشوائية الوحيدة:
             ارتفاع الرسم البياني مقيّد بتصميم المكتبة المستخدمة -->
        <section class="h-[340px] rounded-xl border border-slate-200 bg-white p-6">
          <h2 class="mb-4 text-xl font-bold">الرسم البياني</h2>
        </section>

      </main>
    </div>
  </div>

</body>` } },

    { t: 'quiz', items: [
      { q: 'كم بكسل يساوي `p-5`؟', options: ['5', '10', '20', '50'], answer: 2,
        explain: 'الرقم × 4 = بكسل، فـ 5 × 4 = 20 بكسل.' },
      { q: 'لماذا نفضّل `ps-4` على `pl-4` في موقع عربي؟', options: ['أقصر', 'لأنها تتبع اتجاه الصفحة تلقائياً فتعمل في RTL و LTR', 'أسرع', 'أحدث'], answer: 1,
        explain: 'الاتجاهات المنطقية تنعكس مع `dir` بلا كتابة أنماط إضافية.' },
      { q: 'ما الفرق بين `gap-4` و `space-x-4`؟', options: ['لا فرق', '`gap` خاصية أصلية لا تتأثّر بالالتفاف والاتجاه، و`space` يعتمد الهوامش', 'العكس', '`space` أحدث'], answer: 1,
        explain: '`gap` أكثر أماناً مع wrap و RTL؛ اجعله خيارك الأول.' },
      { q: 'متى تستخدم `h-dvh` بدل `h-screen`؟', options: ['دائماً', 'على الجوال حيث يغيّر شريط المتصفح ارتفاع الشاشة الفعلي', 'في الطباعة', 'مع الشبكات'], answer: 1,
        explain: '`dvh` تحسب الارتفاع الديناميكي فتتفادى التمرير غير المرغوب.' },
      { q: 'ما خطر الإفراط في القيم العشوائية `p-[13px]`؟', options: ['بطء', 'تُلغي فائدة نظام التصميم المتّسق', 'خطأ ترجمة', 'لا خطر'], answer: 1,
        explain: 'الحل الصحيح توسيع المقياس في الثيم لا نثر قيم فردية في الترميز.' }
    ]}
  ]
};
