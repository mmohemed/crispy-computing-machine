'use strict';

module.exports = {
  slug: '18-modern-html',
  title: 'عناصر HTML الحديثة',
  summary: 'عناصر تغنيك عن مكتبات كاملة: dialog و details و template و progress و canvas و SVG المضمّن.',
  duration: 45,
  level: 'متقدم',
  tags: ['حديث', 'تفاعل'],
  objectives: [
    'تبني نافذة منبثقة أصلية بـ `<dialog>`.',
    'تنشئ عناصر طيّ وأكورديون بلا جافاسكربت.',
    'تستخدم `<template>` لقوالب قابلة للاستنساخ.',
    'تعرض التقدّم والقياسات بـ `<progress>` و `<meter>`.',
    'تعرف متى تستخدم Canvas ومتى SVG.'
  ],
  quickRef: [
    { code: '<dialog> + showModal()', desc: 'نافذة منبثقة أصلية' },
    { code: '<details><summary>', desc: 'طيّ وفتح بلا جافاسكربت' },
    { code: '<template>', desc: 'قالب غير مُعروض قابل للاستنساخ' },
    { code: '<progress value max>', desc: 'شريط تقدّم مهمة' },
    { code: '<meter value min max>', desc: 'قياس ضمن نطاق معروف' },
    { code: '<output>', desc: 'نتيجة عملية حسابية' },
    { code: '<canvas>', desc: 'لوحة رسم نقطية' }
  ],
  blocks: [
    { t: 'h2', text: 'HTML لم تتوقّف عند 2014' },
    { t: 'p', text: 'كثير من المطوّرين يستدعون مكتبة كاملة لعمل نافذة منبثقة أو أكورديون، بينما المتصفح يوفّرهما أصليين — بإمكانية وصول كاملة ودعم لوحة مفاتيح جاهز وحجم صفر كيلوبايت.' },

    { t: 'h2', text: '`<details>` و `<summary>`' },
    { t: 'code', lang: 'html', code: `
<details>
  <summary>ما هي مدة الدورة؟</summary>
  <p>عشرون درساً بمجموع اثنتي عشرة ساعة.</p>
</details>

<!-- مفتوح افتراضياً -->
<details open>
  <summary>هل أحتاج خبرة سابقة؟</summary>
  <p>لا، المسار يبدأ من الصفر.</p>
</details>

<!-- أكورديون: واحد فقط مفتوح في كل مرة -->
<details name="faq"><summary>السؤال الأول</summary><p>…</p></details>
<details name="faq"><summary>السؤال الثاني</summary><p>…</p></details>` },
    { t: 'demo', title: 'أكورديون بلا سطر جافاسكربت', height: 260,
      css: 'details{border:1px solid #e2e8f0;border-radius:10px;padding:10px 14px;margin-bottom:8px;background:#f8fafc}summary{cursor:pointer;font-weight:700;color:#4f46e5}details[open] summary{margin-bottom:8px}p{margin:0}',
      html: '<details name="q"><summary>ما هي مدة الدورة؟</summary><p>عشرون درساً بمجموع اثنتي عشرة ساعة.</p></details><details name="q"><summary>هل أحتاج خبرة سابقة؟</summary><p>لا، المسار يبدأ من الصفر.</p></details><details name="q"><summary>هل توجد شهادة؟</summary><p>نعم بعد إكمال كل الاختبارات.</p></details>' },
    { t: 'note', text: 'السمة `name` المشتركة تجعلها مجموعة أكورديون: فتح أحدها يغلق البقية تلقائياً. ميزة حديثة أغنت عن عشرات أسطر جافاسكربت.' },
    { t: 'tip', text: 'محتوى `<details>` المطوي **يظل** في شجرة DOM، فمحركات البحث تفهرسه ووظيفة البحث في الصفحة (Ctrl+F) تجده في المتصفحات الحديثة.' },

    { t: 'h2', text: '`<dialog>` — النافذة المنبثقة الأصلية' },
    { t: 'code', lang: 'html', code: `
<button type="button" id="openBtn">تأكيد الحذف</button>

<dialog id="confirmDialog">
  <form method="dialog">
    <h2>تأكيد الحذف</h2>
    <p>سيُحذف الملف نهائياً ولا يمكن التراجع.</p>
    <button value="cancel">إلغاء</button>
    <button value="confirm">حذف</button>
  </form>
</dialog>` },
    { t: 'code', lang: 'js', code: `
const dlg = document.getElementById('confirmDialog');

document.getElementById('openBtn')
  .addEventListener('click', () => dlg.showModal());

dlg.addEventListener('close', () => {
  console.log('اختار المستخدم:', dlg.returnValue);
});` },
    { t: 'p', text: 'ما تحصل عليه مجاناً عند استخدام `showModal()`:' },
    { t: 'ul', items: [
      '**حبس التركيز** داخل النافذة — لا يستطيع Tab الخروج منها.',
      'الإغلاق بمفتاح `Esc`.',
      'طبقة تعتيم خلفية عبر الزائفة `::backdrop`.',
      'تعطيل التفاعل مع بقية الصفحة تلقائياً.',
      'إعادة التركيز إلى الزر الذي فتح النافذة عند الإغلاق.',
      'دور `dialog` معلن لقارئ الشاشة.'
    ]},
    { t: 'code', lang: 'css', code: `
dialog {
  border: 0;
  border-radius: 16px;
  padding: 24px;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,.25);
}
dialog::backdrop {
  background: rgba(15, 23, 42, .55);
  backdrop-filter: blur(3px);
}` },
    { t: 'warn', text: 'الفرق مهم: `show()` تفتح نافذة غير حاجزة بلا تعتيم ولا حبس تركيز، و`showModal()` تفتح النافذة الحاجزة الكاملة. للتأكيدات استخدم `showModal()` دائماً. و`<form method="dialog">` يغلق النافذة عند الإرسال ويحفظ قيمة الزر في `returnValue`.' },

    { t: 'h2', text: '`<template>` — قالب مخفي' },
    { t: 'p', text: 'محتوى `<template>` لا يُعرض ولا يُنفَّذ ولا تُحمَّل صوره — لكنه موجود في DOM جاهزاً للاستنساخ. هذا هو الأساس الذي تُبنى عليه القوائم الديناميكية.' },
    { t: 'code', lang: 'html', code: `
<template id="rowTemplate">
  <li class="item">
    <span class="name"></span>
    <span class="price"></span>
    <button type="button" class="remove">حذف</button>
  </li>
</template>

<ul id="list"></ul>` },
    { t: 'code', lang: 'js', code: `
const tpl = document.getElementById('rowTemplate');
const list = document.getElementById('list');

function addItem(name, price) {
  const node = tpl.content.cloneNode(true);
  node.querySelector('.name').textContent = name;
  node.querySelector('.price').textContent = price + ' ريالاً';
  list.appendChild(node);
}

addItem('سماعة', 299);` },
    { t: 'tip', text: 'أفضل من بناء HTML بسلاسل نصية: القالب يُتحقّق من صحّته مرة واحدة، ولا تخاطر بثغرة XSS عند استخدام `textContent` بدل `innerHTML`.' },

    { t: 'h2', text: '`<progress>` و `<meter>`' },
    { t: 'code', lang: 'html', code: `
<!-- تقدّم مهمة نحو الاكتمال -->
<label for="up">رفع الملف</label>
<progress id="up" value="72" max="100">72٪</progress>

<!-- تقدّم غير معروف المدة -->
<progress></progress>

<!-- قياس ضمن نطاق معروف -->
<label for="disk">المساحة المستخدمة</label>
<meter id="disk" value="0.82" low="0.4" high="0.75" optimum="0.2">82٪</meter>` },
    { t: 'demo', title: 'الفرق بينهما', height: 240,
      css: 'label{display:block;font-weight:600;margin:12px 0 4px}progress,meter{width:100%;max-width:320px;height:18px}',
      html: '<label>رفع الملف (progress)</label><progress value="72" max="100"></progress><label>المساحة المستخدمة (meter)</label><meter value="0.82" low="0.4" high="0.75" optimum="0.2"></meter><label>البطارية (meter بقيمة جيدة)</label><meter value="0.9" low="0.2" high="0.7" optimum="1"></meter>' },
    { t: 'table', head: ['الوجه', '`<progress>`', '`<meter>`'], rows: [
      ['المعنى', 'تقدّم مهمة نحو الاكتمال', 'قياس ضمن نطاق معروف'],
      ['أمثلة', 'رفع ملف، تحميل، إكمال دورة', 'مساحة قرص، بطارية، تقييم'],
      ['يتغيّر باتجاه واحد', 'نعم — يزيد حتى يكتمل', 'لا — يرتفع وينخفض'],
      ['يلوّن نفسه تلقائياً', 'لا', 'نعم بحسب `low`/`high`/`optimum`']
    ]},
    { t: 'note', text: 'النص المكتوب بين الوسمين احتياطي للمتصفحات القديمة. وأضف `aria-label` أو `<label>` مرتبطة كي يُعلن المعنى لقارئ الشاشة.' },

    { t: 'h2', text: '`<output>` — نتيجة عملية' },
    { t: 'code', lang: 'html', code: `
<form oninput="total.value = Number(price.value) * Number(qty.value)">
  <label for="price">السعر</label>
  <input type="number" id="price" name="price" value="50">

  <label for="qty">الكمية</label>
  <input type="number" id="qty" name="qty" value="2">

  <p>الإجمالي: <output name="total" for="price qty">100</output> ريالاً</p>
</form>` },
    { t: 'demo', title: 'حاسبة فورية', height: 240,
      css: 'label{display:block;font-weight:600;margin:10px 0 4px}input{padding:8px;border:1px solid #cbd5e1;border-radius:8px;width:120px}output{font-weight:800;color:#4f46e5;font-size:1.2em}',
      html: '<form oninput="t.value = Number(p.value) * Number(q.value)"><label>السعر</label><input type="number" id="p" value="50"><label>الكمية</label><input type="number" id="q" value="2"><p>الإجمالي: <output id="t" name="t">100</output> ريالاً</p></form>' },
    { t: 'p', text: '`<output>` منطقة حيّة ضمنياً (`aria-live="polite"`)، فيعلن قارئ الشاشة تغيّر قيمتها تلقائياً دون أي إعداد.' },

    { t: 'h2', text: 'Canvas مقابل SVG' },
    { t: 'code', lang: 'html', code: `
<canvas id="c" width="300" height="150" role="img"
        aria-label="رسم بياني لمبيعات الربع الأول"></canvas>

<script>
  const ctx = document.getElementById('c').getContext('2d');
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(20, 40, 60, 90);
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(100, 20, 60, 110);
</script>` },
    { t: 'table', head: ['المعيار', 'Canvas', 'SVG'], rows: [
      ['النوع', 'نقطي — بكسلات', 'متّجه — أشكال رياضية'],
      ['التكبير', 'يفقد الحدّة', 'يبقى حاداً دائماً'],
      ['عناصر DOM', 'لا — لوحة واحدة', 'نعم — كل شكل عنصر'],
      ['التنسيق بـ CSS', 'لا', 'نعم'],
      ['الأحداث على الأجزاء', 'يدوياً بحساب الإحداثيات', 'مباشرة على كل شكل'],
      ['إمكانية الوصول', 'ضعيفة — تحتاج بديلاً نصياً', 'جيدة — نص وعناوين داخلية'],
      ['الأداء مع آلاف العناصر', 'ممتاز', 'يتباطأ'],
      ['الأنسب لـ', 'الألعاب، معالجة الصور، الرسم الكثيف', 'الأيقونات، المخطّطات، الشعارات']
    ]},
    { t: 'warn', text: 'Canvas صندوق أسود لقارئ الشاشة: لا يرى إلا بكسلات. وفّر دائماً `aria-label` أو بديلاً نصياً أو جدول بيانات مكافئاً.' },
    { t: 'code', lang: 'html', title: 'SVG مضمّن متاح للجميع', code: `
<svg viewBox="0 0 200 100" role="img" aria-labelledby="chartTitle">
  <title id="chartTitle">مبيعات يناير 40 ألفاً وفبراير 65 ألفاً</title>
  <rect x="20" y="40" width="50" height="50" fill="#6366f1"></rect>
  <rect x="110" y="15" width="50" height="75" fill="#ec4899"></rect>
</svg>` },

    { t: 'h2', text: 'عناصر مفيدة أخرى' },
    { t: 'table', head: ['العنصر', 'وظيفته'], rows: [
      ['`<wbr>`', 'نقطة كسر اختيارية داخل كلمة طويلة'],
      ['`<bdi>`', 'عزل نص مجهول الاتجاه — مهم جداً في الواجهات العربية'],
      ['`<ruby>`', 'تعليقات نطق فوق النص'],
      ['`<picture>`', 'اختيار صورة بحسب الشرط'],
      ['`<slot>`', 'فتحة محتوى في مكوّنات الويب'],
      ['`<search>`', 'حاوية دلالية لنموذج البحث']
    ]},
    { t: 'code', lang: 'html', title: 'bdi يحل مشكلة اختلاط الاتجاهات', code: `
<!-- بدون bdi: اسم لاتيني في جملة عربية قد يكسر الترتيب -->
<p>المستخدم <bdi>ahmad_99</bdi> علّق على منشورك.</p>` },
    { t: 'demo', title: 'أهمية bdi في العربية', height: 200,
      html: '<p><b>بدون bdi:</b> المستخدم !dlrow_olleh نشر تعليقاً.</p><p><b>مع bdi:</b> المستخدم <bdi>!dlrow_olleh</bdi> نشر تعليقاً.</p><p style="color:#64748b;font-size:.88em">عند عرض أسماء مستخدمين من مصادر خارجية، bdi يمنع كسر ترتيب الجملة العربية.</p>' },

    { t: 'exercise',
      title: 'تمرين: لوحة إعدادات حديثة',
      brief: 'ابنِ صفحة إعدادات تستخدم العناصر الحديثة بدل المكتبات الخارجية.',
      requirements: [
        'ثلاثة أقسام قابلة للطي بـ `<details name="settings">` تعمل كأكورديون.',
        'زر «حذف الحساب» يفتح `<dialog>` تأكيد بـ `showModal()` مع تنسيق `::backdrop`.',
        '`<progress>` يعرض نسبة اكتمال الملف الشخصي.',
        '`<meter>` يعرض المساحة المستخدمة مع عتبات `low` و `high` و `optimum`.',
        'حاسبة صغيرة تستخدم `<output>` لعرض الناتج فورياً.',
        '`<template>` لقالب صف إشعار، مع سطر جافاسكربت يستنسخه.',
        'كل عنصر له تسمية مناسبة لقارئ الشاشة.'
      ],
      hints: [
        '`method="dialog"` على النموذج داخل الحوار يغلقه ويحفظ `returnValue`.',
        '`<meter>` يحتاج `optimum` ليعرف أي اتجاه هو «الجيد».',
        'محتوى `<template>` يُستنسخ بـ `tpl.content.cloneNode(true)`.'
      ],
      solution: { lang: 'html', code: `
<h1>الإعدادات</h1>

<details name="settings" open>
  <summary>الملف الشخصي</summary>
  <label for="pr">اكتمال الملف</label>
  <progress id="pr" value="65" max="100">65٪</progress>
</details>

<details name="settings">
  <summary>التخزين</summary>
  <label for="disk">المساحة المستخدمة</label>
  <meter id="disk" value="0.82" low="0.4" high="0.75" optimum="0.2">82٪</meter>
</details>

<details name="settings">
  <summary>حاسبة الاشتراك</summary>
  <form oninput="sum.value = Number(months.value) * Number(rate.value)">
    <label for="months">عدد الأشهر</label>
    <input type="number" id="months" name="months" value="12" min="1">

    <label for="rate">السعر الشهري</label>
    <input type="number" id="rate" name="rate" value="49" min="0">

    <p>الإجمالي:
      <output name="sum" for="months rate">588</output> ريالاً
    </p>
  </form>
</details>

<button type="button" id="delBtn">حذف الحساب</button>

<dialog id="delDialog" aria-labelledby="delTitle">
  <form method="dialog">
    <h2 id="delTitle">تأكيد حذف الحساب</h2>
    <p>سيُحذف حسابك وكل بياناتك نهائياً.</p>
    <button value="cancel">إلغاء</button>
    <button value="confirm">تأكيد الحذف</button>
  </form>
</dialog>

<template id="noticeTpl">
  <li class="notice"><span class="text"></span></li>
</template>
<ul id="notices" aria-live="polite"></ul>

<script>
  const dlg = document.getElementById('delDialog');
  document.getElementById('delBtn')
    .addEventListener('click', () => dlg.showModal());

  dlg.addEventListener('close', () => {
    if (dlg.returnValue !== 'confirm') return;
    const tpl = document.getElementById('noticeTpl');
    const node = tpl.content.cloneNode(true);
    node.querySelector('.text').textContent = 'تم إرسال طلب حذف الحساب.';
    document.getElementById('notices').appendChild(node);
  });
</script>

<style>
  dialog { border: 0; border-radius: 16px; padding: 24px; max-width: 420px; }
  dialog::backdrop { background: rgba(15,23,42,.55); }
</style>` } },

    { t: 'quiz', items: [
      { q: 'ما الفرق بين `dialog.show()` و `dialog.showModal()`؟', options: ['لا فرق', '`showModal()` تحبس التركيز وتضيف تعتيماً وتعطّل بقية الصفحة', '`show()` أحدث', '`showModal()` للجوال فقط'], answer: 1,
        explain: 'النافذة الحاجزة تمنع التفاعل مع الخلفية وتحبس التركيز وتدعم Esc و::backdrop.' },
      { q: 'ما الذي يميّز محتوى `<template>`؟', options: ['يظهر بشكل خافت', 'لا يُعرض ولا تُحمَّل موارده حتى يُستنسخ', 'يعمل في المتصفحات القديمة فقط', 'يُنفَّذ تلقائياً'], answer: 1,
        explain: 'محتواه خامل تماماً: لا عرض ولا تنفيذ ولا تحميل صور، لكنه جاهز للنسخ.' },
      { q: 'متى تستخدم `<meter>` بدل `<progress>`؟', options: ['حين تريد لوناً', 'حين تقيس قيمة ضمن نطاق معروف ترتفع وتنخفض كالمساحة أو البطارية', 'حين تكون النسبة صغيرة', 'حين لا تعرف القيمة'], answer: 1,
        explain: '`progress` لمهمة تتقدّم نحو الاكتمال، و`meter` لقياس ثابت النطاق يتغيّر في الاتجاهين.' },
      { q: 'أيهما أنسب لرسم بياني تفاعلي بعشرة أعمدة قابلة للنقر؟', options: ['Canvas', 'SVG', 'صورة PNG', 'جدول'], answer: 1,
        explain: 'كل شكل في SVG عنصر DOM يقبل الأحداث والتنسيق، ويبقى حاداً عند التكبير ومتاحاً لقارئ الشاشة.' },
      { q: 'ما فائدة `<bdi>` في الواجهات العربية؟', options: ['تكبير النص', 'عزل نص مجهول الاتجاه كي لا يكسر ترتيب الجملة', 'تغيير اللون', 'إخفاء النص'], answer: 1,
        explain: 'أسماء المستخدمين اللاتينية داخل جملة عربية قد تقلب ترتيب العرض؛ `bdi` تعزلها.' }
    ]}
  ]
};
