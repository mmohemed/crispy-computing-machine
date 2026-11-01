/* ==========================================================
   CodeWay — مكونات البطاقات القابلة لإعادة الاستخدام
   كل دالة تعيد HTML لبطاقة واحدة من نوع محدد.
   ========================================================== */
(function () {
  "use strict";
  var R = CW.routes, icon = CW.icon, esc = CW.esc;

  CW.cards = {
    /* بطاقة لغة البرمجة */
    language: function (l) {
      var t = CW.track("lang", l.id);
      return '<article class="card card-hover lang-card" style="--brand:' + l.color + '">' +
        '<div class="top">' + CW.mono(l) + '<div><h3><a class="card-link" href="' + R.language(l.id) + '">' + CW.bdi(l.name) + "</a></h3>" +
        CW.levelBadge(l.level) + "</div></div>" +
        '<p class="card-text">' + esc(l.tagline) + "</p>" +
        '<div class="meta"><span class="badge badge-outline">' + icon("layers", "ic-xs") + t.modules.length + " وحدات مخطط لها</span></div>" +
        '<ul class="tag-list mt-4">' + l.uses.slice(0, 3).map(function (u) { return "<li>" + CW.bdi(u) + "</li>"; }).join("") + "</ul>" +
        "</article>";
    },

    /* بطاقة الأداة (مدمجة) */
    tool: function (t) {
      return '<article class="card card-hover tool-card">' + CW.mono(t, "sm") +
        '<div class="grow"><h3><a class="card-link" href="' + R.tool(t.id) + '">' + CW.bdi(t.name) + "</a></h3><p>" + esc(t.tagline) + "</p></div></article>";
    },

    /* بطاقة المجال */
    field: function (f) {
      var careers = CW.rel.careersWith("fields", f.id).length;
      return '<article class="card card-hover field-card" style="--fc:' + f.color + '">' +
        '<div class="flex items-center gap-3"><span class="icon-tile" style="background:color-mix(in srgb,' + f.color + ' 12%,#fff);color:' + f.color + '">' + icon(f.icon) + '</span><span class="field-en">' + esc(f.en) + "</span></div>" +
        '<h3 class="card-title"><a class="card-link" href="' + R.field(f.id) + '">' + esc(f.name) + "</a></h3>" +
        '<p class="card-text">' + esc(f.tagline) + "</p>" +
        '<div class="card-foot flex items-center gap-2 wrap"><span class="badge">' + icon("code", "ic-xs") + f.langs.length + " لغات</span><span class=\"badge\">" + icon("wrench", "ic-xs") + f.tools.length + " أدوات</span><span class=\"badge\">" + icon("route", "ic-xs") + careers + " مسارات</span></div></article>";
    },

    /* بطاقة المسار المهني */
    career: function (c) {
      var cat = CW.data.careerCategories[c.cat];
      return '<article class="card card-hover career-card" style="--cat:' + cat.color + '">' +
        '<div class="top"><span class="icon-tile">' + icon(c.icon) + '</span><div><span class="cat">' + cat.name + '</span><h3 class="card-title"><a class="card-link" href="' + R.career(c.id) + '">' + esc(c.name) + "</a></h3></div></div>" +
        '<p class="card-text">' + esc(c.tagline) + "</p>" +
        '<ul class="tag-list">' + c.skills.slice(0, 4).map(function (s) { return "<li>" + CW.bdi(s) + "</li>"; }).join("") + "</ul>" +
        '<div class="card-foot flex items-center gap-2"><span class="text-sm text-muted">' + icon("route", "ic-xs") + " خارطة من 5 مراحل</span><span class=\"link-arrow\" style=\"margin-inline-start:auto\">الخارطة" + icon("arrowL", "ic-xs") + "</span></div></article>";
    },

    /* بطاقة المشروع */
    project: function (p) {
      var techs = CW.findMany("languages", p.langs).concat(CW.findMany("tools", p.tools)).slice(0, 4);
      return '<article class="card card-hover project-card">' +
        '<div class="preview"><img src="' + CW.asset("images/project-preview.svg") + '" alt=""><span class="icon-tile">' + icon(p.icon) + "</span></div>" +
        '<div class="body"><div class="top">' + CW.levelBadge(p.level) + "</div>" +
        '<h3 class="card-title mt-2"><a class="card-link" href="' + R.project(p.id) + '">' + esc(p.name) + "</a></h3>" +
        '<p class="card-text">' + esc(p.tagline) + "</p>" +
        '<ul class="tag-list">' + techs.map(function (t) { return "<li>" + CW.bdi(t.name) + "</li>"; }).join("") + "</ul></div></article>";
    },

    /* بطاقة موضوع/مجال صغيرة بأيقونة */
    mini: function (opts) {
      return '<article class="card card-hover mini-card"><span class="icon-tile sm ' + (opts.tone || "") + '">' + icon(opts.icon) + '</span><div class="grow"><h3><a class="card-link" href="' + opts.url + '">' + esc(opts.title) + "</a></h3>" +
        (opts.sub ? "<p>" + esc(opts.sub) + "</p>" : "") + "</div>" + icon("chevL", "ic-sm") + "</article>";
    },

    /* عنصر درس في قائمة */
    lesson: function (track, m, l, state) {
      var lesson = track.modules[m - 1].lessons[l - 1];
      return '<a class="lesson-item ' + (state || "") + '" href="' + track.lessonUrl(m, l) + '"><span class="num">' + (state === "done" ? icon("check", "ic-xs") : l) + "</span>" +
        '<div class="grow"><div class="title">الدرس ' + l + ": " + esc(lesson.title) + '</div><div class="sub">المحتوى قيد الإعداد · قالب درس جاهز</div></div>' + icon("chevL", "ic-sm") + "</a>";
    }
  };

  /* رأس قائمة بعناصر مرتبطة صغيرة (لغات/أدوات) كرقاقات قابلة للنقر */
  CW.chipLinks = function (items, kind) {
    if (!items.length) return '<p class="text-sm text-muted">لا توجد عناصر مرتبطة حالياً.</p>';
    return '<div class="chip-list">' + items.map(function (it) {
      var url = kind === "lang" ? R.language(it.id) : kind === "tool" ? R.tool(it.id) : kind === "field" ? R.field(it.id) : kind === "career" ? R.career(it.id) : kind === "ai" ? R.aiArea(it.id) : R.csTopic(it.id);
      var lead = it.mono ? CW.mono(it, "xs") : icon(it.icon || "compass", "ic-sm");
      return '<a class="chip" href="' + url + '">' + lead + CW.bdi(it.name) + "</a>";
    }).join("") + "</div>";
  };
})();
