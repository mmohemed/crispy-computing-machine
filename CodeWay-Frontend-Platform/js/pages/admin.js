/* ==========================================================
   لوحة الإدارة (واجهات شكلية تجريبية)
   - تقرأ من ملفات البيانات نفسها لعرض المحتوى.
   - الإضافة والتعديل والحذف تتم في الذاكرة فقط وتختفي عند تحديث الصفحة.
   - لا يوجد نظام صلاحيات أو قاعدة بيانات؛ الربط الحقيقي يحتاج Backend.
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc;

  /* تعريف الكيانات القابلة للإدارة */
  function lessonsRows() {
    var rows = [];
    D.languages.slice(0, 4).forEach(function (l) {
      var t = CW.track("lang", l.id);
      t.modules.slice(0, 2).forEach(function (m) {
        m.lessons.forEach(function (ls) { rows.push({ id: l.id + "-" + m.n + "-" + ls.n, name: ls.title, track: l.name, module: m.n + ". " + m.title, status: "مسودة", url: t.lessonUrl(m.n, ls.n) }); });
      });
    });
    return rows;
  }
  var ENTITIES = {
    languages: { title: "إدارة اللغات", icon: "code", unit: "لغة",
      rows: function () { return D.languages.map(function (l) { return { id: l.id, item: l, name: l.name, level: CW.levels[l.level].name, modules: CW.track("lang", l.id).modules.length, status: "منشور", url: R.language(l.id) }; }); },
      cols: [["name", "اللغة"], ["level", "المستوى"], ["modules", "الوحدات"], ["status", "الحالة"]], filter: ["level", "المستوى"],
      form: [["name", "اسم اللغة", "text"], ["level", "المستوى", "select", ["مبتدئ", "متوسط", "متقدم"]], ["status", "الحالة", "select", ["منشور", "مسودة"]]] },
    tools: { title: "إدارة الأدوات", icon: "wrench", unit: "أداة",
      rows: function () { return D.tools.map(function (t) { return { id: t.id, item: t, name: t.name, cat: CW.find("toolCategories", t.cat).short || CW.find("toolCategories", t.cat).name, docs: t.docs ? "متوفر" : "—", status: "منشور", url: R.tool(t.id) }; }); },
      cols: [["name", "الأداة"], ["cat", "التصنيف"], ["docs", "التوثيق"], ["status", "الحالة"]], filter: ["cat", "التصنيف"],
      form: [["name", "اسم الأداة", "text"], ["cat", "التصنيف", "select", D.toolCategories.map(function (c) { return c.short || c.name; })], ["status", "الحالة", "select", ["منشور", "مسودة"]]] },
    fields: { title: "إدارة المجالات", icon: "compass", unit: "مجال",
      rows: function () { return D.fields.map(function (f) { return { id: f.id, icon: f.icon, name: f.name, en: f.en, careers: CW.rel.careersWith("fields", f.id).length, status: "منشور", url: R.field(f.id) }; }); },
      cols: [["name", "المجال"], ["en", "الاسم الإنجليزي"], ["careers", "المسارات"], ["status", "الحالة"]], filter: null,
      form: [["name", "اسم المجال", "text"], ["en", "الاسم الإنجليزي", "text"], ["status", "الحالة", "select", ["منشور", "مسودة"]]] },
    careers: { title: "إدارة المسارات", icon: "route", unit: "مسار",
      rows: function () { return D.careers.map(function (c) { return { id: c.id, icon: c.icon, name: c.name, cat: D.careerCategories[c.cat].name, stages: 5, status: c.featured ? "مميز" : "منشور", url: R.career(c.id) }; }); },
      cols: [["name", "المسار"], ["cat", "التصنيف"], ["stages", "المراحل"], ["status", "الحالة"]], filter: ["cat", "التصنيف"],
      form: [["name", "اسم المسار", "text"], ["cat", "التصنيف", "select", Object.keys(D.careerCategories).map(function (k) { return D.careerCategories[k].name; })], ["status", "الحالة", "select", ["منشور", "مميز", "مسودة"]]] },
    lessons: { title: "إدارة الوحدات والدروس", icon: "book", unit: "درس",
      rows: lessonsRows,
      cols: [["name", "الدرس"], ["track", "المسار"], ["module", "الوحدة"], ["status", "الحالة"]], filter: ["track", "المسار"],
      form: [["name", "عنوان الدرس", "text"], ["module", "الوحدة", "text"], ["status", "الحالة", "select", ["مسودة", "قيد المراجعة", "منشور"]]],
      note: "يعرض الجدول عينة من دروس أول أربع لغات. كل الدروس حالياً قوالب بانتظار المحتوى." },
    projects: { title: "إدارة المشاريع", icon: "rocket", unit: "مشروع",
      rows: function () { return D.projects.map(function (p) { return { id: p.id, icon: p.icon, name: p.name, level: CW.levels[p.level].name, reqs: p.requirements.length, status: "منشور", url: R.project(p.id) }; }); },
      cols: [["name", "المشروع"], ["level", "المستوى"], ["reqs", "المتطلبات"], ["status", "الحالة"]], filter: ["level", "المستوى"],
      form: [["name", "اسم المشروع", "text"], ["level", "المستوى", "select", ["مبتدئ", "متوسط", "متقدم", "احترافي"]], ["status", "الحالة", "select", ["منشور", "مسودة"]]] },
    quizzes: { title: "إدارة الاختبارات", icon: "clipboard", unit: "اختبار",
      rows: function () { return D.quizzes.map(function (q) { return { id: q.id, icon: "clipboard", name: q.title, track: CW.track(q.track.type, q.track.id).name, qs: (D.questionBanks[q.bank] || []).length, status: "تجريبي", url: R.quiz(q.id) }; }); },
      cols: [["name", "الاختبار"], ["track", "المسار"], ["qs", "الأسئلة"], ["status", "الحالة"]], filter: null,
      form: [["name", "عنوان الاختبار", "text"], ["status", "الحالة", "select", ["تجريبي", "منشور", "مسودة"]]] },
    users: { title: "إدارة المستخدمين", icon: "users", unit: "مستخدم",
      rows: function () { return D.demoUsers.map(function (u) { return { id: u.id, icon: "user", name: u.name, email: u.email, role: u.role, status: u.status }; }); },
      cols: [["name", "المستخدم"], ["email", "البريد"], ["role", "الدور"], ["status", "الحالة"]], filter: ["role", "الدور"],
      form: [["name", "الاسم", "text"], ["email", "البريد الإلكتروني", "email"], ["role", "الدور", "select", ["متعلم", "مدرّب", "مشرف محتوى", "مدير"]], ["status", "الحالة", "select", ["نشط", "موقوف", "بانتظار التفعيل"]]],
      note: "جميع المستخدمين هنا وهميون لعرض الواجهة." },
    categories: { title: "إدارة التصنيفات", icon: "tag", unit: "تصنيف",
      rows: function () {
        return D.toolCategories.map(function (c) { return { id: "t-" + c.id, icon: c.icon, name: c.name, type: "تصنيف أدوات", count: D.tools.filter(function (t) { return t.cat === c.id; }).length, status: "منشور" }; })
          .concat(Object.keys(D.careerCategories).map(function (k) { return { id: "c-" + k, icon: "route", name: D.careerCategories[k].name, type: "تصنيف مسارات", count: D.careers.filter(function (c) { return c.cat === k; }).length, status: "منشور" }; }))
          .concat(Object.keys(CW.levels).map(function (k) { return { id: "l-" + k, icon: "gauge", name: CW.levels[k].name, type: "مستوى صعوبة", count: D.projects.filter(function (p) { return p.level === k; }).length, status: "منشور" }; }));
      },
      cols: [["name", "التصنيف"], ["type", "النوع"], ["count", "العناصر"], ["status", "الحالة"]], filter: ["type", "النوع"],
      form: [["name", "اسم التصنيف", "text"], ["type", "النوع", "select", ["تصنيف أدوات", "تصنيف مسارات", "مستوى صعوبة"]]] }
  };

  function side(active) {
    return '<aside class="app-side dark" id="appSide" aria-label="قائمة الإدارة"><div class="admin-brand">' + icon("sliders") + '<div><strong>لوحة الإدارة</strong><small>واجهة تجريبية</small></div></div>' +
      "<h2>عام</h2>" + '<a class="side-link' + (active === "home" ? " active" : "") + '" href="' + R.admin() + '">' + icon("grid") + "لوحة المؤشرات</a>" +
      "<h2>المحتوى</h2>" + ["languages", "tools", "fields", "careers", "lessons", "projects", "quizzes"].map(function (k) {
        var e = ENTITIES[k];
        return '<a class="side-link' + (active === k ? " active" : "") + '" href="' + R.adminManage(k) + '">' + icon(e.icon) + e.title.replace("إدارة ", "") + '<span class="count">' + e.rows().length + "</span></a>";
      }).join("") +
      "<h2>النظام</h2>" + ["users", "categories"].map(function (k) {
        var e = ENTITIES[k];
        return '<a class="side-link' + (active === k ? " active" : "") + '" href="' + R.adminManage(k) + '">' + icon(e.icon) + e.title.replace("إدارة ", "") + "</a>";
      }).join("") +
      '<h2>المنصة</h2><a class="side-link" href="' + R.home() + '">' + icon("home") + "العودة إلى المنصة</a></aside>";
  }
  function head(title, sub, actions) {
    return '<div class="app-main-head"><div><button class="btn btn-outline btn-sm side-toggle mb-4" data-toggle="#appSide" data-scrim aria-controls="appSide" aria-expanded="false">' + icon("sidebar", "ic-sm") + "القائمة</button>" +
      CW.breadcrumb([["لوحة الإدارة", R.admin()], [title]]) + '<h1 class="mt-2">' + title + "</h1><p>" + sub + "</p></div>" + (actions || "") + "</div>" +
      '<div class="notice demo mb-6">' + icon("alert", "ic-sm") + "<span>لوحة إدارة شكلية: التغييرات لا تُحفظ ولا يوجد نظام صلاحيات حقيقي. ربطها بقاعدة البيانات يحتاج Backend.</span></div>";
  }

  /* ---------- لوحة المؤشرات ---------- */
  CW.pages.admin = function () {
    CW.setTitle("لوحة الإدارة");
    var plan = D.projectPlan, planTotal = Object.keys(plan).reduce(function (s, k) { return s + plan[k]; }, 0);
    var lessonsPlanned = D.languages.reduce(function (s, l) { return s + CW.track("lang", l.id).lessonCount; }, 0);
    var kpis = [["code", D.languages.length, "لغة برمجة", "languages"], ["wrench", D.tools.length, "أداة وتقنية", "tools"], ["compass", D.fields.length, "مجالاً", "fields"], ["route", D.careers.length, "مساراً مهنياً", "careers"],
      ["rocket", D.projects.length + " / " + planTotal, "مشروع منشور من الخطة", "projects"], ["book", lessonsPlanned, "قالب درس للغات", "lessons"], ["clipboard", D.quizzes.length, "اختبار تجريبي", "quizzes"], ["users", D.demoUsers.length, "مستخدم وهمي", "users"]];
    var sections = [["لغات البرمجة", D.languages.length, D.languages.length, "الهيكل جاهز"], ["الأدوات", D.tools.length, D.tools.length, "الهيكل جاهز"], ["المسارات المهنية", D.careers.length, D.careers.length, "خرائط مولدة"],
      ["المشاريع", D.projects.length, planTotal, "قيد الإضافة"], ["محتوى الدروس", 0, lessonsPlanned, "لم يبدأ"]];
    document.getElementById("main").innerHTML = '<div class="app-shell">' + side("home") + '<div class="app-main">' +
      head("لوحة المؤشرات", "نظرة عامة على محتوى المنصة.", '<a class="btn btn-primary" href="' + R.adminManage("lessons") + '">' + icon("plus", "ic-sm") + "إدارة الدروس</a>") +
      '<div class="grid grid-4 mb-6">' + kpis.map(function (k) {
        return '<a class="card card-hover stat-card" href="' + R.adminManage(k[3]) + '"><span class="icon-tile">' + icon(k[0]) + '</span><div><div class="value">' + k[1] + '</div><div class="label">' + k[2] + "</div></div></a>";
      }).join("") + "</div>" +
      '<div class="admin-grid"><section class="card"><div class="card-pad" style="border-bottom:1px solid var(--c-border)"><h2 class="dash-h" style="margin:0">' + icon("activity") + 'جاهزية المحتوى</h2></div><div class="card-pad">' +
      sections.map(function (s) {
        var pct = s[2] ? Math.round(s[1] / s[2] * 100) : 0;
        return '<div class="mb-4"><div class="progress-label"><span><strong style="color:var(--c-text)">' + s[0] + "</strong> · " + s[3] + "</span><span>" + s[1] + " / " + s[2] + '</span></div><div class="progress sm ' + (pct === 100 ? "success" : "") + '"><span style="--v:' + pct + '%"></span></div></div>';
      }).join("") + "</div></section>" +
      '<section class="card"><div class="card-pad" style="border-bottom:1px solid var(--c-border)"><h2 class="dash-h" style="margin:0">' + icon("clock") + 'آخر النشاطات (تجريبي)</h2></div><ul class="row-list">' +
      [["edit", "تحديث هيكل وحدات Python", "مشرف محتوى تجريبي"], ["plus", "إضافة مشروع «متجر إلكتروني»", "مدير تجريبي"], ["user", "تسجيل مستخدم تجريبي جديد", "النظام"], ["clipboard", "إنشاء اختبار أساسيات Git", "مدرّب تجريبي"]].map(function (a) {
        return '<li><span class="icon-tile sm">' + icon(a[0]) + '</span><div class="grow"><strong>' + a[1] + "</strong><small>" + a[2] + "</small></div></li>";
      }).join("") + "</ul></section></div></div></div>";
  };

  /* ---------- إدارة كيان ---------- */
  CW.pages.adminManage = function () {
    var key = CW.qs("entity"), E = ENTITIES[key];
    if (!E) { key = "languages"; E = ENTITIES.languages; }
    CW.setTitle(E.title);
    var rows = E.rows(), q = "", fv = "", page = 1, size = 10;
    var filterVals = E.filter ? CW.unique(rows.map(function (r) { return String(r[E.filter[0]]); })) : [];

    document.getElementById("main").innerHTML = '<div class="app-shell">' + side(key) + '<div class="app-main">' +
      head(E.title, rows.length + " " + E.unit + " في البيانات الحالية.", '<button class="btn btn-primary" id="addBtn">' + icon("plus", "ic-sm") + "إضافة " + E.unit + "</button>") +
      (E.note ? '<div class="notice mb-4">' + icon("info", "ic-sm") + "<span>" + E.note + "</span></div>" : "") +
      '<div class="toolbar"><div class="search-bar">' + icon("search") + '<input type="search" id="admQ" placeholder="بحث…" aria-label="بحث في الجدول"></div>' +
      (E.filter ? '<label class="sr-only" for="admF">' + E.filter[1] + '</label><select class="select" id="admF" style="width:auto"><option value="">كل ' + E.filter[1] + "</option>" + filterVals.map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + "</option>"; }).join("") + "</select>" : "") +
      '<span class="count" id="admCount" aria-live="polite"></span></div>' +
      '<div class="table-wrap"><table class="table"><thead><tr><th scope="col"><input type="checkbox" aria-label="تحديد الكل" id="selAll"></th>' + E.cols.map(function (c) { return '<th scope="col">' + c[1] + "</th>"; }).join("") + '<th scope="col"><span class="sr-only">إجراءات</span></th></tr></thead><tbody id="admBody"></tbody></table></div>' +
      '<div id="admPages"></div></div></div>';

    function statusBadge(s) {
      var cls = /منشور|نشط|مميز/.test(s) ? "badge-success" : /مسودة|بانتظار|تجريبي|مراجعة/.test(s) ? "badge-warning" : /موقوف/.test(s) ? "badge-danger" : "";
      return '<span class="badge badge-dot ' + cls + '">' + esc(s) + "</span>";
    }
    function render() {
      var nq = CW.norm(q);
      var list = rows.filter(function (r) { return (!nq || CW.norm(E.cols.map(function (c) { return r[c[0]]; }).join(" ")).indexOf(nq) > -1) && (!fv || String(r[E.filter[0]]) === fv); });
      var pages = Math.max(1, Math.ceil(list.length / size)); if (page > pages) page = pages;
      CW.$("#admCount").textContent = list.length + " نتيجة";
      CW.$("#admBody").innerHTML = list.length ? list.slice((page - 1) * size, page * size).map(function (r) {
        return '<tr data-id="' + esc(r.id) + '"><td><input type="checkbox" aria-label="تحديد ' + esc(r.name) + '"></td>' + E.cols.map(function (c, i) {
          var v = r[c[0]];
          if (i === 0) return '<td><div class="cell-main">' + (r.item ? CW.mono(r.item, "xs") : '<span class="icon-tile sm">' + icon(r.icon || E.icon, "ic-sm") + "</span>") + CW.bdi(v) + "</div></td>";
          if (c[0] === "status") return "<td>" + statusBadge(v) + "</td>";
          return "<td>" + CW.bdi(v) + "</td>";
        }).join("") + '<td><div class="actions">' + (r.url ? '<a class="btn btn-ghost btn-icon btn-sm" href="' + r.url + '" aria-label="عرض ' + esc(r.name) + '" title="عرض">' + icon("eye", "ic-sm") + "</a>" : "") +
          '<button class="btn btn-ghost btn-icon btn-sm" data-edit aria-label="تعديل ' + esc(r.name) + '" title="تعديل">' + icon("edit", "ic-sm") + '</button><button class="btn btn-ghost btn-icon btn-sm" data-del aria-label="حذف ' + esc(r.name) + '" title="حذف">' + icon("trash", "ic-sm") + "</button></div></td></tr>";
      }).join("") : '<tr><td colspan="' + (E.cols.length + 2) + '">' + CW.emptyState("لا توجد نتائج", "جرّب تعديل البحث أو الفلتر.") + "</td></tr>";
      CW.renderPagination(CW.$("#admPages"), { page: page, pages: pages }, function (n) { page = n; render(); });
    }
    function openForm(row) {
      var editing = !!row;
      CW.modal.open({
        title: (editing ? "تعديل " : "إضافة ") + E.unit, icon: editing ? "edit" : "plus",
        body: '<form id="admForm" class="form-grid" novalidate>' + E.form.map(function (f) {
          var v = row ? row[f[0]] : "";
          var input = f[2] === "select" ? '<select class="select" id="ff-' + f[0] + '">' + f[3].map(function (o) { return "<option" + (String(v) === o ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("") + "</select>"
            : '<input class="input" id="ff-' + f[0] + '" type="' + f[2] + '" value="' + esc(v) + '"' + (f[0] === "name" ? " required" : "") + ">";
          return '<div class="field' + (f[2] === "text" && f[0] === "name" ? " full" : "") + '"><label for="ff-' + f[0] + '">' + f[1] + "</label>" + input + "</div>";
        }).join("") + '<p class="hint full">التغيير يظهر في الجدول مؤقتاً ولا يُحفظ.</p></form>',
        foot: '<button class="btn btn-ghost" data-close-modal>إلغاء</button><button class="btn btn-primary" id="admSave">' + icon("check", "ic-sm") + (editing ? "حفظ التعديل" : "إضافة") + "</button>",
        onOpen: function (m) {
          CW.$("#admSave", m).addEventListener("click", function () {
            var name = CW.$("#ff-name", m);
            if (!name.value.trim()) { name.setAttribute("aria-invalid", "true"); name.focus(); return; }
            var target = row || { id: "new-" + Date.now(), icon: E.icon, status: "مسودة" };
            E.form.forEach(function (f) { target[f[0]] = CW.$("#ff-" + f[0], m).value; });
            E.cols.forEach(function (c) { if (target[c[0]] == null) target[c[0]] = "—"; });
            if (!row) rows.unshift(target);
            CW.modal.close(); render();
            CW.toast((editing ? "عُدّل" : "أُضيف") + " العنصر مؤقتاً في الواجهة فقط (لا يوجد حفظ على الخادم).", "warning");
          });
        }
      });
    }
    CW.$("#admQ").addEventListener("input", function (e) { q = e.target.value; page = 1; render(); });
    if (E.filter) CW.$("#admF").addEventListener("change", function (e) { fv = e.target.value; page = 1; render(); });
    CW.$("#addBtn").addEventListener("click", function () { openForm(null); });
    CW.$("#selAll").addEventListener("change", function (e) { CW.$$("#admBody input[type=checkbox]").forEach(function (c) { c.checked = e.target.checked; }); });
    CW.$("#admBody").addEventListener("click", function (e) {
      var tr = e.target.closest("tr[data-id]"); if (!tr) return;
      var row = rows.filter(function (r) { return String(r.id) === tr.getAttribute("data-id"); })[0];
      if (e.target.closest("[data-edit]")) openForm(row);
      if (e.target.closest("[data-del]")) {
        CW.modal.open({ title: "تأكيد الحذف", icon: "trash", body: "<p>هل تريد حذف «" + esc(row.name) + "» من الجدول؟ الحذف مؤقت في الواجهة فقط.</p>",
          foot: '<button class="btn btn-ghost" data-close-modal>إلغاء</button><button class="btn btn-danger-soft" id="admDel">' + icon("trash", "ic-sm") + "حذف</button>",
          onOpen: function (m) { CW.$("#admDel", m).addEventListener("click", function () { rows.splice(rows.indexOf(row), 1); CW.modal.close(); render(); CW.toast("حُذف العنصر من الواجهة مؤقتاً.", "warning"); }); } });
      }
    });
    render();
  };
})();
