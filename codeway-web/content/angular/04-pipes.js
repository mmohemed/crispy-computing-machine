'use strict';

module.exports = {
  slug: '04-pipes',
  title: 'الأنابيب (Pipes)',
  summary: 'تحويل القيم عند العرض دون تغيير البيانات: التواريخ والعملات والنصوص، وكتابة أنبوب مخصّص.',
  duration: 40,
  level: 'متوسط',
  tags: ['الأنابيب', 'التنسيق'],
  objectives: [
    'تستخدم الأنابيب المدمجة لتنسيق القيم.',
    'تمرّر معاملات للأنبوب وتسلسل عدة أنابيب.',
    'تكتب أنبوباً مخصّصاً.',
    'تفرّق بين الأنبوب النقي وغير النقي.',
    'تتجنّب استخدام الأنابيب في غير موضعها.'
  ],
  quickRef: [
    { code: '{{ x | uppercase }}', desc: 'تطبيق أنبوب' },
    { code: '{{ d | date:"long" }}', desc: 'أنبوب بمعامل' },
    { code: '{{ x | a | b }}', desc: 'تسلسل أنابيب' },
    { code: 'DecimalPipe', desc: 'تنسيق الأرقام' },
    { code: 'CurrencyPipe', desc: 'تنسيق العملات' },
    { code: 'AsyncPipe', desc: 'فك الوعود والتدفّقات' },
    { code: '@Pipe({ name })', desc: 'تعريف أنبوب مخصّص' }
  ],
  blocks: [
    { t: 'h2', text: 'ما هو الأنبوب؟' },
    { t: 'p', text: 'دالة تحويل تُطبَّق على قيمة **عند العرض فقط** — البيانات الأصلية لا تتغيّر. الفكرة مستعارة من أنابيب سطر الأوامر: تمرّر القيمة عبر سلسلة تحويلات.' },
    { t: 'code', lang: 'html', code: `
{{ 'مرحبا' | uppercase }}
{{ 1234.5678 | number:'1.2-2' }}
{{ birthDate | date:'longDate' }}
{{ price | currency:'SAR' }}` },
    { t: 'demo', title: 'قبل وبعد', height: 260,
      css: 'table{width:100%;border-collapse:collapse}td,th{padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right}th{background:#fee;color:#dd0031}code{font-family:monospace;font-size:.9em;color:#dd0031}',
      html: '<table><tr><th>القيمة الأصلية</th><th>الأنبوب</th><th>الناتج</th></tr><tr><td>1234.5678</td><td><code>number:"1.2-2"</code></td><td>1,234.57</td></tr><tr><td>0.856</td><td><code>percent</code></td><td>86%</td></tr><tr><td>299</td><td><code>currency:"SAR"</code></td><td>SAR 299.00</td></tr><tr><td>hello world</td><td><code>titlecase</code></td><td>Hello World</td></tr></table>' },

    { t: 'h2', text: 'الأنابيب المدمجة' },
    { t: 'table', head: ['الأنبوب', 'الوظيفة', 'مثال'], rows: [
      ['`uppercase` / `lowercase`', 'تغيير حالة الأحرف', '`{{ n \\| uppercase }}`'],
      ['`titlecase`', 'أول حرف من كل كلمة كبير', '`{{ n \\| titlecase }}`'],
      ['`date`', 'تنسيق التاريخ', '`{{ d \\| date:"dd/MM/yyyy" }}`'],
      ['`number`', 'تنسيق رقمي', '`{{ n \\| number:"1.0-2" }}`'],
      ['`currency`', 'تنسيق عملة', '`{{ p \\| currency:"SAR" }}`'],
      ['`percent`', 'نسبة مئوية', '`{{ r \\| percent }}`'],
      ['`slice`', 'اقتطاع جزء', '`{{ arr \\| slice:0:3 }}`'],
      ['`json`', 'عرض ككائن JSON', '`{{ obj \\| json }}`'],
      ['`keyvalue`', 'تحويل كائن إلى أزواج', '`@for (kv of obj \\| keyvalue)`'],
      ['`async`', 'فك Observable أو Promise', '`{{ data$ \\| async }}`']
    ]},

    { t: 'h3', text: 'أنبوب التاريخ بالتفصيل' },
    { t: 'code', lang: 'html', code: `
{{ today | date }}                    <!-- Mar 15, 2026 -->
{{ today | date:'short' }}            <!-- 3/15/26, 2:30 PM -->
{{ today | date:'fullDate' }}         <!-- Sunday, March 15, 2026 -->
{{ today | date:'dd/MM/yyyy' }}       <!-- 15/03/2026 -->
{{ today | date:'HH:mm' }}            <!-- 14:30 -->
{{ today | date:'EEEE d MMMM y' }}    <!-- Sunday 15 March 2026 -->

<!-- بلغة ومنطقة زمنية محدّدتين -->
{{ today | date:'fullDate':'':'ar-SA' }}` },
    { t: 'code', lang: 'ts', title: 'تفعيل اللغة العربية عالمياً', code: `
// app.config.ts
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';

registerLocaleData(localeAr);

export const appConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'ar' }
  ]
};` },
    { t: 'note', text: 'بعد هذا الإعداد تصبح كل أنابيب التاريخ والأرقام والعملة عربية تلقائياً في التطبيق كله، دون تمرير اللغة في كل مرة.' },

    { t: 'h3', text: 'أنبوب الأرقام' },
    { t: 'p', text: 'صيغة المعامل: `"minIntegerDigits.minFractionDigits-maxFractionDigits"`.' },
    { t: 'code', lang: 'html', code: `
{{ 3.14159 | number:'1.0-2' }}    <!-- 3.14   خانتان كحد أقصى -->
{{ 5 | number:'3.0-0' }}          <!-- 005    ثلاث خانات صحيحة -->
{{ 0.5 | number:'1.2-2' }}        <!-- 0.50   خانتان بالضبط -->
{{ 1234567 | number }}            <!-- 1,234,567 -->` },

    { t: 'h2', text: 'التسلسل والمعاملات' },
    { t: 'code', lang: 'html', code: `
<!-- تسلسل: من اليسار إلى اليمين -->
{{ product.name | slice:0:20 | uppercase }}

<!-- معاملات متعدّدة بنقطتين -->
{{ items | slice:1:4 }}
{{ amount | currency:'SAR':'symbol':'1.2-2' }}

<!-- معامل من متغيّر -->
{{ date | date:userFormat }}` },
    { t: 'warn', text: 'ترتيب التسلسل مهم: `{{ x | slice:0:5 | uppercase }}` تقتطع ثم تكبّر، والعكس يعطي نتيجة مختلفة إن كان النص متعدّد اللغات.' },

    { t: 'h2', text: 'أنبوب `async`' },
    { t: 'p', text: 'من أهم أنابيب Angular: يفكّ `Observable` أو `Promise` تلقائياً، **ويلغي الاشتراك عند إزالة المكوّن** — فيمنع تسريب الذاكرة دون أن تكتب `ngOnDestroy`.' },
    { t: 'code', lang: 'ts', code: `
@Component({
  standalone: true,
  imports: [AsyncPipe],
  template: \`
    @if (products$ | async; as products) {
      @for (p of products; track p.id) {
        <app-product-card [product]="p" />
      }
    } @else {
      <p>جارٍ التحميل…</p>
    }
  \`
})
export class ProductListComponent {
  private http = inject(HttpClient);
  products$ = this.http.get<Product[]>('/api/products');
}` },
    { t: 'tip', text: 'الصياغة `| async; as products` تفكّ التدفّق وتخزّن النتيجة في متغيّر محلي، فتتجنّب استخدام `| async` أكثر من مرة (وما يسبّبه من اشتراكات متعدّدة).' },

    { t: 'h2', text: 'كتابة أنبوب مخصّص' },
    { t: 'code', lang: 'bash', code: 'ng generate pipe pipes/truncate' },
    { t: 'code', lang: 'ts', title: 'truncate.pipe.ts', code: `
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50, suffix = '…'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.slice(0, limit).trimEnd() + suffix;
  }
}` },
    { t: 'code', lang: 'html', title: 'الاستخدام', code: `
{{ article.body | truncate }}
{{ article.body | truncate:100 }}
{{ article.body | truncate:100:' [اقرأ المزيد] ' }}` },
    { t: 'p', text: 'المعامل الأول لـ `transform` هو القيمة القادمة من الأنبوب، وما بعده هي المعاملات المكتوبة بعد النقطتين بالترتيب.' },

    { t: 'code', lang: 'ts', title: 'مثال عملي: أنبوب الوقت النسبي', code: `
@Pipe({ name: 'timeAgo', standalone: true })
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = new Date(value);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'الآن';
    if (seconds < 3600) return \`قبل \${Math.floor(seconds / 60)} دقيقة\`;
    if (seconds < 86400) return \`قبل \${Math.floor(seconds / 3600)} ساعة\`;
    if (seconds < 2592000) return \`قبل \${Math.floor(seconds / 86400)} يوم\`;
    return date.toLocaleDateString('ar');
  }
}` },
    { t: 'demo', title: 'نتائج أنبوب الوقت النسبي', height: 220,
      css: 'ul{list-style:none;padding:0;margin:0}li{padding:8px 12px;border-bottom:1px solid #eef2f7;display:flex;justify-content:space-between}b{color:#dd0031}',
      html: '<ul><li><span>قبل 30 ثانية</span><b>الآن</b></li><li><span>قبل 25 دقيقة</span><b>قبل 25 دقيقة</b></li><li><span>قبل 5 ساعات</span><b>قبل 5 ساعة</b></li><li><span>قبل 3 أيام</span><b>قبل 3 يوم</b></li></ul>' },

    { t: 'h2', text: 'الأنبوب النقي وغير النقي' },
    { t: 'table', head: ['الوجه', 'نقي (الافتراضي)', 'غير نقي'], rows: [
      ['متى يُعاد الحساب', 'عند تغيّر المرجع فقط', 'عند كل دورة كشف تغيير'],
      ['الأداء', 'ممتاز', 'قد يكون كارثياً'],
      ['يكتشف تعديل المصفوفة داخلياً', 'لا', 'نعم'],
      ['الإعلان', 'الافتراضي', '`pure: false`']
    ]},
    { t: 'code', lang: 'ts', code: `
@Pipe({ name: 'filterActive', standalone: true, pure: false })
export class FilterActivePipe implements PipeTransform {
  transform(items: Item[]): Item[] {
    return items.filter(i => i.active);
  }
}` },
    { t: 'danger', title: 'انتبه جداً', text: 'الأنبوب غير النقي يُنفَّذ **عشرات المرات في الثانية** — عند كل نقرة وكل حركة مؤشّر. تجنّبه تماماً، ورشّح البيانات في الصنف أو في خاصية محسوبة بدلاً منه.' },
    { t: 'compare', lang: 'ts', bad: {
      lang: 'html',
      code: '<!-- أنبوب غير نقي للترشيح -->\n@for (p of products | filterActive; track p.id) {\n  …\n}',
      why: 'يُعاد الترشيح عند كل دورة كشف تغيير مهما كان سببها.'
    }, good: {
      lang: 'ts',
      code: '// في الصنف\nget activeProducts() {\n  return this.products.filter(p => p.active);\n}',
      why: 'أوضح وأسهل اختباراً، ويمكن تحسينه بالإشارات لاحقاً.'
    }},

    { t: 'h2', text: 'استخدام الأنبوب في الصنف' },
    { t: 'code', lang: 'ts', code: `
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  providers: [DatePipe, CurrencyPipe]
})
export class ReportComponent {
  private datePipe = inject(DatePipe);

  buildFileName(): string {
    const stamp = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    return \`report-\${stamp}.pdf\`;
  }
}` },

    { t: 'exercise',
      title: 'تمرين: أنابيب لمتجر إلكتروني',
      brief: 'اكتب ثلاثة أنابيب مخصّصة واستخدمها مع الأنابيب المدمجة في بطاقة منتج.',
      requirements: [
        'أنبوب `discount` يستقبل السعر ونسبة الخصم ويُرجع السعر النهائي.',
        'أنبوب `stockStatus` يحوّل رقم المخزون إلى نص: 0 = «نفدت الكمية»، أقل من 5 = «كمية محدودة»، غير ذلك = «متوفّر».',
        'أنبوب `arabicNumber` يحوّل الأرقام اللاتينية إلى عربية-هندية (٠١٢٣٤٥٦٧٨٩).',
        'في القالب: اعرض السعر الأصلي مشطوباً والسعر بعد الخصم بأنبوب `currency`.',
        'اعرض تاريخ الإضافة بأنبوب `date` بصيغة عربية.',
        'اعرض وصف المنتج مقتطعاً بـ 60 حرفاً.',
        'كل الأنابيب مستقلّة (`standalone: true`).'
      ],
      hints: [
        'المعاملات الاختيارية تُعطى قيماً افتراضية في توقيع `transform`.',
        'لتحويل الأرقام: `String(n).replace(/[0-9]/g, d => arabicDigits[+d])`.',
        'تذكّر إضافة الأنابيب إلى `imports` في المكوّن.'
      ],
      solution: { lang: 'ts', code: `
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'discount', standalone: true })
export class DiscountPipe implements PipeTransform {
  transform(price: number, percent = 0): number {
    if (!percent) return price;
    return Math.round(price * (1 - percent / 100));
  }
}

@Pipe({ name: 'stockStatus', standalone: true })
export class StockStatusPipe implements PipeTransform {
  transform(stock: number): string {
    if (stock <= 0) return 'نفدت الكمية';
    if (stock < 5) return \`كمية محدودة (\${stock})\`;
    return 'متوفّر';
  }
}

@Pipe({ name: 'arabicNumber', standalone: true })
export class ArabicNumberPipe implements PipeTransform {
  private digits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];

  transform(value: number | string): string {
    return String(value).replace(/[0-9]/g, d => this.digits[+d]);
  }
}

/* ---------- الاستخدام في المكوّن ---------- */

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CurrencyPipe, DatePipe,
    DiscountPipe, StockStatusPipe, ArabicNumberPipe, TruncatePipe
  ],
  template: \`
    <article class="card">
      <h3>{{ product.name }}</h3>

      <p class="desc">{{ product.description | truncate:60 }}</p>

      <p class="prices">
        <s>{{ product.price | currency:'SAR' }}</s>
        <strong>
          {{ product.price | discount:product.discountPercent | currency:'SAR' }}
        </strong>
      </p>

      <p class="stock">{{ product.stock | stockStatus }}</p>

      <p class="date">
        أُضيف في {{ product.addedAt | date:'longDate':'':'ar' }}
      </p>

      <p class="views">
        المشاهدات: {{ product.views | arabicNumber }}
      </p>
    </article>
  \`
})
export class ProductCardComponent {
  product = {
    name: 'سماعة لاسلكية',
    description: 'سماعة رأس بعزل ضوضاء نشط وبطارية تدوم ثلاثين ساعة مع شحن سريع.',
    price: 499,
    discountPercent: 20,
    stock: 3,
    addedAt: new Date('2026-02-01'),
    views: 1284
  };
}` } },

    { t: 'quiz', items: [
      { q: 'هل يغيّر الأنبوب البيانات الأصلية؟', options: ['نعم', 'لا — يحوّلها عند العرض فقط', 'أحياناً', 'يحذفها'], answer: 1,
        explain: 'الأنبوب دالة تحويل خالصة؛ القيمة في الصنف تبقى كما هي.' },
      { q: 'لماذا يُنصح بتجنّب الأنابيب غير النقية؟', options: ['غير مدعومة', 'تُنفَّذ عند كل دورة كشف تغيير فتضرّ بالأداء بشدّة', 'لا تقبل معاملات', 'تحتاج استيراداً خاصاً'], answer: 1,
        explain: 'قد تُنفَّذ عشرات المرات في الثانية؛ رشّح البيانات في الصنف بدلاً منها.' },
      { q: 'ما ميزة `| async` الأهم؟', options: ['السرعة', 'يفكّ التدفّق ويلغي الاشتراك تلقائياً عند إزالة المكوّن', 'يغيّر اللغة', 'يخزّن مؤقتاً'], answer: 1,
        explain: 'يمنع تسريب الذاكرة دون كتابة `ngOnDestroy`.' },
      { q: 'كيف تمرّر معاملين لأنبوب؟', options: ['بفاصلة', 'بنقطتين متتاليتين: `pipe:a:b`', 'بأقواس', 'لا يمكن'], answer: 1,
        explain: 'كل معامل يسبقه `:` ويصل إلى `transform` بالترتيب بعد القيمة.' },
      { q: 'ما توقيع دالة الأنبوب المخصّص؟', options: ['`run()`', '`transform(value, ...args)`', '`execute()`', '`pipe()`'], answer: 1,
        explain: 'الواجهة `PipeTransform` تفرض دالة `transform` تستقبل القيمة ثم المعاملات.' }
    ]}
  ]
};
