'use strict';

module.exports = {
  slug: '06-functions',
  title: 'الدوال والعمليات',
  summary: 'الدوال المدمجة للألوان والرياضيات والقوائم، وكتابة دوالك الخاصة لحساب القيم.',
  duration: 40,
  level: 'متوسط',
  tags: ['الدوال', 'الألوان'],
  objectives: [
    'تكتب دالة مخصّصة وتُرجع منها قيمة.',
    'تستخدم دوال الألوان لتوليد تدرّجات من لون واحد.',
    'تستخدم الوحدة الرياضية بشكل صحيح.',
    'تتعامل مع القوائم والنصوص.',
    'تبني دوال مقاييس (rem, spacing) لمشروعك.'
  ],
  quickRef: [
    { code: '@function name($a) { @return … }', desc: 'تعريف دالة' },
    { code: 'color.adjust($c, $lightness: -10%)', desc: 'تعديل مطلق' },
    { code: 'color.scale($c, $lightness: -10%)', desc: 'تعديل نسبي' },
    { code: 'color.mix($a, $b, 50%)', desc: 'مزج لونين' },
    { code: 'math.div(a, b)', desc: 'القسمة' },
    { code: 'map.get($map, key)', desc: 'قراءة من خريطة' }
  ],
  blocks: [
    { t: 'h2', text: 'الفرق عن الـ mixin' },
    { t: 'p', text: 'الـ mixin يُنتج **إعلانات**، والدالة تُرجع **قيمة واحدة** تستخدمها داخل إعلان. القاعدة: إن كان الناتج شيئاً تكتبه بعد النقطتين، فهو دالة.' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:math';

@function rem($px, $base: 16px) {
  @return math.div($px, $base) * 1rem;
}

.title {
  font-size: rem(24px);      // 1.5rem
  padding: rem(12px) rem(20px);
}` },

    { t: 'h2', text: 'دوال الألوان' },
    { t: 'p', text: 'أقوى ما في Sass عملياً: تعرّف لوناً واحداً وتشتقّ منه كل التدرّجات التي تحتاجها، فيبقى نظامك متناغماً تلقائياً.' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:color';

$brand: #6366f1;

.demo {
  // تفتيح وتغميق
  --lighter: #{color.adjust($brand, $lightness: 15%)};
  --darker:  #{color.adjust($brand, $lightness: -15%)};

  // تعديل نسبي — أكثر أماناً مع الألوان الطرفية
  --scaled: #{color.scale($brand, $lightness: -20%)};

  // التشبّع
  --vivid: #{color.adjust($brand, $saturation: 20%)};
  --muted: #{color.adjust($brand, $saturation: -30%)};

  // الشفافية
  --fade: #{color.adjust($brand, $alpha: -0.7)};

  // المزج
  --mixed: #{color.mix($brand, #ec4899, 50%)};

  // تدوير درجة اللون
  --rotated: #{color.adjust($brand, $hue: 45deg)};

  // التكميل والعكس
  --complement: #{color.complement($brand)};
  --inverted: #{color.invert($brand)};
}` },
    { t: 'demo', title: 'تدرّجات مشتقّة من لون واحد', height: 280,
      css: '.row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}.sw{width:70px;height:56px;border-radius:8px;display:flex;align-items:flex-end;justify-content:center;color:#fff;font-size:.68em;padding-bottom:4px;font-family:monospace}b{display:block;margin-bottom:6px;font-size:.9em}',
      html: '<b>الإضاءة (lightness)</b><div class="row"><span class="sw" style="background:#c7d2fe;color:#1e1b4b">+30%</span><span class="sw" style="background:#a5b4fc;color:#1e1b4b">+15%</span><span class="sw" style="background:#6366f1">الأصل</span><span class="sw" style="background:#4338ca">−15%</span><span class="sw" style="background:#312e81">−30%</span></div><b>التشبّع (saturation)</b><div class="row"><span class="sw" style="background:#4f46ff">+20%</span><span class="sw" style="background:#6366f1">الأصل</span><span class="sw" style="background:#7375c9">−30%</span><span class="sw" style="background:#7b7b91">−60%</span></div><b>المزج مع الوردي</b><div class="row"><span class="sw" style="background:#6366f1">0%</span><span class="sw" style="background:#8d54c5">50%</span><span class="sw" style="background:#ec4899">100%</span></div>' },
    { t: 'table', head: ['الدالة', 'ماذا تفعل'], rows: [
      ['`color.adjust($c, $lightness: -10%)`', 'يطرح 10 نقاط مئوية من الإضاءة (تعديل **مطلق**)'],
      ['`color.scale($c, $lightness: -10%)`', 'يقلّل الإضاءة بنسبة 10٪ من المسافة المتبقّية (**نسبي**)'],
      ['`color.change($c, $lightness: 40%)`', 'يضبط القيمة مباشرة'],
      ['`color.mix($a, $b, $weight)`', 'يمزج لونين بوزن'],
      ['`color.complement($c)`', 'اللون المكمّل (تدوير 180°)'],
      ['`color.grayscale($c)`', 'يزيل التشبّع كلياً']
    ]},
    { t: 'tip', text: '`scale` أفضل من `adjust` غالباً: تغميق `#000` بـ `adjust` لا يفعل شيئاً، لكن `scale` يتعامل مع النسب فلا يتجاوز الحدود ولا يعطي نتائج مفاجئة.' },

    { t: 'h3', text: 'توليد مقياس ألوان كامل' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:color';

@function tint($color, $percent) {
  @return color.mix(#fff, $color, $percent);
}

@function shade($color, $percent) {
  @return color.mix(#000, $color, $percent);
}

$brand: #6366f1;

:root {
  --brand-50:  #{tint($brand, 90%)};
  --brand-100: #{tint($brand, 80%)};
  --brand-200: #{tint($brand, 60%)};
  --brand-300: #{tint($brand, 40%)};
  --brand-400: #{tint($brand, 20%)};
  --brand-500: #{$brand};
  --brand-600: #{shade($brand, 15%)};
  --brand-700: #{shade($brand, 30%)};
  --brand-800: #{shade($brand, 45%)};
  --brand-900: #{shade($brand, 60%)};
}` },
    { t: 'p', text: 'بهذه الطريقة يكفي تغيير `$brand` لتوليد نظام ألوان كامل متناغم — وهو بالضبط ما تفعله أطر التصميم الحديثة.' },

    { t: 'h2', text: 'الوحدة الرياضية' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:math';

math.div(10, 3)        // 3.3333333333
math.round(4.6)        // 5
math.ceil(4.1)         // 5
math.floor(4.9)        // 4
math.abs(-10px)        // 10px
math.min(5px, 10px)    // 5px
math.max(5px, 10px)    // 10px
math.percentage(0.25)  // 25%
math.pow(2, 8)         // 256
math.sqrt(16)          // 4
math.random(100)       // رقم عشوائي 1..100

math.$pi               // 3.1415926536` },
    { t: 'code', lang: 'scss', title: 'إزالة الوحدة', code: `
@use 'sass:math';

@function strip-unit($value) {
  @return math.div($value, ($value * 0 + 1));
}

strip-unit(16px)   // 16
strip-unit(2rem)   // 2` },
    { t: 'p', text: 'مفيدة حين تحتاج الرقم المجرّد في حساب، مثل توليد `clamp()` سائلة.' },
    { t: 'code', lang: 'scss', title: 'حجم خط سائل', code: `
@use 'sass:math';

@function fluid($min-px, $max-px, $min-vw: 400px, $max-vw: 1200px) {
  $slope: math.div($max-px - $min-px, $max-vw - $min-vw);
  $intercept: $min-px - $slope * $min-vw;

  @return clamp(
    #{$min-px},
    #{$intercept} + #{strip-unit($slope) * 100}vw,
    #{$max-px}
  );
}

h1 { font-size: fluid(28px, 56px); }` },

    { t: 'h2', text: 'دوال القوائم والخرائط' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:list';
@use 'sass:map';

$fonts: 'Cairo', 'Segoe UI', sans-serif;
$sizes: (sm: 4px, md: 8px, lg: 16px);

list.length($fonts)          // 3
list.nth($fonts, 1)          // 'Cairo'
list.append($fonts, Arial)   // إضافة عنصر
list.index($fonts, 'Cairo')  // 1
list.join((1px, 2px), (3px,))// دمج قائمتين

map.get($sizes, md)          // 8px
map.has-key($sizes, xl)      // false
map.keys($sizes)             // sm, md, lg
map.values($sizes)           // 4px, 8px, 16px
map.merge($sizes, (xl: 32px))// خريطة جديدة موسّعة
map.remove($sizes, sm)       // بلا sm` },
    { t: 'warn', title: 'الفهرسة تبدأ من 1', text: 'خلافاً لمعظم لغات البرمجة، قوائم Sass تبدأ من **1** لا من 0. `list.nth($list, 0)` خطأ.' },

    { t: 'h2', text: 'دوال النصوص والتحقّق' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:string';
@use 'sass:meta';

string.length('CodeWay')        // 7
string.to-upper-case('abc')     // 'ABC'
string.slice('CodeWay', 1, 4)   // 'Code'
string.index('CodeWay', 'Way')  // 5
string.unquote('"text"')        // text

meta.type-of(10px)              // number
meta.type-of(#fff)              // color
meta.type-of('abc')             // string
meta.inspect($map)              // تمثيل نصي للتشخيص` },

    { t: 'h2', text: 'كتابة دوالك' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:math';
@use 'sass:map';

// 1) تحويل بكسل إلى rem
@function rem($px, $base: 16px) {
  @return math.div($px, $base) * 1rem;
}

// 2) مقياس مسافات
$spacer: 8px;

@function space($multiplier) {
  @return $spacer * $multiplier;
}

// 3) قراءة آمنة من خريطة
$z-layers: (base: 1, dropdown: 100, header: 900, modal: 1000);

@function z($layer) {
  @if not map.has-key($z-layers, $layer) {
    @error "طبقة z غير معرّفة: #{$layer}";
  }
  @return map.get($z-layers, $layer);
}

// 4) اختيار لون نص مناسب للخلفية
@use 'sass:color';

@function contrast-color($bg, $light: #fff, $dark: #0f172a) {
  @if color.lightness($bg) > 55% {
    @return $dark;
  }
  @return $light;
}

// الاستخدام
.card {
  padding: space(2) space(3);        // 16px 24px
  font-size: rem(18px);              // 1.125rem
  z-index: z(header);                // 900
  background: #6366f1;
  color: contrast-color(#6366f1);    // #fff تلقائياً
}` },
    { t: 'demo', title: 'دالة تباين النص', height: 200,
      css: '.r{display:flex;gap:8px;flex-wrap:wrap}.c{padding:14px 20px;border-radius:10px;font-weight:700;font-size:.9em}',
      html: '<div class="r"><span class="c" style="background:#6366f1;color:#fff">خلفية داكنة → نص أبيض</span><span class="c" style="background:#fde68a;color:#0f172a">خلفية فاتحة → نص داكن</span><span class="c" style="background:#0f172a;color:#fff">أدكن → أبيض</span></div>' },

    { t: 'h2', text: 'التشخيص' },
    { t: 'code', lang: 'scss', code: `
@debug "قيمة المتغيّر: #{$brand}";     // يطبع في الطرفية أثناء الترجمة
@warn "هذا الـ mixin مهمل، استخدم button() بدلاً منه";
@error "قيمة غير صالحة: #{$value}";     // يوقف الترجمة` },
    { t: 'table', head: ['التوجيه', 'الأثر', 'متى'], rows: [
      ['`@debug`', 'يطبع رسالة ويكمل', 'أثناء التطوير لفحص القيم'],
      ['`@warn`', 'تحذير ويكمل', 'تنبيه المستخدم لاستخدام مهمل'],
      ['`@error`', 'يوقف الترجمة', 'قيمة غير صالحة تُفسد الناتج']
    ]},

    { t: 'exercise',
      title: 'تمرين: مكتبة دوال المشروع',
      brief: 'ابنِ ملف `_functions.scss` واستخدمه لتوليد نظام تصميم كامل من قيم قليلة.',
      requirements: [
        'دالة `rem($px)` تحوّل البكسل إلى rem.',
        'دالة `space($n)` تُرجع مضاعفات وحدة أساسية 8px.',
        'دالتا `tint` و `shade` لتفتيح وتغميق اللون.',
        'دالة `z($layer)` تقرأ من خريطة طبقات مع `@error` للمفتاح المفقود.',
        'دالة `contrast-color($bg)` تختار أبيض أو أسود بحسب إضاءة الخلفية.',
        'دالة `strip-unit($v)` لإزالة الوحدة.',
        'دالة `fluid($min, $max)` تولّد `clamp()` لحجم خط سائل.',
        'ولّد مقياس ألوان من 9 درجات في `:root` من لون واحد.',
        'استخدم `@debug` لطباعة نتيجة إحدى الدوال أثناء الترجمة.'
      ],
      hints: [
        '`color.lightness($c)` تُرجع نسبة الإضاءة.',
        'الحد الفاصل المناسب للتباين عادة بين 50٪ و60٪.',
        '`@error` يجب أن تكون قبل `@return`.'
      ],
      solution: { lang: 'scss', code: `
@use 'sass:math';
@use 'sass:map';
@use 'sass:color';

/* ===== الأساسيات ===== */
$base-font: 16px !default;
$spacer: 8px !default;

@function rem($px, $base: $base-font) {
  @return math.div($px, $base) * 1rem;
}

@function space($n) {
  @return $spacer * $n;
}

@function strip-unit($value) {
  @return math.div($value, ($value * 0 + 1));
}

/* ===== الألوان ===== */
@function tint($color, $percent) {
  @return color.mix(#fff, $color, $percent);
}

@function shade($color, $percent) {
  @return color.mix(#000, $color, $percent);
}

@function contrast-color($bg, $light: #fff, $dark: #0f172a) {
  @return if(color.lightness($bg) > 55%, $dark, $light);
}

/* ===== الطبقات ===== */
$z-layers: (
  'base': 1,
  'dropdown': 100,
  'sticky': 500,
  'header': 900,
  'modal': 1000,
  'toast': 1100
) !default;

@function z($layer) {
  @if not map.has-key($z-layers, $layer) {
    @error "طبقة z غير معرّفة: '#{$layer}'. المتاح: #{map.keys($z-layers)}";
  }
  @return map.get($z-layers, $layer);
}

/* ===== الخط السائل ===== */
@function fluid($min-px, $max-px, $min-vw: 400px, $max-vw: 1200px) {
  $slope: math.div($max-px - $min-px, $max-vw - $min-vw);
  $intercept: $min-px - $slope * $min-vw;

  @return clamp(
    #{$min-px},
    #{$intercept} + #{strip-unit($slope) * 100}vw,
    #{$max-px}
  );
}

/* ===== التطبيق ===== */
$brand: #6366f1;

@debug "حجم 24px يساوي: #{rem(24px)}";

:root {
  --brand-50:  #{tint($brand, 90%)};
  --brand-100: #{tint($brand, 80%)};
  --brand-200: #{tint($brand, 60%)};
  --brand-300: #{tint($brand, 40%)};
  --brand-400: #{tint($brand, 20%)};
  --brand-500: #{$brand};
  --brand-600: #{shade($brand, 15%)};
  --brand-700: #{shade($brand, 30%)};
  --brand-800: #{shade($brand, 45%)};
  --brand-900: #{shade($brand, 60%)};
}

h1 {
  font-size: fluid(28px, 56px);
  margin-bottom: space(3);
}

.btn {
  padding: space(1.5) space(3);
  font-size: rem(16px);
  background: var(--brand-500);
  color: #{contrast-color($brand)};
}

.modal { z-index: z('modal'); }
.site-header { z-index: z('header'); }` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق بين `color.adjust` و `color.scale`؟', options: ['لا فرق', 'الأولى تعديل مطلق والثانية نسبي من المسافة المتبقّية', 'العكس', 'الثانية أقدم'], answer: 1,
        explain: '`scale` أكثر أماناً مع الألوان الطرفية لأنها لا تتجاوز الحدود.' },
      { q: 'من أي رقم تبدأ فهرسة القوائم في Sass؟', options: ['0', '1', '-1', 'حسب النوع'], answer: 1,
        explain: 'خلافاً لمعظم اللغات، الفهرسة تبدأ من 1.' },
      { q: 'متى تستخدم دالة بدل mixin؟', options: ['دائماً', 'حين تحتاج قيمة واحدة تضعها داخل إعلان', 'مع الوسائط', 'مع @content'], answer: 1,
        explain: 'الدالة تُرجع قيمة؛ mixin ينتج إعلانات كاملة.' },
      { q: 'ما وظيفة `@error`؟', options: ['طباعة تحذير', 'إيقاف الترجمة برسالة عند قيمة غير صالحة', 'تسجيل في الطرفية', 'إرجاع null'], answer: 1,
        explain: 'يمنع توليد CSS خاطئة صامتة، ويوجّه المطوّر للسبب مباشرة.' },
      { q: 'ما فائدة توليد مقياس ألوان بدوال؟', options: ['حجم أصغر', 'تغيير لون واحد يولّد نظاماً كاملاً متناغماً', 'أسرع', 'دعم أوسع'], answer: 1,
        explain: 'مصدر حقيقة واحد للون، والاشتقاق يضمن التناغم تلقائياً.' }
    ]}
  ]
};
