'use strict';

module.exports = {
  slug: '01-introduction',
  title: 'مقدمة في Angular وإعداد المشروع',
  summary: 'ما هو Angular ولماذا يختلف عن المكتبات، وكيف تنشئ مشروعك الأول وتفهم بنية ملفاته.',
  duration: 45,
  level: 'مبتدئ',
  tags: ['مقدمة', 'الإعداد'],
  objectives: [
    'تفرّق بين المكتبة وإطار العمل المتكامل.',
    'تنشئ مشروع Angular وتشغّله.',
    'تفهم بنية ملفات المشروع ودور كل ملف.',
    'تعرف مكوّنات معمارية Angular الأساسية.',
    'تستخدم Angular CLI لتوليد الملفات.'
  ],
  quickRef: [
    { code: 'npm i -g @angular/cli', desc: 'تثبيت الأداة عالمياً' },
    { code: 'ng new my-app', desc: 'إنشاء مشروع جديد' },
    { code: 'ng serve', desc: 'تشغيل خادم التطوير' },
    { code: 'ng generate component x', desc: 'توليد مكوّن' },
    { code: 'ng build', desc: 'بناء نسخة الإنتاج' },
    { code: 'src/main.ts', desc: 'نقطة انطلاق التطبيق' }
  ],
  blocks: [
    { t: 'h2', text: 'ما هو Angular؟' },
    { t: 'p', text: 'إطار عمل شامل من **جوجل** لبناء تطبيقات الويب الكبيرة، مبني بالكامل على **TypeScript**. يختلف جوهرياً عن المكتبات: لا يعطيك قطعة واحدة ويتركك تجمع الباقي، بل يأتي بكل شيء جاهزاً ومتوافقاً.' },
    { t: 'table', head: ['الاحتياج', 'في React (مكتبة)', 'في Angular (إطار)'], rows: [
      ['بناء الواجهة', 'React نفسها', 'مدمج'],
      ['التوجيه بين الصفحات', 'تختار: React Router أو غيره', 'مدمج: `@angular/router`'],
      ['طلبات HTTP', 'تختار: fetch أو axios', 'مدمج: `HttpClient`'],
      ['النماذج والتحقّق', 'تختار مكتبة', 'مدمج: `ReactiveFormsModule`'],
      ['حقن الاعتماديات', 'غير موجود', 'مدمج في صميم المعمارية'],
      ['أدوات البناء والاختبار', 'تُعدّها بنفسك', 'جاهزة عبر CLI']
    ]},
    { t: 'note', title: 'الخلاصة', text: 'Angular يقرّر عنك كثيراً من الخيارات. هذا يقلّل حرّيتك ويزيد اتّساق المشاريع — ولهذا تفضّله المؤسسات والفرق الكبيرة، حيث يهمّ أن يبدو كل مشروع كالآخر.' },

    { t: 'h2', text: 'ثمن الدخول وفائدته' },
    { t: 'features', items: [
      { icon: 'shield', title: 'أنواع صارمة', text: 'TypeScript إلزامية عملياً — أخطاء أقل في وقت التشغيل ودعم ممتاز من المحرّر.' },
      { icon: 'grid', title: 'معمارية واضحة', text: 'المكوّن للعرض، والخدمة للمنطق، والوحدة للتنظيم. لا اجتهاد في التقسيم.' },
      { icon: 'refresh', title: 'أدوات جاهزة', text: 'CLI يولّد الملفات ويشغّل الاختبارات ويبني الإنتاج بأمر واحد.' },
      { icon: 'users', title: 'مناسب للفرق', text: 'اصطلاحات موحّدة تجعل انتقال المطوّر بين المشاريع سلساً.' },
      { icon: 'cpu', title: 'منحنى تعلّم أعلى', text: 'مفاهيم كثيرة قبل أن تكتب شيئاً مفيداً — هذا هو الثمن.' },
      { icon: 'box', title: 'حجم أكبر', text: 'الحزمة الأولية أكبر من المكتبات الخفيفة، لكنها تشمل كل شيء.' }
    ]},

    { t: 'h2', text: 'التثبيت وإنشاء المشروع' },
    { t: 'code', lang: 'bash', code: `
# 1) تأكّد من وجود Node.js (نسخة 18 فأحدث)
node -v

# 2) ثبّت أداة سطر الأوامر عالمياً
npm install -g @angular/cli

# 3) تحقّق من التثبيت
ng version

# 4) أنشئ مشروعاً جديداً
ng new my-app
#    سيسألك: هل تريد التوجيه؟ نعم
#    وأي صيغة أنماط؟ CSS أو SCSS

# 5) شغّل خادم التطوير
cd my-app
ng serve --open
# يفتح http://localhost:4200` },
    { t: 'tip', text: 'أضف `--style=scss` و `--routing` إلى `ng new` لتتجاوز الأسئلة: `ng new my-app --routing --style=scss`.' },

    { t: 'h2', text: 'بنية المشروع' },
    { t: 'code', lang: 'text', noCopy: true, code: `
my-app/
├── angular.json          إعدادات البناء والمشروع
├── package.json          الاعتماديات والأوامر
├── tsconfig.json         إعدادات TypeScript
└── src/
    ├── index.html        الصفحة الوحيدة — فيها <app-root>
    ├── main.ts           نقطة الانطلاق
    ├── styles.css        الأنماط العامة
    └── app/
        ├── app.component.ts      منطق المكوّن الجذر
        ├── app.component.html    قالبه
        ├── app.component.css     أنماطه
        ├── app.config.ts         إعدادات التطبيق والمزوّدات
        └── app.routes.ts         تعريف المسارات` },
    { t: 'code', lang: 'html', title: 'src/index.html', code: `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>تطبيقي</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <app-root></app-root>
</body>
</html>` },
    { t: 'p', text: 'الوسم `<app-root>` ليس عنصر HTML قياسياً — بل **مكوّن Angular**. هذه هي الفكرة الأساسية: تخترع عناصرك الخاصة وتملؤها بالمنطق والقالب.' },
    { t: 'code', lang: 'ts', title: 'src/main.ts', code: `
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));` },

    { t: 'h2', text: 'المكوّن الجذر' },
    { t: 'code', lang: 'ts', title: 'app.component.ts', code: `
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'تطبيقي الأول';
  lessonsDone = 12;
  lessonsTotal = 20;

  get progress(): number {
    return Math.round((this.lessonsDone / this.lessonsTotal) * 100);
  }
}` },
    { t: 'code', lang: 'html', title: 'app.component.html', code: `
<main class="app">
  <h1>{{ title }}</h1>
  <p>أكملت {{ lessonsDone }} من {{ lessonsTotal }} درساً ({{ progress }}%)</p>
  <progress [value]="lessonsDone" [max]="lessonsTotal"></progress>
</main>` },
    { t: 'demo', title: 'النتيجة في المتصفح', height: 210,
      css: '.app{padding:16px;border:1px solid #e2e8f0;border-radius:12px}h1{margin:0 0 10px;color:#dd0031}progress{width:100%;height:14px}p{color:#475569}',
      html: '<main class="app"><h1>تطبيقي الأول</h1><p>أكملت 12 من 20 درساً (60%)</p><progress value="12" max="20"></progress></main>' },
    { t: 'note', title: 'المزخرف @Component', text: 'المزخرف (Decorator) دالة تضيف بيانات وصفية إلى الصنف. `@Component` تخبر Angular: هذا الصنف مكوّن، اسم وسمه كذا، وقالبه في هذا الملف. بدونه يبقى الصنف مجرّد صنف TypeScript عادي.' },

    { t: 'h2', text: 'المكوّنات المستقلّة (Standalone)' },
    { t: 'p', text: 'في الإصدارات القديمة كان كل مكوّن يجب تسجيله في «وحدة» `NgModule` — طبقة تعقيد إضافية أربكت المبتدئين. منذ Angular 17 صارت **المكوّنات المستقلّة** هي الافتراضية: كل مكوّن يعلن اعتمادياته بنفسه في `imports`.' },
    { t: 'code', lang: 'ts', code: `
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],  // ما يحتاجه هذا المكوّن
  templateUrl: './product-list.component.html'
})
export class ProductListComponent { }` },
    { t: 'tip', text: 'إن وجدت شروحاً قديمة تتحدّث عن `app.module.ts` و `declarations` فهي لإصدارات سابقة. المسار هنا يتبع الأسلوب المستقلّ الحديث.' },

    { t: 'h2', text: 'اللبنات المعمارية' },
    { t: 'table', head: ['اللبنة', 'مسؤوليتها', 'مثال'], rows: [
      ['**المكوّن** (Component)', 'قطعة واجهة: قالب + أنماط + منطق عرض', 'بطاقة منتج، شريط تنقّل'],
      ['**القالب** (Template)', 'HTML مع صياغة Angular للربط', '`{{ title }}` و `*ngIf`'],
      ['**الخدمة** (Service)', 'منطق قابل لإعادة الاستخدام وجلب البيانات', '`ProductService`'],
      ['**حقن الاعتماديات** (DI)', 'تسليم الخدمات للمكوّنات تلقائياً', '`inject(ProductService)`'],
      ['**التوجيه** (Directive)', 'يغيّر سلوك عنصر أو مظهره', '`*ngIf`, `[ngClass]`'],
      ['**الأنبوب** (Pipe)', 'يحوّل قيمة عند العرض', '`{{ price | currency }}`'],
      ['**الموجّه** (Router)', 'يربط العناوين بالمكوّنات', '`/products` ← ProductList']
    ]},

    { t: 'h2', text: 'أوامر CLI التي ستستخدمها يومياً' },
    { t: 'code', lang: 'bash', code: `
ng serve                      # تشغيل خادم التطوير
ng generate component header  # توليد مكوّن (اختصار: ng g c header)
ng g c products/product-card  # داخل مجلد فرعي
ng g s services/product       # توليد خدمة
ng g p pipes/truncate         # توليد أنبوب
ng g d directives/highlight   # توليد توجيه
ng build                      # بناء الإنتاج في dist/
ng test                       # تشغيل اختبارات الوحدة
ng update                     # ترقية Angular` },
    { t: 'p', text: 'أمر `ng g c header` وحده ينشئ أربعة ملفات، ويسجّل المكوّن، ويتّبع اصطلاحات التسمية. هذه القوة هي سبب اتّساق مشاريع Angular.' },
    { t: 'demo', title: 'مخرجات أمر التوليد', height: 200,
      css: 'pre{background:#0f1729;color:#e2e8f0;padding:14px;border-radius:10px;direction:ltr;text-align:left;font-family:monospace;font-size:.86em;line-height:1.9;margin:0;overflow-x:auto}.g{color:#86efac}',
      html: '<pre>$ ng g c components/header\n<span class="g">CREATE</span> src/app/components/header/header.component.html\n<span class="g">CREATE</span> src/app/components/header/header.component.spec.ts\n<span class="g">CREATE</span> src/app/components/header/header.component.ts\n<span class="g">CREATE</span> src/app/components/header/header.component.css</pre>' },

    { t: 'h2', text: 'دورة حياة التطبيق' },
    { t: 'steps', items: [
      'المتصفح يحمّل `index.html` وفيها `<app-root>` فارغ.',
      'يُنفَّذ `main.ts` فيقلع التطبيق بـ `bootstrapApplication`.',
      'يُنشئ Angular نسخة من `AppComponent` ويربطها بالوسم.',
      'يُعالَج القالب: تُقيَّم التعابير وتُطبَّق التوجيهات.',
      'يُرسم الناتج داخل `<app-root>`.',
      'عند تغيّر أي بيانات، يكتشف Angular التغيير ويحدّث الأجزاء المتأثّرة فقط.'
    ]},

    { t: 'exercise',
      title: 'تمرين: أول مشروع Angular',
      brief: 'أنشئ مشروعاً وعدّل المكوّن الجذر ليعرض بيانات شخصية.',
      requirements: [
        'أنشئ مشروعاً باسم `my-portfolio` مع التوجيه و SCSS.',
        'شغّله وتأكّد من ظهوره على المنفذ 4200.',
        'في `AppComponent` عرّف: `fullName` و `job` و `city` و `yearsExperience`.',
        'أضف خاصية محسوبة `get startYear()` تحسب سنة البداية.',
        'في القالب اعرض كل هذه القيم بصياغة الربط `{{ }}`.',
        'ولّد مكوّناً جديداً باسم `header` بأمر CLI ولاحظ الملفات الأربعة.',
        'أضف وسم `<app-header>` داخل قالب `AppComponent` (تذكّر إضافته إلى `imports`).'
      ],
      hints: [
        'لاستخدام مكوّن داخل آخر، أضفه إلى مصفوفة `imports` في `@Component`.',
        '`get` في TypeScript تعرّف خاصية محسوبة تُستدعى بلا أقواس في القالب.',
        'إن ظهر خطأ «is not a known element» فغالباً نسيت `imports`.'
      ],
      solution: { lang: 'ts', title: 'app.component.ts', code: `
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  fullName = 'سارة عبدالله';
  job = 'مطوّرة واجهات أمامية';
  city = 'الرياض';
  yearsExperience = 3;

  get startYear(): number {
    return new Date().getFullYear() - this.yearsExperience;
  }
}` },
      solutionNote: 'القالب: `<app-header></app-header>` ثم `<h1>{{ fullName }}</h1>` و `<p>{{ job }} — {{ city }}</p>` و `<p>بدأت عام {{ startYear }}</p>`.'
    },

    { t: 'quiz', items: [
      { q: 'ما الفرق الجوهري بين Angular و React؟', options: ['لا فرق', 'Angular إطار متكامل يأتي بكل الأدوات، وReact مكتبة واجهة فقط', 'React أحدث', 'Angular لا يدعم المكوّنات'], answer: 1,
        explain: 'Angular يوفّر التوجيه و HTTP والنماذج و DI مدمجة؛ React تتركها لاختيارك.' },
      { q: 'ما وظيفة المزخرف `@Component`؟', options: ['ينشئ صنفاً', 'يضيف بيانات وصفية تخبر Angular أن هذا الصنف مكوّن وما وسمه وقالبه', 'يستورد مكتبة', 'ينسّق الكود'], answer: 1,
        explain: 'بدونه يبقى الصنف صنف TypeScript عادياً لا يعرفه Angular.' },
      { q: 'ماذا يعني `standalone: true`؟', options: ['أن المكوّن لا يعتمد على شيء', 'أن المكوّن يعلن اعتمادياته بنفسه دون الحاجة إلى NgModule', 'أنه لا يُستخدم إلا مرة', 'أنه للاختبار فقط'], answer: 1,
        explain: 'الأسلوب الحديث الافتراضي منذ Angular 17؛ يغني عن طبقة الوحدات.' },
      { q: 'ما الأمر الذي يولّد مكوّناً جديداً؟', options: ['`ng new component`', '`ng g c name`', '`ng create c`', '`npm component`'], answer: 1,
        explain: '`ng generate component` واختصاره `ng g c` ينشئ الملفات الأربعة ويتّبع الاصطلاحات.' },
      { q: 'أين يُرسم تطبيق Angular في الصفحة؟', options: ['في `<body>` مباشرة', 'داخل وسم المكوّن الجذر `<app-root>`', 'في ملف منفصل', 'في iframe'], answer: 1,
        explain: '`index.html` تحوي وسم المكوّن الجذر، وAngular يملؤه عند الإقلاع.' }
    ]}
  ]
};
