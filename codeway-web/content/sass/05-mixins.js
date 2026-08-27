'use strict';

module.exports = {
  slug: '05-mixins',
  title: 'الـ Mixins وإعادة الاستخدام',
  summary: 'كتل أنماط قابلة لإعادة الاستخدام تقبل معاملات ومحتوى، وأشهر الـ mixins التي ستكتبها في كل مشروع.',
  duration: 45,
  level: 'متوسط',
  tags: ['Mixins', 'إعادة الاستخدام'],
  objectives: [
    'تعرّف mixin وتستدعيه.',
    'تمرّر معاملات وتعطيها قيماً افتراضية.',
    'تستخدم `@content` لتمرير كتلة أنماط.',
    'تبني mixins للتجاوب والحالات الشائعة.',
    'تعرف متى تستخدم mixin ومتى `@extend` ومتى دالة.'
  ],
  quickRef: [
    { code: '@mixin name { … }', desc: 'تعريف' },
    { code: '@include name;', desc: 'استدعاء' },
    { code: '@mixin name($a, $b: 10px)', desc: 'معاملات وقيم افتراضية' },
    { code: '@include name($b: 20px)', desc: 'تمرير بالاسم' },
    { code: '@content', desc: 'موضع الكتلة الممرّرة' },
    { code: '$args...', desc: 'عدد متغيّر من المعاملات' }
  ],
  blocks: [
    { t: 'h2', text: 'ما هو الـ mixin؟' },
    { t: 'p', text: 'كتلة من الإعلانات تُعرَّف مرة وتُستدعى في أي مكان. مثل الدالة في البرمجة، لكنها تُنتج **أنماطاً** لا قيماً.' },
    { t: 'code', lang: 'scss', code: `
// التعريف
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// الاستدعاء
.hero {
  @include flex-center;
  min-height: 400px;
}

.modal {
  @include flex-center;
  position: fixed;
  inset: 0;
}` },
    { t: 'code', lang: 'css', title: 'الناتج', code: `
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
}` },
    { t: 'note', text: 'لاحظ أن الأنماط **تُنسَخ** في كل موضع استدعاء. هذا يعني تكراراً في الناتج — لكن ضغط gzip يتعامل مع التكرار بكفاءة عالية، فلا تقلق منه.' },

    { t: 'h2', text: 'المعاملات' },
    { t: 'code', lang: 'scss', code: `
@mixin flex($direction: row, $gap: 0, $align: center) {
  display: flex;
  flex-direction: $direction;
  align-items: $align;
  gap: $gap;
}

.nav   { @include flex(row, 16px); }
.stack { @include flex(column, 8px, stretch); }
.plain { @include flex; }                    // كل القيم افتراضية

// التمرير بالاسم — يتيح تخطّي معامل
.sidebar { @include flex($direction: column, $align: flex-start); }` },
    { t: 'tip', text: 'التمرير بالاسم يجعل الاستدعاء موثّقاً ذاتياً: `@include flex($gap: 16px)` أوضح بكثير من `@include flex(row, 16px, center)` بعد ستة أشهر.' },

    { t: 'h3', text: 'عدد متغيّر من المعاملات' },
    { t: 'code', lang: 'scss', code: `
@mixin shadow($shadows...) {
  box-shadow: $shadows;
}

.card {
  @include shadow(
    0 2px 6px rgba(0,0,0,.06),
    0 12px 32px rgba(0,0,0,.08)
  );
}` },

    { t: 'h2', text: '`@content` — تمرير كتلة أنماط' },
    { t: 'p', text: 'أقوى ميزة في الـ mixins: تستطيع تمرير **كتلة كاملة** من الأنماط تُوضَع في موضع `@content`. هذا ما يجعل mixin التجاوب ممكناً.' },
    { t: 'code', lang: 'scss', code: `
@mixin respond-to($breakpoint) {
  @media (min-width: $breakpoint) {
    @content;
  }
}

.card {
  padding: 16px;

  @include respond-to(768px) {
    padding: 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}` },
    { t: 'code', lang: 'css', title: 'الناتج', code: `
.card { padding: 16px; }

@media (min-width: 768px) {
  .card {
    padding: 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}` },

    { t: 'h2', text: 'mixins ستكتبها في كل مشروع' },
    { t: 'h3', text: '1. نقاط التوقف' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:map';

$breakpoints: (
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px
);

@mixin respond-to($name) {
  $value: map.get($breakpoints, $name);

  @if $value {
    @media (min-width: $value) { @content; }
  } @else {
    @error "نقطة التوقف '#{$name}' غير معرّفة. المتاح: #{map.keys($breakpoints)}";
  }
}

// الاستخدام
.hero {
  font-size: 1.5rem;

  @include respond-to('md') { font-size: 2rem; }
  @include respond-to('lg') { font-size: 3rem; }
}` },
    { t: 'warn', text: 'التوجيه `@error` يوقف الترجمة برسالة واضحة. بدونه، خطأ مطبعي في اسم نقطة التوقف يمرّ صامتاً ولا يُطبَّق النمط — وتقضي ساعة تبحث عن السبب.' },

    { t: 'h3', text: '2. اقتطاع النص' },
    { t: 'code', lang: 'scss', code: `
// سطر واحد
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// عدة أسطر
@mixin line-clamp($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__title { @include truncate; }
.card__desc  { @include line-clamp(3); }` },
    { t: 'demo', title: 'اقتطاع النص', height: 230,
      css: '.b{border:1px solid #e2e8f0;border-radius:10px;padding:12px;margin-bottom:10px;max-width:340px}.t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700}.d{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:#64748b;font-size:.92em;margin-top:6px}',
      html: '<div class="b"><div class="t">عنوان طويل جداً لا يتّسع في سطر واحد أبداً فيُقتطع</div><div class="d">وصف طويل يمتد لعدة أسطر لكن العرض محدود بسطرين فقط ثم يُقتطع بثلاث نقاط في نهاية السطر الثاني تلقائياً بلا جافاسكربت.</div></div>' },

    { t: 'h3', text: '3. الإخفاء البصري' },
    { t: 'code', lang: 'scss', code: `
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.sr-only { @include visually-hidden; }` },

    { t: 'h3', text: '4. مؤشّر التركيز' },
    { t: 'code', lang: 'scss', code: `
@mixin focus-ring($color: #6366f1, $width: 3px) {
  &:focus-visible {
    outline: $width solid $color;
    outline-offset: 2px;
    border-radius: 4px;
  }
}

.btn { @include focus-ring; }
.link { @include focus-ring(#ec4899, 2px); }` },

    { t: 'h3', text: '5. زر كامل' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:color';

@mixin button($bg, $fg: #fff, $padding: 12px 24px) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: $padding;
  background: $bg;
  color: $fg;
  border: 0;
  border-radius: 10px;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;

  &:hover:not(:disabled) {
    background: color.adjust($bg, $lightness: -8%);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  @include focus-ring($bg);
}

.btn-primary { @include button(#6366f1); }
.btn-danger  { @include button(#ef4444); }
.btn-ghost   { @include button(transparent, #6366f1); }` },
    { t: 'demo', title: 'أزرار من mixin واحد', height: 180,
      css: 'button{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border:0;border-radius:10px;font-family:inherit;font-weight:700;cursor:pointer;transition:.2s;margin:4px;color:#fff}.p{background:#6366f1}.p:hover{background:#4f46e5;transform:translateY(-2px)}.d{background:#ef4444}.d:hover{background:#dc2626;transform:translateY(-2px)}.g{background:transparent;color:#6366f1;border:1px solid #6366f1}',
      html: '<button class="p">أساسي</button><button class="d">خطر</button><button class="g">شبح</button>' },

    { t: 'h3', text: '6. الوضع الليلي' },
    { t: 'code', lang: 'scss', code: `
@mixin dark {
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) & { @content; }
  }
  [data-theme='dark'] & { @content; }
}

.card {
  background: #fff;
  color: #0f172a;

  @include dark {
    background: #111a2e;
    color: #e8edf9;
  }
}` },

    { t: 'h3', text: '7. نسبة أبعاد وشبكة تلقائية' },
    { t: 'code', lang: 'scss', code: `
@mixin aspect($w: 16, $h: 9) {
  aspect-ratio: #{$w} / #{$h};
  object-fit: cover;
  width: 100%;
}

@mixin auto-grid($min: 240px, $gap: 16px) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax($min, 1fr));
  gap: $gap;
}

.video { @include aspect(16, 9); }
.avatar { @include aspect(1, 1); }
.products { @include auto-grid(220px, 24px); }` },

    { t: 'h2', text: 'mixin أم `@extend` أم دالة؟' },
    { t: 'table', head: ['الأداة', 'تُرجع', 'استخدمها حين'], rows: [
      ['**mixin**', 'كتلة إعلانات', 'تحتاج معاملات، أو تولّد استعلام وسائط، أو كتلة `@content`'],
      ['**`@extend`**', 'يدمج المحدّدات', 'أنماط متطابقة تماماً بلا معاملات (بحذر — انظر الدرس 8)'],
      ['**دالة**', 'قيمة واحدة', 'تحسب لوناً أو حجماً أو نصاً لتضعه في خاصية']
    ]},
    { t: 'code', lang: 'scss', code: `
// mixin: ينتج أنماطاً
@mixin card-base { border-radius: 12px; padding: 16px; }

// دالة: تنتج قيمة
@function rem($px, $base: 16px) {
  @return math.div($px, $base) * 1rem;
}

.card {
  @include card-base;          // أنماط
  font-size: rem(18px);        // قيمة
}` },

    { t: 'h2', text: 'أخطاء شائعة' },
    { t: 'compare', lang: 'scss', bad: {
      code: '@mixin brand-color {\n  color: #6366f1;\n}\n\n.title { @include brand-color; }',
      why: 'mixin بقيمة ثابتة واحدة بلا معاملات — متغيّر بسيط أوضح وأخف.'
    }, good: {
      code: '$color-brand: #6366f1;\n\n.title { color: $color-brand; }',
      why: 'لا تستخدم mixin لما يكفيه متغيّر.'
    }},
    { t: 'ul', items: [
      '**mixin ضخم** يفعل كل شيء: قسّمه إلى وحدات صغيرة قابلة للتركيب.',
      '**mixin بلا معاملات ولا `@content`**: غالباً يكفيه متغيّر أو `@extend`.',
      '**استدعاؤه في مئات المواضع**: راجع — قد يكون صنفاً مساعداً أنسب.',
      '**تسمية غامضة**: `@mixin style1` لا تخبر شيئاً. سمّه بما يفعل.'
    ]},

    { t: 'exercise',
      title: 'تمرين: مكتبة mixins للمشروع',
      brief: 'ابنِ ملف `_mixins.scss` بمجموعة أدوات جاهزة واستخدمها في مكوّنات فعلية.',
      requirements: [
        'خريطة `$breakpoints` بأربع نقاط توقف، وmixin `respond-to` يستخدمها مع `@error` للاسم الخاطئ.',
        'mixin `flex($dir, $gap, $align, $justify)` بقيم افتراضية معقولة.',
        'mixin `truncate` و `line-clamp($lines)`.',
        'mixin `button($bg, $fg)` يولّد زراً كاملاً بحالاته الأربع.',
        'mixin `card($padding, $radius)` يولّد بطاقة مع ظل و hover.',
        'mixin `dark` للوضع الليلي بـ `@content`.',
        'mixin `auto-grid($min, $gap)`.',
        'استخدم كل mixin مرة واحدة على الأقل في ملف `_components.scss`.',
        'أنشئ ثلاثة أنواع أزرار من mixin واحد.'
      ],
      hints: [
        '`@content` يجب أن تكون داخل كتلة الوسائط لا خارجها.',
        'استخدم `color.adjust` لتوليد لون الـ hover تلقائياً من اللون الأساسي.',
        'اختبر رسالة `@error` بتمرير اسم نقطة توقف غير موجودة.'
      ],
      solution: { lang: 'scss', code: `
@use 'sass:map';
@use 'sass:color';

$breakpoints: (
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px
) !default;

@mixin respond-to($name) {
  $value: map.get($breakpoints, $name);

  @if $value == null {
    @error "نقطة التوقف '#{$name}' غير معرّفة. المتاح: #{map.keys($breakpoints)}";
  }

  @media (min-width: $value) { @content; }
}

@mixin flex($dir: row, $gap: 0, $align: center, $justify: flex-start) {
  display: flex;
  flex-direction: $dir;
  align-items: $align;
  justify-content: $justify;
  gap: $gap;
}

@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin line-clamp($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@mixin focus-ring($color: #6366f1) {
  &:focus-visible {
    outline: 3px solid $color;
    outline-offset: 2px;
  }
}

@mixin button($bg, $fg: #fff) {
  @include flex(row, 8px, center, center);
  padding: 12px 24px;
  background: $bg;
  color: $fg;
  border: 0;
  border-radius: 10px;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;

  &:hover:not(:disabled) {
    background: color.adjust($bg, $lightness: -8%);
    transform: translateY(-2px);
  }

  &:active { transform: translateY(0); }
  &:disabled { opacity: .5; cursor: not-allowed; }

  @include focus-ring($bg);
}

@mixin card($padding: 16px, $radius: 12px) {
  padding: $padding;
  border-radius: $radius;
  background: #fff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 6px rgba(15, 23, 42, .06);
  transition: .25s;

  &:hover {
    box-shadow: 0 12px 32px rgba(15, 23, 42, .1);
    transform: translateY(-4px);
  }
}

@mixin dark {
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) & { @content; }
  }
  [data-theme='dark'] & { @content; }
}

@mixin auto-grid($min: 240px, $gap: 16px) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax($min, 1fr));
  gap: $gap;
}

/* ===== الاستخدام في _components.scss ===== */

.btn-primary { @include button(#6366f1); }
.btn-danger  { @include button(#ef4444); }
.btn-ghost   { @include button(#f1f5f9, #0f172a); }

.products { @include auto-grid(220px, 24px); }

.product {
  @include card(16px, 14px);

  &__title { @include truncate; font-weight: 700; }
  &__desc  { @include line-clamp(3); color: #64748b; }

  @include respond-to('md') { padding: 24px; }

  @include dark {
    background: #111a2e;
    border-color: #22304f;
    color: #e8edf9;
  }
}

.site-header {
  @include flex(row, 16px, center, space-between);
  padding: 16px;
}` } },

    { t: 'quiz', items: [
      { q: 'ما وظيفة `@content` داخل mixin؟', options: ['يطبع نصاً', 'يحدّد موضع الكتلة الممرّرة عند الاستدعاء', 'يستورد ملفاً', 'يُرجع قيمة'], answer: 1,
        explain: 'يتيح تمرير كتلة أنماط كاملة، وهو أساس mixins التجاوب.' },
      { q: 'ما الفرق بين mixin ودالة في Sass؟', options: ['لا فرق', 'mixin ينتج أنماطاً ودالة تُرجع قيمة واحدة', 'العكس', 'الدالة أسرع'], answer: 1,
        explain: 'استخدم mixin للإعلانات، ودالة لحساب قيمة تضعها في خاصية.' },
      { q: 'متى لا يجب استخدام mixin؟', options: ['مع المعاملات', 'حين يحوي قيمة ثابتة واحدة يكفيها متغيّر', 'مع الوسائط', 'مع @content'], answer: 1,
        explain: 'mixin بلا معاملات ولا محتوى وبقيمة واحدة تعقيد بلا فائدة.' },
      { q: 'ما فائدة `@error` في mixin؟', options: ['تسجيل رسالة', 'إيقاف الترجمة برسالة واضحة عند تمرير قيمة غير صالحة', 'تجاهل الخطأ', 'إرجاع null'], answer: 1,
        explain: 'يمنع الأخطاء الصامتة التي تضيّع وقتاً طويلاً في التشخيص.' },
      { q: 'لماذا لا يقلقنا تكرار الأنماط في ناتج mixin؟', options: ['لأنه لا يتكرّر', 'لأن ضغط gzip يتعامل مع التكرار بكفاءة عالية', 'لأن المتصفح يحذفه', 'لأنه بطيء'], answer: 1,
        explain: 'النصوص المتكرّرة تُضغط بشدّة، فالفرق في الحجم المنقول ضئيل.' }
    ]}
  ]
};
