'use strict';

module.exports = {
  slug: '04-database-migrations',
  title: 'قواعد البيانات والهجرات',
  summary: 'إعداد الاتصال، كتابة الهجرات وتعديلها، أنواع الأعمدة والفهارس والمفاتيح الأجنبية، والبذور والمصانع.',
  duration: 55,
  level: 'متوسط',
  tags: ['Migrations', 'Schema', 'Seeders'],
  objectives: [
    'تضبط الاتصال بقاعدة البيانات وتختار المحرّك المناسب.',
    'تكتب هجرات لإنشاء الجداول وتعديلها.',
    'تختار نوع العمود الصحيح لكل حقل.',
    'تعرّف المفاتيح الأجنبية والفهارس بوعي.',
    'تستخدم المصانع والبذور لتوليد بيانات واقعية.',
    'تتجنّب الأخطاء الشائعة في تعديل الهجرات.'
  ],
  quickRef: [
    { code: 'php artisan make:migration', desc: 'هجرة جديدة' },
    { code: 'php artisan migrate', desc: 'تطبيق' },
    { code: 'migrate:rollback', desc: 'تراجع' },
    { code: 'migrate:fresh --seed', desc: 'إعادة بناء كاملة' },
    { code: '$table->string(\'x\')', desc: 'عمود نصّي' },
    { code: 'foreignId()->constrained()', desc: 'مفتاح أجنبي' },
    { code: '$table->index([...])', desc: 'فهرس' },
    { code: 'php artisan db:seed', desc: 'تشغيل البذور' }
  ],
  blocks: [
    { t: 'h2', text: 'إعداد الاتصال' },
    { t: 'code', lang: 'bash', code: `
# .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blog
DB_USERNAME=root
DB_PASSWORD=secret

# SQLite — الأبسط للتطوير والاختبار
DB_CONNECTION=sqlite
# ثم: touch database/database.sqlite
`.trim() },
    { t: 'table', head: ['المحرّك', 'متى تختاره'], rows: [
      ['**SQLite**', 'التطوير المحلي والاختبارات — ملف واحد بلا خادم'],
      ['**MySQL / MariaDB**', 'الخيار الأشيع، مدعوم في كل استضافة'],
      ['**PostgreSQL**', 'مزايا متقدّمة: JSONB، أنواع مخصّصة، بحث نصّي أقوى'],
      ['**SQL Server**', 'بيئات المؤسّسات على Microsoft']
    ]},
    { t: 'tip', text: 'شغّل اختباراتك على SQLite في الذاكرة (`DB_DATABASE=:memory:` في `phpunit.xml`) — أسرع بكثير، لكن اختبر قبل النشر على نفس محرّك الإنتاج لأن بعض الفروق تظهر فقط هناك.' },

    { t: 'h2', text: 'الهجرات' },
    { t: 'p', text: 'الهجرة ملف PHP يصف تغييراً على بنية قاعدة البيانات. الفائدة: بنية قاعدة البيانات تصبح جزءاً من الشيفرة، مُتحكَّماً بها في Git، وقابلة لإعادة الإنتاج على أي جهاز.' },
    { t: 'code', lang: 'bash', code: `
php artisan make:migration create_posts_table
php artisan make:migration add_status_to_posts_table --table=posts
php artisan make:migration drop_legacy_table
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();                                    // BIGINT UNSIGNED AUTO_INCREMENT
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();

            $table->string('title', 160);
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('body');
            $table->string('cover_path')->nullable();

            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamp('published_at')->nullable();

            $table->timestamps();                            // created_at و updated_at
            $table->softDeletes();                           // deleted_at

            $table->index(['status', 'published_at']);
            $table->index('user_id');
            $table->fullText(['title', 'body']);             // MySQL و PostgreSQL
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
`.trim() },
    { t: 'code', lang: 'bash', code: `
php artisan migrate                 # طبّق الهجرات الجديدة
php artisan migrate:status          # ما المُطبَّق وما لا؟
php artisan migrate:rollback        # تراجع عن آخر دفعة
php artisan migrate:rollback --step=3
php artisan migrate:reset           # تراجع عن كل شيء
php artisan migrate:refresh --seed  # تراجع ثم أعد التطبيق
php artisan migrate:fresh --seed    # يمسح كل الجداول ويعيد البناء
php artisan schema:dump             # يضغط الهجرات القديمة في ملف واحد
`.trim() },
    { t: 'danger', title: '`migrate:fresh` يمسح كل البيانات', text: 'لا تشغّله على قاعدة إنتاج أبداً. Laravel يمنعه في بيئة الإنتاج ويطلب تأكيداً، لكن `--force` يتجاوز ذلك — فانتبه لما تكتبه في سكربتات النشر.' },

    { t: 'h2', text: 'أنواع الأعمدة' },
    { t: 'table', head: ['الدالة', 'النوع', 'الاستخدام'], rows: [
      ['`id()`', 'BIGINT UNSIGNED', 'مفتاح أساسي متزايد'],
      ['`uuid(\'id\')`', 'CHAR(36)', 'معرّف عالمي'],
      ['`ulid(\'id\')`', 'CHAR(26)', 'معرّف مرتّب زمنياً — أفضل من UUID للفهارس'],
      ['`string(\'x\', 255)`', 'VARCHAR', 'نصّ قصير'],
      ['`text` / `longText`', 'TEXT', 'نصّ طويل'],
      ['`integer` / `bigInteger`', 'INT / BIGINT', 'أعداد صحيحة'],
      ['`unsignedInteger`', 'INT UNSIGNED', 'أعداد موجبة فقط'],
      ['`decimal(\'p\', 10, 2)`', 'DECIMAL', '**للمال دائماً**'],
      ['`float` / `double`', 'FLOAT', 'قياسات علمية — **لا للمال**'],
      ['`boolean`', 'TINYINT(1)', 'صح/خطأ'],
      ['`date` / `dateTime`', 'DATE / DATETIME', 'تواريخ'],
      ['`timestamp`', 'TIMESTAMP', 'مع منطقة زمنية'],
      ['`json` / `jsonb`', 'JSON', 'بيانات مرنة'],
      ['`enum(\'x\', [...])`', 'ENUM', 'قيم محدودة'],
      ['`foreignId(\'x_id\')`', 'BIGINT UNSIGNED', 'مفتاح أجنبي']
    ]},
    { t: 'danger', title: 'لا تخزّن المال في `float`', text: 'استخدم `decimal(\'price\', 10, 2)` أو خزّن المبلغ **بالهللات كعدد صحيح**. خطأ التقريب العشري يتراكم فينتج فروقاً حقيقية في الفواتير والتقارير.' },
    { t: 'h3', text: 'المُعدِّلات' },
    { t: 'code', lang: 'php', code: `
<?php
$table->string('email')->unique();
$table->string('phone')->nullable();
$table->boolean('active')->default(true);
$table->integer('sort')->default(0)->index();
$table->string('slug')->after('title');            // MySQL فقط
$table->text('notes')->comment('ملاحظات داخلية');
$table->string('code')->charset('binary');
$table->timestamp('verified_at')->useCurrent();
$table->decimal('total', 12, 2)->storedAs('subtotal + tax');
`.trim() },

    { t: 'h2', text: 'المفاتيح الأجنبية' },
    { t: 'code', lang: 'php', code: `
<?php
// الصيغة المختصرة — تستنتج الجدول من اسم العمود
$table->foreignId('user_id')->constrained();

// مع تحديد الجدول
$table->foreignId('author_id')->constrained('users');

// سلوك الحذف والتحديث
$table->foreignId('post_id')->constrained()->cascadeOnDelete();  // احذف الأبناء
$table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
$table->foreignId('owner_id')->constrained()->restrictOnDelete(); // امنع الحذف
$table->foreignId('team_id')->constrained()->cascadeOnUpdate();

// الصيغة الكاملة
$table->unsignedBigInteger('user_id');
$table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
`.trim() },
    { t: 'table', head: ['السلوك', 'ماذا يحدث عند حذف الأب'], rows: [
      ['`cascadeOnDelete()`', 'تُحذف كل الأبناء — للعلاقات المملوكة (تعليقات مقال)'],
      ['`nullOnDelete()`', 'يصبح المفتاح `null` — للعلاقات الاختيارية (تصنيف)'],
      ['`restrictOnDelete()`', 'يُمنع الحذف — لحماية بيانات مهمّة (طلبات عميل)'],
      ['بلا تحديد', 'يُمنع الحذف افتراضياً']
    ]},
    { t: 'warn', title: 'SQLite يحتاج تفعيلاً', text: 'المفاتيح الأجنبية معطّلة افتراضياً في SQLite القديم. Laravel يفعّلها تلقائياً، لكن انتبه إن تعاملت مع قاعدة SQLite خارج Laravel.' },

    { t: 'h2', text: 'الفهارس' },
    { t: 'code', lang: 'php', code: `
<?php
$table->index('user_id');
$table->index(['status', 'created_at']);          // فهرس مركّب
$table->unique('email');
$table->unique(['post_id', 'tag_id']);            // يمنع التكرار في جدول وسيط
$table->fullText(['title', 'body']);
$table->spatialIndex('location');

// أسماء مخصّصة
$table->index('user_id', 'posts_author_idx');

// الحذف
$table->dropIndex('posts_status_created_at_index');
$table->dropUnique('users_email_unique');
`.trim() },
    { t: 'p', text: 'قاعدة عملية للفهرسة: افهرس كل عمود يظهر في `WHERE` أو `ORDER BY` أو `JOIN` بكثرة. في الفهرس المركّب، **الترتيب مهمّ**: `[\"status\", \"created_at\"]` يفيد الاستعلامات التي ترشّح بـ `status` وحده أو بالاثنين، لا التي ترشّح بـ `created_at` وحده.' },
    { t: 'warn', title: 'الفهرس ليس مجانياً', text: 'كل فهرس يبطئ الإدراج والتحديث ويستهلك مساحة. لا تفهرس كل عمود — افهرس ما يُستعلَم عنه فعلاً، وقِس بـ `EXPLAIN` قبل وبعد.' },

    { t: 'h2', text: 'تعديل الجداول' },
    { t: 'code', lang: 'php', code: `
<?php
public function up(): void
{
    Schema::table('posts', function (Blueprint $table) {
        // إضافة
        $table->string('meta_title')->nullable()->after('title');
        $table->foreignId('editor_id')->nullable()->constrained('users');

        // تعديل — يحتاج doctrine/dbal في Laravel < 11
        $table->string('title', 200)->change();
        $table->text('body')->nullable(false)->change();

        // إعادة تسمية
        $table->renameColumn('body', 'content');

        // حذف
        $table->dropColumn(['legacy_field', 'old_flag']);
        $table->dropForeign(['editor_id']);
        $table->dropIndex(['status']);
    });
}

public function down(): void
{
    Schema::table('posts', function (Blueprint $table) {
        $table->dropColumn('meta_title');
        $table->dropConstrainedForeignId('editor_id');
        $table->renameColumn('content', 'body');
    });
}
`.trim() },
    { t: 'danger', title: 'اكتب `down()` دائماً وبشكل صحيح', text: 'هجرة بلا `down()` صحيحة تعني أنك لا تستطيع التراجع عن نشر فاشل. اختبر التراجع محلياً بـ `migrate:rollback` قبل الدفع — أرخص بكثير من اكتشاف المشكلة في الإنتاج.' },
    { t: 'compare', lang: 'php', bad: {
      code: `// ✗ تعديل هجرة طُبِّقت على الإنتاج
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->string('title', 160);
    $table->string('subtitle');   // ← أُضيف لاحقاً بتعديل الملف القديم
});`,
      why: 'الهجرة مُسجَّلة كمُطبَّقة فلن تُعاد. جهازك سيبني الجدول بالعمود الجديد، والإنتاج لن يعرفه — واختلاف صامت يظهر كخطأ غامض لاحقاً.'
    }, good: {
      code: `// ✓ هجرة جديدة
php artisan make:migration add_subtitle_to_posts_table --table=posts

Schema::table('posts', function (Blueprint $table) {
    $table->string('subtitle')->nullable()->after('title');
});`,
      why: 'كل بيئة تطبّق نفس التسلسل فتصل لنفس البنية بالضبط، والتاريخ يبقى قابلاً للتكرار من الصفر.'
    }},

    { t: 'h2', text: 'المصانع (Factories)' },
    { t: 'code', lang: 'bash', code: `
php artisan make:factory PostFactory --model=Post
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
namespace Database\\Factories;

use App\\Models\\{User, Category};
use Illuminate\\Database\\Eloquent\\Factories\\Factory;
use Illuminate\\Support\\Str;

class PostFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(rand(4, 9));

        return [
            'user_id'     => User::factory(),
            'category_id' => Category::factory(),
            'title'       => rtrim($title, '.'),
            'slug'        => Str::slug($title) . '-' . Str::random(6),
            'excerpt'     => fake()->paragraph(),
            'body'        => collect(fake()->paragraphs(rand(4, 10)))->implode("\\n\\n"),
            'status'      => fake()->randomElement(['draft', 'published', 'published']),
            'views_count' => fake()->numberBetween(0, 5000),
            'created_at'  => fake()->dateTimeBetween('-1 year'),
        ];
    }

    // الحالات — تعدّل جزءاً من التعريف
    public function published(): static
    {
        return $this->state(fn () => [
            'status'       => 'published',
            'published_at' => fake()->dateTimeBetween('-6 months'),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn () => ['status' => 'draft', 'published_at' => null]);
    }

    public function popular(): static
    {
        return $this->state(fn () => ['views_count' => fake()->numberBetween(10_000, 99_999)]);
    }

    // خطّاف بعد الإنشاء
    public function configure(): static
    {
        return $this->afterCreating(function (Post $post) {
            $post->tags()->attach(Tag::inRandomOrder()->limit(rand(1, 3))->pluck('id'));
        });
    }
}
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
Post::factory()->create();                          // واحد
Post::factory()->count(50)->create();               // خمسون
Post::factory()->published()->popular()->create();  // مع حالات
Post::factory()->create(['title' => 'عنوان محدّد']); // تجاوز قيمة
Post::factory()->make();                            // بلا حفظ

// مع العلاقات
User::factory()
    ->has(Post::factory()->count(5)->published())
    ->create();

Post::factory()
    ->for(User::factory()->state(['name' => 'سارة']))
    ->hasComments(10)
    ->create();
`.trim() },
    { t: 'tip', text: 'اضبط لغة Faker العربية في `config/app.php` عبر `\'faker_locale\' => \'ar_SA\'` لتحصل على أسماء ومدن ونصوص عربية في بيانات التطوير.' },

    { t: 'h2', text: 'البذور (Seeders)' },
    { t: 'code', lang: 'php', code: `
<?php
// database/seeders/DatabaseSeeder.php
namespace Database\\Seeders;

use App\\Models\\{User, Post, Category, Tag, Comment};
use Illuminate\\Database\\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1) مستخدم إداري ثابت للتجربة
        $admin = User::factory()->create([
            'name'     => 'المشرف',
            'email'    => 'admin@blog.test',
            'password' => bcrypt('password'),
            'role'     => 'admin',
        ]);

        // 2) تصنيفات ثابتة
        $categories = collect(['برمجة', 'تصميم', 'أعمال', 'تقنية'])
            ->map(fn ($name) => Category::factory()->create(['name' => $name]));

        // 3) وسوم
        $tags = Tag::factory()->count(15)->create();

        // 4) كتّاب ومقالاتهم
        $authors = User::factory()->count(8)->create();

        $posts = Post::factory()
            ->count(60)
            ->published()
            ->recycle($authors)          // يعيد استخدام الكتّاب بدل إنشاء جديد
            ->recycle($categories)
            ->create();

        // 5) وسوم عشوائية لكل مقال
        $posts->each(fn ($post) =>
            $post->tags()->attach($tags->random(rand(1, 4))->pluck('id'))
        );

        // 6) تعليقات
        Comment::factory()
            ->count(300)
            ->recycle($authors->push($admin))
            ->recycle($posts)
            ->create();

        $this->command->info("✅ {$posts->count()} مقالاً و {$authors->count()} كاتباً.");
    }
}
`.trim() },
    { t: 'code', lang: 'bash', code: `
php artisan db:seed
php artisan db:seed --class=PostSeeder
php artisan migrate:fresh --seed
`.trim() },
    { t: 'note', text: '`recycle()` مهمّ جداً: بدونه ينشئ كل `Post::factory()` مستخدماً وتصنيفاً جديدين، فتنتهي بـ 60 مستخدماً بدل 8 وبيانات غير واقعية.' },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'مخطّط قاعدة بيانات متجر',
      brief: 'صمّم قاعدة بيانات كاملة لمتجر إلكتروني بهجرات ومصانع وبذور.',
      requirements: [
        'جداول: `users`, `categories`, `products`, `product_images`, `orders`, `order_items`, `reviews`, `coupons`, `addresses`.',
        'التصنيفات شجرية: عمود `parent_id` يشير لنفس الجدول.',
        'المنتج: اسم، slug فريد، وصف، سعر `decimal`، سعر قبل الخصم، مخزون، SKU فريد، حالة، تصنيف.',
        'الطلب: مستخدم، رقم طلب فريد، حالة، إجماليات (فرعي، شحن، ضريبة، خصم، نهائي)، عنوان الشحن.',
        'عناصر الطلب: تخزّن **نسخة** من اسم المنتج وسعره وقت الشراء لا مرجعاً فقط.',
        'المراجعات: مستخدم ومنتج وتقييم 1–5 ونصّ، مع قيد فريد يمنع مراجعتين لنفس المنتج.',
        'الكوبونات: رمز فريد، نوع الخصم (نسبة/مبلغ)، القيمة، حدّ أدنى للطلب، تاريخ انتهاء، حدّ استخدام.',
        'اختر سلوك الحذف المناسب لكل مفتاح أجنبي وبرّره في تعليق.',
        'أضف فهارس مدروسة لكل استعلام متوقّع، واشرح في تعليق لماذا كل فهرس.',
        'اكتب `down()` صحيحاً لكل هجرة، واختبر التراجع.',
        'مصانع لكل نموذج مع حالات مفيدة (`inStock`, `outOfStock`, `onSale`, `expired`).',
        'بذرة تنتج متجراً واقعياً: 8 تصنيفات، 60 منتجاً، 20 مستخدماً، 100 طلب، 200 مراجعة.'
      ],
      hints: [
        '`$table->foreignId(\'parent_id\')->nullable()->constrained(\'categories\')` للشجرة.',
        'خزّن المال بـ `decimal(10, 2)` أو بالهللات كـ `unsignedInteger`.',
        '`$table->unique([\'user_id\', \'product_id\'])` يمنع المراجعة المكرّرة.',
        'استخدم `recycle()` في البذور لتفادي إنشاء كيانات زائدة.'
      ],
      solution: { lang: 'php', code: `
<?php
// ═══════════════════════════════════════════════
// 1) database/migrations/..._create_categories_table.php
// ═══════════════════════════════════════════════
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();

            // شجرة: حذف الأب يحذف الأبناء لأن التصنيف الفرعي لا معنى له بلا أبيه
            $table->foreignId('parent_id')->nullable()
                  ->constrained('categories')->cascadeOnDelete();

            $table->string('name', 80);
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // للتنقّل في الشجرة وعرض التصنيفات النشطة مرتّبة
            $table->index(['parent_id', 'is_active', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};

// ═══════════════════════════════════════════════
// 2) ..._create_products_table.php
// ═══════════════════════════════════════════════
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // منع حذف تصنيف فيه منتجات — يجب نقلها أولاً
            $table->foreignId('category_id')->constrained()->restrictOnDelete();

            $table->string('name', 160);
            $table->string('slug')->unique();
            $table->string('sku', 40)->unique();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();

            // decimal لا float — المال لا يحتمل خطأ التقريب
            $table->decimal('price', 10, 2);
            $table->decimal('compare_at_price', 10, 2)->nullable();

            $table->unsignedInteger('stock')->default(0);
            $table->unsignedSmallInteger('low_stock_threshold')->default(5);
            $table->decimal('weight_kg', 6, 3)->nullable();

            $table->enum('status', ['draft', 'active', 'archived'])->default('draft');
            $table->boolean('is_featured')->default(false);

            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('sales_count')->default(0);
            $table->decimal('rating_avg', 3, 2)->default(0);
            $table->unsignedInteger('rating_count')->default(0);

            $table->timestamps();
            $table->softDeletes();

            // صفحة القائمة: ترشيح بالحالة والتصنيف مع ترتيب بالسعر
            $table->index(['status', 'category_id', 'price']);
            // الواجهة الرئيسية: المنتجات المميّزة
            $table->index(['is_featured', 'status']);
            // تنبيه المخزون المنخفض في لوحة الإدارة
            $table->index('stock');
            // البحث النصّي
            $table->fullText(['name', 'short_description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

// ═══════════════════════════════════════════════
// 3) ..._create_product_images_table.php
// ═══════════════════════════════════════════════
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();

            // الصورة لا معنى لها بلا منتجها
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();

            $table->string('path');
            $table->string('alt', 160)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->index(['product_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};

// ═══════════════════════════════════════════════
// 4) ..._create_addresses_table.php
// ═══════════════════════════════════════════════
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('label', 40)->default('المنزل');
            $table->string('recipient', 80);
            $table->string('phone', 20);
            $table->string('city', 60);
            $table->string('district', 80)->nullable();
            $table->string('street', 160);
            $table->string('postal_code', 10)->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'is_default']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};

// ═══════════════════════════════════════════════
// 5) ..._create_coupons_table.php
// ═══════════════════════════════════════════════
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code', 40)->unique();
            $table->enum('type', ['percentage', 'fixed']);
            $table->decimal('value', 10, 2);
            $table->decimal('min_order_total', 10, 2)->default(0);
            $table->decimal('max_discount', 10, 2)->nullable();
            $table->unsignedInteger('usage_limit')->nullable();
            $table->unsignedInteger('used_count')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // التحقّق من صلاحية الكوبون عند الشراء
            $table->index(['is_active', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};

// ═══════════════════════════════════════════════
// 6) ..._create_orders_table.php
// ═══════════════════════════════════════════════
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // منع حذف مستخدم له طلبات — سجلّ مالي يجب حفظه
            $table->foreignId('user_id')->constrained()->restrictOnDelete();

            // حذف الكوبون لا يجب أن يحذف الطلب
            $table->foreignId('coupon_id')->nullable()->constrained()->nullOnDelete();

            $table->string('number', 20)->unique();

            $table->enum('status', [
                'pending', 'paid', 'processing', 'shipped',
                'delivered', 'cancelled', 'refunded',
            ])->default('pending');

            $table->decimal('subtotal',       10, 2);
            $table->decimal('shipping_total', 10, 2)->default(0);
            $table->decimal('tax_total',      10, 2)->default(0);
            $table->decimal('discount_total', 10, 2)->default(0);
            $table->decimal('grand_total',    10, 2);

            // نسخة من العنوان — لا مرجع، لأن العنوان قد يُحذف أو يُعدَّل
            $table->json('shipping_address');
            $table->text('notes')->nullable();

            $table->timestamp('paid_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            // "طلباتي" مرتّبة زمنياً — أشيع استعلام في الموقع
            $table->index(['user_id', 'created_at']);
            // لوحة الإدارة: الطلبات حسب الحالة
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

// ═══════════════════════════════════════════════
// 7) ..._create_order_items_table.php
// ═══════════════════════════════════════════════
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();

            // المرجع للتقارير فقط — البيانات المعروضة منسوخة أدناه
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();

            // ⚠️ نسخة وقت الشراء: تغيير سعر المنتج لاحقاً يجب ألا يغيّر فاتورة قديمة
            $table->string('product_name', 160);
            $table->string('product_sku', 40);
            $table->decimal('unit_price', 10, 2);

            $table->unsignedSmallInteger('quantity');
            $table->decimal('line_total', 10, 2);
            $table->timestamps();

            $table->index('order_id');
            // "كم بيع من هذا المنتج؟"
            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};

// ═══════════════════════════════════════════════
// 8) ..._create_reviews_table.php
// ═══════════════════════════════════════════════
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();

            $table->unsignedTinyInteger('rating');   // 1–5
            $table->string('title', 120)->nullable();
            $table->text('body')->nullable();
            $table->boolean('is_verified_purchase')->default(false);
            $table->boolean('is_approved')->default(false);
            $table->timestamps();

            // مراجعة واحدة لكل مستخدم لكل منتج
            $table->unique(['user_id', 'product_id']);
            // عرض مراجعات المنتج المعتمدة
            $table->index(['product_id', 'is_approved', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};

// ═══════════════════════════════════════════════
// 9) database/factories/ProductFactory.php
// ═══════════════════════════════════════════════
namespace Database\\Factories;

use App\\Models\\Category;
use Illuminate\\Database\\Eloquent\\Factories\\Factory;
use Illuminate\\Support\\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name  = fake()->unique()->words(rand(2, 4), true);
        $price = fake()->randomFloat(2, 25, 6000);

        return [
            'category_id'       => Category::factory(),
            'name'              => $name,
            'slug'              => Str::slug($name) . '-' . Str::random(5),
            'sku'               => 'SKU-' . fake()->unique()->numerify('######'),
            'short_description' => fake()->sentence(12),
            'description'       => collect(fake()->paragraphs(4))->implode("\\n\\n"),
            'price'             => $price,
            'compare_at_price'  => fake()->boolean(30) ? round($price * 1.3, 2) : null,
            'stock'             => fake()->numberBetween(0, 200),
            'status'            => 'active',
            'is_featured'       => fake()->boolean(15),
            'views_count'       => fake()->numberBetween(0, 8000),
            'sales_count'       => fake()->numberBetween(0, 400),
            'created_at'        => fake()->dateTimeBetween('-1 year'),
        ];
    }

    public function inStock(): static
    {
        return $this->state(fn () => ['stock' => fake()->numberBetween(20, 200)]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn () => ['stock' => 0]);
    }

    public function onSale(): static
    {
        return $this->state(function (array $attributes) {
            $price = $attributes['price'] ?? 100;
            return [
                'price'            => round($price * 0.7, 2),
                'compare_at_price' => $price,
            ];
        });
    }

    public function featured(): static
    {
        return $this->state(fn () => ['is_featured' => true, 'status' => 'active']);
    }
}

// ═══════════════════════════════════════════════
// 10) database/seeders/DatabaseSeeder.php
// ═══════════════════════════════════════════════
namespace Database\\Seeders;

use App\\Models\\{User, Category, Product, ProductImage, Order, OrderItem, Review, Coupon, Address};
use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── مستخدمون ──
        $admin = User::factory()->create([
            'name'  => 'المشرف',
            'email' => 'admin@shop.test',
            'role'  => 'admin',
        ]);

        $customers = User::factory()->count(20)->create();
        $customers->each(fn ($u) => Address::factory()->create([
            'user_id'    => $u->id,
            'is_default' => true,
        ]));

        // ── تصنيفات شجرية ──
        $roots = collect(['إلكترونيات', 'ملابس', 'منزل ومطبخ', 'كتب'])
            ->map(fn ($name) => Category::factory()->create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]));

        $children = $roots->flatMap(function ($parent) {
            return collect(range(1, 2))->map(fn ($i) =>
                Category::factory()->create([
                    'parent_id' => $parent->id,
                    'name'      => "{$parent->name} — فرع {$i}",
                ])
            );
        });

        $allCategories = $roots->concat($children);

        // ── منتجات ──
        $products = Product::factory()
            ->count(60)
            ->recycle($allCategories)
            ->create();

        $products->random(12)->each->update(['is_featured' => true]);
        $products->random(10)->each(fn ($p) => $p->update([
            'compare_at_price' => round($p->price * 1.35, 2),
        ]));
        $products->random(5)->each->update(['stock' => 0]);

        $products->each(function ($product) {
            ProductImage::factory()->count(rand(1, 4))->create([
                'product_id' => $product->id,
            ])->first()?->update(['is_primary' => true]);
        });

        // ── كوبونات ──
        Coupon::factory()->create([
            'code' => 'WELCOME10', 'type' => 'percentage', 'value' => 10,
            'min_order_total' => 200, 'expires_at' => now()->addMonths(3),
        ]);
        Coupon::factory()->create([
            'code' => 'EXPIRED50', 'type' => 'fixed', 'value' => 50,
            'expires_at' => now()->subWeek(), 'is_active' => false,
        ]);

        // ── طلبات ──
        $orders = collect(range(1, 100))->map(function ($i) use ($customers, $products) {
            $customer = $customers->random();
            $items    = $products->where('stock', '>', 0)->random(rand(1, 4));

            $subtotal = 0;
            $order = Order::factory()->create([
                'user_id'  => $customer->id,
                'number'   => 'ORD-' . str_pad((string) $i, 6, '0', STR_PAD_LEFT),
                'subtotal' => 0,
                'grand_total' => 0,
                'shipping_address' => [
                    'recipient' => $customer->name,
                    'city'      => fake()->city(),
                    'street'    => fake()->streetAddress(),
                    'phone'     => fake()->numerify('05########'),
                ],
            ]);

            foreach ($items as $product) {
                $qty  = rand(1, 3);
                $line = round($product->price * $qty, 2);
                $subtotal += $line;

                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $product->id,
                    'product_name' => $product->name,
                    'product_sku'  => $product->sku,
                    'unit_price'   => $product->price,
                    'quantity'     => $qty,
                    'line_total'   => $line,
                ]);
            }

            $shipping = $subtotal >= 200 ? 0 : 25;
            $tax      = round($subtotal * 0.15, 2);

            $order->update([
                'subtotal'       => $subtotal,
                'shipping_total' => $shipping,
                'tax_total'      => $tax,
                'grand_total'    => round($subtotal + $shipping + $tax, 2),
            ]);

            return $order;
        });

        // ── مراجعات ──
        $products->each(function ($product) use ($customers) {
            $reviewers = $customers->random(rand(0, 6));

            foreach ($reviewers as $user) {
                Review::factory()->create([
                    'user_id'              => $user->id,
                    'product_id'           => $product->id,
                    'rating'               => fake()->numberBetween(3, 5),
                    'is_approved'          => fake()->boolean(85),
                    'is_verified_purchase' => fake()->boolean(60),
                ]);
            }

            $approved = $product->reviews()->where('is_approved', true);
            $product->update([
                'rating_avg'   => round((float) $approved->avg('rating'), 2),
                'rating_count' => $approved->count(),
            ]);
        });

        $this->command->info(
            "✅ {$allCategories->count()} تصنيفاً · {$products->count()} منتجاً · " .
            "{$customers->count()} عميلاً · {$orders->count()} طلباً · " .
            Review::count() . " مراجعة."
        );
    }
}
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'لماذا لا نعدّل هجرة طُبِّقت على الإنتاج؟', options: ['ممنوع تقنياً', 'الهجرة مُسجَّلة كمُطبَّقة فلن تُعاد، فتختلف بنية الإنتاج عن جهازك بصمت', 'بطيء', 'يفسد الفهارس'], answer: 1,
        explain: 'اكتب هجرة جديدة دائماً — التسلسل يجب أن يبقى قابلاً للتكرار من الصفر في كل بيئة.' },
      { q: 'ما نوع العمود الصحيح لسعر منتج؟', options: ['`float`', '`decimal(10, 2)` أو عدد صحيح بالهللات', '`double`', '`string`'], answer: 1,
        explain: 'خطأ التقريب في العشرية العائمة يتراكم فينتج فروقاً حقيقية في الفواتير.' },
      { q: 'متى تستخدم `cascadeOnDelete` ومتى `restrictOnDelete`؟', options: ['لا فرق', 'cascade للعلاقات المملوكة (صور منتج)، وrestrict لحماية سجلّات مهمّة (طلبات عميل)', 'العكس', 'دائماً cascade'], answer: 1,
        explain: 'و`nullOnDelete` للعلاقات الاختيارية مثل تصنيف قد يُحذف دون أن يُفقد المنتج.' },
      { q: 'لماذا تخزّن عناصر الطلب نسخة من اسم المنتج وسعره؟', options: ['للسرعة', 'تغيير سعر المنتج لاحقاً يجب ألا يغيّر قيمة فاتورة صدرت من قبل', 'لتقليل الاستعلامات', 'اصطلاح'], answer: 1,
        explain: 'الفاتورة سجلّ تاريخي ثابت — وحتى حذف المنتج يجب ألا يفسدها.' },
      { q: 'ما أهمية ترتيب الأعمدة في الفهرس المركّب؟', options: ['لا أهمية', 'الفهرس يفيد الاستعلامات التي ترشّح بالعمود الأول أو بالبادئة، لا بالثاني وحده', 'الأداء فقط', 'التوثيق'], answer: 1,
        explain: 'فهرس على `[status, created_at]` لا يفيد استعلاماً يرشّح بـ `created_at` وحده.' },
      { q: 'ما فائدة `recycle()` في المصانع؟', options: ['السرعة', 'يعيد استخدام كيانات موجودة بدل إنشاء جديد لكل علاقة', 'يحذف المكرّر', 'يرتّب'], answer: 1,
        explain: 'بدونه تنتهي بـ 60 مستخدماً لـ 60 مقالاً بدل 8 كتّاب واقعيين.' },
      { q: 'ما خطورة `php artisan migrate:fresh` على الإنتاج؟', options: ['بطيء', 'يمسح كل الجداول وبياناتها ويعيد البناء من الصفر', 'يعيد التسمية', 'لا خطورة'], answer: 1,
        explain: 'Laravel يطلب تأكيداً في الإنتاج، لكن `--force` يتجاوزه — انتبه لسكربتات النشر.' }
    ]}
  ]
};
