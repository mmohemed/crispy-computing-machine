'use strict';

module.exports = {
  slug: '03-data-binding',
  title: 'ربط البيانات والتحكّم في التدفّق',
  summary: 'أنواع الربط الأربعة، والصياغة الحديثة للشروط والحلقات، والتعامل مع الأحداث.',
  duration: 50,
  level: 'مبتدئ',
  tags: ['الربط', 'القوالب'],
  objectives: [
    'تستخدم أنواع الربط الأربعة في مواضعها.',
    'تعرض المحتوى شرطياً بـ `@if` و `@switch`.',
    'تكرّر العناصر بـ `@for` وتفهم أهمية `track`.',
    'تستمع للأحداث وتمرّر بياناتها.',
    'تربط الأصناف والأنماط ديناميكياً.'
  ],
  quickRef: [
    { code: '{{ value }}', desc: 'إقحام نصي' },
    { code: '[prop]="expr"', desc: 'ربط خاصية' },
    { code: '(event)="fn()"', desc: 'ربط حدث' },
    { code: '[(ngModel)]="x"', desc: 'ربط ثنائي' },
    { code: '@if / @else', desc: 'عرض شرطي' },
    { code: '@for (x of xs; track x.id)', desc: 'تكرار' },
    { code: '[ngClass] / [ngStyle]', desc: 'أصناف وأنماط ديناميكية' }
  ],
  blocks: [
    { t: 'h2', text: 'أنواع الربط الأربعة' },
    { t: 'p', text: 'الربط هو الجسر بين صنف المكوّن وقالبه. أربعة أنواع تغطّي كل الحالات، والفرق بينها هو **اتجاه تدفّق البيانات**.' },
    { t: 'demo', title: 'اتجاهات الربط', height: 280,
      css: '.r{display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:8px}.r code{background:#f1f5f9;padding:3px 8px;border-radius:6px;font-family:monospace;color:#dd0031;min-width:150px;display:inline-block;text-align:center}.a{color:#dd0031;font-weight:800;font-size:1.2em}',
      html: '<div class="r"><code>{{ x }}</code><span class="a">←</span><span>صنف إلى قالب (نص)</span></div><div class="r"><code>[prop]="x"</code><span class="a">←</span><span>صنف إلى قالب (قيمة)</span></div><div class="r"><code>(event)="f()"</code><span class="a">→</span><span>قالب إلى صنف</span></div><div class="r"><code>[(ngModel)]="x"</code><span class="a">↔</span><span>الاتجاهان معاً</span></div>' },

    { t: 'h3', text: '1. الإقحام `{{ }}`' },
    { t: 'code', lang: 'html', code: `
<h1>{{ title }}</h1>
<p>{{ user.firstName }} {{ user.lastName }}</p>
<p>الإجمالي: {{ price * quantity }}</p>
<p>{{ isAdmin ? 'مدير' : 'مستخدم' }}</p>
<p>{{ description || 'لا يوجد وصف' }}</p>
<p>{{ user?.address?.city }}</p>` },
    { t: 'note', text: 'المعامل `?.` (Safe navigation) يمنع الخطأ إن كانت القيمة `null` أو `undefined` — مفيد جداً مع بيانات لم تصل بعد من الخادم.' },

    { t: 'h3', text: '2. ربط الخاصية `[ ]`' },
    { t: 'p', text: 'الإقحام يعمل مع النصوص فقط. لتمرير **قيمة حقيقية** (رقم، منطقي، كائن) تحتاج ربط الخاصية.' },
    { t: 'compare', lang: 'html', bad: {
      code: '<button disabled="{{ isLoading }}">إرسال</button>',
      why: 'يُمرَّر النص "false" وهو قيمة صادقة، فيبقى الزر معطّلاً دائماً!'
    }, good: {
      code: '<button [disabled]="isLoading">إرسال</button>',
      why: 'تُمرَّر القيمة المنطقية الحقيقية فيعمل الزر كما هو متوقّع.'
    }},
    { t: 'code', lang: 'html', code: `
<img [src]="imageUrl" [alt]="imageAlt" [width]="300">
<input [value]="username" [placeholder]="hint">
<a [href]="'/products/' + product.id">التفاصيل</a>

<!-- ربط سمة HTML (لا خاصية DOM) -->
<td [attr.colspan]="span">…</td>
<button [attr.aria-label]="label">✕</button>` },
    { t: 'warn', title: 'خاصية أم سمة؟', text: 'معظم الأشياء خصائص DOM وتُربط بـ `[prop]`. لكن `colspan` و `aria-*` و `role` سمات HTML لا خصائص، فتحتاج البادئة `attr.` — وإلا ستحصل على خطأ «Can\'t bind to…».' },

    { t: 'h3', text: '3. ربط الحدث `( )`' },
    { t: 'code', lang: 'html', code: `
<button (click)="save()">حفظ</button>
<button (click)="remove(item.id)">حذف</button>

<!-- كائن الحدث -->
<input (input)="onType($event)">
<form (submit)="onSubmit($event)">…</form>

<!-- مُعدِّلات المفاتيح -->
<input (keyup.enter)="search()">
<input (keyup.escape)="clear()">` },
    { t: 'code', lang: 'ts', code: `
onType(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  console.log(value);
}

onSubmit(event: Event): void {
  event.preventDefault();
  // معالجة الإرسال
}` },

    { t: 'h3', text: '4. الربط الثنائي `[( )]`' },
    { t: 'code', lang: 'ts', code: `
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],   // ضروري لعمل ngModel
  template: \`
    <input [(ngModel)]="searchTerm" placeholder="ابحث…">
    <p>تبحث عن: {{ searchTerm }}</p>
  \`
})
export class SearchComponent {
  searchTerm = '';
}` },
    { t: 'note', title: 'صندوق الموز في العلبة', text: 'الصياغة `[()]` تُسمّى مازحاً «banana in a box». وهي ليست سحراً: مجرّد اختصار لـ `[ngModel]="x"` و `(ngModelChange)="x = $event"` معاً.' },
    { t: 'demo', title: 'أثر الربط الثنائي', height: 200,
      css: 'input{padding:9px 12px;border:1px solid #cbd5e1;border-radius:8px;width:100%;max-width:280px;font-family:inherit}p{margin-top:10px;color:#475569}',
      html: '<input id="i" placeholder="اكتب هنا…" oninput="document.getElementById(\'o\').textContent=this.value||\'(فارغ)\'"><p>تبحث عن: <b id="o">(فارغ)</b></p>' },

    { t: 'h2', text: 'التحكّم في التدفّق' },
    { t: 'p', text: 'منذ Angular 17 توجد صياغة مدمجة في القالب أوضح وأسرع من التوجيهات القديمة `*ngIf` و `*ngFor`.' },

    { t: 'h3', text: '`@if` و `@else`' },
    { t: 'code', lang: 'html', code: `
@if (user) {
  <p>أهلاً {{ user.name }}</p>
} @else if (isLoading) {
  <p>جارٍ التحميل…</p>
} @else {
  <a href="/login">سجّل الدخول</a>
}` },
    { t: 'code', lang: 'html', title: 'الصياغة القديمة للمقارنة', code: `
<p *ngIf="user; else loginTpl">أهلاً {{ user.name }}</p>
<ng-template #loginTpl>
  <a href="/login">سجّل الدخول</a>
</ng-template>` },
    { t: 'tip', text: 'الصياغة الجديدة أوضح ولا تحتاج استيراد `CommonModule`، وأداؤها أفضل. استخدمها في كل مشروع جديد.' },

    { t: 'h3', text: '`@for` والمفتاح `track`' },
    { t: 'code', lang: 'html', code: `
@for (product of products; track product.id) {
  <app-product-card [product]="product" />
} @empty {
  <p>لا توجد منتجات لعرضها.</p>
}` },
    { t: 'danger', title: '`track` إلزامية وليست اختيارية', text: 'بدونها لا يعرف Angular أي عنصر يقابل أيّاً بعد التغيير، فيعيد بناء القائمة كاملة — يفقد المستخدم ما كتبه في الحقول ويهبط الأداء. استخدم معرّفاً فريداً ثابتاً، ولا تستخدم الفهرس `$index` إلا إن كانت القائمة ثابتة الترتيب.' },
    { t: 'code', lang: 'html', title: 'المتغيّرات المتاحة داخل @for', code: `
@for (item of items; track item.id; let i = $index, isFirst = $first) {
  <div [class.first]="isFirst">
    {{ i + 1 }}. {{ item.name }}
  </div>
}

<!-- المتغيّرات: $index, $first, $last, $even, $odd, $count -->` },
    { t: 'demo', title: 'قائمة مرقّمة بتلوين متناوب', height: 250,
      css: 'ul{list-style:none;padding:0;margin:0;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}li{padding:10px 14px}li:nth-child(odd){background:#f8fafc}li:first-child{color:#dd0031;font-weight:700}',
      html: '<ul><li>1. سماعة لاسلكية</li><li>2. لوحة مفاتيح</li><li>3. ماوس</li><li>4. شاشة</li></ul>' },

    { t: 'h3', text: '`@switch`' },
    { t: 'code', lang: 'html', code: `
@switch (order.status) {
  @case ('pending')   { <span class="badge warn">قيد المراجعة</span> }
  @case ('shipped')   { <span class="badge info">تم الشحن</span> }
  @case ('delivered') { <span class="badge ok">تم التسليم</span> }
  @default            { <span class="badge">غير معروف</span> }
}` },

    { t: 'h2', text: 'ربط الأصناف والأنماط' },
    { t: 'code', lang: 'html', code: `
<!-- صنف واحد شرطي -->
<div [class.active]="isActive">…</div>

<!-- عدة أصناف بكائن -->
<div [ngClass]="{
  'active': isActive,
  'disabled': isDisabled,
  'highlighted': score > 90
}">…</div>

<!-- من متغيّر -->
<div [ngClass]="statusClass">…</div>

<!-- نمط واحد -->
<div [style.width.%]="progress">…</div>
<div [style.color]="isError ? 'red' : 'green'">…</div>

<!-- عدة أنماط -->
<div [ngStyle]="{
  'width.px': barWidth,
  'background-color': barColor
}">…</div>` },
    { t: 'demo', title: 'شريط تقدّم مربوط', height: 210,
      css: '.bar{height:22px;background:#f1f5f9;border-radius:99px;overflow:hidden;margin-bottom:10px}.fill{height:100%;border-radius:99px;transition:.4s}.ok{background:#10b981}.warn{background:#f59e0b}',
      html: '<p style="margin:0 0 6px">التقدّم 75٪ — <code>[style.width.%]="75"</code></p><div class="bar"><div class="fill ok" style="width:75%"></div></div><p style="margin:0 0 6px">التقدّم 30٪ — الصنف يتغيّر بالشرط</p><div class="bar"><div class="fill warn" style="width:30%"></div></div>' },
    { t: 'tip', text: 'للحالات البسيطة استخدم `[class.x]` و `[style.y]` — أسرع وأوضح من `ngClass` و `ngStyle` اللذين يحتاجان `CommonModule`.' },

    { t: 'h2', text: 'مراجع القالب' },
    { t: 'code', lang: 'html', code: `
<input #nameInput type="text">
<button (click)="greet(nameInput.value)">رحّب</button>

<video #player src="clip.mp4"></video>
<button (click)="player.play()">تشغيل</button>` },
    { t: 'p', text: 'المرجع `#name` يمنحك وصولاً مباشراً إلى العنصر داخل القالب فقط، بلا حاجة إلى `document.querySelector`.' },

    { t: 'exercise',
      title: 'تمرين: قائمة مهام تفاعلية',
      brief: 'ابنِ مكوّناً لإدارة قائمة مهام يستخدم أنواع الربط الأربعة والتحكّم في التدفّق.',
      requirements: [
        'مصفوفة `tasks` فيها كائنات: `id`, `title`, `done`.',
        'حقل إدخال مربوط ثنائياً بـ `newTask`.',
        'زر «إضافة» يضيف المهمة ويفرّغ الحقل، ويكون معطّلاً إن كان الحقل فارغاً.',
        'عرض المهام بـ `@for` مع `track task.id` و `@empty`.',
        'كل مهمة لها مربّع اختيار يبدّل `done`، ويُشطب نصّها عند الإكمال.',
        'زر حذف لكل مهمة.',
        'عدّاد يعرض «تم إنجاز س من ص».',
        'رسالة تهنئة بـ `@if` تظهر حين تكتمل كل المهام.',
        'الاستجابة لمفتاح Enter في الحقل لإضافة المهمة.'
      ],
      hints: [
        'لا تنسَ `imports: [FormsModule]` لعمل `ngModel`.',
        '`(keyup.enter)="addTask()"` تلتقط مفتاح Enter مباشرة.',
        '`[class.done]="task.done"` أبسط من `ngClass` هنا.'
      ],
      solution: { lang: 'ts', code: `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <section class="tasks">
      <h2>قائمة المهام</h2>

      <div class="add">
        <input
          [(ngModel)]="newTask"
          (keyup.enter)="addTask()"
          placeholder="أضف مهمة جديدة…">
        <button (click)="addTask()" [disabled]="!newTask.trim()">
          إضافة
        </button>
      </div>

      <ul>
        @for (task of tasks; track task.id) {
          <li [class.done]="task.done">
            <input
              type="checkbox"
              [checked]="task.done"
              (change)="toggle(task)">
            <span>{{ task.title }}</span>
            <button (click)="remove(task.id)" aria-label="حذف">✕</button>
          </li>
        } @empty {
          <li class="empty">لا توجد مهام بعد.</li>
        }
      </ul>

      <p class="counter">تم إنجاز {{ doneCount }} من {{ tasks.length }}</p>

      @if (tasks.length > 0 && doneCount === tasks.length) {
        <p class="congrats">🎉 أنجزت كل المهام!</p>
      }
    </section>
  \`,
  styles: [\`
    .add { display: flex; gap: 8px; margin-bottom: 16px; }
    input[type="text"] { flex: 1; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; }
    ul { list-style: none; padding: 0; }
    li { display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eef2f7; }
    li.done span { text-decoration: line-through; color: #94a3b8; }
    li span { flex: 1; }
    .empty { color: #94a3b8; justify-content: center; }
    .congrats { color: #10b981; font-weight: 700; }
  \`]
})
export class TasksComponent {
  newTask = '';
  private nextId = 1;

  tasks: Task[] = [
    { id: 0, title: 'قراءة درس ربط البيانات', done: true }
  ];

  get doneCount(): number {
    return this.tasks.filter(t => t.done).length;
  }

  addTask(): void {
    const title = this.newTask.trim();
    if (!title) return;
    this.tasks.push({ id: this.nextId++, title, done: false });
    this.newTask = '';
  }

  toggle(task: Task): void {
    task.done = !task.done;
  }

  remove(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }
}` } },

    { t: 'quiz', items: [
      { q: 'ما الخطأ في `<button disabled="{{ isLoading }}">`؟', options: ['لا خطأ', 'يُمرَّر نص وليس قيمة منطقية، فتبقى السمة فعّالة دائماً', 'الصياغة غير مدعومة', 'يجب استخدام ngModel'], answer: 1,
        explain: 'الإقحام يُنتج نصاً؛ النص "false" قيمة صادقة. الصواب `[disabled]="isLoading"`.' },
      { q: 'لماذا `track` إلزامية في `@for`؟', options: ['للترتيب', 'ليتعرّف Angular على العناصر بعد التغيير فيحدّث المتغيّر فقط', 'للفرز', 'للتنسيق'], answer: 1,
        explain: 'بدونها يُعاد بناء القائمة كاملة، فتضيع حالة العناصر ويهبط الأداء.' },
      { q: 'ما اختصار `[(ngModel)]="x"`؟', options: ['`[ngModel]` فقط', '`[ngModel]="x"` و `(ngModelChange)="x = $event"`', '`(ngModel)` فقط', 'لا شيء'], answer: 1,
        explain: 'الربط الثنائي مجرّد اختصار لربط خاصية وربط حدث معاً.' },
      { q: 'متى تحتاج البادئة `attr.` في الربط؟', options: ['دائماً', 'حين تربط سمة HTML لا خاصية DOM مثل `colspan` و `aria-*`', 'مع الأحداث', 'مع الأصناف'], answer: 1,
        explain: 'بعض السمات لا يقابلها خاصية DOM، فيلزم `[attr.colspan]`.' },
      { q: 'ما وظيفة `@empty` في `@for`؟', options: ['حذف العناصر', 'عرض محتوى بديل حين تكون القائمة فارغة', 'تفريغ المصفوفة', 'إيقاف الحلقة'], answer: 1,
        explain: 'تغني عن كتابة `@if (items.length === 0)` منفصلة.' }
    ]}
  ]
};
