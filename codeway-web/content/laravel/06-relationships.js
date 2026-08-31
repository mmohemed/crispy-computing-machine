'use strict';

module.exports = {
  slug: '06-relationships',
  title: 'العلاقات في Eloquent',
  summary: 'أنواع العلاقات كلها، التحميل المسبق وحلّ مشكلة N+1، والاستعلام عبر العلاقات والعدّ والتجميع.',
  duration: 60,
  level: 'متقدم',
  tags: ['Relationships', 'Eager Loading', 'N+1'],
  objectives: [
    'تعرّف كل أنواع العلاقات وتعرف متى تستخدم كلاً منها.',
    'تحلّ مشكلة N+1 بالتحميل المسبق وتكتشفها قبل الإنتاج.',
    'تستعلم عبر العلاقات بـ `has` و `whereHas` و `withCount`.',
    'تدير الجداول الوسيطة بـ `attach` و `sync` وبيانات إضافية.',
    'تستخدم العلاقات متعدّدة الأشكال (Polymorphic).',
    'تكتب علاقات متقدّمة: `hasManyThrough` و `latestOfMany`.'
  ],
  quickRef: [
    { code: 'hasOne / belongsTo', desc: 'واحد لواحد' },
    { code: 'hasMany', desc: 'واحد لمتعدّد' },
    { code: 'belongsToMany', desc: 'متعدّد لمتعدّد' },
    { code: 'morphTo / morphMany', desc: 'متعدّد الأشكال' },
    { code: '->with([...])', desc: 'تحميل مسبق' },
    { code: '->withCount()', desc: 'عدّ بلا جلب' },
    { code: '->whereHas()', desc: 'ترشيح بالعلاقة' },
    { code: '->sync([...])', desc: 'مزامنة وسيط' }
  ],
  blocks: [
    { t: 'h2', text: 'واحد إلى واحد' },
    { t: 'code', lang: 'php', code: `
<?php
class User extends Model
{
    public function profile()
    {
        return $this->hasOne(Profile::class);        // المفتاح الأجنبي: profiles.user_id
    }
}

class Profile extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);        // المفتاح الأجنبي: profiles.user_id
    }
}

// الاستخدام
$user->profile->bio;
$user->profile()->create(['bio' => 'نبذة']);
$profile->user->name;
`.trim() },
    { t: 'p', text: 'القاعدة: **`belongsTo` تكون في الجدول الذي يحمل المفتاح الأجنبي**. هنا `profiles` يحمل `user_id`، فالـ `belongsTo` في `Profile`.' },
    { t: 'code', lang: 'php', code: `
<?php
// تحديد المفاتيح صراحةً عند اختلاف التسمية
$this->hasOne(Profile::class, 'owner_id', 'id');
$this->belongsTo(User::class, 'author_id', 'id');
`.trim() },

    { t: 'h2', text: 'واحد إلى متعدّد' },
    { t: 'code', lang: 'php', code: `
<?php
class Post extends Model
{
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // العكس
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

// الاستخدام
$post->comments;                      // Collection
$post->comments()->count();           // عدّ بلا جلب — أسرع بكثير
$post->comments()->latest()->limit(5)->get();
$post->comments()->create(['body' => 'تعليق', 'user_id' => auth()->id()]);
$post->comments()->createMany([[...], [...]]);
$post->comments()->where('approved', true)->get();
`.trim() },
    { t: 'warn', title: 'فرق حاسم: `$post->comments` مقابل `$post->comments()`', text: 'بلا أقواس تُرجع **Collection** جاهزة (وتُحمَّل من القاعدة أول مرة). بأقواس تُرجع **Query Builder** يمكنك متابعة البناء عليه. استخدام `$post->comments->count()` يجلب كل التعليقات ثم يعدّها في PHP، بينما `$post->comments()->count()` ينفّذ `COUNT(*)` في القاعدة.' },

    { t: 'h2', text: 'متعدّد إلى متعدّد' },
    { t: 'code', lang: 'php', code: `
<?php
// جدول وسيط: post_tag (بالمفرد وبالترتيب الأبجدي)
class Post extends Model
{
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}

class Tag extends Model
{
    public function posts()
    {
        return $this->belongsToMany(Post::class);
    }
}

// تحديد صريح
$this->belongsToMany(Tag::class, 'post_tag', 'post_id', 'tag_id');
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// إدارة الروابط
$post->tags()->attach($tagId);
$post->tags()->attach([1, 2, 3]);
$post->tags()->detach($tagId);
$post->tags()->detach();                     // فكّ الكل
$post->tags()->toggle([1, 2]);               // اربط غير المربوط وافكّ المربوط

// sync — الأهمّ: يجعل الروابط تطابق القائمة تماماً
$post->tags()->sync([1, 2, 3]);              // يحذف ما ليس في القائمة
$post->tags()->syncWithoutDetaching([4]);    // يضيف بلا حذف
`.trim() },
    { t: 'h3', text: 'بيانات إضافية في الجدول الوسيط' },
    { t: 'code', lang: 'php', code: `
<?php
class Order extends Model
{
    public function products()
    {
        return $this->belongsToMany(Product::class)
                    ->withPivot(['quantity', 'unit_price'])
                    ->withTimestamps()
                    ->as('item');            // اسم مخصّص بدل pivot
    }
}

// الاستخدام
foreach ($order->products as $product) {
    echo $product->name;
    echo $product->item->quantity;           // من الجدول الوسيط
    echo $product->item->unit_price;
}

// الربط مع بيانات
$order->products()->attach($productId, [
    'quantity'   => 2,
    'unit_price' => 149.00,
]);

$order->products()->sync([
    1 => ['quantity' => 2, 'unit_price' => 149.00],
    5 => ['quantity' => 1, 'unit_price' => 89.50],
]);

// تحديث بيانات الوسيط
$order->products()->updateExistingPivot($productId, ['quantity' => 3]);

// الترشيح بالوسيط
$order->products()->wherePivot('quantity', '>', 1)->get();
`.trim() },
    { t: 'tip', text: 'حين يحمل الجدول الوسيط بيانات كثيرة ومنطقاً خاصاً (مثل `order_items`)، اجعله **نموذجاً مستقلاً** بدل الاعتماد على `belongsToMany`. أوضح وأسهل في الاختبار والتوسّع.' },

    { t: 'h2', text: 'مشكلة N+1' },
    { t: 'danger', title: 'أشهر مشكلة أداء في تطبيقات Laravel', text: 'عرض 50 مقالاً واسم كاتب كل منها بلا تحميل مسبق ينفّذ **51 استعلاماً**: واحد للمقالات و50 للكتّاب. على صفحة بها علاقتان يصبح العدد أسوأ بكثير.' },
    { t: 'compare', lang: 'php', bad: {
      code: `$posts = Post::latest()->limit(50)->get();

foreach ($posts as $post) {
    echo $post->author->name;        // استعلام لكل مقال!
    echo $post->category->name;      // واستعلام آخر!
}
// المجموع: 1 + 50 + 50 = 101 استعلام`,
      why: 'كل وصول لعلاقة غير محمّلة ينفّذ استعلاماً جديداً. الصفحة تبطؤ خطّياً مع عدد السجلّات.'
    }, good: {
      code: `$posts = Post::with(['author', 'category'])
    ->latest()
    ->limit(50)
    ->get();

foreach ($posts as $post) {
    echo $post->author->name;        // من الذاكرة
    echo $post->category->name;      // من الذاكرة
}
// المجموع: 3 استعلامات فقط — مهما كان عدد المقالات`,
      why: 'التحميل المسبق يجلب كل الكتّاب في استعلام واحد بـ `WHERE id IN (...)` ثم يربطهم بالمقالات في الذاكرة.'
    }},
    { t: 'code', lang: 'php', code: `
<?php
// التحميل المسبق
Post::with('author')->get();
Post::with(['author', 'category', 'tags'])->get();
Post::with('comments.author')->get();              // متداخل
Post::with('author:id,name,avatar')->get();        // أعمدة محدّدة — أخفّ

// مع شروط
Post::with(['comments' => fn ($q) => $q->where('approved', true)->latest()->limit(5)])->get();

// تحميل كسول بعد الجلب
$posts->load('author');
$posts->loadMissing('category');                   // فقط إن لم تكن محمّلة

// دائماً محمّلة — استخدمها بحذر
class Post extends Model
{
    protected $with = ['author'];
}
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// app/Providers/AppServiceProvider.php — امنع N+1 في التطوير
public function boot(): void
{
    // يرمي استثناءً عند أي تحميل كسول — في التطوير فقط
    Model::preventLazyLoading(! app()->isProduction());

    // ويحذّر من الحقول غير الموجودة والإسناد الصامت
    Model::preventSilentlyDiscardingAttributes(! app()->isProduction());
}
`.trim() },
    { t: 'tip', text: 'فعّل `preventLazyLoading` في التطوير: يحوّل كل N+1 إلى استثناء واضح فور حدوثه بدل أن يمرّ صامتاً حتى يبطئ الإنتاج. أضف `barryvdh/laravel-debugbar` لترى عدد الاستعلامات لكل صفحة.' },

    { t: 'h2', text: 'العدّ والتجميع' },
    { t: 'code', lang: 'php', code: `
<?php
// عدّ بلا جلب — استعلام فرعي واحد
Post::withCount('comments')->get();
$post->comments_count;

Post::withCount(['comments', 'tags', 'likes'])->get();

// عدّ بشرط + اسم مخصّص
Post::withCount([
    'comments',
    'comments as approved_count'  => fn ($q) => $q->where('approved', true),
    'comments as pending_count'   => fn ($q) => $q->where('approved', false),
])->get();

$post->approved_count;

// تجميعات أخرى
Post::withSum('orderItems', 'line_total')->get();
$post->order_items_sum_line_total;

Post::withAvg('reviews', 'rating')->get();
Post::withMax('comments', 'created_at')->get();
Post::withExists('likes')->get();

// عدّ بعد الجلب
$posts->loadCount('comments');
`.trim() },
    { t: 'compare', lang: 'blade', bad: {
      code: `@foreach ($posts as $post)
    <span>{{ $post->comments->count() }} تعليقاً</span>
@endforeach`,
      why: 'يجلب **كل** تعليقات كل مقال من القاعدة ليعدّها في PHP. على 50 مقالاً بـ 100 تعليق لكلٍّ، يحمّل 5000 صفّ لعرض أرقام فقط.'
    }, good: {
      code: `{{-- المتحكّم --}}
$posts = Post::withCount('comments')->get();

{{-- العرض --}}
@foreach ($posts as $post)
    <span>{{ $post->comments_count }} تعليقاً</span>
@endforeach`,
      why: 'استعلام فرعي واحد يُرجع الأرقام فقط. لا تُحمَّل أي تعليقات في الذاكرة.'
    }},

    { t: 'h2', text: 'الاستعلام عبر العلاقات' },
    { t: 'code', lang: 'php', code: `
<?php
// له علاقات؟
Post::has('comments')->get();                      // له تعليق واحد على الأقل
Post::has('comments', '>=', 5)->get();
Post::doesntHave('comments')->get();
Post::has('comments.replies')->get();              // متداخل

// بشرط على العلاقة
Post::whereHas('comments', fn ($q) => $q->where('approved', true))->get();
Post::whereHas('comments', fn ($q) => $q->where('created_at', '>', now()->subWeek()), '>=', 3)->get();
Post::whereDoesntHave('comments', fn ($q) => $q->where('spam', true))->get();

// اختصار لشرط واحد
Post::whereRelation('author', 'role', 'admin')->get();
Post::whereRelation('tags', 'slug', 'laravel')->get();

// belongsTo محدّد
Post::whereBelongsTo($user)->get();
Post::whereBelongsTo($user, 'author')->get();

// مثال واقعي مركّب
$posts = Post::query()
    ->published()
    ->with(['author:id,name', 'tags:id,name'])
    ->withCount('comments')
    ->whereHas('author', fn ($q) => $q->where('is_verified', true))
    ->whereRelation('category', 'slug', $request->category)
    ->having('comments_count', '>', 3)
    ->latest()
    ->paginate(12);
`.trim() },
    { t: 'warn', title: '`whereHas` قد يكون بطيئاً', text: 'يُترجَم إلى استعلام فرعي `EXISTS`. على الجداول الضخمة بلا فهارس مناسبة يصبح ثقيلاً. تأكّد من فهرسة المفتاح الأجنبي، وفكّر في `join` صريح أو عمود مُخزَّن (denormalized) للحالات الحرجة.' },

    { t: 'h2', text: 'العلاقات متعدّدة الأشكال' },
    { t: 'p', text: 'حين يرتبط نموذج واحد بعدة نماذج مختلفة: تعليق على مقال أو فيديو أو منتج، وصورة لأي شيء.' },
    { t: 'code', lang: 'php', code: `
<?php
// الهجرة
Schema::create('comments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained();
    $table->morphs('commentable');       // commentable_id + commentable_type + فهرس
    $table->text('body');
    $table->timestamps();
});
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
class Comment extends Model
{
    public function commentable()
    {
        return $this->morphTo();
    }
}

class Post extends Model
{
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

class Video extends Model
{
    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

// الاستخدام
$post->comments()->create(['body' => 'تعليق', 'user_id' => auth()->id()]);
$video->comments;

$comment->commentable;                   // Post أو Video حسب النوع
$comment->commentable_type;              // "App\\Models\\Post"

// الترشيح بالنوع
Comment::whereHasMorph('commentable', [Post::class], fn ($q) => $q->published())->get();
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// خريطة أسماء — لا تخزّن أسماء الأصناف الكاملة في القاعدة
// app/Providers/AppServiceProvider.php
use Illuminate\\Database\\Eloquent\\Relations\\Relation;

Relation::enforceMorphMap([
    'post'    => Post::class,
    'video'   => Video::class,
    'product' => Product::class,
]);
`.trim() },
    { t: 'tip', text: 'استخدم `enforceMorphMap` دائماً: يخزّن `"post"` بدل `"App\\Models\\Post"` في القاعدة، فتستطيع نقل الصنف أو إعادة تسميته لاحقاً دون تحديث ملايين الصفوف.' },
    { t: 'h3', text: 'متعدّد لمتعدّد متعدّد الأشكال' },
    { t: 'code', lang: 'php', code: `
<?php
// جدول taggables: tag_id + taggable_id + taggable_type
class Post extends Model
{
    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}

class Tag extends Model
{
    public function posts()   { return $this->morphedByMany(Post::class, 'taggable'); }
    public function videos()  { return $this->morphedByMany(Video::class, 'taggable'); }
}
`.trim() },

    { t: 'h2', text: 'علاقات متقدّمة' },
    { t: 'code', lang: 'php', code: `
<?php
// hasManyThrough — الوصول عبر وسيط
class Country extends Model
{
    // دول → مستخدمون → مقالات
    public function posts()
    {
        return $this->hasManyThrough(Post::class, User::class);
    }
}

$country->posts;                          // كل مقالات مستخدمي هذه الدولة

// hasOneThrough
class Supplier extends Model
{
    public function accountHistory()
    {
        return $this->hasOneThrough(AccountHistory::class, Account::class);
    }
}

// أحدث/أقدم واحد من متعدّد
class User extends Model
{
    public function latestPost()
    {
        return $this->hasOne(Post::class)->latestOfMany();
    }

    public function firstPost()
    {
        return $this->hasOne(Post::class)->oldestOfMany();
    }

    public function bestPost()
    {
        return $this->hasOne(Post::class)->ofMany('views_count', 'max');
    }
}

User::with('latestPost')->get();          // بلا N+1

// علاقة عبر عمود مُخزَّن
class Post extends Model
{
    public function author()
    {
        return $this->belongsTo(User::class)->withDefault([
            'name' => 'كاتب محذوف',       // بدل null
        ]);
    }
}
`.trim() },
    { t: 'note', text: '`withDefault()` يحلّ مشكلة شائعة: `$post->author->name` ينهار بخطأ إن حُذف الكاتب. مع القيمة الافتراضية تحصل على نموذج فارغ بقيم معقولة بدل `null`.' },

    { t: 'h2', text: 'الحفظ عبر العلاقات' },
    { t: 'code', lang: 'php', code: `
<?php
// hasMany — يضبط المفتاح الأجنبي تلقائياً
$post->comments()->create(['body' => 'تعليق', 'user_id' => 1]);
$post->comments()->save(new Comment(['body' => 'تعليق']));
$post->comments()->saveMany([$c1, $c2]);

// belongsTo
$post->author()->associate($user);
$post->save();

$post->author()->dissociate();
$post->save();

// belongsToMany
$post->tags()->attach([1, 2]);
$post->tags()->sync([1, 2, 3]);

// إنشاء مع علاقات في معاملة
DB::transaction(function () use ($request, $user) {
    $post = $user->posts()->create($request->validated());

    $post->tags()->sync($request->tag_ids);

    if ($request->hasFile('cover')) {
        $post->image()->create([
            'path' => $request->file('cover')->store('covers', 'public'),
        ]);
    }

    return $post;
});
`.trim() },
    { t: 'tip', text: 'لفّ العمليات التي تكتب في عدة جداول بـ `DB::transaction`. بدونها قد يُنشَأ المقال ثم يفشل حفظ الوسوم، فتبقى بيانات ناقصة في القاعدة.' },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'شبكة علاقات متجر كاملة',
      brief: 'اربط نماذج متجر إلكتروني بكل أنواع العلاقات، مع استعلامات محسّنة بلا N+1.',
      requirements: [
        '`User`: عناوين (hasMany)، طلبات (hasMany)، مراجعات (hasMany)، منتجات مُراجَعة (hasManyThrough)، آخر طلب (`latestOfMany`).',
        '`Category`: أب وأبناء (شجرة ذاتية)، منتجات (hasMany)، وكل منتجات الأبناء (hasManyThrough أو دالة تعاودية).',
        '`Product`: تصنيف (belongsTo)، صور (morphMany)، مراجعات (hasMany)، وسوم (morphToMany)، عناصر طلبات (hasMany)، المشترون (belongsToMany عبر order_items).',
        '`Order`: مستخدم (belongsTo)، عناصر (hasMany)، منتجات (belongsToMany مع بيانات وسيط)، كوبون (belongsTo مع `withDefault`).',
        '`Review`: مستخدم ومنتج وطلب (belongsTo)، مع نطاق `approved` و `verified`.',
        'صور متعدّدة الأشكال تخدم المنتجات والتصنيفات والمستخدمين.',
        'استخدم `enforceMorphMap` لتجنّب تخزين أسماء الأصناف الكاملة.',
        'اكتب متحكّم صفحة المنتج يحمّل كل ما تحتاجه الصفحة **بلا أي N+1** — اذكر عدد الاستعلامات في تعليق.',
        'اكتب متحكّم "طلباتي" يعرض الطلبات مع عناصرها وصور منتجاتها بأقلّ عدد استعلامات.',
        'اكتب استعلام لوحة إدارة: أكثر 10 منتجات مبيعاً مع تصنيفها ومتوسّط تقييمها وعدد مراجعاتها في استعلام واحد.',
        'اكتب استعلاماً يجد العملاء الذين اشتروا من تصنيف معيّن ولم يراجعوا أي منتج.',
        'فعّل `preventLazyLoading` واذكر في تعليق كيف تتحقّق من خلوّ الصفحات من N+1.'
      ],
      hints: [
        '`belongsToMany(Product::class, \'order_items\')->withPivot([...])` للعلاقة عبر جدول عناصر الطلب.',
        '`withCount` و `withAvg` ينفّذان استعلامات فرعية لا تحمّل السجلّات.',
        '`whereDoesntHave` للعملاء بلا مراجعات.',
        '`children()->with(\'children\')` للشجرة، أو استخدم gem مثل `nested set`.'
      ],
      solution: { lang: 'php', code: `
<?php
// ═══════════════════════════════════════════════
// app/Providers/AppServiceProvider.php
// ═══════════════════════════════════════════════
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\Relation;

public function boot(): void
{
    // أسماء مختصرة في القاعدة بدل App\\Models\\Product
    Relation::enforceMorphMap([
        'product'  => \\App\\Models\\Product::class,
        'category' => \\App\\Models\\Category::class,
        'user'     => \\App\\Models\\User::class,
        'review'   => \\App\\Models\\Review::class,
    ]);

    // في التطوير: أي تحميل كسول يرمي استثناءً فوراً
    // للتحقّق: تصفّح كل صفحة في التطوير — أي N+1 سيوقف الصفحة بخطأ واضح،
    // وDebugbar يعرض عدد الاستعلامات في أسفل الشاشة.
    Model::preventLazyLoading(! app()->isProduction());
    Model::preventSilentlyDiscardingAttributes(! app()->isProduction());
}

// ═══════════════════════════════════════════════
// app/Models/User.php
// ═══════════════════════════════════════════════
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Relations\\{HasMany, HasOne, HasManyThrough, MorphOne};

class User extends Authenticatable
{
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    public function defaultAddress(): HasOne
    {
        return $this->hasOne(Address::class)->where('is_default', true);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function latestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->latestOfMany();
    }

    public function biggestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->ofMany('grand_total', 'max');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /** المنتجات التي راجعها هذا المستخدم */
    public function reviewedProducts(): HasManyThrough
    {
        return $this->hasManyThrough(
            Product::class, Review::class,
            'user_id', 'id', 'id', 'product_id'
        );
    }

    public function avatar(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}

// ═══════════════════════════════════════════════
// app/Models/Category.php
// ═══════════════════════════════════════════════
use Illuminate\\Database\\Eloquent\\Relations\\{BelongsTo, HasMany, MorphOne};

class Category extends Model
{
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id')
                    ->withDefault(['name' => 'الرئيسية']);
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    /** الشجرة كاملة بمستويين — بلا N+1 */
    public function descendants(): HasMany
    {
        return $this->children()->with('children.children');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    /** كل معرّفات هذا التصنيف وأبنائه — لاستعلام منتجات الشجرة */
    public function descendantIds(): array
    {
        return collect([$this->id])
            ->merge($this->descendants->flatMap(
                fn (self $child) => $child->descendantIds()
            ))
            ->unique()
            ->all();
    }
}

// ═══════════════════════════════════════════════
// app/Models/Product.php
// ═══════════════════════════════════════════════
use Illuminate\\Database\\Eloquent\\Relations\\{BelongsTo, BelongsToMany, HasMany, MorphMany, MorphToMany};

class Product extends Model
{
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class)
                    ->withDefault(['name' => 'غير مصنّف']);
    }

    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable')->orderBy('sort_order');
    }

    public function primaryImage(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable')
                    ->where('is_primary', true)
                    ->withDefault(['path' => 'images/placeholder.png']);
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('is_approved', true)->latest();
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /** من اشترى هذا المنتج */
    public function buyers(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'order_items')
                    ->withPivot(['quantity', 'unit_price', 'line_total'])
                    ->withTimestamps();
    }
}

// ═══════════════════════════════════════════════
// app/Models/Order.php
// ═══════════════════════════════════════════════
class Order extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)
                    ->withDefault(['name' => 'عميل محذوف']);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class)
                    ->withDefault(['code' => 'لا يوجد', 'value' => 0]);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'order_items')
                    ->withPivot(['product_name', 'unit_price', 'quantity', 'line_total'])
                    ->as('line')
                    ->withTimestamps();
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}

// ═══════════════════════════════════════════════
// app/Models/Image.php — متعدّد الأشكال
// ═══════════════════════════════════════════════
use Illuminate\\Database\\Eloquent\\Relations\\MorphTo;

class Image extends Model
{
    protected $fillable = ['path', 'alt', 'sort_order', 'is_primary'];

    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }
}

// ═══════════════════════════════════════════════
// app/Http/Controllers/ProductController.php
// ═══════════════════════════════════════════════
namespace App\\Http\\Controllers;

use App\\Models\\{Product, Category};
use Illuminate\\View\\View;

class ProductController extends Controller
{
    /**
     * صفحة المنتج — 7 استعلامات ثابتة مهما كان حجم البيانات:
     *  1. المنتج نفسه (مع الاستعلامات الفرعية للعدّ والمتوسّط)
     *  2. التصنيف        3. الصور
     *  4. الوسوم         5. المراجعات المعتمدة
     *  6. أصحاب المراجعات وصورهم
     *  7. المنتجات المشابهة (مع صورها في استعلام إضافي واحد)
     */
    public function show(Product $product): View
    {
        $product->load([
            'category:id,name,slug,parent_id',
            'category.parent:id,name,slug',
            'images',
            'tags:id,name,slug',
            'approvedReviews' => fn ($q) => $q->limit(10),
            'approvedReviews.user:id,name',
            'approvedReviews.user.avatar',
        ])->loadCount([
            'reviews as reviews_count' => fn ($q) => $q->where('is_approved', true),
            'orderItems as purchases_count',
        ])->loadAvg(
            ['reviews as rating_average' => fn ($q) => $q->where('is_approved', true)],
            'rating'
        );

        $related = Product::query()
            ->active()
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->getKey())
            ->with('primaryImage')
            ->withAvg('reviews as rating_average', 'rating')
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return view('products.show', compact('product', 'related'));
    }

    /** صفحة التصنيف — تشمل منتجات كل الأبناء */
    public function category(Category $category): View
    {
        $category->load('descendants');

        $products = Product::query()
            ->active()
            ->whereIn('category_id', $category->descendantIds())
            ->with(['primaryImage', 'category:id,name,slug'])
            ->withCount('reviews')
            ->withAvg('reviews as rating_average', 'rating')
            ->latest()
            ->paginate(24);

        return view('categories.show', compact('category', 'products'));
    }
}

// ═══════════════════════════════════════════════
// app/Http/Controllers/OrderController.php
// ═══════════════════════════════════════════════
class OrderController extends Controller
{
    /**
     * "طلباتي" — 4 استعلامات ثابتة:
     *  1. الطلبات  2. عناصرها  3. منتجاتها  4. صور المنتجات
     */
    public function index(Request $request): View
    {
        $orders = $request->user()
            ->orders()
            ->with([
                'items:id,order_id,product_id,product_name,unit_price,quantity,line_total',
                'items.product:id,name,slug',
                'items.product.primaryImage',
                'coupon:id,code',
            ])
            ->withCount('items')
            ->latest()
            ->paginate(10);

        return view('orders.index', compact('orders'));
    }
}

// ═══════════════════════════════════════════════
// app/Http/Controllers/Admin/ReportController.php
// ═══════════════════════════════════════════════
namespace App\\Http\\Controllers\\Admin;

use App\\Models\\{Product, User, Category};
use Illuminate\\Support\\Facades\\DB;

class ReportController extends Controller
{
    /** أكثر 10 منتجات مبيعاً — استعلام واحد مع كل الإحصاءات */
    public function bestSellers()
    {
        return Product::query()
            ->select('products.*')
            ->with('category:id,name')
            ->withCount([
                'reviews as reviews_count' => fn ($q) => $q->where('is_approved', true),
            ])
            ->withAvg(
                ['reviews as rating_average' => fn ($q) => $q->where('is_approved', true)],
                'rating'
            )
            ->withSum('orderItems as units_sold', 'quantity')
            ->withSum('orderItems as revenue', 'line_total')
            ->having('units_sold', '>', 0)
            ->orderByDesc('units_sold')
            ->limit(10)
            ->get();
    }

    /** عملاء اشتروا من تصنيف معيّن ولم يراجعوا أي منتج */
    public function silentBuyers(Category $category)
    {
        $categoryIds = $category->descendantIds();

        return User::query()
            ->whereHas('orders.items.product', fn ($q) =>
                $q->whereIn('category_id', $categoryIds)
            )
            ->whereDoesntHave('reviews')
            ->withCount('orders')
            ->withSum('orders as total_spent', 'grand_total')
            ->with('latestOrder:id,user_id,number,grand_total,created_at')
            ->orderByDesc('total_spent')
            ->limit(50)
            ->get();
    }

    /** ملخّص المبيعات حسب التصنيف */
    public function salesByCategory()
    {
        return Category::query()
            ->whereNull('parent_id')
            ->withCount('products')
            ->withSum(
                ['products as revenue' => fn ($q) =>
                    $q->join('order_items', 'order_items.product_id', '=', 'products.id')
                ],
                'order_items.line_total'
            )
            ->orderByDesc('revenue')
            ->get();
    }
}
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'في أي نموذج تضع `belongsTo`؟', options: ['في الأب', 'في النموذج الذي جدوله يحمل المفتاح الأجنبي', 'في كليهما', 'حسب التسمية'], answer: 1,
        explain: '`comments.post_id` موجود في جدول التعليقات، فـ `belongsTo(Post::class)` في نموذج `Comment`.' },
      { q: 'ما الفرق بين `$post->comments` و `$post->comments()`؟', options: ['لا فرق', 'الأولى تُرجع Collection محمّلة، والثانية Query Builder يمكن متابعة البناء عليه', 'الثانية أبطأ', 'الأولى للعدّ'], answer: 1,
        explain: '`$post->comments->count()` يجلب كل التعليقات، و`$post->comments()->count()` ينفّذ COUNT في القاعدة.' },
      { q: 'كيف تحلّ مشكلة N+1؟', options: ['بالفهارس', 'بالتحميل المسبق `with([...])` الذي يجلب العلاقات في استعلام واحد', 'بالتخزين المؤقّت', 'بـ chunk'], answer: 1,
        explain: 'وفعّل `Model::preventLazyLoading()` في التطوير ليتحوّل كل N+1 لاستثناء فوري.' },
      { q: 'متى تستخدم `withCount` بدل `->count()` على العلاقة؟', options: ['دائماً', 'حين تعرض العدّ لعدة سجلّات — ينفّذ استعلاماً فرعياً بدل جلب كل العلاقات', 'مع البحث', 'أبداً'], answer: 1,
        explain: 'عرض عدد التعليقات لـ 50 مقالاً بـ `comments->count()` يحمّل آلاف الصفوف لعرض أرقام فقط.' },
      { q: 'ما الفرق بين `attach` و `sync`؟', options: ['لا فرق', '`attach` يضيف، و`sync` يجعل الروابط تطابق القائمة تماماً فيحذف ما ليس فيها', 'العكس', 'sync أسرع'], answer: 1,
        explain: 'استخدم `sync` مع نماذج التعديل، و`attach` للإضافة التراكمية.' },
      { q: 'لماذا نستخدم `enforceMorphMap`؟', options: ['للأداء', 'ليُخزَّن اسم مختصر بدل مسار الصنف الكامل، فيمكن نقل الصنف لاحقاً بلا تحديث ملايين الصفوف', 'إلزامي', 'للأمان'], answer: 1,
        explain: 'بدونه يُخزَّن `App\\Models\\Post` نصّاً، وإعادة تنظيم المجلّدات تكسر كل السجلّات.' },
      { q: 'ما فائدة `withDefault()` على `belongsTo`؟', options: ['قيمة افتراضية للعمود', 'يُرجع نموذجاً فارغاً بقيم معقولة بدل null فلا ينهار `$post->author->name`', 'ينشئ سجلاً', 'يخزّن مؤقّتاً'], answer: 1,
        explain: 'يحلّ مشكلة شائعة حين يُحذف السجلّ المرتبط أو يكون المفتاح الأجنبي `null`.' }
    ]}
  ]
};
