/* ==========================================================
   بيانات المستخدم التجريبي
   ⚠️ هذه بيانات وهمية لعرض الواجهات فقط ولا تمثل مستخدماً حقيقياً.
   عند ربط الـ Backend تُستبدل بطلب API يعيد بيانات المستخدم المسجّل.
   ========================================================== */
CW.data.demoUser = {
  name: "متعلم تجريبي",
  username: "demo_learner",
  email: "demo@example.com",
  avatar: "images/avatar-demo.svg",
  joined: "حساب تجريبي",
  bio: "هذا حساب تجريبي لعرض واجهات المنصة.",
  /* المسارات المسجّل فيها: stage = رقم المرحلة الحالية في خارطة المسار */
  careers: [
    { id: "frontend-developer", stage: 2, progress: 34 },
    { id: "data-analyst", stage: 1, progress: 12 }
  ],
  /* اللغات/الأدوات التي يتعلمها */
  tracks: [
    { type: "lang", id: "javascript", module: 3, lesson: 2, progress: 28 },
    { type: "lang", id: "python", module: 1, lesson: 3, progress: 9 },
    { type: "tool", id: "git", module: 2, lesson: 1, progress: 40 }
  ],
  lastLesson: { track: "lang", id: "javascript", m: 3, l: 2 },
  projects: [
    { id: "todo-list", status: "done" },
    { id: "weather-app", status: "in-progress" },
    { id: "personal-portfolio", status: "planned" }
  ],
  quizResults: [
    { id: "javascript-basics", score: 80 },
    { id: "git-essentials", score: 100 }
  ],
  achievements: [
    { icon: "flag", title: "الخطوة الأولى", desc: "إكمال أول درس", earned: true },
    { icon: "flame", title: "سلسلة ٧ أيام", desc: "التعلم ٧ أيام متتالية", earned: true },
    { icon: "trophy", title: "أول مشروع", desc: "إنهاء أول مشروع عملي", earned: true },
    { icon: "checkCircle", title: "درجة كاملة", desc: "الحصول على 100% في اختبار", earned: true },
    { icon: "route", title: "منتصف الطريق", desc: "إكمال نصف مسار مهني", earned: false },
    { icon: "award", title: "مستكشف", desc: "تجربة ثلاث لغات مختلفة", earned: false },
    { icon: "rocket", title: "محترف المشاريع", desc: "إنهاء خمسة مشاريع", earned: false },
    { icon: "star", title: "متعلم متميز", desc: "إكمال مسار مهني كامل", earned: false }
  ],
  weekActivity: [2, 3, 0, 4, 1, 3, 2]
};

/* مستخدمون تجريبيون للوحة الإدارة */
CW.data.demoUsers = [
  { id: "u1", name: "مستخدم تجريبي ١", email: "user1@example.com", role: "متعلم", status: "نشط" },
  { id: "u2", name: "مستخدم تجريبي ٢", email: "user2@example.com", role: "متعلم", status: "نشط" },
  { id: "u3", name: "مستخدم تجريبي ٣", email: "user3@example.com", role: "مدرّب", status: "نشط" },
  { id: "u4", name: "مستخدم تجريبي ٤", email: "user4@example.com", role: "متعلم", status: "موقوف" },
  { id: "u5", name: "مستخدم تجريبي ٥", email: "user5@example.com", role: "مشرف محتوى", status: "نشط" },
  { id: "u6", name: "مستخدم تجريبي ٦", email: "user6@example.com", role: "متعلم", status: "بانتظار التفعيل" },
  { id: "u7", name: "مستخدم تجريبي ٧", email: "user7@example.com", role: "متعلم", status: "نشط" },
  { id: "u8", name: "مستخدم تجريبي ٨", email: "user8@example.com", role: "مدير", status: "نشط" }
];
