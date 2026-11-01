/* ==========================================================
   بيانات الأدوات والمكتبات والأطر والتقنيات
   - التصنيف (cat) يحدد قالب الموضوعات الافتراضي في toolCategories
   - يمكن تخصيص موضوعات أداة بعينها عبر الحقل topics
   ========================================================== */
CW.data.toolCategories = [
  { id: "dev", name: "أدوات التطوير", icon: "wrench", color: "#2563EB",
    desc: "الأدوات اليومية لكتابة الشيفرة وإدارتها وتشغيلها.",
    topics: ["التثبيت والإعداد", "الواجهة والأوامر الأساسية", "سير العمل اليومي", "مزايا متقدمة", "أفضل الممارسات"] },
  { id: "web", name: "تطوير الويب", icon: "globe", color: "#0891B2",
    desc: "مكتبات وأطر الواجهات الأمامية والخلفية لبناء تطبيقات الويب.",
    topics: ["التثبيت وإنشاء المشروع", "المفاهيم الأساسية", "بنية التطبيق والتوجيه", "التعامل مع البيانات", "الاختبار والنشر"] },
  { id: "ai", name: "الذكاء الاصطناعي وتعلم الآلة", short: "الذكاء الاصطناعي", icon: "sparkles", color: "#7C3AED",
    desc: "مكتبات معالجة البيانات وبناء النماذج وتدريبها ونشرها.",
    topics: ["التثبيت وتجهيز البيئة", "هياكل البيانات الأساسية", "سير عمل نموذجي", "التقييم والتحسين", "مشروع تطبيقي"] },
  { id: "db", name: "قواعد البيانات", icon: "database", color: "#16A34A",
    desc: "أنظمة تخزين البيانات العلائقية وغير العلائقية والتخزين المؤقت.",
    topics: ["التثبيت والاتصال", "النمذجة والجداول", "الاستعلامات", "الفهرسة والأداء", "النسخ الاحتياطي والأمان"] },
  { id: "data", name: "تحليل البيانات وهندسة البيانات", short: "البيانات", icon: "chart", color: "#D97706",
    desc: "أدوات التحليل والتصوير وبناء خطوط معالجة البيانات.",
    topics: ["الإعداد والاتصال بالمصادر", "تجهيز البيانات", "التحليل والتحويل", "التصوير والجدولة", "النشر والمشاركة"] },
  { id: "devops", name: "DevOps والبنية التحتية", short: "DevOps", icon: "infinity", color: "#DB2777",
    desc: "أتمتة البناء والنشر وإدارة البنية التحتية ومراقبتها.",
    topics: ["المفاهيم والتثبيت", "الإعداد الأساسي", "الأتمتة وسير العمل", "المراقبة والتوسع", "أفضل الممارسات"] }
];

