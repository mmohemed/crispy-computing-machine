#!/usr/bin/env node
/**
 * مولّد موقع CodeWay Web الثابت.
 * الاستخدام:  node tools/build.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { page, SITE } = require('./layout.js');
const { render, inline, plain } = require('./blocks.js');
const { icon } = require('./icons.js');
const { esc } = require('./highlight.js');
const tracks = require(path.join(ROOT, 'content', 'tracks.js'));

/* ------------------------------------------------------------------ */
/* أدوات مساعدة                                                        */
/* ------------------------------------------------------------------ */
const write = (rel, html) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, 'utf8');
  return file;
};

const arabicNum = (n) => String(n);
const fmtDuration = (m) => (m >= 60 ? `${Math.floor(m / 60)} س ${m % 60 ? (m % 60) + ' د' : ''}`.trim() : `${m} دقيقة`);

/* تحميل دروس المسارات الجاهزة */
function loadLessons(trackId) {
  const dir = path.join(ROOT, 'content', trackId);
  const indexFile = path.join(dir, 'index.js');
  if (!fs.existsSync(indexFile)) return [];
  delete require.cache[require.resolve(indexFile)];
  return require(indexFile);
}

const trackData = tracks.map((t) => ({ ...t, lessons: t.status === 'ready' ? loadLessons(t.id) : [] }));
const readyTracks = trackData.filter((t) => t.status === 'ready' && t.lessons.length);

const totals = {
  lessons: readyTracks.reduce((s, t) => s + t.lessons.length, 0),
  minutes: readyTracks.reduce((s, t) => s + t.lessons.reduce((a, l) => a + (l.duration || 0), 0), 0),
  tracks: tracks.length,
  exercises: readyTracks.reduce(
    (s, t) => s + t.lessons.reduce((a, l) => a + l.blocks.filter((b) => b.t === 'exercise').length, 0), 0)
};

/* ------------------------------------------------------------------ */
/* مكوّنات مشتركة                                                      */
/* ------------------------------------------------------------------ */
function trackCard(t, prefix) {
  const ready = t.status === 'ready' && t.lessons.length;
  const href = ready ? `${prefix}tracks/${t.id}/index.html` : `${prefix}tracks.html#${t.id}`;
  const minutes = t.lessons.reduce((a, l) => a + (l.duration || 0), 0);

  return `<a class="card track-card${ready ? '' : ' soon'}" href="${href}" id="${t.id}" data-track="${t.id}"
   data-search-text="${esc(t.name + ' ' + t.en + ' ' + t.tagline + ' ' + t.tags.join(' '))}">
  <span class="card-icon">${icon(t.icon)}</span>
  <h3>${esc(t.name)} ${ready ? '' : '<span class="badge">قريباً</span>'}</h3>
  <p>${esc(t.tagline)}</p>
  <div class="track-tags">${t.tags.map((g) => `<span class="badge badge-track">${esc(g)}</span>`).join('')}</div>
  <div class="track-meta">
    ${ready
      ? `<span>${icon('book')} ${t.lessons.length} درساً</span><span>${icon('clock')} ${fmtDuration(minutes)}</span>`
      : `<span>${icon('list')} ${t.outline ? t.outline.length : 0} محوراً مخطّطاً</span>`}
  </div>
</a>`;
}

function statBlock(items) {
  return `<div class="stats">${items
    .map((s) => `<div class="stat"><div class="stat-num gradient-text">${esc(s.n)}</div><div class="stat-label">${esc(s.l)}</div></div>`)
    .join('')}</div>`;
}

