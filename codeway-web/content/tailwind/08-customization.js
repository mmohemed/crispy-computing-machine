'use strict';

module.exports = {
  slug: '08-customization',
  title: 'التخصيص وبناء نظامك',
  summary: 'تخصيص الثيم في CSS، إضافة ألوان وخطوط ومقاييس، والتوجيهات @apply و @utility و @variant.',
  duration: 45,
  level: 'متقدم',
  tags: ['التخصيص', 'الثيم'],
  objectives: [
    'تخصّص الثيم بتوجيه `@theme`.',
    'تضيف ألواناً وخطوطاً ومقاييس خاصة بمشروعك.',
    'تنشئ أدوات مخصّصة بـ `@utility`.',
    'تنشئ متغيّرات مخصّصة بـ `@custom-variant`.',
    'تعرف متى تستخدم `@apply` ومتى تتجنّبها.'
  ],
  quickRef: [
    { code: '@theme { --color-x: … }', desc: 'تخصيص الثيم' },
    { code: '--color-brand-500', desc: 'يولّد bg-brand-500 وغيرها' },
    { code: '--font-display', desc: 'يولّد font-display' },
    { code: '--spacing-18', desc: 'يولّد p-18 و m-18' },
    { code: '@utility name { … }', desc: 'أداة مخصّصة' },
    { code: '@custom-variant x (…)', desc: 'متغيّر مخصّص' },
    { code: '@apply', desc: 'دمج أصناف في قاعدة' }
  ],
  blocks: [
    { t: 'h2', text: 'التخصيص في CSS' },
    { t: 'p', text: 'في الإصدار الرابع لم يعد التخصيص في ملف جافاسكربت، بل في **CSS نفسها** عبر توجيه `@theme`. كل متغيّر تعرّفه يولّد أصنافاً تلقائياً.' },
    { t: 'code', lang: 'css', title: 'style.css', code: `
@import "tailwindcss";

@theme {
  /* ألوان مخصّصة */
  --color-brand-50:  #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-300: #a5b4fc;
  --color-brand-500: #6366f1;
  --color-brand-700: #4338ca;
  --color-brand-900: #312e81;

  /* خطوط */
  --font-sans: 'Cairo', 'Segoe UI', sans-serif;
  --font-display: 'Tajawal', sans-serif;

  /* مسافات إضافية */
  --spacing-18: 4.5rem;
  --spacing-112: 28rem;

  /* نقاط توقف */
  --breakpoint-3xl: 1920px;

  /* حواف وظلال */
  --radius-4xl: 2rem;
  --shadow-glow: 0 0 40px rgb(99 102 241 / 0.35);
}` },
    { t: 'code', lang: 'html', title: 'الاستخدام — الأصناف تُولَّد تلقائياً', code: `
<div class="bg-brand-500 text-brand-50">لون مخصّص</div>
<h1 class="font-display">خط العناوين</h1>
<div class="p-18 mt-112">مسافات مخصّصة</div>
<div class="3xl:grid-cols-6">نقطة توقف مخصّصة</div>
<div class="rounded-4xl shadow-glow">حواف وظل</div>` },
    { t: 'note', title: 'الاصطلاح يصنع الأصناف', text: 'اسم المتغيّر يحدّد الأصناف المولّدة: `--color-*` تولّد `bg-*` و `text-*` و `border-*`، و`--spacing-*` تولّد `p-*` و `m-*` و `gap-*`، و`--font-*` تولّد `font-*`. لا حاجة لأي إعداد إضافي.' },

    { t: 'h3', text: 'الاستبدال الكامل' },
    { t: 'code', lang: 'css', code: `
@theme {
  /* احذف كل ألوان Tailwind الافتراضية */
  --color-*: initial;

  /* ثم عرّف لوحتك أنت فقط */
  --color-ink: #0f172a;
  --color-paper: #fefefe;
  --color-accent: #dd0031;
}` },
    { t: 'warn', text: 'الاستبدال الكامل يقلّص حجم الناتج ويفرض الالتزام بنظامك، لكنه يعني أن `bg-red-500` لن تعمل. قرار جيد لمشروع بهوية صارمة، وسيّئ لنموذج أوّلي سريع.' },

    { t: 'h2', text: 'نظام ألوان كامل' },
    { t: 'code', lang: 'css', code: `
@import "tailwindcss";

@theme {
  --color-brand-50:  oklch(0.97 0.02 280);
  --color-brand-100: oklch(0.94 0.04 280);
  --color-brand-200: oklch(0.89 0.07 280);
  --color-brand-300: oklch(0.81 0.11 280);
  --color-brand-400: oklch(0.72 0.15 280);
  --color-brand-500: oklch(0.62 0.19 280);
  --color-brand-600: oklch(0.54 0.20 280);
  --color-brand-700: oklch(0.46 0.18 280);
  --color-brand-800: oklch(0.38 0.15 280);
  --color-brand-900: oklch(0.30 0.11 280);
}` },
    { t: 'tip', text: 'صيغة `oklch` أحدث وأدقّ من `hex`: تغيير الإضاءة (الرقم الأول) يعطي تدرّجاً بصرياً متساوياً، بخلاف hex التي تعطي قفزات غير متناسقة. Tailwind نفسها تستخدمها في لوحتها.' },

    { t: 'h2', text: 'الثيمات ومتغيّرات وقت التشغيل' },
    { t: 'code', lang: 'css', code: `
@import "tailwindcss";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  --color-surface: #ffffff;
  --color-ink: #0f172a;
}

@layer base {
  [data-theme='dark'] {
    --color-surface: #111a2e;
    --color-ink: #e8edf9;
  }
}` },
    { t: 'code', lang: 'html', code: '<div class="bg-surface text-ink">يتبدّل مع الثيم تلقائياً</div>' },

    { t: 'h2', text: 'أدوات مخصّصة بـ `@utility`' },
    { t: 'code', lang: 'css', code: `
@import "tailwindcss";

/* أداة بسيطة */
@utility text-shadow {
  text-shadow: 0 2px 8px rgb(0 0 0 / 0.25);
}

/* أداة بقيمة متغيّرة */
@utility scrollbar-* {
  scrollbar-color: --value(--color- *) transparent;
}

/* أداة مركّبة */
@utility card-base {
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-slate-200);
  background: var(--color-white);
  padding: --spacing(6);
  box-shadow: var(--shadow-md);
}` },
    { t: 'code', lang: 'html', code: `
<h1 class="text-shadow">عنوان بظل</h1>
<div class="card-base">بطاقة</div>

<!-- الأدوات المخصّصة تقبل كل المتغيّرات -->
<div class="card-base md:p-8 hover:shadow-xl dark:bg-slate-800">…</div>` },
    { t: 'p', text: 'ميزة `@utility` على `@apply`: الأداة المخصّصة تعمل مع كل المتغيّرات (`hover:` و `md:` و `dark:`) تماماً كأدوات Tailwind الأصلية.' },

    { t: 'h2', text: 'متغيّرات مخصّصة' },
    { t: 'code', lang: 'css', code: `
/* الوضع الليلي بسمة data */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* حالة الاتجاه */
@custom-variant rtl (&:where([dir="rtl"], [dir="rtl"] *));

/* حالة مخصّصة من سمة */
@custom-variant loading (&[data-loading="true"]);

/* عند التمرير */
@custom-variant scrolled (&:where(.is-scrolled, .is-scrolled *));` },
    { t: 'code', lang: 'html', code: `
<div class="dark:bg-slate-900">…</div>
<span class="rtl:rotate-180">←</span>
<button data-loading="true" class="loading:opacity-50 loading:pointer-events-none">
  حفظ
</button>` },

    { t: 'h2', text: '`@apply` — استخدمها بحذر' },
    { t: 'code', lang: 'css', code: `
@layer components {
  .btn-primary {
    @apply rounded-lg bg-brand-600 px-6 py-3 font-bold text-white
           transition hover:bg-brand-700
           focus-visible:outline-2 focus-visible:outline-offset-2;
  }
}` },
    { t: 'danger', title: 'لماذا الحذر؟', text: 'يبدو `@apply` حلاً مثالياً لكنه يعيدك إلى مشكلة CSS التقليدية: ملف ينمو، أسماء تخترعها، وانتقال بين ملفين. أنشأت Tailwind لتتخلّص من هذا بالضبط.' },
    { t: 'table', head: ['استخدم `@apply` حين', 'تجنّبه حين'], rows: [
      ['لا تملك نظام مكوّنات (HTML خام)', 'تستخدم React/Vue/Angular — المكوّن يكفي'],
      ['تنسّق محتوى من محرّر نصوص', 'تنسّق مكوّناتك الخاصة'],
      ['تكتب مكتبة أنماط للتوزيع', 'مشروع تطبيق عادي'],
      ['حالات نادرة جداً', 'كعادة متكرّرة']
    ]},
    { t: 'compare', lang: 'html', bad: {
      code: '<!-- CSS -->\n.btn { @apply px-6 py-3 rounded-lg bg-sky-600 text-white; }\n\n<!-- HTML -->\n<button class="btn">إرسال</button>',
      why: 'عدت إلى ملفين ومصطلح جديد تخترعه. ما الفائدة من Tailwind إذن؟'
    }, good: {
      code: '// مكوّن React\nfunction Button({ children, ...props }) {\n  return (\n    <button\n      className="px-6 py-3 rounded-lg bg-sky-600 text-white"\n      {...props}\n    >\n      {children}\n    </button>\n  );\n}',
      why: 'إعادة الاستخدام الحقيقية على مستوى المكوّن، لا على مستوى الصنف.'
    }},
    { t: 'tip', text: 'إن كنت في HTML خام بلا إطار مكوّنات، فالبديل الأفضل لـ `@apply` هو `@utility` — تعطيك أداة حقيقية تعمل مع كل المتغيّرات.' },

    { t: 'h2', text: 'الطبقات' },
    { t: 'code', lang: 'css', code: `
@import "tailwindcss";

/* أنماط أساسية للعناصر */
@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-slate-50 text-slate-800 antialiased;
  }

  h1, h2, h3 {
    @apply font-display font-extrabold text-slate-900;
  }

  :focus-visible {
    @apply outline-2 outline-offset-2 outline-brand-500;
  }
}

/* مكوّنات — أولوية أقل من الأدوات */
@layer components {
  .prose-ar {
    @apply max-w-prose leading-loose;
  }
}` },
    { t: 'note', text: 'ترتيب الأولوية: `base` ← `components` ← `utilities`. لهذا تستطيع تجاوز أي مكوّن بأداة: `<div class="prose-ar leading-normal">` ستفوز فيها `leading-normal`.' },

    { t: 'h2', text: 'إضافات جاهزة مفيدة' },
    { t: 'code', lang: 'bash', code: 'npm install -D @tailwindcss/typography @tailwindcss/forms' },
    { t: 'code', lang: 'css', code: `
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";` },
    { t: 'code', lang: 'html', code: `
<!-- typography: ينسّق محتوى محرّر النصوص تلقائياً -->
<article class="prose prose-lg max-w-none dark:prose-invert">
  <h1>عنوان</h1>
  <p>فقرة منسّقة تلقائياً…</p>
  <ul><li>عنصر</li></ul>
</article>

<!-- forms: يعيد ضبط عناصر النماذج لتقبل التنسيق -->
<input class="rounded-lg border-slate-300 focus:border-brand-500 focus:ring-brand-500">` },
    { t: 'tip', text: 'إضافة `typography` لا غنى عنها لأي مدونة: تنسّق HTML القادم من محرّر النصوص أو Markdown بشكل احترافي بصنف واحد.' },

    { t: 'h2', text: 'نظام كامل لمشروع عربي' },
    { t: 'code', lang: 'css', title: 'style.css', code: `
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  /* الهوية */
  --color-brand-50:  #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-300: #a5b4fc;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --color-brand-700: #4338ca;
  --color-brand-900: #312e81;

  /* الأسطح — تتبدّل مع الثيم */
  --color-surface: #ffffff;
  --color-canvas: #f6f7fb;
  --color-ink: #0f172a;
  --color-muted: #64748b;
  --color-line: #e2e8f0;

  /* الخطوط */
  --font-sans: 'Cairo', 'Segoe UI', sans-serif;
  --font-display: 'Tajawal', sans-serif;

  /* إضافات */
  --spacing-18: 4.5rem;
  --radius-4xl: 2rem;
  --shadow-glow: 0 0 40px rgb(99 102 241 / 0.3);
  --breakpoint-3xl: 1920px;
}

@layer base {
  [data-theme='dark'] {
    --color-surface: #111a2e;
    --color-canvas: #0a0f1e;
    --color-ink: #e8edf9;
    --color-muted: #a9b6d3;
    --color-line: #22304f;
  }

  body {
    @apply bg-canvas font-sans text-ink antialiased;
    line-height: 1.9;
  }

  h1, h2, h3 {
    @apply font-display font-extrabold;
    line-height: 1.35;
  }

  :focus-visible {
    @apply outline-2 outline-offset-2 outline-brand-500;
  }
}

@utility card-base {
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  padding: --spacing(6);
}

@utility text-glow {
  text-shadow: 0 0 24px rgb(99 102 241 / 0.5);
}` },
    { t: 'demo', title: 'نتيجة النظام', height: 280,
      css: '.g{display:grid;grid-template-columns:1fr 1fr;gap:12px}.c{border-radius:16px;border:1px solid;padding:18px}.l{background:#fff;border-color:#e2e8f0;color:#0f172a}.d{background:#111a2e;border-color:#22304f;color:#e8edf9}h4{margin:0 0 6px;font-size:1.05em}p{margin:0;opacity:.7;font-size:.9em}.btn{margin-top:12px;display:inline-block;padding:8px 18px;border-radius:8px;background:#6366f1;color:#fff;font-weight:700;font-size:.85em}b{display:block;font-size:.72em;opacity:.55;margin-bottom:8px}',
      html: '<div class="g"><div class="c l"><b>bg-surface (فاتح)</b><h4>بطاقة</h4><p>text-muted للوصف</p><span class="btn">bg-brand-500</span></div><div class="c d"><b>bg-surface (داكن)</b><h4>بطاقة</h4><p>text-muted للوصف</p><span class="btn">bg-brand-500</span></div></div>' },

    { t: 'exercise',
      title: 'تمرين: نظام تصميم لعلامتك',
      brief: 'خصّص Tailwind بالكامل لمشروع بهوية بصرية خاصة.',
      requirements: [
        'لوحة ألوان علامة من 9 درجات باسم مخصّص (لا `blue` ولا `indigo`).',
        'ألوان أسطح دلالية: `surface`, `canvas`, `ink`, `muted`, `line`.',
        'خطّان: `--font-sans` للنص و`--font-display` للعناوين.',
        'ثلاث مسافات إضافية غير موجودة في المقياس الافتراضي.',
        'نقطة توقف مخصّصة `3xl`.',
        'ظل مخصّص `--shadow-glow`.',
        'متغيّر مخصّص `dark` بسمة `data-theme`، وثيم داكن يبدّل ألوان الأسطح.',
        'أداتان مخصّصتان بـ `@utility`: واحدة للبطاقة وأخرى لتأثير نصي.',
        'أنماط أساسية في `@layer base`: الجسم، العناوين، مؤشّر التركيز.',
        'صفحة تجريبية تستخدم كل ما سبق وتعمل في الوضعين.'
      ],
      hints: [
        'أسماء المتغيّرات تحدّد الأصناف: `--color-x-500` تولّد `bg-x-500`.',
        'ألوان الأسطح تُعرَّف في `@theme` وتُبدَّل في `@layer base`.',
        'الأدوات المخصّصة تعمل مع كل المتغيّرات بخلاف `@apply`.'
      ],
      solution: { lang: 'css', code: `
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  /* ===== لوحة العلامة ===== */
  --color-nasq-50:  #fff1f2;
  --color-nasq-100: #ffe4e6;
  --color-nasq-200: #fecdd3;
  --color-nasq-300: #fda4af;
  --color-nasq-400: #fb7185;
  --color-nasq-500: #f43f5e;
  --color-nasq-600: #e11d48;
  --color-nasq-700: #be123c;
  --color-nasq-800: #9f1239;
  --color-nasq-900: #881337;

  /* ===== الأسطح الدلالية ===== */
  --color-surface: #ffffff;
  --color-canvas:  #fafafa;
  --color-ink:     #18181b;
  --color-muted:   #71717a;
  --color-line:    #e4e4e7;

  /* ===== الخطوط ===== */
  --font-sans: 'Cairo', 'Segoe UI', sans-serif;
  --font-display: 'Tajawal', 'Cairo', sans-serif;

  /* ===== إضافات المقياس ===== */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;
  --spacing-128: 32rem;

  /* ===== نقطة توقف ===== */
  --breakpoint-3xl: 1920px;

  /* ===== ظل مخصّص ===== */
  --shadow-glow: 0 0 40px rgb(244 63 94 / 0.35);
  --radius-4xl: 2rem;
}

@layer base {
  [data-theme='dark'] {
    --color-surface: #18181b;
    --color-canvas:  #09090b;
    --color-ink:     #fafafa;
    --color-muted:   #a1a1aa;
    --color-line:    #27272a;
  }

  body {
    @apply bg-canvas font-sans text-ink antialiased;
    line-height: 1.9;
  }

  h1, h2, h3, h4 {
    @apply font-display font-extrabold;
    line-height: 1.35;
  }

  :focus-visible {
    @apply outline-2 outline-offset-2 outline-nasq-500;
  }
}

/* ===== أدوات مخصّصة ===== */
@utility card-base {
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  padding: --spacing(6);
}

@utility text-glow {
  text-shadow: 0 0 24px rgb(244 63 94 / 0.45);
}

/* ==========================================================
   الاستخدام في HTML:

   <body>
     <header class="bg-nasq-600 px-6 py-18">
       <h1 class="text-glow text-4xl text-white">نَسَق</h1>
     </header>

     <main class="mx-auto max-w-88 p-6 3xl:max-w-128">
       <div class="card-base shadow-glow hover:shadow-none md:p-8">
         <h2 class="text-2xl">بطاقة</h2>
         <p class="mt-2 text-muted">وصف بلون دلالي يتبدّل مع الثيم.</p>
         <button class="mt-4 rounded-lg bg-nasq-600 px-5 py-2 font-bold text-white
                        transition hover:bg-nasq-700">
           إجراء
         </button>
       </div>
     </main>
   </body>
   ========================================================== */` } },

    { t: 'quiz', items: [
      { q: 'أين يتم التخصيص في Tailwind الإصدار الرابع؟', options: ['`tailwind.config.js`', 'في CSS عبر توجيه `@theme`', 'في `package.json`', 'في HTML'], answer: 1,
        explain: 'الإصدار الرابع نقل التخصيص إلى CSS، فلا حاجة لملف جافاسكربت.' },
      { q: 'ماذا يولّد `--color-brand-500` في `@theme`؟', options: ['لا شيء', 'أصنافاً مثل `bg-brand-500` و `text-brand-500` تلقائياً', 'متغيّر CSS فقط', 'خطأ'], answer: 1,
        explain: 'الاصطلاح في اسم المتغيّر يحدّد عائلة الأصناف المولّدة.' },
      { q: 'ما ميزة `@utility` على `@apply`؟', options: ['أقصر', 'الأداة المخصّصة تعمل مع كل المتغيّرات مثل `hover:` و`md:`', 'أسرع', 'أوسع دعماً'], answer: 1,
        explain: '`@apply` تنتج قاعدة عادية لا تقبل بادئات المتغيّرات.' },
      { q: 'متى يكون `@apply` مبرّراً؟', options: ['دائماً', 'حين لا تملك نظام مكوّنات، أو تنسّق محتوى محرّر نصوص', 'مع React', 'مع الأزرار'], answer: 1,
        explain: 'مع أطر المكوّنات، المكوّن نفسه هو وحدة إعادة الاستخدام الصحيحة.' },
      { q: 'ما ترتيب أولوية الطبقات؟', options: ['utilities ← components ← base', 'base ← components ← utilities', 'عشوائي', 'حسب الملف'], answer: 1,
        explain: 'الأدوات أخيراً لتتمكّن من تجاوز المكوّنات والأنماط الأساسية.' }
    ]}
  ]
};
