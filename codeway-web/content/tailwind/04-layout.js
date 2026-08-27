'use strict';

module.exports = {
  slug: '04-layout',
  title: 'التخطيط: Flexbox و Grid',
  summary: 'بناء التخطيطات بأصناف Flexbox و Grid، والتموضع، والتحكّم في التدفّق.',
  duration: 50,
  level: 'متوسط',
  tags: ['Flexbox', 'Grid'],
  objectives: [
    'تبني تخطيطات مرنة بـ Flexbox.',
    'تنشئ شبكات ثنائية الأبعاد بـ Grid.',
    'تتحكّم في المحاذاة والتوزيع.',
    'تستخدم التموضع المطلق والثابت واللاصق.',
    'تختار بين Flexbox و Grid بوعي.'
  ],
  quickRef: [
    { code: 'flex / inline-flex', desc: 'تفعيل Flexbox' },
    { code: 'flex-col / flex-row', desc: 'اتجاه المحور' },
    { code: 'items-center', desc: 'محاذاة على المحور المتقاطع' },
    { code: 'justify-between', desc: 'توزيع على المحور الرئيسي' },
    { code: 'grid grid-cols-3', desc: 'شبكة بثلاثة أعمدة' },
    { code: 'col-span-2', desc: 'امتداد عبر عمودين' },
    { code: 'absolute inset-0', desc: 'تموضع مطلق يملأ الأب' },
    { code: 'sticky top-0', desc: 'تموضع لاصق' }
  ],
  blocks: [
    { t: 'h2', text: 'Flexbox: التخطيط أحادي البعد' },
    { t: 'code', lang: 'html', code: `
<div class="flex">…</div>          <!-- صف أفقي -->
<div class="flex flex-col">…</div> <!-- عمود رأسي -->
<div class="inline-flex">…</div>
<div class="flex flex-wrap">…</div> <!-- يلتفّ عند الضيق -->` },
    { t: 'note', title: 'انتباه للاتجاه', text: 'في صفحة `dir="rtl"` يبدأ `flex-row` من **اليمين** تلقائياً. لا تحتاج `flex-row-reverse` — استخدمها فقط إن أردت عكس الترتيب الطبيعي فعلاً.' },

    { t: 'h3', text: 'المحاذاة والتوزيع' },
    { t: 'code', lang: 'html', code: `
<!-- على المحور الرئيسي -->
<div class="flex justify-start">    <!-- البداية -->
<div class="flex justify-center">   <!-- الوسط -->
<div class="flex justify-end">      <!-- النهاية -->
<div class="flex justify-between">  <!-- المسافة بين العناصر -->
<div class="flex justify-around">   <!-- مسافة حول كل عنصر -->
<div class="flex justify-evenly">   <!-- مسافات متساوية -->

<!-- على المحور المتقاطع -->
<div class="flex items-start">
<div class="flex items-center">     <!-- الأكثر استخداماً -->
<div class="flex items-end">
<div class="flex items-stretch">    <!-- الافتراضي -->
<div class="flex items-baseline">   <!-- محاذاة خط الأساس -->` },
    { t: 'demo', title: 'خيارات التوزيع', height: 340,
      css: '.d{display:flex;background:#f1f5f9;border-radius:8px;padding:8px;margin-bottom:8px;min-height:48px}.d>span{background:#0ea5e9;color:#fff;padding:8px 14px;border-radius:6px;font-size:.82em}b{display:block;font-size:.78em;color:#64748b;margin-bottom:3px;font-family:monospace}',
      html: '<b>justify-start</b><div class="d" style="justify-content:flex-start"><span>1</span><span>2</span><span>3</span></div><b>justify-center</b><div class="d" style="justify-content:center"><span>1</span><span>2</span><span>3</span></div><b>justify-between</b><div class="d" style="justify-content:space-between"><span>1</span><span>2</span><span>3</span></div><b>justify-evenly</b><div class="d" style="justify-content:space-evenly"><span>1</span><span>2</span><span>3</span></div>' },
    { t: 'code', lang: 'html', title: 'التوسيط الكامل — النمط الأشهر', code: '<div class="flex min-h-dvh items-center justify-center">\n  <div>محتوى موسّط أفقياً ورأسياً</div>\n</div>' },

    { t: 'h3', text: 'مرونة العناصر' },
    { t: 'code', lang: 'html', code: `
<div class="flex gap-4">
  <div class="flex-1">يأخذ المساحة المتاحة</div>
  <div class="flex-none w-48">عرض ثابت</div>
</div>

<!-- التفاصيل -->
<div class="grow">     <!-- flex-grow: 1 -->
<div class="grow-0">   <!-- لا يتمدّد -->
<div class="shrink-0"> <!-- لا ينكمش — مهم للأيقونات -->
<div class="basis-1/3"><!-- الأساس 33% -->

<!-- محاذاة فردية -->
<div class="self-start">
<div class="self-center">
<div class="ms-auto">  <!-- يدفع العنصر إلى النهاية -->` },
    { t: 'demo', title: 'flex-1 مع عرض ثابت', height: 200,
      css: '.d{display:flex;gap:12px;background:#f1f5f9;border-radius:8px;padding:10px}.a{flex:1;background:#0ea5e9;color:#fff;padding:14px;border-radius:8px;text-align:center;font-size:.85em}.b{flex:none;width:110px;background:#f472b6;color:#fff;padding:14px;border-radius:8px;text-align:center;font-size:.85em}',
      html: '<div class="d"><div class="a">flex-1 — يتمدّد</div><div class="b">w-28 ثابت</div></div>' },
    { t: 'tip', text: '`shrink-0` ضرورية للأيقونات داخل flex: بدونها تنكمش الأيقونة وتتشوّه عندما يطول النص بجوارها.' },

    { t: 'h2', text: 'Grid: التخطيط ثنائي البعد' },
    { t: 'code', lang: 'html', code: `
<div class="grid grid-cols-3 gap-4">…</div>
<div class="grid grid-cols-12 gap-4">…</div>
<div class="grid grid-rows-3 grid-flow-col">…</div>

<!-- أعمدة مخصّصة -->
<div class="grid grid-cols-[280px_1fr]">…</div>
<div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">…</div>

<!-- امتداد -->
<div class="col-span-2">يمتد عبر عمودين</div>
<div class="col-span-full">كل الأعمدة</div>
<div class="row-span-2">صفّان</div>

<!-- موضع محدّد -->
<div class="col-start-2 col-end-4">` },
    { t: 'demo', title: 'شبكة بامتدادات', height: 300,
      css: '.g{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.g>div{background:#0ea5e9;color:#fff;padding:16px;border-radius:8px;text-align:center;font-size:.82em;font-weight:700}.s2{grid-column:span 2;background:#6366f1}.sf{grid-column:1/-1;background:#f472b6}',
      html: '<div class="g"><div class="s2">col-span-2</div><div>1</div><div>1</div><div class="s2">col-span-2</div><div class="sf">col-span-full</div></div>' },

    { t: 'h3', text: 'الشبكة التلقائية' },
    { t: 'code', lang: 'html', code: `
<!-- أعمدة تتكيّف مع العرض المتاح -->
<div class="grid gap-6 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
  <div>بطاقة</div>
  <div>بطاقة</div>
  <div>بطاقة</div>
</div>

<!-- أو بالطريقة المتجاوبة -->
<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  …
</div>` },
    { t: 'p', text: 'الطريقة الأولى «سائلة» تتكيّف تلقائياً بلا نقاط توقف. الثانية أوضح وأسهل قراءة. كلاهما صحيح — الأولى للمحتوى المتغيّر والثانية للتحكّم الدقيق.' },

    { t: 'h3', text: 'المحاذاة في Grid' },
    { t: 'code', lang: 'html', code: `
<div class="grid place-items-center">      <!-- توسيط كامل -->
<div class="grid place-content-center">    <!-- توسيط الشبكة كلها -->

<div class="grid items-center justify-items-start">
<div class="grid content-between justify-center">

<!-- على عنصر واحد -->
<div class="place-self-end">` },
    { t: 'tip', text: '`grid place-items-center` أقصر طريقة للتوسيط الكامل في CSS الحديثة — أقصر حتى من حلّ Flexbox.' },

    { t: 'h2', text: 'التموضع' },
    { t: 'code', lang: 'html', code: `
<div class="relative">      <!-- مرجع للأبناء المطلقين -->
  <div class="absolute top-0 end-0">في الزاوية</div>
  <div class="absolute inset-0">يملأ الأب</div>
  <div class="absolute inset-x-0 bottom-0">شريط سفلي</div>
</div>

<header class="sticky top-0 z-50">ترويسة لاصقة</header>
<div class="fixed bottom-6 end-6">زر عائم</div>

<!-- التوسيط المطلق -->
<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
  موسّط تماماً
</div>` },
    { t: 'demo', title: 'شارة على بطاقة', height: 240,
      css: '.card{position:relative;border:1px solid #e2e8f0;border-radius:12px;padding:20px;background:#fff;max-width:280px}.badge{position:absolute;inset-block-start:-10px;inset-inline-end:-10px;background:#f43f5e;color:#fff;padding:4px 12px;border-radius:999px;font-size:.75em;font-weight:700}.img{height:80px;background:linear-gradient(135deg,#38bdf8,#6366f1);border-radius:8px;margin-bottom:12px}',
      html: '<div class="card"><span class="badge">جديد</span><div class="img"></div><b>سماعة لاسلكية</b><p style="color:#64748b;font-size:.9em;margin:6px 0 0">299 ريالاً</p></div>' },
    { t: 'warn', title: 'الاتجاهات المنطقية في التموضع', text: 'استخدم `start-0` و `end-0` بدل `left-0` و `right-0` في المواقع العربية. الأولى تتبع `dir` فتضع العنصر في الجهة الصحيحة تلقائياً.' },

    { t: 'h2', text: 'التدفّق والظهور' },
    { t: 'code', lang: 'html', code: `
<div class="block">
<div class="inline-block">
<div class="hidden">        <!-- display: none -->
<div class="contents">      <!-- يزيل الصندوق ويُبقي الأبناء -->

<!-- الإخفاء المتجاوب -->
<div class="hidden md:block">يظهر على الشاشات الكبيرة فقط</div>
<div class="md:hidden">يظهر على الجوال فقط</div>

<!-- التمرير -->
<div class="overflow-hidden">
<div class="overflow-y-auto max-h-96">
<div class="overflow-x-auto">   <!-- للجداول العريضة -->` },

    { t: 'h2', text: 'Flexbox أم Grid؟' },
    { t: 'table', head: ['استخدم Flexbox', 'استخدم Grid'], rows: [
      ['صف أو عمود واحد', 'صفوف وأعمدة معاً'],
      ['المحتوى يحدّد الحجم', 'التخطيط يحدّد الحجم'],
      ['شريط تنقّل، أزرار متجاورة', 'تخطيط الصفحة، معرض بطاقات'],
      ['توزيع مساحة متبقّية', 'مواضع محدّدة وامتدادات'],
      ['ترتيب العناصر مرن', 'بنية ثابتة معروفة']
    ]},
    { t: 'p', text: 'القاعدة العملية: **Grid للتخطيط العام، Flexbox للمكوّنات الداخلية**. وكثيراً ما تستخدمهما معاً: شبكة للصفحة، وflex داخل كل بطاقة.' },

    { t: 'h2', text: 'تخطيط كامل' },
    { t: 'code', lang: 'html', code: `
<body class="flex min-h-dvh flex-col bg-slate-50">

  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <span class="text-xl font-extrabold">شعار</span>
      <nav class="hidden gap-6 md:flex">
        <a href="#">الرئيسية</a>
        <a href="#">المنتجات</a>
      </nav>
      <button class="md:hidden">☰</button>
    </div>
  </header>

  <main class="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
    <div class="grid gap-8 lg:grid-cols-[260px_1fr]">

      <aside class="flex flex-col gap-3">
        <div class="rounded-xl bg-white p-4">التصنيفات</div>
      </aside>

      <section class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <article class="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
          <div class="mb-4 aspect-video rounded-lg bg-slate-100"></div>
          <h3 class="font-bold">اسم المنتج</h3>
          <p class="mt-1 flex-1 text-sm text-slate-500">وصف قصير</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="font-extrabold text-sky-600">299 ر.س</span>
            <button class="rounded-lg bg-sky-600 px-3 py-1.5 text-sm text-white">أضف</button>
          </div>
        </article>
      </section>

    </div>
  </main>

  <footer class="border-t border-slate-200 bg-white py-8 text-center text-slate-500">
    © 2026
  </footer>

</body>` },
    { t: 'note', title: 'حيلة الفوتر اللاصق', text: '`flex min-h-dvh flex-col` على `body` مع `flex-1` على `main` تدفع الفوتر إلى الأسفل دائماً — حتى لو كان المحتوى قصيراً. نمط تحتاجه في كل مشروع.' },

    { t: 'exercise',
      title: 'تمرين: صفحة معرض أعمال',
      brief: 'ابنِ صفحة كاملة بـ Flexbox و Grid فقط.',
      requirements: [
        'ترويسة لاصقة بشعار وقائمة تظهر على الشاشات المتوسطة فقط، وزر قائمة للجوال.',
        'قسم بطل بارتفاع نصف الشاشة ومحتوى موسّط تماماً.',
        'شبكة مشاريع: عمود على الجوال، عمودان على `sm`، ثلاثة على `lg`.',
        'أول مشروع يمتد عبر عمودين على الشاشات الكبيرة.',
        'كل بطاقة `flex flex-col` مع وصف `flex-1` كي تتساوى ارتفاعات الأزرار.',
        'شارة «مميّز» متموضعة مطلقاً في زاوية أول بطاقة بالاتجاه المنطقي.',
        'قسم إحصائيات بأربعة أعمدة موزّعة بالتساوي.',
        'فوتر ملتصق بالأسفل دائماً.',
        'زر عائم ثابت في الزاوية السفلية.'
      ],
      hints: [
        '`flex min-h-dvh flex-col` على body و `flex-1` على main.',
        '`col-span-2` مع بادئة `lg:` للامتداد المتجاوب.',
        '`flex-1` على الوصف يدفع الزر لأسفل البطاقة.'
      ],
      solution: { lang: 'html', code: `
<body class="flex min-h-dvh flex-col bg-slate-50 font-sans">

  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <span class="text-xl font-extrabold text-slate-900">أعمالي</span>
      <nav class="hidden gap-6 text-slate-600 md:flex">
        <a class="hover:text-sky-600" href="#">المشاريع</a>
        <a class="hover:text-sky-600" href="#">عني</a>
        <a class="hover:text-sky-600" href="#">تواصل</a>
      </nav>
      <button class="text-2xl md:hidden" aria-label="القائمة">☰</button>
    </div>
  </header>

  <main class="flex-1">

    <!-- البطل -->
    <section class="flex min-h-[50dvh] items-center justify-center bg-gradient-to-bl from-sky-500 to-indigo-600 px-6 text-center">
      <div>
        <h1 class="text-4xl font-extrabold text-white sm:text-5xl">
          سارة عبدالله
        </h1>
        <p class="mt-4 text-lg text-sky-100">مطوّرة واجهات أمامية</p>
        <button class="mt-8 rounded-full bg-white px-8 py-3 font-bold text-sky-600">
          تصفّح المشاريع
        </button>
      </div>
    </section>

    <!-- المشاريع -->
    <section class="mx-auto max-w-6xl px-6 py-16">
      <h2 class="mb-8 text-3xl font-extrabold text-slate-900">المشاريع</h2>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <article class="relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <span class="absolute -top-3 end-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">
            مميّز
          </span>
          <div class="mb-4 aspect-video rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500"></div>
          <h3 class="text-lg font-bold text-slate-900">متجر رفوف</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
            متجر إلكتروني لبيع الكتب المستعملة بواجهة عربية متجاوبة ولوحة تحكّم كاملة.
          </p>
          <button class="mt-4 rounded-lg bg-sky-600 py-2 font-bold text-white">عرض المشروع</button>
        </article>

        <article class="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
          <div class="mb-4 aspect-video rounded-lg bg-slate-100"></div>
          <h3 class="text-lg font-bold text-slate-900">لوحة نبض</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
            لوحة مؤشرات أداء بالوضع الليلي.
          </p>
          <button class="mt-4 rounded-lg bg-sky-600 py-2 font-bold text-white">عرض المشروع</button>
        </article>

        <article class="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
          <div class="mb-4 aspect-video rounded-lg bg-slate-100"></div>
          <h3 class="text-lg font-bold text-slate-900">مدونة حرف</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
            مدونة تركّز على قابلية القراءة.
          </p>
          <button class="mt-4 rounded-lg bg-sky-600 py-2 font-bold text-white">عرض المشروع</button>
        </article>

      </div>
    </section>

    <!-- الإحصائيات -->
    <section class="border-y border-slate-200 bg-white py-12">
      <div class="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
        <div><p class="text-3xl font-extrabold text-sky-600">32</p><p class="mt-1 text-sm text-slate-500">مشروعاً</p></div>
        <div><p class="text-3xl font-extrabold text-sky-600">18</p><p class="mt-1 text-sm text-slate-500">عميلاً</p></div>
        <div><p class="text-3xl font-extrabold text-sky-600">3</p><p class="mt-1 text-sm text-slate-500">سنوات خبرة</p></div>
        <div><p class="text-3xl font-extrabold text-sky-600">5</p><p class="mt-1 text-sm text-slate-500">جوائز</p></div>
      </div>
    </section>

  </main>

  <footer class="border-t border-slate-200 bg-white py-8 text-center text-slate-500">
    © 2026 سارة عبدالله
  </footer>

  <a href="#" class="fixed bottom-6 end-6 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-2xl text-white shadow-lg">
    ↑
  </a>

</body>` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق بين `justify-*` و `items-*` في Flexbox؟', options: ['لا فرق', '`justify` على المحور الرئيسي و`items` على المتقاطع', 'العكس', '`items` للشبكة'], answer: 1,
        explain: 'في `flex-row` المحور الرئيسي أفقي والمتقاطع رأسي، والعكس في `flex-col`.' },
      { q: 'متى تستخدم Grid بدل Flexbox؟', options: ['دائماً', 'حين تحتاج صفوفاً وأعمدة معاً وبنية محدّدة', 'مع النصوص', 'مع الأزرار'], answer: 1,
        explain: 'Flexbox أحادي البعد؛ Grid ثنائي البعد بمواضع وامتدادات.' },
      { q: 'كيف تجعل الفوتر ملتصقاً بالأسفل دائماً؟', options: ['`position: fixed`', '`flex min-h-dvh flex-col` على body و `flex-1` على main', '`margin-top: auto` فقط', '`absolute bottom-0`'], answer: 1,
        explain: 'المحتوى يتمدّد ليملأ المساحة فيُدفع الفوتر للأسفل بلا تغطية للمحتوى.' },
      { q: 'ما فائدة `shrink-0` على أيقونة داخل flex؟', options: ['تكبيرها', 'منعها من الانكماش والتشوّه عندما يطول النص المجاور', 'إخفاؤها', 'توسيطها'], answer: 1,
        explain: 'العناصر المرنة تنكمش افتراضياً؛ الأيقونات يجب أن تحتفظ بحجمها.' },
      { q: 'لماذا نستخدم `end-6` بدل `right-6` في موقع عربي؟', options: ['أقصر', 'لأنها تتبع اتجاه الصفحة فتعمل في RTL و LTR', 'أسرع', 'أدقّ'], answer: 1,
        explain: 'الخصائص المنطقية تنعكس تلقائياً مع تغيّر `dir`.' }
    ]}
  ]
};
