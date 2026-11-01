/* ==========================================================
   الصفحة الرئيسية
   ========================================================== */
CW.pages.home = function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc, $ = CW.$;
  var main = document.getElementById("main");

  /* ---------- Hero ---------- */
  var demoCareer = CW.find("careers", "frontend-developer");
  var stages = CW.buildRoadmap(demoCareer);
  var hero = '<section class="home-hero"><div class="container hero-grid">' +
    '<div class="hero-copy">' +
    '<span class="hero-eyebrow"><span class="dot"></span><bdi>CodeWay</bdi> — طريقك نحو احتراف البرمجة</span>' +
    '<h1>تعلّم البرمجة <span class="hl">بخطة واضحة</span><br>من أول سطر حتى أول وظيفة</h1>' +
    '<p class="hero-lead">لغات البرمجة والأدوات والمجالات والمسارات المهنية في منصة عربية واحدة، مع خرائط تعلم مرئية ومشاريع عملية تبني بها معرض أعمالك.</p>' +
    '<form class="hero-search" id="heroSearch" role="search" action="' + R.explore() + '" method="get">' +
    '<div class="search-bar lg">' + icon("search", "ic-lg") +
    '<input type="search" name="q" id="heroQ" placeholder="ماذا تريد أن تتعلم اليوم؟ مثل: Python، React، تحليل البيانات" autocomplete="off" aria-label="ابحث في المنصة">' +
    '<button class="btn btn-primary" type="submit">بحث</button></div>' +
    '<div class="hero-suggest" id="heroSuggest" hidden></div></form>' +
    '<div class="hero-cta">' +
    '<a class="btn btn-light btn-lg" href="' + R.careers() + '">' + icon("route") + "استكشف مسارات التعلم</a>" +
    '<a class="btn btn-ghost-light btn-lg" href="' + R.languages() + '">' + icon("code") + "استكشف لغات البرمجة</a></div>" +
    '<ul class="hero-facts">' +
    [[D.languages.length, "لغة برمجة"], [D.tools.length, "أداة وتقنية"], [D.fields.length, "مجالاً برمجياً"], [D.careers.length, "مساراً مهنياً"]].map(function (f) {
      return "<li><b>" + f[0] + "</b> " + f[1] + "</li>";
    }).join("") + "</ul></div>" +

    /* اللوحة البصرية: خارطة مسار مصغرة + نافذة كود */
    '<div class="hero-visual" aria-hidden="true">' +
    '<div class="hv-card hv-roadmap"><div class="hv-head"><span class="icon-tile sm">' + icon("route") + '</span><div><small>مثال على خارطة مسار</small><strong>' + esc(demoCareer.name) + "</strong></div></div>" +
    '<ol class="hv-steps">' + stages.map(function (s, i) {
      return '<li class="' + (i < 1 ? "done" : i === 1 ? "current" : "") + '"><span class="n">' + (i < 1 ? icon("check", "ic-xs") : s.n) + "</span><span>" + esc(s.title) + "</span></li>";
    }).join("") + "</ol></div>" +
    '<div class="hv-card hv-code"><div class="code-head"><span class="dots"><i></i><i></i><i></i></span><span>app.js</span></div>' +
    '<pre><span class="tk-k">const</span> path = <span class="tk-f">startLearning</span>(<span class="tk-s">"Front-End"</span>);\n' +
    'path.<span class="tk-f">next</span>();   <span class="tk-c">// المرحلة التالية</span>\n' +
    '<span class="tk-k">await</span> path.<span class="tk-f">build</span>(<span class="tk-s">"portfolio"</span>);</pre></div>' +
    '<div class="hv-chip c1">' + CW.mono(CW.find("languages", "python"), "xs") + "Python</div>" +
    '<div class="hv-chip c2">' + CW.mono(CW.find("tools", "react"), "xs") + "React</div>" +
    '<div class="hv-chip c3">' + CW.mono(CW.find("tools", "docker"), "xs") + "Docker</div>" +
    "</div></div></section>";

  /* ---------- لغات البرمجة ---------- */
  var langs = '<section class="section"><div class="container">' +
    '<div class="section-head row reveal"><div><span class="eyebrow">' + icon("code") + "لغات البرمجة</span><h2>اختر لغتك وابدأ رحلة التعلم</h2><p>من الأساسيات حتى التطبيق العملي، لكل لغة مسار منظم بوحدات ودروس ومشاريع.</p></div>" +
    '<a class="btn btn-outline" href="' + R.languages() + '">جميع اللغات (' + D.languages.length + ")" + icon("arrowL", "ic-sm") + "</a></div>" +
    '<div class="grid grid-4">' + D.languages.slice(0, 8).map(function (l) { return CW.cards.language(l); }).join("") + "</div></div></section>";

  /* ---------- الأدوات (تبويبات) ---------- */
  var cats = D.toolCategories;
  var tools = '<section class="section section-white"><div class="container">' +
    '<div class="section-head center reveal"><span class="eyebrow">' + icon("wrench") + "الأدوات والتقنيات</span><h2>الأدوات التي تحتاجها لبناء مشاريعك</h2><p>تقنيات مصنّفة حسب الاستخدام لتعرف ما تحتاجه في كل مرحلة.</p></div>" +
    '<div class="home-tools reveal"><div class="tabs" role="tablist" data-tabs aria-label="تصنيفات الأدوات">' +
    cats.map(function (c, i) {
      return '<button class="tab" role="tab" id="ht-' + c.id + '" aria-controls="hp-' + c.id + '" aria-selected="' + (i === 0) + '">' + icon(c.icon, "ic-sm") + (c.short || c.name) +
        '<span class="count">' + D.tools.filter(function (t) { return t.cat === c.id; }).length + "</span></button>";
    }).join("") + "</div>" +
    cats.map(function (c) {
      return '<div class="tab-panel" role="tabpanel" id="hp-' + c.id + '" aria-labelledby="ht-' + c.id + '" hidden>' +
        '<div class="grid grid-4 mt-6">' + D.tools.filter(function (t) { return t.cat === c.id; }).map(function (t) { return CW.cards.tool(t); }).join("") + "</div>" +
        '<div class="text-center mt-6"><a class="link-arrow" href="' + R.tools(c.id) + '">كل أدوات ' + esc(c.name) + icon("arrowL", "ic-xs") + "</a></div></div>";
    }).join("") + "</div></div></section>";

  /* ---------- المجالات (شبكة استكشافية) ---------- */
  var fields = '<section class="section"><div class="container">' +
    '<div class="section-head row reveal"><div><span class="eyebrow">' + icon("compass") + "المجالات البرمجية</span><h2>اكتشف المجال الذي يناسب طموحك</h2><p>لكل مجال مهاراته وأدواته ومساراته المهنية.</p></div>" +
    '<a class="btn btn-outline" href="' + R.fields() + '">كل المجالات' + icon("arrowL", "ic-sm") + "</a></div>" +
    '<div class="field-mosaic">' + D.fields.map(function (f, i) {
      return '<a class="fm-item reveal" href="' + R.field(f.id) + '" style="--fc:' + f.color + '"><span class="fm-ic">' + icon(f.icon) + '</span><span class="fm-txt"><strong>' + esc(f.name) + '</strong><small class="ltr">' + esc(f.en) + "</small></span></a>";
    }).join("") + "</div></div></section>";

  /* ---------- المسارات المهنية (قائمة + معاينة الخارطة) ---------- */
  var featured = D.careers.filter(function (c) { return c.featured; });
  var careers = '<section class="section section-white"><div class="container">' +
    '<div class="section-head row reveal"><div><span class="eyebrow">' + icon("route") + "المسارات المهنية</span><h2>اختر مسارك المهني وشاهد طريقك بوضوح</h2><p>كل مسار خارطة تعلم مرئية من الأساسيات حتى الاحتراف.</p></div>" +
    '<a class="btn btn-outline" href="' + R.careers() + '">جميع المسارات (' + D.careers.length + ")" + icon("arrowL", "ic-sm") + "</a></div>" +
    '<div class="career-explorer reveal"><div class="ce-list" role="tablist" aria-label="مسارات مختارة">' +
    featured.map(function (c, i) {
      var cat = D.careerCategories[c.cat];
      return '<button class="ce-item" role="tab" aria-selected="' + (i === 0) + '" data-career="' + c.id + '" style="--cat:' + cat.color + '"><span class="icon-tile sm">' + icon(c.icon) + '</span><span><strong>' + esc(c.name) + "</strong><small>" + cat.name + "</small></span></button>";
    }).join("") + '</div><div class="ce-preview" id="cePreview" role="tabpanel" aria-live="polite"></div></div></div></section>';

  /* ---------- الذكاء الاصطناعي ---------- */
  var ai = '<section class="section-sm"><div class="container"><div class="home-ai">' +
    '<div class="ha-head reveal"><div><span class="eyebrow dark">' + icon("sparkles") + "الذكاء الاصطناعي</span><h2>ادخل عالم الذكاء الاصطناعي</h2></div>" +
    "<p>ستة فروع رئيسية، لكل منها موضوعاته وأدواته ومشاريعه ومسارات التعلم المقترحة.</p></div>" +
    '<div class="ha-grid">' + D.aiAreas.map(function (a) {
      return '<a class="ha-card reveal" href="' + R.aiArea(a.id) + '" style="--ac:' + a.color + '"><span class="ha-ic">' + icon(a.icon) + "</span><h3>" + esc(a.name) + '<small class="ltr">' + esc(a.en) + "</small></h3><p>" + esc(a.tagline) + '</p><span class="link-arrow">اكتشف المجال' + icon("arrowL", "ic-xs") + "</span></a>";
    }).join("") + '</div><div class="text-center mt-8"><a class="btn btn-light" href="' + R.ai() + '">استكشف قسم الذكاء الاصطناعي</a></div></div></div></section>';

  /* ---------- علوم الحاسوب ---------- */
  var cs = '<section class="section"><div class="container home-cs">' +
    '<div class="reveal"><span class="eyebrow" style="background:var(--c-accent-50);color:var(--c-accent-600)">' + icon("graduation") + "علوم الحاسوب</span>" +
    "<h2 class=\"mt-4\">أساسيات تصنع منك مبرمجاً أقوى</h2><p class=\"text-muted mt-2\">تتغير الأدوات وتبقى الأساسيات. هذه الموضوعات تجعل فهمك لأي تقنية جديدة أسرع وأعمق.</p>" +
    '<a class="btn btn-dark mt-6" href="' + R.cs() + '">تصفح موضوعات علوم الحاسوب</a></div>' +
    '<ol class="cs-list">' + D.csTopics.map(function (t, i) {
      return '<li class="reveal"><a href="' + R.csTopic(t.id) + '"><span class="num">' + String(i + 1).padStart(2, "0") + "</span>" + icon(t.icon) + "<span>" + esc(t.name) + "</span></a></li>";
    }).join("") + "</ol></div></section>";

  /* ---------- المشاريع ---------- */
  var plan = D.projectPlan, planTotal = Object.keys(plan).reduce(function (s, k) { return s + plan[k]; }, 0);
  var projects = '<section class="section section-white"><div class="container">' +
    '<div class="section-head row reveal"><div><span class="eyebrow">' + icon("rocket") + "المشاريع العملية</span><h2>حوّل ما تتعلمه إلى مشاريع حقيقية</h2><p>خطة من " + planTotal + " مشروع موزعة على أربعة مستويات. النماذج المتاحة الآن هي البداية فقط.</p></div>" +
    '<div class="chip-list" id="homeLevels" role="group" aria-label="تصفية حسب المستوى"><button class="chip active" data-lv="all" aria-pressed="true">الكل</button>' +
    Object.keys(CW.levels).map(function (k) { return '<button class="chip" data-lv="' + k + '" aria-pressed="false">' + CW.levels[k].name + "</button>"; }).join("") + "</div></div>" +
    '<div class="home-projects"><div class="grid grid-3" id="homeProjects"></div>' +
    '<aside class="plan-card card card-pad"><h3 class="block-title">' + icon("target") + "خطة المشاريع</h3>" +
    Object.keys(plan).map(function (k) {
      var have = D.projects.filter(function (p) { return p.level === k; }).length;
      return '<div class="mb-4"><div class="progress-label"><span>' + CW.levels[k].name + "</span><span>" + have + " من " + plan[k] + ' متاح</span></div><div class="progress sm"><span style="--v:' + Math.round(have / plan[k] * 100) + '%"></span></div></div>';
    }).join("") +
    '<p class="text-sm text-muted">تُضاف المشاريع تدريجياً ضمن القوالب الجاهزة.</p><a class="btn btn-soft btn-block mt-4" href="' + R.projects() + '">كل المشاريع</a></aside></div></div></section>';

  /* ---------- كيف تبدأ ---------- */
  var steps = [["target", "اختر هدفك", "وظيفة، مشروع، أو مهارة جديدة."], ["compass", "اختر لغة أو مجالاً", "نقطة البداية المناسبة لهدفك."], ["book", "ابدأ الوحدات والدروس", "تسلسل منظم من الأساسيات."],
    ["code", "طبّق الأمثلة", "اكتب الشيفرة وجرّبها بنفسك."], ["clipboard", "اختبر معرفتك", "اختبارات قصيرة بعد كل وحدة."], ["rocket", "أنجز المشاريع", "ابنِ معرض أعمالك خطوة بخطوة."]];
  var start = '<section class="section"><div class="container">' +
    '<div class="section-head center reveal"><span class="eyebrow">' + icon("playCircle") + "كيف تبدأ؟</span><h2>رحلة تعلم واضحة في ست خطوات</h2></div>" +
    '<ol class="start-steps">' + steps.map(function (s, i) {
      return '<li class="reveal"><span class="st-ic">' + icon(s[0]) + '<span class="st-n">' + (i + 1) + "</span></span><h3>" + s[1] + "</h3><p>" + s[2] + "</p></li>";
    }).join("") + "</ol></div></section>";

  /* ---------- المميزات ---------- */
  var feats = [["book", "محتوى عربي منظم", "وحدات ودروس متسلسلة بلغة عربية واضحة."], ["route", "خرائط تعلم مرئية", "ترى طريقك من البداية حتى الاحتراف."], ["terminal", "محرر أكواد مدمج", "اكتب الشيفرة وجرّبها داخل المنصة."], ["rocket", "مشاريع متدرجة", "من المبتدئ حتى المستوى الاحترافي."],
    ["clipboard", "اختبارات وتدريبات", "قِس تقدمك بعد كل وحدة."], ["layers", "تنوع التقنيات", "لغات وأدوات وأطر لكل المجالات."], ["grid", "لوحة متعلم شخصية", "تتابع فيها مساراتك وإنجازاتك."], ["phone", "تجربة متجاوبة", "تعلّم من أي جهاز بالسهولة نفسها."]];
  var features = '<section class="section section-white"><div class="container home-features">' +
    '<div class="section-head reveal"><span class="eyebrow">' + icon("star") + "لماذا CodeWay؟</span><h2>كل ما تحتاجه لتتعلم البرمجة بثقة</h2><p>صُممت كل تفاصيل المنصة لتجعل رحلتك منظمة وواضحة.</p></div>" +
    '<ul class="feature-list">' + feats.map(function (f) {
      return '<li class="reveal"><span class="icon-tile">' + icon(f[0]) + "</span><div><h3>" + f[1] + "</h3><p>" + f[2] + "</p></div></li>";
    }).join("") + "</ul></div></section>";

  /* ---------- الأسئلة الشائعة ---------- */
  var faq = [["هل يمكنني البدء دون خبرة؟", "نعم. المسارات مصممة لتبدأ معك من الصفر، بدءاً بأساسيات التفكير البرمجي ثم الانتقال التدريجي إلى المفاهيم الأعمق."],
    ["كيف أختار لغة البرمجة المناسبة؟", "ابدأ من هدفك: الويب يبدأ غالباً بـ JavaScript، والبيانات والذكاء الاصطناعي بـ Python، وتطبيقات الهاتف بـ Dart أو Kotlin أو Swift. صفحات المسارات المهنية تقترح اللغة المناسبة لكل هدف."],
    ["ما الفرق بين اللغة والمجال والمسار المهني؟", "اللغة أداة لكتابة الشيفرة، والمجال نوع العمل الذي تستخدم فيه الأدوات، أما المسار المهني فخطة تعلم موجهة نحو وظيفة محددة تجمع اللغات والأدوات والمهارات بترتيب واضح."],
    ["كيف أتعلم من خلال المشاريع؟", "لكل مستوى مشاريع تناسبه مع قائمة متطلبات واضحة. ابدأ بالمتطلبات الأساسية ثم أضف تحسيناتك، واحفظ عملك على GitHub ليصبح جزءاً من معرض أعمالك."],
    ["هل يمكنني استخدام المنصة من الهاتف؟", "نعم، جميع الصفحات متجاوبة وتعمل على الكمبيوتر والتابلت والهاتف."]];
  var faqHtml = '<section class="section"><div class="container home-faq">' +
    '<div class="section-head reveal"><span class="eyebrow">' + icon("help") + "الأسئلة الشائعة</span><h2>إجابات عن أكثر ما يشغلك</h2><p>لم تجد إجابتك؟ <a class=\"link-arrow\" href=\"" + R.info("contact") + "\">تواصل معنا</a></p></div>" +
    '<div class="accordion" data-single>' + faq.map(function (f, i) {
      return '<div class="acc-item"><button class="acc-btn" aria-expanded="false" aria-controls="faq' + i + '">' + f[0] + '<span class="chev">' + icon("chevD", "ic-sm") + '</span></button><div class="acc-panel" id="faq' + i + '"><div><p class="acc-body">' + f[1] + "</p></div></div></div>";
    }).join("") + "</div></div></section>";

  var cta = '<section class="section-sm" style="padding-bottom:80px"><div class="container"><div class="cta-band reveal"><div><h2>خطوتك الأولى نحو الاحتراف تبدأ الآن</h2><p>اختر مسارك، وتابع تقدمك من لوحة المتعلم.</p></div>' +
    '<div class="actions"><a class="btn btn-light btn-lg" href="' + R.careers() + '">اختر مسارك</a><a class="btn btn-ghost-light btn-lg" href="' + R.dashboard() + '">جرّب لوحة المتعلم</a></div></div></div></section>';

  main.innerHTML = hero + langs + tools + fields + careers + ai + cs + projects + start + features + faqHtml + cta;

  /* ---------- تفاعلات ---------- */
  /* اقتراحات البحث الفوري */
  var q = $("#heroQ"), sug = $("#heroSuggest");
  q.addEventListener("input", function () {
    var v = q.value.trim();
    if (!v) { sug.hidden = true; return; }
    var res = CW.search(v).slice(0, 6);
    sug.hidden = false;
    sug.innerHTML = res.length ? res.map(function (e) { return CW.resultItem(e, v); }).join("") +
      '<a class="hs-all" href="' + R.explore({ q: v }) + '">عرض كل النتائج في صفحة الاستكشاف' + icon("arrowL", "ic-xs") + "</a>"
      : '<p class="hs-empty">لا توجد نتائج مطابقة لـ «' + esc(v) + '»</p>';
  });
  document.addEventListener("click", function (e) { if (!e.target.closest("#heroSearch")) sug.hidden = true; });
  q.addEventListener("keydown", function (e) { if (e.key === "Escape") sug.hidden = true; });

  /* معاينة المسار المهني */
  function showCareer(id) {
    var c = CW.find("careers", id), st = CW.buildRoadmap(c), cat = D.careerCategories[c.cat];
    $("#cePreview").innerHTML = '<div class="ce-card" style="--cat:' + cat.color + '"><div class="ce-top"><div><span class="badge" style="background:color-mix(in srgb,' + cat.color + ' 12%,#fff);color:' + cat.color + '">' + cat.name + "</span><h3>" + esc(c.name) + '</h3><p class="text-muted">' + esc(c.tagline) + "</p></div>" +
      '<a class="btn btn-primary" href="' + R.career(id) + '">عرض الخارطة كاملة' + icon("arrowL", "ic-sm") + "</a></div>" +
      '<ol class="mini-roadmap">' + st.map(function (s) {
        return '<li><span class="mr-dot">' + s.n + '</span><div><strong>' + esc(s.title) + '</strong><div class="tag-list">' +
          s.nodes.slice(0, 4).map(function (n) { return '<a class="tag" href="' + n.url + '">' + CW.bdi(n.label) + "</a>"; }).join("") +
          (s.nodes.length ? "" : '<span class="text-sm text-muted">' + esc(s.desc) + "</span>") + "</div></div></li>";
      }).join("") + "</ol></div>";
  }
  CW.$$(".ce-item").forEach(function (b) {
    b.addEventListener("click", function () {
      CW.$$(".ce-item").forEach(function (x) { x.setAttribute("aria-selected", x === b); });
      showCareer(b.getAttribute("data-career"));
    });
  });
  showCareer(featured[0].id);

  /* فلترة مشاريع الصفحة الرئيسية */
  function renderProjects(lv) {
    var list = D.projects.filter(function (p) { return lv === "all" || p.level === lv; }).slice(0, 3);
    $("#homeProjects").innerHTML = list.map(function (p) { return CW.cards.project(p); }).join("");
  }
  $("#homeLevels").addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    CW.$$("#homeLevels .chip").forEach(function (x) { var on = x === b; x.classList.toggle("active", on); x.setAttribute("aria-pressed", on); });
    renderProjects(b.getAttribute("data-lv"));
  });
  renderProjects("all");
};
