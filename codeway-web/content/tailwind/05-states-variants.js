'use strict';

module.exports = {
  slug: '05-states-variants',
  title: 'الحالات والمتغيّرات',
  summary: 'تنسيق الحالات التفاعلية والوضع الليلي والتفاعل بين العناصر بالمجموعات والأقران.',
  duration: 45,
  level: 'متوسط',
  tags: ['الحالات', 'التفاعل'],
  objectives: [
    'تنسّق حالات التفاعل: hover و focus و active و disabled.',
    'تستخدم `group` لربط حالة الأب بأبنائه.',
    'تستخدم `peer` للتفاعل بين عناصر متجاورة.',
    'تدعم الوضع الليلي بشكل صحيح.',
    'تستهدف الابن الأول والأخير والفردي.'
  ],
  quickRef: [
    { code: 'hover:bg-sky-700', desc: 'عند مرور المؤشّر' },
    { code: 'focus-visible:ring-2', desc: 'عند التركيز بلوحة المفاتيح' },
    { code: 'disabled:opacity-50', desc: 'عند التعطيل' },
    { code: 'group / group-hover:', desc: 'حالة الأب تؤثّر في الابن' },
    { code: 'peer / peer-checked:', desc: 'حالة عنصر تؤثّر في تاليه' },
    { code: 'dark:bg-slate-900', desc: 'في الوضع الليلي' },
    { code: 'first: / last: / odd:', desc: 'موضع العنصر' },
    { code: 'has-[:checked]:', desc: 'إن احتوى عنصراً بحالة' }
  ],
  blocks: [
    { t: 'h2', text: 'كيف تعمل المتغيّرات؟' },
    { t: 'p', text: 'المتغيّر بادئة تُضاف قبل الصنف وتفصلها نقطتان، فتجعل الصنف يُطبَّق في حالة معيّنة فقط. يمكن تركيب عدة متغيّرات معاً.' },
    { t: 'code', lang: 'html', code: `
<button class="bg-sky-600 hover:bg-sky-700">مرور المؤشّر</button>
<button class="md:hover:bg-sky-700">مرور المؤشّر على الشاشات المتوسطة فأعلى</button>
<button class="dark:hover:bg-sky-400">مرور المؤشّر في الوضع الليلي</button>` },

    { t: 'h2', text: 'حالات التفاعل' },
    { t: 'code', lang: 'html', code: `
<button class="bg-sky-600
               hover:bg-sky-700
               active:scale-95
               focus-visible:outline-2 focus-visible:outline-offset-2
               disabled:cursor-not-allowed disabled:opacity-50">
  إرسال
</button>

<a class="text-sky-600 visited:text-purple-600 hover:underline">رابط</a>

<input class="border-slate-300
              focus:border-sky-500 focus:ring-2 focus:ring-sky-200
              user-invalid:border-rose-500
              placeholder:text-slate-400
              read-only:bg-slate-100">` },
    { t: 'demo', title: 'زر بكل حالاته', height: 220,
      css: 'button{background:#0284c7;color:#fff;border:0;border-radius:10px;padding:12px 28px;font-family:inherit;font-weight:700;cursor:pointer;transition:.15s;margin:4px}button:hover:not(:disabled){background:#0369a1}button:active:not(:disabled){transform:scale(.95)}button:disabled{opacity:.5;cursor:not-allowed}input{border:1px solid #cbd5e1;border-radius:8px;padding:10px 14px;width:100%;max-width:280px;font-family:inherit;margin-top:10px;display:block}input:focus{outline:0;border-color:#0ea5e9;box-shadow:0 0 0 3px #bae6fd}',
      html: '<button>مرّر المؤشّر واضغط</button><button disabled>معطّل</button><input placeholder="ركّز على هذا الحقل">' },
    { t: 'warn', title: '`focus` أم `focus-visible`؟', text: '`focus` تظهر عند النقر بالفأرة أيضاً فتزعج المستخدم. `focus-visible` تظهر فقط حين يتنقّل بلوحة المفاتيح — وهي الاختيار الصحيح لمؤشّر التركيز.' },

    { t: 'h2', text: '`group` — حالة الأب تؤثّر في الأبناء' },
    { t: 'p', text: 'أحياناً تريد تغيير ابن عند مرور المؤشّر على **الأب** كله. أضف `group` للأب و `group-hover:` لأي ابن.' },
    { t: 'code', lang: 'html', code: `
<a href="#" class="group block rounded-xl border border-slate-200 p-5 transition hover:border-sky-500 hover:shadow-lg">
  <h3 class="font-bold text-slate-900 transition group-hover:text-sky-600">
    عنوان البطاقة
  </h3>

  <p class="mt-2 text-slate-500">وصف قصير</p>

  <span class="mt-3 inline-block text-sky-600 opacity-0 transition group-hover:opacity-100">
    اقرأ المزيد ←
  </span>
</a>` },
    { t: 'demo', title: 'مرّر المؤشّر على البطاقة كاملة', height: 250,
      css: '.g{display:block;border:1px solid #e2e8f0;border-radius:12px;padding:20px;text-decoration:none;transition:.25s;max-width:320px}.g:hover{border-color:#0ea5e9;box-shadow:0 12px 28px rgba(0,0,0,.1)}.g h3{margin:0;color:#0f172a;transition:.25s}.g:hover h3{color:#0284c7}.g p{color:#64748b;margin:8px 0 0;font-size:.92em}.more{display:inline-block;margin-top:12px;color:#0284c7;opacity:0;transition:.25s;font-weight:700}.g:hover .more{opacity:1}',
      html: '<a class="g" href="#"><h3>عنوان البطاقة</h3><p>وصف قصير يظهر دائماً</p><span class="more">اقرأ المزيد ←</span></a>' },
    { t: 'code', lang: 'html', title: 'مجموعات مسمّاة للتداخل', code: `
<div class="group/card">
  <div class="group/item">
    <span class="group-hover/card:text-sky-600">يتأثّر بالبطاقة</span>
    <span class="group-hover/item:font-bold">يتأثّر بالعنصر</span>
  </div>
</div>` },
    { t: 'p', text: 'المتغيّرات المتاحة: `group-hover`, `group-focus`, `group-active`, `group-disabled`, `group-open`, `group-checked`.' },

    { t: 'h2', text: '`peer` — التفاعل بين الأقران' },
    { t: 'p', text: 'بينما `group` تعمل من الأب إلى الابن، فإن `peer` تعمل بين عنصرين **متجاورين**: حالة الأول تؤثّر في الثاني.' },
    { t: 'code', lang: 'html', title: 'مفتاح تبديل بلا جافاسكربت', code: `
<label class="inline-flex cursor-pointer items-center gap-3">
  <input type="checkbox" class="peer sr-only">

  <span class="relative h-7 w-12 rounded-full bg-slate-300 transition
               peer-checked:bg-sky-600
               after:absolute after:top-1 after:start-1 after:h-5 after:w-5
               after:rounded-full after:bg-white after:transition
               peer-checked:after:translate-x-5">
  </span>

  <span class="text-slate-600 peer-checked:font-bold peer-checked:text-sky-600">
    تفعيل الإشعارات
  </span>
</label>` },
    { t: 'demo', title: 'جرّب المفتاح', height: 200,
      css: 'label{display:inline-flex;align-items:center;gap:12px;cursor:pointer}input{position:absolute;opacity:0;width:0;height:0}.sw{position:relative;height:28px;width:48px;border-radius:999px;background:#cbd5e1;transition:.25s}.sw::after{content:"";position:absolute;top:4px;inset-inline-start:4px;height:20px;width:20px;border-radius:999px;background:#fff;transition:.25s}input:checked+.sw{background:#0284c7}input:checked+.sw::after{transform:translateX(-20px)}.lbl{color:#64748b;transition:.25s}input:checked~.lbl{color:#0284c7;font-weight:700}',
      html: '<label><input type="checkbox"><span class="sw"></span><span class="lbl">تفعيل الإشعارات</span></label>' },
    { t: 'code', lang: 'html', title: 'رسالة خطأ تظهر تلقائياً', code: `
<input type="email" required
       class="peer w-full rounded-lg border border-slate-300 px-4 py-2
              user-invalid:border-rose-500">

<p class="mt-1 hidden text-sm text-rose-600 peer-[&:user-invalid]:block">
  صيغة البريد غير صحيحة
</p>` },
    { t: 'warn', title: 'شرط الترتيب', text: '`peer` تعمل مع الأشقاء **التاليين** فقط (تعتمد على `~` في CSS). العنصر الذي يحمل `peer` يجب أن يأتي **قبل** العنصر المتأثّر في الترميز.' },

    { t: 'h2', text: 'الوضع الليلي' },
    { t: 'code', lang: 'html', code: `
<div class="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
  <h1 class="text-slate-900 dark:text-white">عنوان</h1>
  <p class="text-slate-600 dark:text-slate-400">فقرة</p>
  <div class="border-slate-200 dark:border-slate-700">حد</div>
</div>` },
    { t: 'code', lang: 'css', title: 'التفعيل يدوياً بدل تفضيل النظام', code: `
@import "tailwindcss";

/* يفعّل dark: عند وجود data-theme="dark" على أي جدّ */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));` },
    { t: 'code', lang: 'js', title: 'التبديل بجافاسكربت', code: `
const saved = localStorage.getItem('theme');
if (saved) document.documentElement.dataset.theme = saved;

function toggleTheme() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const next = isDark ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
}` },
    { t: 'demo', title: 'بطاقة في الوضعين', height: 260,
      css: '.g{display:grid;grid-template-columns:1fr 1fr;gap:12px}.c{border-radius:12px;padding:16px;border:1px solid}.l{background:#fff;border-color:#e2e8f0;color:#0f172a}.d{background:#0f172a;border-color:#334155;color:#f1f5f9}.c h4{margin:0 0 6px;font-size:1em}.c p{margin:0;font-size:.88em;opacity:.7}b{display:block;font-size:.75em;margin-bottom:6px;opacity:.6}',
      html: '<div class="g"><div class="c l"><b>الوضع الفاتح</b><h4>عنوان البطاقة</h4><p>وصف قصير للمحتوى</p></div><div class="c d"><b>الوضع الليلي</b><h4>عنوان البطاقة</h4><p>وصف قصير للمحتوى</p></div></div>' },
    { t: 'tip', text: 'اقلب الدرجات في الوضع الليلي: `text-slate-900` تصبح `dark:text-slate-100`، و`bg-slate-50` تصبح `dark:bg-slate-900`. قاعدة بسيطة تعطي نتيجة متناسقة.' },

    { t: 'h2', text: 'متغيّرات الموضع والبنية' },
    { t: 'code', lang: 'html', code: `
<ul>
  <li class="border-b last:border-b-0">…</li>
</ul>

<div class="odd:bg-slate-50 even:bg-white">…</div>
<div class="first:rounded-t-xl last:rounded-b-xl">…</div>
<div class="only:text-center">إن كان الابن الوحيد</div>
<div class="empty:hidden">يختفي إن كان فارغاً</div>

<!-- استهداف كل الأبناء -->
<div class="*:rounded-lg *:p-4">
  <div>يرث</div>
  <div>يرث</div>
</div>` },
    { t: 'demo', title: 'قائمة بحدود ذكية', height: 240,
      css: 'ul{list-style:none;padding:0;margin:0;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}li{padding:12px 16px;border-bottom:1px solid #e2e8f0}li:last-child{border-bottom:0}li:nth-child(odd){background:#f8fafc}',
      html: '<ul><li>العنصر الأول</li><li>العنصر الثاني</li><li>العنصر الثالث</li><li>العنصر الرابع</li></ul>' },

    { t: 'h2', text: '`has-` — التنسيق بحسب المحتوى' },
    { t: 'code', lang: 'html', code: `
<!-- بطاقة تتغيّر إن كان مربّع الاختيار بداخلها محدّداً -->
<label class="block rounded-xl border-2 border-slate-200 p-4
              has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50">
  <input type="radio" name="plan" class="me-2">
  الباقة الاحترافية
</label>

<!-- حاوية تتغيّر إن احتوت صورة -->
<div class="p-4 has-[img]:p-0">…</div>` },
    { t: 'demo', title: 'اختر باقة', height: 240,
      css: 'label{display:block;border:2px solid #e2e8f0;border-radius:12px;padding:14px;margin-bottom:8px;cursor:pointer;transition:.2s}label:has(:checked){border-color:#0ea5e9;background:#f0f9ff}input{margin-inline-end:8px}',
      html: '<label><input type="radio" name="p">الباقة المجانية</label><label><input type="radio" name="p" checked>الباقة الاحترافية</label><label><input type="radio" name="p">باقة الشركات</label>' },
    { t: 'note', text: '`has-` تعتمد على المحدّد `:has()` في CSS — مدعوم في كل المتصفحات الحديثة. أداة قوية جداً كانت تحتاج جافاسكربت قبل سنتين.' },

    { t: 'h2', text: 'متغيّرات أخرى مفيدة' },
    { t: 'table', head: ['المتغيّر', 'متى يُطبَّق'], rows: [
      ['`motion-safe:` / `motion-reduce:`', 'بحسب تفضيل تقليل الحركة'],
      ['`print:`', 'عند الطباعة'],
      ['`rtl:` / `ltr:`', 'بحسب اتجاه الصفحة'],
      ['`open:`', 'على `details` و `dialog` المفتوحة'],
      ['`aria-expanded:`', 'بحسب سمة ARIA'],
      ['`data-[state=open]:`', 'بحسب سمة data'],
      ['`supports-[display:grid]:`', 'إن كان المتصفح يدعم الخاصية']
    ]},
    { t: 'code', lang: 'html', code: `
<div class="motion-safe:animate-bounce motion-reduce:animate-none">…</div>
<nav class="print:hidden">…</nav>
<span class="rtl:rotate-180">←</span>
<details class="open:bg-slate-50">…</details>
<button aria-expanded="false" class="aria-expanded:rotate-180">▾</button>` },
    { t: 'tip', text: '`print:hidden` على أشرطة التنقّل والأزرار تجعل صفحاتك تُطبع نظيفة — تفصيلة صغيرة يقدّرها المستخدمون كثيراً.' },

    { t: 'h2', text: 'مثال متكامل' },
    { t: 'code', lang: 'html', code: `
<a href="#" class="group relative flex flex-col overflow-hidden rounded-2xl
                   border border-slate-200 bg-white transition
                   hover:-translate-y-1 hover:border-sky-400 hover:shadow-xl
                   focus-visible:outline-2 focus-visible:outline-sky-500
                   dark:border-slate-700 dark:bg-slate-800">

  <div class="aspect-video bg-slate-100 dark:bg-slate-700"></div>

  <span class="absolute top-3 end-3 rounded-full bg-rose-500 px-3 py-1
               text-xs font-bold text-white opacity-0 transition
               group-hover:opacity-100">
    خصم 20٪
  </span>

  <div class="flex flex-1 flex-col p-5">
    <h3 class="font-bold text-slate-900 transition
               group-hover:text-sky-600
               dark:text-white dark:group-hover:text-sky-400">
      سماعة لاسلكية
    </h3>

    <p class="mt-2 line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
      عزل ضوضاء نشط وبطارية تدوم ثلاثين ساعة.
    </p>

    <div class="mt-4 flex items-center justify-between">
      <span class="font-extrabold text-sky-600 dark:text-sky-400">299 ر.س</span>
      <span class="translate-x-2 text-sky-600 opacity-0 transition
                   group-hover:translate-x-0 group-hover:opacity-100">
        ←
      </span>
    </div>
  </div>
</a>` },

    { t: 'exercise',
      title: 'تمرين: مكوّنات تفاعلية بلا جافاسكربت',
      brief: 'ابنِ أربعة مكوّنات تفاعلية بالحالات والمتغيّرات فقط.',
      requirements: [
        '**بطاقة منتج** بـ `group`: عند مرور المؤشّر يتغيّر لون العنوان، ويظهر سهم، وترتفع البطاقة، وتظهر شارة الخصم.',
        '**مفتاح تبديل** بـ `peer`: مربّع اختيار مخفي يحرّك دائرة ويغيّر لون الخلفية والنص.',
        '**بطاقات اختيار باقة** بـ `has-[:checked]`: البطاقة المحدّدة تتغيّر حدودها وخلفيتها.',
        '**قائمة أسئلة** بـ `details` مع `open:` لتغيير الخلفية ودوران السهم.',
        'كل المكوّنات تدعم الوضع الليلي بـ `dark:`.',
        'كل عنصر تفاعلي له `focus-visible` واضح.',
        'استخدم `motion-safe:` للحركات احتراماً لتفضيل المستخدم.',
        'أضف `print:hidden` على عنصر واحد مناسب.'
      ],
      hints: [
        '`peer` يجب أن يأتي قبل العنصر المتأثّر في الترميز.',
        '`sr-only` تخفي مربّع الاختيار بصرياً وتُبقيه متاحاً للوحة المفاتيح.',
        '`has-[:checked]` تُوضع على العنصر الأب لا على المدخل.'
      ],
      solution: { lang: 'html', code: `
<body class="bg-slate-50 p-8 dark:bg-slate-900">

  <!-- 1) بطاقة منتج بـ group -->
  <a href="#" class="group relative mb-8 flex max-w-sm flex-col overflow-hidden
                     rounded-2xl border border-slate-200 bg-white transition
                     motion-safe:hover:-translate-y-1
                     hover:border-sky-400 hover:shadow-xl
                     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500
                     dark:border-slate-700 dark:bg-slate-800">

    <div class="aspect-video bg-gradient-to-br from-sky-400 to-indigo-500"></div>

    <span class="absolute top-3 end-3 rounded-full bg-rose-500 px-3 py-1
                 text-xs font-bold text-white opacity-0 transition
                 group-hover:opacity-100">
      خصم 20٪
    </span>

    <div class="flex flex-1 flex-col p-5">
      <h3 class="font-bold text-slate-900 transition
                 group-hover:text-sky-600
                 dark:text-white dark:group-hover:text-sky-400">
        سماعة لاسلكية
      </h3>
      <p class="mt-2 line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
        عزل ضوضاء نشط وبطارية تدوم ثلاثين ساعة مع شحن سريع.
      </p>
      <div class="mt-4 flex items-center justify-between">
        <span class="font-extrabold text-sky-600 dark:text-sky-400">299 ر.س</span>
        <span class="translate-x-2 text-sky-600 opacity-0 transition
                     group-hover:translate-x-0 group-hover:opacity-100">←</span>
      </div>
    </div>
  </a>

  <!-- 2) مفتاح تبديل بـ peer -->
  <label class="mb-8 inline-flex cursor-pointer items-center gap-3">
    <input type="checkbox" class="peer sr-only">
    <span class="relative h-7 w-12 rounded-full bg-slate-300 transition
                 peer-checked:bg-sky-600
                 peer-focus-visible:ring-2 peer-focus-visible:ring-sky-300
                 after:absolute after:top-1 after:start-1 after:h-5 after:w-5
                 after:rounded-full after:bg-white after:transition
                 peer-checked:after:-translate-x-5
                 dark:bg-slate-600"></span>
    <span class="text-slate-600 transition
                 peer-checked:font-bold peer-checked:text-sky-600
                 dark:text-slate-300">
      تفعيل الإشعارات
    </span>
  </label>

  <!-- 3) اختيار باقة بـ has -->
  <fieldset class="mb-8 max-w-sm space-y-3">
    <legend class="mb-2 font-bold text-slate-900 dark:text-white">اختر باقتك</legend>

    <label class="block cursor-pointer rounded-xl border-2 border-slate-200 p-4 transition
                  has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50
                  dark:border-slate-700 dark:has-[:checked]:bg-sky-950">
      <input type="radio" name="plan" class="me-2">
      <span class="font-bold text-slate-900 dark:text-white">المجانية</span>
      <span class="block text-sm text-slate-500">3 مشاريع</span>
    </label>

    <label class="block cursor-pointer rounded-xl border-2 border-slate-200 p-4 transition
                  has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50
                  dark:border-slate-700 dark:has-[:checked]:bg-sky-950">
      <input type="radio" name="plan" class="me-2" checked>
      <span class="font-bold text-slate-900 dark:text-white">الاحترافية</span>
      <span class="block text-sm text-slate-500">50 مشروعاً</span>
    </label>
  </fieldset>

  <!-- 4) أسئلة شائعة -->
  <div class="max-w-lg space-y-3">
    <details class="group rounded-xl border border-slate-200 p-4 transition
                    open:bg-slate-50
                    dark:border-slate-700 dark:open:bg-slate-800">
      <summary class="flex cursor-pointer items-center justify-between font-bold
                      text-slate-900 dark:text-white">
        ما مدة الدورة؟
        <span class="transition group-open:rotate-180">▾</span>
      </summary>
      <p class="mt-3 text-slate-600 dark:text-slate-400">
        عشرون درساً بمجموع اثنتي عشرة ساعة.
      </p>
    </details>

    <details class="group rounded-xl border border-slate-200 p-4 transition
                    open:bg-slate-50
                    dark:border-slate-700 dark:open:bg-slate-800">
      <summary class="flex cursor-pointer items-center justify-between font-bold
                      text-slate-900 dark:text-white">
        هل أحتاج خبرة سابقة؟
        <span class="transition group-open:rotate-180">▾</span>
      </summary>
      <p class="mt-3 text-slate-600 dark:text-slate-400">
        لا، المسار يبدأ من الصفر.
      </p>
    </details>
  </div>

  <!-- عنصر لا يُطبع -->
  <button class="print:hidden mt-8 rounded-lg bg-sky-600 px-5 py-2 font-bold text-white">
    طباعة الصفحة
  </button>

</body>` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق بين `group` و `peer`؟', options: ['لا فرق', '`group` من الأب إلى الابن و`peer` بين أشقاء متجاورين', 'العكس', '`peer` للنماذج فقط'], answer: 1,
        explain: '`group` تعتمد على علاقة الاحتواء، و`peer` على علاقة الأخوة (`~`).' },
      { q: 'لماذا `focus-visible` أفضل من `focus`؟', options: ['أسرع', 'تظهر لمستخدم لوحة المفاتيح فقط ولا تزعج مستخدم الفأرة', 'أوسع دعماً', 'لا فرق'], answer: 1,
        explain: 'تجمع بين إمكانية الوصول والمظهر النظيف عند النقر.' },
      { q: 'أين توضع `has-[:checked]`؟', options: ['على المدخل', 'على العنصر الأب الذي يحتوي المدخل', 'على الأخ', 'في CSS'], answer: 1,
        explain: '`:has()` تستهدف الأب بناءً على ما يحتويه.' },
      { q: 'ما شرط عمل `peer`؟', options: ['أن يكون الأب', 'أن يأتي العنصر الحامل لـ peer قبل المتأثّر في الترميز', 'أن يكون مخفياً', 'لا شرط'], answer: 1,
        explain: 'تعتمد على محدّد الأشقاء التاليين في CSS.' },
      { q: 'ما فائدة `motion-reduce:`؟', options: ['تسريع الحركة', 'احترام تفضيل المستخدم بتقليل الحركة لأسباب صحية', 'إيقاف CSS', 'الطباعة'], answer: 1,
        explain: 'بعض المستخدمين تسبّب لهم الحركة دواراً؛ احترام تفضيلهم واجب.' }
    ]}
  ]
};
