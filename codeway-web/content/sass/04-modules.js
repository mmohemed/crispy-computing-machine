'use strict';

module.exports = {
  slug: '04-modules',
  title: 'التقسيم والوحدات: @use و @forward',
  summary: 'تقسيم أنماطك إلى ملفات صغيرة، ونظام الوحدات الحديث الذي حلّ محلّ @import المهمل.',
  duration: 40,
  level: 'متوسط',
  tags: ['التنظيم', 'الوحدات'],
  objectives: [
    'تقسّم مشروعك إلى ملفات جزئية.',
    'تستورد الملفات بـ `@use` مع أسماء مستعارة.',
    'تعيد تصدير الوحدات بـ `@forward`.',
    'تخصّص متغيّرات وحدة بـ `with`.',
    'تعرف لماذا هُجر `@import`.'
  ],
  quickRef: [
    { code: '_partial.scss', desc: 'ملف جزئي لا يُترجَم وحده' },
    { code: '@use "path"', desc: 'استيراد وحدة' },
    { code: '@use "path" as v', desc: 'اسم مستعار' },
    { code: '@use "path" as *', desc: 'بلا بادئة (بحذر)' },
    { code: '@use "path" with ($x: 1)', desc: 'تخصيص المتغيّرات' },
    { code: '@forward "path"', desc: 'إعادة تصدير' },
    { code: '@use "sass:math"', desc: 'وحدة مدمجة' }
  ],
  blocks: [
    { t: 'h2', text: 'لماذا نقسّم؟' },
    { t: 'p', text: 'ملف CSS من 3000 سطر كابوس: تبحث عن قاعدة فتضيع، وتخشى التعديل خشية كسر شيء بعيد، ويستحيل على فريق العمل عليه معاً بلا تعارضات.' },
    { t: 'p', text: 'الحل: ملفات صغيرة كل منها مسؤول عن شيء واحد، تُدمَج عند الترجمة في ملف CSS واحد — فتحصل على تنظيم التطوير وأداء الإنتاج معاً.' },

    { t: 'h2', text: 'الملفات الجزئية' },
    { t: 'p', text: 'الملف الذي يبدأ اسمه بشرطة سفلية `_` يُسمّى **جزئياً**: لا يُترجَم إلى ملف CSS مستقل، بل يُستورد داخل غيره.' },
    { t: 'code', lang: 'text', noCopy: true, code: `
scss/
├── abstracts/
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/
│   ├── _reset.scss
│   └── _typography.scss
├── components/
│   ├── _button.scss
│   └── _card.scss
└── main.scss           ← الوحيد بلا شرطة، وهو ما يُترجَم` },
    { t: 'code', lang: 'bash', code: `
# يُترجَم main.scss فقط، والجزئيات تُدمَج بداخله
npx sass scss/main.scss dist/style.css` },

    { t: 'h2', text: '`@use` — الاستيراد الحديث' },
    { t: 'code', lang: 'scss', title: '_variables.scss', code: `
$color-brand: #6366f1;
$color-text: #0f172a;
$space-4: 16px;
$radius: 12px;` },
    { t: 'code', lang: 'scss', title: '_button.scss', code: `
@use 'variables';

.btn {
  background: variables.$color-brand;
  padding: variables.$space-4;
  border-radius: variables.$radius;
}` },
    { t: 'warn', title: 'البادئة إلزامية', text: 'مع `@use` لا يكفي كتابة `$color-brand` — يجب `variables.$color-brand`. البادئة هي **اسم الملف** بلا الشرطة والامتداد. هذا يمنع تعارض الأسماء بين الملفات ويوضّح مصدر كل قيمة.' },

    { t: 'h3', text: 'الأسماء المستعارة' },
    { t: 'code', lang: 'scss', code: `
// بادئة أقصر
@use 'abstracts/variables' as v;

.btn {
  background: v.$color-brand;
  padding: v.$space-4;
}

// بلا بادئة إطلاقاً
@use 'abstracts/variables' as *;

.btn {
  background: $color-brand;   // تعمل مباشرة
}` },
    { t: 'danger', title: 'حذار من `as *`', text: 'تلغي الحماية الأساسية التي جاء `@use` من أجلها: إن عرّف ملفان متغيّراً بالاسم نفسه ستحصل على تعارض غامض. استخدمها فقط لملف متغيّرات واحد مركزي تعرفه جيداً.' },
    { t: 'tip', text: 'الاصطلاح الشائع: `as v` للمتغيّرات و `as m` للـ mixins و `as f` للدوال. قصير وواضح.' },

    { t: 'h3', text: 'التخصيص بـ `with`' },
    { t: 'code', lang: 'scss', title: '_theme.scss', code: `
$brand: #6366f1 !default;
$radius: 12px !default;
$font-size: 16px !default;

.btn {
  background: $brand;
  border-radius: $radius;
  font-size: $font-size;
}` },
    { t: 'code', lang: 'scss', title: 'main.scss', code: `
@use 'theme' with (
  $brand: #dd0031,
  $radius: 4px
);
// $font-size بقي 16px` },
    { t: 'ul', items: [
      'المتغيّرات القابلة للتخصيص **يجب** أن تحمل `!default` في الوحدة.',
      '`with` تُستخدم **مرة واحدة فقط** لكل وحدة في المشروع كله.',
      'إن استوردت الوحدة نفسها في ملفين، فالتخصيص يكون في أول استيراد.'
    ]},

    { t: 'h2', text: 'الأعضاء الخاصة' },
    { t: 'code', lang: 'scss', code: `
// المتغيّر أو الـ mixin الذي يبدأ بـ - أو _ خاص بالوحدة
$-internal-cache: ();
@mixin _helper() { … }

// عام
$color-brand: #6366f1;
@mixin button() { … }` },
    { t: 'p', text: 'الأعضاء الخاصة لا تظهر للملفات المستوردة. مفيدة لتفاصيل التنفيذ التي لا تريد أن يعتمد عليها أحد.' },

    { t: 'h2', text: '`@forward` — إعادة التصدير' },
    { t: 'p', text: 'تخيّل عشرة ملفات في `abstracts/`. هل يستورد كل مكوّن العشرة؟ الحل: ملف فهرس واحد يعيد تصديرها كلها.' },
    { t: 'code', lang: 'scss', title: 'abstracts/_index.scss', code: `
@forward 'variables';
@forward 'mixins';
@forward 'functions';` },
    { t: 'code', lang: 'scss', title: 'components/_card.scss', code: `
// استيراد واحد يكفي — Sass يجد _index.scss تلقائياً
@use '../abstracts' as a;

.card {
  padding: a.$space-4;
  border-radius: a.$radius;
  @include a.flex-center;
}` },
    { t: 'note', title: 'ملف الفهرس', text: 'إن كان في المجلد ملف اسمه `_index.scss` فيكفي كتابة اسم المجلد: `@use "../abstracts"`. اصطلاح مريح يقلّل الضجيج.' },

    { t: 'h3', text: 'خيارات `@forward`' },
    { t: 'code', lang: 'scss', code: `
// إعادة تصدير أعضاء محدّدة فقط
@forward 'variables' show $color-brand, $space-4;

// إخفاء أعضاء
@forward 'mixins' hide _internal-helper;

// إضافة بادئة لكل الأعضاء
@forward 'buttons' as btn-*;
// فيصبح $primary باسم $btn-primary

// تمرير التخصيص للأعلى
@forward 'theme' with ($brand: #dd0031 !default);` },

    { t: 'h2', text: 'الوحدات المدمجة' },
    { t: 'table', head: ['الوحدة', 'محتواها', 'أمثلة'], rows: [
      ['`sass:math`', 'عمليات رياضية', '`math.div`, `math.round`, `math.abs`'],
      ['`sass:color`', 'معالجة الألوان', '`color.adjust`, `color.mix`, `color.scale`'],
      ['`sass:string`', 'النصوص', '`string.length`, `string.slice`, `string.index`'],
      ['`sass:list`', 'القوائم', '`list.length`, `list.nth`, `list.append`'],
      ['`sass:map`', 'الخرائط', '`map.get`, `map.has-key`, `map.merge`'],
      ['`sass:meta`', 'أدوات لغوية', '`meta.type-of`, `meta.inspect`'],
      ['`sass:selector`', 'المحدّدات', '`selector.nest`, `selector.append`']
    ]},
    { t: 'code', lang: 'scss', code: `
@use 'sass:math';
@use 'sass:color';
@use 'sass:map';

$base: 16px;
$brand: #6366f1;
$sizes: (sm: 4px, md: 8px, lg: 16px);

.el {
  line-height: math.div(24px, $base);
  background: color.adjust($brand, $lightness: -10%);
  padding: map.get($sizes, md);
}` },

    { t: 'h2', text: 'لماذا هُجر `@import`؟' },
    { t: 'table', head: ['المشكلة', 'مع `@import`', 'مع `@use`'], rows: [
      ['النطاق', 'كل شيء عالمي — تعارضات صامتة', 'نطاق لكل وحدة ببادئة واضحة'],
      ['التكرار', 'استيراد الملف مرتين يكرّر أنماطه', 'يُحمَّل مرة واحدة مهما تكرّر'],
      ['المصدر', 'لا تعرف من أين جاء المتغيّر', 'البادئة تخبرك فوراً'],
      ['الترتيب', 'حسّاس جداً وهشّ', 'مستقرّ'],
      ['الأداء', 'أبطأ في المشاريع الكبيرة', 'أسرع']
    ]},
    { t: 'danger', title: 'مهمل رسمياً', text: '`@import` مهمل وسيُحذف من Sass. لا تستخدمه في أي مشروع جديد. ستجده كثيراً في مشاريع قائمة — والانتقال منه إلى `@use` عملية تدريجية ممكنة.' },
    { t: 'note', text: 'انتبه: `@import` في **CSS الأصلية** شيء مختلف تماماً ولا يزال صالحاً. ما هُجر هو `@import` الخاص بـ Sass.' },

    { t: 'h2', text: 'معمارية 7-1' },
    { t: 'p', text: 'أشهر تنظيم لمشاريع Sass الكبيرة: سبعة مجلدات وملف واحد رئيسي.' },
    { t: 'code', lang: 'text', noCopy: true, code: `
scss/
├── abstracts/     أدوات لا تُنتج CSS: متغيّرات، mixins، دوال
├── base/          إعادة الضبط، الطباعة، القواعد العامة
├── components/    الأزرار، البطاقات، النماذج، التنبيهات
├── layout/        الترويسة، الفوتر، الشبكة، الشريط الجانبي
├── pages/         أنماط خاصة بصفحة بعينها
├── themes/        الوضع الليلي، ثيمات بديلة
├── vendors/       أنماط مكتبات خارجية
└── main.scss` },
    { t: 'code', lang: 'scss', title: 'main.scss', code: `
// 1) الأدوات أولاً — لا تنتج CSS
@use 'abstracts' as *;

// 2) الأساس
@use 'base/reset';
@use 'base/typography';

// 3) التخطيط
@use 'layout/header';
@use 'layout/footer';
@use 'layout/grid';

// 4) المكوّنات
@use 'components/button';
@use 'components/card';
@use 'components/form';

// 5) الصفحات
@use 'pages/home';

// 6) الثيمات
@use 'themes/dark';` },
    { t: 'warn', title: 'ترتيب مهم', text: 'الترتيب يحدّد ترتيب القواعد في ملف CSS الناتج، وبالتالي أي قاعدة تفوز عند تساوي الخصوصية. ضع العام أولاً والخاص أخيراً: reset ← layout ← components ← pages ← themes.' },
    { t: 'tip', text: 'مشروع صغير؟ لا تحتاج سبعة مجلدات. ابدأ بثلاثة: `abstracts` و `base` و `components`، وأضف الباقي عند الحاجة الفعلية.' },

    { t: 'exercise',
      title: 'تمرين: إعادة هيكلة مشروع',
      brief: 'خذ ملف SCSS واحداً كبيراً وقسّمه إلى معمارية منظّمة.',
      requirements: [
        'أنشئ البنية: `abstracts/`، `base/`، `components/`، `layout/`، و`main.scss`.',
        'في `abstracts/`: `_variables.scss` و `_mixins.scss` و `_index.scss` يعيد تصديرهما.',
        '`_variables.scss` فيه 5 متغيّرات على الأقل بـ `!default`.',
        '`_mixins.scss` فيه mixin واحد بسيط (توسيط بـ flexbox مثلاً).',
        'في `base/`: `_reset.scss` و `_typography.scss`.',
        'في `components/`: `_button.scss` و `_card.scss` يستوردان `abstracts` باسم مستعار.',
        'في `layout/`: `_header.scss`.',
        '`main.scss` يستورد كل شيء بالترتيب الصحيح، ويخصّص متغيّراً واحداً بـ `with`.',
        'استخدم `sass:math` مرة واحدة على الأقل.',
        'تأكّد أن الترجمة تنتج ملف CSS واحداً بلا أخطاء.'
      ],
      hints: [
        'ملف `_index.scss` داخل المجلد يتيح `@use "../abstracts"` باسم المجلد فقط.',
        'التخصيص بـ `with` يجب أن يكون في **أول** استيراد للوحدة.',
        'رتّب: abstracts ← base ← layout ← components.'
      ],
      solution: { lang: 'scss', code: `
/* ===== abstracts/_variables.scss ===== */
$color-brand:  #6366f1 !default;
$color-text:   #0f172a !default;
$color-border: #e2e8f0 !default;
$space-4: 16px !default;
$radius:  12px !default;
$bp-md:   768px !default;

/* ===== abstracts/_mixins.scss ===== */
@mixin flex-center($gap: 0) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $gap;
}

@mixin respond-to($bp) {
  @media (min-width: $bp) { @content; }
}

/* ===== abstracts/_index.scss ===== */
@forward 'variables';
@forward 'mixins';

/* ===== base/_reset.scss ===== */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }

/* ===== base/_typography.scss ===== */
@use '../abstracts' as a;
@use 'sass:math';

body {
  font-family: 'Cairo', sans-serif;
  color: a.$color-text;
  line-height: math.div(29px, 16px);
}

/* ===== components/_button.scss ===== */
@use '../abstracts' as a;

.btn {
  @include a.flex-center(8px);
  padding: math.div(a.$space-4, 2) a.$space-4;
  background: a.$color-brand;
  color: #fff;
  border: 0;
  border-radius: a.$radius;
  cursor: pointer;

  &:hover { filter: brightness(.92); }
}

/* ===== components/_card.scss ===== */
@use '../abstracts' as a;

.card {
  border: 1px solid a.$color-border;
  border-radius: a.$radius;
  padding: a.$space-4;

  @include a.respond-to(a.$bp-md) {
    padding: a.$space-4 * 1.5;
  }
}

/* ===== layout/_header.scss ===== */
@use '../abstracts' as a;

.site-header {
  @include a.flex-center(a.$space-4);
  justify-content: space-between;
  padding: a.$space-4;
  border-bottom: 1px solid a.$color-border;
}

/* ===== main.scss ===== */
@use 'abstracts' with ($color-brand: #dd0031);

@use 'base/reset';
@use 'base/typography';
@use 'layout/header';
@use 'components/button';
@use 'components/card';` },
      solutionNote: 'التخصيص `with` في `main.scss` يؤثّر في كل الملفات لأن الوحدة تُحمَّل مرة واحدة فقط.'
    },

    { t: 'quiz', items: [
      { q: 'ما دلالة الشرطة السفلية في اسم الملف؟', options: ['ملف مخفي', 'ملف جزئي يُستورد ولا يُترجَم إلى CSS مستقل', 'ملف قديم', 'ملف خاص'], answer: 1,
        explain: 'الجزئيات تمنع توليد ملفات CSS لا حاجة لها.' },
      { q: 'كيف تصل إلى `$brand` بعد `@use "variables"`؟', options: ['`$brand`', '`variables.$brand`', '`@brand`', '`--brand`'], answer: 1,
        explain: 'البادئة إلزامية مع `@use`، وهي اسم الملف بلا شرطة ولا امتداد.' },
      { q: 'ما الفرق بين `@use` و `@forward`؟', options: ['لا فرق', '`@use` للاستخدام في الملف الحالي و`@forward` لإعادة التصدير لمن يستورد', 'العكس', '`@forward` أقدم'], answer: 1,
        explain: '`@forward` لا يتيح لك استخدام الأعضاء، بل يمرّرها لمن يستورد ملفك.' },
      { q: 'لماذا هُجر `@import` في Sass؟', options: ['بطيء فقط', 'لأنه يجعل كل شيء عالمياً ويكرّر الملفات ويصعّب تتبّع المصدر', 'غير مدعوم', 'لا يقبل جزئيات'], answer: 1,
        explain: '`@use` يوفّر نطاقاً واضحاً وتحميلاً مرة واحدة وتتبّعاً سهلاً.' },
      { q: 'متى تُستخدم `with` لتخصيص وحدة؟', options: ['في كل استيراد', 'مرة واحدة فقط في المشروع لكل وحدة', 'مع الدوال فقط', 'أبداً'], answer: 1,
        explain: 'الوحدة تُحمَّل مرة واحدة؛ التخصيص يكون عند أول استيراد.' }
    ]}
  ]
};
