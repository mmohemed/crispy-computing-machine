'use strict';

module.exports = {
  slug: '02-components-templates',
  title: 'المكوّنات والقوالب',
  summary: 'بنية المكوّن الكامل، وكتابة القوالب، وعزل الأنماط، ودورة حياة المكوّن.',
  duration: 45,
  level: 'مبتدئ',
  tags: ['المكوّنات', 'القوالب'],
  objectives: [
    'تنشئ مكوّناً وتفهم أجزاءه الأربعة.',
    'تكتب قوالب تعرض بيانات الصنف.',
    'تفهم عزل الأنماط وكيف يعمل.',
    'تستخدم خطّافات دورة الحياة الأساسية.',
    'تنظّم مكوّناتك في مجلدات منطقية.'
  ],
  quickRef: [
    { code: '@Component({ … })', desc: 'مزخرف تعريف المكوّن' },
    { code: 'selector', desc: 'اسم الوسم الذي يمثّل المكوّن' },
    { code: 'template / templateUrl', desc: 'القالب مضمّناً أو في ملف' },
    { code: 'styles / styleUrl', desc: 'الأنماط المعزولة' },
    { code: 'ngOnInit()', desc: 'يُستدعى بعد التهيئة' },
    { code: 'ngOnDestroy()', desc: 'يُستدعى قبل الإزالة' }
  ],
  blocks: [
    { t: 'h2', text: 'تشريح المكوّن' },
    { t: 'p', text: 'كل مكوّن في Angular يتكوّن من أربعة أجزاء: **صنف** يحمل البيانات والمنطق، و**قالب** يصف الشكل، و**أنماط** معزولة، و**مزخرف** يربط الثلاثة.' },
    { t: 'code', lang: 'ts', title: 'product-card.component.ts', code: `
import { Component } from '@angular/core';

@Component({
  selector: 'app-product-card',     // اسم الوسم
  standalone: true,
  imports: [],                       // ما يحتاجه القالب
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  // الحقول: بيانات المكوّن
  name = 'سماعة لاسلكية';
  price = 299;
  inStock = true;

  // خاصية محسوبة
  get priceWithVat(): number {
    return Math.round(this.price * 1.15);
  }

  // دالة: منطق المكوّن
  addToCart(): void {
    console.log('أُضيف:', this.name);
  }
}` },
    { t: 'code', lang: 'html', title: 'product-card.component.html', code: `
<article class="card">
  <h3>{{ name }}</h3>
  <p class="price">{{ price }} ريالاً</p>
  <p class="vat">شامل الضريبة: {{ priceWithVat }} ريالاً</p>
  <button (click)="addToCart()" [disabled]="!inStock">
    {{ inStock ? 'أضف إلى السلة' : 'غير متوفّر' }}
  </button>
</article>` },
    { t: 'demo', title: 'النتيجة', height: 250,
      css: '.card{border:1px solid #e2e8f0;border-radius:12px;padding:16px;max-width:280px}h3{margin:0 0 8px}.price{font-weight:800;color:#dd0031;margin:0 0 4px}.vat{color:#64748b;font-size:.9em;margin:0 0 12px}button{background:#dd0031;color:#fff;border:0;border-radius:8px;padding:10px 20px;cursor:pointer;font-family:inherit}',
      html: '<article class="card"><h3>سماعة لاسلكية</h3><p class="price">299 ريالاً</p><p class="vat">شامل الضريبة: 344 ريالاً</p><button>أضف إلى السلة</button></article>' },

    { t: 'h2', text: 'قالب مضمّن أم ملف منفصل؟' },
    { t: 'code', lang: 'ts', title: 'مضمّن — للمكوّنات الصغيرة جداً', code: `
@Component({
  selector: 'app-badge',
  standalone: true,
  template: \`
    <span class="badge">{{ text }}</span>
  \`,
  styles: [\`
    .badge {
      padding: 4px 12px;
      border-radius: 99px;
      background: #fee;
      color: #dd0031;
    }
  \`]
})
export class BadgeComponent {
  text = 'جديد';
}` },
    { t: 'p', text: 'القاعدة العملية: إن تجاوز القالب **15 سطراً** انقله إلى ملف منفصل. الملفات المنفصلة تستفيد من تلوين المحرّر وأدواته بشكل أفضل.' },

    { t: 'h2', text: 'عزل الأنماط' },
    { t: 'p', text: 'ميزة قوية جداً: الأنماط المكتوبة في ملف مكوّن **لا تتسرّب** إلى بقية التطبيق. لو كتبت `h3 { color: red }` في `product-card.component.css` فلن يتأثّر أي `h3` خارج هذا المكوّن.' },
    { t: 'code', lang: 'html', title: 'كيف يحقّق Angular ذلك', code: `
<!-- ما تكتبه -->
<h3>عنوان</h3>

<!-- ما يولّده Angular فعلياً -->
<h3 _ngcontent-abc123>عنوان</h3>

<!-- والقاعدة تصبح -->
h3[_ngcontent-abc123] { color: red; }` },
    { t: 'p', text: 'سمة فريدة تُضاف لكل عنصر داخل المكوّن، وتُضاف إلى كل محدّد في أنماطه. هكذا يتحقّق العزل دون أن تكتب أنت أي شيء إضافي.' },
    { t: 'code', lang: 'css', title: 'تجاوز العزل عند الحاجة', code: `
/* تنسيق عنصر داخل مكوّن ابن (استخدمه بحذر) */
:host ::ng-deep .child-class {
  color: red;
}

/* تنسيق العنصر المضيف نفسه */
:host {
  display: block;
  margin-bottom: 16px;
}

/* حسب حالة المضيف */
:host(.featured) {
  border-color: gold;
}` },
    { t: 'warn', text: '`::ng-deep` مهملة رسمياً وتكسر العزل. استخدمها كملاذ أخير فقط، ويفضَّل بدلاً منها تمرير الأنماط عبر متغيّرات CSS أو `@Input`.' },

    { t: 'h2', text: 'صياغة القالب' },
    { t: 'table', head: ['الصياغة', 'الاتجاه', 'المعنى'], rows: [
      ['`{{ value }}`', 'صنف ← قالب', 'إقحام قيمة نصية'],
      ['`[prop]="value"`', 'صنف ← قالب', 'ربط خاصية عنصر'],
      ['`(event)="fn()"`', 'قالب ← صنف', 'الاستماع لحدث'],
      ['`[(ngModel)]="x"`', 'الاتجاهان', 'ربط ثنائي'],
      ['`#ref`', 'داخل القالب', 'مرجع لعنصر'],
      ['`@if / @for`', 'داخل القالب', 'التحكّم في التدفّق (Angular 17+)']
    ]},
    { t: 'code', lang: 'html', code: `
<!-- إقحام -->
<h1>{{ title }}</h1>
<p>{{ 2 + 3 }}</p>
<p>{{ user.name.toUpperCase() }}</p>

<!-- ربط خاصية -->
<img [src]="imageUrl" [alt]="imageAlt">
<button [disabled]="isLoading">إرسال</button>
<div [class.active]="isActive">…</div>
<div [style.width.px]="barWidth">…</div>

<!-- حدث -->
<button (click)="save()">حفظ</button>
<input (input)="onType($event)">
<form (submit)="onSubmit($event)">…</form>

<!-- مرجع قالب -->
<input #searchBox>
<button (click)="search(searchBox.value)">بحث</button>` },
    { t: 'warn', title: 'تجنّب المنطق الثقيل في القالب', text: 'التعابير في القالب تُقيَّم عند **كل** دورة كشف تغيير. تعبير مثل `{{ items.filter(…).map(…).length }}` يُنفَّذ عشرات المرات في الثانية. انقل الحساب إلى خاصية محسوبة أو إشارة.' },

    { t: 'h2', text: 'دورة حياة المكوّن' },
    { t: 'p', text: 'يمرّ المكوّن بمراحل، ويمنحك Angular «خطّافات» (Hooks) للتدخّل في كل مرحلة.' },
    { t: 'table', head: ['الخطّاف', 'متى يُستدعى', 'استخدمه لـ'], rows: [
      ['`ngOnInit`', 'مرة واحدة بعد تهيئة المدخلات', '**الأكثر استخداماً**: جلب البيانات الأولية'],
      ['`ngOnChanges`', 'عند تغيّر أي `@Input`', 'الاستجابة لتغيّر بيانات قادمة من الأب'],
      ['`ngAfterViewInit`', 'بعد رسم القالب', 'الوصول إلى عناصر DOM'],
      ['`ngOnDestroy`', 'قبل إزالة المكوّن', '**مهم**: تنظيف الاشتراكات والمؤقّتات']
    ]},
    { t: 'code', lang: 'ts', code: `
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({ /* … */ })
export class TimerComponent implements OnInit, OnDestroy {
  seconds = 0;
  private timerId?: number;

  ngOnInit(): void {
    this.timerId = window.setInterval(() => this.seconds++, 1000);
  }

  ngOnDestroy(): void {
    // بدون هذا السطر يستمر المؤقّت بعد إزالة المكوّن — تسريب ذاكرة
    if (this.timerId) clearInterval(this.timerId);
  }
}` },
    { t: 'danger', title: 'أشهر تسريب في Angular', text: 'نسيان إلغاء الاشتراكات والمؤقّتات في `ngOnDestroy`. المكوّن يختفي من الشاشة لكن كوده يستمر بالعمل في الخلفية، فيتراكم مع كل تنقّل حتى يبطؤ التطبيق.' },
    { t: 'note', text: 'لماذا لا نستخدم `constructor` بدل `ngOnInit`؟ لأن المدخلات `@Input` لا تكون جاهزة بعد في المُنشئ. اجعل المُنشئ للحقن فقط، والتهيئة في `ngOnInit`.' },

    { t: 'h2', text: 'تنظيم المكوّنات' },
    { t: 'code', lang: 'text', noCopy: true, code: `
src/app/
├── core/                 خدمات تُنشأ مرة واحدة
│   └── services/
├── shared/               مكوّنات مشتركة قابلة لإعادة الاستخدام
│   ├── button/
│   ├── card/
│   └── spinner/
├── features/             ميزات التطبيق
│   ├── products/
│   │   ├── product-list/
│   │   ├── product-card/
│   │   └── product.service.ts
│   └── cart/
├── app.component.ts
└── app.routes.ts` },
    { t: 'ul', items: [
      '**مكوّن العرض** (Presentational): يستقبل بيانات ويعرضها فقط — قابل لإعادة الاستخدام وسهل الاختبار.',
      '**مكوّن الحاوية** (Container): يجلب البيانات من الخدمات ويوزّعها على مكوّنات العرض.',
      'هذا الفصل يجعل معظم مكوّناتك بسيطة وقابلة للاختبار بلا اعتماديات.'
    ]},

    { t: 'exercise',
      title: 'تمرين: مكوّن بطاقة درس',
      brief: 'أنشئ مكوّناً يعرض بطاقة درس تعليمي بأنماط معزولة.',
      requirements: [
        'ولّد المكوّن بـ `ng g c shared/lesson-card`.',
        'في الصنف: `title` و `durationMinutes` و `level` و `isCompleted`.',
        'خاصية محسوبة `durationLabel` تحوّل الدقائق إلى «س:د» إن تجاوزت 60.',
        'في القالب: العنوان، المدة، شارة المستوى، وزر يتغيّر نصه بحسب `isCompleted`.',
        'ربط صنف CSS بالحالة: `[class.done]="isCompleted"`.',
        'دالة `toggleComplete()` تبدّل الحالة عند النقر.',
        'أنماط معزولة، مع `:host { display: block; }`.',
        'أضف `ngOnInit` يطبع رسالة في وحدة التحكّم.'
      ],
      hints: [
        '`Math.floor` و `%` لتحويل الدقائق.',
        '`[class.done]` تضيف الصنف حين يكون التعبير صحيحاً.',
        '`:host` تستهدف وسم المكوّن نفسه.'
      ],
      solution: { lang: 'ts', code: `
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lesson-card',
  standalone: true,
  template: \`
    <article class="card" [class.done]="isCompleted">
      <h3>{{ title }}</h3>
      <p class="meta">
        <span>{{ durationLabel }}</span>
        <span class="badge">{{ level }}</span>
      </p>
      <button (click)="toggleComplete()">
        {{ isCompleted ? 'تم الإكمال ✓' : 'تعليم كمكتمل' }}
      </button>
    </article>
  \`,
  styles: [\`
    :host { display: block; margin-bottom: 12px; }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
    }
    .card.done { border-color: #10b981; background: #f0fdf4; }
    h3 { margin: 0 0 8px; }
    .meta { display: flex; gap: 12px; color: #64748b; font-size: .9rem; }
    .badge { background: #fee; color: #dd0031; padding: 2px 10px; border-radius: 99px; }
    button { margin-top: 12px; padding: 8px 18px; cursor: pointer; }
  \`]
})
export class LessonCardComponent implements OnInit {
  title = 'المكوّنات والقوالب';
  durationMinutes = 75;
  level = 'مبتدئ';
  isCompleted = false;

  get durationLabel(): string {
    if (this.durationMinutes < 60) return \`\${this.durationMinutes} دقيقة\`;
    const h = Math.floor(this.durationMinutes / 60);
    const m = this.durationMinutes % 60;
    return m ? \`\${h} س و \${m} د\` : \`\${h} ساعة\`;
  }

  ngOnInit(): void {
    console.log('تهيئة بطاقة الدرس:', this.title);
  }

  toggleComplete(): void {
    this.isCompleted = !this.isCompleted;
  }
}` } },

    { t: 'quiz', items: [
      { q: 'ما الذي يحقّق عزل أنماط المكوّن؟', options: ['iframe', 'سمة فريدة تُضاف للعناصر وللمحدّدات تلقائياً', 'ملف CSS منفصل', 'استخدام id'], answer: 1,
        explain: 'Angular يضيف سمة مثل `_ngcontent-abc` لعناصر المكوّن ويقيّد بها محدّداته.' },
      { q: 'أين تضع كود جلب البيانات الأولية؟', options: ['في المُنشئ', 'في `ngOnInit`', 'في `ngOnDestroy`', 'في القالب'], answer: 1,
        explain: 'المدخلات `@Input` غير جاهزة في المُنشئ؛ `ngOnInit` يُستدعى بعد تهيئتها.' },
      { q: 'لماذا يجب تنظيف المؤقّتات في `ngOnDestroy`؟', options: ['لتحسين المظهر', 'لأنها تستمر بالعمل بعد إزالة المكوّن فتسبّب تسريب ذاكرة', 'لأن Angular يتطلّب ذلك', 'لتسريع البناء'], answer: 1,
        explain: 'المكوّن يختفي لكن المؤقّت يبقى؛ تتراكم المؤقّتات مع كل تنقّل.' },
      { q: 'ما معنى `[class.active]="isActive"`؟', options: ['يضيف الصنف دائماً', 'يضيف الصنف active حين يكون isActive صحيحاً', 'ينشئ صنفاً جديداً', 'يحذف كل الأصناف'], answer: 1,
        explain: 'ربط صنف شرطي: يُضاف ويُزال تلقائياً بحسب قيمة التعبير.' },
      { q: 'لماذا نتجنّب الحسابات الثقيلة في القالب؟', options: ['لأنها غير مدعومة', 'لأنها تُعاد عند كل دورة كشف تغيير فتؤثّر في الأداء', 'لأنها تسبّب أخطاء', 'لأنها تكسر العزل'], answer: 1,
        explain: 'التعابير تُقيَّم مراراً؛ انقل الحساب إلى خاصية محسوبة أو إشارة.' }
    ]}
  ]
};
