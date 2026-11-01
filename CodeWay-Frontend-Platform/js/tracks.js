/* ==========================================================
   CodeWay — هياكل المسارات التعليمية والعلاقات بين البيانات
   - CW.track(type, id): يعيد هيكل الوحدات والدروس لأي لغة/أداة/موضوع
   - CW.rel: علاقات مستنتجة (المسارات المرتبطة بلغة، المشاريع المرتبطة بأداة...)
   - CW.buildRoadmap(career): يبني مراحل خارطة التعلم لمسار مهني
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data;

  /* عناوين الدروس داخل كل وحدة: قوالب تنظيمية يُستبدل بها المحتوى الحقيقي لاحقاً */
  CW.lessonSlots = ["مدخل إلى الوحدة", "المفاهيم الأساسية", "أمثلة تطبيقية", "تدريب ومراجعة"];

  CW.trackTypes = {
    lang: { label: "لغة برمجة", collection: "languages", section: "لغات البرمجة", sectionUrl: function () { return CW.routes.languages(); } },
    tool: { label: "أداة وتقنية", collection: "tools", section: "الأدوات والتقنيات", sectionUrl: function () { return CW.routes.tools(); } },
    cs: { label: "علوم الحاسوب", collection: "csTopics", section: "علوم الحاسوب", sectionUrl: function () { return CW.routes.cs(); } },
    ai: { label: "الذكاء الاصطناعي", collection: "aiAreas", section: "الذكاء الاصطناعي", sectionUrl: function () { return CW.routes.ai(); } }
  };

  CW.track = function (type, id) {
    var t = CW.trackTypes[type];
    if (!t) return null;
    var item = CW.find(t.collection, id);
    if (!item) return null;
    var titles, overview, lessonsUrl;
    if (type === "lang") {
      titles = item.modules || D.defaultLanguageModules;
      overview = CW.routes.language(id);
      lessonsUrl = function (m) { return CW.routes.langLessons(id, m); };
    } else if (type === "tool") {
      titles = item.topics || (CW.find("toolCategories", item.cat) || {}).topics || [];
      overview = CW.routes.tool(id);
      lessonsUrl = function (m) { return CW.routes.tool(id, m); };
    } else if (type === "cs") {
      titles = item.units;
      overview = CW.routes.csTopic(id);
      lessonsUrl = function (m) { return CW.routes.csTopic(id) + "#unit-" + m; };
    } else {
      titles = item.topics;
      overview = CW.routes.aiArea(id);
      lessonsUrl = function (m) { return CW.routes.aiLessons(id, m); };
    }
    var modules = titles.map(function (title, i) {
      return {
        n: i + 1, title: title,
        lessons: CW.lessonSlots.map(function (s, j) { return { n: j + 1, title: s }; })
      };
    });
    return {
      type: type, id: id, item: item, name: item.name, label: t.label,
      color: item.color || "#2563EB", overview: overview, section: t.section, sectionUrl: t.sectionUrl(),
      modules: modules, lessonsUrl: lessonsUrl,
      lessonCount: modules.length * CW.lessonSlots.length,
      lessonUrl: function (m, l) { return CW.routes.lesson(type, id, m, l); }
    };
  };

  /* ---------- العلاقات المستنتجة ---------- */
  function has(arr, id) { return (arr || []).indexOf(id) > -1; }
  CW.rel = {
    careersWith: function (key, id) { return D.careers.filter(function (c) { return has(c[key], id); }); },
    fieldsWith: function (key, id) { return D.fields.filter(function (f) { return has(f[key], id); }); },
    projectsWith: function (key, id) { return D.projects.filter(function (p) { return has(p[key], id); }); },
    aiAreasWithTool: function (id) { return D.aiAreas.filter(function (a) { return has(a.tools, id); }); },
    quizzesFor: function (type, id) { return D.quizzes.filter(function (q) { return q.track.type === type && q.track.id === id; }); },
    exercisesFor: function (type, id) { return D.exercises.filter(function (q) { return q.track.type === type && q.track.id === id; }); }
  };

  /* ---------- خارطة التعلم للمسار المهني ---------- */
  CW.buildRoadmap = function (c) {
    if (c.stages) return c.stages;
    var langs = CW.findMany("languages", c.langs);
    var tools = CW.findMany("tools", c.tools);
    var fields = CW.findMany("fields", c.fields);
    var cs = CW.findMany("csTopics", c.cs);
    var projects = CW.rel.projectsWith("careers", c.id);
    var basic = projects.filter(function (p) { return p.level === "beginner" || p.level === "intermediate"; });
    var adv = projects.filter(function (p) { return p.level === "advanced" || p.level === "professional"; });
    var s = c.skills;

    function nodeOf(kind, it) {
      var url = kind === "lang" ? CW.routes.language(it.id) : kind === "tool" ? CW.routes.tool(it.id) :
        kind === "cs" ? CW.routes.csTopic(it.id) : kind === "field" ? CW.routes.field(it.id) : CW.routes.project(it.id);
      return { kind: kind, item: it, label: it.name, url: url };
    }

    return [
      { n: 1, icon: "compass", title: "الأساسيات والتهيئة",
        desc: "بناء الأساس المعرفي اللازم قبل الدخول في التخصص.",
        skills: ["التفكير المنطقي وحل المشكلات"].concat(cs.map(function (x) { return x.name; })).slice(0, 4),
        nodes: cs.map(function (x) { return nodeOf("cs", x); }),
        lessons: cs.slice(0, 2).map(function (x) { return { label: x.name + " — الوحدة الأولى", url: CW.routes.lesson("cs", x.id, 1, 1) }; }) },
      { n: 2, icon: "code", title: "اللغة الأساسية",
        desc: "إتقان لغة البرمجة الرئيسية المستخدمة في هذا المسار.",
        skills: s.slice(0, 2),
        nodes: langs.map(function (x) { return nodeOf("lang", x); }),
        lessons: langs.slice(0, 2).map(function (x) { return { label: x.name + " — الوحدة الأولى", url: CW.routes.lesson("lang", x.id, 1, 1) }; }) },
      { n: 3, icon: "wrench", title: "الأدوات والتقنيات",
        desc: "التعرف على الأدوات والأطر التي يستخدمها المحترفون يومياً.",
        skills: s.slice(2, 4),
        nodes: tools.map(function (x) { return nodeOf("tool", x); }),
        lessons: tools.slice(0, 2).map(function (x) { return { label: x.name + " — الوحدة الأولى", url: CW.routes.lesson("tool", x.id, 1, 1) }; }) },
      { n: 4, icon: "layers", title: "التخصص والتطبيق",
        desc: "تعميق المعرفة في مجال التخصص وتطبيقها في مشاريع متوسطة.",
        skills: s.slice(4),
        nodes: fields.map(function (x) { return nodeOf("field", x); }).concat(basic.map(function (x) { return nodeOf("project", x); })),
        lessons: [] },
      { n: 5, icon: "rocket", title: "المشاريع والاحتراف",
        desc: "مشاريع متقدمة وبناء معرض أعمال والاستعداد لسوق العمل.",
        skills: ["بناء معرض أعمال", "العمل على مستودعات حقيقية", "التحضير للمقابلات التقنية"],
        nodes: adv.map(function (x) { return nodeOf("project", x); }),
        lessons: [] }
    ];
  };
})();
