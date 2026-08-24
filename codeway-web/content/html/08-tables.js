'use strict';

module.exports = {
  slug: '08-tables',
  title: 'الجداول',
  summary: 'بناء جداول بيانات صحيحة ومتاحة للجميع: الرؤوس، التجميع، دمج الخلايا، والتعليق التوضيحي.',
  duration: 50,
  level: 'متوسط',
  tags: ['الجداول', 'البيانات'],
  objectives: [
    'تبني جدولاً بأقسامه الثلاثة: الرأس والجسم والتذييل.',
    'تفرّق بين `<th>` و `<td>` وتستخدم `scope` بشكل صحيح.',
    'تدمج الخلايا أفقياً وعمودياً.',
    'تضيف `<caption>` وتفهم لماذا هو مهم.',
    'تجعل الجدول قابلاً للتمرير على الشاشات الصغيرة.'
  ],
  quickRef: [
    { code: '<table>', desc: 'حاوية الجدول' },
    { code: '<tr>', desc: 'صف (Table Row)' },
    { code: '<th scope="col">', desc: 'خلية رأس لعمود' },
    { code: '<td>', desc: 'خلية بيانات' },
    { code: '<thead> / <tbody> / <tfoot>', desc: 'أقسام الجدول' },
    { code: 'colspan / rowspan', desc: 'دمج خلايا أفقياً / عمودياً' },
    { code: '<caption>', desc: 'عنوان الجدول' }
  ],
  blocks: [
    { t: 'h2', text: 'الجدول للبيانات… فقط' },
    { t: 'p', text: 'في التسعينيات كان المطوّرون يبنون تخطيط الصفحة كله بالجداول لعدم وجود بديل. اليوم هذا **خطأ جسيم**: يربك قارئات الشاشة، ويصعّب التجاوب، ويجعل الكود غير قابل للصيانة. التخطيط وظيفة CSS (Flexbox و Grid).' },
    { t: 'p', text: 'استخدم الجدول فقط حين تكون بياناتك **ثنائية البعد**: لكل قيمة صف وعمود يحدّدان معناها، مثل جدول أسعار أو نتائج مباريات أو مواصفات مقارنة.' },

    { t: 'h2', text: 'أبسط جدول ممكن' },
    { t: 'code', lang: 'html', code: `
<table>
  <tr>
    <th>المنتج</th>
    <th>السعر</th>
  </tr>
  <tr>
    <td>قلم</td>
    <td>5 ريالات</td>
  </tr>
  <tr>
    <td>دفتر</td>
    <td>12 ريالاً</td>
  </tr>
</table>` },
    { t: 'demo', title: 'جدول بلا تنسيق', height: 200,
      css: 'table{border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:8px 14px}th{background:#eef2ff}',
      html: '<table><tr><th>المنتج</th><th>السعر</th></tr><tr><td>قلم</td><td>5 ريالات</td></tr><tr><td>دفتر</td><td>12 ريالاً</td></tr></table>' },
    { t: 'note', text: 'الجدول بلا CSS يظهر بلا حدود. خاصية `border-collapse: collapse` تدمج الحدود المزدوجة بين الخلايا في حد واحد.' },

    { t: 'h2', text: 'الجدول الكامل بأقسامه' },
    { t: 'code', lang: 'html', code: `
<table>
  <caption>مبيعات الربع الأول لعام 2026 (بالريال)</caption>

  <thead>
    <tr>
      <th scope="col">المنتج</th>
      <th scope="col">يناير</th>
      <th scope="col">فبراير</th>
      <th scope="col">مارس</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">أقلام</th>
      <td>1,200</td>
      <td>1,450</td>
      <td>1,300</td>
    </tr>
    <tr>
      <th scope="row">دفاتر</th>
      <td>2,100</td>
      <td>1,900</td>
      <td>2,400</td>
    </tr>
  </tbody>

  <tfoot>
    <tr>
      <th scope="row">الإجمالي</th>
      <td>3,300</td>
      <td>3,350</td>
      <td>3,700</td>
    </tr>
  </tfoot>
</table>` },
    { t: 'demo', title: 'الجدول الكامل', height: 300,
      css: 'table{border-collapse:collapse;width:100%}caption{caption-side:top;text-align:right;font-weight:700;padding-bottom:8px;color:#4f46e5}th,td{border:1px solid #e2e8f0;padding:8px 12px;text-align:right}thead th{background:#4f46e5;color:#fff}tbody th{background:#f1f5f9}tfoot{font-weight:700;background:#eef2ff}',
      html: '<table><caption>مبيعات الربع الأول 2026 (بالريال)</caption><thead><tr><th>المنتج</th><th>يناير</th><th>فبراير</th><th>مارس</th></tr></thead><tbody><tr><th>أقلام</th><td>1,200</td><td>1,450</td><td>1,300</td></tr><tr><th>دفاتر</th><td>2,100</td><td>1,900</td><td>2,400</td></tr></tbody><tfoot><tr><th>الإجمالي</th><td>3,300</td><td>3,350</td><td>3,700</td></tr></tfoot></table>' },

    { t: 'h3', text: 'لماذا الأقسام الثلاثة؟' },
    { t: 'table', head: ['القسم', 'محتواه', 'الفائدة'], rows: [
      ['`<thead>`', 'صف/صفوف الرؤوس', 'يمكن تثبيته عند التمرير، ويتكرر في الطباعة على كل صفحة'],
      ['`<tbody>`', 'صفوف البيانات', 'يمكن أن يتعدّد لتقسيم البيانات لمجموعات'],
      ['`<tfoot>`', 'المجاميع والخلاصات', 'يظهر أسفل الجدول مهما كان موضعه في الكود']
    ]},

    { t: 'h2', text: '`scope`: السمة التي تصنع الفرق للمكفوفين' },
    { t: 'p', text: 'الشخص المبصر يربط الخلية برأس عمودها بنظرة واحدة. قارئ الشاشة يحتاج أن تخبره صراحةً. السمة `scope` على `<th>` تحدّد ما الذي يترأسه هذا الرأس:' },
    { t: 'ul', items: [
      '`scope="col"` — الرأس يخصّ العمود كله (يُستخدم في `<thead>`).',
      '`scope="row"` — الرأس يخصّ الصف كله (العمود الأول من كل صف عادةً).',
      '`scope="colgroup"` / `scope="rowgroup"` — لرأس يمتد فوق مجموعة أعمدة أو صفوف.'
    ]},
    { t: 'p', text: 'النتيجة: عندما يصل القارئ إلى الخلية «1,450» ينطق: «أقلام، فبراير، 1450» — بدلاً من «1450» المجرّدة.' },
    { t: 'warn', text: 'استخدام `<td>` في مكان `<th>` خطأ شائع. الرأس ليس مجرّد خلية عريضة — هو معلومة بنيوية.' },

    { t: 'h2', text: 'دمج الخلايا' },
    { t: 'code', lang: 'html', code: `
<table>
  <tr>
    <th colspan="3">جدول الحصص الأسبوعي</th>
  </tr>
  <tr>
    <th>اليوم</th>
    <th>الحصة الأولى</th>
    <th>الحصة الثانية</th>
  </tr>
  <tr>
    <th rowspan="2">الأحد</th>
    <td>رياضيات</td>
    <td>علوم</td>
  </tr>
  <tr>
    <td>لغة عربية</td>
    <td>حاسب</td>
  </tr>
</table>` },
    { t: 'demo', title: 'colspan و rowspan', height: 250,
      css: 'table{border-collapse:collapse;width:100%}th,td{border:1px solid #cbd5e1;padding:8px;text-align:center}th{background:#eef2ff}',
      html: '<table><tr><th colspan="3">جدول الحصص الأسبوعي</th></tr><tr><th>اليوم</th><th>الحصة الأولى</th><th>الحصة الثانية</th></tr><tr><th rowspan="2">الأحد</th><td>رياضيات</td><td>علوم</td></tr><tr><td>لغة عربية</td><td>حاسب</td></tr></table>' },
    { t: 'tip', text: 'قاعدة العد: إذا دمجت خليتين بـ `colspan="2"` فاحذف خلية واحدة من ذلك الصف. أخطاء الجداول غالباً سببها خلل في هذا العد.' },

    { t: 'h2', text: '`<caption>` — عنوان الجدول' },
    { t: 'p', text: 'يجب أن يكون **أول عنصر** داخل `<table>`. يعلن لقارئ الشاشة ما الذي يحويه الجدول قبل الدخول فيه، ويجعل الجدول مفهوماً عند اقتباسه منفرداً.' },
    { t: 'code', lang: 'html', code: `
<table>
  <caption>نتائج الاختبار النهائي — الفصل الأول 2026</caption>
  …
</table>` },
    { t: 'note', text: 'يمكن تحريك موضعه بصرياً بـ `caption-side: bottom` في CSS، أو إخفاؤه بصرياً مع إبقائه لقارئ الشاشة — لكن **لا تحذفه**.' },

    { t: 'h2', text: 'الجدول على الجوال' },
    { t: 'p', text: 'الجداول العريضة لا تنكمش بلطف. الحل الأبسط والأفضل: لفّ الجدول في حاوية قابلة للتمرير أفقياً.' },
    { t: 'code', lang: 'html', code: `
<div class="table-scroll" tabindex="0" role="region" aria-label="جدول المبيعات">
  <table> … </table>
</div>

<style>
  .table-scroll { overflow-x: auto; }
  .table-scroll table { min-width: 600px; }
</style>` },
    { t: 'p', text: 'إضافة `tabindex="0"` تجعل المنطقة قابلة للتمرير بلوحة المفاتيح أيضاً — تفصيلة صغيرة تصنع فرقاً كبيراً في إمكانية الوصول.' },

    { t: 'h2', text: 'أخطاء شائعة' },
    { t: 'compare', lang: 'html', bad: {
      code: '<table>\n  <tr>\n    <td>القائمة الجانبية</td>\n    <td>المحتوى الرئيسي</td>\n  </tr>\n</table>',
      why: 'استخدام الجدول للتخطيط. قارئ الشاشة سيعلن «جدول بصفّ وعمودين» لمحتوى ليس جدولاً أصلاً.'
    }, good: {
      code: '<div class="layout">\n  <aside>القائمة الجانبية</aside>\n  <main>المحتوى الرئيسي</main>\n</div>\n\n<!-- التخطيط في CSS عبر Grid أو Flexbox -->',
      why: 'عناصر دلالية صحيحة، والتخطيط في مكانه الطبيعي: CSS.'
    }},
    { t: 'ul', items: [
      'نسيان `<caption>` فيبقى الجدول مجهول الموضوع.',
      'استخدام `<td>` للرؤوس بدل `<th>`.',
      'إهمال `scope` في الجداول متعدّدة الأبعاد.',
      'خطأ في عد الخلايا بعد الدمج فيختلّ الجدول.',
      'استخدام سمات العرض القديمة `border` و `cellpadding` بدل CSS.'
    ]},

    { t: 'exercise',
      title: 'تمرين: جدول مقارنة باقات',
      brief: 'ابنِ جدولاً يقارن ثلاث باقات اشتراك في خدمة ما.',
      requirements: [
        '`<caption>` يوضّح موضوع الجدول.',
        '`<thead>` فيه أسماء الباقات مع `scope="col"`.',
        '`<tbody>` فيه خمس ميزات على الأقل، وعمود الميزات بـ `<th scope="row">`.',
        '`<tfoot>` يعرض السعر الشهري لكل باقة.',
        'صف عنوان علوي مدموج بـ `colspan` يحمل عنوان المجموعة.',
        'لفّ الجدول في حاوية قابلة للتمرير أفقياً.'
      ],
      hints: [
        'إن كان لديك 4 أعمدة، فالصف المدموج يحتاج `colspan="4"` وخلية واحدة فقط.',
        '`<caption>` أول عنصر داخل `<table>` وليس قبله.',
        'استخدم ✓ و ✗ كنص داخل الخلايا مع نص بديل مفهوم عند الحاجة.'
      ],
      solution: { lang: 'html', code: `
<div style="overflow-x:auto" tabindex="0" role="region" aria-label="مقارنة الباقات">
  <table>
    <caption>مقارنة باقات الاشتراك — 2026</caption>

    <thead>
      <tr>
        <th colspan="4">الباقات المتاحة</th>
      </tr>
      <tr>
        <th scope="col">الميزة</th>
        <th scope="col">المجانية</th>
        <th scope="col">الاحترافية</th>
        <th scope="col">الشركات</th>
      </tr>
    </thead>

    <tbody>
      <tr><th scope="row">عدد المشاريع</th><td>3</td><td>50</td><td>غير محدود</td></tr>
      <tr><th scope="row">المساحة</th><td>1 جيجا</td><td>50 جيجا</td><td>1 تيرا</td></tr>
      <tr><th scope="row">نطاق مخصّص</th><td>✗</td><td>✓</td><td>✓</td></tr>
      <tr><th scope="row">دعم فني</th><td>بريد</td><td>بريد ودردشة</td><td>مدير حساب</td></tr>
      <tr><th scope="row">تقارير متقدّمة</th><td>✗</td><td>✗</td><td>✓</td></tr>
    </tbody>

    <tfoot>
      <tr>
        <th scope="row">السعر الشهري</th>
        <td>0 ريال</td>
        <td>49 ريالاً</td>
        <td>199 ريالاً</td>
      </tr>
    </tfoot>
  </table>
</div>` } },

    { t: 'quiz', items: [
      { q: 'ما وظيفة السمة `scope`؟', options: ['تحديد عرض العمود', 'إخبار التقنيات المساعدة بما يترأسه هذا الرأس: عمود أم صف', 'دمج الخلايا', 'تلوين الرأس'], answer: 1,
        explain: 'بدونها لا يستطيع قارئ الشاشة ربط الخلية برأسها، فينطق الأرقام مجرّدة عن معناها.' },
      { q: 'أين يوضع `<caption>`؟', options: ['قبل `<table>`', 'أول عنصر داخل `<table>`', 'داخل `<thead>`', 'بعد `<tfoot>`'], answer: 1,
        explain: 'يجب أن يكون أول أبناء `<table>`؛ موضعه البصري يُتحكّم به عبر `caption-side` في CSS.' },
      { q: 'إذا دمجت خليتين في صف بـ `colspan="2"` فماذا يجب أن تفعل؟', options: ['تضيف خلية إضافية', 'تحذف خلية واحدة من ذلك الصف', 'لا شيء', 'تستخدم rowspan أيضاً'], answer: 1,
        explain: 'الخلية المدموجة تشغل مكان خليتين، فيجب أن ينقص عدد الخلايا المكتوبة في الصف بواحدة.' },
      { q: 'لماذا يُمنع بناء تخطيط الصفحة بالجداول؟', options: ['لأنها بطيئة فقط', 'لأنها تربك قارئات الشاشة وتصعّب التجاوب والصيانة', 'لأن المتصفحات لا تدعمها', 'لأنها تستهلك ذاكرة'], answer: 1,
        explain: 'الجدول يحمل معنى «بيانات ثنائية البعد»؛ استخدامه للتخطيط يعطي معنى خاطئاً ويعقّد كل شيء.' },
      { q: 'ما الحل الأنسب لجدول عريض على الجوال؟', options: ['تصغير الخط جداً', 'لفّه في حاوية `overflow-x: auto`', 'حذف بعض الأعمدة', 'تحويله إلى صورة'], answer: 1,
        explain: 'التمرير الأفقي يحفظ كل البيانات ويبقيها متاحة، مع إضافة `tabindex="0"` لدعم لوحة المفاتيح.' }
    ]}
  ]
};