/* ------------------------------------------------------------------ */
/* 1) الصفحة الرئيسية                                                  */
/* ------------------------------------------------------------------ */
function buildHome() {
  const heroArt = `<svg viewBox="0 0 420 320" role="img" aria-label="نافذة محرّر كود" style="width:100%;max-width:440px">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/><stop offset="55%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <rect x="10" y="18" width="400" height="284" rx="26" fill="url(#g1)" opacity=".16"/>
  <rect x="30" y="4" width="360" height="266" rx="22" fill="#0f1729"/>
  <circle cx="56" cy="30" r="6" fill="#ff5f57"/><circle cx="76" cy="30" r="6" fill="#febc2e"/><circle cx="96" cy="30" r="6" fill="#28c840"/>
  <rect x="52" y="60"  width="120" height="10" rx="5" fill="#c084fc"/>
  <rect x="180" y="60" width="70"  height="10" rx="5" fill="#86efac"/>
  <rect x="68" y="86"  width="90"  height="10" rx="5" fill="#67e8f9"/>
  <rect x="166" y="86" width="140" height="10" rx="5" fill="#fbbf24"/>
  <rect x="68" y="112" width="150" height="10" rx="5" fill="#86efac"/>
  <rect x="52" y="138" width="60"  height="10" rx="5" fill="#f472b6"/>
  <rect x="68" y="164" width="180" height="10" rx="5" fill="#60a5fa"/>
  <rect x="68" y="190" width="110" height="10" rx="5" fill="#fdba74"/>
  <rect x="52" y="216" width="80"  height="10" rx="5" fill="#c084fc"/>
  <rect x="30" y="248" width="360" height="22" rx="0" fill="#111a2e"/>
  <rect x="52" y="255" width="70" height="8" rx="4" fill="#334155"/>
  <rect x="132" y="255" width="46" height="8" rx="4" fill="#334155"/>
</svg>`;

  const groups = [...new Set(tracks.map((t) => t.group))];

  const content = `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="eyebrow">${icon('rocket')} مسار تطوير الويب الكامل</span>
      <h1>تعلّم <span class="gradient-text">تطوير الويب</span> بالعربية،<br>من أول وسم حتى تطبيق كامل</h1>
      <p class="lead">منهج متدرّج مبني على مسارات مترابطة: كل درس فيه شرح وافٍ، أمثلة كود قابلة للنسخ، عرض حيّ للنتيجة، أخطاء شائعة، تمارين تطبيقية، واختبار قصير يقيس فهمك.</p>
      <div class="hero-cta">
        <a class="btn btn-primary" href="tracks/html/index.html">${icon('play')} ابدأ من الدرس الأول</a>
        <a class="btn btn-ghost" href="roadmap.html">${icon('map')} شاهد خريطة الطريق</a>
      </div>
      ${statBlock([
        { n: '+' + totals.lessons, l: 'درساً مكتوباً بالكامل' },
        { n: '+' + Math.round(totals.minutes / 60), l: 'ساعة تعليمية' },
        { n: '+' + totals.exercises, l: 'تمريناً تطبيقياً' },
        { n: totals.tracks, l: 'مساراً في المجال' }
      ])}
    </div>
    <div class="hero-art">${heroArt}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head center">
      <h2>ما الذي يجعل هذه المنصة مختلفة؟</h2>
      <p>ليست مجرد صفحات شرح — بل منهج مصمَّم ليأخذك من الفهم إلى التطبيق.</p>
    </div>
    <div class="grid grid-3">
      ${[
        { i: 'book', t: 'شرح عميق لا سطحي', d: 'كل مفهوم يُشرح بـ«لماذا» قبل «كيف»، مع ربطه بما قبله وما بعده في المسار.' },
        { i: 'eye', t: 'عرض حيّ لكل مثال', d: 'ترى نتيجة الكود مباشرة داخل الصفحة في إطار معزول، بدون الحاجة لفتح محرّر.' },
        { i: 'x', t: 'أخطاء شائعة مقابلة', d: 'مقارنة صريحة بين الكتابة الخاطئة والصحيحة مع تفسير سبب الخطأ.' },
        { i: 'edit', t: 'تمارين بحلول', d: 'تمرين تطبيقي في نهاية كل درس مع تلميحات وحل مقترح مطوي.' },
        { i: 'target', t: 'اختبار بعد كل درس', d: 'أسئلة قصيرة مع شرح لكل إجابة، ونتيجة فورية تقيس استيعابك.' },
        { i: 'shield', t: 'يعمل بلا إنترنت', d: 'لا اعتماد على أي مكتبة خارجية — افتح الملفات مباشرة وستعمل كاملة.' }
      ].map((f) => `<article class="card"><span class="card-icon">${icon(f.i)}</span><h3>${f.t}</h3><p>${f.d}</p></article>`).join('')}
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <div class="section-head center">
      <h2>مسارات مجال تطوير الويب</h2>
      <p>ابدأ بالأساسيات الثلاثة ثم تفرّع نحو التخصص الذي يناسبك.</p>
    </div>
    ${groups.map((g) => `
      <h3 style="margin:var(--space-6) 0 var(--space-4);font-size:1.25rem">${esc(g)}</h3>
      <div class="grid grid-3">${trackData.filter((t) => t.group === g).map((t) => trackCard(t, '')).join('')}</div>
    `).join('')}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head center">
      <h2>كيف تدرس على المنصة؟</h2>
      <p>خطوات بسيطة تكرّرها مع كل درس فتتحوّل المعرفة إلى مهارة.</p>
    </div>
    <div class="roadmap">
      ${[
        ['اقرأ أهداف الدرس', 'اعرف من البداية ما الذي ستكون قادراً على فعله عند انتهائك من الدرس.'],
        ['افهم الشرح والأمثلة', 'اقرأ الشرح ثم انظر إلى العرض الحيّ لتربط الكود بالنتيجة.'],
        ['أعد كتابة الكود بنفسك', 'انسخ المثال في محرّرك، ثم غيّر فيه عمداً وراقب ماذا يحدث.'],
        ['حلّ التمرين قبل رؤية الحل', 'التمرين هو مكان التعلّم الحقيقي؛ الحل المطوي للمراجعة فقط.'],
        ['اختبر نفسك وعلّم الدرس كمكتمل', 'الاختبار يكشف الثغرات، وشريط التقدّم يبقيك على المسار.']
      ].map(([t, d], i) => `<div class="roadmap-step"><span class="step-n">${arabicNum(i + 1)}</span><div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}
    </div>
  </div>
