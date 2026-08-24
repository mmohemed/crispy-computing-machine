'use strict';

module.exports = {
  slug: '13-attributes',
  title: 'السمات العامة و data-*',
  summary: 'السمات التي تعمل على أي عنصر: id و class و title و tabindex و hidden، وكيف تخزّن بياناتك الخاصة بأمان.',
  duration: 40,
  level: 'متوسط',
  tags: ['السمات', 'أساسيات'],
  objectives: [
    'تستخدم `id` و `class` بالفرق الصحيح بينهما.',
    'تتحكّم بترتيب التنقّل عبر `tabindex` دون إفساده.',
    'تخفي عناصر بشكل صحيح بـ `hidden`.',
    'تخزّن بيانات مخصّصة بسمات `data-*` وتقرؤها بجافاسكربت.',
    'تعرف السمات المنطقية وكيف تُكتب.'
  ],
  quickRef: [
    { code: 'id="unique"', desc: 'معرّف فريد في الصفحة' },
    { code: 'class="a b c"', desc: 'أصناف متعدّدة قابلة للتكرار' },
    { code: 'title="…"', desc: 'تلميح عند مرور المؤشر' },
    { code: 'tabindex="0 | -1"', desc: 'إدراج/إخراج من ترتيب التنقّل' },
    { code: 'hidden', desc: 'إخفاء العنصر عن الجميع' },
    { code: 'data-key="value"', desc: 'بيانات مخصّصة' },
    { code: 'dataset.key', desc: 'قراءتها في جافاسكربت' }
  ],
  blocks: [
    { t: 'h2', text: 'ما السمات العامة؟' },
    { t: 'p', text: 'معظم السمات مخصّصة لعنصر بعينه (`src` للصور، `href` للروابط). لكن هناك مجموعة تعمل على **أي** عنصر — هذه هي السمات العامة (Global attributes)، وهي التي ستستخدمها يومياً في CSS وJavaScript.' },

    { t: 'h2', text: '`id` مقابل `class`' },
    { t: 'table', head: ['الوجه', '`id`', '`class`'], rows: [
      ['التكرار', 'مرة واحدة فقط في الصفحة', 'يتكرّر بلا حدود'],
      ['العدد لكل عنصر', 'واحد', 'عدة أصناف مفصولة بمسافات'],
      ['في CSS', '`#header`', '`.card`'],
      ['في JavaScript', '`getElementById`', '`querySelectorAll`'],
      ['في الروابط', '`href="#id"` يقفز إليه', 'لا يُستخدم'],
      ['في النماذج', '`<label for="id">`', 'لا يُستخدم']
    ]},
    { t: 'code', lang: 'html', code: `
<div id="main-header" class="header sticky dark">…</div>

<article class="card featured">…</article>
<article class="card">…</article>` },
    { t: 'p', text: 'قاعدة عملية: استخدم `class` للتنسيق دائماً، واحتفظ بـ `id` للحالات التي تتطلّب معرّفاً فريداً: أهداف الروابط الداخلية، ربط `<label>`، وربط ARIA.' },
    { t: 'warn', title: 'قواعد تسمية id', text: 'لا يبدأ برقم، ولا يحتوي مسافات، وحسّاس لحالة الأحرف. `id="main"` و `id="Main"` معرّفان مختلفان تماماً.' },
    { t: 'tip', text: 'التنسيق بـ `id` في CSS يعطي أولوية عالية جداً يصعب تجاوزها لاحقاً. ابقَ على الأصناف وستوفّر على نفسك معارك `!important`.' },

    { t: 'h2', text: '`title` — التلميح' },
    { t: 'code', lang: 'html', code: '<abbr title="Cascading Style Sheets">CSS</abbr>\n<button title="حفظ المستند (Ctrl+S)">حفظ</button>' },
    { t: 'warn', text: 'لا تعتمد على `title` لمعلومة مهمة: لا يظهر على شاشات اللمس إطلاقاً، ولا يمكن تكبيره، ولا يصل إليه مستخدم لوحة المفاتيح دائماً. اجعله معلومة **إضافية** لا أساسية.' },

    { t: 'h2', text: '`hidden` وإخفاء العناصر' },
    { t: 'code', lang: 'html', code: '<p hidden>لن يظهر هذا النص إطلاقاً.</p>' },
    { t: 'p', text: 'السمة `hidden` تخفي العنصر عن **الجميع**: العين وقارئ الشاشة والتنقّل بلوحة المفاتيح. لكن انتبه — هذه ليست الطريقة الوحيدة للإخفاء، ولكل طريقة أثر مختلف:' },
    { t: 'table', head: ['الطريقة', 'يراه المبصر', 'يقرؤه قارئ الشاشة', 'يشغل مساحة'], rows: [
      ['`hidden` أو `display: none`', 'لا', 'لا', 'لا'],
      ['`visibility: hidden`', 'لا', 'لا', '**نعم**'],
      ['`opacity: 0`', 'لا', '**نعم**', 'نعم'],
      ['صنف `.sr-only`', 'لا', '**نعم**', 'لا'],
      ['`aria-hidden="true"`', '**نعم**', 'لا', 'نعم']
    ]},
    { t: 'code', lang: 'css', title: 'صنف الإخفاء البصري القياسي', code: `
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}` },
    { t: 'tip', text: 'استخدم `.sr-only` لنص يشرح لقارئ الشاشة ما تعبّر عنه أيقونة بصرياً، مثل زر فيه أيقونة سلة فقط.' },

    { t: 'h2', text: '`tabindex` — ترتيب التنقّل' },
    { t: 'p', text: 'الروابط والأزرار وحقول النماذج قابلة للتركيز افتراضياً. `tabindex` يغيّر هذا السلوك بثلاث قيم لها معانٍ مختلفة تماماً:' },
    { t: 'table', head: ['القيمة', 'المعنى', 'الاستخدام'], rows: [
      ['`tabindex="0"`', 'أدخِل العنصر في الترتيب الطبيعي', 'عنصر مخصّص تفاعلي، أو منطقة تمرير'],
      ['`tabindex="-1"`', 'قابل للتركيز برمجياً فقط لا بمفتاح Tab', 'نقل التركيز إلى نافذة منبثقة أو رسالة خطأ'],
      ['`tabindex="1"` فأكثر', 'يقفز إلى مقدّمة الترتيب', '**تجنّبه دائماً**']
    ]},
    { t: 'danger', title: 'لماذا تُمنع القيم الموجبة؟', text: 'أي عنصر بـ `tabindex="1"` يسبق **كل** العناصر الطبيعية في الصفحة، فيصبح ترتيب التنقّل غير متوقّع ويستحيل صيانته مع نمو الصفحة. الحل الصحيح: رتّب عناصرك في HTML بالترتيب المنطقي أصلاً.' },
    { t: 'compare', lang: 'html', bad: {
      code: '<div onclick="save()">حفظ</div>',
      why: '`div` غير قابل للتركيز ولا يستجيب لمفتاح Enter — مستخدم لوحة المفاتيح لا يستطيع استخدامه إطلاقاً.'
    }, good: {
      code: '<button type="button" onclick="save()">حفظ</button>',
      why: 'الزر يأتي بكل السلوك مجاناً: تركيز، Enter، Space، ودور دلالي صحيح.'
    }},

    { t: 'h2', text: 'سمات `data-*` — بياناتك الخاصة' },
    { t: 'p', text: 'أحياناً تحتاج ربط معلومة بعنصر: معرّف منتج، حالة، قيمة. لا تخترع سمات عشوائية (`productid="5"`) — فهي ترميز غير صالح. استخدم البادئة `data-` المخصّصة لهذا الغرض.' },
    { t: 'code', lang: 'html', code: `
<button
  class="add-to-cart"
  data-product-id="1042"
  data-price="299"
  data-currency="SAR">
  أضف إلى السلة
</button>` },
    { t: 'code', lang: 'js', title: 'قراءتها في جافاسكربت', code: `
const btn = document.querySelector('.add-to-cart');

console.log(btn.dataset.productId); // "1042"  ← لاحظ camelCase
console.log(btn.dataset.price);     // "299"

// التعديل
btn.dataset.price = '249';

// القيم دائماً نصوص — حوّلها عند الحاجة
const price = Number(btn.dataset.price);` },
    { t: 'note', title: 'قاعدة التحويل', text: 'السمة `data-product-id` تُقرأ في جافاسكربت باسم `dataset.productId`: تُحذف البادئة `data-`، وتتحوّل الشرطات إلى camelCase.' },
    { t: 'code', lang: 'css', title: 'استخدامها في CSS أيضاً', code: `
[data-state="loading"] { opacity: .5; pointer-events: none; }
[data-level="pro"]::after { content: " (احترافي)"; }` },
    { t: 'demo', title: 'تنسيق بحسب data', height: 200,
      css: '.badge{display:inline-block;padding:6px 14px;border-radius:99px;margin:4px;font-weight:700;font-size:.9em}[data-level="beginner"]{background:#dcfce7;color:#16a34a}[data-level="mid"]{background:#fef3c7;color:#d97706}[data-level="pro"]{background:#fee2e2;color:#dc2626}',
      html: '<span class="badge" data-level="beginner">مبتدئ</span><span class="badge" data-level="mid">متوسط</span><span class="badge" data-level="pro">متقدّم</span><p style="color:#64748b;font-size:.88em">اللون يأتي كلياً من قيمة data-level.</p>' },
    { t: 'warn', text: 'لا تخزّن في `data-*` أي شيء حسّاس — كلها مرئية لأي مستخدم يفتح أدوات المطوّر. وتجنّب تخزين محتوى نصي طويل فيها؛ المحتوى مكانه داخل العنصر.' },

    { t: 'h2', text: 'سمات عامة أخرى' },
    { t: 'table', head: ['السمة', 'وظيفتها'], rows: [
      ['`lang`', 'لغة محتوى العنصر — تتجاوز لغة الصفحة'],
      ['`dir`', 'اتجاه الكتابة: `rtl` أو `ltr` أو `auto`'],
      ['`style`', 'تنسيق مضمّن — تجنّبه'],
      ['`contenteditable`', 'يجعل العنصر قابلاً للتحرير مباشرة'],
      ['`draggable`', 'يجعل العنصر قابلاً للسحب'],
      ['`spellcheck`', 'تفعيل أو تعطيل التدقيق الإملائي'],
      ['`translate`', '`no` يمنع ترجمة المحتوى تلقائياً'],
      ['`inert`', 'يعطّل العنصر وكل ما بداخله عن التفاعل']
    ]},
    { t: 'demo', title: 'contenteditable — جرّب الكتابة', height: 160,
      css: 'div{border:2px dashed #6366f1;border-radius:10px;padding:14px;min-height:50px}div:focus{outline:3px solid #c7d2fe;background:#f8fafc}',
      html: '<div contenteditable="true">اضغط هنا واكتب ما تشاء — هذا نص قابل للتحرير مباشرة.</div>' },

    { t: 'h2', text: 'السمات المنطقية' },
    { t: 'p', text: 'بعض السمات وجودها وحده يعني `true`: `required`, `disabled`, `checked`, `hidden`, `readonly`, `multiple`, `autofocus`, `defer`, `async`, `loop`, `muted`, `controls`, `open`, `inert`.' },
    { t: 'compare', lang: 'html', bad: {
      code: '<input required="false">\n<input disabled="no">',
      why: 'أي قيمة — حتى "false" — تُفعّل السمة. الحقلان أعلاه إلزامي ومعطّل فعلاً!'
    }, good: {
      code: '<input required>\n<input>\n\n<!-- لإلغائها: احذفها كلياً -->',
      why: 'الطريقة الوحيدة لإلغاء سمة منطقية هي حذفها من العنصر.'
    }},

    { t: 'exercise',
      title: 'تمرين: بطاقات منتجات ببيانات مخصّصة',
      brief: 'ابنِ ثلاث بطاقات منتجات تحمل بياناتها في سمات `data-*`.',
      requirements: [
        'كل بطاقة `<article>` بصنف `card` وسمات: `data-id` و `data-price` و `data-category` و `data-stock`.',
        'كل بطاقة تحوي عنواناً ووصفاً وزر «أضف إلى السلة» يحمل `data-product-id` مطابقاً.',
        'زر واحد معطّل بسمة منطقية لأن المنتج غير متوفّر (`data-stock="0"`).',
        'أيقونة زخرفية واحدة مخفية عن قارئ الشاشة بـ `aria-hidden="true"`.',
        'نص مخفي بصرياً بصنف `.sr-only` يوضّح ما يفعله زر يحوي أيقونة فقط.',
        'استخدم `id` مرة واحدة فقط في الصفحة كهدف لرابط داخلي.'
      ],
      hints: [
        'السمات المنطقية تُكتب بلا قيمة: `disabled` لا `disabled="true"`.',
        '`data-product-id` تُقرأ في جافاسكربت بـ `dataset.productId`.',
        'لا تستخدم `id` مكرّراً على البطاقات — استخدم `data-id`.'
      ],
      solution: { lang: 'html', code: `
<main id="products">
  <h1>منتجاتنا</h1>

  <article class="card" data-id="1042" data-price="299"
           data-category="audio" data-stock="12">
    <h2>سماعة لاسلكية</h2>
    <p>عزل ضوضاء نشط وبطارية 30 ساعة.</p>
    <button type="button" class="add" data-product-id="1042">
      أضف إلى السلة
    </button>
  </article>

  <article class="card" data-id="1043" data-price="149"
           data-category="accessories" data-stock="0">
    <h2>حامل هاتف</h2>
    <p>معدن مطلي قابل للطي.</p>
    <button type="button" class="add" data-product-id="1043" disabled>
      غير متوفّر حالياً
    </button>
  </article>

  <article class="card" data-id="1044" data-price="89"
           data-category="cables" data-stock="43">
    <h2>كابل USB-C</h2>
    <p>طول مترين ودعم الشحن السريع.</p>
    <button type="button" class="add" data-product-id="1044">
      <span aria-hidden="true">🛒</span>
      <span class="sr-only">أضف كابل USB-C إلى السلة</span>
    </button>
  </article>
</main>` },
      solutionNote: 'في جافاسكربت: `document.querySelectorAll(".card")` ثم `card.dataset.price` للوصول إلى كل قيمة.'
    },

    { t: 'quiz', items: [
      { q: 'ما الفرق الأساسي بين `id` و `class`؟', options: ['لا فرق', '`id` فريد لا يتكرّر و`class` يتكرّر', '`class` أسرع', '`id` للنصوص فقط'], answer: 1,
        explain: 'المعرّف يجب أن يكون فريداً في الصفحة؛ الصنف مصمَّم للتكرار على عناصر متشابهة.' },
      { q: 'كيف تُقرأ `data-user-name` في جافاسكربت؟', options: ['`dataset["data-user-name"]`', '`dataset.userName`', '`dataset.user-name`', '`getAttribute("userName")`'], answer: 1,
        explain: 'تُحذف البادئة data- وتتحوّل الشرطات إلى camelCase.' },
      { q: 'لماذا يُنصح بتجنّب `tabindex="1"` فأكثر؟', options: ['غير مدعوم', 'يقفز أمام كل العناصر فيفسد ترتيب التنقّل ويصعب صيانته', 'يبطئ الصفحة', 'يخفي العنصر'], answer: 1,
        explain: 'القيم الموجبة تخلق ترتيباً موازياً يسبق الترتيب الطبيعي، ويصبح غير متوقّع مع كل إضافة.' },
      { q: 'أي طريقة تخفي العنصر بصرياً لكن يبقى مقروءاً لقارئ الشاشة؟', options: ['`hidden`', '`display: none`', 'صنف `.sr-only`', '`visibility: hidden`'], answer: 2,
        explain: '`.sr-only` يخرج العنصر من العرض المرئي مع بقائه في شجرة إمكانية الوصول.' },
      { q: 'ماذا تعني `<input required="false">`؟', options: ['الحقل اختياري', 'الحقل إلزامي — لأن وجود السمة وحده يفعّلها', 'خطأ في الترميز يمنع العرض', 'يتجاهلها المتصفح'], answer: 1,
        explain: 'السمات المنطقية تُفعَّل بمجرّد وجودها مهما كانت قيمتها؛ لإلغائها تُحذف تماماً.' }
    ]}
  ]
};
