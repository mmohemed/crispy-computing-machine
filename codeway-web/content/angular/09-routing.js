'use strict';

module.exports = {
  slug: '09-routing',
  title: 'التوجيه بين الصفحات',
  summary: 'بناء تطبيق متعدّد الصفحات: تعريف المسارات، المعاملات، المسارات المتداخلة، الحماية، والتحميل الكسول.',
  duration: 50,
  level: 'متوسط',
  tags: ['التوجيه', 'الملاحة'],
  objectives: [
    'تعرّف المسارات وتربطها بالمكوّنات.',
    'تنتقل بين الصفحات بالروابط وبرمجياً.',
    'تقرأ معاملات المسار والاستعلام.',
    'تحمي المسارات بحرّاس (Guards).',
    'تحمّل الأقسام كسولاً لتقليل حجم الحزمة.'
  ],
  quickRef: [
    { code: 'provideRouter(routes)', desc: 'تفعيل الموجّه' },
    { code: '<router-outlet />', desc: 'مكان عرض المكوّن' },
    { code: 'routerLink="/path"', desc: 'رابط تنقّل' },
    { code: 'routerLinkActive="active"', desc: 'صنف للرابط النشط' },
    { code: 'router.navigate([…])', desc: 'تنقّل برمجي' },
    { code: 'loadComponent: () => import()', desc: 'تحميل كسول' },
    { code: 'canActivate: [guard]', desc: 'حماية المسار' }
  ],
  blocks: [
    { t: 'h2', text: 'كيف يعمل التوجيه؟' },
    { t: 'p', text: 'تطبيق Angular صفحة HTML واحدة. الموجّه يراقب عنوان المتصفح، وعند تغيّره يستبدل المكوّن المعروض داخل `<router-outlet>` — بلا إعادة تحميل الصفحة.' },
    { t: 'code', lang: 'ts', title: 'app.routes.ts', code: `
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AboutComponent } from './pages/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'الرئيسية' },
  { path: 'about', component: AboutComponent, title: 'من نحن' },
  { path: 'products', component: ProductListComponent, title: 'المنتجات' },
  { path: 'products/:id', component: ProductDetailComponent },

  // إعادة توجيه
  { path: 'home', redirectTo: '', pathMatch: 'full' },

  // صفحة 404 — يجب أن تكون الأخيرة دائماً
  { path: '**', component: NotFoundComponent, title: 'الصفحة غير موجودة' }
];` },
    { t: 'code', lang: 'ts', title: 'app.config.ts', code: `
import { provideRouter, withComponentInputBinding } from '@angular/router';

export const appConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
};` },
    { t: 'code', lang: 'html', title: 'app.component.html', code: `
<header>
  <nav>
    <a routerLink="/" routerLinkActive="active"
       [routerLinkActiveOptions]="{ exact: true }">الرئيسية</a>
    <a routerLink="/products" routerLinkActive="active">المنتجات</a>
    <a routerLink="/about" routerLinkActive="active">من نحن</a>
  </nav>
</header>

<main>
  <router-outlet />
</main>` },
    { t: 'warn', title: 'ترتيب المسارات مهم', text: 'الموجّه يفحص المسارات **بالترتيب** ويأخذ أول تطابق. لهذا يجب أن يكون `**` آخر مسار دائماً، وإلا التقط كل شيء وما بعده لن يُستخدم أبداً.' },
    { t: 'note', text: '`pathMatch: "full"` مع `redirectTo` تعني «طابق المسار كاملاً» — بدونها قد يلتقط المسار الفارغ كل شيء ويحدث حلقة إعادة توجيه لا نهائية.' },

    { t: 'h2', text: 'الروابط والتنقّل' },
    { t: 'code', lang: 'html', code: `
<!-- رابط ثابت -->
<a routerLink="/products">المنتجات</a>

<!-- رابط ديناميكي -->
<a [routerLink]="['/products', product.id]">التفاصيل</a>

<!-- مع معاملات استعلام -->
<a [routerLink]="['/products']"
   [queryParams]="{ category: 'audio', page: 2 }">
  الصوتيات
</a>

<!-- مع جزء (fragment) -->
<a routerLink="/about" fragment="team">فريقنا</a>

<!-- الصنف النشط -->
<a routerLink="/products" routerLinkActive="active">المنتجات</a>` },
    { t: 'danger', title: 'لا تستخدم `href` للتنقّل الداخلي', text: 'كتابة `<a href="/products">` تعيد تحميل الصفحة بالكامل، فتفقد كل حالة التطبيق ويصبح البطء ملحوظاً. استخدم `routerLink` دائماً للمسارات الداخلية.' },
    { t: 'code', lang: 'ts', title: 'التنقّل برمجياً', code: `
import { Router } from '@angular/router';

export class LoginComponent {
  private router = inject(Router);

  onLoginSuccess(): void {
    this.router.navigate(['/dashboard']);
  }

  goToProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  search(term: string): void {
    this.router.navigate(['/products'], {
      queryParams: { q: term, page: 1 }
    });
  }

  goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}` },

    { t: 'h2', text: 'قراءة المعاملات' },
    { t: 'h3', text: 'الطريقة الحديثة: ربط المدخلات' },
    { t: 'code', lang: 'ts', code: `
// بفضل withComponentInputBinding()، تصل المعاملات كمدخلات مباشرة
@Component({ /* … */ })
export class ProductDetailComponent {
  // من المسار: products/:id
  id = input.required<string>();

  // من الاستعلام: ?tab=specs
  tab = input<string>('overview');
}` },
    { t: 'tip', text: 'هذه أبسط طريقة وأنظفها: تعرّف المدخل باسم المعامل نفسه، ويتكفّل Angular بالباقي. تحتاج فقط `withComponentInputBinding()` في الإعداد.' },

    { t: 'h3', text: 'الطريقة التقليدية: ActivatedRoute' },
    { t: 'code', lang: 'ts', code: `
import { ActivatedRoute } from '@angular/router';

export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(ProductService);

  product?: Product;

  ngOnInit(): void {
    // لقطة واحدة — تكفي إن كان المكوّن يُعاد إنشاؤه
    const id = this.route.snapshot.paramMap.get('id');

    // أو الاشتراك — ضروري إن تغيّر المعامل والمكوّن نفسه باقٍ
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.service.getById(id).subscribe(p => this.product = p);
    });

    // معاملات الاستعلام
    this.route.queryParamMap.subscribe(q => {
      const page = Number(q.get('page') ?? 1);
    });
  }
}` },
    { t: 'warn', title: 'فخّ اللقطة', text: 'إن انتقل المستخدم من `/products/1` إلى `/products/2` فقد **لا يُعاد إنشاء** المكوّن، ولن تتحدّث اللقطة `snapshot`. استخدم الاشتراك أو ربط المدخلات في هذه الحالة.' },

    { t: 'h2', text: 'المسارات المتداخلة' },
    { t: 'code', lang: 'ts', code: `
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/:id', component: OrderDetailComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];` },
    { t: 'code', lang: 'html', title: 'DashboardLayoutComponent', code: `
<div class="dashboard">
  <aside>
    <a routerLink="overview" routerLinkActive="active">نظرة عامة</a>
    <a routerLink="orders" routerLinkActive="active">الطلبات</a>
    <a routerLink="settings" routerLinkActive="active">الإعدادات</a>
  </aside>

  <section>
    <!-- المنفذ الداخلي للأبناء -->
    <router-outlet />
  </section>
</div>` },
    { t: 'demo', title: 'تخطيط بمسارات متداخلة', height: 260,
      css: '.d{display:grid;grid-template-columns:150px 1fr;gap:12px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}aside{background:#fee;padding:12px;display:grid;gap:6px}aside a{display:block;padding:8px 12px;border-radius:8px;color:#dd0031;text-decoration:none;font-weight:600}aside a.active{background:#dd0031;color:#fff}section{padding:16px}',
      html: '<div class="d"><aside><a href="#">نظرة عامة</a><a href="#" class="active">الطلبات</a><a href="#">الإعدادات</a></aside><section><b>الطلبات</b><p style="color:#64748b;margin:8px 0 0">هذا المحتوى يُعرض داخل router-outlet الداخلي، والشريط الجانبي يبقى ثابتاً.</p></section></div>' },
    { t: 'p', text: 'الروابط داخل التخطيط **نسبية**: `routerLink="orders"` تعني `/dashboard/orders`. لجعلها مطلقة ابدأها بشرطة: `routerLink="/orders"`.' },

    { t: 'h2', text: 'حماية المسارات' },
    { t: 'code', lang: 'ts', title: 'auth.guard.ts', code: `
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  // احفظ الوجهة للعودة إليها بعد الدخول
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.role() === 'admin' || inject(Router).createUrlTree(['/forbidden']);
};` },
    { t: 'code', lang: 'ts', code: `
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard],
  children: [
    { path: 'users', component: UsersComponent, canActivate: [adminGuard] }
  ]
}` },
    { t: 'table', head: ['الحارس', 'متى يُستدعى'], rows: [
      ['`CanActivateFn`', 'قبل الدخول إلى المسار'],
      ['`CanActivateChildFn`', 'قبل الدخول إلى أي مسار ابن'],
      ['`CanDeactivateFn`', 'قبل المغادرة — لتأكيد ترك نموذج غير محفوظ'],
      ['`CanMatchFn`', 'قبل تحميل الوحدة الكسولة أصلاً'],
      ['`ResolveFn`', 'لجلب بيانات قبل عرض المكوّن']
    ]},
    { t: 'danger', title: 'الحارس ليس أماناً', text: 'الحرّاس يحسّنون **تجربة المستخدم** فقط. أي شخص يستطيع تعديل كود جافاسكربت في متصفحه. الحماية الحقيقية على **الخادم**: كل واجهة برمجية يجب أن تتحقّق من الصلاحية بنفسها.' },

    { t: 'h2', text: 'التحميل الكسول' },
    { t: 'p', text: 'بدل تحميل كل التطبيق دفعة واحدة، حمّل كل قسم عند الحاجة إليه. هذا يقلّص الحزمة الأولية بشكل كبير ويسرّع أول تحميل.' },
    { t: 'code', lang: 'ts', code: `
export const routes: Routes = [
  { path: '', component: HomeComponent },

  // مكوّن كسول
  {
    path: 'products',
    loadComponent: () =>
      import('./products/product-list.component')
        .then(m => m.ProductListComponent)
  },

  // مجموعة مسارات كسولة
  {
    path: 'admin',
    canMatch: [adminGuard],
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];` },
    { t: 'code', lang: 'ts', title: 'admin/admin.routes.ts', code: `
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminHomeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'reports', component: ReportsComponent }
];` },
    { t: 'tip', text: 'استخدم `canMatch` بدل `canActivate` مع المسارات الكسولة: يمنع **تحميل الملفات أصلاً** لغير المصرّح لهم، بدل تحميلها ثم منع الدخول.' },

    { t: 'h2', text: 'تحسينات إضافية' },
    { t: 'code', lang: 'ts', code: `
provideRouter(
  routes,
  withComponentInputBinding(),

  // استعادة موضع التمرير عند الرجوع
  withInMemoryScrolling({
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  }),

  // تحميل مسبق لكل الوحدات الكسولة بعد اكتمال التحميل الأول
  withPreloading(PreloadAllModules)
)` },
    { t: 'p', text: 'التحميل المسبق يجمع بين الميزتين: حزمة أولية صغيرة، ثم تحميل الباقي في الخلفية فيصبح التنقّل فورياً.' },

    { t: 'exercise',
      title: 'تمرين: تطبيق مدونة متعدّد الصفحات',
      brief: 'ابنِ تطبيقاً بأربع صفحات وتوجيه كامل.',
      requirements: [
        'مسارات: `/` الرئيسية، `/posts` القائمة، `/posts/:id` التفاصيل، `/about`، و 404.',
        'شريط تنقّل بـ `routerLink` و `routerLinkActive`، مع `exact` للرابط الرئيسي.',
        'صفحة التفاصيل تقرأ `:id` وتعرض المقال المطابق، أو رسالة إن لم يوجد.',
        'صفحة القائمة تدعم `?category=` وترشّح النتائج بحسبه.',
        'قسم `/dashboard` بمسارات متداخلة: `overview` و `settings` مع تخطيط مشترك.',
        'حارس `authGuard` يحمي `/dashboard` ويعيد التوجيه إلى `/login` مع `returnUrl`.',
        'صفحة `/about` محمّلة كسولاً بـ `loadComponent`.',
        'كل مسار له `title` يظهر في تبويب المتصفح.'
      ],
      hints: [
        'مسار `**` يجب أن يكون الأخير في المصفوفة.',
        'استخدم `withComponentInputBinding()` لتصل المعاملات كمدخلات.',
        'الروابط داخل التخطيط المتداخل نسبية بلا شرطة بادئة.'
      ],
      solution: { lang: 'ts', code: `
// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'الرئيسية — مدونتي'
  },
  {
    path: 'posts',
    component: PostListComponent,
    title: 'المقالات'
  },
  {
    path: 'posts/:id',
    component: PostDetailComponent,
    title: 'تفاصيل المقال'
  },
  {
    path: 'about',
    title: 'من نحن',
    loadComponent: () =>
      import('./pages/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    title: 'لوحة التحكّم',
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },
  { path: 'login', component: LoginComponent, title: 'تسجيل الدخول' },
  { path: '**', component: NotFoundComponent, title: 'الصفحة غير موجودة' }
];

/* ---------- الحارس ---------- */

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/* ---------- صفحة التفاصيل ---------- */

@Component({
  selector: 'app-post-detail',
  standalone: true,
  template: \`
    @if (post(); as p) {
      <article>
        <h1>{{ p.title }}</h1>
        <p>{{ p.body }}</p>
        <a routerLink="/posts">← كل المقالات</a>
      </article>
    } @else {
      <p>لم نعثر على المقال المطلوب.</p>
    }
  \`,
  imports: [RouterLink]
})
export class PostDetailComponent {
  private service = inject(PostService);

  id = input.required<string>();

  post = computed(() => this.service.getById(Number(this.id())));
}

/* ---------- صفحة القائمة مع الترشيح ---------- */

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [RouterLink],
  template: \`
    <nav class="filters">
      <a [routerLink]="['/posts']">الكل</a>
      <a [routerLink]="['/posts']" [queryParams]="{ category: 'tech' }">تقنية</a>
      <a [routerLink]="['/posts']" [queryParams]="{ category: 'design' }">تصميم</a>
    </nav>

    @for (p of filtered(); track p.id) {
      <a [routerLink]="['/posts', p.id]">{{ p.title }}</a>
    } @empty {
      <p>لا توجد مقالات في هذا التصنيف.</p>
    }
  \`
})
export class PostListComponent {
  private service = inject(PostService);

  category = input<string>('');

  filtered = computed(() => {
    const all = this.service.getAll();
    const c = this.category();
    return c ? all.filter(p => p.category === c) : all;
  });
}` } },

    { t: 'quiz', items: [
      { q: 'لماذا يجب أن يكون مسار `**` الأخير؟', options: ['اصطلاح فقط', 'لأن الموجّه يأخذ أول تطابق، و`**` يطابق كل شيء', 'لأنه أبطأ', 'ليس ضرورياً'], answer: 1,
        explain: 'وضعه في الأول يجعله يلتقط كل العناوين فلا يُستخدم أي مسار بعده.' },
      { q: 'ما الفرق بين `routerLink` و `href` للتنقّل الداخلي؟', options: ['لا فرق', '`href` يعيد تحميل الصفحة كاملة ويفقد حالة التطبيق', '`routerLink` أبطأ', '`href` أكثر أماناً'], answer: 1,
        explain: '`routerLink` يستخدم توجيه العميل بلا إعادة تحميل، فيبقى التطبيق وحالته.' },
      { q: 'متى تفشل قراءة المعامل بـ `snapshot`؟', options: ['دائماً', 'حين ينتقل المستخدم بين مسارين يستخدمان المكوّن نفسه', 'مع المسارات المتداخلة', 'مع الحرّاس'], answer: 1,
        explain: 'المكوّن لا يُعاد إنشاؤه فتبقى اللقطة قديمة؛ استخدم الاشتراك أو ربط المدخلات.' },
      { q: 'هل الحارس `canActivate` وسيلة أمان كافية؟', options: ['نعم', 'لا — الأمان الحقيقي على الخادم، والحارس لتجربة المستخدم', 'نعم مع التشفير', 'يعتمد'], answer: 1,
        explain: 'كود العميل قابل للتعديل؛ كل واجهة برمجية يجب أن تتحقّق من الصلاحية بنفسها.' },
      { q: 'ما فائدة `loadComponent`؟', options: ['تسريع البناء', 'تحميل المكوّن عند الحاجة فقط لتقليل حجم الحزمة الأولية', 'حماية المسار', 'تخزين مؤقت'], answer: 1,
        explain: 'التحميل الكسول يؤجّل تنزيل الكود حتى يزور المستخدم ذلك المسار فعلاً.' }
    ]}
  ]
};