</section>`;

  write('index.html', page({
    title: `${SITE.name} — تعلّم تطوير الويب بالعربية`,
    description: SITE.tagline,
    active: 'home',
    prefix: '',
    tracks,
    content
  }));
}

/* ------------------------------------------------------------------ */
/* 2) صفحة كل المسارات                                                 */
/* ------------------------------------------------------------------ */
function buildTracksPage() {
  const groups = [...new Set(tracks.map((t) => t.group))];

  const soonDetails = trackData.filter((t) => t.status === 'soon').map((t) => `
<article class="card" id="${t.id}-outline" data-search-text="${esc(t.name + ' ' + t.tagline)}">
  <span class="card-icon" style="--track:var(--brand-500)">${icon(t.icon)}</span>
  <h3>${esc(t.name)} <span class="badge">قريباً</span></h3>
  <p>${esc(t.desc)}</p>
  <p style="margin-top:1rem"><strong>محاور المنهج المخطّطة:</strong></p>
  <ol style="margin-inline-start:1.2rem;color:var(--text-muted);font-size:.94rem">
    ${(t.outline || []).map((o) => `<li>${esc(o)}</li>`).join('')}
  </ol>
  <div class="track-meta"><span>${icon('info')} المتطلّب السابق: ${esc(t.prerequisites)}</span></div>
</article>`).join('');

  const content = `
