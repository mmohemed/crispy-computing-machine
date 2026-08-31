'use strict';

module.exports = {
  slug: '07-modules',
  title: 'الوحدات والـ Mixins',
  summary: 'الوحدات كفضاءات أسماء وكسلوك مشترك، وسلسلة البحث عن الدوال، ولمحة عن البرمجة الوصفية.',
  duration: 55,
  level: 'متقدم',
  tags: ['Modules', 'Mixins', 'Metaprogramming'],
  objectives: [
    'تستخدم الوحدة كفضاء أسماء لتنظيم الشيفرة.',
    'تشارك السلوك عبر `include` و `extend` و `prepend`.',
    'تفهم سلسلة البحث عن الدوال (`ancestors`) وترتيبها.',
    'تعرف الفرق العملي بين طرق الإدماج الثلاث.',
    'تستخدم `Comparable` و `Enumerable` في أصنافك.',
    'تلمّ بأساسيات البرمجة الوصفية وحدود استخدامها.'
  ],
  quickRef: [
    { code: 'module Name', desc: 'تعريف وحدة' },
    { code: 'include M', desc: 'دوال مثيل' },
    { code: 'extend M', desc: 'دوال صنف' },
    { code: 'prepend M', desc: 'قبل الصنف في السلسلة' },
    { code: 'module_function', desc: 'دوال وحدة مستقلّة' },
    { code: 'self.included', desc: 'خطّاف عند الإدماج' },
    { code: 'Klass.ancestors', desc: 'سلسلة البحث' },
    { code: 'define_method', desc: 'تعريف ديناميكي' }
  ],
  blocks: [
    { t: 'h2', text: 'ما الوحدة؟' },
    { t: 'p', text: 'الوحدة كالصنف تماماً، بفارقين: **لا تُنشَأ منها مثيلات** و**لا تُورَّث**. لها استخدامان رئيسيان: فضاء أسماء، وحاوية سلوك مشترك.' },

    { t: 'h2', text: '1) الوحدة كفضاء أسماء' },
    { t: 'code', lang: 'ruby', code: `
module Payments
  DEFAULT_CURRENCY = "SAR"

  class Gateway
    def charge(amount) = "شُحِن #{amount}"
  end

  class Refund; end

  module Providers
    class Stripe; end
    class Tap; end
  end
end

Payments::Gateway.new.charge(100)
Payments::Providers::Stripe.new
Payments::DEFAULT_CURRENCY
`.trim() },
    { t: 'p', text: 'الفائدة: منع تصادم الأسماء. `Payments::Gateway` و `Shipping::Gateway` صنفان مختلفان تماماً يتعايشان بلا مشكلة.' },
    { t: 'note', text: 'في المشاريع الحقيقية يقابل التداخل بنية المجلّدات: `app/payments/providers/stripe.rb` يعرّف `Payments::Providers::Stripe`. هذا اصطلاح يعتمد عليه المحمّل التلقائي في Rails.' },
    { t: 'h3', text: 'دوال الوحدة المستقلّة' },
    { t: 'code', lang: 'ruby', code: `
module MathUtils
  module_function            # كل ما بعدها دالة وحدة

  def square(x) = x * x
  def cube(x)   = x ** 3
  def average(nums) = nums.sum.fdiv(nums.size)
end

MathUtils.square(5)      # => 25
MathUtils.average([1,2,3])

# صيغة بديلة
module StringUtils
  def self.slugify(text)
    text.strip.downcase.gsub(/[^\\w\\s-]/, "").gsub(/\\s+/, "-")
  end
end
`.trim() },
    { t: 'tip', text: 'استخدم `module_function` للأدوات عديمة الحالة (تحويلات، حسابات، تنسيق). لا معنى لإنشاء كائن من `MathUtils` — فامنع ذلك بجعلها وحدة.' },

    { t: 'h2', text: '2) الوحدة كسلوك مشترك (Mixin)' },
    { t: 'p', text: 'هنا القوة الحقيقية. Ruby لا يدعم الوراثة المتعدّدة، لكن الوحدات تحلّ المشكلة بأناقة: صنف واحد يستطيع دمج عدد غير محدود من الوحدات.' },
    { t: 'code', lang: 'ruby', code: `
module Trackable
  def track(event)
    @events ||= []
    @events << { event:, at: Time.now }
    self
  end

  def history = @events || []
  def last_event = history.last
end

module Serializable
  def to_h
    instance_variables.each_with_object({}) do |var, hash|
      hash[var.to_s.delete("@").to_sym] = instance_variable_get(var)
    end
  end

  def to_json_string = to_h.to_s
end

class Order
  include Trackable
  include Serializable

  def initialize(id) = @id = id
end

order = Order.new(1)
order.track(:created).track(:paid)
order.last_event      # => { event: :paid, at: ... }
order.to_h            # => { id: 1, events: [...] }
`.trim() },

    { t: 'h2', text: 'include vs extend vs prepend' },
    { t: 'table', head: ['الطريقة', 'الدوال تصبح', 'موضعها في السلسلة'], rows: [
      ['`include M`', 'دوال **مثيل**', '**بعد** الصنف'],
      ['`extend M`', 'دوال **صنف**', 'في الصنف المفرد'],
      ['`prepend M`', 'دوال **مثيل**', '**قبل** الصنف']
    ]},
    { t: 'code', lang: 'ruby', code: `
module Greeting
  def hello = "مرحباً من #{self}"
end

class A
  include Greeting     # دوال مثيل
end

class B
  extend Greeting      # دوال صنف
end

A.new.hello     # ✅
A.hello         # ✗ NoMethodError

B.hello         # ✅
B.new.hello     # ✗ NoMethodError

# للحصول على الاثنين
class C
  include Greeting
  extend  Greeting
end
`.trim() },
    { t: 'h3', text: 'prepend — تغليف الدوال القائمة' },
    { t: 'code', lang: 'ruby', code: `
module Logging
  def save
    puts "⏳ جارٍ الحفظ…"
    result = super            # يستدعي save الأصلية في الصنف
    puts "✅ تمّ الحفظ"
    result
  end
end

class Document
  prepend Logging             # قبل الصنف في السلسلة

  def save = "المستند محفوظ"
end

Document.new.save
# ⏳ جارٍ الحفظ…
# ✅ تمّ الحفظ
# => "المستند محفوظ"

Document.ancestors
# => [Logging, Document, Object, ...]   ← Logging قبل Document
`.trim() },
    { t: 'note', text: 'لو استخدمنا `include` هنا لما عمل شيء: `Document#save` ستكون **قبل** `Logging#save` في السلسلة فتحجبها. `prepend` هو ما يجعل التغليف ممكناً — وهو أساس `ActiveSupport::Concern` وكثير من مكتبات Ruby.' },

    { t: 'h2', text: 'سلسلة البحث عن الدوال' },
    { t: 'p', text: 'حين تستدعي `obj.method`، يبحث Ruby في ترتيب محدّد تماماً. اعرفه وستفهم كل سلوك غامض.' },
    { t: 'code', lang: 'ruby', code: `
module M1; end
module M2; end
module M3; end

class Parent
  include M1
end

class Child < Parent
  include M2
  prepend M3
end

Child.ancestors
# => [M3, Child, M2, Parent, M1, Object, Kernel, BasicObject]
#     ↑    ↑      ↑    ↑       ↑
#     |    |      |    |       └── وحدات الأب
#     |    |      |    └────────── الأب
#     |    |      └─────────────── الوحدات المُدمَجة (آخر مُدمَج أولاً)
#     |    └────────────────────── الصنف نفسه
#     └─────────────────────────── الوحدات المُقدَّمة
`.trim() },
    { t: 'steps', items: [
      'الوحدات المُقدَّمة بـ `prepend` (آخر ما أُضيف أولاً).',
      'الصنف **نفسه**.',
      'الوحدات المُدمَجة بـ `include` (آخر ما أُضيف أولاً).',
      'صنف الأب — ثم تتكرّر الخطوات 1–3 عليه.',
      'وهكذا صعوداً حتى `BasicObject`.',
      'إن لم تُوجد الدالة، يُستدعى `method_missing`، ثم يُرمى `NoMethodError`.'
    ]},
    { t: 'tip', text: 'حين تحتار «من أين جاءت هذه الدالة؟» اكتب `obj.method(:name).owner` في IRB — يخبرك بالصنف أو الوحدة التي عرّفتها بالضبط.' },

    { t: 'h2', text: 'وحدات المكتبة القياسية' },
    { t: 'h3', text: 'Comparable — من دالة واحدة' },
    { t: 'code', lang: 'ruby', code: `
class Version
  include Comparable

  attr_reader :major, :minor, :patch

  def initialize(string)
    @major, @minor, @patch = string.split(".").map(&:to_i)
  end

  def <=>(other)
    [major, minor, patch] <=> [other.major, other.minor, other.patch]
  end

  def to_s = "#{major}.#{minor}.#{patch}"
end

v1 = Version.new("1.2.3")
v2 = Version.new("1.10.0")

v1 < v2                       # => true
[v2, v1].sort.map(&:to_s)     # => ["1.2.3", "1.10.0"]
v1.between?(Version.new("1.0.0"), v2)   # => true
v1.clamp(Version.new("1.5.0"), v2)      # => 1.5.0
`.trim() },
    { t: 'h3', text: 'Enumerable — من دالة واحدة أيضاً' },
    { t: 'code', lang: 'ruby', code: `
class Playlist
  include Enumerable

  def initialize(songs = []) = @songs = songs

  def each(&block)            # هذا كل ما تحتاجه!
    @songs.each(&block)
    self
  end

  def <<(song)
    @songs << song
    self
  end
end

list = Playlist.new
list << { title: "أغنية أ", duration: 210, artist: "فنان 1" }
list << { title: "أغنية ب", duration: 185, artist: "فنان 2" }
list << { title: "أغنية ج", duration: 240, artist: "فنان 1" }

# كل هذا مجاني الآن
list.map { |s| s[:title] }
list.select { |s| s[:duration] > 200 }
list.sort_by { |s| s[:duration] }
list.group_by { |s| s[:artist] }
list.sum { |s| s[:duration] }
list.max_by { |s| s[:duration] }
list.each_slice(2).to_a
list.count
list.first(2)
`.trim() },
    { t: 'note', text: 'تعريف `each` وحده يمنحك أكثر من **خمسين دالة**. هذا أوضح مثال على مبدأ «الواجهة الصغيرة، القدرة الكبيرة» في تصميم Ruby.' },

    { t: 'h2', text: 'خطّافات الوحدات' },
    { t: 'code', lang: 'ruby', code: `
module Trackable
  # يُستدعى تلقائياً عند include
  def self.included(base)
    base.extend(ClassMethods)          # يضيف دوال صنف أيضاً
    base.instance_variable_set(:@tracked_events, [])
  end

  module ClassMethods
    def track_event(name)
      @tracked_events << name
      define_method("on_#{name}") { |data = {}| record(name, data) }
    end

    def tracked_events = @tracked_events
  end

  def record(event, data)
    @log ||= []
    @log << { event:, data:, at: Time.now }
    self
  end

  def log = @log || []
end

class Order
  include Trackable

  track_event :created
  track_event :paid
  track_event :shipped
end

order = Order.new
order.on_created(id: 1)
order.on_paid(amount: 500)

Order.tracked_events   # => [:created, :paid, :shipped]
order.log.size         # => 2
`.trim() },
    { t: 'tip', text: 'هذا النمط — وحدة تضيف دوال مثيل **ودوال صنف** عبر خطّاف `included` — هو أساس `ActiveSupport::Concern` في Rails وأغلب مكتبات Ruby الجادّة.' },

    { t: 'h2', text: 'لمحة عن البرمجة الوصفية' },
    { t: 'p', text: 'Ruby يسمح لك بكتابة شيفرة **تكتب شيفرة**. أداة قوية جداً — وخطيرة بنفس القدر.' },
    { t: 'code', lang: 'ruby', code: `
class Settings
  KEYS = %i[host port timeout retries].freeze

  KEYS.each do |key|
    define_method(key)        { @data[key] }
    define_method("#{key}=")  { |v| @data[key] = v }
    define_method("#{key}?")  { !@data[key].nil? }
  end

  def initialize(data = {}) = @data = data
end

s = Settings.new(host: "localhost")
s.host        # => "localhost"
s.port = 3000
s.port?       # => true
s.timeout?    # => false
`.trim() },
    { t: 'code', lang: 'ruby', code: `
# method_missing — التقاط الدوال غير المعرّفة
class DynamicRecord
  def initialize(attrs = {}) = @attrs = attrs

  def method_missing(name, *args)
    key = name.to_s.chomp("=").to_sym

    if name.to_s.end_with?("=")
      @attrs[key] = args.first
    elsif @attrs.key?(key)
      @attrs[key]
    else
      super                    # مهمّ جداً!
    end
  end

  # لازمة دائماً مع method_missing
  def respond_to_missing?(name, include_private = false)
    key = name.to_s.chomp("=").to_sym
    @attrs.key?(key) || name.to_s.end_with?("=") || super
  end
end

r = DynamicRecord.new(name: "سارة")
r.name              # => "سارة"
r.email = "s@x.com"
r.email             # => "s@x.com"
r.respond_to?(:name)  # => true
r.missing_thing     # ✗ NoMethodError  ← كما يجب
`.trim() },
    { t: 'danger', title: 'ثلاث قواعد للبرمجة الوصفية', text: '**(1)** استدعِ `super` دائماً في `method_missing` للأسماء غير المعروفة، وإلا ابتلعت كل أخطائك بصمت. **(2)** عرّف `respond_to_missing?` معها دائماً وإلا كذب `respond_to?`. **(3)** فضّل `define_method` على `method_missing` — أوضح وأسرع وتظهر دواله في `methods`.' },
    { t: 'warn', title: 'متى تستخدمها؟', text: 'حين تكتب **مكتبة** أو **إطار عمل** يحتاج واجهة تصريحية. في شيفرة التطبيق العادية، الشيفرة الصريحة الممّلة تهزم الذكية دائماً — لأن غيرك (وأنت بعد ستة أشهر) يجب أن يفهمها.' },

    { t: 'h2', text: 'refinements — بديل آمن لتعديل الأصناف' },
    { t: 'code', lang: 'ruby', code: `
# ✗ Monkey patching — يؤثّر على البرنامج كله وقد يصطدم بمكتبة أخرى
class String
  def shout = upcase + "!"
end

# ✓ refinement — محدود بالنطاق الذي يفعّله
module StringExtensions
  refine String do
    def shout = upcase + "!"
    def slug  = strip.downcase.gsub(/\\s+/, "-")
  end
end

module MyApp
  using StringExtensions       # مفعّل هنا فقط

  def self.run
    puts "ruby".shout          # => "RUBY!"
  end
end

"ruby".shout   # ✗ NoMethodError خارج النطاق — وهذا ما نريده
`.trim() },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'إطار عمل صغير للنماذج',
      brief: 'ابنِ وحدات تمنح أي صنف قدرات: خصائص معرّفة تصريحياً، تحقّق، مقارنة، تسلسل، وتتبّع.',
      requirements: [
        'وحدة `Attributes` تضيف `attribute :name, type: String, default: nil` تعرّف قارئاً وكاتباً يتحقّق من النوع.',
        'وحدة `Validations` تضيف `validates :name, presence: true, length: 3..50` ودالة `valid?` و `errors`.',
        'وحدة `Serialization` تضيف `to_h` و `from_h` (دالة صنف) و `to_json_string`.',
        'وحدة `Trackable` تسجّل كل تغيير في الخصائص مع الوقت والقيمة القديمة والجديدة.',
        'وحدة `Findable` تضيف مخزناً في الذاكرة مع `all` و `find` و `where` و `create`.',
        'استخدم خطّاف `self.included` لإضافة دوال الصنف.',
        'ادمج الوحدات كلها في صنف `Product` ووضّح عملها.',
        'اجعل `Product` يدعم الترتيب بالسعر عبر `Comparable`.',
        'اطبع `Product.ancestors` في النهاية واشرح الترتيب في تعليق.'
      ],
      hints: [
        '`define_method("#{name}=") { |v| ... }` يعرّف كاتباً ديناميكياً.',
        '`base.extend(ClassMethods)` داخل `self.included` هو النمط المعتاد.',
        '`@attributes ||= {}` على مستوى الصنف يخزّن التعريفات.',
        'انتبه للوراثة: استخدم `inherited` أو `superclass.attributes` إن أردت دعمها.'
      ],
      solution: { lang: 'ruby', code: `
# frozen_string_literal: true
# mini_model.rb — إطار عمل صغير للنماذج

# ===== 1) الخصائص =====
module Attributes
  def self.included(base)
    base.extend(ClassMethods)
    base.instance_variable_set(:@attributes, {})
  end

  module ClassMethods
    def attributes = @attributes

    def attribute(name, type: Object, default: nil)
      @attributes[name] = { type:, default: }

      define_method(name) { @data[name] }

      define_method("#{name}=") do |value|
        unless value.nil? || value.is_a?(type)
          raise TypeError, "#{name} يجب أن يكون #{type} لا #{value.class}"
        end
        old = @data[name]
        @data[name] = value
        track_change(name, old, value) if respond_to?(:track_change, true)
        value
      end

      define_method("#{name}?") { !@data[name].nil? }
    end
  end

  def initialize(attrs = {})
    @data = {}
    self.class.attributes.each { |name, meta| @data[name] = meta[:default] }
    attrs.each { |key, value| public_send("#{key}=", value) if respond_to?("#{key}=") }
  end

  def data = @data.dup
end

# ===== 2) التحقّق =====
module Validations
  def self.included(base)
    base.extend(ClassMethods)
    base.instance_variable_set(:@validations, [])
  end

  module ClassMethods
    def validations = @validations

    def validates(field, presence: false, length: nil, numericality: nil, format: nil)
      @validations << { field:, presence:, length:, numericality:, format: }
    end
  end

  def errors
    @errors ||= []
  end

  def valid?
    @errors = []

    self.class.validations.each do |rule|
      value = public_send(rule[:field])
      label = rule[:field]

      if rule[:presence] && (value.nil? || value.to_s.strip.empty?)
        @errors << "#{label} مطلوب"
        next
      end

      next if value.nil?

      if rule[:length] && !rule[:length].cover?(value.to_s.length)
        @errors << "#{label} يجب أن يكون بين #{rule[:length].first} و #{rule[:length].last} حرفاً"
      end

      if rule[:numericality] && !rule[:numericality].cover?(value)
        @errors << "#{label} يجب أن يكون بين #{rule[:numericality].first} و #{rule[:numericality].last}"
      end

      if rule[:format] && !(value.to_s =~ rule[:format])
        @errors << "#{label} بصيغة غير صحيحة"
      end
    end

    @errors.empty?
  end
end

# ===== 3) التسلسل =====
module Serialization
  def self.included(base) = base.extend(ClassMethods)

  module ClassMethods
    def from_h(hash) = new(hash)
  end

  def to_h = data
  def to_json_string
    pairs = to_h.map { |k, v| "\\"#{k}\\": #{v.is_a?(Numeric) ? v : "\\"#{v}\\""}" }
    "{#{pairs.join(', ')}}"
  end
end

# ===== 4) التتبّع =====
module Trackable
  def changes = @changes ||= []

  def changed? = changes.any?

  def change_summary
    changes.map { |c| "#{c[:field]}: #{c[:from].inspect} → #{c[:to].inspect}" }
  end

  private

  def track_change(field, from, to)
    return if from == to
    changes << { field:, from:, to:, at: Time.now }
  end
end

# ===== 5) المخزن =====
module Findable
  def self.included(base)
    base.extend(ClassMethods)
    base.instance_variable_set(:@store, [])
  end

  module ClassMethods
    def all = @store

    def create(attrs = {})
      record = new(attrs)
      raise ArgumentError, record.errors.join("، ") if record.respond_to?(:valid?) && !record.valid?

      @store << record
      record
    end

    def find(&predicate) = @store.find(&predicate)
    def where(**conditions)
      @store.select do |record|
        conditions.all? { |key, value| record.public_send(key) == value }
      end
    end
    def count = @store.size
    def clear! = @store.clear
  end
end

# ===== النموذج =====
class Product
  include Attributes
  include Validations
  include Serialization
  include Trackable
  include Findable
  include Comparable

  attribute :name,     type: String,  default: ""
  attribute :price,    type: Integer, default: 0
  attribute :category, type: String,  default: "عام"
  attribute :stock,    type: Integer, default: 0

  validates :name,  presence: true, length: 3..60
  validates :price, numericality: 1..1_000_000

  def <=>(other) = price <=> other.price

  def to_s = "#{name} — #{price} ر.س (#{category})"
end

# ===== التشغيل =====
puts "▸ إنشاء منتجات"
laptop = Product.create(name: "لابتوب احترافي", price: 4500, category: "أجهزة", stock: 12)
mouse  = Product.create(name: "ماوس لاسلكي",   price: 120,  category: "ملحقات", stock: 80)
screen = Product.create(name: "شاشة 27 بوصة",  price: 1200, category: "أجهزة", stock: 5)
puts "  أُنشئ #{Product.count} منتجات"

puts "\\n▸ التحقّق يمنع البيانات الفاسدة"
begin
  Product.create(name: "أب", price: 0)
rescue ArgumentError => e
  puts "  ❌ #{e.message}"
end

puts "\\n▸ التحقّق من النوع"
begin
  laptop.price = "غالٍ"
rescue TypeError => e
  puts "  ❌ #{e.message}"
end

puts "\\n▸ التتبّع"
laptop.price = 4200
laptop.stock = 10
puts "  #{laptop.change_summary.join(' | ')}"

puts "\\n▸ الاستعلام"
puts "  أجهزة: #{Product.where(category: 'أجهزة').map(&:name).join('، ')}"
puts "  الأغلى: #{Product.all.max}"
puts "  مرتّبة: #{Product.all.sort.map(&:name).join(' < ')}"

puts "\\n▸ التسلسل"
puts "  #{mouse.to_json_string}"
copy = Product.from_h(mouse.to_h)
puts "  نسخة: #{copy}"

puts "\\n▸ سلسلة البحث عن الدوال"
puts "  #{Product.ancestors.first(8).join(' → ')}"
# الترتيب: الصنف نفسه أولاً، ثم الوحدات المُدمَجة بترتيب معكوس
# (آخر include يأتي أولاً)، ثم Object و Kernel و BasicObject.
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'ما الفرق بين `include` و `extend`؟', options: ['لا فرق', '`include` يضيف دوال مثيل و`extend` يضيف دوال صنف', 'العكس', '`extend` أسرع'], answer: 1,
        explain: 'وللحصول على الاثنين استخدم `extend` داخل خطّاف `self.included`.' },
      { q: 'متى تحتاج `prepend` بدل `include`؟', options: ['أبداً', 'حين تريد تغليف دالة موجودة في الصنف واستدعاءها بـ `super`', 'مع الثوابت', 'للأداء'], answer: 1,
        explain: 'مع `include` تحجب دالة الصنف دالة الوحدة، فلا يعمل التغليف.' },
      { q: 'ماذا يمنحك `include Enumerable` مع تعريف `each` فقط؟', options: ['`map` فقط', 'أكثر من خمسين دالة: map و select و sort_by و group_by وغيرها', 'لا شيء', 'الترتيب فقط'], answer: 1,
        explain: 'مثال نموذجي على مبدأ «الواجهة الصغيرة، القدرة الكبيرة».' },
      { q: 'ما ترتيب البحث عن الدالة في Ruby؟', options: ['الصنف ثم الأب فقط', 'prepend ← الصنف ← include ← الأب ← وهكذا صعوداً', 'عشوائي', 'الوحدات أولاً دائماً'], answer: 1,
        explain: '`Klass.ancestors` تعرض السلسلة كاملة، و`obj.method(:x).owner` تخبرك بمصدر دالة بعينها.' },
      { q: 'ما القاعدتان الإلزاميتان مع `method_missing`؟', options: ['لا قواعد', 'استدعاء `super` للأسماء غير المعروفة، وتعريف `respond_to_missing?`', 'التجميد', 'استخدام lambda'], answer: 1,
        explain: 'بدون `super` تبتلع كل أخطائك بصمت، وبدون `respond_to_missing?` يكذب `respond_to?`.' },
      { q: 'لماذا `refine` أفضل من تعديل الأصناف المبنية مباشرة؟', options: ['أسرع', 'التعديل محدود بالنطاق الذي يفعّله فلا يصطدم بمكتبات أخرى', 'أقصر', 'لا فرق'], answer: 1,
        explain: 'الـ monkey patching العام قد يكسر مكتبة تعتمد على السلوك الأصلي.' },
      { q: 'متى تستخدم `module_function`؟', options: ['دائماً', 'للأدوات عديمة الحالة التي لا معنى لإنشاء كائن منها', 'مع الوراثة', 'للثوابت'], answer: 1,
        explain: 'مثل دوال التحويل والتنسيق والحساب — تُستدعى على الوحدة مباشرة.' }
    ]}
  ]
};
