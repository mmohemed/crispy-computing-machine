'use strict';

module.exports = {
  slug: '15-iframes-embeds',
  title: 'الإطارات والتضمين الخارجي',
  summary: 'تضمين محتوى من مواقع أخرى بأمان: خرائط، فيديو، مستندات — مع فهم مخاطر iframe وكيف تحدّ منها.',
  duration: 35,
  level: 'متوسط',
  tags: ['التضمين', 'الأمان'],
  objectives: [
    'تضمّن محتوى خارجياً بـ `<iframe>` بشكل صحيح.',
    'تستخدم `sandbox` لتقييد صلاحيات المحتوى المضمَّن.',
    'تعرف المخاطر الأمنية للإطارات وكيف تحمي موقعك.',
    'تختار بين `<iframe>` والبدائل الأخرى.',
    'تضيف سمات إمكانية الوصول والأداء اللازمة.'
  ],
  quickRef: [
    { code: '<iframe src title>', desc: 'إطار مضمّن — title إلزامية' },
    { code: 'sandbox="allow-scripts"', desc: 'تقييد صلاحيات المحتوى' },
    { code: 'loading="lazy"', desc: 'تأجيل التحميل' },
    { code: 'allow="fullscreen"', desc: 'منح صلاحيات محدّدة' },
    { code: 'srcdoc="…"', desc: 'محتوى HTML مباشر بدل رابط' },
    { code: 'referrerpolicy', desc: 'التحكّم بترويسة الإحالة' }
  ],
  blocks: [
    { t: 'h2', text: 'ما هو `<iframe>`؟' },
    { t: 'p', text: 'اختصار Inline Frame: نافذة داخل صفحتك تعرض **مستنداً كاملاً آخر**. لكل إطار سياقه المستقل: نافذته الخاصة، وشجرة DOM خاصة، وملفات CSS و JavaScript خاصة به.' },
    { t: 'code', lang: 'html', code: `
<iframe
  src="https://www.openstreetmap.org/export/embed.html?bbox=46.6,24.6,46.8,24.8"
  title="خريطة موقع المكتب في الرياض"
  width="600" height="400"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"></iframe>` },
    { t: 'warn', title: 'سمة `title` ليست اختيارية', text: 'بدونها ينطق قارئ الشاشة «إطار» فقط، فلا يعرف المستخدم ما بداخله ولا هل يستحق دخوله. اكتب وصفاً دقيقاً لمحتوى الإطار.' },

    { t: 'h2', text: 'الاستخدامات المشروعة' },
    { t: 'features', items: [
      { icon: 'map', title: 'الخرائط', text: 'خرائط تفاعلية من خدمات الخرائط بلا كتابة كود خرائط.' },
      { icon: 'video', title: 'الفيديو', text: 'مشغّلات يوتيوب وفيميو مع بثّ متكيّف مع سرعة الاتصال.' },
      { icon: 'file', title: 'المستندات', text: 'عرض PDF أو ملف عرض تقديمي داخل الصفحة.' },
      { icon: 'code', title: 'محرّرات الكود', text: 'أمثلة حيّة من CodePen و JSFiddle داخل الدروس.' },
      { icon: 'shield', title: 'العزل', text: 'تشغيل محتوى غير موثوق في سياق منفصل عن صفحتك.' },
      { icon: 'grid', title: 'الودجات', text: 'نماذج وتقويمات وأدوات دفع من طرف ثالث.' }
    ]},
    { t: 'note', text: 'هذه المنصة التي تقرأ فيها الآن تستخدم `<iframe>` لعرض «النتيجة المباشرة» في كل درس — فالعزل يمنع أنماط المثال من التسرّب إلى الصفحة.' },

    { t: 'h2', text: '`srcdoc` — محتوى مباشر بلا ملف' },
    { t: 'code', lang: 'html', code: `
<iframe
  title="مثال حي"
  srcdoc="&lt;p style='color:teal'&gt;مرحباً من داخل الإطار&lt;/p&gt;"
  height="80"></iframe>` },
    { t: 'p', text: 'مفيد لعرض أمثلة صغيرة معزولة دون إنشاء ملف مستقل لكل مثال. انتبه لتهريب علامات الاقتباس داخل السمة.' },

    { t: 'h2', text: 'الأمان: `sandbox`' },
    { t: 'p', text: 'المحتوى المضمَّن ليس تحت سيطرتك. سمة `sandbox` تفرض قيوداً صارمة عليه: بمجرّد كتابتها تُمنع **كل** الصلاحيات، ثم تعيد ما تحتاجه فقط.' },
    { t: 'code', lang: 'html', code: `
<!-- أقصى تقييد: لا سكربتات، لا نماذج، لا ملاحة -->
<iframe src="untrusted.html" title="محتوى غير موثوق" sandbox></iframe>

<!-- السماح بالسكربتات فقط -->
<iframe src="demo.html" title="مثال تفاعلي" sandbox="allow-scripts"></iframe>` },
    { t: 'table', head: ['القيمة', 'ما تسمح به'], rows: [
      ['`allow-scripts`', 'تشغيل جافاسكربت'],
      ['`allow-forms`', 'إرسال النماذج'],
      ['`allow-popups`', 'فتح نوافذ جديدة'],
      ['`allow-same-origin`', 'معاملة المحتوى كأنه من نفس أصل صفحتك'],
      ['`allow-top-navigation`', 'تغيير عنوان الصفحة الأم'],
      ['`allow-downloads`', 'بدء تنزيلات'],
      ['`allow-modals`', 'استخدام alert و confirm']
    ]},
    { t: 'danger', title: 'تركيبة تُبطل الحماية', text: 'الجمع بين `allow-scripts` و `allow-same-origin` لمحتوى **من مصدر خارجي** يلغي الحماية عملياً: يستطيع السكربت داخل الإطار إزالة سمة `sandbox` عن نفسه. لا تجمعهما إلا لمحتوى تملكه أنت.' },

    { t: 'h2', text: '`allow` — سياسة الصلاحيات' },
    { t: 'code', lang: 'html', code: `
<iframe
  src="https://player.example.com/v/123"
  title="مشغّل الفيديو"
  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
  allowfullscreen
  loading="lazy"></iframe>` },
    { t: 'p', text: 'بينما `sandbox` يقيّد **قدرات المستند**، فإن `allow` يتحكّم في **صلاحيات الأجهزة والواجهات**: الكاميرا، الميكروفون، الموقع الجغرافي، ملء الشاشة. الافتراضي اليوم هو المنع، فامنح ما تحتاجه فقط.' },

    { t: 'h2', text: 'حماية موقعك من التأطير' },
    { t: 'p', text: 'الوجه الآخر للعملة: ماذا لو وضع **شخص آخر** موقعك في إطار داخل موقعه؟ هذا أساس هجوم **Clickjacking**: يعرض المهاجم موقعك بشفافية صفر فوق أزرار مزيّفة، فينقر الضحية على «حذف الحساب» وهو يظن أنه ينقر على «مشاهدة الفيديو».' },
    { t: 'code', lang: 'text', title: 'ترويسات يرسلها الخادم (لا تُكتب في HTML)', noCopy: true, code: `
X-Frame-Options: SAMEORIGIN

Content-Security-Policy: frame-ancestors 'self' https://partner.example.com` },
    { t: 'warn', text: 'هذه إعدادات **خادم** لا وسوم HTML. `frame-ancestors` هي الطريقة الحديثة و`X-Frame-Options` للتوافق مع المتصفحات الأقدم. أي صفحة فيها عملية حسّاسة (دفع، تغيير كلمة مرور، حذف) يجب أن تحمل إحداهما.' },

    { t: 'h2', text: 'تكلفة الأداء' },
    { t: 'p', text: 'كل `<iframe>` يحمّل مستنداً كاملاً بملفاته وسكربتاته. إطار يوتيوب واحد قد يضيف مئات الكيلوبايتات وعشرات الطلبات. طرق التخفيف:' },
    { t: 'ul', items: [
      '`loading="lazy"` لكل إطار خارج الشاشة الأولى.',
      'أسلوب «انقر للتحميل»: اعرض صورة معاينة، وأنشئ الإطار بجافاسكربت عند النقر فقط.',
      'استخدم النطاقات الخفيفة للخصوصية مثل `youtube-nocookie.com`.',
      'حدّد `width` و `height` لتفادي قفزة التخطيط.',
      'لا تضمّن أكثر مما تحتاج فعلاً في الصفحة الواحدة.'
    ]},
    { t: 'code', lang: 'css', title: 'إطار متجاوب بنسبة ثابتة', code: `
.embed {
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
}
.embed iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 12px;
}` },

    { t: 'h2', text: 'عناصر تضمين أخرى' },
    { t: 'table', head: ['العنصر', 'الاستخدام', 'الحالة'], rows: [
      ['`<iframe>`', 'تضمين مستند كامل', 'الخيار القياسي اليوم'],
      ['`<embed>`', 'تضمين مورد خارجي', 'قديم ومحدود'],
      ['`<object>`', 'تضمين مورد مع محتوى بديل', 'يُستخدم أحياناً لـ PDF'],
      ['`<video>` / `<audio>`', 'وسائط تستضيفها بنفسك', 'الأفضل لملفاتك'],
      ['`<img>` مع SVG', 'رسومات متّجهة', 'الأفضل للأيقونات']
    ]},
    { t: 'tip', text: 'القاعدة: لا تستخدم `<iframe>` إلا حين تحتاج فعلاً مستنداً كاملاً من مصدر آخر. لعرض صورة أو فيديو تملكه، العناصر المخصّصة أخف وأفضل.' },

    { t: 'exercise',
      title: 'تمرين: صفحة «اتصل بنا» بخريطة مضمّنة',
      brief: 'ابنِ صفحة تواصل تحتوي خريطة موقع وفيديو تعريفي مضمّنين بأفضل الممارسات.',
      requirements: [
        'خريطة داخل `<iframe>` بسمة `title` وصفية وأبعاد محدّدة و`loading="lazy"`.',
        'الخريطة داخل حاوية `.embed` بنسبة أبعاد ثابتة لتكون متجاوبة.',
        'فيديو تعريفي مضمّن بسمة `allow` مناسبة و`allowfullscreen`.',
        'إطار ثالث يعرض مثالاً محلياً بـ `srcdoc` مع `sandbox` مقيّدة.',
        'نص بديل أو رابط مباشر بجوار كل إطار لمن لا يستطيع رؤيته.',
        'علّق في الكود على سبب اختيارك لقيم `sandbox` تحديداً.'
      ],
      hints: [
        '`sandbox` بلا قيم تعني «امنع كل شيء».',
        '`aspect-ratio` في CSS تغني عن حيلة الحشو القديمة بنسبة 56.25٪.',
        'لا تضع `allow-same-origin` مع `allow-scripts` لمحتوى خارجي.'
      ],
      solution: { lang: 'html', code: `
<h1>اتصل بنا</h1>

<h2>موقعنا على الخريطة</h2>
<div class="embed">
  <iframe
    src="https://www.openstreetmap.org/export/embed.html?bbox=46.6,24.6,46.8,24.8"
    title="خريطة تفاعلية لموقع المكتب في حي العليا بالرياض"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>
<p>العنوان: حي العليا، الرياض —
  <a href="https://maps.example.com/office">افتح الخريطة في تبويب جديد</a>
</p>

<h2>تعرّف علينا</h2>
<div class="embed">
  <iframe
    src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
    title="فيديو تعريفي بفريق العمل ومقر الشركة"
    allow="fullscreen; picture-in-picture; encrypted-media"
    allowfullscreen
    loading="lazy"></iframe>
</div>

<h2>مثال حي</h2>
<!--
  sandbox بلا قيم: المثال ثابت لا يحتاج سكربتات ولا نماذج،
  فنمنع كل شيء لأقصى درجة أمان.
-->
<iframe
  title="مثال على تنسيق بطاقة"
  sandbox
  height="120"
  srcdoc="&lt;div style='padding:12px;border:1px solid #ddd;border-radius:8px'&gt;بطاقة بسيطة&lt;/div&gt;"></iframe>

<style>
  .embed { position: relative; aspect-ratio: 16 / 9; width: 100%; max-width: 720px; }
  .embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; border-radius: 12px; }
</style>` } },

    { t: 'quiz', items: [
      { q: 'أي سمة إلزامية عملياً على `<iframe>` لإمكانية الوصول؟', options: ['`width`', '`title`', '`name`', '`class`'], answer: 1,
        explain: 'بدون `title` ينطق قارئ الشاشة «إطار» بلا أي وصف لمحتواه.' },
      { q: 'ماذا يحدث عند كتابة `sandbox` بلا قيم؟', options: ['تُمنح كل الصلاحيات', 'تُمنع كل الصلاحيات', 'تُمنح السكربتات فقط', 'تُتجاهل السمة'], answer: 1,
        explain: 'المبدأ عكسي: `sandbox` تمنع كل شيء افتراضياً ثم تعيد ما تسمّيه صراحةً.' },
      { q: 'لماذا يُحذَّر من جمع `allow-scripts` مع `allow-same-origin` لمحتوى خارجي؟', options: ['يبطئ التحميل', 'لأن السكربت يستطيع عندها إزالة قيود sandbox عن نفسه', 'لأنهما غير متوافقتين', 'لأن المتصفح يرفضهما'], answer: 1,
        explain: 'اجتماعهما يمنح المحتوى الخارجي وصولاً كافياً لتعديل خصائص الإطار نفسه وإسقاط الحماية.' },
      { q: 'كيف تمنع موقعك من الظهور داخل إطار في موقع آخر؟', options: ['بسمة `noframe` في HTML', 'بترويسة `Content-Security-Policy: frame-ancestors` من الخادم', 'بجافاسكربت فقط', 'لا يمكن'], answer: 1,
        explain: 'إعداد خادم لا وسم HTML؛ وهو خط الدفاع ضد Clickjacking.' },
      { q: 'ما أفضل طريقة لتقليل أثر إطارات التضمين على الأداء؟', options: ['تصغير أبعادها', '`loading="lazy"` وأسلوب «انقر للتحميل»', 'إزالة سمة title', 'استخدام عدة إطارات صغيرة'], answer: 1,
        explain: 'تأجيل التحميل أو عدم إنشاء الإطار حتى يطلبه المستخدم يوفّر مئات الكيلوبايتات.' }
    ]}
  ]
};
