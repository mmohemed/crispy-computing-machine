'use strict';

module.exports = {
  slug: '02-jsx-setup',
  title: 'إعداد المشروع و JSX',
  summary: 'إنشاء مشروع React بـ Vite، وفهم JSX: قواعده وفروقه عن HTML وكيف يتحوّل إلى جافاسكربت.',
  duration: 45,
  level: 'مبتدئ',
  tags: ['JSX', 'الإعداد'],
  objectives: [
    'تنشئ مشروع React جاهزاً بأمر واحد.',
    'تفهم بنية ملفات المشروع ودور كل ملف.',
    'تكتب JSX بقواعده الصحيحة.',
    'تدمج تعابير جافاسكربت داخل الواجهة.',
    'تتجنّب أشهر أخطاء JSX.'
  ],
  quickRef: [
    { code: 'npm create vite@latest', desc: 'إنشاء مشروع جديد' },
    { code: 'className', desc: 'بديل class في JSX' },
    { code: 'htmlFor', desc: 'بديل for في JSX' },
    { code: '{ expression }', desc: 'إدراج تعبير جافاسكربت' },
    { code: '<>…</>', desc: 'جزء (Fragment) بلا عنصر إضافي' },
    { code: 'style={{ key: value }}', desc: 'أنماط مضمّنة ككائن' }
  ],
  blocks: [
    { t: 'h2', text: 'إنشاء المشروع' },
    { t: 'p', text: 'أسرع طريقة اليوم هي **Vite**: أداة بناء سريعة جداً تجهّز لك كل شيء (المترجم، خادم التطوير، إعادة التحميل الفوري) في ثوانٍ.' },
    { t: 'code', lang: 'bash', title: 'الأوامر', code: `
# 1) إنشاء المشروع
npm create vite@latest my-app -- --template react

# 2) الدخول وتثبيت الاعتماديات
cd my-app
npm install

# 3) تشغيل خادم التطوير
npm run dev
# افتح http://localhost:5173

# 4) بناء نسخة الإنتاج لاحقاً
npm run build` },
    { t: 'note', text: 'تحتاج **Node.js** مثبّتاً على جهازك (نسخة 18 فأحدث). تحقّق بـ `node -v`. أمر `npm create vite` يسألك عن الإطار واللغة إن لم تمرّرهما في الأمر.' },

    { t: 'h2', text: 'بنية المشروع' },
    { t: 'code', lang: 'text', noCopy: true, code: `
my-app/
├── index.html          نقطة الدخول — فيها <div id="root">
├── package.json        الاعتماديات والأوامر
├── vite.config.js      إعدادات أداة البناء
├── public/             ملفات ثابتة تُنسخ كما هي
└── src/
    ├── main.jsx        يربط React بالصفحة
    ├── App.jsx         المكوّن الجذر
    ├── App.css
    ├── index.css       أنماط عامة
    ├── components/     مكوّناتك (تنشئه بنفسك)
    └── assets/         صور وخطوط` },
    { t: 'code', lang: 'html', title: 'index.html', code: `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>تطبيقي</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>` },
    { t: 'code', lang: 'jsx', title: 'src/main.jsx', code: `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);` },
    { t: 'p', text: 'كل تطبيقك يعيش داخل `<div id="root">` واحد. هذا ما يُسمّى **تطبيق صفحة واحدة** (SPA): صفحة HTML واحدة، وReact ترسم كل شيء داخلها.' },
    { t: 'tip', text: '`StrictMode` أداة تطوير تكشف مشاكل محتملة. تشغّل بعض الدوال مرتين عمداً في وضع التطوير لتكشف الآثار الجانبية — لا تقلق، هذا لا يحدث في الإنتاج.' },

    { t: 'h2', text: 'ما هو JSX؟' },
    { t: 'p', text: 'JSX صياغة تسمح بكتابة ما يشبه HTML داخل جافاسكربت. ليست HTML ولا نصاً — بل **صياغة تُترجَم** إلى استدعاءات دوال.' },
    { t: 'code', lang: 'jsx', title: 'ما تكتبه', code: 'const el = <h1 className="title">مرحباً</h1>;' },
    { t: 'code', lang: 'js', title: 'ما يُترجَم إليه فعلاً', code: `
const el = React.createElement(
  'h1',
  { className: 'title' },
  'مرحباً'
);` },
    { t: 'p', text: 'لهذا السبب توجد فروق عن HTML: أنت تكتب **كائنات جافاسكربت** في النهاية، لا نصاً يفسّره المتصفح.' },

    { t: 'h2', text: 'قواعد JSX الست' },
    { t: 'h3', text: '1. عنصر جذر واحد' },
    { t: 'compare', lang: 'jsx', bad: {
      code: 'function App() {\n  return (\n    <h1>عنوان</h1>\n    <p>فقرة</p>\n  );\n}',
      why: 'الدالة لا تستطيع إرجاع قيمتين. خطأ ترجمة مباشر.'
    }, good: {
      code: 'function App() {\n  return (\n    <>\n      <h1>عنوان</h1>\n      <p>فقرة</p>\n    </>\n  );\n}',
      why: 'الجزء `<>…</>` يجمعهما دون إضافة عنصر إلى DOM.'
    }},
    { t: 'note', text: 'يمكن استخدام `<div>` بدل `<>`، لكن الجزء (Fragment) أفضل لأنه لا يلوّث بنية HTML بعناصر لا داعي لها.' },

    { t: 'h3', text: '2. إغلاق كل الوسوم' },
    { t: 'code', lang: 'jsx', code: `
<img src="a.png" alt="صورة" />   {/* لاحظ / في النهاية */}
<br />
<input type="text" />
<hr />` },

    { t: 'h3', text: '3. أسماء السمات بصيغة camelCase' },
    { t: 'table', head: ['في HTML', 'في JSX', 'السبب'], rows: [
      ['`class`', '`className`', '`class` كلمة محجوزة في جافاسكربت'],
      ['`for`', '`htmlFor`', '`for` كلمة محجوزة'],
      ['`tabindex`', '`tabIndex`', 'اصطلاح camelCase'],
      ['`onclick`', '`onClick`', 'اصطلاح camelCase'],
      ['`maxlength`', '`maxLength`', 'اصطلاح camelCase'],
      ['`stroke-width`', '`strokeWidth`', 'اصطلاح camelCase'],
      ['`aria-label`', '`aria-label`', '**استثناء**: سمات aria و data تبقى كما هي']
    ]},

    { t: 'h3', text: '4. الأقواس المعقوفة للتعابير' },
    { t: 'code', lang: 'jsx', code: `
function Greeting() {
  const name = 'سارة';
  const hour = new Date().getHours();
  const user = { age: 25, city: 'الرياض' };

  return (
    <div>
      <h1>مرحباً {name}</h1>
      <p>الساعة الآن {hour}</p>
      <p>العمر بعد عام: {user.age + 1}</p>
      <p>{hour < 12 ? 'صباح الخير' : 'مساء الخير'}</p>
      <img src={user.avatar} alt={\`صورة \${name}\`} />
    </div>
  );
}` },
    { t: 'warn', title: 'تعابير لا جُمل', text: 'داخل `{}` يمكن وضع **تعبير** يُنتج قيمة فقط. لا يمكن وضع `if` أو `for` أو `switch`. استخدم المعامل الثلاثي `? :` أو أخرج المنطق قبل `return`.' },

    { t: 'h3', text: '5. الأنماط ككائن' },
    { t: 'code', lang: 'jsx', code: `
{/* قوسان: الأول للتعبير والثاني للكائن */}
<div style={{ color: 'red', fontSize: '20px', marginTop: 12 }}>
  نص منسّق
</div>

{/* الأفضل: أصناف CSS */}
<div className="alert alert-error">نص منسّق</div>` },
    { t: 'ul', items: [
      'أسماء الخصائص camelCase: `backgroundColor` لا `background-color`.',
      'القيم نصوص، والأرقام المجرّدة تُفسَّر كبكسل: `marginTop: 12` تعني `12px`.',
      'استخدم الأنماط المضمّنة للقيم الديناميكية فقط، وأصناف CSS لكل ما عداها.'
    ]},

    { t: 'h3', text: '6. التعليقات' },
    { t: 'code', lang: 'jsx', code: `
function App() {
  // تعليق عادي خارج JSX

  return (
    <div>
      {/* تعليق داخل JSX */}
      <p>نص</p>
    </div>
  );
}` },

    { t: 'h2', text: 'أول مكوّن حقيقي' },
    { t: 'code', lang: 'jsx', title: 'src/App.jsx', code: `
import './App.css';

function App() {
  const user = { name: 'سارة', lessons: 12, total: 20 };
  const progress = Math.round((user.lessons / user.total) * 100);

  return (
    <main className="app">
      <h1>أهلاً {user.name} 👋</h1>

      <p>
        أكملت {user.lessons} من {user.total} درساً
        ({progress}%)
      </p>

      <progress value={user.lessons} max={user.total} />

      <p>{progress >= 50 ? 'أنت في منتصف الطريق!' : 'البداية دائماً أصعب خطوة.'}</p>
    </main>
  );
}

export default App;` },
    { t: 'demo', title: 'النتيجة', height: 230,
      css: '.app{padding:16px;border:1px solid #e2e8f0;border-radius:12px}h1{margin:0 0 10px;color:#0aa5c7}progress{width:100%;height:14px}p{color:#475569;margin:8px 0}',
      html: '<main class="app"><h1>أهلاً سارة 👋</h1><p>أكملت 12 من 20 درساً (60%)</p><progress value="12" max="20"></progress><p>أنت في منتصف الطريق!</p></main>' },

    { t: 'h2', text: 'أخطاء JSX الشائعة' },
    { t: 'table', head: ['الخطأ', 'رسالة المتصفح غالباً', 'الحل'], rows: [
      ['عنصران جذران', '`Adjacent JSX elements must be wrapped`', 'لفّهما في `<>…</>`'],
      ['`class` بدل `className`', 'تحذير في وحدة التحكّم', 'استخدم `className`'],
      ['نسيان `/` في العنصر الفارغ', '`Unterminated JSX contents`', 'أغلق: `<img />`'],
      ['`if` داخل `{}`', '`Unexpected token`', 'استخدم `? :` أو أخرج المنطق'],
      ['قوس واحد للأنماط', '`style` غير صالح', '`style={{ … }}` بقوسين'],
      ['استدعاء الدالة بدل تمريرها', 'تُنفَّذ فوراً وتُعيد الرسم بلا نهاية', '`onClick={handle}` لا `onClick={handle()}`']
    ]},
    { t: 'warn', title: 'خطأ الاستدعاء المبكر', text: '`onClick={handleClick()}` تستدعي الدالة **فور الرسم** وتمرّر نتيجتها. الصواب `onClick={handleClick}` أو `onClick={() => handleClick(id)}` إن احتجت تمرير معامل.' },

    { t: 'h2', text: 'قيم لا تُعرض' },
    { t: 'p', text: 'React تتجاهل عند العرض: `null` و `undefined` و `false` و `true`. هذا مفيد للعرض الشرطي:' },
    { t: 'code', lang: 'jsx', code: `
{isLoggedIn && <button>تسجيل الخروج</button>}
{error && <p className="error">{error}</p>}` },
    { t: 'danger', title: 'فخّ الصفر', text: 'الرقم `0` **يُعرض**. فكتابة `{items.length && <List />}` تطبع «0» على الشاشة حين تكون القائمة فارغة. الحل: `{items.length > 0 && <List />}`.' },

    { t: 'exercise',
      title: 'تمرين: بطاقة تعريف بمكوّن',
      brief: 'أنشئ مشروع React جديداً واستبدل محتوى `App.jsx` ببطاقة تعريف بك.',
      requirements: [
        'أنشئ المشروع بـ Vite وشغّله.',
        'عرّف كائن `profile` فيه: الاسم، المهنة، المدينة، سنوات الخبرة، ومصفوفة `skills`.',
        'اعرض الاسم في `<h1>` والمهنة في `<p>`.',
        'احسب واعرض «سنة الميلاد التقريبية» من تعبير جافاسكربت.',
        'اعرض رسالة مختلفة حسب سنوات الخبرة (أقل من 3 = «في بداية الطريق»).',
        'استخدم `<>…</>` مرة واحدة على الأقل.',
        'أضف عنصراً بنمط مضمّن يعتمد على قيمة من الكائن (لون يتغيّر مثلاً).',
        'أضف تعليقاً بصيغة JSX الصحيحة.'
      ],
      hints: [
        'لعرض المصفوفة مؤقتاً استخدم `{profile.skills.join(" · ")}`.',
        'الأنماط المضمّنة بقوسين: `style={{ color: someVar }}`.',
        'لا تستخدم `class` — استخدم `className`.'
      ],
      solution: { lang: 'jsx', code: `
import './App.css';

function App() {
  const profile = {
    name: 'سارة عبدالله',
    job: 'مطوّرة واجهات أمامية',
    city: 'الرياض',
    years: 3,
    skills: ['HTML', 'CSS', 'JavaScript', 'React']
  };

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - profile.years;
  const isJunior = profile.years < 3;

  return (
    <main className="card">
      {/* الترويسة */}
      <h1>{profile.name}</h1>
      <p className="job">{profile.job} — {profile.city}</p>

      <>
        <p>بدأت العمل تقريباً عام {startYear}.</p>
        <p style={{ color: isJunior ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
          {isJunior ? 'في بداية الطريق' : 'خبرة راسخة'}
        </p>
      </>

      <p><strong>المهارات:</strong> {profile.skills.join(' · ')}</p>

      {profile.skills.length > 0 && (
        <p>عدد المهارات: {profile.skills.length}</p>
      )}
    </main>
  );
}

export default App;` },
      solutionNote: 'لاحظ `profile.skills.length > 0` لا `profile.skills.length` وحدها — تفادياً لفخّ الصفر.'
    },

    { t: 'quiz', items: [
      { q: 'لماذا نكتب `className` بدل `class` في JSX؟', options: ['تفضيل شخصي', 'لأن `class` كلمة محجوزة في جافاسكربت', 'لأنها أسرع', 'لأن HTML تغيّرت'], answer: 1,
        explain: 'JSX يُترجَم إلى جافاسكربت، فلا يمكن استخدام كلماتها المحجوزة كأسماء خصائص.' },
      { q: 'ما الخطأ في `<div style={color: "red"}>`؟', options: ['لا خطأ', 'ينقص قوس: يجب `style={{ color: "red" }}`', 'يجب استخدام class', 'الاسم خاطئ'], answer: 1,
        explain: 'القوس الأول لفتح تعبير JSX، والثاني لكائن الأنماط.' },
      { q: 'ماذا يحدث في `onClick={handleClick()}`؟', options: ['يعمل بشكل صحيح', 'تُستدعى الدالة فور الرسم بدل انتظار النقرة', 'خطأ ترجمة', 'لا شيء'], answer: 1,
        explain: 'الأقواس تعني الاستدعاء الفوري؛ الصواب تمرير المرجع أو لفّه في دالة سهمية.' },
      { q: 'لماذا نستخدم `<>…</>`؟', options: ['لتسريع الرسم', 'لإرجاع عدة عناصر دون إضافة عنصر زائد إلى DOM', 'لكتابة التعليقات', 'لتحديد الأنماط'], answer: 1,
        explain: 'الدالة تُرجع قيمة واحدة؛ الجزء يجمّع العناصر دون تلويث بنية HTML.' },
      { q: 'ما نتيجة `{items.length && <List />}` حين تكون القائمة فارغة؟', options: ['لا يظهر شيء', 'يظهر الرقم 0 على الشاشة', 'خطأ', 'تظهر القائمة'], answer: 1,
        explain: 'الصفر قيمة تُعرض في React؛ استخدم `items.length > 0 &&` بدلاً منها.' }
    ]}
  ]
};
