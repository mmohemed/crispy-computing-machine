'use strict';

module.exports = {
  slug: '10-signals-project',
  title: 'الإشارات (Signals) ومشروع متكامل',
  summary: 'نظام التفاعلية الحديث في Angular، ثم تطبيق كل ما سبق في مشروع متجر كامل.',
  duration: 90,
  level: 'متقدم',
  tags: ['Signals', 'مشروع'],
  objectives: [
    'تستخدم `signal` و `computed` و `effect`.',
    'تفهم لماذا الإشارات أدقّ من كشف التغيير التقليدي.',
    'تبني خدمة حالة قائمة على الإشارات.',
    'تدمج المسارات والخدمات والنماذج في تطبيق واحد.',
    'تنظّم مشروعاً بمعمارية واضحة قابلة للنمو.'
  ],
  quickRef: [
    { code: 'signal(initial)', desc: 'قيمة تفاعلية قابلة للتغيير' },
    { code: 'value()', desc: 'قراءة الإشارة' },
    { code: 'set(v) / update(fn)', desc: 'تغيير القيمة' },
    { code: 'computed(fn)', desc: 'قيمة مشتقّة تُحسب تلقائياً' },
    { code: 'effect(fn)', desc: 'أثر جانبي عند التغيّر' },
    { code: 'asReadonly()', desc: 'كشف الإشارة للقراءة فقط' }
  ],
  blocks: [
    { t: 'h2', text: 'لماذا الإشارات؟' },
    { t: 'p', text: 'تقليدياً كان Angular يستخدم **Zone.js** الذي يعترض كل حدث ومؤقّت وطلب شبكة، ثم يفحص **كل** المكوّنات بحثاً عن تغيير. يعمل، لكنه مبذّر: تغيير قيمة في مكوّن واحد يفحص الشجرة كلها.' },
    { t: 'p', text: 'الإشارة تعرف بالضبط **من يقرؤها**. عند تغيّر قيمتها تُخطر قرّاءها فقط — تحديث جراحي دقيق بدل مسح شامل.' },
    { t: 'demo', title: 'الفرق في التحديث', height: 280,
      css: '.g{display:grid;grid-template-columns:1fr 1fr;gap:12px}.b{border:1px solid #e2e8f0;border-radius:10px;padding:12px}h4{margin:0 0 8px;font-size:.95em}.node{display:inline-block;width:26px;height:26px;border-radius:6px;background:#e2e8f0;margin:2px}.chk{background:#f59e0b}.upd{background:#10b981}small{display:block;margin-top:8px;color:#64748b;font-size:.82em}',
      html: '<div class="g"><div class="b"><h4>Zone.js: فحص شامل</h4><span class="node chk"></span><span class="node chk"></span><span class="node chk"></span><span class="node chk"></span><span class="node chk"></span><span class="node chk"></span><span class="node chk"></span><span class="node chk"></span><small>كل المكوّنات تُفحص عند أي حدث</small></div><div class="b"><h4>الإشارات: تحديث دقيق</h4><span class="node"></span><span class="node"></span><span class="node upd"></span><span class="node"></span><span class="node"></span><span class="node upd"></span><span class="node"></span><span class="node"></span><small>يُحدَّث من يقرأ الإشارة فقط</small></div></div>' },

    { t: 'h2', text: '`signal` — الأساس' },
    { t: 'code', lang: 'ts', code: `
import { signal } from '@angular/core';

const count = signal(0);

// القراءة: استدعاء بالأقواس
console.log(count());        // 0

// الكتابة: قيمة جديدة
count.set(5);

// الكتابة: بناءً على القيمة الحالية
count.update(c => c + 1);    // 6` },
    { t: 'code', lang: 'ts', title: 'في مكوّن', code: `
@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <button (click)="dec()">−</button>
    <span>{{ count() }}</span>
    <button (click)="inc()">+</button>
  \`
})
export class CounterComponent {
  count = signal(0);

  inc(): void { this.count.update(c => c + 1); }
  dec(): void { this.count.update(c => Math.max(0, c - 1)); }
}` },
    { t: 'warn', title: 'لا تنسَ الأقواس', text: 'في القالب تُقرأ الإشارة بـ `{{ count() }}` لا `{{ count }}`. نسيان الأقواس يطبع تمثيل الدالة نفسها بدل قيمتها — خطأ شائع جداً في البداية.' },

    { t: 'h2', text: '`computed` — القيم المشتقّة' },
    { t: 'code', lang: 'ts', code: `
import { signal, computed } from '@angular/core';

export class CartComponent {
  items = signal<Product[]>([]);

  // تُعاد الحسبة تلقائياً عند تغيّر items فقط
  count = computed(() => this.items().length);

  total = computed(() =>
    this.items().reduce((sum, p) => sum + p.price, 0)
  );

  totalWithVat = computed(() => Math.round(this.total() * 1.15));

  isEmpty = computed(() => this.count() === 0);
}` },
    { t: 'ul', items: [
      '**كسولة**: لا تُحسب إلا إذا قرأها أحد.',
      '**مخزّنة**: تُحسب مرة وتُعاد النتيجة نفسها حتى تتغيّر مدخلاتها.',
      '**للقراءة فقط**: لا يمكن استدعاء `set` عليها.',
      '**تتسلسل**: `totalWithVat` تعتمد على `total` التي تعتمد على `items`.'
    ]},
    { t: 'tip', text: 'استبدل كل خاصية `get` محسوبة في مكوّناتك بـ `computed`. الفرق كبير: خاصية `get` تُعاد حسبتها عند كل دورة كشف تغيير، بينما `computed` تُحسب فقط عند تغيّر مدخلاتها فعلاً.' },

    { t: 'h2', text: '`effect` — الآثار الجانبية' },
    { t: 'code', lang: 'ts', code: `
import { effect } from '@angular/core';

export class ThemeComponent {
  theme = signal<'light' | 'dark'>('light');

  constructor() {
    effect(() => {
      // يُعاد تنفيذه كلّما تغيّرت theme
      document.documentElement.dataset['theme'] = this.theme();
      localStorage.setItem('theme', this.theme());
    });
  }
}` },
    { t: 'danger', title: 'متى لا تستخدم effect', text: 'لا تستخدمه لاشتقاق قيمة — هذه وظيفة `computed`. ولا تغيّر داخله إشارة أخرى، فقد تصنع حلقة لا نهائية. استخدمه فقط للأشياء **خارج** Angular: التخزين المحلي، التسجيل، مكتبات طرف ثالث، وتعديل DOM مباشرة.' },
    { t: 'compare', lang: 'ts', bad: {
      code: 'total = signal(0);\n\nconstructor() {\n  effect(() => {\n    this.total.set(this.items().length * 10);\n  });\n}',
      why: 'استخدام أثر لاشتقاق قيمة: أبطأ، وقد يسبّب حلقة، ويصعب تتبّعه.'
    }, good: {
      code: 'total = computed(() => this.items().length * 10);',
      why: 'اشتقاق مباشر: كسول، مخزّن، وواضح الاعتماديات.'
    }},

    { t: 'h2', text: 'خدمة حالة بالإشارات' },
    { t: 'code', lang: 'ts', title: 'cart.service.ts', code: `
import { Injectable, signal, computed } from '@angular/core';

export interface CartLine {
  product: Product;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private lines = signal<CartLine[]>([]);

  readonly items = this.lines.asReadonly();

  readonly count = computed(() =>
    this.lines().reduce((n, l) => n + l.qty, 0)
  );

  readonly subtotal = computed(() =>
    this.lines().reduce((s, l) => s + l.product.price * l.qty, 0)
  );

  readonly vat = computed(() => Math.round(this.subtotal() * 0.15));
  readonly total = computed(() => this.subtotal() + this.vat());
  readonly isEmpty = computed(() => this.lines().length === 0);

  add(product: Product, qty = 1): void {
    this.lines.update(list => {
      const found = list.find(l => l.product.id === product.id);
      if (found) {
        return list.map(l =>
          l.product.id === product.id ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [...list, { product, qty }];
    });
  }

  setQty(id: number, qty: number): void {
    if (qty <= 0) return this.remove(id);
    this.lines.update(list =>
      list.map(l => l.product.id === id ? { ...l, qty } : l)
    );
  }

  remove(id: number): void {
    this.lines.update(list => list.filter(l => l.product.id !== id));
  }

  clear(): void { this.lines.set([]); }
}` },
    { t: 'warn', title: 'لا تعدّل الحالة موضعياً', text: 'استخدم دائماً نسخاً جديدة (`[...list]` و `{ ...item }`). تعديل الكائن نفسه لا يغيّر مرجعه، فقد لا تكتشف الإشارة التغيير ولا تُخطر قرّاءها.' },

    { t: 'h2', text: 'كشف التغيير بلا Zone' },
    { t: 'code', lang: 'ts', title: 'app.config.ts', code: `
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

export const appConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection()
  ]
};` },
    { t: 'p', text: 'مع الإشارات في كل مكان يمكن الاستغناء عن Zone.js كلياً: حزمة أصغر وأداء أفضل. هذا هو الاتجاه المستقبلي لـ Angular.' },

    { t: 'h2', text: 'المشروع: متجر «سوقنا»' },
    { t: 'p', text: 'الآن نجمع كل ما تعلّمناه في تطبيق واحد. اقرأ المواصفات كاملة أولاً وخطّط قبل الكتابة.' },
    { t: 'h3', text: 'المواصفات' },
    { t: 'table', head: ['الصفحة', 'المسار', 'المحتوى'], rows: [
      ['الرئيسية', '`/`', 'أحدث المنتجات وبانر ترحيبي'],
      ['المنتجات', '`/products`', 'شبكة منتجات مع بحث وترشيح بالتصنيف'],
      ['تفاصيل المنتج', '`/products/:id`', 'تفاصيل كاملة وزر إضافة للسلة'],
      ['السلة', '`/cart`', 'قائمة المشتريات وتعديل الكميات والإجمالي'],
      ['إتمام الطلب', '`/checkout`', 'نموذج تفاعلي محمي بحارس'],
      ['404', '`**`', 'صفحة غير موجودة']
    ]},
    { t: 'h3', text: 'البنية' },
    { t: 'code', lang: 'text', noCopy: true, code: `
src/app/
├── core/
│   ├── services/
│   │   ├── product.service.ts    جلب المنتجات (HttpClient)
│   │   ├── cart.service.ts       حالة السلة (Signals)
│   │   └── notification.service.ts
│   └── guards/
│       └── cart-not-empty.guard.ts
├── shared/
│   ├── product-card/
│   ├── star-rating/
│   └── pipes/currency-sar.pipe.ts
├── features/
│   ├── home/
│   ├── products/
│   │   ├── product-list/
│   │   └── product-detail/
│   ├── cart/
│   └── checkout/
├── app.component.ts
├── app.config.ts
└── app.routes.ts` },

    { t: 'h3', text: 'المتطلّبات التقنية' },
    { t: 'ol', items: [
      '**الخدمات**: `ProductService` تجلب من واجهة برمجية، و`CartService` بالإشارات كاملة.',
      '**المكوّنات**: `ProductCard` يستقبل `input()` ويطلق `output()` عند الإضافة.',
      '**التوجيه**: كل الصفحات أعلاه، مع تحميل كسول لصفحة `checkout`.',
      '**الحارس**: `cart-not-empty.guard` يمنع الدخول إلى `/checkout` والسلة فارغة.',
      '**النموذج**: نموذج تفاعلي في `checkout` بتحقّق كامل ورسائل عربية.',
      '**الأنبوب**: أنبوب مخصّص لتنسيق السعر بالريال.',
      '**الحالات**: عرض التحميل والخطأ والقائمة الفارغة في كل صفحة تجلب بيانات.',
      '**التخزين**: احفظ السلة في `localStorage` عبر `effect`.'
    ]},

    { t: 'code', lang: 'ts', title: 'نقطة انطلاق: حفظ السلة تلقائياً', code: `
@Injectable({ providedIn: 'root' })
export class CartService {
  private lines = signal<CartLine[]>(this.restore());

  constructor() {
    // كلّما تغيّرت السلة، احفظها
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.lines()));
    });
  }

  private restore(): CartLine[] {
    try {
      return JSON.parse(localStorage.getItem('cart') ?? '[]');
    } catch {
      return [];
    }
  }
}` },
    { t: 'code', lang: 'ts', title: 'حارس السلة', code: `
export const cartNotEmptyGuard: CanActivateFn = () => {
  const cart = inject(CartService);
  const router = inject(Router);

  if (!cart.isEmpty()) return true;

  inject(NotificationService).info('سلتك فارغة، أضف منتجات أولاً.');
  return router.createUrlTree(['/products']);
};` },

    { t: 'exercise',
      title: 'المشروع الكامل',
      brief: 'نفّذ متجر «سوقنا» بالمواصفات أعلاه. خذ وقتك — هذا مشروع لعدة جلسات لا لساعة واحدة.',
      requirements: [
        'كل الصفحات الست تعمل والتنقّل بينها سلس.',
        'السلة تعمل بالإشارات وتُحفظ بين الجلسات.',
        'صفحة الدفع محمية بالحارس ومحمّلة كسولاً.',
        'نموذج الدفع تفاعلي بتحقّق كامل.',
        'لا أخطاء في وحدة التحكّم.',
        'الواجهة متجاوبة على الجوال.',
        'الكود منظّم بحسب البنية المقترحة.'
      ],
      hints: [
        'ابدأ بالخدمات قبل المكوّنات — هي العمود الفقري.',
        'اختبر كل ميزة قبل الانتقال للتالية.',
        'استخدم بيانات وهمية محلية أولاً، ثم اربطها بواجهة برمجية.',
        'إن تعثّرت في موضوع، عد إلى درسه لا إلى بداية المسار.'
      ],
      solution: { lang: 'ts', title: 'مقتطف: مكوّن السلة كاملاً', code: `
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { SarPipe } from '../../shared/pipes/sar.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, SarPipe],
  template: \`
    <h1>سلة المشتريات</h1>

    @if (cart.isEmpty()) {
      <div class="empty">
        <p>سلتك فارغة.</p>
        <a routerLink="/products" class="btn">تصفّح المنتجات</a>
      </div>
    } @else {
      <ul class="lines">
        @for (line of cart.items(); track line.product.id) {
          <li>
            <img [src]="line.product.image" [alt]="line.product.name"
                 width="72" height="72">

            <div class="info">
              <h3>{{ line.product.name }}</h3>
              <p>{{ line.product.price | sar }}</p>
            </div>

            <div class="qty">
              <button (click)="cart.setQty(line.product.id, line.qty - 1)"
                      aria-label="إنقاص">−</button>
              <span>{{ line.qty }}</span>
              <button (click)="cart.setQty(line.product.id, line.qty + 1)"
                      aria-label="زيادة">+</button>
            </div>

            <strong>{{ line.product.price * line.qty | sar }}</strong>

            <button class="remove"
                    (click)="cart.remove(line.product.id)"
                    aria-label="حذف المنتج">✕</button>
          </li>
        }
      </ul>

      <aside class="summary">
        <div><span>المجموع الفرعي</span><span>{{ cart.subtotal() | sar }}</span></div>
        <div><span>ضريبة القيمة المضافة</span><span>{{ cart.vat() | sar }}</span></div>
        <div class="total"><span>الإجمالي</span><span>{{ cart.total() | sar }}</span></div>

        <a routerLink="/checkout" class="btn btn-primary">إتمام الطلب</a>
        <button (click)="cart.clear()" class="btn">تفريغ السلة</button>
      </aside>
    }
  \`
})
export class CartComponent {
  protected cart = inject(CartService);
}` },
      solutionNote: 'لاحظ أن المكوّن لا يحوي أي منطق حسابي — كله في الخدمة كإشارات محسوبة. هذا هو الفصل الصحيح للمسؤوليات.'
    },

    { t: 'h2', text: 'ماذا بعد؟' },
    { t: 'p', text: 'أنهيت أساسيات Angular: المكوّنات والقوالب والربط والأنابيب والخدمات و HTTP والنماذج والتوجيه والإشارات. هذه تكفي لبناء تطبيقات حقيقية.' },
    { t: 'ul', items: [
      '**RxJS بعمق** — التدفّقات والمشغّلات لحالات غير متزامنة معقّدة.',
      '**اختبار الوحدات** بـ Jest أو Karma، والاختبار الشامل بـ Playwright.',
      '**NgRx** لإدارة حالة معقّدة على مستوى التطبيق.',
      '**Angular Universal** للعرض من الخادم وتحسين السيو.',
      '**PWA** لجعل تطبيقك يعمل بلا إنترنت.',
      '**Angular Material** أو **PrimeNG** لمكتبة مكوّنات جاهزة.'
    ]},

    { t: 'quiz', items: [
      { q: 'كيف تُقرأ قيمة الإشارة في القالب؟', options: ['`{{ count }}`', '`{{ count() }}`', '`{{ count.value }}`', '`{{ count | async }}`'], answer: 1,
        explain: 'الإشارة دالة؛ قراءتها تتم باستدعائها بالأقواس.' },
      { q: 'متى تستخدم `computed` بدل `effect`؟', options: ['لا فرق', 'حين تشتق قيمة من إشارات أخرى', 'حين تعدّل DOM', 'حين تحفظ في localStorage'], answer: 1,
        explain: '`computed` للاشتقاق و`effect` للآثار الجانبية خارج Angular.' },
      { q: 'لماذا لا نعدّل مصفوفة الإشارة موضعياً بـ `push`؟', options: ['ممنوع تقنياً', 'لأن المرجع لا يتغيّر فقد لا تكتشف الإشارة التغيير', 'أبطأ', 'يسبّب خطأ'], answer: 1,
        explain: 'الإشارة تقارن المراجع؛ استخدم `update` مع نسخة جديدة.' },
      { q: 'ما ميزة الإشارات على Zone.js؟', options: ['أسهل كتابة فقط', 'تحديث دقيق لمن يقرأ الإشارة بدل فحص كل الشجرة', 'حجم أكبر', 'لا ميزة'], answer: 1,
        explain: 'الإشارة تعرف قرّاءها، فيصبح كشف التغيير جراحياً بدل مسح شامل.' },
      { q: 'أين يجب أن يعيش منطق حساب إجمالي السلة؟', options: ['في القالب', 'في الخدمة كإشارة محسوبة', 'في كل مكوّن يحتاجه', 'في المسار'], answer: 1,
        explain: 'الخدمة مالكة الحالة؛ الحساب فيها يمنع التكرار ويبقى مصدر الحقيقة واحداً.' }
    ]}
  ]
};
