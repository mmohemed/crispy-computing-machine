/* ==========================================================
   الاختبارات والتدريبات
   - الاختبارات: القائمة → صفحة الاختبار → صفحة السؤال → النتيجة
   - التدريبات: القائمة → صفحة التدريب (محرر + تحقق) → النتيجة
   الإجابات تُحفظ مؤقتاً في sessionStorage، وأفضل النتائج في localStorage (محلياً فقط).
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc;

  function trackItem(tr) { var t = CW.track(tr.type, tr.id); return t; }
  function trackChip(tr) {
    var t = trackItem(tr); if (!t) return "";
    return '<a class="chip" href="' + t.overview + '">' + (t.item.mono ? CW.mono(t.item, "xs") : icon(t.item.icon || "book", "ic-sm")) + CW.bdi(t.name) + "</a>";
  }
  function questions(q) { return D.questionBanks[q.bank] || []; }
  function getQuiz() {
    var q = CW.find("quizzes", CW.qs("id"));
    if (!q) CW.renderNotFound("الاختبار", "العودة إلى الاختبارات", R.quizzes());
    return q;
  }
  function typeFilter(list, render, unit) {
    var types = [["all", "الكل"], ["lang", "لغات البرمجة"], ["tool", "الأدوات"], ["cs", "علوم الحاسوب"], ["ai", "الذكاء الاصطناعي"]];
    return '<div class="chip-list mb-6" id="typeFilter" role="group" aria-label="تصفية حسب القسم">' + types.map(function (t, i) {
      return '<button class="chip' + (i ? "" : " active") + '" data-t="' + t[0] + '" aria-pressed="' + !i + '">' + t[1] + "</button>";
    }).join("") + '</div><div class="grid grid-3" id="aList">' + list.map(render).join("") + "</div>";
  }
  function bindTypeFilter(list, render) {
    CW.$("#typeFilter").addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      CW.$$("#typeFilter .chip").forEach(function (x) { x.classList.toggle("active", x === b); x.setAttribute("aria-pressed", x === b); });
      var t = b.getAttribute("data-t"), f = list.filter(function (x) { return t === "all" || x.track.type === t; });
      CW.$("#aList").innerHTML = f.length ? f.map(render).join("") : '<div style="grid-column:1/-1">' + CW.emptyState("لا توجد عناصر في هذا القسم بعد", "ستضاف لاحقاً.") + "</div>";
    });
  }

  /* ================= قائمة الاختبارات ================= */
  CW.pages.quizzes = function () {
    CW.setTitle("الاختبارات");
    var best = CW.store.get("quiz-best", {});
    function card(q) {
      var n = questions(q).length, b = best[q.id];
      return '<article class="card card-hover quiz-card"><div class="qc-top"><span class="icon-tile">' + icon("clipboard") + "</span>" + CW.levelBadge(q.level) + "</div>" +
        '<h3 class="card-title"><a class="card-link" href="' + R.quiz(q.id) + '">' + esc(q.title) + "</a></h3>" +
        '<ul class="qc-meta"><li>' + icon("help", "ic-xs") + n + " أسئلة تجريبية</li><li>" + icon("clock", "ic-xs") + q.minutes + " دقائق تقريباً</li></ul>" +
        '<div class="card-foot flex items-center gap-2" style="justify-content:space-between">' + (b != null ? '<span class="badge badge-success">أفضل نتيجة: ' + b + "%</span>" : '<span class="text-sm text-muted">لم تُجرِه بعد</span>') + '<span class="link-arrow">ابدأ' + icon("arrowL", "ic-xs") + "</span></div></article>";
    }
    document.getElementById("main").innerHTML =
      '<header class="page-head"><div class="container">' + CW.breadcrumb([["الاختبارات"]]) +
      '<div class="head-row"><div><h1>الاختبارات</h1><p class="lead">اختبارات قصيرة لقياس فهمك بعد كل وحدة. الأسئلة الحالية تجريبية لعرض الواجهة.</p></div><a class="btn btn-outline" href="' + R.exercises() + '">' + icon("edit", "ic-sm") + "التدريبات العملية</a></div></div></header>" +
      '<div class="container catalog-body"><div class="notice demo mb-6">' + icon("info", "ic-sm") + "<span>الأسئلة المعروضة نماذج تجريبية لإظهار تجربة الاختبار، وسيُستبدل بها محتوى حقيقي لكل اختبار.</span></div>" +
      typeFilter(D.quizzes, card) + "</div>";
    bindTypeFilter(D.quizzes, card);
  };

  /* ================= صفحة الاختبار (التعليمات) ================= */
  CW.pages.quiz = function () {
    var q = getQuiz(); if (!q) return;
    CW.setTitle(q.title);
    var qs = questions(q);
    var types = CW.unique(qs.map(function (x) { return { single: "اختيار واحد", multi: "اختيار متعدد", boolean: "صح أو خطأ" }[x.type]; }));
    document.getElementById("main").innerHTML =
      '<div class="assess-wrap"><div class="container container-narrow">' + CW.breadcrumb([["الاختبارات", R.quizzes()], [q.title]]) +
      '<div class="card quiz-intro"><span class="icon-tile lg">' + icon("clipboard") + "</span><h1>" + esc(q.title) + "</h1>" +
      '<div class="flex gap-2 wrap" style="justify-content:center">' + trackChip(q.track) + CW.levelBadge(q.level) + "</div>" +
      '<ul class="intro-stats"><li><b>' + qs.length + "</b>أسئلة</li><li><b>" + q.minutes + "</b>دقائق تقريباً</li><li><b>" + types.length + "</b>أنواع أسئلة</li></ul>" +
      '<div class="intro-rules"><h2>قبل أن تبدأ</h2><ul class="check-list">' +
      ["سؤال واحد في كل صفحة، ويمكنك العودة إلى الأسئلة السابقة.", "أنواع الأسئلة: " + types.join("، ") + ".", "المؤقت إرشادي ولا يُنهي الاختبار تلقائياً.", "تظهر النتيجة ومراجعة الإجابات بعد الإنهاء."].map(function (r) { return "<li>" + icon("check", "ic-sm") + r + "</li>"; }).join("") +
      '</ul></div><div class="notice demo">' + icon("info", "ic-sm") + "<span>أسئلة تجريبية لعرض الواجهة فقط.</span></div>" +
      '<div class="flex gap-3 wrap mt-6" style="justify-content:center"><a class="btn btn-primary btn-lg" id="startQuiz" href="' + R.question(q.id, 1) + '">' + icon("play", "ic-sm") + 'ابدأ الاختبار</a><a class="btn btn-outline btn-lg" href="' + R.quizzes() + '">' + icon("arrowR", "ic-sm") + "العودة</a></div></div></div></div>";
    CW.$("#startQuiz").addEventListener("click", function () {
      CW.session.set("quiz:" + q.id, { answers: {}, started: Date.now() });
    });
  };

  /* ================= صفحة السؤال ================= */
  CW.pages.question = function () {
    var q = getQuiz(); if (!q) return;
    var qs = questions(q), n = Math.min(Math.max(CW.qsInt("q", 1), 1), qs.length), item = qs[n - 1];
    CW.setTitle("السؤال " + n + " — " + q.title);
    var st = CW.session.get("quiz:" + q.id, null) || { answers: {}, started: Date.now() };
    CW.session.set("quiz:" + q.id, st);
    var ans = st.answers[n];
    var multi = item.type === "multi";

    document.getElementById("main").innerHTML =
      '<div class="assess-wrap"><div class="container container-narrow">' +
      '<div class="q-top"><a class="btn btn-ghost btn-sm" href="' + R.quiz(q.id) + '">' + icon("x", "ic-sm") + 'خروج</a><strong class="q-title">' + esc(q.title) + '</strong><span class="q-timer" id="qTimer" aria-label="الوقت المنقضي">' + icon("clock", "ic-xs") + '<span>00:00</span></span></div>' +
      '<div class="q-progress"><div class="progress-label"><span>السؤال ' + n + " من " + qs.length + "</span><span>" + Object.keys(st.answers).length + ' أُجيب عنها</span></div><ol class="q-dots">' +
      qs.map(function (_, i) { var k = i + 1; return '<li><a href="' + R.question(q.id, k) + '" class="' + (k === n ? "cur" : "") + (st.answers[k] != null ? " ans" : "") + '" aria-label="السؤال ' + k + '"' + (k === n ? ' aria-current="step"' : "") + ">" + k + "</a></li>"; }).join("") + "</ol></div>" +
      '<form class="card q-card" id="qForm"><fieldset><legend><span class="q-type">' + { single: "اختيار واحد", multi: "اختر كل الإجابات الصحيحة", boolean: "صح أو خطأ" }[item.type] + "</span><span class=\"q-text\">" + CW.bdi(item.text) + "</span></legend>" +
      (item.code ? CW.codeBlock({ file: "snippet", code: item.code }) : "") +
      '<div class="options">' + item.options.map(function (o, i) {
        var checked = multi ? (ans || []).indexOf(i) > -1 : ans === i;
        return '<label class="option"><input type="' + (multi ? "checkbox" : "radio") + '" name="opt" value="' + i + '"' + (checked ? " checked" : "") + '><span class="opt-key">' + "أبجد".charAt(i) + "</span><span>" + CW.bdi(o) + "</span></label>";
      }).join("") + "</div></fieldset></form>" +
      '<div class="q-nav">' +
      (n > 1 ? '<a class="btn btn-outline" href="' + R.question(q.id, n - 1) + '">' + icon("chevR", "ic-sm") + "السابق</a>" : "<span></span>") +
      (n < qs.length ? '<a class="btn btn-primary" id="nextQ" href="' + R.question(q.id, n + 1) + '">التالي' + icon("chevL", "ic-sm") + "</a>" : '<a class="btn btn-success" id="finishQ" href="' + R.quizResult(q.id) + '">' + icon("check", "ic-sm") + "إنهاء الاختبار</a>") +
      "</div></div></div>";

    CW.$("#qForm").addEventListener("change", function () {
      var vals = CW.$$("#qForm input:checked").map(function (c) { return +c.value; });
      st.answers[n] = multi ? vals : vals[0];
      if (multi && !vals.length) delete st.answers[n];
      CW.session.set("quiz:" + q.id, st);
      var dot = CW.$$(".q-dots a")[n - 1]; dot.classList.toggle("ans", st.answers[n] != null);
    });
    CW.$("#qForm").addEventListener("submit", function (e) { e.preventDefault(); });
    var fin = CW.$("#finishQ");
    if (fin) fin.addEventListener("click", function (e) {
      var left = qs.length - Object.keys(st.answers).length;
      if (left > 0 && !confirm("لم تُجب عن " + left + " سؤال/أسئلة. هل تريد إنهاء الاختبار؟")) e.preventDefault();
    });
    var span = CW.$("#qTimer span");
    function tick() { var s = Math.floor((Date.now() - st.started) / 1000); span.textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }
    tick(); setInterval(tick, 1000);
  };

  /* ================= نتيجة الاختبار ================= */
  CW.pages.quizResult = function () {
    var q = getQuiz(); if (!q) return;
    CW.setTitle("نتيجة " + q.title);
    var qs = questions(q), st = CW.session.get("quiz:" + q.id, null);
    if (!st) {
      document.getElementById("main").innerHTML = '<div class="assess-wrap"><div class="container container-narrow">' + CW.emptyState("لا توجد نتيجة لعرضها", "ابدأ الاختبار أولاً لتظهر نتيجتك هنا.", '<a class="btn btn-primary" href="' + R.quiz(q.id) + '">الذهاب إلى الاختبار</a>') + "</div></div>";
      return;
    }
    function correct(item, a) {
      if (a == null) return false;
      if (item.type === "multi") return a.length === item.answer.length && item.answer.every(function (x) { return a.indexOf(x) > -1; });
      return a === item.answer;
    }
    var right = qs.filter(function (item, i) { return correct(item, st.answers[i + 1]); }).length;
    var pct = Math.round(right / qs.length * 100), pass = pct >= 60;
    var best = CW.store.get("quiz-best", {});
    if (best[q.id] == null || pct > best[q.id]) { best[q.id] = pct; CW.store.set("quiz-best", best); }
    var t = trackItem(q.track);
    function fmt(item, a) {
      if (a == null) return '<span class="text-muted">لم تُجب</span>';
      return (Array.isArray(a) ? a : [a]).map(function (i) { return CW.bdi(item.options[i]); }).join("، ");
    }
    document.getElementById("main").innerHTML =
      '<div class="assess-wrap"><div class="container container-narrow">' + CW.breadcrumb([["الاختبارات", R.quizzes()], [q.title, R.quiz(q.id)], ["النتيجة"]]) +
      '<div class="card result-hero ' + (pass ? "pass" : "fail") + '"><div class="ring big" style="--v:' + pct + '" data-label="' + pct + '%"></div>' +
      "<div><h1>" + (pass ? "أحسنت! اجتزت الاختبار" : "لم تجتز الاختبار هذه المرة") + "</h1><p>أجبت إجابة صحيحة عن " + right + " من " + qs.length + " أسئلة. " + (pass ? "" : "راجع الوحدة ثم حاول مجدداً.") + "</p>" +
      '<div class="flex gap-3 wrap mt-4"><a class="btn btn-primary" href="' + R.question(q.id, 1) + '" id="retake">' + icon("refresh", "ic-sm") + "إعادة الاختبار</a>" +
      (t ? '<a class="btn btn-outline" href="' + t.overview + '">' + icon("book", "ic-sm") + "العودة إلى " + CW.bdi(t.name) + "</a>" : "") +
      '<a class="btn btn-ghost" href="' + R.quizzes() + '">كل الاختبارات</a></div></div></div>' +
      '<div class="notice demo mt-4">' + icon("info", "ic-sm") + "<span>النتيجة محسوبة في متصفحك من أسئلة تجريبية، ولا تُرسل إلى أي خادم.</span></div>" +
      '<h2 class="block-title mt-8">' + icon("list") + 'مراجعة الإجابات</h2><ol class="review-list">' + qs.map(function (item, i) {
        var a = st.answers[i + 1], ok = correct(item, a);
        return '<li class="card review ' + (ok ? "ok" : "no") + '"><div class="rv-head">' + icon(ok ? "checkCircle" : "xCircle") + "<strong>السؤال " + (i + 1) + "</strong><span>" + CW.bdi(item.text) + "</span></div>" +
          '<dl><div><dt>إجابتك</dt><dd>' + fmt(item, a) + "</dd></div><div><dt>الإجابة الصحيحة</dt><dd>" + fmt(item, item.answer) + "</dd></div></dl>" +
          '<p class="text-sm text-muted">' + esc(item.explain) + "</p></li>";
      }).join("") + "</ol></div></div>";
    CW.$("#retake").addEventListener("click", function () { CW.session.set("quiz:" + q.id, { answers: {}, started: Date.now() }); });
  };

  /* ================= قائمة التدريبات ================= */
  CW.pages.exercises = function () {
    CW.setTitle("التدريبات");
    var last = CW.store.get("exercise-last", {});
    function card(x) {
      var t = trackItem(x.track);
      return '<article class="card card-hover quiz-card"><div class="qc-top">' + (t && t.item.mono ? CW.mono(t.item, "sm") : '<span class="icon-tile accent">' + icon("edit") + "</span>") + CW.levelBadge(x.level) + "</div>" +
        '<h3 class="card-title"><a class="card-link" href="' + R.exercise(x.id) + '">' + esc(x.title) + "</a></h3>" +
        '<ul class="qc-meta"><li>' + icon(x.kind === "code" ? "code" : "list", "ic-xs") + (x.kind === "code" ? "تدريب برمجي" : "ترتيب خطوات") + "</li><li>" + icon(x.runnable || x.kind === "order" ? "checkCircle" : "info", "ic-xs") + (x.runnable || x.kind === "order" ? "تحقق تلقائي في المتصفح" : "التحقق يحتاج خادم تنفيذ") + "</li></ul>" +
        '<div class="card-foot flex items-center" style="justify-content:space-between">' + (last[x.id] ? '<span class="badge ' + (last[x.id].pass ? "badge-success" : "badge-warning") + '">' + (last[x.id].pass ? "مكتمل" : "محاولة سابقة") + "</span>" : '<span class="text-sm text-muted">' + (t ? CW.bdi(t.name) : "") + "</span>") + '<span class="link-arrow">ابدأ' + icon("arrowL", "ic-xs") + "</span></div></article>";
    }
    document.getElementById("main").innerHTML =
      '<header class="page-head"><div class="container">' + CW.breadcrumb([["التدريبات"]]) +
      '<div class="head-row"><div><h1>التدريبات العملية</h1><p class="lead">تمارين قصيرة تكتب فيها الحل بنفسك. تدريبات JavaScript يُتحقق منها تلقائياً داخل المتصفح.</p></div><a class="btn btn-outline" href="' + R.quizzes() + '">' + icon("clipboard", "ic-sm") + "الاختبارات</a></div></div></header>" +
      '<div class="container catalog-body">' + typeFilter(D.exercises, card) + "</div>";
    bindTypeFilter(D.exercises, card);
  };

  /* ================= صفحة التدريب ================= */
  var gitSteps = ["git init", "git add .", "git commit -m \"first commit\"", "git push"];
  CW.pages.exercise = function () {
    var x = CW.find("exercises", CW.qs("id"));
    if (!x) { CW.renderNotFound("التدريب", "العودة إلى التدريبات", R.exercises()); return; }
    CW.setTitle(x.title);
    var t = trackItem(x.track);
    var lang = (CW.editorLanguages || []).filter(function (l) { return l.id === x.editorLang; })[0];
    var starter = x.starter || (lang ? lang.sample.split("\n")[0] + "\n# اكتب الحل هنا" : "");

    var task = '<section class="card card-pad ex-task"><div class="flex items-center gap-2 wrap">' + (t ? '<a class="chip" href="' + t.overview + '">' + (t.item.mono ? CW.mono(t.item, "xs") : "") + CW.bdi(t.name) + "</a>" : "") + CW.levelBadge(x.level) + "</div>" +
      "<h1>" + esc(x.title) + "</h1>" +
      '<h2 class="ex-h">' + icon("info", "ic-sm") + "المطلوب</h2>" +
      (x.tests ? '<p>اكتب الدالة المطلوبة في المحرر بحيث تجتاز جميع الاختبارات أدناه.</p>' : '<div class="lesson-ph">' + icon("edit", "ic-sm") + "<span>سيظهر وصف التدريب هنا.</span></div>") +
      (x.tests ? '<h2 class="ex-h">' + icon("checkCircle", "ic-sm") + 'الاختبارات</h2><ul class="tests" id="testList">' + x.tests.map(function (ts) {
        return '<li><span class="st"></span><code dir="ltr">' + esc(ts.call) + " → " + esc(JSON.stringify(ts.expect)) + "</code></li>";
      }).join("") + "</ul>" : "") +
      '<div class="accordion mt-4"><div class="acc-item"><button class="acc-btn" aria-expanded="false" aria-controls="hint1">' + icon("bulb", "ic-sm") + 'تلميح<span class="chev">' + icon("chevD", "ic-xs") + '</span></button><div class="acc-panel" id="hint1"><div><p class="acc-body">سيظهر التلميح هنا عند إضافة المحتوى.</p></div></div></div></div></section>';

    var work;
    if (x.kind === "order") {
      var shuffled = [2, 0, 3, 1].map(function (i) { return gitSteps[i]; });
      work = '<section class="card card-pad"><h2 class="ex-h">' + icon("list", "ic-sm") + 'رتّب الأوامر بالتسلسل الصحيح</h2><p class="text-sm text-muted mb-4">استخدم الأسهم لتحريك كل أمر.</p><ol class="order-list" id="orderList">' +
        shuffled.map(function (s) { return '<li data-v="' + esc(s) + '"><code dir="ltr">' + esc(s) + '</code><span class="ol-btns"><button class="btn btn-ghost btn-icon btn-sm" data-mv="-1" aria-label="تحريك لأعلى">' + icon("chevU", "ic-sm") + '</button><button class="btn btn-ghost btn-icon btn-sm" data-mv="1" aria-label="تحريك لأسفل">' + icon("chevD", "ic-sm") + "</button></span></li>"; }).join("") +
        '</ol><div class="flex gap-3 mt-6"><button class="btn btn-primary" id="checkBtn">' + icon("check", "ic-sm") + "تحقق من الحل</button></div></section>";
    } else {
      work = '<section class="ex-editor"><div class="editor-pane"><div class="pane-head"><span class="dots"><i></i><i></i><i></i></span><span>' + esc(lang ? lang.file : "solution") + '</span></div><div class="code-input"><pre class="gutter" id="gutter" aria-hidden="true"></pre><textarea id="codeArea" dir="ltr" spellcheck="false" aria-label="محرر الحل"></textarea></div></div>' +
        '<div class="flex gap-2 wrap mt-4"><button class="btn btn-success" id="checkBtn">' + icon("play", "ic-sm") + (x.runnable ? "تشغيل والتحقق" : "تحقق من الحل") + '</button><button class="btn btn-outline" id="resetBtn">' + icon("refresh", "ic-sm") + 'إعادة التعيين</button><button class="btn btn-outline" data-copy="#codeArea">' + icon("copy", "ic-sm") + "نسخ</button></div>" +
        '<div class="output-panel mt-4"><div class="output-head">' + icon("terminal", "ic-sm") + 'المخرجات<span class="status badge" id="exStatus">جاهز</span></div><div class="output-body placeholder" id="exOut" aria-live="polite">' + (x.runnable ? "اضغط «تشغيل والتحقق» لتنفيذ الاختبارات." : "التحقق التلقائي لهذه اللغة يحتاج خادم تنفيذ وسيُفعَّل لاحقاً.") + "</div></div></section>";
    }

    document.getElementById("main").innerHTML = '<div class="assess-wrap"><div class="container">' + CW.breadcrumb([["التدريبات", R.exercises()], [x.title]]) +
      '<div class="ex-grid">' + task + work + "</div></div></div>";

    function finish(pass, detail) {
      var last = CW.store.get("exercise-last", {}); last[x.id] = { pass: pass, at: Date.now() }; CW.store.set("exercise-last", last);
      CW.session.set("exercise:" + x.id, { pass: pass, detail: detail });
      location.href = R.exerciseResult(x.id);
    }

    if (x.kind === "order") {
      CW.$("#orderList").addEventListener("click", function (e) {
        var b = e.target.closest("[data-mv]"); if (!b) return;
        var li = b.closest("li"), dir = +b.getAttribute("data-mv");
        if (dir < 0 && li.previousElementSibling) li.parentNode.insertBefore(li, li.previousElementSibling);
        if (dir > 0 && li.nextElementSibling) li.parentNode.insertBefore(li.nextElementSibling, li);
        b.focus();
      });
      CW.$("#checkBtn").addEventListener("click", function () {
        var order = CW.$$("#orderList li").map(function (li) { return li.getAttribute("data-v"); });
        var ok = order.join("|") === gitSteps.join("|");
        finish(ok, order.map(function (o, i) { return { label: o, ok: o === gitSteps[i] }; }));
      });
      return;
    }

    var area = CW.$("#codeArea"), key = "exercise-code:" + x.id;
    area.value = CW.store.get(key, starter);
    var ed = CW.mountEditor(area, CW.$("#gutter"));
    area.addEventListener("input", function () { CW.store.set(key, area.value); });
    CW.$("#resetBtn").addEventListener("click", function () { area.value = starter; CW.store.set(key, starter); ed.sync(); });
    CW.$("#checkBtn").addEventListener("click", function () {
      var out = CW.$("#exOut"), status = CW.$("#exStatus");
      if (!x.runnable) {
        out.className = "output-body placeholder";
        out.textContent = "لم يُتحقق من الحل: التحقق التلقائي لـ " + (lang ? lang.name : "هذه اللغة") + " يحتاج خادم تنفيذ. حُفظ حلّك في متصفحك.";
        status.textContent = "غير متاح"; status.className = "status badge badge-warning";
        return;
      }
      status.textContent = "جارٍ التشغيل…"; status.className = "status badge badge-primary";
      CW.runJS(area.value, x.tests).then(function (r) {
        out.className = "output-body";
        if (r.error) {
          out.innerHTML = '<div class="err">' + esc(r.error) + "</div>";
          status.textContent = "خطأ"; status.className = "status badge badge-danger";
          return;
        }
        var detail = x.tests.map(function (ts, i) {
          var res = (r.results || [])[i] || {}, ok = res.ok && JSON.stringify(res.v) === JSON.stringify(ts.expect);
          return { label: ts.call, ok: ok, got: res.ok ? JSON.stringify(res.v) : res.e, expect: JSON.stringify(ts.expect) };
        });
        CW.$$("#testList li").forEach(function (li, i) { li.className = detail[i].ok ? "ok" : "no"; li.querySelector(".st").innerHTML = icon(detail[i].ok ? "check" : "x", "ic-xs"); });
        var passN = detail.filter(function (d) { return d.ok; }).length;
        out.innerHTML = (r.logs || []).map(function (l) { return "<div>" + esc(l.text) + "</div>"; }).join("") +
          '<div class="' + (passN === detail.length ? "ok" : "err") + '">اجتاز ' + passN + " من " + detail.length + " اختبارات</div>";
        status.textContent = passN === detail.length ? "ناجح" : "لم يكتمل"; status.className = "status badge " + (passN === detail.length ? "badge-success" : "badge-warning");
        CW.session.set("exercise:" + x.id, { pass: passN === detail.length, detail: detail });
        if (!CW.$("#viewResult")) CW.$("#checkBtn").insertAdjacentHTML("afterend", '<a class="btn btn-primary" id="viewResult" href="' + R.exerciseResult(x.id) + '">عرض النتيجة' + icon("arrowL", "ic-sm") + "</a>");
        var last = CW.store.get("exercise-last", {}); last[x.id] = { pass: passN === detail.length, at: Date.now() }; CW.store.set("exercise-last", last);
      });
    });
  };

  /* ================= نتيجة التدريب ================= */
  CW.pages.exerciseResult = function () {
    var x = CW.find("exercises", CW.qs("id"));
    if (!x) { CW.renderNotFound("التدريب", "العودة إلى التدريبات", R.exercises()); return; }
    CW.setTitle("نتيجة " + x.title);
    var r = CW.session.get("exercise:" + x.id, null);
    var main = document.getElementById("main");
    if (!r) {
      main.innerHTML = '<div class="assess-wrap"><div class="container container-narrow">' + CW.emptyState("لا توجد نتيجة لعرضها", "نفّذ التدريب أولاً لتظهر النتيجة هنا.", '<a class="btn btn-primary" href="' + R.exercise(x.id) + '">الذهاب إلى التدريب</a>') + "</div></div>";
      return;
    }
    var next = D.exercises[(D.exercises.indexOf(x) + 1) % D.exercises.length];
    var passN = r.detail.filter(function (d) { return d.ok; }).length;
    main.innerHTML = '<div class="assess-wrap"><div class="container container-narrow">' + CW.breadcrumb([["التدريبات", R.exercises()], [x.title, R.exercise(x.id)], ["النتيجة"]]) +
      '<div class="card result-hero ' + (r.pass ? "pass" : "fail") + '"><span class="icon-tile lg ' + (r.pass ? "success" : "warning") + '">' + icon(r.pass ? "trophy" : "refresh") + "</span>" +
      "<div><h1>" + (r.pass ? "أحسنت! أكملت التدريب" : "اقتربت، حاول مرة أخرى") + "</h1><p>نجح " + passN + " من " + r.detail.length + " فحوصات.</p>" +
      '<div class="flex gap-3 wrap mt-4"><a class="btn btn-primary" href="' + R.exercise(x.id) + '">' + icon("edit", "ic-sm") + (r.pass ? "مراجعة الحل" : "إعادة المحاولة") + '</a><a class="btn btn-outline" href="' + R.exercise(next.id) + '">التدريب التالي' + icon("arrowL", "ic-sm") + '</a><a class="btn btn-ghost" href="' + R.exercises() + '">كل التدريبات</a></div></div></div>' +
      '<h2 class="block-title mt-8">' + icon("list") + 'تفاصيل التحقق</h2><ul class="review-list">' + r.detail.map(function (d) {
        return '<li class="card review ' + (d.ok ? "ok" : "no") + '"><div class="rv-head">' + icon(d.ok ? "checkCircle" : "xCircle") + '<code dir="ltr">' + esc(d.label) + "</code></div>" +
          (d.expect ? "<dl><div><dt>المتوقع</dt><dd><code dir=\"ltr\">" + esc(d.expect) + "</code></dd></div><div><dt>الناتج</dt><dd><code dir=\"ltr\">" + esc(d.got) + "</code></dd></div></dl>" : "") + "</li>";
      }).join("") + "</ul></div></div>";
  };
})();
