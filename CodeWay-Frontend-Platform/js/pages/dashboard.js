/* ==========================================================
   لوحة المتعلم — بيانات تجريبية واضحة (لا يوجد مستخدم حقيقي)
   الصفحات: نظرة عامة، مساراتي، مشاريعي، اختباراتي، إنجازاتي
   تحدد الصفحة العرض عبر <body data-view="...">
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc;

  CW.dashSide = function (active) {
    var u = D.demoUser;
    var links = [["overview", "نظرة عامة", "grid", R.dashboard()], ["learning", "مساراتي التعليمية", "route", R.dashLearning(), u.careers.length + u.tracks.length],
      ["projects", "مشاريعي", "rocket", R.dashProjects(), u.projects.length], ["quizzes", "اختباراتي", "clipboard", R.dashQuizzes(), u.quizResults.length],
      ["achievements", "إنجازاتي", "trophy", R.dashAchievements(), u.achievements.filter(function (a) { return a.earned; }).length]];
    return '<aside class="app-side" id="appSide" aria-label="قائمة لوحة المتعلم"><div class="side-user"><img class="avatar md" src="' + CW.asset(u.avatar) + '" alt="صورة المستخدم التجريبي"><div><strong>' + esc(u.name) + '</strong><small>حساب تجريبي</small></div></div>' +
      "<h2>لوحتي</h2>" + links.map(function (l) {
        return '<a class="side-link' + (l[0] === active ? " active" : "") + '" href="' + l[3] + '"' + (l[0] === active ? ' aria-current="page"' : "") + ">" + icon(l[2]) + l[1] + (l[4] != null ? '<span class="count">' + l[4] + "</span>" : "") + "</a>";
      }).join("") +
      "<h2>الحساب</h2>" +
      '<a class="side-link' + (active === "profile" ? " active" : "") + '" href="' + R.profile() + '">' + icon("user") + "الملف الشخصي</a>" +
      '<a class="side-link" href="' + R.profile("settings") + '">' + icon("settings") + "الإعدادات</a>" +
      "<h2>أدوات</h2>" +
      '<a class="side-link" href="' + R.editor() + '">' + icon("terminal") + "محرر الأكواد</a>" +
      '<a class="side-link" href="' + R.explore() + '">' + icon("search") + "استكشاف المحتوى</a>" +
      '<a class="side-link" href="' + R.home() + '">' + icon("home") + "الصفحة الرئيسية</a></aside>";
  };
  CW.dashHead = function (title, sub, actions) {
    return '<div class="app-main-head"><div><button class="btn btn-outline btn-sm side-toggle mb-4" data-toggle="#appSide" data-scrim aria-controls="appSide" aria-expanded="false">' + icon("sidebar", "ic-sm") + "القائمة</button>" +
      "<h1>" + title + "</h1><p>" + sub + "</p></div>" + (actions || "") + "</div>" +
      '<div class="notice demo mb-6">' + icon("info", "ic-sm") + "<span>جميع البيانات في لوحة المتعلم تجريبية لعرض الواجهة، ولا تمثل مستخدماً حقيقياً. ربطها بالحساب يحتاج Backend.</span></div>";
  };

  function trackCard(tr) {
    var t = CW.track(tr.type, tr.id); if (!t) return "";
    var mod = t.modules[tr.module - 1];
    return '<article class="card card-hover dash-track"><div class="flex items-center gap-3">' + (t.item.mono ? CW.mono(t.item, "sm") : "") + '<div class="grow"><span class="text-sm text-muted">' + t.label + '</span><h3><a class="card-link" href="' + t.overview + '">' + CW.bdi(t.name) + "</a></h3></div><strong>" + tr.progress + "%</strong></div>" +
      '<div class="progress sm mt-4"><span style="--v:' + tr.progress + '%"></span></div><p class="text-sm text-muted mt-2">الوحدة ' + tr.module + ": " + esc(mod.title) + "</p></article>";
  }
  function careerProgress(cp) {
    var c = CW.find("careers", cp.id), st = CW.buildRoadmap(c);
    return '<article class="card card-pad dash-career"><div class="flex items-center gap-3 wrap" style="justify-content:space-between"><div><span class="text-sm text-muted">مسار مهني</span><h3>' + esc(c.name) + '</h3></div><a class="btn btn-soft btn-sm" href="' + R.career(c.id) + '">الخارطة' + icon("arrowL", "ic-xs") + "</a></div>" +
      '<ol class="stage-bar">' + st.map(function (s) { return '<li class="' + (s.n < cp.stage ? "done" : s.n === cp.stage ? "cur" : "") + '" title="' + esc(s.title) + '"><span>' + s.n + "</span><small>" + esc(s.title) + "</small></li>"; }).join("") + "</ol>" +
      '<div class="progress-label mt-4"><span>المرحلة ' + cp.stage + " من " + st.length + "</span><span>" + cp.progress + '%</span></div><div class="progress sm"><span style="--v:' + cp.progress + '%"></span></div></article>';
  }
  var pStatus = { done: ["مكتمل", "badge-success"], "in-progress": ["قيد التنفيذ", "badge-primary"], planned: ["مخطط", "badge"] };

  var views = {
    overview: function () {
      var u = D.demoUser, ll = u.lastLesson, lt = CW.track(ll.track, ll.id), lm = lt.modules[ll.m - 1];
      var nextCareer = CW.find("careers", u.careers[0].id), nextStage = CW.buildRoadmap(nextCareer)[u.careers[0].stage - 1];
      var days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"], max = Math.max.apply(null, u.weekActivity);
      var earned = u.achievements.filter(function (a) { return a.earned; });
      return CW.dashHead("مرحباً، " + esc(u.name) + " 👋", "هذه نظرة سريعة على رحلتك التعليمية.", '<a class="btn btn-primary" href="' + lt.lessonUrl(ll.m, ll.l) + '">' + icon("play", "ic-sm") + "تابع التعلم</a>") +
        '<div class="grid grid-4 mb-6">' +
        [["route", u.careers.length, "مسارات مهنية", ""], ["book", u.tracks.length, "لغات وأدوات", "accent"], ["rocket", u.projects.filter(function (p) { return p.status === "done"; }).length + " / " + u.projects.length, "مشاريع مكتملة", "success"], ["trophy", earned.length, "إنجازات", "warning"]].map(function (s) {
          return '<div class="card stat-card"><span class="icon-tile ' + s[3] + '">' + icon(s[0]) + '</span><div><div class="value">' + s[1] + '</div><div class="label">' + s[2] + "</div></div></div>";
        }).join("") + "</div>" +
        '<div class="dash-grid"><div class="dash-col">' +
        '<section class="card resume-card"><div class="rc-body"><span class="badge badge-primary">' + icon("clock", "ic-xs") + "آخر درس</span><h2>" + esc(lm.lessons[ll.l - 1].title) + '</h2><p class="text-muted">' + CW.bdi(lt.name) + " · الوحدة " + ll.m + ": " + esc(lm.title) + '</p><a class="btn btn-primary mt-4" href="' + lt.lessonUrl(ll.m, ll.l) + '">' + icon("play", "ic-sm") + "متابعة الدرس</a></div>" + (lt.item.mono ? CW.mono(lt.item, "lg") : "") + "</section>" +
        '<section><div class="dash-sec-head"><h2>المسارات التي تتعلمها</h2><a class="link-arrow" href="' + R.dashLearning() + '">الكل' + icon("arrowL", "ic-xs") + "</a></div>" + careerProgress(u.careers[0]) + '<div class="grid grid-2 mt-4">' + u.tracks.slice(0, 2).map(trackCard).join("") + "</div></section>" +
        '<section><div class="dash-sec-head"><h2>المشاريع</h2><a class="link-arrow" href="' + R.dashProjects() + '">الكل' + icon("arrowL", "ic-xs") + '</a></div><div class="card"><ul class="row-list">' + u.projects.map(function (up) {
          var p = CW.find("projects", up.id), s = pStatus[up.status];
          return '<li><span class="icon-tile sm">' + icon(p.icon) + '</span><div class="grow"><a href="' + R.project(p.id) + '"><strong>' + esc(p.name) + "</strong></a><small>" + CW.levels[p.level].name + '</small></div><span class="badge ' + s[1] + '">' + s[0] + "</span></li>";
        }).join("") + "</ul></div></section></div>" +

        '<div class="dash-col">' +
        '<section class="card card-pad next-step"><span class="icon-tile">' + icon("flag") + '</span><h2>خطوتك التالية</h2><p class="text-muted">أكمل المرحلة ' + nextStage.n + " من مسار " + esc(nextCareer.name) + ": " + esc(nextStage.title) + '</p><a class="btn btn-dark btn-block mt-4" href="' + R.career(nextCareer.id) + '">عرض المرحلة في الخارطة</a></section>' +
        '<section class="card card-pad"><h2 class="dash-h">' + icon("activity") + 'نشاط الأسبوع</h2><div class="week-chart" role="img" aria-label="نشاط تجريبي خلال الأسبوع">' +
        u.weekActivity.map(function (v, i) { return '<div class="bar"><span style="--h:' + (max ? v / max * 100 : 0) + '%" title="' + v + ' دروس"></span><small>' + days[i].slice(0, 2) + "</small></div>"; }).join("") + '</div><p class="hint">عدد الدروس يومياً (بيانات تجريبية)</p></section>' +
        '<section class="card card-pad"><div class="dash-sec-head"><h2 class="dash-h">' + icon("clipboard") + 'الاختبارات</h2><a class="link-arrow" href="' + R.dashQuizzes() + '">الكل' + icon("arrowL", "ic-xs") + '</a></div><ul class="row-list compact">' +
        u.quizResults.map(function (r) { var q = CW.find("quizzes", r.id); return '<li><div class="grow"><a href="' + R.quiz(q.id) + '"><strong>' + esc(q.title) + '</strong></a></div><span class="badge badge-success">' + r.score + "%</span></li>"; }).join("") + "</ul></section>" +
        '<section class="card card-pad"><div class="dash-sec-head"><h2 class="dash-h">' + icon("trophy") + 'آخر الإنجازات</h2><a class="link-arrow" href="' + R.dashAchievements() + '">الكل' + icon("arrowL", "ic-xs") + '</a></div><div class="badge-row">' +
        earned.slice(0, 4).map(function (a) { return '<span class="ach-mini" title="' + esc(a.desc) + '">' + icon(a.icon) + "<small>" + esc(a.title) + "</small></span>"; }).join("") + "</div></section>" +
        "</div></div>";
    },

    learning: function () {
      var u = D.demoUser;
      return CW.dashHead("مساراتي التعليمية", "المسارات المهنية واللغات والأدوات التي تتعلمها.", '<a class="btn btn-outline" href="' + R.careers() + '">' + icon("plus", "ic-sm") + "أضف مساراً</a>") +
        '<h2 class="dash-title">المسارات المهنية</h2><div class="grid grid-2 mb-8">' + u.careers.map(careerProgress).join("") + "</div>" +
        '<h2 class="dash-title">اللغات والأدوات</h2><div class="grid grid-3">' + u.tracks.map(trackCard).join("") + "</div>";
    },

    projects: function () {
      var u = D.demoUser;
      return CW.dashHead("مشاريعي", "تابع حالة مشاريعك العملية.", '<a class="btn btn-outline" href="' + R.projects() + '">' + icon("plus", "ic-sm") + "ابدأ مشروعاً</a>") +
        '<div class="kanban">' + ["planned", "in-progress", "done"].map(function (st) {
          var list = u.projects.filter(function (p) { return p.status === st; });
          return '<section class="kb-col"><h2>' + pStatus[st][0] + ' <span class="count">' + list.length + "</span></h2>" +
            (list.length ? list.map(function (up) { var p = CW.find("projects", up.id); return CW.cards.project(p); }).join("") : '<p class="text-sm text-muted">لا توجد مشاريع.</p>') + "</section>";
        }).join("") + "</div>";
    },

    quizzes: function () {
      var u = D.demoUser, best = CW.store.get("quiz-best", {});
      return CW.dashHead("اختباراتي", "نتائج الاختبارات التي أجريتها.", '<a class="btn btn-outline" href="' + R.quizzes() + '">' + icon("clipboard", "ic-sm") + "كل الاختبارات</a>") +
        '<div class="table-wrap"><table class="table"><thead><tr><th>الاختبار</th><th>القسم</th><th>المستوى</th><th>النتيجة</th><th>المصدر</th><th></th></tr></thead><tbody>' +
        D.quizzes.map(function (q) {
          var demo = u.quizResults.filter(function (r) { return r.id === q.id; })[0], local = best[q.id];
          var score = local != null ? local : demo ? demo.score : null, t = CW.track(q.track.type, q.track.id);
          return '<tr><td><div class="cell-main">' + icon("clipboard", "ic-sm") + esc(q.title) + "</div></td><td>" + CW.bdi(t.name) + "</td><td>" + CW.levelBadge(q.level) + "</td><td>" +
            (score != null ? '<span class="badge ' + (score >= 60 ? "badge-success" : "badge-warning") + '">' + score + "%</span>" : '<span class="text-muted">—</span>') + "</td><td>" +
            (local != null ? "محاولتك المحلية" : demo ? "بيانات تجريبية" : "—") + '</td><td class="actions"><a class="btn btn-soft btn-sm" href="' + R.quiz(q.id) + '">' + (score != null ? "إعادة" : "ابدأ") + "</a></td></tr>";
        }).join("") + "</tbody></table></div>";
    },

    achievements: function () {
      var u = D.demoUser, earned = u.achievements.filter(function (a) { return a.earned; }).length;
      return CW.dashHead("إنجازاتي", "حصلت على " + earned + " من " + u.achievements.length + " إنجازات.") +
        '<div class="ach-grid">' + u.achievements.map(function (a) {
          return '<article class="card ach' + (a.earned ? " earned" : "") + '"><span class="ach-ic">' + icon(a.earned ? a.icon : "lock", "ic-lg") + "</span><h3>" + esc(a.title) + '</h3><p class="text-sm text-muted">' + esc(a.desc) + "</p>" +
            '<span class="badge ' + (a.earned ? "badge-success" : "") + '">' + (a.earned ? "تم الحصول عليه" : "لم يُفتح بعد") + "</span></article>";
        }).join("") + "</div>";
    }
  };

  CW.pages.dashboard = function () {
    var view = document.body.getAttribute("data-view") || "overview";
    var titles = { overview: "لوحة المتعلم", learning: "مساراتي التعليمية", projects: "مشاريعي", quizzes: "اختباراتي", achievements: "إنجازاتي" };
    CW.setTitle(titles[view]);
    document.getElementById("main").innerHTML = '<div class="app-shell">' + CW.dashSide(view) + '<div class="app-main">' + views[view]() + "</div></div>";
  };
})();
