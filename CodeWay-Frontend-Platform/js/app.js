/* ==========================================================
   CodeWay — نقطة الإقلاع
   يُحمَّل آخراً: يرسم الشريط العلوي والتذييل ثم يستدعي منطق الصفحة
   المحدد في <body data-page="...">
   ========================================================== */
(function () {
  "use strict";
  function boot() {
    CW.initNavigation();
    var page = document.body.getAttribute("data-page");
    try {
      if (page && CW.pages[page]) CW.pages[page]();
    } catch (err) {
      /* عرض رسالة واضحة بدلاً من صفحة فارغة عند حدوث خطأ غير متوقع */
      console.error(err);
      var main = document.getElementById("main");
      if (main) main.insertAdjacentHTML("afterbegin", '<div class="container" style="padding-block:24px"><div class="notice warning">' + CW.icon("alert") + "<span>تعذّر عرض جزء من هذه الصفحة. حاول تحديثها أو العودة إلى <a href=\"" + CW.routes.home() + "\"><u>الرئيسية</u></a>.</span></div></div>");
    }
    CW.initTabs(document);
    CW.reveal();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
