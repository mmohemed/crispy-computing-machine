/* ==========================================================
   قسم الذكاء الاصطناعي: الصفحة الرئيسية + صفحات كل مجال
   (نظرة عامة، الموضوعات، الدروس، الأدوات، المشاريع، مسارات التعلم)
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc;

  /* ---------- الصفحة الرئيسية للقسم ---------- */
  CW.pages.aiHome = function () {
    CW.setTitle("الذكاء الاصطناعي");
    var aiCareers = D.careers.filter(function (c) { return c.cat === "ai"; });
    var aiTools = D.tools.filter(function (t) { return t.cat === "ai"; });
    var aiProjects = D.projects.filter(function (p) { return p.fields.some(function (f) { return ["ai", "ml", "dl"].indexOf(f) > -1; }); });
    document.getElementById("main").innerHTML =
      '<header class="ai-hero"><div class="container">' + CW.breadcrumb([["الذكاء الاصطناعي"]]) +
      '<div class="ai-hero-grid"><div><span class="eyebrow dark">' + icon("sparkles") + 'قسم الذكاء الاصطناعي</span>' +
      "<h1>ادخل عالم الذكاء الاصطناعي بخطوات واضحة</h1>" +
      '<p class="lead">ستة مجالات رئيسية، لكل منها موضوعاته ودروسه وأدواته ومشاريعه ومسارات تعلم مقترحة. اختر المجال الذي يثير اهتمامك وابدأ.</p>' +
      '<div class="flex gap-3 wrap mt-6"><a class="btn btn-primary btn-lg" href="' + R.aiArea("ml") + '">ابدأ بتعلم الآلة</a><a class="btn btn-ghost-light btn-lg" href="' + R.careers() + "?cat=ai" + '">مسارات الذكاء الاصطناعي</a></div></div>' +
      /* رسم بسيط للعلاقة بين المجالات */
      '<div class="ai-map" aria-label="العلاقة بين مجالات الذكاء الاصطناعي">' +
      '<a class="ai-node root" href="' + R.aiArea("ml") + '">' + icon("brain") + "تعلم الآلة</a>" +
      '<span class="ai-link l1"></span><a class="ai-node mid" href="' + R.aiArea("dl") + '">' + icon("network") + "التعلم العميق</a>" +
      '<span class="ai-link l2"></span><span class="ai-link l5"></span>' +
      '<div class="ai-leaves">' + ["nlp", "cv", "genai"].map(function (id) { var a = CW.find("aiAreas", id); return '<a class="ai-node leaf" href="' + R.aiArea(id) + '">' + icon(a.icon) + esc(a.name) + "</a>"; }).join("") + "</div>" +
      '<a class="ai-node side" href="' + R.aiArea("rl") + '">' + icon("target") + "التعلم المعزز</a>" +
      "</div></div></div></header>" +

      '<section class="section"><div class="container"><div class="section-head"><h2>مجالات الذكاء الاصطناعي</h2><p>لكل مجال صفحة تفاصيل وموضوعات ودروس وأدوات ومشاريع ومسارات تعلم.</p></div>' +
      '<div class="grid grid-3">' + D.aiAreas.map(function (a) {
        return '<article class="card card-hover ai-area-card" style="--ac:' + a.color + '"><div class="flex items-center gap-3"><span class="icon-tile">' + icon(a.icon) + '</span><div><h3 class="card-title"><a class="card-link" href="' + R.aiArea(a.id) + '">' + esc(a.name) + '</a></h3><span class="text-sm text-muted ltr">' + esc(a.en) + "</span></div></div>" +
          '<p class="card-text mt-4">' + esc(a.tagline) + '</p><div class="ai-area-meta"><span>' + icon("layers", "ic-xs") + a.topics.length + " موضوعات</span><span>" + icon("wrench", "ic-xs") + a.tools.length + " أدوات</span><span>" + icon("route", "ic-xs") + a.careers.length + " مسارات</span></div></article>";
      }).join("") + "</div></div></section>" +

      '<section class="section section-white"><div class="container ai-two">' +
      '<div><h2 class="block-title">' + icon("wrench") + 'المكتبات الأساسية</h2><div class="grid grid-2">' + aiTools.map(CW.cards.tool).join("") + "</div></div>" +
      '<div><h2 class="block-title">' + icon("route") + 'مسارات مهنية</h2><div class="grid">' + aiCareers.slice(0, 5).map(function (c) {
        return CW.cards.mini({ icon: c.icon, title: c.name, sub: c.tagline, url: R.career(c.id), tone: "violet" });
      }).join("") + "</div></div></div></section>" +

      '<section class="section"><div class="container"><div class="section-head row"><div><h2>مشاريع ذكاء اصطناعي</h2><p>مشاريع تطبيقية بمستويات متقدمة واحترافية.</p></div><a class="btn btn-outline" href="' + R.projects({ field: "ai,ml,dl" }) + '">كل المشاريع</a></div>' +
      '<div class="grid grid-3">' + aiProjects.slice(0, 6).map(CW.cards.project).join("") + "</div></div></section>";
  };

  /* ---------- رأس صفحات المجال المشترك ---------- */
  var views = [["area", "نظرة عامة", "info", R.aiArea], ["topics", "الموضوعات", "layers", R.aiTopics], ["lessons", "الدروس", "book", R.aiLessons],
    ["tools", "الأدوات والمكتبات", "wrench", R.aiTools], ["projects", "المشاريع", "rocket", R.aiProjects], ["paths", "مسارات التعلم", "route", R.aiPaths]];
  function areaShell(view, render) {
    var a = CW.find("aiAreas", CW.qs("id"));
    if (!a) { CW.renderNotFound("مجال الذكاء الاصطناعي", "العودة إلى قسم الذكاء الاصطناعي", R.ai()); return; }
    var v = views.filter(function (x) { return x[0] === view; })[0];
    CW.setTitle((view === "area" ? "" : v[1] + " — ") + a.name);
    var crumbs = [["الذكاء الاصطناعي", R.ai()]];
    crumbs.push(view === "area" ? [a.name] : [a.name, R.aiArea(a.id)]);
    if (view !== "area") crumbs.push([v[1]]);
    var others = D.aiAreas.map(function (x) { return '<a class="area-switch' + (x.id === a.id ? " active" : "") + '" href="' + views.filter(function (y) { return y[0] === view; })[0][3](x.id) + '" title="' + esc(x.name) + '">' + icon(x.icon, "ic-sm") + '<span>' + esc(x.name) + "</span></a>"; }).join("");
    document.getElementById("main").innerHTML =
      '<header class="ai-area-hero" style="--ac:' + a.color + '"><div class="container">' + CW.breadcrumb(crumbs) +
      '<div class="area-head"><span class="area-icon">' + icon(a.icon, "ic-xl") + '</span><div><span class="ltr text-sm" style="color:#94A3B8;display:block;text-align:right">' + esc(a.en) + "</span><h1>" + esc(a.name) + '</h1><p class="lead">' + esc(a.tagline) + "</p></div></div>" +
      '<nav class="tabs-line dark-tabs" aria-label="أقسام المجال">' + views.map(function (x) {
        return '<a class="tab' + (x[0] === view ? " active" : "") + '" href="' + x[3](a.id) + '"' + (x[0] === view ? ' aria-current="page"' : "") + ">" + icon(x[2], "ic-sm") + x[1] + "</a>";
      }).join("") + "</nav></div></header>" +
      '<div class="container ai-area-body" style="--ac:' + a.color + '"><nav class="area-switcher" aria-label="التبديل بين مجالات الذكاء الاصطناعي">' + others + "</nav>" + render(a) + "</div>";
  }

  /* نظرة عامة */
  CW.pages.aiArea = function () {
    areaShell("area", function (a) {
      var t = CW.track("ai", a.id);
      return '<div class="area-overview"><div>' +
        '<section class="mb-6"><h2 class="block-title">' + icon("layers") + 'الموضوعات الرئيسية</h2><ol class="topic-grid">' +
        a.topics.map(function (tp, i) { return '<li><a href="' + R.aiLessons(a.id, i + 1) + '"><span class="n">' + (i + 1) + "</span>" + esc(tp) + "</a></li>"; }).join("") + "</ol></section>" +
        '<section class="mb-6"><h2 class="block-title">' + icon("rocket") + 'مشاريع مقترحة</h2><div class="grid grid-2">' + CW.findMany("projects", a.projects).slice(0, 2).map(CW.cards.project).join("") + "</div></section></div>" +
        '<aside><div class="card card-pad"><h2 class="block-title" style="font-size:1rem">' + icon("info") + 'نظرة سريعة</h2><ul class="meta-list">' +
        "<li>" + icon("layers", "ic-sm") + t.modules.length + " موضوعات (وحدات)</li><li>" + icon("book", "ic-sm") + t.lessonCount + " درساً في الهيكل المبدئي</li><li>" + icon("wrench", "ic-sm") + a.tools.length + " أدوات ومكتبات</li><li>" + icon("route", "ic-sm") + a.careers.length + " مسارات مهنية</li></ul>" +
        '<a class="btn btn-primary btn-block mt-6" href="' + t.lessonUrl(1, 1) + '">' + icon("play", "ic-sm") + "ابدأ الدرس الأول</a>" +
        '<div class="notice mt-4">' + icon("info", "ic-sm") + "<span>المحتوى التعليمي قيد الإعداد؛ القوالب جاهزة للإضافة.</span></div></div>" +
        '<div class="card card-pad mt-4"><h2 class="block-title" style="font-size:1rem">' + icon("wrench") + "الأدوات</h2>" + CW.chipLinks(CW.findMany("tools", a.tools), "tool") + "</div></aside></div>";
    });
  };

  /* الموضوعات */
  CW.pages.aiTopics = function () {
    areaShell("topics", function (a) {
      return '<div class="grid grid-2">' + a.topics.map(function (tp, i) {
        return '<article class="card card-hover topic-card"><span class="tc-n">' + String(i + 1).padStart(2, "0") + '</span><div class="grow"><h3 class="card-title"><a class="card-link" href="' + R.aiLessons(a.id, i + 1) + '">' + esc(tp) + '</a></h3><p class="card-text">' + CW.lessonSlots.length + ' دروس · سيظهر وصف الموضوع هنا</p></div><span class="badge badge-warning">قيد الإعداد</span></article>';
      }).join("") + "</div>";
    });
  };

  /* الدروس */
  CW.pages.aiLessons = function () {
    areaShell("lessons", function (a) {
      var t = CW.track("ai", a.id), m = Math.min(Math.max(CW.qsInt("m", 1), 1), t.modules.length), mod = t.modules[m - 1];
      return '<div class="area-lessons"><nav class="card module-side" aria-label="الموضوعات">' + t.modules.map(function (x) {
        return '<a href="' + R.aiLessons(a.id, x.n) + '"' + (x.n === m ? ' class="active" aria-current="page"' : "") + '><span class="n">' + x.n + "</span>" + esc(x.title) + "</a>";
      }).join("") + "</nav>" +
        '<div class="card"><div class="card-pad" style="border-bottom:1px solid var(--c-border)"><span class="text-sm text-muted">الموضوع ' + m + " من " + t.modules.length + '</span><h2 style="font-size:1.25rem">' + esc(mod.title) + "</h2></div>" +
        '<div class="lesson-list">' + mod.lessons.map(function (ls) { return CW.cards.lesson(t, m, ls.n); }).join("") + "</div></div></div>";
    });
  };

  /* الأدوات */
  CW.pages.aiTools = function () {
    areaShell("tools", function (a) {
      var tools = CW.findMany("tools", a.tools);
      return '<div class="grid grid-3">' + tools.map(function (t) {
        return '<article class="card card-hover card-pad"><div class="flex items-center gap-3">' + CW.mono(t) + '<div><h3 class="card-title"><a class="card-link" href="' + R.tool(t.id) + '">' + CW.bdi(t.name) + '</a></h3><span class="text-sm text-muted">' + esc(CW.find("toolCategories", t.cat).short || "") + "</span></div></div>" +
          '<p class="card-text mt-4">' + esc(t.tagline) + '</p><ul class="tag-list mt-4">' + t.uses.map(function (u) { return "<li>" + CW.bdi(u) + "</li>"; }).join("") + "</ul></article>";
      }).join("") + "</div>";
    });
  };

  /* المشاريع */
  CW.pages.aiProjects = function () {
    areaShell("projects", function (a) {
      var list = CW.findMany("projects", a.projects);
      return (list.length ? '<div class="grid grid-3">' + list.map(CW.cards.project).join("") + "</div>" : "") +
        '<div class="mt-6">' + CW.placeholder("plus", "مشاريع إضافية قادمة", "ستضاف مشاريع جديدة لهذا المجال ضمن خطة المشاريع.") + "</div>";
    });
  };

  /* مسارات التعلم المقترحة */
  CW.pages.aiPaths = function () {
    areaShell("paths", function (a) {
      var seq = [["python", "lang", "لغة Python"], ["math", "cs", "أساسيات الرياضيات للبرمجة"], ["numpy", "tool", "NumPy و Pandas"]];
      if (a.id !== "ml") seq.push(["ml", "ai", "أساسيات تعلم الآلة"]);
      if (["nlp", "cv", "genai"].indexOf(a.id) > -1) seq.push(["dl", "ai", "التعلم العميق"]);
      seq.push([a.id, "ai", a.name]);
      return '<section class="mb-6"><h2 class="block-title">' + icon("map") + 'تسلسل التعلم المقترح</h2><ol class="seq-chain">' +
        seq.map(function (s, i) {
          var url = s[1] === "lang" ? R.language(s[0]) : s[1] === "cs" ? R.csTopic(s[0]) : s[1] === "tool" ? R.tool(s[0]) : R.aiArea(s[0]);
          return '<li' + (i === seq.length - 1 ? ' class="target"' : "") + '><a href="' + url + '"><span class="n">' + (i + 1) + "</span>" + CW.bdi(s[2]) + "</a></li>";
        }).join("") + "</ol></section>" +
        '<section><h2 class="block-title">' + icon("route") + 'مسارات مهنية تقود إلى هذا المجال</h2><div class="grid grid-3">' + CW.findMany("careers", a.careers).map(CW.cards.career).join("") + "</div></section>";
    });
  };
})();
