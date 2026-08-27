'use strict';

module.exports = {
  slug: '01-utility-first',
  title: 'فلسفة Utility-First والإعداد',
  summary: 'لماذا تُكتب الأنماط في الترميز نفسه، والاعتراضات الشائعة والردّ عليها، وكيف تبدأ مشروعك.',
  duration: 40,
  level: 'مبتدئ',
  tags: ['مقدمة', 'الإعداد'],
  objectives: [
    'تشرح منهجية Utility-First والمشكلة التي تحلّها.',
    'تردّ على الاعتراضات الشائعة عليها بفهم.',
    'تثبّت Tailwind وتشغّله في مشروعك.',
    'تقرأ أسماء الأصناف وتفهم نمط تسميتها.',
    'تعرف متى تكون Tailwind خياراً مناسباً ومتى لا.'
  ],
  quickRef: [
    { code: 'npm i -D tailwindcss', desc: 'التثبيت' },
    { code: '@import "tailwindcss"', desc: 'استيراد Tailwind (v4)' },
    { code: 'p-4', desc: 'padding: 1rem' },
    { code: 'text-lg', desc: 'حجم خط كبير' },
    { code: 'bg-blue-500', desc: 'لون خلفية' },
    { code: 'md:flex', desc: 'يُطبَّق من شاشة md فأعلى' },
    { code: 'hover:bg-blue-600', desc: 'عند مرور المؤشّر' }
  ],
  blocks: [
    { t: 'h2', text: 'المشكلة: تسمية كل شيء' },
    { t: 'p', text: 'في CSS التقليدية تكتب صنفاً لكل مكوّن. تبدو فكرة نظيفة حتى تواجه الواقع: ماذا تسمّي هذا الصندوق؟ `.card`؟ لكن هناك `.card` أخرى مختلفة. `.product-card`؟ وماذا عن نسخته في الشريط الجانبي؟ `.sidebar-product-card`؟' },
    { t: 'p', text: 'تقضي وقتاً في **تسمية** أشياء لا تحتاج أسماء، وتتراكم لديك أصناف يُستخدم كل منها مرة واحدة، ولا تجرؤ على حذف أي صنف خشية أن يكون مستخدماً في مكان ما.' },
    { t: 'compare', lang: 'html', bad: {
      code: '<div class="product-card">\n  <h3 class="product-card__title">سماعة</h3>\n  <p class="product-card__price">299 ريالاً</p>\n</div>\n\n<!-- وفي ملف CSS منفصل: 20 سطراً -->',
      why: 'ملفان تنتقل بينهما، وثلاثة أسماء اخترعتها، وCSS ينمو مع كل مكوّن جديد.'
    }, good: {
      code: '<div class="rounded-xl border border-slate-200 p-5">\n  <h3 class="text-lg font-bold">سماعة</h3>\n  <p class="text-indigo-600 font-extrabold">299 ريالاً</p>\n</div>\n\n<!-- لا ملف CSS إضافي إطلاقاً -->',
      why: 'كل شيء أمامك، لا أسماء تخترعها، وCSS لا ينمو مع المشروع.'
    }},

    { t: 'h2', text: 'ما هي Tailwind؟' },
    { t: 'p', text: 'إطار CSS يعطيك **آلاف الأصناف المساعدة** الصغيرة، كل صنف يفعل شيئاً واحداً: `p-4` تضيف حشواً، `flex` تجعل العنصر مرناً، `text-center` توسّط النص. تركّب التصميم من هذه اللبنات مباشرة في الترميز.' },
    { t: 'demo', title: 'صنف واحد = خاصية واحدة', height: 260,
      css: 'table{width:100%;border-collapse:collapse;font-size:.92em}td,th{padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right}th{background:#e0f2fe;color:#0369a1}code{font-family:monospace;direction:ltr;display:inline-block;background:#f1f5f9;padding:2px 8px;border-radius:5px;font-size:.9em}',
      html: '<table><tr><th>الصنف</th><th>ما يعادله في CSS</th></tr><tr><td><code>p-4</code></td><td><code>padding: 1rem</code></td></tr><tr><td><code>mt-2</code></td><td><code>margin-top: 0.5rem</code></td></tr><tr><td><code>flex</code></td><td><code>display: flex</code></td></tr><tr><td><code>gap-3</code></td><td><code>gap: 0.75rem</code></td></tr><tr><td><code>rounded-lg</code></td><td><code>border-radius: 0.5rem</code></td></tr><tr><td><code>text-slate-500</code></td><td><code>color: #64748b</code></td></tr></table>' },
    { t: 'note', title: 'ليست Bootstrap', text: 'Bootstrap يعطيك مكوّنات جاهزة (`.btn`, `.card`) فتبدو كل المواقع متشابهة. Tailwind يعطيك **لبنات** تبني بها تصميمك الخاص — فلا يوجد «شكل Tailwind».' },

    { t: 'h2', text: 'الاعتراضات الشائعة' },
    { t: 'h3', text: '«الترميز يصبح قبيحاً»' },
    { t: 'code', lang: 'html', code: '<button class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50">\n  إرسال\n</button>' },
    { t: 'p', text: 'نعم، السطر طويل. لكن اسأل: كم مرة **تقرأ** هذا السطر مقابل كم مرة تنتقل بين ملفين لتفهم مكوّناً؟ ومع المكوّنات (React أو Vue أو Angular) تكتبه مرة واحدة وتعيد استخدام المكوّن.' },

    { t: 'h3', text: '«هذا مثل `style=` المضمّن»' },
    { t: 'table', head: ['الوجه', '`style=` مضمّن', 'Tailwind'], rows: [
      ['القيم', 'أي قيمة عشوائية', 'من نظام تصميم محدود ومتّسق'],
      ['الحالات (`hover`)', '**مستحيلة**', 'مدعومة'],
      ['التجاوب', '**مستحيل**', 'مدعوم بالبادئات'],
      ['الوضع الليلي', 'مستحيل', 'مدعوم'],
      ['الحجم', 'يتكرّر كاملاً', 'صنف واحد يُعاد استخدامه']
    ]},
    { t: 'p', text: 'الفرق الجوهري: `style="padding: 13px"` تقبل أي رقم عشوائي، أما `p-3` فتأتي من **مقياس** محدّد. هذا القيد هو ما يجعل التصميم متّسقاً.' },

    { t: 'h3', text: '«حجم الملف سيكون ضخماً»' },
    { t: 'p', text: 'Tailwind يفحص ملفاتك ويولّد **الأصناف المستخدمة فقط**. مشروع متوسط ينتج عادةً 10–20 كيلوبايت مضغوطة — أصغر من معظم ملفات CSS المكتوبة يدوياً، لأن CSS التقليدية تنمو مع كل مكوّن بينما Tailwind تتوقّف عن النمو.' },
    { t: 'demo', title: 'نمو حجم CSS مع المشروع', height: 240,
      css: '.chart{display:flex;align-items:flex-end;gap:14px;height:150px;padding:10px;border-bottom:2px solid #e2e8f0}.col{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px}.bar{width:100%;border-radius:6px 6px 0 0}.t{background:#38bdf8}.c{background:#f472b6}small{font-size:.72em;color:#64748b}b{font-size:.75em}',
      html: '<div class="chart"><div class="col"><b>18kb</b><div class="bar c" style="height:40px"></div><small>CSS يدوية</small></div><div class="col"><b>45kb</b><div class="bar c" style="height:90px"></div><small>+ نمو</small></div><div class="col"><b>92kb</b><div class="bar c" style="height:130px"></div><small>+ نمو</small></div><div class="col"><b>14kb</b><div class="bar t" style="height:32px"></div><small>Tailwind</small></div><div class="col"><b>15kb</b><div class="bar t" style="height:34px"></div><small>ثابت تقريباً</small></div></div><p style="color:#64748b;font-size:.85em;margin-top:10px">CSS التقليدية تنمو مع كل مكوّن؛ Tailwind تتوقّف لأن الأصناف تُعاد استخدامها.</p>' },

    { t: 'h2', text: 'التثبيت' },
    { t: 'code', lang: 'bash', title: 'مع Vite (الأسهل)', code: `
npm create vite@latest my-app
cd my-app

npm install -D tailwindcss @tailwindcss/vite` },
    { t: 'code', lang: 'js', title: 'vite.config.js', code: `
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()]
});` },
    { t: 'code', lang: 'css', title: 'src/style.css', code: '@import "tailwindcss";' },
    { t: 'code', lang: 'bash', title: 'بلا أداة بناء — واجهة سطر الأوامر', code: `
npm install -D tailwindcss @tailwindcss/cli

# المراقبة أثناء التطوير
npx @tailwindcss/cli -i src/input.css -o dist/output.css --watch

# البناء للإنتاج
npx @tailwindcss/cli -i src/input.css -o dist/output.css --minify` },
    { t: 'note', text: 'الإصدار الرابع بسّط الإعداد كثيراً: لا ملف `tailwind.config.js` إلزامي، ولا `postcss.config.js`. سطر `@import "tailwindcss"` واحد يكفي، والتخصيص يتم في CSS نفسها.' },
    { t: 'warn', title: 'لا تستخدم رابط CDN في الإنتاج', text: 'رابط CDN مفيد للتجربة السريعة فقط: يحمّل المكتبة كاملة (أكثر من 3 ميجابايت) ويولّد الأصناف في المتصفح. للإنتاج استخدم خطوة بناء دائماً.' },

    { t: 'h2', text: 'قراءة أسماء الأصناف' },
    { t: 'p', text: 'التسمية منهجية ومتوقّعة، فما إن تفهم النمط حتى تخمّن الأصناف بلا رجوع للتوثيق.' },
    { t: 'code', lang: 'text', noCopy: true, code: `
[البادئة]:[الخاصية]-[القيمة]

p-4              padding: 1rem
px-4             padding يميناً ويساراً
pt-4             padding-top
mt-2             margin-top
-mt-2            margin-top سالب

text-lg          font-size كبير
text-center      text-align: center
text-red-500     color أحمر بدرجة 500

bg-blue-100      background لون أزرق فاتح
border-2         border-width: 2px
rounded-full     border-radius دائري كامل

w-full           width: 100%
h-screen         height: 100vh

md:flex          من شاشة md فأعلى
hover:bg-red-500 عند مرور المؤشّر
dark:bg-slate-900 في الوضع الليلي
focus:ring-2     عند التركيز` },
    { t: 'demo', title: 'مقياس المسافات', height: 250,
      css: '.r{display:flex;align-items:center;gap:10px;margin-bottom:6px;font-size:.88em}.bx{background:#38bdf8;height:18px;border-radius:4px}code{font-family:monospace;background:#f1f5f9;padding:2px 8px;border-radius:5px;min-width:52px;display:inline-block;text-align:center;font-size:.85em}',
      html: '<div class="r"><code>p-1</code><span class="bx" style="width:4px"></span><span style="color:#64748b">0.25rem = 4px</span></div><div class="r"><code>p-2</code><span class="bx" style="width:8px"></span><span style="color:#64748b">0.5rem = 8px</span></div><div class="r"><code>p-4</code><span class="bx" style="width:16px"></span><span style="color:#64748b">1rem = 16px</span></div><div class="r"><code>p-6</code><span class="bx" style="width:24px"></span><span style="color:#64748b">1.5rem = 24px</span></div><div class="r"><code>p-8</code><span class="bx" style="width:32px"></span><span style="color:#64748b">2rem = 32px</span></div><div class="r"><code>p-12</code><span class="bx" style="width:48px"></span><span style="color:#64748b">3rem = 48px</span></div>' },
    { t: 'tip', text: 'القاعدة الذهبية: **الرقم × 4 = بكسل**. فـ `p-4` تساوي 16 بكسل، و`gap-6` تساوي 24 بكسل. هذه القاعدة وحدها تغنيك عن حفظ المقياس.' },

    { t: 'h2', text: 'أول بطاقة' },
    { t: 'code', lang: 'html', code: `
<div class="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
  <h3 class="mb-2 text-xl font-bold text-slate-900">
    سماعة لاسلكية
  </h3>

  <p class="mb-4 text-slate-500">
    عزل ضوضاء نشط وبطارية تدوم ثلاثين ساعة.
  </p>

  <div class="flex items-center justify-between">
    <span class="text-2xl font-extrabold text-sky-600">
      299 ريالاً
    </span>

    <button class="rounded-lg bg-sky-600 px-4 py-2 font-bold text-white transition hover:bg-sky-700">
      أضف للسلة
    </button>
  </div>
</div>` },
    { t: 'demo', title: 'النتيجة', height: 250,
      css: '.card{max-width:24rem;border-radius:1rem;border:1px solid #e2e8f0;background:#fff;padding:1.5rem;box-shadow:0 4px 6px -1px rgb(0 0 0/.1)}h3{margin:0 0 .5rem;font-size:1.25rem;font-weight:700;color:#0f172a}p{margin:0 0 1rem;color:#64748b}.row{display:flex;align-items:center;justify-content:space-between}.price{font-size:1.5rem;font-weight:800;color:#0284c7}button{border-radius:.5rem;background:#0284c7;padding:.5rem 1rem;font-weight:700;color:#fff;border:0;cursor:pointer;font-family:inherit;transition:.2s}button:hover{background:#0369a1}',
      html: '<div class="card"><h3>سماعة لاسلكية</h3><p>عزل ضوضاء نشط وبطارية تدوم ثلاثين ساعة.</p><div class="row"><span class="price">299 ريالاً</span><button>أضف للسلة</button></div></div>' },

    { t: 'h2', text: 'متى تستخدم Tailwind؟' },
    { t: 'table', head: ['مناسبة حين', 'قد لا تناسب حين'], rows: [
      ['تبني بأطر مكوّنات (React/Vue/Angular)', 'مشروع HTML ثابت صغير جداً'],
      ['تريد تصميماً مخصّصاً لا قالباً جاهزاً', 'تريد مكوّنات جاهزة فوراً بلا تصميم'],
      ['فريق يحتاج اتّساقاً بلا نقاش مستمر', 'الفريق يرفض الأصناف في الترميز'],
      ['تكره اختراع الأسماء', 'تحتاج دعم متصفحات قديمة جداً'],
      ['تريد سرعة في النماذج الأولية', 'لا تستطيع إضافة خطوة بناء']
    ]},
    { t: 'warn', title: 'تحتاج CSS أولاً', text: 'Tailwind ليست بديلاً عن تعلّم CSS. `flex-1` لن تفيدك إن كنت لا تفهم Flexbox، و`grid-cols-3` بلا معنى إن لم تفهم Grid. Tailwind تسرّع من **يعرف** CSS.' },

    { t: 'exercise',
      title: 'تمرين: أول صفحة بـ Tailwind',
      brief: 'جهّز مشروعاً وابنِ صفحة بسيطة بأصناف Tailwind فقط.',
      requirements: [
        'أنشئ مشروع Vite وثبّت Tailwind وشغّله.',
        'صفحة فيها ترويسة بخلفية ملوّنة وعنوان أبيض في المنتصف.',
        'ثلاث بطاقات متجاورة، كل بطاقة: حدود، حواف دائرية، حشو، ظل، عنوان، فقرة، وزر.',
        'الأزرار تغيّر لونها عند مرور المؤشّر.',
        'استخدم `flex` و `gap` لترتيب البطاقات.',
        'استخدم مقياس المسافات فقط — لا قيم عشوائية.',
        'لا تكتب سطر CSS مخصّصاً واحداً.',
        'ابنِ للإنتاج وقس حجم ملف CSS الناتج.'
      ],
      hints: [
        'تذكّر: الرقم × 4 = بكسل.',
        '`flex gap-4` لترتيب أفقي بمسافات.',
        '`transition` ضرورية لتنعيم تغيّر اللون عند hover.'
      ],
      solution: { lang: 'html', code: `
<body class="bg-slate-50 font-sans">

  <header class="bg-sky-600 py-12 text-center">
    <h1 class="text-4xl font-extrabold text-white">
      متجر التقنية
    </h1>
    <p class="mt-3 text-sky-100">
      أفضل الأجهزة بأفضل الأسعار
    </p>
  </header>

  <main class="mx-auto max-w-5xl p-8">
    <div class="flex flex-wrap gap-6">

      <article class="flex-1 min-w-64 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
        <h3 class="mb-2 text-xl font-bold text-slate-900">سماعة لاسلكية</h3>
        <p class="mb-4 text-slate-500">عزل ضوضاء نشط وبطارية 30 ساعة.</p>
        <button class="w-full rounded-lg bg-sky-600 py-2 font-bold text-white transition hover:bg-sky-700">
          299 ريالاً
        </button>
      </article>

      <article class="flex-1 min-w-64 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
        <h3 class="mb-2 text-xl font-bold text-slate-900">لوحة مفاتيح</h3>
        <p class="mb-4 text-slate-500">مفاتيح ميكانيكية بإضاءة خلفية.</p>
        <button class="w-full rounded-lg bg-sky-600 py-2 font-bold text-white transition hover:bg-sky-700">
          450 ريالاً
        </button>
      </article>

      <article class="flex-1 min-w-64 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
        <h3 class="mb-2 text-xl font-bold text-slate-900">ماوس لاسلكي</h3>
        <p class="mb-4 text-slate-500">دقة عالية وبطارية قابلة للشحن.</p>
        <button class="w-full rounded-lg bg-sky-600 py-2 font-bold text-white transition hover:bg-sky-700">
          120 ريالاً
        </button>
      </article>

    </div>
  </main>

</body>` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق الجوهري بين Tailwind و `style=` المضمّن؟', options: ['لا فرق', 'Tailwind تعتمد نظام تصميم محدوداً وتدعم الحالات والتجاوب', 'Tailwind أسرع', '`style` أحدث'], answer: 1,
        explain: 'القيود المتّسقة ودعم hover و md و dark هي ما يستحيل في الأنماط المضمّنة.' },
      { q: 'لماذا لا ينمو حجم CSS كثيراً مع Tailwind؟', options: ['لأنها مضغوطة', 'لأنها تولّد الأصناف المستخدمة فقط، والأصناف تُعاد استخدامها', 'لأنها صغيرة أصلاً', 'لأنها في CDN'], answer: 1,
        explain: 'CSS التقليدية تنمو مع كل مكوّن؛ Tailwind تتوقّف عن النمو بعد تغطية الأساسيات.' },
      { q: 'كم بكسل يساوي الصنف `p-6`؟', options: ['6', '12', '24', '60'], answer: 2,
        explain: 'القاعدة: الرقم × 4 = بكسل، فـ 6 × 4 = 24 بكسل.' },
      { q: 'ما الفرق بين Tailwind و Bootstrap؟', options: ['لا فرق', 'Bootstrap يعطي مكوّنات جاهزة وTailwind يعطي لبنات تبني بها تصميمك', 'Tailwind أقدم', 'Bootstrap أخف'], answer: 1,
        explain: 'لهذا تتشابه مواقع Bootstrap، بينما لا يوجد «شكل Tailwind».' },
      { q: 'متى لا تكون Tailwind خياراً مناسباً؟', options: ['في المشاريع الكبيرة', 'حين لا يمكنك إضافة خطوة بناء أو تريد مكوّنات جاهزة فوراً', 'مع React', 'مع الفرق'], answer: 1,
        explain: 'تحتاج خطوة بناء، ولا تعطيك مكوّنات مصمّمة جاهزة.' }
    ]}
  ]
};
