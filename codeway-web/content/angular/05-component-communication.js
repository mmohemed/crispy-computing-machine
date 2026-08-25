'use strict';

module.exports = {
  slug: '05-component-communication',
  title: 'التواصل بين المكوّنات',
  summary: 'تمرير البيانات من الأب للابن بـ input، وإبلاغ الأب بالأحداث عبر output، وإسقاط المحتوى بـ ng-content.',
  duration: 45,
  level: 'متوسط',
  tags: ['المكوّنات', 'التواصل'],
  objectives: [
    'تمرّر بيانات إلى مكوّن ابن.',
    'تُبلغ الأب بحدث من الابن.',
    'تستخدم `ng-content` لإسقاط المحتوى.',
    'تفهم متى تحتاج خدمة بدل التمرير المباشر.',
    'تصمّم واجهة مكوّن واضحة وقابلة لإعادة الاستخدام.'
  ],
  quickRef: [
    { code: 'input()', desc: 'مدخل من الأب (Signal API)' },
    { code: 'input.required<T>()', desc: 'مدخل إلزامي' },
    { code: 'output()', desc: 'مخرج نحو الأب' },
    { code: 'emit(value)', desc: 'إطلاق الحدث' },
    { code: '<ng-content />', desc: 'إسقاط المحتوى' },
    { code: 'select="[slot]"', desc: 'إسقاط انتقائي' }
  ],
  blocks: [
    { t: 'h2', text: 'اتجاهات التواصل' },
    { t: 'p', text: 'المكوّنات تشكّل شجرة، والتواصل بينها يتّبع قواعد واضحة. معرفتها تمنع أشهر أخطاء البنية في Angular.' },
    { t: 'demo', title: 'خريطة التواصل', height: 300,
      css: '.n{border:2px solid #dd0031;border-radius:10px;padding:8px 16px;background:#fee;font-weight:700;display:inline-block}.row{display:flex;justify-content:center;gap:16px;margin:8px 0}.a{text-align:center;color:#dd0031;font-weight:700;font-size:.9em}small{display:block;font-weight:400;color:#64748b;font-size:.75em}',
      html: '<div style="text-align:center"><div class="n">Parent<small>يملك البيانات</small></div></div><div class="a">↓ input() &nbsp;&nbsp;&nbsp; ↑ output()</div><div class="row"><div class="n">ChildA</div><div class="n">ChildB</div></div><p style="text-align:center;color:#64748b;font-size:.88em;margin-top:14px">للتواصل بين ChildA و ChildB: عبر الأب، أو عبر <b>خدمة مشتركة</b></p>' },

    { t: 'h2', text: 'من الأب إلى الابن: `input()`' },
    { t: 'p', text: 'منذ Angular 17.1 صار المدخل يُعرَّف بدالة `input()` القائمة على الإشارات — أوضح وأكثر أماناً من المزخرف القديم `@Input()`.' },
    { t: 'code', lang: 'ts', title: 'المكوّن الابن', code: `
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: \`
    <article class="card">
      <h3>{{ name() }}</h3>
      <p>{{ price() }} ريالاً</p>
      @if (badge()) {
        <span class="badge">{{ badge() }}</span>
      }
    </article>
  \`
})
export class ProductCardComponent {
  // مدخل إلزامي — خطأ ترجمة إن لم يُمرَّر
  name = input.required<string>();

  // مدخل إلزامي رقمي
  price = input.required<number>();

  // مدخل اختياري بقيمة افتراضية
  badge = input<string>('');

  // مدخل باسم مختلف في القالب
  isNew = input<boolean>(false, { alias: 'new' });
}` },
    { t: 'code', lang: 'html', title: 'المكوّن الأب', code: `
<app-product-card
  [name]="product.name"
  [price]="product.price"
  badge="الأكثر مبيعاً"
  [new]="true" />` },
    { t: 'note', title: 'قيمة أم نص؟', text: '`badge="الأكثر مبيعاً"` بلا أقواس تمرّر **نصاً حرفياً**. أما `[price]="product.price"` بالأقواس فتمرّر **قيمة التعبير**. الخلط بينهما خطأ شائع: `[badge]="الأكثر مبيعاً"` سيبحث عن متغيّر بهذا الاسم فلا يجده.' },
    { t: 'code', lang: 'ts', title: 'الصياغة القديمة للمقارنة', code: `
import { Component, Input } from '@angular/core';

export class ProductCardComponent {
  @Input({ required: true }) name!: string;
  @Input() price = 0;
}` },
    { t: 'tip', text: 'ستجد `@Input()` في معظم الشروح والمشاريع القائمة، فاعرفها. لكن استخدم `input()` في الكود الجديد: يعمل مع الإشارات وأنواعه أدقّ.' },

    { t: 'h3', text: 'تمرير كائن كامل' },
    { t: 'code', lang: 'ts', code: `
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Component({ /* … */ })
export class ProductCardComponent {
  product = input.required<Product>();

  // خاصية محسوبة من المدخل
  isAvailable = computed(() => this.product().stock > 0);
}` },
    { t: 'p', text: 'تمرير كائن واحد أنظف من عشرة مدخلات منفصلة، لكن انتبه: يجعل المكوّن مرتبطاً ببنية بيانات محدّدة، فيقلّ قابليته لإعادة الاستخدام في سياق آخر.' },

    { t: 'h2', text: 'من الابن إلى الأب: `output()`' },
    { t: 'p', text: 'الابن **لا يعدّل** بيانات أبيه مباشرة. بدلاً من ذلك يطلق حدثاً، والأب يقرّر ماذا يفعل. هذا يحافظ على وضوح مصدر الحقيقة.' },
    { t: 'code', lang: 'ts', title: 'الابن يطلق الحدث', code: `
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: \`
    <article class="card">
      <h3>{{ product().name }}</h3>
      <button (click)="onAdd()">أضف إلى السلة</button>
      <button (click)="removed.emit(product().id)">حذف</button>
    </article>
  \`
})
export class ProductCardComponent {
  product = input.required<Product>();

  // حدث يحمل بيانات
  added = output<Product>();
  removed = output<number>();

  // حدث بلا بيانات
  clicked = output<void>();

  onAdd(): void {
    this.added.emit(this.product());
  }
}` },
    { t: 'code', lang: 'html', title: 'الأب يستمع', code: `
<app-product-card
  [product]="p"
  (added)="addToCart($event)"
  (removed)="deleteProduct($event)"
  (clicked)="openDetails()" />` },
    { t: 'code', lang: 'ts', code: `
addToCart(product: Product): void {
  this.cart.push(product);
}

deleteProduct(id: number): void {
  this.products = this.products.filter(p => p.id !== id);
}` },
    { t: 'warn', title: '`$event` ليس حدث DOM هنا', text: 'في المخرجات المخصّصة، `$event` هو **القيمة التي مرّرتها إلى `emit()`** لا كائن حدث المتصفح. إن أطلقت `emit(product)` فإن `$event` هو المنتج نفسه.' },

    { t: 'h2', text: 'المدخلات ثنائية الاتجاه: `model()`' },
    { t: 'code', lang: 'ts', code: `
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <button (click)="dec()">−</button>
    <span>{{ value() }}</span>
    <button (click)="inc()">+</button>
  \`
})
export class CounterComponent {
  value = model.required<number>();

  inc(): void { this.value.update(v => v + 1); }
  dec(): void { this.value.update(v => v - 1); }
}` },
    { t: 'code', lang: 'html', code: '<app-counter [(value)]="quantity" />' },
    { t: 'p', text: '`model()` تنشئ مدخلاً ومخرجاً معاً، فتحصل على الربط الثنائي في مكوّناتك الخاصة تماماً كـ `ngModel`.' },

    { t: 'h2', text: 'إسقاط المحتوى: `ng-content`' },
    { t: 'p', text: 'ماذا لو أردت مكوّن «بطاقة» يعمل مع **أي** محتوى؟ لا تمرّر المحتوى كنص عبر مدخل — بل افتح «فتحة» يضع فيها الأب ما يشاء.' },
    { t: 'code', lang: 'ts', title: 'مكوّن البطاقة', code: `
@Component({
  selector: 'app-card',
  standalone: true,
  template: \`
    <div class="card">
      <ng-content />
    </div>
  \`,
  styles: [\`
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 20px;
    }
  \`]
})
export class CardComponent {}` },
    { t: 'code', lang: 'html', title: 'الاستخدام', code: `
<app-card>
  <h3>عنوان</h3>
  <p>أي محتوى تريده هنا.</p>
  <button>زر</button>
</app-card>` },

    { t: 'h3', text: 'الإسقاط الانتقائي' },
    { t: 'code', lang: 'html', title: 'قالب المكوّن', code: `
<div class="card">
  <header>
    <ng-content select="[card-title]" />
  </header>

  <div class="body">
    <ng-content />
  </div>

  <footer>
    <ng-content select="[card-actions]" />
  </footer>
</div>` },
    { t: 'code', lang: 'html', title: 'الاستخدام', code: `
<app-card>
  <h3 card-title>تفاصيل الطلب</h3>

  <p>سيصل طلبك خلال ثلاثة أيام عمل.</p>

  <div card-actions>
    <button>تتبّع</button>
    <button>إلغاء</button>
  </div>
</app-card>` },
    { t: 'demo', title: 'بطاقة بثلاث فتحات', height: 280,
      css: '.card{border:1px solid #e2e8f0;border-radius:14px;overflow:hidden}header{background:#fee;padding:12px 16px;font-weight:800;color:#dd0031}.body{padding:16px}footer{background:#f8fafc;padding:12px 16px;display:flex;gap:8px;border-top:1px solid #e2e8f0}button{padding:8px 16px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;cursor:pointer;font-family:inherit}',
      html: '<div class="card"><header>تفاصيل الطلب</header><div class="body"><p style="margin:0">سيصل طلبك خلال ثلاثة أيام عمل.</p></div><footer><button>تتبّع</button><button>إلغاء</button></footer></div>' },
    { t: 'tip', text: 'محدّد `select` يقبل أي محدّد CSS: `select="h3"` أو `select=".actions"` أو `select="[card-title]"`. الأخير (السمة) هو الأوضح لأنه يعلن النية صراحةً.' },

    { t: 'h2', text: 'متى لا يكفي التمرير المباشر؟' },
    { t: 'p', text: 'تمرير البيانات عبر خمسة مستويات من المكوّنات يُسمّى **حفر الخصائص** (Prop drilling): مكوّنات وسيطة تستقبل بيانات لا تستخدمها لتمرّرها فقط. إنها إشارة إلى أنك تحتاج حلاً آخر.' },
    { t: 'table', head: ['الحالة', 'الحل المناسب'], rows: [
      ['أب وابن مباشر', '`input()` و `output()`'],
      ['أخوان بينهما أب مشترك قريب', 'رفع الحالة إلى الأب'],
      ['مكوّنات متباعدة في الشجرة', '**خدمة مشتركة** (الدرس القادم)'],
      ['حالة عامة للتطبيق كله', 'خدمة + إشارات، أو مكتبة إدارة حالة'],
      ['محتوى مرن غير معروف مسبقاً', '`ng-content`']
    ]},

    { t: 'h2', text: 'تصميم واجهة مكوّن جيدة' },
    { t: 'ol', items: [
      '**مدخلات قليلة وواضحة**: أكثر من 6-7 مدخلات علامة على أن المكوّن يفعل أكثر من اللازم.',
      '**أسماء معبّرة**: `isDisabled` لا `flag`، و`itemSelected` لا `evt`.',
      '**مخرجات بصيغة الماضي**: `saved` و `deleted` — تصف ما **حدث** لا ما يجب فعله.',
      '**لا تعدّل المدخلات**: المدخل ملك للأب؛ عدّل نسخة أو أطلق حدثاً.',
      '**قيم افتراضية معقولة** لكل مدخل اختياري.'
    ]},
    { t: 'compare', lang: 'ts', bad: {
      code: '// الابن يعدّل مدخله مباشرة\nonToggle() {\n  this.product().stock = 0;\n}',
      why: 'تعديل بيانات يملكها الأب من الابن — يفسد وضوح مصدر الحقيقة ويصعّب التتبّع.'
    }, good: {
      code: '// الابن يبلّغ والأب يقرّر\nonToggle() {\n  this.stockChanged.emit(0);\n}',
      why: 'الابن يعلن ما حدث، والأب — مالك البيانات — هو من يعدّلها.'
    }},

    { t: 'exercise',
      title: 'تمرين: مكوّن تقييم بالنجوم',
      brief: 'ابنِ مكوّن تقييم قابلاً لإعادة الاستخدام يتواصل مع أبيه في الاتجاهين.',
      requirements: [
        'مكوّن `app-star-rating` بمدخلات: `rating` (إلزامي)، `max` (افتراضي 5)، `readonly` (افتراضي false).',
        'مخرج `ratingChange` يُطلق التقييم الجديد عند النقر.',
        'المكوّن يعرض نجوماً ممتلئة بعدد `rating` وفارغة للباقي.',
        'إن كان `readonly` صحيحاً فلا يستجيب للنقر.',
        'أنشئ مكوّن `app-review-card` يستخدمه ويعرض اسم المراجع ونصّ المراجعة.',
        'المكوّن الأب يعرض ثلاث مراجعات ويطبع في وحدة التحكّم عند تغيّر أي تقييم.',
        'استخدم `ng-content` في `app-review-card` لإسقاط نص المراجعة.',
        'أضف نسخة ثنائية الاتجاه بـ `model()` واستخدمها في مثال منفصل.'
      ],
      hints: [
        '`Array.from({ length: max() }, (_, i) => i + 1)` لتوليد مصفوفة النجوم.',
        'استخدم `@if (!readonly())` لتعطيل النقر.',
        'المخرجات تُسمّى بصيغة الماضي أو بلاحقة `Change` للربط الثنائي.'
      ],
      solution: { lang: 'ts', code: `
import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: \`
    <div class="stars" [class.readonly]="readonly()">
      @for (star of stars(); track star) {
        <button
          type="button"
          class="star"
          [class.filled]="star <= rating()"
          [disabled]="readonly()"
          (click)="select(star)"
          [attr.aria-label]="'تقييم ' + star + ' من ' + max()">
          ★
        </button>
      }
      <span class="value">{{ rating() }} / {{ max() }}</span>
    </div>
  \`,
  styles: [\`
    .stars { display: flex; align-items: center; gap: 2px; }
    .star {
      background: none; border: 0; cursor: pointer;
      font-size: 1.5rem; color: #cbd5e1; padding: 0 2px;
    }
    .star.filled { color: #f59e0b; }
    .readonly .star { cursor: default; }
    .value { margin-inline-start: 8px; color: #64748b; font-size: .9rem; }
  \`]
})
export class StarRatingComponent {
  rating = input.required<number>();
  max = input<number>(5);
  readonly = input<boolean>(false);

  ratingChange = output<number>();

  stars = computed(() =>
    Array.from({ length: this.max() }, (_, i) => i + 1)
  );

  select(value: number): void {
    if (this.readonly()) return;
    this.ratingChange.emit(value);
  }
}

/* ---------- بطاقة المراجعة ---------- */

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [StarRatingComponent],
  template: \`
    <article class="review">
      <header>
        <strong>{{ author() }}</strong>
        <app-star-rating
          [rating]="rating()"
          [readonly]="true" />
      </header>

      <div class="body">
        <ng-content />
      </div>
    </article>
  \`
})
export class ReviewCardComponent {
  author = input.required<string>();
  rating = input.required<number>();
}

/* ---------- الأب ---------- */

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [ReviewCardComponent, StarRatingComponent],
  template: \`
    <h2>آراء العملاء</h2>

    @for (r of reviews; track r.id) {
      <app-review-card [author]="r.author" [rating]="r.rating">
        {{ r.text }}
      </app-review-card>
    }

    <h3>قيّم المنتج</h3>
    <app-star-rating
      [rating]="myRating"
      (ratingChange)="onRate($event)" />
  \`
})
export class ReviewsComponent {
  myRating = 0;

  reviews = [
    { id: 1, author: 'سارة', rating: 5, text: 'جودة ممتازة وسرعة في التوصيل.' },
    { id: 2, author: 'خالد', rating: 4, text: 'جيد جداً لكن البطارية أقل من المتوقّع.' },
    { id: 3, author: 'نورة', rating: 3, text: 'مقبول مقابل السعر.' }
  ];

  onRate(value: number): void {
    this.myRating = value;
    console.log('التقييم الجديد:', value);
  }
}` },
      solutionNote: 'النسخة ثنائية الاتجاه: استبدل `rating`/`ratingChange` بـ `rating = model.required<number>()` واستخدمها بـ `[(rating)]="myRating"`.'
    },

    { t: 'quiz', items: [
      { q: 'كيف يبلّغ الابن أباه بحدث؟', options: ['يعدّل بيانات الأب مباشرة', 'يطلق حدثاً عبر `output()` ويستمع الأب إليه', 'عبر متغيّر عام', 'لا يمكن'], answer: 1,
        explain: 'الابن يعلن ما حدث، والأب مالك البيانات هو من يقرّر التعديل.' },
      { q: 'ما الفرق بين `badge="نص"` و `[badge]="نص"`؟', options: ['لا فرق', 'الأولى تمرّر نصاً حرفياً والثانية تُقيَّم كتعبير فتبحث عن متغيّر', 'الثانية أسرع', 'الأولى خاطئة'], answer: 1,
        explain: 'الأقواس تعني «قيّم هذا التعبير»؛ بدونها يُمرَّر النص كما هو.' },
      { q: 'ما وظيفة `<ng-content />`؟', options: ['استيراد مكوّن', 'فتحة يضع فيها الأب محتوى داخل قالب الابن', 'إنشاء حلقة', 'حقن خدمة'], answer: 1,
        explain: 'إسقاط المحتوى يجعل المكوّن حاوية مرنة تعمل مع أي محتوى.' },
      { q: 'ماذا يمثّل `$event` في `(added)="fn($event)"` لمخرج مخصّص؟', options: ['حدث DOM', 'القيمة الممرّرة إلى `emit()`', 'اسم المكوّن', 'دائماً null'], answer: 1,
        explain: 'في المخرجات المخصّصة `$event` هو حمولة الحدث التي أطلقها الابن.' },
      { q: 'ما الحل الأنسب لتواصل مكوّنين متباعدين في الشجرة؟', options: ['تمرير عبر كل المستويات', 'خدمة مشتركة', 'متغيّر عام', 'ng-content'], answer: 1,
        explain: 'حفر الخصائص عبر مستويات كثيرة إشارة إلى الحاجة لخدمة مشتركة.' }
    ]}
  ]
};
