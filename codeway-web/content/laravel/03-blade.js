'use strict';

module.exports = {
  slug: '03-blade',
  title: 'قوالب Blade',
  summary: 'صياغة Blade والتعليمات الشرطية والحلقات، وراثة القوالب والأجزاء والمكوّنات، والنماذج والرسائل.',
  duration: 55,
  level: 'مبتدئ',
  tags: ['Blade', 'قوالب', 'مكوّنات'],
  objectives: [
    'تكتب قوالب Blade وتفهم الهروب التلقائي.',
    'تستخدم التعليمات الشرطية والحلقات ومتغيّر `$loop`.',
    'تبني تخطيطاً أساسياً وترث منه بـ `@extends` و `@section`.',
    'تنشئ مكوّنات قابلة لإعادة الاستخدام مع خصائص وفتحات.',
    'تعرض رسائل النجاح والأخطاء بشكل موحّد.',
    'تحمي قوالبك من ثغرات XSS.'
  ],
  quickRef: [
    { code: '{{ $x }}', desc: 'طباعة مع هروب' },
    { code: '{!! $x !!}', desc: 'بلا هروب — احذر' },
    { code: '@if / @endif', desc: 'شرط' },
    { code: '@foreach / $loop', desc: 'حلقة' },
    { code: '@extends / @section', desc: 'وراثة' },
    { code: '@include', desc: 'جزء' },
    { code: '<x-alert />', desc: 'مكوّن' },
    { code: '@csrf', desc: 'رمز الحماية' }
  ],
  blocks: [
    { t: 'h2', text: 'الأساسيات' },
    { t: 'code', lang: 'blade', code: `
{{-- تعليق Blade — لا يظهر في HTML الناتج --}}
<!-- تعليق HTML — يظهر في المصدر -->

{{ $name }}                        {{-- مهروب تلقائياً --}}
{{ $user->name }}
{{ $post->title ?? 'بلا عنوان' }}
{{ strtoupper($name) }}
{{ number_format($price, 2) }} ر.س

{!! $trustedHtml !!}               {{-- بلا هروب --}}

@{{ notBlade }}                    {{-- للأطر الأمامية مثل Vue --}}
`.trim() },
    { t: 'danger', title: '`{!! !!}` مع محتوى المستخدم = ثغرة XSS', text: 'لو كان `$comment` قادماً من مستخدم واحتوى `<script>` فسيُنفَّذ في متصفّح كل زائر. استخدم `{{ }}` دائماً، وإن احتجت HTML من المستخدم فنظّفه بمكتبة مثل HTMLPurifier بقائمة وسوم مسموحة.' },

    { t: 'h2', text: 'الشروط' },
    { t: 'code', lang: 'blade', code: `
@if ($post->published)
    <span class="badge">منشور</span>
@elseif ($post->scheduled_at)
    <span class="badge">مجدول</span>
@else
    <span class="badge">مسوّدة</span>
@endif

@unless (auth()->check())
    <a href="{{ route('login') }}">سجّل الدخول</a>
@endunless

@isset($user->bio)   <p>{{ $user->bio }}</p>   @endisset
@empty($posts)       <p>لا توجد مقالات.</p>    @endempty

@auth   <p>مرحباً {{ auth()->user()->name }}</p>   @endauth
@guest  <a href="{{ route('register') }}">أنشئ حساباً</a>   @endguest

@can('update', $post)   <a href="{{ route('posts.edit', $post) }}">تعديل</a>   @endcan
@cannot('delete', $post) <span>لا تملك صلاحية الحذف</span>  @endcannot

@production  <script src="/analytics.js"></script>  @endproduction
@env('local') <div class="debug">وضع التطوير</div>  @endenv

@switch($order->status)
    @case('pending')   <span>قيد الانتظار</span>  @break
    @case('shipped')   <span>قيد الشحن</span>     @break
    @case('delivered') <span>تمّ التسليم</span>   @break
    @default           <span>غير معروف</span>
@endswitch
`.trim() },

    { t: 'h2', text: 'الحلقات' },
    { t: 'code', lang: 'blade', code: `
@foreach ($posts as $post)
    <article>{{ $post->title }}</article>
@endforeach

{{-- forelse يتعامل مع الحالة الفارغة --}}
@forelse ($posts as $post)
    <article>{{ $post->title }}</article>
@empty
    <p class="empty">لا توجد مقالات بعد.</p>
@endforelse

@for ($i = 1; $i <= 5; $i++)  <span>{{ $i }}</span>  @endfor

@while ($queue->hasItems())  {{ $queue->pop() }}  @endwhile

{{-- التحكّم بالحلقة --}}
@foreach ($users as $user)
    @continue($user->is_banned)
    @break($loop->iteration > 10)

    <li>{{ $user->name }}</li>
@endforeach
`.trim() },
    { t: 'h3', text: 'متغيّر $loop' },
    { t: 'code', lang: 'blade', code: `
@foreach ($items as $item)
    <tr class="{{ $loop->even ? 'stripe' : '' }}">
        <td>{{ $loop->iteration }}</td>       {{-- يبدأ من 1 --}}
        <td>{{ $item->name }}</td>

        @if ($loop->first)  <td>الأول</td>   @endif
        @if ($loop->last)   <td>الأخير</td>  @endif
    </tr>
@endforeach
`.trim() },
    { t: 'table', head: ['الخاصية', 'المعنى'], rows: [
      ['`$loop->index`', 'الفهرس من 0'],
      ['`$loop->iteration`', 'العدّاد من 1'],
      ['`$loop->remaining`', 'المتبقّي'],
      ['`$loop->count`', 'العدد الكلي'],
      ['`$loop->first` / `last`', 'أول/آخر عنصر'],
      ['`$loop->even` / `odd`', 'زوجي/فردي'],
      ['`$loop->depth`', 'عمق التداخل'],
      ['`$loop->parent`', 'حلقة الأب عند التداخل']
    ]},

    { t: 'h2', text: 'وراثة القوالب' },
    { t: 'code', lang: 'blade', code: `
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'الرئيسية') — {{ config('app.name') }}</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('styles')
</head>
<body>
    @include('partials.header')

    <main class="container">
        @include('partials.flash')

        @yield('content')
    </main>

    @include('partials.footer')

    @stack('scripts')
</body>
</html>
`.trim() },
    { t: 'code', lang: 'blade', code: `
{{-- resources/views/posts/show.blade.php --}}
@extends('layouts.app')

@section('title', $post->title)

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/prose.css') }}">
@endpush

@section('content')
    <article class="prose">
        <h1>{{ $post->title }}</h1>

        <div class="meta">
            {{ $post->author->name }} ·
            {{ $post->created_at->diffForHumans() }} ·
            {{ $post->reading_minutes }} دقائق قراءة
        </div>

        {{ $post->body }}
    </article>

    @include('posts.partials.comments', ['comments' => $post->comments])
@endsection

@push('scripts')
    <script src="{{ asset('js/comments.js') }}"></script>
@endpush
`.trim() },
    { t: 'table', head: ['التعليمة', 'الوظيفة'], rows: [
      ['`@yield(\'x\')`', 'مكان يملؤه الابن في التخطيط'],
      ['`@section(\'x\')`', 'محتوى يملأ ذلك المكان'],
      ['`@parent`', 'يضمّ محتوى القسم في التخطيط الأب'],
      ['`@stack` / `@push`', 'تراكم من عدة مصادر — مثالي للأنماط والسكربتات'],
      ['`@prepend`', 'يضيف في **بداية** الكومة'],
      ['`@hasSection(\'x\')`', 'يختبر وجود قسم']
    ]},

    { t: 'h2', text: 'الأجزاء (Includes)' },
    { t: 'code', lang: 'blade', code: `
@include('partials.header')
@include('posts.card', ['post' => $post, 'compact' => true])

@includeIf('partials.optional')                    {{-- لا يخطئ إن لم يوجد --}}
@includeWhen($user->isAdmin(), 'partials.admin-bar')
@includeUnless($post->published, 'partials.draft-notice')
@includeFirst(['custom.header', 'partials.header'])

{{-- عرض مجموعة كاملة --}}
@each('posts.card', $posts, 'post', 'posts.empty')
`.trim() },
    { t: 'note', text: 'الجزء يرث كل متغيّرات القالب الأب تلقائياً. هذا مريح لكنه يخفي التبعيات — لهذا تُفضَّل **المكوّنات** في الشيفرة الحديثة: تصرّح بما تحتاجه صراحةً.' },

    { t: 'h2', text: 'المكوّنات' },
    { t: 'code', lang: 'bash', code: `
php artisan make:component Alert
php artisan make:component Card --view      # مكوّن بلا صنف
`.trim() },
    { t: 'code', lang: 'php', code: `
<?php
// app/View/Components/Alert.php
namespace App\\View\\Components;

use Illuminate\\View\\Component;
use Illuminate\\View\\View;

class Alert extends Component
{
    public function __construct(
        public string $type = 'info',
        public ?string $title = null,
        public bool $dismissible = false,
    ) {
    }

    public function classes(): string
    {
        return match ($this->type) {
            'success' => 'bg-green-50 text-green-800 border-green-200',
            'error'   => 'bg-red-50 text-red-800 border-red-200',
            'warning' => 'bg-amber-50 text-amber-800 border-amber-200',
            default   => 'bg-blue-50 text-blue-800 border-blue-200',
        };
    }

    public function icon(): string
    {
        return match ($this->type) {
            'success' => '✓', 'error' => '✕', 'warning' => '⚠', default => 'ℹ',
        };
    }

    public function render(): View
    {
        return view('components.alert');
    }
}
`.trim() },
    { t: 'code', lang: 'blade', code: `
{{-- resources/views/components/alert.blade.php --}}
<div {{ $attributes->merge(['class' => "alert border rounded-lg p-4 {$classes()}"]) }}
     role="alert">
    <span class="icon">{{ $icon() }}</span>

    <div class="body">
        @if ($title)
            <strong class="block mb-1">{{ $title }}</strong>
        @endif

        {{ $slot }}
    </div>

    @if ($dismissible)
        <button type="button" onclick="this.closest('.alert').remove()">×</button>
    @endif
</div>
`.trim() },
    { t: 'code', lang: 'blade', code: `
{{-- الاستخدام --}}
<x-alert type="success" title="تمّ الحفظ">
    حُفِظ المقال بنجاح ويمكنك مشاهدته الآن.
</x-alert>

<x-alert type="error" :title="$errorTitle" dismissible>
    {{ $message }}
</x-alert>

{{-- تمرير متغيّر — لاحظ النقطتين --}}
<x-alert :type="$alert->type">{{ $alert->text }}</x-alert>

{{-- إضافة أصناف — تُدمج مع أصناف المكوّن --}}
<x-alert type="info" class="mt-6 shadow">…</x-alert>
`.trim() },
    { t: 'h3', text: 'الفتحات المسمّاة' },
    { t: 'code', lang: 'blade', code: `
{{-- components/card.blade.php --}}
<div {{ $attributes->merge(['class' => 'card']) }}>
    @isset($header)
        <div class="card-header">{{ $header }}</div>
    @endisset

    <div class="card-body">{{ $slot }}</div>

    @isset($footer)
        <div class="card-footer">{{ $footer }}</div>
    @endisset
</div>

{{-- الاستخدام --}}
<x-card class="mb-4">
    <x-slot:header>
        <h3>{{ $post->title }}</h3>
    </x-slot:header>

    <p>{{ $post->excerpt }}</p>

    <x-slot:footer>
        <a href="{{ route('posts.show', $post) }}">اقرأ المزيد ←</a>
    </x-slot:footer>
</x-card>
`.trim() },
    { t: 'h3', text: 'مكوّنات مضمّنة بلا صنف' },
    { t: 'code', lang: 'blade', code: `
{{-- resources/views/components/badge.blade.php --}}
@props(['color' => 'gray', 'size' => 'sm'])

@php
    $colors = [
        'gray'  => 'bg-gray-100 text-gray-700',
        'green' => 'bg-green-100 text-green-700',
        'red'   => 'bg-red-100 text-red-700',
    ];
@endphp

<span {{ $attributes->merge([
    'class' => "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium
                {$colors[$color]} " . ($size === 'lg' ? 'text-sm' : 'text-xs')
]) }}>
    {{ $slot }}
</span>

{{-- الاستخدام --}}
<x-badge color="green">منشور</x-badge>
<x-badge color="red" size="lg">محذوف</x-badge>
`.trim() },
    { t: 'tip', text: 'استخدم `@props` للمكوّنات البسيطة — لا تحتاج صنف PHP. أنشئ صنفاً فقط حين تحتاج منطقاً حقيقياً أو حقن اعتماديات.' },

    { t: 'h2', text: 'النماذج والرسائل' },
    { t: 'code', lang: 'blade', code: `
<form method="POST" action="{{ route('posts.update', $post) }}" enctype="multipart/form-data">
    @csrf                {{-- إلزامي لكل POST/PUT/PATCH/DELETE --}}
    @method('PUT')       {{-- لأن HTML لا يدعم PUT --}}

    <div class="field">
        <label for="title">العنوان</label>
        <input type="text" id="title" name="title"
               value="{{ old('title', $post->title) }}"
               class="@error('title') border-red-500 @enderror"
               required>
        @error('title')
            <p class="error">{{ $message }}</p>
        @enderror
    </div>

    <div class="field">
        <label for="body">المحتوى</label>
        <textarea id="body" name="body" rows="14">{{ old('body', $post->body) }}</textarea>
        @error('body') <p class="error">{{ $message }}</p> @enderror
    </div>

    <div class="field">
        <label>
            <input type="checkbox" name="published" value="1"
                   @checked(old('published', $post->published))>
            نشر فوراً
        </label>
    </div>

    <select name="category_id">
        @foreach ($categories as $category)
            <option value="{{ $category->id }}"
                    @selected(old('category_id', $post->category_id) === $category->id)>
                {{ $category->name }}
            </option>
        @endforeach
    </select>

    <button type="submit" @disabled($post->locked)>حفظ</button>
</form>
`.trim() },
    { t: 'danger', title: '`@csrf` ليس اختيارياً', text: 'بدونه يرفض Laravel الطلب بخطأ 419. الرمز يمنع **تزوير الطلبات عبر المواقع**: موقع خبيث يجعل متصفّح المستخدم يرسل طلباً لموقعك وهو مسجّل الدخول.' },
    { t: 'code', lang: 'blade', code: `
{{-- resources/views/partials/flash.blade.php --}}
@if (session('success'))
    <x-alert type="success" dismissible>{{ session('success') }}</x-alert>
@endif

@if (session('error'))
    <x-alert type="error" dismissible>{{ session('error') }}</x-alert>
@endif

@if ($errors->any())
    <x-alert type="error" title="تعذّر حفظ البيانات">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </x-alert>
@endif
`.trim() },
    { t: 'note', text: '`old()` تسترجع القيم المُدخَلة بعد فشل التحقّق، فلا يفقد المستخدم ما كتبه. استخدمها في **كل** حقل — نسيانها في حقل واحد يعني ضياعه عند كل خطأ.' },

    { t: 'h2', text: 'تعليمات مفيدة' },
    { t: 'code', lang: 'blade', code: `
@php
    $total = $items->sum('price');
@endphp

@class([
    'card',
    'card-featured' => $post->is_featured,
    'card-draft'    => ! $post->published,
])

@style(['color: red' => $hasError])

@json($data)                       {{-- آمن لتمرير بيانات لـ JS --}}
<script>const posts = @json($posts);</script>

@dd($variable)                     {{-- تنقيح --}}
@dump($variable)

@lang('messages.welcome')
{{ __('messages.welcome', ['name' => $user->name]) }}

@fragment('posts-list')            {{-- جزء قابل لإعادة العرض مع Turbo/HTMX --}}
    ...
@endfragment
`.trim() },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'مكتبة مكوّنات لمدوّنة',
      brief: 'ابنِ نظام قوالب كاملاً بمكوّنات قابلة لإعادة الاستخدام لواجهة مدوّنة عربية.',
      requirements: [
        'تخطيط أساسي `layouts.app` بـ RTL وخطّ عربي ورأس وتذييل وكومتي أنماط وسكربتات.',
        'مكوّن `<x-alert>` بأربعة أنواع وعنوان اختياري وإمكانية الإغلاق.',
        'مكوّن `<x-card>` بفتحات `header` و `footer` مسمّاة.',
        'مكوّن `<x-badge>` بألوان وأحجام، مضمّن بـ `@props` بلا صنف.',
        'مكوّن `<x-post-card>` يعرض مقالاً كاملاً: صورة، عنوان، مقتطف، كاتب، وسوم، زمن قراءة.',
        'مكوّن `<x-form.input>` و `<x-form.textarea>` يعرضان الأخطاء و `old()` تلقائياً.',
        'مكوّن `<x-pagination>` لترقيم الصفحات بالعربية.',
        'جزء `partials.flash` يعرض كل رسائل الجلسة والأخطاء بشكل موحّد.',
        'صفحة `posts.index` تستخدم `@forelse` مع حالة فارغة أنيقة.',
        'صفحة `posts.show` مع تعليقات ونموذج إضافة تعليق كامل بـ `@csrf` و `old()`.',
        'لا تستخدم `{!! !!}` مع أي محتوى من المستخدم.'
      ],
      hints: [
        '`$attributes->merge([...])` يدمج الأصناف الممرّرة مع أصناف المكوّن.',
        '`@props([\'color\' => \'gray\'])` يعرّف الخصائص في المكوّنات المضمّنة.',
        '`$errors->has($name)` لمعرفة إن كان الحقل به خطأ.',
        '`$attributes->whereStartsWith(\'wire:\')` لتمرير سمات محدّدة.'
      ],
      solution: { lang: 'blade', code: `
{{-- ═══════════════════════════════════════════ --}}
{{-- resources/views/components/badge.blade.php --}}
{{-- ═══════════════════════════════════════════ --}}
@props(['color' => 'gray', 'size' => 'sm'])

@php
    $palette = [
        'gray'   => 'bg-slate-100 text-slate-700 ring-slate-200',
        'green'  => 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        'red'    => 'bg-red-50 text-red-700 ring-red-200',
        'amber'  => 'bg-amber-50 text-amber-800 ring-amber-200',
        'indigo' => 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    ];
    $sizes = ['sm' => 'text-xs px-2 py-0.5', 'lg' => 'text-sm px-3 py-1'];
@endphp

<span {{ $attributes->merge([
    'class' => 'inline-flex items-center gap-1 rounded-full ring-1 font-medium '
             . ($palette[$color] ?? $palette['gray']) . ' '
             . ($sizes[$size] ?? $sizes['sm'])
]) }}>
    {{ $slot }}
</span>

{{-- ═══════════════════════════════════════════ --}}
{{-- resources/views/components/alert.blade.php --}}
{{-- ═══════════════════════════════════════════ --}}
@props(['type' => 'info', 'title' => null, 'dismissible' => false])

@php
    $styles = [
        'success' => ['bg-emerald-50 border-emerald-200 text-emerald-900', '✓'],
        'error'   => ['bg-red-50 border-red-200 text-red-900',             '✕'],
        'warning' => ['bg-amber-50 border-amber-200 text-amber-900',       '⚠'],
        'info'    => ['bg-blue-50 border-blue-200 text-blue-900',          'ℹ'],
    ];
    [$classes, $icon] = $styles[$type] ?? $styles['info'];
@endphp

<div {{ $attributes->merge(['class' => "alert flex gap-3 items-start border rounded-xl p-4 mb-4 {$classes}"]) }}
     role="alert">
    <span class="text-lg leading-none shrink-0">{{ $icon }}</span>

    <div class="flex-1 min-w-0">
        @if ($title)
            <strong class="block mb-1">{{ $title }}</strong>
        @endif
        <div class="text-sm leading-relaxed">{{ $slot }}</div>
    </div>

    @if ($dismissible)
        <button type="button"
                class="shrink-0 opacity-50 hover:opacity-100 text-xl leading-none"
                aria-label="إغلاق"
                onclick="this.closest('.alert').remove()">×</button>
    @endif
</div>

{{-- ═══════════════════════════════════════════ --}}
{{-- resources/views/components/card.blade.php --}}
{{-- ═══════════════════════════════════════════ --}}
<div {{ $attributes->merge(['class' => 'bg-white border border-slate-200 rounded-2xl overflow-hidden']) }}>
    @isset($header)
        <div class="px-5 py-4 border-b border-slate-100">{{ $header }}</div>
    @endisset

    <div class="px-5 py-4">{{ $slot }}</div>

    @isset($footer)
        <div class="px-5 py-3 border-t border-slate-100 bg-slate-50 text-sm">{{ $footer }}</div>
    @endisset
</div>

{{-- ═══════════════════════════════════════════ --}}
{{-- resources/views/components/form/input.blade.php --}}
{{-- ═══════════════════════════════════════════ --}}
@props([
    'name',
    'label',
    'type'  => 'text',
    'value' => null,
    'hint'  => null,
    'required' => false,
])

@php $id = $attributes->get('id', $name); @endphp

<div class="field mb-5">
    <label for="{{ $id }}" class="block mb-1.5 font-semibold text-sm">
        {{ $label }}
        @if ($required)<span class="text-red-500">*</span>@endif
    </label>

    <input type="{{ $type }}"
           id="{{ $id }}"
           name="{{ $name }}"
           value="{{ old($name, $value) }}"
           @required($required)
           {{ $attributes->merge([
               'class' => 'w-full rounded-lg border px-3 py-2 text-sm transition '
                        . ($errors->has($name)
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:ring-indigo-200')
                        . ' focus:outline-none focus:ring-4'
           ]) }}>

    @error($name)
        <p class="mt-1.5 text-sm text-red-600">{{ $message }}</p>
    @else
        @if ($hint)
            <p class="mt-1.5 text-sm text-slate-500">{{ $hint }}</p>
        @endif
    @enderror
</div>

{{-- ═══════════════════════════════════════════ --}}
{{-- resources/views/components/form/textarea.blade.php --}}
{{-- ═══════════════════════════════════════════ --}}
@props(['name', 'label', 'value' => null, 'rows' => 6, 'required' => false])

@php $id = $attributes->get('id', $name); @endphp

<div class="field mb-5">
    <label for="{{ $id }}" class="block mb-1.5 font-semibold text-sm">
        {{ $label }}
        @if ($required)<span class="text-red-500">*</span>@endif
    </label>

    <textarea id="{{ $id }}"
              name="{{ $name }}"
              rows="{{ $rows }}"
              @required($required)
              {{ $attributes->merge([
                  'class' => 'w-full rounded-lg border px-3 py-2 text-sm leading-relaxed '
                           . ($errors->has($name) ? 'border-red-400' : 'border-slate-300')
              ]) }}>{{ old($name, $value) }}</textarea>

    @error($name)
        <p class="mt-1.5 text-sm text-red-600">{{ $message }}</p>
    @enderror
</div>

{{-- ═══════════════════════════════════════════ --}}
{{-- resources/views/components/post-card.blade.php --}}
{{-- ═══════════════════════════════════════════ --}}
@props(['post', 'compact' => false])

<x-card {{ $attributes->merge(['class' => 'h-full flex flex-col hover:shadow-lg transition']) }}>
    @unless ($compact)
        @if ($post->cover_url)
            <img src="{{ $post->cover_url }}"
                 alt="{{ $post->title }}"
                 class="w-full h-44 object-cover -mx-5 -mt-4 mb-4"
                 loading="lazy">
        @endif
    @endunless

    <div class="flex flex-wrap gap-1.5 mb-2">
        @foreach ($post->tags as $tag)
            <x-badge color="indigo">{{ $tag->name }}</x-badge>
        @endforeach

        @unless ($post->published)
            <x-badge color="amber">مسوّدة</x-badge>
        @endunless
    </div>

    <h3 class="font-bold text-lg leading-snug mb-2">
        <a href="{{ route('posts.show', $post) }}" class="hover:text-indigo-600">
            {{ $post->title }}
        </a>
    </h3>

    <p class="text-sm text-slate-600 leading-relaxed flex-1">
        {{ Str::limit($post->body, $compact ? 90 : 160) }}
    </p>

    <x-slot:footer>
        <div class="flex items-center justify-between text-slate-500">
            <span>{{ $post->author->name }}</span>
            <span>
                {{ $post->created_at->diffForHumans() }}
                · {{ $post->reading_minutes }} د
            </span>
        </div>
    </x-slot:footer>
</x-card>

{{-- ═══════════════════════════════════════════ --}}
{{-- resources/views/partials/flash.blade.php --}}
{{-- ═══════════════════════════════════════════ --}}
@foreach (['success' => 'success', 'error' => 'error', 'warning' => 'warning', 'status' => 'info'] as $key => $type)
    @if (session($key))
        <x-alert :type="$type" dismissible>{{ session($key) }}</x-alert>
    @endif
@endforeach

@if ($errors->any())
    <x-alert type="error" title="تعذّر حفظ البيانات">
        <ul class="list-disc ps-5 space-y-1">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </x-alert>
@endif

{{-- ═══════════════════════════════════════════ --}}
{{-- resources/views/posts/index.blade.php --}}
{{-- ═══════════════════════════════════════════ --}}
@extends('layouts.app')
@section('title', 'المقالات')

@section('content')
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">المقالات</h1>

        @auth
            <a href="{{ route('posts.create') }}"
               class="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold">
                مقال جديد
            </a>
        @endauth
    </div>

    <form method="GET" action="{{ route('posts.index') }}" class="mb-6">
        <input type="search" name="q" value="{{ request('q') }}"
               placeholder="ابحث في المقالات…"
               class="w-full rounded-lg border border-slate-300 px-4 py-2.5">
    </form>

    @forelse ($posts->chunk(3) as $row)
        <div class="grid gap-5 md:grid-cols-3 mb-5">
            @foreach ($row as $post)
                <x-post-card :post="$post" />
            @endforeach
        </div>
    @empty
        <x-card class="text-center py-16">
            <p class="text-4xl mb-3">📝</p>
            <p class="font-semibold mb-1">لا توجد مقالات بعد</p>
            <p class="text-sm text-slate-500">
                @if (request('q'))
                    لم نجد نتائج لـ «{{ request('q') }}».
                @else
                    كن أول من ينشر مقالاً على المنصّة.
                @endif
            </p>
        </x-card>
    @endforelse

    {{ $posts->withQueryString()->links() }}
@endsection

{{-- ═══════════════════════════════════════════ --}}
{{-- resources/views/posts/show.blade.php --}}
{{-- ═══════════════════════════════════════════ --}}
@extends('layouts.app')
@section('title', $post->title)

@section('content')
    <article class="mb-10">
        <div class="flex flex-wrap gap-1.5 mb-3">
            @foreach ($post->tags as $tag)
                <x-badge color="indigo">{{ $tag->name }}</x-badge>
            @endforeach
        </div>

        <h1 class="text-3xl font-bold leading-tight mb-3">{{ $post->title }}</h1>

        <div class="flex items-center gap-3 text-sm text-slate-500 mb-6">
            <span class="font-semibold text-slate-700">{{ $post->author->name }}</span>
            <span>·</span>
            <time datetime="{{ $post->created_at->toIso8601String() }}">
                {{ $post->created_at->translatedFormat('j F Y') }}
            </time>
            <span>·</span>
            <span>{{ $post->reading_minutes }} دقائق قراءة</span>

            @can('update', $post)
                <a href="{{ route('posts.edit', $post) }}"
                   class="ms-auto text-indigo-600 font-semibold">تعديل</a>
            @endcan
        </div>

        <div class="prose leading-loose whitespace-pre-line">{{ $post->body }}</div>
    </article>

    <section>
        <h2 class="text-xl font-bold mb-4">
            التعليقات
            <x-badge>{{ $post->comments->count() }}</x-badge>
        </h2>

        @auth
            <x-card class="mb-6">
                <form method="POST" action="{{ route('posts.comments.store', $post) }}">
                    @csrf

                    <x-form.textarea name="body"
                                     label="اكتب تعليقك"
                                     rows="4"
                                     required
                                     placeholder="شاركنا رأيك…" />

                    <button type="submit"
                            class="rounded-lg bg-indigo-600 text-white px-5 py-2 text-sm font-semibold">
                        إضافة تعليق
                    </button>
                </form>
            </x-card>
        @else
            <x-alert type="info">
                <a href="{{ route('login') }}" class="font-semibold underline">سجّل الدخول</a>
                للمشاركة في النقاش.
            </x-alert>
        @endauth

        @forelse ($post->comments as $comment)
            <x-card class="mb-3">
                <x-slot:header>
                    <div class="flex items-center justify-between">
                        <span class="font-semibold text-sm">{{ $comment->author->name }}</span>
                        <span class="text-xs text-slate-500">
                            {{ $comment->created_at->diffForHumans() }}
                        </span>
                    </div>
                </x-slot:header>

                <p class="text-sm leading-relaxed">{{ $comment->body }}</p>

                @can('delete', $comment)
                    <x-slot:footer>
                        <form method="POST"
                              action="{{ route('posts.comments.destroy', [$post, $comment]) }}"
                              onsubmit="return confirm('حذف التعليق؟')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-red-600 font-semibold">حذف</button>
                        </form>
                    </x-slot:footer>
                @endcan
            </x-card>
        @empty
            <p class="text-sm text-slate-500 text-center py-8">
                لا توجد تعليقات — كن أول المعلّقين.
            </p>
        @endforelse
    </section>
@endsection
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'ما الفرق بين `{{ $x }}` و `{!! $x !!}`؟', options: ['لا فرق', 'الأولى تهرّب HTML لمنع XSS والثانية تطبع خاماً', 'الثانية أسرع', 'الأولى للأعداد'], answer: 1,
        explain: 'لا تستخدم `{!! !!}` مع أي محتوى من المستخدم إلا بعد تنظيفه بمكتبة متخصّصة.' },
      { q: 'ما فائدة `@forelse`؟', options: ['أسرع', 'تجمع الحلقة مع التعامل مع الحالة الفارغة عبر `@empty`', 'ترتّب', 'للمصفوفات فقط'], answer: 1,
        explain: 'تختصر `@if (count) @foreach … @else … @endif` في تعليمة واحدة.' },
      { q: 'ما الفرق بين `@yield` و `@stack`؟', options: ['لا فرق', '`@yield` يملؤه قسم واحد و`@stack` تتراكم فيه دفعات من عدة قوالب', 'العكس', 'الأول أسرع'], answer: 1,
        explain: '`@stack` مثالي للأنماط والسكربتات: كل قالب يدفع ما يحتاجه بلا تعارض.' },
      { q: 'لماذا تُفضَّل المكوّنات على `@include`؟', options: ['أسرع', 'تصرّح بمدخلاتها صراحةً بدل وراثة كل متغيّرات الأب ضمنياً', 'أقصر', 'إلزامية'], answer: 1,
        explain: 'الجزء يرث كل شيء فيخفي التبعيات، والمكوّن له واجهة واضحة عبر `@props`.' },
      { q: 'ماذا يحدث لو نسيت `@csrf` في نموذج POST؟', options: ['يعمل عادياً', 'يرفض Laravel الطلب بخطأ 419', 'يبطئ', 'تحذير فقط'], answer: 1,
        explain: 'الرمز يمنع تزوير الطلبات عبر المواقع (CSRF) وهو حماية أساسية.' },
      { q: 'ما وظيفة `old(\'title\', $post->title)`؟', options: ['تخزين مؤقّت', 'تسترجع ما أدخله المستخدم بعد فشل التحقّق، وتعود للقيمة الأصلية إن لم يوجد', 'ترجمة', 'تنسيق'], answer: 1,
        explain: 'نسيانها في حقل واحد يعني ضياع ما كتبه المستخدم فيه عند كل خطأ تحقّق.' },
      { q: 'ما وظيفة `$attributes->merge([\'class\' => ...])` في المكوّن؟', options: ['استبدال الأصناف', 'يدمج الأصناف الممرّرة من الاستخدام مع أصناف المكوّن الأساسية', 'يحذفها', 'يهرّبها'], answer: 1,
        explain: 'يسمح بكتابة `<x-alert class="mt-6">` دون فقدان أنماط المكوّن.' }
    ]}
  ]
};
