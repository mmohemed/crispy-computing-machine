/* ==========================================================
   بيانات قسم الذكاء الاصطناعي
   - topics: عناوين تنظيمية للموضوعات (تتحول إلى وحدات في قالب الدروس)
   - projects: معرّفات من projects.js
   ========================================================== */
CW.data.aiAreas = [
  { id: "ml", name: "تعلم الآلة", en: "Machine Learning", icon: "brain", color: "#2563EB",
    tagline: "خوارزميات تتعلم من البيانات لتتنبأ بالنتائج وتكتشف الأنماط.",
    topics: ["مدخل وأنواع التعلم", "تجهيز البيانات وهندسة الميزات", "الانحدار", "التصنيف", "التجميع وتقليل الأبعاد", "التقييم وضبط النماذج"],
    tools: ["numpy", "pandas", "scikit-learn", "xgboost", "mlflow", "jupyter"],
    careers: ["ml-engineer", "data-scientist", "mlops-engineer"],
    projects: ["house-price-prediction", "recommendation-system", "customer-churn"] },
  { id: "dl", name: "التعلم العميق", en: "Deep Learning", icon: "network", color: "#7C3AED",
    tagline: "شبكات عصبية عميقة تتعلم تمثيلات معقدة من البيانات.",
    topics: ["الشبكات العصبية", "التدريب والتحسين", "الشبكات الالتفافية CNN", "الشبكات التكرارية", "المحولات Transformers", "النقل التعلمي"],
    tools: ["pytorch", "tensorflow", "numpy", "hugging-face"],
    careers: ["dl-engineer", "ai-engineer", "cv-engineer"],
    projects: ["image-classifier", "handwriting-recognition"] },
  { id: "nlp", name: "معالجة اللغة الطبيعية", en: "Natural Language Processing", icon: "message", color: "#0891B2",
    tagline: "تمكين الحاسوب من فهم اللغة البشرية وتحليلها وتوليدها.",
    topics: ["معالجة النصوص الأولية", "تمثيل الكلمات", "تصنيف النصوص", "استخراج المعلومات", "النماذج اللغوية", "معالجة اللغة العربية"],
    tools: ["hugging-face", "pytorch", "pandas"],
    careers: ["nlp-engineer", "genai-engineer", "ai-engineer"],
    projects: ["sentiment-analysis", "document-qa"] },
  { id: "cv", name: "الرؤية الحاسوبية", en: "Computer Vision", icon: "eye", color: "#16A34A",
    tagline: "تمكين الأنظمة من رؤية الصور ومقاطع الفيديو وفهم محتواها.",
    topics: ["أساسيات الصور الرقمية", "معالجة الصور", "تصنيف الصور", "كشف الكائنات", "التجزئة", "الفيديو والتتبع"],
    tools: ["opencv", "pytorch", "tensorflow", "numpy"],
    careers: ["cv-engineer", "dl-engineer", "robotics-engineer"],
    projects: ["image-classifier", "face-detection"] },
  { id: "rl", name: "التعلم المعزز", en: "Reinforcement Learning", icon: "target", color: "#D97706",
    tagline: "وكلاء أذكياء يتعلمون اتخاذ القرار عبر التجربة والمكافأة.",
    topics: ["مفاهيم الوكيل والبيئة", "عمليات ماركوف", "التعلم بالقيم", "تعلم السياسات", "التعلم المعزز العميق", "التطبيقات والمحاكاة"],
    tools: ["pytorch", "numpy", "jupyter"],
    careers: ["ml-engineer", "robotics-engineer", "ai-engineer"],
    projects: ["game-agent"] },
  { id: "genai", name: "الذكاء الاصطناعي التوليدي", en: "Generative AI", icon: "sparkles", color: "#DB2777",
    tagline: "نماذج تولّد النصوص والصور والشيفرة وبناء تطبيقات عملية عليها.",
    topics: ["مدخل إلى النماذج التوليدية", "النماذج اللغوية الكبيرة", "هندسة الأوامر", "الاسترجاع المعزز RAG", "الضبط الدقيق", "التقييم والمسؤولية"],
    tools: ["hugging-face", "pytorch", "fastapi", "docker"],
    careers: ["genai-engineer", "ai-engineer", "nlp-engineer"],
    projects: ["document-qa", "ai-chat-assistant"] }
];
