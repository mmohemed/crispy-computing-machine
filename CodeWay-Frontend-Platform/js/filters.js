/* ==========================================================
   CodeWay — محرك الفلترة والترقيم العام
   الاستخدام:
     var f = CW.createFilter({
       items: [...],                         // البيانات
       text: function (item) { return "..." },   // نص البحث
       facets: { level: function (item) { return [item.level]; } },
       pageSize: 12,
       onChange: function (state) { ... }   // يُستدعى بعد كل تغيير
     });
     f.set("level", ["beginner"]); f.search("python"); f.page(2);
   ========================================================== */
(function () {
  "use strict";

  CW.createFilter = function (opts) {
    var state = { q: "", facets: {}, page: 1, sort: opts.defaultSort || null };
    Object.keys(opts.facets || {}).forEach(function (k) { state.facets[k] = []; });

    function matches(item, skip) {
      if (state.q) {
        var hay = CW.norm(opts.text(item)), words = CW.norm(state.q).split(" ");
        for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) < 0) return false;
      }
      var keys = Object.keys(state.facets);
      for (var j = 0; j < keys.length; j++) {
        var k = keys[j], sel = state.facets[k];
        if (k === skip || !sel.length) continue;
        var vals = opts.facets[k](item) || [];
        if (!sel.some(function (s) { return vals.indexOf(s) > -1; })) return false;
      }
      return true;
    }

    function result() {
      var list = opts.items.filter(function (it) { return matches(it); });
      if (state.sort && opts.sorts && opts.sorts[state.sort]) list = list.slice().sort(opts.sorts[state.sort]);
      var size = opts.pageSize || list.length || 1, pages = Math.max(1, Math.ceil(list.length / size));
      if (state.page > pages) state.page = pages;
      return { all: list, total: list.length, pages: pages, page: state.page, items: list.slice((state.page - 1) * size, state.page * size) };
    }

    /* عدد العناصر لكل قيمة فلتر (مع احترام بقية الفلاتر) */
    function counts(facet) {
      var c = {};
      opts.items.forEach(function (it) {
        if (!matches(it, facet)) return;
        (opts.facets[facet](it) || []).forEach(function (v) { c[v] = (c[v] || 0) + 1; });
      });
      return c;
    }

    function emit() { if (opts.onChange) opts.onChange(result(), api); }
    var api = {
      state: state, result: result, counts: counts,
      search: function (q) { state.q = q || ""; state.page = 1; emit(); },
      set: function (facet, values) { state.facets[facet] = values || []; state.page = 1; emit(); },
      toggle: function (facet, value) {
        var a = state.facets[facet], i = a.indexOf(value);
        if (i > -1) a.splice(i, 1); else a.push(value);
        state.page = 1; emit();
      },
      sortBy: function (s) { state.sort = s; emit(); },
      page: function (n) { state.page = n; emit(); },
      reset: function () { state.q = ""; Object.keys(state.facets).forEach(function (k) { state.facets[k] = []; }); state.page = 1; emit(); },
      refresh: emit
    };
    return api;
  };

  /* ترقيم الصفحات */
  CW.renderPagination = function (container, res, onPage) {
    if (!container) return;
    if (res.pages <= 1) { container.innerHTML = ""; return; }
    var html = '<button class="page-btn" data-page="' + (res.page - 1) + '"' + (res.page === 1 ? " disabled" : "") + ' aria-label="الصفحة السابقة">' + CW.icon("chevR", "ic-sm") + "</button>";
    for (var i = 1; i <= res.pages; i++) {
      html += '<button class="page-btn" data-page="' + i + '"' + (i === res.page ? ' aria-current="page"' : "") + ' aria-label="الصفحة ' + i + '">' + i + "</button>";
    }
    html += '<button class="page-btn" data-page="' + (res.page + 1) + '"' + (res.page === res.pages ? " disabled" : "") + ' aria-label="الصفحة التالية">' + CW.icon("chevL", "ic-sm") + "</button>";
    container.innerHTML = '<nav class="pagination" aria-label="ترقيم الصفحات">' + html + "</nav>";
    CW.$$("[data-page]", container).forEach(function (b) {
      b.addEventListener("click", function () { onPage(parseInt(b.getAttribute("data-page"), 10)); });
    });
  };

  /* قائمة اختيار متعدد لفلتر: options = [[value, label]] */
  CW.renderCheckGroup = function (title, facet, options, counts, selected) {
    return '<div class="filter-group"><h3>' + title + "</h3>" + options.map(function (o) {
      var n = counts[o[0]] || 0, on = selected.indexOf(o[0]) > -1;
      return '<label class="check"><input type="checkbox" data-facet="' + facet + '" value="' + CW.esc(o[0]) + '"' + (on ? " checked" : "") + (n || on ? "" : " disabled") + "><span>" + o[1] + '</span><span class="n">' + n + "</span></label>";
    }).join("") + "</div>";
  };
})();

/* ==========================================================
   صفحة قائمة عامة (Catalog) مع بحث وفلاتر جانبية وترقيم ومزامنة مع الرابط
   ========================================================== */
