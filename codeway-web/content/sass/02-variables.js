'use strict';

module.exports = {
  slug: '02-variables',
  title: 'المتغيّرات وأنواع البيانات',
  summary: 'تخزين القيم المتكرّرة، أنواع البيانات في Sass، النطاق، والعلاقة بمتغيّرات CSS الأصلية.',
  duration: 40,
  level: 'مبتدئ',
  tags: ['المتغيّرات', 'الأساسيات'],
  objectives: [
    'تعرّف متغيّرات وتستخدمها في أنماطك.',
    'تعرف أنواع البيانات السبعة في Sass.',
    'تفهم نطاق المتغيّر عالمياً ومحلياً.',
    'تفرّق بين متغيّرات Sass ومتغيّرات CSS.',
    'تنظّم متغيّراتك في نظام تصميم مبدئي.'
  ],
  quickRef: [
    { code: '$name: value;', desc: 'تعريف متغيّر' },
    { code: '$name: value !default;', desc: 'قيمة افتراضية قابلة للتجاوز' },
    { code: '$name: value !global;', desc: 'تعديل متغيّر عالمي من داخل كتلة' },
    { code: '#{$name}', desc: 'إقحام المتغيّر في نص' },
    { code: '--css-var: #{$sass-var};', desc: 'تمرير قيمة Sass إلى متغيّر CSS' }
  ],
  blocks: [
    { t: 'h2', text: 'لماذا المتغيّرات؟' },
    { t: 'p', text: 'اللون `#6366f1` مكرّر في 40 موضعاً. جاء العميل وقال: «اجعله أزرق». الآن أمامك خياران: بحث واستبدال في كل الملفات (مع خطر تغيير قيمة لا تقصدها)، أو سطر واحد.' },
    { t: 'compare', lang: 'scss', bad: {
      code: '.btn { background: #6366f1; }\n.link { color: #6366f1; }\n.badge { border-color: #6366f1; }\n.title::after { background: #6366f1; }',
      why: 'أي تغيير يعني تعديل كل موضع، وأي خطأ مطبعي يمرّ بلا ملاحظة.'
    }, good: {
      code: '$color-brand: #6366f1;\n\n.btn { background: $color-brand; }\n.link { color: $color-brand; }\n.badge { border-color: $color-brand; }\n.title::after { background: $color-brand; }',
      why: 'سطر واحد يغيّر كل شيء، والاسم يوثّق النية.'
    }},

    { t: 'h2', text: 'التعريف والاستخدام' },
    { t: 'code', lang: 'scss', code: `
// التعريف: علامة الدولار ثم الاسم ثم القيمة
$color-brand: #6366f1;
$spacing-md: 16px;
$font-heading: 'Cairo', sans-serif;
$radius: 12px;

// الاستخدام
.card {
  padding: $spacing-md;
  border-radius: $radius;
  font-family: $font-heading;
  border: 1px solid $color-brand;
}` },
    { t: 'note', title: 'اصطلاح التسمية', text: 'استخدم الشرطات لا الشرطة السفلية: `$color-brand` لا `$color_brand`. ورتّب الاسم من العام إلى الخاص: `$color-text-muted` أوضح من `$muted-text-color` عند الفرز الأبجدي.' },

    { t: 'h2', text: 'أنواع البيانات' },
    { t: 'table', head: ['النوع', 'أمثلة', 'ملاحظة'], rows: [
      ['**رقم**', '`12`, `1.5rem`, `50%`, `2px`', 'يحمل وحدته معه'],
      ['**نص**', '`"Cairo"`, `bold`, `solid`', 'الاقتباس اختياري غالباً'],
      ['**لون**', '`#6366f1`, `rgb(…)`, `red`', 'يدعم دوال معالجة الألوان'],
      ['**منطقي**', '`true`, `false`', 'للشروط'],
      ['**قائمة**', '`10px 20px`, `Cairo, sans-serif`', 'مفصولة بمسافة أو فاصلة'],
      ['**خريطة**', '`(sm: 4px, md: 8px)`', 'أزواج مفتاح وقيمة'],
      ['**فارغ**', '`null`', 'يحذف الخاصية كلياً']
    ]},
    { t: 'code', lang: 'scss', code: `
$size: 16px;              // رقم بوحدة
$ratio: 1.5;              // رقم بلا وحدة
$name: 'CodeWay';         // نص
$brand: #6366f1;          // لون
$is-dark: false;          // منطقي
$font-stack: 'Cairo', 'Segoe UI', sans-serif;   // قائمة
$spacing: (sm: 8px, md: 16px, lg: 24px);        // خريطة
$border: null;            // فارغ` },
    { t: 'tip', text: 'قيمة `null` مفيدة جداً: `border: $border;` تُحذف كلياً من الناتج إن كان `$border` فارغاً — فتستطيع جعل خاصية اختيارية داخل mixin.' },

    { t: 'h2', text: 'العمليات الحسابية' },
    { t: 'code', lang: 'scss', code: `
$base: 16px;

.el {
  font-size: $base;              // 16px
  padding: $base * 1.5;          // 24px
  margin-bottom: $base + 8px;    // 24px
  line-height: 24px / 16px;      // تجنّبها — انظر التحذير
}` },
    { t: 'danger', title: 'القسمة تغيّرت', text: 'المعامل `/` أصبح **مهملاً** في Sass الحديثة لأنه يتعارض مع صياغة CSS المختصرة (`font: 16px/1.5`). استخدم `math.div()` من الوحدة الرياضية بدلاً منه.' },
    { t: 'code', lang: 'scss', title: 'الطريقة الصحيحة للقسمة', code: `
@use 'sass:math';

$base: 16px;

.el {
  line-height: math.div(24px, $base);   // 1.5
  width: math.div(100%, 3);             // 33.3333%
}` },
    { t: 'warn', text: 'لا يمكن جمع قيم بوحدات متعارضة: `10px + 2em` خطأ. لكن `10px + 5` يعطي `15px` لأن العدد المجرّد يأخذ وحدة الطرف الآخر.' },

    { t: 'h2', text: 'الإقحام `#{}`' },
    { t: 'p', text: 'المتغيّر لا يعمل مباشرة داخل النصوص أو أسماء المحدّدات أو الخصائص. الإقحام يحلّ ذلك.' },
    { t: 'code', lang: 'scss', code: `
$side: 'right';
$breakpoint: 768px;
$prefix: 'app';

.box {
  // في اسم الخاصية
  margin-#{$side}: 20px;          // margin-right: 20px

  // في قيمة نصية
  content: 'الاتجاه: #{$side}';

  // في استعلام الوسائط
  @media (min-width: #{$breakpoint}) { … }
}

// في اسم المحدّد
.#{$prefix}-card {
  padding: 16px;
}                                  // .app-card { … }

// في مسار الصورة
.hero {
  background-image: url('/img/#{$name}.jpg');
}` },
    { t: 'demo', title: 'ناتج الإقحام', height: 220,
      css: 'pre{margin:0;padding:12px;background:#0f1729;color:#e2e8f0;direction:ltr;text-align:left;font-family:monospace;font-size:.84em;line-height:1.9;border-radius:10px;overflow-x:auto}',
      html: '<pre>/* المصدر */\n$side: right;\n.box { margin-#{$side}: 20px; }\n\n/* الناتج */\n.box { margin-right: 20px; }</pre>' },

    { t: 'h2', text: 'النطاق (Scope)' },
    { t: 'code', lang: 'scss', code: `
$color: blue;          // عالمي

.card {
  $color: red;         // محلي — يظلّل العالمي داخل هذه الكتلة فقط
  border-color: $color; // red
}

.other {
  color: $color;       // blue — العالمي لم يتأثّر
}` },
    { t: 'code', lang: 'scss', title: 'التعديل العالمي', code: `
$theme: light;

.dark-mode {
  $theme: dark !global;   // يغيّر المتغيّر العالمي نفسه
}` },
    { t: 'warn', text: '`!global` مصدر شائع للأخطاء الغامضة: قيمة تتغيّر من مكان بعيد فتتساءل لماذا. تجنّبها إلا لضرورة حقيقية.' },

    { t: 'h2', text: '`!default` — القيم القابلة للتخصيص' },
    { t: 'p', text: 'حين تبني مكتبة أو نظام تصميم، تريد أن تعطي قيماً افتراضية يستطيع المستخدم تجاوزها. علامة `!default` تعني: «استخدم هذه القيمة **إن لم تكن** محدّدة مسبقاً».' },
    { t: 'code', lang: 'scss', title: '_theme.scss', code: `
$color-brand: #6366f1 !default;
$radius: 12px !default;
$font-base: 16px !default;` },
    { t: 'code', lang: 'scss', title: 'main.scss — تخصيص المكتبة', code: `
@use 'theme' with (
  $color-brand: #dd0031,
  $radius: 4px
);
// $font-base بقي 16px لأننا لم نمرّره` },
    { t: 'p', text: 'هذه الآلية هي ما يجعل مكتبات مثل Bootstrap قابلة للتخصيص الكامل دون تعديل ملفاتها الأصلية.' },

    { t: 'h2', text: 'Sass مقابل متغيّرات CSS' },
    { t: 'table', head: ['الوجه', 'متغيّر Sass `$x`', 'متغيّر CSS `--x`'], rows: [
      ['وقت المعالجة', 'وقت البناء', 'وقت التشغيل في المتصفح'],
      ['يظهر في الناتج', 'لا — يُستبدَل بقيمته', 'نعم'],
      ['التغيير بجافاسكربت', 'مستحيل', '**ممكن**'],
      ['التغيير بـ media query', 'لا', '**نعم**'],
      ['الوراثة في الشجرة', 'لا — نطاق ملف', '**نعم**'],
      ['يعمل داخل الحلقات والشروط', '**نعم**', 'لا'],
      ['الأنسب لـ', 'قيم ثابتة، منطق البناء', 'الثيمات والقيم الديناميكية']
    ]},
    { t: 'code', lang: 'scss', title: 'الجمع بينهما — أفضل الممارسات', code: `
@use 'sass:color';

// قيم Sass للبناء والحسابات
$brand: #6366f1;
$radius-base: 12px;

// تصديرها كمتغيّرات CSS للثيمات
:root {
  --color-brand: #{$brand};
  --color-brand-dark: #{color.adjust($brand, $lightness: -12%)};
  --radius: #{$radius-base};
}

[data-theme='dark'] {
  --color-brand: #{color.adjust($brand, $lightness: 15%)};
}

// الاستخدام: متغيّر CSS ليتبدّل مع الثيم
.btn {
  background: var(--color-brand);
  border-radius: var(--radius);
}` },
    { t: 'tip', text: 'القاعدة العملية: **Sass للحساب والتوليد، وCSS للثيمات**. احسب القيم بـ Sass ثم صدّرها إلى `:root` كمتغيّرات CSS.' },

    { t: 'h2', text: 'بناء نظام متغيّرات' },
    { t: 'code', lang: 'scss', title: '_variables.scss', code: `
// ===== الألوان =====
$color-brand:       #6366f1;
$color-brand-dark:  #4f46e5;
$color-brand-light: #a5b4fc;

$color-success: #10b981;
$color-warning: #f59e0b;
$color-danger:  #ef4444;

$color-text:        #0f172a;
$color-text-muted:  #64748b;
$color-border:      #e2e8f0;
$color-bg:          #f6f7fb;
$color-surface:     #ffffff;

// ===== الطباعة =====
$font-base: 'Cairo', 'Segoe UI', sans-serif;
$font-mono: 'JetBrains Mono', monospace;

$fs-xs: 0.75rem;
$fs-sm: 0.875rem;
$fs-md: 1rem;
$fs-lg: 1.25rem;
$fs-xl: 1.5rem;
$fs-2xl: 2rem;

$fw-normal: 400;
$fw-bold: 700;
$fw-black: 800;

$lh-tight: 1.3;
$lh-base: 1.8;

// ===== المسافات =====
$space-1: 4px;
$space-2: 8px;
$space-3: 12px;
$space-4: 16px;
$space-5: 24px;
$space-6: 32px;
$space-7: 48px;

// ===== الحواف والظلال =====
$radius-sm: 6px;
$radius-md: 12px;
$radius-lg: 20px;
$radius-full: 999px;

$shadow-sm: 0 2px 6px rgba(15, 23, 42, .07);
$shadow-md: 0 8px 24px rgba(15, 23, 42, .09);
$shadow-lg: 0 18px 48px rgba(15, 23, 42, .13);

// ===== نقاط التوقف =====
$bp-sm: 576px;
$bp-md: 768px;
$bp-lg: 992px;
$bp-xl: 1200px;

// ===== الانتقالات =====
$transition: .25s cubic-bezier(.4, 0, .2, 1);` },
    { t: 'note', text: 'لاحظ استخدام **مقياس** لا قيم عشوائية: المسافات مضاعفات 4، وأحجام الخط بنسب متتالية. هذا ما يجعل التصميم يبدو متّسقاً حتى لو لم يعرف الناظر السبب.' },

    { t: 'exercise',
      title: 'تمرين: نظام متغيّرات لمشروعك',
      brief: 'ابنِ ملف متغيّرات كاملاً واستخدمه في تنسيق بطاقة.',
      requirements: [
        'أنشئ `_variables.scss` يحوي: 5 ألوان، مقياس مسافات من 5 قيم، 4 أحجام خطوط، 3 أنصاف أقطار، وظلّين.',
        'كل المتغيّرات بعلامة `!default`.',
        'في `main.scss` استوردها بـ `@use ... with (...)` وغيّر لوناً واحداً.',
        'صدّر ثلاثة من المتغيّرات إلى `:root` كمتغيّرات CSS بالإقحام.',
        'نسّق بطاقة `.card` تستخدم متغيّرات Sass للمسافات ومتغيّر CSS للون.',
        'استخدم `math.div` مرة واحدة لحساب `line-height`.',
        'استخدم الإقحام `#{}` في اسم خاصية أو في استعلام وسائط.',
        'أضف كتلة `[data-theme="dark"]` تغيّر متغيّرات CSS فقط ولاحظ تبدّل الشكل.'
      ],
      hints: [
        '`@use "sass:math";` يجب أن تكون في أعلى الملف.',
        'الإقحام ضروري داخل `:root`: `--x: #{$x};`.',
        'تجاوز القيم الافتراضية يتم في `@use ... with (...)` لا بإعادة التعريف.'
      ],
      solution: { lang: 'scss', code: `
/* ===== _variables.scss ===== */
$color-brand:  #6366f1 !default;
$color-text:   #0f172a !default;
$color-muted:  #64748b !default;
$color-border: #e2e8f0 !default;
$color-surface:#ffffff !default;

$space-1: 4px  !default;
$space-2: 8px  !default;
$space-3: 12px !default;
$space-4: 16px !default;
$space-5: 24px !default;

$fs-sm: 0.875rem !default;
$fs-md: 1rem     !default;
$fs-lg: 1.25rem  !default;
$fs-xl: 1.5rem   !default;

$radius-sm: 6px  !default;
$radius-md: 12px !default;
$radius-lg: 20px !default;

$shadow-sm: 0 2px 6px rgba(15,23,42,.07)  !default;
$shadow-md: 0 8px 24px rgba(15,23,42,.09) !default;

$bp-md: 768px !default;

/* ===== main.scss ===== */
@use 'sass:math';
@use 'variables' as v with (
  $color-brand: #dd0031
);

:root {
  --color-brand: #{v.$color-brand};
  --color-surface: #{v.$color-surface};
  --radius: #{v.$radius-md};
}

[data-theme='dark'] {
  --color-brand: #f472b6;
  --color-surface: #111a2e;
}

.card {
  background: var(--color-surface);
  border: 1px solid v.$color-border;
  border-radius: var(--radius);
  padding: v.$space-5;
  box-shadow: v.$shadow-md;

  // القسمة الصحيحة
  line-height: math.div(28px, 16px);

  // الإقحام في اسم خاصية
  $side: 'inline-start';
  border-#{$side}: 4px solid var(--color-brand);

  .card__title {
    color: var(--color-brand);
    font-size: v.$fs-lg;
    margin-bottom: v.$space-2;
  }

  .card__text {
    color: v.$color-muted;
    font-size: v.$fs-md;
  }

  // الإقحام في استعلام وسائط
  @media (min-width: #{v.$bp-md}) {
    padding: v.$space-5 * 1.5;
  }
}` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق الجوهري بين `$x` و `--x`؟', options: ['لا فرق', '`$x` يُستبدَل وقت البناء و`--x` يبقى ويعمل وقت التشغيل', '`--x` أسرع', '`$x` أحدث'], answer: 1,
        explain: 'متغيّر Sass يختفي في الناتج؛ متغيّر CSS يبقى ويمكن تغييره بجافاسكربت أو بالثيم.' },
      { q: 'ما البديل الصحيح لمعامل القسمة `/`؟', options: ['`\\`', '`math.div(a, b)`', '`divide()`', '`%`'], answer: 1,
        explain: 'المعامل `/` مهمل لتعارضه مع صياغة CSS المختصرة.' },
      { q: 'ماذا تعني `!default`؟', options: ['قيمة إلزامية', 'استخدم هذه القيمة إن لم تُحدَّد مسبقاً — تتيح التخصيص', 'قيمة عالمية', 'قيمة ثابتة'], answer: 1,
        explain: 'أساس تخصيص المكتبات: المستخدم يمرّر قيمه عبر `@use ... with (...)`.' },
      { q: 'متى تحتاج الإقحام `#{}`؟', options: ['دائماً', 'حين تضع المتغيّر داخل نص أو اسم محدّد أو اسم خاصية', 'مع الأرقام', 'مع الألوان'], answer: 1,
        explain: 'المتغيّر لا يُقيَّم تلقائياً في هذه المواضع، فيلزم الإقحام.' },
      { q: 'ما فائدة قيمة `null` لخاصية؟', options: ['تعطي صفراً', 'تحذف الخاصية كلياً من الناتج', 'تسبّب خطأ', 'تعطي قيمة افتراضية'], answer: 1,
        explain: 'مفيدة لجعل خاصية اختيارية داخل mixin دون كتابة شرط.' }
    ]}
  ]
};
