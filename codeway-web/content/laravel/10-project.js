'use strict';

module.exports = {
  slug: '10-project',
  title: 'مشروع متكامل: منصّة مدوّنة',
  summary: 'بناء منصّة مدوّنة كاملة من الصفر حتى النشر: نمذجة، مصادقة، صلاحيات، بحث، لوحة إدارة، اختبارات، ونشر.',
  duration: 120,
  level: 'احترافي',
  tags: ['مشروع', 'Full Stack', 'نشر'],
  objectives: [
    'تخطّط مشروعاً كاملاً وتصمّم مخطّط بياناته.',
    'تنظّم الشيفرة بكائنات خدمة وأصناف طلب وسياسات.',
    'تبني واجهة عربية كاملة بمكوّنات Blade.',
    'تضيف بحثاً وترشيحاً وترقيماً وتحسينات أداء.',
    'تكتب مجموعة اختبارات تغطّي المسارات الحرجة.',
    'تنشر المشروع على خادم إنتاج بإعدادات صحيحة.'
  ],
  quickRef: [
    { code: 'Service Objects', desc: 'منطق العمل' },
    { code: 'Form Requests', desc: 'التحقّق' },
    { code: 'Policies', desc: 'الصلاحيات' },
    { code: 'Observers', desc: 'الأحداث' },
    { code: 'Jobs', desc: 'مهام خلفية' },
    { code: 'Blade Components', desc: 'الواجهة' },
    { code: 'Pest / PHPUnit', desc: 'الاختبارات' },
    { code: 'php artisan optimize', desc: 'تحسين الإنتاج' }
  ],
  blocks: [
    { t: 'h2', text: 'نظرة عامة' },
    { t: 'p', text: 'سنبني **CodeWay Blog**: منصّة مدوّنة عربية متعدّدة الكتّاب بأدوار وصلاحيات، تعليقات، وسوم، بحث، إحصاءات، ولوحة إدارة. المشروع يجمع كل ما تعلّمته في المسار.' },
    { t: 'features', items: [
      { icon: 'users', title: 'مستخدمون وأدوار', text: 'قارئ، كاتب، محرّر، مشرف — لكلٍّ صلاحياته الدقيقة.' },
      { icon: 'file-text', title: 'مقالات كاملة', text: 'مسوّدات، جدولة، وسوم، صور غلاف، مقتطفات، إحصاءات قراءة.' },
      { icon: 'message', title: 'تفاعل', text: 'تعليقات متداخلة، إعجابات، حفظ للقراءة لاحقاً.' },
      { icon: 'search', title: 'بحث وترشيح', text: 'بحث نصّي، ترشيح بالوسم والكاتب والتاريخ، وترتيب متعدّد.' },
      { icon: 'chart', title: 'لوحة إدارة', text: 'إحصاءات، إدارة المستخدمين، مراجعة المحتوى المبلّغ عنه.' },
      { icon: 'shield', title: 'أمان', text: 'صلاحيات، تحديد معدّل، حماية من الثغرات الشائعة.' }
    ]},

    { t: 'h2', text: 'المرحلة 1 — التخطيط والإعداد' },
    { t: 'code', lang: 'bash', code: `
laravel new codeway-blog --database=mysql
cd codeway-blog

composer require laravel/breeze --dev
php artisan breeze:install blade --dark
composer require intervention/image spatie/laravel-sluggable

composer require --dev pestphp/pest pestphp/pest-plugin-laravel larastan/larastan barryvdh/laravel-debugbar
php artisan pest:install

php artisan storage:link
php artisan migrate
`.trim() },
    { t: 'h3', text: 'مخطّط البيانات' },
    { t: 'demo', title: 'العلاقات بين الجداول', height: 420,
      css: 'body{font-family:system-ui;margin:0;padding:14px;background:#fff;font-size:.82em}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.t{border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}.h{background:#ff2d20;color:#fff;padding:6px 10px;font-weight:700;font-size:.9em}.f{padding:5px 10px;border-bottom:1px solid #f1f5f9;font-size:.85em}.f:last-child{border-bottom:0}.pk{color:#6366f1;font-weight:700}.fk{color:#d97706;font-weight:700}.rel{margin-top:12px;padding:10px;background:#f8fafc;border-radius:8px;font-size:.82em;line-height:1.8;border:1px solid #e2e8f0}',
      html: '<div class="grid"><div class="t"><div class="h">users</div><div class="f"><span class="pk">id</span></div><div class="f">name, email</div><div class="f">password</div><div class="f">role, bio</div><div class="f">avatar_path</div></div><div class="t"><div class="h">posts</div><div class="f"><span class="pk">id</span></div><div class="f"><span class="fk">user_id</span></div><div class="f"><span class="fk">category_id</span></div><div class="f">title, slug, body</div><div class="f">status, published_at</div><div class="f">views_count</div></div><div class="t"><div class="h">comments</div><div class="f"><span class="pk">id</span></div><div class="f"><span class="fk">user_id</span></div><div class="f"><span class="fk">post_id</span></div><div class="f"><span class="fk">parent_id</span></div><div class="f">body, is_approved</div></div><div class="t"><div class="h">tags</div><div class="f"><span class="pk">id</span></div><div class="f">name, slug</div><div class="f">posts_count</div></div><div class="t"><div class="h">post_tag</div><div class="f"><span class="fk">post_id</span></div><div class="f"><span class="fk">tag_id</span></div></div><div class="t"><div class="h">likes</div><div class="f"><span class="fk">user_id</span></div><div class="f"><span class="fk">post_id</span></div></div></div><div class="rel"><b>العلاقات:</b><br>مستخدم <b>1—∞</b> مقالات &nbsp;·&nbsp; مستخدم <b>1—∞</b> تعليقات<br>مقال <b>1—∞</b> تعليقات &nbsp;·&nbsp; تعليق <b>1—∞</b> ردود (ذاتية)<br>مقال <b>∞—∞</b> وسوم (عبر post_tag)<br>مستخدم <b>∞—∞</b> مقالات معجب بها (عبر likes)</div>' },

    { t: 'h2', text: 'المرحلة 2 — النماذج والهجرات' },
    { t: 'code', lang: 'php', code: `
<?php
// database/migrations/..._create_posts_table.php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();

    $table->string('title', 160);
    $table->string('slug')->unique();
    $table->string('excerpt', 300)->nullable();
    $table->longText('body');
    $table->string('cover_path')->nullable();

    $table->enum('status', ['draft', 'scheduled', 'published', 'archived'])->default('draft');
    $table->timestamp('published_at')->nullable();
    $table->unsignedInteger('views_count')->default(0);
    $table->unsignedInteger('likes_count')->default(0);
    $table->unsignedInteger('comments_count')->default(0);
    $table->unsignedSmallInteger('reading_minutes')->default(1);
    $table->boolean('is_featured')->default(false);
    $table->boolean('allow_comments')->default(true);

    $table->timestamps();
    $table->softDeletes();

    $table->index(['status', 'published_at']);
    $table->index(['user_id', 'status']);
    $table->index('is_featured');
    $table->fullText(['title', 'excerpt', 'body']);
});
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// app/Models/Post.php
namespace App\\Models;

use App\\Enums\\PostStatus;
use Illuminate\\Database\\Eloquent\\{Builder, Model, SoftDeletes};
use Illuminate\\Database\\Eloquent\\Casts\\Attribute;
use Illuminate\\Support\\Str;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id', 'title', 'slug', 'excerpt', 'body',
        'cover_path', 'status', 'published_at', 'allow_comments',
    ];

    protected function casts(): array
    {
        return [
            'status'         => PostStatus::class,
            'published_at'   => 'datetime',
            'is_featured'    => 'boolean',
            'allow_comments' => 'boolean',
        ];
    }

    /* ── العلاقات ── */
    public function author()   { return $this->belongsTo(User::class, 'user_id')->withDefault(['name' => 'كاتب محذوف']); }
    public function category() { return $this->belongsTo(Category::class)->withDefault(['name' => 'عام']); }
    public function tags()     { return $this->belongsToMany(Tag::class); }
    public function comments() { return $this->hasMany(Comment::class)->whereNull('parent_id'); }
    public function allComments() { return $this->hasMany(Comment::class); }
    public function likers()   { return $this->belongsToMany(User::class, 'likes')->withTimestamps(); }

    /* ── النطاقات ── */
    public function scopePublished(Builder $q): void
    {
        $q->where('status', PostStatus::Published)
          ->where('published_at', '<=', now());
    }

    public function scopeDrafts(Builder $q): void   { $q->where('status', PostStatus::Draft); }
    public function scopeFeatured(Builder $q): void { $q->where('is_featured', true)->published(); }

    public function scopeFilter(Builder $q, array $f): void
    {
        $q->when($f['q'] ?? null, fn ($q, $t) =>
                $q->whereFullText(['title', 'excerpt', 'body'], $t))
          ->when($f['tag'] ?? null, fn ($q, $slug) =>
                $q->whereRelation('tags', 'slug', $slug))
          ->when($f['category'] ?? null, fn ($q, $slug) =>
                $q->whereRelation('category', 'slug', $slug))
          ->when($f['author'] ?? null, fn ($q, $id) => $q->where('user_id', $id))
          ->when($f['from'] ?? null, fn ($q, $d) => $q->whereDate('published_at', '>=', $d))
          ->when($f['to'] ?? null,   fn ($q, $d) => $q->whereDate('published_at', '<=', $d))
          ->when($f['sort'] ?? null, fn ($q, $s) => match ($s) {
                'oldest'   => $q->oldest('published_at'),
                'popular'  => $q->orderByDesc('views_count'),
                'liked'    => $q->orderByDesc('likes_count'),
                'discussed'=> $q->orderByDesc('comments_count'),
                default    => $q->latest('published_at'),
          }, fn ($q) => $q->latest('published_at'));
    }

    /* ── الملحقات ── */
    protected function title(): Attribute
    {
        return Attribute::make(
            set: fn (string $v) => [
                'title' => trim($v),
                'slug'  => Str::slug($v) ?: Str::random(8),
            ],
        );
    }

    protected function coverUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->cover_path
                ? asset('storage/' . $this->cover_path)
                : asset('images/default-cover.jpg'),
        )->shouldCache();
    }

    /* ── منطق ── */
    public function isPublished(): bool  { return $this->status === PostStatus::Published; }
    public function isLikedBy(?User $u): bool
    {
        return $u !== null && $this->likers->contains($u);
    }

    public function getRouteKeyName(): string { return 'slug'; }
}
`.trim() },

    { t: 'h2', text: 'المرحلة 3 — كائنات الخدمة' },
    { t: 'p', text: 'المتحكّم ينسّق فقط، والنموذج يمثّل البيانات. منطق العمل المعقّد يذهب لكائن خدمة: قابل للاختبار، ولإعادة الاستخدام من المتحكّم والأمر والمهمّة معاً.' },
    { t: 'code', lang: 'php', code: `
<?php
namespace App\\Services;

use App\\Enums\\PostStatus;
use App\\Models\\{Post, Tag, User};
use Illuminate\\Http\\UploadedFile;
use Illuminate\\Support\\Facades\\{DB, Storage};
use Illuminate\\Support\\Str;

class PostService
{
    public function create(User $author, array $data, ?UploadedFile $cover = null): Post
    {
        return DB::transaction(function () use ($author, $data, $cover) {
            $post = $author->posts()->create([
                ...$data,
                'excerpt'         => $data['excerpt'] ?? $this->makeExcerpt($data['body']),
                'reading_minutes' => $this->readingMinutes($data['body']),
                'published_at'    => $this->resolvePublishedAt($data),
            ]);

            if ($cover) {
                $post->update(['cover_path' => $this->storeCover($cover)]);
            }

            $this->syncTags($post, $data['tags'] ?? []);

            return $post->load(['author', 'tags', 'category']);
        });
    }

    public function update(Post $post, array $data, ?UploadedFile $cover = null): Post
    {
        return DB::transaction(function () use ($post, $data, $cover) {
            $old = $post->cover_path;

            $post->update([
                ...$data,
                'excerpt'         => $data['excerpt'] ?? $this->makeExcerpt($data['body'] ?? $post->body),
                'reading_minutes' => $this->readingMinutes($data['body'] ?? $post->body),
                'published_at'    => $this->resolvePublishedAt($data, $post),
            ]);

            if ($cover) {
                $post->update(['cover_path' => $this->storeCover($cover)]);
                $old && Storage::disk('public')->delete($old);
            }

            if (array_key_exists('tags', $data)) {
                $this->syncTags($post, $data['tags']);
            }

            return $post->fresh(['author', 'tags', 'category']);
        });
    }

    public function delete(Post $post): void
    {
        DB::transaction(function () use ($post) {
            $post->tags()->detach();
            $post->delete();                       // ناعم — الصورة تبقى للاسترجاع
        });
    }

    public function toggleLike(Post $post, User $user): bool
    {
        $result = $post->likers()->toggle($user->id);
        $liked  = filled($result['attached']);

        $post->update(['likes_count' => $post->likers()->count()]);

        return $liked;
    }

    /* ── أدوات خاصة ── */

    private function syncTags(Post $post, array $names): void
    {
        $ids = collect($names)
            ->map(fn ($n) => trim((string) $n))
            ->filter()
            ->unique()
            ->take(5)
            ->map(fn (string $name) => Tag::firstOrCreate(
                ['slug' => Str::slug($name) ?: Str::random(6)],
                ['name' => $name]
            )->id);

        $post->tags()->sync($ids);
    }

    private function storeCover(UploadedFile $file): string
    {
        return $file->store('posts/covers', 'public');
    }

    private function makeExcerpt(string $body): string
    {
        return Str::limit(strip_tags($body), 280);
    }

    private function readingMinutes(string $body): int
    {
        return max(1, (int) ceil(str_word_count(strip_tags($body)) / 200));
    }

    private function resolvePublishedAt(array $data, ?Post $post = null): ?string
    {
        $status = $data['status'] ?? $post?->status?->value;

        return match ($status) {
            PostStatus::Published->value => $data['published_at'] ?? $post?->published_at ?? now(),
            PostStatus::Scheduled->value => $data['published_at'],
            default                      => null,
        };
    }
}
`.trim() },
    { t: 'tip', text: 'القاعدة: **المتحكّم لا يتجاوز 15 سطراً لكل إجراء**. إن تجاوزها، فهناك منطق يستحقّ الانتقال لكائن خدمة.' },

    { t: 'h2', text: 'المرحلة 4 — المتحكّمات' },
    { t: 'code', lang: 'php', code: `
<?php
namespace App\\Http\\Controllers;

use App\\Http\\Requests\\{StorePostRequest, UpdatePostRequest};
use App\\Models\\{Post, Tag, Category};
use App\\Services\\PostService;
use Illuminate\\Http\\{Request, RedirectResponse};
use Illuminate\\View\\View;

class PostController extends Controller
{
    public function __construct(private readonly PostService $posts)
    {
        $this->authorizeResource(Post::class, 'post', [
            'except' => ['index', 'show'],
        ]);
    }

    public function index(Request $request): View
    {
        return view('posts.index', [
            'posts' => Post::query()
                ->published()
                ->with(['author:id,name,avatar_path', 'tags:id,name,slug', 'category:id,name,slug'])
                ->filter($request->only(['q', 'tag', 'category', 'author', 'from', 'to', 'sort']))
                ->paginate(12)
                ->withQueryString(),

            'featured'   => Post::featured()->with('author')->limit(3)->get(),
            'popularTags'=> Tag::withCount('posts')->orderByDesc('posts_count')->limit(15)->get(),
            'categories' => Category::withCount('posts')->orderBy('name')->get(),
            'filters'    => $request->only(['q', 'tag', 'category', 'sort']),
        ]);
    }

    public function show(Request $request, Post $post): View
    {
        abort_unless(
            $post->isPublished() || $request->user()?->can('update', $post),
            404
        );

        $post->increment('views_count');

        $post->load([
            'author', 'category', 'tags',
            'comments' => fn ($q) => $q->approved()->with(['author', 'replies.author'])->latest(),
        ]);

        return view('posts.show', [
            'post'    => $post,
            'liked'   => $post->isLikedBy($request->user()),
            'related' => Post::published()
                ->whereKeyNot($post->id)
                ->whereHas('tags', fn ($q) => $q->whereIn('tags.id', $post->tags->pluck('id')))
                ->with('author:id,name')
                ->limit(3)
                ->get(),
        ]);
    }

    public function create(): View
    {
        return view('posts.create', [
            'post'       => new Post(),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $post = $this->posts->create(
            $request->user(),
            $request->validated(),
            $request->file('cover')
        );

        return to_route('posts.show', $post)
            ->with('success', 'نُشِر المقال بنجاح.');
    }

    public function edit(Post $post): View
    {
        return view('posts.edit', [
            'post'       => $post->load('tags'),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $post = $this->posts->update($post, $request->validated(), $request->file('cover'));

        return to_route('posts.show', $post)->with('success', 'حُدِّث المقال.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $this->posts->delete($post);

        return to_route('posts.index')
            ->with('success', 'حُذِف المقال.')
            ->setStatusCode(303);
    }
}
`.trim() },

    { t: 'h2', text: 'المرحلة 5 — المهام الخلفية والجدولة' },
    { t: 'code', lang: 'php', code: `
<?php
// app/Jobs/PublishScheduledPosts.php
namespace App\\Jobs;

use App\\Enums\\PostStatus;
use App\\Models\\Post;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Queue\\Queueable;

class PublishScheduledPosts implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        Post::where('status', PostStatus::Scheduled)
            ->where('published_at', '<=', now())
            ->chunkById(100, function ($posts) {
                foreach ($posts as $post) {
                    $post->update(['status' => PostStatus::Published]);
                    NotifyFollowers::dispatch($post);
                }
            });
    }
}

// routes/console.php — الجدولة في Laravel 11
use Illuminate\\Support\\Facades\\Schedule;

Schedule::job(new PublishScheduledPosts())->everyFiveMinutes();
Schedule::command('posts:refresh-stats')->hourly();
Schedule::command('model:prune')->daily();
Schedule::command('backup:run')->dailyAt('03:00');

// على الخادم — سطر واحد في crontab
// * * * * * cd /var/www/blog && php artisan schedule:run >> /dev/null 2>&1
`.trim() },
    { t: 'code', lang: 'bash', code: `
# تشغيل العامل
php artisan queue:work --tries=3 --timeout=90

# في الإنتاج مع Supervisor أو Horizon
composer require laravel/horizon
php artisan horizon:install
`.trim() },

    { t: 'h2', text: 'المرحلة 6 — الأداء' },
    { t: 'code', lang: 'php', code: `
<?php
// 1) امنع N+1 في التطوير
Model::preventLazyLoading(! app()->isProduction());

// 2) خزّن الاستعلامات الثقيلة مؤقّتاً
$popularTags = Cache::remember('tags.popular', now()->addHour(), fn () =>
    Tag::withCount('posts')->orderByDesc('posts_count')->limit(15)->get()
);

// 3) امسح الذاكرة عند التغيير — عبر مراقب
class PostObserver
{
    public function saved(Post $post): void  { $this->flush($post); }
    public function deleted(Post $post): void { $this->flush($post); }

    private function flush(Post $post): void
    {
        Cache::forget('posts.featured');
        Cache::forget('tags.popular');
        Cache::forget("post.{$post->slug}");
    }
}

// 4) عدّادات مُخزَّنة بدل COUNT في كل عرض
$post->increment('comments_count');

// 5) أعمدة محدّدة في القوائم
Post::select('id', 'slug', 'title', 'excerpt', 'cover_path', 'user_id', 'published_at')

// 6) صور محسّنة
use Intervention\\Image\\Laravel\\Facades\\Image;

$image = Image::read($file)->scaleDown(width: 1600)->toWebp(85);
Storage::disk('public')->put($path, (string) $image);
`.trim() },
    { t: 'code', lang: 'bash', code: `
# قبل النشر
php artisan optimize          # config + routes + views + events
php artisan view:cache
composer install --optimize-autoloader --no-dev
npm run build

# عند الحاجة للتراجع
php artisan optimize:clear
`.trim() },

    { t: 'h2', text: 'المرحلة 7 — الاختبارات' },
    { t: 'code', lang: 'php', code: `
<?php
// tests/Feature/PostTest.php
use App\\Models\\{User, Post, Tag};
use App\\Enums\\{Role, PostStatus};
use Illuminate\\Http\\UploadedFile;
use Illuminate\\Support\\Facades\\{Storage, DB};

beforeEach(fn () => Storage::fake('public'));

describe('عرض المقالات', function () {
    it('يعرض المنشورة للزائر', function () {
        Post::factory()->count(3)->published()->create();
        Post::factory()->draft()->create();

        $this->get(route('posts.index'))
            ->assertOk()
            ->assertViewHas('posts', fn ($posts) => $posts->count() === 3);
    });

    it('يُرجع 404 لمسوّدة غير مملوكة', function () {
        $draft = Post::factory()->draft()->create();

        $this->get(route('posts.show', $draft))->assertNotFound();
    });

    it('يسمح لصاحب المسوّدة بمعاينتها', function () {
        $author = User::factory()->create(['role' => Role::Author]);
        $draft  = Post::factory()->for($author, 'author')->draft()->create();

        $this->actingAs($author)->get(route('posts.show', $draft))->assertOk();
    });

    it('يزيد عدّاد المشاهدات', function () {
        $post = Post::factory()->published()->create(['views_count' => 0]);

        $this->get(route('posts.show', $post));

        expect($post->fresh()->views_count)->toBe(1);
    });

    it('لا ينفّذ استعلامات زائدة في القائمة', function () {
        Post::factory()->count(12)->published()
            ->hasAttached(Tag::factory()->count(3))
            ->create();

        DB::enableQueryLog();
        $this->get(route('posts.index'))->assertOk();

        expect(count(DB::getQueryLog()))->toBeLessThan(12);
    });
});

describe('إنشاء المقالات', function () {
    it('يمنع الزائر', function () {
        $this->get(route('posts.create'))->assertRedirect(route('login'));
    });

    it('ينشئ مقالاً مع وسوم وصورة', function () {
        $author = User::factory()->create(['role' => Role::Author]);

        $this->actingAs($author)->post(route('posts.store'), [
            'title'  => 'مقال جديد عن Laravel',
            'body'   => str_repeat('محتوى تفصيلي كافٍ للتحقّق. ', 20),
            'status' => PostStatus::Published->value,
            'tags'   => ['laravel', 'php', 'برمجة'],
            'cover'  => UploadedFile::fake()->image('cover.jpg', 1600, 900),
        ])->assertRedirect();

        $post = Post::firstWhere('title', 'مقال جديد عن Laravel');

        expect($post)->not->toBeNull()
            ->and($post->tags)->toHaveCount(3)
            ->and($post->cover_path)->not->toBeNull()
            ->and($post->excerpt)->not->toBeEmpty()
            ->and($post->reading_minutes)->toBeGreaterThan(0);

        Storage::disk('public')->assertExists($post->cover_path);
    });

    it('يرفض البيانات الناقصة', function () {
        $author = User::factory()->create(['role' => Role::Author]);

        $this->actingAs($author)
            ->post(route('posts.store'), ['title' => 'ق'])
            ->assertSessionHasErrors(['title', 'body']);
    });

    it('يحدّ الوسوم بخمسة', function () {
        $author = User::factory()->create(['role' => Role::Author]);

        $this->actingAs($author)->post(route('posts.store'), [
            'title'  => 'عنوان صالح للاختبار',
            'body'   => str_repeat('محتوى. ', 30),
            'status' => 'draft',
            'tags'   => ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        ]);

        expect(Post::first()->tags)->toHaveCount(5);
    });
});

describe('الصلاحيات', function () {
    it('يمنع تعديل مقال الغير', function () {
        $hacker = User::factory()->create(['role' => Role::Author]);
        $post   = Post::factory()->published()->create();

        $this->actingAs($hacker)
            ->put(route('posts.update', $post), ['title' => 'مخترَق'])
            ->assertForbidden();

        expect($post->fresh()->title)->not->toBe('مخترَق');
    });

    it('يسمح للمحرّر بتعديل أي مقال', function () {
        $editor = User::factory()->create(['role' => Role::Editor]);
        $post   = Post::factory()->published()->create();

        $this->actingAs($editor)
            ->put(route('posts.update', $post), [
                'title'  => 'عنوان محدَّث من المحرّر',
                'body'   => str_repeat('محتوى محدَّث. ', 20),
                'status' => 'published',
            ])->assertRedirect();

        expect($post->fresh()->title)->toBe('عنوان محدَّث من المحرّر');
    });
});

describe('الإعجابات', function () {
    it('يبدّل الإعجاب ويحدّث العدّاد', function () {
        $user = User::factory()->create();
        $post = Post::factory()->published()->create(['likes_count' => 0]);

        $this->actingAs($user)->post(route('posts.like', $post));
        expect($post->fresh()->likes_count)->toBe(1);

        $this->actingAs($user)->post(route('posts.like', $post));
        expect($post->fresh()->likes_count)->toBe(0);
    });
});

describe('النشر المجدول', function () {
    it('ينشر المقالات المجدولة عند حلول موعدها', function () {
        $due    = Post::factory()->create([
            'status' => PostStatus::Scheduled, 'published_at' => now()->subMinute(),
        ]);
        $future = Post::factory()->create([
            'status' => PostStatus::Scheduled, 'published_at' => now()->addDay(),
        ]);

        (new App\\Jobs\\PublishScheduledPosts())->handle();

        expect($due->fresh()->status)->toBe(PostStatus::Published)
            ->and($future->fresh()->status)->toBe(PostStatus::Scheduled);
    });
});
`.trim() },
    { t: 'code', lang: 'bash', code: `
php artisan test
php artisan test --filter=PostTest
php artisan test --parallel
php artisan test --coverage --min=80
./vendor/bin/phpstan analyse --level=6
./vendor/bin/pint
`.trim() },

    { t: 'h2', text: 'المرحلة 8 — النشر' },
    { t: 'code', lang: 'bash', code: `
# .env في الإنتاج
APP_ENV=production
APP_DEBUG=false                  # ⚠️ الأهمّ على الإطلاق
APP_URL=https://blog.example.com

DB_CONNECTION=mysql
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
`.trim() },
    { t: 'code', lang: 'bash', code: `
#!/usr/bin/env bash
# deploy.sh
set -euo pipefail

php artisan down --retry=60

git pull origin main
composer install --no-dev --optimize-autoloader --no-interaction
npm ci && npm run build

php artisan migrate --force
php artisan optimize
php artisan queue:restart

php artisan up
echo "✅ تمّ النشر بنجاح"
`.trim() },
    { t: 'steps', items: [
      '**HTTPS إلزامي** — شهادة Let\'s Encrypt مجانية عبر Certbot.',
      '**جذر الويب على `public/` فقط** — لا على مجلّد المشروع.',
      '**صلاحيات**: `storage` و `bootstrap/cache` قابلة للكتابة من مستخدم الخادم فقط.',
      '**نسخ احتياطية يومية** لقاعدة البيانات والملفات المرفوعة — واختبر الاسترجاع فعلياً.',
      '**مراقبة الأخطاء**: Sentry أو Flare للتنبيه الفوري.',
      '**Supervisor أو Horizon** لإبقاء عمّال الطابور يعملون.',
      '**Cron واحد** لـ `schedule:run` كل دقيقة.',
      '**رؤوس الأمان** ومنع فهرسة `storage` من المتصفّح.'
    ]},
    { t: 'table', head: ['خيار الاستضافة', 'المناسب لـ'], rows: [
      ['**Laravel Forge**', 'إدارة خوادم VPS باحتراف — الخيار الأشهر'],
      ['**Laravel Vapor**', 'بلا خادم على AWS — توسّع تلقائي'],
      ['**Laravel Cloud**', 'استضافة رسمية مُدارة بالكامل'],
      ['**Ploi / RunCloud**', 'بدائل Forge بسعر أقلّ'],
      ['**استضافة مشتركة**', 'مشاريع صغيرة — لكن بقيود على Cron والطوابير']
    ]},

    { t: 'h2', text: 'المشروع الكامل' },
    { t: 'exercise',
      title: 'منصّة CodeWay Blog',
      brief: 'ابنِ المنصّة كاملة من الصفر حتى النشر، مطبّقاً كل ما تعلّمته في المسار.',
      requirements: [
        '**النماذج**: `User`, `Post`, `Category`, `Tag`, `Comment`, `Like`, `Report` — بالعلاقات والفهارس الصحيحة.',
        '**الأدوار**: قارئ، كاتب، محرّر، مشرف — عبر Enum مع صلاحيات وسياسات دقيقة.',
        '**المصادقة**: Breeze مع تحقّق البريد، وتحديد معدّل الدخول، وصفحة ملف شخصي.',
        '**المقالات**: CRUD كامل، مسوّدات، جدولة نشر، صور غلاف محسّنة، وسوم، تصنيفات.',
        '**التعليقات**: متداخلة بمستوى واحد، مع موافقة المحرّر، وحذف ضمن مهلة للمالك.',
        '**التفاعل**: إعجابات، حفظ للقراءة لاحقاً، متابعة كاتب.',
        '**البحث**: نصّي كامل مع ترشيح بالوسم والتصنيف والكاتب والتاريخ، وترتيب متعدّد.',
        '**لوحة الإدارة**: إحصاءات (مستخدمون، مقالات، تعليقات، أكثر الكتّاب نشاطاً)، إدارة المستخدمين والأدوار، مراجعة البلاغات.',
        '**الواجهة**: مكوّنات Blade كاملة، RTL، وضع ليلي، متجاوبة على الجوّال.',
        '**كائنات الخدمة**: `PostService`, `CommentService`, `ImageService`, `SearchService`.',
        '**المهام**: نشر المجدول، إشعار المتابعين، تحديث الإحصاءات، تنظيف المحذوف.',
        '**الأداء**: صفر N+1 (فعّل `preventLazyLoading`)، تخزين مؤقّت للاستعلامات الثقيلة، عدّادات مُخزَّنة، صور WebP.',
        '**الأمان**: معاملات قوية في كل مكان، سياسات على كل عملية، تحديد معدّل، رؤوس أمان، `APP_DEBUG=false`.',
        '**الاختبارات**: تغطية ≥ 80٪ للمسارات الحرجة — إنشاء، صلاحيات، بحث، تفاعل، جدولة.',
        '**النشر**: على خادم حقيقي بـ HTTPS ونسخ احتياطية ومراقبة أخطاء.',
        '**التوثيق**: `README.md` كامل — المتطلّبات، التثبيت، البنية، الأوامر، قرارات التصميم.'
      ],
      hints: [
        'ابنِ المشروع على مراحل: نماذج ← مصادقة ← CRUD ← تفاعل ← بحث ← إدارة ← تحسين ← نشر.',
        'اكتب الاختبار **قبل** أو **مع** كل ميزة لا بعد الانتهاء — أسهل بكثير.',
        'استخدم `php artisan make:model X -a` لتوليد كل ملفات النموذج دفعة واحدة.',
        'راقب Debugbar في كل صفحة: إن تجاوزت الاستعلامات 10 فهناك N+1 غالباً.',
        'التزم بـ Git من اليوم الأول، وافصل كل ميزة في فرع مستقلّ.'
      ],
      solution: { lang: 'text', code: `
═══════════════════════════════════════════════════════
  هيكل المشروع النهائي — CodeWay Blog
═══════════════════════════════════════════════════════

app/
├── Enums/
│   ├── Role.php                 ← reader | author | editor | admin
│   ├── PostStatus.php           ← draft | scheduled | published | archived
│   └── ReportReason.php
│
├── Models/
│   ├── User.php                 ← posts, comments, likes, follows, bookmarks
│   ├── Post.php                 ← author, category, tags, comments, likers
│   ├── Category.php             ← posts, parent, children
│   ├── Tag.php                  ← posts (belongsToMany)
│   ├── Comment.php              ← author, post, parent, replies
│   └── Report.php               ← reporter, reportable (morphTo)
│
├── Policies/
│   ├── PostPolicy.php           ← view, create, update, delete, publish, feature
│   ├── CommentPolicy.php        ← create, update (15 دقيقة), delete, moderate
│   └── UserPolicy.php           ← view, update, changeRole, ban
│
├── Services/
│   ├── PostService.php          ← create, update, delete, toggleLike, schedule
│   ├── CommentService.php       ← create, reply, approve, delete
│   ├── ImageService.php         ← optimize (WebP), resize, thumbnail, delete
│   └── SearchService.php        ← fullText, filters, suggestions
│
├── Http/
│   ├── Controllers/
│   │   ├── PostController.php
│   │   ├── CommentController.php
│   │   ├── LikeController.php
│   │   ├── BookmarkController.php
│   │   ├── TagController.php
│   │   ├── CategoryController.php
│   │   ├── ProfileController.php
│   │   ├── SearchController.php
│   │   └── Admin/
│   │       ├── DashboardController.php
│   │       ├── UserController.php
│   │       ├── PostController.php
│   │       └── ReportController.php
│   │
│   ├── Requests/
│   │   ├── StorePostRequest.php
│   │   ├── UpdatePostRequest.php
│   │   ├── StoreCommentRequest.php
│   │   └── UpdateProfileRequest.php
│   │
│   └── Middleware/
│       ├── EnsureUserIsNotBanned.php
│       ├── SetLocale.php
│       └── SecurityHeaders.php
│
├── Jobs/
│   ├── PublishScheduledPosts.php
│   ├── NotifyFollowers.php
│   ├── OptimizeUploadedImage.php
│   └── RefreshPostStats.php
│
├── Observers/
│   ├── PostObserver.php         ← slug, excerpt, cache flush
│   └── CommentObserver.php      ← comments_count
│
└── View/Components/
    ├── Alert.php   Card.php   Badge.php
    ├── PostCard.php   CommentThread.php
    └── Form/{Input,Textarea,Select,TagInput}.php

database/
├── migrations/          (12 هجرة)
├── factories/           (6 مصانع بحالات)
└── seeders/
    └── DatabaseSeeder.php    ← 20 مستخدماً · 80 مقالاً · 400 تعليق

resources/views/
├── layouts/{app,admin,guest}.blade.php
├── components/          (14 مكوّناً)
├── posts/{index,show,create,edit,_form}.blade.php
├── comments/{_thread,_form}.blade.php
├── profile/{show,edit}.blade.php
├── admin/{dashboard,users,posts,reports}/
└── errors/{404,403,500,503}.blade.php

routes/
├── web.php              ← الواجهة العامة + لوحة الإدارة
├── api.php              ← واجهة برمجية v1
└── console.php          ← الجدولة

tests/
├── Feature/
│   ├── PostTest.php            (18 اختباراً)
│   ├── CommentTest.php         (12)
│   ├── AuthorizationTest.php   (20)
│   ├── SearchTest.php          (8)
│   ├── InteractionTest.php     (10)
│   └── Admin/DashboardTest.php (6)
└── Unit/
    ├── PostServiceTest.php     (12)
    └── Enums/RoleTest.php      (6)

═══════════════════════════════════════════════════════
  أوامر التشغيل
═══════════════════════════════════════════════════════

# التهيئة
composer install && npm install
cp .env.example .env && php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link

# التطوير
php artisan serve
npm run dev
php artisan queue:work
php artisan schedule:work

# الجودة
php artisan test --coverage --min=80
./vendor/bin/pint
./vendor/bin/phpstan analyse --level=6

# الإنتاج
./deploy.sh

═══════════════════════════════════════════════════════
  حسابات التجربة بعد db:seed
═══════════════════════════════════════════════════════

admin@codeway.test    / password    (مشرف)
editor@codeway.test   / password    (محرّر)
author@codeway.test   / password    (كاتب)
reader@codeway.test   / password    (قارئ)

═══════════════════════════════════════════════════════
  قائمة تحقّق قبل النشر
═══════════════════════════════════════════════════════

□ APP_DEBUG=false و APP_ENV=production
□ APP_KEY مُولَّد ومحفوظ في مكان آمن
□ HTTPS مفعّل وشهادة سارية
□ جذر الويب على public/ فقط
□ صلاحيات storage/ و bootstrap/cache/ صحيحة
□ php artisan optimize منفّذ
□ composer install --no-dev --optimize-autoloader
□ npm run build منفّذ
□ عامل الطابور يعمل (Supervisor/Horizon)
□ Cron لـ schedule:run كل دقيقة
□ نسخ احتياطية يومية — واختبار استرجاع فعلي
□ مراقبة أخطاء (Sentry/Flare) موصولة
□ رؤوس الأمان مفعّلة
□ تحديد معدّل على الدخول والتعليقات
□ كل الاختبارات خضراء
□ .env غير مرفوع لـ Git

═══════════════════════════════════════════════════════
  إلى أين بعد ذلك؟
═══════════════════════════════════════════════════════

▸ Livewire أو Inertia لتفاعل غنيّ بلا SPA كامل
▸ Laravel Scout مع Meilisearch لبحث فوري احترافي
▸ Laravel Cashier للاشتراكات المدفوعة
▸ Laravel Reverb للتحديثات اللحظية (WebSockets)
▸ Filament لبناء لوحة إدارة كاملة في ساعات
▸ Laravel Octane لمضاعفة الأداء
▸ اقرأ Rails/Laravel Guides الرسمية كاملة — تستحقّ الوقت
`.trim() }
    },

    { t: 'h2', text: 'خاتمة المسار' },
    { t: 'p', text: 'أنهيت مسار Laravel كاملاً: من أول `php artisan serve` إلى نشر منصّة حقيقية على خادم إنتاج. ما تعلّمته هنا يكفي لبناء أغلب تطبيقات الويب التي ستحتاجها.' },
    { t: 'steps', items: [
      '**ابنِ مشروعاً حقيقياً** — الفرق بين من قرأ ومن بنى هائل.',
      '**اقرأ شيفرة Laravel نفسه** — مكتوبة بعناية وتعلّمك أنماطاً ممتازة.',
      '**تابع Laravel News و Laracasts** — النظام البيئي يتحرّك بسرعة.',
      '**شارك في مشروع مفتوح المصدر** — أفضل طريقة لتتعلّم من مراجعات الآخرين.',
      '**تعلّم اختبار ما تكتب** — هذا ما يفصل المحترف عن الهاوي.'
    ]},
    { t: 'tip', text: 'أفضل مصدر بعد هذا المسار هو التوثيق الرسمي على `laravel.com/docs` — من أفضل توثيقات الأطر على الإطلاق، مكتوب بلغة واضحة وأمثلة عملية.' },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'متى تنقل منطقاً من المتحكّم إلى كائن خدمة؟', options: ['أبداً', 'حين يتجاوز الإجراء ~15 سطراً أو يُستخدم المنطق من أكثر من مكان', 'دائماً', 'مع الاستعلامات فقط'], answer: 1,
        explain: 'كائن الخدمة قابل للاختبار وحده، ويُستدعى من المتحكّم والأمر والمهمّة معاً.' },
      { q: 'لماذا نلفّ إنشاء مقال بوسومه وصورته في `DB::transaction`؟', options: ['للسرعة', 'لأن فشل خطوة في المنتصف يترك بيانات ناقصة في القاعدة', 'إلزامي', 'للتخزين المؤقّت'], answer: 1,
        explain: 'المعاملة تضمن أن كل العمليات تنجح معاً أو تُلغى جميعاً.' },
      { q: 'كيف تكتشف N+1 قبل الإنتاج؟', options: ['بالمراجعة', '`Model::preventLazyLoading()` في التطوير + Debugbar لعدّ الاستعلامات', 'بالاختبارات فقط', 'مستحيل'], answer: 1,
        explain: 'ويمكن كتابة اختبار يعدّ الاستعلامات بـ `DB::enableQueryLog()` ويفشل إن تجاوزت حدّاً.' },
      { q: 'ما أخطر إعداد يمكن أن تنساه عند النشر؟', options: ['CACHE_STORE', '`APP_DEBUG=false` — تركه true يكشف الأسرار في صفحة الخطأ', 'QUEUE_CONNECTION', 'APP_NAME'], answer: 1,
        explain: 'يعرض متغيّرات البيئة ومسارات الملفات وأجزاء من الشيفرة لأي زائر.' },
      { q: 'ما وظيفة `php artisan optimize` في الإنتاج؟', options: ['ضغط الصور', 'يخزّن الإعدادات والمسارات والعروض مؤقّتاً لتسريع كل طلب', 'يحذف الملفات', 'يشغّل الاختبارات'], answer: 1,
        explain: 'لا تشغّله في التطوير — تغييرات `.env` والمسارات لن تظهر حتى تمسح الذاكرة.' },
      { q: 'لماذا نخزّن `comments_count` كعمود بدل عدّه في كل عرض؟', options: ['الدقّة', 'يوفّر استعلام COUNT في كل عرض للقائمة، والفرق كبير على آلاف السجلّات', 'اصطلاح', 'للأمان'], answer: 1,
        explain: 'يُسمّى إلغاء التطبيع المتعمّد؛ يُحدَّث عبر مراقب عند إضافة أو حذف تعليق.' },
      { q: 'ما الشيء الأهمّ الذي يفصل المشروع التعليمي عن الإنتاجي؟', options: ['حجم الشيفرة', 'التعامل مع الحالات الفاشلة: الصلاحيات، الأخطاء، الأداء، النسخ الاحتياطية، المراقبة', 'عدد الميزات', 'التصميم'], answer: 1,
        explain: 'المسار السعيد يعمل عند الجميع؛ الاحتراف يظهر في كيفية التعامل مع ما يفشل.' }
    ]}
  ]
};
