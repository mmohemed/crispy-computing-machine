'use strict';

module.exports = {
  slug: '12-media',
  title: 'الصوت والفيديو',
  summary: 'تشغيل الوسائط داخل الصفحة بلا إضافات خارجية: مصادر متعدّدة، ترجمات، وسياسات التشغيل التلقائي.',
  duration: 45,
  level: 'متوسط',
  tags: ['الوسائط', 'الفيديو'],
  objectives: [
    'تدرج فيديو وصوتاً بعناصر HTML الأصلية.',
    'توفّر عدة صيغ لضمان التوافق.',
    'تضيف ترجمات نصية بـ `<track>`.',
    'تفهم لماذا يمنع المتصفح التشغيل التلقائي بصوت.',
    'تختار بين استضافة الملف وتضمين خدمة خارجية.'
  ],
  quickRef: [
    { code: '<video controls>', desc: 'مشغّل فيديو بأزرار تحكّم' },
    { code: '<audio controls>', desc: 'مشغّل صوت' },
    { code: '<source src type>', desc: 'مصدر بديل بصيغة مختلفة' },
    { code: 'poster="…"', desc: 'صورة تظهر قبل التشغيل' },
    { code: 'preload="none|metadata|auto"', desc: 'سياسة التحميل المسبق' },
    { code: '<track kind="captions">', desc: 'ملف ترجمة بصيغة WebVTT' }
  ],
  blocks: [
    { t: 'h2', text: 'قبل HTML5 وبعدها' },
    { t: 'p', text: 'كان تشغيل فيديو يتطلّب إضافة Flash يثبّتها المستخدم يدوياً. اليوم عنصران أصليان — `<video>` و `<audio>` — يعملان في كل متصفح بلا أي اعتماد خارجي.' },

    { t: 'h2', text: 'الفيديو' },
    { t: 'code', lang: 'html', code: `
<video controls width="640" poster="images/cover.jpg" preload="metadata">
  <source src="videos/lesson.webm" type="video/webm">
  <source src="videos/lesson.mp4" type="video/mp4">
  <track kind="captions" src="captions/ar.vtt" srclang="ar" label="العربية" default>
  عذراً، متصفحك لا يدعم تشغيل الفيديو.
  <a href="videos/lesson.mp4">حمّل الملف مباشرة</a>.
</video>` },
    { t: 'table', head: ['السمة', 'وظيفتها'], rows: [
      ['`controls`', 'إظهار أزرار التحكّم. **بدونها لا يستطيع المستخدم التشغيل**'],
      ['`poster`', 'صورة معاينة تظهر قبل بدء التشغيل'],
      ['`width` / `height`', 'الأبعاد — تمنع قفزة التخطيط'],
      ['`preload`', '`none` لا يحمّل شيئاً، `metadata` المدة والأبعاد فقط، `auto` يحمّل مبكراً'],
      ['`loop`', 'إعادة التشغيل تلقائياً عند الانتهاء'],
      ['`muted`', 'يبدأ بلا صوت'],
      ['`autoplay`', 'تشغيل تلقائي (بشروط — انظر أدناه)'],
      ['`playsinline`', 'يمنع فتح مشغّل ملء الشاشة على iOS']
    ]},
    { t: 'note', text: 'النص المكتوب **بين** وسمَي `<video>` يظهر فقط في المتصفحات التي لا تدعم العنصر. اجعله مفيداً: رسالة + رابط تنزيل مباشر.' },

    { t: 'h3', text: 'لماذا عدة `<source>`؟' },
    { t: 'p', text: 'لأن دعم صيغ الفيديو ليس موحّداً. المتصفح يجرّب المصادر بالترتيب ويشغّل أول صيغة يدعمها. الترتيب المنطقي: الأحدث والأصغر أولاً.' },
    { t: 'table', head: ['الصيغة', 'الحجم', 'الدعم'], rows: [
      ['`.webm` (VP9/AV1)', 'الأصغر', 'ممتاز عدا بعض إصدارات Safari القديمة'],
      ['`.mp4` (H.264)', 'متوسط', 'شامل — اجعله دائماً المصدر الأخير'],
      ['`.ogv`', 'قديم', 'نادر الاستخدام اليوم']
    ]},
    { t: 'demo', title: 'شكل مشغّل الفيديو', height: 240,
      css: '.mock{background:#0f172a;border-radius:12px;padding:0;overflow:hidden;max-width:420px}.scr{height:150px;background:linear-gradient(135deg,#6366f1,#ec4899);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700}.bar{display:flex;align-items:center;gap:10px;padding:10px 14px;color:#cbd5e1;font-size:.85em}.track{flex:1;height:5px;background:#334155;border-radius:99px;position:relative}.track i{position:absolute;inset-block:0;inset-inline-start:0;width:35%;background:#6366f1;border-radius:99px;display:block}',
      html: '<div class="mock"><div class="scr">صورة poster</div><div class="bar"><span>▶</span><span class="track"><i></i></span><span>1:24 / 4:05</span><span>🔊</span></div></div><p style="color:#64748b;font-size:.88em">أزرار التحكّم يرسمها المتصفح نفسه عند إضافة سمة controls.</p>' },

    { t: 'h2', text: 'الصوت' },
    { t: 'code', lang: 'html', code: `
<audio controls preload="none">
  <source src="audio/podcast.opus" type="audio/ogg; codecs=opus">
  <source src="audio/podcast.mp3" type="audio/mpeg">
  متصفحك لا يدعم تشغيل الصوت.
  <a href="audio/podcast.mp3">حمّل الحلقة</a>.
</audio>` },
    { t: 'p', text: 'نفس المنطق تماماً. صيغة `.mp3` مدعومة في كل مكان، و`.opus` أصغر بكثير بنفس الجودة.' },

    { t: 'h2', text: 'التشغيل التلقائي: قاعدة مهمة' },
    { t: 'danger', title: 'المتصفحات تمنع الصوت المفاجئ', text: 'كل المتصفحات الحديثة **تمنع** التشغيل التلقائي إذا كان الفيديو يحتوي صوتاً، لأن الصوت المفاجئ تجربة عدائية. الاستثناء الوحيد: أن يكون الفيديو صامتاً.' },
    { t: 'code', lang: 'html', title: 'الصيغة الوحيدة التي تعمل', code: '<video autoplay muted loop playsinline poster="cover.jpg">\n  <source src="bg.webm" type="video/webm">\n</video>' },
    { t: 'p', text: 'هذه الوصفة تُستخدم لفيديو الخلفية الزخرفي فقط. لأي محتوى حقيقي، اترك القرار للمستخدم.' },
    { t: 'tip', text: 'إن استخدمت فيديو خلفية، احترم تفضيل تقليل الحركة: `@media (prefers-reduced-motion: reduce) { video { display: none; } }` — بعض المستخدمين تسبّب لهم الحركة دواراً.' },

    { t: 'h2', text: 'الترجمات والتسميات التوضيحية' },
    { t: 'p', text: 'الترجمة ليست ميزة إضافية — هي شرط إمكانية وصول. يستفيد منها ذوو الإعاقة السمعية، ومن يشاهد في مكان صامت، ومن لا يتقن لغة الفيديو. وهي أيضاً نص يمكن لمحركات البحث فهرسته.' },
    { t: 'code', lang: 'html', code: `
<video controls>
  <source src="lesson.mp4" type="video/mp4">
  <track kind="captions" src="ar.vtt" srclang="ar" label="العربية" default>
  <track kind="subtitles" src="en.vtt" srclang="en" label="English">
</video>` },
    { t: 'code', lang: 'text', title: 'ملف ar.vtt بصيغة WebVTT', noCopy: true, code: `
WEBVTT

00:00:00.000 --> 00:00:04.500
مرحباً بك في الدرس الأول من مسار HTML.

00:00:04.500 --> 00:00:09.000
سنتعرّف اليوم على بنية المستند الأساسية.` },
    { t: 'ul', items: [
      '`kind="captions"` — نسخة نصية بلغة الفيديو نفسها، وتصف الأصوات المهمة أيضاً.',
      '`kind="subtitles"` — ترجمة إلى لغة أخرى.',
      '`kind="descriptions"` — وصف صوتي لما يحدث بصرياً.',
      '`kind="chapters"` — فصول للتنقّل داخل الفيديو.',
      '`default` — المسار الذي يُفعّل تلقائياً.'
    ]},
    { t: 'warn', text: 'ملفات `.vtt` تخضع لسياسة نفس الأصل. عند فتح الصفحة من القرص مباشرة (`file://`) قد لا تظهر الترجمة — اختبرها عبر خادم محلي.' },

    { t: 'h2', text: 'ملفك أم خدمة خارجية؟' },
    { t: 'table', head: ['المعيار', 'استضافة ذاتية', 'يوتيوب/فيميو'], rows: [
      ['التحكّم بالمظهر', 'كامل', 'محدود'],
      ['استهلاك النطاق', 'على خادمك', 'على الخدمة'],
      ['البث المتكيّف مع السرعة', 'يحتاج إعداداً معقّداً', 'تلقائي'],
      ['الخصوصية والتتبّع', 'لا تتبّع', 'ملفات تتبّع من الخدمة'],
      ['الأنسب لـ', 'مقاطع قصيرة وخلفيات', 'محتوى طويل وجمهور واسع']
    ]},
    { t: 'code', lang: 'html', title: 'تضمين خدمة خارجية', code: `
<iframe
  width="560" height="315"
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  title="عنوان وصفي للفيديو"
  loading="lazy"
  allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
  allowfullscreen
  referrerpolicy="strict-origin-when-cross-origin"></iframe>` },
    { t: 'tip', text: 'استخدم نطاق `youtube-nocookie.com` لتقليل التتبّع، ولا تنسَ سمة `title` على `<iframe>` — بدونها لا يعرف مستخدم قارئ الشاشة ما هذا الإطار.' },

    { t: 'h2', text: 'نصائح أداء' },
    { t: 'ul', items: [
      'استخدم `preload="none"` أو `metadata` لأي فيديو ليس محور الصفحة.',
      'اضغط الفيديو قبل رفعه — ملف 100 ميجابايت لمقطع من دقيقة إهدار لبيانات المستخدم.',
      'وفّر `poster` بحجم مناسب: يظهر فوراً بدل شاشة سوداء.',
      'لا تشغّل أكثر من فيديو في الوقت نفسه.',
      'أضف `loading="lazy"` لأي `<iframe>` تضمين خارج الشاشة الأولى.'
    ]},

    { t: 'exercise',
      title: 'تمرين: صفحة درس بفيديو',
      brief: 'ابنِ صفحة درس تعليمي تحتوي فيديو الشرح وملفاً صوتياً للنسخة الصوتية.',
      requirements: [
        'فيديو بأزرار تحكّم وصورة `poster` وأبعاد محدّدة.',
        'مصدران على الأقل: WebM ثم MP4.',
        'مسار ترجمة عربية `<track>` مفعّل افتراضياً.',
        'نص بديل بين وسمَي الفيديو فيه رابط تنزيل مباشر.',
        'عنصر `<audio>` بمصدرين و`preload="none"`.',
        'الفيديو داخل `<figure>` مع `<figcaption>` يصف محتواه.'
      ],
      hints: [
        'ترتيب `<source>` مهم: الصيغة الأحدث أولاً و MP4 أخيراً.',
        '`default` توضع على مسار الترجمة الذي تريده مفعّلاً.',
        'لا تضع `autoplay` — المحتوى التعليمي يجب أن يبدأ بقرار المستخدم.'
      ],
      solution: { lang: 'html', code: `
<article>
  <h1>الدرس الثاني: هيكل مستند HTML</h1>

  <figure>
    <video controls width="720" height="405"
           poster="images/lesson2-cover.jpg" preload="metadata" playsinline>
      <source src="videos/lesson2.webm" type="video/webm">
      <source src="videos/lesson2.mp4" type="video/mp4">
      <track kind="captions" src="captions/lesson2-ar.vtt"
             srclang="ar" label="العربية" default>
      متصفحك لا يدعم تشغيل الفيديو.
      <a href="videos/lesson2.mp4">حمّل المقطع (MP4، 24 ميجابايت)</a>.
    </video>
    <figcaption>شرح مصوّر لبنية المستند وأقسام head و body — المدة 12 دقيقة.</figcaption>
  </figure>

  <h2>النسخة الصوتية</h2>
  <audio controls preload="none">
    <source src="audio/lesson2.opus" type="audio/ogg; codecs=opus">
    <source src="audio/lesson2.mp3" type="audio/mpeg">
    متصفحك لا يدعم تشغيل الصوت.
    <a href="audio/lesson2.mp3">حمّل الملف الصوتي</a>.
  </audio>
</article>` } },

    { t: 'quiz', items: [
      { q: 'ماذا يحدث إن نسيت سمة `controls` على `<video>`؟', options: ['لا يعمل الفيديو', 'يظهر بلا أزرار فلا يستطيع المستخدم تشغيله', 'يُشغَّل تلقائياً', 'يظهر خطأ'], answer: 1,
        explain: 'العنصر يظهر لكن بلا واجهة تحكّم، فيبدو للمستخدم كصورة ساكنة.' },
      { q: 'لماذا نضع عدة عناصر `<source>`؟', options: ['لتشغيل عدة مقاطع', 'لأن دعم الصيغ يختلف بين المتصفحات', 'لتسريع التحميل', 'لزيادة الجودة'], answer: 1,
        explain: 'المتصفح يختار أول صيغة يدعمها؛ نضع الأحدث أولاً و MP4 كضمان أخير.' },
      { q: 'ما شرط عمل `autoplay` في المتصفحات الحديثة؟', options: ['لا شروط', 'أن يكون الفيديو صامتاً (`muted`)', 'أن يكون قصيراً', 'أن يكون بصيغة MP4'], answer: 1,
        explain: 'التشغيل التلقائي بصوت محظور؛ يُسمح به فقط للفيديو الصامت.' },
      { q: 'ما الفرق بين `captions` و `subtitles` في `<track>`؟', options: ['لا فرق', '`captions` بلغة الفيديو وتصف الأصوات، و`subtitles` ترجمة للغة أخرى', 'العكس', '`subtitles` للصوت فقط'], answer: 1,
        explain: 'التسميات التوضيحية موجّهة لمن لا يسمع وتشمل وصف الأصوات؛ الترجمات موجّهة لمن لا يفهم اللغة.' },
      { q: 'أي قيمة لـ `preload` تناسب فيديو ثانوياً في أسفل الصفحة؟', options: ['`auto`', '`none` أو `metadata`', '`always`', '`full`'], answer: 1,
        explain: 'تجنّب تحميل ميجابايتات قد لا يشاهدها المستخدم أصلاً.' }
    ]}
  ]
};
