'use strict';

module.exports = {
  slug: '05-eloquent',
  title: 'Eloquent ORM',
  summary: 'النماذج والاستعلامات، الإسناد الجماعي، التحويلات، النطاقات، الملحقات، والأحداث — قلب Laravel.',
  duration: 60,
  level: 'متوسط',
  tags: ['Eloquent', 'ORM', 'Models'],
  objectives: [
    'تعرّف نموذجاً وتفهم اتفاقات Eloquent.',
    'تكتب استعلامات معقّدة بصياغة قابلة للقراءة.',
    'تحمي نفسك من ثغرة الإسناد الجماعي.',
    'تستخدم التحويلات (Casts) لتحويل الأنواع تلقائياً.',
    'تعرّف نطاقات وملحقات لتقليل التكرار.',
    'تفهم أحداث النموذج والحذف الناعم.'
  ],
  quickRef: [
    { code: 'Model::find($id)', desc: 'بالمفتاح' },
    { code: '::where(...)->get()', desc: 'استعلام' },
    { code: '$fillable', desc: 'حقول مسموحة' },
    { code: '$casts / casts()', desc: 'تحويل الأنواع' },
    { code: 'scopeX()', desc: 'نطاق' },
    { code: 'Attribute::make()', desc: 'ملحق' },
    { code: 'SoftDeletes', desc: 'حذف ناعم' },
    { code: '->when($c, $fn)', desc: 'شرط في الاستعلام' }
  ],
  blocks: [
    { t: 'h2', text: 'النموذج واتفاقاته' },
    { t: 'code', lang: 'bash', code: `
php artisan make:model Post
php artisan make:model Post -mfsc      # + هجرة ومصنع وبذرة ومتحكّم
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Post extends Model
{
    // الاتفاقات — كلها اختيارية إن اتّبعت التسمية المتوقّعة
    protected $table = 'posts';           // مستنتَج: جمع اسم الصنف بحروف صغيرة
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;            // created_at و updated_at
    protected $dateFormat = 'Y-m-d H:i:s';
    protected $connection = 'mysql';
}
`.trim() },
    { t: 'table', head: ['الصنف', 'الجدول المستنتَج'], rows: [
      ['`Post`', '`posts`'],
      ['`Category`', '`categories`'],
      ['`OrderItem`', '`order_items`'],
      ['`Person`', '`people`']
    ]},
    { t: 'note', text: 'Laravel يستخدم مكتبة تصريف إنجليزية ذكية تعرف الجموع الشاذّة. إن لم يوافق ما تريده، حدّد `$table` صراحةً.' },

    { t: 'h2', text: 'الاستعلامات' },
    { t: 'code', lang: 'php', code: `
<?php
// جلب
Post::all();                              // ⚠️ كل الصفوف — احذر مع الجداول الكبيرة
Post::find(5);                            // بالمفتاح، أو null
Post::findOrFail(5);                      // أو 404
Post::find([1, 2, 3]);                    // عدة مفاتيح
Post::first();
Post::firstWhere('slug', 'my-post');
Post::firstOrFail();
Post::latest()->first();
Post::count();
Post::pluck('title', 'id');               // => [1 => 'عنوان', ...]
Post::value('title');                     // عمود واحد من أول صفّ

// الترشيح
Post::where('status', 'published')->get();
Post::where('views', '>', 1000)->get();
Post::where('title', 'like', '%ruby%')->get();
Post::whereIn('id', [1, 2, 3])->get();
Post::whereNotIn('status', ['draft'])->get();
Post::whereBetween('price', [100, 500])->get();
Post::whereNull('deleted_at')->get();
Post::whereDate('created_at', today())->get();
Post::whereYear('created_at', 2026)->get();
Post::whereMonth('created_at', 8)->get();

// أعمدة كأسماء دوال
Post::whereStatus('published')->get();
Post::whereSlugAndStatus('x', 'published')->first();
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// شروط مركّبة
Post::where('status', 'published')
    ->where(function ($query) {
        $query->where('featured', true)
              ->orWhere('views', '>', 5000);
    })
    ->get();

// شرط اختياري — الأنظف
Post::query()
    ->when($request->search, fn ($q, $term) => $q->where('title', 'like', "%{$term}%"))
    ->when($request->category, fn ($q, $id) => $q->where('category_id', $id))
    ->when($request->sort === 'popular',
        fn ($q) => $q->orderByDesc('views'),
        fn ($q) => $q->latest())          // وإلا
    ->paginate(15);
`.trim() },
    { t: 'compare', lang: 'php', bad: {
      code: `$query = Post::query();

if ($request->search) {
    $query->where('title', 'like', "%{$request->search}%");
}

if ($request->category) {
    $query->where('category_id', $request->category);
}

if ($request->min_price) {
    $query->where('price', '>=', $request->min_price);
}

$posts = $query->paginate(15);`,
      why: 'يعمل، لكن الشيفرة تنقطع بين الشروط ويصعب قراءة الاستعلام كوحدة واحدة.'
    }, good: {
      code: `$posts = Post::query()
    ->when($request->search,    fn ($q, $v) => $q->where('title', 'like', "%{$v}%"))
    ->when($request->category,  fn ($q, $v) => $q->where('category_id', $v))
    ->when($request->min_price, fn ($q, $v) => $q->where('price', '>=', $v))
    ->paginate(15);`,
      why: 'سلسلة واحدة تُقرأ من أعلى لأسفل، والقيمة تُمرَّر للدالة تلقائياً كمعامل ثانٍ.'
    }},
    { t: 'h3', text: 'الترتيب والحدّ والتجميع' },
    { t: 'code', lang: 'php', code: `
<?php
Post::orderBy('created_at', 'desc')->get();
Post::latest()->get();                      // اختصار لـ created_at desc
Post::oldest()->get();
Post::latest('published_at')->get();
Post::inRandomOrder()->limit(3)->get();
Post::orderByRaw('FIELD(status, "published", "draft")')->get();

Post::take(10)->skip(20)->get();
Post::paginate(15);
Post::simplePaginate(15);                   // بلا عدّ إجمالي — أسرع
Post::cursorPaginate(15);                   // الأفضل للجداول الضخمة

Post::selectRaw('status, COUNT(*) as total')
    ->groupBy('status')
    ->having('total', '>', 5)
    ->get();

Post::sum('views');
Post::avg('rating');
Post::max('price');
`.trim() },
    { t: 'tip', text: 'استخدم `cursorPaginate` على الجداول الضخمة: `paginate` ينفّذ `COUNT(*)` على الجدول كله في كل صفحة، وهذا يصبح بطيئاً جداً بعد ملايين الصفوف.' },

    { t: 'h2', text: 'الإنشاء والتحديث' },
    { t: 'code', lang: 'php', code: `
<?php
// الإنشاء
$post = new Post();
$post->title = 'عنوان';
$post->body  = 'محتوى';
$post->save();

$post = Post::create([                    // يحتاج $fillable
    'title' => 'عنوان',
    'body'  => 'محتوى',
]);

Post::insert([...]);                       // إدراج جماعي — بلا أحداث ولا timestamps

// التحديث
$post->update(['title' => 'جديد']);
$post->title = 'جديد';
$post->save();

Post::where('status', 'draft')->update(['status' => 'archived']);  // جماعي

$post->increment('views');
$post->increment('views', 5);
$post->decrement('stock', $quantity);

// الحفظ الذكي
Post::firstOrCreate(
    ['slug' => 'my-post'],                 // البحث بهذا
    ['title' => 'عنواني', 'body' => '…']   // والإنشاء بهذا إن لم يوجد
);

Post::updateOrCreate(
    ['slug' => 'my-post'],
    ['title' => 'عنوان محدَّث', 'views' => 0]
);

Post::firstOrNew(['slug' => 'x']);         // بلا حفظ

// الحذف
$post->delete();
Post::destroy(5);
Post::destroy([1, 2, 3]);
Post::where('status', 'spam')->delete();
`.trim() },
    { t: 'warn', title: 'التحديث الجماعي لا يشغّل الأحداث', text: '`Post::where(...)->update([...])` ينفّذ استعلام SQL واحداً مباشرة، فلا تُستدعى أحداث `saving` و `saved` ولا المراقبون. إن كان منطقك يعتمد عليها، مرّ على السجلّات بـ `each` بدلاً من ذلك.' },

    { t: 'h2', text: 'الإسناد الجماعي والحماية' },
    { t: 'code', lang: 'php', code: `
<?php
class Post extends Model
{
    // ✅ قائمة بيضاء — الأفضل
    protected $fillable = ['title', 'body', 'category_id', 'published'];

    // ⚠️ قائمة سوداء — أخطر
    protected $guarded = ['id', 'user_id'];

    // 🚨 لا تفعل هذا أبداً
    protected $guarded = [];
}
`.trim() },
    { t: 'danger', title: 'ثغرة الإسناد الجماعي', text: 'لو كتبت `Post::create($request->all())` بلا `$fillable` صحيح، يستطيع مهاجم إرسال `user_id=1` أو `is_admin=1` في النموذج فيسند القيمة مباشرة. **دائماً**: عرّف `$fillable`، واستخدم `$request->validated()` لا `$request->all()`.' },
    { t: 'code', lang: 'php', code: `
<?php
// ✗ خطير
Post::create($request->all());

// ✅ آمن — التحقّق يُرجع الحقول المسموحة فقط
Post::create($request->validated());

// ✅ آمن — تحديد صريح
Post::create($request->only(['title', 'body']));

// ✅ آمن — الحقول الحسّاسة تُسند صراحةً
$post = $request->user()->posts()->create($request->validated());
`.trim() },

    { t: 'h2', text: 'التحويلات (Casts)' },
    { t: 'code', lang: 'php', code: `
<?php
use Illuminate\\Database\\Eloquent\\Casts\\AsCollection;

class Post extends Model
{
    protected function casts(): array      // Laravel 11+
    {
        return [
            'published'     => 'boolean',
            'views_count'   => 'integer',
            'price'         => 'decimal:2',
            'meta'          => 'array',            // JSON ↔ مصفوفة
            'settings'      => AsCollection::class, // JSON ↔ Collection
            'published_at'  => 'datetime',
            'launched_on'   => 'date',
            'status'        => PostStatus::class,   // Enum من PHP 8.1
            'api_token'     => 'encrypted',         // مشفّر في القاعدة
            'options'       => 'encrypted:array',
        ];
    }
}
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
$post->published;        // bool وليس "1"
$post->published_at;     // كائن Carbon
$post->published_at->diffForHumans();     // "قبل ٣ أيام"
$post->published_at->format('Y-m-d');
$post->meta['author'];   // مصفوفة جاهزة
$post->meta = ['author' => 'سارة'];        // يُحوَّل لـ JSON تلقائياً
`.trim() },
    { t: 'h3', text: 'Enums' },
    { t: 'code', lang: 'php', code: `
<?php
enum PostStatus: string
{
    case Draft     = 'draft';
    case Published = 'published';
    case Archived  = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft     => 'مسوّدة',
            self::Published => 'منشور',
            self::Archived  => 'مؤرشف',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Draft => 'amber', self::Published => 'green', self::Archived => 'gray',
        };
    }
}

// الاستخدام
$post->status === PostStatus::Published;
$post->status->label();                    // "منشور"
Post::where('status', PostStatus::Published)->get();
`.trim() },
    { t: 'tip', text: 'الـ Enums تحلّ مشكلة «النصوص السحرية»: كتابة `\'publised\'` بخطأ إملائي تمرّ بصمت مع النصّ، بينما `PostStatus::Publised` تفشل فوراً في المحرّر وفي التحليل الساكن.' },

    { t: 'h2', text: 'النطاقات (Scopes)' },
    { t: 'code', lang: 'php', code: `
<?php
class Post extends Model
{
    // نطاق محلي — يُستدعى باسمه بلا البادئة
    public function scopePublished(Builder $query): void
    {
        $query->where('status', PostStatus::Published)
              ->whereNotNull('published_at')
              ->where('published_at', '<=', now());
    }

    public function scopePopular(Builder $query, int $min = 1000): void
    {
        $query->where('views_count', '>=', $min);
    }

    public function scopeSearch(Builder $query, ?string $term): void
    {
        $query->when($term, fn ($q, $t) =>
            $q->where(fn ($q) =>
                $q->where('title', 'like', "%{$t}%")
                  ->orWhere('body', 'like', "%{$t}%")
            )
        );
    }

    public function scopeOwnedBy(Builder $query, User $user): void
    {
        $query->where('user_id', $user->id);
    }
}

// الاستخدام — تتسلسل بحرّية
Post::published()->popular()->latest()->limit(10)->get();
Post::published()->search($request->q)->paginate(15);
Post::ownedBy($user)->published()->count();
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// نطاق عام — يُطبَّق تلقائياً على كل استعلام
class PublishedScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('status', 'published');
    }
}

class Post extends Model
{
    protected static function booted(): void
    {
        static::addGlobalScope(new PublishedScope());

        // أو مباشرة
        static::addGlobalScope('published', fn (Builder $q) =>
            $q->where('status', 'published')
        );
    }
}

// التجاوز عند الحاجة
Post::withoutGlobalScope('published')->get();
Post::withoutGlobalScopes()->get();
`.trim() },
    { t: 'warn', title: 'النطاقات العامة سيف ذو حدّين', text: 'مريحة، لكنها تجعل سلوك النموذج مفاجئاً: مطوّر يكتب `Post::count()` ويحصل على رقم لا يفهم مصدره. استخدمها فقط حين يكون الترشيح **حقيقة ثابتة** عن النموذج (مثل عزل بيانات المستأجرين في تطبيق متعدّد المستأجرين).' },

    { t: 'h2', text: 'الملحقات (Accessors & Mutators)' },
    { t: 'code', lang: 'php', code: `
<?php
use Illuminate\\Database\\Eloquent\\Casts\\Attribute;
use Illuminate\\Support\\Str;

class Post extends Model
{
    // قراءة فقط — خاصية محسوبة
    protected function excerpt(): Attribute
    {
        return Attribute::make(
            get: fn () => Str::limit(strip_tags($this->body), 160),
        );
    }

    protected function readingMinutes(): Attribute
    {
        return Attribute::make(
            get: fn () => max(1, (int) ceil(str_word_count($this->body) / 200)),
        );
    }

    // قراءة وكتابة
    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
            set: fn (string $value) => [
                'title' => trim($value),
                'slug'  => Str::slug($value) . '-' . Str::random(6),
            ],
        );
    }

    // مع تخزين مؤقّت للحسابات الثقيلة
    protected function statistics(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->computeStats(),
        )->shouldCache();
    }
}

// الاستخدام — كأنها أعمدة حقيقية
$post->excerpt;
$post->reading_minutes;
$post->title = '  عنواني  ';    // يُنظَّف ويولّد slug تلقائياً
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// إضافة الخصائص المحسوبة إلى JSON تلقائياً
class Post extends Model
{
    protected $appends = ['excerpt', 'reading_minutes'];

    // إخفاء حقول حسّاسة من JSON
    protected $hidden = ['api_token', 'internal_notes'];
}

$post->toArray();      // يشمل excerpt و reading_minutes
$post->toJson();
`.trim() },

    { t: 'h2', text: 'الحذف الناعم' },
    { t: 'code', lang: 'php', code: `
<?php
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;
}

// الهجرة: $table->softDeletes();

$post->delete();                    // يضبط deleted_at فقط
$post->trashed();                   // => true

Post::all();                        // يستثني المحذوفة تلقائياً
Post::withTrashed()->get();         // مع المحذوفة
Post::onlyTrashed()->get();         // المحذوفة فقط

$post->restore();                   // استرجاع
Post::onlyTrashed()->restore();

$post->forceDelete();               // حذف نهائي
Post::onlyTrashed()->where('deleted_at', '<', now()->subYear())->forceDelete();
`.trim() },

    { t: 'h2', text: 'أحداث النموذج' },
    { t: 'code', lang: 'php', code: `
<?php
class Post extends Model
{
    protected static function booted(): void
    {
        static::creating(function (Post $post) {
            $post->slug ??= Str::slug($post->title) . '-' . Str::random(6);
            $post->user_id ??= auth()->id();
        });

        static::updating(function (Post $post) {
            if ($post->isDirty('status') && $post->status === PostStatus::Published) {
                $post->published_at ??= now();
            }
        });

        static::deleting(function (Post $post) {
            $post->comments()->delete();
            Storage::delete($post->cover_path);
        });
    }
}
`.trim() },
    { t: 'table', head: ['الحدث', 'متى'], rows: [
      ['`retrieved`', 'بعد الجلب من القاعدة'],
      ['`creating` / `created`', 'قبل/بعد الإنشاء'],
      ['`updating` / `updated`', 'قبل/بعد التحديث'],
      ['`saving` / `saved`', 'قبل/بعد كليهما'],
      ['`deleting` / `deleted`', 'قبل/بعد الحذف'],
      ['`restoring` / `restored`', 'قبل/بعد الاسترجاع']
    ]},
    { t: 'code', lang: 'bash', code: `
# للمنطق الطويل استخدم مراقباً مستقلاً
php artisan make:observer PostObserver --model=Post
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
#[ObservedBy(PostObserver::class)]      // Laravel 11+
class Post extends Model {}

class PostObserver
{
    public function created(Post $post): void
    {
        SendNewPostNotification::dispatch($post);
    }

    public function deleted(Post $post): void
    {
        Cache::forget("post.{$post->id}");
    }
}
`.trim() },
    { t: 'warn', title: 'لا تضع منطقاً ثقيلاً في الأحداث', text: 'إرسال بريد أو استدعاء واجهة خارجية داخل حدث `created` يبطئ الطلب ويجعل الفشل غامضاً. أرسل مهمّة للطابور بدلاً من ذلك، وضع منطق العمل المعقّد في **كائن خدمة** يُستدعى صراحةً.' },

    { t: 'h2', text: 'الأداء' },
    { t: 'code', lang: 'php', code: `
<?php
// اطلب الأعمدة التي تحتاجها فقط
Post::select('id', 'title', 'slug', 'user_id')->get();

// عالج الجداول الضخمة على دفعات
Post::chunk(500, function ($posts) {
    foreach ($posts as $post) { /* … */ }
});

Post::chunkById(500, fn ($posts) => $posts->each->reindex());   // أأمن مع التعديل

// كسول — واجهة Collection مع استهلاك ذاكرة ثابت
Post::lazy()->each(fn ($post) => $post->process());

// عدّ بلا جلب
Post::where('status', 'published')->count();
Post::where('id', 5)->exists();
Post::where('id', 5)->doesntExist();

// استعلام خام عند الحاجة
Post::selectRaw('DATE(created_at) as day, COUNT(*) as total')
    ->groupBy('day')
    ->orderByDesc('day')
    ->get();
`.trim() },
    { t: 'danger', title: 'لا تستخدم `Post::all()` على جدول كبير', text: 'يحمّل كل الصفوف في الذاكرة دفعة واحدة. على مليون صفّ ينفد حدّ الذاكرة وينهار الطلب. استخدم `paginate` أو `chunk` أو `lazy`.' },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'نموذج منتج غنيّ',
      brief: 'ابنِ نموذج `Product` كاملاً بكل ما تعلّمته: نطاقات وملحقات وتحويلات وأحداث.',
      requirements: [
        'تحويلات لكل الأعمدة: أسعار `decimal`، حالة `Enum`، بيانات وصفية `array`، تواريخ `datetime`.',
        'Enum `ProductStatus` بدوال `label()` و `color()` و `isVisible()`.',
        'نطاقات: `active`, `inStock`, `outOfStock`, `onSale`, `featured`, `search`, `priceBetween`, `inCategory`, `sortBy`.',
        'ملحقات: `final_price` (يراعي الخصم)، `discount_percentage`، `is_on_sale`، `stock_status`، `primary_image_url`.',
        'ملحق `name` يولّد `slug` تلقائياً عند التعيين.',
        'أحداث: توليد SKU عند الإنشاء، وتفريغ الذاكرة المؤقّتة عند التحديث والحذف.',
        'حذف ناعم مع دالة صنف `purgeOldTrashed()` تحذف نهائياً ما مضى عليه سنة.',
        'دوال عمل: `decreaseStock($qty)` و `increaseStock($qty)` مع حماية من المخزون السالب.',
        'دالة `isAvailableFor($quantity)` تجمع كل شروط التوفّر.',
        'دالة نطاق `filter(array $filters)` تطبّق كل مرشّحات الواجهة دفعة واحدة.',
        'اكتب مثال استخدام في نهاية الملف يوضّح كل ما سبق.'
      ],
      hints: [
        '`Attribute::make(get: ..., set: ...)` هي الصياغة الحديثة للملحقات.',
        '`$this->isDirty(\'price\')` تخبرك إن تغيّر عمود قبل الحفظ.',
        '`static::booted()` هو المكان الصحيح لتسجيل الأحداث.',
        'استخدم `match` في الـ Enum لا `switch` — أوضح وأكثر أماناً.'
      ],
      solution: { lang: 'php', code: `
<?php
// ═══════════════════════════════════════════════
// app/Enums/ProductStatus.php
// ═══════════════════════════════════════════════
namespace App\\Enums;

enum ProductStatus: string
{
    case Draft    = 'draft';
    case Active   = 'active';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft    => 'مسوّدة',
            self::Active   => 'نشط',
            self::Archived => 'مؤرشف',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Draft => 'amber', self::Active => 'green', self::Archived => 'gray',
        };
    }

    public function isVisible(): bool
    {
        return $this === self::Active;
    }

    public static function options(): array
    {
        return array_map(
            fn (self $case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}

// ═══════════════════════════════════════════════
// app/Models/Product.php
// ═══════════════════════════════════════════════
namespace App\\Models;

use App\\Enums\\ProductStatus;
use Illuminate\\Database\\Eloquent\\Builder;
use Illuminate\\Database\\Eloquent\\Casts\\Attribute;
use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Support\\Facades\\Cache;
use Illuminate\\Support\\Str;
use RuntimeException;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id', 'name', 'slug', 'sku', 'short_description', 'description',
        'price', 'compare_at_price', 'stock', 'low_stock_threshold',
        'status', 'is_featured', 'meta',
    ];

    protected $appends = ['final_price', 'is_on_sale', 'discount_percentage', 'stock_status'];

    protected function casts(): array
    {
        return [
            'price'               => 'decimal:2',
            'compare_at_price'    => 'decimal:2',
            'stock'               => 'integer',
            'low_stock_threshold' => 'integer',
            'views_count'         => 'integer',
            'sales_count'         => 'integer',
            'rating_avg'          => 'decimal:2',
            'rating_count'        => 'integer',
            'is_featured'         => 'boolean',
            'status'              => ProductStatus::class,
            'meta'                => 'array',
            'published_at'        => 'datetime',
        ];
    }

    /* ══════════════ العلاقات ══════════════ */

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /* ══════════════ النطاقات ══════════════ */

    public function scopeActive(Builder $query): void
    {
        $query->where('status', ProductStatus::Active);
    }

    public function scopeInStock(Builder $query): void
    {
        $query->where('stock', '>', 0);
    }

    public function scopeOutOfStock(Builder $query): void
    {
        $query->where('stock', '<=', 0);
    }

    public function scopeLowStock(Builder $query): void
    {
        $query->whereColumn('stock', '<=', 'low_stock_threshold')
              ->where('stock', '>', 0);
    }

    public function scopeOnSale(Builder $query): void
    {
        $query->whereNotNull('compare_at_price')
              ->whereColumn('compare_at_price', '>', 'price');
    }

    public function scopeFeatured(Builder $query): void
    {
        $query->where('is_featured', true)->active();
    }

    public function scopeSearch(Builder $query, ?string $term): void
    {
        $query->when($term, fn (Builder $q, string $t) =>
            $q->where(fn (Builder $inner) =>
                $inner->where('name', 'like', "%{$t}%")
                      ->orWhere('sku', 'like', "%{$t}%")
                      ->orWhere('short_description', 'like', "%{$t}%")
            )
        );
    }

    public function scopePriceBetween(Builder $query, ?float $min, ?float $max): void
    {
        $query->when($min, fn (Builder $q, float $v) => $q->where('price', '>=', $v))
              ->when($max, fn (Builder $q, float $v) => $q->where('price', '<=', $v));
    }

    public function scopeInCategory(Builder $query, Category|int|null $category): void
    {
        $query->when($category, function (Builder $q, $value) {
            $id = $value instanceof Category ? $value->id : $value;
            $q->where('category_id', $id);
        });
    }

    public function scopeSortBy(Builder $query, ?string $sort): void
    {
        match ($sort) {
            'price_asc'  => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'newest'     => $query->latest(),
            'popular'    => $query->orderByDesc('sales_count'),
            'rating'     => $query->orderByDesc('rating_avg')->orderByDesc('rating_count'),
            default      => $query->orderByDesc('is_featured')->latest(),
        };
    }

    /** يطبّق كل مرشّحات الواجهة دفعة واحدة */
    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->search($filters['q'] ?? null)
              ->inCategory($filters['category'] ?? null)
              ->priceBetween($filters['min'] ?? null, $filters['max'] ?? null)
              ->when(($filters['in_stock'] ?? false), fn (Builder $q) => $q->inStock())
              ->when(($filters['on_sale'] ?? false), fn (Builder $q) => $q->onSale())
              ->sortBy($filters['sort'] ?? null);
    }

    /* ══════════════ الملحقات ══════════════ */

    protected function name(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => [
                'name' => trim($value),
                'slug' => Str::slug($value) . '-' . Str::lower(Str::random(5)),
            ],
        );
    }

    protected function finalPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => (float) $this->price,
        );
    }

    protected function isOnSale(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->compare_at_price !== null
                       && (float) $this->compare_at_price > (float) $this->price,
        );
    }

    protected function discountPercentage(): Attribute
    {
        return Attribute::make(
            get: function (): int {
                if (! $this->is_on_sale) {
                    return 0;
                }

                $was = (float) $this->compare_at_price;
                $now = (float) $this->price;

                return (int) round((($was - $now) / $was) * 100);
            },
        );
    }

    protected function stockStatus(): Attribute
    {
        return Attribute::make(
            get: fn (): string => match (true) {
                $this->stock <= 0                          => 'نفد المخزون',
                $this->stock <= $this->low_stock_threshold => "كمية محدودة ({$this->stock})",
                default                                    => 'متوفّر',
            },
        );
    }

    protected function primaryImageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->images->firstWhere('is_primary', true)?->url
                       ?? $this->images->first()?->url
                       ?? asset('images/placeholder.png'),
        )->shouldCache();
    }

    /* ══════════════ منطق العمل ══════════════ */

    public function isAvailableFor(int $quantity = 1): bool
    {
        return $this->status->isVisible()
            && ! $this->trashed()
            && $this->stock >= $quantity
            && $quantity > 0;
    }

    public function decreaseStock(int $quantity): static
    {
        if ($quantity <= 0) {
            throw new RuntimeException('الكمية يجب أن تكون موجبة.');
        }

        if ($this->stock < $quantity) {
            throw new RuntimeException(
                "المخزون لا يكفي: المطلوب {$quantity} والمتاح {$this->stock}."
            );
        }

        $this->decrement('stock', $quantity);
        $this->increment('sales_count', $quantity);

        return $this->refresh();
    }

    public function increaseStock(int $quantity): static
    {
        if ($quantity <= 0) {
            throw new RuntimeException('الكمية يجب أن تكون موجبة.');
        }

        $this->increment('stock', $quantity);

        return $this->refresh();
    }

    public function refreshRating(): static
    {
        $approved = $this->reviews()->where('is_approved', true);

        $this->forceFill([
            'rating_avg'   => round((float) $approved->avg('rating'), 2),
            'rating_count' => $approved->count(),
        ])->save();

        return $this;
    }

    public static function purgeOldTrashed(int $days = 365): int
    {
        return static::onlyTrashed()
            ->where('deleted_at', '<', now()->subDays($days))
            ->forceDelete();
    }

    /* ══════════════ الأحداث ══════════════ */

    protected static function booted(): void
    {
        static::creating(function (self $product) {
            $product->sku ??= 'SKU-' . Str::upper(Str::random(8));
            $product->status ??= ProductStatus::Draft;
        });

        static::updating(function (self $product) {
            if ($product->isDirty('status') && $product->status === ProductStatus::Active) {
                $product->published_at ??= now();
            }
        });

        static::saved(fn (self $product) => $product->flushCache());
        static::deleted(fn (self $product) => $product->flushCache());
        static::restored(fn (self $product) => $product->flushCache());
    }

    protected function flushCache(): void
    {
        Cache::forget("product.{$this->id}");
        Cache::forget("product.slug.{$this->slug}");
        Cache::tags(['products'])->flush();
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}

/* ═══════════════════════════════════════════════
 * أمثلة الاستخدام
 * ═══════════════════════════════════════════════

// صفحة القائمة — كل المرشّحات في سطر واحد
$products = Product::query()
    ->active()
    ->with(['category', 'images'])
    ->filter($request->only(['q', 'category', 'min', 'max', 'in_stock', 'on_sale', 'sort']))
    ->paginate(24)
    ->withQueryString();

// الواجهة الرئيسية
$featured = Product::featured()->inStock()->with('images')->limit(8)->get();
$deals    = Product::active()->onSale()->orderByDesc('rating_avg')->limit(6)->get();

// لوحة الإدارة
$needsRestock = Product::lowStock()->with('category')->get();
$outOfStock   = Product::outOfStock()->count();

// الملحقات
$product->final_price;           // 349.00
$product->is_on_sale;            // true
$product->discount_percentage;   // 30
$product->stock_status;          // "كمية محدودة (3)"
$product->status->label();       // "نشط"

// منطق العمل
if ($product->isAvailableFor(2)) {
    $product->decreaseStock(2);
}

// الصيانة
Product::purgeOldTrashed();
*/
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'ما ثغرة الإسناد الجماعي؟', options: ['بطء الاستعلام', 'تمرير `$request->all()` يسمح للمهاجم بإسناد حقول لم تقصدها مثل `user_id`', 'تكرار البيانات', 'خطأ في الفهارس'], answer: 1,
        explain: 'الحماية: `$fillable` صحيح + `$request->validated()` بدل `all()`.' },
      { q: 'لماذا لا تشغّل `Model::where(...)->update([...])` أحداث النموذج؟', options: ['خطأ في Laravel', 'لأنها تنفّذ استعلام SQL واحداً مباشرة بلا تحميل السجلّات ككائنات', 'للأداء فقط', 'تشغّلها فعلاً'], answer: 1,
        explain: 'إن احتجت الأحداث، مرّ على السجلّات بـ `each` بدل التحديث الجماعي.' },
      { q: 'ما ميزة الـ Enum على النصّ في عمود الحالة؟', options: ['أصغر حجماً', 'الخطأ الإملائي يفشل فوراً في المحرّر بدل أن يمرّ بصمت', 'أسرع', 'إلزامي'], answer: 1,
        explain: 'وتستطيع إضافة دوال مثل `label()` و `color()` داخل الـ Enum نفسه.' },
      { q: 'متى تستخدم `cursorPaginate` بدل `paginate`؟', options: ['دائماً', 'على الجداول الضخمة — `paginate` ينفّذ COUNT(*) على الجدول كله في كل صفحة', 'مع البحث', 'أبداً'], answer: 1,
        explain: 'العيب: لا يعرض عدد الصفحات ولا يسمح بالقفز لصفحة محدّدة.' },
      { q: 'ما خطر النطاق العام (Global Scope)؟', options: ['بطيء', 'يجعل سلوك النموذج مفاجئاً — استعلام بسيط يُرشَّح دون أن يظهر ذلك في الشيفرة', 'لا يعمل', 'يستهلك ذاكرة'], answer: 1,
        explain: 'استخدمه فقط حين يكون الترشيح حقيقة ثابتة عن النموذج، مثل عزل المستأجرين.' },
      { q: 'لماذا نتجنّب المنطق الثقيل في أحداث النموذج؟', options: ['ممنوع', 'يبطئ الطلب ويجعل الفشل غامضاً — أرسل مهمّة للطابور بدلاً منه', 'لا يعمل', 'يكسر الأحداث'], answer: 1,
        explain: 'ضع منطق العمل المعقّد في كائن خدمة يُستدعى صراحةً بدل حدث ضمني.' },
      { q: 'ما فائدة `->when($condition, $callback)`؟', options: ['التخزين المؤقّت', 'تطبّق جزءاً من الاستعلام شرطياً مع إبقاء السلسلة متّصلة ومقروءة', 'التحقّق', 'الترتيب'], answer: 1,
        explain: 'والقيمة تُمرَّر للدالة كمعامل ثانٍ تلقائياً، ويمكن تمرير دالة ثانية للحالة المعاكسة.' }
    ]}
  ]
};
