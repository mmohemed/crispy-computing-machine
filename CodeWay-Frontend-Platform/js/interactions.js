/* ==========================================================
   CodeWay — التفاعلات المشتركة:
   الإشعارات، النوافذ المنبثقة، التبويبات، الأكورديون، النسخ، الطي، الظهور التدريجي،
   والأزرار التجريبية (data-demo) التي تعرض رسالة بدلاً من ادعاء وظيفة غير منفذة.
   ========================================================== */
(function () {
  "use strict";
  var icon = CW.icon;

  /* ---------- الإشعارات ---------- */
  CW.toast = function (msg, type) {
    var stack = document.getElementById("toastStack");
    if (!stack) {
      stack = document.createElement("div");
      stack.id = "toastStack"; stack.className = "toast-stack";
      stack.setAttribute("role", "status"); stack.setAttribute("aria-live", "polite");
      document.body.appendChild(stack);
    }
    var t = document.createElement("div");
    t.className = "toast " + (type || "");
    t.innerHTML = icon(type === "success" ? "checkCircle" : type === "warning" ? "alert" : "info") + "<span>" + CW.esc(msg) + "</span>";
    stack.appendChild(t);
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 320); }, 3600);
  };

  /* ---------- النافذة المنبثقة ---------- */
  var lastFocus = null;
  CW.modal = {
    open: function (opts) {
      CW.modal.close();
      lastFocus = document.activeElement;
      var m = document.createElement("div");
      m.className = "modal"; m.id = "cwModal";
      m.innerHTML = '<div class="modal-backdrop" data-close-modal></div>' +
        '<div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="cwModalTitle"' + (opts.width ? ' style="width:min(' + opts.width + ',100%)"' : "") + ">" +
        (opts.raw ? opts.raw :
          '<div class="modal-head">' + (opts.icon ? '<span class="icon-tile sm">' + icon(opts.icon) + "</span>" : "") +
          '<h2 id="cwModalTitle">' + CW.esc(opts.title || "") + '</h2><button class="btn btn-ghost btn-icon btn-sm" data-close-modal aria-label="إغلاق">' + icon("x") + "</button></div>" +
          '<div class="modal-body">' + (opts.body || "") + "</div>" +
          (opts.foot ? '<div class="modal-foot">' + opts.foot + "</div>" : "")) +
        "</div>";
      document.body.appendChild(m);
      document.body.classList.add("no-scroll");
      var f = m.querySelector("[autofocus], input, select, textarea, button:not([data-close-modal])") || m.querySelector("button");
      if (f) setTimeout(function () { f.focus(); }, 30);
      if (opts.onOpen) opts.onOpen(m);
      return m;
    },
    close: function () {
      var m = document.getElementById("cwModal");
      if (!m) return;
      m.remove();
      document.body.classList.remove("no-scroll");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
  };
  document.addEventListener("click", function (e) { if (e.target.closest("[data-close-modal]")) CW.modal.close(); });
  document.addEventListener("keydown", function (e) {
    var m = document.getElementById("cwModal");
    if (!m) return;
    if (e.key === "Escape") CW.modal.close();
    if (e.key === "Tab") { /* حبس التركيز داخل النافذة */
      var f = CW.$$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', m);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- التبويبات: [data-tabs] مع أزرار .tab[aria-controls] ---------- */
  CW.initTabs = function (root) {
    CW.$$("[data-tabs]", root).forEach(function (tabs) {
      if (tabs.dataset.ready) return;
      tabs.dataset.ready = "1";
      var btns = CW.$$('[role="tab"]', tabs);
      function select(btn, focus) {
        btns.forEach(function (b) {
          var on = b === btn;
          b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1;
          var p = document.getElementById(b.getAttribute("aria-controls"));
          if (p) p.hidden = !on;
        });
        if (focus) btn.focus();
        tabs.dispatchEvent(new CustomEvent("tabchange", { detail: btn }));
      }
      btns.forEach(function (b) { b.addEventListener("click", function () { select(b); }); });
      tabs.addEventListener("keydown", function (e) {
        var i = btns.indexOf(document.activeElement); if (i < 0) return;
        var n = null;
        if (e.key === "ArrowLeft") n = (i + 1) % btns.length;
        if (e.key === "ArrowRight") n = (i - 1 + btns.length) % btns.length;
        if (e.key === "Home") n = 0; if (e.key === "End") n = btns.length - 1;
        if (n !== null) { e.preventDefault(); select(btns[n], true); }
      });
      var init = btns.filter(function (b) { return b.getAttribute("aria-selected") === "true"; })[0] || btns[0];
      if (init) select(init);
    });
  };

  /* ---------- الأكورديون: .acc-item > .acc-btn + .acc-panel ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".acc-btn");
    if (!b) return;
    var item = b.closest(".acc-item"), acc = item.parentNode, open = !item.classList.contains("open");
    if (acc.hasAttribute("data-single")) CW.$$(".acc-item.open", acc).forEach(function (o) { if (o !== item) { o.classList.remove("open"); CW.$(".acc-btn", o).setAttribute("aria-expanded", "false"); } });
    item.classList.toggle("open", open);
    b.setAttribute("aria-expanded", open);
  });

  /* ---------- النسخ: [data-copy="#selector"] أو data-copy-text ---------- */
  CW.copy = function (text) {
    function done() { CW.toast("تم النسخ إلى الحافظة", "success"); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(text) ? done() : CW.toast("تعذّر النسخ", "warning"); });
    } else { fallback(text) ? done() : CW.toast("تعذّر النسخ", "warning"); }
  };
  function fallback(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    var ok = false; try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove(); return ok;
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (!b) return;
    var target = document.querySelector(b.getAttribute("data-copy"));
    if (target) CW.copy(target.value !== undefined && target.tagName === "TEXTAREA" ? target.value : target.innerText);
  });

  /* ---------- أزرار الوظائف غير المنفذة ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-demo]");
    if (!b) return;
    e.preventDefault();
    CW.toast(b.getAttribute("data-demo") || "هذه الوظيفة تحتاج ربطاً بالخادم وستتوفر لاحقاً.", "warning");
  });

  /* ---------- الطي والفتح: [data-toggle="#id"] ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-toggle]");
    if (!b) return;
    var t = document.querySelector(b.getAttribute("data-toggle"));
    if (!t) return;
    var open = !t.classList.contains("open");
    t.classList.toggle("open", open);
    b.setAttribute("aria-expanded", open);
    var scrim = document.querySelector(".side-scrim");
    if (b.hasAttribute("data-scrim")) {
      if (open && !scrim) { scrim = document.createElement("div"); scrim.className = "side-scrim"; document.body.appendChild(scrim); scrim.addEventListener("click", function () { b.click(); }); }
      if (!open && scrim) scrim.remove();
    }
  });

  /* ---------- الظهور التدريجي ---------- */
  CW.reveal = function () {
    var els = CW.$$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: .04 });
    els.forEach(function (el) { io.observe(el); });
  };

  /* ---------- حالة فارغة جاهزة ---------- */
  CW.emptyState = function (title, text, action) {
    return '<div class="empty-state"><span class="icon-tile lg">' + icon("search") + "</span><h3>" + CW.esc(title) + "</h3><p>" + CW.esc(text) + "</p>" + (action || "") + "</div>";
  };
  CW.placeholder = function (iconName, title, text) {
    return '<div class="placeholder-box"><span class="icon-tile">' + icon(iconName) + "</span><div><strong>" + CW.esc(title) + "</strong><span>" + CW.esc(text) + "</span></div></div>";
  };

  /* صندوق كود بسيط مع أزرار النسخ والتشغيل */
  var codeId = 0;
  CW.codeBlock = function (opts) {
    var id = "code-" + (++codeId);
    var lines = String(opts.code || "").split("\n").map(function (l) { return '<span class="ln">' + (CW.esc(l) || " ") + "</span>"; }).join("");
    return '<div class="code-block"><div class="code-head"><span class="dots"><i></i><i></i><i></i></span><span>' + CW.esc(opts.file || "example") + '</span><span class="actions">' +
      (opts.run ? '<button class="code-btn run" type="button" data-demo="' + CW.esc(opts.runMsg || "تشغيل الأمثلة يحتاج محرك تنفيذ وسيُربط لاحقاً. جرّب محرر الأكواد لتشغيل JavaScript.") + '">' + icon("play", "ic-xs") + "تشغيل</button>" : "") +
      '<button class="code-btn" type="button" data-copy="#' + id + '">' + icon("copy", "ic-xs") + "نسخ</button></span></div>" +
      '<pre><code id="' + id + '">' + lines + "</code></pre></div>";
  };
})();

/* ---------- صفحة «غير موجود» عند معرّف غير صحيح ---------- */
CW.renderNotFound = function (what, backLabel, backUrl) {
  var main = document.getElementById("main");
  CW.setTitle(what + " غير موجود");
  main.innerHTML = '<section class="section"><div class="container container-narrow">' +
    CW.emptyState(what + " غير موجود", "لم نعثر على العنصر المطلوب. ربما تغيّر الرابط أو لم يُضف هذا العنصر بعد.",
      '<a class="btn btn-primary" href="' + backUrl + '">' + CW.icon("arrowR", "ic-sm") + backLabel + "</a>") +
    "</div></section>";
};
