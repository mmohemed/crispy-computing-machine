/* ==========================================================
   الصفحات التعريفية: من نحن، اتصل بنا، الخصوصية، الشروط، وصفحة 404
   تحدد الصفحة نوعها عبر <body data-info="about">
   ========================================================== */
(function () {
  "use strict";
  var D = CW.data, R = CW.routes, icon = CW.icon;

  function shell(title, lead, body, ic) {
    CW.setTitle(title);
    document.getElementById("main").innerHTML = '<header class="info-hero"><div class="container container-narrow">' + CW.breadcrumb([[title]]) +
      '<span class="icon-tile lg mt-6">' + icon(ic) + "</span><h1>" + title + '</h1><p class="lead">' + lead + "</p></div></header>" +
      '<div class="container container-narrow info-body">' + body + "</div>";
  }
  function legal(sections) {
    return '<div class="notice warning mb-6">' + icon("alert", "ic-sm") + "<span>نص مبدئي لعرض قالب الصفحة؛ يجب مراجعته واعتماده قانونياً قبل الإطلاق.</span></div>" +
      '<nav class="card card-pad mb-6" aria-label="محتويات الصفحة"><strong>المحتويات</strong><ol class="legal-toc">' + sections.map(function (s, i) { return '<li><a href="#s' + i + '">' + s[0] + "</a></li>"; }).join("") + "</ol></nav>" +
      sections.map(function (s, i) { return '<section class="legal-sec" id="s' + i + '"><h2>' + (i + 1) + ". " + s[0] + "</h2><p>" + s[1] + "</p></section>"; }).join("");
  }

  var pages = {
    about: function () {
      shell("من نحن", "CodeWay منصة تعليمية عربية هدفها أن تجعل طريق تعلّم البرمجة واضحاً ومنظماً لكل متعلم.",
        '<div class="grid grid-3 mb-8">' + [["target", "رسالتنا", "تقديم محتوى برمجي عربي منظم يقود المتعلم من الصفر حتى الجاهزية لسوق العمل."], ["route", "منهجنا", "خرائط تعلم مرئية تربط اللغات والأدوات والمشاريع بأهداف مهنية واضحة."], ["rocket", "التطبيق أولاً", "كل مسار ينتهي بمشاريع عملية تبني بها معرض أعمالك."]].map(function (c) {
          return '<article class="card card-pad"><span class="icon-tile">' + icon(c[0]) + '</span><h2 class="mt-4" style="font-size:1.1rem">' + c[1] + '</h2><p class="text-muted mt-2">' + c[2] + "</p></article>";
        }).join("") + "</div>" +
        '<div class="card card-pad about-numbers"><h2 class="block-title">' + icon("layers") + "ما تغطيه المنصة</h2><ul>" +
        [[D.languages.length, "لغة برمجة", R.languages()], [D.tools.length, "أداة وتقنية", R.tools()], [D.fields.length, "مجالاً برمجياً", R.fields()], [D.careers.length, "مساراً مهنياً", R.careers()], [D.csTopics.length, "موضوعاً في علوم الحاسوب", R.cs()]].map(function (n) {
          return '<li><a href="' + n[2] + '"><b>' + n[0] + "</b>" + n[1] + "</a></li>";
        }).join("") + "</ul></div>", "info");
    },
    contact: function () {
      shell("اتصل بنا", "لديك سؤال أو اقتراح؟ يسعدنا تواصلك.",
        '<div class="contact-grid"><form class="card card-pad" id="contactForm" novalidate><div class="form-grid">' +
        '<div class="field"><label for="cName">الاسم</label><input class="input" id="cName" required autocomplete="name"></div>' +
        '<div class="field"><label for="cEmail">البريد الإلكتروني</label><input class="input ltr" id="cEmail" type="email" required autocomplete="email"></div>' +
        '<div class="field full"><label for="cTopic">الموضوع</label><select class="select" id="cTopic"><option>استفسار عام</option><option>اقتراح محتوى</option><option>مشكلة تقنية</option><option>شراكة</option></select></div>' +
        '<div class="field full"><label for="cMsg">الرسالة</label><textarea class="textarea" id="cMsg" required></textarea></div></div>' +
        '<p class="hint" id="cErr" role="alert"></p><button class="btn btn-primary mt-4" type="submit">' + icon("mail", "ic-sm") + "إرسال الرسالة</button></form>" +
        '<aside class="card card-pad"><h2 class="block-title" style="font-size:1rem">' + icon("help") + 'قبل أن تراسلنا</h2><p class="text-muted">قد تجد إجابتك في الأسئلة الشائعة في الصفحة الرئيسية، أو في صفحة المراجع والتوثيق.</p>' +
        '<a class="link-arrow mt-4" href="' + R.home() + '">الصفحة الرئيسية' + icon("arrowL", "ic-xs") + '</a><br><a class="link-arrow mt-2" href="' + R.references() + '">المراجع والتوثيق' + icon("arrowL", "ic-xs") + "</a></aside></div>", "mail");
      CW.$("#contactForm").addEventListener("submit", function (e) {
        e.preventDefault();
        var bad = ["#cName", "#cEmail", "#cMsg"].filter(function (s) { var el = CW.$(s); var ok = el.value.trim() && (s !== "#cEmail" || /\S+@\S+\.\S+/.test(el.value)); el.setAttribute("aria-invalid", !ok); return !ok; });
        if (bad.length) { CW.$("#cErr").textContent = "يرجى تعبئة الحقول المطلوبة ببيانات صحيحة."; CW.$(bad[0]).focus(); return; }
        CW.$("#cErr").textContent = "";
        CW.toast("النموذج صحيح، لكن إرسال الرسائل يحتاج ربطاً بالخادم (Backend) ولم تُرسل الرسالة.", "warning");
      });
    },
    privacy: function () {
      shell("سياسة الخصوصية", "كيف نتعامل مع بياناتك في منصة CodeWay.", legal([
        ["البيانات التي نجمعها", "في هذه النسخة التجريبية لا تُجمع أي بيانات على خوادم. بعض التفضيلات والتقدم التجريبي يُحفظ في متصفحك فقط عبر التخزين المحلي."],
        ["استخدام البيانات", "عند إطلاق المنصة سيُوضَّح هنا الغرض من جمع البيانات وطريقة استخدامها."],
        ["ملفات تعريف الارتباط والتخزين المحلي", "يمكنك حذف البيانات المحفوظة محلياً في أي وقت من إعدادات متصفحك."],
        ["حقوقك", "سيُوضَّح هنا حق الوصول إلى بياناتك وتعديلها وحذفها."],
        ["التواصل", "لأي استفسار يتعلق بالخصوصية يمكنك استخدام صفحة اتصل بنا."]]), "lock");
    },
    terms: function () {
      shell("شروط الاستخدام", "الشروط التي تحكم استخدام منصة CodeWay.", legal([
        ["قبول الشروط", "باستخدامك المنصة فإنك توافق على هذه الشروط بعد اعتمادها."],
        ["الحساب", "ستُوضَّح هنا شروط إنشاء الحساب ومسؤوليات المستخدم."],
        ["المحتوى", "المحتوى التعليمي مقدم لأغراض التعلم، وسيوضَّح هنا ما يتعلق بحقوق النشر."],
        ["السلوك المقبول", "يُمنع إساءة استخدام المنصة أو محاولة تعطيل خدماتها."],
        ["التعديلات", "قد تُحدَّث هذه الشروط، وسيُعلن عن أي تغيير جوهري."]]), "file");
    }
  };

  CW.pages.info = function () { (pages[document.body.getAttribute("data-info")] || pages.about)(); };

  CW.pages.notFound = function () {
    CW.setTitle("الصفحة غير موجودة");
    document.getElementById("main").innerHTML = '<section class="section"><div class="container container-narrow nf">' +
      '<div class="nf-code ltr">404</div><h1>الصفحة غير موجودة</h1><p class="text-muted mt-2">ربما تغيّر الرابط أو أن الصفحة لم تُنشأ بعد.</p>' +
      '<div class="flex gap-3 wrap mt-6" style="justify-content:center"><a class="btn btn-primary" href="' + R.home() + '">' + icon("home", "ic-sm") + 'الصفحة الرئيسية</a><button class="btn btn-outline" data-open-search>' + icon("search", "ic-sm") + "ابحث في المنصة</button></div></div></section>";
  };
})();
