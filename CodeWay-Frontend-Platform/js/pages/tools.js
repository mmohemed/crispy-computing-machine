/* ==========================================================
   قسم الأدوات والتقنيات: القائمة وصفحة الأداة
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc;

  /* ---------- جميع الأدوات ---------- */
  CW.pages.tools = function () {
    var catOpts = D.toolCategories.map(function (c) { return [c.id, c.name]; });
    var pre = CW.qs("cat");
    var counts = D.toolCategories.map(function (c) {
      var n = D.tools.filter(function (t) { return t.cat === c.id; }).length;
      return '<a class="chip' + (pre === c.id ? " active" : "") + '" href="' + R.tools(c.id) + '">' + icon(c.icon, "ic-sm") + esc(c.short || c.name) + " · " + n + "</a>";
    }).join("");
    CW.catalog({
      crumbs: [["الأدوات والتقنيات"]], title: "الأدوات والمكتبات والأطر والتقنيات",
      lead: "كل ما تحتاجه لبناء مشاريعك: أدوات التطوير، أطر الويب، مكتبات الذكاء الاصطناعي، قواعد البيانات، أدوات البيانات، وDevOps.",
      before: '<div class="cat-strip"><a class="chip' + (pre ? "" : " active") + '" href="' + R.tools() + '">الكل · ' + D.tools.length + "</a>" + counts + "</div>",
      placeholder: "ابحث عن أداة أو مكتبة…", unit: "أداة",
      items: D.tools,
      text: function (t) { return [t.name, t.tagline].concat(t.uses).join(" "); },
      facets: [
        { key: "cat", title: "التصنيف", options: catOpts, get: function (t) { return [t.cat]; } },
        { key: "career", title: "يستخدمها مسار", options: D.careers.filter(function (c) { return c.featured; }).map(function (c) { return [c.id, c.name]; }),
          get: function (t) { return CW.rel.careersWith("tools", t.id).map(function (c) { return c.id; }); } }
      ],
      sorts: { def: ["حسب التصنيف", null], az: ["أبجدياً", function (a, b) { return a.name.localeCompare(b.name); }] },
      pageSize: 18, gridClass: "grid grid-3",
      render: CW.cards.tool
    });
  };

  /* ---------- صفحة الأداة ---------- */
  CW.pages.tool = function () {
    var t = CW.find("tools", CW.qs("id"));
    if (!t) { CW.renderNotFound("الأداة", "العودة إلى الأدوات", R.tools()); return; }
    CW.setTitle(t.name);
    var cat = CW.find("toolCategories", t.cat), track = CW.track("tool", t.id);
    var m = Math.min(Math.max(CW.qsInt("m", 1), 1), track.modules.length), mod = track.modules[m - 1];
    var careers = CW.rel.careersWith("tools", t.id), fields = CW.rel.fieldsWith("tools", t.id), aiAreas = CW.rel.aiAreasWithTool(t.id);
    var projects = CW.rel.projectsWith("tools", t.id);
    var siblings = D.tools.filter(function (x) { return x.cat === t.cat && x.id !== t.id; }).slice(0, 6);
    var slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    var head = '<header class="tool-hero" style="--brand:' + t.color + ";--brand-fg:" + (t.fg || "#fff") + '"><div class="container">' +
      CW.breadcrumb([["الأدوات والتقنيات", R.tools()], [cat.name, R.tools(cat.id)], [t.name]]) +
      '<div class="tool-hero-grid"><div>' +
      '<div class="flex items-center gap-3">' + CW.mono(t, "lg") + '<div><span class="badge badge-dark">' + icon(cat.icon, "ic-xs") + esc(cat.name) + '</span><h1><bdi>' + esc(t.name) + "</bdi></h1></div></div>" +
      '<p class="lead">' + esc(t.tagline) + "</p>" +
      '<div class="flex gap-3 wrap mt-6"><a class="btn btn-primary btn-lg" href="' + track.lessonUrl(1, 1) + '">' + icon("play", "ic-sm") + "ابدأ الوحدة الأولى</a>" +
      '<a class="btn btn-ghost-light btn-lg" href="' + R.tools(cat.id) + '">' + icon("arrowR", "ic-sm") + "العودة إلى " + esc(cat.short || cat.name) + "</a></div></div>" +
      '<div class="tool-terminal" aria-label="ملخص الأداة"><div class="code-head"><span class="dots"><i></i><i></i><i></i></span><span>codeway info ' + esc(slug) + "</span></div>" +
      '<dl><div><dt>category</dt><dd>' + esc(cat.short || cat.name) + "</dd></div>" +
      "<div><dt>requires</dt><dd>" + t.prereq.map(esc).join("، ") + "</dd></div>" +
      "<div><dt>topics</dt><dd>" + track.modules.length + " وحدات</dd></div>" +
      "<div><dt>careers</dt><dd>" + careers.length + " مسارات مهنية</dd></div>" +
      '<div><dt>status</dt><dd class="warn">المحتوى قيد الإعداد</dd></div></dl></div>' +
      "</div></div></header>";

    var stepper = '<ol class="topic-stepper" aria-label="وحدات الأداة">' + track.modules.map(function (x) {
      var cls = x.n === m ? "active" : "";
      return '<li class="' + cls + '"><a href="' + R.tool(t.id, x.n) + '#topics"' + (x.n === m ? ' aria-current="step"' : "") + '><span class="n">' + x.n + "</span><span>" + esc(x.title) + "</span></a></li>";
    }).join("") + "</ol>";

    var body = '<div class="container tool-layout"><div>' +
      '<section class="tool-section"><h2 class="block-title">' + icon("target") + 'الاستخدامات الأساسية</h2><div class="use-grid">' +
      t.uses.map(function (u, i) { return '<div class="use-item"><span class="idx mono-num">0' + (i + 1) + "</span><strong>" + CW.bdi(u) + "</strong></div>"; }).join("") + "</div></section>" +

      '<section class="tool-section"><h2 class="block-title">' + icon("flag") + "المتطلبات السابقة</h2>" +
      '<div class="chip-list">' + t.prereq.map(function (p) {
        var l = D.languages.filter(function (x) { return x.name === p; })[0] || D.tools.filter(function (x) { return x.name === p; })[0];
        if (l) return '<a class="chip" href="' + (l.cat ? R.tool(l.id) : R.language(l.id)) + '">' + CW.mono(l, "xs") + CW.bdi(p) + "</a>";
        return '<span class="chip">' + icon("check", "ic-xs") + CW.bdi(p) + "</span>";
      }).join("") + "</div></section>" +

      '<section class="tool-section" id="topics"><h2 class="block-title">' + icon("layers") + "الوحدات والموضوعات</h2>" + stepper +
      '<div class="card topic-panel"><div class="topic-head"><div><span class="text-sm text-muted">الوحدة ' + m + " من " + track.modules.length + "</span><h3>" + esc(mod.title) + '</h3></div><span class="badge badge-warning">قيد الإعداد</span></div>' +
      '<div class="lesson-list">' + mod.lessons.map(function (ls) { return CW.cards.lesson(track, m, ls.n); }).join("") + "</div>" +
      '<div class="topic-nav">' +
      (m > 1 ? '<a class="btn btn-outline btn-sm" href="' + R.tool(t.id, m - 1) + '#topics">' + icon("chevR", "ic-sm") + "الوحدة السابقة</a>" : '<span></span>') +
      (m < track.modules.length ? '<a class="btn btn-soft btn-sm" href="' + R.tool(t.id, m + 1) + '#topics">الوحدة التالية' + icon("chevL", "ic-sm") + "</a>" : '<a class="btn btn-success btn-sm" href="' + R.tools() + '">' + icon("check", "ic-sm") + "آخر وحدة</a>") +
      "</div></div></section>" +

      '<section class="tool-section"><h2 class="block-title">' + icon("code") + "أمثلة عملية</h2>" +
      CW.codeBlock({ file: "example", code: "# ستضاف الأمثلة البرمجية الخاصة بـ " + t.name + " هنا\n# Example code for " + t.name + " will appear here", run: true }) +
      '<p class="text-sm text-muted mt-2">صندوق الأمثلة جاهز للربط بالمحتوى الحقيقي ومحرك التنفيذ لاحقاً.</p></section>' +

      '<section class="tool-section"><h2 class="block-title">' + icon("rocket") + "مشاريع تستخدم " + CW.bdi(t.name) + "</h2>" +
      (projects.length ? '<div class="grid grid-2">' + projects.slice(0, 4).map(CW.cards.project).join("") + "</div>" : CW.placeholder("rocket", "لا توجد مشاريع منشورة لهذه الأداة بعد", "ستضاف ضمن خطة المشاريع.")) + "</section>" +
      "</div>" +

      '<aside class="sticky-side">' +
      '<div class="card side-card"><h2>' + icon("book") + "التوثيق الرسمي</h2>" +
      (t.docs ? '<a class="doc-link" href="' + t.docs + '" target="_blank" rel="noopener noreferrer">' + icon("external", "ic-sm") + "توثيق " + CW.bdi(t.name) + '<span class="sr-only">(يفتح في نافذة جديدة)</span></a><p class="hint ltr" style="text-align:left">' + esc(t.docs.replace(/^https?:\/\//, "")) + "</p>" : '<p class="text-sm text-muted">لا يتوفر رابط موثوق حالياً.</p>') + "</div>" +
      '<div class="card side-card"><h2>' + icon("route") + "مسارات مهنية مرتبطة</h2>" + CW.chipLinks(careers, "career") + "</div>" +
      '<div class="card side-card"><h2>' + icon("compass") + "مجالات مرتبطة</h2>" + CW.chipLinks(fields, "field") + "</div>" +
      (aiAreas.length ? '<div class="card side-card"><h2>' + icon("sparkles") + "مجالات الذكاء الاصطناعي</h2>" + CW.chipLinks(aiAreas, "ai") + "</div>" : "") +
      '<div class="card side-card"><h2>' + icon("grid") + "أدوات من التصنيف نفسه</h2>" + CW.chipLinks(siblings, "tool") + "</div>" +
      "</aside></div>";

    document.getElementById("main").innerHTML = head + body;
  };
})();