<section class="section">
  <div class="container">
    <div class="section-head">
      <h1>كل مسارات تطوير الويب</h1>
      <p>${tracks.length} مساراً مقسّمة على أربع مجموعات. المسارات المنشورة تحتوي دروساً كاملة، والباقي معلن بمنهجه التفصيلي.</p>
    </div>

    <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;align-items:center;margin-bottom:var(--space-6)">
      <div class="search-box">
        <input type="search" placeholder="ابحث عن مسار أو تقنية…" data-search-for="#allTracks" aria-label="بحث في المسارات">
        ${icon('search')}
      </div>
      ${statBlock([{ n: String(totals.lessons), l: 'درس منشور' }, { n: String(tracks.length), l: 'مسار' }])}
    </div>

    <div id="allTracks">
      ${groups.map((g) => `
        <h3 style="margin:var(--space-6) 0 var(--space-4);font-size:1.3rem">${esc(g)}</h3>
        <div class="grid grid-3">${trackData.filter((t) => t.group === g).map((t) => trackCard(t, '')).join('')}</div>
      `).join('')}
    </div>
    <p class="no-results">لا توجد نتائج مطابقة لبحثك.</p>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <div class="section-head">
      <h2>مناهج المسارات القادمة</h2>
      <p>هذه المحاور معلنة مسبقاً حتى تعرف إلى أين يقودك المسار قبل أن يُنشر محتواه.</p>
    </div>
    <div class="grid grid-2">${soonDetails}</div>
  </div>
</section>`;

  write('tracks.html', page({
    title: 'كل المسارات — ' + SITE.name,
    description: 'قائمة مسارات تطوير الويب في منصة CodeWay Web ومناهجها التفصيلية.',
    active: 'tracks',
    prefix: '',
    tracks,
    content
  }));
}

/* ------------------------------------------------------------------ */
/* 3) خريطة الطريق                                                     */
/* ------------------------------------------------------------------ */
function buildRoadmap() {
  const phases = [
    {
      n: 'المرحلة 1', t: 'الأساس المتين', d: 'لا يمكن بناء أي شيء على الويب دون هذه الثلاثة. خذ وقتك هنا؛ كل ما بعدها يعتمد عليها.',
      items: ['HTML — هيكل الصفحة ومعناها', 'CSS — التنسيق والتخطيط والتجاوب', 'JavaScript — المنطق والتفاعل'],
      months: 'من 2 إلى 4 أشهر'
    },
    {
      n: 'المرحلة 2', t: 'أدوات المطوّر', d: 'قبل أن تكبر مشاريعك، تحتاج أدوات تحفظ عملك وتنظّمه وتنشره.',
      items: ['Git & GitHub — إدارة الإصدارات', 'سطر الأوامر و npm', 'أدوات المطوّر في المتصفح', 'النشر على الإنترنت'],
      months: 'من 3 إلى 5 أسابيع'
    },
    {
      n: 'المرحلة 3', t: 'التخصّص في الواجهة الأمامية', d: 'انتقل من الصفحات المفردة إلى التطبيقات المكوّنة من مكوّنات.',
      items: ['TypeScript', 'React أو Vue (اختر واحداً وأتقنه)', 'Tailwind أو منهجية CSS منظّمة', 'إدارة الحالة والتوجيه'],
      months: 'من 3 إلى 5 أشهر'
    },
    {
      n: 'المرحلة 4', t: 'الواجهة الخلفية وقواعد البيانات', d: 'لتبني تطبيقاً حقيقياً تحتاج خادماً يحفظ البيانات ويحمي المستخدمين.',
      items: ['Node.js و Express', 'REST APIs وتصميمها', 'SQL وقواعد البيانات العلائقية', 'المصادقة والصلاحيات'],
      months: 'من 3 إلى 4 أشهر'
    },
    {
      n: 'المرحلة 5', t: 'الاحتراف', d: 'الفرق بين من يكتب كوداً يعمل ومن يكتب كوداً يصمد.',
      items: ['الاختبارات الآلية', 'الأداء وتحسين التحميل', 'إمكانية الوصول و SEO التقني', 'الأمان وأفضل الممارسات', 'مشاريع كبيرة في معرض أعمالك'],
      months: 'مستمرّ'
    }
  ];

  const content = `
