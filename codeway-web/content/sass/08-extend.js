'use strict';

module.exports = {
  slug: '08-extend',
  title: 'الوراثة @extend والعناصر النائبة',
  summary: 'مشاركة الأنماط بدمج المحدّدات، والفرق الحاسم بينها وبين mixin، ولماذا تُستخدم بحذر.',
  duration: 35,
  level: 'متوسط',
  tags: ['extend', 'الوراثة'],
  objectives: [
    'تستخدم `@extend` لمشاركة الأنماط.',
    'تعرّف عناصر نائبة بـ `%`.',
    'تفرّق بين `@extend` و mixin في الناتج.',
    'تدرك المشكلات التي يسبّبها `@extend`.',
    'تختار الأداة المناسبة لكل حالة.'
  ],
  quickRef: [
    { code: '@extend .class', desc: 'وراثة أنماط صنف' },
    { code: '%placeholder', desc: 'عنصر نائب لا يُطبَع' },
    { code: '@extend %name', desc: 'وراثة عنصر نائب' },
    { code: '@extend .x !optional', desc: 'لا يفشل إن لم يوجد' }
  ],
  blocks: [
    { t: 'h2', text: 'الفكرة' },
    { t: 'p', text: 'بدل نسخ الأنماط كما يفعل mixin، يدمج `@extend` **المحدّدات** في قاعدة واحدة مشتركة. الناتج أقلّ تكراراً.' },
    { t: 'code', lang: 'scss', code: `
.message {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid;
}

.message-success {
  @extend .message;
  background: #ecfdf5;
  border-color: #10b981;
}

.message-error {
  @extend .message;
  background: #fef2f2;
  border-color: #ef4444;
}` },
    { t: 'code', lang: 'css', title: 'الناتج', code: `
.message,
.message-success,
.message-error {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid;
}

.message-success {
  background: #ecfdf5;
  border-color: #10b981;
}

.message-error {
  background: #fef2f2;
  border-color: #ef4444;
}` },
    { t: 'p', text: 'لاحظ: الأنماط المشتركة كُتبت **مرة واحدة** وأُضيفت المحدّدات إليها. هذا هو الفرق الجوهري عن mixin.' },

    { t: 'h2', text: 'العناصر النائبة `%`' },
    { t: 'p', text: 'مشكلة المثال السابق: صنف `.message` يظهر في الناتج حتى لو لم تستخدمه في HTML إطلاقاً. العنصر النائب يحلّ ذلك: يُعرَّف بـ `%` و**لا يُطبَع أبداً** إلا حين يرثه أحد.' },
    { t: 'code', lang: 'scss', code: `
%message-base {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid;
  font-weight: 600;
}

.message-success {
  @extend %message-base;
  background: #ecfdf5;
  border-color: #10b981;
}

.message-error {
  @extend %message-base;
  background: #fef2f2;
  border-color: #ef4444;
}` },
    { t: 'code', lang: 'css', title: 'الناتج — لا أثر لـ %message-base', code: `
.message-success,
.message-error {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid;
  font-weight: 600;
}

.message-success { background: #ecfdf5; border-color: #10b981; }
.message-error   { background: #fef2f2; border-color: #ef4444; }` },
    { t: 'demo', title: 'رسائل ترث قاعدة واحدة', height: 200,
      css: '.m{padding:14px 18px;border-radius:10px;border:1px solid;font-weight:600;margin-bottom:8px}.s{background:#ecfdf5;border-color:#10b981;color:#047857}.e{background:#fef2f2;border-color:#ef4444;color:#b91c1c}.w{background:#fffbeb;border-color:#f59e0b;color:#b45309}',
      html: '<div class="m s">تم الحفظ بنجاح.</div><div class="m e">فشل الاتصال بالخادم.</div><div class="m w">انتبه: البيانات غير محفوظة.</div>' },
    { t: 'tip', text: 'إن استخدمت `@extend` أصلاً، فاستخدمه مع العناصر النائبة دائماً — لا مع الأصناف العادية. هذا يمنع تسرّب أصناف لا تستخدمها إلى ملفك النهائي.' },

    { t: 'h2', text: '`@extend` مقابل mixin' },
    { t: 'table', head: ['الوجه', '`@extend`', 'mixin'], rows: [
      ['الناتج', 'يدمج المحدّدات', 'ينسخ الإعلانات'],
      ['حجم CSS قبل الضغط', 'أصغر', 'أكبر'],
      ['حجم CSS بعد gzip', 'متقارب جداً', 'متقارب جداً'],
      ['المعاملات', '**لا يدعمها**', 'يدعمها'],
      ['داخل استعلام وسائط', '**لا يعمل عبر الحدود**', 'يعمل دائماً'],
      ['ترتيب المصدر', 'قد يتغيّر بشكل مفاجئ', 'متوقّع تماماً'],
      ['قابلية التنبّؤ', 'منخفضة', '**عالية**']
    ]},
    { t: 'code', lang: 'scss', title: 'نفس الغرض بالطريقتين', code: `
// بـ mixin
@mixin message-base {
  padding: 16px;
  border-radius: 10px;
}
.msg-a { @include message-base; background: #eee; }
.msg-b { @include message-base; background: #ddd; }

// النتيجة: تكرار الإعلانات في القاعدتين

// بـ extend
%message-base {
  padding: 16px;
  border-radius: 10px;
}
.msg-a { @extend %message-base; background: #eee; }
.msg-b { @extend %message-base; background: #ddd; }

// النتيجة: قاعدة واحدة بمحدّدَين` },

    { t: 'h2', text: 'مشكلات `@extend`' },
    { t: 'h3', text: '1. لا يعمل عبر استعلامات الوسائط' },
    { t: 'code', lang: 'scss', code: `
%base { padding: 16px; }

@media (min-width: 768px) {
  .card {
    @extend %base;   // ❌ خطأ ترجمة
  }
}` },
    { t: 'danger', text: 'رسالة الخطأ: `You may not @extend selectors across media queries`. السبب أن الدمج يحدث على مستوى المحدّدات، والمحدّد داخل استعلام وسائط في سياق مختلف. الحل الوحيد: استخدم mixin.' },

    { t: 'h3', text: '2. انفجار المحدّدات' },
    { t: 'code', lang: 'scss', code: `
.a .b .c { color: red; }
.x .y .z { @extend .c; }

// الناتج: كل التوافيق الممكنة
// .a .b .c, .a .b .x .y .z, .x .y .a .b .z, … ` },
    { t: 'warn', text: 'مع محدّدات متداخلة، قد يولّد `@extend` عشرات المحدّدات المركّبة التي لا تحتاجها — فينتفخ الملف بدل أن يصغر، وهو عكس الهدف.' },

    { t: 'h3', text: '3. تغيّر ترتيب المصدر' },
    { t: 'code', lang: 'scss', code: `
.btn { color: blue; }

.card {
  color: green;
}

.special {
  @extend .btn;   // ينتقل مع .btn إلى موضعها في الملف
}` },
    { t: 'p', text: 'المحدّد ينتقل إلى موضع القاعدة الموروثة في الملف، لا حيث كتبته. هذا يغيّر ترتيب التتالي وقد يجعل قاعدة كنت تتوقّع فوزها تخسر.' },

    { t: 'h3', text: '4. `!optional`' },
    { t: 'code', lang: 'scss', code: `
.card {
  @extend %maybe-missing !optional;   // لا يفشل إن لم يوجد
}` },
    { t: 'p', text: 'بدونها تفشل الترجمة إن كان المحدّد المورَّث غير موجود. مفيدة في المكتبات التي قد لا تُحمَّل كل أجزائها.' },

    { t: 'h2', text: 'متى تستخدم كلاً منهما؟' },
    { t: 'features', items: [
      { icon: 'check', title: 'استخدم %placeholder', text: 'أنماط متطابقة تماماً بلا معاملات، بين عناصر متقاربة دلالياً، في نفس السياق.' },
      { icon: 'refresh', title: 'استخدم mixin', text: 'تحتاج معاملات، أو تعمل داخل استعلام وسائط، أو تريد نتيجة متوقّعة تماماً.' },
      { icon: 'x', title: 'لا تستخدم @extend', text: 'مع أصناف عادية، أو عبر ملفات متباعدة، أو داخل محدّدات متداخلة عميقة.' }
    ]},
    { t: 'note', title: 'رأي شائع في المجتمع', text: 'كثير من الفرق **تمنع `@extend` كلياً** وتكتفي بالـ mixins. السبب: مع ضغط gzip يكاد الفرق في الحجم يختفي، بينما مشكلات التنبّؤ تبقى. إن كنت متردّداً، اختر mixin — لن تندم.' },

    { t: 'h2', text: 'حالة استخدام جيدة' },
    { t: 'code', lang: 'scss', title: 'عناصر متقاربة في نفس الملف', code: `
%input-base {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  background: #fff;

  &:focus-visible {
    outline: 3px solid #a5b4fc;
    border-color: #6366f1;
  }

  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
  }
}

.input    { @extend %input-base; }
.textarea { @extend %input-base; min-height: 120px; resize: vertical; }
.select   { @extend %input-base; appearance: none; }` },
    { t: 'demo', title: 'حقول ترث قاعدة واحدة', height: 260,
      css: 'input,textarea,select{width:100%;max-width:320px;padding:10px 14px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;font-size:1rem;background:#fff;margin-bottom:10px;display:block}textarea{min-height:80px;resize:vertical}',
      html: '<input type="text" placeholder="حقل نصي"><textarea placeholder="منطقة نص"></textarea><select><option>قائمة اختيار</option></select>' },
    { t: 'p', text: 'هذه حالة مثالية: ثلاثة عناصر متقاربة دلالياً، في نفس الملف، بأنماط متطابقة بلا معاملات، خارج أي استعلام وسائط.' },

    { t: 'exercise',
      title: 'تمرين: نظام تنبيهات وحقول',
      brief: 'ابنِ نظام تنبيهات بعناصر نائبة، ثم أعد بناءه بـ mixins وقارن الناتجين.',
      requirements: [
        'عنصر نائب `%alert-base` فيه الأنماط المشتركة.',
        'أربعة أصناف تنبيه ترثه: نجاح، خطأ، تحذير، معلومة.',
        'عنصر نائب `%visually-hidden` واستخدمه في صنفين.',
        'عنصر نائب `%input-base` وثلاثة عناصر ترثه.',
        'اكتب النسخة نفسها بـ mixins في ملف منفصل.',
        'ترجم الملفين وقارن حجميهما وعدد القواعد.',
        'حاول استخدام `@extend` داخل استعلام وسائط ووثّق رسالة الخطأ في تعليق.',
        'اكتب في تعليق أي النهجين تفضّل ولماذا.'
      ],
      hints: [
        'العنصر النائب لا يظهر في الناتج إلا إن ورثه أحد.',
        'قارن الحجم قبل وبعد الضغط: `gzip -c style.css | wc -c`.',
        'الخطأ المتوقّع: `You may not @extend selectors across media queries`.'
      ],
      solution: { lang: 'scss', code: `
/* ===== النهج الأول: عناصر نائبة ===== */

%alert-base {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 10px;
  border: 1px solid;
  font-weight: 600;
  margin-bottom: 12px;
}

.alert-success { @extend %alert-base; background: #ecfdf5; border-color: #10b981; color: #047857; }
.alert-error   { @extend %alert-base; background: #fef2f2; border-color: #ef4444; color: #b91c1c; }
.alert-warning { @extend %alert-base; background: #fffbeb; border-color: #f59e0b; color: #b45309; }
.alert-info    { @extend %alert-base; background: #f0f9ff; border-color: #0ea5e9; color: #0369a1; }

%visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.sr-only    { @extend %visually-hidden; }
.skip-label { @extend %visually-hidden; }

%input-base {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;

  &:focus-visible {
    outline: 3px solid #a5b4fc;
    border-color: #6366f1;
  }
}

.input    { @extend %input-base; }
.textarea { @extend %input-base; min-height: 120px; resize: vertical; }
.select   { @extend %input-base; appearance: none; }

/*
  محاولة فاشلة عمداً — رسالة الخطأ:
  "You may not @extend selectors across media queries."

  @media (min-width: 768px) {
    .alert-lg { @extend %alert-base; }
  }

  الحل: استخدم mixin بدلاً منه.
*/

/* ===== النهج الثاني: mixins ===== */

@mixin alert-base {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 10px;
  border: 1px solid;
  font-weight: 600;
  margin-bottom: 12px;
}

@mixin alert($bg, $border, $text) {
  @include alert-base;
  background: $bg;
  border-color: $border;
  color: $text;
}

.m-alert-success { @include alert(#ecfdf5, #10b981, #047857); }
.m-alert-error   { @include alert(#fef2f2, #ef4444, #b91c1c); }

// هذه تعمل بلا مشكلة داخل استعلام وسائط
@media (min-width: 768px) {
  .m-alert-lg { @include alert-base; padding: 20px 28px; }
}

/*
  الخلاصة:
  النهج الأول أصغر في الناتج الخام، لكن النهج الثاني
  أكثر مرونة (يقبل معاملات) ويعمل داخل استعلامات الوسائط،
  والفرق في الحجم بعد gzip ضئيل جداً.
  التفضيل: mixins للمرونة والتنبّؤ، مع %placeholder
  في الحالات المتطابقة تماماً داخل الملف الواحد.
*/` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق الجوهري بين `@extend` و mixin في الناتج؟', options: ['لا فرق', '`@extend` يدمج المحدّدات وmixin ينسخ الإعلانات', 'العكس', '`@extend` أبطأ'], answer: 1,
        explain: 'الدمج يعطي قاعدة واحدة بعدة محدّدات؛ النسخ يكرّر الإعلانات.' },
      { q: 'لماذا نستخدم `%placeholder` بدل صنف عادي مع `@extend`؟', options: ['أسرع', 'لأنه لا يظهر في الناتج إلا إن ورثه أحد', 'أوضح فقط', 'لا فرق'], answer: 1,
        explain: 'الصنف العادي يُطبَع حتى لو لم تستخدمه في HTML.' },
      { q: 'ماذا يحدث عند `@extend` داخل استعلام وسائط؟', options: ['يعمل عادياً', 'خطأ ترجمة — لا يمكن الوراثة عبر حدود الوسائط', 'يُتجاهل', 'ينسخ الأنماط'], answer: 1,
        explain: 'القيد بنيوي في آلية دمج المحدّدات؛ البديل mixin.' },
      { q: 'ما خطر `@extend` مع المحدّدات المتداخلة؟', options: ['بطء', 'توليد عشرات المحدّدات المركّبة غير المطلوبة', 'خطأ صياغة', 'لا خطر'], answer: 1,
        explain: 'انفجار التوافيق قد ينتفخ بالملف بدل تصغيره.' },
      { q: 'متى تكون mixin الخيار الأصوب؟', options: ['دائماً تقريباً وخصوصاً مع المعاملات أو داخل الوسائط', 'أبداً', 'مع الألوان فقط', 'في المشاريع الصغيرة'], answer: 0,
        explain: 'المرونة وقابلية التنبّؤ تجعلانها الخيار الافتراضي الآمن.' }
    ]}
  ]
};
