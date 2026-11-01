/* ==========================================================
   الملف الشخصي وإعدادات الحساب (تجريبي)
   حفظ الإعدادات يتم في المتصفح فقط؛ الحفظ على الخادم يحتاج Backend.
   ========================================================== */
CW.pages.profile = function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon, esc = CW.esc, u = D.demoUser;
  var saved = CW.store.get("profile", {});
  var name = saved.name || u.name, bio = saved.bio || u.bio;
  CW.setTitle("الملف الشخصي");
  var tab = CW.qs("tab") || "overview";
  var tabs = [["overview", "نظرة عامة", "user"], ["paths", "المسارات", "route"], ["projects", "المشاريع", "rocket"], ["progress", "التقدم", "activity"], ["settings", "الإعدادات", "settings"]];
  var allTracks = u.tracks.map(function (t) { return CW.track(t.type, t.id); });

  var panels = {
    overview: '<div class="grid grid-2"><div class="card card-pad"><h2 class="dash-h">' + icon("info") + 'معلومات الحساب</h2><dl class="info-dl">' +
      "<div><dt>الاسم</dt><dd>" + esc(name) + "</dd></div><div><dt>اسم المستخدم</dt><dd class=\"ltr\">@" + esc(u.username) + "</dd></div><div><dt>البريد الإلكتروني</dt><dd class=\"ltr\">" + esc(u.email) + "</dd></div><div><dt>نوع الحساب</dt><dd>" + esc(u.joined) + "</dd></div></dl></div>" +
      '<div class="card card-pad"><h2 class="dash-h">' + icon("award") + 'ملخص</h2><div class="grid grid-2">' +
      [[u.careers.length, "مسارات مهنية"], [u.tracks.length, "لغات وأدوات"], [u.projects.length, "مشاريع"], [u.achievements.filter(function (a) { return a.earned; }).length, "إنجازات"]].map(function (s) {
        return '<div class="mini-stat"><b>' + s[0] + "</b><span>" + s[1] + "</span></div>";
      }).join("") + "</div></div></div>",
    paths: '<div class="grid grid-2">' + u.careers.map(function (cp) {
      var c = CW.find("careers", cp.id);
      return '<article class="card card-pad"><div class="flex items-center gap-3"><span class="icon-tile">' + icon(c.icon) + '</span><div class="grow"><h3><a href="' + R.career(c.id) + '">' + esc(c.name) + '</a></h3><small class="text-muted">المرحلة ' + cp.stage + " من 5</small></div><strong>" + cp.progress + '%</strong></div><div class="progress sm mt-4"><span style="--v:' + cp.progress + '%"></span></div></article>';
    }).join("") + "</div>",
    projects: '<div class="grid grid-3">' + u.projects.map(function (p) { return CW.cards.project(CW.find("projects", p.id)); }).join("") + "</div>",
    progress: '<div class="card"><ul class="row-list">' + u.tracks.map(function (tr, i) {
      var t = allTracks[i];
      return "<li>" + (t.item.mono ? CW.mono(t.item, "sm") : "") + '<div class="grow"><a href="' + t.overview + '"><strong><bdi>' + esc(t.name) + '</bdi></strong></a><small>الوحدة ' + tr.module + " من " + t.modules.length + '</small><div class="progress sm mt-2"><span style="--v:' + tr.progress + '%"></span></div></div><strong>' + tr.progress + "%</strong></li>";
    }).join("") + "</ul></div>",
    settings: '<form class="card card-pad settings-form" id="settingsForm" novalidate><h2 class="dash-h">' + icon("user") + 'البيانات الشخصية</h2><div class="form-grid">' +
      '<div class="field"><label for="sName">الاسم</label><input class="input" id="sName" name="name" value="' + esc(name) + '" required></div>' +
      '<div class="field"><label for="sEmail">البريد الإلكتروني</label><input class="input ltr" id="sEmail" type="email" value="' + esc(u.email) + '" disabled><p class="hint">تغيير البريد يحتاج نظام مصادقة.</p></div>' +
      '<div class="field full"><label for="sBio">نبذة</label><textarea class="textarea" id="sBio" name="bio">' + esc(bio) + "</textarea></div></div>" +
      '<h2 class="dash-h mt-8">' + icon("sliders") + 'التفضيلات</h2><div class="pref-list">' +
      [["pEmail", "إشعارات البريد عن الدروس الجديدة"], ["pWeekly", "ملخص أسبوعي للتقدم"], ["pPublic", "إظهار الملف الشخصي للعامة"]].map(function (p) {
        return '<label class="switch"><input type="checkbox" id="' + p[0] + '"' + (saved[p[0]] ? " checked" : "") + '><span class="track"></span>' + p[1] + "</label>";
      }).join("") + "</div>" +
      '<div class="field mt-6" style="max-width:320px"><label for="sLevel">مستواك الحالي</label><select class="select" id="sLevel">' + ["beginner", "intermediate", "advanced"].map(function (l) { return '<option value="' + l + '"' + (saved.level === l ? " selected" : "") + ">" + CW.levels[l].name + "</option>"; }).join("") + "</select></div>" +
      '<div class="flex gap-3 wrap mt-8"><button class="btn btn-primary" type="submit">' + icon("check", "ic-sm") + 'حفظ التغييرات</button><button class="btn btn-outline" type="button" data-demo="تغيير كلمة المرور يحتاج نظام مصادقة (Backend) وسيُفعَّل لاحقاً.">' + icon("lock", "ic-sm") + 'تغيير كلمة المرور</button>' +
      '<button class="btn btn-danger-soft" type="button" data-demo="حذف الحساب غير متاح في الواجهة التجريبية.">' + icon("trash", "ic-sm") + "حذف الحساب</button></div>" +
      '<p class="hint mt-4">تُحفظ التغييرات في متصفحك فقط إلى أن يتم ربط الواجهة بالخادم.</p></form>'
  };

  document.getElementById("main").innerHTML = '<div class="app-shell">' + CW.dashSide("profile") + '<div class="app-main">' +
    '<button class="btn btn-outline btn-sm side-toggle mb-4" data-toggle="#appSide" data-scrim aria-controls="appSide" aria-expanded="false">' + icon("sidebar", "ic-sm") + "القائمة</button>" +
    '<section class="profile-cover"><div class="pc-banner" aria-hidden="true"></div><div class="pc-body"><img class="avatar lg" src="' + CW.asset(u.avatar) + '" alt="الصورة الشخصية التجريبية">' +
    '<div class="grow"><h1>' + esc(name) + '</h1><p class="text-muted ltr" style="text-align:right">@' + esc(u.username) + '</p><p class="mt-2">' + esc(bio) + "</p></div>" +
    '<button class="btn btn-outline btn-sm" data-demo="رفع الصورة الشخصية يحتاج خادماً لتخزين الملفات.">' + icon("upload", "ic-sm") + "تغيير الصورة</button></div></section>" +
    '<div class="notice demo mb-6">' + icon("info", "ic-sm") + "<span>ملف شخصي تجريبي — البيانات معروضة لتوضيح الواجهة فقط.</span></div>" +
    '<div class="tabs-line mb-6" role="tablist" data-tabs aria-label="أقسام الملف الشخصي">' + tabs.map(function (t) {
      return '<button class="tab" role="tab" id="pt-' + t[0] + '" aria-controls="pp-' + t[0] + '" aria-selected="' + (t[0] === tab) + '">' + icon(t[2], "ic-sm") + t[1] + "</button>";
    }).join("") + "</div>" +
    tabs.map(function (t) { return '<div class="tab-panel" role="tabpanel" id="pp-' + t[0] + '" aria-labelledby="pt-' + t[0] + '"' + (t[0] === tab ? "" : " hidden") + ">" + panels[t[0]] + "</div>"; }).join("") +
    "</div></div>";

  CW.$("#settingsForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var n = CW.$("#sName");
    if (!n.value.trim()) { n.setAttribute("aria-invalid", "true"); n.focus(); CW.toast("الاسم مطلوب.", "warning"); return; }
    n.removeAttribute("aria-invalid");
    CW.store.set("profile", { name: n.value.trim(), bio: CW.$("#sBio").value.trim(), pEmail: CW.$("#pEmail").checked, pWeekly: CW.$("#pWeekly").checked, pPublic: CW.$("#pPublic").checked, level: CW.$("#sLevel").value });
    CW.$(".profile-cover h1").textContent = n.value.trim();
    CW.toast("حُفظت التغييرات في متصفحك (لم تُرسل إلى أي خادم).", "success");
  });
  document.querySelector("[data-tabs]").addEventListener("tabchange", function (e) {
    try { history.replaceState(null, "", location.pathname + "?tab=" + e.detail.id.replace("pt-", "")); } catch (err) { /* file:// */ }
  });
};
