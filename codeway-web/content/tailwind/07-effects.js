'use strict';

module.exports = {
  slug: '07-effects',
  title: 'الحدود والظلال والتأثيرات والحركات',
  summary: 'إضافة العمق والحركة: الحدود والحواف، الظلال، الفلاتر، التحويلات، الانتقالات، والحركات الجاهزة.',
  duration: 45,
  level: 'متوسط',
  tags: ['التأثيرات', 'الحركات'],
  objectives: [
    'تتحكّم في الحدود والحواف الدائرية.',
    'تستخدم الظلال والحلقات لإبراز العناصر.',
    'تطبّق الفلاتر والضبابية.',
    'تحرّك العناصر بالتحويلات والانتقالات.',
    'تستخدم الحركات الجاهزة وتنشئ حركات مخصّصة.'
  ],
  quickRef: [
    { code: 'border / border-2 / border-s', desc: 'الحدود' },
    { code: 'rounded-lg / rounded-full', desc: 'الحواف الدائرية' },
    { code: 'shadow-md / shadow-indigo-500/30', desc: 'الظلال' },
    { code: 'ring-2 ring-sky-500', desc: 'حلقة خارجية' },
    { code: 'backdrop-blur-sm', desc: 'ضبابية الخلفية' },
    { code: 'transition duration-300', desc: 'الانتقال' },
    { code: 'scale-105 rotate-3', desc: 'التحويلات' },
    { code: 'animate-spin / animate-pulse', desc: 'حركات جاهزة' }
  ],
  blocks: [
    { t: 'h2', text: 'الحدود' },
    { t: 'code', lang: 'html', code: `
<div class="border">              <!-- 1px -->
<div class="border-2">            <!-- 2px -->
<div class="border-4">

<!-- جهة واحدة -->
<div class="border-t">            <!-- أعلى -->
<div class="border-b-2">
<div class="border-s-4">          <!-- البداية — منطقية -->
<div class="border-e">            <!-- النهاية -->

<!-- النمط واللون -->
<div class="border border-dashed border-slate-300">
<div class="border-2 border-dotted border-sky-500">

<!-- فواصل بين الأبناء -->
<div class="divide-y divide-slate-200">
  <div>عنصر</div>
  <div>عنصر</div>
</div>` },
    { t: 'demo', title: 'أنماط الحدود', height: 200,
      css: '.g{display:flex;gap:10px;flex-wrap:wrap}.b{padding:14px 18px;border-radius:8px;font-size:.85em}',
      html: '<div class="g"><div class="b" style="border:1px solid #cbd5e1">border</div><div class="b" style="border:2px solid #0ea5e9">border-2</div><div class="b" style="border:2px dashed #f472b6">dashed</div><div class="b" style="border-inline-start:4px solid #0ea5e9;background:#f0f9ff">border-s-4</div></div>' },

    { t: 'h3', text: 'الحواف الدائرية' },
    { t: 'code', lang: 'html', code: `
<div class="rounded-none">
<div class="rounded-sm">     <!-- 0.125rem -->
<div class="rounded">        <!-- 0.25rem -->
<div class="rounded-md">     <!-- 0.375rem -->
<div class="rounded-lg">     <!-- 0.5rem -->
<div class="rounded-xl">     <!-- 0.75rem -->
<div class="rounded-2xl">    <!-- 1rem -->
<div class="rounded-3xl">    <!-- 1.5rem -->
<div class="rounded-full">   <!-- دائري كامل -->

<!-- جهات محدّدة -->
<div class="rounded-t-xl">
<div class="rounded-s-lg">   <!-- جهة البداية -->
<div class="rounded-ss-2xl"> <!-- الزاوية العلوية من جهة البداية -->` },
    { t: 'demo', title: 'مقياس الحواف', height: 190,
      css: '.g{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.b{width:64px;height:64px;background:#0ea5e9;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.68em;font-family:monospace}',
      html: '<div class="g"><div class="b" style="border-radius:0">none</div><div class="b" style="border-radius:.25rem">base</div><div class="b" style="border-radius:.5rem">lg</div><div class="b" style="border-radius:1rem">2xl</div><div class="b" style="border-radius:1.5rem">3xl</div><div class="b" style="border-radius:999px">full</div></div>' },

    { t: 'h2', text: 'الظلال' },
    { t: 'code', lang: 'html', code: `
<div class="shadow-sm">
<div class="shadow">
<div class="shadow-md">
<div class="shadow-lg">
<div class="shadow-xl">
<div class="shadow-2xl">
<div class="shadow-none">
<div class="shadow-inner">      <!-- ظل داخلي -->

<!-- ظلال ملوّنة -->
<div class="shadow-lg shadow-sky-500/30">
<div class="shadow-xl shadow-indigo-500/40">` },
    { t: 'demo', title: 'مقياس الظلال', height: 220,
      css: '.g{display:flex;gap:16px;flex-wrap:wrap;padding:14px}.b{width:80px;height:64px;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:.72em;color:#64748b}',
      html: '<div class="g"><div class="b" style="box-shadow:0 1px 2px rgba(0,0,0,.05)">sm</div><div class="b" style="box-shadow:0 4px 6px -1px rgba(0,0,0,.1)">md</div><div class="b" style="box-shadow:0 10px 15px -3px rgba(0,0,0,.1)">lg</div><div class="b" style="box-shadow:0 20px 25px -5px rgba(0,0,0,.1)">xl</div><div class="b" style="box-shadow:0 20px 40px -10px rgba(14,165,233,.5)">ملوّن</div></div>' },
    { t: 'tip', text: 'الظل الملوّن حيلة تصميمية أنيقة: `shadow-lg shadow-sky-500/30` تحت زر أزرق تعطي إحساساً بالتوهّج بدل الظل الرمادي الجاف.' },

    { t: 'h3', text: 'الحلقات (Rings)' },
    { t: 'code', lang: 'html', code: `
<button class="ring-2 ring-sky-500 ring-offset-2">حلقة</button>
<input class="focus:ring-2 focus:ring-sky-300">
<div class="ring-1 ring-slate-900/5">حلقة خفيفة كحدّ</div>` },
    { t: 'note', text: 'الحلقة ظل خارجي لا يؤثّر في أبعاد العنصر — بخلاف `border` التي تضيف عرضاً. لهذا هي الخيار الأمثل لمؤشّر التركيز: لا تسبّب قفزة في التخطيط.' },

    { t: 'h2', text: 'الفلاتر' },
    { t: 'code', lang: 'html', code: `
<img class="blur-sm">
<img class="brightness-125">
<img class="contrast-150">
<img class="grayscale">
<img class="sepia">
<img class="saturate-150">
<img class="invert">
<img class="hue-rotate-90">

<!-- تركيب -->
<img class="grayscale transition hover:grayscale-0">

<!-- فلتر الخلفية -->
<div class="backdrop-blur-md bg-white/70">زجاجي</div>` },
    { t: 'demo', title: 'تأثير الزجاج', height: 230,
      css: '.bg{background:linear-gradient(135deg,#38bdf8,#a855f7,#f472b6);padding:24px;border-radius:14px}.glass{backdrop-filter:blur(12px);background:rgba(255,255,255,.65);border:1px solid rgba(255,255,255,.4);border-radius:12px;padding:18px;text-align:center;font-weight:700;color:#0f172a}',
      html: '<div class="bg"><div class="glass">backdrop-blur-md bg-white/70</div></div>' },
    { t: 'demo', title: 'صورة رمادية تتلوّن عند المرور', height: 200,
      css: '.im{width:100%;max-width:280px;height:110px;background:linear-gradient(135deg,#0ea5e9,#f43f5e);border-radius:12px;filter:grayscale(1);transition:.4s;cursor:pointer}.im:hover{filter:grayscale(0)}',
      html: '<div class="im"></div><p style="color:#64748b;font-size:.86em;margin-top:8px">مرّر المؤشّر لترى التأثير</p>' },

    { t: 'h2', text: 'التحويلات' },
    { t: 'code', lang: 'html', code: `
<div class="scale-105">        <!-- تكبير 105% -->
<div class="scale-95">
<div class="rotate-3">          <!-- تدوير 3 درجات -->
<div class="-rotate-6">
<div class="translate-x-4">     <!-- إزاحة -->
<div class="-translate-y-2">
<div class="skew-x-6">          <!-- إمالة -->

<!-- نقطة الأصل -->
<div class="origin-top-left scale-110">

<!-- تحويلات ثلاثية الأبعاد -->
<div class="perspective-1000">
  <div class="rotate-y-12 transform-3d">…</div>
</div>` },
    { t: 'demo', title: 'التحويلات عند المرور', height: 220,
      css: '.g{display:flex;gap:14px;flex-wrap:wrap;padding:16px}.b{width:88px;height:66px;background:#0ea5e9;color:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:.72em;transition:.3s;cursor:pointer;font-family:monospace}.s:hover{transform:scale(1.15)}.r:hover{transform:rotate(8deg)}.t:hover{transform:translateY(-10px)}.k:hover{transform:skewX(-8deg)}',
      html: '<div class="g"><div class="b s">scale-110</div><div class="b r">rotate-6</div><div class="b t">-translate-y</div><div class="b k">skew-x</div></div>' },

    { t: 'h2', text: 'الانتقالات' },
    { t: 'code', lang: 'html', code: `
<button class="transition">                     <!-- الخصائص الشائعة -->
<button class="transition-all">
<button class="transition-colors">
<button class="transition-transform">
<button class="transition-opacity">

<!-- المدة -->
<button class="transition duration-150">
<button class="transition duration-300">
<button class="transition duration-500">

<!-- منحنى السرعة -->
<button class="transition ease-in">
<button class="transition ease-out">
<button class="transition ease-in-out">

<!-- التأخير -->
<button class="transition delay-150">` },
    { t: 'warn', title: 'تجنّب `transition-all`', text: 'تراقب **كل** الخصائص وقد تسبّب إعادة تخطيط مكلفة. حدّد ما تحتاجه: `transition-colors` أو `transition-transform` أو `transition` المختصرة التي تغطّي الشائع.' },
    { t: 'code', lang: 'html', title: 'زر متقن', code: `
<button class="rounded-lg bg-sky-600 px-6 py-3 font-bold text-white
               transition duration-200
               hover:bg-sky-700 hover:-translate-y-0.5 hover:shadow-lg
               active:translate-y-0 active:scale-95
               motion-reduce:transform-none">
  اشترك الآن
</button>` },
    { t: 'demo', title: 'جرّب الزر', height: 190,
      css: 'button{border-radius:10px;background:#0284c7;padding:12px 28px;font-weight:700;color:#fff;border:0;cursor:pointer;font-family:inherit;transition:.2s}button:hover{background:#0369a1;transform:translateY(-2px);box-shadow:0 10px 20px rgba(2,132,199,.3)}button:active{transform:translateY(0) scale(.95)}',
      html: '<button>اشترك الآن</button>' },

    { t: 'h2', text: 'الحركات الجاهزة' },
    { t: 'code', lang: 'html', code: `
<div class="animate-spin">دوران — للتحميل</div>
<div class="animate-ping">نبضة متوسّعة — للتنبيهات</div>
<div class="animate-pulse">نبض — للهياكل العظمية</div>
<div class="animate-bounce">قفز — للأسهم</div>
<div class="animate-none">إيقاف</div>` },
    { t: 'demo', title: 'الحركات الأربع', height: 220,
      css: '@keyframes sp{to{transform:rotate(360deg)}}@keyframes pu{50%{opacity:.4}}@keyframes bo{0%,100%{transform:translateY(-20%)}50%{transform:translateY(0)}}@keyframes pi{75%,100%{transform:scale(2);opacity:0}}.g{display:flex;gap:28px;padding:20px;align-items:center;justify-content:center}.i{width:34px;height:34px;border-radius:8px;background:#0ea5e9}.sp{animation:sp 1s linear infinite;border-radius:50%;border:4px solid #bae6fd;border-top-color:#0284c7;background:none}.pu{animation:pu 2s ease-in-out infinite}.bo{animation:bo 1s infinite}.pw{position:relative}.pi{position:absolute;inset:0;border-radius:8px;background:#0ea5e9;animation:pi 1.2s cubic-bezier(0,0,.2,1) infinite}small{display:block;text-align:center;font-size:.7em;color:#64748b;margin-top:6px}',
      html: '<div class="g"><div><div class="i sp"></div><small>spin</small></div><div><div class="i pu"></div><small>pulse</small></div><div><div class="i bo"></div><small>bounce</small></div><div><div class="i pw"><span class="pi"></span></div><small>ping</small></div></div>' },
    { t: 'code', lang: 'html', title: 'هيكل تحميل (Skeleton)', code: `
<div class="animate-pulse space-y-3">
  <div class="h-4 w-3/4 rounded bg-slate-200"></div>
  <div class="h-4 rounded bg-slate-200"></div>
  <div class="h-4 w-1/2 rounded bg-slate-200"></div>
</div>` },
    { t: 'demo', title: 'هيكل تحميل', height: 190,
      css: '@keyframes pu{50%{opacity:.45}}.sk{animation:pu 2s ease-in-out infinite}.l{height:16px;border-radius:6px;background:#e2e8f0;margin-bottom:12px}',
      html: '<div class="sk"><div class="l" style="width:75%"></div><div class="l"></div><div class="l" style="width:50%"></div></div>' },

    { t: 'h3', text: 'حركات مخصّصة' },
    { t: 'code', lang: 'css', title: 'style.css', code: `
@import "tailwindcss";

@theme {
  --animate-fade-up: fade-up .5s ease-out;
  --animate-shimmer: shimmer 2s linear infinite;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}` },
    { t: 'code', lang: 'html', code: '<div class="animate-fade-up">يظهر صاعداً</div>' },

    { t: 'h2', text: 'احترام تفضيل الحركة' },
    { t: 'code', lang: 'html', code: `
<div class="motion-safe:animate-bounce">يتحرّك فقط إن سمح المستخدم</div>
<div class="animate-spin motion-reduce:animate-none">يتوقّف إن طلب التقليل</div>
<button class="transition hover:scale-105 motion-reduce:transform-none">زر</button>` },
    { t: 'danger', title: 'مسؤولية أخلاقية', text: 'بعض المستخدمين تسبّب لهم الحركة دواراً وغثياناً حقيقياً (اضطراب الدهليز). نظام التشغيل يوفّر إعداد «تقليل الحركة» — احترامه ليس تحسيناً اختيارياً بل واجب إمكانية وصول.' },

    { t: 'h2', text: 'مكوّنات بتأثيرات متقنة' },
    { t: 'code', lang: 'html', title: 'بطاقة زجاجية', code: `
<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-600 p-8">
  <div class="rounded-2xl border border-white/30 bg-white/20 p-6 backdrop-blur-xl">
    <h3 class="text-xl font-bold text-white">بطاقة زجاجية</h3>
    <p class="mt-2 text-white/80">تأثير Glassmorphism</p>
  </div>
</div>` },
    { t: 'code', lang: 'html', title: 'زر بتوهّج', code: `
<button class="group relative overflow-hidden rounded-full bg-slate-900 px-8 py-3 font-bold text-white">
  <span class="relative z-10">ابدأ الآن</span>
  <span class="absolute inset-0 -translate-x-full bg-gradient-to-r from-sky-500 to-indigo-500
               transition-transform duration-300 group-hover:translate-x-0"></span>
</button>` },
    { t: 'demo', title: 'المكوّنان', height: 300,
      css: '.wrap{border-radius:24px;background:linear-gradient(135deg,#38bdf8,#4f46e5);padding:24px;margin-bottom:16px}.glass{border-radius:16px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.2);backdrop-filter:blur(16px);padding:20px}.glass h3{margin:0;color:#fff;font-size:1.15rem}.glass p{margin:6px 0 0;color:rgba(255,255,255,.85);font-size:.9em}.gb{position:relative;overflow:hidden;border-radius:999px;background:#0f172a;padding:12px 32px;font-weight:700;color:#fff;border:0;cursor:pointer;font-family:inherit}.gb span{position:relative;z-index:1}.gb::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#0ea5e9,#6366f1);transform:translateX(100%);transition:transform .3s}.gb:hover::before{transform:translateX(0)}',
      html: '<div class="wrap"><div class="glass"><h3>بطاقة زجاجية</h3><p>تأثير Glassmorphism بـ backdrop-blur</p></div></div><button class="gb"><span>ابدأ الآن — مرّر المؤشّر</span></button>' },

    { t: 'exercise',
      title: 'تمرين: مكتبة تأثيرات',
      brief: 'ابنِ ستة مكوّنات كل منها يبرز تأثيراً مختلفاً.',
      requirements: [
        '**بطاقة بظل ملوّن** ترتفع وتزيد ظلّها عند المرور.',
        '**بطاقة زجاجية** فوق خلفية متدرّجة بـ `backdrop-blur`.',
        '**زر بتوهّج** يزحف من جهة البداية عند المرور.',
        '**صورة رمادية** تتلوّن وتتكبّر قليلاً عند المرور.',
        '**هيكل تحميل** بثلاثة أسطر و`animate-pulse`.',
        '**مؤشّر تحميل دائري** بـ `animate-spin` وحدود ملوّنة.',
        'حركة مخصّصة `fade-up` معرّفة في `@theme` ومستخدمة.',
        'كل الحركات محمية بـ `motion-safe:` أو `motion-reduce:`.',
        'كل عنصر تفاعلي له `focus-visible:ring`.'
      ],
      hints: [
        'مؤشّر التحميل: `rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin`.',
        'الزر المتوهّج يحتاج `relative overflow-hidden` على الأب و`absolute` على الطبقة.',
        '`ring-offset-2` تترك مسافة بين الحلقة والعنصر.'
      ],
      solution: { lang: 'html', code: `
<body class="bg-slate-50 p-8">
<div class="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">

  <!-- 1) بطاقة بظل ملوّن -->
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-sky-500/10
              transition duration-300
              motion-safe:hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/30">
    <h3 class="text-lg font-bold">ظل ملوّن</h3>
    <p class="mt-2 text-sm text-slate-500">يرتفع ويتوهّج عند المرور.</p>
  </div>

  <!-- 2) بطاقة زجاجية -->
  <div class="rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6">
    <div class="rounded-xl border border-white/30 bg-white/20 p-5 backdrop-blur-xl">
      <h3 class="text-lg font-bold text-white">بطاقة زجاجية</h3>
      <p class="mt-2 text-sm text-white/80">Glassmorphism</p>
    </div>
  </div>

  <!-- 3) زر بتوهّج -->
  <button class="group relative overflow-hidden rounded-full bg-slate-900 px-8 py-4 font-bold text-white
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
    <span class="relative z-10">ابدأ الآن</span>
    <span class="absolute inset-0 translate-x-full bg-gradient-to-l from-sky-500 to-indigo-500
                 transition-transform duration-300 group-hover:translate-x-0
                 motion-reduce:transition-none"></span>
  </button>

  <!-- 4) صورة رمادية -->
  <div class="overflow-hidden rounded-2xl">
    <div class="aspect-video bg-gradient-to-br from-rose-400 to-indigo-600 grayscale
                transition duration-500
                hover:grayscale-0 motion-safe:hover:scale-105
                motion-reduce:transform-none"></div>
  </div>

  <!-- 5) هيكل تحميل -->
  <div class="rounded-2xl border border-slate-200 bg-white p-6">
    <div class="animate-pulse motion-reduce:animate-none space-y-3">
      <div class="h-4 w-3/4 rounded bg-slate-200"></div>
      <div class="h-4 rounded bg-slate-200"></div>
      <div class="h-4 w-1/2 rounded bg-slate-200"></div>
    </div>
  </div>

  <!-- 6) مؤشّر تحميل -->
  <div class="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6">
    <div class="h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600
                motion-reduce:animate-none"></div>
    <span class="text-slate-500">جارٍ التحميل…</span>
  </div>

  <!-- 7) حركة مخصّصة -->
  <div class="motion-safe:animate-fade-up rounded-2xl border border-slate-200 bg-white p-6 sm:col-span-2">
    <h3 class="text-lg font-bold">حركة مخصّصة</h3>
    <p class="mt-2 text-sm text-slate-500">
      معرّفة في <code class="rounded bg-slate-100 px-1">@theme</code> باسم fade-up.
    </p>
  </div>

</div>
</body>

<!-- في style.css:

@import "tailwindcss";

@theme {
  --animate-fade-up: fade-up .5s ease-out;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
-->` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق بين `ring` و `border`؟', options: ['لا فرق', 'الحلقة ظل خارجي لا يغيّر أبعاد العنصر بخلاف الحد', 'الحلقة أعرض', 'الحد أحدث'], answer: 1,
        explain: 'لهذا الحلقة مثالية لمؤشّر التركيز: لا تسبّب قفزة في التخطيط.' },
      { q: 'لماذا يُنصح بتجنّب `transition-all`؟', options: ['غير مدعومة', 'تراقب كل الخصائص وقد تسبّب إعادة تخطيط مكلفة', 'أبطأ في الكتابة', 'لا تعمل مع hover'], answer: 1,
        explain: 'حدّد الخصائص المطلوبة: `transition-colors` أو `transition-transform`.' },
      { q: 'أي حركة تناسب هيكل التحميل؟', options: ['`animate-spin`', '`animate-pulse`', '`animate-bounce`', '`animate-ping`'], answer: 1,
        explain: '`pulse` تعطي إحساس «جارٍ التحميل» بتغيّر الشفافية بهدوء.' },
      { q: 'ما وظيفة `backdrop-blur`؟', options: ['تشويش العنصر', 'تشويش ما خلف العنصر لتأثير الزجاج', 'تغميق الخلفية', 'إخفاء العنصر'], answer: 1,
        explain: '`blur` تشوّش العنصر نفسه؛ `backdrop-blur` تشوّش ما وراءه.' },
      { q: 'لماذا نستخدم `motion-reduce:`؟', options: ['أداء', 'احترام المستخدمين الذين تسبّب لهم الحركة دواراً حقيقياً', 'توفير بطارية', 'دعم المتصفحات'], answer: 1,
        explain: 'واجب إمكانية وصول لا تحسين اختياري.' }
    ]}
  ]
};
