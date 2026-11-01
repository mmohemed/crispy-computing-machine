/* ==========================================================
   CodeWay — مكونات التنقل: الشريط العلوي، قائمة الهاتف، التذييل، مسار التنقل
   الصفحة تحدد القسم النشط عبر <body data-section="languages">
   ========================================================== */
(function () {
  "use strict";
  var R = CW.routes, icon = CW.icon, esc = CW.esc;

  CW.nav = {
    main: [
      { key: "languages", label: "لغات البرمجة", url: R.languages, icon: "code" },
      { key: "tools", label: "الأدوات والتقنيات", url: R.tools, icon: "wrench" },
      { key: "fields", label: "المجالات", url: R.fields, icon: "compass" },
      { key: "careers", label: "المسارات المهنية", url: R.careers, icon: "route" },
      { key: "ai", label: "الذكاء الاصطناعي", url: R.ai, icon: "sparkles" }
    ],
    more: [
      { key: "cs", label: "علوم الحاسوب", desc: "الأساسيات التي تصنع مبرمجاً أقوى", url: R.cs, icon: "graduation" },
      { key: "projects", label: "المشاريع العملية", desc: "مشاريع متدرجة المستوى", url: R.projects, icon: "rocket" },
      { key: "quizzes", label: "الاختبارات", desc: "قِس مستواك بعد كل وحدة", url: R.quizzes, icon: "clipboard" },
      { key: "exercises", label: "التدريبات", desc: "تمارين عملية قصيرة", url: R.exercises, icon: "edit" },
      { key: "editor", label: "محرر الأكواد", desc: "اكتب الشيفرة وجرّبها", url: R.editor, icon: "terminal" },
      { key: "references", label: "المراجع والتوثيق", desc: "روابط التوثيق الرسمية", url: R.references, icon: "book" },
      { key: "explore", label: "استكشاف المحتوى", desc: "بحث وفلترة موحّدة", url: R.explore, icon: "search" }
    ],
    account: [
      { key: "dashboard", label: "لوحة المتعلم", url: R.dashboard, icon: "grid" },
      { key: "profile", label: "الملف الشخصي", url: R.profile, icon: "user" },
      { key: "settings", label: "إعدادات الحساب", url: function () { return R.profile("settings"); }, icon: "settings" },
      { key: "admin", label: "لوحة الإدارة (تجريبية)", url: R.admin, icon: "sliders" }
    ]
  };

  function brand(dark) {
    return '<a class="brand" href="' + R.home() + '" aria-label="CodeWay — الصفحة الرئيسية">' +
      '<img src="' + CW.asset("images/logo.svg") + '" alt="" width="36" height="36">' +
      '<span class="brand-name">Code<span>Way</span></span></a>';
  }

  function renderHeader() {
    var host = document.getElementById("cw-header");
    if (!host) return;
    var body = document.body, section = body.getAttribute("data-section") || "", dark = body.getAttribute("data-header") === "dark";
    var user = CW.data.demoUser;
    var moreActive = CW.nav.more.some(function (m) { return m.key === section; });

    var links = CW.nav.main.map(function (n) {
      var a = n.key === section;
      return '<a class="nav-link' + (a ? " active" : "") + '" href="' + n.url() + '"' + (a ? ' aria-current="page"' : "") + ">" + n.label + "</a>";
    }).join("");

    var more = '<div class="dropdown" data-dropdown>' +
      '<button class="nav-link' + (moreActive ? " active" : "") + '" aria-haspopup="true" aria-expanded="false">المزيد ' + icon("chevD", "ic-xs") + "</button>" +
      '<div class="dropdown-menu mega" role="menu">' +
      CW.nav.more.map(function (m) {
        return '<a class="dropdown-item" role="menuitem" href="' + m.url() + '">' +
          '<span class="icon-tile sm">' + icon(m.icon) + "</span><span><strong>" + m.label + "</strong><small>" + m.desc + "</small></span></a>";
      }).join("") + "</div></div>";

    var userMenu = '<div class="dropdown" data-dropdown>' +
      '<button class="user-btn" aria-haspopup="true" aria-expanded="false" aria-label="قائمة الحساب">' +
      '<img class="avatar" src="' + CW.asset(user.avatar) + '" alt="">' + '<span class="user-name text-sm fw-bold hide-md">' + esc(user.name) + "</span>" + icon("chevD", "ic-xs") + "</button>" +
      '<div class="dropdown-menu align-end" role="menu">' +
      '<div class="dropdown-head"><img class="avatar md" src="' + CW.asset(user.avatar) + '" alt=""><div><strong>' + esc(user.name) + '</strong><small>حساب تجريبي — لا يوجد تسجيل دخول حقيقي</small></div></div>' +
      '<div class="dropdown-sep"></div>' +
      CW.nav.account.map(function (a) { return '<a class="dropdown-item" role="menuitem" href="' + a.url() + '">' + icon(a.icon, "ic-sm") + a.label + "</a>"; }).join("") +
      '<div class="dropdown-sep"></div>' +
      '<button class="dropdown-item" role="menuitem" data-demo="تسجيل الخروج يحتاج نظام مصادقة (Backend) وسيُفعَّل لاحقاً.">' + icon("logout", "ic-sm") + "تسجيل الخروج</button>" +
      "</div></div>";

    host.outerHTML =
      '<a class="skip-link" href="#main">تخطَّ إلى المحتوى</a>' +
      '<header class="site-header' + (dark ? " is-dark" : "") + '" id="siteHeader">' +
      '<div class="container">' + brand(dark) +
      '<nav class="main-nav" aria-label="التنقل الرئيسي">' + links + more + "</nav>" +
      '<div class="header-actions">' +
      '<button class="header-icon-btn search-trigger" data-open-search aria-label="بحث في المنصة">' + icon("search", "ic-sm") + '<span class="st-label">ابحث في CodeWay…</span><span class="kbd">Ctrl K</span></button>' +
      userMenu +
      '<button class="header-icon-btn menu-toggle" id="menuToggle" aria-label="فتح القائمة" aria-expanded="false" aria-controls="mobileDrawer">' + icon("menu") + "</button>" +
      "</div></div></header>" +
      renderDrawer(section);
  }

  function renderDrawer(section) {
    function group(title, items) {
      return '<div class="drawer-group"><h2>' + title + "</h2>" + items.map(function (n) {
        return '<a class="drawer-link' + (n.key === section ? " active" : "") + '" href="' + n.url() + '">' + icon(n.icon) + n.label + "</a>";
      }).join("") + "</div>";
    }
    return '<nav class="mobile-drawer" id="mobileDrawer" aria-label="قائمة الهاتف"><div class="container">' +
      group("الرئيسية", [{ key: "home", label: "الصفحة الرئيسية", url: R.home, icon: "home" }]) +
      group("أقسام التعلم", CW.nav.main) + group("المزيد", CW.nav.more) + group("حسابي (تجريبي)", CW.nav.account) +
      "</div></nav>";
  }

  function renderFooter() {
    var host = document.getElementById("cw-footer");
    if (!host) return;
    if (document.body.getAttribute("data-footer") === "compact") {
      host.outerHTML = '<footer class="site-footer compact"><div class="container"><div class="footer-bottom"><span>© ' + new Date().getFullYear() +
        ' <bdi>CodeWay</bdi> — واجهة تجريبية</span><nav aria-label="روابط قانونية"><a href="' + R.home() + '">الرئيسية</a><a href="' + R.info("privacy") + '">الخصوصية</a><a href="' + R.info("terms") + '">الشروط</a></nav></div></div></footer>';
      return;
    }
    var D = CW.data;
    function col(title, items) {
      return '<div><h2>' + title + '</h2><ul class="footer-links">' + items.map(function (i) { return '<li><a href="' + i[1] + '">' + i[0] + "</a></li>"; }).join("") + "</ul></div>";
    }
    host.outerHTML = '<footer class="site-footer"><div class="container"><div class="footer-grid">' +
      '<div class="footer-about"><a class="brand" href="' + R.home() + '"><img src="' + CW.asset("images/logo.svg") + '" alt="" width="36" height="36"><span class="brand-name" style="color:#fff">Code<span style="color:#67E8F9">Way</span></span></a>' +
      '<span class="slogan">طريقك نحو احتراف البرمجة</span>' +
      "<p>منصة تعليمية عربية تجمع لغات البرمجة والأدوات والمجالات والمسارات المهنية في مكان واحد، لتتعلم بخطة واضحة وتطبّق ما تعلمته في مشاريع حقيقية.</p></div>" +
      col("أقسام المنصة", [["لغات البرمجة", R.languages()], ["الأدوات والتقنيات", R.tools()], ["المجالات", R.fields()], ["المسارات المهنية", R.careers()], ["الذكاء الاصطناعي", R.ai()], ["علوم الحاسوب", R.cs()]]) +
      col("لغات شائعة", ["python", "javascript", "java", "sql", "cpp"].map(function (id) { var l = CW.find("languages", id); return [CW.bdi(l.name), R.language(id)]; })) +
      col("مسارات مقترحة", ["frontend-developer", "data-analyst", "ai-engineer", "devops-engineer", "cybersecurity-analyst"].map(function (id) { var c = CW.find("careers", id); return [esc(c.name), R.career(id)]; })) +
      col("عن CodeWay", [["من نحن", R.info("about")], ["اتصل بنا", R.info("contact")], ["المراجع والتوثيق", R.references()], ["سياسة الخصوصية", R.info("privacy")], ["شروط الاستخدام", R.info("terms")]]) +
      '</div><div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' <bdi>CodeWay</bdi>. جميع الحقوق محفوظة.</span>' +
      '<nav aria-label="روابط قانونية"><a href="' + R.info("privacy") + '">سياسة الخصوصية</a><a href="' + R.info("terms") + '">شروط الاستخدام</a><a href="' + R.info("contact") + '">اتصل بنا</a></nav></div></div></footer>' +
      '<button class="to-top" id="toTop" aria-label="العودة إلى الأعلى">' + icon("chevU") + "</button>";
  }

  /* مسار التنقل: items = [[label, url], ..., [currentLabel]] */
  CW.breadcrumb = function (items) {
    var html = items.map(function (it, i) {
      var last = i === items.length - 1;
      var label = it[2] ? it[0] : CW.bdi(it[0]);
      return (i ? '<span class="sep" aria-hidden="true">' + icon("chevL", "ic-xs") + "</span>" : "") +
        (last || !it[1] ? '<span aria-current="page">' + label + "</span>" : '<a href="' + it[1] + '">' + label + "</a>");
    }).join("");
    return '<nav class="breadcrumb" aria-label="مسار التنقل"><a href="' + R.home() + '">الرئيسية</a><span class="sep" aria-hidden="true">' + icon("chevL", "ic-xs") + "</span>" + html + "</nav>";
  };

  function initMenus() {
    var toggle = document.getElementById("menuToggle"), drawer = document.getElementById("mobileDrawer");
    if (toggle && drawer) {
      var set = function (open) {
        drawer.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open);
        toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
        toggle.innerHTML = icon(open ? "x" : "menu");
        document.body.classList.toggle("no-scroll", open);
      };
      toggle.addEventListener("click", function () { set(!drawer.classList.contains("open")); });
      drawer.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("open")) set(false); });
      window.addEventListener("resize", function () { if (window.innerWidth > 1024 && drawer.classList.contains("open")) set(false); });
    }
    /* القوائم المنسدلة */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-dropdown] > button");
      CW.$$("[data-dropdown].open").forEach(function (d) {
        if (!btn || d !== btn.parentNode) { d.classList.remove("open"); d.firstElementChild.setAttribute("aria-expanded", "false"); }
      });
      if (btn) {
        var dd = btn.parentNode, open = !dd.classList.contains("open");
        dd.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", open);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      CW.$$("[data-dropdown].open").forEach(function (d) { d.classList.remove("open"); d.firstElementChild.setAttribute("aria-expanded", "false"); d.firstElementChild.focus(); });
    });
    /* زر الصعود */
    var top = document.getElementById("toTop");
    if (top) {
      window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 800); }, { passive: true });
      top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    }
  }

  CW.initNavigation = function () {
    renderHeader();
    renderFooter();
    initMenus();
  };
})();
