'use strict';

module.exports = {
  slug: '01-introduction',
  title: 'مقدمة في Laravel وتهيئة البيئة',
  summary: 'ما هو Laravel ولماذا يتصدّر عالم PHP، تثبيته بـ Composer، بنية المشروع، وأدوات Artisan.',
  duration: 45,
  level: 'مبتدئ',
  tags: ['مقدمة', 'تهيئة', 'Artisan'],
  objectives: [
    'تعرف ما يقدّمه Laravel ومتى تختاره.',
    'تثبّت PHP و Composer وتنشئ مشروعاً جديداً.',
    'تفهم بنية مجلّدات المشروع ودور كلٍّ منها.',
    'تستخدم Artisan لتوليد الملفات وتشغيل المهام.',
    'تضبط ملف `.env` وتفهم لماذا لا يُرفع لـ Git.',
    'تشغّل أول صفحة وتفهم مسار الطلب.'
  ],
  quickRef: [
    { code: 'composer create-project laravel/laravel app', desc: 'مشروع جديد' },
    { code: 'php artisan serve', desc: 'تشغيل الخادم' },
    { code: 'php artisan list', desc: 'كل الأوامر' },
    { code: 'php artisan make:controller X', desc: 'توليد متحكّم' },
    { code: 'php artisan migrate', desc: 'تطبيق الهجرات' },
    { code: 'php artisan tinker', desc: 'صدفة تفاعلية' },
    { code: '.env', desc: 'إعدادات البيئة' },
    { code: 'php artisan optimize:clear', desc: 'مسح الذاكرة المؤقّتة' }
  ],
  blocks: [
    { t: 'h2', text: 'ما هو Laravel؟' },
    { t: 'p', text: 'إطار عمل PHP كامل أنشأه Taylor Otwell عام 2011، وهو اليوم الأكثر استخداماً في عالم PHP بفارق كبير. فلسفته قريبة من Rails: **صياغة أنيقة** و**اتفاقات ذكية** و**أدوات جاهزة لكل شيء**.' },
    { t: 'code', lang: 'php', code: `
<?php
// مثال يوضّح فلسفة Laravel — كل ما يلزم لواجهة برمجية كاملة

Route::get('/posts', function () {
    return Post::published()
        ->with('author')
        ->latest()
        ->paginate(15);
});
`.trim() },
    { t: 'p', text: 'ثلاثة أسطر تُنتج: استعلاماً محسّناً، وتحميلاً مسبقاً للعلاقة، وترتيباً، وترقيم صفحات، وتحويلاً تلقائياً إلى JSON مع روابط الصفحات.' },

    { t: 'h2', text: 'ما الذي يأتي جاهزاً؟' },
    { t: 'features', items: [
      { icon: 'box', title: 'Eloquent ORM', text: 'تتعامل مع الجداول ككائنات PHP، والعلاقات بسطر واحد.' },
      { icon: 'code', title: 'قوالب Blade', text: 'محرّك قوالب سريع مع وراثة ومكوّنات وهروب تلقائي.' },
      { icon: 'shield', title: 'مصادقة وصلاحيات', text: 'تسجيل ودخول وإعادة تعيين كلمة المرور وسياسات صلاحيات.' },
      { icon: 'terminal', title: 'Artisan', text: 'سطر أوامر يولّد الملفات ويشغّل الهجرات والمهام.' },
      { icon: 'refresh', title: 'الطوابير والجدولة', text: 'مهام خلفية ومهام مجدولة بلا إعداد معقّد.' },
      { icon: 'zap', title: 'اختبارات مدمجة', text: 'PHPUnit و Pest مع مساعدات اختبار HTTP وقاعدة البيانات.' }
    ]},
    { t: 'table', head: ['المعيار', 'Laravel', 'ملاحظة'], rows: [
      ['**سرعة التطوير**', 'ممتازة', 'أدوات جاهزة لكل مهمة شائعة'],
      ['**منحنى التعلّم**', 'متوسّط', 'كثير من «السحر» يحتاج فهماً'],
      ['**المجتمع**', 'ضخم', 'أكبر نظام بيئي في PHP'],
      ['**الاستضافة**', 'الأسهل', 'PHP مدعوم في كل مكان وبأرخص الأسعار'],
      ['**الأنسب لـ**', 'تطبيقات الويب ولوحات الإدارة والواجهات البرمجية', 'ليس خياراً للحوسبة الفورية أو الأنظمة المدمجة']
    ]},

    { t: 'h2', text: 'المتطلّبات والتثبيت' },
    { t: 'code', lang: 'bash', code: `
# 1) تحقّق من PHP — Laravel 11 يحتاج 8.2 فأحدث
php -v

# ماك
brew install php composer

# أوبنتو
sudo apt install php8.3 php8.3-{cli,mbstring,xml,curl,zip,mysql,sqlite3} composer

# ويندوز: ثبّت Laravel Herd من herd.laravel.com — يشمل كل شيء
`.trim() },
    { t: 'code', lang: 'bash', code: `
# إنشاء مشروع
composer create-project laravel/laravel blog
cd blog

# أو عبر مثبّت Laravel
composer global require laravel/installer
laravel new blog

# التشغيل
php artisan serve        # http://localhost:8000
`.trim() },
    { t: 'tip', text: 'على ماك وويندوز، **Laravel Herd** هو أسرع طريق: يثبّت PHP و Composer و Nginx و قواعد البيانات في نقرة، ويمنح كل مشروع نطاقاً محلياً مثل `blog.test` تلقائياً.' },

    { t: 'h2', text: 'بنية المشروع' },
    { t: 'code', lang: 'text', code: `
blog/
├── app/
│   ├── Http/
│   │   ├── Controllers/      ← المتحكّمات
│   │   ├── Middleware/       ← الوسطاء
│   │   └── Requests/         ← تحقّق النماذج
│   ├── Models/               ← نماذج Eloquent
│   ├── Providers/            ← مزوّدو الخدمات
│   └── Policies/             ← سياسات الصلاحيات
├── bootstrap/
│   └── app.php               ← نقطة الإقلاع والإعداد (Laravel 11)
├── config/                   ← ملفات الإعداد
├── database/
│   ├── migrations/           ← الهجرات
│   ├── factories/            ← مصانع البيانات الوهمية
│   └── seeders/              ← البذور
├── public/                   ← جذر الويب — index.php والأصول
├── resources/
│   ├── views/                ← قوالب Blade
│   ├── css/  js/             ← الأصول المصدرية
├── routes/
│   ├── web.php               ← مسارات الويب
│   └── console.php           ← أوامر Artisan
├── storage/                  ← السجلّات والملفات المرفوعة والذاكرة المؤقّتة
├── tests/
├── .env                      ← إعدادات البيئة (لا يُرفع لـ Git!)
├── composer.json
└── artisan
`.trim() },
    { t: 'danger', title: 'جذر الويب هو `public/` لا مجلّد المشروع', text: 'عند النشر، وجّه الخادم إلى `public/` فقط. توجيهه لمجلّد المشروع يجعل `.env` وكل شيفرتك متاحة للتحميل عبر المتصفّح — ثغرة أمنية كاملة.' },

    { t: 'h2', text: 'ملف .env' },
    { t: 'code', lang: 'bash', code: `
APP_NAME="مدوّنتي"
APP_ENV=local
APP_KEY=base64:xxxxx          # يُولَّد بـ php artisan key:generate
APP_DEBUG=true                # ⚠️ اجعله false في الإنتاج!
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blog
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=log
QUEUE_CONNECTION=database
SESSION_DRIVER=database
CACHE_STORE=database
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// قراءة الإعدادات
config('app.name');            // ✅ الطريقة الصحيحة
config('database.default');
config('app.debug');

env('APP_NAME');               // ⚠️ يعمل في ملفات config فقط
`.trim() },
    { t: 'danger', title: 'لا تستخدم `env()` خارج ملفات `config/`', text: 'عند تخزين الإعدادات مؤقّتاً في الإنتاج بـ `config:cache`، تُرجع `env()` قيمة `null` في كل مكان آخر. اقرأ دائماً عبر `config()`، وضع أيّ قيمة تحتاجها في ملف إعداد أولاً.' },
    { t: 'warn', title: '`.env` لا يُرفع لـ Git أبداً', text: 'يحتوي كلمات مرور قاعدة البيانات ومفاتيح الواجهات البرمجية. الملف مُدرَج في `.gitignore` افتراضياً — لا تُخرجه منه. شارك البنية عبر `.env.example` بقيم فارغة.' },

    { t: 'h2', text: 'Artisan' },
    { t: 'code', lang: 'bash', code: `
php artisan list                    # كل الأوامر
php artisan help make:model

# التوليد
php artisan make:model Post -mfsc   # نموذج + هجرة + مصنع + بذرة + متحكّم
php artisan make:controller PostController --resource
php artisan make:migration create_posts_table
php artisan make:request StorePostRequest
php artisan make:middleware EnsureUserIsAdmin
php artisan make:policy PostPolicy --model=Post
php artisan make:seeder PostSeeder
php artisan make:test PostTest

# قاعدة البيانات
php artisan migrate
php artisan migrate:rollback
php artisan migrate:fresh --seed     # يمسح كل شيء ويعيد البناء
php artisan db:seed

# التشخيص
php artisan route:list
php artisan tinker                   # صدفة تفاعلية
php artisan about                    # معلومات المشروع

# الذاكرة المؤقّتة
php artisan optimize:clear           # يمسح الكل
php artisan config:cache             # للإنتاج فقط
`.trim() },
    { t: 'h3', text: 'Tinker — مختبرك التفاعلي' },
    { t: 'code', lang: 'php', code: `
php artisan tinker

>>> User::count()
=> 5

>>> $user = User::factory()->create(['name' => 'سارة']);
>>> $user->posts()->create(['title' => 'أول مقال', 'body' => '…']);

>>> Post::with('user')->latest()->first()->toArray()

>>> now()->addDays(7)->format('Y-m-d')
=> "2026-09-03"

>>> Str::slug('مرحبا بالعالم')
`.trim() },
    { t: 'tip', text: 'Tinker هو أسرع طريقة لاستكشاف نماذجك وتجربة الاستعلامات. استخدمه بدل كتابة مسار مؤقّت لتجربة شيء.' },

    { t: 'h2', text: 'أول مسار وأول صفحة' },
    { t: 'code', lang: 'php', code: `
<?php
// routes/web.php
use Illuminate\\Support\\Facades\\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/hello', function () {
    return 'مرحباً بالعالم';
});

Route::get('/hello/{name}', function (string $name) {
    return view('hello', ['name' => $name]);
});
`.trim() },
    { t: 'code', lang: 'blade', code: `
{{-- resources/views/hello.blade.php --}}
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <title>{{ config('app.name') }}</title>
</head>
<body>
    <h1>مرحباً يا {{ $name }}!</h1>
    <p>اليوم: {{ now()->format('Y-m-d') }}</p>
</body>
</html>
`.trim() },

    { t: 'h2', text: 'مسار الطلب في Laravel' },
    { t: 'demo', title: 'دورة حياة الطلب', height: 400,
      css: 'body{font-family:system-ui;margin:0;padding:14px;background:#fff}.flow{display:flex;flex-direction:column;gap:7px}.step{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;border:1px solid #e2e8f0;background:#f8fafc}.n{width:25px;height:25px;border-radius:50%;background:#ff2d20;color:#fff;display:grid;place-items:center;font-weight:700;font-size:.78em;flex-shrink:0}.t{font-weight:700;font-size:.85em;margin-bottom:1px}.d{font-size:.76em;color:#64748b}.arr{text-align:center;color:#cbd5e1;font-size:.85em;line-height:1}',
      html: '<div class="flow"><div class="step"><div class="n">1</div><div><div class="t">public/index.php</div><div class="d">نقطة الدخول الوحيدة لكل الطلبات</div></div></div><div class="arr">▼</div><div class="step"><div class="n">2</div><div><div class="t">bootstrap/app.php</div><div class="d">إقلاع التطبيق وتحميل مزوّدي الخدمات</div></div></div><div class="arr">▼</div><div class="step"><div class="n">3</div><div><div class="t">الوسطاء العامّون</div><div class="d">الجلسة، رمز CSRF، التشفير</div></div></div><div class="arr">▼</div><div class="step"><div class="n">4</div><div><div class="t">الموجّه — routes/web.php</div><div class="d">يطابق المسار ويحدّد المتحكّم</div></div></div><div class="arr">▼</div><div class="step"><div class="n">5</div><div><div class="t">وسطاء المسار</div><div class="d">auth، الصلاحيات، تحديد المعدّل</div></div></div><div class="arr">▼</div><div class="step"><div class="n">6</div><div><div class="t">المتحكّم</div><div class="d">ينسّق: النموذج ← البيانات ← العرض</div></div></div><div class="arr">▼</div><div class="step"><div class="n">7</div><div><div class="t">الاستجابة</div><div class="d">HTML أو JSON تعود عبر الوسطاء نفسها</div></div></div></div>' },

    { t: 'h2', text: 'أدوات التطوير الأساسية' },
    { t: 'code', lang: 'bash', code: `
# تنسيق الشيفرة — مضمّن في Laravel
./vendor/bin/pint

# تحليل ساكن
composer require --dev larastan/larastan
./vendor/bin/phpstan analyse

# شريط تنقيح في المتصفّح
composer require --dev barryvdh/laravel-debugbar

# مساعدات IDE للإكمال التلقائي
composer require --dev barryvdh/laravel-ide-helper
php artisan ide-helper:generate
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// التنقيح
dd($variable);          // اطبع وأوقف التنفيذ
dump($variable);        // اطبع وأكمل
ray($variable);         // مع تطبيق Ray
logger()->info('رسالة', ['context' => $data]);
Log::error('خطأ', ['exception' => $e]);
`.trim() },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'تهيئة مشروع وصفحة تعريف',
      brief: 'أنشئ مشروع Laravel جديداً واضبطه وابنِ صفحة تعريف ديناميكية.',
      requirements: [
        'أنشئ مشروعاً باسم `codeway` وشغّله على `http://localhost:8000`.',
        'اضبط `.env`: اسم التطبيق بالعربية، والمنطقة الزمنية `Asia/Riyadh` في `config/app.php`.',
        'أنشئ مسار `/` يعرض صفحة رئيسية، و `/about` يعرض صفحة تعريف.',
        'أنشئ مسار `/greet/{name}` يمرّر الاسم للعرض، ويستخدم "زائر" إن لم يُمرَّر.',
        'أنشئ قالباً أساسياً `layouts/app.blade.php` بـ RTL وخطّ عربي، وورّث منه الصفحتين.',
        'اعرض في صفحة التعريف: اسم التطبيق من `config()`، إصدار Laravel، إصدار PHP، والتاريخ الهجري والميلادي.',
        'أضف شريط تنقّل مشتركاً يبرز الصفحة الحالية.',
        'أنشئ مسار `/api/info` يُرجع نفس المعلومات بصيغة JSON.',
        'أضف صفحة خطأ 404 مخصّصة بالعربية.'
      ],
      hints: [
        '`Route::get(\'/greet/{name?}\', ...)` مع `?` يجعل المعامل اختيارياً.',
        '`app()->version()` و `PHP_VERSION` للإصدارات.',
        '`request()->routeIs(\'about\')` لمعرفة المسار الحالي.',
        'صفحة 404 المخصّصة: `resources/views/errors/404.blade.php`.'
      ],
      solution: { lang: 'php', code: `
<?php
// ═══════════════════════════════════════════════
// routes/web.php
// ═══════════════════════════════════════════════
use Illuminate\\Support\\Facades\\Route;

Route::get('/', fn () => view('home'))->name('home');

Route::get('/about', function () {
    return view('about', [
        'info' => app_info(),
    ]);
})->name('about');

Route::get('/greet/{name?}', function (?string $name = null) {
    return view('greet', ['name' => $name ?: 'زائر']);
})->name('greet');

Route::get('/api/info', fn () => response()->json(app_info()));

// ═══════════════════════════════════════════════
// app/helpers.php  (سجّله في composer.json → autoload.files)
// ═══════════════════════════════════════════════
if (! function_exists('app_info')) {
    function app_info(): array
    {
        return [
            'app'          => config('app.name'),
            'environment'  => config('app.environment', app()->environment()),
            'laravel'      => app()->version(),
            'php'          => PHP_VERSION,
            'timezone'     => config('app.timezone'),
            'date'         => now()->format('Y-m-d'),
            'time'         => now()->format('H:i'),
            'day'          => now()->translatedFormat('l'),
        ];
    }
}
?>

{{-- ═══════════════════════════════════════════════ --}}
{{-- resources/views/layouts/app.blade.php --}}
{{-- ═══════════════════════════════════════════════ --}}
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'الرئيسية') — {{ config('app.name') }}</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        :root { --brand: #ff2d20; --ink: #1e293b; --muted: #64748b; --line: #e2e8f0; }
        * { box-sizing: border-box; }
        body {
            font-family: Cairo, system-ui, sans-serif;
            margin: 0; color: var(--ink); background: #f8fafc; line-height: 1.7;
        }
        .wrap { max-width: 820px; margin: 0 auto; padding: 24px; }
        nav { background: #fff; border-bottom: 1px solid var(--line); }
        nav .wrap { display: flex; gap: 8px; align-items: center; padding: 14px 24px; }
        nav a {
            color: var(--muted); text-decoration: none; padding: 7px 14px;
            border-radius: 8px; font-size: .92rem; font-weight: 600;
        }
        nav a:hover { background: #f1f5f9; color: var(--ink); }
        nav a.active { background: var(--brand); color: #fff; }
        nav .brand { font-weight: 700; color: var(--ink); margin-inline-end: auto; font-size: 1.05rem; }
        h1 { font-size: 1.9rem; margin: 0 0 8px; }
        .card {
            background: #fff; border: 1px solid var(--line);
            border-radius: 14px; padding: 22px; margin-top: 18px;
        }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px 4px; border-bottom: 1px solid var(--line); }
        td:first-child { color: var(--muted); width: 40%; }
        td:last-child { font-weight: 600; }
        tr:last-child td { border-bottom: 0; }
        footer { text-align: center; color: var(--muted); font-size: .85rem; padding: 28px 0; }
    </style>
</head>
<body>
    <nav>
        <div class="wrap">
            <span class="brand">{{ config('app.name') }}</span>
            <a href="{{ route('home') }}"  class="{{ request()->routeIs('home')  ? 'active' : '' }}">الرئيسية</a>
            <a href="{{ route('about') }}" class="{{ request()->routeIs('about') ? 'active' : '' }}">عن المنصّة</a>
            <a href="{{ route('greet') }}" class="{{ request()->routeIs('greet') ? 'active' : '' }}">ترحيب</a>
        </div>
    </nav>

    <main class="wrap">
        @yield('content')
    </main>

    <footer>
        &copy; {{ now()->year }} {{ config('app.name') }} — بُنيت بـ Laravel {{ app()->version() }}
    </footer>
</body>
</html>

{{-- ═══════════════════════════════════════════════ --}}
{{-- resources/views/home.blade.php --}}
{{-- ═══════════════════════════════════════════════ --}}
@extends('layouts.app')
@section('title', 'الرئيسية')

@section('content')
    <h1>أهلاً بك في {{ config('app.name') }}</h1>
    <p>منصّة تعليمية لتعلّم تطوير الويب باللغة العربية.</p>

    <div class="card">
        <p>جرّب صفحة الترحيب بتمرير اسمك في الرابط:</p>
        <p><code>/greet/سارة</code></p>
        <a href="{{ route('greet', ['name' => 'سارة']) }}">جرّب الآن ←</a>
    </div>
@endsection

{{-- ═══════════════════════════════════════════════ --}}
{{-- resources/views/about.blade.php --}}
{{-- ═══════════════════════════════════════════════ --}}
@extends('layouts.app')
@section('title', 'عن المنصّة')

@section('content')
    <h1>عن المنصّة</h1>
    <p>معلومات البيئة التقنية التي يعمل عليها هذا التطبيق.</p>

    <div class="card">
        <table>
            @foreach ($info as $key => $value)
                <tr>
                    <td>{{ __(ucfirst($key)) }}</td>
                    <td>{{ $value }}</td>
                </tr>
            @endforeach
        </table>
    </div>
@endsection

{{-- ═══════════════════════════════════════════════ --}}
{{-- resources/views/greet.blade.php --}}
{{-- ═══════════════════════════════════════════════ --}}
@extends('layouts.app')
@section('title', "ترحيب بـ {$name}")

@section('content')
    <h1>مرحباً يا {{ $name }} 👋</h1>

    <div class="card">
        <p>سعدنا بزيارتك يوم {{ now()->translatedFormat('l، j F Y') }}.</p>
        @if ($name === 'زائر')
            <p>مرّر اسمك في الرابط لترحيب شخصي: <code>/greet/اسمك</code></p>
        @endif
    </div>
@endsection

{{-- ═══════════════════════════════════════════════ --}}
{{-- resources/views/errors/404.blade.php --}}
{{-- ═══════════════════════════════════════════════ --}}
@extends('layouts.app')
@section('title', 'الصفحة غير موجودة')

@section('content')
    <h1>٤٠٤ — الصفحة غير موجودة</h1>
    <p>الرابط الذي طلبته غير متاح، ربما حُذف أو تغيّر عنوانه.</p>
    <p><a href="{{ route('home') }}">العودة للرئيسية ←</a></p>
@endsection
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'لماذا يجب توجيه خادم الويب إلى `public/` لا لمجلّد المشروع؟', options: ['للأداء', 'لأن توجيهه للمجلّد الأعلى يتيح تحميل `.env` وكل الشيفرة عبر المتصفّح', 'اصطلاح فقط', 'لتقليل المسارات'], answer: 1,
        explain: 'ثغرة أمنية كاملة: كلمات مرور قاعدة البيانات ومفاتيح الواجهات كلها تصبح متاحة للتحميل.' },
      { q: 'لماذا لا نستخدم `env()` خارج ملفات `config/`؟', options: ['بطيئة', 'تُرجع null عند تخزين الإعدادات مؤقّتاً بـ `config:cache` في الإنتاج', 'ممنوعة', 'غير آمنة'], answer: 1,
        explain: 'اقرأ دائماً عبر `config()`، وضع القيمة في ملف إعداد أولاً.' },
      { q: 'ما فائدة `php artisan tinker`؟', options: ['تشغيل الخادم', 'صدفة تفاعلية لتجربة النماذج والاستعلامات مباشرة', 'توليد ملفات', 'مسح الذاكرة'], answer: 1,
        explain: 'أسرع من كتابة مسار مؤقّت لتجربة استعلام أو دالة.' },
      { q: 'ماذا يولّد `php artisan make:model Post -mfsc`؟', options: ['النموذج فقط', 'نموذج + هجرة + مصنع + بذرة + متحكّم', 'نموذج وهجرة', 'نموذج ومتحكّم'], answer: 1,
        explain: '`m` هجرة، `f` مصنع، `s` بذرة، `c` متحكّم — اختصار مفيد جداً.' },
      { q: 'ما دور `bootstrap/app.php` في Laravel 11؟', options: ['ملف الأنماط', 'نقطة الإقلاع وإعداد الوسطاء والاستثناءات والمسارات', 'الاتصال بقاعدة البيانات', 'مسارات الويب'], answer: 1,
        explain: 'حلّ في Laravel 11 محلّ ملفات Kernel المتعدّدة في الإصدارات السابقة.' },
      { q: 'كيف تشارك بنية `.env` مع فريقك؟', options: ['ترفعه لـ Git', 'عبر `.env.example` بقيم فارغة أو تجريبية', 'ترسله بالبريد', 'لا تشاركها'], answer: 1,
        explain: '`.env` نفسه في `.gitignore` دائماً لأنه يحمل أسراراً حقيقية.' }
    ]}
  ]
};
