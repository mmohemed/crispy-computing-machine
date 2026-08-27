'use strict';

module.exports = {
  slug: '03-nesting',
  title: 'التداخل والمحدّد الأب',
  summary: 'كتابة المحدّدات متداخلة كما تتداخل عناصر HTML، والرمز & وقواعد تجنّب التداخل المفرط.',
  duration: 40,
  level: 'مبتدئ',
  tags: ['التداخل', 'المحدّدات'],
  objectives: [
    'تكتب محدّدات متداخلة وتفهم ناتجها.',
    'تستخدم الرمز `&` للحالات والأصناف المركّبة.',
    'تدخّل الخصائص ذات البادئة المشتركة.',
    'تتجنّب التداخل المفرط الذي يفسد المشروع.',
    'تدمج التداخل مع منهجية BEM.'
  ],
  quickRef: [
    { code: '.a { .b { … } }', desc: 'ينتج `.a .b`' },
    { code: '&:hover', desc: 'حالة على المحدّد نفسه' },
    { code: '&__title', desc: 'إلحاق نص باسم الأب (BEM)' },
    { code: '.parent &', desc: 'وضع الأب في موضع آخر' },
    { code: 'font: { size: …; weight: …; }', desc: 'تداخل الخصائص' },
    { code: '@at-root', desc: 'الخروج من التداخل' }
  ],
  blocks: [
    { t: 'h2', text: 'التداخل الأساسي' },
    { t: 'p', text: 'في CSS تكرّر اسم الأب في كل محدّد. في Sass تكتبه مرة وتضع الأبناء بداخله — تماماً كما تتداخل عناصر HTML نفسها.' },
    { t: 'code', lang: 'scss', title: 'ما تكتبه', code: `
.card {
  padding: 20px;
  border-radius: 12px;

  .title {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .body {
    color: #64748b;

    p {
      margin-bottom: 12px;
    }
  }
}` },
    { t: 'code', lang: 'css', title: 'ما يُولَّد', code: `
.card {
  padding: 20px;
  border-radius: 12px;
}
.card .title {
  font-size: 1.25rem;
  font-weight: 700;
}
.card .body {
  color: #64748b;
}
.card .body p {
  margin-bottom: 12px;
}` },
    { t: 'p', text: 'كل مستوى تداخل يضيف مسافة في المحدّد الناتج — أي علاقة **سليل**. ولإنتاج علاقة الابن المباشر استخدم `>` صراحةً.' },
    { t: 'code', lang: 'scss', code: `
.menu {
  > li {           // ابن مباشر فقط
    display: inline-block;
  }

  + .menu {        // أخ تالٍ مباشر
    margin-top: 20px;
  }

  ~ .footer {      // أخ تالٍ عام
    color: gray;
  }
}` },

    { t: 'h2', text: 'الرمز `&` — المحدّد الأب' },
    { t: 'p', text: 'التداخل العادي يضيف **مسافة**. لكن ماذا لو أردت `.btn:hover` أو `.btn.active` بلا مسافة؟ هنا يأتي `&`: يمثّل المحدّد الأب كاملاً بلا فاصل.' },
    { t: 'code', lang: 'scss', code: `
.btn {
  padding: 12px 24px;
  background: #6366f1;
  color: #fff;

  &:hover  { background: #4f46e5; }
  &:focus-visible { outline: 3px solid #a5b4fc; }
  &:disabled { opacity: .5; cursor: not-allowed; }

  &.active { background: #4338ca; }
  &.btn--large { padding: 16px 32px; }
}` },
    { t: 'code', lang: 'css', title: 'الناتج', code: `
.btn { padding: 12px 24px; background: #6366f1; color: #fff; }
.btn:hover { background: #4f46e5; }
.btn:focus-visible { outline: 3px solid #a5b4fc; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn.active { background: #4338ca; }
.btn.btn--large { padding: 16px 32px; }` },
    { t: 'demo', title: 'الأزرار بحالاتها', height: 200,
      css: '.btn{display:inline-block;padding:12px 24px;border-radius:10px;background:#6366f1;color:#fff;border:0;cursor:pointer;font-family:inherit;margin:4px;transition:.2s}.btn:hover{background:#4f46e5}.btn.active{background:#4338ca}.btn:disabled{opacity:.5;cursor:not-allowed}',
      html: '<button class="btn">عادي (مرّر المؤشّر)</button><button class="btn active">نشط</button><button class="btn" disabled>معطّل</button>' },
    { t: 'warn', title: 'الفرق حاسم', text: '`&:hover` تعطي `.btn:hover` (نفس العنصر في حالة تمرير)، أما `:hover` بلا `&` فتعطي `.btn :hover` (أي عنصر بداخله في حالة تمرير). المسافة تغيّر المعنى كلياً.' },

    { t: 'h3', text: '`&` في موضع الابن' },
    { t: 'code', lang: 'scss', code: `
.btn {
  color: #6366f1;

  // الأب في موضع لاحق: يصبح المحدّد .dark-theme .btn
  .dark-theme & {
    color: #a5b4fc;
  }

  // مفيد جداً مع سمات الثيم
  [data-theme='dark'] & {
    background: #1e293b;
  }
}` },
    { t: 'p', text: 'هذا نمط قوي: تُبقي كل ما يخصّ المكوّن في كتلة واحدة، حتى الأنماط التي تعتمد على سياق خارجي.' },

    { t: 'h3', text: '`&` مع إلحاق النص (BEM)' },
    { t: 'code', lang: 'scss', code: `
.card {
  padding: 20px;

  &__title {
    font-size: 1.25rem;
  }

  &__body {
    color: #64748b;
  }

  &--featured {
    border-color: gold;
  }

  &--featured &__title {
    color: gold;
  }
}` },
    { t: 'code', lang: 'css', title: 'الناتج', code: `
.card { padding: 20px; }
.card__title { font-size: 1.25rem; }
.card__body { color: #64748b; }
.card--featured { border-color: gold; }
.card--featured .card__title { color: gold; }` },
    { t: 'tip', text: 'هذا هو أشهر استخدام لـ `&` في المشاريع الحديثة: يجمع كل أجزاء المكوّن في كتلة واحدة مع إنتاج محدّدات مسطّحة منخفضة الخصوصية.' },
    { t: 'danger', title: 'عيب واحد مهم', text: 'البحث عن `card__title` في محرّرك **لن يجده** لأنه مكتوب `&__title`. هذا يصعّب التنقّل في المشاريع الكبيرة. بعض الفرق تفضّل كتابة الاسم كاملاً لهذا السبب — قرار يخصّ فريقك.' },

    { t: 'h2', text: 'تداخل الخصائص' },
    { t: 'code', lang: 'scss', code: `
.title {
  font: {
    family: 'Cairo', sans-serif;
    size: 1.5rem;
    weight: 700;
  }

  margin: {
    top: 0;
    bottom: 16px;
  }

  border: 1px solid #e2e8f0 {   // قيمة مختصرة ثم تفاصيل
    radius: 12px;
  }
}` },
    { t: 'code', lang: 'css', title: 'الناتج', code: `
.title {
  font-family: 'Cairo', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}` },
    { t: 'note', text: 'ميزة أنيقة لكنها قليلة الاستخدام عملياً — معظم الفرق تجدها أقلّ وضوحاً من الكتابة العادية. اعرفها لتفهم كوداً تقابله.' },

    { t: 'h2', text: 'تداخل استعلامات الوسائط' },
    { t: 'code', lang: 'scss', code: `
.sidebar {
  width: 100%;

  @media (min-width: 768px) {
    width: 300px;
    float: inline-start;
  }

  @media (min-width: 1200px) {
    width: 380px;
  }
}` },
    { t: 'p', text: 'هذه من أفضل فوائد Sass: تبقى كل أنماط المكوّن — بما فيها التجاوب — في مكان واحد، بدل تجميع كل الاستعلامات في نهاية الملف بعيداً عن سياقها.' },
    { t: 'code', lang: 'css', title: 'الناتج', code: `
.sidebar { width: 100%; }

@media (min-width: 768px) {
  .sidebar { width: 300px; float: inline-start; }
}
@media (min-width: 1200px) {
  .sidebar { width: 380px; }
}` },

    { t: 'h2', text: 'خطر التداخل المفرط' },
    { t: 'p', text: 'التداخل مغرٍ: تبدأ بمستوى، ثم ثلاثة، ثم تجد نفسك أمام محدّد بسبعة مستويات لا يمكن تجاوزه ولا فهمه.' },
    { t: 'compare', lang: 'scss', bad: {
      code: '.page {\n  .container {\n    .content {\n      .article {\n        .header {\n          h2 {\n            a { color: red; }\n          }\n        }\n      }\n    }\n  }\n}',
      why: 'ينتج `.page .container .content .article .header h2 a` — خصوصية عالية جداً، هشّ أمام أي تغيير في البنية، وحجم ملف منتفخ.'
    }, good: {
      code: '.article-title-link {\n  color: red;\n}',
      why: 'محدّد واحد بخصوصية منخفضة، مستقلّ عن بنية HTML، وسهل التجاوز عند الحاجة.'
    }},
    { t: 'ul', items: [
      '**قاعدة الثلاثة مستويات**: لا تتجاوز ثلاثة مستويات تداخل أبداً (والاثنان أفضل).',
      '`&:hover` و `&__title` **لا تُحسبان** مستوى لأنهما لا تضيفان مسافة.',
      'إن وجدت نفسك تتجاوز الحد، فالمشكلة في **التسمية** لا في التداخل: اصنع صنفاً جديداً.',
      'كل مستوى إضافي يرفع الخصوصية ويجعل تجاوز النمط لاحقاً أصعب.',
      'المحدّدات الطويلة تكبّر حجم ملف CSS — وهذا يُحمَّل عند كل زيارة.'
    ]},
    { t: 'demo', title: 'أثر التداخل على حجم الناتج', height: 230,
      css: 'table{width:100%;border-collapse:collapse;font-size:.92em}td,th{padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right}th{background:#fce7f3;color:#be185d}code{font-family:monospace;font-size:.86em;direction:ltr;display:inline-block}',
      html: '<table><tr><th>مستويات</th><th>المحدّد الناتج</th><th>الحكم</th></tr><tr><td>1</td><td><code>.card</code></td><td>✅ ممتاز</td></tr><tr><td>2</td><td><code>.card .title</code></td><td>✅ جيد</td></tr><tr><td>3</td><td><code>.card .body p</code></td><td>⚠️ الحد الأقصى</td></tr><tr><td>5</td><td><code>.page .card .body .text p</code></td><td>❌ أعد التفكير</td></tr></table>' },

    { t: 'h2', text: '`@at-root` — الخروج من التداخل' },
    { t: 'code', lang: 'scss', code: `
.card {
  padding: 20px;

  @at-root .card-shadow {
    box-shadow: 0 8px 24px rgba(0,0,0,.1);
  }
}` },
    { t: 'code', lang: 'css', title: 'الناتج', code: `
.card { padding: 20px; }
.card-shadow { box-shadow: 0 8px 24px rgba(0,0,0,.1); }` },
    { t: 'p', text: 'نادرة الاستخدام، لكنها مفيدة داخل mixin يحتاج توليد قاعدة عامة رغم استدعائه من داخل محدّد متداخل.' },

    { t: 'h2', text: 'التداخل في CSS الأصلية' },
    { t: 'p', text: 'CSS نفسها صارت تدعم التداخل في المتصفحات الحديثة. لكن يبقى Sass أفضل حالياً: دعمه شامل لكل المتصفحات (لأنه يُترجَم)، وصياغته أنضج، ولا يزال يقدّم المتغيّرات والحلقات والدوال التي لا تملكها CSS.' },
    { t: 'code', lang: 'css', title: 'تداخل CSS الأصلي — للعلم', code: `
.card {
  padding: 20px;

  & .title { font-size: 1.25rem; }

  &:hover { border-color: blue; }
}` },

    { t: 'exercise',
      title: 'تمرين: مكوّن بطاقة منتج بالتداخل',
      brief: 'حوّل CSS التالي إلى SCSS متداخل بمنهجية BEM، بحد أقصى مستويين.',
      starter: { lang: 'css', title: 'CSS المسطّح', code: `
.product { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
.product:hover { border-color: #6366f1; transform: translateY(-4px); }
.product__image { width: 100%; border-radius: 8px; }
.product__title { font-size: 1.1rem; margin: 12px 0 4px; }
.product__price { color: #6366f1; font-weight: 800; }
.product__badge { padding: 2px 10px; border-radius: 99px; background: #eef2ff; }
.product--sale { border-color: #ef4444; }
.product--sale .product__price { color: #ef4444; }
.product--sold-out { opacity: .5; }
.product--sold-out .product__badge { background: #f1f5f9; }
.product__btn { width: 100%; padding: 10px; margin-top: 12px; }
.product__btn:hover { background: #4f46e5; }
.product__btn:disabled { opacity: .5; }

@media (min-width: 768px) {
  .product { padding: 20px; }
  .product__title { font-size: 1.25rem; }
}` },
      requirements: [
        'كتلة واحدة `.product` تحتوي كل شيء.',
        'استخدم `&__` للعناصر و `&--` للمعدِّلات.',
        'كل الحالات (`:hover`, `:disabled`) بـ `&`.',
        'استعلام الوسائط متداخل داخل الكتل المعنية لا في نهاية الملف.',
        'لا تتجاوز مستويين من التداخل الحقيقي.',
        'استخرج الألوان المتكرّرة إلى متغيّرات في أعلى الملف.'
      ],
      hints: [
        '`&--sale &__price` تنتج `.product--sale .product__price`.',
        'استعلام الوسائط يمكن وضعه داخل `&__title` نفسه.',
        '`&` لا تُحسب مستوى تداخل لأنها لا تضيف مسافة.'
      ],
      solution: { lang: 'scss', code: `
$color-brand: #6366f1;
$color-brand-dark: #4f46e5;
$color-danger: #ef4444;
$color-border: #e2e8f0;
$bp-md: 768px;

.product {
  border: 1px solid $color-border;
  border-radius: 12px;
  padding: 16px;
  transition: .25s;

  &:hover {
    border-color: $color-brand;
    transform: translateY(-4px);
  }

  @media (min-width: $bp-md) {
    padding: 20px;
  }

  &__image {
    width: 100%;
    border-radius: 8px;
  }

  &__title {
    font-size: 1.1rem;
    margin: 12px 0 4px;

    @media (min-width: $bp-md) {
      font-size: 1.25rem;
    }
  }

  &__price {
    color: $color-brand;
    font-weight: 800;
  }

  &__badge {
    padding: 2px 10px;
    border-radius: 99px;
    background: #eef2ff;
  }

  &__btn {
    width: 100%;
    padding: 10px;
    margin-top: 12px;
    background: $color-brand;
    color: #fff;
    border: 0;
    border-radius: 8px;
    cursor: pointer;

    &:hover { background: $color-brand-dark; }
    &:disabled { opacity: .5; cursor: not-allowed; }
  }

  &--sale {
    border-color: $color-danger;

    .product__price { color: $color-danger; }
  }

  &--sold-out {
    opacity: .5;

    .product__badge { background: #f1f5f9; }
  }
}` },
      solutionNote: 'لاحظ أن أعمق تداخل حقيقي هو مستويان فقط (`&--sale` ثم `.product__price`)، رغم أن الكتلة تغطّي المكوّن كاملاً.'
    },

    { t: 'quiz', items: [
      { q: 'ما ناتج `.a { .b { color: red } }`؟', options: ['`.a.b`', '`.a .b`', '`.b`', '`.a > .b`'], answer: 1,
        explain: 'التداخل العادي يضيف مسافة، أي علاقة سليل.' },
      { q: 'ما الفرق بين `&:hover` و `:hover` داخل `.btn`؟', options: ['لا فرق', 'الأولى `.btn:hover` والثانية `.btn :hover`', 'الثانية أسرع', 'الأولى خاطئة'], answer: 1,
        explain: '`&` تلصق المحدّد بالأب بلا مسافة؛ بدونها تُضاف مسافة فيتغيّر المعنى تماماً.' },
      { q: 'ما الحد الموصى به لمستويات التداخل؟', options: ['بلا حد', 'ثلاثة كحد أقصى', 'عشرة', 'واحد فقط'], answer: 1,
        explain: 'ما زاد يرفع الخصوصية ويجعل الكود هشّاً ومنتفخاً.' },
      { q: 'ماذا تنتج `&__title` داخل `.card`؟', options: ['`.card .title`', '`.card__title`', '`.card:title`', 'خطأ'], answer: 1,
        explain: '`&` تُستبدَل باسم الأب حرفياً، فيلتصق النص به.' },
      { q: 'ما فائدة تداخل استعلامات الوسائط؟', options: ['أداء أفضل', 'إبقاء أنماط المكوّن كلها بما فيها التجاوب في مكان واحد', 'حجم أصغر', 'دعم أوسع'], answer: 1,
        explain: 'تنظيم أفضل: لا تبحث عن أنماط التجاوب في نهاية ملف بعيد.' }
    ]}
  ]
};