CW.catalog = function (o) {
  "use strict";
  var icon = CW.icon, main = document.getElementById("main");
  var params = new URLSearchParams(location.search);
  CW.setTitle(o.title);

  main.innerHTML =
    '<header class="page-head catalog-head"><div class="container">' + CW.breadcrumb(o.crumbs) +
    '<div class="head-row"><div><h1>' + o.title + '</h1><p class="lead">' + o.lead + "</p></div>" + (o.headExtra || "") + "</div></div></header>" +
    '<div class="container catalog-body">' + (o.before || "") +
    '<div class="with-sidebar">' +
    '<aside class="card filter-panel collapsible sticky-side" id="filterPanel" aria-label="الفلاتر"></aside>' +
    '<section aria-label="النتائج"><div class="toolbar">' +
    '<div class="search-bar">' + icon("search") + '<input type="search" id="catQ" placeholder="' + (o.placeholder || "ابحث…") + '" aria-label="بحث"></div>' +
    '<button class="btn btn-outline filters-toggle" data-toggle="#filterPanel" aria-expanded="false">' + icon("filter", "ic-sm") + "الفلاتر</button>" +
    (o.sorts ? '<select class="select" id="catSort" aria-label="الترتيب" style="width:auto">' + Object.keys(o.sorts).map(function (k) { return '<option value="' + k + '">' + o.sorts[k][0] + "</option>"; }).join("") + "</select>" : "") +
    '<span class="count" id="catCount" aria-live="polite"></span></div>' +
    '<div class="active-filters" id="activeFilters"></div>' +
    '<div class="' + (o.gridClass || "grid grid-3") + '" id="catGrid"></div><div id="catPages"></div></section></div></div>';

  var facetDefs = {}, labels = {};
  o.facets.forEach(function (f) { facetDefs[f.key] = f.get; labels[f.key] = {}; f.options.forEach(function (op) { labels[f.key][op[0]] = op[1]; }); });
  var sorts = {};
  if (o.sorts) Object.keys(o.sorts).forEach(function (k) { sorts[k] = o.sorts[k][1]; });

  var filter = CW.createFilter({
    items: o.items, text: o.text, facets: facetDefs, pageSize: o.pageSize || 12, sorts: sorts,
    defaultSort: o.sorts ? Object.keys(o.sorts)[0] : null,
    onChange: render
  });

  function syncUrl() {
    var p = new URLSearchParams();
    if (filter.state.q) p.set("q", filter.state.q);
    Object.keys(filter.state.facets).forEach(function (k) { if (filter.state.facets[k].length) p.set(k, filter.state.facets[k].join(",")); });
    if (filter.state.page > 1) p.set("page", filter.state.page);
    try { history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : "")); } catch (e) { /* بعض المتصفحات تمنع ذلك مع file:// */ }
  }

  function renderPanel() {
    CW.$("#filterPanel").innerHTML = '<h2>تصفية النتائج <button class="btn btn-ghost btn-sm" id="catReset">مسح الكل</button></h2>' +
      o.facets.map(function (f) { return CW.renderCheckGroup(f.title, f.key, f.options, filter.counts(f.key), filter.state.facets[f.key]); }).join("");
    CW.$("#catReset").addEventListener("click", function () { CW.$("#catQ").value = ""; filter.reset(); });
  }

  function render(res) {
    renderPanel();
    CW.$("#catCount").textContent = res.total + " من " + o.items.length + " " + (o.unit || "عنصر");
    CW.$("#catGrid").innerHTML = res.items.length ? res.items.map(o.render).join("") :
      '<div style="grid-column:1/-1">' + CW.emptyState("لا توجد نتائج مطابقة", o.emptyText || "جرّب تغيير كلمات البحث أو إزالة بعض الفلاتر.", '<button class="btn btn-outline" id="emptyReset">إعادة ضبط الفلاتر</button>') + "</div>";
    var er = CW.$("#emptyReset"); if (er) er.addEventListener("click", function () { CW.$("#catQ").value = ""; filter.reset(); });
    var chips = [];
    Object.keys(filter.state.facets).forEach(function (k) {
      filter.state.facets[k].forEach(function (v) { chips.push('<button class="chip" data-rm="' + k + "|" + CW.esc(v) + '">' + (labels[k][v] || v) + icon("x", "ic-xs") + "</button>"); });
    });
    CW.$("#activeFilters").innerHTML = chips.join("");
    CW.renderPagination(CW.$("#catPages"), res, function (n) { filter.page(n); CW.$("#catGrid").scrollIntoView({ behavior: "smooth", block: "start" }); });
    syncUrl();
    if (o.afterRender) o.afterRender(res);
  }

  CW.$("#filterPanel").addEventListener("change", function (e) {
    var cb = e.target.closest("[data-facet]"); if (cb) filter.toggle(cb.getAttribute("data-facet"), cb.value);
  });
  CW.$("#activeFilters").addEventListener("click", function (e) {
    var b = e.target.closest("[data-rm]"); if (!b) return;
    var kv = b.getAttribute("data-rm").split("|"); filter.toggle(kv[0], kv[1]);
  });
  var t; CW.$("#catQ").addEventListener("input", function (e) { clearTimeout(t); t = setTimeout(function () { filter.search(e.target.value); }, 120); });
  if (o.sorts) CW.$("#catSort").addEventListener("change", function (e) { filter.sortBy(e.target.value); });

  /* القيم الابتدائية من الرابط */
  if (params.get("q")) { filter.state.q = params.get("q"); CW.$("#catQ").value = params.get("q"); }
  o.facets.forEach(function (f) { var v = params.get(f.key); if (v) filter.state.facets[f.key] = v.split(",").filter(function (x) { return labels[f.key][x]; }); });
  if (params.get("page")) filter.state.page = parseInt(params.get("page"), 10) || 1;
  filter.refresh();
  return filter;
};
