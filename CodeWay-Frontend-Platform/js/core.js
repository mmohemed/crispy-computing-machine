/* ==========================================================
   CodeWay — النواة: مساحة الأسماء، الأدوات المساعدة، الأيقونات، الروابط
   يُحمَّل هذا الملف أولاً في كل صفحة.
   ========================================================== */
(function () {
  "use strict";
  var CW = (window.CW = window.CW || {});
  CW.data = CW.data || {};
  CW.pages = CW.pages || {};

  /* المسار الجذري للمشروع، يُحدَّد في وسم <html data-root="../../"> */
  CW.root = document.documentElement.getAttribute("data-root") || "./";
  CW.url = function (path) { return CW.root + path; };
  CW.asset = function (path) { return CW.root + "assets/" + path; };

  /* ---------- أدوات DOM ---------- */
  CW.$ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  CW.$$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  CW.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  /* عزل اتجاه النص: النص اللاتيني الخالص يُعرض LTR، والنص المختلط يبقى RTL
     مع عزل الكلمات اللاتينية داخله حتى لا تنقلب الرموز مثل C++ و C# */
  CW.bdi = function (s) {
    var e = CW.esc(s);
    if (!/[\u0600-\u06FF]/.test(e)) return '<bdi dir="ltr">' + e + "</bdi>";
    return '<bdi dir="rtl">' + e.replace(/[A-Za-z.][A-Za-z0-9.+#\/-]*(?:\s+[A-Za-z0-9.+#\/-]+)*/g, function (w) { return "<bdi>" + w + "</bdi>"; }) + "</bdi>";
  };
  CW.qs = function (name) { return new URLSearchParams(location.search).get(name); };
  CW.qsInt = function (name, def) { var v = parseInt(CW.qs(name), 10); return isNaN(v) ? def : v; };
  CW.html = function (el, markup) { if (el) el.innerHTML = markup; return el; };
  CW.setTitle = function (t) { document.title = t + " | CodeWay"; };

  /* البحث عن عنصر بالمعرّف داخل مجموعة بيانات */
  CW.find = function (collection, id) {
    var list = CW.data[collection] || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };
  CW.findMany = function (collection, ids) {
    return (ids || []).map(function (id) { return CW.find(collection, id); }).filter(Boolean);
  };
  CW.unique = function (arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }); };

  /* تطبيع النص العربي للبحث */
  CW.norm = function (s) {
    return String(s || "").toLowerCase()
      .replace(/<[^>]+>/g, "")
      .replace(/[ً-ْـ]/g, "")
      .replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي")
      .replace(/\s+/g, " ").trim();
  };

  /* صيغ العدد بالعربية: (3، "درس"، "دروس"، "درساً") */
  CW.plural = function (n, one, few, many) {
    if (n === 0) return "لا يوجد " + few;
    if (n === 1) return one + " واحد";
    if (n === 2) return one + "ان";
    if (n <= 10) return n + " " + few;
    return n + " " + (many || one);
  };

  /* ---------- التخزين المحلي الآمن ---------- */
  CW.store = {
    get: function (key, def) {
      try { var v = localStorage.getItem("codeway:" + key); return v == null ? def : JSON.parse(v); } catch (e) { return def; }
    },
    set: function (key, val) {
      try { localStorage.setItem("codeway:" + key, JSON.stringify(val)); return true; } catch (e) { return false; }
    }
  };
  CW.session = {
    get: function (key, def) {
      try { var v = sessionStorage.getItem("codeway:" + key); return v == null ? def : JSON.parse(v); } catch (e) { return def; }
    },
    set: function (key, val) {
      try { sessionStorage.setItem("codeway:" + key, JSON.stringify(val)); } catch (e) { /* تجاهل */ }
    }
  };

  /* ---------- المستويات ---------- */
  CW.levels = {
    beginner: { name: "مبتدئ", cls: "lv-beginner", order: 1 },
    intermediate: { name: "متوسط", cls: "lv-intermediate", order: 2 },
    advanced: { name: "متقدم", cls: "lv-advanced", order: 3 },
    professional: { name: "احترافي", cls: "lv-professional", order: 4 }
  };
  CW.levelBadge = function (lv) {
    var l = CW.levels[lv] || CW.levels.beginner;
    return '<span class="badge badge-dot ' + l.cls + '">' + l.name + "</span>";
  };

  /* ---------- الروابط بين الصفحات ---------- */
  function p(path, params) {
    var q = [];
    Object.keys(params || {}).forEach(function (k) {
      if (params[k] !== undefined && params[k] !== null && params[k] !== "") q.push(k + "=" + encodeURIComponent(params[k]));
    });
    return CW.url(path) + (q.length ? "?" + q.join("&") : "");
  }
  CW.link = p;
  CW.routes = {
    home: function () { return CW.url("index.html"); },
    explore: function (params) { return p("pages/explore/index.html", params); },

    languages: function () { return p("pages/languages/index.html"); },
    language: function (id) { return p("pages/languages/language.html", { id: id }); },
    langModules: function (id) { return p("pages/languages/modules.html", { id: id }); },
    langLessons: function (id, m) { return p("pages/languages/lessons.html", { id: id, m: m || 1 }); },
    langProjects: function (id) { return p("pages/languages/projects.html", { id: id }); },
    langPractice: function (id) { return p("pages/languages/practice.html", { id: id }); },

    tools: function (cat) { return p("pages/tools/index.html", { cat: cat }); },
    tool: function (id, m) { return p("pages/tools/tool.html", { id: id, m: m }); },

    fields: function () { return p("pages/fields/index.html"); },
    field: function (id) { return p("pages/fields/field.html", { id: id }); },

    careers: function () { return p("pages/career-paths/index.html"); },
    career: function (id) { return p("pages/career-paths/path.html", { id: id }); },

    ai: function () { return p("pages/artificial-intelligence/index.html"); },
    aiArea: function (id) { return p("pages/artificial-intelligence/area.html", { id: id }); },
    aiTopics: function (id) { return p("pages/artificial-intelligence/topics.html", { id: id }); },
    aiLessons: function (id, m) { return p("pages/artificial-intelligence/lessons.html", { id: id, m: m }); },
    aiTools: function (id) { return p("pages/artificial-intelligence/tools.html", { id: id }); },
    aiProjects: function (id) { return p("pages/artificial-intelligence/projects.html", { id: id }); },
    aiPaths: function (id) { return p("pages/artificial-intelligence/learning-paths.html", { id: id }); },

    cs: function () { return p("pages/computer-science/index.html"); },
    csTopic: function (id) { return p("pages/computer-science/topic.html", { id: id }); },

    projects: function (params) { return p("pages/projects/index.html", params); },
    projectCategories: function () { return p("pages/projects/categories.html"); },
    project: function (id) { return p("pages/projects/project.html", { id: id }); },

    lesson: function (track, id, m, l) { return p("pages/lessons/lesson.html", { track: track, id: id, m: m || 1, l: l || 1 }); },

    quizzes: function (params) { return p("pages/quizzes/index.html", params); },
    quiz: function (id) { return p("pages/quizzes/quiz.html", { id: id }); },
    question: function (id, n) { return p("pages/quizzes/question.html", { id: id, q: n || 1 }); },
    quizResult: function (id) { return p("pages/quizzes/result.html", { id: id }); },

    exercises: function (params) { return p("pages/exercises/index.html", params); },
    exercise: function (id) { return p("pages/exercises/exercise.html", { id: id }); },
    exerciseResult: function (id) { return p("pages/exercises/result.html", { id: id }); },

    editor: function (lang) { return p("pages/code-editor/index.html", { lang: lang }); },

    dashboard: function () { return p("pages/dashboard/index.html"); },
    dashLearning: function () { return p("pages/dashboard/learning.html"); },
    dashProjects: function () { return p("pages/dashboard/projects.html"); },
    dashQuizzes: function () { return p("pages/dashboard/quizzes.html"); },
    dashAchievements: function () { return p("pages/dashboard/achievements.html"); },

    profile: function (tab) { return p("pages/profile/index.html", { tab: tab }); },
    references: function (cat) { return p("pages/references/index.html", { cat: cat }); },

    admin: function () { return p("pages/admin/index.html"); },
    adminManage: function (entity) { return p("pages/admin/manage.html", { entity: entity }); },

    info: function (id) { return p("pages/info/" + id + ".html"); }
  };

  /* ---------- الأيقونات (مجموعة خطية موحدة 24×24) ---------- */
  CW.ICONS = {
    home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrowL: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevL: '<path d="m15 6-6 6 6 6"/>',
    chevR: '<path d="m9 6 6 6-6 6"/>',
    chevD: '<path d="m6 9 6 6 6-6"/>',
    chevU: '<path d="m6 15 6-6 6 6"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    terminal: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m6 9 3 3-3 3M12 15h5"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    server: '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7l10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
    brain: '<path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z"/><path d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3 3 3 0 0 1-3-3"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    network: '<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="m6.7 7.2 3.6 3.6M6.7 16.8l3.6-3.6M13.7 10.8l3.6-3.6M13.7 13.2l3.6 3.6"/>',
    chart: '<path d="M3 3v18h18"/><path d="M8 17v-5M13 17V8M18 17v-9"/>',
    pie: '<path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    pipeline: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4.5A2.5 2.5 0 0 1 17 9v5"/><path d="M7 10v4.5A2.5 2.5 0 0 0 9.5 17H14"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    shieldCheck: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    infinity: '<path d="M12 12c-2-2.7-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.3 6-4zm0 0c2 2.7 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.3-6 4z"/>',
    cloud: '<path d="M17.5 19H7a5 5 0 1 1 1-9.9A6 6 0 0 1 19.5 11 4 4 0 0 1 17.5 19z"/>',
    gamepad: '<rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6.5 12h4M8.5 10v4M15 11h.01M18 13h.01"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    wifi: '<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0"/><path d="M12 20h.01"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9.5 4h5"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/><path d="M2 13v3M22 13v3"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
    sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 3v4M17 5h4M5 17v4M3 19h4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    play: '<path d="m7 4 13 8-13 8z"/>',
    playCircle: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    rocket: '<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9-.8-.8-2.1-.8-2.9-.1z"/><path d="M12 15l-3-3a22 22 0 0 1 2-4A13 13 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 3-10.5 5.8"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
    calculator: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h.01M12 18h.01"/>',
    list: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/>',
    listPlain: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    wallet: '<path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15v13H5a2 2 0 0 1-2-2V5"/><path d="M16 13.5h.01"/>',
    package: '<path d="m12 2 9 5v10l-9 5-9-5V7z"/><path d="m3 7 9 5 9-5M12 12v10"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="1.5"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>',
    star: '<path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21.1l1.4-7L2 9.3l7-.8z"/>',
    map: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h8.5"/>',
    flask: '<path d="M9 3h6M10 3v6L4 19a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7 15h10"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
    tree: '<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-3h14v3"/>',
    gauge: '<path d="m12 14 4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
    bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
    clipboard: '<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v4H9zM9 14l2 2 4-4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    xCircle: '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-4-6.3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    fileCode: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M10 13l-2 2 2 2M14 13l2 2-2 2"/>',
    edit: '<path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.4 1.4 1.4 2.8 2.5 2.8z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    sidebar: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/>',
    flag: '<path d="M4 22V4a1 1 0 0 1 1-1h12l-2 4 2 4H5"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    graduation: '<path d="m22 10-10-5-10 5 10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5M22 10v6"/>',
    puzzle: '<path d="M14 4a2 2 0 1 0-4 0v2H6a1 1 0 0 0-1 1v4h2a2 2 0 1 1 0 4H5v4a1 1 0 0 0 1 1h4v-2a2 2 0 1 1 4 0v2h4a1 1 0 0 0 1-1v-4h-2a2 2 0 1 1 0-4h2V7a1 1 0 0 0-1-1h-4z"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>'
  };
  CW.icon = function (name, cls) {
    return '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (CW.ICONS[name] || CW.ICONS.code) + "</svg>";
  };

  /* رمز اللغة/الأداة بلونها */
  CW.mono = function (item, cls) {
    if (!item) return "";
    return '<span class="mono ' + (cls || "") + '" style="--brand:' + (item.color || "#2563EB") + ";--brand-fg:" + (item.fg || "#fff") + '" aria-hidden="true">' + CW.esc(item.mono || item.name.slice(0, 2)) + "</span>";
  };

  document.documentElement.classList.add("js");
})();
