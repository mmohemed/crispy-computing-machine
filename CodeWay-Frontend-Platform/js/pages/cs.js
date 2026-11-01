/* ==========================================================
   قسم علوم الحاسوب: الصفحة الرئيسية وصفحة الموضوع
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc;

  CW.pages.csHome = function () {
    CW.setTitle("علوم الحاسوب");
    var byLevel = ["beginner", "intermediate", "advanced"];
    document.getElementById("main").innerHTML =
      '<header class="cs-hero"><div class="container">' + CW.breadcrumb([["علوم الحاسوب"]]) +
      '<div class="cs-hero-grid"><div><span class="eyebrow" style="background:var(--c-accent-50);color:var(--c-accent-600)">' + icon("graduation") + "علوم الحاسوب</span>" +
      "<h1>أساسيات تصنع منك مبرمجاً أقوى</h1><p class=\"lead\">" + D.csTopics.length + " موضوعاً أساسياً تمنحك فهماً عميقاً لما يحدث خلف الشيفرة، مرتبة من الأسهل إلى الأعمق.</p></div>" +
      '<div class="cs-binary" aria-hidden="true"><span>01000011</span><span>01010111</span><span>{ O(n) }</span><span>&lt;/&gt;</span></div></div></div></header>' +
      '<div class="container section-sm">' + byLevel.map(function (lv) {
        var list = D.csTopics.filter(function (t) { return t.level === lv; });
        return '<section class="cs-level"><div class="cs-level-head">' + CW.levelBadge(lv) + "<h2>" + (lv === "beginner" ? "ابدأ من هنا" : lv === "intermediate" ? "عمّق فهمك" : "للمتقدمين") + '</h2><span class="text-muted text-sm">' + list.length + " موضوعات</span></div>" +
          '<div class="grid grid-3">' + list.map(function (t) {
            var i = D.csTopics.indexOf(t) + 1;
            return '<article class="card card-hover cs-card"><div class="flex items-center gap-3"><span class="icon-tile accent">' + icon(t.icon) + '</span><span class="cs-idx">' + String(i).padStart(2, "0") + "</span></div>" +
              '<h3 class="card-title mt-4"><a class="card-link" href="' + R.csTopic(t.id) + '">' + esc(t.name) + '</a></h3><p class="ltr text-sm text-muted" style="text-align:right">' + esc(t.en) + "</p>" +
              '<p class="card-text mt-2">' + esc(t.tagline) + '</p><div class="card-foot text-sm text-muted">' + icon("layers", "ic-xs") + " " + t.units.length + " وحدات</div></article>";
          }).join("") + "</div></section>";
      }).join("") + "</div>";
  };

  CW.pages.csTopic = function () {
    var t = CW.find("csTopics", CW.qs("id"));
    if (!t) { CW.renderNotFound("الموضوع", "العودة إلى علوم الحاسوب", R.cs()); return; }
    CW.setTitle(t.name);
    var track = CW.track("cs", t.id), idx = D.csTopics.indexOf(t);
    var prev = D.csTopics[idx - 1], next = D.csTopics[idx + 1];
    var careers = D.careers.filter(function (c) { return (c.cs || []).indexOf(t.id) > -1; });
    var quizzes = CW.rel.quizzesFor("cs", t.id), exercises = CW.rel.exercisesFor("cs", t.id);
    document.getElementById("main").innerHTML =
      '<header class="cs-hero compact"><div class="container">' + CW.breadcrumb([["علوم الحاسوب", R.cs()], [t.name]]) +
      '<div class="topic-head"><span class="icon-tile lg accent">' + icon(t.icon) + '</span><div><div class="flex items-center gap-2 wrap">' + CW.levelBadge(t.level) + '<span class="text-sm text-muted ltr">' + esc(t.en) + "</span></div><h1>" + esc(t.name) + '</h1><p class="lead">' + esc(t.tagline) + "</p></div></div>" +
      '<div class="flex gap-3 wrap mt-6"><a class="btn btn-primary" href="' + track.lessonUrl(1, 1) + '">' + icon("play", "ic-sm") + 'ابدأ الدرس الأول</a><a class="btn btn-outline" href="' + R.cs() + '">' + icon("arrowR", "ic-sm") + "كل الموضوعات</a></div></div></header>" +
      '<div class="container cs-topic-layout"><div>' +
      '<div class="notice mb-6">' + icon("info", "ic-sm") + "<span>الوحدات والدروس أدناه هيكل تنظيمي؛ سيُضاف المحتوى التعليمي داخل قالب الدرس لاحقاً.</span></div>" +
      '<div class="unit-list">' + track.modules.map(function (m) {
        return '<section class="card unit" id="unit-' + m.n + '"><div class="unit-head"><span class="u-n">' + m.n + '</span><div class="grow"><span class="text-sm text-muted">الوحدة ' + m.n + "</span><h2>" + esc(m.title) + '</h2></div><span class="badge badge-warning">قيد الإعداد</span></div>' +
          '<div class="lesson-list">' + m.lessons.map(function (ls) { return CW.cards.lesson(track, m.n, ls.n); }).join("") + "</div></section>";
      }).join("") + "</div>" +
      '<div class="pager-nav mt-8">' +
      (prev ? '<a class="pager-link" href="' + R.csTopic(prev.id) + '">' + icon("chevR") + "<div><small>الموضوع السابق</small><strong>" + esc(prev.name) + "</strong></div></a>" : "") +
      (next ? '<a class="pager-link next" href="' + R.csTopic(next.id) + '"><div><small>الموضوع التالي</small><strong>' + esc(next.name) + "</strong></div>" + icon("chevL") + "</a>" : "") + "</div></div>" +
      '<aside class="sticky-side"><div class="card card-pad"><h2 class="block-title" style="font-size:1rem">' + icon("listPlain") + 'محتويات الموضوع</h2><ol class="toc">' +
      track.modules.map(function (m) { return '<li><a href="#unit-' + m.n + '">' + m.n + ". " + esc(m.title) + "</a></li>"; }).join("") + "</ol></div>" +
      '<div class="card card-pad mt-4"><h2 class="block-title" style="font-size:1rem">' + icon("clipboard") + "التدريب والاختبار</h2>" +
      (quizzes.concat(exercises).length ? quizzes.map(function (q) { return '<a class="link-arrow" href="' + R.quiz(q.id) + '">' + esc(q.title) + "</a><br>"; }).join("") + exercises.map(function (x) { return '<a class="link-arrow" href="' + R.exercise(x.id) + '">' + esc(x.title) + "</a><br>"; }).join("") : '<p class="text-sm text-muted">ستضاف التدريبات والاختبارات لاحقاً.</p>') + "</div>" +
      (careers.length ? '<div class="card card-pad mt-4"><h2 class="block-title" style="font-size:1rem">' + icon("route") + "مسارات تعتمد عليه</h2>" + CW.chipLinks(careers, "career") + "</div>" : "") +
      "</aside></div>";
  };
})();
