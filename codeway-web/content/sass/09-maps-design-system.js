'use strict';

module.exports = {
  slug: '09-maps-design-system',
  title: 'الخرائط وبناء نظام تصميم',
  summary: 'الخرائط كمصدر حقيقة واحد لنظام تصميمك: الألوان والمسافات والخطوط والثيمات في بنية واحدة.',
  duration: 45,
  level: 'متقدم',
  tags: ['الخرائط', 'نظام تصميم'],
  objectives: [
    'تنشئ خرائط وتقرأ منها بأمان.',
    'تتعامل مع الخرائط المتداخلة.',
    'تبني رموز تصميم (Design Tokens) منظّمة.',
    'تولّد متغيّرات CSS وثيمات من خريطة واحدة.',
    'تكتب دوال وصول تمنع الأخطاء الصامتة.'
  ],
  quickRef: [
    { code: '(key: value, …)', desc: 'إنشاء خريطة' },
    { code: 'map.get($m, key)', desc: 'قراءة قيمة' },
    { code: 'map.get($m, k1, k2)', desc: 'قراءة متداخلة' },
    { code: 'map.has-key($m, key)', desc: 'فحص وجود مفتاح' },
    { code: 'map.merge($a, $b)', desc: 'دمج خريطتين' },
    { code: 'map.keys / map.values', desc: 'استخراج المفاتيح أو القيم' }
  ],
  blocks: [
    { t: 'h2', text: 'ما هي الخريطة؟' },
    { t: 'p', text: 'بنية بيانات من أزواج «مفتاح: قيمة» — مثل الكائن في جافاسكربت. تحوّل عشرات المتغيّرات المتناثرة إلى مجموعة منظّمة يمكن المرور عليها بحلقة.' },
    { t: 'compare', lang: 'scss', bad: {
      code: '$space-1: 4px;\n$space-2: 8px;\n$space-3: 16px;\n$space-4: 24px;\n$space-5: 32px;',
      why: 'خمسة متغيّرات منفصلة: لا يمكن المرور عليها بحلقة، ولا التحقّق من وجود قيمة، ولا تمريرها كوحدة واحدة.'
    }, good: {
      code: '$spacers: (\n  1: 4px,\n  2: 8px,\n  3: 16px,\n  4: 24px,\n  5: 32px\n);',
      why: 'بنية واحدة قابلة للمرور والفحص والدمج والتمرير كمعامل.'
    }},

    { t: 'h2', text: 'العمليات الأساسية' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:map';

$colors: (
  'primary': #6366f1,
  'success': #10b981,
  'danger':  #ef4444
);

map.get($colors, 'primary')       // #6366f1
map.get($colors, 'missing')       // null — لا يفشل
map.has-key($colors, 'success')   // true
map.keys($colors)                 // 'primary', 'success', 'danger'
map.values($colors)               // #6366f1, #10b981, #ef4444

// دمج — يُرجع خريطة جديدة
$extended: map.merge($colors, ('warning': #f59e0b));

// حذف
$fewer: map.remove($colors, 'danger');

// عدد العناصر
list.length($colors)              // 3` },
    { t: 'danger', title: 'الخرائط غير قابلة للتغيير', text: 'كل دوال الخرائط تُرجع **خريطة جديدة** ولا تعدّل الأصلية. كتابة `map.merge($colors, (…))` بلا إعادة إسناد لا تفعل شيئاً. لاحظ `$extended: map.merge(...)` في المثال.' },

    { t: 'h2', text: 'الخرائط المتداخلة' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:map';

$theme: (
  'colors': (
    'brand': (
      'light': #a5b4fc,
      'base':  #6366f1,
      'dark':  #4338ca
    ),
    'text': (
      'base':  #0f172a,
      'muted': #64748b
    )
  ),
  'spacing': (1: 4px, 2: 8px, 3: 16px),
  'radius':  (sm: 6px, md: 12px, lg: 20px)
);

// الوصول المتداخل: مرّر المفاتيح بالتتابع
map.get($theme, 'colors', 'brand', 'base')   // #6366f1
map.get($theme, 'spacing', 3)                // 16px
map.get($theme, 'radius', md)                // 12px` },

    { t: 'h2', text: 'دوال وصول آمنة' },
    { t: 'p', text: 'المشكلة: `map.get` بمفتاح خاطئ يُرجع `null` بصمت، فتحصل على `padding: null` التي تُحذف من الناتج — ثم تحتار لماذا لا يعمل التنسيق.' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:map';

@function color($keys...) {
  $value: map.get($theme, 'colors', $keys...);

  @if $value == null {
    @error "لون غير معرّف: #{$keys}";
  }

  @return $value;
}

@function space($key) {
  $value: map.get($theme, 'spacing', $key);

  @if $value == null {
    @error "مسافة غير معرّفة: '#{$key}'. المتاح: #{map.keys(map.get($theme, 'spacing'))}";
  }

  @return $value;
}

// الاستخدام
.card {
  background: color('brand', 'base');
  padding: space(3);
  color: color('text', 'muted');
}

// خطأ مطبعي؟ توقف فوري برسالة واضحة
.bad {
  padding: space(99);
  // Error: مسافة غير معرّفة: '99'. المتاح: 1, 2, 3
}` },
    { t: 'tip', text: 'هذا النمط — خريطة مركزية + دوال وصول تتحقّق — هو أساس أي نظام تصميم جادّ. يحوّل الأخطاء الصامتة إلى أخطاء ترجمة صريحة.' },

    { t: 'h2', text: 'رموز التصميم (Design Tokens)' },
    { t: 'p', text: '«رمز التصميم» قيمة مسمّاة تمثّل قراراً تصميمياً: لون، مسافة، حجم خط، نصف قطر. جمعها في مكان واحد يجعل التصميم متّسقاً ويجعل تغييره عملية واحدة.' },
    { t: 'code', lang: 'scss', title: '_tokens.scss', code: `
@use 'sass:map';

$tokens: (
  'color': (
    'brand':   (50: #eef2ff, 100: #e0e7ff, 300: #a5b4fc,
                500: #6366f1, 700: #4338ca, 900: #312e81),
    'gray':    (50: #f8fafc, 100: #f1f5f9, 300: #cbd5e1,
                500: #64748b, 700: #334155, 900: #0f172a),
    'success': (100: #d1fae5, 500: #10b981, 700: #047857),
    'danger':  (100: #fee2e2, 500: #ef4444, 700: #b91c1c)
  ),

  'space': (0: 0, 1: 4px, 2: 8px, 3: 12px, 4: 16px,
            5: 24px, 6: 32px, 7: 48px, 8: 64px),

  'font': (
    'family': (
      'base': ('Cairo', 'Segoe UI', sans-serif),
      'mono': ('JetBrains Mono', monospace)
    ),
    'size': (xs: .75rem, sm: .875rem, md: 1rem,
             lg: 1.25rem, xl: 1.5rem, '2xl': 2rem, '3xl': 2.5rem),
    'weight': (normal: 400, medium: 500, bold: 700, black: 800),
    'leading': (tight: 1.3, base: 1.6, loose: 1.9)
  ),

  'radius': (none: 0, sm: 6px, md: 12px, lg: 20px, full: 999px),

  'shadow': (
    sm: (0 2px 6px rgba(15,23,42,.07)),
    md: (0 8px 24px rgba(15,23,42,.09)),
    lg: (0 18px 48px rgba(15,23,42,.13))
  ),

  'breakpoint': (sm: 576px, md: 768px, lg: 992px, xl: 1200px),

  'z': (base: 1, dropdown: 100, sticky: 500,
        header: 900, modal: 1000, toast: 1100)
);

/* ===== دوال الوصول ===== */

@function token($category, $keys...) {
  $value: map.get($tokens, $category, $keys...);

  @if $value == null {
    @error "رمز غير معرّف: #{$category} → #{$keys}";
  }

  @return $value;
}

@function color($name, $shade: 500) { @return token('color', $name, $shade); }
@function space($key)              { @return token('space', $key); }
@function fs($key)                 { @return token('font', 'size', $key); }
@function fw($key)                 { @return token('font', 'weight', $key); }
@function radius($key)             { @return token('radius', $key); }
@function shadow($key)             { @return token('shadow', $key); }
@function bp($key)                 { @return token('breakpoint', $key); }
@function z($key)                  { @return token('z', $key); }` },
    { t: 'code', lang: 'scss', title: 'الاستخدام — واضح ومقروء', code: `
.card {
  background: color('gray', 50);
  border: 1px solid color('gray', 300);
  border-radius: radius(md);
  padding: space(5);
  box-shadow: shadow(md);

  &__title {
    color: color('gray', 900);
    font-size: fs(lg);
    font-weight: fw(bold);
    margin-bottom: space(2);
  }

  &__text {
    color: color('gray', 500);
    font-size: fs(md);
  }

  @media (min-width: bp(md)) {
    padding: space(6);
  }
}` },
    { t: 'demo', title: 'بطاقة مبنية على رموز التصميم', height: 240,
      css: '.card{background:#f8fafc;border:1px solid #cbd5e1;border-radius:12px;padding:24px;box-shadow:0 8px 24px rgba(15,23,42,.09);max-width:360px}.t{color:#0f172a;font-size:1.25rem;font-weight:700;margin:0 0 8px}.x{color:#64748b;margin:0}',
      html: '<div class="card"><p class="t">بطاقة من رموز التصميم</p><p class="x">كل قيمة هنا — اللون والمسافة والحجم ونصف القطر والظل — تأتي من خريطة واحدة مركزية.</p></div>' },

    { t: 'h2', text: 'توليد متغيّرات CSS من الخريطة' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:map';

:root {
  // الألوان
  @each $name, $shades in map.get($tokens, 'color') {
    @each $shade, $value in $shades {
      --color-#{$name}-#{$shade}: #{$value};
    }
  }

  // المسافات
  @each $key, $value in map.get($tokens, 'space') {
    --space-#{$key}: #{$value};
  }

  // أنصاف الأقطار
  @each $key, $value in map.get($tokens, 'radius') {
    --radius-#{$key}: #{$value};
  }
}` },
    { t: 'code', lang: 'css', title: 'مقتطف من الناتج', code: `
:root {
  --color-brand-50: #eef2ff;
  --color-brand-500: #6366f1;
  --color-brand-900: #312e81;
  --color-gray-50: #f8fafc;
  /* … */
  --space-4: 16px;
  --radius-md: 12px;
}` },
    { t: 'p', text: 'الآن لديك الأفضل من العالمين: قوة Sass في التوليد والتحقّق، ومرونة متغيّرات CSS في الثيمات ووقت التشغيل.' },

    { t: 'h2', text: 'نظام ثيمات كامل' },
    { t: 'code', lang: 'scss', code: `
@use 'sass:map';

$themes: (
  'light': (
    'bg':      #f6f7fb,
    'surface': #ffffff,
    'text':    #0f172a,
    'muted':   #64748b,
    'border':  #e2e8f0,
    'brand':   #6366f1
  ),
  'dark': (
    'bg':      #0a0f1e,
    'surface': #111a2e,
    'text':    #e8edf9,
    'muted':   #a9b6d3,
    'border':  #22304f,
    'brand':   #818cf8
  )
);

@mixin emit-theme($theme) {
  @each $key, $value in $theme {
    --c-#{$key}: #{$value};
  }
}

// الثيم الافتراضي
:root {
  @include emit-theme(map.get($themes, 'light'));
}

// يتبع تفضيل النظام
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    @include emit-theme(map.get($themes, 'dark'));
  }
}

// اختيار صريح من المستخدم
@each $name, $theme in $themes {
  [data-theme='#{$name}'] {
    @include emit-theme($theme);
  }
}

/* الاستخدام */
body {
  background: var(--c-bg);
  color: var(--c-text);
}

.card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
}` },
    { t: 'demo', title: 'الثيمان جنباً إلى جنب', height: 260,
      css: '.g{display:grid;grid-template-columns:1fr 1fr;gap:10px}.p{border-radius:12px;padding:14px}.l{background:#f6f7fb;color:#0f172a;border:1px solid #e2e8f0}.d{background:#0a0f1e;color:#e8edf9;border:1px solid #22304f}.c{border-radius:8px;padding:10px;margin-top:8px}.lc{background:#fff;border:1px solid #e2e8f0}.dc{background:#111a2e;border:1px solid #22304f}b{font-size:.85em}',
      html: '<div class="g"><div class="p l"><b>light</b><div class="c lc">بطاقة</div></div><div class="p d"><b>dark</b><div class="c dc">بطاقة</div></div></div><p style="color:#64748b;font-size:.86em;margin-top:10px">إضافة ثيم ثالث = إضافة مفتاح واحد في خريطة $themes.</p>' },
    { t: 'tip', text: 'لاحظ القوة: إضافة ثيم «عالي التباين» تعني إضافة مفتاح واحد في `$themes`، وسيُولَّد كل شيء تلقائياً. لا تعديل في أي مكان آخر.' },

    { t: 'h2', text: 'الدمج والتخصيص' },
    { t: 'code', lang: 'scss', title: 'مكتبة قابلة للتوسيع', code: `
@use 'sass:map';

// القيم الافتراضية في المكتبة
$default-colors: (
  'primary': #6366f1,
  'success': #10b981
) !default;

// المستخدم يمرّر إضافاته
$custom-colors: () !default;

// الدمج: قيم المستخدم تتغلّب
$colors: map.merge($default-colors, $custom-colors);` },
    { t: 'code', lang: 'scss', title: 'في مشروع المستخدم', code: `
@use 'library' with (
  $custom-colors: (
    'primary': #dd0031,     // تجاوز
    'brand-2': #f59e0b      // إضافة
  )
);` },

    { t: 'exercise',
      title: 'تمرين: نظام تصميم كامل',
      brief: 'ابنِ نظام تصميم متكامل مبنياً على الخرائط، وولّد منه كل ما يحتاجه مشروع حقيقي.',
      requirements: [
        'خريطة `$tokens` بستّ فئات: الألوان (متداخلة بدرجات)، المسافات، الخطوط، أنصاف الأقطار، الظلال، نقاط التوقف.',
        'دالة عامة `token($category, $keys...)` مع `@error` واضحة.',
        'دوال مختصرة: `color()` و `space()` و `fs()` و `radius()` و `shadow()` و `bp()`.',
        'توليد كل متغيّرات CSS في `:root` بحلقات.',
        'خريطة `$themes` بثيمين على الأقل، وmixin يبثّها.',
        'دعم الثيم التلقائي (تفضيل النظام) والصريح (`data-theme`).',
        'mixin `respond-to($bp)` يستخدم دالة `bp()`.',
        'نسّق ثلاثة مكوّنات (بطاقة، زر، تنبيه) باستخدام الدوال فقط — بلا قيم صريحة إطلاقاً.',
        'اختبر رسالة `@error` بتمرير مفتاح خاطئ.'
      ],
      hints: [
        '`map.get($map, $keys...)` تقبل مفاتيح متعدّدة للوصول المتداخل.',
        'استخدم `$keys...` في توقيع الدالة لتمرير عدد متغيّر من المفاتيح.',
        'الإقحام ضروري داخل `:root`: `--x: #{$value};`.'
      ],
      solution: { lang: 'scss', code: `
@use 'sass:map';

/* ============ الرموز ============ */
$tokens: (
  'color': (
    'brand': (100: #e0e7ff, 300: #a5b4fc, 500: #6366f1, 700: #4338ca),
    'gray':  (50: #f8fafc, 100: #f1f5f9, 300: #cbd5e1, 500: #64748b, 900: #0f172a),
    'ok':    (100: #d1fae5, 500: #10b981, 700: #047857),
    'err':   (100: #fee2e2, 500: #ef4444, 700: #b91c1c)
  ),
  'space':  (0: 0, 1: 4px, 2: 8px, 3: 12px, 4: 16px, 5: 24px, 6: 32px),
  'font': (
    'size':   (sm: .875rem, md: 1rem, lg: 1.25rem, xl: 1.5rem),
    'weight': (normal: 400, bold: 700, black: 800)
  ),
  'radius': (sm: 6px, md: 12px, lg: 20px, full: 999px),
  'shadow': (
    sm: (0 2px 6px rgba(15,23,42,.07)),
    md: (0 8px 24px rgba(15,23,42,.09))
  ),
  'bp': (sm: 576px, md: 768px, lg: 992px)
);

/* ============ الوصول ============ */
@function token($category, $keys...) {
  $value: map.get($tokens, $category, $keys...);

  @if $value == null {
    @error "رمز غير معرّف: #{$category} → #{$keys}";
  }

  @return $value;
}

@function color($name, $shade: 500) { @return token('color', $name, $shade); }
@function space($k)  { @return token('space', $k); }
@function fs($k)     { @return token('font', 'size', $k); }
@function fw($k)     { @return token('font', 'weight', $k); }
@function radius($k) { @return token('radius', $k); }
@function shadow($k) { @return token('shadow', $k); }
@function bp($k)     { @return token('bp', $k); }

@mixin respond-to($k) {
  @media (min-width: bp($k)) { @content; }
}

/* ============ متغيّرات CSS ============ */
:root {
  @each $name, $shades in map.get($tokens, 'color') {
    @each $shade, $value in $shades {
      --color-#{$name}-#{$shade}: #{$value};
    }
  }
  @each $k, $v in map.get($tokens, 'space')  { --space-#{$k}: #{$v}; }
  @each $k, $v in map.get($tokens, 'radius') { --radius-#{$k}: #{$v}; }
}

/* ============ الثيمات ============ */
$themes: (
  'light': (bg: #f6f7fb, surface: #ffffff, text: #0f172a,
            muted: #64748b, border: #e2e8f0, brand: #6366f1),
  'dark':  (bg: #0a0f1e, surface: #111a2e, text: #e8edf9,
            muted: #a9b6d3, border: #22304f, brand: #818cf8)
);

@mixin emit-theme($theme) {
  @each $k, $v in $theme { --c-#{$k}: #{$v}; }
}

:root { @include emit-theme(map.get($themes, 'light')); }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    @include emit-theme(map.get($themes, 'dark'));
  }
}

@each $name, $theme in $themes {
  [data-theme='#{$name}'] { @include emit-theme($theme); }
}

/* ============ المكوّنات ============ */
body {
  background: var(--c-bg);
  color: var(--c-text);
  font-size: fs(md);
}

.card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: radius(md);
  padding: space(5);
  box-shadow: shadow(md);

  &__title {
    font-size: fs(lg);
    font-weight: fw(bold);
    margin-bottom: space(2);
  }

  &__text { color: var(--c-muted); }

  @include respond-to(md) { padding: space(6); }
}

.btn {
  padding: space(3) space(5);
  border-radius: radius(sm);
  font-weight: fw(bold);
  background: var(--c-brand);
  color: #fff;
  border: 0;
  cursor: pointer;

  &:hover { background: color('brand', 700); }
}

.alert {
  padding: space(4);
  border-radius: radius(sm);
  border: 1px solid;
  margin-bottom: space(3);

  &--ok  { background: color('ok', 100);  border-color: color('ok', 500);  color: color('ok', 700); }
  &--err { background: color('err', 100); border-color: color('err', 500); color: color('err', 700); }
}` },
      solutionNote: 'لاحظ: لا توجد قيمة صريحة واحدة في المكوّنات — كلها تمرّ عبر الدوال. تغيير النظام كله يتم من خريطة `$tokens` وحدها.'
    },

    { t: 'quiz', items: [
      { q: 'ماذا تُرجع `map.merge($a, $b)`؟', options: ['تعدّل `$a`', 'خريطة جديدة — الأصلية لا تتغيّر', '`true`', 'قائمة'], answer: 1,
        explain: 'الخرائط غير قابلة للتغيير؛ يجب إعادة إسناد الناتج.' },
      { q: 'كيف تقرأ من خريطة متداخلة؟', options: ['`map.get($m, "a.b")`', '`map.get($m, "a", "b")`', '`$m["a"]["b"]`', 'لا يمكن'], answer: 1,
        explain: 'مرّر المفاتيح بالتتابع كمعاملات إضافية.' },
      { q: 'ما خطر `map.get` بمفتاح خاطئ؟', options: ['خطأ ترجمة', 'يُرجع `null` بصمت فتُحذف الخاصية ولا تعرف السبب', 'يعطي 0', 'يتوقّف'], answer: 1,
        explain: 'لهذا نغلّفه بدالة تتحقّق وترمي `@error`.' },
      { q: 'ما فائدة توليد متغيّرات CSS من خرائط Sass؟', options: ['حجم أصغر', 'الجمع بين قوة التوليد في Sass ومرونة الثيمات وقت التشغيل', 'أسرع ترجمة', 'دعم أوسع'], answer: 1,
        explain: 'Sass يولّد ويتحقّق، وCSS تتبدّل مع الثيم بلا إعادة بناء.' },
      { q: 'ما ميزة تعريف الثيمات في خريطة واحدة؟', options: ['أجمل', 'إضافة ثيم كامل تصبح إضافة مفتاح واحد ويُولَّد الباقي تلقائياً', 'أسرع', 'أصغر'], answer: 1,
        explain: 'مصدر حقيقة واحد يمنع النسيان والتعارض بين الثيمات.' }
    ]}
  ]
};
