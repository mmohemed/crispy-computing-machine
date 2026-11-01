/* ==========================================================
   صفحة الاستكشاف الموحدة: بحث وفلترة عبر اللغات والأدوات والمجالات والمسارات والمشاريع
   ========================================================== */
CW.pages.explore = function () {
  "use strict";
  var icon = CW.icon, esc = CW.esc, T = CW.searchTypes;
  var types = ["lang", "tool", "field", "career", "project", "ai", "cs"];
  var items = CW.searchIndex().filter(function (e) { return types.indexOf(e.type) > -1; });
  var levelOpts = Object.keys(CW.levels).map(function (k) { return [k, CW.levels[k].name]; });

  CW.catalog({
    crumbs: [["استكشاف المحتوى"]], title: "استكشف كل محتوى CodeWay",
    lead: "ابحث وصفِّ في مكان واحد: لغات البرمجة، الأدوات والتقنيات، المجالات، المسارات المهنية، المشاريع، الذكاء الاصطناعي وعلوم الحاسوب.",
    placeholder: "ماذا تريد أن تتعلم؟ جرّب: Python، Docker، علم البيانات…", unit: "نتيجة",
    items: items,
    text: function (e) { return [e.title, e.sub].concat(e.keys || []).join(" "); },
    facets: [
      { key: "type", title: "نوع المحتوى", options: types.map(function (t) { return [t, T[t].plural]; }), get: function (e) { return [e.type]; } },
      { key: "level", title: "المستوى", options: levelOpts, get: function (e) { return e.level ? [e.level] : []; } },
      { key: "toolcat", title: "تصنيف الأداة", options: CW.data.toolCategories.map(function (c) { return [c.id, c.short || c.name]; }), get: function (e) { return e.type === "tool" ? [e.cat] : []; } }
    ],
    sorts: { rel: ["الأكثر صلة", null], az: ["أبجدياً", function (a, b) { return a.title.localeCompare(b.title, "ar"); }] },
    pageSize: 20, gridClass: "result-grid",
    render: function (e) {
      return '<article class="card card-hover explore-card">' + CW.resultIcon(e) + '<div class="grow"><span class="type">' + T[e.type].label + "</span>" +
        '<h3><a class="card-link" href="' + e.url + '"><bdi>' + esc(e.title) + "</bdi></a></h3><p>" + CW.bdi(e.sub) + "</p></div>" + (e.level ? CW.levelBadge(e.level) : "") + "</article>";
    }
  });
};
