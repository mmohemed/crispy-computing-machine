'use strict';

module.exports = {
  slug: '10-form-validation',
  title: 'أنواع الإدخال المتقدّمة والتحقّق',
  summary: 'أنواع input الحديثة التي تغيّر لوحة مفاتيح الجوال، وقواعد التحقّق المدمجة التي توفّر عليك كتابة جافاسكربت.',
  duration: 50,
  level: 'متوسط',
  tags: ['النماذج', 'التحقّق'],
  objectives: [
    'تختار نوع `input` المناسب لكل بيانات.',
    'تستخدم التحقّق المدمج: `required` و `pattern` و `min` و `max`.',
    'تفهم لماذا لا يكفي تحقّق المتصفح وحده.',
    'تستخدم `<datalist>` لاقتراحات جاهزة قابلة للكتابة.',
    'تحسّن تجربة الجوال بـ `inputmode` و `autocomplete`.'
  ],
  quickRef: [
    { code: 'type="email|tel|url|number"', desc: 'أنواع دلالية تغيّر لوحة المفاتيح' },
    { code: 'required', desc: 'الحقل إلزامي' },
    { code: 'pattern="[0-9]{5}"', desc: 'نمط تعبير نمطي للتحقّق' },
    { code: 'min / max / step', desc: 'حدود الأرقام والتواريخ' },
    { code: 'minlength / maxlength', desc: 'حدود طول النص' },
    { code: '<datalist id="…">', desc: 'اقتراحات مع إمكانية الكتابة الحرة' },
    { code: 'inputmode="numeric"', desc: 'لوحة أرقام على الجوال' }
  ],
  blocks: [
    { t: 'h2', text: 'نوع الحقل ليس شكلاً فقط' },
    { t: 'p', text: 'اختيار `type` الصحيح يمنحك ثلاثة أشياء مجاناً: **لوحة مفاتيح مناسبة على الجوال**، و**تحقّق مبدئي من الصيغة**، و**واجهة أصلية** (كمنتقي التاريخ أو منتقي اللون). هذا وحده يوفّر عشرات الأسطر من جافاسكربت.' },

    { t: 'h2', text: 'جدول الأنواع' },
    { t: 'table', head: ['النوع', 'الاستخدام', 'ما تحصل عليه مجاناً'], rows: [
      ['`text`', 'نص عام', 'لا شيء إضافي'],
      ['`email`', 'بريد إلكتروني', 'تحقّق من وجود `@` + لوحة مفاتيح بريد'],
      ['`tel`', 'رقم هاتف', 'لوحة أرقام (بلا تحقّق — الصيغ تختلف بين الدول)'],
      ['`url`', 'رابط', 'تحقّق من صيغة الرابط'],
      ['`number`', 'رقم', 'أسهم زيادة/نقصان + `min`/`max`/`step`'],
      ['`range`', 'قيمة ضمن مدى', 'شريط تمرير'],
      ['`date` / `time`', 'تاريخ / وقت', 'منتقٍ أصلي من نظام التشغيل'],
      ['`datetime-local`', 'تاريخ ووقت معاً', 'منتقٍ مدمج'],
      ['`month` / `week`', 'شهر / أسبوع', 'منتقٍ مخصّص'],
      ['`color`', 'لون', 'منتقي ألوان أصلي'],
      ['`search`', 'حقل بحث', 'زر مسح سريع'],
      ['`file`', 'رفع ملف', 'متصفّح ملفات + `accept` و `multiple`'],
      ['`hidden`', 'قيمة مخفية', 'تُرسل دون أن تُعرض'],
      ['`password`', 'كلمة مرور', 'إخفاء المحارف']
    ]},
    { t: 'demo', title: 'جرّبها بنفسك', height: 420,
      css: 'label{display:block;font-weight:600;margin:10px 0 4px;font-size:.95em}input{padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;width:100%;max-width:280px}',
      html: '<label>تاريخ</label><input type="date"><label>لون</label><input type="color" value="#6366f1" style="height:44px;padding:4px"><label>مدى (0–100)</label><input type="range" min="0" max="100" value="60"><label>رقم</label><input type="number" min="1" max="10" step="1" value="3"><label>وقت</label><input type="time">' },
    { t: 'warn', text: 'مظهر بعض الأنواع (خصوصاً `date` و `color`) يختلف بين المتصفحات وأنظمة التشغيل، ولا يمكن تنسيقه بالكامل بـ CSS. اقبل هذا الاختلاف — التجربة الأصلية أفضل للمستخدم من محاكاة ناقصة.' },

    { t: 'h2', text: 'التحقّق المدمج' },
    { t: 'p', text: 'قبل HTML5 كان كل تحقّق يُكتب بجافاسكربت. اليوم يتولّى المتصفح معظم الحالات الشائعة وحده، ويعرض رسائل بلغة النظام، ويمنع الإرسال حتى تُستوفى الشروط.' },
    { t: 'code', lang: 'html', code: `
<!-- إلزامي -->
<input type="text" name="name" required>

<!-- طول النص -->
<input type="text" name="user" minlength="3" maxlength="20" required>

<!-- حدود رقمية -->
<input type="number" name="qty" min="1" max="99" step="1" value="1">

<!-- حدود تاريخ -->
<input type="date" name="when" min="2026-01-01" max="2026-12-31">

<!-- نمط مخصّص: رمز بريدي من 5 أرقام -->
<input type="text" name="zip"
       pattern="[0-9]{5}"
       title="أدخل 5 أرقام"
       inputmode="numeric" required>

<!-- للقراءة فقط ومعطّل -->
<input type="text" value="لا يمكن تعديله" readonly>
<input type="text" value="معطّل ولا يُرسل" disabled>` },
    { t: 'table', head: ['السمة', 'الأثر'], rows: [
      ['`required`', 'يمنع الإرسال إن كان الحقل فارغاً'],
      ['`pattern`', 'تعبير نمطي يجب أن تطابقه القيمة كاملة'],
      ['`title`', 'يظهر ضمن رسالة الخطأ — **اكتبه دائماً مع `pattern`**'],
      ['`min` / `max`', 'الحد الأدنى والأعلى للأرقام والتواريخ'],
      ['`step`', 'مقدار الزيادة المسموح (`any` للسماح بالكسور)'],
      ['`minlength` / `maxlength`', 'حدود عدد المحارف'],
      ['`readonly`', 'لا يُعدَّل لكنه **يُرسل**'],
      ['`disabled`', 'لا يُعدَّل و**لا يُرسل**']
    ]},
    { t: 'tip', text: 'الفرق بين `readonly` و `disabled` مهم عملياً: استخدم `readonly` لقيمة محسوبة تريد إرسالها، و`disabled` لخيار غير متاح حالياً.' },

    { t: 'h3', text: 'أنماط جاهزة تحتاجها كثيراً' },
    { t: 'code', lang: 'html', code: `
<!-- جوال سعودي: 05 ثم 8 أرقام -->
<input type="tel" pattern="05[0-9]{8}" title="مثال: 0501234567">

<!-- اسم مستخدم: حروف لاتينية وأرقام وشرطة سفلية، 3-16 محرفاً -->
<input type="text" pattern="[a-zA-Z0-9_]{3,16}" title="حروف وأرقام و _ فقط">

<!-- كلمة مرور: 8 محارف على الأقل فيها حرف ورقم -->
<input type="password" pattern="(?=.*\\d)(?=.*[a-zA-Z]).{8,}"
       title="8 محارف على الأقل تتضمّن حرفاً ورقماً">` },
    { t: 'note', text: 'التعبير النمطي في `pattern` يُطبَّق على القيمة **كاملة** ضمناً، فلا حاجة لكتابة `^` و `$`.' },

    { t: 'h2', text: 'تحذير أمني لا يُهمَل' },
    { t: 'danger', title: 'تحقّق المتصفح ليس أماناً', text: 'كل ما سبق يحدث في **جهاز المستخدم**، ويمكن تعطيله كلياً من أدوات المطوّر أو تجاوزه بإرسال طلب مباشر إلى الخادم. تحقّق المتصفح تحسينٌ لتجربة المستخدم فقط. **يجب** أن يعيد الخادم التحقّق من كل قيمة يستقبلها، دائماً وبلا استثناء.' },

    { t: 'h2', text: '`<datalist>` — اقتراحات مع حرية الكتابة' },
    { t: 'p', text: 'الفرق عن `<select>`: القائمة المنسدلة تحصر المستخدم في الخيارات المتاحة، أما `datalist` فتقترح عليه مع بقاء إمكانية كتابة قيمة جديدة.' },
    { t: 'code', lang: 'html', code: `
<label for="tech">ما التقنية التي تتعلّمها؟</label>
<input type="text" id="tech" name="tech" list="techs" placeholder="ابدأ الكتابة…">

<datalist id="techs">
  <option value="HTML"></option>
  <option value="CSS"></option>
  <option value="JavaScript"></option>
  <option value="TypeScript"></option>
</datalist>` },
    { t: 'demo', title: 'ابدأ بكتابة حرف', height: 170,
      css: 'input{padding:9px 12px;border:1px solid #cbd5e1;border-radius:8px;width:100%;max-width:300px;font-family:inherit}',
      html: '<input list="dl" placeholder="اكتب حرف C أو H…"><datalist id="dl"><option value="HTML"><option value="CSS"><option value="JavaScript"><option value="TypeScript"></datalist>' },

    { t: 'h2', text: 'تحسين تجربة الجوال' },
    { t: 'code', lang: 'html', code: `
<input type="text" name="otp"
       inputmode="numeric"
       autocomplete="one-time-code"
       maxlength="6">

<input type="email" name="email" autocomplete="email">
<input type="text"  name="card"  autocomplete="cc-number" inputmode="numeric">
<input type="password" name="pass" autocomplete="new-password">` },
    { t: 'ul', items: [
      '`inputmode` — يغيّر لوحة المفاتيح دون تغيير نوع الحقل: `numeric`, `decimal`, `tel`, `email`, `url`, `search`.',
      '`autocomplete` — يخبر المتصفح بمعنى الحقل ليقترح القيم المحفوظة. قيم شائعة: `name`, `email`, `tel`, `street-address`, `postal-code`, `cc-number`, `current-password`, `new-password`, `one-time-code`.'
    ]},
    { t: 'tip', text: 'الإكمال التلقائي الصحيح يزيد معدّل إتمام النماذج بشكل ملحوظ. لا تعطّله (`autocomplete="off"`) إلا لسبب حقيقي.' },

    { t: 'h2', text: 'رفع الملفات' },
    { t: 'code', lang: 'html', code: `
<form action="/upload" method="post" enctype="multipart/form-data">
  <label for="cv">أرفق سيرتك الذاتية (PDF فقط)</label>
  <input type="file" id="cv" name="cv" accept=".pdf,application/pdf" required>

  <label for="imgs">صور المشروع</label>
  <input type="file" id="imgs" name="imgs" accept="image/*" multiple>

  <button type="submit">رفع</button>
</form>` },
    { t: 'warn', text: 'بدون `enctype="multipart/form-data"` على `<form>` لن يصل الملف إلى الخادم مطلقاً. وسمة `accept` مجرّد تصفية في نافذة الاختيار — الخادم يجب أن يتحقّق من النوع والحجم فعلياً.' },

    { t: 'h2', text: 'تنسيق حالات التحقّق بـ CSS' },
    { t: 'code', lang: 'css', code: `
/* حقل قيمته صالحة */
input:valid   { border-color: #10b981; }

/* حقل قيمته غير صالحة — بعد أن يلمسه المستخدم فقط */
input:user-invalid { border-color: #ef4444; }

/* حقل إلزامي */
input:required { border-inline-start: 3px solid #6366f1; }

/* حقل معطّل */
input:disabled { background: #f1f5f9; cursor: not-allowed; }` },
    { t: 'note', text: 'استخدم `:user-invalid` بدل `:invalid` كي لا تظهر الحقول حمراء قبل أن يكتب المستخدم شيئاً — تلوين نموذج فارغ بالأحمر تجربة سيئة.' },

    { t: 'exercise',
      title: 'تمرين: نموذج طلب شحن',
      brief: 'ابنِ نموذجاً يعتمد على التحقّق المدمج قدر الإمكان دون أي جافاسكربت.',
      requirements: [
        'الاسم: نص إلزامي، 3 محارف على الأقل.',
        'البريد: نوع `email` إلزامي مع `autocomplete` مناسبة.',
        'الجوال: نمط سعودي `05` + 8 أرقام مع `title` توضيحي و`inputmode="numeric"`.',
        'الرمز البريدي: 5 أرقام بالضبط.',
        'الكمية: رقم بين 1 و 20 وقيمته الابتدائية 1.',
        'تاريخ التسليم المفضّل: لا يقبل تاريخاً قبل 2026-01-01.',
        'حقل المدينة يستخدم `<datalist>` باقتراحات مع السماح بالكتابة الحرة.',
        'ملاحظات: `<textarea>` بحد أقصى 300 محرف.'
      ],
      hints: [
        '`pattern` بلا `title` يعطي رسالة خطأ غامضة.',
        '`min` على حقل التاريخ يقبل الصيغة `YYYY-MM-DD`.',
        'اختبر بإدخال قيم خاطئة عمداً وشاهد رسائل المتصفح.'
      ],
      solution: { lang: 'html', code: `
<form action="#" method="post">
  <label for="name">الاسم الكامل</label>
  <input type="text" id="name" name="name" minlength="3" required autocomplete="name">

  <label for="email">البريد الإلكتروني</label>
  <input type="email" id="email" name="email" required autocomplete="email">

  <label for="phone">رقم الجوال</label>
  <input type="tel" id="phone" name="phone"
         pattern="05[0-9]{8}" title="ابدأ بـ 05 ثم ثمانية أرقام"
         inputmode="numeric" autocomplete="tel" required>

  <label for="zip">الرمز البريدي</label>
  <input type="text" id="zip" name="zip"
         pattern="[0-9]{5}" title="خمسة أرقام"
         inputmode="numeric" autocomplete="postal-code" required>

  <label for="city">المدينة</label>
  <input type="text" id="city" name="city" list="cities" required>
  <datalist id="cities">
    <option value="الرياض"></option>
    <option value="جدة"></option>
    <option value="الدمام"></option>
  </datalist>

  <label for="qty">الكمية</label>
  <input type="number" id="qty" name="qty" min="1" max="20" step="1" value="1" required>

  <label for="date">تاريخ التسليم المفضّل</label>
  <input type="date" id="date" name="date" min="2026-01-01">

  <label for="notes">ملاحظات</label>
  <textarea id="notes" name="notes" rows="3" maxlength="300"></textarea>

  <button type="submit">إرسال الطلب</button>
</form>` },
      solutionNote: 'تذكّر: كل هذا التحقّق يجب أن يتكرّر على الخادم — فهو خط الدفاع الحقيقي.'
    },

    { t: 'quiz', items: [
      { q: 'لماذا لا يكفي تحقّق المتصفح وحده؟', options: ['لأنه بطيء', 'لأنه يعمل في جهاز المستخدم ويمكن تجاوزه بسهولة', 'لأنه غير مدعوم', 'لأنه يمنع الإرسال'], answer: 1,
        explain: 'أي شخص يستطيع تعطيله من أدوات المطوّر أو إرسال طلب مباشر؛ الخادم هو خط الدفاع الحقيقي.' },
      { q: 'ما الفرق بين `readonly` و `disabled`؟', options: ['لا فرق', '`readonly` يُرسل مع النموذج و`disabled` لا يُرسل', 'العكس', '`disabled` للأزرار فقط'], answer: 1,
        explain: 'كلاهما يمنع التعديل، لكن `disabled` يستثني الحقل من البيانات المرسلة.' },
      { q: 'ما الذي ينقص هذا الحقل: `<input pattern="[0-9]{5}">`؟', options: ['سمة `type`', 'سمة `title` لتوضيح المطلوب في رسالة الخطأ', 'سمة `size`', 'لا شيء'], answer: 1,
        explain: 'بدون `title` تظهر رسالة عامة لا تشرح للمستخدم ما هو النمط المطلوب.' },
      { q: 'متى تستخدم `<datalist>` بدل `<select>`؟', options: ['حين تكون الخيارات كثيرة فقط', 'حين تريد اقتراحات مع السماح بقيمة خارج القائمة', 'حين تريد اختياراً متعدّداً', 'حين تريد تجميع الخيارات'], answer: 1,
        explain: '`select` يحصر المستخدم في الخيارات؛ `datalist` يقترح ويسمح بالكتابة الحرة.' },
      { q: 'ما السمة الضرورية على `<form>` لرفع الملفات؟', options: ['`method="get"`', '`enctype="multipart/form-data"`', '`accept="file"`', '`upload="true"`'], answer: 1,
        explain: 'بدونها تُرسل أسماء الملفات فقط دون محتواها.' }
    ]}
  ]
};
