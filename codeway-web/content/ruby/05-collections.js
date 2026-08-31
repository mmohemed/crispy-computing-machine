'use strict';

module.exports = {
  slug: '05-collections',
  title: 'المصفوفات والـ Hashes و Enumerable',
  summary: 'أهم درس في Ruby: بناء المجموعات والتنقّل فيها، وإتقان map و select و reduce وأخواتها.',
  duration: 65,
  level: 'متوسط',
  tags: ['مصفوفات', 'Hash', 'Enumerable'],
  objectives: [
    'تبني المصفوفات والـ Hashes وتصل لعناصرها بأمان.',
    'تتقن الثلاثي الأساسي: `map` و `select` و `reduce`.',
    'تعرف الدالة المناسبة لكل سؤال بدل كتابة حلقات يدوية.',
    'تستخدم `group_by` و `each_with_object` و `tally` وأخواتها.',
    'تفهم أن كل هذا يأتي من وحدة واحدة اسمها `Enumerable`.',
    'تكتب سلاسل تحويل مقروءة بدل حلقات متداخلة.'
  ],
  quickRef: [
    { code: 'map', desc: 'حوّل كل عنصر' },
    { code: 'select / reject', desc: 'رشّح' },
    { code: 'find', desc: 'أول مطابق' },
    { code: 'reduce', desc: 'اطوِ إلى قيمة واحدة' },
    { code: 'group_by', desc: 'جمّع في Hash' },
    { code: 'sort_by', desc: 'رتّب بمعيار' },
    { code: 'each_with_object', desc: 'ابنِ بنية' },
    { code: 'tally', desc: 'عدّ التكرارات' }
  ],
  blocks: [
    { t: 'h2', text: 'المصفوفات' },
    { t: 'code', lang: 'ruby', code: `
numbers = [1, 2, 3, 4, 5]
mixed   = [1, "نصّ", :sym, [1, 2], { a: 1 }]   # أنواع مختلطة مسموحة
words   = %w[ruby rails sinatra]              # اختصار لمصفوفة نصوص
syms    = %i[name email role]                 # اختصار لمصفوفة رموز

Array.new(3)        # => [nil, nil, nil]
Array.new(3, 0)     # => [0, 0, 0]
Array.new(3) { |i| i * i }   # => [0, 1, 4]
(1..5).to_a         # => [1, 2, 3, 4, 5]
`.trim() },
    { t: 'danger', title: 'فخّ Array.new مع كائن قابل للتعديل', text: '`Array.new(3, [])` تنشئ ثلاثة مراجع **لنفس** المصفوفة! التعديل على أحدها يعدّلها كلها. استخدم الصيغة بكتلة: `Array.new(3) { [] }`.' },
    { t: 'h3', text: 'الوصول للعناصر' },
    { t: 'code', lang: 'ruby', code: `
a = [10, 20, 30, 40, 50]

a[0]        # => 10
a[-1]       # => 50    من النهاية
a[1, 3]     # => [20, 30, 40]   ابدأ من 1 وخذ 3
a[1..3]     # => [20, 30, 40]
a[1...3]    # => [20, 30]
a.first     # => 10
a.first(2)  # => [10, 20]
a.last(2)   # => [40, 50]
a[99]       # => nil    ← لا خطأ
a.fetch(99)         # ✗ IndexError  ← يفشل بوضوح
a.fetch(99, "افتراضي")  # => "افتراضي"
a.dig(0)    # آمن للتداخل
[[1, [2, 3]]].dig(0, 1, 0)   # => 2
`.trim() },
    { t: 'tip', text: 'استخدم `fetch` حين يكون غياب العنصر **خطأً برمجياً**، و`[]` حين يكون `nil` نتيجة مشروعة. `nil` المتسلّل من `[]` يظهر عادة بعد عشرة أسطر في مكان لا علاقة له بالمشكلة.' },
    { t: 'h3', text: 'التعديل' },
    { t: 'code', lang: 'ruby', code: `
a = [1, 2, 3]

a << 4            # => [1,2,3,4]   الأكثر استخداماً
a.push(5, 6)      # يضيف عدة عناصر
a.unshift(0)      # يضيف في البداية
a.insert(2, 99)   # يدرج في موضع

a.pop             # يحذف ويُرجع الأخير
a.shift           # يحذف ويُرجع الأول
a.delete(99)      # يحذف بالقيمة
a.delete_at(0)    # يحذف بالفهرس
a.compact         # يزيل nil
a.uniq            # يزيل التكرار
a.flatten         # يفرد المصفوفات المتداخلة
a.clear           # يفرّغها
`.trim() },
    { t: 'h3', text: 'العمليات بين المصفوفات' },
    { t: 'code', lang: 'ruby', code: `
[1,2,3] + [3,4]     # => [1,2,3,3,4]   دمج
[1,2,3] - [3]       # => [1,2]         طرح
[1,2,3] & [2,3,4]   # => [2,3]         تقاطع
[1,2] | [2,3]       # => [1,2,3]       اتحاد بلا تكرار
[1,2] * 2           # => [1,2,1,2]
[1,2] * ", "        # => "1, 2"        مثل join
[[1,2],[3,4]].transpose   # => [[1,3],[2,4]]
[1,2].product([3,4])      # => [[1,3],[1,4],[2,3],[2,4]]
[1,2,3].zip([4,5,6])      # => [[1,4],[2,5],[3,6]]
`.trim() },

    { t: 'h2', text: 'الـ Hash' },
    { t: 'p', text: 'بنية مفتاح ← قيمة. تُسمّى Dictionary في Python و Object في JavaScript.' },
    { t: 'code', lang: 'ruby', code: `
# مفاتيح رموز — الاصطلاح الشائع
user = { name: "سارة", age: 28, city: "الرياض" }

# مفاتيح من أي نوع
config = { "host" => "localhost", :port => 3000, 1 => "واحد" }

user[:name]              # => "سارة"
user[:missing]           # => nil
user.fetch(:missing)     # ✗ KeyError
user.fetch(:missing, "افتراضي")

user[:email] = "s@x.com"     # إضافة أو تعديل
user.delete(:age)
user.key?(:name)         # => true
user.keys                # => [:name, :city, :email]
user.values
user.size
user.dig(:address, :city)    # آمن للتداخل
`.trim() },
    { t: 'h3', text: 'القيمة الافتراضية' },
    { t: 'code', lang: 'ruby', code: `
counts = Hash.new(0)         # كل مفتاح غير موجود = 0
"مرحبا".chars.each { |c| counts[c] += 1 }
counts   # => {"م"=>1, "ر"=>1, ...}

# للكائنات القابلة للتعديل استخدم الكتلة
groups = Hash.new { |hash, key| hash[key] = [] }
groups[:fruits] << "تفاح"    # لا حاجة لتهيئة مسبقة
`.trim() },
    { t: 'danger', title: 'خطأ شائع', text: '`Hash.new([])` تُرجع **نفس** المصفوفة لكل مفتاح مفقود ولا تخزّنها. النتيجة: كل الإضافات تتراكم في مصفوفة واحدة والـ Hash يبقى فارغاً. استخدم الصيغة بكتلة دائماً.' },
    { t: 'h3', text: 'المرور والتحويل' },
    { t: 'code', lang: 'ruby', code: `
user.each { |key, value| puts "#{key}: #{value}" }
user.each_key   { |k| puts k }
user.each_value { |v| puts v }

user.map { |k, v| "#{k}=#{v}" }         # => مصفوفة
user.transform_values(&:to_s)           # يحوّل القيم
user.transform_keys(&:to_s)             # يحوّل المفاتيح
user.select { |k, v| v.is_a?(String) }  # => Hash
user.reject { |k, _| k == :age }
user.min_by { |_, v| v }
user.sort_by { |_, v| -v }.to_h
user.merge(role: "admin")               # دمج
user.to_a                               # => [[:name, "سارة"], ...]
`.trim() },

    { t: 'h2', text: 'Enumerable — قلب المجموعات' },
    { t: 'p', text: 'كل الدوال التالية تأتي من وحدة واحدة اسمها `Enumerable`، وتعمل على المصفوفة والـ Hash والمدى و Set — وعلى أي صنف تكتبه أنت وتضمّنها فيه. تعلّمها مرة، واستخدمها في كل مكان.' },
    { t: 'h3', text: '1) map — حوّل كل عنصر' },
    { t: 'code', lang: 'ruby', code: `
[1, 2, 3].map { |n| n * 2 }          # => [2, 4, 6]
%w[a b].map(&:upcase)                # => ["A", "B"]
users.map { |u| u[:name] }
users.map { |u| { id: u[:id], label: u[:name] } }

# flat_map يفرد مستوى واحداً
[[1,2],[3,4]].flat_map { |a| a }     # => [1,2,3,4]
posts.flat_map { |p| p[:tags] }.uniq
`.trim() },
    { t: 'h3', text: '2) select / reject — رشّح' },
    { t: 'code', lang: 'ruby', code: `
(1..10).select(&:even?)              # => [2,4,6,8,10]
(1..10).reject(&:even?)              # => [1,3,5,7,9]
users.select { |u| u[:active] }
users.reject { |u| u[:role] == "guest" }

# partition تقسّم إلى مجموعتين دفعة واحدة
active, inactive = users.partition { |u| u[:active] }
`.trim() },
    { t: 'h3', text: '3) reduce — اطوِ إلى قيمة واحدة' },
    { t: 'code', lang: 'ruby', code: `
[1,2,3,4].reduce(:+)                  # => 10
[1,2,3,4].sum                         # => 10   ← أوضح
[1,2,3,4].reduce(1) { |acc, n| acc * n }   # => 24

# القوة الحقيقية: بناء أي بنية
orders.reduce(Hash.new(0)) do |totals, order|
  totals[order[:city]] += order[:total]
  totals
end
# => {"الرياض" => 1250, "جدة" => 890}
`.trim() },
    { t: 'tip', text: 'حين تبني Hash أو مصفوفة، استخدم `each_with_object` بدل `reduce` — لا تحتاج إرجاع المُجمِّع في كل تكرار، وهذا مصدر أخطاء متكرّر.' },
    { t: 'code', lang: 'ruby', code: `
# reduce — عليك إرجاع acc في كل مرة
orders.reduce({}) { |h, o| h[o[:id]] = o; h }

# each_with_object — أوضح وأأمن
orders.each_with_object({}) { |o, h| h[o[:id]] = o }
`.trim() },

    { t: 'h2', text: 'خريطة الدوال حسب السؤال' },
    { t: 'table', head: ['سؤالك', 'الدالة', 'مثال'], rows: [
      ['حوّل كل عنصر', '`map`', '`.map(&:name)`'],
      ['خذ ما يطابق', '`select` / `filter`', '`.select(&:active?)`'],
      ['استبعد ما يطابق', '`reject`', '`.reject(&:nil?)`'],
      ['أول عنصر مطابق', '`find` / `detect`', '`.find { \\|u\\| u.id == 5 }`'],
      ['هل يوجد واحد على الأقل؟', '`any?`', '`.any?(&:admin?)`'],
      ['هل الكل يطابق؟', '`all?`', '`.all?(&:valid?)`'],
      ['هل لا أحد يطابق؟', '`none?`', '`.none?(&:banned?)`'],
      ['كم عدد المطابق؟', '`count`', '`.count(&:active?)`'],
      ['المجموع', '`sum`', '`.sum { \\|o\\| o.total }`'],
      ['الأكبر بمعيار', '`max_by`', '`.max_by(&:score)`'],
      ['رتّب بمعيار', '`sort_by`', '`.sort_by(&:created_at)`'],
      ['جمّع في مجموعات', '`group_by`', '`.group_by(&:city)`'],
      ['عدّ التكرارات', '`tally`', '`.tally`'],
      ['قسّم لمجموعتين', '`partition`', '`.partition(&:paid?)`'],
      ['ابنِ Hash أو مصفوفة', '`each_with_object`', '`.each_with_object({})`'],
      ['اطوِ إلى قيمة', '`reduce` / `inject`', '`.reduce(:+)`']
    ]},

    { t: 'h2', text: 'دوال تستحقّ الحفظ' },
    { t: 'code', lang: 'ruby', code: `
words = %w[ruby rails ruby sinatra rails ruby]

words.tally
# => {"ruby"=>3, "rails"=>2, "sinatra"=>1}

words.group_by(&:length)
# => {4=>["ruby","ruby","ruby"], 5=>["rails","rails"], 7=>["sinatra"]}

words.uniq.sort
words.each_cons(2).to_a      # أزواج متتالية متداخلة
words.each_slice(2).to_a     # أجزاء بحجم 2
(1..10).each_with_index.map { |n, i| n * i }
words.chunk_while { |a, b| a == b }.to_a
[3,1,2].minmax              # => [1, 3]
[1,2,3].sum { |n| n ** 2 }  # => 14
users.sum(&:age).fdiv(users.size)   # المتوسّط
[[1,2],[3,4]].to_h          # => {1=>2, 3=>4}
users.index_by { |u| u[:id] }   # في Rails
users.map { |u| [u[:id], u] }.to_h   # في Ruby النقي
`.trim() },
    { t: 'h3', text: 'الترتيب' },
    { t: 'code', lang: 'ruby', code: `
users.sort_by { |u| u[:age] }             # تصاعدي
users.sort_by { |u| -u[:age] }            # تنازلي (للأعداد)
users.sort_by { |u| u[:name] }.reverse    # تنازلي (للنصوص)

# ترتيب بمعيارين
users.sort_by { |u| [u[:city], -u[:score]] }

# ترتيب مخصّص
users.sort { |a, b| a[:age] <=> b[:age] }
`.trim() },
    { t: 'note', text: '`sort_by` أسرع من `sort` عند المعايير المحسوبة، لأنها تحسب المفتاح مرة واحدة لكل عنصر لا في كل مقارنة. هذا يُسمّى «تحويل شوارتز».' },

    { t: 'h2', text: 'التقييم الكسول (Lazy)' },
    { t: 'code', lang: 'ruby', code: `
# بدون lazy: يبني مصفوفة بمليون عنصر ثم يأخذ 5!
(1..Float::INFINITY).map { |n| n * 2 }.first(5)   # ⚠️ يعلق للأبد

# مع lazy: يحسب ما يحتاجه فقط
(1..Float::INFINITY).lazy.map { |n| n * 2 }.first(5)
# => [2, 4, 6, 8, 10]   ← فوري

huge_file.each_line.lazy
         .map(&:strip)
         .reject(&:empty?)
         .select { |l| l.start_with?("ERROR") }
         .first(10)
`.trim() },
    { t: 'tip', text: 'استخدم `lazy` مع المجموعات اللانهائية أو الملفات الضخمة أو حين تحتاج أول N نتيجة من سلسلة تحويلات طويلة.' },

    { t: 'h2', text: 'سلاسل التحويل — أسلوب Ruby' },
    { t: 'compare', lang: 'ruby', bad: {
      code: `result = []
orders.each do |order|
  if order[:status] == "paid"
    if order[:total] > 100
      result << { id: order[:id], total: order[:total] }
    end
  end
end
result.sort! { |a, b| b[:total] <=> a[:total] }
top = result[0, 5]`,
      why: 'حلقة بتداخل، متغيّر وسيط، وتعديل في المكان — الفكرة مدفونة تحت الآلية.'
    }, good: {
      code: `top = orders
  .select { |o| o[:status] == "paid" }
  .select { |o| o[:total] > 100 }
  .map    { |o| o.slice(:id, :total) }
  .sort_by { |o| -o[:total] }
  .first(5)`,
      why: 'كل سطر خطوة واحدة مسمّاة، تُقرأ من أعلى لأسفل كوصف للمطلوب لا لكيفية تنفيذه.'
    }},
    { t: 'warn', title: 'حدّ السلسلة', text: 'كل حلقة في السلسلة تمرّ على المجموعة كاملة. على آلاف العناصر لا فرق يُذكر، وعلى الملايين ادمج الخطوات أو استخدم `lazy`.' },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'لوحة تحليلات مبيعات',
      brief: 'حلّل بيانات مبيعات وأنتج تقريراً كاملاً باستخدام Enumerable فقط — بلا حلقة `while` واحدة.',
      requirements: [
        'ابنِ مصفوفة من 20 طلباً على الأقل، كل طلب Hash فيه: `id`, `customer`, `city`, `items` (مصفوفة Hashes بها `name`, `price`, `qty`), `status`, `date`.',
        'احسب إجمالي كل طلب من عناصره.',
        'أنتج: إجمالي المبيعات، عدد الطلبات المدفوعة، ومتوسّط قيمة الطلب.',
        'أعلى خمسة عملاء بإجمالي الإنفاق.',
        'المبيعات حسب المدينة مرتّبة تنازلياً.',
        'أكثر خمسة منتجات مبيعاً بالكمية.',
        'المنتجات التي لم تُبَع مطلقاً (من قائمة كتالوج تعرّفها).',
        'الطلبات المعلّقة الأقدم من 7 أيام.',
        'اطبع كل قسم في جدول نصّي منسّق بعناوين وأعمدة محاذاة.'
      ],
      hints: [
        '`order[:items].sum { |i| i[:price] * i[:qty] }` يحسب الإجمالي.',
        '`group_by` ثم `transform_values` نمط قوي جداً للتجميع والتلخيص.',
        '`flat_map` تجمع عناصر كل الطلبات في قائمة واحدة.',
        '`ljust` و `rjust` لمحاذاة أعمدة الجدول.',
        '`Date.today - 7` للمقارنة الزمنية.'
      ],
      solution: { lang: 'ruby', code: `
# frozen_string_literal: true
# analytics.rb — لوحة تحليلات مبيعات
require 'date'

CATALOG = ["لابتوب", "ماوس", "لوحة مفاتيح", "شاشة", "سمّاعة", "كاميرا", "حامل"].freeze

def item(name, price, qty) = { name:, price:, qty: }

ORDERS = [
  { id: 1,  customer: "سارة",  city: "الرياض", status: "paid",    date: Date.today - 2,
    items: [item("لابتوب", 4500, 1), item("ماوس", 120, 2)] },
  { id: 2,  customer: "خالد",  city: "جدة",    status: "paid",    date: Date.today - 5,
    items: [item("شاشة", 1200, 2)] },
  { id: 3,  customer: "نورة",  city: "الرياض", status: "pending", date: Date.today - 12,
    items: [item("سمّاعة", 350, 1), item("ماوس", 120, 1)] },
  { id: 4,  customer: "سارة",  city: "الرياض", status: "paid",    date: Date.today - 1,
    items: [item("لوحة مفاتيح", 450, 1)] },
  { id: 5,  customer: "فهد",   city: "الدمام", status: "paid",    date: Date.today - 8,
    items: [item("لابتوب", 4500, 1), item("شاشة", 1200, 1), item("ماوس", 120, 1)] },
  { id: 6,  customer: "خالد",  city: "جدة",    status: "cancelled", date: Date.today - 20,
    items: [item("سمّاعة", 350, 3)] },
  { id: 7,  customer: "منى",   city: "الرياض", status: "paid",    date: Date.today - 3,
    items: [item("ماوس", 120, 5)] },
  { id: 8,  customer: "نورة",  city: "الرياض", status: "paid",    date: Date.today - 6,
    items: [item("شاشة", 1200, 1), item("لوحة مفاتيح", 450, 2)] },
  { id: 9,  customer: "فهد",   city: "الدمام", status: "pending", date: Date.today - 15,
    items: [item("سمّاعة", 350, 2)] },
  { id: 10, customer: "منى",   city: "الرياض", status: "paid",    date: Date.today - 4,
    items: [item("لابتوب", 4500, 2)] }
].freeze

# ===== أدوات =====
def total_of(order) = order[:items].sum { |i| i[:price] * i[:qty] }
def money(n) = "#{n.round.to_s.reverse.scan(/\\d{1,3}/).join(',').reverse} ر.س"

def section(title)
  puts
  puts "═" * 52
  puts " #{title}"
  puts "═" * 52
end

def row(a, b, width = 30)
  puts "  #{a.to_s.ljust(width)} #{b.to_s.rjust(16)}"
end

paid = ORDERS.select { |o| o[:status] == "paid" }

# ===== 1) نظرة عامة =====
section("نظرة عامة")
row("إجمالي المبيعات",     money(paid.sum { |o| total_of(o) }))
row("عدد الطلبات",          ORDERS.size)
row("الطلبات المدفوعة",     paid.size)
row("متوسّط قيمة الطلب",    money(paid.sum { |o| total_of(o) }.fdiv(paid.size)))
row("عدد العملاء",          ORDERS.map { |o| o[:customer] }.uniq.size)

# ===== 2) أعلى العملاء =====
section("أعلى خمسة عملاء")
paid.group_by { |o| o[:customer] }
    .transform_values { |os| os.sum { |o| total_of(o) } }
    .sort_by { |_, total| -total }
    .first(5)
    .each_with_index { |(name, total), i| row("#{i + 1}. #{name}", money(total)) }

# ===== 3) حسب المدينة =====
section("المبيعات حسب المدينة")
paid.group_by { |o| o[:city] }
    .transform_values { |os| os.sum { |o| total_of(o) } }
    .sort_by { |_, total| -total }
    .each { |city, total| row(city, money(total)) }

# ===== 4) أكثر المنتجات مبيعاً =====
section("أكثر خمسة منتجات مبيعاً (بالكمية)")
sold = paid.flat_map { |o| o[:items] }
           .group_by { |i| i[:name] }
           .transform_values { |items| items.sum { |i| i[:qty] } }

sold.sort_by { |_, qty| -qty }
    .first(5)
    .each { |name, qty| row(name, "#{qty} قطعة") }

# ===== 5) منتجات لم تُبَع =====
section("منتجات لم تُبَع")
never_sold = CATALOG - sold.keys
if never_sold.empty?
  puts "  كل منتجات الكتالوج بيعت 🎉"
else
  never_sold.each { |name| row(name, "0 قطعة") }
end

# ===== 6) طلبات معلّقة قديمة =====
section("طلبات معلّقة أقدم من 7 أيام")
stale = ORDERS.select { |o| o[:status] == "pending" && o[:date] < Date.today - 7 }
              .sort_by { |o| o[:date] }

if stale.empty?
  puts "  لا توجد طلبات متأخّرة ✅"
else
  stale.each do |o|
    days = (Date.today - o[:date]).to_i
    row("##{o[:id]} — #{o[:customer]}", "#{days} يوماً · #{money(total_of(o))}")
  end
end

puts
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'ما الفرق بين `a[99]` و `a.fetch(99)`؟', options: ['لا فرق', '`[]` تُرجع nil بصمت و`fetch` ترمي IndexError', '`fetch` أسرع', 'العكس'], answer: 1,
        explain: 'استخدم `fetch` حين يكون غياب العنصر خطأً برمجياً — يفشل عند المصدر لا بعد عشرة أسطر.' },
      { q: 'لماذا `Hash.new([])` خطأ؟', options: ['بطيء', 'يُرجع نفس المصفوفة لكل مفتاح مفقود ولا يخزّنها في الـ Hash', 'غير مسموح', 'يرمي خطأ'], answer: 1,
        explain: 'استخدم الصيغة بكتلة `Hash.new { |h, k| h[k] = [] }`.' },
      { q: 'متى تفضّل `each_with_object` على `reduce`؟', options: ['دائماً', 'حين تبني بنية (Hash/Array) — لا تحتاج إرجاع المُجمِّع في كل تكرار', 'مع الأعداد', 'أبداً'], answer: 1,
        explain: 'نسيان `; h` في نهاية كتلة `reduce` من أكثر أخطاء Ruby شيوعاً.' },
      { q: 'ما فائدة `lazy`؟', options: ['أسرع دائماً', 'تحسب ما تحتاجه فقط — ضرورية للمجموعات اللانهائية والملفات الضخمة', 'تقلّل الذاكرة دائماً', 'تخزّن النتائج'], answer: 1,
        explain: '`(1..Float::INFINITY).lazy.map { }.first(5)` فوري، وبدون `lazy` يعلق للأبد.' },
      { q: 'من أين تأتي `map` و `select` و `group_by`؟', options: ['من صنف Array', 'من وحدة `Enumerable` المضمّنة في Array و Hash و Range وغيرها', 'من المفسّر', 'من مكتبة خارجية'], answer: 1,
        explain: 'ولهذا يمكنك تضمين `Enumerable` في أصنافك للحصول عليها كلها مقابل تعريف `each` فقط.' },
      { q: 'لماذا `sort_by` أفضل من `sort` مع معيار محسوب؟', options: ['أوضح فقط', 'تحسب المفتاح مرة واحدة لكل عنصر لا في كل مقارنة', 'أدقّ', 'لا فرق'], answer: 1,
        explain: 'يُسمّى تحويل شوارتز، والفرق يظهر بوضوح على المجموعات الكبيرة.' },
      { q: 'ماذا تُرجع `%w[a b a].tally`؟', options: ['["a","b"]', '`{"a"=>2, "b"=>1}`', '3', '["a","b","a"]'], answer: 1,
        explain: '`tally` تعدّ تكرار كل عنصر وتُرجع Hash — بديل جاهز لحلقة عدّ يدوية.' }
    ]}
  ]
};
