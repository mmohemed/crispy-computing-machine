'use strict';

module.exports = {
  slug: '07-control',
  title: 'التوجيهات التحكّمية: الشروط والحلقات',
  summary: 'توليد الأنماط آلياً بالشروط والحلقات، بدل كتابة عشرات القواعد المتشابهة يدوياً.',
  duration: 45,
  level: 'متوسط',
  tags: ['الحلقات', 'المنطق'],
  objectives: [
    'تستخدم `@if` و `@else` لتوليد أنماط شرطية.',
    'تكرّر بـ `@for` و `@each` و `@while`.',
    'تولّد أصناف مساعدة آلياً من خرائط.',
    'تبني نظام شبكة كاملاً بحلقة واحدة.',
    'تتجنّب توليد كود منتفخ لا يُستخدم.'
  ],
  quickRef: [
    { code: '@if cond { } @else { }', desc: 'شرط' },
    { code: '@for $i from 1 through 5', desc: 'حلقة شاملة النهاية' },
    { code: '@for $i from 1 to 5', desc: 'حلقة غير شاملة' },
    { code: '@each $x in $list', desc: 'مرور على قائمة' },
    { code: '@each $k, $v in $map', desc: 'مرور على خريطة' },
    { code: '@while cond', desc: 'حلقة شرطية' },
    { code: 'if(cond, a, b)', desc: 'شرط في تعبير واحد' }
  ],
  blocks: [
    { t: 'h2', text: '`@if` — الشروط' },
    { t: 'code', lang: 'scss', code: `
@mixin theme($mode) {
  @if $mode == 'dark' {
    background: #0f172a;
    color: #e8edf9;
  } @else if $mode == 'light' {
    background: #ffffff;
    color: #0f172a;
  } @else {
    @error "وضع غير معروف: #{$mode}. المتاح: dark أو light";
  }
}

.panel { @include theme('dark'); }` },
    { t: 'code', lang: 'scss', title: 'شرط داخل mixin بمعامل', code: `
@use 'sass:color';

@mixin button($bg, $outline: false) {
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;

  @if $outline {
    background: transparent;
    color: $bg;
    border: 2px solid $bg;
  } @else {
    background: $bg;
    color: #fff;
    border: 0;
  }
}

.btn        { @include button(#6366f1); }
.btn-ghost  { @include button(#6366f1, $outline: true); }` },
    { t: 'demo', title: 'زر ممتلئ وآخر محدّد', height: 160,
      css: 'button{padding:12px 24px;border-radius:10px;font-weight:700;cursor:pointer;font-family:inherit;margin:4px}.f{background:#6366f1;color:#fff;border:0}.o{background:transparent;color:#6366f1;border:2px solid #6366f1}',
      html: '<button class="f">ممتلئ</button><button class="o">محدّد</button>' },

    { t: 'h3', text: 'المعاملات المنطقية' },
    { t: 'code', lang: 'scss', code: `
@if $a and $b { … }
@if $a or $b  { … }
@if not $a    { … }
@if $x == 10  { … }
@if $x != 10  { … }
@if $x > 10   { … }

// دالة if() المختصرة — تعمل داخل التعابير
$padding: if($compact, 8px, 16px);
$color: if($dark, #fff, #000);` },
    { t: 'warn', title: 'القيم الكاذبة', text: 'في Sass كل شيء صادق **عدا** `false` و `null` فقط. انتبه: الصفر `0` والنص الفارغ `""` والقائمة الفارغة `()` كلها **صادقة**، خلافاً لجافاسكربت.' },

    { t: 'h2', text: '`@for` — التكرار العددي' },
    { t: 'code', lang: 'scss', code: `
// through: تشمل النهاية (1 إلى 5)
@for $i from 1 through 5 {
  .mt-#{$i} { margin-top: $i * 8px; }
}

// to: لا تشمل النهاية (1 إلى 4)
@for $i from 1 to 5 {
  .p-#{$i} { padding: $i * 4px; }
}` },
    { t: 'code', lang: 'css', title: 'ناتج الحلقة الأولى', code: `
.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 16px; }
.mt-3 { margin-top: 24px; }
.mt-4 { margin-top: 32px; }
.mt-5 { margin-top: 40px; }` },

    { t: 'h3', text: 'نظام شبكة كامل بحلقة' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:math';

$columns: 12;

.row {
  display: flex;
  flex-wrap: wrap;
  margin-inline: -8px;
}

@for $i from 1 through $columns {
  .col-#{$i} {
    flex: 0 0 math.percentage(math.div($i, $columns));
    max-width: math.percentage(math.div($i, $columns));
    padding-inline: 8px;
  }
}` },
    { t: 'demo', title: 'شبكة 12 عموداً', height: 260,
      css: '.row{display:flex;flex-wrap:wrap;margin:0 -4px 8px}.row>div{padding:0 4px}.row>div>span{display:block;background:#a5b4fc;color:#1e1b4b;border-radius:6px;padding:8px;text-align:center;font-size:.8em;font-weight:700}.c12{flex:0 0 100%}.c6{flex:0 0 50%}.c4{flex:0 0 33.333%}.c3{flex:0 0 25%}',
      html: '<div class="row"><div class="c12"><span>col-12</span></div></div><div class="row"><div class="c6"><span>col-6</span></div><div class="c6"><span>col-6</span></div></div><div class="row"><div class="c4"><span>col-4</span></div><div class="c4"><span>col-4</span></div><div class="c4"><span>col-4</span></div></div><div class="row"><div class="c3"><span>col-3</span></div><div class="c3"><span>col-3</span></div><div class="c3"><span>col-3</span></div><div class="c3"><span>col-3</span></div></div>' },
    { t: 'p', text: 'ثمانية أسطر ولّدت اثنتي عشرة قاعدة. تخيّل كتابتها يدوياً مع الكسور العشرية — ثم تخيّل تغيير عدد الأعمدة إلى 16.' },

    { t: 'h2', text: '`@each` — المرور على القوائم والخرائط' },
    { t: 'code', lang: 'scss', title: 'على قائمة', code: `
$sides: top, right, bottom, left;

@each $side in $sides {
  .m-#{$side} { margin-#{$side}: 16px; }
  .p-#{$side} { padding-#{$side}: 16px; }
}` },
    { t: 'code', lang: 'scss', title: 'على خريطة — الأكثر فائدة', code: `
$colors: (
  'primary': #6366f1,
  'success': #10b981,
  'warning': #f59e0b,
  'danger':  #ef4444
);

@each $name, $color in $colors {
  .text-#{$name} { color: $color; }
  .bg-#{$name}   { background: $color; }
  .border-#{$name} { border-color: $color; }

  .btn-#{$name} {
    background: $color;
    color: #fff;

    &:hover { filter: brightness(.9); }
  }
}` },
    { t: 'code', lang: 'css', title: 'مقتطف من الناتج', code: `
.text-primary { color: #6366f1; }
.bg-primary { background: #6366f1; }
.border-primary { border-color: #6366f1; }
.btn-primary { background: #6366f1; color: #fff; }
.btn-primary:hover { filter: brightness(.9); }

.text-success { color: #10b981; }
/* … وهكذا لكل لون */` },
    { t: 'demo', title: 'أزرار مولّدة من خريطة', height: 170,
      css: 'button{padding:10px 20px;border:0;border-radius:8px;color:#fff;font-family:inherit;font-weight:700;margin:4px;cursor:pointer}.p{background:#6366f1}.s{background:#10b981}.w{background:#f59e0b}.d{background:#ef4444}',
      html: '<button class="p">primary</button><button class="s">success</button><button class="w">warning</button><button class="d">danger</button>' },

    { t: 'h3', text: 'تفكيك قوائم متعدّدة القيم' },
    { t: 'code', lang: 'scss', code: `
$buttons: (
  ('primary', #6366f1, #fff),
  ('ghost',   transparent, #6366f1),
  ('danger',  #ef4444, #fff)
);

@each $name, $bg, $fg in $buttons {
  .btn-#{$name} {
    background: $bg;
    color: $fg;
  }
}` },

    { t: 'h3', text: 'خرائط متداخلة' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:map';

$themes: (
  'light': (bg: #ffffff, text: #0f172a, border: #e2e8f0),
  'dark':  (bg: #0f172a, text: #e8edf9, border: #22304f)
);

@each $name, $theme in $themes {
  [data-theme='#{$name}'] {
    --color-bg:     #{map.get($theme, bg)};
    --color-text:   #{map.get($theme, text)};
    --color-border: #{map.get($theme, border)};
  }
}` },
    { t: 'tip', text: 'هذا النمط قوي جداً: تعرّف كل ثيماتك في خريطة واحدة، وتُولَّد كل متغيّرات CSS تلقائياً. إضافة ثيم جديد = إضافة سطر واحد.' },

    { t: 'h2', text: '`@while` — الحلقة الشرطية' },
    { t: 'code', lang: 'scss', code: `
$size: 64px;
$i: 1;

@while $size > 8px {
  .icon-#{$i} { width: $size; height: $size; }
  $size: $size * 0.5;
  $i: $i + 1;
}` },
    { t: 'warn', text: 'نادرة الاستخدام و**خطرة**: نسيان تحديث متغيّر الشرط يعني حلقة لا نهائية تُجمّد المترجم. استخدم `@for` أو `@each` كلّما أمكن.' },

    { t: 'h2', text: 'توليد نظام أدوات كامل' },
    { t: 'code', lang: 'scss', title: 'مثال متكامل', code: `
@use 'sass:map';

$spacers: (0: 0, 1: 4px, 2: 8px, 3: 16px, 4: 24px, 5: 32px, 6: 48px);

$sides: (
  '':  ('top', 'right', 'bottom', 'left'),
  't': ('top'),
  'e': ('inline-end'),
  'b': ('bottom'),
  's': ('inline-start'),
  'x': ('inline-start', 'inline-end'),
  'y': ('top', 'bottom')
);

$props: ('m': 'margin', 'p': 'padding');

@each $prop-key, $prop in $props {
  @each $side-key, $side-list in $sides {
    @each $size-key, $size in $spacers {
      .#{$prop-key}#{$side-key}-#{$size-key} {
        @each $side in $side-list {
          #{$prop}-#{$side}: $size;
        }
      }
    }
  }
}` },
    { t: 'p', text: 'ثلاث حلقات متداخلة تولّد نحو **98 صنفاً** مساعداً: `.m-3` و `.px-4` و `.mt-0` وهكذا. هذا بالضبط ما تفعله أطر مثل Bootstrap و Tailwind خلف الكواليس.' },
    { t: 'demo', title: 'عيّنة من الأصناف المولَّدة', height: 240,
      css: 'code{display:block;background:#0f1729;color:#e2e8f0;padding:12px;border-radius:10px;direction:ltr;text-align:left;font-family:monospace;font-size:.82em;line-height:1.9;overflow-x:auto}',
      html: '<code>.m-0 { margin-top:0; margin-right:0; margin-bottom:0; margin-left:0 }\n.m-3 { margin-top:16px; margin-right:16px; … }\n.mt-2 { margin-top:8px }\n.px-4 { padding-inline-start:24px; padding-inline-end:24px }\n.py-1 { padding-top:4px; padding-bottom:4px }\n.ms-5 { margin-inline-start:32px }\n/* … 98 صنفاً */</code>' },
    { t: 'danger', title: 'حذار من الانتفاخ', text: 'التوليد الآلي مغرٍ لكنه سيف ذو حدّين. توليد 500 صنف تستخدم منها 20 يعني ملف CSS ضخم يُحمَّل عند كل زيارة. ولّد ما تحتاجه فعلاً، أو استخدم أداة تنقية (PurgeCSS) تحذف غير المستخدم.' },

    { t: 'h2', text: 'حلقات لتوليد الحركات' },
    { t: 'code', lang: 'scss', code: `
// تأخير متدرّج لعناصر تظهر تباعاً
@for $i from 1 through 10 {
  .fade-in:nth-child(#{$i}) {
    animation-delay: $i * 0.08s;
  }
}

// إطارات مفتاحية مولّدة
@keyframes pulse-ring {
  @for $i from 0 through 4 {
    #{$i * 25}% {
      transform: scale(1 + $i * 0.1);
      opacity: 1 - $i * 0.2;
    }
  }
}` },

    { t: 'exercise',
      title: 'تمرين: توليد نظام أدوات مصغّر',
      brief: 'استخدم الحلقات لتوليد نظام أصناف مساعدة عملي.',
      requirements: [
        'خريطة `$colors` بخمسة ألوان، تولّد منها: `.text-*` و `.bg-*` و `.border-*`.',
        'خريطة `$spacers` بستّ قيم، تولّد `.m-*` و `.p-*` مع الاتجاهات `t/b/s/e/x/y`.',
        'حلقة `@for` تولّد `.col-1` حتى `.col-12` بنسب مئوية صحيحة.',
        'خريطة `$breakpoints`، وحلقة تولّد نسخاً متجاوبة: `.md\\:col-6` مثلاً.',
        'خريطة ثيمات متداخلة تولّد متغيّرات CSS لكل ثيم.',
        'حلقة تولّد `.delay-1` حتى `.delay-8` بتأخير 80 مللي ثانية لكل خطوة.',
        'mixin `button($color, $outline: false)` يستخدم `@if`، وحلقة تولّد زراً لكل لون.',
        'أضف `@error` في مكان مناسب للتحقّق من صحّة المدخلات.'
      ],
      hints: [
        'لهروب النقطتين في اسم الصنف استخدم `\\\\:` داخل الإقحام.',
        '`math.percentage(math.div($i, 12))` لحساب نسبة العمود.',
        'الخرائط المتداخلة تُقرأ بـ `map.get` مرتين أو بمتغيّر وسيط.'
      ],
      solution: { lang: 'scss', code: `
@use 'sass:map';
@use 'sass:math';

/* ===== البيانات ===== */
$colors: (
  'primary': #6366f1,
  'success': #10b981,
  'warning': #f59e0b,
  'danger':  #ef4444,
  'muted':   #64748b
);

$spacers: (0: 0, 1: 4px, 2: 8px, 3: 16px, 4: 24px, 5: 32px);

$sides: (
  '':  (top, right, bottom, left),
  't': (top),
  'b': (bottom),
  's': (inline-start),
  'e': (inline-end),
  'x': (inline-start, inline-end),
  'y': (top, bottom)
);

$breakpoints: ('sm': 576px, 'md': 768px, 'lg': 992px);

$themes: (
  'light': (bg: #ffffff, text: #0f172a, border: #e2e8f0),
  'dark':  (bg: #0f172a, text: #e8edf9, border: #22304f)
);

/* ===== أصناف الألوان ===== */
@each $name, $color in $colors {
  .text-#{$name}   { color: $color; }
  .bg-#{$name}     { background-color: $color; }
  .border-#{$name} { border-color: $color; }
}

/* ===== أصناف المسافات ===== */
@each $prop-key, $prop in ('m': margin, 'p': padding) {
  @each $side-key, $side-list in $sides {
    @each $size-key, $size in $spacers {
      .#{$prop-key}#{$side-key}-#{$size-key} {
        @each $side in $side-list {
          #{$prop}-#{$side}: $size;
        }
      }
    }
  }
}

/* ===== الشبكة ===== */
$columns: 12;

@for $i from 1 through $columns {
  .col-#{$i} {
    flex: 0 0 math.percentage(math.div($i, $columns));
    max-width: math.percentage(math.div($i, $columns));
  }
}

/* ===== الشبكة المتجاوبة ===== */
@each $bp-name, $bp-value in $breakpoints {
  @media (min-width: $bp-value) {
    @for $i from 1 through $columns {
      .#{$bp-name}\\:col-#{$i} {
        flex: 0 0 math.percentage(math.div($i, $columns));
        max-width: math.percentage(math.div($i, $columns));
      }
    }
  }
}

/* ===== الثيمات ===== */
@each $name, $theme in $themes {
  [data-theme='#{$name}'] {
    --color-bg:     #{map.get($theme, bg)};
    --color-text:   #{map.get($theme, text)};
    --color-border: #{map.get($theme, border)};
  }
}

/* ===== تأخيرات الحركة ===== */
@for $i from 1 through 8 {
  .delay-#{$i} { animation-delay: $i * 80ms; }
}

/* ===== الأزرار ===== */
@mixin button($color, $outline: false) {
  @if type-of($color) != color {
    @error "المعامل الأول يجب أن يكون لوناً، وصل: #{$color}";
  }

  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;

  @if $outline {
    background: transparent;
    color: $color;
    border: 2px solid $color;

    &:hover { background: $color; color: #fff; }
  } @else {
    background: $color;
    color: #fff;
    border: 0;

    &:hover { filter: brightness(.9); }
  }
}

@each $name, $color in $colors {
  .btn-#{$name}         { @include button($color); }
  .btn-#{$name}-outline { @include button($color, $outline: true); }
}` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق بين `through` و `to` في `@for`؟', options: ['لا فرق', '`through` تشمل الرقم الأخير و`to` لا تشمله', 'العكس', '`to` أسرع'], answer: 1,
        explain: '`1 through 5` تعطي 1..5، و`1 to 5` تعطي 1..4.' },
      { q: 'كيف تمرّ على خريطة بمفاتيحها وقيمها؟', options: ['`@for $k in $map`', '`@each $key, $value in $map`', '`@while $map`', '`@map`'], answer: 1,
        explain: '`@each` تفكّك أزواج الخريطة إلى متغيّرين.' },
      { q: 'أي القيم كاذبة في Sass؟', options: ['`0` و `""`', '`false` و `null` فقط', '`()` و `0`', 'كلها'], answer: 1,
        explain: 'خلافاً لجافاسكربت، الصفر والنص الفارغ صادقان في Sass.' },
      { q: 'ما خطر `@while`؟', options: ['بطيئة', 'نسيان تحديث متغيّر الشرط يسبّب حلقة لا نهائية', 'غير مدعومة', 'لا تقبل شروطاً'], answer: 1,
        explain: 'المترجم سيتجمّد؛ استخدم `@for` أو `@each` كلّما أمكن.' },
      { q: 'ما خطر الإفراط في توليد الأصناف آلياً؟', options: ['بطء الترجمة فقط', 'ملف CSS ضخم فيه مئات الأصناف غير المستخدمة', 'أخطاء صياغة', 'لا خطر'], answer: 1,
        explain: 'الحجم المنقول يزيد؛ ولّد ما تحتاج أو استخدم أداة تنقية.' }
    ]}
  ]
};
