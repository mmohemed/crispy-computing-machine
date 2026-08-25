'use strict';

module.exports = {
  slug: '02-selectors',
  title: 'المحدّدات (Selectors)',
  summary: 'كيف تستهدف بالضبط العنصر الذي تريده: محدّدات العناصر والأصناف والسمات والعلاقات والزائفة.',
  duration: 50,
  level: 'مبتدئ',
  tags: ['المحدّدات', 'أساسيات'],
  objectives: [
    'تستخدم محدّدات العنصر والصنف والمعرّف بشكل صحيح.',
    'تجمع المحدّدات وتربطها بعلاقات الأب والأخ.',
    'تستهدف العناصر بسماتها.',
    'تستخدم الأصناف الزائفة للحالات التفاعلية.',
    'تكتب محدّدات بسيطة قابلة للصيانة.'
  ],
  quickRef: [
    { code: '.card', desc: 'كل عنصر يحمل الصنف card' },
    { code: '#main', desc: 'العنصر ذو المعرّف main' },
    { code: 'a.btn', desc: 'رابط يحمل الصنف btn' },
    { code: '.card p', desc: 'كل فقرة داخل card (سليل)' },
    { code: '.card > p', desc: 'فقرة ابن مباشر لـ card' },
    { code: 'h2 + p', desc: 'الفقرة التالية مباشرة لـ h2' },
    { code: '[type="email"]', desc: 'عنصر بسمة وقيمة محدّدة' },
    { code: ':hover, :focus', desc: 'حالات تفاعلية' }
  ],
  blocks: [
    { t: 'h2', text: 'المحدّد هو السؤال' },
    { t: 'p', text: 'كل قاعدة CSS تبدأ بسؤال: **على من نطبّق؟** المحدّد هو صياغة هذا السؤال. إتقان المحدّدات يعني أن تصل إلى أي عنصر في صفحتك بدقّة ودون آثار جانبية.' },

    { t: 'h2', text: 'المحدّدات الأساسية' },
    { t: 'code', lang: 'css', code: `
/* 1) محدّد العنصر — كل الفقرات */
p { color: #334155; }

/* 2) محدّد الصنف — كل ما يحمل class="card" */
.card { border-radius: 12px; }

/* 3) محدّد المعرّف — العنصر ذو id="hero" */
#hero { min-height: 400px; }

/* 4) المحدّد الشامل — كل عنصر */
* { box-sizing: border-box; }` },
    { t: 'table', head: ['المحدّد', 'يستهدف', 'الخصوصية', 'الاستخدام'], rows: [
      ['`p`', 'كل عناصر p', 'منخفضة (0,0,1)', 'أنماط أساسية عامة'],
      ['`.card`', 'كل ما يحمل الصنف', 'متوسطة (0,1,0)', '**الأساس في كل مشروع**'],
      ['`#hero`', 'عنصر واحد فقط', 'عالية (1,0,0)', 'نادراً — تجنّبه في التنسيق'],
      ['`*`', 'كل شيء', 'صفر (0,0,0)', 'إعادة الضبط فقط']
    ]},
    { t: 'warn', title: 'لماذا نتجنّب `#id` في التنسيق؟', text: 'خصوصيته عالية جداً: قاعدة `#hero { color: red }` لا يمكن تجاوزها بأي عدد من الأصناف. هذا يدفعك لاحقاً إلى `!important` وتبدأ سلسلة من الفوضى. احتفظ بـ `id` للروابط الداخلية وربط `label` وجافاسكربت.' },

    { t: 'h2', text: 'الجمع والتقاطع' },
    { t: 'code', lang: 'css', code: `
/* جمع: تطبيق على عدة محدّدات (أو) */
h1, h2, h3 { font-weight: 800; }

/* تقاطع: عنصر يحقّق كل الشروط (و) — بلا مسافات */
a.btn { padding: 12px 24px; }        /* رابط + صنف btn */
.card.featured { border-color: gold; } /* صنفان معاً */
input[type="email"].large { … }` },
    { t: 'demo', title: 'الفرق بين المسافة وعدمها', height: 260,
      css: '.box{border:1px solid #e2e8f0;padding:10px;border-radius:8px;margin-bottom:8px}.tag{display:inline-block;padding:4px 12px;border-radius:99px;background:#e2e8f0;margin:2px}.tag.new{background:#6366f1;color:#fff}.box .tag{font-weight:700}',
      html: '<div class="box"><b>.tag.new</b> (بلا مسافة = الصنفان معاً)<br><span class="tag">عادي</span><span class="tag new">جديد</span></div>' },
    { t: 'danger', title: 'فرق حاسم', text: '`.a.b` تعني «عنصر يحمل الصنفين معاً». أما `.a .b` (بمسافة) فتعني «عنصر بصنف b داخل عنصر بصنف a». المسافة تغيّر المعنى كلياً.' },

    { t: 'h2', text: 'محدّدات العلاقات' },
    { t: 'code', lang: 'css', code: `
/* السليل: أي p داخل .card مهما عمق التداخل */
.card p { margin-bottom: 12px; }

/* الابن المباشر: p ابن مباشر لـ .card فقط */
.card > p { font-size: 18px; }

/* الأخ التالي المباشر: أول p بعد h2 مباشرة */
h2 + p { margin-top: 0; }

/* كل الأشقاء التاليين: كل p بعد h2 ضمن نفس الأب */
h2 ~ p { color: #64748b; }` },
    { t: 'demo', title: 'العلاقات بصرياً', height: 340,
      css: '.demo{border:2px solid #6366f1;border-radius:10px;padding:12px}.demo p{padding:6px 10px;border-radius:6px;margin:6px 0;background:#f1f5f9}.demo > p{border-inline-start:4px solid #6366f1}.demo section p{background:#fef3c7}h3+p{background:#dcfce7;font-weight:700}',
      html: '<div class="demo"><h3>عنوان</h3><p>ابن مباشر + أخ تالٍ لـ h3 (أخضر)</p><p>ابن مباشر آخر</p><section><p>حفيد — ليس ابناً مباشراً (أصفر)</p></section></div>' },
    { t: 'table', head: ['الرمز', 'الاسم', 'المعنى'], rows: [
      ['`A B`', 'سليل', 'B داخل A على أي عمق'],
      ['`A > B`', 'ابن مباشر', 'B ابن مباشر لـ A فقط'],
      ['`A + B`', 'أخ تالٍ مباشر', 'B يلي A مباشرة في نفس الأب'],
      ['`A ~ B`', 'أخ تالٍ عام', 'كل B بعد A في نفس الأب']
    ]},

    { t: 'h2', text: 'محدّدات السمات' },
    { t: 'code', lang: 'css', code: `
/* وجود السمة */
[disabled] { opacity: .5; }

/* قيمة مطابقة تماماً */
[type="email"] { direction: ltr; }

/* يبدأ بـ */
[href^="https://"] { color: #10b981; }

/* ينتهي بـ */
[href$=".pdf"]::after { content: " (PDF)"; }

/* يحتوي */
[class*="col-"] { float: right; }

/* كلمة ضمن قائمة مفصولة بمسافات */
[data-tags~="css"] { … }

/* غير حسّاس لحالة الأحرف */
[type="EMAIL" i] { … }` },
    { t: 'demo', title: 'تمييز الروابط بأنواعها', height: 240,
      css: 'a{display:block;margin:6px 0;color:#4f46e5}a[href^="https://"]::before{content:"🔗 "}a[href$=".pdf"]::after{content:" (ملف PDF)";color:#dc2626;font-size:.85em}a[href^="mailto:"]::before{content:"✉ "}',
      html: '<a href="https://example.com">رابط خارجي</a><a href="guide.pdf">دليل المستخدم</a><a href="mailto:a@b.com">راسلنا</a>' },
    { t: 'tip', text: 'محدّدات السمات قوية جداً مع `data-*`: `[data-state="open"]` تتيح لك تغيير مظهر مكوّن كامل بتبديل سمة واحدة من جافاسكربت.' },

    { t: 'h2', text: 'الأصناف الزائفة (Pseudo-classes)' },
    { t: 'p', text: 'تستهدف العنصر في **حالة** معيّنة لا يمكن التعبير عنها بالترميز وحده.' },
    { t: 'h3', text: 'الحالات التفاعلية' },
    { t: 'code', lang: 'css', code: `
a:hover        { text-decoration: underline; }
a:focus-visible { outline: 3px solid #6366f1; }
a:active       { transform: scale(.97); }
a:visited      { color: #7c3aed; }

button:disabled { opacity: .5; cursor: not-allowed; }
input:checked   { … }
input:required  { … }
input:user-invalid { border-color: #ef4444; }` },
    { t: 'demo', title: 'مرّر المؤشّر واضغط', height: 190,
      css: '.btn{display:inline-block;padding:12px 28px;border-radius:99px;background:#6366f1;color:#fff;text-decoration:none;transition:.2s}.btn:hover{background:#4f46e5;transform:translateY(-3px)}.btn:active{transform:translateY(0) scale(.97)}',
      html: '<a class="btn" href="#">مرّر المؤشّر فوقي</a>' },

    { t: 'h3', text: 'المحدّدات البنيوية' },
    { t: 'code', lang: 'css', code: `
li:first-child  { … }   /* أول ابن */
li:last-child   { … }   /* آخر ابن */
li:only-child   { … }   /* الابن الوحيد */
li:nth-child(3) { … }   /* الثالث */
li:nth-child(odd)  { … }  /* الفردي */
li:nth-child(even) { … }  /* الزوجي */
li:nth-child(3n)   { … }  /* كل ثالث */
li:nth-child(n+4)  { … }  /* من الرابع فصاعداً */
li:nth-last-child(2) { … } /* الثاني من النهاية */

p:first-of-type { … }   /* أول p بين أشقائه */
:not(.active)   { … }   /* كل ما ليس active */
:empty          { … }   /* عنصر بلا محتوى */` },
    { t: 'demo', title: 'تلوين الصفوف بالتناوب', height: 280,
      css: 'ul{list-style:none;padding:0;margin:0;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}li{padding:10px 14px}li:nth-child(odd){background:#f8fafc}li:first-child{background:#6366f1;color:#fff;font-weight:700}li:last-child{border-top:2px solid #6366f1;font-weight:700}',
      html: '<ul><li>الرأس</li><li>الصف الأول</li><li>الصف الثاني</li><li>الصف الثالث</li><li>الصف الرابع</li><li>الإجمالي</li></ul>' },
    { t: 'note', title: 'كيف تقرأ `nth-child(an+b)`؟', text: 'عوّض `n` بـ 0 ثم 1 ثم 2 وهكذا. مثال `3n+1` يعطي 1, 4, 7, 10… ومثال `-n+3` يعطي 3, 2, 1 أي «أول ثلاثة فقط».' },

    { t: 'h2', text: 'العناصر الزائفة (Pseudo-elements)' },
    { t: 'p', text: 'تُكتب بنقطتين `::` وتنشئ جزءاً وهمياً من العنصر لم يوجد في HTML.' },
    { t: 'code', lang: 'css', code: `
.quote::before { content: "«"; color: #6366f1; }
.quote::after  { content: "»"; color: #6366f1; }

p::first-line   { font-weight: 700; }
p::first-letter { font-size: 3em; float: right; }
::selection     { background: #6366f1; color: #fff; }
input::placeholder { color: #94a3b8; }` },
    { t: 'demo', title: 'حرف استهلالي واقتباس', height: 260,
      css: '.drop::first-letter{font-size:3.2em;float:right;line-height:.8;margin-left:8px;color:#6366f1;font-weight:800}.quote{background:#f8fafc;padding:12px 16px;border-radius:10px;margin-top:12px}.quote::before{content:"« ";color:#6366f1;font-size:1.4em}.quote::after{content:" »";color:#6366f1;font-size:1.4em}',
      html: '<p class="drop">في بدايات الويب لم تكن هناك طريقة لفصل التصميم عن المحتوى، فكان كل شيء يُكتب داخل الترميز نفسه.</p><p class="quote">التصميم ليس ما يبدو عليه الشيء، بل كيف يعمل.</p>' },
    { t: 'warn', text: 'خاصية `content` **إلزامية** لعمل `::before` و `::after` — بدونها لا يظهر شيء إطلاقاً. استخدم `content: ""` إن أردت شكلاً بلا نص.' },
    { t: 'tip', text: 'المحتوى المولَّد بـ `content` لا يُنسخ عند تحديد النص، وقارئات الشاشة تتعامل معه بشكل غير متّسق. استخدمه للزخرفة فقط لا للمعلومات المهمة.' },

    { t: 'h2', text: 'قواعد كتابة محدّدات جيدة' },
    { t: 'ol', items: [
      '**اعتمد على الأصناف** كخيار أول — مرنة وخصوصيتها متّسقة.',
      '**اجعلها قصيرة**: `.card-title` أفضل من `.page .content .card .header h3`.',
      '**تجنّب التداخل العميق** — كل مستوى يزيد الهشاشة والارتباط بالبنية.',
      '**تجنّب `!important`** إلا في حالات نادرة جداً.',
      '**سمِّ بالمعنى لا بالشكل**: `.alert-danger` أفضل من `.red-box`.'
    ]},
    { t: 'compare', lang: 'css', bad: {
      code: '#main .content div.wrapper ul li a.link span {\n  color: red;\n}',
      why: 'طويل، هشّ، خصوصيته عالية جداً، وأي تغيير في البنية يكسره.'
    }, good: {
      code: '.nav-link__label {\n  color: red;\n}',
      why: 'قصير، واضح، خصوصية متّسقة، ولا يعتمد على بنية HTML.'
    }},

    { t: 'exercise',
      title: 'تمرين: تنسيق قائمة منتجات بالمحدّدات',
      brief: 'باستخدام HTML التالي، اكتب CSS يحقّق المطلوب — دون تعديل HTML إطلاقاً.',
      starter: { lang: 'html', title: 'الترميز المعطى', code: `
<ul class="products">
  <li class="product" data-status="available">
    <h3>سماعة لاسلكية</h3>
    <p class="price">299 ريالاً</p>
    <a href="p1.html">التفاصيل</a>
  </li>
  <li class="product featured" data-status="available">
    <h3>لوحة مفاتيح</h3>
    <p class="price">450 ريالاً</p>
    <a href="https://store.example.com/p2">التفاصيل</a>
  </li>
  <li class="product" data-status="sold-out">
    <h3>ماوس لاسلكي</h3>
    <p class="price">120 ريالاً</p>
    <a href="specs.pdf">المواصفات</a>
  </li>
</ul>` },
      requirements: [
        'كل `.product` بحدود وحواف دائرية ومسافة داخلية.',
        'المنتج الذي يحمل الصنفين `product` و `featured` معاً يحصل على حد ذهبي.',
        'المنتج الذي `data-status="sold-out"` يظهر بشفافية 0.5.',
        'الروابط التي تبدأ بـ `https://` تظهر قبلها أيقونة 🔗.',
        'الروابط التي تنتهي بـ `.pdf` يظهر بعدها نص « (PDF)».',
        'أول `.product` بلا هامش علوي، وآخرها بلا هامش سفلي.',
        'العنصر الزوجي بخلفية رمادية فاتحة.',
        'السعر داخل المنتج المميّز فقط يكون عريضاً وبلون مختلف.'
      ],
      hints: [
        '«الصنفان معاً» تعني `.product.featured` بلا مسافة.',
        'استخدم `[data-status="sold-out"]` لاستهداف السمة.',
        '`::before` و `::after` تحتاجان `content` دائماً.'
      ],
      solution: { lang: 'css', code: `
.products {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  margin: 12px 0;
}

/* الصنفان معاً — بلا مسافة */
.product.featured {
  border-color: #f59e0b;
  border-width: 2px;
}

/* محدّد السمة */
.product[data-status="sold-out"] {
  opacity: .5;
}

/* السعر داخل المميّز فقط — علاقة سليل */
.product.featured .price {
  font-weight: 800;
  color: #b45309;
}

/* محدّدات بنيوية */
.product:first-child { margin-top: 0; }
.product:last-child  { margin-bottom: 0; }
.product:nth-child(even) { background: #f8fafc; }

/* محدّدات السمات مع عناصر زائفة */
.product a[href^="https://"]::before {
  content: "🔗 ";
}

.product a[href$=".pdf"]::after {
  content: " (PDF)";
  color: #dc2626;
  font-size: .85em;
}` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق بين `.a.b` و `.a .b`؟', options: ['لا فرق', 'الأولى عنصر يحمل الصنفين معاً، والثانية عنصر b داخل عنصر a', 'العكس', 'الثانية غير صالحة'], answer: 1,
        explain: 'المسافة هي محدّد السليل؛ غيابها يعني تقاطع الشروط على نفس العنصر.' },
      { q: 'أي محدّد يستهدف الابن المباشر فقط؟', options: ['`A B`', '`A > B`', '`A + B`', '`A ~ B`'], answer: 1,
        explain: '`>` يقصر الاستهداف على الأبناء المباشرين دون الأحفاد.' },
      { q: 'لماذا يُنصح بتجنّب `#id` في التنسيق؟', options: ['لا يعمل', 'خصوصيته عالية جداً فيصعب تجاوزه ويدفع نحو `!important`', 'بطيء', 'غير مدعوم'], answer: 1,
        explain: 'المعرّف يتفوّق على أي عدد من الأصناف، فيكسر نظام الطبقات في مشروعك.' },
      { q: 'ما الخاصية الإلزامية لعمل `::before`؟', options: ['`display`', '`content`', '`position`', '`width`'], answer: 1,
        explain: 'بدون `content` لا يُنشأ العنصر الزائف أصلاً.' },
      { q: 'ماذا يستهدف `li:nth-child(3n)`؟', options: ['أول ثلاثة عناصر', 'العنصر الثالث فقط', 'كل عنصر ثالث: 3, 6, 9…', 'آخر ثلاثة'], answer: 2,
        explain: 'بتعويض n بـ 1، 2، 3 نحصل على 3، 6، 9 وهكذا.' }
    ]}
  ]
};
