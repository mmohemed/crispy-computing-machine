'use strict';

module.exports = {
  slug: '09-components',
  title: 'المكوّنات وأفضل الممارسات',
  summary: 'كيف تنظّم أصنافاً كثيرة، وتبني مكوّنات قابلة لإعادة الاستخدام، وتتجنّب فوضى الترميز.',
  duration: 45,
  level: 'متقدم',
  tags: ['التنظيم', 'ممارسات'],
  objectives: [
    'ترتّب الأصناف بمنطق ثابت.',
    'تبني مكوّنات بمتغيّرات (variants) منظّمة.',
    'تستخدم أدوات دمج الأصناف.',
    'تتجنّب أخطاء شائعة تكسر Tailwind.',
    'تحسّن حجم الناتج وأداء المشروع.'
  ],
  quickRef: [
    { code: 'prettier-plugin-tailwindcss', desc: 'ترتيب الأصناف آلياً' },
    { code: 'clsx / cn()', desc: 'دمج الأصناف الشرطية' },
    { code: 'tailwind-merge', desc: 'حلّ تعارض الأصناف' },
    { code: 'cva', desc: 'إدارة متغيّرات المكوّن' },
    { code: 'اسم الصنف كاملاً', desc: 'لا تبنِ الأسماء ديناميكياً' }
  ],
  blocks: [
    { t: 'h2', text: 'مشكلة السطر الطويل' },
    { t: 'p', text: 'أول ما يزعج في Tailwind: سطر بعشرين صنفاً. لكن المشكلة الحقيقية ليست الطول بل **الفوضى**: كل مطوّر يرتّبها بطريقته فيصعب المسح البصري والمقارنة.' },
    { t: 'code', lang: 'bash', title: 'الحل: ترتيب آلي', code: 'npm install -D prettier prettier-plugin-tailwindcss' },
    { t: 'code', lang: 'json', title: '.prettierrc', code: `
{
  "plugins": ["prettier-plugin-tailwindcss"]
}` },
    { t: 'compare', lang: 'html', bad: {
      code: '<div class="text-white p-4 flex bg-sky-600 rounded-lg items-center hover:bg-sky-700 gap-2 font-bold">',
      why: 'ترتيب عشوائي: تبحث عن اللون بين الأصناف بلا منطق.'
    }, good: {
      code: '<div class="flex items-center gap-2 rounded-lg bg-sky-600 p-4 font-bold text-white hover:bg-sky-700">',
      why: 'ترتيب موحّد يفرضه الملحق آلياً: التخطيط ← المسافات ← المظهر ← النص ← الحالات.'
    }},
    { t: 'tip', text: 'ثبّت هذا الملحق في أول يوم. يرتّب الأصناف عند كل حفظ، فتتوقّف نقاشات الفريق حول الترتيب تماماً.' },

    { t: 'h2', text: 'المكوّن هو وحدة إعادة الاستخدام' },
    { t: 'p', text: 'لا تكرّر عشرين صنفاً في عشرة أماكن. أنشئ مكوّناً — هذا هو الحل الصحيح لا `@apply`.' },
    { t: 'code', lang: 'jsx', title: 'React', code: `
export function Button({ variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-sky-600 text-white hover:bg-sky-700',
    ghost:   'border-2 border-sky-600 text-sky-600 hover:bg-sky-50',
    danger:  'bg-rose-600 text-white hover:bg-rose-700'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-7 py-3.5 text-lg'
  };

  return (
    <button
      className={\`\${base} \${variants[variant]} \${sizes[size]} \${className}\`}
      {...props}
    />
  );
}` },
    { t: 'code', lang: 'jsx', title: 'الاستخدام', code: `
<Button>إرسال</Button>
<Button variant="ghost" size="sm">إلغاء</Button>
<Button variant="danger" size="lg">حذف</Button>
<Button className="w-full">بعرض كامل</Button>` },
    { t: 'demo', title: 'المتغيّرات المولّدة', height: 240,
      css: 'button{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:8px;font-weight:700;transition:.2s;cursor:pointer;font-family:inherit;margin:4px;border:0}.p{background:#0284c7;color:#fff;padding:10px 20px}.g{background:transparent;color:#0284c7;border:2px solid #0284c7;padding:6px 12px;font-size:.875rem}.d{background:#e11d48;color:#fff;padding:14px 28px;font-size:1.125rem}',
      html: '<button class="p">primary / md</button><button class="g">ghost / sm</button><button class="d">danger / lg</button>' },

    { t: 'h2', text: 'أدوات الدمج' },
    { t: 'code', lang: 'bash', code: 'npm install clsx tailwind-merge' },
    { t: 'code', lang: 'ts', title: 'lib/cn.ts', code: `
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}` },
    { t: 'p', text: 'لماذا نحتاج أداتين؟ لأن كلاً منهما تحلّ مشكلة مختلفة:' },
    { t: 'code', lang: 'ts', code: `
// clsx: الدمج الشرطي
cn('p-4', isActive && 'bg-sky-600', isBig ? 'text-xl' : 'text-base')

// twMerge: حلّ التعارض — الأخير يفوز
cn('p-4', 'p-8')                    // → 'p-8'
cn('bg-red-500', 'bg-blue-500')     // → 'bg-blue-500'
cn('px-4 py-2', 'p-6')              // → 'p-6'` },
    { t: 'danger', title: 'المشكلة التي يحلّها twMerge', text: 'كتابة `class="p-4 p-8"` تجعل الفائز هو **الأخير في ملف CSS المولَّد** لا الأخير في الترميز. فقد تكتب `p-8` وتحصل على `p-4`! `twMerge` يحذف المتعارض ويُبقي الأخير فعلاً.' },
    { t: 'code', lang: 'jsx', title: 'مكوّن يقبل التخصيص بأمان', code: `
import { cn } from '@/lib/cn';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
        className
      )}
      {...props}
    />
  );
}

// الاستخدام — p-10 تتغلّب على p-6 بشكل صحيح
<Card className="p-10 bg-sky-50">…</Card>` },

    { t: 'h2', text: 'إدارة المتغيّرات بـ CVA' },
    { t: 'code', lang: 'bash', code: 'npm install class-variance-authority' },
    { t: 'code', lang: 'ts', code: `
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-sky-600 text-white hover:bg-sky-700',
        ghost:   'border-2 border-sky-600 text-sky-600 hover:bg-sky-50',
        danger:  'bg-rose-600 text-white hover:bg-rose-700'
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5',
        lg: 'px-7 py-3.5 text-lg'
      },
      block: {
        true: 'w-full'
      }
    },
    compoundVariants: [
      { variant: 'ghost', size: 'lg', class: 'border-4' }
    ],
    defaultVariants: { variant: 'primary', size: 'md' }
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
  & VariantProps<typeof button>;

export function Button({ variant, size, block, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(button({ variant, size, block }), className)}
      {...props}
    />
  );
}` },
    { t: 'tip', text: 'CVA يعطيك أنواعاً آمنة تلقائياً: `<Button variant="primry">` سيعطي خطأ ترجمة في TypeScript. هذا وحده يستحق التبنّي في أي مشروع جادّ.' },

    { t: 'h2', text: 'خطأ يكسر Tailwind تماماً' },
    { t: 'danger', title: 'لا تبنِ أسماء الأصناف ديناميكياً', text: 'Tailwind يفحص ملفاتك كنصّ ويبحث عن **أسماء أصناف كاملة**. لا يشغّل كودك ولا يفهم تسلسل النصوص. أي اسم مبني ديناميكياً لن يُولَّد إطلاقاً.' },
    { t: 'compare', lang: 'jsx', bad: {
      code: '// ✗ لن يعمل\nconst color = "sky";\n<div className={`bg-${color}-500`} />\n\n// ✗ ولا هذا\n<div className={`text-${size}`} />\n\n// ✗ ولا هذا\n<div className={"p-" + spacing} />',
      why: 'Tailwind لا يرى `bg-sky-500` في الملف، فلا يولّدها، فلا يوجد الصنف في CSS.'
    }, good: {
      code: '// ✓ خريطة بأسماء كاملة\nconst colors = {\n  sky: "bg-sky-500",\n  rose: "bg-rose-500",\n  emerald: "bg-emerald-500"\n};\n<div className={colors[color]} />\n\n// ✓ أو شرط صريح\n<div className={isActive ? "bg-sky-500" : "bg-slate-300"} />',
      why: 'الأسماء الكاملة موجودة في الملف، فيراها الفاحص ويولّدها.'
    }},
    { t: 'note', text: 'إن اضطررت لأسماء ديناميكية (من قاعدة بيانات مثلاً)، أضفها إلى قائمة `@source inline(…)` في CSS كي يعرف Tailwind بوجودها.' },

    { t: 'h2', text: 'متى تكتب CSS مخصّصة؟' },
    { t: 'p', text: 'Tailwind لا تمنعك من CSS. هناك حالات تكون فيها CSS المخصّصة هي الأصح:' },
    { t: 'ul', items: [
      '**حركات معقّدة** بعدة إطارات مفتاحية.',
      '**تنسيق محتوى خارجي** من محرّر نصوص أو Markdown (أو استخدم إضافة typography).',
      '**خصائص نادرة** لا تغطّيها Tailwind.',
      '**تنسيق شريط التمرير** أو عناصر المتصفح الداخلية.',
      '**أنماط الطباعة المعقّدة**.'
    ]},
    { t: 'code', lang: 'css', code: `
@layer components {
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--color-slate-400) transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--color-slate-400);
    border-radius: 999px;
  }
}` },

    { t: 'h2', text: 'تحسين الناتج' },
    { t: 'ul', items: [
      '**الفحص التلقائي**: Tailwind 4 يكتشف ملفاتك تلقائياً ويتجاهل `.gitignore` — نادراً ما تحتاج إعداداً.',
      '**لا تستورد كل شيء**: `@import "tailwindcss"` تشمل ما تحتاجه فقط بعد الفحص.',
      '**احذف الأصناف غير المستخدمة** من الترميز نفسه — لا تُبقِ كوداً معطّلاً بالتعليق.',
      '**راقب الحجم**: `npm run build` ثم قِس الملف الناتج مضغوطاً.',
      '**تجنّب `@apply` المفرط**: كل قاعدة تضيف حجماً ثابتاً لا يُعاد استخدامه.'
    ]},
    { t: 'code', lang: 'bash', code: `
# البناء وقياس الحجم
npx @tailwindcss/cli -i src/style.css -o dist/style.css --minify
gzip -c dist/style.css | wc -c` },

    { t: 'h2', text: 'قائمة أفضل الممارسات' },
    { t: 'steps', items: [
      'ثبّت `prettier-plugin-tailwindcss` من اليوم الأول.',
      'استخدم المكوّنات لإعادة الاستخدام لا `@apply`.',
      'استخدم `cn()` (clsx + tailwind-merge) في كل مكوّن يقبل `className`.',
      'استخدم CVA للمكوّنات ذات المتغيّرات المتعدّدة.',
      'لا تبنِ أسماء أصناف ديناميكياً أبداً.',
      'استخدم الاتجاهات المنطقية (`ps`/`pe`/`start`/`end`) في المشاريع العربية.',
      'ابدأ بالجوال ثم أضف نقاط التوقف.',
      'احترم `motion-reduce` في كل حركة.',
      'استخدم `focus-visible` لا `focus` لمؤشّر التركيز.',
      'خصّص الثيم في `@theme` بدل نثر القيم العشوائية.'
    ]},

    { t: 'h2', text: 'مكتبة مكوّنات مصغّرة' },
    { t: 'code', lang: 'jsx', title: 'components/ui/Card.jsx', code: `
import { cn } from '@/lib/cn';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white shadow-sm',
        'dark:border-slate-700 dark:bg-slate-800',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('border-b border-slate-200 p-5 dark:border-slate-700', className)} {...props} />;
}

export function CardBody({ className, ...props }) {
  return <div className={cn('p-5', className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn('border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900', className)} {...props} />;
}` },
    { t: 'code', lang: 'jsx', title: 'الاستخدام', code: `
<Card className="max-w-md">
  <CardHeader>
    <h3 className="text-lg font-bold">تفاصيل الطلب</h3>
  </CardHeader>

  <CardBody>
    <p className="text-slate-500">سيصل طلبك خلال ثلاثة أيام.</p>
  </CardBody>

  <CardFooter className="flex gap-2">
    <Button size="sm">تتبّع</Button>
    <Button size="sm" variant="ghost">إلغاء</Button>
  </CardFooter>
</Card>` },
    { t: 'demo', title: 'النتيجة', height: 260,
      css: '.card{border-radius:16px;border:1px solid #e2e8f0;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.08);max-width:340px;overflow:hidden}.h{border-bottom:1px solid #e2e8f0;padding:16px}.h h3{margin:0;font-size:1.05rem}.b{padding:16px;color:#64748b;font-size:.92em}.f{border-top:1px solid #e2e8f0;background:#f8fafc;padding:14px;display:flex;gap:8px}button{border-radius:8px;padding:6px 14px;font-size:.85em;font-weight:700;font-family:inherit;cursor:pointer;border:0}.p{background:#0284c7;color:#fff}.g{background:transparent;color:#0284c7;border:2px solid #0284c7}',
      html: '<div class="card"><div class="h"><h3>تفاصيل الطلب</h3></div><div class="b">سيصل طلبك خلال ثلاثة أيام عمل.</div><div class="f"><button class="p">تتبّع</button><button class="g">إلغاء</button></div></div>' },

    { t: 'exercise',
      title: 'تمرين: مكتبة مكوّنات',
      brief: 'ابنِ خمسة مكوّنات قابلة لإعادة الاستخدام بأفضل الممارسات.',
      requirements: [
        'دالة `cn()` تجمع `clsx` و `tailwind-merge`.',
        '`Button` بـ CVA: ثلاثة أنماط، ثلاثة أحجام، وخيار `block`.',
        '`Card` مركّب: `Card` و `CardHeader` و `CardBody` و `CardFooter`.',
        '`Badge` بخمسة ألوان دلالية وحجمين.',
        '`Input` مع حالة خطأ ورسالة، وتسمية مرتبطة.',
        '`Alert` بأربعة أنواع وأيقونة وزر إغلاق اختياري.',
        'كل مكوّن يقبل `className` ويدمجه بـ `cn()`.',
        'كل مكوّن يدعم الوضع الليلي.',
        'كل مكوّن تفاعلي له `focus-visible`.',
        'لا اسم صنف مبني ديناميكياً في أي مكان.',
        'ثبّت `prettier-plugin-tailwindcss` وشغّله على المشروع.'
      ],
      hints: [
        'CVA يعطيك أنواعاً آمنة عبر `VariantProps`.',
        '`cn()` تحلّ تعارض `p-6` مع `p-10` القادمة من `className`.',
        'استخدم خريطة أصناف كاملة لا بناء نصّي.'
      ],
      solution: { lang: 'tsx', code: `
/* ===== lib/cn.ts ===== */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ===== components/ui/Button.tsx ===== */
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-sky-600 text-white hover:bg-sky-700 focus-visible:outline-sky-600',
        ghost: 'border-2 border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950',
        danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600'
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5',
        lg: 'px-7 py-3.5 text-lg'
      },
      block: { true: 'w-full' }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export function Button({ variant, size, block, className, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size, block }), className)} {...props} />;
}

/* ===== components/ui/Card.tsx ===== */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white shadow-sm',
        'dark:border-slate-700 dark:bg-slate-800',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-b border-slate-200 p-5 dark:border-slate-700', className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'border-t border-slate-200 bg-slate-50 p-5',
        'dark:border-slate-700 dark:bg-slate-900',
        className
      )}
      {...props}
    />
  );
}

/* ===== components/ui/Badge.tsx ===== */
const badge = cva('inline-flex items-center rounded-full font-bold', {
  variants: {
    tone: {
      neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
      info: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
      success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
    },
    size: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm'
    }
  },
  defaultVariants: { tone: 'neutral', size: 'md' }
});

export function Badge({ tone, size, className, ...props }) {
  return <span className={cn(badge({ tone, size }), className)} {...props} />;
}

/* ===== components/ui/Input.tsx ===== */
export function Input({ label, error, id, className, ...props }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? \`\${id}-error\` : undefined}
        className={cn(
          'w-full rounded-lg border px-4 py-2.5 transition',
          'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200',
          'dark:border-slate-600 dark:bg-slate-900',
          error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-200',
          className
        )}
        {...props}
      />

      {error && (
        <p id={\`\${id}-error\`} className="text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* ===== components/ui/Alert.tsx ===== */
const alert = cva('flex items-start gap-3 rounded-xl border p-4', {
  variants: {
    tone: {
      info: 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200',
      success: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
      warning: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
      danger: 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200'
    }
  },
  defaultVariants: { tone: 'info' }
});

const alertIcons = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  danger: '⛔'
};

export function Alert({ tone = 'info', onClose, className, children, ...props }) {
  return (
    <div role="alert" className={cn(alert({ tone }), className)} {...props}>
      <span aria-hidden="true">{alertIcons[tone]}</span>
      <div className="flex-1">{children}</div>

      {onClose && (
        <button
          onClick={onClose}
          className="rounded p-1 transition hover:bg-black/5 focus-visible:outline-2"
          aria-label="إغلاق"
        >
          ✕
        </button>
      )}
    </div>
  );
}` },
      solutionNote: 'لاحظ `alertIcons` خريطة بقيم كاملة — لا بناء نصّي لأسماء الأصناف في أي مكان.'
    },

    { t: 'quiz', items: [
      { q: 'لماذا لا يعمل `` className={`bg-${color}-500`} ``؟', options: ['خطأ صياغة', 'لأن Tailwind يبحث عن أسماء أصناف كاملة في النص ولا ينفّذ كودك', 'بطيء', 'يحتاج إعداداً'], answer: 1,
        explain: 'الفاحص نصّي بحت؛ الاسم المبني وقت التشغيل غير موجود في الملف فلا يُولَّد.' },
      { q: 'ما المشكلة التي يحلّها `tailwind-merge`؟', options: ['الأداء', 'تعارض الأصناف: `p-4 p-8` قد لا يفوز فيها الأخير كما تتوقّع', 'الترتيب', 'الحجم'], answer: 1,
        explain: 'الفائز يحدّده ترتيب CSS المولَّد لا ترتيب الترميز؛ `twMerge` يحسمها.' },
      { q: 'ما البديل الصحيح لـ `@apply` في مشروع React؟', options: ['CSS Modules', 'مكوّن قابل لإعادة الاستخدام', 'متغيّرات CSS', 'قيم عشوائية'], answer: 1,
        explain: 'المكوّن هو وحدة إعادة الاستخدام الطبيعية في أطر المكوّنات.' },
      { q: 'ما فائدة CVA؟', options: ['ترتيب الأصناف', 'إدارة متغيّرات المكوّن بأنواع آمنة ومتغيّرات مركّبة', 'ضغط CSS', 'الفحص'], answer: 1,
        explain: 'يجمع تعريف الأنماط والأنواع في مكان واحد ويمنع الأخطاء المطبعية.' },
      { q: 'ما أول أداة تثبّتها في مشروع Tailwind؟', options: ['CVA', '`prettier-plugin-tailwindcss` لترتيب الأصناف آلياً', 'clsx', 'typography'], answer: 1,
        explain: 'الترتيب الموحّد يجعل الأسطر الطويلة مقروءة وينهي نقاشات الفريق.' }
    ]}
  ]
};