<section class="section">
  <div class="container">
    <div class="section-head">
      <h1>خريطة طريق مطوّر الويب</h1>
      <p>ترتيب منطقي للتعلّم يمنع القفز المبكر إلى الأدوات المتقدّمة قبل ترسيخ الأساس. المدد تقديرية لمن يدرس ساعة إلى ساعتين يومياً.</p>
    </div>

    <div class="grid" style="gap:var(--space-5)">
      ${phases.map((p, i) => `
      <article class="card">
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-3);align-items:center;margin-bottom:var(--space-3)">
          <span class="badge badge-brand">${esc(p.n)}</span>
          <h3 style="margin:0">${esc(p.t)}</h3>
          <span class="badge" style="margin-inline-start:auto">${icon('clock')} ${esc(p.months)}</span>
        </div>
        <p>${esc(p.d)}</p>
        <ul style="margin:var(--space-3) 0 0 1.2rem;color:var(--text-muted)">
          ${p.items.map((x) => `<li>${esc(x)}</li>`).join('')}
        </ul>
      </article>`).join('')}
    </div>

    <div class="callout callout-tip" style="margin-top:var(--space-7)">
      <div class="callout-title">${icon('bulb')} قاعدة ذهبية</div>
      <p>لا تنتقل إلى مرحلة جديدة لمجرد أنك «قرأت» عن السابقة. الانتقال الصحيح يكون بعد أن تبني مشروعاً من الصفر بأدوات المرحلة الحالية دون العودة للشرح في كل خطوة.</p>
    </div>
  </div>
</section>`;

  write('roadmap.html', page({
    title: 'خريطة الطريق — ' + SITE.name,
    description: 'خريطة طريق مرتّبة لتعلّم تطوير الويب من الصفر حتى الاحتراف.',
    active: 'roadmap', prefix: '', tracks, content, lessonCss: true
  }));
}

/* ------------------------------------------------------------------ */
/* 4) عن المنصة                                                        */
/* ------------------------------------------------------------------ */
function buildAbout() {
  const content = `
<section class="section">
  <div class="container" style="max-width:860px">
    <div class="section-head"><h1>عن المنصة</h1></div>
    <div class="lesson-main">
      <h2 id="sec-1">لماذا CodeWay Web؟</h2>
      <p>معظم المحتوى العربي في تطوير الويب إمّا مترجَم حرفياً فيصعب فهمه، أو مختصر جداً فيترك المتعلّم في منتصف الطريق. هذه المنصة تحاول شيئاً ثالثاً: <strong>شرح عربي أصيل ومتدرّج</strong>، كل درس فيه يفترض أنك قرأت ما قبله ولم تقرأ ما بعده.</p>

      <h2 id="sec-2">كيف بُني المحتوى؟</h2>
      <p>كل درس مكتوب على شكل بلوكات منظّمة (شرح، كود، عرض حيّ، جدول، مقارنة خطأ/صواب، تمرين، اختبار)، ثم يولّد مُولّد ثابت صفحات HTML جاهزة منها. هذا يضمن أن كل الدروس تتبع البنية نفسها ولا يختلف درس عن آخر في الجودة أو التنسيق.</p>

      <div class="feature-grid">
        <div class="feature"><div class="fi">${icon('shield')}</div><h4>بلا اعتماديات</h4><p>لا مكتبات خارجية ولا CDN؛ الموقع يعمل كاملاً بلا إنترنت.</p></div>
        <div class="feature"><div class="fi">${icon('eye')}</div><h4>وضع ليلي</h4><p>ثيم فاتح وداكن يتبع تفضيل نظامك ويمكن تبديله يدوياً.</p></div>
        <div class="feature"><div class="fi">${icon('phone')}</div><h4>متجاوب</h4><p>تجربة قراءة مريحة على الجوال واللوحي والحاسب.</p></div>
        <div class="feature"><div class="fi">${icon('users')}</div><h4>إمكانية وصول</h4><p>عناصر دلالية، تباين كافٍ، ودعم كامل للوحة المفاتيح.</p></div>
      </div>

      <h2 id="sec-3">كيف تساهم؟</h2>
      <p>المحتوى مفتوح: كل درس ملف واحد داخل <code>content/&lt;المسار&gt;/</code>. أضف درساً أو صحّح معلومة، ثم شغّل أمر البناء وستُولَّد الصفحات تلقائياً.</p>
      ${render([{ t: 'code', lang: 'bash', title: 'إعادة بناء الموقع', code: 'node tools/build.js' }], {})}

      <h2 id="sec-4">تنويه</h2>
      <p>الأرقام المعروضة في الصفحات (عدد المتدرّبين ونحوه) توضيحية للواجهة فقط، ولا تمثّل إحصاءات فعلية. أمّا أعداد الدروس والساعات فمحسوبة آلياً من المحتوى الحقيقي.</p>
    </div>
  </div>
