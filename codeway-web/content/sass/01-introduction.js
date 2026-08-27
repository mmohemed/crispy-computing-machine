'use strict';

module.exports = {
  slug: '01-introduction',
  title: 'مقدمة في Sass والإعداد',
  summary: 'ما هو معالج CSS ولماذا تحتاجه، والفرق بين SCSS و Sass، وكيف تشغّله في مشروعك.',
  duration: 35,
  level: 'مبتدئ',
  tags: ['مقدمة', 'الإعداد'],
  objectives: [
    'تشرح ما هو معالج CSS ولماذا وُجد.',
    'تفرّق بين صيغتَي SCSS و Sass.',
    'تثبّت Sass وتشغّل المترجم.',
    'تفهم علاقة ملف المصدر بملف الناتج.',
    'تربط الناتج بصفحتك بشكل صحيح.'
  ],
  quickRef: [
    { code: 'npm i -D sass', desc: 'تثبيت المترجم' },
    { code: 'npx sass in.scss out.css', desc: 'ترجمة مرة واحدة' },
    { code: 'npx sass --watch src:dist', desc: 'مراقبة التغييرات' },
    { code: '.scss', desc: 'الصيغة الشائعة (أقواس وفواصل)' },
    { code: '.sass', desc: 'الصيغة القديمة (مسافات بادئة)' },
    { code: '// تعليق', desc: 'تعليق لا يظهر في الناتج' }
  ],
  blocks: [
    { t: 'h2', text: 'ما المشكلة؟' },
    { t: 'p', text: 'CSS لغة ممتازة لكنها صُمّمت للبساطة. في مشروع من عشرة آلاف سطر تظهر آلامها بوضوح:' },
    { t: 'ul', items: [
      '**تكرار القيم**: تكتب `#6366f1` في أربعين مكاناً، ثم يطلب العميل تغيير اللون.',
      '**تكرار المحدّدات**: `.card .header .title` و `.card .header .subtitle` و…',
      '**لا دوال**: تحسب الظلال والتدرّجات يدوياً في كل مرة.',
      '**ملف واحد ضخم**: أو ملفات كثيرة تعني طلبات كثيرة.',
      '**لا منطق**: توليد 12 صنف شبكة يعني كتابة 12 قاعدة يدوياً.'
    ]},
    { t: 'p', text: '**Sass** يحلّ هذا: لغة فوق CSS تضيف المتغيّرات والدوال والتداخل والمنطق، ثم **تُترجَم** إلى CSS عادية يفهمها كل متصفح.' },
    { t: 'demo', title: 'من Sass إلى CSS', height: 300,
      css: '.g{display:grid;gap:10px}.b{border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}.h{padding:8px 12px;font-weight:700;font-size:.85em}.s{background:#fce7f3;color:#be185d}.c{background:#dbeafe;color:#1e40af}pre{margin:0;padding:12px;background:#0f1729;color:#e2e8f0;direction:ltr;text-align:left;font-family:monospace;font-size:.82em;line-height:1.8;overflow-x:auto}',
      html: '<div class="g"><div class="b"><div class="h s">style.scss — ما تكتبه</div><pre>$brand: #6366f1;\n\n.card {\n  border: 1px solid $brand;\n  .title { color: $brand; }\n}</pre></div><div class="b"><div class="h c">style.css — ما يُولَّد</div><pre>.card {\n  border: 1px solid #6366f1;\n}\n.card .title {\n  color: #6366f1;\n}</pre></div></div>' },

    { t: 'h2', text: 'ما الذي يضيفه Sass؟' },
    { t: 'features', items: [
      { icon: 'sliders', title: 'المتغيّرات', text: 'خزّن الألوان والمسافات والخطوط في أسماء واضحة وغيّرها من مكان واحد.' },
      { icon: 'layers', title: 'التداخل', text: 'اكتب المحدّدات متداخلة كما تتداخل عناصر HTML — أوضح وأقصر.' },
      { icon: 'refresh', title: 'الـ Mixins', text: 'كتل قابلة لإعادة الاستخدام تقبل معاملات، مثل الدوال.' },
      { icon: 'box', title: 'التقسيم', text: 'قسّم أنماطك إلى ملفات صغيرة تُدمَج في ملف واحد عند الترجمة.' },
      { icon: 'cpu', title: 'المنطق', text: 'شروط وحلقات لتوليد الأنماط المتكرّرة آلياً.' },
      { icon: 'zap', title: 'الدوال', text: 'دوال جاهزة للألوان والرياضيات والنصوص والقوائم.' }
    ]},
    { t: 'note', title: 'ماذا عن متغيّرات CSS الأصلية؟', text: 'CSS الحديثة فيها متغيّرات (`--color`) وهي رائعة لأنها تعمل **وقت التشغيل** فتصلح للثيمات. لكن Sass يعمل **وقت البناء** ويقدّم ما لا تقدّمه CSS: الحلقات والشروط والدوال والتقسيم. الاثنان يكمّلان بعضهما، ولا يلغي أحدهما الآخر.' },

    { t: 'h2', text: 'SCSS أم Sass؟' },
    { t: 'p', text: 'للغة صيغتان مختلفتان في الشكل ومتطابقتان في القدرات:' },
    { t: 'code', lang: 'scss', title: 'صيغة SCSS (امتداد .scss)', code: `
$brand: #6366f1;

.card {
  padding: 20px;
  border: 1px solid $brand;

  .title {
    color: $brand;
    font-weight: 700;
  }
}` },
    { t: 'code', lang: 'text', title: 'صيغة Sass المسافات (امتداد .sass)', noCopy: true, code: `
$brand: #6366f1

.card
  padding: 20px
  border: 1px solid $brand

  .title
    color: $brand
    font-weight: 700` },
    { t: 'table', head: ['الوجه', 'SCSS', 'Sass'], rows: [
      ['الامتداد', '`.scss`', '`.sass`'],
      ['الأقواس والفواصل', 'موجودة', 'محذوفة — المسافات البادئة تحدّد البنية'],
      ['توافق مع CSS', '**كل ملف CSS صالح هو SCSS صالح**', 'لا'],
      ['الانتشار', 'الأغلبية الساحقة', 'قليل'],
      ['الأنسب للمبتدئ', '**نعم**', 'لا']
    ]},
    { t: 'tip', text: 'استخدم **SCSS**. ميزته الحاسمة أنك تستطيع نسخ أي كود CSS ولصقه كما هو فيعمل مباشرة — فالانتقال تدريجي بلا ألم. هذا المسار كله يستخدم SCSS.' },

    { t: 'h2', text: 'التثبيت والتشغيل' },
    { t: 'code', lang: 'bash', title: 'داخل مشروعك', code: `
# 1) تهيئة المشروع إن لم يكن مهيّأً
npm init -y

# 2) تثبيت Sass كاعتمادية تطوير
npm install --save-dev sass

# 3) ترجمة مرة واحدة
npx sass src/scss/main.scss dist/css/style.css

# 4) المراقبة: يعيد الترجمة عند كل حفظ
npx sass --watch src/scss:dist/css

# 5) نسخة مضغوطة للإنتاج
npx sass src/scss/main.scss dist/css/style.min.css --style=compressed --no-source-map` },
    { t: 'code', lang: 'json', title: 'package.json — اختصر الأوامر', code: `
{
  "scripts": {
    "css": "sass src/scss:dist/css",
    "css:watch": "sass --watch src/scss:dist/css",
    "css:build": "sass src/scss/main.scss dist/css/style.css --style=compressed --no-source-map"
  }
}` },
    { t: 'p', text: 'ثم تشغّلها بـ `npm run css:watch` أثناء التطوير و `npm run css:build` قبل النشر.' },
    { t: 'note', text: 'أدوات البناء الحديثة (**Vite** و **Next.js** و **Angular CLI**) تدعم Sass تلقائياً: يكفي تثبيت الحزمة واستيراد ملف `.scss`، وتتكفّل الأداة بالترجمة.' },

    { t: 'h2', text: 'الربط بالصفحة' },
    { t: 'danger', title: 'اربط الناتج لا المصدر', text: 'المتصفح **لا يفهم** `.scss` إطلاقاً. الرابط يجب أن يشير دائماً إلى ملف `.css` المولَّد.' },
    { t: 'compare', lang: 'html', bad: {
      code: '<link rel="stylesheet" href="src/scss/main.scss">',
      why: 'المتصفح سيحمّل ملفاً نصياً لا يفهمه، فلن يُطبَّق أي تنسيق.'
    }, good: {
      code: '<link rel="stylesheet" href="dist/css/style.css">',
      why: 'الملف المترجَم هو ما يفهمه المتصفح.'
    }},

    { t: 'h2', text: 'بنية مشروع نموذجية' },
    { t: 'code', lang: 'text', noCopy: true, code: `
my-project/
├── index.html
├── package.json
├── src/
│   └── scss/
│       ├── abstracts/
│       │   ├── _variables.scss
│       │   ├── _mixins.scss
│       │   └── _functions.scss
│       ├── base/
│       │   ├── _reset.scss
│       │   └── _typography.scss
│       ├── components/
│       │   ├── _button.scss
│       │   └── _card.scss
│       ├── layout/
│       │   ├── _header.scss
│       │   └── _grid.scss
│       └── main.scss          ← الملف الوحيد الذي يُترجَم
└── dist/
    └── css/
        └── style.css          ← الناتج` },
    { t: 'warn', title: 'ما معنى الشرطة السفلية؟', text: 'الملف الذي يبدأ اسمه بـ `_` يُسمّى **جزئياً** (Partial): لا يُترجَم إلى ملف CSS مستقل، بل يُستورد داخل ملف آخر. هذا يمنع توليد عشرات الملفات غير المرغوبة.' },
    { t: 'code', lang: 'scss', title: 'main.scss', code: `
@use 'abstracts/variables';
@use 'abstracts/mixins';
@use 'base/reset';
@use 'base/typography';
@use 'layout/header';
@use 'components/button';
@use 'components/card';` },
    { t: 'p', text: 'لاحظ: لا تكتب الشرطة السفلية ولا الامتداد عند الاستيراد. Sass يعرفهما.' },

    { t: 'h2', text: 'التعليقات' },
    { t: 'code', lang: 'scss', code: `
// تعليق سطر واحد — لا يظهر في ملف CSS الناتج

/* تعليق CSS عادي — يظهر في الناتج */

/*! تعليق محفوظ — يبقى حتى في النسخة المضغوطة */` },
    { t: 'tip', text: 'استخدم `//` لملاحظاتك التطويرية (فلا تثقل الملف النهائي)، و`/* */` للمعلومات التي تريد بقاءها كحقوق المكتبة.' },

    { t: 'h2', text: 'خرائط المصدر (Source Maps)' },
    { t: 'p', text: 'حين تفحص عنصراً في أدوات المطوّر ستجد الأنماط في ملف `.css` المولَّد — وهذا لا يفيدك. خريطة المصدر تربط كل قاعدة بموضعها الأصلي في ملف `.scss`، فتظهر لك أدوات المطوّر «هذه القاعدة من `_button.scss` السطر 24».' },
    { t: 'code', lang: 'bash', code: `
# خرائط المصدر مفعّلة افتراضياً في التطوير
npx sass --watch src/scss:dist/css

# عطّلها في الإنتاج لتقليل الحجم
npx sass src/scss/main.scss dist/css/style.css --no-source-map --style=compressed` },

    { t: 'exercise',
      title: 'تمرين: أول مشروع Sass',
      brief: 'جهّز مشروعاً وشغّل المترجم وتأكّد من أن التغييرات تنعكس فوراً.',
      requirements: [
        'أنشئ مجلداً جديداً وهيّئ `package.json` وثبّت `sass` كاعتمادية تطوير.',
        'أنشئ `src/scss/main.scss` و `index.html` و مجلد `dist/css`.',
        'أضف أوامر `css:watch` و `css:build` في `package.json`.',
        'في `main.scss` عرّف متغيّراً واحداً للون واستخدمه في قاعدتين مختلفتين.',
        'شغّل المراقبة وغيّر قيمة المتغيّر ولاحظ تحديث ملف CSS تلقائياً.',
        'اربط ملف CSS المولَّد بصفحة HTML وتأكّد من ظهور التنسيق.',
        'أنشئ ملفاً جزئياً `_variables.scss` وانقل إليه المتغيّر واستورده بـ `@use`.',
        'شغّل أمر البناء المضغوط وقارن حجم الملفين.'
      ],
      hints: [
        'الملف الجزئي يبدأ بـ `_` ولا تكتب الشرطة ولا الامتداد عند الاستيراد.',
        '`@use` يجب أن تكون في أعلى الملف قبل أي قاعدة.',
        'إن لم يعمل التنسيق تحقّق من مسار `href` — يجب أن يشير إلى `.css`.'
      ],
      solution: { lang: 'scss', title: 'src/scss/main.scss', code: `
@use 'variables' as v;

body {
  font-family: 'Cairo', sans-serif;
  background: #f6f7fb;
  color: #0f172a;
  padding: 40px;
}

.btn {
  display: inline-block;
  padding: 12px 28px;
  border-radius: 99px;
  background: v.$brand;
  color: #fff;
  text-decoration: none;
}

.title {
  color: v.$brand;
  font-size: 2rem;
}` },
      solutionNote: 'محتوى `_variables.scss`: `$brand: #6366f1;` — وأمر التشغيل: `npm run css:watch`.'
    },

    { t: 'quiz', items: [
      { q: 'ماذا يفعل Sass بالضبط؟', options: ['يعمل في المتصفح مباشرة', 'يُترجَم إلى CSS عادية قبل الوصول للمتصفح', 'يستبدل CSS', 'يضغط الصور'], answer: 1,
        explain: 'معالج يعمل وقت البناء؛ المتصفح لا يرى إلا CSS النهائية.' },
      { q: 'لماذا يُنصح المبتدئ بصيغة SCSS؟', options: ['أسرع', 'لأن أي كود CSS صالح هو SCSS صالح، فالانتقال تدريجي', 'أقصر', 'أحدث'], answer: 1,
        explain: 'التوافق الكامل مع CSS يجعل التعلّم متدرّجاً بلا إعادة كتابة.' },
      { q: 'ما دلالة الشرطة السفلية في `_variables.scss`؟', options: ['ملف مخفي', 'ملف جزئي لا يُترجَم إلى CSS مستقل بل يُستورد', 'ملف قديم', 'ملف اختبار'], answer: 1,
        explain: 'الجزئيات تمنع توليد ملفات CSS لا حاجة لها.' },
      { q: 'ماذا تربط في `<link>` في صفحة HTML؟', options: ['ملف .scss', 'ملف .css المولَّد', 'كليهما', 'لا شيء'], answer: 1,
        explain: 'المتصفح لا يفهم SCSS؛ يجب ربط الناتج المترجَم.' },
      { q: 'ما الفرق بين `//` و `/* */` في Sass؟', options: ['لا فرق', '`//` لا تظهر في CSS الناتجة و`/* */` تظهر', 'العكس', '`//` غير مدعومة'], answer: 1,
        explain: 'تعليقات السطر تُحذف عند الترجمة، وتعليقات CSS تبقى.' }
    ]}
  ]
};
