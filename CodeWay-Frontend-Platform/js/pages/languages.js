/* ==========================================================
   قسم لغات البرمجة: القائمة، صفحة اللغة، الوحدات، الدروس، المشاريع، التدريبات
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc;
  var levelOpts = Object.keys(CW.levels).slice(0, 3).map(function (k) { return [k, CW.levels[k].name]; });

  /* ---------- صفحة جميع اللغات ---------- */
  CW.pages.languages = function () {
    var useOpts = [["web", "تطوير الويب"], ["data", "البيانات والذكاء الاصطناعي"], ["mobile", "تطبيقات الهاتف"], ["systems", "الأنظمة والأداء العالي"], ["enterprise", "الأنظمة المؤسسية"]];
    var useMap = { python: ["data", "web"], javascript: ["web", "mobile"], typescript: ["web"], java: ["enterprise", "mobile"], c: ["systems"], cpp: ["systems"], csharp: ["enterprise", "web"],
      php: ["web"], go: ["systems", "web"], rust: ["systems"], kotlin: ["mobile", "enterprise"], swift: ["mobile"], dart: ["mobile"], r: ["data"], sql: ["data"], ruby: ["web"] };
    CW.catalog({
      crumbs: [["لغات البرمجة"]], title: "لغات البرمجة",
      lead: "اختر لغتك وابدأ رحلة التعلم من الأساسيات حتى التطبيق العملي. لكل لغة وحدات ودروس ومشاريع واختبارات.",
      headExtra: '<div class="head-stats"><span class="badge badge-primary">' + D.languages.length + " لغة</span></div>",
      placeholder: "ابحث باسم اللغة أو استخدامها…", unit: "لغة",
      items: D.languages,
      text: function (l) { return [l.name, l.tagline, l.paradigm].concat(l.uses).join(" "); },
      facets: [
        { key: "level", title: "مستوى البداية", options: levelOpts, get: function (l) { return [l.level]; } },
        { key: "use", title: "مجال الاستخدام", options: useOpts, get: function (l) { return useMap[l.id] || []; } },
        { key: "typing", title: "نظام الأنواع", options: [["ثابتة", "ثابتة"], ["ديناميكية", "ديناميكية"]], get: function (l) { return [l.typing]; } }
      ],
      sorts: { def: ["الترتيب الافتراضي", null], az: ["أبجدياً", function (a, b) { return a.name.localeCompare(b.name); }], easy: ["الأسهل أولاً", function (a, b) { return CW.levels[a.level].order - CW.levels[b.level].order; }] },
      pageSize: 12, gridClass: "grid grid-3",
      render: CW.cards.language
    });
  };

  /* ---------- أدوات مشتركة لصفحات اللغة ---------- */
  function getLang() {
    var l = CW.find("languages", CW.qs("id"));
    if (!l) { CW.renderNotFound("اللغة", "العودة إلى لغات البرمجة", R.languages()); return null; }
    return l;
  }
  function hero(l, active, compact) {
    var t = CW.track("lang", l.id);
    var tabs = [["overview", "نظرة عامة", R.language(l.id), "info"], ["modules", "الوحدات والدروس", R.langModules(l.id), "layers"],
      ["projects", "المشاريع", R.langProjects(l.id), "rocket"], ["practice", "التدريبات والاختبارات", R.langPractice(l.id), "clipboard"]];
    var crumbs = [["لغات البرمجة", R.languages()]];
    if (active === "overview") crumbs.push([l.name]);
    else crumbs.push([l.name, R.language(l.id)], [tabs.filter(function (x) { return x[0] === active; })[0][1]]);
    return '<header class="lang-hero" data-mono="' + esc(l.mono) + '" style="--brand:' + l.color + ";--brand-fg:" + (l.fg || "#fff") + ";--brand-ink:" + (l.ink || l.color) + '"><div class="container">' +
      CW.breadcrumb(crumbs) +
      '<div class="hero-main">' + CW.mono(l, "lg") + '<div><h1><bdi>' + esc(l.name) + "</bdi>" + (compact ? ' <span class="text-muted" style="font-size:.6em;font-weight:500">— ' + compact + "</span>" : "") + '</h1><p class="lead">' + esc(l.tagline) + "</p></div></div>" +
      (compact ? "" :
        '<div class="lang-meta">' + CW.levelBadge(l.level) +
        '<span class="badge">' + icon("layers", "ic-xs") + t.modules.length + " وحدات مخطط لها</span>" +
        '<span class="badge">' + icon("book", "ic-xs") + t.lessonCount + " درساً في الهيكل المبدئي</span>" +
        '<span class="badge">' + icon("code", "ic-xs") + esc(l.paradigm) + "</span>" +
        '<span class="badge badge-warning">' + icon("clock", "ic-xs") + "المحتوى قيد الإعداد</span></div>" +
        '<div class="lang-actions"><a class="btn btn-primary btn-lg" href="' + t.lessonUrl(1, 1) + '">' + icon("play", "ic-sm") + "ابدأ التعلم</a>" +
        '<a class="btn btn-outline btn-lg" href="' + R.languages() + '">' + icon("arrowR", "ic-sm") + "العودة إلى اللغات</a>" +
        '<a class="btn btn-ghost btn-lg" href="' + R.editor(l.id) + '">' + icon("terminal", "ic-sm") + "جرّبها في المحرر</a></div>") +
      '<nav class="tabs-line" aria-label="أقسام اللغة">' + tabs.map(function (x) {
        return '<a class="tab' + (x[0] === active ? " active" : "") + '" href="' + x[2] + '"' + (x[0] === active ? ' aria-current="page"' : "") + ">" + icon(x[3], "ic-sm") + x[1] + "</a>";
      }).join("") + "</nav></div></header>";
  }
  function sidebar(l) {
    var careers = CW.rel.careersWith("langs", l.id), fields = CW.rel.fieldsWith("langs", l.id);
    return '<aside class="sticky-side">' +
      '<div class="card side-card"><h2>' + icon("info") + 'معلومات سريعة</h2><ul class="meta-list">' +
      "<li><span>" + icon("gauge", "ic-sm") + "مستوى الصعوبة</span>" + CW.levelBadge(l.level) + "</li>" +
      "<li><span>" + icon("code", "ic-sm") + "النمط البرمجي</span><strong>" + esc(l.paradigm) + "</strong></li>" +
      "<li><span>" + icon("tag", "ic-sm") + "نظام الأنواع</span><strong>" + esc(l.typing) + "</strong></li></ul></div>" +
      '<div class="card side-card"><h2>' + icon("flag") + 'المتطلبات السابقة</h2><ul class="check-list">' + l.prereq.map(function (p) { return "<li>" + icon("check", "ic-sm") + CW.bdi(p) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="card side-card"><h2>' + icon("book") + "التوثيق الرسمي</h2>" +
      (l.docs && l.docs.length ? l.docs.map(function (d) { return '<a class="doc-link" href="' + d.url + '" target="_blank" rel="noopener noreferrer">' + icon("external", "ic-sm") + esc(d.label) + '<span class="sr-only">(يفتح في نافذة جديدة)</span></a>'; }).join("") : '<p class="text-sm text-muted">لا يتوفر رابط موثوق حالياً.</p>') + "</div>" +
      '<div class="card side-card"><h2>' + icon("route") + "مسارات مهنية تستخدمها</h2>" + CW.chipLinks(careers.slice(0, 6), "career") + "</div>" +
      '<div class="card side-card"><h2>' + icon("compass") + "مجالات مرتبطة</h2>" + CW.chipLinks(fields, "field") + "</div></aside>";
  }
  function moduleAccordion(t, openFirst) {
    return '<div class="accordion module-list">' + t.modules.map(function (m, i) {
      return '<div class="acc-item' + (openFirst && i === 0 ? " open" : "") + '"><button class="acc-btn" aria-expanded="' + (openFirst && i === 0) + '" aria-controls="mod' + m.n + '"><span class="m-n">' + m.n + "</span><span>" + esc(m.title) +
        '<span class="m-sub">' + m.lessons.length + ' دروس · قالب جاهز</span></span><span class="chev">' + icon("chevD", "ic-sm") + "</span></button>" +
        '<div class="acc-panel" id="mod' + m.n + '"><div><div class="acc-body"><div class="lesson-list">' + m.lessons.map(function (ls) { return CW.cards.lesson(t, m.n, ls.n); }).join("") + "</div>" +
        '<div class="module-foot"><span class="text-sm text-muted">ستضاف التدريبات والاختبارات لهذه الوحدة لاحقاً.</span><a class="link-arrow" href="' + t.lessonsUrl(m.n) + '">صفحة دروس الوحدة' + icon("arrowL", "ic-xs") + "</a></div></div></div></div></div>";
    }).join("") + "</div>";
  }
  function practiceCards(type, id) {
    var qz = CW.rel.quizzesFor(type, id), ex = CW.rel.exercisesFor(type, id);
    var items = qz.map(function (q) { return '<article class="card card-hover practice-card"><span class="icon-tile">' + icon("clipboard") + '</span><div class="grow"><h3><a class="card-link" href="' + R.quiz(q.id) + '">' + esc(q.title) + "</a></h3><p>اختبار · " + q.minutes + " دقائق تقريباً · " + CW.levels[q.level].name + "</p></div></article>"; })
      .concat(ex.map(function (x) { return '<article class="card card-hover practice-card"><span class="icon-tile accent">' + icon("edit") + '</span><div class="grow"><h3><a class="card-link" href="' + R.exercise(x.id) + '">' + esc(x.title) + "</a></h3><p>تدريب " + (x.kind === "code" ? "برمجي" : "تفاعلي") + " · " + CW.levels[x.level].name + "</p></div></article>"; }));
    return items.length ? '<div class="practice-grid">' + items.join("") + "</div>" :
      CW.placeholder("clipboard", "ستضاف التدريبات والاختبارات لاحقاً", "القوالب جاهزة، ويمكنك تجربة الاختبارات المتاحة في صفحة الاختبارات العامة.");
  }
  function wrap(l, content) {
    return '<div class="container lang-layout" style="--brand:' + l.color + ";--brand-ink:" + (l.ink || l.color) + '"><div>' + content + "</div>" + sidebar(l) + "</div>";
  }

  /* ---------- صفحة تفاصيل اللغة ---------- */
  CW.pages.language = function () {
    var l = getLang(); if (!l) return;
    CW.setTitle("تعلّم " + l.name);
    var t = CW.track("lang", l.id), projects = CW.rel.projectsWith("langs", l.id);
    var find = [["layers", "وحدات متسلسلة", "من إعداد البيئة حتى المشروع الختامي."], ["code", "أمثلة برمجية", "صناديق كود قابلة للنسخ والتجربة."],
      ["clipboard", "تدريبات واختبارات", "لقياس فهمك بعد كل وحدة."], ["rocket", "مشاريع عملية", "تطبّق فيها ما تعلمته."]];
    document.getElementById("main").innerHTML = hero(l, "overview") + wrap(l,
      '<section class="lang-section"><h2 class="block-title">' + icon("target") + 'ما الذي ستجده في هذا المسار؟</h2><div class="find-grid">' +
      find.map(function (f) { return '<div class="find-item"><span class="icon-tile sm">' + icon(f[0]) + "</span><div><strong>" + f[1] + "</strong><span>" + f[2] + "</span></div></div>"; }).join("") + "</div></section>" +
      '<section class="lang-section"><div class="flex items-center gap-3 wrap" style="justify-content:space-between;margin-bottom:16px"><h2 class="block-title" style="margin:0">' + icon("layers") + "الوحدات التعليمية</h2>" +
      '<a class="link-arrow" href="' + R.langModules(l.id) + '">كل الوحدات' + icon("arrowL", "ic-xs") + "</a></div>" +
      '<div class="notice mb-4">' + icon("info", "ic-sm") + "<span>هذا هيكل مبدئي للمسار؛ عناوين الوحدات تنظيمية، ومحتوى الدروس سيُضاف لاحقاً داخل قالب الدرس الجاهز.</span></div>" +
      moduleAccordion(t, true) + "</section>" +
      '<section class="lang-section"><div class="flex items-center gap-3 wrap" style="justify-content:space-between;margin-bottom:16px"><h2 class="block-title" style="margin:0">' + icon("rocket") + "مشاريع باستخدام " + CW.bdi(l.name) + "</h2>" +
      '<a class="link-arrow" href="' + R.langProjects(l.id) + '">كل المشاريع' + icon("arrowL", "ic-xs") + "</a></div>" +
      (projects.length ? '<div class="grid grid-2">' + projects.slice(0, 2).map(CW.cards.project).join("") + "</div>" : CW.placeholder("rocket", "لا توجد مشاريع منشورة لهذه اللغة بعد", "ستضاف ضمن خطة المشاريع.")) + "</section>" +
      '<section class="lang-section"><h2 class="block-title">' + icon("clipboard") + "التدريبات والاختبارات</h2>" + practiceCards("lang", l.id) + "</section>"
    ) ;
  };

  /* ---------- صفحة الوحدات ---------- */
  CW.pages.langModules = function () {
    var l = getLang(); if (!l) return;
    CW.setTitle("وحدات " + l.name);
    var t = CW.track("lang", l.id);
    document.getElementById("main").innerHTML = hero(l, "modules", "الوحدات التعليمية") + wrap(l,
      '<div class="notice mb-6">' + icon("info", "ic-sm") + "<span>" + t.modules.length + " وحدات في الهيكل المبدئي، بكل منها " + CW.lessonSlots.length + " دروس. افتح أي وحدة لعرض قائمة دروسها.</span></div>" +
      '<div class="module-cards">' + t.modules.map(function (m) {
        return '<article class="card card-hover module-card"><div class="head"><span class="m-n">' + m.n + '</span><div><span class="text-sm text-muted">الوحدة ' + m.n + '</span><h3><a class="card-link" href="' + t.lessonsUrl(m.n) + '">' + esc(m.title) + "</a></h3></div></div>" +
          '<div class="lesson-chips">' + m.lessons.map(function (ls) { return '<span class="tag">' + ls.n + ". " + esc(ls.title) + "</span>"; }).join("") + "</div>" +
          '<div class="foot"><span class="badge badge-warning">قيد الإعداد</span><span class="link-arrow">عرض الدروس' + icon("arrowL", "ic-xs") + "</span></div></article>";
      }).join("") + "</div>");
  };

  /* ---------- صفحة دروس الوحدة ---------- */
  CW.pages.langLessons = function () {
    var l = getLang(); if (!l) return;
    var t = CW.track("lang", l.id), m = Math.min(Math.max(CW.qsInt("m", 1), 1), t.modules.length), mod = t.modules[m - 1];
    CW.setTitle(mod.title + " — " + l.name);
    var prev = m > 1 ? t.modules[m - 2] : null, next = m < t.modules.length ? t.modules[m] : null;
    document.getElementById("main").innerHTML = hero(l, "modules", "الوحدة " + m) +
      '<div class="container lang-layout" style="--brand:' + l.color + ";--brand-fg:" + (l.fg || "#fff") + '">' +
      '<div><div class="card"><div class="card-pad" style="border-bottom:1px solid var(--c-border)"><span class="text-sm text-muted">الوحدة ' + m + " من " + t.modules.length + "</span><h2 style=\"font-size:1.3rem\">" + esc(mod.title) + "</h2>" +
      '<div class="progress-label mt-4"><span>تقدمك في الوحدة</span><span>0 من ' + mod.lessons.length + '</span></div><div class="progress sm"><span style="--v:0%"></span></div></div>' +
      '<div class="lesson-list">' + mod.lessons.map(function (ls) { return CW.cards.lesson(t, m, ls.n); }).join("") + "</div></div>" +
      '<div class="pager-nav mt-6">' +
      (prev ? '<a class="pager-link" href="' + t.lessonsUrl(m - 1) + '">' + icon("chevR") + "<div><small>الوحدة السابقة</small><strong>" + esc(prev.title) + "</strong></div></a>" : "") +
      (next ? '<a class="pager-link next" href="' + t.lessonsUrl(m + 1) + '"><div><small>الوحدة التالية</small><strong>' + esc(next.title) + "</strong></div>" + icon("chevL") + "</a>" : "") +
      "</div></div>" +
      '<aside class="sticky-side"><div class="card"><h2 class="block-title" style="padding:16px 16px 0;font-size:1rem">' + icon("layers") + 'وحدات المسار</h2><nav class="module-nav" aria-label="وحدات اللغة">' +
      t.modules.map(function (x) { return '<a href="' + t.lessonsUrl(x.n) + '"' + (x.n === m ? ' class="active" aria-current="page"' : "") + '><span class="n">' + x.n + "</span>" + esc(x.title) + "</a>"; }).join("") +
      "</nav></div></aside></div>";
  };

  /* ---------- مشاريع اللغة ---------- */
  CW.pages.langProjects = function () {
    var l = getLang(); if (!l) return;
    CW.setTitle("مشاريع " + l.name);
    var list = CW.rel.projectsWith("langs", l.id);
    document.getElementById("main").innerHTML = hero(l, "projects", "المشاريع") + wrap(l,
      '<div class="flex items-center wrap gap-3 mb-6" style="justify-content:space-between"><p class="text-muted">' + list.length + " مشروع منشور حالياً يستخدم " + CW.bdi(l.name) + "</p>" +
      '<a class="btn btn-outline btn-sm" href="' + R.projects({ lang: l.id }) + '">' + icon("filter", "ic-sm") + "تصفح في صفحة المشاريع</a></div>" +
      (list.length ? '<div class="grid grid-2">' + list.map(CW.cards.project).join("") + "</div>" : "") +
      '<div class="mt-6">' + CW.placeholder("plus", "مساحة لمشاريع إضافية", "ستضاف مشاريع جديدة لهذه اللغة ضمن خطة المئة مشروع.") + "</div>");
  };

  /* ---------- تدريبات واختبارات اللغة ---------- */
  CW.pages.langPractice = function () {
    var l = getLang(); if (!l) return;
    CW.setTitle("تدريبات واختبارات " + l.name);
    var t = CW.track("lang", l.id);
    document.getElementById("main").innerHTML = hero(l, "practice", "التدريبات والاختبارات") + wrap(l,
      '<section class="lang-section"><h2 class="block-title">' + icon("clipboard") + "المتاح حالياً</h2>" + practiceCards("lang", l.id) + "</section>" +
      '<section class="lang-section"><h2 class="block-title">' + icon("layers") + 'اختبار لكل وحدة</h2><div class="table-wrap"><table class="table"><thead><tr><th>الوحدة</th><th>اختبار الوحدة</th><th>التدريب العملي</th><th>الحالة</th></tr></thead><tbody>' +
      t.modules.map(function (m) { return "<tr><td><strong>" + m.n + ". " + esc(m.title) + '</strong></td><td>قالب جاهز</td><td>قالب جاهز</td><td><span class="badge badge-warning">قيد الإعداد</span></td></tr>'; }).join("") +
      "</tbody></table></div></section>" +
      '<div class="flex gap-3 wrap"><a class="btn btn-primary" href="' + R.quizzes() + '">' + icon("clipboard", "ic-sm") + "كل الاختبارات</a><a class=\"btn btn-outline\" href=\"" + R.exercises() + '">' + icon("edit", "ic-sm") + "كل التدريبات</a></div>");
  };
})();
