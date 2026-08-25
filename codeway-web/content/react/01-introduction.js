'use strict';

module.exports = {
  slug: '01-introduction',
  title: 'مقدمة في React ولماذا المكوّنات',
  summary: 'ما المشكلة التي حلّتها React، وما معنى «الواجهة دالة من الحالة»، ومتى تحتاجها ومتى لا.',
  duration: 40,
  level: 'مبتدئ',
  tags: ['مفاهيم', 'أساسيات'],
  objectives: [
    'تشرح المشكلة التي وُجدت React لحلّها.',
    'تفرّق بين النهج الأمري والنهج التصريحي.',
    'تفهم فكرة المكوّن والـ DOM الافتراضي.',
    'تعرف متى تستخدم React ومتى تكون مبالغة.',
    'تميّز بين React ومكتبات وأطر أخرى.'
  ],
  quickRef: [
    { code: 'Component', desc: 'دالة تُرجع واجهة' },
    { code: 'props', desc: 'بيانات تدخل المكوّن من أبيه' },
    { code: 'state', desc: 'بيانات يملكها المكوّن وتتغيّر' },
    { code: 'UI = f(state)', desc: 'الواجهة دالة من الحالة' },
    { code: 'Virtual DOM', desc: 'نسخة خفيفة تُقارَن قبل التحديث' }
  ],
  blocks: [
    { t: 'h2', text: 'المشكلة قبل React' },
    { t: 'p', text: 'تخيّل تطبيق سلّة تسوّق. عند إضافة منتج عليك يدوياً: تحديث عدّاد السلة، وإضافة صف في القائمة، وإعادة حساب الإجمالي، وتفعيل زر الدفع، وإخفاء رسالة «السلة فارغة». خمس عمليات لتغيير واحد.' },
    { t: 'code', lang: 'js', title: 'النهج الأمري — تقول «كيف» خطوة بخطوة', code: `
function addToCart(product) {
  cart.push(product);

  document.getElementById('count').textContent = cart.length;

  const li = document.createElement('li');
  li.textContent = product.name;
  document.getElementById('list').appendChild(li);

  document.getElementById('total').textContent = calcTotal(cart);
  document.getElementById('checkout').disabled = false;
  document.getElementById('empty-msg').style.display = 'none';
}` },
    { t: 'p', text: 'مع نمو التطبيق يصبح تتبّع «من يحدّث ماذا ومتى» كابوساً. تنسى تحديث عنصر فتظهر بيانات قديمة، وتظهر أخطاء يصعب تتبّعها لأن الحقيقة موزّعة بين متغيّراتك والـ DOM.' },

    { t: 'h2', text: 'الفكرة المركزية: الواجهة دالة من الحالة' },
    { t: 'p', text: 'React تقلب المعادلة. أنت لا تصف **كيف** تعدّل الواجهة، بل تصف **كيف يجب أن تبدو** الواجهة عند كل حالة ممكنة. ثم تغيّر الحالة فقط، وتتكفّل React بالباقي.' },
    { t: 'code', lang: 'jsx', title: 'النهج التصريحي — تقول «ماذا» فقط', code: `
function Cart({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  if (items.length === 0) {
    return <p>السلة فارغة</p>;
  }

  return (
    <div>
      <span>عدد المنتجات: {items.length}</span>
      <ul>
        {items.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
      <strong>الإجمالي: {total} ريالاً</strong>
      <button>إتمام الشراء</button>
    </div>
  );
}` },
    { t: 'p', text: 'أضف عنصراً إلى `items` وستتحدّث كل هذه الأجزاء تلقائياً. لا `getElementById`، ولا تتبّع يدوي، ولا نسيان.' },
    { t: 'note', title: 'المعادلة التي تلخّص React', text: '**UI = f(state)** — الواجهة نتيجة دالة تأخذ الحالة. غيّر المدخلات فتتغيّر المخرجات. هذا كل شيء.' },

    { t: 'h2', text: 'ما هو المكوّن؟' },
    { t: 'p', text: 'المكوّن (Component) هو **دالة جافاسكربت تُرجع واجهة**. تبني تطبيقك من مكوّنات صغيرة تتركّب فوق بعضها، تماماً كما تبني صفحة HTML من عناصر.' },
    { t: 'code', lang: 'jsx', code: `
function Badge({ text }) {
  return <span className="badge">{text}</span>;
}

function ProductCard({ product }) {
  return (
    <article className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <Badge text={product.category} />
      <p>{product.price} ريالاً</p>
    </article>
  );
}

function ProductList({ products }) {
  return (
    <div className="grid">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}` },
    { t: 'demo', title: 'النتيجة المرسومة', height: 300,
      css: '.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.card{border:1px solid #e2e8f0;border-radius:12px;padding:12px}.ph{height:70px;background:linear-gradient(135deg,#0aa5c7,#6366f1);border-radius:8px;margin-bottom:8px}.card h3{font-size:1em;margin:0 0 6px}.badge{display:inline-block;padding:2px 10px;border-radius:99px;background:#e0f2fe;color:#0369a1;font-size:.78em}p{margin:6px 0 0;color:#64748b;font-size:.9em}',
      html: '<div class="grid"><article class="card"><div class="ph"></div><h3>سماعة</h3><span class="badge">صوتيات</span><p>299 ريالاً</p></article><article class="card"><div class="ph"></div><h3>لوحة مفاتيح</h3><span class="badge">ملحقات</span><p>450 ريالاً</p></article><article class="card"><div class="ph"></div><h3>ماوس</h3><span class="badge">ملحقات</span><p>120 ريالاً</p></article></div>' },
    { t: 'p', text: 'لاحظ الفوائد: `ProductCard` يُكتب مرة ويُستخدم مئات المرات. تعديل تصميم البطاقة يتم في مكان واحد. وكل مكوّن قابل للاختبار والفهم بمعزل عن غيره.' },

    { t: 'h2', text: 'الـ DOM الافتراضي' },
    { t: 'p', text: 'تعديل DOM الحقيقي عملية بطيئة نسبياً. لو أعادت React رسم كل شيء عند كل تغيير لكان التطبيق بطيئاً. الحل:' },
    { t: 'steps', items: [
      'تحتفظ React بنسخة خفيفة من الواجهة كأشياء جافاسكربت عادية — هذا هو **الـ DOM الافتراضي**.',
      'عند تغيّر الحالة، تبني نسخة جديدة كاملة (رخيصة لأنها مجرّد كائنات).',
      'تقارن الجديدة بالقديمة وتحدّد **الفروق فقط** (عملية تُسمّى Reconciliation).',
      'تطبّق تلك الفروق وحدها على DOM الحقيقي.'
    ]},
    { t: 'p', text: 'النتيجة: تكتب كأنك تعيد رسم كل شيء، وتحصل على أداء تحديث انتقائي دقيق.' },
    { t: 'tip', text: 'لا تحتاج فهم آلية المقارنة بالتفصيل لتستخدم React، لكن معرفتها تفسّر لك لاحقاً **لماذا** المفاتيح `key` مهمة في القوائم ولماذا لا يجوز تعديل الحالة مباشرة.' },

    { t: 'h2', text: 'مبدأ التدفّق أحادي الاتجاه' },
    { t: 'p', text: 'البيانات في React تنزل من الأب إلى الابن عبر `props` فقط — لا العكس. الابن لا يستطيع تعديل بيانات أبيه مباشرة، بل يستدعي دالة مرّرها له الأب.' },
    { t: 'demo', title: 'اتجاه البيانات', height: 250,
      css: '.n{border:2px solid #6366f1;border-radius:10px;padding:8px 14px;text-align:center;background:#eef2ff;font-weight:700}.lvl{display:flex;gap:12px;justify-content:center;margin:10px 0}.arrow{text-align:center;color:#6366f1;font-size:1.4em}small{display:block;font-weight:400;color:#64748b;font-size:.75em}',
      html: '<div class="n">App<small>يملك الحالة</small></div><div class="arrow">↓ props</div><div class="lvl"><div class="n">Header</div><div class="n">ProductList</div></div><div class="arrow">↓ props</div><div class="lvl"><div class="n">ProductCard</div><div class="n">ProductCard</div></div>' },
    { t: 'note', text: 'هذا القيد يبدو مزعجاً في البداية لكنه أعظم ميزة: عندما تظهر بيانات خاطئة، تعرف بالضبط أين تبحث — في المكوّن الذي يملك تلك الحالة، لا في أي مكان من التطبيق.' },

    { t: 'h2', text: 'متى تستخدم React؟ ومتى لا؟' },
    { t: 'table', head: ['استخدمها حين', 'لا تستخدمها حين'], rows: [
      ['الواجهة تتغيّر كثيراً بتفاعل المستخدم', 'الموقع محتوى ثابت بلا تفاعل يُذكر'],
      ['تتكرّر نفس البنية بأشكال مختلفة', 'صفحة واحدة بسيطة'],
      ['حالة معقّدة تؤثّر في أماكن متعدّدة', 'يكفيك سطران من جافاسكربت'],
      ['فريق يعمل على أجزاء متفرّقة', 'مدونة أو صفحة هبوط'],
      ['ستبني تطبيق جوال لاحقاً (React Native)', 'الأداء الأولي وحجم الحزمة أولوية قصوى']
    ]},
    { t: 'warn', title: 'لا تقفز إلى React مبكراً', text: 'React تُبنى **فوق** JavaScript لا بدلاً منها. إن لم تتقن الدوال والمصفوفات والتفكيك والوعود، فستقاتل في معركتين معاً. أتقن الأساس أولاً.' },

    { t: 'h2', text: 'React في المشهد العام' },
    { t: 'table', head: ['الأداة', 'النوع', 'ما يميّزها'], rows: [
      ['**React**', 'مكتبة واجهة', 'مرنة، مجتمع ضخم، تختار بقية الأدوات بنفسك'],
      ['**Vue**', 'إطار تقدّمي', 'أسهل منحنى تعلّم، قوالب قريبة من HTML'],
      ['**Angular**', 'إطار متكامل', 'كل شيء جاهز، مبني على TypeScript، مناسب للمؤسسات'],
      ['**Svelte**', 'مترجم', 'يترجم إلى JS عادية، لا وقت تشغيل تقريباً'],
      ['**Next.js**', 'إطار فوق React', 'العرض من الخادم، التوجيه، وتحسين تلقائي']
    ]},
    { t: 'p', text: 'React **مكتبة** لا إطار عمل: تعطيك بناء الواجهة فقط، وتترك لك اختيار التوجيه وإدارة الحالة وطلبات الشبكة. هذه مرونة وعبء في آن واحد.' },

    { t: 'h2', text: 'ماذا ستتعلّم في هذا المسار؟' },
    { t: 'ol', items: [
      'إعداد المشروع وكتابة JSX.',
      'بناء المكوّنات وتمرير `props`.',
      'إدارة الحالة بـ `useState` والتعامل مع الأحداث.',
      'العرض الشرطي والقوائم والمفاتيح.',
      'النماذج والمدخلات المتحكَّم بها.',
      '`useEffect` وجلب البيانات من واجهة برمجية.',
      'رفع الحالة و`useContext` لتفادي تمرير props الطويل.',
      '`useReducer` والـ Hooks المخصّصة وتحسين الأداء.',
      'التوجيه بين الصفحات.',
      'مشروع تطبيقي متكامل.'
    ]},

    { t: 'exercise',
      title: 'تمرين ذهني: فكّك واجهة إلى مكوّنات',
      brief: 'لا كود في هذا التمرين — بل تدريب على «التفكير بالمكوّنات»، وهو أهم مهارة في React.',
      requirements: [
        'افتح أي موقع تعرفه (متجر، شبكة اجتماعية، منصة تعليمية).',
        'ارسم مستطيلات حول كل جزء قابل لإعادة الاستخدام.',
        'سمِّ كل مكوّن باسم واضح: `SearchBar`, `ProductCard`, `Sidebar`.',
        'ارسم شجرة تبيّن أي مكوّن يحتوي أيّاً.',
        'حدّد لكل مكوّن: ما البيانات التي يستقبلها (props)؟',
        'حدّد أي مكوّن يجب أن **يملك** الحالة المشتركة.'
      ],
      hints: [
        'قاعدة المسؤولية الواحدة: إن كان المكوّن يفعل أكثر من شيء، قسّمه.',
        'الحالة المشتركة تُوضع في أقرب أب مشترك للمكوّنات التي تحتاجها.',
        'المكوّن الجيد يمكن وصفه بجملة واحدة.'
      ],
      solution: { lang: 'text', title: 'مثال: شجرة مكوّنات متجر', code: `
App
├── Header
│   ├── Logo
│   ├── SearchBar          props: value, onSearch
│   └── CartButton         props: itemsCount
├── Main
│   ├── FilterSidebar      props: categories, selected, onChange
│   └── ProductGrid        props: products
│       └── ProductCard    props: product, onAddToCart
│           ├── ProductImage
│           ├── ProductInfo
│           └── AddToCartButton
└── Footer

الحالة المشتركة (cart, searchQuery, selectedCategory)
تُوضع في App لأنه أقرب أب مشترك بين Header و Main.` },
      solutionNote: 'هذا التمرين يبدو بسيطاً لكنه يفصل بين من يكتب React ومن يتقنها.'
    },

    { t: 'quiz', items: [
      { q: 'ما معنى «الواجهة دالة من الحالة»؟', options: ['أن كل واجهة تحتاج دالة', 'أنك تصف شكل الواجهة لكل حالة، وReact تتكفّل بالتحديث', 'أن الحالة تُخزّن في دالة', 'أن الدوال أسرع'], answer: 1,
        explain: 'النهج التصريحي: تصف «ماذا» لا «كيف»، وتغيّر الحالة فقط.' },
      { q: 'ما وظيفة الـ DOM الافتراضي؟', options: ['تخزين البيانات', 'مقارنة نسختين لتحديد أقل تغييرات لازمة على DOM الحقيقي', 'تسريع الشبكة', 'ترجمة JSX'], answer: 1,
        explain: 'المقارنة على كائنات جافاسكربت رخيصة، فتُطبَّق الفروق فقط على DOM البطيء.' },
      { q: 'كيف تنتقل البيانات في React؟', options: ['في كل الاتجاهات', 'من الأب إلى الابن عبر props فقط', 'من الابن إلى الأب مباشرة', 'عبر متغيّرات عامة'], answer: 1,
        explain: 'التدفّق أحادي الاتجاه؛ الابن يبلّغ الأب باستدعاء دالة مرّرها الأب له.' },
      { q: 'React هي…', options: ['إطار عمل متكامل', 'مكتبة لبناء الواجهات', 'لغة برمجة', 'قاعدة بيانات'], answer: 1,
        explain: 'مكتبة تركّز على الواجهة، وتترك التوجيه وإدارة الحالة لاختيارك.' },
      { q: 'متى تكون React خياراً غير مناسب؟', options: ['في التطبيقات التفاعلية', 'في موقع محتوى ثابت بلا تفاعل يُذكر', 'في المشاريع الكبيرة', 'مع الفرق الكبيرة'], answer: 1,
        explain: 'المحتوى الثابت يُخدَم أفضل بـ HTML بسيط: أسرع تحميلاً وأبسط صيانة.' }
    ]}
  ]
};
