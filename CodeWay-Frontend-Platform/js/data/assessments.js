/* ==========================================================
   بيانات الاختبارات والتدريبات (تجريبية)
   - الأسئلة هنا لعرض الواجهة فقط، وليست محتوى تعليمياً نهائياً.
   - track: { type: "lang" | "tool" | "cs" | "ai", id: "..." }
   ========================================================== */
CW.data.quizzes = [
  { id: "python-basics", title: "اختبار أساسيات Python", track: { type: "lang", id: "python" }, level: "beginner", minutes: 10, bank: "demo" },
  { id: "javascript-basics", title: "اختبار أساسيات JavaScript", track: { type: "lang", id: "javascript" }, level: "beginner", minutes: 10, bank: "demo" },
  { id: "sql-queries", title: "اختبار الاستعلامات في SQL", track: { type: "lang", id: "sql" }, level: "beginner", minutes: 12, bank: "demo" },
  { id: "java-oop", title: "اختبار البرمجة الكائنية في Java", track: { type: "lang", id: "java" }, level: "intermediate", minutes: 15, bank: "demo" },
  { id: "git-essentials", title: "اختبار أساسيات Git", track: { type: "tool", id: "git" }, level: "beginner", minutes: 8, bank: "demo" },
  { id: "react-components", title: "اختبار مكونات React", track: { type: "tool", id: "react" }, level: "intermediate", minutes: 12, bank: "demo" },
  { id: "algorithms-intro", title: "اختبار مدخل الخوارزميات", track: { type: "cs", id: "algorithms" }, level: "intermediate", minutes: 15, bank: "demo" },
  { id: "ml-concepts", title: "اختبار مفاهيم تعلم الآلة", track: { type: "ai", id: "ml" }, level: "intermediate", minutes: 15, bank: "demo" }
];

/* بنك أسئلة تجريبي مشترك (يُستبدل لاحقاً بأسئلة لكل اختبار من الخادم) */
CW.data.questionBanks = {
  demo: [
    { type: "single", text: "سؤال تجريبي (اختيار واحد): أي الخيارات التالية يُعد لغة برمجة؟",
      options: ["HTML", "Python", "CSS", "JSON"], answer: 1,
      explain: "سيظهر شرح الإجابة هنا عند إضافة المحتوى الحقيقي." },
    { type: "single", text: "سؤال تجريبي: ما الناتج المتوقع للشيفرة التالية؟", code: "print(2 + 3)",
      options: ["23", "5", "خطأ", "2 + 3"], answer: 1,
      explain: "سيظهر شرح الإجابة هنا." },
    { type: "multi", text: "سؤال تجريبي (اختيار متعدد): أي مما يلي من أدوات التطوير؟",
      options: ["Git", "Visual Studio Code", "Excel", "Docker"], answer: [0, 1, 3],
      explain: "سيظهر شرح الإجابة هنا." },
    { type: "boolean", text: "سؤال تجريبي (صح/خطأ): يمكن تعلّم البرمجة دون خبرة سابقة.",
      options: ["صح", "خطأ"], answer: 0,
      explain: "سيظهر شرح الإجابة هنا." },
    { type: "single", text: "سؤال تجريبي: أي هيكل بيانات يعمل بمبدأ «آخر من يدخل أول من يخرج»؟",
      options: ["الطابور", "المكدس", "المصفوفة", "الشجرة"], answer: 1,
      explain: "سيظهر شرح الإجابة هنا." }
  ]
};

CW.data.exercises = [
  { id: "py-variables", title: "تدريب: المتغيرات والطباعة", track: { type: "lang", id: "python" }, level: "beginner", kind: "code", editorLang: "python" },
  { id: "js-array-sum", title: "تدريب: مجموع عناصر مصفوفة", track: { type: "lang", id: "javascript" }, level: "beginner", kind: "code", editorLang: "javascript", runnable: true,
    starter: "function sumArray(numbers) {\n  // اكتب الحل هنا\n  return 0;\n}\n\nconsole.log(sumArray([1, 2, 3]));",
    tests: [{ call: "sumArray([1, 2, 3])", expect: 6 }, { call: "sumArray([])", expect: 0 }, { call: "sumArray([10, -4])", expect: 6 }] },
  { id: "js-reverse-string", title: "تدريب: عكس نص", track: { type: "lang", id: "javascript" }, level: "beginner", kind: "code", editorLang: "javascript", runnable: true,
    starter: "function reverseText(text) {\n  // اكتب الحل هنا\n  return text;\n}\n\nconsole.log(reverseText(\"CodeWay\"));",
    tests: [{ call: "reverseText(\"abc\")", expect: "cba" }, { call: "reverseText(\"\")", expect: "" }, { call: "reverseText(\"CodeWay\")", expect: "yaWedoC" }] },
  { id: "sql-select", title: "تدريب: استعلام SELECT", track: { type: "lang", id: "sql" }, level: "beginner", kind: "code", editorLang: "sql" },
  { id: "git-flow", title: "تدريب: ترتيب أوامر Git", track: { type: "tool", id: "git" }, level: "beginner", kind: "order" },
  { id: "ds-stack", title: "تدريب: تنفيذ مكدس", track: { type: "cs", id: "data-structures" }, level: "intermediate", kind: "code", editorLang: "python" },
  { id: "ml-split", title: "تدريب: تقسيم البيانات", track: { type: "ai", id: "ml" }, level: "intermediate", kind: "code", editorLang: "python" }
];
