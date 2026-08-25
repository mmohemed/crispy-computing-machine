'use strict';

module.exports = {
  slug: '07-http',
  title: 'HttpClient وجلب البيانات',
  summary: 'الاتصال بالخادم: طلبات GET و POST، معالجة الأخطاء، الاعتراضات (Interceptors)، وحالات التحميل.',
  duration: 50,
  level: 'متوسط',
  tags: ['HTTP', 'البيانات'],
  objectives: [
    'تهيّئ `HttpClient` وتستخدمه في خدمة.',
    'ترسل طلبات القراءة والكتابة بأنواع صحيحة.',
    'تعالج الأخطاء بشكل موحّد.',
    'تكتب معترضاً يضيف ترويسة المصادقة.',
    'تدير حالات التحميل والخطأ في الواجهة.'
  ],
  quickRef: [
    { code: 'provideHttpClient()', desc: 'تفعيل HttpClient' },
    { code: 'http.get<T>(url)', desc: 'طلب قراءة بنوع محدّد' },
    { code: 'http.post<T>(url, body)', desc: 'إرسال بيانات' },
    { code: 'catchError(fn)', desc: 'التقاط الأخطاء' },
    { code: 'HttpParams', desc: 'معاملات الاستعلام' },
    { code: 'withInterceptors([fn])', desc: 'تسجيل معترضات' }
  ],
  blocks: [
    { t: 'h2', text: 'التهيئة' },
    { t: 'p', text: 'قبل أي طلب يجب تفعيل `HttpClient` في إعدادات التطبيق.' },
    { t: 'code', lang: 'ts', title: 'app.config.ts', code: `
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch())
  ]
};` },
    { t: 'note', text: '`withFetch()` تجعل Angular يستخدم واجهة `fetch` الحديثة بدل `XMLHttpRequest` — أفضل توافقاً مع العرض من الخادم.' },

    { t: 'h2', text: 'أول طلب' },
    { t: 'code', lang: 'ts', title: 'product.service.ts', code: `
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = '/api/products';

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(\`\${this.baseUrl}/\${id}\`);
  }

  create(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  update(id: number, changes: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(\`\${this.baseUrl}/\${id}\`, changes);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.baseUrl}/\${id}\`);
  }
}` },
    { t: 'warn', title: 'الطلب لا يُنفَّذ حتى تشترك', text: 'دوال `HttpClient` تُرجع `Observable` **بارداً**: لا شيء يحدث حتى يشترك أحد فيه بـ `subscribe()` أو عبر أنبوب `async`. استدعاء `this.http.get(...)` وحده لا يرسل أي طلب.' },

    { t: 'h2', text: 'الاستهلاك في المكوّن' },
    { t: 'h3', text: 'الطريقة الموصى بها: أنبوب async' },
    { t: 'code', lang: 'ts', code: `
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [AsyncPipe],
  template: \`
    @if (products$ | async; as products) {
      <ul>
        @for (p of products; track p.id) {
          <li>{{ p.name }} — {{ p.price }} ريالاً</li>
        }
      </ul>
    } @else {
      <p>جارٍ التحميل…</p>
    }
  \`
})
export class ProductListComponent {
  private service = inject(ProductService);
  products$ = this.service.getAll();
}` },
    { t: 'p', text: 'أنبوب `async` يشترك تلقائياً **ويلغي الاشتراك** عند إزالة المكوّن — فلا تسريب ذاكرة ولا حاجة إلى `ngOnDestroy`.' },

    { t: 'h3', text: 'الطريقة الحديثة: toSignal' },
    { t: 'code', lang: 'ts', code: `
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  template: \`
    @for (p of products(); track p.id) {
      <li>{{ p.name }}</li>
    }
  \`
})
export class ProductListComponent {
  private service = inject(ProductService);

  products = toSignal(this.service.getAll(), { initialValue: [] as Product[] });
}` },
    { t: 'tip', text: '`toSignal` يحوّل التدفّق إلى إشارة، فتستخدمه في القالب بلا أنبوب وبلا اشتراك يدوي. هذا هو الاتجاه الذي تسير إليه Angular.' },

    { t: 'h3', text: 'الاشتراك اليدوي' },
    { t: 'code', lang: 'ts', code: `
export class ProductListComponent implements OnInit {
  private service = inject(ProductService);

  products: Product[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.loading = true;

    this.service.getAll().subscribe({
      next: list => {
        this.products = list;
        this.loading = false;
      },
      error: err => {
        this.error = 'تعذّر تحميل المنتجات.';
        this.loading = false;
      }
    });
  }
}` },
    { t: 'note', text: 'طلبات `HttpClient` تكتمل تلقائياً بعد الاستجابة، فلا يلزم إلغاء اشتراكها يدوياً. الاشتراكات التي تحتاج إلغاءً هي التدفّقات المستمرة كأحداث الموجّه أو النماذج.' },

    { t: 'h2', text: 'معاملات الاستعلام والترويسات' },
    { t: 'code', lang: 'ts', code: `
import { HttpParams, HttpHeaders } from '@angular/common/http';

search(term: string, page = 1, category?: string): Observable<Product[]> {
  let params = new HttpParams()
    .set('q', term)
    .set('page', page)
    .set('limit', 20);

  if (category) {
    params = params.set('category', category);
  }

  return this.http.get<Product[]>(this.baseUrl, { params });
  // النتيجة: /api/products?q=…&page=1&limit=20&category=…
}

createWithHeaders(product: Product) {
  const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('X-Client', 'codeway-web');

  return this.http.post<Product>(this.baseUrl, product, { headers });
}` },
    { t: 'danger', title: '`HttpParams` غير قابل للتغيير', text: 'كل استدعاء لـ `.set()` يُرجع **كائناً جديداً**. كتابة `params.set(...)` بلا إعادة إسناد لا تفعل شيئاً. لاحظ `params = params.set(...)` في المثال أعلاه.' },

    { t: 'h2', text: 'معالجة الأخطاء' },
    { t: 'code', lang: 'ts', code: `
import { catchError, throwError, retry, timer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

getAll(): Observable<Product[]> {
  return this.http.get<Product[]>(this.baseUrl).pipe(
    retry({ count: 2, delay: () => timer(1000) }),
    catchError(this.handleError)
  );
}

private handleError(error: HttpErrorResponse) {
  let message = 'حدث خطأ غير متوقّع.';

  if (error.status === 0) {
    message = 'تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت.';
  } else if (error.status === 401) {
    message = 'انتهت جلستك، يرجى تسجيل الدخول مجدّداً.';
  } else if (error.status === 403) {
    message = 'لا تملك صلاحية لهذه العملية.';
  } else if (error.status === 404) {
    message = 'العنصر المطلوب غير موجود.';
  } else if (error.status >= 500) {
    message = 'خطأ في الخادم، حاول لاحقاً.';
  }

  console.error('HTTP error:', error);
  return throwError(() => new Error(message));
}` },
    { t: 'table', head: ['الرمز', 'المعنى', 'ماذا تفعل'], rows: [
      ['`0`', 'لا استجابة (شبكة أو CORS)', 'رسالة اتصال + إعادة محاولة'],
      ['`400`', 'طلب غير صالح', 'اعرض أخطاء التحقّق للمستخدم'],
      ['`401`', 'غير مصادَق', 'وجّه لصفحة الدخول'],
      ['`403`', 'ممنوع', 'رسالة صلاحيات'],
      ['`404`', 'غير موجود', 'رسالة أو صفحة 404'],
      ['`422`', 'بيانات غير صالحة', 'اعرض الأخطاء حقلاً بحقل'],
      ['`5xx`', 'خطأ خادم', 'رسالة عامة + سجّل الخطأ']
    ]},
    { t: 'warn', title: 'خطأ 0 غالباً CORS', text: 'إن ظهرت `status: 0` مع رسالة CORS في وحدة التحكّم، فالمشكلة في **الخادم** لا في كودك: يجب أن يرسل ترويسة `Access-Control-Allow-Origin`. لا يمكن حلّها من جهة العميل.' },

    { t: 'h2', text: 'المعترضات (Interceptors)' },
    { t: 'p', text: 'دالة تمرّ عبرها **كل** الطلبات قبل الإرسال وكل الاستجابات قبل الوصول. مثالية للمهام العابرة: المصادقة، التسجيل، مؤشّر التحميل العام.' },
    { t: 'code', lang: 'ts', title: 'auth.interceptor.ts', code: `
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();

  if (!token) return next(req);

  // الطلب غير قابل للتغيير — ننسخه مع التعديل
  const authReq = req.clone({
    setHeaders: { Authorization: \`Bearer \${token}\` }
  });

  return next(authReq);
};` },
    { t: 'code', lang: 'ts', title: 'error.interceptor.ts', code: `
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        router.navigate(['/login']);
      } else if (err.status >= 500) {
        notify.error('خطأ في الخادم، حاول لاحقاً.');
      }
      return throwError(() => err);
    })
  );
};` },
    { t: 'code', lang: 'ts', title: 'التسجيل', code: `
provideHttpClient(
  withFetch(),
  withInterceptors([authInterceptor, errorInterceptor])
)` },
    { t: 'p', text: 'ترتيب المعترضات مهم: تُنفَّذ على الطلب بالترتيب المكتوب، وعلى الاستجابة بالترتيب العكسي.' },

    { t: 'h2', text: 'إدارة حالات الواجهة' },
    { t: 'p', text: 'أي طلب شبكة له أربع حالات يجب أن تظهر للمستخدم. تجاهل أي منها يعطي تجربة سيئة.' },
    { t: 'demo', title: 'الحالات الأربع', height: 340,
      css: '.s{border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin-bottom:8px}.s b{display:block;margin-bottom:6px}.sk{height:12px;background:linear-gradient(90deg,#f1f5f9,#e2e8f0,#f1f5f9);border-radius:6px;margin-bottom:6px}.err{background:#fef2f2;border-color:#ef4444;color:#dc2626}.emp{color:#94a3b8;text-align:center}',
      html: '<div class="s"><b>1. جارٍ التحميل</b><div class="sk"></div><div class="sk" style="width:70%"></div></div><div class="s err"><b>2. خطأ</b>تعذّر الاتصال بالخادم. <button style="margin-inline-start:8px">إعادة المحاولة</button></div><div class="s emp"><b>3. لا توجد نتائج</b>لم نعثر على منتجات مطابقة.</div><div class="s"><b>4. نجاح</b>سماعة لاسلكية — 299 ريالاً</div>' },
    { t: 'code', lang: 'ts', title: 'نمط عملي بالإشارات', code: `
type State<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

@Component({ /* … */ })
export class ProductListComponent implements OnInit {
  private service = inject(ProductService);
  state = signal<State<Product[]>>({ status: 'loading' });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.state.set({ status: 'loading' });

    this.service.getAll().subscribe({
      next: data => this.state.set({ status: 'success', data }),
      error: (e: Error) => this.state.set({ status: 'error', message: e.message })
    });
  }
}` },
    { t: 'code', lang: 'html', code: `
@switch (state().status) {
  @case ('loading') {
    <app-skeleton />
  }
  @case ('error') {
    <div class="error">
      <p>{{ state().message }}</p>
      <button (click)="load()">إعادة المحاولة</button>
    </div>
  }
  @case ('success') {
    @if (state().data.length) {
      @for (p of state().data; track p.id) { … }
    } @else {
      <p>لا توجد منتجات.</p>
    }
  }
}` },

    { t: 'exercise',
      title: 'تمرين: خدمة مقالات كاملة',
      brief: 'ابنِ خدمة تتصل بواجهة برمجية عامة وتعرض النتائج مع كل الحالات.',
      requirements: [
        'استخدم `https://jsonplaceholder.typicode.com/posts` كواجهة تجريبية.',
        'واجهة `Post` بالحقول: `id`, `title`, `body`, `userId`.',
        'خدمة `PostService` فيها: `getAll()` و `getById(id)` و `search(term)` و `create(post)`.',
        '`search` تستخدم `HttpParams` لتمرير المعاملات.',
        'معالجة أخطاء موحّدة برسائل عربية بحسب رمز الحالة.',
        'إعادة محاولة مرتين قبل الفشل النهائي.',
        'مكوّن يعرض الحالات الأربع: تحميل، خطأ مع زر إعادة، قائمة فارغة، نجاح.',
        'حقل بحث يرشّح النتائج ويستدعي الخدمة.',
        'معترض يضيف ترويسة `X-App: codeway` لكل طلب.'
      ],
      hints: [
        'استخدم `toSignal` أو أنبوب `async` لتجنّب الاشتراك اليدوي.',
        '`req.clone({ setHeaders: {…} })` لأن الطلب غير قابل للتغيير.',
        'ابدأ بحالة `loading` قبل إرسال الطلب لا بعده.'
      ],
      solution: { lang: 'ts', code: `
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, catchError, throwError, retry, timer } from 'rxjs';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private base = 'https://jsonplaceholder.typicode.com/posts';

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.base).pipe(
      retry({ count: 2, delay: () => timer(800) }),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Post> {
    return this.http.get<Post>(\`\${this.base}/\${id}\`).pipe(
      catchError(this.handleError)
    );
  }

  search(term: string, limit = 10): Observable<Post[]> {
    const params = new HttpParams()
      .set('q', term)
      .set('_limit', limit);

    return this.http.get<Post[]>(this.base, { params }).pipe(
      catchError(this.handleError)
    );
  }

  create(post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(this.base, post).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'حدث خطأ غير متوقّع.';

    if (error.status === 0)        message = 'تعذّر الاتصال بالخادم.';
    else if (error.status === 404) message = 'المقال غير موجود.';
    else if (error.status === 401) message = 'يرجى تسجيل الدخول.';
    else if (error.status >= 500)  message = 'خطأ في الخادم، حاول لاحقاً.';

    console.error('HTTP', error.status, error.message);
    return throwError(() => new Error(message));
  }
}

/* ---------- المعترض ---------- */

export const appHeaderInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ setHeaders: { 'X-App': 'codeway' } }));

/* ---------- المكوّن ---------- */

type State<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <input
      [(ngModel)]="term"
      (keyup.enter)="search()"
      placeholder="ابحث في المقالات…">
    <button (click)="search()">بحث</button>

    @switch (state().status) {
      @case ('loading') {
        <p>جارٍ التحميل…</p>
      }
      @case ('error') {
        <div class="error">
          <p>{{ state().message }}</p>
          <button (click)="load()">إعادة المحاولة</button>
        </div>
      }
      @case ('success') {
        @if (state().data.length) {
          @for (post of state().data; track post.id) {
            <article>
              <h3>{{ post.title }}</h3>
              <p>{{ post.body }}</p>
            </article>
          }
        } @else {
          <p>لا توجد نتائج مطابقة.</p>
        }
      }
    }
  \`
})
export class PostsComponent implements OnInit {
  private service = inject(PostService);

  term = '';
  state = signal<State<Post[]>>({ status: 'loading' });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.state.set({ status: 'loading' });
    this.service.getAll().subscribe({
      next: data => this.state.set({ status: 'success', data }),
      error: (e: Error) => this.state.set({ status: 'error', message: e.message })
    });
  }

  search(): void {
    if (!this.term.trim()) return this.load();
    this.state.set({ status: 'loading' });
    this.service.search(this.term).subscribe({
      next: data => this.state.set({ status: 'success', data }),
      error: (e: Error) => this.state.set({ status: 'error', message: e.message })
    });
  }
}` } },

    { t: 'quiz', items: [
      { q: 'ماذا يحدث إن استدعيت `http.get()` بلا اشتراك؟', options: ['يُرسل الطلب', 'لا يُرسل أي طلب — التدفّق بارد', 'خطأ', 'يُرسل بعد ثانية'], answer: 1,
        explain: 'التدفّقات الباردة لا تبدأ إلا عند الاشتراك، سواء بـ `subscribe` أو أنبوب `async`.' },
      { q: 'ما الخطأ في `params.set("q", term);` وحدها؟', options: ['لا خطأ', '`HttpParams` غير قابل للتغيير، فيجب إعادة إسناد الناتج', 'الاسم خاطئ', 'يجب استخدام add'], answer: 1,
        explain: 'كل استدعاء يُرجع كائناً جديداً؛ بدون إعادة الإسناد يُهمَل التعديل.' },
      { q: 'ماذا تعني `status: 0` في خطأ HTTP؟', options: ['نجاح', 'لم تصل استجابة — مشكلة شبكة أو CORS', 'الخادم مشغول', 'الطلب ملغى'], answer: 1,
        explain: 'غالباً CORS: يجب على الخادم إرسال ترويسة السماح؛ لا يمكن حلّها من العميل.' },
      { q: 'ما فائدة المعترض (Interceptor)؟', options: ['تسريع الطلبات', 'تطبيق منطق موحّد على كل الطلبات مثل إضافة ترويسة المصادقة', 'إلغاء الطلبات', 'تخزين النتائج'], answer: 1,
        explain: 'يمرّ عبره كل طلب واستجابة، فيغني عن تكرار المنطق في كل خدمة.' },
      { q: 'لماذا يُفضَّل أنبوب `async` على الاشتراك اليدوي؟', options: ['أسرع', 'يشترك ويلغي الاشتراك تلقائياً فيمنع تسريب الذاكرة', 'يدعم الأخطاء', 'أقصر فقط'], answer: 1,
        explain: 'إدارة دورة حياة الاشتراك تلقائية ومربوطة بعمر المكوّن.' }
    ]}
  ]
};
