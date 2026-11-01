/* ==========================================================
   محرر الأكواد (واجهة تجريبية)
   - JavaScript يُنفَّذ فعلياً داخل المتصفح بشكل معزول.
   - بقية اللغات: الواجهة جاهزة وتحتاج ربطاً بمحرك تنفيذ على الخادم.
   ========================================================== */
CW.pages.editor = function () {
  "use strict";
  var icon = CW.icon, esc = CW.esc, langs = CW.editorLanguages;
  var initial = langs.filter(function (l) { return l.id === CW.qs("lang"); })[0] || langs[0];
  CW.setTitle("محرر الأكواد");

  document.getElementById("main").innerHTML =
    '<div class="editor-page"><div class="editor-top"><div class="container-fluid">' +
    CW.breadcrumb([["محرر الأكواد"]]) +
    '<div class="et-row"><h1>' + icon("terminal") + 'محرر الأكواد</h1>' +
    '<div class="et-actions">' +
    '<label class="sr-only" for="langSel">لغة البرمجة</label><select class="select" id="langSel">' + langs.map(function (l) {
      return '<option value="' + l.id + '"' + (l.id === initial.id ? " selected" : "") + ">" + l.name + (l.runnable ? " — قابلة للتشغيل" : " — تحتاج خادم تنفيذ") + "</option>";
    }).join("") + "</select>" +
    '<button class="btn btn-success" id="runBtn">' + icon("play", "ic-sm") + 'تشغيل <span class="kbd" style="background:transparent;color:inherit;border-color:rgba(255,255,255,.4)">Ctrl ↵</span></button>' +
    '<button class="btn btn-outline" id="resetBtn">' + icon("refresh", "ic-sm") + "إعادة التعيين</button>" +
    '<button class="btn btn-outline" data-copy="#codeArea">' + icon("copy", "ic-sm") + "نسخ الكود</button></div></div>" +
    '<div class="notice" id="runNotice"></div></div></div>' +

    '<div class="editor-grid">' +
    '<section class="editor-pane" aria-label="مساحة الكود"><div class="pane-head"><span class="dots"><i></i><i></i><i></i></span><span id="fileName"></span><span class="pane-hint">Tab للمسافة البادئة</span></div>' +
    '<div class="code-input"><pre class="gutter" id="gutter" aria-hidden="true"></pre><textarea id="codeArea" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="محرر الكود" dir="ltr"></textarea></div></section>' +
    '<section class="io-pane" aria-label="المخرجات والأخطاء">' +
    '<div class="output-panel"><div class="output-head">' + icon("terminal", "ic-sm") + 'المخرجات<span class="status badge" id="runStatus">جاهز</span></div><div class="output-body placeholder" id="outBox" aria-live="polite">اضغط «تشغيل» لعرض المخرجات هنا.</div></div>' +
    '<div class="output-panel err-panel"><div class="output-head">' + icon("alert", "ic-sm") + 'رسائل الأخطاء<span class="status text-sm text-muted" id="errCount">0</span></div><div class="output-body placeholder" id="errBox" aria-live="polite">لا توجد أخطاء.</div></div>' +
    '<div class="card card-pad mt-4 tips"><h2 class="block-title" style="font-size:.95rem">' + icon("info") + 'عن هذه الواجهة</h2><ul class="check-list">' +
    "<li>" + icon("check", "ic-sm") + "تشغيل JavaScript يتم فعلياً داخل متصفحك بشكل معزول ومع مهلة زمنية.</li>" +
    "<li>" + icon("check", "ic-sm") + "اللغات الأخرى تحتاج خادم تنفيذ آمناً، والواجهة جاهزة للربط به.</li>" +
    "<li>" + icon("check", "ic-sm") + "يُحفظ آخر كود لكل لغة في متصفحك تلقائياً.</li></ul></div>" +
    "</section></div></div>";

  var area = CW.$("#codeArea"), sel = CW.$("#langSel"), out = CW.$("#outBox"), err = CW.$("#errBox");
  var ed = CW.mountEditor(area, CW.$("#gutter"));
  var current = initial;

  function load(lang) {
    current = lang;
    area.value = CW.store.get("editor:" + lang.id, lang.sample);
    CW.$("#fileName").textContent = lang.file;
    var n = CW.$("#runNotice");
    n.className = "notice " + (lang.runnable ? "success" : "warning");
    n.innerHTML = icon(lang.runnable ? "checkCircle" : "info", "ic-sm") + "<span>" + (lang.runnable ? "JavaScript يعمل داخل المتصفح. مخرجات console.log تظهر في لوحة المخرجات." : "تشغيل " + lang.name + " يحتاج ربطاً بمحرك تنفيذ على الخادم (Backend). يمكنك كتابة الكود ونسخه الآن.") + "</span>";
    CW.$("#runBtn").disabled = false;
    clearOut();
    ed.sync();
    try { history.replaceState(null, "", location.pathname + "?lang=" + lang.id); } catch (e) { /* file:// */ }
  }
  function clearOut() {
    out.className = "output-body placeholder"; out.textContent = "اضغط «تشغيل» لعرض المخرجات هنا.";
    err.className = "output-body placeholder"; err.textContent = "لا توجد أخطاء."; CW.$("#errCount").textContent = "0";
    CW.$("#runStatus").textContent = "جاهز"; CW.$("#runStatus").className = "status badge";
  }
  function run() {
    if (!current.runnable) {
      out.className = "output-body placeholder";
      out.textContent = "لم يُنفَّذ الكود: تشغيل " + current.name + " غير متاح في هذه النسخة لأنه يحتاج خادم تنفيذ.";
      CW.$("#runStatus").textContent = "غير متاح"; CW.$("#runStatus").className = "status badge badge-warning";
      return;
    }
    CW.$("#runStatus").textContent = "جارٍ التشغيل…"; CW.$("#runStatus").className = "status badge badge-primary";
    CW.runJS(area.value).then(function (r) {
      var logs = (r.logs || []).filter(function (x) { return x.type !== "error"; });
      var errs = (r.logs || []).filter(function (x) { return x.type === "error"; }).map(function (x) { return x.text; });
      if (r.error) errs.push(r.error);
      out.className = "output-body";
      out.innerHTML = logs.length ? logs.map(function (x) { return '<div class="' + (x.type === "warn" ? "warn-line" : "") + '">' + esc(x.text) + "</div>"; }).join("") : '<span class="text-muted">(لا توجد مخرجات)</span>';
      err.className = "output-body" + (errs.length ? "" : " placeholder");
      err.innerHTML = errs.length ? errs.map(function (e) { return '<div class="err">' + esc(e) + "</div>"; }).join("") : "لا توجد أخطاء.";
      CW.$("#errCount").textContent = String(errs.length);
      var ok = !r.error;
      CW.$("#runStatus").textContent = ok ? "اكتمل في " + (r.time || 0) + "ms" : "فشل التنفيذ";
      CW.$("#runStatus").className = "status badge " + (ok ? "badge-success" : "badge-danger");
    });
  }

  sel.addEventListener("change", function () { load(langs.filter(function (l) { return l.id === sel.value; })[0]); });
  CW.$("#runBtn").addEventListener("click", run);
  CW.$("#resetBtn").addEventListener("click", function () {
    area.value = current.sample; CW.store.set("editor:" + current.id, current.sample); ed.sync(); clearOut();
    CW.toast("تمت إعادة الكود إلى المثال الافتراضي.");
  });
  area.addEventListener("input", function () { CW.store.set("editor:" + current.id, area.value); });
  area.addEventListener("keydown", function (e) { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); } });
  load(initial);
};
