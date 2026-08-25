'use strict';

module.exports = {
  slug: '08-forms',
  title: 'النماذج والتحقّق',
  summary: 'النماذج التفاعلية (Reactive Forms): بناء النموذج برمجياً، والتحقّق المدمج والمخصّص، وعرض الأخطاء.',
  duration: 55,
  level: 'متوسط',
  tags: ['النماذج', 'التحقّق'],
  objectives: [
    'تفرّق بين النماذج المبنية على القالب والنماذج التفاعلية.',
    'تبني نموذجاً تفاعلياً بـ `FormBuilder`.',
    'تطبّق مدقّقات مدمجة ومخصّصة.',
    'تعرض رسائل أخطاء واضحة في الوقت المناسب.',
    'تتعامل مع المصفوفات والمجموعات المتداخلة.'
  ],
  quickRef: [
    { code: 'FormControl', desc: 'حقل واحد' },
    { code: 'FormGroup', desc: 'مجموعة حقول' },
    { code: 'FormArray', desc: 'قائمة حقول ديناميكية' },
    { code: 'Validators.required', desc: 'مدقّق مدمج' },
    { code: 'form.get("x")?.errors', desc: 'قراءة الأخطاء' },
    { code: 'control.touched', desc: 'هل لمسه المستخدم' },
    { code: 'form.valid', desc: 'صلاحية النموذج كله' }
  ],
  blocks: [
    { t: 'h2', text: 'نهجان للنماذج' },
    { t: 'table', head: ['الوجه', 'مبنية على القالب', 'تفاعلية (Reactive)'], rows: [
      ['أين يُعرَّف النموذج', 'في HTML بـ `ngModel`', 'في الصنف برمجياً'],
      ['الوحدة اللازمة', '`FormsModule`', '`ReactiveFormsModule`'],
      ['التحقّق', 'سمات في القالب', 'دوال في الصنف'],
      ['قابلية الاختبار', 'صعبة (تحتاج DOM)', '**سهلة** (منطق خالص)'],
      ['الحقول الديناميكية', 'صعبة', '**سهلة** بـ `FormArray`'],
      ['الأنسب لـ', 'نماذج بسيطة جداً', '**كل ما عدا ذلك**']
    ]},
    { t: 'note', text: 'هذا الدرس يركّز على **النماذج التفاعلية** لأنها الخيار المهني في أي مشروع حقيقي: أوضح وأقوى وأسهل اختباراً.' },

    { t: 'h2', text: 'أول نموذج تفاعلي' },
    { t: 'code', lang: 'ts', code: `
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [false]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();   // لإظهار كل الأخطاء
      return;
    }
    console.log(this.form.value);
  }
}` },
    { t: 'code', lang: 'html', title: 'login.component.html', code: `
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <label for="email">البريد الإلكتروني</label>
  <input id="email" type="email" formControlName="email">

  @if (form.controls.email.touched && form.controls.email.errors) {
    <p class="error">
      @if (form.controls.email.errors['required']) { البريد مطلوب. }
      @if (form.controls.email.errors['email']) { صيغة البريد غير صحيحة. }
    </p>
  }

  <label for="password">كلمة المرور</label>
  <input id="password" type="password" formControlName="password">

  @if (form.controls.password.touched && form.controls.password.errors) {
    <p class="error">
      @if (form.controls.password.errors['required']) { كلمة المرور مطلوبة. }
      @if (form.controls.password.errors['minlength']) {
        الحد الأدنى 8 محارف.
      }
    </p>
  }

  <label>
    <input type="checkbox" formControlName="remember">
    تذكّرني
  </label>

  <button type="submit" [disabled]="form.invalid">دخول</button>
</form>` },
    { t: 'demo', title: 'شكل النموذج مع الأخطاء', height: 340,
      css: 'label{display:block;font-weight:600;margin:10px 0 4px}input[type=email],input[type=password]{width:100%;max-width:320px;padding:9px 12px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit}.bad{border-color:#ef4444;background:#fef2f2}.error{color:#dc2626;font-size:.86em;margin:4px 0 0}button{margin-top:14px;padding:10px 24px;border:0;border-radius:8px;background:#dd0031;color:#fff;cursor:pointer;font-family:inherit}button:disabled{opacity:.5}',
      html: '<label>البريد الإلكتروني</label><input type="email" class="bad" value="sara@"><p class="error">صيغة البريد غير صحيحة.</p><label>كلمة المرور</label><input type="password" value="123"><p class="error">الحد الأدنى 8 محارف.</p><button disabled>دخول</button>' },
    { t: 'warn', title: 'متى تُظهر الخطأ؟', text: 'لا تلوّن الحقول بالأحمر قبل أن يلمسها المستخدم. اشرط دائماً بـ `touched` أو `dirty` — نموذج فارغ كلّه أحمر تجربة سيئة تُشعر المستخدم بالفشل قبل أن يبدأ.' },

    { t: 'h2', text: 'حالات الحقل' },
    { t: 'table', head: ['الخاصية', 'المعنى'], rows: [
      ['`valid` / `invalid`', 'هل تجتاز القيمة كل المدقّقات'],
      ['`pristine` / `dirty`', 'هل غيّر المستخدم القيمة'],
      ['`touched` / `untouched`', 'هل دخل الحقل ثم خرج منه'],
      ['`pending`', 'مدقّق غير متزامن قيد التنفيذ'],
      ['`disabled`', 'الحقل معطّل ولا يُحتسب في القيمة'],
      ['`errors`', 'كائن الأخطاء أو `null`']
    ]},
    { t: 'code', lang: 'html', title: 'تنسيق بحسب الحالة', code: `
<input
  formControlName="email"
  [class.invalid]="form.controls.email.touched && form.controls.email.invalid"
  [class.valid]="form.controls.email.touched && form.controls.email.valid">` },

    { t: 'h2', text: 'المدقّقات المدمجة' },
    { t: 'code', lang: 'ts', code: `
Validators.required
Validators.requiredTrue          // لمربّع الموافقة
Validators.email
Validators.min(1)
Validators.max(100)
Validators.minLength(8)
Validators.maxLength(200)
Validators.pattern(/^05[0-9]{8}$/)

// عدة مدقّقات معاً
phone: ['', [
  Validators.required,
  Validators.pattern(/^05[0-9]{8}$/)
]]` },

    { t: 'h2', text: 'مدقّق مخصّص' },
    { t: 'code', lang: 'ts', title: 'مدقّق حقل واحد', code: `
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespace(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;                 // اترك required للتعامل مع الفراغ
    return value.trim().length ? null : { whitespace: true };
  };
}

export function strongPassword(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value as string;
    if (!v) return null;

    const hasLetter = /[a-zA-Z]/.test(v);
    const hasNumber = /\\d/.test(v);

    if (hasLetter && hasNumber) return null;
    return { weakPassword: { hasLetter, hasNumber } };
  };
}` },
    { t: 'code', lang: 'ts', title: 'مدقّق على مستوى المجموعة', code: `
export function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
}

// الاستخدام
form = this.fb.group({
  password: ['', [Validators.required, strongPassword()]],
  confirmPassword: ['', Validators.required]
}, { validators: passwordsMatch });` },
    { t: 'p', text: 'المدقّق يُرجع `null` عند النجاح، أو كائناً يصف الخطأ عند الفشل. اسم مفتاح الكائن هو ما تفحصه في القالب.' },

    { t: 'h2', text: 'مجموعات متداخلة' },
    { t: 'code', lang: 'ts', code: `
form = this.fb.group({
  name: ['', Validators.required],
  address: this.fb.group({
    city: ['', Validators.required],
    street: [''],
    zip: ['', Validators.pattern(/^[0-9]{5}$/)]
  })
});` },
    { t: 'code', lang: 'html', code: `
<div formGroupName="address">
  <input formControlName="city" placeholder="المدينة">
  <input formControlName="street" placeholder="الشارع">
  <input formControlName="zip" placeholder="الرمز البريدي">
</div>` },

    { t: 'h2', text: 'حقول ديناميكية بـ `FormArray`' },
    { t: 'code', lang: 'ts', code: `
import { FormArray, FormControl } from '@angular/forms';

export class SkillsComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', Validators.required],
    skills: this.fb.array([this.createSkill()])
  });

  get skills(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  private createSkill() {
    return this.fb.group({
      title: ['', Validators.required],
      level: [1, [Validators.min(1), Validators.max(5)]]
    });
  }

  addSkill(): void {
    this.skills.push(this.createSkill());
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }
}` },
    { t: 'code', lang: 'html', code: `
<div formArrayName="skills">
  @for (skill of skills.controls; track $index; let i = $index) {
    <div [formGroupName]="i" class="skill-row">
      <input formControlName="title" placeholder="اسم المهارة">
      <input formControlName="level" type="number" min="1" max="5">
      <button type="button" (click)="removeSkill(i)">حذف</button>
    </div>
  }
</div>

<button type="button" (click)="addSkill()">+ إضافة مهارة</button>` },
    { t: 'demo', title: 'حقول تُضاف وتُحذف', height: 260,
      css: '.row{display:flex;gap:8px;margin-bottom:8px}input{padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font-family:inherit}input[type=text]{flex:1}input[type=number]{width:70px}button{padding:8px 14px;border:1px solid #cbd5e1;background:#fff;border-radius:8px;cursor:pointer;font-family:inherit}.add{background:#dd0031;color:#fff;border:0}',
      html: '<div class="row"><input type="text" value="HTML"><input type="number" value="5"><button>حذف</button></div><div class="row"><input type="text" value="Angular"><input type="number" value="3"><button>حذف</button></div><button class="add">+ إضافة مهارة</button>' },

    { t: 'h2', text: 'مراقبة التغييرات' },
    { t: 'code', lang: 'ts', code: `
import { debounceTime, distinctUntilChanged } from 'rxjs';

ngOnInit(): void {
  // مراقبة حقل واحد
  this.form.controls.search.valueChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe(term => this.search(term ?? ''));

  // تفعيل حقل بحسب آخر
  this.form.controls.hasCompany.valueChanges.subscribe(has => {
    const company = this.form.controls.companyName;
    has ? company.enable() : company.disable();
  });
}` },
    { t: 'tip', text: '`debounceTime(300)` تنتظر توقّف المستخدم عن الكتابة قبل إرسال طلب البحث — توفّر عشرات الطلبات غير الضرورية.' },

    { t: 'h2', text: 'دوال مفيدة' },
    { t: 'code', lang: 'ts', code: `
this.form.value              // القيم (بلا الحقول المعطّلة)
this.form.getRawValue()      // كل القيم شاملة المعطّلة

this.form.patchValue({ name: 'سارة' });   // تحديث جزئي
this.form.setValue({ … });                // تحديث كامل (كل الحقول)

this.form.reset();                        // تصفير
this.form.reset({ name: 'قيمة أولية' });

this.form.markAllAsTouched();             // إظهار كل الأخطاء
this.form.controls.email.setErrors({ taken: true });  // خطأ من الخادم` },

    { t: 'exercise',
      title: 'تمرين: نموذج تسجيل كامل',
      brief: 'ابنِ نموذج تسجيل تفاعلياً بكل أنواع التحقّق.',
      requirements: [
        'الحقول: الاسم (إلزامي، 3 محارف على الأقل، بلا فراغات فقط).',
        'البريد (إلزامي + صيغة صحيحة).',
        'الجوال (نمط `05` + 8 أرقام).',
        'كلمة المرور (8 محارف على الأقل، تتضمّن حرفاً ورقماً) وتأكيدها مع مدقّق تطابق على المجموعة.',
        'مجموعة متداخلة `address` فيها المدينة والرمز البريدي.',
        '`FormArray` للمهارات: كل مهارة اسم ومستوى من 1 إلى 5، مع إضافة وحذف.',
        'مربّع موافقة على الشروط بـ `Validators.requiredTrue`.',
        'رسائل خطأ عربية واضحة تظهر بعد `touched` فقط.',
        'زر الإرسال معطّل حتى يصحّ النموذج، وعند الإرسال يطبع `form.value`.'
      ],
      hints: [
        'مدقّق التطابق يُوضع على المجموعة لا على الحقل.',
        '`get skills()` تُرجع `FormArray` بعد تحويل النوع.',
        'استخدم `markAllAsTouched()` عند محاولة إرسال نموذج غير صالح.'
      ],
      solution: { lang: 'ts', code: `
import { Component, inject } from '@angular/core';
import {
  FormBuilder, FormArray, ReactiveFormsModule,
  Validators, AbstractControl, ValidationErrors, ValidatorFn
} from '@angular/forms';

function noWhitespace(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const v = c.value as string;
    if (!v) return null;
    return v.trim().length ? null : { whitespace: true };
  };
}

function strongPassword(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const v = c.value as string;
    if (!v) return null;
    const ok = /[a-zA-Z]/.test(v) && /\\d/.test(v);
    return ok ? null : { weakPassword: true };
  };
}

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const p = group.get('password')?.value;
  const c = group.get('confirmPassword')?.value;
  return p === c ? null : { mismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), noWhitespace()]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^05[0-9]{8}$/)]],

    passwords: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), strongPassword()]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordsMatch }),

    address: this.fb.group({
      city: ['', Validators.required],
      zip: ['', Validators.pattern(/^[0-9]{5}$/)]
    }),

    skills: this.fb.array([this.createSkill()]),

    terms: [false, Validators.requiredTrue]
  });

  get skills(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  private createSkill() {
    return this.fb.group({
      title: ['', Validators.required],
      level: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  addSkill(): void { this.skills.push(this.createSkill()); }
  removeSkill(i: number): void { this.skills.removeAt(i); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('البيانات:', this.form.value);
  }
}` },
      solutionNote: 'في القالب: افحص `form.controls.name.touched && form.controls.name.errors?.["minlength"]` وهكذا لكل حقل، واعرض رسالة عربية مناسبة.'
    },

    { t: 'quiz', items: [
      { q: 'لماذا تُفضَّل النماذج التفاعلية في المشاريع الحقيقية؟', options: ['أقصر كتابة', 'النموذج معرّف في الصنف فيسهل اختباره والتحكّم فيه ديناميكياً', 'لا تحتاج استيراداً', 'تعمل بلا HTML'], answer: 1,
        explain: 'المنطق في TypeScript: قابل للاختبار بلا DOM، ويدعم الحقول الديناميكية بسهولة.' },
      { q: 'متى يجب إظهار رسالة الخطأ للمستخدم؟', options: ['فور تحميل الصفحة', 'بعد أن يلمس الحقل (`touched`) أو يغيّره (`dirty`)', 'عند الإرسال فقط', 'لا تظهرها'], answer: 1,
        explain: 'تلوين نموذج فارغ بالأحمر تجربة سيئة؛ اشرط دائماً بـ touched أو dirty.' },
      { q: 'ماذا يُرجع المدقّق المخصّص عند نجاح التحقّق؟', options: ['`true`', '`null`', '`{}`', '`false`'], answer: 1,
        explain: '`null` تعني «لا أخطاء»؛ أي كائن يُرجَع يُعدّ خطأً.' },
      { q: 'أين يوضع مدقّق تطابق كلمتَي المرور؟', options: ['على حقل كلمة المرور', 'على المجموعة `FormGroup` التي تضمّ الحقلين', 'على حقل التأكيد', 'في القالب'], answer: 1,
        explain: 'المدقّق يحتاج الوصول إلى الحقلين معاً، فمكانه المجموعة الأب.' },
      { q: 'ما وظيفة `markAllAsTouched()`؟', options: ['تصفير النموذج', 'تعليم كل الحقول كملموسة لإظهار الأخطاء عند محاولة إرسال غير صالح', 'تعطيل الحقول', 'إرسال النموذج'], answer: 1,
        explain: 'تحلّ مشكلة عدم ظهور الأخطاء حين يضغط المستخدم إرسال دون لمس الحقول.' }
    ]}
  ]
};
