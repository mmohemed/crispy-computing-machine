/* ==========================================================
   المراجع والتوثيق الرسمي
   الروابط مأخوذة من ملفات البيانات (languages.js و tools.js) وهي روابط رسمية معروفة فقط.
   ========================================================== */
CW.pages.references = function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc;
  CW.setTitle("المراجع والتوثيق");
  var items = D.languages.map(function (l) { return { kind: "lang", cat: "languages", item: l, links: l.docs || [], url: R.language(l.id) }; })
    .concat(D.tools.map(function (t) { return { kind: "tool", cat: t.cat, item: t, links: t.docs ? [{ label: "التوثيق الرسمي", url: t.docs }] : [], url: R.tool(t.id) }; }));
  var cats = [["all", "الكل"], ["languages", "لغات البرمجة"]].concat(D.toolCategories.map(function (c) { return [c.id, c.short || c.name]; }));
  var active = CW.qs("cat") || "all";

  document.getElementById("main").innerHTML =
    '<header class="page-head"><div class="container">' + CW.breadcrumb([["المراجع والتوثيق"]]) +
    '<div class="head-row"><div><h1>المراجع والتوثيق الرسمي</h1><p class="lead">روابط التوثيق الرسمية للغات والأدوات والتقنيات في مكان واحد. تُفتح الروابط في نافذة جديدة.</p></div>' +
    '<span class="badge badge-primary">' + items.filter(function (i) { return i.links.length; }).length + " مرجعاً</span></div></div></header>" +
    '<div class="container catalog-body">' +
    '<div class="toolbar"><div class="search-bar">' + icon("search") + '<input type="search" id="refQ" placeholder="ابحث عن لغة أو أداة…" aria-label="بحث في المراجع"></div><span class="count" id="refCount" aria-live="polite"></span></div>' +
    '<div class="chip-list mb-6" id="refCats" role="group" aria-label="التصنيف">' + cats.map(function (c) { return '<button class="chip' + (c[0] === active ? " active" : "") + '" data-c="' + c[0] + '" aria-pressed="' + (c[0] === active) + '">' + esc(c[1]) + "</button>"; }).join("") + "</div>" +
    '<div class="notice mb-6">' + icon("info", "ic-sm") + "<span>نعرض الروابط الرسمية المعروفة فقط. إذا لم يتوفر رابط موثوق لعنصر ما فلن يظهر له زر.</span></div>" +
    '<div class="grid grid-3" id="refGrid"></div></div>';

  function card(i) {
    var it = i.item;
    return '<article class="card ref-card"><div class="top">' + CW.mono(it, "sm") + '<div class="grow"><h3><a href="' + i.url + '"><bdi>' + esc(it.name) + '</bdi></a></h3><span class="text-sm text-muted">' + (i.kind === "lang" ? "لغة برمجة" : esc(CW.find("toolCategories", it.cat).short || CW.find("toolCategories", it.cat).name)) + "</span></div></div>" +
      '<div class="links">' + (i.links.length ? i.links.map(function (l) {
        return '<a class="ref-link" href="' + l.url + '" target="_blank" rel="noopener noreferrer">' + icon("book", "ic-sm") + '<span class="grow" style="min-width:0"><span style="display:block">' + CW.bdi(l.label) + '</span><span class="url" style="display:block">' + esc(l.url.replace(/^https?:\/\//, "")) + "</span></span>" + icon("external", "ic-sm") + '<span class="sr-only">(يفتح في نافذة جديدة)</span></a>';
      }).join("") : '<p class="text-sm text-muted">لا يتوفر رابط موثوق حالياً.</p>') + "</div></article>";
  }
  function render() {
    var q = CW.norm(CW.$("#refQ").value);
    var list = items.filter(function (i) { return (active === "all" || i.cat === active) && (!q || CW.norm(i.item.name + " " + i.item.tagline).indexOf(q) > -1); });
    CW.$("#refCount").textContent = list.length + " عنصر";
    CW.$("#refGrid").innerHTML = list.length ? list.map(card).join("") : '<div style="grid-column:1/-1">' + CW.emptyState("لا توجد مراجع مطابقة", "جرّب كلمة بحث أخرى أو تصنيفاً مختلفاً.") + "</div>";
  }
  CW.$("#refQ").addEventListener("input", render);
  CW.$("#refCats").addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    active = b.getAttribute("data-c");
    CW.$$("#refCats .chip").forEach(function (x) { x.classList.toggle("active", x === b); x.setAttribute("aria-pressed", x === b); });
    render();
  });
  render();
};
