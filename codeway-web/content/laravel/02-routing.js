'use strict';

module.exports = {
  slug: '02-routing',
  title: 'التوجيه والمتحكّمات',
  summary: 'تعريف المسارات ومعاملاتها، المسارات المسمّاة، مجموعات المسارات، والمتحكّمات الموردية RESTful.',
  duration: 55,
  level: 'مبتدئ',
  tags: ['Routing', 'Controllers', 'REST'],
  objectives: [
    'تعرّف مسارات لكل أفعال HTTP مع معاملات إلزامية واختيارية.',
    'تستخدم المسارات المسمّاة بدل كتابة الروابط يدوياً.',
    'تنظّم المسارات في مجموعات ببادئات ووسطاء مشتركة.',
    'تبني متحكّماً موردياً بالإجراءات السبعة.',
    'تستفيد من الربط التلقائي للنماذج (Route Model Binding).',
    'تعرّف مسارات API وتفرّق بينها وبين مسارات الويب.'
  ],
  quickRef: [
    { code: 'Route::get(uri, action)', desc: 'مسار GET' },
    { code: '->name(\'posts.show\')', desc: 'تسمية' },
    { code: 'route(\'posts.show\', $p)', desc: 'توليد رابط' },
    { code: 'Route::resource', desc: 'سبعة مسارات' },
    { code: 'Route::group', desc: 'تجميع' },
    { code: '->middleware(\'auth\')', desc: 'وسيط' },
    { code: '{post}', desc: 'ربط نموذج' },
    { code: 'php artisan route:list', desc: 'عرض المسارات' }
  ],
  blocks: [
    { t: 'h2', text: 'المسارات الأساسية' },
    { t: 'code', lang: 'php', code: `
<?php
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\PostController;

Route::get('/posts',        [PostController::class, 'index']);
Route::post('/posts',       [PostController::class, 'store']);
Route::put('/posts/{post}', [PostController::class, 'update']);
Route::patch('/posts/{post}', [PostController::class, 'update']);
Route::delete('/posts/{post}', [PostController::class, 'destroy']);

// عدة أفعال لنفس المسار
Route::match(['get', 'post'], '/search', [SearchController::class, 'handle']);
Route::any('/webhook', [WebhookController::class, 'handle']);

// إعادة توجيه
Route::redirect('/old-blog', '/posts', 301);

// عرض مباشر بلا متحكّم
Route::view('/terms', 'pages.terms', ['updated' => '2026-01-01']);
`.trim() },
    { t: 'note', text: 'في نماذج HTML لا يمكن إرسال `PUT` أو `DELETE` مباشرة. يستخدم Laravel حقلاً مخفياً `_method` تولّده تعليمة `@method(\'PUT\')` في Blade، ويقرأه الإطار ليعامل الطلب بالفعل الصحيح.' },

    { t: 'h2', text: 'المعاملات' },
    { t: 'code', lang: 'php', code: `
<?php
// معامل إلزامي
Route::get('/posts/{id}', function (string $id) {
    return "المقال رقم {$id}";
});

// معامل اختياري — لاحظ ? والقيمة الافتراضية
Route::get('/users/{name?}', function (?string $name = 'زائر') {
    return "مرحباً {$name}";
});

// عدة معاملات
Route::get('/posts/{post}/comments/{comment}', function ($post, $comment) {
    return "التعليق {$comment} على المقال {$post}";
});

// قيود على شكل المعامل
Route::get('/posts/{id}', fn ($id) => $id)->where('id', '[0-9]+');
Route::get('/users/{name}', fn ($n) => $n)->where('name', '[A-Za-z]+');

// اختصارات جاهزة للقيود
Route::get('/posts/{id}', fn ($id) => $id)->whereNumber('id');
Route::get('/users/{name}', fn ($n) => $n)->whereAlpha('name');
Route::get('/p/{slug}', fn ($s) => $s)->whereAlphaNumeric('slug');
Route::get('/o/{uuid}', fn ($u) => $u)->whereUuid('uuid');
Route::get('/s/{status}', fn ($s) => $s)->whereIn('status', ['draft', 'published']);
`.trim() },
    { t: 'tip', text: 'القيود تحلّ مشكلة تعارض المسارات: `/posts/create` و `/posts/{id}` يتعارضان، لكن `whereNumber(\'id\')` يجعل `create` يذهب للمسار الصحيح مهما كان ترتيبهما.' },

    { t: 'h2', text: 'المسارات المسمّاة' },
    { t: 'code', lang: 'php', code: `
<?php
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// توليد الروابط
route('posts.show', ['post' => 5]);           // /posts/5
route('posts.show', $post);                   // يستخرج المفتاح تلقائياً
route('posts.show', [$post, 'ref' => 'home']); // /posts/5?ref=home
route('posts.index', absolute: false);        // رابط نسبي

// إعادة التوجيه
return redirect()->route('posts.show', $post);
return to_route('posts.show', $post);         // اختصار

// معرفة المسار الحالي
request()->routeIs('posts.*');
`.trim() },
    { t: 'compare', lang: 'blade', bad: {
      code: `<a href="/posts/{{ $post->id }}">اقرأ</a>
<a href="/posts/{{ $post->id }}/edit">تعديل</a>`,
      why: 'تغيير بنية الروابط لاحقاً (مثل إضافة بادئة `/blog`) يعني البحث والاستبدال في كل ملفات العرض.'
    }, good: {
      code: `<a href="{{ route('posts.show', $post) }}">اقرأ</a>
<a href="{{ route('posts.edit', $post) }}">تعديل</a>`,
      why: 'الرابط يُولَّد من تعريف المسار، فتغيير البنية في `routes/web.php` يسري على كل الروابط تلقائياً.'
    }},

    { t: 'h2', text: 'مجموعات المسارات' },
    { t: 'code', lang: 'php', code: `
<?php
// بادئة مشتركة + وسيط + اسم
Route::middleware(['auth', 'verified'])
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {
        Route::get('/',      [DashboardController::class, 'index'])->name('index');
        Route::get('/stats', [DashboardController::class, 'stats'])->name('stats');
    });
// النتيجة: /dashboard و /dashboard/stats
// الأسماء: dashboard.index و dashboard.stats

// فضاء أسماء المتحكّمات
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'can:access-admin'])
    ->group(function () {
        Route::resource('posts', Admin\\PostController::class);
        Route::resource('users', Admin\\UserController::class)->except(['create', 'store']);
    });

// نطاق فرعي
Route::domain('{tenant}.example.com')->group(function () {
    Route::get('/', fn (string $tenant) => "لوحة {$tenant}");
});

// تحديد المعدّل
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/comments', [CommentController::class, 'store']);
});
`.trim() },

    { t: 'h2', text: 'المتحكّمات' },
    { t: 'code', lang: 'bash', code: `
php artisan make:controller PostController
php artisan make:controller PostController --resource
php artisan make:controller PostController --resource --model=Post
php artisan make:controller Api/PostController --api        # بلا create و edit
php artisan make:controller ShowDashboard --invokable       # إجراء واحد
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
namespace App\\Http\\Controllers;

use App\\Models\\Post;
use App\\Http\\Requests\\StorePostRequest;
use Illuminate\\Http\\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::query()
            ->published()
            ->with('author')
            ->when($request->search, fn ($q, $term) => $q->search($term))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return view('posts.index', compact('posts'));
    }

    public function create()
    {
        return view('posts.create', ['post' => new Post()]);
    }

    public function store(StorePostRequest $request)
    {
        $post = $request->user()->posts()->create($request->validated());

        return to_route('posts.show', $post)->with('success', 'نُشِر المقال بنجاح.');
    }

    public function show(Post $post)          // ربط تلقائي للنموذج
    {
        $post->load('author', 'comments.author');

        return view('posts.show', compact('post'));
    }

    public function edit(Post $post)
    {
        return view('posts.edit', compact('post'));
    }

    public function update(StorePostRequest $request, Post $post)
    {
        $post->update($request->validated());

        return to_route('posts.show', $post)->with('success', 'حُدِّث المقال.');
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return to_route('posts.index')->with('success', 'حُذِف المقال.');
    }
}
`.trim() },

    { t: 'h2', text: 'المتحكّم الموردي' },
    { t: 'code', lang: 'php', code: `
<?php
Route::resource('posts', PostController::class);

// خيارات
Route::resource('posts', PostController::class)->only(['index', 'show']);
Route::resource('posts', PostController::class)->except(['destroy']);
Route::apiResource('posts', Api\\PostController::class);  // بلا create و edit

// موارد متداخلة
Route::resource('posts.comments', CommentController::class)->shallow();

// عدة موارد دفعة واحدة
Route::resources([
    'posts'      => PostController::class,
    'categories' => CategoryController::class,
]);
`.trim() },
    { t: 'table', head: ['الفعل', 'المسار', 'الإجراء', 'اسم المسار'], rows: [
      ['GET', '/posts', '`index`', '`posts.index`'],
      ['GET', '/posts/create', '`create`', '`posts.create`'],
      ['POST', '/posts', '`store`', '`posts.store`'],
      ['GET', '/posts/{post}', '`show`', '`posts.show`'],
      ['GET', '/posts/{post}/edit', '`edit`', '`posts.edit`'],
      ['PUT/PATCH', '/posts/{post}', '`update`', '`posts.update`'],
      ['DELETE', '/posts/{post}', '`destroy`', '`posts.destroy`']
    ]},
    { t: 'note', text: '`shallow()` في الموارد المتداخلة يجعل المسارات التي تحتاج معرّف الابن فقط بلا بادئة الأب: `/comments/5` بدل `/posts/3/comments/5`. أنظف وأقصر.' },

    { t: 'h2', text: 'الربط التلقائي للنماذج' },
    { t: 'p', text: 'حين تكتب `Post $post` في المتحكّم واسم المعامل في المسار `{post}`، يجلب Laravel السجلّ من قاعدة البيانات تلقائياً — ويُرجع 404 إن لم يجده.' },
    { t: 'compare', lang: 'php', bad: {
      code: `Route::get('/posts/{id}', function ($id) {
    $post = Post::find($id);

    if (! $post) {
        abort(404);
    }

    return view('posts.show', compact('post'));
});`,
      why: 'ثلاثة أسطر متكرّرة في كل إجراء، ونسيان اختبار `null` مصدر خطأ صامت.'
    }, good: {
      code: `Route::get('/posts/{post}', function (Post $post) {
    return view('posts.show', compact('post'));
});`,
      why: 'الجلب و404 تلقائيان، والنوع في التوقيع يوثّق ما يتوقّعه الإجراء.'
    }},
    { t: 'code', lang: 'php', code: `
<?php
// الربط بعمود آخر (مثل slug)
Route::get('/posts/{post:slug}', fn (Post $post) => $post);

// أو على مستوى النموذج كله
class Post extends Model
{
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}

// الربط المتداخل — يتحقّق أن التعليق يخصّ هذا المقال فعلاً
Route::get('/posts/{post}/comments/{comment}', function (Post $post, Comment $comment) {
    return $comment;
})->scopeBindings();

// مع السجلّات المحذوفة ناعماً
Route::get('/posts/{post}', fn (Post $post) => $post)->withTrashed();
`.trim() },
    { t: 'tip', text: '`scopeBindings()` مهمّ أمنياً: بدونه يستطيع أحدهم طلب `/posts/1/comments/999` حيث التعليق 999 يخصّ مقالاً آخر تماماً — ويحصل عليه.' },

    { t: 'h2', text: 'مسارات API' },
    { t: 'code', lang: 'bash', code: `
php artisan install:api        # ينشئ routes/api.php ويثبّت Sanctum
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// routes/api.php — كل المسارات هنا لها بادئة /api تلقائياً
Route::get('/posts', [Api\\PostController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', Api\\PostController::class)->except(['index']);
    Route::get('/user', fn (Request $r) => $r->user());
});
`.trim() },
    { t: 'table', head: ['المعيار', '`web.php`', '`api.php`'], rows: [
      ['البادئة', 'لا شيء', '`/api`'],
      ['الجلسة', 'نعم', 'لا — بلا حالة'],
      ['حماية CSRF', 'نعم', 'لا'],
      ['المصادقة', 'كوكيز الجلسة', 'رموز (Sanctum/JWT)'],
      ['الاستجابة عند الخطأ', 'صفحة HTML', 'JSON']
    ]},

    { t: 'h2', text: 'الاستجابات' },
    { t: 'code', lang: 'php', code: `
<?php
return view('posts.index', compact('posts'));
return response()->json(['data' => $posts], 200);
return response()->json($post, 201);
return response('نصّ', 200)->header('Content-Type', 'text/plain');
return response()->noContent();                    // 204
return response()->download($path, 'تقرير.pdf');
return response()->streamDownload(fn () => echo $csv, 'data.csv');

// إعادة التوجيه
return back();
return back()->withInput()->withErrors($errors);
return redirect('/posts');
return to_route('posts.show', $post)->with('success', 'تمّ.');
return redirect()->away('https://example.com');

// الإجهاض
abort(404);
abort(403, 'غير مصرّح لك.');
abort_if($post->user_id !== auth()->id(), 403);
abort_unless($user->isAdmin(), 403);
`.trim() },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'واجهة مسارات لمتجر',
      brief: 'صمّم بنية مسارات كاملة لمتجر إلكتروني مع متحكّمات منظّمة.',
      requirements: [
        'واجهة عامة: الرئيسية، قائمة المنتجات مع بحث وترشيح، صفحة منتج بـ slug، صفحة تصنيف.',
        'السلّة: عرض، إضافة منتج، تحديث كمية، حذف عنصر، تفريغ.',
        'الطلبات: إنشاء طلب من السلّة، عرض طلبات المستخدم، عرض طلب واحد (لصاحبه فقط).',
        'لوحة الإدارة تحت `/admin` بوسيط `auth` وصلاحية `admin`: موارد كاملة للمنتجات والتصنيفات والطلبات.',
        'واجهة برمجية في `routes/api.php`: قائمة المنتجات ومنتج واحد بلا مصادقة، وبقيّة العمليات بـ Sanctum.',
        'استخدم `Route::resource` حيثما ينطبق، و `only`/`except` لتقليل المسارات غير المستخدمة.',
        'استخدم الربط بـ slug للمنتجات والتصنيفات، و `scopeBindings` في المسارات المتداخلة.',
        'أضف قيوداً على المعاملات: أرقام للمعرّفات، وحروف وأرقام للـ slugs.',
        'سمِّ كل المسارات باصطلاح `المورد.الإجراء`.',
        'اكتب متحكّماً واحداً على الأقل كاملاً مع الربط التلقائي والتحقّق من الصلاحية.'
      ],
      hints: [
        'استخدم مجموعات متداخلة: `prefix` داخل `middleware` داخل `name`.',
        '`Route::singleton(\'cart\', CartController::class)` للموارد المفردة.',
        '`->missing(fn () => to_route(\'products.index\'))` لتخصيص سلوك 404.',
        'اختبر النتيجة بـ `php artisan route:list --path=admin`.'
      ],
      solution: { lang: 'php', code: `
<?php
// ═══════════════════════════════════════════════
// routes/web.php
// ═══════════════════════════════════════════════
use App\\Http\\Controllers\\{
    HomeController, ProductController, CategoryController,
    CartController, OrderController
};
use App\\Http\\Controllers\\Admin;
use Illuminate\\Support\\Facades\\Route;

/*
|--------------------------------------------------------------------------
| الواجهة العامة
|--------------------------------------------------------------------------
*/
Route::get('/', HomeController::class)->name('home');

Route::controller(ProductController::class)->name('products.')->group(function () {
    Route::get('/products',              'index')->name('index');
    Route::get('/products/{product:slug}', 'show')->name('show')
        ->whereAlphaNumeric('product')
        ->missing(fn () => to_route('products.index')
            ->with('error', 'المنتج المطلوب غير موجود.'));
});

Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])
    ->name('categories.show');

/*
|--------------------------------------------------------------------------
| السلّة — مورد مفرد
|--------------------------------------------------------------------------
*/
Route::prefix('cart')->name('cart.')->controller(CartController::class)->group(function () {
    Route::get('/',                 'show')->name('show');
    Route::post('/items',           'store')->name('items.store');
    Route::patch('/items/{item}',   'update')->name('items.update')->whereNumber('item');
    Route::delete('/items/{item}',  'destroy')->name('items.destroy')->whereNumber('item');
    Route::delete('/',              'clear')->name('clear');
});

/*
|--------------------------------------------------------------------------
| الطلبات — للمسجَّلين فقط
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::resource('orders', OrderController::class)
        ->only(['index', 'store', 'show'])
        ->whereNumber('order');

    Route::patch('/orders/{order}/cancel', [OrderController::class, 'cancel'])
        ->name('orders.cancel')
        ->whereNumber('order');
});

/*
|--------------------------------------------------------------------------
| لوحة الإدارة
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'can:access-admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [Admin\\DashboardController::class, 'index'])->name('dashboard');

        Route::resource('products',   Admin\\ProductController::class);
        Route::resource('categories', Admin\\CategoryController::class)->except(['show']);
        Route::resource('orders',     Admin\\OrderController::class)->only(['index', 'show', 'update']);

        Route::patch('/products/{product}/toggle', [Admin\\ProductController::class, 'toggle'])
            ->name('products.toggle');
    });

// ═══════════════════════════════════════════════
// routes/api.php
// ═══════════════════════════════════════════════
use App\\Http\\Controllers\\Api;

Route::prefix('v1')->name('api.v1.')->group(function () {
    // عام
    Route::get('/products',                [Api\\ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product:slug}', [Api\\ProductController::class, 'show'])->name('products.show');
    Route::get('/categories',              [Api\\CategoryController::class, 'index'])->name('categories.index');

    // محمي
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', fn (Request $r) => $r->user())->name('user');

        Route::apiResource('orders', Api\\OrderController::class)
            ->only(['index', 'store', 'show']);

        Route::apiResource('products.reviews', Api\\ReviewController::class)
            ->only(['index', 'store'])
            ->scoped();
    });
});

// ═══════════════════════════════════════════════
// app/Http/Controllers/ProductController.php
// ═══════════════════════════════════════════════
namespace App\\Http\\Controllers;

use App\\Models\\{Product, Category};
use Illuminate\\Http\\Request;
use Illuminate\\View\\View;

class ProductController extends Controller
{
    public function index(Request $request): View
    {
        $products = Product::query()
            ->available()
            ->with('category')
            ->when($request->q, fn ($query, $term) =>
                $query->where('name', 'like', "%{$term}%")
            )
            ->when($request->category, fn ($query, $slug) =>
                $query->whereRelation('category', 'slug', $slug)
            )
            ->when($request->min, fn ($query, $min) => $query->where('price', '>=', $min))
            ->when($request->max, fn ($query, $max) => $query->where('price', '<=', $max))
            ->when($request->sort, fn ($query, $sort) => match ($sort) {
                'price_asc'  => $query->orderBy('price'),
                'price_desc' => $query->orderByDesc('price'),
                'newest'     => $query->latest(),
                default      => $query->orderBy('name'),
            }, fn ($query) => $query->latest())
            ->paginate(24)
            ->withQueryString();

        return view('products.index', [
            'products'   => $products,
            'categories' => Category::withCount('products')->orderBy('name')->get(),
            'filters'    => $request->only(['q', 'category', 'min', 'max', 'sort']),
        ]);
    }

    public function show(Product $product): View
    {
        abort_unless($product->is_available, 404);

        $product->load('category', 'reviews.user');

        $related = Product::available()
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->getKey())
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return view('products.show', compact('product', 'related'));
    }
}

// ═══════════════════════════════════════════════
// app/Http/Controllers/OrderController.php
// ═══════════════════════════════════════════════
namespace App\\Http\\Controllers;

use App\\Models\\Order;
use App\\Services\\CartService;
use Illuminate\\Http\\{Request, RedirectResponse};
use Illuminate\\View\\View;

class OrderController extends Controller
{
    public function __construct(private readonly CartService $cart)
    {
    }

    public function index(Request $request): View
    {
        $orders = $request->user()
            ->orders()
            ->with('items.product')
            ->latest()
            ->paginate(10);

        return view('orders.index', compact('orders'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'address' => ['required', 'string', 'min:10', 'max:255'],
            'city'    => ['required', 'string', 'max:60'],
            'phone'   => ['required', 'string', 'regex:/^05\\d{8}$/'],
            'notes'   => ['nullable', 'string', 'max:500'],
        ]);

        if ($this->cart->isEmpty()) {
            return back()->with('error', 'السلّة فارغة.');
        }

        $order = $this->cart->checkout($request->user(), $validated);

        return to_route('orders.show', $order)
            ->with('success', "تمّ إنشاء الطلب #{$order->id} بنجاح.");
    }

    public function show(Request $request, Order $order): View
    {
        // الحماية الأهمّ: لا يرى المستخدم إلا طلباته
        abort_unless($order->user_id === $request->user()->id, 403);

        $order->load('items.product');

        return view('orders.show', compact('order'));
    }

    public function cancel(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);
        abort_unless($order->isCancellable(), 422, 'لا يمكن إلغاء هذا الطلب.');

        $order->cancel();

        return back()->with('success', 'أُلغي الطلب واستُرجع المخزون.');
    }
}
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'لماذا نستخدم `route(\'posts.show\', $post)` بدل كتابة `/posts/{$post->id}`؟', options: ['أقصر', 'تغيير بنية المسار في مكان واحد يسري على كل الروابط تلقائياً', 'أسرع', 'إلزامي'], answer: 1,
        explain: 'إضافة بادئة `/blog` مثلاً تتطلّب بحثاً واستبدالاً في كل العروض بالطريقة اليدوية.' },
      { q: 'كم مساراً يولّد `Route::resource(\'posts\', ...)`؟', options: ['5', '7 مسارات RESTful', '4', '10'], answer: 1,
        explain: 'و`apiResource` يولّد 5 فقط لأنه يحذف `create` و `edit` (نماذج HTML لا لزوم لها في API).' },
      { q: 'ما فائدة الربط التلقائي للنماذج؟', options: ['السرعة', 'يجلب السجلّ ويُرجع 404 تلقائياً بدل كتابة `find` واختبار null يدوياً', 'الأمان فقط', 'التوثيق'], answer: 1,
        explain: 'ويوثّق التوقيع ما يتوقّعه الإجراء عبر تلميح النوع.' },
      { q: 'ما خطر ترك المسارات المتداخلة بلا `scopeBindings()`؟', options: ['بطء', 'يستطيع المستخدم طلب `/posts/1/comments/999` حيث التعليق يخصّ مقالاً آخر ويحصل عليه', 'خطأ 500', 'لا خطر'], answer: 1,
        explain: 'ثغرة وصول شائعة؛ `scopeBindings` تتحقّق أن الابن يخصّ الأب فعلاً.' },
      { q: 'ما الفرق الجوهري بين `web.php` و `api.php`؟', options: ['المسار فقط', 'الأول بجلسة وحماية CSRF، والثاني بلا حالة ويصادق بالرموز ويُرجع JSON عند الخطأ', 'لا فرق', 'الثاني أسرع'], answer: 1,
        explain: 'ولهذا تُستخدم Sanctum أو JWT في مسارات API لا كوكيز الجلسة.' },
      { q: 'ما فائدة `whereNumber(\'id\')` على المسار؟', options: ['التحقّق من الإدخال', 'يقيّد المطابقة بالأرقام فيمنع تعارض `/posts/create` مع `/posts/{id}`', 'الأداء', 'التوثيق'], answer: 1,
        explain: 'حلّ نظيف لمشكلة تعارض المسارات لا يعتمد على ترتيب التعريف.' }
    ]}
  ]
};
