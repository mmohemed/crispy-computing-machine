'use strict';

module.exports = {
  slug: '06-oop',
  title: 'البرمجة الكائنية: الأصناف والكائنات',
  summary: 'الأصناف والمثيلات، التغليف والوراثة، ودوال الصنف، وتخصيص السلوك عبر to_s و <=> و ==.',
  duration: 65,
  level: 'متوسط',
  tags: ['OOP', 'أصناف', 'وراثة'],
  objectives: [
    'تعرّف صنفاً وتنشئ منه مثيلات بحالة مستقلة.',
    'تفهم التغليف ومستويات الرؤية الثلاثة.',
    'تستخدم `attr_accessor` وأخواته بوعي لا بعادة.',
    'تبني وراثة صحيحة وتعرف متى **لا** تستخدمها.',
    'تفرّق بين دوال المثيل ودوال الصنف.',
    'تخصّص سلوك كائنك بتعريف `to_s` و `==` و `<=>`.'
  ],
  quickRef: [
    { code: 'class Name < Parent', desc: 'تعريف صنف بوراثة' },
    { code: 'def initialize', desc: 'المُنشئ' },
    { code: '@var', desc: 'متغيّر مثيل' },
    { code: 'attr_reader :x', desc: 'قارئ' },
    { code: 'self.method', desc: 'دالة صنف' },
    { code: 'super', desc: 'استدعاء الأب' },
    { code: 'private', desc: 'إخفاء' },
    { code: 'freeze', desc: 'تجميد الكائن' }
  ],
  blocks: [
    { t: 'h2', text: 'الصنف قالب والكائن نسخة' },
    { t: 'code', lang: 'ruby', code: `
class Book
  def initialize(title, author, pages)
    @title  = title       # متغيّرات المثيل — حالة هذا الكائن
    @author = author
    @pages  = pages
    @read   = false
  end

  def to_s = "#{@title} — #{@author} (#{@pages} صفحة)"

  def mark_as_read
    @read = true
    self                  # لتمكين التسلسل
  end

  def read? = @read
end

book = Book.new("مئة عام من العزلة", "ماركيز", 417)
puts book                 # يستدعي to_s تلقائياً
book.mark_as_read.read?   # => true

other = Book.new("الأسود يليق بك", "أحلام", 320)
book.read?                # => true
other.read?               # => false   ← حالة مستقلة تماماً
`.trim() },
    { t: 'note', text: '`initialize` تُستدعى تلقائياً عند `new`. لا تكتب `def new` أبداً — تلك دالة صنف مبنيّة في Ruby تنشئ الكائن ثم تستدعي `initialize`.' },

    { t: 'h2', text: 'التغليف — الحالة خاصة افتراضياً' },
    { t: 'p', text: 'متغيّرات المثيل **غير مرئية من الخارج** أبداً. الوصول يمرّ عبر دوال تكتبها أنت، وهذا يمنحك تحكّماً كاملاً.' },
    { t: 'code', lang: 'ruby', code: `
book.@title       # ✗ خطأ صياغي — لا يمكن أصلاً
book.title        # ✗ NoMethodError — لم نعرّف قارئاً

class Book
  def title  = @title            # قارئ يدوي
  def title=(v) = @title = v     # كاتب يدوي
end
`.trim() },
    { t: 'h3', text: 'attr_* — الاختصار' },
    { t: 'code', lang: 'ruby', code: `
class Book
  attr_reader   :title, :author   # قراءة فقط
  attr_writer   :notes            # كتابة فقط  (نادر)
  attr_accessor :rating           # قراءة وكتابة

  def initialize(title, author)
    @title  = title
    @author = author
    @rating = nil
  end
end

b = Book.new("كتاب", "مؤلّف")
b.title            # ✅
b.title = "آخر"    # ✗ NoMethodError — لا كاتب
b.rating = 5       # ✅
`.trim() },
    { t: 'danger', title: 'لا تكتب attr_accessor بشكل تلقائي', text: 'الوصول للكتابة من الخارج يكسر التغليف: يستطيع أي أحد وضع قيمة غير صالحة في كائنك. ابدأ بـ `attr_reader` فقط، ولا تضف كاتباً إلا حين تحتاجه فعلاً — وحينها فكّر في دالة ذات معنى بدلاً منه.' },
    { t: 'compare', lang: 'ruby', bad: {
      code: `class BankAccount
  attr_accessor :balance
end

account = BankAccount.new
account.balance = -5000      # ✗ لا شيء يمنع هذا!`,
      why: 'الكاتب العام يسمح بأي قيمة، فتنهار قواعد العمل ولا تعرف من فعلها.'
    }, good: {
      code: `class BankAccount
  attr_reader :balance

  def initialize(balance = 0)
    @balance = balance
  end

  def deposit(amount)
    raise ArgumentError, "المبلغ يجب أن يكون موجباً" unless amount.positive?
    @balance += amount
    self
  end

  def withdraw(amount)
    raise ArgumentError, "المبلغ يجب أن يكون موجباً" unless amount.positive?
    raise "الرصيد لا يكفي" if amount > @balance
    @balance -= amount
    self
  end
end`,
      why: 'الحالة تتغيّر عبر عمليات ذات معنى تحرس قواعد العمل، فيستحيل وضع الكائن في حالة غير صالحة.'
    }},

    { t: 'h2', text: 'مستويات الرؤية' },
    { t: 'code', lang: 'ruby', code: `
class Order
  def total                    # public افتراضياً
    subtotal + tax + shipping
  end

  private                      # كل ما بعدها خاص

  def subtotal = @items.sum(&:price)
  def tax      = subtotal * 0.15
  def shipping = subtotal > 200 ? 0 : 25

  protected                    # يُرى من كائنات نفس الصنف

  def raw_total = @total
end

order.total      # ✅
order.tax        # ✗ NoMethodError — خاصة
`.trim() },
    { t: 'table', head: ['المستوى', 'من يستطيع الاستدعاء', 'الاستخدام'], rows: [
      ['`public`', 'الجميع', 'واجهة الكائن'],
      ['`private`', 'الكائن نفسه فقط', 'تفاصيل التنفيذ — الأغلبية'],
      ['`protected`', 'الكائن وكائنات نفس الصنف', 'المقارنات بين كائنين']
    ]},
    { t: 'code', lang: 'ruby', code: `
class Money
  include Comparable
  def initialize(cents) = @cents = cents

  def <=>(other) = cents <=> other.cents   # يحتاج رؤية cents في الآخر

  protected
  attr_reader :cents
end

Money.new(500) > Money.new(300)   # => true
`.trim() },
    { t: 'tip', text: 'اجعل كل شيء خاصاً افتراضياً، وارفع الرؤية فقط عند الحاجة. الواجهة العامة الصغيرة أسهل في التغيير لأن أحداً لا يعتمد على تفاصيلك.' },

    { t: 'h2', text: 'دوال الصنف' },
    { t: 'code', lang: 'ruby', code: `
class User
  @@count = 0                      # يُفضَّل تجنّبه
  COUNT_KEY = :users

  def self.create(name)            # دالة صنف
    user = new(name)
    @@count += 1
    user
  end

  class << self                    # صيغة أوضح لعدة دوال صنف
    def count = @@count
    def reset! = @@count = 0

    def from_hash(hash)
      new(hash[:name])
    end
  end

  def initialize(name) = @name = name
end

User.create("سارة")
User.count            # => 1
`.trim() },
    { t: 'h3', text: 'المُنشئات البديلة — استخدام ممتاز لدوال الصنف' },
    { t: 'code', lang: 'ruby', code: `
class Temperature
  attr_reader :celsius

  def initialize(celsius) = @celsius = celsius

  def self.from_fahrenheit(f) = new((f - 32) * 5.0 / 9)
  def self.from_kelvin(k)     = new(k - 273.15)
  def self.freezing           = new(0)
  def self.boiling            = new(100)

  def to_fahrenheit = celsius * 9.0 / 5 + 32
end

Temperature.from_fahrenheit(98.6).celsius   # => 37.0
Temperature.boiling.to_fahrenheit           # => 212.0
`.trim() },

    { t: 'h2', text: 'الوراثة' },
    { t: 'code', lang: 'ruby', code: `
class Shape
  attr_reader :name

  def initialize(name) = @name = name

  def area = raise(NotImplementedError, "#{self.class} يجب أن يعرّف area")
  def to_s = "#{name}: المساحة #{area.round(2)}"
end

class Circle < Shape
  def initialize(radius)
    super("دائرة")            # لا تنسَ استدعاء الأب!
    @radius = radius
  end

  def area = Math::PI * @radius ** 2
end

class Rectangle < Shape
  def initialize(w, h)
    super("مستطيل")
    @w = w
    @h = h
  end

  def area = @w * @h
end

class Square < Rectangle
  def initialize(side)
    super(side, side)
    @name = "مربّع"
  end
end

[Circle.new(3), Rectangle.new(4, 5), Square.new(4)].each { |s| puts s }
`.trim() },
    { t: 'h3', text: 'super بشكليه' },
    { t: 'code', lang: 'ruby', code: `
class Parent
  def greet(name) = "مرحباً #{name}"
end

class Child < Parent
  def greet(name)
    super            # يمرّر نفس الوسائط تلقائياً
  end
end

class Other < Parent
  def greet(name)
    super("زائر")    # يمرّر وسائط محدّدة
  end
end

class NoArgs < Parent
  def greet(name)
    super()          # يمرّر بلا وسائط — لاحظ الأقواس الفارغة
  end
end
`.trim() },
    { t: 'warn', title: 'الفرق بين `super` و `super()`', text: '`super` بلا أقواس تمرّر **كل وسائط الدالة الحالية** تلقائياً. `super()` بأقواس فارغة تمرّر **لا شيء**. الخلط بينهما مصدر أخطاء غامضة.' },

    { t: 'h2', text: 'متى لا تستخدم الوراثة؟' },
    { t: 'p', text: 'الوراثة تعني علاقة **«هو نوع من»** لا **«لديه»** أو **«يستطيع»**. أساء كثيرون استخدامها لمجرّد إعادة استخدام شيفرة.' },
    { t: 'compare', lang: 'ruby', bad: {
      code: `class Engine
  def start = "المحرّك يعمل"
end

class Car < Engine    # ✗ السيارة ليست محرّكاً!
end`,
      why: 'العلاقة هنا «لدى السيارة محرّك» لا «السيارة نوع من المحرّك». الوراثة الخاطئة تورّث الواجهة كلها وتقيّدك لاحقاً.'
    }, good: {
      code: `class Engine
  def start = "المحرّك يعمل"
end

class Car
  def initialize = @engine = Engine.new    # تركيب

  def start = @engine.start                # تفويض
end`,
      why: 'التركيب (Composition) يعطيك نفس إعادة الاستخدام دون قيود الوراثة، ويسمح بتبديل المحرّك لاحقاً.'
    }},
    { t: 'tip', text: 'القاعدة الذهبية: **فضّل التركيب على الوراثة**. استخدم الوراثة حين تريد الوراثة **متعدّدة الأشكال** — أي معاملة أنواع مختلفة بنفس الواجهة كما في مثال `Shape`.' },

    { t: 'h2', text: 'الدوال الخاصة (Magic Methods)' },
    { t: 'code', lang: 'ruby', code: `
class Money
  include Comparable

  attr_reader :cents, :currency

  def initialize(cents, currency = "SAR")
    @cents    = cents
    @currency = currency
    freeze                      # كائن غير قابل للتعديل
  end

  # عرض للمستخدم
  def to_s = format("%.2f %s", cents / 100.0, currency)

  # عرض للمطوّر — يظهر في p و IRB
  def inspect = "#<Money #{self}>"

  # المساواة
  def ==(other)
    other.is_a?(Money) && cents == other.cents && currency == other.currency
  end
  alias eql? ==

  # ضروري لاستخدام الكائن كمفتاح Hash
  def hash = [cents, currency].hash

  # المقارنة — يمنحك < > <= >= between? sort مجاناً عبر Comparable
  def <=>(other) = cents <=> other.cents

  # العمليات الحسابية
  def +(other) = Money.new(cents + other.cents, currency)
  def -(other) = Money.new(cents - other.cents, currency)
  def *(n)     = Money.new((cents * n).round, currency)

  # النفي والسالب
  def -@ = Money.new(-cents, currency)

  # الفهرسة
  def [](key) = { cents:, currency: }[key]

  # التحويل الضمني
  def to_i = cents
end

a = Money.new(1500)
b = Money.new(500)

puts a + b            # => 20.00 SAR
puts a > b            # => true
puts [a, b].max       # => 15.00 SAR
puts(-a)              # => -15.00 SAR
Money.new(100) == Money.new(100)   # => true
{ Money.new(100) => "ريال" }[Money.new(100)]   # => "ريال"
`.trim() },
    { t: 'note', text: 'تعريف `<=>` وحده مع `include Comparable` يمنحك `<` و `>` و `<=` و `>=` و `==` و `between?` و `clamp` والترتيب — سبع قدرات مقابل سطرين.' },
    { t: 'warn', title: 'إن عرّفت `==` عرّف `hash` و `eql?`', text: 'كائنان متساويان يجب أن يكون لهما نفس الـ `hash`، وإلا فسيتصرّف الـ Hash والـ Set بشكل غير متوقّع تماماً.' },

    { t: 'h2', text: 'Struct و Data — أصناف سريعة' },
    { t: 'code', lang: 'ruby', code: `
# Struct — قابل للتعديل
Point = Struct.new(:x, :y) do
  def distance_to(other) = Math.hypot(x - other.x, y - other.y)
end

p1 = Point.new(0, 0)
p2 = Point.new(3, 4)
p1.distance_to(p2)   # => 5.0
p1.x = 10            # مسموح

# Data (Ruby 3.2+) — غير قابل للتعديل، الأفضل للقيم
Coord = Data.define(:lat, :lng) do
  def to_s = "#{lat}, #{lng}"
end

c = Coord.new(lat: 24.7, lng: 46.7)
c.lat            # => 24.7
c.lat = 25       # ✗ NoMethodError
c2 = c.with(lat: 25.0)   # نسخة معدّلة
`.trim() },
    { t: 'tip', text: 'استخدم `Data.define` لأي كائن قيمة بسيط (إحداثيات، نطاق تاريخ، نتيجة عملية). تحصل على `==` و `hash` و `to_s` و`with` مجاناً في سطر واحد.' },

    { t: 'h2', text: 'الاستبطان (Introspection)' },
    { t: 'code', lang: 'ruby', code: `
book = Book.new("كتاب", "مؤلّف")

book.class                    # => Book
book.class.ancestors          # سلسلة الوراثة كاملة
book.is_a?(Book)              # => true
book.is_a?(Object)            # => true
book.instance_of?(Book)       # => true — الصنف بالضبط
book.respond_to?(:title)      # => true
book.methods - Object.new.methods   # الدوال المعرّفة في الصنف
book.instance_variables       # => [:@title, :@author]
book.instance_variable_get(:@title)
Book.instance_methods(false)  # دوال الصنف نفسه بلا الموروثة
`.trim() },
    { t: 'tip', text: 'استخدم `respond_to?` بدل `is_a?` حين يهمّك أن الكائن **يستطيع فعل شيء** لا أنه من نوع معيّن. هذا هو «تصنيف البطّة»: إن مشى كالبطّة وأصدر صوتها فهو بطّة.' },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'نظام إدارة مكتبة',
      brief: 'ابنِ نظاماً كائنياً كاملاً لإدارة مكتبة مع إعارة واسترجاع وغرامات.',
      requirements: [
        'صنف `LibraryItem` أساسي فيه العنوان والمعرّف والحالة، ودالة `loan_period` مجرّدة.',
        'أصناف `Book` و `Magazine` و `DVD` ترث منه، ولكلٍّ مدّة إعارة مختلفة.',
        'صنف `Member` فيه الاسم والمعرّف والمواد المستعارة وحدّ أقصى للإعارة.',
        'صنف `Library` يدير المواد والأعضاء وعمليات الإعارة والاسترجاع.',
        'الإعارة ترفض إن كانت المادة مُعارة، أو تجاوز العضو حدّه، أو عليه غرامات غير مدفوعة.',
        'الاسترجاع المتأخّر يحسب غرامة يومية ويضيفها لحساب العضو.',
        'استخدم `attr_reader` فقط — كل تغيير للحالة يمرّ عبر دالة تتحقّق من الشروط.',
        'عرّف `to_s` لكل صنف، و `<=>` في `LibraryItem` للترتيب بالعنوان.',
        'ارمِ أخطاءً مخصّصة (`ItemUnavailableError` مثلاً) بدل إرجاع `false`.',
        'اكتب سيناريو تشغيل في نهاية الملف يوضّح كل العمليات بما فيها الحالات الفاشلة.'
      ],
      hints: [
        'عرّف أخطاءك بـ `class ItemUnavailableError < StandardError; end`.',
        '`Date.today + loan_period` يحسب تاريخ الاستحقاق.',
        '`raise NotImplementedError` في الصنف الأساسي يجبر الأبناء على التعريف.',
        'استخدم `include Comparable` مع `<=>` للترتيب.'
      ],
      solution: { lang: 'ruby', code: `
# frozen_string_literal: true
# library.rb — نظام إدارة مكتبة
require 'date'

# ===== الأخطاء =====
class LibraryError            < StandardError; end
class ItemUnavailableError    < LibraryError; end
class LoanLimitExceededError  < LibraryError; end
class UnpaidFinesError        < LibraryError; end
class ItemNotLoanedError      < LibraryError; end

# ===== المواد =====
class LibraryItem
  include Comparable

  DAILY_FINE = 2.0

  attr_reader :id, :title, :year, :loaned_to, :due_date

  def initialize(id:, title:, year:)
    @id        = id
    @title     = title
    @year      = year
    @loaned_to = nil
    @due_date  = nil
  end

  def loan_period
    raise NotImplementedError, "#{self.class} يجب أن يعرّف loan_period"
  end

  def type_name
    raise NotImplementedError, "#{self.class} يجب أن يعرّف type_name"
  end

  def available? = @loaned_to.nil?
  def overdue?   = !available? && Date.today > @due_date

  def days_overdue
    return 0 unless overdue?
    (Date.today - @due_date).to_i
  end

  def fine_amount = days_overdue * DAILY_FINE

  def loan_to!(member, on: Date.today)
    raise ItemUnavailableError, "«#{title}» مُعارة حالياً" unless available?

    @loaned_to = member
    @due_date  = on + loan_period
    self
  end

  def return!
    raise ItemNotLoanedError, "«#{title}» ليست مُعارة" if available?

    fine = fine_amount
    @loaned_to = nil
    @due_date  = nil
    fine
  end

  def <=>(other) = title <=> other.title

  def to_s
    state = available? ? "متاحة" : "مُعارة حتى #{due_date}"
    "[#{type_name}] #{title} (#{year}) — #{state}"
  end
end

class Book < LibraryItem
  attr_reader :author, :pages

  def initialize(author:, pages:, **rest)
    super(**rest)
    @author = author
    @pages  = pages
  end

  def loan_period = 21
  def type_name   = "كتاب"
  def to_s        = "#{super} — #{author}"
end

class Magazine < LibraryItem
  attr_reader :issue

  def initialize(issue:, **rest)
    super(**rest)
    @issue = issue
  end

  def loan_period = 7
  def type_name   = "مجلّة"
  def to_s        = "#{super} — العدد #{issue}"
end

class DVD < LibraryItem
  attr_reader :minutes

  def initialize(minutes:, **rest)
    super(**rest)
    @minutes = minutes
  end

  def loan_period = 3
  def type_name   = "قرص"
  def to_s        = "#{super} — #{minutes} دقيقة"
end

# ===== الأعضاء =====
class Member
  MAX_LOANS = 3

  attr_reader :id, :name, :items, :fines

  def initialize(id:, name:)
    @id    = id
    @name  = name
    @items = []
    @fines = 0.0
  end

  def can_borrow?  = @items.size < MAX_LOANS && @fines.zero?
  def add_fine(amount) = @fines += amount

  def pay_fines!
    paid   = @fines
    @fines = 0.0
    paid
  end

  def take!(item)
    raise LoanLimitExceededError, "#{name} بلغ الحدّ الأقصى (#{MAX_LOANS})" if @items.size >= MAX_LOANS
    raise UnpaidFinesError, "على #{name} غرامات #{format('%.2f', @fines)} ر.س" if @fines.positive?

    @items << item
    self
  end

  def give_back!(item)
    @items.delete(item)
    self
  end

  def to_s = "#{name} (##{id}) — #{items.size} مادة، غرامات #{format('%.2f', fines)} ر.س"
end

# ===== المكتبة =====
class Library
  attr_reader :name

  def initialize(name)
    @name    = name
    @items   = {}
    @members = {}
    @log     = []
  end

  def add_item(item)
    @items[item.id] = item
    self
  end

  def register(member)
    @members[member.id] = member
    self
  end

  def find_item(id)   = @items.fetch(id)
  def find_member(id) = @members.fetch(id)

  def checkout(item_id, member_id, on: Date.today)
    item   = find_item(item_id)
    member = find_member(member_id)

    member.take!(item)        # يتحقّق من الحدّ والغرامات
    item.loan_to!(member, on:)
    @log << "#{Date.today}: #{member.name} استعار «#{item.title}»"
    item
  end

  def checkin(item_id)
    item   = find_item(item_id)
    member = item.loaned_to
    fine   = item.return!

    member.give_back!(item)
    if fine.positive?
      member.add_fine(fine)
      @log << "#{Date.today}: #{member.name} أعاد «#{item.title}» متأخّراً — غرامة #{fine} ر.س"
    else
      @log << "#{Date.today}: #{member.name} أعاد «#{item.title}» في الموعد"
    end
    fine
  end

  def available = @items.values.select(&:available?).sort
  def loaned    = @items.values.reject(&:available?).sort
  def overdue   = @items.values.select(&:overdue?).sort

  def report
    puts "\\n" + "═" * 56
    puts " 📚 #{name}"
    puts "═" * 56
    puts "\\n▸ متاحة (#{available.size}):"
    available.each { |i| puts "   #{i}" }

    puts "\\n▸ مُعارة (#{loaned.size}):"
    loaned.each do |i|
      flag = i.overdue? ? " ⚠️ متأخّرة #{i.days_overdue} يوماً" : ""
      puts "   #{i} → #{i.loaned_to.name}#{flag}"
    end

    puts "\\n▸ الأعضاء:"
    @members.each_value { |m| puts "   #{m}" }

    puts "\\n▸ السجلّ:"
    @log.last(6).each { |line| puts "   #{line}" }
    puts
  end
end

# ===== سيناريو التشغيل =====
lib = Library.new("مكتبة CodeWay")

lib.add_item Book.new(id: 1, title: "البرمجة بلغة Ruby", year: 2021, author: "م. سالم", pages: 480)
lib.add_item Book.new(id: 2, title: "أنماط التصميم",     year: 2019, author: "أ. حسن",  pages: 395)
lib.add_item Magazine.new(id: 3, title: "عالم التقنية",   year: 2026, issue: 142)
lib.add_item DVD.new(id: 4, title: "أساسيات الشبكات",     year: 2023, minutes: 95)

lib.register Member.new(id: 100, name: "سارة")
lib.register Member.new(id: 101, name: "خالد")

# إعارات ناجحة
lib.checkout(1, 100)
lib.checkout(3, 100, on: Date.today - 20)   # متأخّرة عمداً
lib.checkout(4, 101)

# محاولات فاشلة
begin
  lib.checkout(1, 101)
rescue ItemUnavailableError => e
  puts "❌ #{e.message}"
end

# استرجاع متأخّر ← غرامة
fine = lib.checkin(3)
puts "💰 غرامة الاسترجاع: #{fine} ر.س"

begin
  lib.checkout(2, 100)
rescue UnpaidFinesError => e
  puts "❌ #{e.message}"
end

paid = lib.find_member(100).pay_fines!
puts "✅ دفعت سارة #{paid} ر.س"
lib.checkout(2, 100)

lib.report
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'لماذا لا نضع `attr_accessor` تلقائياً على كل متغيّر مثيل؟', options: ['بطيء', 'الكاتب العام يكسر التغليف ويسمح بوضع الكائن في حالة غير صالحة', 'يستهلك ذاكرة', 'غير مسموح'], answer: 1,
        explain: 'ابدأ بـ `attr_reader` وأضف عمليات ذات معنى تحرس قواعد العمل بدل كاتب مفتوح.' },
      { q: 'ما الفرق بين `super` و `super()`؟', options: ['لا فرق', '`super` تمرّر كل وسائط الدالة تلقائياً و`super()` تمرّر لا شيء', 'الثانية أسرع', 'الأولى خطأ'], answer: 1,
        explain: 'الخلط بينهما مصدر أخطاء غامضة في `initialize` خاصة.' },
      { q: 'متى تستخدم التركيب بدل الوراثة؟', options: ['دائماً', 'حين تكون العلاقة «لديه» لا «هو نوع من»', 'مع الأصناف الكبيرة', 'أبداً'], answer: 1,
        explain: 'السيارة **لديها** محرّك ولا **ترث** منه. الوراثة للتعامل متعدّد الأشكال بواجهة مشتركة.' },
      { q: 'ماذا يمنحك `include Comparable` مع تعريف `<=>`؟', options: ['السرعة', '`<` و `>` و `<=` و `>=` و `between?` و `clamp` والترتيب — كلها مجاناً', 'المساواة فقط', 'التجميد'], answer: 1,
        explain: 'سبع قدرات مقابل تعريف دالة واحدة — نموذج لقوة الوحدات في Ruby.' },
      { q: 'إن عرّفت `==` فماذا يجب أن تعرّف معه؟', options: ['لا شيء', '`hash` و `eql?` وإلا تصرّف الـ Hash والـ Set بشكل غير متوقّع', '`to_s`', '`<=>`'], answer: 1,
        explain: 'قاعدة أساسية: كائنان متساويان يجب أن يكون لهما نفس الـ hash.' },
      { q: 'ما فائدة `raise NotImplementedError` في الصنف الأساسي؟', options: ['منع الإنشاء', 'يجبر الأصناف الوارثة على تعريف الدالة ويفشل بوضوح إن نسيت', 'يسرّع', 'يوثّق فقط'], answer: 1,
        explain: 'بديل Ruby عن الدوال المجرّدة (abstract) في اللغات الأخرى.' },
      { q: 'ما ميزة `Data.define` على `Struct`؟', options: ['أسرع', 'ينتج كائناً غير قابل للتعديل مع `==` و `hash` و `with` جاهزة', 'يقبل وراثة', 'أقصر فقط'], answer: 1,
        explain: 'مثالي لكائنات القيمة؛ أُضيف في Ruby 3.2.' }
    ]}
  ]
};
