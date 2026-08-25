'use strict';

module.exports = {
  slug: '06-services-di',
  title: 'الخدمات وحقن الاعتماديات',
  summary: 'إخراج المنطق من المكوّنات إلى خدمات قابلة لإعادة الاستخدام، وفهم نظام حقن الاعتماديات في Angular.',
  duration: 45,
  level: 'متوسط',
  tags: ['الخدمات', 'DI'],
  objectives: [
    'تنشئ خدمة وتحقنها في مكوّن.',
    'تفهم معنى حقن الاعتماديات ولماذا يهمّ.',
    'تشارك حالة بين مكوّنات متباعدة عبر خدمة.',
    'تتحكّم في نطاق الخدمة (عام أم لمكوّن).',
    'تكتب خدمات قابلة للاختبار.'
  ],
  quickRef: [
    { code: '@Injectable({ providedIn: "root" })', desc: 'خدمة عامة نسخة واحدة' },
    { code: 'inject(Service)', desc: 'حقن حديث داخل الصنف' },
    { code: 'constructor(private s: Service)', desc: 'الحقن التقليدي' },
    { code: 'providers: [Service]', desc: 'نسخة خاصة بالمكوّن' },
    { code: 'signal()', desc: 'حالة تفاعلية في الخدمة' }
  ],
  blocks: [
    { t: 'h2', text: 'لماذا الخدمات؟' },
    { t: 'p', text: 'المكوّن مسؤوليته **العرض**. حين تضع فيه جلب البيانات ومنطق الأعمال والحسابات، يصبح ضخماً وصعب الاختبار ومستحيل إعادة الاستخدام.' },
    { t: 'compare', lang: 'ts', bad: {
      code: 'export class ProductListComponent {\n  products: Product[] = [];\n\n  async ngOnInit() {\n    const res = await fetch("/api/products");\n    this.products = await res.json();\n    // ومنطق الترشيح والفرز والسلة كله هنا…\n  }\n}',
      why: 'المكوّن يعرف عن الشبكة وعن بنية الاستجابة. أي مكوّن آخر يحتاج المنتجات سيكرّر الكود نفسه.'
    }, good: {
      code: 'export class ProductListComponent {\n  private productService = inject(ProductService);\n  products: Product[] = [];\n\n  ngOnInit() {\n    this.productService.getAll()\n      .subscribe(list => this.products = list);\n  }\n}',
      why: 'المكوّن يعرض فقط. الخدمة تعرف كيف تجلب البيانات، ويستخدمها أي مكوّن آخر.'
    }},

    { t: 'h2', text: 'إنشاء خدمة' },
    { t: 'code', lang: 'bash', code: 'ng generate service services/product' },
    { t: 'code', lang: 'ts', title: 'product.service.ts', code: `
import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root'   // نسخة واحدة متاحة للتطبيق كله
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'سماعة لاسلكية', price: 299 },
    { id: 2, name: 'لوحة مفاتيح', price: 450 }
  ];

  getAll(): Product[] {
    return [...this.products];   // نسخة، لا المرجع الأصلي
  }

  getById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  add(product: Omit<Product, 'id'>): Product {
    const created = { ...product, id: Date.now() };
    this.products.push(created);
    return created;
  }

  remove(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }
}` },
    { t: 'note', title: 'لماذا نُرجع نسخة؟', text: '`[...this.products]` تُرجع مصفوفة جديدة. لو أرجعنا المرجع الأصلي لاستطاع أي مكوّن تعديل بيانات الخدمة من خلفها، فنفقد السيطرة على مصدر الحقيقة.' },

    { t: 'h2', text: 'الحقن في المكوّن' },
    { t: 'code', lang: 'ts', title: 'الأسلوب الحديث: دالة inject', code: `
import { Component, inject, OnInit } from '@angular/core';
import { ProductService, Product } from './services/product.service';

@Component({ /* … */ })
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];

  ngOnInit(): void {
    this.products = this.productService.getAll();
  }
}` },
    { t: 'code', lang: 'ts', title: 'الأسلوب التقليدي: عبر المُنشئ', code: `
export class ProductListComponent implements OnInit {
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products = this.productService.getAll();
  }
}` },
    { t: 'p', text: 'كلاهما صحيح. `inject()` أحدث ويعمل خارج المُنشئ (في الحقول والدوال المصنّعة)، ويجعل الوراثة أبسط. ستجد الأسلوب التقليدي في معظم المشاريع القائمة.' },

    { t: 'h2', text: 'ما هو حقن الاعتماديات؟' },
    { t: 'p', text: 'بدل أن ينشئ المكوّن ما يحتاجه بنفسه (`new ProductService()`)، **يطلبه** ويتكفّل Angular بتسليمه. هذا يُسمّى «قلب التحكّم» (Inversion of Control).' },
    { t: 'demo', title: 'الفرق بين الإنشاء والحقن', height: 300,
      css: '.col{border:1px solid #e2e8f0;border-radius:12px;padding:14px;margin-bottom:10px}.bad{border-color:#ef4444;background:#fef2f2}.good{border-color:#10b981;background:#f0fdf4}h4{margin:0 0 8px}code{display:block;background:#0f1729;color:#e2e8f0;padding:10px;border-radius:8px;direction:ltr;text-align:left;font-family:monospace;font-size:.85em}p{margin:8px 0 0;font-size:.9em;color:#64748b}',
      html: '<div class="col bad"><h4>✗ إنشاء مباشر</h4><code>const s = new ProductService();</code><p>المكوّن مرتبط بالتنفيذ نفسه. لا يمكن استبداله في الاختبار.</p></div><div class="col good"><h4>✓ حقن</h4><code>private s = inject(ProductService);</code><p>المكوّن يطلب «شيئاً يفعل كذا». Angular يقرّر أي نسخة يسلّمها.</p></div>' },
    { t: 'ul', items: [
      '**نسخة واحدة مشتركة**: كل من يطلب الخدمة يحصل على النسخة نفسها، فتُشارَك الحالة تلقائياً.',
      '**قابلية الاختبار**: في الاختبار تستبدل الخدمة الحقيقية بنسخة وهمية بسطر واحد.',
      '**اقتران ضعيف**: المكوّن يعتمد على الواجهة لا التنفيذ.'
    ]},

    { t: 'h2', text: 'مشاركة الحالة بين مكوّنات متباعدة' },
    { t: 'p', text: 'هذه أقوى فوائد الخدمات: مكوّن السلة في الترويسة ومكوّن المنتج في الصفحة لا علاقة بينهما في الشجرة، لكنهما يشتركان في خدمة واحدة.' },
    { t: 'code', lang: 'ts', title: 'cart.service.ts — بالإشارات', code: `
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  // الحالة خاصة، ولا تُعدَّل إلا من داخل الخدمة
  private items = signal<Product[]>([]);

  // قراءة فقط للخارج
  readonly cartItems = this.items.asReadonly();

  readonly count = computed(() => this.items().length);

  readonly total = computed(() =>
    this.items().reduce((sum, p) => sum + p.price, 0)
  );

  add(product: Product): void {
    this.items.update(list => [...list, product]);
  }

  remove(id: number): void {
    this.items.update(list => list.filter(p => p.id !== id));
  }

  clear(): void {
    this.items.set([]);
  }
}` },
    { t: 'code', lang: 'ts', title: 'الترويسة تعرض العدّاد', code: `
@Component({
  selector: 'app-header',
  standalone: true,
  template: \`
    <header>
      <a href="/">متجري</a>
      <span class="cart">🛒 {{ cart.count() }}</span>
    </header>
  \`
})
export class HeaderComponent {
  protected cart = inject(CartService);
}` },
    { t: 'code', lang: 'ts', title: 'بطاقة المنتج تضيف', code: `
@Component({
  selector: 'app-product-card',
  standalone: true,
  template: \`
    <button (click)="cart.add(product())">أضف إلى السلة</button>
  \`
})
export class ProductCardComponent {
  product = input.required<Product>();
  protected cart = inject(CartService);
}` },
    { t: 'p', text: 'اضغط الزر في البطاقة فيتحدّث العدّاد في الترويسة فوراً — بلا تمرير خصائص ولا أحداث. الخدمة هي القناة المشتركة.' },
    { t: 'demo', title: 'الحالة المشتركة عملياً', height: 250,
      css: 'header{display:flex;justify-content:space-between;align-items:center;background:#fee;padding:12px 16px;border-radius:10px;margin-bottom:12px;font-weight:700;color:#dd0031}.cards{display:flex;gap:10px;flex-wrap:wrap}.c{border:1px solid #e2e8f0;border-radius:10px;padding:12px;flex:1;min-width:130px}button{margin-top:8px;width:100%;padding:8px;border:0;border-radius:8px;background:#dd0031;color:#fff;cursor:pointer;font-family:inherit}',
      html: '<header><span>متجري</span><span>🛒 <b id="n">0</b></span></header><div class="cards"><div class="c"><b>سماعة</b><button onclick="document.getElementById(\'n\').textContent=+document.getElementById(\'n\').textContent+1">أضف</button></div><div class="c"><b>لوحة مفاتيح</b><button onclick="document.getElementById(\'n\').textContent=+document.getElementById(\'n\').textContent+1">أضف</button></div></div>' },

    { t: 'h2', text: 'نطاق الخدمة' },
    { t: 'table', head: ['التسجيل', 'النطاق', 'متى'], rows: [
      ['`providedIn: "root"`', 'نسخة واحدة للتطبيق كله', '**الافتراضي** — معظم الحالات'],
      ['`providers: [X]` في مكوّن', 'نسخة لكل نسخة من المكوّن', 'حالة خاصة بالمكوّن وأبنائه'],
      ['`providers: []` في مسار', 'نسخة لكل مسار', 'حالة تُمحى عند مغادرة القسم']
    ]},
    { t: 'code', lang: 'ts', code: `
// نسخة مستقلّة لكل نسخة من المكوّن
@Component({
  selector: 'app-wizard',
  standalone: true,
  providers: [WizardStateService]   // كل معالج له حالته الخاصة
})
export class WizardComponent {
  private state = inject(WizardStateService);
}` },
    { t: 'note', text: 'ميزة `providedIn: "root"` أن Angular يحذف الخدمة من الحزمة النهائية إن لم تُستخدم إطلاقاً (Tree-shaking) — وهذا لا يحدث مع التسجيل في `providers`.' },

    { t: 'h2', text: 'خدمات تعتمد على خدمات' },
    { t: 'code', lang: 'ts', code: `
@Injectable({ providedIn: 'root' })
export class OrderService {
  private cart = inject(CartService);
  private http = inject(HttpClient);
  private logger = inject(LoggerService);

  checkout() {
    const items = this.cart.cartItems();
    this.logger.info('بدء الدفع', items.length);
    return this.http.post('/api/orders', { items });
  }
}` },
    { t: 'p', text: 'الخدمات تُحقن في بعضها بالطريقة نفسها. Angular يبني شجرة الاعتماديات ويحلّها تلقائياً.' },
    { t: 'warn', title: 'الاعتماد الدائري', text: 'إن اعتمدت الخدمة A على B واعتمدت B على A، سيفشل Angular برسالة `Circular dependency`. الحل: استخرج المنطق المشترك إلى خدمة ثالثة.' },

    { t: 'h2', text: 'خدمات قابلة للاختبار' },
    { t: 'code', lang: 'ts', code: `
describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('يضيف منتجاً ويزيد العدّاد', () => {
    service.add({ id: 1, name: 'سماعة', price: 299 });
    expect(service.count()).toBe(1);
    expect(service.total()).toBe(299);
  });

  it('يحذف منتجاً بالمعرّف', () => {
    service.add({ id: 1, name: 'سماعة', price: 299 });
    service.remove(1);
    expect(service.count()).toBe(0);
  });
});` },
    { t: 'p', text: 'لاحظ سهولة الاختبار: لا مكوّنات ولا DOM ولا متصفح — منطق خالص. هذه ثمرة إخراج المنطق من المكوّنات.' },

    { t: 'exercise',
      title: 'تمرين: خدمة إشعارات مشتركة',
      brief: 'ابنِ خدمة إشعارات يستخدمها التطبيق كله لعرض رسائل نجاح وخطأ.',
      requirements: [
        'خدمة `NotificationService` بـ `providedIn: "root"`.',
        'حالة داخلية بإشارة تحمل مصفوفة إشعارات: `{ id, text, type }` حيث `type` هو `success | error | info`.',
        'دوال: `success(text)` و `error(text)` و `info(text)` و `dismiss(id)`.',
        'كل إشعار يختفي تلقائياً بعد 4 ثوانٍ.',
        'خاصية محسوبة `hasErrors` تُرجع صحيحاً إن وُجد إشعار خطأ واحد على الأقل.',
        'مكوّن `app-notifications` يعرض الإشعارات مع زر إغلاق لكل واحد.',
        'مكوّن آخر بأزرار تجريبية تستدعي دوال الخدمة الثلاث.',
        'تأكّد أن المكوّنين لا يعرف أحدهما بالآخر إطلاقاً.'
      ],
      hints: [
        'استخدم `signal<Notification[]>([])` و `update` للإضافة والحذف.',
        '`setTimeout` داخل دالة الإضافة لاستدعاء `dismiss` تلقائياً.',
        'استخدم `Date.now()` أو عدّاداً داخلياً للمعرّفات.'
      ],
      solution: { lang: 'ts', code: `
import { Injectable, signal, computed } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  text: string;
  type: NotificationType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;
  private list = signal<Notification[]>([]);

  readonly notifications = this.list.asReadonly();

  readonly hasErrors = computed(() =>
    this.list().some(n => n.type === 'error')
  );

  success(text: string): void { this.push(text, 'success'); }
  error(text: string): void   { this.push(text, 'error'); }
  info(text: string): void    { this.push(text, 'info'); }

  dismiss(id: number): void {
    this.list.update(items => items.filter(n => n.id !== id));
  }

  private push(text: string, type: NotificationType): void {
    const id = this.nextId++;
    this.list.update(items => [...items, { id, text, type }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}

/* ---------- مكوّن العرض ---------- */

@Component({
  selector: 'app-notifications',
  standalone: true,
  template: \`
    <div class="stack">
      @for (n of service.notifications(); track n.id) {
        <div class="toast" [class]="n.type">
          <span>{{ n.text }}</span>
          <button (click)="service.dismiss(n.id)" aria-label="إغلاق">✕</button>
        </div>
      }
    </div>
  \`,
  styles: [\`
    .stack { position: fixed; inset-block-start: 16px; inset-inline-end: 16px; display: grid; gap: 8px; z-index: 999; }
    .toast {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; border-radius: 10px; color: #fff;
      box-shadow: 0 8px 20px rgba(0,0,0,.15);
    }
    .success { background: #10b981; }
    .error   { background: #ef4444; }
    .info    { background: #0ea5e9; }
    button { background: none; border: 0; color: inherit; cursor: pointer; font-size: 1rem; }
  \`]
})
export class NotificationsComponent {
  protected service = inject(NotificationService);
}

/* ---------- مكوّن يستخدم الخدمة ---------- */

@Component({
  selector: 'app-demo-actions',
  standalone: true,
  template: \`
    <button (click)="notify.success('تم الحفظ بنجاح')">نجاح</button>
    <button (click)="notify.error('فشل الاتصال بالخادم')">خطأ</button>
    <button (click)="notify.info('جارٍ المزامنة…')">معلومة</button>
  \`
})
export class DemoActionsComponent {
  protected notify = inject(NotificationService);
}` },
      solutionNote: 'لاحظ أن `DemoActionsComponent` و `NotificationsComponent` لا يعرف أحدهما بالآخر — الخدمة هي القناة الوحيدة بينهما.'
    },

    { t: 'quiz', items: [
      { q: 'ما معنى `providedIn: "root"`؟', options: ['الخدمة في المجلد الجذر', 'نسخة واحدة من الخدمة متاحة للتطبيق كله', 'الخدمة خاصة بالمكوّن', 'الخدمة لا تُستخدم'], answer: 1,
        explain: 'نسخة مفردة (Singleton) على مستوى التطبيق، وقابلة للحذف من الحزمة إن لم تُستخدم.' },
      { q: 'لماذا نحقن الخدمة بدل إنشائها بـ `new`؟', options: ['أسرع', 'للحصول على نسخة مشتركة وقابلية استبدالها في الاختبار', 'أقصر كتابة', 'لا فرق'], answer: 1,
        explain: 'الحقن يمنح مشاركة الحالة واقتراناً ضعيفاً وقابلية اختبار عالية.' },
      { q: 'كيف يتواصل مكوّنان متباعدان في الشجرة؟', options: ['بـ input و output', 'عبر خدمة مشتركة', 'بمتغيّر عام', 'لا يمكن'], answer: 1,
        explain: 'الخدمة المسجّلة في root هي القناة الطبيعية للحالة المشتركة.' },
      { q: 'متى تسجّل الخدمة في `providers` الخاصة بمكوّن؟', options: ['دائماً', 'حين تريد نسخة مستقلّة لكل نسخة من المكوّن', 'أبداً', 'مع الخدمات الكبيرة'], answer: 1,
        explain: 'مفيد لحالة مؤقتة خاصة بالمكوّن مثل حالة معالج متعدّد الخطوات.' },
      { q: 'لماذا نُرجع نسخة من المصفوفة لا المرجع الأصلي؟', options: ['أسرع', 'لمنع تعديل بيانات الخدمة من الخارج دون علمها', 'لتوفير الذاكرة', 'لا داعي'], answer: 1,
        explain: 'إرجاع المرجع يسمح لأي مكوّن بتعديل الحالة مباشرة فتفقد الخدمة السيطرة.' }
    ]}
  ]
};
