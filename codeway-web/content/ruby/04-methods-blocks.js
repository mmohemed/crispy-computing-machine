'use strict';

module.exports = {
  slug: '04-methods-blocks',
  title: 'الدوال والكتل',
  summary: 'تعريف الدوال ومعاملاتها بكل أشكالها، ثم الكتل و Proc و Lambda — أقوى ما في Ruby.',
  duration: 60,
  level: 'متوسط',
  tags: ['دوال', 'كتل', 'lambda'],
  objectives: [
    'تعرّف دوالّ بمعاملات موضعية واختيارية ومُسمّاة ومتغيّرة العدد.',
    'تفهم الكتلة (Block) وكيف تمرّرها وتستدعيها بـ `yield`.',
    'تفرّق بين `{ }` و `do…end` ومتى تستخدم كلاً منهما.',
    'تميّز بين Proc و Lambda في ثلاث نقاط جوهرية.',
    'تستخدم الاختصار `&:symbol` وتفهم كيف يعمل.',
    'تكتب دوالّ تقبل كتلة اختيارية وتتعامل مع الموارد بأمان.'
  ],
  quickRef: [
    { code: 'def name(a, b = 1)', desc: 'معامل اختياري' },
    { code: 'def name(a:, b: 2)', desc: 'معامل مُسمّى' },
    { code: 'def name(*args)', desc: 'عدد متغيّر' },
    { code: 'def name(**opts)', desc: 'مُسمّاة متغيّرة' },
    { code: 'yield', desc: 'استدعاء الكتلة' },
    { code: 'block_given?', desc: 'هل مُرِّرت كتلة؟' },
    { code: '&:upcase', desc: 'اختصار الكتلة' },
    { code: '->(x) { }', desc: 'lambda' }
  ],
  blocks: [
    { t: 'h2', text: 'تعريف الدوال' },
    { t: 'code', lang: 'ruby', code: `
def greet(name)
  "مرحباً يا #{name}"      # آخر تعبير = القيمة المُرجَعة
end

greet("سارة")              # => "مرحباً يا سارة"
greet "سارة"               # الأقواس اختيارية — لكن استخدمها

# دالة بسطر واحد (Ruby 3.0+) — تُسمّى endless method
def square(x) = x * x
def full_name = "#{@first} #{@last}"
`.trim() },

    { t: 'h2', text: 'أنواع المعاملات الخمسة' },
    { t: 'code', lang: 'ruby', code: `
# 1) موضعي — إلزامي بترتيبه
def add(a, b) = a + b

# 2) اختياري — له قيمة افتراضية
def greet(name, greeting = "مرحباً") = "#{greeting} يا #{name}"

# 3) مُسمّى — يُمرَّر بالاسم، والترتيب لا يهم
def create_user(name:, email:, role: "user", active: true)
  { name:, email:, role:, active: }   # اختصار Ruby 3.1
end

create_user(email: "a@b.com", name: "سارة")   # الترتيب حرّ

# 4) عدد متغيّر من الموضعية
def sum(*numbers) = numbers.sum
sum(1, 2, 3, 4)     # => 10

# 5) عدد متغيّر من المُسمّاة
def configure(**options)
  options.each { |key, value| puts "#{key} = #{value}" }
end
configure(host: "localhost", port: 3000)
`.trim() },
    { t: 'p', text: 'يمكن الجمع بينها، لكن **الترتيب إلزامي**:' },
    { t: 'code', lang: 'ruby', code: `
def complex(required, optional = 1, *rest, key:, opt_key: 2, **others, &block)
  # required   ← موضعي إلزامي
  # optional   ← موضعي اختياري
  # *rest      ← بقيّة الموضعية
  # key:       ← مُسمّى إلزامي
  # opt_key:   ← مُسمّى اختياري
  # **others   ← بقيّة المُسمّاة
  # &block     ← الكتلة
end
`.trim() },
    { t: 'tip', text: 'قاعدة عملية: **معاملان أو أقل ← موضعية. ثلاثة فأكثر ← مُسمّاة.** عند القراءة، `create_user(name: "سارة", role: "admin")` أوضح ألف مرة من `create_user("سارة", "admin")`.' },
    { t: 'compare', lang: 'ruby', bad: {
      code: `def send_email(to, subject, body, cc, bcc, html, priority)
  # ...
end

send_email("a@b.com", "مرحباً", "نصّ", nil, nil, true, 2)`,
      why: 'ماذا يعني `nil` الثاني؟ وماذا يعني `2`؟ لا تعرف إلا بفتح تعريف الدالة.'
    }, good: {
      code: `def send_email(to:, subject:, body:, cc: nil, bcc: nil, html: false, priority: 1)
  # ...
end

send_email(to: "a@b.com", subject: "مرحباً", body: "نصّ",
           html: true, priority: 2)`,
      why: 'الاستدعاء يوثّق نفسه، والاختياري يُحذف، وإضافة معامل جديد لا تكسر أيّ استدعاء قائم.'
    }},

    { t: 'h2', text: 'ما هي الكتلة؟' },
    { t: 'p', text: 'الكتلة قطعة شيفرة **تُمرَّر إلى دالة** لتنفّذها الدالة متى شاءت وكيفما شاءت. هي روح Ruby: `each` و `map` و `times` كلها دوالّ عادية تستقبل كتلاً.' },
    { t: 'code', lang: 'ruby', code: `
# صيغتان للكتلة نفسها
[1, 2, 3].each { |n| puts n }

[1, 2, 3].each do |n|
  puts n
end
`.trim() },
    { t: 'table', head: ['الصيغة', 'استخدمها حين'], rows: [
      ['`{ … }`', 'سطر واحد، وتهمّك **القيمة المُرجَعة** (`map`, `select`)'],
      ['`do … end`', 'عدة أسطر، وتهمّك **الآثار الجانبية** (`each`, تهيئة)']
    ]},
    { t: 'warn', title: 'فرق حقيقي في الأولوية', text: '`{ }` ترتبط بالدالة **الأقرب**، بينما `do…end` ترتبط بالدالة **الأبعد**. لهذا `puts [1,2].map { |x| x*2 }` يعمل، أما مع `do…end` بلا أقواس فقد تُمرَّر الكتلة إلى `puts` نفسها.' },

    { t: 'h2', text: 'yield — استدعاء الكتلة' },
    { t: 'p', text: 'كل دالة في Ruby تستطيع استقبال كتلة دون أن تصرّح بذلك. تستدعيها بـ `yield`.' },
    { t: 'code', lang: 'ruby', code: `
def repeat(n)
  n.times { |i| yield(i) }
end

repeat(3) { |i| puts "التكرار #{i}" }

# اختبر وجود الكتلة قبل استدعائها
def maybe_transform(value)
  return value unless block_given?
  yield(value)
end

maybe_transform(5)              # => 5
maybe_transform(5) { |x| x * 2 } # => 10
`.trim() },
    { t: 'h3', text: 'نمط «التغليف» — أقوى استخدام للكتل' },
    { t: 'code', lang: 'ruby', code: `
# قياس زمن التنفيذ
def measure(label)
  started = Time.now
  result  = yield
  puts "#{label}: #{((Time.now - started) * 1000).round(2)} مللي ثانية"
  result
end

data = measure("جلب البيانات") { fetch_from_api }

# ضمان إغلاق المورد — حتى عند حدوث خطأ
def with_file(path, mode = "r")
  file = File.open(path, mode)
  yield(file)
ensure
  file&.close
end

with_file("data.txt") { |f| puts f.read }

# إعادة المحاولة
def with_retry(times: 3)
  attempts = 0
  begin
    attempts += 1
    yield
  rescue StandardError => e
    retry if attempts < times
    raise
  end
end

with_retry(times: 5) { unstable_api_call }
`.trim() },
    { t: 'note', text: 'هذا النمط هو سرّ أناقة Ruby: تفصل **ما يتكرّر دائماً** (فتح، إغلاق، قياس، إعادة محاولة) عن **ما يتغيّر** (المنطق الفعلي). لغات أخرى تحتاج أنماط تصميم كاملة لفعل هذا.' },

    { t: 'h2', text: 'الاختصار &:symbol' },
    { t: 'code', lang: 'ruby', code: `
%w[ruby rails sinatra].map { |s| s.upcase }
%w[ruby rails sinatra].map(&:upcase)          # نفس الشيء تماماً

[1, 2, 3, 4].select { |n| n.even? }
[1, 2, 3, 4].select(&:even?)

users.map(&:name).sort
`.trim() },
    { t: 'p', text: 'كيف يعمل؟ العامل `&` يحوّل الكائن إلى كتلة باستدعاء `to_proc` عليه، و`Symbol#to_proc` يُنتج كتلة تستدعي تلك الدالة على كل عنصر.' },
    { t: 'code', lang: 'ruby', code: `
:upcase.to_proc.call("ruby")   # => "RUBY"

# يعمل مع أي كائن يستجيب لـ to_proc
double = ->(x) { x * 2 }
[1, 2, 3].map(&double)         # => [2, 4, 6]
`.trim() },
    { t: 'warn', title: 'حدّ الاختصار', text: 'يعمل فقط مع دالة **بلا معاملات** تُستدعى على العنصر نفسه. `map { |x| x * 2 }` لا يمكن اختصارها لأنها ليست استدعاء دالة على `x`.' },

    { t: 'h2', text: 'Proc و Lambda' },
    { t: 'p', text: 'الكتلة ليست كائناً — لا تستطيع تخزينها في متغيّر. لتفعل ذلك تحوّلها إلى **Proc** أو **Lambda**.' },
    { t: 'code', lang: 'ruby', code: `
# lambda — الصيغة الحديثة
double = ->(x) { x * 2 }
double.call(5)     # => 10
double.(5)         # => 10
double[5]          # => 10

# lambda — الصيغة القديمة
double = lambda { |x| x * 2 }

# proc
double = proc { |x| x * 2 }
double = Proc.new { |x| x * 2 }
`.trim() },
    { t: 'h3', text: 'الفروق الثلاثة الجوهرية' },
    { t: 'table', head: ['المعيار', 'Lambda `->`', 'Proc'], rows: [
      ['**عدد الوسائط**', 'صارمة — خطأ إن اختلف العدد', 'متساهلة — الناقص `nil` والزائد يُهمَل'],
      ['**`return`**', 'تخرج من الـ lambda فقط', 'تخرج من الدالة **المحيطة** كلها'],
      ['**`lambda?`**', '`true`', '`false`']
    ]},
    { t: 'code', lang: 'ruby', code: `
l = ->(a, b) { [a, b] }
l.call(1)        # ✗ ArgumentError

p = proc { |a, b| [a, b] }
p.call(1)        # => [1, nil]     ← لا خطأ
p.call(1, 2, 3)  # => [1, 2]       ← تجاهل الزائد

def test_lambda
  l = -> { return 10 }
  l.call
  20                # ✅ يُنفَّذ
end
test_lambda        # => 20

def test_proc
  pr = proc { return 10 }
  pr.call           # ← تخرج من test_proc فوراً!
  20                # ❌ لا يُنفَّذ أبداً
end
test_proc          # => 10
`.trim() },
    { t: 'tip', text: 'استخدم **lambda** دائماً ما لم يكن لديك سبب محدّد لغير ذلك: صرامتها في الوسائط تكشف أخطاءك مبكّراً، وسلوك `return` فيها هو المتوقّع.' },

    { t: 'h2', text: 'استقبال الكتلة كمعامل' },
    { t: 'code', lang: 'ruby', code: `
# &block يحوّل الكتلة إلى Proc قابل للتخزين والتمرير
def each_twice(items, &block)
  items.each(&block)
  items.each(&block)
end

# مفيد حين تريد تمرير الكتلة لدالة أخرى
def log_and_run(&block)
  puts "قبل التنفيذ"
  result = block.call
  puts "بعد التنفيذ"
  result
end

# تخزين الكتلة لاستخدامها لاحقاً
class EventBus
  def initialize = @handlers = Hash.new { |h, k| h[k] = [] }

  def on(event, &handler)
    @handlers[event] << handler
    self
  end

  def emit(event, *args)
    @handlers[event].each { |h| h.call(*args) }
  end
end

bus = EventBus.new
bus.on(:save) { |name| puts "حُفِظ #{name}" }
   .on(:save) { |name| puts "أُرسِل إشعار عن #{name}" }
bus.emit(:save, "مقال")
`.trim() },
    { t: 'note', text: '`yield` أسرع من `&block` لأنه لا ينشئ كائن Proc. استخدم `&block` فقط حين تحتاج **تخزين** الكتلة أو **تمريرها** لدالة أخرى.' },

    { t: 'h2', text: 'الإغلاق (Closure)' },
    { t: 'p', text: 'الكتل و Procs و Lambdas **تحتفظ بالنطاق الذي أُنشئت فيه** — ترى المتغيّرات المحلية المحيطة حتى بعد انتهاء الدالة التي أنشأتها.' },
    { t: 'code', lang: 'ruby', code: `
def make_counter
  count = 0
  -> { count += 1 }     # يرى count ويحتفظ به
end

counter = make_counter
counter.call   # => 1
counter.call   # => 2
counter.call   # => 3

# عدّاد مستقل تماماً
other = make_counter
other.call     # => 1

# مصنع دوال
def multiplier(factor)
  ->(x) { x * factor }
end

double = multiplier(2)
triple = multiplier(3)
double.call(5)   # => 10
triple.call(5)   # => 15
`.trim() },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'مكتبة أدوات وظيفية',
      brief: 'ابنِ وحدة أدوات تستخدم الكتل والـ lambdas لحلّ مشكلات متكرّرة.',
      requirements: [
        'دالة `benchmark(label)` تقيس زمن الكتلة وتُرجع نتيجتها.',
        'دالة `retry_on(*errors, times:)` تعيد المحاولة عند أخطاء محدّدة فقط.',
        'دالة `memoize` تُرجع lambda تخزّن النتائج فلا تُعيد الحساب لنفس المدخل.',
        'دالة `pipeline(*fns)` تدمج عدة lambdas في واحدة تُطبَّق بالترتيب.',
        'دالة `each_chunk(items, size)` تقسّم مجموعة وتمرّر كل جزء للكتلة.',
        'دالة `tap_log(value)` تطبع القيمة وتُرجعها كما هي (للتنقيح في السلاسل).',
        'كل دالة تقبل كتلة يجب أن تتحقّق بـ `block_given?` وترمي خطأً واضحاً إن لم تُمرَّر.',
        'اكتب في نهاية الملف أمثلة تشغيل توضّح كل دالة.'
      ],
      hints: [
        '`Hash.new { |h, k| h[k] = yield(k) }` أساس التخزين المؤقّت.',
        '`fns.reduce(value) { |acc, f| f.call(acc) }` تطبّق سلسلة الدوال.',
        '`rescue *errors => e` تمسك مجموعة أخطاء ممرّرة كمصفوفة.',
        '`items.each_slice(size)` جاهزة في Ruby — استخدمها داخلياً.'
      ],
      solution: { lang: 'ruby', code: `
# frozen_string_literal: true
# toolkit.rb — مكتبة أدوات وظيفية

module Toolkit
  module_function

  # قياس زمن التنفيذ
  def benchmark(label = "العملية")
    raise ArgumentError, "benchmark تحتاج كتلة" unless block_given?

    started = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    result  = yield
    elapsed = Process.clock_gettime(Process::CLOCK_MONOTONIC) - started

    puts "⏱  #{label}: #{(elapsed * 1000).round(2)} مللي ثانية"
    result
  end

  # إعادة المحاولة عند أخطاء محدّدة
  def retry_on(*errors, times: 3, wait: 0)
    raise ArgumentError, "retry_on تحتاج كتلة" unless block_given?
    errors = [StandardError] if errors.empty?

    attempts = 0
    begin
      attempts += 1
      yield(attempts)
    rescue *errors => e
      if attempts < times
        puts "  ↻ محاولة #{attempts} فشلت (#{e.class}) — نعيد…"
        sleep(wait) if wait.positive?
        retry
      end
      raise
    end
  end

  # تخزين مؤقّت للنتائج
  def memoize
    raise ArgumentError, "memoize تحتاج كتلة" unless block_given?

    cache = {}
    lambda do |arg|
      if cache.key?(arg)
        cache[arg]
      else
        cache[arg] = yield(arg)
      end
    end
  end

  # دمج سلسلة دوال
  def pipeline(*fns)
    ->(value) { fns.reduce(value) { |acc, f| f.call(acc) } }
  end

  # تقسيم إلى أجزاء
  def each_chunk(items, size)
    raise ArgumentError, "each_chunk تحتاج كتلة" unless block_given?

    items.each_slice(size).with_index do |chunk, index|
      yield(chunk, index)
    end
    items
  end

  # طباعة وسط سلسلة
  def tap_log(value, label = "قيمة")
    puts "🔍 #{label}: #{value.inspect}"
    value
  end
end

# ===== أمثلة =====
include Toolkit

# 1) benchmark
sum = benchmark("جمع مليون") { (1..1_000_000).sum }
puts "   النتيجة: #{sum}"

# 2) memoize
slow_square = memoize { |n| sleep(0.2); n * n }
benchmark("أول استدعاء")  { slow_square.call(12) }
benchmark("ثاني استدعاء") { slow_square.call(12) }   # فوري

# 3) pipeline
clean = pipeline(
  ->(s) { s.strip },
  ->(s) { s.downcase },
  ->(s) { s.gsub(/\\s+/, "-") }
)
puts clean.call("  Ruby Is  AWESOME  ")   # => "ruby-is--awesome"

# 4) each_chunk
each_chunk((1..10).to_a, 3) do |chunk, i|
  puts "الجزء #{i + 1}: #{chunk.inspect}"
end

# 5) retry_on
tries = 0
result = retry_on(RuntimeError, times: 4) do |attempt|
  tries += 1
  raise "فشل مؤقّت" if tries < 3
  "نجح في المحاولة #{attempt}"
end
puts result

# 6) tap_log داخل سلسلة
final = tap_log([3, 1, 2], "الأصل").sort
              .then { |a| tap_log(a, "بعد الترتيب") }
              .sum
puts "المجموع: #{final}"
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'متى تفضّل المعاملات المُسمّاة على الموضعية؟', options: ['دائماً', 'عند ثلاثة معاملات فأكثر أو حين لا يوضّح الترتيب المعنى', 'مع النصوص فقط', 'أبداً'], answer: 1,
        explain: 'الاستدعاء يوثّق نفسه، وإضافة معامل جديد لا تكسر الاستدعاءات القائمة.' },
      { q: 'ما وظيفة `yield` داخل دالة؟', options: ['تُرجع قيمة', 'تستدعي الكتلة المُمرَّرة للدالة', 'تنشئ خيطاً', 'توقف التنفيذ'], answer: 1,
        explain: 'وتستطيع تمرير وسائط لها: `yield(x, y)`. تحقّق أولاً بـ `block_given?`.' },
      { q: 'ما الفرق الأخطر بين Proc و Lambda؟', options: ['السرعة', '`return` في Proc تخرج من الدالة المحيطة كلها لا من الـ Proc فقط', 'الحجم', 'لا فرق'], answer: 1,
        explain: 'وهذا مصدر أخطاء خفية؛ استخدم lambda افتراضياً.' },
      { q: 'كيف يعمل الاختصار `&:upcase`؟', options: ['صياغة خاصة في المفسّر', '`&` يستدعي `to_proc` على الرمز فيُنتج كتلة تستدعي تلك الدالة', 'يحوّل لنصّ', 'يجمّد الرمز'], answer: 1,
        explain: 'ولهذا يعمل مع أي كائن يستجيب لـ `to_proc` بما فيه الـ lambdas.' },
      { q: 'ما فائدة نمط `def with_file(path); yield f; ensure f.close; end`؟', options: ['السرعة', 'يفصل الإعداد والتنظيف المتكرّرين عن المنطق المتغيّر ويضمن الإغلاق حتى عند الخطأ', 'يقلّل الذاكرة', 'يمنع الأخطاء'], answer: 1,
        explain: 'هذا سرّ أناقة Ruby في إدارة الموارد، ويقابل `with` في Python و try-with-resources في Java.' },
      { q: 'ما الفرق العملي بين `{ }` و `do…end`؟', options: ['لا فرق', 'الأولوية تختلف: `{}` ترتبط بالدالة الأقرب و`do…end` بالأبعد', 'السرعة', 'الأولى للأعداد'], answer: 1,
        explain: 'والعُرف: `{}` لسطر واحد تهمّك قيمته، و`do…end` لعدة أسطر بأثر جانبي.' },
      { q: 'ما معنى أن lambda «إغلاق» (Closure)؟', options: ['لا يمكن تعديلها', 'تحتفظ بالنطاق الذي أُنشئت فيه وترى متغيّراته حتى بعد انتهاء الدالة', 'مجمّدة', 'خاصة'], answer: 1,
        explain: 'وهذا أساس أنماط مثل العدّاد المستقل ومصانع الدوال.' }
    ]}
  ]
};
