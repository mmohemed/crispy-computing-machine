'use strict';

module.exports = {
  slug: '09-middleware-api',
  title: 'الوسطاء وبناء واجهة برمجية',
  summary: 'كتابة الوسطاء وتسجيلها، بناء API نظيفة بـ Resources، معالجة الأخطاء، والترقيم والترشيح والاختبار.',
  duration: 60,
  level: 'متقدم',
  tags: ['Middleware', 'API', 'Resources'],
  objectives: [
    'تكتب وسيطاً وتسجّله على المستوى المناسب.',
    'تفهم ترتيب تنفيذ الوسطاء وأثره.',
    'تبني واجهة برمجية بمبادئ REST.',
    'تشكّل الاستجابات بـ API Resources.',
    'توحّد معالجة الأخطاء وتُرجع JSON صحيحاً.',
    'توثّق واجهتك وتختبرها.'
  ],
  quickRef: [
    { code: 'make:middleware X', desc: 'وسيط جديد' },
    { code: '$middleware->alias([...])', desc: 'تسجيل باسم' },
    { code: 'make:resource PostResource', desc: 'مورد' },
    { code: '::collection($posts)', desc: 'مجموعة موارد' },
    { code: 'whenLoaded(\'author\')', desc: 'علاقة إن حُمِّلت' },
    { code: 'response()->json($d, 201)', desc: 'استجابة' },
    { code: 'throttle:60,1', desc: 'تحديد معدّل' },
    { code: 'ApiException', desc: 'أخطاء موحّدة' }
  ],
  blocks: [
    { t: 'h2', text: 'ما الوسيط؟' },
    { t: 'p', text: 'طبقة تعترض الطلب **قبل** وصوله للمتحكّم و/أو الاستجابة **بعد** خروجها منه. مثالية لكل ما يتكرّر: المصادقة، التسجيل، تحديد المعدّل، ضغط الاستجابة، تعديل اللغة.' },
    { t: 'code', lang: 'bash', code: `
php artisan make:middleware EnsureUserIsSubscribed
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpFoundation\\Response;

class EnsureUserIsSubscribed
{
    public function handle(Request $request, Closure $next, string $plan = 'basic'): Response
    {
        $user = $request->user();

        // ═══ قبل المتحكّم ═══
        if (! $user?->subscribedTo($plan)) {
            return $request->expectsJson()
                ? response()->json(['message' => 'الاشتراك مطلوب.'], 402)
                : redirect()->route('billing')->with('error', 'خطّتك لا تشمل هذه الميزة.');
        }

        $response = $next($request);        // ← المتحكّم ينفّذ هنا

        // ═══ بعد المتحكّم ═══
        $response->headers->set('X-Plan', $user->plan);

        return $response;
    }

    /** يُنفَّذ بعد إرسال الاستجابة للمتصفّح */
    public function terminate(Request $request, Response $response): void
    {
        UsageLog::record($request->user(), $request->path());
    }
}
`.trim() },
    { t: 'h3', text: 'التسجيل' },
    { t: 'code', lang: 'php', code: `
<?php
// bootstrap/app.php — Laravel 11+
->withMiddleware(function (Middleware $middleware) {
    // على كل الطلبات
    $middleware->append(TrackVisits::class);
    $middleware->prepend(ForceHttps::class);

    // على مجموعة web
    $middleware->web(append: [SetLocale::class]);

    // على مجموعة api
    $middleware->api(prepend: [EnsureJsonRequest::class]);

    // باسم مختصر
    $middleware->alias([
        'subscribed' => EnsureUserIsSubscribed::class,
        'admin'      => EnsureUserIsAdmin::class,
    ]);

    // ترتيب مضمون
    $middleware->priority([
        StartSession::class,
        SetLocale::class,
        Authenticate::class,
    ]);
})
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// الاستخدام
Route::middleware('subscribed')->group(...);
Route::middleware('subscribed:premium')->group(...);      // مع معامل
Route::get('/x', ...)->middleware(['auth', 'subscribed:pro']);
Route::get('/y', ...)->withoutMiddleware([VerifyCsrfToken::class]);
`.trim() },
    { t: 'h3', text: 'ترتيب التنفيذ' },
    { t: 'demo', title: 'كيف يمرّ الطلب عبر الوسطاء', height: 300,
      css: 'body{font-family:system-ui;margin:0;padding:14px;background:#fff;font-size:.85em}.layer{border:2px solid #ff2d20;border-radius:10px;padding:10px 12px;margin-bottom:0}.l2{border-color:#f59e0b;margin:8px}.l3{border-color:#10b981;margin:8px}.core{background:#eef2ff;border:2px solid #6366f1;border-radius:8px;padding:12px;text-align:center;font-weight:700;margin:8px}.lbl{font-weight:700;font-size:.9em;margin-bottom:4px}.dir{font-size:.78em;color:#64748b}',
      html: '<div class="layer"><div class="lbl">1. الوسطاء العامّون</div><div class="dir">↓ قبل &nbsp;·&nbsp; ↑ بعد</div><div class="layer l2"><div class="lbl">2. وسطاء المجموعة (web / api)</div><div class="dir">↓ قبل &nbsp;·&nbsp; ↑ بعد</div><div class="layer l3"><div class="lbl">3. وسطاء المسار</div><div class="dir">↓ قبل &nbsp;·&nbsp; ↑ بعد</div><div class="core">المتحكّم</div></div></div></div>' },
    { t: 'note', text: 'الوسطاء تعمل كطبقات بصلة: الطلب يدخل من الخارج للداخل، والاستجابة تخرج من الداخل للخارج بالترتيب المعكوس. لهذا الشيفرة قبل `$next($request)` تعمل على الطلب، وبعدها على الاستجابة.' },
    { t: 'h3', text: 'أمثلة عملية' },
    { t: 'code', lang: 'php', code: `
<?php
// تعيين اللغة
class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->user()?->locale
            ?? $request->cookie('locale')
            ?? $request->getPreferredLanguage(['ar', 'en'])
            ?? config('app.locale');

        app()->setLocale($locale);

        return $next($request);
    }
}

// تسجيل زمن الاستجابة
class LogSlowRequests
{
    public function handle(Request $request, Closure $next)
    {
        $started  = microtime(true);
        $response = $next($request);
        $ms       = round((microtime(true) - $started) * 1000);

        if ($ms > 1000) {
            Log::warning('طلب بطيء', [
                'path' => $request->path(), 'ms' => $ms, 'user' => $request->user()?->id,
            ]);
        }

        return $response->header('X-Response-Time', "{$ms}ms");
    }
}

// رؤوس الأمان
class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        return $next($request)
            ->header('X-Content-Type-Options', 'nosniff')
            ->header('X-Frame-Options', 'SAMEORIGIN')
            ->header('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->header('Permissions-Policy', 'geolocation=(), microphone=()');
    }
}
`.trim() },

    { t: 'h2', text: 'بناء واجهة برمجية' },
    { t: 'code', lang: 'bash', code: `
php artisan install:api
php artisan make:controller Api/V1/PostController --api --model=Post
php artisan make:resource PostResource
php artisan make:resource PostCollection
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// routes/api.php
Route::prefix('v1')->name('api.v1.')->group(function () {
    Route::get('posts',       [PostController::class, 'index'])->name('posts.index');
    Route::get('posts/{post:slug}', [PostController::class, 'show'])->name('posts.show');

    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('posts', PostController::class)->except(['index', 'show']);
        Route::apiResource('posts.comments', CommentController::class)->shallow()->scoped();
    });
});
`.trim() },
    { t: 'table', head: ['الحالة', 'المعنى', 'متى'], rows: [
      ['**200**', 'OK', 'نجاح مع محتوى'],
      ['**201**', 'Created', 'إنشاء ناجح'],
      ['**204**', 'No Content', 'حذف أو تحديث بلا محتوى'],
      ['**400**', 'Bad Request', 'طلب مشوّه'],
      ['**401**', 'Unauthorized', 'غير مصادَق — سجّل الدخول'],
      ['**403**', 'Forbidden', 'مصادَق لكن ممنوع'],
      ['**404**', 'Not Found', 'المورد غير موجود'],
      ['**409**', 'Conflict', 'تعارض مع الحالة الحالية'],
      ['**422**', 'Unprocessable', 'فشل التحقّق'],
      ['**429**', 'Too Many', 'تجاوز حدّ المعدّل'],
      ['**500**', 'Server Error', 'خطأ غير متوقّع']
    ]},

    { t: 'h2', text: 'API Resources' },
    { t: 'p', text: 'المورد طبقة تحويل بين النموذج و JSON. بدونه ترسل بنية القاعدة كما هي — بما فيها حقول لا يجب أن يراها العميل، ويصبح أي تغيير في القاعدة تغييراً كاسراً في واجهتك.' },
    { t: 'code', lang: 'php', code: `
<?php
namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'slug'       => $this->slug,
            'title'      => $this->title,
            'excerpt'    => $this->excerpt,

            // الحقل الثقيل في العرض المفصّل فقط
            'body'       => $this->when($request->routeIs('*.show'), $this->body),

            'status'     => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
            ],

            'stats' => [
                'views'    => $this->views_count,
                'comments' => $this->whenCounted('comments'),
                'reading_minutes' => $this->reading_minutes,
            ],

            // العلاقة فقط إن كانت محمّلة — يمنع N+1
            'author' => UserResource::make($this->whenLoaded('author')),
            'tags'   => TagResource::collection($this->whenLoaded('tags')),

            // حقول للمالك فقط
            'is_draft'   => $this->when($request->user()?->can('update', $this->resource), fn () =>
                ! $this->isPublished()
            ),

            'published_at' => $this->published_at?->toIso8601String(),
            'created_at'   => $this->created_at->toIso8601String(),

            'links' => [
                'self' => route('api.v1.posts.show', $this->slug),
                'web'  => route('posts.show', $this->slug),
            ],
        ];
    }

    /** بيانات إضافية خارج data */
    public function with(Request $request): array
    {
        return ['meta' => ['version' => 'v1']];
    }
}
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// الاستخدام
return PostResource::make($post);
return PostResource::collection($posts);            // يشمل روابط الترقيم تلقائياً

return PostResource::make($post)
    ->additional(['meta' => ['related_count' => 4]])
    ->response()
    ->setStatusCode(201);

// إزالة غلاف data
JsonResource::withoutWrapping();                    // في AppServiceProvider
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// مجموعة مخصّصة
class PostCollection extends ResourceCollection
{
    public $collects = PostResource::class;

    public function toArray(Request $request): array
    {
        return [
            'data'    => $this->collection,
            'summary' => [
                'total'      => $this->collection->count(),
                'published'  => $this->collection->where('status', 'published')->count(),
                'total_views'=> $this->collection->sum('views_count'),
            ],
        ];
    }
}
`.trim() },
    { t: 'tip', text: '`whenLoaded` هي أهمّ دالة في الموارد: تمنع تحميل العلاقة إن لم تكن محمّلة مسبقاً، فتقضي على N+1 من الجذر بدل إخفائه.' },

    { t: 'h2', text: 'المتحكّم' },
    { t: 'code', lang: 'php', code: `
<?php
namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Resources\\PostResource;
use App\\Http\\Requests\\Api\\{StorePostRequest, UpdatePostRequest};
use App\\Models\\Post;
use Illuminate\\Http\\{Request, JsonResponse, Response};

class PostController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Post::class, 'post');
    }

    public function index(Request $request)
    {
        $posts = Post::query()
            ->published()
            ->with(['author:id,name', 'tags:id,name,slug'])
            ->withCount('comments')
            ->filter($request->only(['q', 'tag', 'author', 'sort']))
            ->cursorPaginate($request->integer('per_page', 15))
            ->withQueryString();

        return PostResource::collection($posts);
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $request->user()->posts()->create($request->validated());

        $post->tags()->sync($request->input('tag_ids', []));
        $post->load(['author', 'tags']);

        return PostResource::make($post)
            ->response()
            ->setStatusCode(Response::HTTP_CREATED)
            ->header('Location', route('api.v1.posts.show', $post));
    }

    public function show(Post $post)
    {
        $post->load(['author', 'tags'])->loadCount('comments');
        $post->increment('views_count');

        return PostResource::make($post);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $post->update($request->validated());

        if ($request->has('tag_ids')) {
            $post->tags()->sync($request->input('tag_ids'));
        }

        return PostResource::make($post->fresh(['author', 'tags']));
    }

    public function destroy(Post $post): Response
    {
        $post->delete();

        return response()->noContent();
    }
}
`.trim() },

    { t: 'h2', text: 'معالجة الأخطاء' },
    { t: 'code', lang: 'php', code: `
<?php
// bootstrap/app.php
->withExceptions(function (Exceptions $exceptions) {
    // استجابة JSON موحّدة لكل أخطاء API
    $exceptions->render(function (Throwable $e, Request $request) {
        if (! $request->is('api/*') && ! $request->expectsJson()) {
            return null;                  // اترك السلوك الافتراضي للويب
        }

        [$status, $message] = match (true) {
            $e instanceof ValidationException      => [422, 'البيانات المُرسَلة غير صالحة.'],
            $e instanceof AuthenticationException  => [401, 'يجب تسجيل الدخول.'],
            $e instanceof AuthorizationException   => [403, $e->getMessage() ?: 'غير مصرّح.'],
            $e instanceof ModelNotFoundException   => [404, 'المورد المطلوب غير موجود.'],
            $e instanceof NotFoundHttpException    => [404, 'المسار غير موجود.'],
            $e instanceof MethodNotAllowedHttpException => [405, 'الطريقة غير مسموحة.'],
            $e instanceof ThrottleRequestsException=> [429, 'طلبات كثيرة — أبطئ قليلاً.'],
            $e instanceof HttpException            => [$e->getStatusCode(), $e->getMessage()],
            default                                => [500, 'حدث خطأ في الخادم.'],
        };

        $payload = ['message' => $message, 'status' => $status];

        if ($e instanceof ValidationException) {
            $payload['errors'] = $e->errors();
        }

        // تفاصيل التنقيح في غير الإنتاج فقط
        if (! app()->isProduction() && $status === 500) {
            $payload['debug'] = [
                'exception' => $e::class,
                'message'   => $e->getMessage(),
                'file'      => $e->getFile() . ':' . $e->getLine(),
            ];
        }

        return response()->json($payload, $status);
    });

    // لا تسجّل أخطاء متوقّعة
    $exceptions->dontReport([
        ValidationException::class,
        ModelNotFoundException::class,
    ]);
})
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// أخطاء عمل مخصّصة
namespace App\\Exceptions;

class InsufficientStockException extends Exception
{
    public function __construct(
        public readonly Product $product,
        public readonly int $requested,
    ) {
        parent::__construct(
            "الكمية المطلوبة ({$requested}) تتجاوز المتاح ({$product->stock})."
        );
    }

    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
            'code'    => 'insufficient_stock',
            'details' => [
                'product_id' => $this->product->id,
                'available'  => $this->product->stock,
                'requested'  => $this->requested,
            ],
        ], 409);
    }
}
`.trim() },
    { t: 'tip', text: 'اجعل الخطأ يعرّف `render()` بنفسه: يبقى منطق العرض بجانب تعريف الخطأ بدل تضخّم ملف المعالجة المركزي بعشرات الحالات.' },

    { t: 'h2', text: 'الترشيح والترقيم' },
    { t: 'code', lang: 'php', code: `
<?php
// نطاق filter في النموذج
public function scopeFilter(Builder $query, array $filters): void
{
    $query->when($filters['q'] ?? null, fn ($q, $term) =>
            $q->where(fn ($q) => $q->where('title', 'like', "%{$term}%")
                                   ->orWhere('excerpt', 'like', "%{$term}%")))
         ->when($filters['tag'] ?? null, fn ($q, $slug) =>
            $q->whereRelation('tags', 'slug', $slug))
         ->when($filters['author'] ?? null, fn ($q, $id) =>
            $q->where('user_id', $id))
         ->when($filters['sort'] ?? null, fn ($q, $sort) => match ($sort) {
            'oldest'   => $q->oldest(),
            'popular'  => $q->orderByDesc('views_count'),
            'comments' => $q->orderByDesc('comments_count'),
            default    => $q->latest(),
         }, fn ($q) => $q->latest());
}
`.trim() },
    { t: 'table', head: ['نوع الترقيم', 'المزايا', 'العيوب'], rows: [
      ['`paginate()`', 'أرقام صفحات وقفز مباشر', '`COUNT(*)` في كل طلب — بطيء على الملايين'],
      ['`simplePaginate()`', 'أسرع — بلا عدّ', 'لا يعرف العدد الكلي'],
      ['`cursorPaginate()`', 'الأسرع والأثبت مع البيانات المتغيّرة', 'لا قفز لصفحة، ويحتاج ترتيباً ثابتاً']
    ]},
    { t: 'note', text: 'الترقيم بالمؤشّر (cursor) يحلّ مشكلة خفية: مع `offset` العادي، إضافة سجلّ جديد أثناء تصفّح المستخدم تُزيح النتائج فيرى عنصراً مكرّراً أو يفوته آخر.' },

    { t: 'h2', text: 'الاختبار' },
    { t: 'code', lang: 'php', code: `
<?php
use App\\Models\\{User, Post};
use Laravel\\Sanctum\\Sanctum;

it('يعرض المقالات المنشورة للجميع', function () {
    Post::factory()->count(3)->published()->create();
    Post::factory()->draft()->create();

    $this->getJson(route('api.v1.posts.index'))
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonStructure([
            'data' => [['id', 'slug', 'title', 'excerpt', 'stats', 'links']],
            'meta',
        ]);
});

it('يمنع الإنشاء بلا مصادقة', function () {
    $this->postJson(route('api.v1.posts.store'), ['title' => 'عنوان'])
        ->assertUnauthorized();
});

it('ينشئ مقالاً للمستخدم المصادَق', function () {
    Sanctum::actingAs(User::factory()->create(), ['posts:write']);

    $this->postJson(route('api.v1.posts.store'), [
            'title' => 'عنوان المقال الجديد',
            'body'  => str_repeat('محتوى كافٍ. ', 20),
        ])
        ->assertCreated()
        ->assertJsonPath('data.title', 'عنوان المقال الجديد')
        ->assertHeader('Location');

    $this->assertDatabaseCount('posts', 1);
});

it('يُرجع 422 مع تفاصيل الأخطاء', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->postJson(route('api.v1.posts.store'), ['title' => 'قصير'])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['title', 'body'])
        ->assertJsonStructure(['message', 'errors']);
});

it('يمنع تعديل مقال الغير بـ 403', function () {
    Sanctum::actingAs(User::factory()->create());
    $post = Post::factory()->create();

    $this->putJson(route('api.v1.posts.update', $post), ['title' => 'مخترَق'])
        ->assertForbidden();
});

it('يحترم حدّ المعدّل', function () {
    Sanctum::actingAs(User::factory()->create());

    foreach (range(1, 61) as $i) {
        $response = $this->getJson(route('api.v1.posts.index'));
    }

    $response->assertStatus(429);
});

it('لا ينفّذ استعلامات زائدة (بلا N+1)', function () {
    Post::factory()->count(10)->published()->create();

    DB::enableQueryLog();
    $this->getJson(route('api.v1.posts.index'))->assertOk();

    expect(DB::getQueryLog())->toHaveCount(3);   // المقالات + الكتّاب + الوسوم
});
`.trim() },

    { t: 'h2', text: 'التوثيق و CORS' },
    { t: 'code', lang: 'bash', code: `
# توثيق تلقائي من الشيفرة والاختبارات
composer require --dev knuckleswtf/scribe
php artisan scribe:generate

# أو OpenAPI
composer require --dev dedoc/scramble
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['X-RateLimit-Remaining'],
    'max_age' => 3600,
    'supports_credentials' => true,       // إلزامي لمصادقة SPA بالكوكيز
];
`.trim() },
    { t: 'danger', title: 'لا تضع `allowed_origins => [\'*\']` مع `supports_credentials`', text: 'المتصفّحات ترفض هذه التركيبة، والأهمّ أنها تفتح واجهتك لأي موقع. حدّد النطاقات المسموحة صراحةً من متغيّر بيئة.' },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'واجهة برمجية كاملة لمدوّنة',
      brief: 'ابنِ API نسخة 1 كاملة بكل ما تعلّمته: موارد، وسطاء، أخطاء موحّدة، اختبارات.',
      requirements: [
        'موارد: `posts`, `comments`, `tags`, `users` — مع الأفعال المناسبة لكلٍّ.',
        'مصادقة Sanctum مع رموز ذات صلاحيات: `posts:read`, `posts:write`, `comments:write`, `admin`.',
        'وسيط `ForceJsonResponse` يجعل كل استجابات API بصيغة JSON حتى عند الخطأ.',
        'وسيط `LogApiRequests` يسجّل كل طلب: المستخدم، المسار، الحالة، زمن الاستجابة.',
        'وسيط `ApiVersion` يقرأ رأس `Accept-Version` ويوجّه للنسخة المناسبة.',
        'تحديد معدّل متدرّج: 30/دقيقة للزوّار، 120 للمسجَّلين، بلا حدّ للمشتركين.',
        'موارد بحقول شرطية: `body` في العرض المفصّل فقط، وحقول المالك للمالك فقط.',
        'ترشيح شامل: بحث، وسم، كاتب، مدى تاريخ، ترتيب — كلها عبر معاملات الاستعلام.',
        'ترقيم بالمؤشّر مع `per_page` قابل للضبط بحدّ أقصى 50.',
        'معالجة أخطاء موحّدة تُرجع `{message, status, errors?, code?}` دائماً.',
        'خطأ مخصّص `PostLockedException` يُرجع 423 مع تفاصيله.',
        'اختبارات: نجاح كل نقطة، والمصادقة، والصلاحيات، والتحقّق، وحدّ المعدّل، وغياب N+1.',
        'وثّق الواجهة بـ Scribe أو ملف OpenAPI يدوي.'
      ],
      hints: [
        '`$request->headers->set(\'Accept\', \'application/json\')` في وسيط ForceJson.',
        '`RateLimiter::for(\'api\', fn ($r) => ...)` مع منطق متدرّج حسب المستخدم.',
        '`$this->when($condition, $value)` و `$this->whenLoaded(...)` في الموارد.',
        '`DB::enableQueryLog()` في الاختبار لعدّ الاستعلامات وضمان غياب N+1.'
      ],
      solution: { lang: 'php', code: `
<?php
// ═══════════════════════════════════════════════
// app/Http/Middleware/ForceJsonResponse.php
// ═══════════════════════════════════════════════
namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class ForceJsonResponse
{
    public function handle(Request $request, Closure $next)
    {
        $request->headers->set('Accept', 'application/json');

        $response = $next($request);

        if (! $response->headers->has('Content-Type')) {
            $response->headers->set('Content-Type', 'application/json');
        }

        return $response;
    }
}

// ═══════════════════════════════════════════════
// app/Http/Middleware/LogApiRequests.php
// ═══════════════════════════════════════════════
class LogApiRequests
{
    public function handle(Request $request, Closure $next)
    {
        $started = microtime(true);

        $response = $next($request);

        $ms = round((microtime(true) - $started) * 1000, 1);

        Log::channel('api')->info('api.request', [
            'method'   => $request->method(),
            'path'     => $request->path(),
            'status'   => $response->getStatusCode(),
            'duration' => $ms,
            'user_id'  => $request->user()?->id,
            'ip'       => $request->ip(),
            'agent'    => substr((string) $request->userAgent(), 0, 120),
        ]);

        return $response
            ->header('X-Response-Time', "{$ms}ms")
            ->header('X-Request-Id', (string) Str::uuid());
    }
}

// ═══════════════════════════════════════════════
// app/Http/Middleware/ApiVersion.php
// ═══════════════════════════════════════════════
class ApiVersion
{
    private const SUPPORTED = ['v1', 'v2'];
    private const LATEST    = 'v1';

    public function handle(Request $request, Closure $next)
    {
        $version = $request->header('Accept-Version', self::LATEST);

        if (! in_array($version, self::SUPPORTED, true)) {
            return response()->json([
                'message'   => "نسخة الواجهة «{$version}» غير مدعومة.",
                'status'    => 400,
                'code'      => 'unsupported_version',
                'supported' => self::SUPPORTED,
            ], 400);
        }

        $request->attributes->set('api_version', $version);

        return $next($request)->header('X-Api-Version', $version);
    }
}

// ═══════════════════════════════════════════════
// bootstrap/app.php
// ═══════════════════════════════════════════════
->withMiddleware(function (Middleware $middleware) {
    $middleware->api(prepend: [
        \\App\\Http\\Middleware\\ForceJsonResponse::class,
        \\App\\Http\\Middleware\\ApiVersion::class,
    ]);

    $middleware->api(append: [
        \\App\\Http\\Middleware\\LogApiRequests::class,
    ]);

    $middleware->alias([
        'abilities' => \\Laravel\\Sanctum\\Http\\Middleware\\CheckAbilities::class,
        'ability'   => \\Laravel\\Sanctum\\Http\\Middleware\\CheckForAnyAbility::class,
    ]);
})

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (Throwable $e, Request $request) {
        if (! $request->is('api/*')) {
            return null;
        }

        [$status, $message, $code] = match (true) {
            $e instanceof ValidationException            => [422, 'البيانات المُرسَلة غير صالحة.', 'validation_failed'],
            $e instanceof AuthenticationException        => [401, 'يجب تسجيل الدخول للوصول لهذا المورد.', 'unauthenticated'],
            $e instanceof AuthorizationException         => [403, $e->getMessage() ?: 'ليس لديك صلاحية.', 'forbidden'],
            $e instanceof ModelNotFoundException         => [404, 'المورد المطلوب غير موجود.', 'not_found'],
            $e instanceof NotFoundHttpException          => [404, 'المسار المطلوب غير موجود.', 'route_not_found'],
            $e instanceof MethodNotAllowedHttpException  => [405, 'طريقة الطلب غير مسموحة لهذا المسار.', 'method_not_allowed'],
            $e instanceof ThrottleRequestsException      => [429, 'طلبات كثيرة جداً — انتظر قليلاً.', 'rate_limited'],
            $e instanceof HttpExceptionInterface         => [$e->getStatusCode(), $e->getMessage(), 'http_error'],
            default                                      => [500, 'حدث خطأ غير متوقّع في الخادم.', 'server_error'],
        };

        $payload = compact('message', 'status', 'code');

        if ($e instanceof ValidationException) {
            $payload['errors'] = $e->errors();
        }

        if ($e instanceof ThrottleRequestsException) {
            $payload['retry_after'] = $e->getHeaders()['Retry-After'] ?? null;
        }

        if (! app()->isProduction() && $status >= 500) {
            $payload['debug'] = [
                'exception' => $e::class,
                'message'   => $e->getMessage(),
                'location'  => $e->getFile() . ':' . $e->getLine(),
                'trace'     => collect($e->getTrace())->take(5)->map(
                    fn ($f) => ($f['file'] ?? '?') . ':' . ($f['line'] ?? '?')
                )->all(),
            ];
        }

        return response()->json($payload, $status);
    });

    $exceptions->dontReport([
        ValidationException::class,
        AuthenticationException::class,
        AuthorizationException::class,
        ModelNotFoundException::class,
    ]);
})

// ═══════════════════════════════════════════════
// app/Exceptions/PostLockedException.php
// ═══════════════════════════════════════════════
namespace App\\Exceptions;

use App\\Models\\Post;
use Exception;
use Illuminate\\Http\\{Request, JsonResponse};

class PostLockedException extends Exception
{
    public function __construct(public readonly Post $post)
    {
        parent::__construct("المقال «{$post->title}» مقفل ولا يمكن تعديله.");
    }

    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
            'status'  => 423,
            'code'    => 'post_locked',
            'details' => [
                'post_id'   => $this->post->id,
                'locked_at' => $this->post->locked_at?->toIso8601String(),
                'locked_by' => $this->post->lockedBy?->name,
                'reason'    => $this->post->lock_reason,
            ],
        ], 423);
    }
}

// ═══════════════════════════════════════════════
// app/Providers/AppServiceProvider.php — تحديد المعدّل
// ═══════════════════════════════════════════════
use Illuminate\\Cache\\RateLimiting\\Limit;
use Illuminate\\Support\\Facades\\RateLimiter;

public function boot(): void
{
    RateLimiter::for('api', function (Request $request) {
        $user = $request->user();

        return match (true) {
            $user?->isSubscribed()  => Limit::none(),
            $user !== null          => Limit::perMinute(120)->by($user->id),
            default                 => Limit::perMinute(30)->by($request->ip()),
        };
    });

    RateLimiter::for('api-write', fn (Request $request) =>
        Limit::perMinute(20)->by($request->user()?->id ?: $request->ip())
             ->response(fn () => response()->json([
                 'message' => 'عمليات كتابة كثيرة — انتظر دقيقة.',
                 'status'  => 429,
                 'code'    => 'write_rate_limited',
             ], 429))
    );
}

// ═══════════════════════════════════════════════
// routes/api.php
// ═══════════════════════════════════════════════
use App\\Http\\Controllers\\Api\\V1;

Route::prefix('v1')->name('api.v1.')->middleware('throttle:api')->group(function () {

    /* ── عام ── */
    Route::get('posts',              [V1\\PostController::class, 'index'])->name('posts.index');
    Route::get('posts/{post:slug}',  [V1\\PostController::class, 'show'])->name('posts.show');
    Route::get('posts/{post:slug}/comments', [V1\\CommentController::class, 'index'])->name('posts.comments.index');
    Route::get('tags',               [V1\\TagController::class, 'index'])->name('tags.index');
    Route::get('users/{user}',       [V1\\UserController::class, 'show'])->name('users.show');

    /* ── مصادقة ── */
    Route::post('auth/token',  [V1\\AuthController::class, 'store'])->middleware('throttle:5,1')->name('auth.token');

    /* ── محمي ── */
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me',            [V1\\AuthController::class, 'me'])->name('me');
        Route::delete('auth/token', [V1\\AuthController::class, 'destroy'])->name('auth.logout');

        Route::middleware(['ability:posts:write', 'throttle:api-write'])->group(function () {
            Route::apiResource('posts', V1\\PostController::class)->except(['index', 'show']);
            Route::patch('posts/{post}/publish', [V1\\PostController::class, 'publish'])->name('posts.publish');
        });

        Route::middleware(['ability:comments:write', 'throttle:api-write'])->group(function () {
            Route::post('posts/{post}/comments', [V1\\CommentController::class, 'store'])->name('posts.comments.store');
            Route::delete('comments/{comment}',  [V1\\CommentController::class, 'destroy'])->name('comments.destroy');
        });

        Route::middleware('ability:admin')->prefix('admin')->name('admin.')->group(function () {
            Route::get('stats', [V1\\AdminController::class, 'stats'])->name('stats');
            Route::apiResource('users', V1\\Admin\\UserController::class)->only(['index', 'update', 'destroy']);
        });
    });
});

// ═══════════════════════════════════════════════
// app/Http/Resources/PostResource.php
// ═══════════════════════════════════════════════
namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isDetail = $request->routeIs('api.v1.posts.show');
        $isOwner  = $request->user()?->id === $this->user_id;

        return [
            'id'      => $this->id,
            'slug'    => $this->slug,
            'title'   => $this->title,
            'excerpt' => $this->excerpt,

            // المحتوى الكامل في العرض المفصّل فقط — يقلّل حجم القائمة كثيراً
            'body'    => $this->when($isDetail, fn () => $this->body),

            'status'  => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
                'color' => $this->status->color(),
            ],

            'stats' => [
                'views'           => $this->views_count,
                'comments'        => $this->whenCounted('comments'),
                'reading_minutes' => $this->reading_minutes,
            ],

            'author' => UserResource::make($this->whenLoaded('author')),
            'tags'   => TagResource::collection($this->whenLoaded('tags')),

            // حقول المالك فقط
            $this->mergeWhen($isOwner || $request->user()?->isEditor(), [
                'is_locked'  => (bool) $this->is_locked,
                'lock_reason'=> $this->lock_reason,
                'draft_notes'=> $this->draft_notes,
            ]),

            'published_at' => $this->published_at?->toIso8601String(),
            'created_at'   => $this->created_at->toIso8601String(),
            'updated_at'   => $this->updated_at->toIso8601String(),

            'links' => [
                'self'     => route('api.v1.posts.show', $this->slug),
                'comments' => route('api.v1.posts.comments.index', $this->slug),
                'web'      => route('posts.show', $this->slug),
            ],
        ];
    }
}

// ═══════════════════════════════════════════════
// app/Http/Controllers/Api/V1/PostController.php
// ═══════════════════════════════════════════════
namespace App\\Http\\Controllers\\Api\\V1;

use App\\Exceptions\\PostLockedException;
use App\\Http\\Requests\\Api\\{StorePostRequest, UpdatePostRequest};
use App\\Http\\Resources\\PostResource;
use App\\Models\\Post;
use Illuminate\\Http\\{Request, JsonResponse, Response};

class PostController extends Controller
{
    private const MAX_PER_PAGE = 50;

    public function __construct()
    {
        $this->authorizeResource(Post::class, 'post', [
            'except' => ['index', 'show'],
        ]);
    }

    public function index(Request $request)
    {
        $perPage = min($request->integer('per_page', 15), self::MAX_PER_PAGE);

        $posts = Post::query()
            ->published()
            ->with(['author:id,name,avatar_path', 'tags:id,name,slug'])
            ->withCount('comments')
            ->filter($request->only(['q', 'tag', 'author', 'from', 'to', 'sort']))
            ->cursorPaginate($perPage)
            ->withQueryString();

        return PostResource::collection($posts)->additional([
            'meta' => [
                'filters_applied' => array_filter($request->only(['q', 'tag', 'author', 'from', 'to'])),
                'per_page'        => $perPage,
            ],
        ]);
    }

    public function show(Post $post)
    {
        abort_unless(
            $post->isPublished() || $post->user_id === request()->user()?->id,
            404
        );

        $post->load(['author', 'tags'])->loadCount('comments');
        $post->incrementQuietly('views_count');

        return PostResource::make($post);
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $request->user()->posts()->create($request->validated());
        $post->tags()->sync($request->input('tag_ids', []));

        return PostResource::make($post->load(['author', 'tags']))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED)
            ->header('Location', route('api.v1.posts.show', $post));
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        if ($post->is_locked && ! $request->user()->isEditor()) {
            throw new PostLockedException($post);
        }

        $post->update($request->validated());

        if ($request->has('tag_ids')) {
            $post->tags()->sync($request->input('tag_ids'));
        }

        return PostResource::make($post->fresh(['author', 'tags'])->loadCount('comments'));
    }

    public function destroy(Post $post): Response
    {
        $post->delete();

        return response()->noContent();
    }

    public function publish(Request $request, Post $post)
    {
        $this->authorize('publish', $post);

        $post->update(['status' => 'published', 'published_at' => now()]);

        return PostResource::make($post->fresh(['author', 'tags']));
    }
}

// ═══════════════════════════════════════════════
// tests/Feature/Api/PostApiTest.php
// ═══════════════════════════════════════════════
use App\\Models\\{User, Post, Tag};
use Illuminate\\Support\\Facades\\DB;
use Laravel\\Sanctum\\Sanctum;

describe('GET /api/v1/posts', function () {
    it('يعرض المنشورة فقط', function () {
        Post::factory()->count(3)->published()->create();
        Post::factory()->count(2)->draft()->create();

        $this->getJson(route('api.v1.posts.index'))
            ->assertOk()
            ->assertJsonCount(3, 'data');
    });

    it('لا يُرجع body في القائمة', function () {
        Post::factory()->published()->create();

        $this->getJson(route('api.v1.posts.index'))
            ->assertOk()
            ->assertJsonMissingPath('data.0.body');
    });

    it('يرشّح بالبحث', function () {
        Post::factory()->published()->create(['title' => 'مقال عن Laravel']);
        Post::factory()->published()->create(['title' => 'مقال عن Vue']);

        $this->getJson(route('api.v1.posts.index', ['q' => 'Laravel']))
            ->assertOk()
            ->assertJsonCount(1, 'data');
    });

    it('يحترم حدّ per_page الأقصى', function () {
        Post::factory()->count(60)->published()->create();

        $this->getJson(route('api.v1.posts.index', ['per_page' => 500]))
            ->assertOk()
            ->assertJsonCount(50, 'data');
    });

    it('لا ينفّذ استعلامات زائدة', function () {
        Post::factory()->count(15)->published()
            ->hasAttached(Tag::factory()->count(2))
            ->create();

        DB::enableQueryLog();
        $this->getJson(route('api.v1.posts.index'))->assertOk();

        // المقالات + الكتّاب + الوسوم + العدّ = 4 استعلامات كحدّ أقصى
        expect(count(DB::getQueryLog()))->toBeLessThanOrEqual(4);
    });
});

describe('POST /api/v1/posts', function () {
    it('يرفض بلا مصادقة بـ 401 وبنية موحّدة', function () {
        $this->postJson(route('api.v1.posts.store'), [])
            ->assertUnauthorized()
            ->assertJsonStructure(['message', 'status', 'code'])
            ->assertJsonPath('code', 'unauthenticated');
    });

    it('يرفض رمزاً بلا صلاحية الكتابة', function () {
        Sanctum::actingAs(User::factory()->create(), ['posts:read']);

        $this->postJson(route('api.v1.posts.store'), [])->assertForbidden();
    });

    it('ينشئ مقالاً ويُرجع 201 مع Location', function () {
        Sanctum::actingAs(User::factory()->create(), ['posts:write']);

        $this->postJson(route('api.v1.posts.store'), [
                'title' => 'عنوان مقال جديد للاختبار',
                'body'  => str_repeat('محتوى كافٍ للتحقّق. ', 15),
            ])
            ->assertCreated()
            ->assertHeader('Location')
            ->assertJsonPath('data.title', 'عنوان مقال جديد للاختبار');
    });

    it('يُرجع 422 ببنية أخطاء واضحة', function () {
        Sanctum::actingAs(User::factory()->create(), ['posts:write']);

        $this->postJson(route('api.v1.posts.store'), ['title' => 'x'])
            ->assertStatus(422)
            ->assertJsonPath('code', 'validation_failed')
            ->assertJsonValidationErrors(['title', 'body']);
    });
});

describe('PUT /api/v1/posts/{post}', function () {
    it('يمنع تعديل مقال الغير', function () {
        Sanctum::actingAs(User::factory()->create(), ['posts:write']);
        $post = Post::factory()->create();

        $this->putJson(route('api.v1.posts.update', $post), ['title' => 'مخترَق'])
            ->assertForbidden()
            ->assertJsonPath('code', 'forbidden');
    });

    it('يُرجع 423 لمقال مقفل', function () {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['posts:write']);

        $post = Post::factory()->for($user)->create([
            'is_locked'   => true,
            'lock_reason' => 'قيد المراجعة',
        ]);

        $this->putJson(route('api.v1.posts.update', $post), [
                'title' => 'عنوان محدَّث للاختبار',
                'body'  => str_repeat('محتوى. ', 20),
            ])
            ->assertStatus(423)
            ->assertJsonPath('code', 'post_locked')
            ->assertJsonPath('details.reason', 'قيد المراجعة');
    });
});

describe('الأخطاء العامة', function () {
    it('يُرجع 404 بصيغة JSON لمسار غير موجود', function () {
        $this->getJson('/api/v1/nonexistent')
            ->assertNotFound()
            ->assertJsonPath('code', 'route_not_found');
    });

    it('يُرجع 405 لطريقة غير مسموحة', function () {
        $this->patchJson(route('api.v1.posts.index'))
            ->assertStatus(405)
            ->assertJsonPath('code', 'method_not_allowed');
    });

    it('يرفض نسخة واجهة غير مدعومة', function () {
        $this->withHeader('Accept-Version', 'v9')
            ->getJson(route('api.v1.posts.index'))
            ->assertStatus(400)
            ->assertJsonPath('code', 'unsupported_version');
    });
});
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'ما الفرق بين الشيفرة قبل `$next($request)` وبعدها؟', options: ['لا فرق', 'قبلها تعمل على الطلب الداخل، وبعدها على الاستجابة الخارجة', 'العكس', 'الثانية لا تُنفَّذ'], answer: 1,
        explain: 'الوسطاء طبقات بصلة: الطلب يدخل من الخارج للداخل والاستجابة تعود بالعكس.' },
      { q: 'لماذا نستخدم API Resource بدل إرجاع النموذج مباشرة؟', options: ['أسرع', 'يفصل بنية الاستجابة عن بنية القاعدة فلا يكون كل تغيير في الجدول تغييراً كاسراً', 'إلزامي', 'للأمان فقط'], answer: 1,
        explain: 'ويسمح بإخفاء الحقول الحسّاسة وتشكيل البيانات حسب السياق.' },
      { q: 'ما وظيفة `whenLoaded(\'author\')` في المورد؟', options: ['يحمّل العلاقة', 'يضمّها فقط إن كانت محمّلة مسبقاً — يمنع N+1 من الجذر', 'يخفيها', 'يخزّنها مؤقّتاً'], answer: 1,
        explain: 'بدونه يستدعي المورد العلاقة فيُحمَّل استعلام لكل سجلّ في القائمة.' },
      { q: 'ما رمز الحالة الصحيح لفشل التحقّق؟', options: ['400', '422 Unprocessable Entity', '403', '500'], answer: 1,
        explain: '400 للطلب المشوّه صياغياً، و422 للطلب الصحيح شكلاً لكن بيانات غير مقبولة.' },
      { q: 'ما ميزة `cursorPaginate` على `paginate`؟', options: ['يعرض عدد الصفحات', 'أسرع (بلا COUNT) وثابت مع البيانات المتغيّرة — لا تكرار ولا تفويت', 'يسمح بالقفز', 'أبسط'], answer: 1,
        explain: 'العيب: لا يعرف العدد الكلي ولا يسمح بالقفز لصفحة محدّدة.' },
      { q: 'ما فائدة تعريف `render()` داخل صنف الخطأ نفسه؟', options: ['أسرع', 'يبقي منطق العرض بجانب تعريف الخطأ بدل تضخّم ملف المعالجة المركزي', 'إلزامي', 'للتسجيل'], answer: 1,
        explain: 'Laravel يستدعيها تلقائياً حين يجدها في الاستثناء.' },
      { q: 'لماذا لا نضع `allowed_origins => [\'*\']` مع `supports_credentials`؟', options: ['بطيء', 'المتصفّحات ترفض التركيبة، وهي تفتح واجهتك لأي موقع على الإنترنت', 'خطأ صياغي', 'لا مشكلة'], answer: 1,
        explain: 'حدّد النطاقات المسموحة صراحةً من متغيّر بيئة.' }
    ]}
  ]
};