</section>`;

  write('about.html', page({
    title: 'عن المنصة — ' + SITE.name,
    description: 'فكرة منصة CodeWay Web وطريقة بناء محتواها.',
    active: 'about', prefix: '', tracks, content, lessonCss: true
  }));
}

/* ------------------------------------------------------------------ */
/* 5) صفحة المسار                                                      */
/* ------------------------------------------------------------------ */
function buildTrackIndex(t) {
  const prefix = '../../';
  const minutes = t.lessons.reduce((a, l) => a + (l.duration || 0), 0);
  const levels = [...new Set(t.lessons.map((l) => l.level))];

  const cards = t.lessons.map((l, i) => `
<a class="card lesson-card" href="${l.slug}.html" data-lesson-id="${t.id}/${l.slug}"
   data-search-text="${esc(l.title + ' ' + l.summary + ' ' + (l.tags || []).join(' '))}">
  <span class="num">${i + 1}</span>
  <h3>${esc(l.title)}</h3>
  <p>${esc(l.summary)}</p>
  <div class="track-meta">
    <span>${icon('clock')} ${l.duration} د</span>
    <span class="badge level-${esc(l.level)}">${esc(l.level)}</span>
    <span class="done-flag">${icon('check')} مكتمل</span>
  </div>
</a>`).join('');

  const content = `
<div class="container">
  <nav class="breadcrumb" aria-label="مسار التنقّل">
    <ol>
      <li><a href="${prefix}index.html">الرئيسية</a></li>
      <li><a href="${prefix}tracks.html">المسارات</a></li>
      <li aria-current="page">${esc(t.name)}</li>
    </ol>
  </nav>
</div>

<section class="hero" style="padding-top:var(--space-6)">
  <div class="container">
    <span class="eyebrow">${icon(t.icon)} ${esc(t.group)}</span>
    <h1>مسار <span class="gradient-text">${esc(t.name)}</span></h1>
    <p class="lead">${esc(t.desc)}</p>
    <div class="hero-cta">
      <a class="btn btn-primary" href="${t.lessons[0].slug}.html">${icon('play')} ابدأ من الدرس الأول</a>
      <a class="btn btn-ghost" href="${prefix}tracks.html">${icon('layers')} كل المسارات</a>
    </div>
    ${statBlock([
      { n: String(t.lessons.length), l: 'درساً' },
      { n: fmtDuration(minutes), l: 'زمن الدراسة' },
      { n: String(t.lessons.reduce((a, l) => a + l.blocks.filter((b) => b.t === 'exercise').length, 0)), l: 'تمريناً' },
      { n: String(t.lessons.reduce((a, l) => a + l.blocks.filter((b) => b.t === 'quiz').reduce((x, b) => x + b.items.length, 0), 0)), l: 'سؤالاً' }
    ])}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="card" style="margin-bottom:var(--space-6)" data-track-progress="${t.id}" data-total="${t.lessons.length}">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:.7rem">
        <strong>تقدّمك في المسار</strong>
        <span class="muted" data-progress-label>لم تبدأ بعد</span>
      </div>
      <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:0%"></div></div>
      <p style="margin-top:.8rem;font-size:.9rem" class="muted">${icon('info')} يُحفظ تقدّمك في متصفحك فقط (localStorage) ولا يُرسل لأي جهة.</p>
    </div>

    <div class="section-head">
      <h2>دروس المسار</h2>
      <p>المستويات المتوفّرة: ${levels.map((l) => `<span class="badge level-${esc(l)}">${esc(l)}</span>`).join(' ')} — المتطلّب السابق: ${esc(t.prerequisites)}</p>
    </div>

    <div class="search-box" style="margin-bottom:var(--space-5)">
      <input type="search" placeholder="ابحث في دروس ${esc(t.name)}…" data-search-for="#lessonGrid" aria-label="بحث في الدروس">
      ${icon('search')}
    </div>

    <div class="grid grid-3" id="lessonGrid">${cards}</div>
    <p class="no-results">لا توجد دروس مطابقة لبحثك.</p>
  </div>
