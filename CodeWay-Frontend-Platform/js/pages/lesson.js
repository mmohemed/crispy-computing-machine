/* ==========================================================
   قالب صفحة الدرس (تصميم فقط — دون محتوى تعليمي)
   الرابط: pages/lessons/lesson.html?track=lang&id=python&m=1&l=2
   track: lang | tool | cs | ai
   ========================================================== */
CW.pages.lesson = function () {
  "use strict";
  var R = CW.routes, icon = CW.icon, esc = CW.esc;
  var type = CW.qs("track"), id = CW.qs("id");
  var t = CW.track(type, id);
  if (!t) { CW.renderNotFound("الدرس", "تصفح لغات البرمجة", R.languages()); return; }
  var m = Math.min(Math.max(CW.qsInt("m", 1), 1), t.modules.length), mod = t.modules[m - 1];
  var l = Math.min(Math.max(CW.qsInt("l", 1), 1), mod.lessons.length), lesson = mod.lessons[l - 1];
  CW.setTitle(lesson.title + " — " + t.name);

  /* التقدم المحلي (يُحفظ في المتصفح فقط) */
  var key = "done:" + type + ":" + id, done = CW.store.get(key, []);
  function isDone(mm, ll) { return done.indexOf(mm + "-" + ll) > -1; }

  /* الدرس السابق والتالي عبر الوحدات */
  var prev = l > 1 ? [m, l - 1] : m > 1 ? [m - 1, t.modules[m - 2].lessons.length] : null;
  var next = l < mod.lessons.length ? [m, l + 1] : m < t.modules.length ? [m + 1, 1] : null;
  function lessonTitle(p) { return t.modules[p[0] - 1].lessons[p[1] - 1].title; }
  var isCode = type === "lang" || type === "tool";
  var level = t.item.level || "beginner";
  var codeLang = type === "lang" ? t.item.name : type === "tool" ? t.item.name : "pseudo";

  var sidebar = '<aside class="lesson-side" id="lessonSide" aria-label="وحدات ودروس المسار">' +
    '<div class="ls-head"><a href="' + t.overview + '" class="ls-track">' + (t.item.mono ? CW.mono(t.item, "sm") : '<span class="icon-tile sm">' + icon(t.item.icon || "book") + "</span>") +
    '<span><small>' + esc(t.label) + "</small><strong>" + CW.bdi(t.name) + "</strong></span></a>" +
    '<button class="btn btn-ghost btn-icon btn-sm ls-close" data-toggle="#lessonSide" data-scrim aria-label="إغلاق قائمة الدروس">' + icon("x") + "</button></div>" +
    '<div class="ls-body"><div class="accordion">' + t.modules.map(function (x) {
      var open = x.n === m;
      var doneN = x.lessons.filter(function (ls) { return isDone(x.n, ls.n); }).length;
      return '<div class="acc-item ls-mod' + (open ? " open" : "") + '"><button class="acc-btn" aria-expanded="' + open + '" aria-controls="lm' + x.n + '"><span class="ls-n">' + x.n + '</span><span class="grow">' + esc(x.title) + '<small>' + doneN + " / " + x.lessons.length + '</small></span><span class="chev">' + icon("chevD", "ic-xs") + "</span></button>" +
        '<div class="acc-panel" id="lm' + x.n + '"><div><ul class="ls-lessons">' + x.lessons.map(function (ls) {
          var cur = x.n === m && ls.n === l, d = isDone(x.n, ls.n);
          return '<li><a href="' + t.lessonUrl(x.n, ls.n) + '" class="' + (cur ? "current" : "") + (d ? " done" : "") + '"' + (cur ? ' aria-current="page"' : "") + '><span class="st">' + (d ? icon("check", "ic-xs") : "") + "</span>" + ls.n + ". " + esc(ls.title) + "</a></li>";
        }).join("") + "</ul></div></div></div>";
    }).join("") + "</div></div></aside>";

  var pct = Math.round(l / mod.lessons.length * 100);
  var topbar = '<div class="lesson-topbar"><div class="lt-inner">' +
    '<button class="btn btn-outline btn-sm side-open" data-toggle="#lessonSide" data-scrim aria-expanded="false" aria-controls="lessonSide">' + icon("sidebar", "ic-sm") + "الدروس</button>" +
    '<a class="lt-back" href="' + t.overview + '">' + icon("arrowR", "ic-sm") + '<span class="hide-sm">العودة إلى </span>' + CW.bdi(t.name) + "</a>" +
    '<div class="lt-progress" aria-label="التقدم داخل الوحدة"><span>الدرس ' + l + " من " + mod.lessons.length + '</span><div class="progress sm"><span style="--v:' + pct + '%"></span></div></div>' +
    '<button class="btn btn-sm ' + (isDone(m, l) ? "btn-success" : "btn-soft") + '" id="markDone" aria-pressed="' + isDone(m, l) + '">' + icon("check", "ic-sm") + '<span>' + (isDone(m, l) ? "مكتمل" : "تحديد كمكتمل") + "</span></button>" +
    "</div></div>";

  function block(ic, title, inner, cls) {
    return '<section class="lesson-block ' + (cls || "") + '"><h2>' + icon(ic) + title + "</h2>" + inner + "</section>";
  }
  function ph(text) { return '<div class="lesson-ph">' + icon("edit", "ic-sm") + "<span>" + text + "</span></div>"; }

  var content = '<article class="lesson-content">' +
    CW.breadcrumb([[t.section, t.sectionUrl], [t.name, t.overview], ["الوحدة " + m + ": " + mod.title, t.lessonsUrl(m)], [lesson.title]]) +
    '<header class="lesson-head"><span class="lh-module">' + icon("layers", "ic-xs") + "الوحدة " + m + " · " + esc(mod.title) + "</span>" +
    "<h1>الدرس " + l + ": " + esc(lesson.title) + "</h1>" +
    '<div class="lh-meta">' + CW.levelBadge(level) + (lesson.minutes ? '<span class="badge">' + icon("clock", "ic-xs") + lesson.minutes + " دقيقة</span>" : "") +
    '<span class="badge badge-warning">' + icon("edit", "ic-xs") + "المحتوى قيد الإعداد</span></div></header>" +

    block("target", "أهداف الدرس", '<ul class="objectives">' + [1, 2, 3].map(function (i) { return "<li>" + icon("checkCircle", "ic-sm") + "<span>سيظهر الهدف التعليمي " + i + " هنا</span></li>"; }).join("") + "</ul>") +
    block("book", "الشرح", ph("سيظهر شرح الدرس هنا.") + '<div class="ph-lines" aria-hidden="true"><i></i><i></i><i style="width:72%"></i></div>') +
    block("code", "الأمثلة البرمجية", ph("ستضاف الأمثلة البرمجية هنا.") +
      '<div class="code-block mt-4"><div class="code-head"><span class="dots"><i></i><i></i><i></i></span><span>' + esc(codeLang) + ' · example</span><span class="actions">' +
      (isCode ? '<button class="code-btn run" type="button" id="runExample">' + icon("play", "ic-xs") + "تشغيل</button>" : "") +
      '<button class="code-btn" type="button" data-copy="#lessonCode">' + icon("copy", "ic-xs") + "نسخ</button></span></div>" +
      '<pre><code id="lessonCode"><span class="ln"><span class="tk-c">// ستضاف الأمثلة البرمجية هنا</span></span><span class="ln"><span class="tk-c">// Example code will appear here</span></span></code></pre></div>' +
      (isCode ? '<div class="output-panel mt-4"><div class="output-head">' + icon("terminal", "ic-sm") + 'المخرجات<span class="status badge" id="outStatus">لم يُشغَّل</span></div><div class="output-body placeholder" id="lessonOut" aria-live="polite">ستظهر مخرجات المثال هنا.</div></div>' : "")) +
    block("alert", "أخطاء شائعة", ph("ستضاف الأخطاء الشائعة وطريقة تجنبها هنا."), "warn") +
    block("listPlain", "الملخص", ph("سيظهر ملخص الدرس هنا."), "summary") +
    '<div class="lesson-two">' +
    block("clipboard", "اختبار قصير", ph("ستضاف أسئلة الاختبار القصير لاحقاً.") + '<a class="btn btn-outline btn-sm mt-4" href="' + R.quizzes() + '">' + icon("clipboard", "ic-sm") + "تصفح الاختبارات المتاحة</a>") +
    block("edit", "تمرين عملي", ph("ستضاف التدريبات والاختبارات لاحقاً.") + '<a class="btn btn-outline btn-sm mt-4" href="' + R.editor(type === "lang" ? id : "") + '">' + icon("terminal", "ic-sm") + "افتح محرر الأكواد</a>") +
    "</div>" +
    '<nav class="pager-nav lesson-pager" aria-label="التنقل بين الدروس">' +
    (prev ? '<a class="pager-link" href="' + t.lessonUrl(prev[0], prev[1]) + '" rel="prev">' + icon("chevR") + "<div><small>الدرس السابق</small><strong>" + esc(lessonTitle(prev)) + "</strong></div></a>" : '<span class="pager-link disabled" aria-hidden="true"><div><small>هذا أول درس</small><strong>بداية المسار</strong></div></span>') +
    (next ? '<a class="pager-link next" href="' + t.lessonUrl(next[0], next[1]) + '" rel="next"><div><small>الدرس التالي' + (next[0] !== m ? " · الوحدة " + next[0] : "") + "</small><strong>" + esc(lessonTitle(next)) + "</strong></div>" + icon("chevL") + "</a>"
      : '<a class="pager-link next" href="' + t.overview + '"><div><small>أنهيت آخر درس</small><strong>العودة إلى صفحة المسار</strong></div>' + icon("chevL") + "</a>") +
    "</nav></article>";

  document.getElementById("main").innerHTML = topbar + '<div class="lesson-shell">' + sidebar + content + "</div>";

  /* تحديد الدرس كمكتمل */
  CW.$("#markDone").addEventListener("click", function () {
    var k = m + "-" + l, i = done.indexOf(k);
    if (i > -1) done.splice(i, 1); else done.push(k);
    CW.store.set(key, done);
    var on = i < 0;
    this.className = "btn btn-sm " + (on ? "btn-success" : "btn-soft");
    this.setAttribute("aria-pressed", on);
    this.querySelector("span").textContent = on ? "مكتمل" : "تحديد كمكتمل";
    var a = CW.$(".ls-lessons a.current .st"); if (a) a.innerHTML = on ? icon("check", "ic-xs") : "";
    CW.$(".ls-lessons a.current").classList.toggle("done", on);
    CW.toast(on ? "تم تحديد الدرس كمكتمل (محفوظ في متصفحك فقط)." : "أُلغي تحديد الدرس.", on ? "success" : "");
  });

  /* تشغيل المثال: لا يوجد محرك تنفيذ بعد، لذا نعرض رسالة واضحة */
  var run = CW.$("#runExample");
  if (run) run.addEventListener("click", function () {
    var out = CW.$("#lessonOut");
    CW.$("#outStatus").textContent = "تجريبي";
    out.classList.add("placeholder");
    out.innerHTML = "لا يوجد مثال لتشغيله بعد. عند إضافة المحتوى وربط محرك التنفيذ ستظهر النتيجة هنا.";
  });

  /* تمرير القائمة الجانبية إلى الدرس الحالي */
  var cur = CW.$(".ls-lessons a.current");
  if (cur) setTimeout(function () { cur.scrollIntoView({ block: "center" }); window.scrollTo(0, 0); }, 0);
};
