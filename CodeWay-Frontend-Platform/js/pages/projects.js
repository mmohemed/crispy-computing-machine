/* ==========================================================
   قسم المشاريع: القائمة مع الفلاتر، التصنيفات، تفاصيل المشروع
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc;
  function usedIds(key) { return CW.unique([].concat.apply([], D.projects.map(function (p) { return p[key]; }))); }

  CW.pages.projects = function () {
    var plan = D.projectPlan, total = Object.keys(plan).reduce(function (s, k) { return s + plan[k]; }, 0);
    CW.catalog({
      crumbs: [["المشاريع العملية"]], title: "المشاريع العملية",
      lead: "مشاريع متدرجة من المبتدئ حتى الاحترافي. الخطة المستهدفة " + total + " مشروع، والمنشور حالياً " + D.projects.length + " مشروعاً كنماذج أولية.",
      headExtra: '<a class="btn btn-outline" href="' + R.projectCategories() + '">' + icon("folder", "ic-sm") + "تصفح التصنيفات</a>",
      before: '<div class="level-tiles mb-6">' + Object.keys(plan).map(function (k) {
        var have = D.projects.filter(function (p) { return p.level === k; }).length;
        return '<a class="level-tile" href="' + R.projects({ level: k }) + '">' + CW.levelBadge(k) + '<div class="big">' + have + ' <span class="text-sm text-muted" style="font-weight:500">من ' + plan[k] + '</span></div><p>مشروع منشور من الخطة</p><div class="progress sm mt-2"><span style="--v:' + Math.round(have / plan[k] * 100) + '%"></span></div></a>';
      }).join("") + "</div>",
      placeholder: "ابحث عن مشروع أو مهارة…", unit: "مشروع",
      items: D.projects,
      text: function (p) { return [p.name, p.tagline].concat(p.skills, p.langs, p.tools).join(" "); },
      facets: [
        { key: "level", title: "مستوى الصعوبة", options: Object.keys(CW.levels).map(function (k) { return [k, CW.levels[k].name]; }), get: function (p) { return [p.level]; } },
        { key: "lang", title: "اللغة", options: usedIds("langs").map(function (id) { return [id, CW.find("languages", id).name]; }), get: function (p) { return p.langs; } },
        { key: "field", title: "المجال", options: usedIds("fields").map(function (id) { return [id, CW.find("fields", id).name]; }), get: function (p) { return p.fields; } },
        { key: "tool", title: "التقنية", options: usedIds("tools").map(function (id) { return [id, CW.find("tools", id).name]; }), get: function (p) { return p.tools; } },
        { key: "career", title: "المسار المهني", options: usedIds("careers").map(function (id) { return [id, CW.find("careers", id).name]; }), get: function (p) { return p.careers; } }
      ],
      sorts: { lv: ["حسب المستوى", function (a, b) { return CW.levels[a.level].order - CW.levels[b.level].order; }], az: ["أبجدياً", function (a, b) { return a.name.localeCompare(b.name, "ar"); }] },
      pageSize: 9, gridClass: "grid grid-3",
      render: CW.cards.project
    });
  };

  CW.pages.projectCategories = function () {
    CW.setTitle("تصنيفات المشاريع");
    function block(title, ic, key, coll, param) {
      var ids = usedIds(key);
      return '<section class="tax-block card card-pad"><h2 class="block-title">' + icon(ic) + title + '</h2><div class="chip-list">' + ids.map(function (id) {
        var it = CW.find(coll, id), n = D.projects.filter(function (p) { return p[key].indexOf(id) > -1; }).length, o = {}; o[param] = id;
        return '<a class="chip" href="' + R.projects(o) + '">' + (it.mono ? CW.mono(it, "xs") : icon(it.icon || "folder", "ic-sm")) + CW.bdi(it.name) + ' <span class="n">' + n + "</span></a>";
      }).join("") + "</div></section>";
    }
    var plan = D.projectPlan;
    document.getElementById("main").innerHTML =
      '<header class="page-head"><div class="container">' + CW.breadcrumb([["المشاريع العملية", R.projects()], ["التصنيفات"]]) +
      '<h1>تصنيفات المشاريع</h1><p class="lead">تصفح المشاريع حسب المستوى أو اللغة أو المجال أو التقنية أو المسار المهني. اختر أي تصنيف لعرض مشاريعه.</p></div></header>' +
      '<div class="container catalog-body taxonomy">' +
      '<section><h2 class="block-title">' + icon("gauge") + 'حسب مستوى الصعوبة</h2><div class="level-tiles">' + Object.keys(plan).map(function (k) {
        var have = D.projects.filter(function (p) { return p.level === k; }).length;
        return '<a class="level-tile" href="' + R.projects({ level: k }) + '">' + CW.levelBadge(k) + '<div class="big">' + plan[k] + '</div><p>مشروع في الخطة · ' + have + " منشور</p></a>";
      }).join("") + "</div></section>" +
      block("حسب اللغة", "code", "langs", "languages", "lang") + block("حسب المجال", "compass", "fields", "fields", "field") +
      block("حسب التقنية", "wrench", "tools", "tools", "tool") + block("حسب المسار المهني", "route", "careers", "careers", "career") + "</div>";
  };

  CW.pages.project = function () {
    var p = CW.find("projects", CW.qs("id"));
    if (!p) { CW.renderNotFound("المشروع", "العودة إلى المشاريع", R.projects()); return; }
    CW.setTitle(p.name);
    var langs = CW.findMany("languages", p.langs), tools = CW.findMany("tools", p.tools);
    var key = "project-req:" + p.id, done = CW.store.get(key, []);
    var started = CW.store.get("started-projects", []).indexOf(p.id) > -1;
    var related = D.projects.filter(function (x) { return x.id !== p.id && (x.fields.some(function (f) { return p.fields.indexOf(f) > -1; })); }).slice(0, 3);

    document.getElementById("main").innerHTML =
      '<header class="project-hero"><div class="container">' + CW.breadcrumb([["المشاريع العملية", R.projects()], [p.name]]) +
      '<div class="ph-grid"><div><div class="flex items-center gap-2 wrap">' + CW.levelBadge(p.level) + langs.concat(tools).slice(0, 4).map(function (t) { return '<span class="badge badge-outline">' + CW.bdi(t.name) + "</span>"; }).join("") + "</div>" +
      "<h1>" + esc(p.name) + '</h1><p class="lead">' + esc(p.tagline) + "</p>" +
      '<div class="flex gap-3 wrap mt-6"><button class="btn btn-primary btn-lg" id="startProject">' + icon(started ? "check" : "play", "ic-sm") + (started ? "تم بدء المشروع" : "ابدأ المشروع") + '</button>' +
      '<a class="btn btn-outline btn-lg" href="' + R.projects() + '">' + icon("arrowR", "ic-sm") + "العودة إلى المشاريع</a></div></div>" +
      '<figure class="ph-preview"><img src="' + CW.asset("images/project-preview.svg") + '" alt="مساحة معاينة لمشروع ' + esc(p.name) + ' — ستُستبدل بصورة حقيقية للمشروع"><figcaption>' + icon("image", "ic-xs") + " مساحة صور المعاينة</figcaption></figure></div></div></header>" +

      '<div class="container project-layout"><div>' +
      '<section class="p-section"><h2 class="block-title">' + icon("info") + 'وصف المشروع</h2><div class="card card-pad"><p>' + esc(p.tagline) + '</p><p class="text-muted text-sm mt-2">سيظهر الوصف التفصيلي للمشروع هنا.</p></div></section>' +
      '<section class="p-section"><div class="flex items-center wrap gap-3" style="justify-content:space-between"><h2 class="block-title">' + icon("list") + 'متطلبات المشروع</h2><span class="text-sm text-muted" id="reqCount"></span></div>' +
      '<div class="card req-list" id="reqList">' + p.requirements.map(function (r, i) {
        return '<label class="req"><input type="checkbox" data-i="' + i + '"' + (done.indexOf(i) > -1 ? " checked" : "") + "><span>" + CW.bdi(r) + "</span></label>";
      }).join("") + '</div><p class="hint">تُحفظ علامات الإنجاز في متصفحك فقط.</p></section>' +
      '<section class="p-section"><h2 class="block-title">' + icon("map") + 'خطوات التنفيذ</h2><ol class="impl-steps">' +
      ["تحليل المتطلبات والتخطيط", "إعداد المشروع والبيئة", "تنفيذ الوظائف الأساسية", "الاختبار والتحسين", "النشر والتوثيق"].map(function (s, i) {
        return '<li><span class="n">' + (i + 1) + "</span><div><strong>" + s + '</strong><p class="text-sm text-muted">سيظهر شرح هذه الخطوة هنا لاحقاً.</p></div></li>';
      }).join("") + "</ol></section>" +
      '<section class="p-section"><h2 class="block-title">' + icon("folder") + 'الملفات والكود</h2><div class="files-box"><ul class="file-tree" aria-label="هيكل ملفات تجريبي">' +
      '<li class="dir">' + icon("folder", "ic-sm") + esc(p.id) + "/</li><li>" + icon("file", "ic-sm") + "README.md</li><li>" + icon("fileCode", "ic-sm") + "src/</li><li>" + icon("fileCode", "ic-sm") + "tests/</li></ul>" +
      '<div class="grow">' + CW.codeBlock({ file: "README.md", code: "# " + p.name + "\n\nستضاف ملفات المشروع والكود المبدئي هنا لاحقاً." }) + "</div></div></section>" +
      "</div>" +
      '<aside class="sticky-side"><div class="card card-pad"><h2 class="block-title" style="font-size:1rem">' + icon("info") + 'بطاقة المشروع</h2><ul class="meta-list">' +
      "<li>" + icon("gauge", "ic-sm") + "المستوى: " + CW.levels[p.level].name + "</li><li>" + icon("list", "ic-sm") + p.requirements.length + " متطلبات</li><li>" + icon("target", "ic-sm") + p.skills.length + " مهارات مستهدفة</li></ul></div>" +
      '<div class="card card-pad mt-4"><h2 class="block-title" style="font-size:1rem">' + icon("target") + 'المهارات المستهدفة</h2><ul class="tag-list">' + p.skills.map(function (s) { return "<li>" + CW.bdi(s) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="card card-pad mt-4"><h2 class="block-title" style="font-size:1rem">' + icon("code") + "التقنيات المطلوبة</h2>" + CW.chipLinks(langs, "lang") + '<div class="mt-2"></div>' + CW.chipLinks(tools, "tool") + "</div>" +
      '<div class="card card-pad mt-4"><h2 class="block-title" style="font-size:1rem">' + icon("route") + "مسارات ومجالات</h2>" + CW.chipLinks(CW.findMany("careers", p.careers), "career") + '<div class="mt-2"></div>' + CW.chipLinks(CW.findMany("fields", p.fields), "field") + "</div></aside></div>" +
      (related.length ? '<section class="container" style="padding-bottom:64px"><h2 class="block-title">' + icon("rocket") + 'مشاريع مشابهة</h2><div class="grid grid-3">' + related.map(CW.cards.project).join("") + "</div></section>" : "");

    function count() {
      var n = CW.$$("#reqList input:checked").length;
      CW.$("#reqCount").textContent = n + " من " + p.requirements.length + " مكتملة";
    }
    CW.$("#reqList").addEventListener("change", function () {
      var arr = CW.$$("#reqList input:checked").map(function (c) { return +c.getAttribute("data-i"); });
      CW.store.set(key, arr); count();
    });
    count();
    CW.$("#startProject").addEventListener("click", function () {
      var list = CW.store.get("started-projects", []);
      if (list.indexOf(p.id) < 0) list.push(p.id);
      CW.store.set("started-projects", list);
      this.innerHTML = icon("check", "ic-sm") + "تم بدء المشروع";
      CW.toast("سُجّل بدء المشروع محلياً في متصفحك. المزامنة مع حسابك تحتاج Backend.", "success");
    });
  };
})();
