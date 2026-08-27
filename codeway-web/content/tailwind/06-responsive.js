'use strict';

module.exports = {
  slug: '06-responsive',
  title: 'التصميم المتجاوب',
  summary: 'منهجية الجوال أولاً، نقاط التوقف، والاستعلامات الحاوية، وأنماط التجاوب العملية.',
  duration: 45,
  level: 'متوسط',
  tags: ['متجاوب', 'الجوال'],
  objectives: [
    'تفهم منطق «الجوال أولاً» ولماذا هو الافتراضي.',
    'تستخدم نقاط التوقف الخمس بشكل صحيح.',
    'تبني تخطيطات تتكيّف مع كل الشاشات.',
    'تستخدم الاستعلامات الحاوية.',
    'تتجنّب أخطاء التجاوب الشائعة.'
  ],
  quickRef: [
    { code: 'sm: 640px', desc: 'جوال أفقي فأعلى' },
    { code: 'md: 768px', desc: 'لوحي فأعلى' },
    { code: 'lg: 1024px', desc: 'حاسوب محمول فأعلى' },
    { code: 'xl: 1280px', desc: 'شاشة كبيرة' },
    { code: '2xl: 1536px', desc: 'شاشة كبيرة جداً' },
    { code: 'max-md:', desc: 'أقل من md فقط' },
    { code: '@container / @md:', desc: 'استعلام حاوٍ' }
  ],
  blocks: [
    { t: 'h2', text: 'الجوال أولاً' },
    { t: 'p', text: 'القاعدة الأهم في Tailwind: **الصنف بلا بادئة يُطبَّق على كل الشاشات**، والبادئة تعني «من هذا الحجم **فأعلى**». فتبدأ بتصميم الجوال ثم تضيف تحسينات للشاشات الأكبر.' },
    { t: 'code', lang: 'html', code: `
<div class="text-base md:text-lg lg:text-xl">
  <!-- الجوال: base -->
  <!-- من 768px: lg -->
  <!-- من 1024px: xl -->
</div>` },
    { t: 'compare', lang: 'html', bad: {
      code: '<div class="grid grid-cols-3 sm:grid-cols-1">\n  …\n</div>',
      why: 'تفكير «الحاسوب أولاً»: ثلاثة أعمدة على الجوال ثم تصحّحها. عكس منطق Tailwind ويربك القراءة.'
    }, good: {
      code: '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">\n  …\n</div>',
      why: 'ابدأ بالأبسط (عمود واحد على الجوال) ثم أضف بالتدرّج. أوضح وأقلّ عرضة للأخطاء.'
    }},
    { t: 'demo', title: 'كيف تُقرأ الأصناف', height: 250,
      css: 'table{width:100%;border-collapse:collapse;font-size:.88em}td,th{padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right}th{background:#e0f2fe;color:#0369a1}code{font-family:monospace;background:#f1f5f9;padding:2px 7px;border-radius:5px;font-size:.88em}',
      html: '<table><tr><th>الصنف</th><th>يُطبَّق على</th></tr><tr><td><code>p-4</code></td><td>كل الشاشات</td></tr><tr><td><code>md:p-8</code></td><td>768px فأعلى</td></tr><tr><td><code>lg:p-12</code></td><td>1024px فأعلى</td></tr><tr><td><code>max-md:p-2</code></td><td>أقل من 768px فقط</td></tr><tr><td><code>md:max-lg:p-6</code></td><td>بين 768 و 1024 فقط</td></tr></table>' },

    { t: 'h2', text: 'نقاط التوقف' },
    { t: 'table', head: ['البادئة', 'العرض الأدنى', 'الجهاز النموذجي'], rows: [
      ['(بلا بادئة)', '0px', 'الجوال — الافتراضي'],
      ['`sm:`', '640px', 'جوال أفقي، لوحي صغير'],
      ['`md:`', '768px', 'لوحي'],
      ['`lg:`', '1024px', 'حاسوب محمول'],
      ['`xl:`', '1280px', 'شاشة مكتبية'],
      ['`2xl:`', '1536px', 'شاشة عريضة']
    ]},
    { t: 'note', text: 'لا تفكّر في «أجهزة» بل في **العرض المتاح**. جهاز لوحي أفقي قد يكون أعرض من حاسوب محمول صغير. صمّم بحسب متى ينكسر التخطيط لا بحسب اسم الجهاز.' },

    { t: 'h2', text: 'أنماط التجاوب العملية' },
    { t: 'h3', text: '1. الشبكة المتدرّجة' },
    { t: 'code', lang: 'html', code: `
<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <!-- 1 عمود → 2 → 3 → 4 -->
</div>` },

    { t: 'h3', text: '2. التبديل من عمود إلى صف' },
    { t: 'code', lang: 'html', code: `
<div class="flex flex-col gap-6 md:flex-row md:items-center">
  <img class="w-full md:w-1/3" src="…" alt="…">
  <div class="md:flex-1">
    <h2>عنوان</h2>
    <p>نص</p>
  </div>
</div>` },
    { t: 'demo', title: 'عمود على الجوال وصف على الشاشات الأكبر', height: 260,
      css: '.d{display:flex;flex-direction:column;gap:14px}.im{height:70px;background:linear-gradient(135deg,#38bdf8,#6366f1);border-radius:10px}@media(min-width:520px){.d{flex-direction:row;align-items:center}.im{width:33%;flex-shrink:0}}h4{margin:0 0 4px}p{margin:0;color:#64748b;font-size:.9em}',
      html: '<div class="d"><div class="im"></div><div><h4>عنوان المقال</h4><p>وصف قصير يظهر تحت الصورة على الجوال وبجوارها على الشاشات الأكبر. صغّر نافذة المعاينة لترى التحوّل.</p></div></div>' },

    { t: 'h3', text: '3. إظهار وإخفاء' },
    { t: 'code', lang: 'html', code: `
<!-- قائمة سطح المكتب -->
<nav class="hidden md:flex gap-6">…</nav>

<!-- زر قائمة الجوال -->
<button class="md:hidden">☰</button>

<!-- محتوى إضافي على الشاشات الكبيرة فقط -->
<aside class="hidden lg:block">…</aside>` },
    { t: 'warn', title: 'الإخفاء ليس حذفاً', text: '`hidden` تخفي بصرياً لكن العنصر يبقى في DOM ويُحمَّل محتواه. لا تضع صورة ثقيلة داخل `hidden md:block` — استخدم `<picture>` أو `srcset` بدلاً من ذلك.' },

    { t: 'h3', text: '4. الحاوية والحشو المتدرّج' },
    { t: 'code', lang: 'html', code: `
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <!-- حشو يكبر مع الشاشة -->
</div>` },

    { t: 'h3', text: '5. الطباعة المتجاوبة' },
    { t: 'code', lang: 'html', code: `
<h1 class="text-3xl font-extrabold sm:text-4xl lg:text-5xl xl:text-6xl">
  عنوان يكبر مع الشاشة
</h1>

<!-- أو بالقيم السائلة بلا نقاط توقف -->
<h1 class="text-[clamp(1.75rem,5vw,3.5rem)]">عنوان سائل</h1>` },
    { t: 'tip', text: '`clamp()` تعطي تدرّجاً سلساً بلا قفزات عند نقاط التوقف. صيغتها: `clamp(الحد الأدنى, القيمة المرنة, الحد الأقصى)`.' },

    { t: 'h3', text: '6. ترتيب مختلف بحسب الشاشة' },
    { t: 'code', lang: 'html', code: `
<div class="flex flex-col lg:flex-row">
  <aside class="order-2 lg:order-1 lg:w-64">الشريط الجانبي</aside>
  <main class="order-1 lg:order-2 lg:flex-1">المحتوى</main>
</div>
<!-- على الجوال: المحتوى أولاً ثم الشريط -->
<!-- على الحاسوب: الشريط يميناً والمحتوى بجواره -->` },

    { t: 'h2', text: 'المدى المحدود' },
    { t: 'code', lang: 'html', code: `
<div class="max-md:hidden">يظهر من md فأعلى فقط</div>
<div class="md:max-lg:bg-sky-100">خلفية بين md و lg فقط</div>
<div class="max-sm:text-center">توسيط على الجوال فقط</div>` },
    { t: 'p', text: 'بادئة `max-*` تعكس المنطق: «حتى هذا الحجم». مفيدة للحالات التي تخصّ الشاشات الصغيرة تحديداً.' },

    { t: 'h2', text: 'الاستعلامات الحاوية' },
    { t: 'p', text: 'مشكلة نقاط التوقف أنها تقيس **نافذة العرض** لا العنصر. بطاقة في شريط جانبي ضيّق ستحصل على تخطيط الشاشة العريضة رغم ضيقها. الحل: قياس **الحاوية** نفسها.' },
    { t: 'code', lang: 'html', code: `
<div class="@container">
  <div class="flex flex-col @md:flex-row @md:items-center gap-4">
    <img class="w-full @md:w-32" src="…" alt="…">
    <div>
      <h3 class="text-base @lg:text-xl">عنوان</h3>
      <p class="@md:text-sm">وصف</p>
    </div>
  </div>
</div>` },
    { t: 'demo', title: 'نفس المكوّن في حاويتين مختلفتين', height: 320,
      css: '.wrap{display:grid;grid-template-columns:150px 1fr;gap:14px}.box{border:2px dashed #cbd5e1;border-radius:10px;padding:10px}.card{container-type:inline-size}.inner{display:flex;flex-direction:column;gap:10px}.im{height:50px;background:linear-gradient(135deg,#38bdf8,#6366f1);border-radius:8px}@container (min-width:300px){.inner{flex-direction:row;align-items:center}.im{width:70px;flex-shrink:0}}h5{margin:0;font-size:.92em}p{margin:2px 0 0;color:#64748b;font-size:.8em}b{display:block;font-size:.72em;color:#94a3b8;margin-bottom:6px}',
      html: '<div class="wrap"><div class="box"><b>حاوية ضيّقة</b><div class="card"><div class="inner"><div class="im"></div><div><h5>عنوان</h5><p>وصف قصير</p></div></div></div></div><div class="box"><b>حاوية عريضة</b><div class="card"><div class="inner"><div class="im"></div><div><h5>عنوان</h5><p>وصف قصير</p></div></div></div></div></div>' },
    { t: 'p', text: 'لاحظ: **نفس** الترميز أعطى تخطيطين مختلفين لأن كل بطاقة تقيس حاويتها الخاصة. هذا ما يجعل المكوّنات قابلة لإعادة الاستخدام في أي سياق.' },
    { t: 'tip', text: 'الاستعلامات الحاوية هي المستقبل للمكوّنات القابلة لإعادة الاستخدام. استخدمها لأي مكوّن قد يظهر في أماكن بعروض مختلفة.' },

    { t: 'h2', text: 'أخطاء شائعة' },
    { t: 'ul', items: [
      '**التفكير بالحاسوب أولاً**: `grid-cols-4 sm:grid-cols-1` عكس المنطق وتربك القراءة.',
      '**نسيان الجوال**: اختبر دائماً على عرض 375 بكسل — أضيق شاشة شائعة.',
      '**نقاط توقف كثيرة**: `text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl` مبالغة. نقطتان تكفيان غالباً.',
      '**إخفاء المحتوى المهم**: `hidden md:block` على معلومة أساسية يحرم مستخدم الجوال منها.',
      '**عرض ثابت**: `w-[800px]` تكسر التخطيط على الجوال. استخدم `max-w-[800px] w-full`.',
      '**نسيان `overflow-x-auto`** على الجداول العريضة.'
    ]},
    { t: 'code', lang: 'html', title: 'جدول متجاوب', code: `
<div class="overflow-x-auto rounded-xl border border-slate-200" tabindex="0">
  <table class="w-full min-w-[600px]">…</table>
</div>` },

    { t: 'h2', text: 'صفحة متجاوبة كاملة' },
    { t: 'code', lang: 'html', code: `
<body class="flex min-h-dvh flex-col">

  <header class="border-b bg-white">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <span class="text-lg font-extrabold sm:text-xl">شعار</span>

      <nav class="hidden gap-6 md:flex">
        <a href="#">الرئيسية</a>
        <a href="#">المنتجات</a>
      </nav>

      <button class="text-2xl md:hidden" aria-label="القائمة">☰</button>
    </div>
  </header>

  <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

    <h1 class="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
      عنوان الصفحة
    </h1>

    <div class="mt-8 flex flex-col gap-8 lg:flex-row">

      <aside class="order-2 lg:order-1 lg:w-64 lg:shrink-0">
        <div class="rounded-xl border p-4">التصفية</div>
      </aside>

      <section class="order-1 grid gap-6 sm:grid-cols-2 lg:order-2 lg:flex-1 xl:grid-cols-3">
        <!-- البطاقات -->
      </section>

    </div>
  </main>

  <footer class="border-t bg-white py-8 text-center text-sm text-slate-500">
    © 2026
  </footer>

</body>` },

    { t: 'exercise',
      title: 'تمرين: صفحة متجر متجاوبة',
      brief: 'ابنِ صفحة تعمل بامتياز على كل الأحجام من 375 بكسل حتى 1920.',
      requirements: [
        'ترويسة: شعار + قائمة تظهر من `md` + زر قائمة للجوال.',
        'قسم بطل: عنوان بحجم متدرّج على ثلاث نقاط، ووصف، وزرّان.',
        'الزرّان عموديان بعرض كامل على الجوال، وأفقيان من `sm`.',
        'شبكة منتجات: 1 → 2 → 3 → 4 أعمدة عبر نقاط التوقف.',
        'شريط تصفية جانبي يظهر أسفل المحتوى على الجوال وبجواره من `lg` (استخدم `order`).',
        'قسم إحصائيات: عمودان على الجوال وأربعة من `md`.',
        'جدول مقارنة داخل حاوية `overflow-x-auto` مع `min-w`.',
        'حشو الحاوية يتدرّج: `px-4 sm:px-6 lg:px-8`.',
        'بطاقة واحدة تستخدم `@container` بدل نقاط التوقف.',
        'اختبر على 375 و 768 و 1440 بكسل وتأكّد من عدم وجود تمرير أفقي.'
      ],
      hints: [
        'ابدأ بتصميم الجوال كاملاً ثم أضف البادئات.',
        '`order-1` و `order-2` تغيّران الترتيب البصري دون تغيير الترميز.',
        'استخدم أدوات المطوّر لاختبار الأحجام (Ctrl+Shift+M).'
      ],
      solution: { lang: 'html', code: `
<body class="flex min-h-dvh flex-col bg-slate-50">

  <!-- الترويسة -->
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <span class="text-lg font-extrabold sm:text-xl">متجر التقنية</span>
      <nav class="hidden gap-6 text-slate-600 md:flex">
        <a class="hover:text-sky-600" href="#">الرئيسية</a>
        <a class="hover:text-sky-600" href="#">المنتجات</a>
        <a class="hover:text-sky-600" href="#">العروض</a>
      </nav>
      <button class="text-2xl md:hidden" aria-label="القائمة">☰</button>
    </div>
  </header>

  <main class="flex-1">

    <!-- البطل -->
    <section class="bg-gradient-to-bl from-sky-500 to-indigo-600 px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
      <h1 class="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
        أفضل الأجهزة بأفضل الأسعار
      </h1>
      <p class="mx-auto mt-4 max-w-prose text-sky-100">
        تشكيلة مختارة من أحدث الأجهزة مع ضمان سنتين وشحن مجاني.
      </p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button class="w-full rounded-lg bg-white px-8 py-3 font-bold text-sky-600 sm:w-auto">
          تسوّق الآن
        </button>
        <button class="w-full rounded-lg border-2 border-white px-8 py-3 font-bold text-white sm:w-auto">
          تصفّح العروض
        </button>
      </div>
    </section>

    <!-- المنتجات -->
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-8 lg:flex-row">

        <aside class="order-2 lg:order-1 lg:w-64 lg:shrink-0">
          <div class="rounded-xl border border-slate-200 bg-white p-5">
            <h2 class="mb-4 font-bold">التصفية</h2>
            <div class="flex flex-col gap-2 text-sm text-slate-600">
              <label><input type="checkbox" class="me-2">صوتيات</label>
              <label><input type="checkbox" class="me-2">ملحقات</label>
              <label><input type="checkbox" class="me-2">شاشات</label>
            </div>
          </div>
        </aside>

        <section class="order-1 lg:order-2 lg:flex-1">
          <h2 class="mb-6 text-2xl font-extrabold sm:text-3xl">المنتجات</h2>

          <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <article class="@container rounded-xl border border-slate-200 bg-white p-5">
              <div class="flex flex-col gap-4 @sm:flex-row @sm:items-center">
                <div class="aspect-video rounded-lg bg-slate-100 @sm:aspect-square @sm:w-20 @sm:shrink-0"></div>
                <div>
                  <h3 class="font-bold">سماعة لاسلكية</h3>
                  <p class="mt-1 text-sm text-slate-500">299 ر.س</p>
                </div>
              </div>
            </article>

            <article class="rounded-xl border border-slate-200 bg-white p-5">
              <div class="mb-4 aspect-video rounded-lg bg-slate-100"></div>
              <h3 class="font-bold">لوحة مفاتيح</h3>
              <p class="mt-1 text-sm text-slate-500">450 ر.س</p>
            </article>

            <article class="rounded-xl border border-slate-200 bg-white p-5">
              <div class="mb-4 aspect-video rounded-lg bg-slate-100"></div>
              <h3 class="font-bold">ماوس لاسلكي</h3>
              <p class="mt-1 text-sm text-slate-500">120 ر.س</p>
            </article>
          </div>
        </section>

      </div>
    </div>

    <!-- الإحصائيات -->
    <section class="border-y border-slate-200 bg-white py-12">
      <div class="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-4 lg:px-8">
        <div><p class="text-3xl font-extrabold text-sky-600">12k</p><p class="mt-1 text-sm text-slate-500">عميل</p></div>
        <div><p class="text-3xl font-extrabold text-sky-600">840</p><p class="mt-1 text-sm text-slate-500">منتج</p></div>
        <div><p class="text-3xl font-extrabold text-sky-600">24h</p><p class="mt-1 text-sm text-slate-500">شحن</p></div>
        <div><p class="text-3xl font-extrabold text-sky-600">4.8</p><p class="mt-1 text-sm text-slate-500">تقييم</p></div>
      </div>
    </section>

    <!-- جدول المقارنة -->
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 class="mb-6 text-2xl font-extrabold">مقارنة الباقات</h2>
      <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white" tabindex="0">
        <table class="w-full min-w-[600px] text-start">
          <thead class="bg-slate-50">
            <tr>
              <th class="p-4 text-start">الميزة</th>
              <th class="p-4 text-start">المجانية</th>
              <th class="p-4 text-start">الاحترافية</th>
              <th class="p-4 text-start">الشركات</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-slate-200">
              <td class="p-4">الشحن المجاني</td><td class="p-4">✗</td><td class="p-4">✓</td><td class="p-4">✓</td>
            </tr>
            <tr class="border-t border-slate-200">
              <td class="p-4">الدعم الفني</td><td class="p-4">بريد</td><td class="p-4">دردشة</td><td class="p-4">مدير حساب</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </main>

  <footer class="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
    © 2026 متجر التقنية
  </footer>

</body>` } },

    { t: 'quiz', items: [
      { q: 'ماذا تعني `md:flex`؟', options: ['flex على الشاشات المتوسطة فقط', 'flex من 768px فأعلى', 'flex أقل من 768px', 'flex دائماً'], answer: 1,
        explain: 'نقاط التوقف في Tailwind هي `min-width`، فتُطبَّق من ذلك الحجم فصاعداً.' },
      { q: 'ما الترتيب الصحيح في منهجية الجوال أولاً؟', options: ['`grid-cols-4 md:grid-cols-1`', '`grid-cols-1 md:grid-cols-4`', 'لا فرق', 'الأصغر أخيراً'], answer: 1,
        explain: 'ابدأ بالأبسط بلا بادئة ثم أضف تحسينات للشاشات الأكبر.' },
      { q: 'ما الفرق بين نقاط التوقف والاستعلامات الحاوية؟', options: ['لا فرق', 'الأولى تقيس نافذة العرض والثانية تقيس عرض الحاوية نفسها', 'العكس', 'الحاوية أقدم'], answer: 1,
        explain: 'الاستعلام الحاوي يجعل المكوّن يتكيّف مع المساحة المتاحة له فعلاً.' },
      { q: 'ما مشكلة `hidden md:block` على صورة ثقيلة؟', options: ['لا تعمل', 'الصورة تُحمَّل على الجوال رغم إخفائها', 'بطيئة', 'تكسر التخطيط'], answer: 1,
        explain: '`display:none` تخفي بصرياً لكن المورد يُنزَّل؛ استخدم `<picture>` أو `srcset`.' },
      { q: 'ما الحل لجدول عريض على الجوال؟', options: ['تصغير الخط', 'حاوية `overflow-x-auto` مع `min-w` على الجدول', 'حذف أعمدة', 'إخفاؤه'], answer: 1,
        explain: 'التمرير الأفقي يحفظ كل البيانات ويبقيها متاحة، مع `tabindex` لدعم لوحة المفاتيح.' }
    ]}
  ]
};
