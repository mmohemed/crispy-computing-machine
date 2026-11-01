/* ==========================================================
   CodeWay — البحث: فهرس موحّد لكل المحتوى + لوحة بحث سريعة (Ctrl+K أو /)
   الفهرس مستخدم أيضاً في صفحة الاستكشاف والصفحة الرئيسية.
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon;

  CW.searchTypes = {
    lang: { label: "لغة برمجة", plural: "لغات البرمجة", icon: "code" },
    tool: { label: "أداة وتقنية", plural: "الأدوات والتقنيات", icon: "wrench" },
    field: { label: "مجال", plural: "المجالات", icon: "compass" },
    career: { label: "مسار مهني", plural: "المسارات المهنية", icon: "route" },
    ai: { label: "ذكاء اصطناعي", plural: "الذكاء الاصطناعي", icon: "sparkles" },
    cs: { label: "علوم الحاسوب", plural: "علوم الحاسوب", icon: "graduation" },
    project: { label: "مشروع", plural: "المشاريع", icon: "rocket" },
    page: { label: "صفحة", plural: "صفحات المنصة", icon: "file" }
  };

  var INDEX = null;
  CW.searchIndex = function () {
    if (INDEX) return INDEX;
    INDEX = [];
    function add(o) { o.n = CW.norm([o.title, o.sub].concat(o.keys || []).join(" ")); o.nt = CW.norm(o.title); INDEX.push(o); }
    D.languages.forEach(function (l) { add({ type: "lang", id: l.id, title: l.name, sub: l.tagline, url: R.language(l.id), item: l, level: l.level, keys: l.uses }); });
    D.tools.forEach(function (t) { var c = CW.find("toolCategories", t.cat); add({ type: "tool", id: t.id, title: t.name, sub: c.name + " · " + t.tagline, url: R.tool(t.id), item: t, cat: t.cat, keys: t.uses.concat([c.name]) }); });
    D.fields.forEach(function (f) { add({ type: "field", id: f.id, title: f.name, sub: f.en, url: R.field(f.id), icon: f.icon, keys: [f.tagline].concat(f.skills) }); });
    D.careers.forEach(function (c) { add({ type: "career", id: c.id, title: c.name, sub: c.en, url: R.career(c.id), icon: c.icon, cat: c.cat, keys: [c.tagline].concat(c.skills) }); });
    D.aiAreas.forEach(function (a) { add({ type: "ai", id: a.id, title: a.name, sub: a.en, url: R.aiArea(a.id), icon: a.icon, keys: [a.tagline].concat(a.topics) }); });
    D.csTopics.forEach(function (c) { add({ type: "cs", id: c.id, title: c.name, sub: c.en, url: R.csTopic(c.id), icon: c.icon, level: c.level, keys: [c.tagline].concat(c.units) }); });
    D.projects.forEach(function (p) { add({ type: "project", id: p.id, title: p.name, sub: CW.levels[p.level].name + " · " + p.tagline, url: R.project(p.id), icon: p.icon, level: p.level, keys: p.skills.concat(p.langs, p.tools) }); });
    [["محرر الأكواد", R.editor(), "terminal", "تشغيل كود"], ["الاختبارات", R.quizzes(), "clipboard", "اختبار"], ["التدريبات", R.exercises(), "edit", "تمارين"],
      ["لوحة المتعلم", R.dashboard(), "grid", "تقدم"], ["الملف الشخصي", R.profile(), "user", "حساب"], ["المراجع والتوثيق", R.references(), "book", "docs توثيق"],
      ["لوحة الإدارة", R.admin(), "sliders", "admin"], ["تصنيفات المشاريع", R.projectCategories(), "folder", "تصنيف"]].forEach(function (p) {
      add({ type: "page", id: p[1], title: p[0], sub: "صفحة في المنصة", url: p[1], icon: p[2], keys: [p[3]] });
    });
    return INDEX;
  };

  CW.search = function (q, opts) {
    var nq = CW.norm(q);
    var list = CW.searchIndex();
    if (opts && opts.types) list = list.filter(function (e) { return opts.types.indexOf(e.type) > -1; });
    if (!nq) return list.slice();
    var words = nq.split(" ");
    return list.map(function (e) {
      for (var i = 0; i < words.length; i++) if (e.n.indexOf(words[i]) < 0) return null;
      var s = e.nt === nq ? 100 : e.nt.indexOf(nq) === 0 ? 60 : e.nt.indexOf(nq) > -1 ? 40 : 10;
      return { e: e, s: s };
    }).filter(Boolean).sort(function (a, b) { return b.s - a.s; }).map(function (x) { return x.e; });
  };

  CW.resultIcon = function (e) {
    if (e.item && e.item.mono) return CW.mono(e.item, "sm");
    return '<span class="icon-tile sm">' + icon(e.icon || CW.searchTypes[e.type].icon) + "</span>";
  };
  CW.highlight = function (text, q) {
    var t = String(text), i = q ? t.toLowerCase().indexOf(q.toLowerCase()) : -1;
    if (i < 0) return CW.esc(t);
    return CW.esc(t.slice(0, i)) + "<mark>" + CW.esc(t.slice(i, i + q.length)) + "</mark>" + CW.esc(t.slice(i + q.length));
  };
  CW.resultItem = function (e, q) {
    return '<a class="result-item" href="' + e.url + '">' + CW.resultIcon(e) +
      '<span class="grow"><strong><bdi>' + CW.highlight(e.title, (q || "").trim()) + "</bdi></strong><small>" + CW.searchTypes[e.type].label + " · " + CW.esc(e.sub) + "</small></span>" + icon("chevL", "ic-sm") + "</a>";
  };

  /* ---------- لوحة البحث السريعة ---------- */
  function openPalette(initial) {
    var m = CW.modal.open({
      width: "640px",
      raw: '<h2 id="cwModalTitle" class="sr-only">البحث في CodeWay</h2>' +
        '<div class="search-bar lg modal-search">' + icon("search", "ic-lg") +
        '<input type="search" id="paletteInput" placeholder="ابحث عن لغة أو أداة أو مجال أو مسار أو مشروع…" autocomplete="off" aria-label="البحث" autofocus>' +
        '<button class="btn btn-ghost btn-sm" data-close-modal>إغلاق</button></div>' +
        '<div class="palette-results" id="paletteResults"></div>' +
        '<div class="modal-foot" style="justify-content:space-between"><span class="text-sm text-muted">↑ ↓ للتنقل · Enter للفتح · Esc للإغلاق</span>' +
        '<a class="link-arrow text-sm" id="paletteAll" href="' + R.explore() + '">صفحة الاستكشاف الكاملة' + icon("arrowL", "ic-xs") + "</a></div>"
    });
    var input = CW.$("#paletteInput", m), box = CW.$("#paletteResults", m), kb = -1;
    function render() {
      var q = input.value, res = CW.search(q).slice(0, q ? 30 : 0);
      kb = -1;
      CW.$("#paletteAll", m).href = R.explore({ q: q });
      if (!q) {
        box.innerHTML = '<div class="palette-group">اقتراحات سريعة</div>' + ["python", "react", "frontend-developer", "ml"].map(function (id) {
          return CW.resultItem(CW.searchIndex().filter(function (e) { return e.id === id; })[0], "");
        }).join("");
        return;
      }
      if (!res.length) { box.innerHTML = CW.emptyState("لا توجد نتائج مطابقة", "جرّب كلمة أخرى مثل: Python أو Docker أو تحليل البيانات."); return; }
      var groups = {}, order = [];
      res.forEach(function (e) { if (!groups[e.type]) { groups[e.type] = []; order.push(e.type); } groups[e.type].push(e); });
      box.innerHTML = order.map(function (t) {
        return '<div class="palette-group">' + CW.searchTypes[t].plural + "</div>" + groups[t].map(function (e) { return CW.resultItem(e, q); }).join("");
      }).join("");
    }
    input.addEventListener("input", render);
    input.addEventListener("keydown", function (e) {
      var items = CW.$$(".result-item", box);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!items.length) return;
        e.preventDefault();
        kb = e.key === "ArrowDown" ? (kb + 1) % items.length : (kb - 1 + items.length) % items.length;
        items.forEach(function (it, i) { it.classList.toggle("kb", i === kb); });
        items[kb].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (items.length) location.href = items[kb > -1 ? kb : 0].href;
        else location.href = R.explore({ q: input.value });
      }
    });
    input.value = initial || "";
    render();
  }
  CW.openSearch = openPalette;

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-open-search]")) { e.preventDefault(); openPalette(); }
  });
  document.addEventListener("keydown", function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    var typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (document.activeElement && document.activeElement.isContentEditable);
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
      e.preventDefault();
      if (!document.getElementById("cwModal")) openPalette();
    }
  });
})();