</section>`;

  write(`tracks/${t.id}/index.html`, page({
    title: `مسار ${t.name} — ${SITE.name}`,
    description: t.desc,
    active: 'tracks', prefix, tracks, track: t.id, content, lessonCss: true
  }));
}

/* ------------------------------------------------------------------ */
/* 6) صفحة الدرس                                                       */
/* ------------------------------------------------------------------ */
function buildLesson(t, lesson, index) {
  const prefix = '../../';
  const ctx = { headings: [] };

  const objectives = lesson.objectives && lesson.objectives.length
    ? `<div class="objectives"><h2>${icon('target')} ماذا ستتعلّم في هذا الدرس؟</h2><ul>${lesson.objectives.map((o) => `<li>${inline(o)}</li>`).join('')}</ul></div>`
    : '';

  const body = render(lesson.blocks, ctx);

  const toc = ctx.headings.length
    ? `<div class="side-card toc">
        <h3>محتويات الدرس</h3>
        <ol>${ctx.headings.map((h) => `<li${h.level === 3 ? ' class="sub"' : ''}><a href="#${h.id}">${esc(plain(h.text))}</a></li>`).join('')}</ol>
      </div>`
    : '';

  const quickRef = lesson.quickRef && lesson.quickRef.length
    ? `<div class="side-card"><h3>مرجع سريع</h3>${lesson.quickRef.map((r) => `<div class="ref-item"><code>${esc(r.code)}</code><small>${esc(r.desc)}</small></div>`).join('')}</div>`
    : '';

  const prev = index > 0 ? t.lessons[index - 1] : null;
  const next = index < t.lessons.length - 1 ? t.lessons[index + 1] : null;

  const nav = `<nav class="lesson-nav" aria-label="التنقّل بين الدروس">
  ${prev
    ? `<a class="prev" href="${prev.slug}.html">${icon('arrow-right')}<span><small>الدرس السابق</small><b>${esc(prev.title)}</b></span></a>`
    : `<a class="prev" href="index.html">${icon('arrow-right')}<span><small>العودة إلى</small><b>صفحة المسار</b></span></a>`}
  ${next
    ? `<a class="next" href="${next.slug}.html"><span><small>الدرس التالي</small><b>${esc(next.title)}</b></span>${icon('arrow-left')}</a>`
    : `<a class="next" href="${prefix}tracks.html"><span><small>أنهيت المسار 🎉</small><b>تصفّح بقية المسارات</b></span>${icon('arrow-left')}</a>`}
</nav>`;

  const content = `
