'use strict';

module.exports = {
  slug: '07-validation',
  title: 'النماذج والتحقّق',
  summary: 'قواعد التحقّق كلها، أصناف الطلب المخصّصة، الرسائل العربية، رفع الملفات، والقواعد المخصّصة.',
  duration: 55,
  level: 'متوسط',
  tags: ['Validation', 'Form Requests', 'Uploads'],
  objectives: [
    'تتحقّق من المدخلات بثلاث طرق وتعرف متى تستخدم كلاً منها.',
    'تكتب صنف طلب مخصّص يجمع التحقّق والصلاحية.',
    'تعرف أهمّ القواعد وتستخدمها في مواضعها الصحيحة.',
    'تخصّص رسائل الخطأ بالعربية وتسمّي الحقول.',
    'ترفع الملفات وتتحقّق منها بأمان.',
    'تكتب قواعد تحقّق مخصّصة لمنطق عملك.'
  ],
  quickRef: [
    { code: '$request->validate([...])', desc: 'تحقّق مباشر' },
    { code: 'make:request', desc: 'صنف طلب' },
    { code: 'required|string|max:255', desc: 'صيغة نصّية' },
    { code: "['required', 'string']", desc: 'صيغة مصفوفة — الأفضل' },
    { code: 'Rule::unique()->ignore()', desc: 'فريد مع استثناء' },
    { code: '$request->validated()', desc: 'البيانات المتحقّقة' },
    { code: 'sometimes', desc: 'تحقّق إن وُجد' },
    { code: 'bail', desc: 'أوقف عند أول خطأ' }
  ],
  blocks: [
    { t: 'h2', text: 'ثلاث طرق للتحقّق' },
    { t: 'code', lang: 'php', code: `
<?php
// 1) في المتحكّم مباشرة — للحالات البسيطة
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => ['required', 'string', 'max:160'],
        'body'  => ['required', 'string', 'min:20'],
    ]);

    Post::create($validated);
}

// 2) صنف طلب مخصّص — الأفضل للنماذج الحقيقية
public function store(StorePostRequest $request)
{
    Post::create($request->validated());
}

// 3) Validator يدوياً — حين تحتاج تحكّماً كاملاً
$validator = Validator::make($data, $rules, $messages);

if ($validator->fails()) {
    return back()->withErrors($validator)->withInput();
}

$validated = $validator->validated();
`.trim() },
    { t: 'note', text: 'عند فشل التحقّق في `validate()` أو صنف الطلب، يعيد Laravel التوجيه تلقائياً مع الأخطاء والمدخلات القديمة — أو يُرجع JSON بحالة 422 إن كان الطلب يتوقّع JSON.' },

    { t: 'h2', text: 'صنف الطلب المخصّص' },
    { t: 'code', lang: 'bash', code: `
php artisan make:request StorePostRequest
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;
use Illuminate\\Validation\\Rule;
use Illuminate\\Support\\Str;

class StorePostRequest extends FormRequest
{
    /** الصلاحية — تُفحص قبل التحقّق */
    public function authorize(): bool
    {
        return $this->user()->can('create', Post::class);
    }

    /** تنظيف المدخلات قبل التحقّق */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug'  => Str::slug($this->title ?? ''),
            'title' => trim($this->title ?? ''),
            'tags'  => array_filter((array) $this->tags),
        ]);
    }

    public function rules(): array
    {
        $postId = $this->route('post')?->id;

        return [
            'title'       => ['required', 'string', 'min:5', 'max:160'],
            'slug'        => ['required', 'string', Rule::unique('posts')->ignore($postId)],
            'body'        => ['required', 'string', 'min:50'],
            'excerpt'     => ['nullable', 'string', 'max:300'],
            'category_id' => ['required', 'integer', Rule::exists('categories', 'id')],
            'status'      => ['required', Rule::enum(PostStatus::class)],
            'published_at'=> ['nullable', 'date', 'after_or_equal:today'],
            'cover'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048', 'dimensions:min_width=800'],
            'tags'        => ['array', 'max:5'],
            'tags.*'      => ['integer', Rule::exists('tags', 'id')],
        ];
    }

    /** رسائل مخصّصة */
    public function messages(): array
    {
        return [
            'title.required' => 'العنوان مطلوب.',
            'title.min'      => 'العنوان قصير جداً — خمسة أحرف على الأقل.',
            'body.min'       => 'المحتوى يجب أن يكون خمسين حرفاً على الأقل.',
            'cover.max'      => 'حجم الصورة يتجاوز ٢ ميغابايت.',
            'tags.max'       => 'لا يمكن اختيار أكثر من خمسة وسوم.',
        ];
    }

    /** أسماء الحقول في الرسائل الافتراضية */
    public function attributes(): array
    {
        return [
            'title'       => 'العنوان',
            'body'        => 'المحتوى',
            'category_id' => 'التصنيف',
            'cover'       => 'صورة الغلاف',
        ];
    }

    /** تحقّق إضافي بعد نجاح القواعد */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->status === 'published' && blank($this->excerpt)) {
                $validator->errors()->add('excerpt', 'المقتطف مطلوب عند النشر.');
            }
        });
    }
}
`.trim() },
    { t: 'tip', text: 'صنف الطلب يجمع **الصلاحية والتنظيف والتحقّق والرسائل** في مكان واحد قابل للاختبار وإعادة الاستخدام في `store` و `update`. هذا هو الأسلوب المتّبع في أي مشروع Laravel جادّ.' },

    { t: 'h2', text: 'أهمّ القواعد' },
    { t: 'table', head: ['الفئة', 'القواعد'], rows: [
      ['**الوجود**', '`required`, `nullable`, `filled`, `present`, `sometimes`'],
      ['**الشرطية**', '`required_if`, `required_unless`, `required_with`, `required_without`, `prohibited_if`'],
      ['**النوع**', '`string`, `integer`, `numeric`, `boolean`, `array`, `date`, `file`, `image`'],
      ['**الحجم**', '`min`, `max`, `size`, `between`, `digits`, `digits_between`'],
      ['**الصيغة**', '`email`, `url`, `active_url`, `ip`, `uuid`, `ulid`, `json`, `regex`, `alpha`, `alpha_dash`, `alpha_num`'],
      ['**القاعدة**', '`unique`, `exists`'],
      ['**المقارنة**', '`same`, `different`, `confirmed`, `gt`, `gte`, `lt`, `lte`, `in`, `not_in`'],
      ['**التاريخ**', '`after`, `before`, `after_or_equal`, `date_format`, `timezone`'],
      ['**الملفات**', '`mimes`, `mimetypes`, `dimensions`, `max` (بالكيلوبايت)'],
      ['**التحكّم**', '`bail`, `exclude`, `exclude_if`, `nullable`']
    ]},
    { t: 'code', lang: 'php', code: `
<?php
[
    // الوجود الشرطي
    'discount_code' => ['required_if:has_discount,true', 'string'],
    'shipping'      => ['required_unless:pickup,true', 'array'],
    'company_name'  => ['required_with:tax_number', 'string'],

    // المقارنة
    'password'              => ['required', 'confirmed', Password::defaults()],
    'password_confirmation' => [],                    // موجود تلقائياً مع confirmed
    'end_date'              => ['required', 'date', 'after:start_date'],
    'max_price'             => ['numeric', 'gte:min_price'],

    // فريد مع استثناء (مهمّ في التعديل)
    'email' => ['required', 'email', Rule::unique('users')->ignore($this->user()->id)],
    'slug'  => ['required', Rule::unique('posts')->where('site_id', $siteId)],

    // موجود مع شرط
    'category_id' => ['required', Rule::exists('categories', 'id')->where('is_active', true)],

    // قيم محدودة
    'role'   => ['required', Rule::in(['user', 'editor', 'admin'])],
    'status' => ['required', Rule::enum(OrderStatus::class)],

    // مصفوفات
    'items'            => ['required', 'array', 'min:1', 'max:20'],
    'items.*.id'       => ['required', 'integer', 'exists:products,id'],
    'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],

    // كائنات
    'address'      => ['required', 'array:city,street,postal_code'],
    'address.city' => ['required', 'string', 'max:60'],

    // تعبير نمطي
    'phone' => ['required', 'regex:/^05[0-9]{8}$/'],

    // bail: توقّف عند أول خطأ في هذا الحقل
    'email' => ['bail', 'required', 'email', 'unique:users'],
]
`.trim() },
    { t: 'warn', title: 'انتبه لترتيب `nullable`', text: 'ضع `nullable` **أولاً** دائماً. `[\'date\', \'nullable\']` قد يفشل على `null` لأن قاعدة `date` تُفحص قبل معرفة أن الحقل اختياري.' },

    { t: 'h2', text: 'كلمات المرور' },
    { t: 'code', lang: 'php', code: `
<?php
use Illuminate\\Validation\\Rules\\Password;

'password' => [
    'required',
    'confirmed',
    Password::min(10)
        ->letters()
        ->mixedCase()
        ->numbers()
        ->symbols()
        ->uncompromised(),        // يفحص قواعد كلمات المرور المسرّبة
],

// أو عرّف الافتراضي مرة واحدة في AppServiceProvider
Password::defaults(function () {
    return app()->isProduction()
        ? Password::min(10)->mixedCase()->numbers()->uncompromised()
        : Password::min(6);
});

// ثم في كل مكان
'password' => ['required', 'confirmed', Password::defaults()],
`.trim() },
    { t: 'note', text: '`uncompromised()` يستعلم قاعدة بيانات Have I Been Pwned بطريقة آمنة (لا تُرسَل كلمة المرور، بل أول خمسة أحرف من تجزئتها) ليرفض كلمات المرور التي ظهرت في تسريبات معروفة.' },

    { t: 'h2', text: 'رفع الملفات' },
    { t: 'code', lang: 'php', code: `
<?php
// القواعد
[
    'avatar' => [
        'required', 'image',
        'mimes:jpg,jpeg,png,webp',
        'max:2048',                                  // بالكيلوبايت = 2 ميغابايت
        'dimensions:min_width=200,min_height=200,ratio=1/1',
    ],
    'document' => ['required', 'file', 'mimes:pdf,docx', 'max:10240'],
    'gallery'   => ['array', 'max:8'],
    'gallery.*' => ['image', 'max:2048'],
]
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
public function store(StoreProductRequest $request)
{
    $data = $request->validated();

    if ($request->hasFile('image')) {
        // التخزين — يولّد اسماً فريداً تلقائياً
        $data['image_path'] = $request->file('image')->store('products', 'public');

        // أو باسم مخصّص
        $data['image_path'] = $request->file('image')
            ->storeAs('products', Str::uuid() . '.' . $request->file('image')->extension(), 'public');
    }

    $product = Product::create($data);

    // ملفات متعدّدة
    foreach ($request->file('gallery', []) as $index => $file) {
        $product->images()->create([
            'path'       => $file->store('products/gallery', 'public'),
            'sort_order' => $index,
        ]);
    }

    return to_route('products.show', $product);
}
`.trim() },
    { t: 'danger', title: 'لا تثق بامتداد الملف ولا بنوع MIME المُرسَل', text: 'قاعدة `mimes` تفحص المحتوى الفعلي لا الاسم، وهذا هو الصحيح. لكن **لا تخزّن الملفات المرفوعة في `public/` مباشرة**: استخدم قرص `public` عبر `storage/` مع رابط رمزي (`php artisan storage:link`)، ولا تسمح أبداً برفع `.php` أو `.phtml` أو `.htaccess`.' },
    { t: 'code', lang: 'php', code: `
<?php
// عرض الصورة
asset('storage/' . $product->image_path);
Storage::disk('public')->url($product->image_path);

// الحذف
Storage::disk('public')->delete($product->image_path);

// التحقّق من الوجود والحجم
Storage::disk('public')->exists($path);
Storage::disk('public')->size($path);
`.trim() },

    { t: 'h2', text: 'القواعد المخصّصة' },
    { t: 'code', lang: 'bash', code: `
php artisan make:rule ValidSaudiPhone
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
namespace App\\Rules;

use Closure;
use Illuminate\\Contracts\\Validation\\ValidationRule;

class ValidSaudiPhone implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $normalized = preg_replace('/\\D/', '', (string) $value);

        $valid = preg_match('/^(966|0)?5[0-9]{8}$/', $normalized);

        if (! $valid) {
            $fail('حقل :attribute يجب أن يكون رقم جوّال سعودي صحيح.');
        }
    }
}

// الاستخدام
'phone' => ['required', new ValidSaudiPhone()],
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// قاعدة تحتاج اعتماديات
class HasEnoughStock implements ValidationRule
{
    public function __construct(private readonly int $productId)
    {
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $product = Product::find($this->productId);

        if (! $product) {
            $fail('المنتج غير موجود.');
            return;
        }

        if ($product->stock < (int) $value) {
            $fail("الكمية المطلوبة غير متوفّرة — المتاح {$product->stock} فقط.");
        }
    }
}

// قاعدة مضمّنة سريعة
'title' => [
    'required',
    function (string $attribute, mixed $value, Closure $fail) {
        if (str_contains(strtolower($value), 'spam')) {
            $fail('العنوان يحتوي كلمات ممنوعة.');
        }
    },
],
`.trim() },

    { t: 'h2', text: 'الترجمة والرسائل' },
    { t: 'code', lang: 'php', code: `
<?php
// lang/ar/validation.php
return [
    'required' => 'حقل :attribute مطلوب.',
    'email'    => 'حقل :attribute يجب أن يكون بريداً إلكترونياً صحيحاً.',
    'min'      => [
        'string'  => 'حقل :attribute يجب ألّا يقلّ عن :min أحرف.',
        'numeric' => 'حقل :attribute يجب ألّا يقلّ عن :min.',
        'array'   => 'حقل :attribute يجب أن يحوي :min عناصر على الأقل.',
    ],
    'unique'   => 'قيمة :attribute مستخدمة من قبل.',
    'confirmed'=> 'تأكيد :attribute غير مطابق.',

    // رسائل لحقل معيّن
    'custom' => [
        'password' => [
            'min' => 'كلمة المرور قصيرة جداً — ١٠ أحرف على الأقل.',
        ],
    ],

    // أسماء الحقول
    'attributes' => [
        'name'     => 'الاسم',
        'email'    => 'البريد الإلكتروني',
        'password' => 'كلمة المرور',
        'title'    => 'العنوان',
        'body'     => 'المحتوى',
    ],
];
`.trim() },
    { t: 'code', lang: 'bash', code: `
# .env
APP_LOCALE=ar
APP_FALLBACK_LOCALE=en

# نزّل ملفات الترجمة العربية الجاهزة
composer require laravel-lang/common --dev
php artisan lang:add ar
`.trim() },

    { t: 'h2', text: 'عرض الأخطاء' },
    { t: 'code', lang: 'blade', code: `
{{-- خطأ حقل واحد --}}
@error('title')
    <p class="error">{{ $message }}</p>
@enderror

{{-- كل الأخطاء --}}
@if ($errors->any())
    <div class="errors">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

{{-- استعلامات --}}
{{ $errors->has('title') ? 'حقل به خطأ' : '' }}
{{ $errors->first('title') }}
{{ $errors->get('items.*') }}
{{ $errors->count() }}

{{-- أخطاء من نموذج مسمّى --}}
@error('email', 'login')  <p>{{ $message }}</p>  @enderror
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// نماذج متعدّدة في صفحة واحدة
$request->validateWithBag('newsletter', [
    'email' => ['required', 'email'],
]);

// في العرض: @error('email', 'newsletter')
`.trim() },

    { t: 'h2', text: 'استجابة API' },
    { t: 'code', lang: 'json', code: `
{
  "message": "حقل العنوان مطلوب. (و ١ خطأ آخر)",
  "errors": {
    "title": ["حقل العنوان مطلوب."],
    "body":  ["حقل المحتوى يجب ألّا يقلّ عن ٥٠ أحرف."]
  }
}
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// تخصيص استجابة الفشل في صنف الطلب
protected function failedValidation(Validator $validator): void
{
    throw new HttpResponseException(
        response()->json([
            'status'  => 'error',
            'message' => 'البيانات المُرسَلة غير صالحة.',
            'errors'  => $validator->errors(),
        ], 422)
    );
}
`.trim() },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'نظام تحقّق كامل لتسجيل مقدّم خدمة',
      brief: 'ابنِ نموذج تسجيل معقّداً بتحقّق شامل ورسائل عربية وقواعد مخصّصة ورفع ملفات.',
      requirements: [
        '**البيانات الشخصية**: اسم كامل (عربي فقط)، بريد فريد، جوّال سعودي، كلمة مرور قوية مؤكّدة، تاريخ ميلاد (18 سنة فأكثر).',
        '**بيانات النشاط**: اسم النشاط، رقم السجلّ التجاري (10 أرقام)، الرقم الضريبي (15 رقماً يبدأ بـ 3)، نوع النشاط من قائمة، المدينة، وصف (50–1000 حرف).',
        '**الخدمات**: مصفوفة من 1 إلى 10 خدمات، كل خدمة: اسم، سعر (يجب أن يكون أقلّ من سعر السقف)، مدّة بالدقائق، وصف اختياري.',
        '**الملفات**: شعار (صورة مربّعة 400×400 على الأقل)، صورة غلاف، ونسخة من السجلّ التجاري (PDF ≤ 5 ميغابايت)، ومعرض من 8 صور كحدّ أقصى.',
        '**شروط**: الموافقة على الشروط إلزامية، والحقول البنكية مطلوبة فقط إن اختار "استقبال المدفوعات".',
        'اكتب قواعد مخصّصة: `SaudiPhone`, `CommercialRegister`, `VatNumber`, `ArabicText`, `NotDisposableEmail`.',
        'نظّف المدخلات في `prepareForValidation`: إزالة الفراغات، توحيد الأرقام العربية إلى إنجليزية، تطبيع رقم الجوّال.',
        'أضف تحقّقاً بعدياً في `withValidator`: مجموع مدد الخدمات لا يتجاوز 8 ساعات، ولا تتكرّر أسماء الخدمات.',
        'رسائل عربية كاملة وأسماء حقول عربية، وترتيب `bail` حيث يفيد.',
        'اكتب المتحكّم الذي يستقبل الطلب، يخزّن الملفات بأمان، وينشئ السجلّات في معاملة واحدة.',
        'اكتب اختبارات تغطّي: النجاح، وكل قاعدة مخصّصة، والحالات الحدّية.'
      ],
      hints: [
        '`preg_replace(\'/[٠-٩]/u\', ...)` لتحويل الأرقام العربية.',
        '`Rule::unique(\'users\')->ignore($id)` مهمّة في التعديل.',
        '`before_or_equal:' + '-18 years' + '` للتحقّق من العمر.',
        '`$validator->after(...)` للتحقّق الذي يحتاج عدة حقول معاً.'
      ],
      solution: { lang: 'php', code: `
<?php
// ═══════════════════════════════════════════════
// app/Rules/SaudiPhone.php
// ═══════════════════════════════════════════════
namespace App\\Rules;

use Closure;
use Illuminate\\Contracts\\Validation\\ValidationRule;

class SaudiPhone implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $digits = preg_replace('/\\D/', '', (string) $value);
        $digits = preg_replace('/^(966|00966)/', '0', $digits);

        if (! preg_match('/^05[0-9]{8}$/', $digits)) {
            $fail('حقل :attribute يجب أن يكون رقم جوّال سعودي صحيح يبدأ بـ 05.');
        }
    }
}

// ═══════════════════════════════════════════════
// app/Rules/CommercialRegister.php
// ═══════════════════════════════════════════════
class CommercialRegister implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $digits = preg_replace('/\\D/', '', (string) $value);

        if (strlen($digits) !== 10) {
            $fail('رقم السجلّ التجاري يجب أن يتكوّن من ١٠ أرقام.');
            return;
        }

        if (! in_array($digits[0], ['1', '2', '3', '4', '7'], true)) {
            $fail('رقم السجلّ التجاري غير صالح — بداية غير معروفة.');
        }
    }
}

// ═══════════════════════════════════════════════
// app/Rules/VatNumber.php
// ═══════════════════════════════════════════════
class VatNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $digits = preg_replace('/\\D/', '', (string) $value);

        if (strlen($digits) !== 15) {
            $fail('الرقم الضريبي يجب أن يتكوّن من ١٥ رقماً.');
            return;
        }

        if (! str_starts_with($digits, '3') || ! str_ends_with($digits, '3')) {
            $fail('الرقم الضريبي يجب أن يبدأ وينتهي بالرقم ٣.');
        }
    }
}

// ═══════════════════════════════════════════════
// app/Rules/ArabicText.php
// ═══════════════════════════════════════════════
class ArabicText implements ValidationRule
{
    public function __construct(private readonly bool $allowNumbers = false)
    {
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $pattern = $this->allowNumbers
            ? '/^[\\p{Arabic}\\s0-9\\-\\.]+$/u'
            : '/^[\\p{Arabic}\\s]+$/u';

        if (! preg_match($pattern, (string) $value)) {
            $fail('حقل :attribute يجب أن يُكتب بالعربية فقط.');
        }
    }
}

// ═══════════════════════════════════════════════
// app/Rules/NotDisposableEmail.php
// ═══════════════════════════════════════════════
class NotDisposableEmail implements ValidationRule
{
    private const BLOCKED = [
        'mailinator.com', 'tempmail.com', '10minutemail.com',
        'guerrillamail.com', 'yopmail.com', 'throwaway.email',
    ];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $domain = strtolower((string) substr(strrchr((string) $value, '@') ?: '', 1));

        if (in_array($domain, self::BLOCKED, true)) {
            $fail('لا نقبل التسجيل ببريد مؤقّت — استخدم بريداً دائماً.');
        }
    }
}

// ═══════════════════════════════════════════════
// app/Http/Requests/RegisterProviderRequest.php
// ═══════════════════════════════════════════════
namespace App\\Http\\Requests;

use App\\Rules\\{SaudiPhone, CommercialRegister, VatNumber, ArabicText, NotDisposableEmail};
use Illuminate\\Foundation\\Http\\FormRequest;
use Illuminate\\Validation\\Rule;
use Illuminate\\Validation\\Rules\\Password;
use Illuminate\\Validation\\Validator;

class RegisterProviderRequest extends FormRequest
{
    private const MAX_TOTAL_MINUTES = 480;   // 8 ساعات

    public function authorize(): bool
    {
        return true;   // التسجيل مفتوح للجميع
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name'         => $this->cleanText($this->name),
            'business_name'=> $this->cleanText($this->business_name),
            'email'        => strtolower(trim((string) $this->email)),
            'phone'        => $this->normalizeDigits($this->phone),
            'cr_number'    => $this->normalizeDigits($this->cr_number),
            'vat_number'   => $this->normalizeDigits($this->vat_number),
            'iban'         => strtoupper(str_replace(' ', '', (string) $this->iban)),
            'services'     => $this->normalizeServices(),
        ]);
    }

    public function rules(): array
    {
        return [
            /* ── البيانات الشخصية ── */
            'name'  => ['bail', 'required', 'string', 'min:5', 'max:80', new ArabicText()],
            'email' => [
                'bail', 'required', 'email:rfc,dns', 'max:120',
                Rule::unique('users', 'email'),
                new NotDisposableEmail(),
            ],
            'phone' => [
                'bail', 'required', new SaudiPhone(),
                Rule::unique('users', 'phone'),
            ],
            'password'  => ['required', 'confirmed', Password::defaults()],
            'birthdate' => [
                'required', 'date', 'before_or_equal:' . now()->subYears(18)->toDateString(),
                'after:' . now()->subYears(100)->toDateString(),
            ],

            /* ── بيانات النشاط ── */
            'business_name' => ['required', 'string', 'min:3', 'max:120'],
            'cr_number'     => ['bail', 'required', new CommercialRegister(), Rule::unique('providers', 'cr_number')],
            'vat_number'    => ['nullable', new VatNumber()],
            'business_type' => ['required', Rule::in(['salon', 'clinic', 'gym', 'spa', 'training'])],
            'city'          => ['required', 'string', 'max:60', Rule::exists('cities', 'name')],
            'district'      => ['nullable', 'string', 'max:80'],
            'description'   => ['required', 'string', 'min:50', 'max:1000'],
            'website'       => ['nullable', 'url', 'max:200'],

            /* ── الخدمات ── */
            'services'               => ['required', 'array', 'min:1', 'max:10'],
            'services.*.name'        => ['required', 'string', 'min:3', 'max:80'],
            'services.*.price'       => ['required', 'numeric', 'min:1', 'max:50000'],
            'services.*.duration'    => ['required', 'integer', 'min:15', 'max:480'],
            'services.*.description' => ['nullable', 'string', 'max:300'],

            /* ── الملفات ── */
            'logo' => [
                'required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048',
                'dimensions:min_width=400,min_height=400,ratio=1/1',
            ],
            'cover' => [
                'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096',
                'dimensions:min_width=1200,min_height=400',
            ],
            'cr_document' => ['required', 'file', 'mimes:pdf', 'max:5120'],
            'gallery'     => ['nullable', 'array', 'max:8'],
            'gallery.*'   => ['image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],

            /* ── المدفوعات ── */
            'accepts_payments' => ['required', 'boolean'],
            'bank_name'        => ['required_if:accepts_payments,true', 'nullable', 'string', 'max:80'],
            'iban'             => ['required_if:accepts_payments,true', 'nullable', 'string', 'regex:/^SA\\d{22}$/'],
            'account_holder'   => ['required_if:accepts_payments,true', 'nullable', 'string', 'max:80'],

            /* ── الشروط ── */
            'terms_accepted' => ['required', 'accepted'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $services = (array) $this->services;

            // 1) مجموع المدد
            $total = array_sum(array_column($services, 'duration'));

            if ($total > self::MAX_TOTAL_MINUTES) {
                $hours = round($total / 60, 1);
                $validator->errors()->add(
                    'services',
                    "مجموع مدد الخدمات {$hours} ساعة — الحدّ الأقصى ٨ ساعات."
                );
            }

            // 2) تكرار الأسماء
            $names = array_map(
                fn ($s) => mb_strtolower(trim((string) ($s['name'] ?? ''))),
                $services
            );

            foreach (array_count_values(array_filter($names)) as $name => $count) {
                if ($count > 1) {
                    $validator->errors()->add('services', "اسم الخدمة «{$name}» مكرّر.");
                }
            }

            // 3) الرقم الضريبي إلزامي لمن يستقبل المدفوعات
            if ($this->boolean('accepts_payments') && blank($this->vat_number)) {
                $validator->errors()->add(
                    'vat_number',
                    'الرقم الضريبي مطلوب لاستقبال المدفوعات.'
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'name.min'                => 'الاسم الكامل قصير جداً.',
            'email.unique'            => 'هذا البريد مسجَّل لدينا — سجّل الدخول بدلاً من ذلك.',
            'phone.unique'            => 'رقم الجوّال مسجَّل لدينا مسبقاً.',
            'birthdate.before_or_equal' => 'يجب أن يكون عمرك ١٨ سنة فأكثر للتسجيل.',
            'description.min'         => 'وصف النشاط يجب ألّا يقلّ عن ٥٠ حرفاً.',
            'services.min'            => 'أضف خدمة واحدة على الأقل.',
            'services.max'            => 'الحدّ الأقصى عشر خدمات في التسجيل الأوّلي.',
            'logo.dimensions'         => 'الشعار يجب أن يكون مربّعاً وبأبعاد ٤٠٠×٤٠٠ على الأقل.',
            'cover.dimensions'        => 'صورة الغلاف يجب ألّا تقلّ عن ١٢٠٠×٤٠٠ بكسل.',
            'cr_document.mimes'       => 'السجلّ التجاري يجب أن يكون بصيغة PDF.',
            'iban.regex'              => 'الآيبان يجب أن يبدأ بـ SA يليه ٢٢ رقماً.',
            'terms_accepted.accepted' => 'يجب الموافقة على الشروط والأحكام للمتابعة.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name'           => 'الاسم الكامل',
            'email'          => 'البريد الإلكتروني',
            'phone'          => 'رقم الجوّال',
            'password'       => 'كلمة المرور',
            'birthdate'      => 'تاريخ الميلاد',
            'business_name'  => 'اسم النشاط',
            'cr_number'      => 'السجلّ التجاري',
            'vat_number'     => 'الرقم الضريبي',
            'business_type'  => 'نوع النشاط',
            'city'           => 'المدينة',
            'description'    => 'وصف النشاط',
            'services'       => 'الخدمات',
            'logo'           => 'الشعار',
            'cover'          => 'صورة الغلاف',
            'cr_document'    => 'وثيقة السجلّ التجاري',
            'gallery'        => 'معرض الصور',
            'iban'           => 'الآيبان',
            'terms_accepted' => 'الشروط والأحكام',
        ];
    }

    /* ══════════════ أدوات التنظيف ══════════════ */

    private function cleanText(?string $value): ?string
    {
        return $value === null ? null : preg_replace('/\\s+/u', ' ', trim($value));
    }

    private function normalizeDigits(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $arabic  = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
        $persian = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        $english = ['0','1','2','3','4','5','6','7','8','9'];

        $value = str_replace($arabic, $english, $value);
        $value = str_replace($persian, $english, $value);

        return preg_replace('/[\\s\\-()]/', '', $value);
    }

    private function normalizeServices(): array
    {
        return collect((array) $this->services)
            ->filter(fn ($s) => filled($s['name'] ?? null))
            ->map(fn ($s) => [
                'name'        => $this->cleanText($s['name'] ?? ''),
                'price'       => (float) $this->normalizeDigits((string) ($s['price'] ?? 0)),
                'duration'    => (int) $this->normalizeDigits((string) ($s['duration'] ?? 0)),
                'description' => $this->cleanText($s['description'] ?? null),
            ])
            ->values()
            ->all();
    }
}

// ═══════════════════════════════════════════════
// app/Http/Controllers/ProviderRegistrationController.php
// ═══════════════════════════════════════════════
namespace App\\Http\\Controllers;

use App\\Http\\Requests\\RegisterProviderRequest;
use App\\Models\\{User, Provider, Service};
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\Support\\Facades\\{DB, Hash, Storage};

class ProviderRegistrationController extends Controller
{
    public function store(RegisterProviderRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $provider = DB::transaction(function () use ($request, $data) {
            // 1) المستخدم
            $user = User::create([
                'name'      => $data['name'],
                'email'     => $data['email'],
                'phone'     => $data['phone'],
                'password'  => Hash::make($data['password']),
                'birthdate' => $data['birthdate'],
                'role'      => 'provider',
            ]);

            // 2) الملفات — على قرص public عبر storage، لا في public/ مباشرة
            $paths = [
                'logo_path'  => $request->file('logo')->store('providers/logos', 'public'),
                'cover_path' => $request->file('cover')?->store('providers/covers', 'public'),
                'cr_path'    => $request->file('cr_document')->store('providers/documents', 'private'),
            ];

            // 3) النشاط
            $provider = $user->provider()->create([
                'business_name'    => $data['business_name'],
                'cr_number'        => $data['cr_number'],
                'vat_number'       => $data['vat_number'] ?? null,
                'business_type'    => $data['business_type'],
                'city'             => $data['city'],
                'district'         => $data['district'] ?? null,
                'description'      => $data['description'],
                'website'          => $data['website'] ?? null,
                'accepts_payments' => $data['accepts_payments'],
                'bank_name'        => $data['bank_name'] ?? null,
                'iban'             => $data['iban'] ?? null,
                'account_holder'   => $data['account_holder'] ?? null,
                'status'           => 'pending_review',
                ...$paths,
            ]);

            // 4) الخدمات
            $provider->services()->createMany($data['services']);

            // 5) المعرض
            foreach ($request->file('gallery', []) as $index => $file) {
                $provider->images()->create([
                    'path'       => $file->store('providers/gallery', 'public'),
                    'sort_order' => $index,
                ]);
            }

            return $provider;
        });

        return to_route('providers.pending')
            ->with('success', 'تمّ استلام طلبك بنجاح — سنراجعه خلال ٤٨ ساعة.');
    }
}

// ═══════════════════════════════════════════════
// tests/Feature/ProviderRegistrationTest.php
// ═══════════════════════════════════════════════
use App\\Models\\User;
use Illuminate\\Http\\UploadedFile;
use Illuminate\\Support\\Facades\\Storage;

beforeEach(function () {
    Storage::fake('public');
    Storage::fake('private');
});

function validPayload(array $overrides = []): array
{
    return array_merge([
        'name'          => 'عبدالله محمد القحطاني',
        'email'         => 'provider@example.com',
        'phone'         => '0551234567',
        'password'      => 'SecurePass123!',
        'password_confirmation' => 'SecurePass123!',
        'birthdate'     => '1995-05-20',
        'business_name' => 'صالون النخبة',
        'cr_number'     => '1010123456',
        'vat_number'    => '300012345678903',
        'business_type' => 'salon',
        'city'          => 'الرياض',
        'description'   => str_repeat('وصف تفصيلي للنشاط التجاري وخدماته المقدّمة. ', 3),
        'services'      => [
            ['name' => 'قصّ شعر', 'price' => 80,  'duration' => 45],
            ['name' => 'صبغة',    'price' => 250, 'duration' => 120],
        ],
        'logo'          => UploadedFile::fake()->image('logo.jpg', 500, 500),
        'cr_document'   => UploadedFile::fake()->create('cr.pdf', 1000, 'application/pdf'),
        'accepts_payments' => false,
        'terms_accepted'   => true,
    ], $overrides);
}

it('يسجّل مقدّم خدمة ببيانات صحيحة', function () {
    $response = $this->post(route('providers.register'), validPayload());

    $response->assertRedirect(route('providers.pending'));
    $this->assertDatabaseHas('users',     ['email' => 'provider@example.com']);
    $this->assertDatabaseHas('providers', ['cr_number' => '1010123456']);
    $this->assertDatabaseCount('services', 2);
});

it('يرفض رقم جوّال غير سعودي', function () {
    $this->post(route('providers.register'), validPayload(['phone' => '0712345678']))
         ->assertSessionHasErrors('phone');
});

it('يرفض سجلاً تجارياً بعدد أرقام خاطئ', function () {
    $this->post(route('providers.register'), validPayload(['cr_number' => '12345']))
         ->assertSessionHasErrors('cr_number');
});

it('يرفض البريد المؤقّت', function () {
    $this->post(route('providers.register'), validPayload(['email' => 'x@mailinator.com']))
         ->assertSessionHasErrors('email');
});

it('يرفض من هو دون الثامنة عشرة', function () {
    $this->post(route('providers.register'), validPayload([
        'birthdate' => now()->subYears(16)->toDateString(),
    ]))->assertSessionHasErrors('birthdate');
});

it('يرفض تجاوز مجموع مدد الخدمات ثماني ساعات', function () {
    $this->post(route('providers.register'), validPayload([
        'services' => [
            ['name' => 'خدمة أولى', 'price' => 100, 'duration' => 300],
            ['name' => 'خدمة ثانية', 'price' => 100, 'duration' => 300],
        ],
    ]))->assertSessionHasErrors('services');
});

it('يرفض تكرار أسماء الخدمات', function () {
    $this->post(route('providers.register'), validPayload([
        'services' => [
            ['name' => 'قصّ شعر', 'price' => 80, 'duration' => 45],
            ['name' => 'قصّ شعر', 'price' => 90, 'duration' => 45],
        ],
    ]))->assertSessionHasErrors('services');
});

it('يطلب الآيبان عند اختيار استقبال المدفوعات', function () {
    $this->post(route('providers.register'), validPayload([
        'accepts_payments' => true,
    ]))->assertSessionHasErrors(['iban', 'bank_name', 'account_holder']);
});

it('يرفض شعاراً غير مربّع', function () {
    $this->post(route('providers.register'), validPayload([
        'logo' => UploadedFile::fake()->image('logo.jpg', 800, 400),
    ]))->assertSessionHasErrors('logo');
});

it('يحوّل الأرقام العربية في رقم الجوّال', function () {
    $this->post(route('providers.register'), validPayload([
        'phone' => '٠٥٥١٢٣٤٥٦٨',
    ]))->assertSessionDoesntHaveErrors('phone');
});
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'ما ميزة صنف الطلب على `$request->validate()`؟', options: ['أسرع', 'يجمع الصلاحية والتنظيف والتحقّق والرسائل في مكان واحد قابل لإعادة الاستخدام والاختبار', 'إلزامي', 'يقبل قواعد أكثر'], answer: 1,
        explain: 'ويُستخدم في `store` و `update` معاً، ويبقي المتحكّم نظيفاً.' },
      { q: 'لماذا نضع `nullable` أولاً في مصفوفة القواعد؟', options: ['اصطلاح', 'لأن القواعد تُفحص بالترتيب، فقاعدة مثل `date` قد تفشل على null قبل معرفة أنه اختياري', 'أسرع', 'لا يهمّ'], answer: 1,
        explain: 'وترتيب `bail` أولاً يوقف بقيّة قواعد الحقل عند أول فشل.' },
      { q: 'ما وظيفة `Rule::unique(\'users\')->ignore($id)`؟', options: ['يتجاهل التحقّق', 'يتحقّق من التفرّد مع استثناء السجلّ الحالي — ضروري في التعديل', 'يحذف المكرّر', 'يعطّل القاعدة'], answer: 1,
        explain: 'بدونه يفشل تعديل المستخدم لأن بريده «مستخدم من قبل» — من قِبله هو.' },
      { q: 'ما فائدة `prepareForValidation()`؟', options: ['يعرض الأخطاء', 'ينظّف ويطبّع المدخلات قبل تطبيق القواعد', 'يحفظ البيانات', 'يفحص الصلاحية'], answer: 1,
        explain: 'مثالي لتوحيد الأرقام العربية وتنظيف الفراغات وتوليد slug.' },
      { q: 'ما الفرق بين `messages()` و `attributes()`؟', options: ['لا فرق', '`messages` تخصّص نصّ الرسالة كاملاً، و`attributes` تترجم اسم الحقل داخل الرسائل الافتراضية', 'العكس', 'الثانية للأخطاء'], answer: 1,
        explain: '`attributes` أوفر: تكتب اسم الحقل مرة واحدة فيظهر عربياً في كل رسائله.' },
      { q: 'أين تخزّن الملفات المرفوعة؟', options: ['في `public/` مباشرة', 'في `storage/app/public` مع رابط رمزي، أو قرص خاص للوثائق الحسّاسة', 'في قاعدة البيانات', 'في `resources/`'], answer: 1,
        explain: '`php artisan storage:link` ينشئ الرابط، والوثائق الحسّاسة تُخزَّن على قرص غير عام تماماً.' },
      { q: 'متى تستخدم `$validator->after()`؟', options: ['دائماً', 'للتحقّق الذي يحتاج عدة حقول معاً أو منطق عمل لا تعبّر عنه قاعدة واحدة', 'للرسائل', 'للملفات'], answer: 1,
        explain: 'مثل التأكّد أن مجموع القيم لا يتجاوز حدّاً، أو أن الحقول لا تتعارض.' }
    ]}
  ]
};
