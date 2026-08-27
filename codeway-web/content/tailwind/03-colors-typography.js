'use strict';

module.exports = {
  slug: '03-colors-typography',
  title: 'الألوان والطباعة',
  summary: 'لوحة الألوان ودرجاتها، والخلفيات والتدرّجات، وكل ما يخصّ النص من حجم ووزن وتباعد.',
  duration: 45,
  level: 'مبتدئ',
  tags: ['الألوان', 'الطباعة'],
  objectives: [
    'تستخدم لوحة الألوان ودرجاتها بوعي.',
    'تطبّق الألوان على النص والخلفية والحدود.',
    'تنشئ تدرّجات لونية.',
    'تتحكّم في كل خصائص النص.',
    'تضبط الطباعة العربية بشكل صحيح.'
  ],
  quickRef: [
    { code: 'text-slate-500', desc: 'لون النص' },
    { code: 'bg-indigo-600', desc: 'لون الخلفية' },
    { code: 'border-red-400', desc: 'لون الحد' },
    { code: 'bg-black/50', desc: 'لون بشفافية 50%' },
    { code: 'text-lg / text-3xl', desc: 'حجم الخط' },
    { code: 'font-bold', desc: 'وزن الخط' },
    { code: 'leading-relaxed', desc: 'ارتفاع السطر' },
    { code: 'line-clamp-3', desc: 'اقتطاع بعدد أسطر' }
  ],
  blocks: [
    { t: 'h2', text: 'نظام الألوان' },
    { t: 'p', text: 'كل لون في Tailwind له **11 درجة** من 50 (أفتح) إلى 950 (أغمق). هذا النظام المدروس يغنيك عن اختيار الألوان يدوياً ويضمن تباينات متناسقة.' },
    { t: 'demo', title: 'درجات اللون الواحد', height: 300,
      css: '.row{display:flex;margin-bottom:10px;border-radius:8px;overflow:hidden}.c{flex:1;height:44px;display:flex;align-items:center;justify-content:center;font-size:.68em;font-family:monospace}b{display:block;font-size:.85em;margin-bottom:4px;color:#475569}',
      html: '<b>indigo</b><div class="row"><span class="c" style="background:#eef2ff;color:#312e81">50</span><span class="c" style="background:#e0e7ff;color:#312e81">100</span><span class="c" style="background:#c7d2fe;color:#312e81">200</span><span class="c" style="background:#a5b4fc;color:#312e81">300</span><span class="c" style="background:#818cf8;color:#fff">400</span><span class="c" style="background:#6366f1;color:#fff">500</span><span class="c" style="background:#4f46e5;color:#fff">600</span><span class="c" style="background:#4338ca;color:#fff">700</span><span class="c" style="background:#3730a3;color:#fff">800</span><span class="c" style="background:#312e81;color:#fff">900</span></div><b>slate</b><div class="row"><span class="c" style="background:#f8fafc;color:#0f172a">50</span><span class="c" style="background:#f1f5f9;color:#0f172a">100</span><span class="c" style="background:#e2e8f0;color:#0f172a">200</span><span class="c" style="background:#cbd5e1;color:#0f172a">300</span><span class="c" style="background:#94a3b8;color:#fff">400</span><span class="c" style="background:#64748b;color:#fff">500</span><span class="c" style="background:#475569;color:#fff">600</span><span class="c" style="background:#334155;color:#fff">700</span><span class="c" style="background:#1e293b;color:#fff">800</span><span class="c" style="background:#0f172a;color:#fff">900</span></div><b>rose</b><div class="row"><span class="c" style="background:#fff1f2;color:#881337">50</span><span class="c" style="background:#ffe4e6;color:#881337">100</span><span class="c" style="background:#fecdd3;color:#881337">200</span><span class="c" style="background:#fda4af;color:#881337">300</span><span class="c" style="background:#fb7185;color:#fff">400</span><span class="c" style="background:#f43f5e;color:#fff">500</span><span class="c" style="background:#e11d48;color:#fff">600</span><span class="c" style="background:#be123c;color:#fff">700</span><span class="c" style="background:#9f1239;color:#fff">800</span><span class="c" style="background:#881337;color:#fff">900</span></div>' },
    { t: 'table', head: ['الدرجة', 'الاستخدام النموذجي'], rows: [
      ['50 – 100', 'خلفيات فاتحة جداً، تظليل خفيف'],
      ['200 – 300', 'الحدود والفواصل'],
      ['400 – 500', 'الأيقونات والنص الثانوي والألوان الأساسية'],
      ['600 – 700', 'الأزرار والروابط وحالة hover'],
      ['800 – 950', 'النص الأساسي وخلفيات الوضع الليلي']
    ]},
    { t: 'p', text: 'الألوان المتاحة: `slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` — إضافة إلى `white` و `black` و `transparent` و `current`.' },

    { t: 'h3', text: 'تطبيق الألوان' },
    { t: 'code', lang: 'html', code: `
<p class="text-slate-600">نص رمادي</p>
<div class="bg-indigo-600">خلفية بنفسجية</div>
<div class="border-2 border-rose-400">حد وردي</div>
<div class="divide-y divide-slate-200">فواصل بين الأبناء</div>
<svg class="fill-sky-500 stroke-sky-700">…</svg>
<div class="shadow-lg shadow-indigo-500/30">ظل ملوّن</div>

<!-- الشفافية بالشرطة المائلة -->
<div class="bg-black/50">أسود بشفافية 50%</div>
<p class="text-white/70">أبيض بشفافية 70%</p>
<div class="border-indigo-500/20">حد شفاف</div>` },
    { t: 'tip', text: 'صياغة `/` للشفافية من أفضل ما في Tailwind: `bg-black/50` أوضح وأقصر من `rgba(0,0,0,.5)`، وتعمل مع أي لون وأي درجة.' },
    { t: 'demo', title: 'الشفافية', height: 190,
      css: '.wrap{background:linear-gradient(135deg,#38bdf8,#f472b6);padding:16px;border-radius:12px;display:flex;gap:10px}.o{flex:1;padding:14px;border-radius:8px;color:#fff;font-size:.85em;text-align:center;font-weight:700}',
      html: '<div class="wrap"><div class="o" style="background:rgba(0,0,0,.2)">black/20</div><div class="o" style="background:rgba(0,0,0,.5)">black/50</div><div class="o" style="background:rgba(0,0,0,.8)">black/80</div></div>' },

    { t: 'h2', text: 'التدرّجات' },
    { t: 'code', lang: 'html', code: `
<!-- الاتجاه ثم نقاط اللون -->
<div class="bg-gradient-to-r from-indigo-500 to-pink-500">…</div>

<!-- بثلاث نقاط -->
<div class="bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600">…</div>

<!-- الاتجاهات: t, tr, r, br, b, bl, l, tl -->
<div class="bg-gradient-to-b from-black/60 to-transparent">…</div>

<!-- نص متدرّج -->
<h1 class="bg-gradient-to-l from-indigo-500 to-pink-500 bg-clip-text text-transparent">
  عنوان متدرّج
</h1>` },
    { t: 'demo', title: 'تدرّجات', height: 240,
      css: '.b{height:52px;border-radius:10px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.85em}h1{font-size:1.8rem;font-weight:800;background:linear-gradient(to left,#6366f1,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent;text-align:center;margin:10px 0 0}',
      html: '<div class="b" style="background:linear-gradient(to left,#6366f1,#ec4899)">to-r from-indigo-500 to-pink-500</div><div class="b" style="background:linear-gradient(to bottom left,#38bdf8,#6366f1,#9333ea)">to-br via-indigo-500</div><h1>عنوان بنص متدرّج</h1>' },

    { t: 'h2', text: 'أحجام الخط' },
    { t: 'demo', title: 'المقياس', height: 300,
      css: 'div{margin-bottom:6px}code{font-family:monospace;background:#f1f5f9;padding:2px 7px;border-radius:5px;font-size:.72rem;margin-inline-end:8px}',
      html: '<div><code>text-xs</code><span style="font-size:.75rem">نص بحجم صغير جداً</span></div><div><code>text-sm</code><span style="font-size:.875rem">نص بحجم صغير</span></div><div><code>text-base</code><span style="font-size:1rem">نص بالحجم الافتراضي</span></div><div><code>text-lg</code><span style="font-size:1.125rem">نص بحجم كبير</span></div><div><code>text-xl</code><span style="font-size:1.25rem">نص أكبر</span></div><div><code>text-2xl</code><span style="font-size:1.5rem">عنوان فرعي</span></div><div><code>text-3xl</code><span style="font-size:1.875rem">عنوان</span></div><div><code>text-4xl</code><span style="font-size:2.25rem">عنوان كبير</span></div>' },
    { t: 'p', text: 'المقياس يمتد من `text-xs` حتى `text-9xl`. كل حجم يأتي بارتفاع سطر افتراضي مناسب، فلا تحتاج ضبطه في معظم الحالات.' },

    { t: 'h2', text: 'وزن الخط والتنسيق' },
    { t: 'code', lang: 'html', code: `
<p class="font-thin">100</p>
<p class="font-light">300</p>
<p class="font-normal">400</p>
<p class="font-medium">500</p>
<p class="font-semibold">600</p>
<p class="font-bold">700</p>
<p class="font-extrabold">800</p>
<p class="font-black">900</p>

<p class="italic">مائل</p>
<p class="underline decoration-2 decoration-indigo-500 underline-offset-4">مسطّر</p>
<p class="line-through">مشطوب</p>
<p class="uppercase">UPPERCASE</p>
<p class="tabular-nums">1234567890</p>` },
    { t: 'warn', title: 'الأوزان تحتاج خطاً يدعمها', text: 'كتابة `font-thin` لا تعني شيئاً إن كان الخط المحمّل يدعم وزنين فقط. عند تحميل خط عربي من Google Fonts، حدّد الأوزان التي ستستخدمها فعلاً: `Cairo:wght@400;600;700;800`.' },
    { t: 'tip', text: '`tabular-nums` تجعل كل الأرقام بعرض متساوٍ — ضرورية في الجداول والفواتير كي لا تهتزّ الأعمدة عند تغيّر الأرقام.' },

    { t: 'h2', text: 'ارتفاع السطر والتباعد' },
    { t: 'code', lang: 'html', code: `
<p class="leading-none">1</p>
<p class="leading-tight">1.25</p>
<p class="leading-snug">1.375</p>
<p class="leading-normal">1.5</p>
<p class="leading-relaxed">1.625</p>
<p class="leading-loose">2</p>

<p class="tracking-tight">تباعد أحرف ضيّق</p>
<p class="tracking-wide">تباعد أحرف واسع</p>` },
    { t: 'demo', title: 'أثر ارتفاع السطر على النص العربي', height: 300,
      css: '.b{border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:10px}b{display:block;font-size:.8em;color:#64748b;margin-bottom:4px}p{margin:0;color:#334155}',
      html: '<div class="b"><b>leading-tight (1.25)</b><p style="line-height:1.25">النص العربي يحتاج ارتفاع سطر أكبر من اللاتيني بسبب النقاط والحركات فوق الحروف وتحتها، وإلا بدا مزدحماً ومتعباً للقراءة.</p></div><div class="b"><b>leading-loose (2) — الأنسب للعربية</b><p style="line-height:2">النص العربي يحتاج ارتفاع سطر أكبر من اللاتيني بسبب النقاط والحركات فوق الحروف وتحتها، وإلا بدا مزدحماً ومتعباً للقراءة.</p></div>' },
    { t: 'note', title: 'قاعدة للعربية', text: 'استخدم `leading-relaxed` أو `leading-loose` للنصوص العربية الطويلة. الافتراضي `leading-normal` مضبوط على الحروف اللاتينية ويبدو مزدحماً مع العربية.' },

    { t: 'h2', text: 'المحاذاة والاقتطاع' },
    { t: 'code', lang: 'html', code: `
<p class="text-start">من جهة البداية (يمين في RTL)</p>
<p class="text-center">وسط</p>
<p class="text-end">من جهة النهاية</p>
<p class="text-justify">مضبوط الطرفين</p>

<!-- الاقتطاع -->
<p class="truncate">سطر واحد يُقتطع بثلاث نقاط…</p>
<p class="line-clamp-3">ثلاثة أسطر ثم يُقتطع…</p>
<p class="text-balance">عنوان توزّع أسطره بتوازن</p>
<p class="text-pretty">فقرة تتجنّب الكلمة اليتيمة</p>

<!-- كسر الكلمات -->
<p class="break-words">كسر الكلمات الطويلة</p>
<p class="whitespace-nowrap">بلا كسر أسطر</p>` },
    { t: 'demo', title: 'الاقتطاع', height: 250,
      css: '.b{border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:10px;max-width:340px}b{display:block;font-size:.8em;color:#64748b;margin-bottom:4px}.t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:0}.c{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:0}',
      html: '<div class="b"><b>truncate</b><p class="t">عنوان طويل جداً لا يتّسع في سطر واحد فيُقتطع بثلاث نقاط</p></div><div class="b"><b>line-clamp-2</b><p class="c">وصف طويل يمتد لعدة أسطر لكننا نريد عرض سطرين فقط ثم اقتطاع الباقي تلقائياً بلا أي جافاسكربت إضافي.</p></div>' },
    { t: 'tip', text: '`text-balance` ممتازة للعناوين: توزّع الكلمات على الأسطر بتوازن بدل ترك كلمة واحدة في السطر الأخير. و`text-pretty` تفعل شيئاً مشابهاً للفقرات.' },

    { t: 'h2', text: 'الخطوط العربية' },
    { t: 'code', lang: 'html', title: 'index.html', code: `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap"
      rel="stylesheet">` },
    { t: 'code', lang: 'css', title: 'style.css', code: `
@import "tailwindcss";

@theme {
  --font-sans: 'Cairo', 'Segoe UI', sans-serif;
  --font-display: 'Tajawal', sans-serif;
}` },
    { t: 'code', lang: 'html', code: `
<body class="font-sans">
  <h1 class="font-display text-4xl font-extrabold">عنوان</h1>
  <code class="font-mono">const x = 1;</code>
</body>` },
    { t: 'warn', text: 'حمّل الأوزان التي تستخدمها فقط. كل وزن إضافي ملف يُنزَّل، والخطوط العربية أثقل من اللاتينية بكثير لكثرة محارفها.' },

    { t: 'h2', text: 'مثال متكامل' },
    { t: 'code', lang: 'html', code: `
<article class="mx-auto max-w-prose p-8">
  <span class="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">
    تقنية
  </span>

  <h1 class="mt-4 text-balance text-4xl font-extrabold leading-tight text-slate-900">
    كيف غيّرت أدوات الذكاء الاصطناعي طريقة عمل المطوّرين؟
  </h1>

  <p class="mt-3 text-sm text-slate-500">
    بقلم سارة عبدالله · <time datetime="2026-03-15">15 مارس 2026</time>
  </p>

  <p class="mt-8 text-pretty text-lg leading-loose text-slate-700">
    خلال العامين الماضيين تغيّرت أدوات المطوّر تغيّراً جذرياً…
  </p>

  <blockquote class="my-8 border-s-4 border-indigo-500 bg-slate-50 py-4 ps-6 text-lg italic text-slate-600">
    الأداة تضاعف قدرة من يفهم، ولا تصنع فهماً من عدم.
  </blockquote>
</article>` },
    { t: 'demo', title: 'النتيجة', height: 420,
      css: 'article{max-width:65ch;margin:0 auto;padding:8px}.tag{display:inline-block;border-radius:999px;background:#e0e7ff;padding:4px 12px;font-size:.875rem;font-weight:700;color:#4338ca}h1{margin:16px 0 0;font-size:1.9rem;font-weight:800;line-height:1.3;color:#0f172a;text-wrap:balance}.meta{margin:12px 0 0;font-size:.875rem;color:#64748b}.body{margin:24px 0 0;font-size:1.125rem;line-height:2;color:#334155}blockquote{margin:24px 0;border-inline-start:4px solid #6366f1;background:#f8fafc;padding:16px 24px;font-style:italic;color:#475569}',
      html: '<article><span class="tag">تقنية</span><h1>كيف غيّرت أدوات الذكاء الاصطناعي طريقة عمل المطوّرين؟</h1><p class="meta">بقلم سارة عبدالله · 15 مارس 2026</p><p class="body">خلال العامين الماضيين تغيّرت أدوات المطوّر تغيّراً جذرياً، وصار السؤال ليس هل نستخدمها بل كيف نستخدمها دون أن نفقد الفهم العميق.</p><blockquote>الأداة تضاعف قدرة من يفهم، ولا تصنع فهماً من عدم.</blockquote></article>' },

    { t: 'exercise',
      title: 'تمرين: صفحة مقال كاملة',
      brief: 'صمّم صفحة مقال بأصناف الألوان والطباعة فقط.',
      requirements: [
        'ترويسة بتدرّج لوني وعنوان أبيض كبير.',
        'شارة تصنيف بخلفية فاتحة ونص بدرجة داكنة من نفس اللون.',
        'عنوان رئيسي بـ `text-balance` ووزن `extrabold`.',
        'سطر بيانات (كاتب وتاريخ) بحجم صغير ولون باهت.',
        'نص المقال بعرض `max-w-prose` و`leading-loose`.',
        'اقتباس بحد جانبي منطقي (`border-s-4`) وخلفية فاتحة ونص مائل.',
        'ثلاث بطاقات «مقالات ذات صلة» بوصف مقتطع بـ `line-clamp-2`.',
        'استخدم درجة واحدة من كل لون على الأقل من كل نطاق (فاتح، متوسط، داكن).',
        'حمّل خط Cairo بثلاثة أوزان فقط.'
      ],
      hints: [
        'اقرأ جدول استخدامات الدرجات في أعلى الدرس.',
        '`border-s-4` منطقية تعمل في RTL و LTR.',
        'استخدم `leading-loose` للنص العربي الطويل.'
      ],
      solution: { lang: 'html', code: `
<body class="bg-slate-50 font-sans text-slate-800">

  <!-- الترويسة -->
  <header class="bg-gradient-to-bl from-indigo-600 via-violet-600 to-fuchsia-600 py-16 text-center">
    <h1 class="text-4xl font-extrabold text-white">مدونة التقنية</h1>
    <p class="mt-3 text-indigo-100">مقالات عربية عن تطوير الويب</p>
  </header>

  <!-- المقال -->
  <article class="mx-auto max-w-prose px-6 py-12">
    <span class="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-700">
      تطوير الويب
    </span>

    <h2 class="mt-4 text-balance text-3xl font-extrabold leading-tight text-slate-900">
      لماذا يبدأ كل مطوّر ناجح من الأساسيات؟
    </h2>

    <p class="mt-3 text-sm text-slate-500">
      بقلم <span class="font-semibold text-slate-700">سارة عبدالله</span>
      · <time datetime="2026-03-15">15 مارس 2026</time>
      · 8 دقائق قراءة
    </p>

    <p class="mt-8 text-pretty text-lg leading-loose text-slate-700">
      يقفز كثير من المبتدئين إلى الأطر الحديثة قبل إتقان الأساس، فيجدون
      أنفسهم يقاتلون في معركتين معاً: فهم الأداة وفهم اللغة التي بُنيت عليها.
    </p>

    <blockquote class="my-8 border-s-4 border-indigo-500 bg-white py-5 ps-6 text-lg italic leading-loose text-slate-600 shadow-sm">
      من يتقن الأساس يتعلّم أي أداة في أسبوع، ومن يتقن الأداة وحدها
      يبدأ من الصفر مع كل أداة جديدة.
    </blockquote>

    <p class="text-pretty text-lg leading-loose text-slate-700">
      الأساس هنا يعني HTML الدلالية وCSS بعمق وJavaScript الحديثة.
    </p>
  </article>

  <!-- مقالات ذات صلة -->
  <section class="mx-auto max-w-5xl px-6 pb-16">
    <h3 class="mb-6 text-2xl font-bold text-slate-900">مقالات ذات صلة</h3>

    <div class="grid gap-6 md:grid-cols-3">
      <a href="#" class="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300">
        <span class="text-xs font-bold uppercase tracking-wide text-indigo-600">CSS</span>
        <h4 class="mt-2 text-lg font-bold text-slate-900">فهم Flexbox في عشر دقائق</h4>
        <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
          شرح مبسّط لنظام Flexbox مع أمثلة عملية تغطّي المحاذاة والتوزيع
          والالتفاف وترتيب العناصر.
        </p>
      </a>

      <a href="#" class="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300">
        <span class="text-xs font-bold uppercase tracking-wide text-emerald-600">HTML</span>
        <h4 class="mt-2 text-lg font-bold text-slate-900">العناصر الدلالية ولماذا تهمّ</h4>
        <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
          كيف تحسّن العناصر الدلالية إمكانية الوصول وترتيبك في محركات
          البحث دون سطر CSS إضافي.
        </p>
      </a>

      <a href="#" class="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300">
        <span class="text-xs font-bold uppercase tracking-wide text-rose-600">أدوات</span>
        <h4 class="mt-2 text-lg font-bold text-slate-900">إعداد بيئة تطوير محترفة</h4>
        <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
          من المحرّر إلى الطرفية إلى إدارة الإصدارات: كل ما تحتاجه لبيئة
          عمل مريحة وسريعة.
        </p>
      </a>
    </div>
  </section>

</body>` } },

    { t: 'quiz', items: [
      { q: 'كم درجة لكل لون في Tailwind؟', options: ['3', '5', '11 من 50 إلى 950', 'غير محدود'], answer: 2,
        explain: 'المقياس مدروس ليعطي تباينات متناسقة عبر كل الألوان.' },
      { q: 'ماذا يعني `bg-black/50`؟', options: ['خلفية سوداء بحجم 50', 'أسود بشفافية 50٪', 'الدرجة 50', 'خطأ'], answer: 1,
        explain: 'الشرطة المائلة تحدّد قناة الشفافية alpha.' },
      { q: 'أي ارتفاع سطر يناسب النص العربي الطويل؟', options: ['`leading-none`', '`leading-tight`', '`leading-relaxed` أو `leading-loose`', 'لا فرق'], answer: 2,
        explain: 'العربية تحتاج مساحة أكبر بسبب النقاط والحركات فوق الحروف وتحتها.' },
      { q: 'ما وظيفة `line-clamp-3`؟', options: ['ثلاثة أعمدة', 'اقتطاع النص بعد ثلاثة أسطر بثلاث نقاط', 'ثلاث فقرات', 'حجم الخط'], answer: 1,
        explain: 'تعطيك اقتطاعاً متعدّد الأسطر بلا جافاسكربت.' },
      { q: 'لماذا نحدّد أوزان الخط عند تحميله؟', options: ['شكلي', 'كل وزن ملف يُنزَّل، والخطوط العربية ثقيلة', 'إلزامي', 'للسيو'], answer: 1,
        explain: 'تحميل أوزان لا تستخدمها يبطئ أول عرض للصفحة.' }
    ]}
  ]
};