<div class="read-progress"></div>
<div class="container">
  <nav class="breadcrumb" aria-label="مسار التنقّل">
    <ol>
      <li><a href="${prefix}index.html">الرئيسية</a></li>
      <li><a href="${prefix}tracks.html">المسارات</a></li>
      <li><a href="index.html">${esc(t.name)}</a></li>
      <li aria-current="page">${esc(lesson.title)}</li>
    </ol>
  </nav>

  <header class="lesson-hero">
    <div class="kicker">
      <span class="badge badge-brand">${icon('book')} الدرس ${index + 1} من ${t.lessons.length}</span>
      <span class="badge level-${esc(lesson.level)}">${esc(lesson.level)}</span>
      ${(lesson.tags || []).map((g) => `<span class="badge">${esc(g)}</span>`).join('')}
    </div>
    <h1>${esc(lesson.title)}</h1>
    <p class="summary">${esc(lesson.summary)}</p>
    <div class="lesson-facts">
      <span>${icon('clock')} ${lesson.duration} دقيقة</span>
      <span>${icon('layers')} مسار ${esc(t.name)}</span>
      <span>${icon('target')} ${lesson.blocks.filter((b) => b.t === 'quiz').reduce((a, b) => a + b.items.length, 0)} أسئلة</span>
      <span>${icon('edit')} ${lesson.blocks.filter((b) => b.t === 'exercise').length} تمرين</span>
    </div>
  </header>

  <div class="lesson-layout">
    <article class="lesson-main">
      ${objectives}
      ${body}
      <div class="complete-box">
        <p>${icon('award')} أنهيت قراءة الدرس؟ علّمه كمكتمل ليُحتسب في تقدّمك.</p>
        <button type="button" class="btn btn-primary mark-done" data-lesson-id="${t.id}/${lesson.slug}" aria-pressed="false">
          ${icon('check')} <span data-label>تعليم الدرس كمكتمل</span>
        </button>
      </div>
      ${nav}
    </article>

    <aside class="lesson-side">
      <div class="side-card">
        <h3>تقدّمك في مسار ${esc(t.name)}</h3>
        <div class="ring-wrap" data-ring data-track="${t.id}" data-total="${t.lessons.length}">
          <svg width="130" height="130" viewBox="0 0 130 130">
            <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#ec4899"/>
            </linearGradient></defs>
            <circle class="ring-bg" cx="65" cy="65" r="55"/>
            <circle class="ring-fg" cx="65" cy="65" r="55" stroke-dasharray="345" stroke-dashoffset="345"/>
          </svg>
          <span class="ring-label">0٪</span>
        </div>
        <p class="text-center muted" style="font-size:.9rem" data-ring-text>لم تبدأ بعد</p>
        <a class="btn btn-ghost btn-block btn-sm" href="index.html" style="margin-top:.8rem">${icon('list')} كل دروس المسار</a>
      </div>
      ${toc}
      ${quickRef}
      <div class="side-card">
        <h3>خطوتك التالية</h3>
        <div class="side-links">
          ${next ? `<a class="side-link" href="${next.slug}.html"><i>${icon('arrow-left')}</i><span>${esc(next.title)}<small>الدرس التالي</small></span></a>` : ''}
          <a class="side-link" href="${prefix}roadmap.html"><i>${icon('map')}</i><span>خريطة الطريق<small>أين أنت من الصورة الكاملة</small></span></a>
          <a class="side-link" href="${prefix}tracks.html"><i>${icon('layers')}</i><span>كل المسارات<small>${tracks.length} مساراً</small></span></a>
        </div>
      </div>
    </aside>
  </div>
</div>`;

  write(`tracks/${t.id}/${lesson.slug}.html`, page({
    title: `${lesson.title} — مسار ${t.name} | ${SITE.name}`,
    description: lesson.summary,
    active: 'tracks', prefix, tracks, track: t.id, content, lessonCss: true,
    scripts: ['assets/js/lesson.js']
  }));
}

/* ------------------------------------------------------------------ */
/* التنفيذ                                                             */
/* ------------------------------------------------------------------ */
function main() {
  let count = 0;

  buildHome(); count++;
  buildTracksPage(); count++;
  buildRoadmap(); count++;
  buildAbout(); count++;

  for (const t of readyTracks) {
    buildTrackIndex(t); count++;
    t.lessons.forEach((l, i) => { buildLesson(t, l, i); count++; });
  }

  console.log(`✅ تم توليد ${count} صفحة.`);
  console.log(`   المسارات المنشورة: ${readyTracks.map((t) => `${t.name} (${t.lessons.length})`).join('، ') || 'لا يوجد'}`);
  console.log(`   إجمالي الدروس: ${totals.lessons} — الزمن: ${Math.round(totals.minutes / 60)} ساعة — التمارين: ${totals.exercises}`);
}

main();
