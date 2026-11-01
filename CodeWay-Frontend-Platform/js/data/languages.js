/* ==========================================================
   بيانات لغات البرمجة
   - لإضافة لغة: أضف كائناً جديداً بالمعرّف (id) نفسه المستخدم في الروابط.
   - الوحدات (modules) اختيارية؛ إن لم تُحدَّد يُستخدم الهيكل الافتراضي في tracks.js
   - روابط التوثيق رسمية فقط؛ اترك docs فارغة إن لم يتوفر رابط موثوق.
   ========================================================== */
CW.data.languages = [
  {
    id: "python", name: "Python", mono: "Py", color: "#3776AB",
    tagline: "لغة سهلة القراءة ومتعددة الاستخدامات، ومدخل مثالي لعالم البرمجة.",
    level: "beginner", paradigm: "متعددة الأنماط", typing: "ديناميكية",
    uses: ["الذكاء الاصطناعي", "تحليل البيانات", "الأتمتة", "تطوير الويب"],
    prereq: ["أساسيات استخدام الحاسوب", "التفكير المنطقي"],
    docs: [{ label: "توثيق Python الرسمي", url: "https://docs.python.org/3/" }]
  },
  {
    id: "javascript", name: "JavaScript", mono: "JS", color: "#F7DF1E", fg: "#1B1B1B", ink: "#8A7300",
    tagline: "لغة الويب الأساسية لبناء صفحات تفاعلية وتطبيقات متكاملة.",
    level: "beginner", paradigm: "متعددة الأنماط", typing: "ديناميكية",
    uses: ["الواجهات الأمامية", "Node.js", "تطبيقات الويب"],
    prereq: ["أساسيات HTML و CSS"],
    docs: [{ label: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" }]
  },
  {
    id: "typescript", name: "TypeScript", mono: "TS", color: "#3178C6",
    tagline: "JavaScript مع أنواع ثابتة تجعل المشاريع الكبيرة أكثر أماناً وتنظيماً.",
    level: "intermediate", paradigm: "متعددة الأنماط", typing: "ثابتة",
    uses: ["تطبيقات الويب الكبيرة", "Angular", "الخوادم"],
    prereq: ["JavaScript"],
    docs: [{ label: "توثيق TypeScript", url: "https://www.typescriptlang.org/docs/" }]
  },
  {
    id: "java", name: "Java", mono: "Jv", color: "#E76F00",
    tagline: "لغة كائنية قوية ومستقرة تعتمد عليها المؤسسات الكبرى.",
    level: "intermediate", paradigm: "كائنية التوجه", typing: "ثابتة",
    uses: ["الأنظمة المؤسسية", "Android", "Spring Boot"],
    prereq: ["التفكير المنطقي", "أساسيات البرمجة"],
    docs: [{ label: "توثيق Java من Oracle", url: "https://docs.oracle.com/en/java/" }]
  },
  {
    id: "c", name: "C", mono: "C", color: "#5C6BC0",
    tagline: "لغة الأساسيات القريبة من العتاد لفهم الذاكرة وطريقة عمل الحاسوب.",
    level: "intermediate", paradigm: "إجرائية", typing: "ثابتة",
    uses: ["الأنظمة المضمنة", "أنظمة التشغيل", "البرمجة منخفضة المستوى"],
    prereq: ["أساسيات علوم الحاسوب"],
    docs: [{ label: "C Reference — cppreference", url: "https://en.cppreference.com/w/c" }]
  },
  {
    id: "cpp", name: "C++", mono: "C++", color: "#00599C",
    tagline: "أداء عالٍ وتحكم دقيق في الموارد للأنظمة التي تتطلب السرعة.",
    level: "advanced", paradigm: "متعددة الأنماط", typing: "ثابتة",
    uses: ["الألعاب", "المحركات الرسومية", "الأنظمة عالية الأداء"],
    prereq: ["C أو أساسيات البرمجة", "هياكل البيانات"],
    docs: [{ label: "C++ Reference — cppreference", url: "https://en.cppreference.com/w/cpp" }, { label: "isocpp.org", url: "https://isocpp.org/" }]
  },
  {
    id: "csharp", name: "C#", mono: "C#", color: "#68217A",
    tagline: "لغة حديثة من منظومة .NET لتطبيقات الويب وسطح المكتب والألعاب.",
    level: "intermediate", paradigm: "كائنية التوجه", typing: "ثابتة",
    uses: ["ASP.NET Core", "Unity", "تطبيقات Windows"],
    prereq: ["أساسيات البرمجة"],
    docs: [{ label: "توثيق C# من Microsoft", url: "https://learn.microsoft.com/en-us/dotnet/csharp/" }]
  },
  {
    id: "php", name: "PHP", mono: "php", color: "#777BB4",
    tagline: "لغة خوادم واسعة الانتشار تشغّل جزءاً كبيراً من مواقع الويب.",
    level: "beginner", paradigm: "متعددة الأنماط", typing: "ديناميكية",
    uses: ["تطوير الخوادم", "Laravel", "أنظمة إدارة المحتوى"],
    prereq: ["أساسيات HTML"],
    docs: [{ label: "توثيق PHP الرسمي", url: "https://www.php.net/docs.php" }]
  },
  {
    id: "go", name: "Go", mono: "Go", color: "#00ADD8",
    tagline: "لغة بسيطة وسريعة صُممت للخدمات السحابية والأنظمة المتزامنة.",
    level: "intermediate", paradigm: "إجرائية ومتزامنة", typing: "ثابتة",
    uses: ["الخدمات المصغرة", "أدوات DevOps", "الشبكات"],
    prereq: ["أساسيات البرمجة"],
    docs: [{ label: "توثيق Go الرسمي", url: "https://go.dev/doc/" }]
  },
  {
    id: "rust", name: "Rust", mono: "Rs", color: "#B7410E",
    tagline: "أمان في إدارة الذاكرة مع أداء عالٍ للأنظمة الحديثة.",
    level: "advanced", paradigm: "متعددة الأنماط", typing: "ثابتة",
    uses: ["برمجة الأنظمة", "WebAssembly", "الأدوات عالية الأداء"],
    prereq: ["لغة برمجة واحدة على الأقل", "مفاهيم الذاكرة"],
    docs: [{ label: "كتاب Rust الرسمي", url: "https://doc.rust-lang.org/book/" }, { label: "موارد تعلم Rust", url: "https://www.rust-lang.org/learn" }]
  },
  {
    id: "kotlin", name: "Kotlin", mono: "Kt", color: "#7F52FF",
    tagline: "لغة حديثة ومختصرة، وهي الخيار المعتمد لتطوير Android.",
    level: "intermediate", paradigm: "كائنية ووظيفية", typing: "ثابتة",
    uses: ["Android", "الخوادم", "التطبيقات متعددة المنصات"],
    prereq: ["أساسيات البرمجة"],
    docs: [{ label: "توثيق Kotlin", url: "https://kotlinlang.org/docs/home.html" }]
  },
  {
    id: "swift", name: "Swift", mono: "Sw", color: "#F05138",
    tagline: "لغة Apple الحديثة لبناء تطبيقات iOS وmacOS.",
    level: "intermediate", paradigm: "متعددة الأنماط", typing: "ثابتة",
    uses: ["iOS", "macOS", "watchOS"],
    prereq: ["أساسيات البرمجة"],
    docs: [{ label: "توثيق Swift", url: "https://www.swift.org/documentation/" }, { label: "كتاب The Swift Programming Language", url: "https://docs.swift.org/swift-book/" }]
  },
  {
    id: "dart", name: "Dart", mono: "Dt", color: "#0175C2",
    tagline: "لغة Flutter لبناء تطبيقات لعدة منصات من شيفرة واحدة.",
    level: "beginner", paradigm: "كائنية التوجه", typing: "ثابتة",
    uses: ["Flutter", "تطبيقات الهاتف", "الويب"],
    prereq: ["أساسيات البرمجة"],
    docs: [{ label: "توثيق Dart", url: "https://dart.dev/guides" }]
  },
  {
    id: "r", name: "R", mono: "R", color: "#276DC3",
    tagline: "لغة متخصصة في الإحصاء وتحليل البيانات والرسوم البيانية.",
    level: "intermediate", paradigm: "وظيفية وإحصائية", typing: "ديناميكية",
    uses: ["الإحصاء", "البحث العلمي", "تصوير البيانات"],
    prereq: ["أساسيات الإحصاء"],
    docs: [{ label: "أدلة R الرسمية (CRAN)", url: "https://cran.r-project.org/manuals.html" }],
    modules: ["مقدمة وإعداد RStudio", "المتجهات وأنواع البيانات", "إطارات البيانات", "تنظيف البيانات وتحويلها", "الإحصاء الوصفي", "الرسوم البيانية", "النمذجة الإحصائية", "مشروع تحليل بيانات"]
  },
  {
    id: "sql", name: "SQL", mono: "SQL", color: "#E38C00",
    tagline: "لغة التعامل مع قواعد البيانات العلائقية: استعلام وتحليل وإدارة.",
    level: "beginner", paradigm: "تصريحية", typing: "حسب قاعدة البيانات",
    uses: ["قواعد البيانات", "تحليل البيانات", "التقارير"],
    prereq: ["لا يوجد"],
    docs: [{ label: "توثيق SQL في PostgreSQL", url: "https://www.postgresql.org/docs/current/sql.html" }],
    modules: ["مقدمة في قواعد البيانات", "الاستعلامات الأساسية SELECT", "التصفية والترتيب", "الدوال التجميعية", "الربط بين الجداول JOIN", "الاستعلامات الفرعية", "تعديل البيانات وإنشاء الجداول", "مشروع قاعدة بيانات"]
  },
  {
    id: "ruby", name: "Ruby", mono: "Rb", color: "#CC342D",
    tagline: "لغة أنيقة تركّز على سعادة المبرمج وسرعة الإنجاز.",
    level: "beginner", paradigm: "كائنية التوجه", typing: "ديناميكية",
    uses: ["Ruby on Rails", "النماذج الأولية", "الأتمتة"],
    prereq: ["أساسيات البرمجة"],
    docs: [{ label: "توثيق Ruby", url: "https://www.ruby-lang.org/en/documentation/" }]
  }
];

/* الهيكل الافتراضي لوحدات أي لغة برمجة (عناوين تنظيمية فقط) */
CW.data.defaultLanguageModules = [
  "مقدمة وإعداد بيئة العمل",
  "الأساسيات والمتغيرات وأنواع البيانات",
  "التحكم في التدفق والحلقات",
  "الدوال وتنظيم الشيفرة",
  "هياكل البيانات المدمجة",
  "البرمجة الكائنية",
  "الملفات والأخطاء والمكتبات",
  "مشروع تطبيقي ختامي"
];
