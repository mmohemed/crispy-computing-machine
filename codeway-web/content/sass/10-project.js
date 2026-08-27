'use strict';

module.exports = {
  slug: '10-project',
  title: 'مشروع: نظام تصميم كامل بـ Sass',
  summary: 'بناء مكتبة أنماط قابلة لإعادة الاستخدام من الصفر: البنية، الرموز، المكوّنات، الأدوات، والتوثيق.',
  duration: 120,
  level: 'احترافي',
  tags: ['مشروع', 'تطبيق'],
  objectives: [
    'تنظّم مشروع Sass بمعمارية قابلة للنمو.',
    'تدمج كل ما تعلّمته في مكتبة واحدة متماسكة.',
    'تبني مكوّنات قابلة للتخصيص.',
    'تولّد أدوات مساعدة بحلقات مضبوطة.',
    'توثّق نظامك في صفحة عرض.'
  ],
  quickRef: [
    { code: 'abstracts/', desc: 'الرموز والدوال والـ mixins' },
    { code: 'base/', desc: 'إعادة الضبط والطباعة' },
    { code: 'components/', desc: 'الأزرار والبطاقات والنماذج' },
    { code: 'layout/', desc: 'الترويسة والشبكة' },
    { code: 'utilities/', desc: 'الأصناف المساعدة' },
    { code: 'main.scss', desc: 'نقطة الترجمة الوحيدة' }
  ],
  blocks: [
    { t: 'h2', text: 'ما الذي ستبنيه؟' },
    { t: 'p', text: 'مكتبة أنماط اسمها **Nasq** تصلح لأي مشروع عربي: رموز تصميم كاملة، مكوّنات جاهزة، أدوات مساعدة، ودعم للوضع الليلي و RTL — كل ذلك قابل للتخصيص بسطر واحد.' },
    { t: 'note', title: 'قاعدة الورشة', text: 'اقرأ المواصفات كاملة، خطّط على ورقة، ثم ابنِ قسماً قسماً واختبر كل قسم قبل الانتقال. لا تنظر إلى الحل قبل إنهاء محاولتك.' },

    { t: 'h2', text: 'البنية المطلوبة' },
    { t: 'code', lang: 'text', noCopy: true, code: `
nasq/
├── package.json
├── index.html                    صفحة عرض المكوّنات
├── dist/
│   └── nasq.css                  الناتج
└── src/scss/
    ├── abstracts/
    │   ├── _tokens.scss          خريطة الرموز
    │   ├── _functions.scss       دوال الوصول
    │   ├── _mixins.scss          الأدوات
    │   └── _index.scss           @forward للثلاثة
    ├── base/
    │   ├── _reset.scss
    │   ├── _typography.scss
    │   └── _themes.scss          متغيّرات CSS والثيمات
    ├── layout/
    │   ├── _container.scss
    │   ├── _grid.scss
    │   └── _header.scss
    ├── components/
    │   ├── _button.scss
    │   ├── _card.scss
    │   ├── _form.scss
    │   ├── _alert.scss
    │   ├── _badge.scss
    │   └── _modal.scss
    ├── utilities/
    │   ├── _spacing.scss
    │   ├── _text.scss
    │   └── _display.scss
    └── main.scss` },

    { t: 'h2', text: 'المواصفات التفصيلية' },
    { t: 'h3', text: '1. الرموز (`abstracts/_tokens.scss`)' },
    { t: 'ul', items: [
      'خريطة `$tokens` بالفئات: `color` (متداخلة بدرجات 100–900)، `space` (0–8)، `font`، `radius`، `shadow`، `bp`، `z`.',
      'كل الرموز الجذرية بعلامة `!default` لتكون قابلة للتخصيص.',
      'ثلاث عائلات ألوان على الأقل: `brand` و `gray` وألوان الحالة.'
    ]},

    { t: 'h3', text: '2. الدوال (`abstracts/_functions.scss`)' },
    { t: 'code', lang: 'scss', code: `
@function token($category, $keys...) { … }   // مع @error
@function color($name, $shade: 500) { … }
@function space($key) { … }
@function fs($key) { … }
@function radius($key) { … }
@function shadow($key) { … }
@function bp($key) { … }
@function z($key) { … }
@function rem($px) { … }
@function tint($c, $p) { … }
@function shade($c, $p) { … }
@function contrast-color($bg) { … }` },

    { t: 'h3', text: '3. الـ Mixins (`abstracts/_mixins.scss`)' },
    { t: 'code', lang: 'scss', code: `
@mixin respond-to($bp) { … }        // مع @error
@mixin flex($dir, $gap, $align, $justify) { … }
@mixin grid-auto($min, $gap) { … }
@mixin truncate { … }
@mixin line-clamp($lines) { … }
@mixin visually-hidden { … }
@mixin focus-ring($color) { … }
@mixin dark { @content }
@mixin container($max) { … }` },

    { t: 'h3', text: '4. الثيمات (`base/_themes.scss`)' },
    { t: 'ul', items: [
      'توليد كل متغيّرات CSS من `$tokens` بحلقات.',
      'خريطة `$themes` بثيمَي `light` و `dark`.',
      'دعم `prefers-color-scheme` والاختيار الصريح بـ `data-theme`.',
      'كل المكوّنات تستخدم `var(--c-*)` لا القيم المباشرة.'
    ]},

    { t: 'h3', text: '5. المكوّنات' },
    { t: 'table', head: ['المكوّن', 'المطلوب'], rows: [
      ['`.btn`', 'خمسة ألوان × نمطان (ممتلئ/محدّد) × ثلاثة أحجام، مولّدة بحلقة'],
      ['`.card`', 'رأس وجسم وتذييل، ومعدِّلات: مرتفع، محدّد، قابل للنقر'],
      ['`.form`', 'حقول ومناطق نص وقوائم مع حالات: تركيز، خطأ، معطّل'],
      ['`.alert`', 'أربعة أنواع مع أيقونة وزر إغلاق'],
      ['`.badge`', 'ألوان متعدّدة وحجمان'],
      ['`.modal`', 'طبقة تعتيم ونافذة ورأس وتذييل']
    ]},

    { t: 'h3', text: '6. الأدوات المساعدة' },
    { t: 'ul', items: [
      'المسافات: `.m*` و `.p*` بكل الاتجاهات المنطقية (`s`, `e`, `x`, `y`).',
      'النص: `.text-{color}`، `.fs-{size}`، `.fw-{weight}`، `.text-{start|center|end}`.',
      'العرض: `.d-{none|block|flex|grid}` مع نسخ متجاوبة `.md\\:d-flex`.',
      '**مهم**: لا تولّد إلا ما تحتاج فعلاً — راقب حجم الناتج.'
    ]},

    { t: 'h2', text: 'نقطة انطلاق' },
    { t: 'code', lang: 'scss', title: 'src/scss/main.scss', code: `
// 1) الأدوات — لا تنتج CSS
@use 'abstracts' as *;

// 2) الأساس
@use 'base/reset';
@use 'base/themes';
@use 'base/typography';

// 3) التخطيط
@use 'layout/container';
@use 'layout/grid';
@use 'layout/header';

// 4) المكوّنات
@use 'components/button';
@use 'components/card';
@use 'components/form';
@use 'components/alert';
@use 'components/badge';
@use 'components/modal';

// 5) الأدوات المساعدة — أخيراً لتفوز في التتالي
@use 'utilities/spacing';
@use 'utilities/text';
@use 'utilities/display';` },
    { t: 'code', lang: 'json', title: 'package.json', code: `
{
  "name": "nasq",
  "scripts": {
    "dev": "sass --watch src/scss/main.scss:dist/nasq.css",
    "build": "sass src/scss/main.scss dist/nasq.css --style=compressed --no-source-map",
    "size": "gzip -c dist/nasq.css | wc -c"
  },
  "devDependencies": {
    "sass": "^1.77.0"
  }
}` },
    { t: 'warn', title: 'ترتيب الاستيراد يحسم التتالي', text: 'الأدوات المساعدة **أخيراً** كي تتفوّق على أنماط المكوّنات عند تساوي الخصوصية. لو وضعتها أولاً فلن يعمل `.mt-0` على بطاقة لها هامش افتراضي.' },

    { t: 'h2', text: 'مثال مرجعي: مكوّن الزر' },
    { t: 'code', lang: 'scss', title: 'components/_button.scss', code: `
@use '../abstracts' as *;
@use 'sass:map';

$button-colors: (
  'primary': color('brand', 500),
  'success': color('ok', 500),
  'danger':  color('err', 500),
  'neutral': color('gray', 500)
) !default;

$button-sizes: (
  'sm': (space(2) space(3), fs(sm)),
  'md': (space(3) space(5), fs(md)),
  'lg': (space(4) space(6), fs(lg))
) !default;

.btn {
  @include flex(row, space(2), center, center);
  border: 2px solid transparent;
  border-radius: radius(sm);
  font-family: inherit;
  font-weight: fw(bold);
  cursor: pointer;
  transition: .2s;
  text-decoration: none;

  @include focus-ring(var(--c-brand));

  &:disabled,
  &[aria-disabled='true'] {
    opacity: .5;
    cursor: not-allowed;
  }

  // الأحجام
  @each $name, $config in $button-sizes {
    $padding: nth($config, 1);
    $size: nth($config, 2);

    &--#{$name} {
      padding: $padding;
      font-size: $size;
    }
  }

  // الألوان
  @each $name, $c in $button-colors {
    &--#{$name} {
      background: $c;
      color: contrast-color($c);

      &:hover:not(:disabled) {
        background: shade($c, 12%);
        transform: translateY(-2px);
      }

      &:active { transform: translateY(0); }
    }

    &--#{$name}-outline {
      background: transparent;
      color: $c;
      border-color: $c;

      &:hover:not(:disabled) {
        background: $c;
        color: contrast-color($c);
      }
    }
  }

  &--block { width: 100%; }
}` },
    { t: 'demo', title: 'الأزرار المولَّدة', height: 280,
      css: 'button{display:inline-flex;align-items:center;gap:8px;border:2px solid transparent;border-radius:6px;font-family:inherit;font-weight:700;cursor:pointer;transition:.2s;margin:4px;padding:12px 24px;color:#fff}.p{background:#6366f1}.s{background:#10b981}.d{background:#ef4444}.po{background:transparent;color:#6366f1;border-color:#6366f1}.so{background:transparent;color:#10b981;border-color:#10b981}.sm{padding:8px 12px;font-size:.875rem}.lg{padding:16px 32px;font-size:1.25rem}b{display:block;margin:10px 0 4px;font-size:.85em;color:#64748b}',
      html: '<b>الألوان</b><button class="p">primary</button><button class="s">success</button><button class="d">danger</button><b>المحدّدة</b><button class="po">primary</button><button class="so">success</button><b>الأحجام</b><button class="p sm">صغير</button><button class="p">متوسط</button><button class="p lg">كبير</button>' },

    { t: 'h2', text: 'صفحة العرض' },
    { t: 'p', text: 'أنشئ `index.html` تعرض كل مكوّن بكل حالاته. هذه ليست ترفاً: هي **توثيق حي** يكشف التناقضات فوراً، ويصبح مرجع فريقك.' },
    { t: 'code', lang: 'html', title: 'مقتطف من صفحة العرض', code: `
<section class="showcase">
  <h2>الأزرار</h2>

  <div class="showcase__row">
    <button class="btn btn--md btn--primary">أساسي</button>
    <button class="btn btn--md btn--success">نجاح</button>
    <button class="btn btn--md btn--danger">خطر</button>
    <button class="btn btn--md btn--primary" disabled>معطّل</button>
  </div>

  <div class="showcase__row">
    <button class="btn btn--sm btn--primary">صغير</button>
    <button class="btn btn--md btn--primary">متوسط</button>
    <button class="btn btn--lg btn--primary">كبير</button>
  </div>

  <details>
    <summary>عرض الكود</summary>
    <pre><code>&lt;button class="btn btn--md btn--primary"&gt;أساسي&lt;/button&gt;</code></pre>
  </details>
</section>` },

    { t: 'h2', text: 'قائمة المراجعة' },
    { t: 'steps', items: [
      'الترجمة تعمل بلا أخطاء ولا تحذيرات.',
      'تغيير لون واحد في `$tokens` يغيّر النظام كله.',
      'الوضع الليلي يعمل تلقائياً ويدوياً.',
      'لا قيمة صريحة (لون أو مسافة) في أي مكوّن — كلها عبر الدوال.',
      'لا تداخل يتجاوز مستويين.',
      'حجم `nasq.css` المضغوط أقل من 30 كيلوبايت.',
      'صفحة العرض تعرض كل مكوّن بكل حالاته.',
      'الواجهة تعمل صحيحاً في RTL و LTR.',
      'مؤشّر التركيز ظاهر على كل عنصر تفاعلي.'
    ]},

    { t: 'exercise',
      title: 'المشروع الكامل',
      brief: 'نفّذ مكتبة Nasq بالمواصفات أعلاه. مشروع لعدة جلسات لا لساعة.',
      requirements: [
        'البنية الكاملة كما في المخطّط.',
        'الرموز والدوال والـ mixins كاملة كما وُصفت.',
        'ستة مكوّنات على الأقل بكل حالاتها.',
        'ثلاث مجموعات أدوات مساعدة.',
        'نظام ثيمين يعمل تلقائياً ويدوياً.',
        'صفحة عرض `index.html` توثّق كل شيء.',
        'قائمة المراجعة كلها ✓.'
      ],
      hints: [
        'ابدأ بـ `abstracts/` — هي أساس كل شيء بعدها.',
        'ابنِ مكوّناً واحداً كاملاً قبل الانتقال للتالي.',
        'أضف المكوّن إلى صفحة العرض فور الانتهاء منه.',
        'راقب حجم الناتج بعد كل إضافة: `npm run build && npm run size`.',
        'إن تعثّرت في موضوع، عد إلى درسه لا إلى بداية المسار.'
      ],
      solution: { lang: 'scss', title: 'مقتطف: base/_themes.scss', code: `
@use 'sass:map';
@use '../abstracts' as *;

/* ===== متغيّرات الرموز ===== */
:root {
  @each $family, $shades in map.get($tokens, 'color') {
    @each $shade, $value in $shades {
      --color-#{$family}-#{$shade}: #{$value};
    }
  }

  @each $key, $value in map.get($tokens, 'space') {
    --space-#{$key}: #{$value};
  }

  @each $key, $value in map.get($tokens, 'radius') {
    --radius-#{$key}: #{$value};
  }

  @each $key, $value in map.get($tokens, 'shadow') {
    --shadow-#{$key}: #{$value};
  }
}

/* ===== الثيمات ===== */
$themes: (
  'light': (
    'bg':      color('gray', 50),
    'surface': #ffffff,
    'text':    color('gray', 900),
    'muted':   color('gray', 500),
    'border':  color('gray', 300),
    'brand':   color('brand', 500)
  ),
  'dark': (
    'bg':      #0a0f1e,
    'surface': #111a2e,
    'text':    #e8edf9,
    'muted':   #a9b6d3,
    'border':  #22304f,
    'brand':   color('brand', 300)
  )
) !default;

@mixin emit-theme($theme) {
  @each $key, $value in $theme {
    --c-#{$key}: #{$value};
  }
}

:root {
  @include emit-theme(map.get($themes, 'light'));
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    @include emit-theme(map.get($themes, 'dark'));
  }
}

@each $name, $theme in $themes {
  [data-theme='#{$name}'] {
    @include emit-theme($theme);
  }
}

body {
  background: var(--c-bg);
  color: var(--c-text);
  transition: background .25s, color .25s;
}` },
      solutionNote: 'بقية الملفات تتبع النمط نفسه: استيراد `abstracts` باسم مستعار، ثم بناء المكوّن بالدوال والـ mixins فقط.'
    },

    { t: 'h2', text: 'ماذا بعد؟' },
    { t: 'p', text: 'أنهيت مسار Sass: الأساسيات والمتغيّرات والتداخل والوحدات والـ mixins والدوال والحلقات والوراثة والخرائط ونظام التصميم. أنت الآن قادر على بناء وصيانة أنماط مشروع كبير.' },
    { t: 'ul', items: [
      '**PostCSS و Autoprefixer** لإضافة بادئات المتصفحات تلقائياً.',
      '**Stylelint** لفرض اصطلاحات موحّدة على فريقك.',
      '**PurgeCSS** لحذف الأصناف غير المستخدمة من الناتج.',
      '**CSS Modules** أو **CSS-in-JS** كنهج بديل في تطبيقات المكوّنات.',
      '**Tailwind** — منهجية مختلفة تماماً، وهي المسار التالي المقترح.'
    ]},
    { t: 'tip', text: 'قارن نظامك بأنظمة حقيقية مفتوحة المصدر مثل Bootstrap و Bulma. اقرأ كيف نظّموا رموزهم ومكوّناتهم — قراءة كود المحترفين أسرع طريق للتقدّم.' },

    { t: 'quiz', items: [
      { q: 'لماذا تُستورد الأدوات المساعدة أخيراً في `main.scss`؟', options: ['عادة فقط', 'لتفوز في التتالي على أنماط المكوّنات عند تساوي الخصوصية', 'لأنها أكبر', 'لتسريع الترجمة'], answer: 1,
        explain: 'الترتيب يحدّد أي قاعدة تفوز؛ الأدوات يجب أن تتغلّب على الافتراضيات.' },
      { q: 'ما فائدة صفحة العرض (Showcase)؟', options: ['للزينة', 'توثيق حي يكشف التناقضات ويصبح مرجع الفريق', 'لتحسين السيو', 'لتسريع الموقع'], answer: 1,
        explain: 'رؤية كل المكوّنات بحالاتها معاً تكشف عدم الاتّساق فوراً.' },
      { q: 'لماذا لا نكتب قيماً صريحة داخل المكوّنات؟', options: ['ممنوع تقنياً', 'لأن مصدر الحقيقة يجب أن يبقى واحداً في ملف الرموز', 'أبطأ', 'أطول'], answer: 1,
        explain: 'القيمة الصريحة تكسر النظام: لن يطالها تغيير الرموز.' },
      { q: 'ما الفائدة العملية من `!default` في رموز المكتبة؟', options: ['أمان', 'تتيح للمستخدم تخصيص القيم عبر `@use ... with` دون تعديل ملفاتك', 'أداء', 'توثيق'], answer: 1,
        explain: 'هذا ما يجعل المكتبة قابلة لإعادة الاستخدام في مشاريع مختلفة.' },
      { q: 'كيف تراقب انتفاخ ملف CSS الناتج؟', options: ['بالنظر', 'بقياس الحجم المضغوط بعد كل إضافة واستخدام أداة تنقية', 'لا يمكن', 'بعدد الأسطر'], answer: 1,
        explain: 'الحجم المضغوط هو ما يُنقل فعلاً؛ راقبه وامنع توليد ما لا تستخدمه.' }
    ]}
  ]
};
