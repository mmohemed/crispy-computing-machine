/* ==========================================================
   قسم المسارات المهنية: القائمة وخارطة التعلم المرئية
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc;

  CW.pages.careers = function () {
    var cats = D.careerCategories;
    CW.catalog({
      crumbs: [["المسارات المهنية"]], title: "المسارات المهنية",
      lead: "اختر الوظيفة التي تطمح إليها، وستجد خارطة تعلم مرئية من خمس مراحل تربط اللغات والأدوات والدروس والمشاريع بترتيب واضح.",
      headExtra: '<img src="' + CW.asset("images/hero-roadmap.svg") + '" alt="" width="300" height="75" style="max-width:300px">',
      placeholder: "ابحث عن مسار مهني أو مهارة…", unit: "مسار",
      items: D.careers,
      text: function (c) { return [c.name, c.en, c.tagline].concat(c.skills).join(" "); },
      facets: [
        { key: "cat", title: "التصنيف", options: Object.keys(cats).map(function (k) { return [k, cats[k].name]; }), get: function (c) { return [c.cat]; } },
        { key: "lang", title: "اللغة الأساسية", options: ["python", "javascript", "java", "sql", "csharp", "cpp", "c"].map(function (id) { return [id, CW.find("languages", id).name]; }), get: function (c) { return c.langs; } },
        { key: "field", title: "المجال", options: D.fields.map(function (f) { return [f.id, f.name]; }), get: function (c) { return c.fields; } }
      ],
      sorts: { def: ["الترتيب الافتراضي", null], featured: ["المقترحة أولاً", function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); }] },
      pageSize: 12, gridClass: "grid grid-3",
      render: CW.cards.career
    });
  };

  CW.pages.career = function () {
    var c = CW.find("careers", CW.qs("id"));
    if (!c) { CW.renderNotFound("المسار المهني", "العودة إلى المسارات", R.careers()); return; }
    CW.setTitle(c.name);
    var cat = D.careerCategories[c.cat], stages = CW.buildRoadmap(c);
    var enrolled = (D.demoUser.careers || []).filter(function (x) { return x.id === c.id; })[0];
    var current = enrolled ? enrolled.stage : 0;
    var langs = CW.findMany("languages", c.langs), tools = CW.findMany("tools", c.tools);
    var firstLesson = (stages.filter(function (s) { return s.lessons.length; })[0] || {}).lessons;
    var startUrl = firstLesson ? firstLesson[0].url : R.language(c.langs[0]);
    var resumeStage = enrolled ? stages[current - 1] : null;
    var resumeUrl = resumeStage && resumeStage.lessons.length ? resumeStage.lessons[0].url : startUrl;

    function state(n) { return !enrolled ? "" : n < current ? "done" : n === current ? "current" : "upcoming"; }
    function nodeHtml(n) {
      var lead = n.item.mono ? CW.mono(n.item, "xs") : icon(n.kind === "cs" ? n.item.icon : n.kind === "field" ? n.item.icon : n.item.icon || "rocket", "ic-sm");
      var kind = { lang: "لغة", tool: "أداة", cs: "أساسيات", field: "مجال", project: "مشروع" }[n.kind];
      return '<a class="rm-node k-' + n.kind + '" href="' + n.url + '">' + lead + "<span>" + CW.bdi(n.label) + '<small>' + kind + "</small></span></a>";
    }

    var html = '<header class="career-hero" style="--cat:' + cat.color + '"><div class="container">' +
      CW.breadcrumb([["المسارات المهنية", R.careers()], [c.name]]) +
      '<div class="career-hero-grid"><div>' +
      '<div class="flex items-center gap-3 wrap"><span class="badge" style="background:color-mix(in srgb,' + cat.color + ' 14%,#fff);color:' + cat.color + '">' + icon(c.icon, "ic-xs") + cat.name + '</span><span class="text-sm text-muted ltr">' + esc(c.en) + "</span></div>" +
      "<h1>" + esc(c.name) + '</h1><p class="lead">' + esc(c.tagline) + "</p>" +
      '<div class="flex gap-3 wrap mt-6">' +
      (enrolled ? '<a class="btn btn-primary btn-lg" href="' + resumeUrl + '">' + icon("play", "ic-sm") + "تابع من المرحلة " + current + "</a>"
        : '<a class="btn btn-primary btn-lg" href="' + startUrl + '">' + icon("play", "ic-sm") + "ابدأ المسار</a>") +
      '<a class="btn btn-outline btn-lg" href="' + R.careers() + '">' + icon("arrowR", "ic-sm") + "كل المسارات</a></div></div>" +
      '<div class="card card-pad progress-card">' +
      (enrolled ?
        '<div class="flex items-center gap-4"><div class="ring" style="--v:' + enrolled.progress + '" data-label="' + enrolled.progress + '%"></div><div><strong>تقدمك في المسار</strong><p class="text-sm text-muted">أنت في المرحلة ' + current + " من " + stages.length + ": " + esc(stages[current - 1].title) + '</p></div></div><div class="notice demo mt-4">' + icon("info", "ic-sm") + "<span>بيانات تقدم تجريبية لعرض شكل المؤشر.</span></div>"
        : '<div class="flex items-center gap-4"><span class="icon-tile lg">' + icon("route") + '</span><div><strong>خارطة من ' + stages.length + ' مراحل</strong><p class="text-sm text-muted">من الأساسيات حتى الاحتراف. انقر أي عنصر في الخارطة لفتح صفحته.</p></div></div>') +
      '<div class="mt-4"><span class="text-sm fw-bold">اللغات والأدوات الأساسية</span><div class="chip-list mt-2">' +
      langs.concat(tools.slice(0, 5)).map(function (x) { return '<a class="chip" href="' + (x.cat ? R.tool(x.id) : R.language(x.id)) + '">' + CW.mono(x, "xs") + CW.bdi(x.name) + "</a>"; }).join("") + "</div></div>" +
      "</div></div></div></header>" +

      '<div class="container career-body">' +
      '<div class="rm-legend"><h2 class="block-title" style="margin:0">' + icon("map") + 'خارطة التعلم</h2><div class="legend">' +
      '<span><i class="lg-done"></i>مكتملة</span><span><i class="lg-current"></i>المرحلة الحالية</span><span><i class="lg-up"></i>قادمة</span></div></div>' +
      '<ol class="roadmap' + (enrolled ? " has-progress" : "") + '" style="--cat:' + cat.color + '">' + stages.map(function (s) {
        var st = state(s.n);
        return '<li class="rm-stage ' + st + '">' +
          '<div class="rm-marker" aria-hidden="true">' + (st === "done" ? icon("check", "ic-sm") : s.n) + "</div>" +
          '<div class="rm-card card"><div class="rm-head"><span class="icon-tile sm">' + icon(s.icon) + '</span><div class="grow"><span class="rm-step">المرحلة ' + s.n + (st === "current" ? ' · <b>أنت هنا</b>' : st === "done" ? " · مكتملة" : "") + "</span><h3>" + esc(s.title) + "</h3></div></div>" +
          '<p class="text-sm text-muted">' + esc(s.desc) + "</p>" +
          (s.skills.length ? '<div class="rm-sub">المهارات</div><ul class="tag-list">' + s.skills.map(function (k) { return "<li>" + CW.bdi(k) + "</li>"; }).join("") + "</ul>" : "") +
          (s.nodes.length ? '<div class="rm-sub">اللغات والأدوات والمشاريع</div><div class="rm-nodes">' + s.nodes.map(nodeHtml).join("") + "</div>" : "") +
          (s.lessons.length ? '<div class="rm-sub">دروس مقترحة</div><ul class="rm-lessons">' + s.lessons.map(function (l) { return '<li><a href="' + l.url + '">' + icon("book", "ic-xs") + CW.bdi(l.label) + "</a></li>"; }).join("") + "</ul>" : "") +
          "</div></li>";
      }).join("") +
      '<li class="rm-stage goal"><div class="rm-marker" aria-hidden="true">' + icon("trophy", "ic-sm") + '</div><div class="rm-card card goal-card"><h3>جاهز لسوق العمل: ' + esc(c.name) + '</h3><p class="text-sm text-muted">بعد إنهاء المراحل يكون لديك معرض أعمال ومهارات واضحة لهذا الدور.</p></div></li>' +
      "</ol>" +

      '<section class="mt-8"><h2 class="block-title">' + icon("compass") + "مجالات مرتبطة</h2>" + CW.chipLinks(CW.findMany("fields", c.fields), "field") + "</section>" +
      '<section class="mt-8"><h2 class="block-title">' + icon("route") + 'مسارات قريبة</h2><div class="grid grid-3">' +
      D.careers.filter(function (x) { return x.cat === c.cat && x.id !== c.id; }).slice(0, 3).map(CW.cards.career).join("") + "</div></section>" +
      "</div>";
    document.getElementById("main").innerHTML = html;
  };
})();
