/* ==========================================================
   قسم المجالات البرمجية: القائمة وصفحة المجال (تصميم استكشافي)
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc;
  var groups = {
    web: { name: "تطوير التطبيقات", ids: ["frontend", "backend", "fullstack", "mobile", "desktop", "game-dev"] },
    ai: { name: "الذكاء الاصطناعي والبيانات", ids: ["ai", "ml", "dl", "data-science", "data-analytics", "data-engineering"] },
    infra: { name: "البنية التحتية والأمن", ids: ["cybersecurity", "devops", "cloud"] },
    hw: { name: "العتاد والأنظمة الذكية", ids: ["iot", "embedded", "robotics"] }
  };
  function groupOf(id) { for (var k in groups) if (groups[k].ids.indexOf(id) > -1) return k; return "web"; }

  CW.pages.fields = function () {
    CW.catalog({
      crumbs: [["المجالات"]], title: "المجالات البرمجية",
      lead: "اكتشف المجالات المختلفة في عالم البرمجة: المهارات التي تحتاجها، والتقنيات المستخدمة، والمسارات المهنية التي تقودك إليها.",
      placeholder: "ابحث عن مجال أو مهارة…", unit: "مجال",
      items: D.fields,
      text: function (f) { return [f.name, f.en, f.tagline].concat(f.skills).join(" "); },
      facets: [
        { key: "group", title: "المجموعة", options: Object.keys(groups).map(function (k) { return [k, groups[k].name]; }), get: function (f) { return [groupOf(f.id)]; } },
        { key: "lang", title: "يستخدم لغة", options: ["python", "javascript", "java", "csharp", "cpp", "sql"].map(function (id) { return [id, CW.find("languages", id).name]; }), get: function (f) { return f.langs; } }
      ],
      pageSize: 18, gridClass: "grid grid-3",
      render: CW.cards.field
    });
  };

  CW.pages.field = function () {
    var f = CW.find("fields", CW.qs("id"));
    if (!f) { CW.renderNotFound("المجال", "العودة إلى المجالات", R.fields()); return; }
    CW.setTitle(f.name);
    var langs = CW.findMany("languages", f.langs), tools = CW.findMany("tools", f.tools);
    var careers = CW.rel.careersWith("fields", f.id), projects = CW.rel.projectsWith("fields", f.id);
    var related = groups[groupOf(f.id)].ids.filter(function (x) { return x !== f.id; }).map(function (id) { return CW.find("fields", id); });
    var mainCareer = careers[0];

    var html = '<header class="field-hero" style="--fc:' + f.color + '"><div class="container">' +
      CW.breadcrumb([["المجالات", R.fields()], [f.name]]) +
      '<div class="field-hero-grid"><div>' +
      '<span class="field-badge">' + icon(f.icon, "ic-sm") + '<span class="ltr">' + esc(f.en) + "</span></span>" +
      "<h1>" + esc(f.name) + '</h1><p class="lead">' + esc(f.tagline) + "</p>" +
      '<div class="flex gap-3 wrap mt-6">' +
      (mainCareer ? '<a class="btn btn-primary btn-lg" href="' + R.career(mainCareer.id) + '">' + icon("route", "ic-sm") + "استكشف المسار: " + esc(mainCareer.name) + "</a>" : "") +
      '<a class="btn btn-outline btn-lg" href="' + R.fields() + '">' + icon("arrowR", "ic-sm") + "كل المجالات</a></div></div>" +
      /* لوحة المهارات البصرية */
      '<div class="skill-orbit" aria-label="مهارات المجال"><span class="core">' + icon(f.icon, "ic-xl") + "</span>" +
      f.skills.map(function (s, i) { return '<span class="sk sk' + i + '">' + CW.bdi(s) + "</span>"; }).join("") + "</div>" +
      "</div>" +
      '<div class="field-stats">' +
      [["code", langs.length, "لغات مستخدمة"], ["wrench", tools.length, "أدوات وتقنيات"], ["route", careers.length, "مسارات مهنية"], ["rocket", projects.length, "مشاريع منشورة"]].map(function (s) {
        return '<div><span class="icon-tile sm">' + icon(s[0]) + "</span><div><b>" + s[1] + "</b><span>" + s[2] + "</span></div></div>";
      }).join("") + "</div></div></header>" +

      '<div class="container field-body">' +
      /* المهارات + الموضوعات */
      '<section class="field-row"><div class="card card-pad"><h2 class="block-title">' + icon("target") + 'المهارات المرتبطة</h2><ul class="skill-list">' +
      f.skills.map(function (s, i) { return '<li><span class="lvl" style="--w:' + (90 - i * 9) + '%"></span><span>' + CW.bdi(s) + "</span></li>"; }).join("") +
      '</ul><p class="hint">الأشرطة توضح أولوية المهارة في المجال، وليست مقياساً لتقدمك.</p></div>' +
      '<div class="card card-pad"><h2 class="block-title">' + icon("layers") + 'الوحدات والموضوعات</h2><ol class="topic-timeline">' +
      f.topics.map(function (t, i) { return '<li><span class="n">' + (i + 1) + "</span><div><strong>" + esc(t) + '</strong><small>موضوع تنظيمي · المحتوى قيد الإعداد</small></div></li>'; }).join("") + "</ol></div></section>" +

      /* اللغات والأدوات */
      '<section class="field-block"><div class="block-head"><h2 class="block-title">' + icon("code") + "اللغات المستخدمة</h2></div>" +
      '<div class="lang-strip">' + langs.map(function (l) { return '<a class="lang-pill" href="' + R.language(l.id) + '" style="--brand:' + l.color + '">' + CW.mono(l, "sm") + "<span><strong><bdi>" + esc(l.name) + "</bdi></strong><small>" + CW.levels[l.level].name + "</small></span></a>"; }).join("") + "</div></section>" +
      '<section class="field-block"><div class="block-head"><h2 class="block-title">' + icon("wrench") + 'الأدوات والتقنيات</h2><a class="link-arrow" href="' + R.tools() + '">كل الأدوات' + icon("arrowL", "ic-xs") + '</a></div><div class="grid grid-4">' +
      tools.map(CW.cards.tool).join("") + "</div></section>" +

      /* المسارات المهنية */
      '<section class="field-block"><div class="block-head"><h2 class="block-title">' + icon("route") + "المسارات المهنية التي تقود إلى هذا المجال</h2></div>" +
      (careers.length ? '<div class="grid grid-3">' + careers.map(CW.cards.career).join("") + "</div>" : CW.placeholder("route", "لا توجد مسارات مرتبطة بعد", "")) + "</section>" +

      /* المشاريع */
      '<section class="field-block"><div class="block-head"><h2 class="block-title">' + icon("rocket") + 'مشاريع في هذا المجال</h2><a class="link-arrow" href="' + R.projects({ field: f.id }) + '">تصفح بالفلتر' + icon("arrowL", "ic-xs") + "</a></div>" +
      (projects.length ? '<div class="grid grid-3">' + projects.slice(0, 6).map(CW.cards.project).join("") + "</div>" : CW.placeholder("rocket", "لا توجد مشاريع منشورة في هذا المجال بعد", "ستضاف ضمن خطة المشاريع.")) + "</section>" +

      /* موارد ذات صلة */
      '<section class="field-block"><h2 class="block-title">' + icon("link") + 'موارد ذات صلة</h2><div class="grid grid-3">' +
      CW.cards.mini({ icon: "book", title: "المراجع والتوثيق", sub: "روابط التوثيق الرسمية للأدوات", url: R.references() }) +
      CW.cards.mini({ icon: "clipboard", title: "الاختبارات", sub: "قِس مستواك في تقنيات المجال", url: R.quizzes(), tone: "accent" }) +
      CW.cards.mini({ icon: "terminal", title: "محرر الأكواد", sub: "جرّب الشيفرة داخل المنصة", url: R.editor(), tone: "success" }) +
      '</div><h3 class="mt-8 mb-4" style="font-size:1rem">مجالات قريبة</h3>' + CW.chipLinks(related, "field") + "</section>" +
      "</div>";
    document.getElementById("main").innerHTML = html;
  };
})();
