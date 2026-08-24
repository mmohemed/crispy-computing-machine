'use strict';

module.exports = {
  slug: '09-forms',
  title: 'النماذج: الأساسيات',
  summary: 'كيف تجمع بيانات من المستخدم: عناصر النموذج، التسميات، الأزرار، وطرق الإرسال.',
  duration: 55,
  level: 'متوسط',
  tags: ['النماذج', 'التفاعل'],
  objectives: [
    'تبني نموذجاً كاملاً بعناصر إدخال وأزرار.',
    'تربط كل حقل بتسمية `<label>` بشكل صحيح.',
    'تفرّق بين `GET` و `POST` وتعرف متى تستخدم كلاً منهما.',
    'تجمّع الحقول المترابطة بـ `<fieldset>` و `<legend>`.',
    'تعرف دور السمة `name` ولماذا بدونها تضيع البيانات.'
  ],
  quickRef: [
    { code: '<form action="…" method="post">', desc: 'حاوية النموذج ووجهة الإرسال' },
    { code: '<label for="id">', desc: 'تسمية مرتبطة بحقل' },
    { code: '<input name="…" id="…">', desc: 'حقل إدخال — name إلزامية للإرسال' },
    { code: '<textarea rows cols>', desc: 'نص متعدّد الأسطر' },
    { code: '<select><option value="…">', desc: 'قائمة اختيار' },
    { code: '<button type="submit">', desc: 'زر الإرسال' },
    { code: '<fieldset><legend>', desc: 'تجميع حقول مترابطة' }
  ],
  blocks: [
    { t: 'h2', text: 'لماذا النماذج مهمة؟' },
    { t: 'p', text: 'كل تفاعل حقيقي على الويب يمرّ عبر نموذج: تسجيل الدخول، البحث، الشراء، التعليق، رفع ملف. النموذج هو الجسر الذي تعبر عليه بيانات المستخدم من المتصفح إلى الخادم.' },

    { t: 'h2', text: 'العنصر الحاوي `<form>`' },
    { t: 'code', lang: 'html', code: `
<form action="/subscribe" method="post">
  …حقول النموذج…
  <button type="submit">اشترك</button>
</form>` },
    { t: 'table', head: ['السمة', 'وظيفتها'], rows: [
      ['`action`', 'العنوان الذي تُرسل إليه البيانات. إن حُذف تُرسل لنفس الصفحة.'],
      ['`method`', '`get` أو `post` — طريقة الإرسال.'],
      ['`enctype`', 'ترميز البيانات؛ يجب أن يكون `multipart/form-data` عند رفع الملفات.'],
      ['`novalidate`', 'تعطيل تحقّق المتصفح المدمج (للاختبار غالباً).'],
      ['`autocomplete`', '`on` أو `off` للإكمال التلقائي.']
    ]},

    { t: 'h3', text: 'GET أم POST؟' },
    { t: 'table', head: ['الوجه', 'GET', 'POST'], rows: [
      ['أين تظهر البيانات', 'في شريط العنوان بعد `?`', 'في جسم الطلب (غير مرئية)'],
      ['الحجم', 'محدود (~2000 حرف)', 'كبير جداً'],
      ['قابلية الحفظ في المفضّلة', 'نعم — الرابط يحمل البيانات', 'لا'],
      ['مناسب لـ', 'البحث والتصفية والفرز', 'تسجيل الدخول، الشراء، أي تعديل'],
      ['رفع الملفات', 'غير ممكن', 'ممكن']
    ]},
    { t: 'warn', title: 'قاعدة أمنية', text: 'لا ترسل كلمة مرور أو بيانات حسّاسة عبر `GET` أبداً — ستُسجَّل في سجلّ المتصفح وسجلّات الخادم ونصّ الرابط الذي قد يُشارَك.' },
    { t: 'note', text: 'قاعدة عامة: استخدم GET إذا كان الطلب **قراءة** لا تغيّر شيئاً، و POST إذا كان **يغيّر** حالة على الخادم.' },

    { t: 'h2', text: 'التسمية `<label>` — ليست ترفاً' },
    { t: 'p', text: 'التسمية تخبر المستخدم ما المطلوب في الحقل، وتخبر قارئ الشاشة كذلك. وهناك فائدة عملية إضافية: النقر على التسمية ينقل التركيز إلى الحقل — وهذا يوسّع مساحة النقر كثيراً، خصوصاً لمربّعات الاختيار الصغيرة على الجوال.' },
    { t: 'code', lang: 'html', title: 'طريقتان صحيحتان', code: `
<!-- 1) الربط الصريح عبر for و id — الموصى به -->
<label for="email">البريد الإلكتروني</label>
<input type="email" id="email" name="email">

<!-- 2) الاحتواء -->
<label>
  البريد الإلكتروني
  <input type="email" name="email">
</label>` },
    { t: 'compare', lang: 'html', bad: {
      code: '<p>البريد الإلكتروني</p>\n<input type="email" name="email">\n\n<input type="text" placeholder="الاسم">',
      why: 'لا ربط بين النص والحقل. و`placeholder` ليس تسمية: يختفي عند الكتابة وتباينه اللوني ضعيف.'
    }, good: {
      code: '<label for="email">البريد الإلكتروني</label>\n<input type="email" id="email" name="email">\n\n<label for="name">الاسم</label>\n<input type="text" id="name" name="name" placeholder="مثال: محمد أحمد">',
      why: 'تسمية دائمة مرتبطة، و`placeholder` مستخدم كما ينبغي: مثال توضيحي إضافي.'
    }},
    { t: 'demo', title: 'جرّب النقر على كلمة «أوافق»', height: 150,
      html: '<p><label for="cb" style="cursor:pointer">أوافق على الشروط</label> <input type="checkbox" id="cb"></p><p style="color:#64748b;font-size:.9em">النقر على النص نفسه يبدّل حالة المربّع بفضل الربط بـ for و id.</p>' },

    { t: 'h2', text: 'السمة `name`: بدونها لا شيء يُرسل' },
    { t: 'p', text: 'عند الإرسال يجمع المتصفح أزواج `name=value` من كل حقل. أي حقل بلا `name` **يُتجاهل تماماً**. الفرق بين `id` و `name`:' },
    { t: 'ul', items: [
      '`id` — معرّف داخل الصفحة، تستخدمه `<label for>` وCSS وJavaScript.',
      '`name` — اسم الحقل عند الإرسال إلى الخادم. هو ما يقرؤه الخادم.'
    ]},
    { t: 'p', text: 'مثال: نموذج فيه `name="q"` وقيمة «html» مع `method="get"` يُرسل الطلب إلى `/search?q=html`.' },

    { t: 'h2', text: 'أنواع الإدخال الأساسية' },
    { t: 'code', lang: 'html', code: `
<label for="fullname">الاسم الكامل</label>
<input type="text" id="fullname" name="fullname">

<label for="mail">البريد</label>
<input type="email" id="mail" name="mail">

<label for="pass">كلمة المرور</label>
<input type="password" id="pass" name="pass">

<label for="age">العمر</label>
<input type="number" id="age" name="age" min="1" max="120">

<label for="bio">نبذة عنك</label>
<textarea id="bio" name="bio" rows="4"></textarea>` },
    { t: 'demo', title: 'نموذج مصغّر', height: 340,
      css: 'label{display:block;font-weight:600;margin:10px 0 4px}input,textarea{width:100%;padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit}',
      html: '<label for="a">الاسم الكامل</label><input id="a" type="text"><label for="b">البريد</label><input id="b" type="email" placeholder="you@example.com"><label for="c">نبذة عنك</label><textarea id="c" rows="3"></textarea>' },
    { t: 'note', text: '`<textarea>` عنصر غير فارغ: قيمته الابتدائية تُكتب **بين** وسمَي الفتح والإغلاق، لا في سمة `value`. وانتبه: أي مسافة تكتبها بينهما ستظهر داخل الحقل.' },

    { t: 'h2', text: 'الاختيار من متعدّد' },
    { t: 'h3', text: 'أزرار الاختيار (Radio) — خيار واحد' },
    { t: 'code', lang: 'html', code: `
<fieldset>
  <legend>مستوى خبرتك</legend>

  <input type="radio" id="lv1" name="level" value="beginner" checked>
  <label for="lv1">مبتدئ</label>

  <input type="radio" id="lv2" name="level" value="mid">
  <label for="lv2">متوسط</label>

  <input type="radio" id="lv3" name="level" value="pro">
  <label for="lv3">متقدّم</label>
</fieldset>` },
    { t: 'warn', title: 'المفتاح هو `name` الموحّد', text: 'أزرار الاختيار تتصرّف كمجموعة واحدة فقط إذا حملت **نفس** قيمة `name`. أما `id` فيجب أن يكون مختلفاً لكل زر.' },

    { t: 'h3', text: 'مربّعات الاختيار (Checkbox) — عدة خيارات' },
    { t: 'code', lang: 'html', code: `
<fieldset>
  <legend>اهتماماتك</legend>

  <input type="checkbox" id="i1" name="topics" value="html">
  <label for="i1">HTML</label>

  <input type="checkbox" id="i2" name="topics" value="css">
  <label for="i2">CSS</label>
</fieldset>` },
    { t: 'p', text: 'استخدام نفس `name` مع قيم مختلفة يجعل الخادم يستقبلها كمصفوفة من القيم المختارة.' },

    { t: 'h3', text: 'القائمة المنسدلة `<select>`' },
    { t: 'code', lang: 'html', code: `
<label for="city">المدينة</label>
<select id="city" name="city">
  <option value="">— اختر مدينة —</option>
  <optgroup label="المنطقة الوسطى">
    <option value="riyadh">الرياض</option>
    <option value="qassim">القصيم</option>
  </optgroup>
  <optgroup label="المنطقة الغربية">
    <option value="jeddah" selected>جدة</option>
    <option value="makkah">مكة المكرمة</option>
  </optgroup>
</select>

<!-- اختيار متعدّد -->
<select name="skills" multiple size="4">
  <option value="html">HTML</option>
  <option value="css">CSS</option>
  <option value="js">JavaScript</option>
</select>` },
    { t: 'demo', title: 'قائمة مجمّعة', height: 190,
      css: 'label{display:block;font-weight:600;margin-bottom:6px}select{padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit;min-width:220px}',
      html: '<label for="c2">المدينة</label><select id="c2"><option value="">— اختر مدينة —</option><optgroup label="المنطقة الوسطى"><option>الرياض</option><option>القصيم</option></optgroup><optgroup label="المنطقة الغربية"><option selected>جدة</option><option>مكة المكرمة</option></optgroup></select>' },

    { t: 'h2', text: 'التجميع بـ `<fieldset>` و `<legend>`' },
    { t: 'p', text: 'يجمعان الحقول المترابطة تحت عنوان واحد. هذا ليس تجميلاً: قارئ الشاشة يعلن نص `<legend>` قبل كل خيار داخل المجموعة، فيفهم المستخدم أن «مبتدئ» تخصّ «مستوى خبرتك».' },
    { t: 'demo', title: 'مجموعة حقول', height: 220,
      css: 'fieldset{border:1px solid #cbd5e1;border-radius:12px;padding:12px 16px}legend{font-weight:700;color:#4f46e5;padding:0 8px}label{margin-left:14px;cursor:pointer}',
      html: '<fieldset><legend>مستوى خبرتك</legend><input type="radio" id="r1" name="lv" checked><label for="r1">مبتدئ</label><input type="radio" id="r2" name="lv"><label for="r2">متوسط</label><input type="radio" id="r3" name="lv"><label for="r3">متقدّم</label></fieldset>' },

    { t: 'h2', text: 'الأزرار' },
    { t: 'code', lang: 'html', code: `
<button type="submit">إرسال</button>
<button type="reset">إعادة تعيين</button>
<button type="button">زر بلا سلوك افتراضي</button>` },
    { t: 'warn', title: 'فخّ شهير', text: 'قيمة `type` الافتراضية لـ `<button>` داخل نموذج هي `submit`. إن نسيت كتابة `type="button"` على زر مساعد، سيرسل النموذج عند كل نقرة عليه.' },
    { t: 'tip', text: 'تجنّب `type="reset"` في معظم النماذج — قلّما يريده المستخدم، وكثيراً ما يُنقر بالخطأ فيمحو كل ما كتبه.' },

    { t: 'h2', text: 'نموذج كامل' },
    { t: 'code', lang: 'html', code: `
<form action="/contact" method="post">
  <fieldset>
    <legend>بياناتك</legend>

    <label for="n">الاسم</label>
    <input type="text" id="n" name="name" required autocomplete="name">

    <label for="e">البريد الإلكتروني</label>
    <input type="email" id="e" name="email" required autocomplete="email">
  </fieldset>

  <fieldset>
    <legend>رسالتك</legend>

    <label for="s">الموضوع</label>
    <select id="s" name="subject">
      <option value="support">دعم فني</option>
      <option value="sales">استفسار تجاري</option>
    </select>

    <label for="m">نص الرسالة</label>
    <textarea id="m" name="message" rows="5" required></textarea>
  </fieldset>

  <button type="submit">إرسال الرسالة</button>
</form>` },

    { t: 'exercise',
      title: 'تمرين: نموذج تسجيل في دورة',
      brief: 'ابنِ نموذج تسجيل كامل. لا حاجة لخادم — استخدم `action="#"` واختبر البنية فقط.',
      requirements: [
        'كل حقل له `<label>` مرتبطة بـ `for` و `id`، وله `name`.',
        'حقول: الاسم، البريد، رقم الجوال، تاريخ الميلاد، كلمة المرور.',
        'مجموعة أزرار اختيار لمستوى الخبرة داخل `<fieldset>` مع `<legend>`.',
        'مربّعات اختيار للمسارات المرغوبة (يمكن اختيار أكثر من واحد).',
        'قائمة `<select>` مقسّمة بـ `<optgroup>` لاختيار المدينة.',
        'مربّع اختيار للموافقة على الشروط، وزر إرسال واحد.'
      ],
      hints: [
        'أزرار الاختيار تشترك في `name` وتختلف في `id` و `value`.',
        'الخيار الأول في `<select>` يُفضَّل أن يكون فارغ القيمة كتنبيه للاختيار.',
        'لا تنسَ `type="submit"` صراحةً على زر الإرسال للوضوح.'
      ],
      solution: { lang: 'html', code: `
<form action="#" method="post">
  <h2>التسجيل في دورة تطوير الويب</h2>

  <fieldset>
    <legend>البيانات الشخصية</legend>

    <label for="name">الاسم الكامل</label>
    <input type="text" id="name" name="name" required autocomplete="name">

    <label for="email">البريد الإلكتروني</label>
    <input type="email" id="email" name="email" required autocomplete="email">

    <label for="phone">رقم الجوال</label>
    <input type="tel" id="phone" name="phone" autocomplete="tel">

    <label for="birth">تاريخ الميلاد</label>
    <input type="date" id="birth" name="birth">

    <label for="pass">كلمة المرور</label>
    <input type="password" id="pass" name="password" required autocomplete="new-password">
  </fieldset>

  <fieldset>
    <legend>مستوى خبرتك</legend>
    <input type="radio" id="lv1" name="level" value="beginner" checked>
    <label for="lv1">مبتدئ</label>
    <input type="radio" id="lv2" name="level" value="mid">
    <label for="lv2">متوسط</label>
    <input type="radio" id="lv3" name="level" value="pro">
    <label for="lv3">متقدّم</label>
  </fieldset>

  <fieldset>
    <legend>المسارات التي تهمّك</legend>
    <input type="checkbox" id="t1" name="tracks" value="html">
    <label for="t1">HTML</label>
    <input type="checkbox" id="t2" name="tracks" value="css">
    <label for="t2">CSS</label>
    <input type="checkbox" id="t3" name="tracks" value="js">
    <label for="t3">JavaScript</label>
  </fieldset>

  <label for="city">المدينة</label>
  <select id="city" name="city">
    <option value="">— اختر مدينة —</option>
    <optgroup label="الوسطى">
      <option value="riyadh">الرياض</option>
    </optgroup>
    <optgroup label="الغربية">
      <option value="jeddah">جدة</option>
    </optgroup>
  </select>

  <p>
    <input type="checkbox" id="terms" name="terms" required>
    <label for="terms">أوافق على شروط الاستخدام</label>
  </p>

  <button type="submit">تسجيل</button>
</form>` } },

    { t: 'quiz', items: [
      { q: 'ماذا يحدث لحقل بلا سمة `name` عند الإرسال؟', options: ['يُرسل باسم فارغ', 'لا يُرسل إطلاقاً', 'يُرسل بقيمة id', 'يمنع إرسال النموذج'], answer: 1,
        explain: 'المتصفح يجمع أزواج name=value؛ الحقل بلا name يُتجاهل تماماً.' },
      { q: 'أي طريقة إرسال تستخدم لتسجيل الدخول؟', options: ['GET لأنها أسرع', 'POST لأن البيانات لا تظهر في الرابط', 'أي منهما', 'PUT'], answer: 1,
        explain: 'GET يضع البيانات في شريط العنوان وسجلّات الخادم — غير مقبول لكلمات المرور.' },
      { q: 'كيف تجعل ثلاثة أزرار اختيار مجموعة واحدة؟', options: ['بإعطائها نفس `id`', 'بإعطائها نفس `name`', 'بوضعها في `<div>`', 'بإضافة `group="1"`'], answer: 1,
        explain: 'نفس `name` يجعلها متنافية؛ و`id` يجب أن يبقى فريداً لكل زر لأجل التسمية.' },
      { q: 'لماذا لا يصلح `placeholder` بديلاً عن `<label>`؟', options: ['لأنه لا يعمل على الجوال', 'لأنه يختفي عند الكتابة وتباينه ضعيف ولا يربطه قارئ الشاشة بالحقل دائماً', 'لأنه بطيء', 'لأنه غير مدعوم'], answer: 1,
        explain: 'placeholder مثال توضيحي مؤقت؛ التسمية معلومة دائمة مرتبطة بنيوياً بالحقل.' },
      { q: 'ما القيمة الافتراضية لسمة `type` في `<button>` داخل نموذج؟', options: ['button', 'submit', 'reset', 'لا قيمة'], answer: 1,
        explain: 'الافتراضي submit، لذا يجب كتابة `type="button"` صراحةً لأي زر لا يُراد به الإرسال.' }
    ]}
  ]
};
