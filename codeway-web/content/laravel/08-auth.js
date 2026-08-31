'use strict';

module.exports = {
  slug: '08-auth',
  title: 'المصادقة والصلاحيات',
  summary: 'تسجيل الدخول والجلسات، البوّابات والسياسات، الأدوار والصلاحيات، وحماية التطبيق من الثغرات الشائعة.',
  duration: 60,
  level: 'متقدم',
  tags: ['Auth', 'Policies', 'Security'],
  objectives: [
    'تبني نظام مصادقة كاملاً أو تستخدم حزم Laravel الجاهزة.',
    'تفرّق بين المصادقة (من أنت؟) والتفويض (ماذا تستطيع؟).',
    'تكتب بوّابات وسياسات وتستخدمها في المتحكّم والعرض.',
    'تنفّذ نظام أدوار وصلاحيات بسيطاً وفعّالاً.',
    'تحمي التطبيق من CSRF و XSS وحقن SQL وتثبيت الجلسة.',
    'تصادق واجهاتك البرمجية بـ Sanctum.'
  ],
  quickRef: [
    { code: 'Auth::attempt([...])', desc: 'تسجيل دخول' },
    { code: 'auth()->user()', desc: 'المستخدم الحالي' },
    { code: 'middleware(\'auth\')', desc: 'حماية مسار' },
    { code: 'Gate::define', desc: 'بوّابة' },
    { code: 'make:policy', desc: 'سياسة' },
    { code: '$this->authorize()', desc: 'فحص صلاحية' },
    { code: '@can', desc: 'فحص في العرض' },
    { code: 'auth:sanctum', desc: 'مصادقة API' }
  ],
  blocks: [
    { t: 'h2', text: 'المصادقة مقابل التفويض' },
    { t: 'table', head: ['', 'المصادقة (Authentication)', 'التفويض (Authorization)'], rows: [
      ['**السؤال**', 'من أنت؟', 'ماذا تستطيع أن تفعل؟'],
      ['**الآلية**', 'بريد وكلمة مرور، رمز، OAuth', 'بوّابات، سياسات، أدوار'],
      ['**الوقت**', 'مرة عند الدخول', 'عند كل عملية'],
      ['**في Laravel**', '`auth` middleware', '`Gate` و `Policy`']
    ]},

    { t: 'h2', text: 'حزم المصادقة الجاهزة' },
    { t: 'code', lang: 'bash', code: `
# Breeze — الأبسط والأنسب للتعلّم: تسجيل ودخول وإعادة تعيين كلمة المرور
composer require laravel/breeze --dev
php artisan breeze:install blade        # أو: react, vue, api, livewire
php artisan migrate

# Jetstream — أغنى: مصادقة ثنائية، فرق، إدارة جلسات، رموز API
composer require laravel/jetstream
php artisan jetstream:install livewire --teams

# Sanctum — مصادقة API بالرموز و SPA
php artisan install:api

# Socialite — دخول عبر جوجل وجيت هب وغيرها
composer require laravel/socialite
`.trim() },
    { t: 'tip', text: 'ابدأ بـ **Breeze**: يولّد شيفرة بسيطة مقروءة في مشروعك تستطيع قراءتها وتعديلها بحرّية، بخلاف الحزم التي تخفي كل شيء خلف طبقات.' },

    { t: 'h2', text: 'مصادقة يدوية' },
    { t: 'code', lang: 'php', code: `
<?php
// app/Models/User.php
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password'];
    protected $hidden   = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',       // يجزّئ تلقائياً عند الإسناد
        ];
    }
}
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
namespace App\\Http\\Controllers\\Auth;

use Illuminate\\Http\\{Request, RedirectResponse};
use Illuminate\\Support\\Facades\\{Auth, RateLimiter};
use Illuminate\\Validation\\ValidationException;

class LoginController extends Controller
{
    public function create()
    {
        return view('auth.login');
    }

    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // حماية من التخمين — خمس محاولات لكل بريد+IP
        $key = 'login:' . $request->ip() . '|' . $credentials['email'];

        if (RateLimiter::tooManyAttempts($key, 5)) {
            throw ValidationException::withMessages([
                'email' => 'محاولات كثيرة — حاول بعد '
                         . RateLimiter::availableIn($key) . ' ثانية.',
            ]);
        }

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            RateLimiter::hit($key, 60);

            throw ValidationException::withMessages([
                'email' => 'بيانات الدخول غير صحيحة.',
            ]);
        }

        RateLimiter::clear($key);
        $request->session()->regenerate();          // ⚠️ إلزامي — يمنع تثبيت الجلسة

        return redirect()->intended(route('dashboard'))
            ->with('success', 'أهلاً بعودتك!');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('home')->with('success', 'تمّ تسجيل الخروج.');
    }
}
`.trim() },
    { t: 'danger', title: '`session()->regenerate()` ليس اختيارياً', text: 'بدونه يبقى معرّف الجلسة كما هو بعد الدخول، فيصبح التطبيق عرضة لهجوم **تثبيت الجلسة**: مهاجم يزرع معرّف جلسة معروفاً في متصفّح الضحية، فحين يسجّل الضحية دخوله يصبح المهاجم مسجّلاً بحسابه.' },
    { t: 'code', lang: 'php', code: `
<?php
// دوال المصادقة
Auth::check();                       // هل هو مسجّل؟
Auth::guest();
Auth::user();
Auth::id();
auth()->user();                      // نفس الشيء

Auth::login($user);
Auth::loginUsingId(5);
Auth::once($credentials);            // بلا جلسة — لطلب واحد
Auth::logout();
Auth::logoutOtherDevices($password); // إنهاء الجلسات الأخرى

// حرّاس متعدّدون
Auth::guard('admin')->attempt($credentials);
auth('api')->user();
`.trim() },

    { t: 'h2', text: 'حماية المسارات' },
    { t: 'code', lang: 'php', code: `
<?php
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('posts', PostController::class);
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create']);
});

// وسطاء بصلاحيات
Route::middleware(['auth', 'can:access-admin'])->prefix('admin')->group(...);
Route::get('/posts/{post}/edit', ...)->middleware('can:update,post');

// في المتحكّم
class PostController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except(['index', 'show']);
        $this->middleware('password.confirm')->only(['destroy']);
    }
}
`.trim() },

    { t: 'h2', text: 'البوّابات (Gates)' },
    { t: 'p', text: 'البوّابة دالة بسيطة تُجيب بنعم أو لا. مناسبة للصلاحيات **غير المرتبطة بنموذج معيّن**.' },
    { t: 'code', lang: 'php', code: `
<?php
// app/Providers/AppServiceProvider.php
use Illuminate\\Support\\Facades\\Gate;

public function boot(): void
{
    Gate::define('access-admin', fn (User $user) => $user->is_admin);

    Gate::define('view-reports', fn (User $user) =>
        $user->hasAnyRole(['admin', 'manager'])
    );

    Gate::define('publish-post', function (User $user, Post $post) {
        return $user->id === $post->user_id || $user->is_editor;
    });

    // مع رسالة سبب
    Gate::define('delete-account', function (User $user) {
        return $user->orders()->pending()->doesntExist()
            ? Response::allow()
            : Response::deny('لا يمكن حذف الحساب وعليه طلبات معلّقة.');
    });

    // تجاوز شامل للمشرف الأعلى
    Gate::before(fn (User $user) => $user->is_super_admin ? true : null);
}
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// الاستخدام
Gate::allows('access-admin');
Gate::denies('access-admin');
Gate::authorize('publish-post', $post);          // يرمي 403
Gate::any(['edit-post', 'publish-post'], $post);
Gate::forUser($otherUser)->allows('access-admin');

// عبر المستخدم
$user->can('publish-post', $post);
$user->cannot('delete-account');
`.trim() },

    { t: 'h2', text: 'السياسات (Policies)' },
    { t: 'p', text: 'السياسة صنف يجمع كل صلاحيات نموذج معيّن. هي الأسلوب المفضّل لأي شيء يتعلّق بنموذج.' },
    { t: 'code', lang: 'bash', code: `
php artisan make:policy PostPolicy --model=Post
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
namespace App\\Policies;

use App\\Models\\{Post, User};
use Illuminate\\Auth\\Access\\Response;

class PostPolicy
{
    /** يُستدعى قبل كل دالة — لتجاوز المشرف */
    public function before(User $user, string $ability): ?bool
    {
        return $user->is_admin ? true : null;      // null = تابع الفحص العادي
    }

    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Post $post): bool
    {
        return $post->isPublished() || $post->user_id === $user?->id;
    }

    public function create(User $user): bool
    {
        return $user->hasVerifiedEmail() && ! $user->is_banned;
    }

    public function update(User $user, Post $post): Response
    {
        if ($post->user_id !== $user->id) {
            return Response::deny('لا تملك هذا المقال.');
        }

        if ($post->isLocked()) {
            return Response::deny('المقال مقفل من الإدارة.');
        }

        return Response::allow();
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id
            && $post->comments()->doesntExist();
    }

    public function restore(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function forceDelete(User $user, Post $post): bool
    {
        return false;      // للمشرف فقط عبر before()
    }
}
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// Laravel 11 يكتشف السياسة تلقائياً من التسمية
// أو صرّح بها:
#[UsePolicy(PostPolicy::class)]
class Post extends Model {}
`.trim() },
    { t: 'h3', text: 'الاستخدام' },
    { t: 'code', lang: 'php', code: `
<?php
class PostController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Post::class);
        // …
    }

    public function edit(Post $post)
    {
        $this->authorize('update', $post);        // يرمي 403 تلقائياً
        return view('posts.edit', compact('post'));
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);
        $post->delete();
        return to_route('posts.index');
    }

    // أو تفويض كل الإجراءات دفعة واحدة
    public function __construct()
    {
        $this->authorizeResource(Post::class, 'post');
    }
}
`.trim() },
    { t: 'code', lang: 'blade', code: `
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">تعديل</a>
@endcan

@cannot('delete', $post)
    <span class="hint">لا يمكن حذف مقال عليه تعليقات.</span>
@endcannot

@can('create', App\\Models\\Post::class)
    <a href="{{ route('posts.create') }}">مقال جديد</a>
@endcan

@canany(['update', 'delete'], $post)
    <div class="actions">…</div>
@endcanany
`.trim() },
    { t: 'danger', title: 'الإخفاء في العرض ليس حماية', text: 'إخفاء زرّ "حذف" بـ `@can` يحسّن التجربة فقط. المستخدم يستطيع إرسال طلب `DELETE` مباشرة. **الحماية الحقيقية في المتحكّم دائماً** عبر `$this->authorize()`.' },

    { t: 'h2', text: 'الأدوار والصلاحيات' },
    { t: 'code', lang: 'php', code: `
<?php
// حلّ بسيط بلا حزم — كافٍ لأغلب التطبيقات
enum Role: string
{
    case User      = 'user';
    case Editor    = 'editor';
    case Admin     = 'admin';

    public function permissions(): array
    {
        return match ($this) {
            self::User   => ['post.create', 'post.update.own', 'comment.create'],
            self::Editor => ['post.create', 'post.update.any', 'post.publish', 'comment.moderate'],
            self::Admin  => ['*'],
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::User => 'مستخدم', self::Editor => 'محرّر', self::Admin => 'مشرف',
        };
    }
}

class User extends Authenticatable
{
    protected function casts(): array
    {
        return ['role' => Role::class];
    }

    public function hasPermission(string $permission): bool
    {
        $permissions = $this->role->permissions();

        return in_array('*', $permissions, true)
            || in_array($permission, $permissions, true);
    }

    public function hasRole(Role|string $role): bool
    {
        return $this->role === (is_string($role) ? Role::from($role) : $role);
    }

    public function isAdmin(): bool  { return $this->hasRole(Role::Admin); }
    public function isEditor(): bool { return $this->hasRole(Role::Editor); }
}

// ربطه بالبوّابات
Gate::before(fn (User $user) => $user->isAdmin() ? true : null);

foreach (['post.create', 'post.publish', 'comment.moderate'] as $permission) {
    Gate::define($permission, fn (User $user) => $user->hasPermission($permission));
}
`.trim() },
    { t: 'code', lang: 'bash', code: `
# للأنظمة المعقّدة استخدم الحزمة المعيارية
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\\Permission\\PermissionServiceProvider"
php artisan migrate
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// spatie/laravel-permission
$user->assignRole('editor');
$user->givePermissionTo('publish articles');
$user->hasRole('editor');
$user->can('publish articles');

Route::middleware(['role:admin'])->group(...);
Route::middleware(['permission:publish articles'])->group(...);
`.trim() },

    { t: 'h2', text: 'مصادقة API بـ Sanctum' },
    { t: 'code', lang: 'php', code: `
<?php
// إصدار رمز
class TokenController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email'       => ['required', 'email'],
            'password'    => ['required'],
            'device_name' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'بيانات الدخول غير صحيحة.',
            ]);
        }

        // رمز بصلاحيات محدودة وانتهاء
        $token = $user->createToken(
            $request->device_name,
            ['posts:read', 'posts:write'],
            now()->addDays(30)
        );

        return response()->json([
            'token'      => $token->plainTextToken,
            'expires_at' => $token->accessToken->expires_at,
        ]);
    }

    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $r) => $r->user());

    Route::middleware('abilities:posts:write')->group(function () {
        Route::apiResource('posts', PostController::class)->except(['index', 'show']);
    });
});

// فحص الصلاحية في الشيفرة
$request->user()->tokenCan('posts:write');
`.trim() },
    { t: 'note', text: 'Sanctum يخدم حالتين: **رموز API** للتطبيقات والخدمات، و**مصادقة SPA بالكوكيز** لتطبيق Vue/React على نفس النطاق. الثانية أأمن لتطبيق الويب لأن الكوكيز `httpOnly` لا يصلها JavaScript.' },

    { t: 'h2', text: 'الحماية من الثغرات الشائعة' },
    { t: 'table', head: ['الثغرة', 'كيف يحميك Laravel', 'ما عليك فعله'], rows: [
      ['**CSRF**', 'رمز في كل نموذج', 'لا تحذف `@csrf`، ولا تستثنِ مسارات إلا لأسباب واضحة'],
      ['**XSS**', 'هروب تلقائي في `{{ }}`', 'لا تستخدم `{!! !!}` مع محتوى المستخدم'],
      ['**حقن SQL**', 'الاستعلامات المُعدّة', 'لا تدرج مدخلات في `DB::raw` مباشرة'],
      ['**الإسناد الجماعي**', '`$fillable`', 'عرّفه دائماً واستخدم `validated()`'],
      ['**تثبيت الجلسة**', '`session()->regenerate()`', 'استدعها بعد كل تسجيل دخول'],
      ['**كلمات المرور**', 'تجزئة bcrypt/argon2', 'لا تخزّنها نصّاً، واستخدم `Password::defaults()`'],
      ['**تخمين كلمة المرور**', '`RateLimiter`', 'حدّ محاولات الدخول والعمليات الحسّاسة']
    ]},
    { t: 'code', lang: 'php', code: `
<?php
// ✗ حقن SQL
DB::select("SELECT * FROM users WHERE email = '{$request->email}'");
Post::whereRaw("title LIKE '%{$request->q}%'")->get();

// ✅ آمن
DB::select('SELECT * FROM users WHERE email = ?', [$request->email]);
Post::whereRaw('title LIKE ?', ["%{$request->q}%"])->get();
Post::where('title', 'like', "%{$request->q}%")->get();
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// تحديد المعدّل — bootstrap/app.php أو AppServiceProvider
use Illuminate\\Cache\\RateLimiting\\Limit;
use Illuminate\\Support\\Facades\\RateLimiter;

RateLimiter::for('api', fn (Request $r) =>
    Limit::perMinute(60)->by($r->user()?->id ?: $r->ip())
);

RateLimiter::for('login', fn (Request $r) =>
    Limit::perMinute(5)->by($r->input('email') . $r->ip())
);

RateLimiter::for('uploads', fn (Request $r) =>
    $r->user()->isPremium()
        ? Limit::none()
        : Limit::perDay(20)->by($r->user()->id)
);

// الاستخدام
Route::middleware('throttle:login')->post('/login', ...);
Route::middleware('throttle:60,1')->group(...);
`.trim() },
    { t: 'danger', title: 'في الإنتاج: `APP_DEBUG=false`', text: 'تركه `true` يعرض مسارات الملفات ومتغيّرات البيئة وأجزاء من الشيفرة في صفحة الخطأ لأي زائر. راجع أيضاً: `APP_ENV=production`، و `HTTPS` مفروض، وصلاحيات `storage/` صحيحة.' },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'نظام صلاحيات لمنصّة محتوى',
      brief: 'ابنِ نظام مصادقة وصلاحيات كاملاً بأربعة أدوار وسياسات دقيقة.',
      requirements: [
        'أدوار: `reader` (قراءة وتعليق)، `author` (ينشئ ويعدّل مقالاته)، `editor` (يعدّل وينشر أي مقال ويدير التعليقات)، `admin` (كل شيء).',
        'Enum `Role` بدوال `label()` و `permissions()` و `level()` للمقارنة الهرمية.',
        '`PostPolicy` كاملة: `viewAny`, `view`, `create`, `update`, `delete`, `publish`, `feature`, `restore`, `forceDelete`.',
        '`CommentPolicy`: صاحب التعليق يحذف تعليقه خلال 15 دقيقة فقط، والمحرّر يحذف أيّاً منها.',
        'بوّابات عامة: `access-admin`, `view-analytics`, `manage-users`, `impersonate`.',
        'تسجيل دخول مع تحديد معدّل (5 محاولات) وتجديد الجلسة وتذكّر الجهاز.',
        'وسيط `EnsureUserIsNotBanned` يمنع المحظورين مع رسالة تشرح السبب ومدّة الحظر.',
        'ميزة "انتحال الهوية" للمشرف: يدخل كمستخدم آخر ويعود لحسابه، مع تسجيل العملية.',
        'رسائل رفض واضحة عبر `Response::deny(...)` تشرح السبب لا مجرّد 403.',
        'مسارات API بـ Sanctum مع صلاحيات رموز محدودة.',
        'اكتب اختبارات لكل دور: ما يستطيعه وما لا يستطيعه.'
      ],
      hints: [
        '`Gate::before` للتجاوز الشامل، و `Policy::before` للتجاوز داخل نموذج واحد.',
        '`Response::denyWithStatus(404)` يخفي وجود المورد بدل كشفه بـ 403.',
        '`$this->authorizeResource(Post::class, \'post\')` تربط الإجراءات بالسياسة تلقائياً.',
        '`session([\'impersonator_id\' => auth()->id()])` لتخزين هوية المشرف الأصلي.'
      ],
      solution: { lang: 'php', code: `
<?php
// ═══════════════════════════════════════════════
// app/Enums/Role.php
// ═══════════════════════════════════════════════
namespace App\\Enums;

enum Role: string
{
    case Reader = 'reader';
    case Author = 'author';
    case Editor = 'editor';
    case Admin  = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Reader => 'قارئ',
            self::Author => 'كاتب',
            self::Editor => 'محرّر',
            self::Admin  => 'مشرف',
        };
    }

    /** مستوى هرمي للمقارنة */
    public function level(): int
    {
        return match ($this) {
            self::Reader => 1, self::Author => 2, self::Editor => 3, self::Admin => 4,
        };
    }

    public function permissions(): array
    {
        return match ($this) {
            self::Reader => [
                'post.view', 'comment.create', 'comment.update.own', 'comment.delete.own',
            ],
            self::Author => [
                'post.view', 'post.create', 'post.update.own', 'post.delete.own',
                'comment.create', 'comment.update.own', 'comment.delete.own',
            ],
            self::Editor => [
                'post.view', 'post.create', 'post.update.any', 'post.delete.any',
                'post.publish', 'post.feature',
                'comment.create', 'comment.moderate', 'comment.delete.any',
                'analytics.view',
            ],
            self::Admin => ['*'],
        };
    }

    public function atLeast(self $role): bool
    {
        return $this->level() >= $role->level();
    }

    public static function options(): array
    {
        return array_map(
            fn (self $r) => ['value' => $r->value, 'label' => $r->label()],
            self::cases()
        );
    }
}

// ═══════════════════════════════════════════════
// app/Models/User.php
// ═══════════════════════════════════════════════
namespace App\\Models;

use App\\Enums\\Role;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = ['name', 'email', 'password', 'role'];
    protected $hidden   = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'role'              => Role::class,
            'banned_until'      => 'datetime',
        ];
    }

    public function posts()    { return $this->hasMany(Post::class); }
    public function comments() { return $this->hasMany(Comment::class); }

    public function hasPermission(string $permission): bool
    {
        $granted = $this->role->permissions();

        return in_array('*', $granted, true) || in_array($permission, $granted, true);
    }

    public function hasRole(Role $role): bool     { return $this->role === $role; }
    public function atLeast(Role $role): bool     { return $this->role->atLeast($role); }

    public function isAdmin(): bool  { return $this->hasRole(Role::Admin); }
    public function isEditor(): bool { return $this->atLeast(Role::Editor); }

    public function isBanned(): bool
    {
        return $this->banned_until !== null && $this->banned_until->isFuture();
    }

    public function banFor(int $days, string $reason): static
    {
        $this->update([
            'banned_until' => now()->addDays($days),
            'ban_reason'   => $reason,
        ]);

        return $this;
    }
}

// ═══════════════════════════════════════════════
// app/Policies/PostPolicy.php
// ═══════════════════════════════════════════════
namespace App\\Policies;

use App\\Models\\{Post, User};
use Illuminate\\Auth\\Access\\Response;

class PostPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isBanned()) {
            return false;                 // المحظور لا يفعل شيئاً
        }

        return $user->isAdmin() ? true : null;
    }

    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Post $post): Response
    {
        if ($post->isPublished()) {
            return Response::allow();
        }

        if ($user && ($post->user_id === $user->id || $user->isEditor())) {
            return Response::allow();
        }

        // 404 بدل 403 — لا نكشف وجود مسوّدة لغير أصحابها
        return Response::denyWithStatus(404);
    }

    public function create(User $user): Response
    {
        if (! $user->hasPermission('post.create')) {
            return Response::deny('حسابك لا يملك صلاحية النشر.');
        }

        if (! $user->hasVerifiedEmail()) {
            return Response::deny('فعّل بريدك الإلكتروني أولاً لتتمكّن من النشر.');
        }

        return Response::allow();
    }

    public function update(User $user, Post $post): Response
    {
        if ($post->is_locked && ! $user->isEditor()) {
            return Response::deny('المقال مقفل من الإدارة ولا يمكن تعديله.');
        }

        if ($user->hasPermission('post.update.any')) {
            return Response::allow();
        }

        if ($user->hasPermission('post.update.own') && $post->user_id === $user->id) {
            return Response::allow();
        }

        return Response::deny('لا يمكنك تعديل مقال لا تملكه.');
    }

    public function delete(User $user, Post $post): Response
    {
        if ($user->hasPermission('post.delete.any')) {
            return Response::allow();
        }

        if ($post->user_id !== $user->id) {
            return Response::deny('لا يمكنك حذف مقال لا تملكه.');
        }

        if ($post->isPublished() && $post->comments()->exists()) {
            return Response::deny(
                'لا يمكن حذف مقال منشور عليه تعليقات — اطلب من محرّر أرشفته.'
            );
        }

        return Response::allow();
    }

    public function publish(User $user, Post $post): Response
    {
        if (! $user->hasPermission('post.publish')) {
            return Response::deny('النشر من صلاحيات المحرّرين.');
        }

        if (blank($post->excerpt)) {
            return Response::deny('أضف مقتطفاً للمقال قبل نشره.');
        }

        return Response::allow();
    }

    public function feature(User $user, Post $post): bool
    {
        return $user->hasPermission('post.feature') && $post->isPublished();
    }

    public function restore(User $user, Post $post): bool
    {
        return $user->isEditor() || $post->user_id === $user->id;
    }

    public function forceDelete(User $user, Post $post): bool
    {
        return false;                      // للمشرف فقط عبر before()
    }
}

// ═══════════════════════════════════════════════
// app/Policies/CommentPolicy.php
// ═══════════════════════════════════════════════
class CommentPolicy
{
    private const EDIT_WINDOW_MINUTES = 15;

    public function before(User $user): ?bool
    {
        if ($user->isBanned()) {
            return false;
        }

        return $user->isAdmin() ? true : null;
    }

    public function create(User $user): Response
    {
        return $user->hasPermission('comment.create')
            ? Response::allow()
            : Response::deny('حسابك لا يملك صلاحية التعليق.');
    }

    public function update(User $user, Comment $comment): Response
    {
        if ($comment->user_id !== $user->id) {
            return Response::deny('لا يمكنك تعديل تعليق غيرك.');
        }

        $minutes = $comment->created_at->diffInMinutes(now());

        if ($minutes > self::EDIT_WINDOW_MINUTES) {
            return Response::deny(
                'انتهت مهلة التعديل — يمكن تعديل التعليق خلال '
                . self::EDIT_WINDOW_MINUTES . ' دقيقة من نشره فقط.'
            );
        }

        return Response::allow();
    }

    public function delete(User $user, Comment $comment): Response
    {
        if ($user->hasPermission('comment.delete.any')) {
            return Response::allow();
        }

        if ($comment->user_id !== $user->id) {
            return Response::deny('لا يمكنك حذف تعليق غيرك.');
        }

        $minutes = $comment->created_at->diffInMinutes(now());

        return $minutes <= self::EDIT_WINDOW_MINUTES
            ? Response::allow()
            : Response::deny('انتهت مهلة الحذف.');
    }

    public function moderate(User $user): bool
    {
        return $user->hasPermission('comment.moderate');
    }
}

// ═══════════════════════════════════════════════
// app/Providers/AppServiceProvider.php
// ═══════════════════════════════════════════════
use App\\Enums\\Role;
use App\\Models\\User;
use Illuminate\\Auth\\Access\\Response;
use Illuminate\\Support\\Facades\\Gate;

public function boot(): void
{
    // تجاوز شامل — لكن المحظور لا يتجاوز شيئاً
    Gate::before(function (User $user) {
        if ($user->isBanned()) {
            return false;
        }

        return $user->isAdmin() ? true : null;
    });

    Gate::define('access-admin', fn (User $user) =>
        $user->atLeast(Role::Editor)
            ? Response::allow()
            : Response::deny('لوحة الإدارة للمحرّرين والمشرفين فقط.')
    );

    Gate::define('view-analytics', fn (User $user) =>
        $user->hasPermission('analytics.view')
    );

    Gate::define('manage-users', fn (User $user) => $user->isAdmin());

    Gate::define('impersonate', fn (User $user, User $target) =>
        $user->isAdmin() && ! $target->isAdmin() && $user->isNot($target)
    );
}

// ═══════════════════════════════════════════════
// app/Http/Middleware/EnsureUserIsNotBanned.php
// ═══════════════════════════════════════════════
namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class EnsureUserIsNotBanned
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user?->isBanned()) {
            $until  = $user->banned_until->translatedFormat('j F Y');
            $reason = $user->ban_reason ?: 'مخالفة شروط الاستخدام';
            $message = "حسابك موقوف حتى {$until}. السبب: {$reason}";

            if ($request->expectsJson()) {
                return response()->json(['message' => $message], 403);
            }

            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('error', $message);
        }

        return $next($request);
    }
}

// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \\App\\Http\\Middleware\\EnsureUserIsNotBanned::class,
    ]);

    $middleware->alias([
        'not.banned' => \\App\\Http\\Middleware\\EnsureUserIsNotBanned::class,
    ]);
})

// ═══════════════════════════════════════════════
// app/Http/Controllers/Admin/ImpersonationController.php
// ═══════════════════════════════════════════════
namespace App\\Http\\Controllers\\Admin;

use App\\Models\\{User, AuditLog};
use Illuminate\\Http\\{Request, RedirectResponse};
use Illuminate\\Support\\Facades\\Auth;

class ImpersonationController extends Controller
{
    public function store(Request $request, User $user): RedirectResponse
    {
        $this->authorize('impersonate', $user);

        $admin = $request->user();

        AuditLog::create([
            'user_id'    => $admin->id,
            'action'     => 'impersonate.start',
            'target_type'=> User::class,
            'target_id'  => $user->id,
            'ip'         => $request->ip(),
            'meta'       => ['target_email' => $user->email],
        ]);

        $request->session()->put('impersonator_id', $admin->id);
        Auth::login($user);

        return to_route('home')
            ->with('warning', "أنت الآن تتصفّح بحساب {$user->name}.");
    }

    public function destroy(Request $request): RedirectResponse
    {
        $impersonatorId = $request->session()->pull('impersonator_id');

        abort_unless($impersonatorId, 403, 'لست في وضع انتحال الهوية.');

        $impersonated = $request->user();
        $admin        = User::findOrFail($impersonatorId);

        AuditLog::create([
            'user_id'     => $admin->id,
            'action'      => 'impersonate.stop',
            'target_type' => User::class,
            'target_id'   => $impersonated->id,
            'ip'          => $request->ip(),
        ]);

        Auth::login($admin);

        return to_route('admin.users.index')
            ->with('success', 'عدت إلى حسابك.');
    }
}

// ═══════════════════════════════════════════════
// tests/Feature/AuthorizationTest.php
// ═══════════════════════════════════════════════
use App\\Enums\\Role;
use App\\Models\\{User, Post, Comment};

function userWith(Role $role): User
{
    return User::factory()->create([
        'role'              => $role,
        'email_verified_at' => now(),
    ]);
}

describe('صلاحيات المقالات', function () {
    it('يمنع القارئ من إنشاء مقال', function () {
        $reader = userWith(Role::Reader);

        expect($reader->can('create', Post::class))->toBeFalse();
    });

    it('يسمح للكاتب بإنشاء مقال', function () {
        $author = userWith(Role::Author);

        expect($author->can('create', Post::class))->toBeTrue();
    });

    it('يمنع الكاتب من إنشاء مقال قبل تفعيل البريد', function () {
        $author = User::factory()->unverified()->create(['role' => Role::Author]);

        expect($author->can('create', Post::class))->toBeFalse();
    });

    it('يسمح للكاتب بتعديل مقاله فقط', function () {
        $author = userWith(Role::Author);
        $own    = Post::factory()->for($author)->create();
        $other  = Post::factory()->create();

        expect($author->can('update', $own))->toBeTrue()
            ->and($author->can('update', $other))->toBeFalse();
    });

    it('يسمح للمحرّر بتعديل أي مقال', function () {
        $editor = userWith(Role::Editor);
        $post   = Post::factory()->create();

        expect($editor->can('update', $post))->toBeTrue();
    });

    it('يمنع الكاتب من النشر', function () {
        $author = userWith(Role::Author);
        $post   = Post::factory()->for($author)->create(['excerpt' => 'مقتطف']);

        expect($author->can('publish', $post))->toBeFalse();
    });

    it('يمنع النشر بلا مقتطف حتى للمحرّر', function () {
        $editor = userWith(Role::Editor);
        $post   = Post::factory()->create(['excerpt' => null]);

        expect($editor->can('publish', $post))->toBeFalse();
    });

    it('يمنع حذف مقال منشور عليه تعليقات', function () {
        $author = userWith(Role::Author);
        $post   = Post::factory()->for($author)->published()->create();
        Comment::factory()->for($post)->create();

        expect($author->can('delete', $post))->toBeFalse();
    });

    it('يعطي المشرف كل الصلاحيات', function () {
        $admin = userWith(Role::Admin);
        $post  = Post::factory()->create(['is_locked' => true]);

        expect($admin->can('update', $post))->toBeTrue()
            ->and($admin->can('delete', $post))->toBeTrue()
            ->and($admin->can('publish', $post))->toBeTrue();
    });

    it('يمنع المحظور من كل شيء حتى لو كان مشرفاً', function () {
        $admin = userWith(Role::Admin)->banFor(7, 'إساءة');
        $post  = Post::factory()->create();

        expect($admin->can('update', $post))->toBeFalse()
            ->and($admin->can('create', Post::class))->toBeFalse();
    });

    it('يُرجع 404 لا 403 عند طلب مسوّدة غير مملوكة', function () {
        $reader = userWith(Role::Reader);
        $draft  = Post::factory()->draft()->create();

        $this->actingAs($reader)
             ->get(route('posts.show', $draft))
             ->assertNotFound();
    });
});

describe('صلاحيات التعليقات', function () {
    it('يسمح بحذف التعليق خلال المهلة', function () {
        $user    = userWith(Role::Reader);
        $comment = Comment::factory()->for($user)->create(['created_at' => now()->subMinutes(5)]);

        expect($user->can('delete', $comment))->toBeTrue();
    });

    it('يمنع الحذف بعد المهلة', function () {
        $user    = userWith(Role::Reader);
        $comment = Comment::factory()->for($user)->create(['created_at' => now()->subHour()]);

        expect($user->can('delete', $comment))->toBeFalse();
    });

    it('يسمح للمحرّر بحذف أي تعليق في أي وقت', function () {
        $editor  = userWith(Role::Editor);
        $comment = Comment::factory()->create(['created_at' => now()->subYear()]);

        expect($editor->can('delete', $comment))->toBeTrue();
    });
});

describe('انتحال الهوية', function () {
    it('يسمح للمشرف بانتحال هوية مستخدم عادي', function () {
        $admin = userWith(Role::Admin);
        $user  = userWith(Role::Author);

        $this->actingAs($admin)
             ->post(route('admin.impersonate', $user))
             ->assertRedirect(route('home'));

        expect(auth()->id())->toBe($user->id)
            ->and(session('impersonator_id'))->toBe($admin->id);
    });

    it('يمنع انتحال هوية مشرف آخر', function () {
        $admin  = userWith(Role::Admin);
        $target = userWith(Role::Admin);

        expect($admin->can('impersonate', $target))->toBeFalse();
    });

    it('يمنع غير المشرف من انتحال الهوية', function () {
        $editor = userWith(Role::Editor);
        $user   = userWith(Role::Reader);

        $this->actingAs($editor)
             ->post(route('admin.impersonate', $user))
             ->assertForbidden();
    });
});

describe('تحديد معدّل الدخول', function () {
    it('يمنع بعد خمس محاولات فاشلة', function () {
        $user = userWith(Role::Reader);

        foreach (range(1, 5) as $attempt) {
            $this->post(route('login'), [
                'email' => $user->email, 'password' => 'wrong',
            ]);
        }

        $this->post(route('login'), ['email' => $user->email, 'password' => 'wrong'])
             ->assertSessionHasErrors('email');

        expect(session('errors')->first('email'))->toContain('محاولات كثيرة');
    });
});
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'ما الفرق بين المصادقة والتفويض؟', options: ['لا فرق', 'المصادقة تجيب «من أنت؟» والتفويض «ماذا تستطيع أن تفعل؟»', 'العكس', 'الأولى للـ API'], answer: 1,
        explain: 'المصادقة تحدث مرة عند الدخول، والتفويض يُفحص عند كل عملية.' },
      { q: 'لماذا نستدعي `session()->regenerate()` بعد الدخول؟', options: ['للأداء', 'لمنع هجوم تثبيت الجلسة حيث يزرع مهاجم معرّف جلسة معروفاً في متصفّح الضحية', 'لمسح البيانات', 'اصطلاح'], answer: 1,
        explain: 'بدونه يصبح معرّف الجلسة قبل الدخول صالحاً بعده، فيستولي المهاجم على الحساب.' },
      { q: 'متى تستخدم Policy بدل Gate؟', options: ['دائماً Gate', 'Policy لصلاحيات مرتبطة بنموذج، وGate للصلاحيات العامة غير المرتبطة بنموذج', 'العكس', 'لا فرق'], answer: 1,
        explain: 'السياسة تجمع كل صلاحيات النموذج في صنف واحد منظّم وقابل للاختبار.' },
      { q: 'هل إخفاء زرّ الحذف بـ `@can` حماية كافية؟', options: ['نعم', 'لا — المستخدم يستطيع إرسال الطلب مباشرة؛ الحماية الحقيقية في المتحكّم', 'حسب الحالة', 'نعم مع CSRF'], answer: 1,
        explain: '`@can` لتحسين التجربة فقط، و`$this->authorize()` هي الحماية.' },
      { q: 'ما فائدة `Response::denyWithStatus(404)` في السياسة؟', options: ['رسالة أوضح', 'يخفي وجود المورد أصلاً بدل الاعتراف بوجوده ورفض الوصول بـ 403', 'أسرع', 'اصطلاح'], answer: 1,
        explain: 'مفيد للمسوّدات والموارد الخاصة — 403 يؤكّد للمهاجم أن المورد موجود.' },
      { q: 'ما دور `Gate::before` و `Policy::before`؟', options: ['التسجيل', 'تجاوز الفحص العادي — يُرجعان `true` للسماح أو `null` لمتابعة الفحص', 'التحقّق', 'التخزين المؤقّت'], answer: 1,
        explain: 'مثاليان لمنح المشرف كل الصلاحيات أو منع المحظور من كل شيء في مكان واحد.' },
      { q: 'ما الخطر الأكبر لترك `APP_DEBUG=true` في الإنتاج؟', options: ['البطء', 'تعرض صفحة الخطأ متغيّرات البيئة ومسارات الملفات وأجزاء من الشيفرة لأي زائر', 'حجم السجلّات', 'لا خطر'], answer: 1,
        explain: 'أشهر خطأ نشر في تطبيقات Laravel، وكثيراً ما يكشف كلمات مرور قاعدة البيانات.' }
    ]}
  ]
};