CW.data.tools = [
  /* أدوات التطوير */
  { id: "vscode", cat: "dev", name: "Visual Studio Code", mono: "VS", color: "#0078D4", tagline: "محرر شيفرة خفيف وقابل للتوسعة بالإضافات.", uses: ["كتابة الشيفرة", "تصحيح الأخطاء", "التكامل مع Git"], prereq: ["لا يوجد"], docs: "https://code.visualstudio.com/docs" },
  { id: "git", cat: "dev", name: "Git", mono: "Git", color: "#F05032", tagline: "نظام التحكم في الإصدارات وتتبع تغييرات الشيفرة.", uses: ["تتبع التغييرات", "الفروع والدمج", "العمل الجماعي"], prereq: ["أساسيات سطر الأوامر"], docs: "https://git-scm.com/doc" },
  { id: "github", cat: "dev", name: "GitHub", mono: "GH", color: "#181717", tagline: "منصة استضافة المستودعات والتعاون على المشاريع.", uses: ["استضافة المستودعات", "طلبات الدمج", "معرض الأعمال"], prereq: ["Git"], docs: "https://docs.github.com" },
  { id: "docker", cat: "dev", name: "Docker", mono: "Dk", color: "#2496ED", tagline: "تشغيل التطبيقات داخل حاويات معزولة وقابلة للنقل.", uses: ["توحيد بيئات التطوير", "نشر التطبيقات", "الخدمات المصغرة"], prereq: ["Linux", "سطر الأوامر"], docs: "https://docs.docker.com" },
  { id: "linux", cat: "dev", name: "Linux", mono: "Lx", color: "#333333", tagline: "نظام التشغيل الأساسي للخوادم وبيئات التطوير.", uses: ["إدارة الخوادم", "سطر الأوامر", "الأتمتة بالسكربتات"], prereq: ["لا يوجد"], docs: "https://www.kernel.org/doc/html/latest/" },
  { id: "postman", cat: "dev", name: "Postman", mono: "Pm", color: "#FF6C37", tagline: "اختبار واجهات API وتوثيقها ومشاركتها.", uses: ["اختبار الطلبات", "مجموعات API", "التوثيق"], prereq: ["مفاهيم HTTP"], docs: "https://learning.postman.com/docs/" },
  { id: "jupyter", cat: "dev", name: "Jupyter", mono: "Jp", color: "#F37626", tagline: "دفاتر تفاعلية لتجارب البيانات والتعلم الآلي.", uses: ["استكشاف البيانات", "التجارب السريعة", "التوثيق التفاعلي"], prereq: ["Python"], docs: "https://docs.jupyter.org" },

  /* تطوير الويب */
  { id: "react", cat: "web", name: "React", mono: "Re", color: "#61DAFB", fg: "#0F172A", tagline: "مكتبة لبناء واجهات المستخدم من مكونات قابلة لإعادة الاستخدام.", uses: ["تطبيقات الصفحة الواحدة", "واجهات تفاعلية", "لوحات التحكم"], prereq: ["JavaScript", "HTML و CSS"], docs: "https://react.dev" },
  { id: "vue", cat: "web", name: "Vue.js", mono: "Vu", color: "#42B883", tagline: "إطار تدريجي سهل التعلم لبناء الواجهات.", uses: ["الواجهات التفاعلية", "التطبيقات الصغيرة والمتوسطة"], prereq: ["JavaScript"], docs: "https://vuejs.org/guide/" },
  { id: "angular", cat: "web", name: "Angular", mono: "Ng", color: "#DD0031", tagline: "إطار متكامل لتطبيقات الويب المؤسسية الكبيرة.", uses: ["التطبيقات المؤسسية", "النماذج المعقدة"], prereq: ["TypeScript"], docs: "https://angular.dev" },
  { id: "nextjs", cat: "web", name: "Next.js", mono: "Nx", color: "#111111", tagline: "إطار React للإنتاج مع العرض من الخادم.", uses: ["مواقع سريعة", "تحسين محركات البحث", "تطبيقات Full-Stack"], prereq: ["React"], docs: "https://nextjs.org/docs" },
  { id: "nodejs", cat: "web", name: "Node.js", mono: "Nd", color: "#5FA04E", tagline: "بيئة تشغيل JavaScript على الخادم.", uses: ["الخوادم وواجهات API", "أدوات سطر الأوامر"], prereq: ["JavaScript"], docs: "https://nodejs.org/docs/latest/api/" },
  { id: "express", cat: "web", name: "Express.js", mono: "Ex", color: "#353535", tagline: "إطار خفيف لبناء الخوادم وواجهات API.", uses: ["واجهات REST", "الخوادم الخفيفة"], prereq: ["Node.js"], docs: "https://expressjs.com" },
  { id: "nestjs", cat: "web", name: "NestJS", mono: "Ns", color: "#E0234E", tagline: "إطار منظم لتطبيقات الخادم باستخدام TypeScript.", uses: ["الخوادم المؤسسية", "الخدمات المصغرة"], prereq: ["TypeScript", "Node.js"], docs: "https://docs.nestjs.com" },
  { id: "django", cat: "web", name: "Django", mono: "Dj", color: "#0C4B33", tagline: "إطار Python متكامل لتطبيقات الويب.", uses: ["تطبيقات الويب المتكاملة", "لوحات الإدارة"], prereq: ["Python"], docs: "https://docs.djangoproject.com" },
  { id: "fastapi", cat: "web", name: "FastAPI", mono: "Fa", color: "#009688", tagline: "بناء واجهات API سريعة بلغة Python.", uses: ["واجهات REST", "خدمات النماذج الذكية"], prereq: ["Python"], docs: "https://fastapi.tiangolo.com" },
  { id: "flask", cat: "web", name: "Flask", mono: "Fl", color: "#3B3B3B", tagline: "إطار Python مصغّر ومرن.", uses: ["التطبيقات الصغيرة", "واجهات API بسيطة"], prereq: ["Python"], docs: "https://flask.palletsprojects.com" },
  { id: "laravel", cat: "web", name: "Laravel", mono: "Lv", color: "#FF2D20", tagline: "إطار PHP أنيق لتطبيقات الويب.", uses: ["تطبيقات الويب", "واجهات API"], prereq: ["PHP"], docs: "https://laravel.com/docs" },
  { id: "spring-boot", cat: "web", name: "Spring Boot", mono: "Sb", color: "#6DB33F", tagline: "بناء تطبيقات Java المؤسسية بسرعة.", uses: ["الأنظمة المؤسسية", "الخدمات المصغرة"], prereq: ["Java"], docs: "https://docs.spring.io/spring-boot/" },
  { id: "aspnet-core", cat: "web", name: "ASP.NET Core", mono: ".N", color: "#512BD4", tagline: "إطار .NET لتطبيقات الويب وواجهات API.", uses: ["تطبيقات الويب", "واجهات API"], prereq: ["C#"], docs: "https://learn.microsoft.com/en-us/aspnet/core/" },
  { id: "vite", cat: "web", name: "Vite", mono: "Vt", color: "#646CFF", tagline: "أداة بناء وتطوير فائقة السرعة للواجهات.", uses: ["إعداد المشاريع", "البناء للإنتاج"], prereq: ["JavaScript"], docs: "https://vite.dev/guide/" },
  { id: "tailwind", cat: "web", name: "Tailwind CSS", mono: "Tw", color: "#06B6D4", tagline: "إطار CSS قائم على الأصناف المساعدة.", uses: ["تصميم الواجهات", "أنظمة التصميم"], prereq: ["CSS"], docs: "https://tailwindcss.com/docs" },

  /* الذكاء الاصطناعي */
  { id: "numpy", cat: "ai", name: "NumPy", mono: "Np", color: "#4D77CF", tagline: "الحوسبة العددية والمصفوفات متعددة الأبعاد.", uses: ["العمليات الرياضية", "معالجة المصفوفات"], prereq: ["Python"], docs: "https://numpy.org/doc/" },
  { id: "pandas", cat: "ai", name: "Pandas", mono: "Pd", color: "#150458", tagline: "معالجة البيانات الجدولية وتحليلها.", uses: ["تنظيف البيانات", "التحليل الاستكشافي"], prereq: ["Python", "NumPy"], docs: "https://pandas.pydata.org/docs/" },
  { id: "scikit-learn", cat: "ai", name: "Scikit-learn", mono: "Sk", color: "#F7931E", tagline: "خوارزميات تعلم الآلة الكلاسيكية.", uses: ["التصنيف", "الانحدار", "التجميع"], prereq: ["Python", "Pandas"], docs: "https://scikit-learn.org/stable/" },
  { id: "pytorch", cat: "ai", name: "PyTorch", mono: "Pt", color: "#EE4C2C", tagline: "إطار مرن للتعلم العميق والبحث.", uses: ["الشبكات العصبية", "الرؤية الحاسوبية", "معالجة اللغة"], prereq: ["Python", "NumPy"], docs: "https://pytorch.org/docs/stable/" },
  { id: "tensorflow", cat: "ai", name: "TensorFlow", mono: "Tf", color: "#FF6F00", tagline: "منصة شاملة لبناء النماذج ونشرها.", uses: ["التعلم العميق", "نشر النماذج"], prereq: ["Python", "NumPy"], docs: "https://www.tensorflow.org/api_docs" },
  { id: "opencv", cat: "ai", name: "OpenCV", mono: "Cv", color: "#5C3EE8", tagline: "مكتبة معالجة الصور والرؤية الحاسوبية.", uses: ["معالجة الصور", "كشف الكائنات"], prereq: ["Python أو C++"], docs: "https://docs.opencv.org" },
  { id: "hugging-face", cat: "ai", name: "Hugging Face", mono: "HF", color: "#FFD21E", fg: "#0F172A", tagline: "منظومة نماذج جاهزة للغة والرؤية والتوليد.", uses: ["النماذج اللغوية", "الضبط الدقيق", "مشاركة النماذج"], prereq: ["Python", "PyTorch"], docs: "https://huggingface.co/docs" },
  { id: "xgboost", cat: "ai", name: "XGBoost", mono: "Xg", color: "#1A73B8", tagline: "خوارزميات التعزيز المتدرج عالية الدقة.", uses: ["البيانات الجدولية", "المسابقات"], prereq: ["Scikit-learn"], docs: "https://xgboost.readthedocs.io" },
  { id: "mlflow", cat: "ai", name: "MLflow", mono: "Mf", color: "#0194E2", tagline: "تتبع التجارب وإدارة دورة حياة النماذج.", uses: ["تتبع التجارب", "سجل النماذج"], prereq: ["Python", "تعلم الآلة"], docs: "https://mlflow.org/docs/latest/" },

  /* قواعد البيانات */
  { id: "postgresql", cat: "db", name: "PostgreSQL", mono: "Pg", color: "#336791", tagline: "قاعدة بيانات علائقية متقدمة ومفتوحة المصدر.", uses: ["تطبيقات الويب", "البيانات المعقدة"], prereq: ["SQL"], docs: "https://www.postgresql.org/docs/" },
  { id: "mysql", cat: "db", name: "MySQL", mono: "My", color: "#00758F", tagline: "قاعدة بيانات علائقية شائعة في الويب.", uses: ["مواقع الويب", "التطبيقات الصغيرة والمتوسطة"], prereq: ["SQL"], docs: "https://dev.mysql.com/doc/" },
  { id: "sql-server", cat: "db", name: "SQL Server", mono: "SS", color: "#CC2927", tagline: "قاعدة بيانات Microsoft للمؤسسات.", uses: ["الأنظمة المؤسسية", "ذكاء الأعمال"], prereq: ["SQL"], docs: "https://learn.microsoft.com/en-us/sql/sql-server/" },
  { id: "mongodb", cat: "db", name: "MongoDB", mono: "Mg", color: "#47A248", tagline: "قاعدة بيانات مستندات NoSQL مرنة.", uses: ["البيانات المرنة", "تطبيقات الويب الحديثة"], prereq: ["JavaScript أو Python"], docs: "https://www.mongodb.com/docs/" },
  { id: "redis", cat: "db", name: "Redis", mono: "Rd", color: "#DC382D", tagline: "تخزين مؤقت سريع داخل الذاكرة.", uses: ["التخزين المؤقت", "الجلسات", "الطوابير"], prereq: ["أساسيات الخوادم"], docs: "https://redis.io/docs/" },
  { id: "sqlite", cat: "db", name: "SQLite", mono: "Sl", color: "#003B57", tagline: "قاعدة بيانات خفيفة مدمجة في ملف واحد.", uses: ["التطبيقات المحلية", "النماذج الأولية"], prereq: ["SQL"], docs: "https://www.sqlite.org/docs.html" },

  /* البيانات */
  { id: "power-bi", cat: "data", name: "Power BI", mono: "BI", color: "#F2C811", fg: "#0F172A", tagline: "لوحات معلومات وتقارير تفاعلية.", uses: ["لوحات المؤشرات", "التقارير الإدارية"], prereq: ["Excel", "أساسيات البيانات"], docs: "https://learn.microsoft.com/en-us/power-bi/" },
  { id: "tableau", cat: "data", name: "Tableau", mono: "Tb", color: "#E97627", tagline: "تصوير البيانات واستكشافها بصرياً.", uses: ["التصوير البصري", "القصص البيانية"], prereq: ["أساسيات البيانات"], docs: "https://help.tableau.com" },
  { id: "spark", cat: "data", name: "Apache Spark", mono: "Sp", color: "#E25A1C", tagline: "معالجة البيانات الضخمة بشكل موزع.", uses: ["البيانات الضخمة", "المعالجة الدفعية"], prereq: ["Python أو Scala", "SQL"], docs: "https://spark.apache.org/docs/latest/" },
  { id: "airflow", cat: "data", name: "Apache Airflow", mono: "Af", color: "#017CEE", tagline: "جدولة خطوط البيانات وإدارتها.", uses: ["جدولة المهام", "خطوط ETL"], prereq: ["Python"], docs: "https://airflow.apache.org/docs/" },
  { id: "kafka", cat: "data", name: "Apache Kafka", mono: "Kf", color: "#231F20", tagline: "بث البيانات والأحداث لحظياً.", uses: ["البث اللحظي", "الأنظمة الموزعة"], prereq: ["أساسيات الأنظمة الموزعة"], docs: "https://kafka.apache.org/documentation/" },
  { id: "dbt", cat: "data", name: "dbt", mono: "dbt", color: "#FF694B", tagline: "تحويل البيانات داخل المستودع باستخدام SQL.", uses: ["نمذجة البيانات", "اختبار جودة البيانات"], prereq: ["SQL"], docs: "https://docs.getdbt.com" },
  { id: "excel", cat: "data", name: "Microsoft Excel", mono: "Xl", color: "#217346", tagline: "تحليل البيانات بالجداول والمعادلات.", uses: ["التحليل السريع", "الجداول المحورية"], prereq: ["لا يوجد"], docs: "https://support.microsoft.com/en-us/excel" },

  /* DevOps */
  { id: "github-actions", cat: "devops", name: "GitHub Actions", mono: "GA", color: "#2088FF", tagline: "أتمتة البناء والاختبار والنشر.", uses: ["التكامل المستمر", "النشر المستمر"], prereq: ["Git", "GitHub"], docs: "https://docs.github.com/en/actions" },
  { id: "terraform", cat: "devops", name: "Terraform", mono: "Tf", color: "#7B42BC", tagline: "إدارة البنية التحتية كشيفرة.", uses: ["تجهيز الموارد السحابية", "إدارة البيئات"], prereq: ["أساسيات الحوسبة السحابية"], docs: "https://developer.hashicorp.com/terraform/docs" },
  { id: "kubernetes", cat: "devops", name: "Kubernetes", mono: "K8s", color: "#326CE5", tagline: "إدارة الحاويات وتوسيعها تلقائياً.", uses: ["تشغيل الحاويات", "التوسع التلقائي"], prereq: ["Docker", "Linux"], docs: "https://kubernetes.io/docs/" },
  { id: "nginx", cat: "devops", name: "Nginx", mono: "Nx", color: "#009639", tagline: "خادم ويب وموازن أحمال.", uses: ["الوكيل العكسي", "موازنة الأحمال"], prereq: ["Linux"], docs: "https://nginx.org/en/docs/" },
  { id: "prometheus", cat: "devops", name: "Prometheus", mono: "Pr", color: "#E6522C", tagline: "جمع المقاييس ومراقبة الأنظمة.", uses: ["المراقبة", "التنبيهات"], prereq: ["Linux"], docs: "https://prometheus.io/docs/" },
  { id: "grafana", cat: "devops", name: "Grafana", mono: "Gf", color: "#F46800", tagline: "لوحات مراقبة وتصوير المقاييس.", uses: ["لوحات المراقبة", "تصوير المقاييس"], prereq: ["Prometheus أو مصدر بيانات"], docs: "https://grafana.com/docs/" }
];
