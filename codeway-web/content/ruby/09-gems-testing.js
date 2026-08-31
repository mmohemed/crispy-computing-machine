'use strict';

module.exports = {
  slug: '09-gems-testing',
  title: 'الأدوات: Gems و Bundler و RSpec',
  summary: 'إدارة الاعتماديات بـ Bundler، بناء gem خاص بك، واختبار شيفرتك بـ RSpec و Minitest.',
  duration: 55,
  level: 'متقدم',
  tags: ['Gems', 'Bundler', 'RSpec', 'اختبارات'],
  objectives: [
    'تثبّت الـ gems وتديرها بـ Bundler بشكل قابل لإعادة الإنتاج.',
    'تفهم دور `Gemfile` و `Gemfile.lock` والفرق بينهما.',
    'تنشئ gem خاصاً بك بالبنية القياسية.',
    'تكتب اختبارات بـ RSpec: `describe` و `context` و `it` والتوقّعات.',
    'تستخدم `let` و `subject` والمضاعفات (doubles).',
    'تضبط RuboCop لتوحيد أسلوب الشيفرة.'
  ],
  quickRef: [
    { code: 'gem install x', desc: 'تثبيت مباشر' },
    { code: 'bundle install', desc: 'تثبيت من Gemfile' },
    { code: 'bundle exec cmd', desc: 'تشغيل بإصدارات المشروع' },
    { code: 'bundle add x', desc: 'إضافة gem' },
    { code: 'rspec', desc: 'تشغيل الاختبارات' },
    { code: 'expect(x).to eq(y)', desc: 'توقّع' },
    { code: 'let(:x) { … }', desc: 'قيمة كسولة' },
    { code: 'rubocop -a', desc: 'إصلاح الأسلوب' }
  ],
  blocks: [
    { t: 'h2', text: 'ما الـ gem؟' },
    { t: 'p', text: 'حزمة شيفرة Ruby جاهزة للاستخدام، منشورة على `rubygems.org`. النظام البيئي ضخم: أكثر من 180 ألف gem.' },
    { t: 'code', lang: 'bash', code: `
gem install rspec              # تثبيت
gem install rails -v 7.1.0     # إصدار محدّد
gem list                       # المثبّت لديك
gem which json                 # مسار gem
gem update --system            # تحديث RubyGems نفسه
gem uninstall rspec
`.trim() },
    { t: 'warn', title: 'لا تثبّت عالمياً في المشاريع', text: '`gem install` يثبّت للنظام كله، فيتعارض مشروعان يحتاجان إصدارين مختلفين. استخدم Bundler دائماً في أي مشروع حقيقي.' },

    { t: 'h2', text: 'Bundler' },
    { t: 'code', lang: 'bash', code: `
gem install bundler
bundle init                    # ينشئ Gemfile
bundle add sinatra             # يضيف ويثبّت
bundle install                 # يثبّت كل شيء
bundle update rspec            # يحدّث gem واحداً
bundle outdated                # ما الذي له إصدار أحدث؟
bundle exec rspec              # تشغيل بإصدارات المشروع بالضبط
`.trim() },
    { t: 'h3', text: 'Gemfile' },
    { t: 'code', lang: 'ruby', code: `
source "https://rubygems.org"
ruby "3.3.6"

gem "sinatra", "~> 4.0"        # >= 4.0 و < 5.0
gem "puma",    ">= 6.4"
gem "sequel",  "5.75.0"        # إصدار مثبّت تماماً
gem "dotenv"

group :development, :test do
  gem "rspec",   "~> 3.13"
  gem "rubocop", require: false
  gem "pry"
end

group :test do
  gem "simplecov",  require: false
  gem "webmock"
end

gem "internal_tool", git: "https://github.com/org/tool.git", branch: "main"
gem "local_gem",     path: "../local_gem"
`.trim() },
    { t: 'table', head: ['المحدّد', 'المعنى', 'مثال يقبل'], rows: [
      ['`"1.2.3"`', 'هذا الإصدار بالضبط', '1.2.3 فقط'],
      ['`">= 1.2"`', 'هذا أو أحدث', '1.2, 2.0, 9.9'],
      ['`"~> 1.2"`', 'يسمح بتغيير آخر رقم', '1.2 … 1.9، **لا** 2.0'],
      ['`"~> 1.2.3"`', 'يسمح بتغيير التصحيحات فقط', '1.2.3 … 1.2.9، **لا** 1.3.0']
    ]},
    { t: 'tip', text: 'استخدم `~>` (يُسمّى «العامل المتفائل») افتراضياً: يمنحك تصحيحات الأمان والأخطاء تلقائياً دون المخاطرة بتغييرات كاسرة في الإصدار الرئيسي.' },
    { t: 'h3', text: 'Gemfile.lock' },
    { t: 'p', text: 'يُولَّد تلقائياً ويسجّل **الإصدار الدقيق** لكل gem بما فيها الاعتماديات غير المباشرة. هذا ما يضمن أن ما يعمل على جهازك يعمل على الخادم بالضبط.' },
    { t: 'danger', title: 'التزم `Gemfile.lock` في Git', text: 'للتطبيقات: **نعم دائماً** — بدونه قد يثبّت الخادم إصدارات مختلفة عمّا اختبرت. للمكتبات (gems): **لا** — أضفه لـ `.gitignore` لأن المكتبة يجب أن تعمل مع مدى واسع من الإصدارات.' },
    { t: 'code', lang: 'bash', code: `
# في الإنتاج والـ CI — يفشل إن اختلف Gemfile.lock بدل تعديله
bundle install --deployment
bundle config set frozen true && bundle install
`.trim() },

    { t: 'h2', text: 'أشهر الـ gems' },
    { t: 'table', head: ['الحاجة', 'الـ gem'], rows: [
      ['إطار ويب كامل', '`rails`'],
      ['إطار ويب خفيف', '`sinatra`, `roda`'],
      ['خادم تطبيقات', '`puma`'],
      ['طلبات HTTP', '`faraday`, `http`'],
      ['قواعد بيانات', '`sequel`, `activerecord`, `pg`'],
      ['اختبارات', '`rspec`, `minitest`'],
      ['بيانات وهمية للاختبار', '`faker`, `factory_bot`'],
      ['تنقيح', '`pry`, `debug`'],
      ['أسلوب الشيفرة', '`rubocop`'],
      ['مهام خلفية', '`sidekiq`'],
      ['متغيّرات البيئة', '`dotenv`'],
      ['تغطية الاختبارات', '`simplecov`'],
      ['سطر أوامر', '`thor`, `tty-prompt`']
    ]},

    { t: 'h2', text: 'بناء gem خاص بك' },
    { t: 'code', lang: 'bash', code: `
bundle gem text_utils --test=rspec --ci=github --linter=rubocop
cd text_utils
`.trim() },
    { t: 'code', lang: 'text', code: `
text_utils/
├── lib/
│   ├── text_utils.rb            ← نقطة الدخول
│   └── text_utils/
│       ├── version.rb
│       └── slugger.rb
├── spec/
│   ├── spec_helper.rb
│   └── text_utils_spec.rb
├── text_utils.gemspec           ← البيانات الوصفية
├── Gemfile
├── Rakefile
└── README.md
`.trim() },
    { t: 'code', lang: 'ruby', code: `
# text_utils.gemspec
require_relative "lib/text_utils/version"

Gem::Specification.new do |spec|
  spec.name        = "text_utils"
  spec.version     = TextUtils::VERSION
  spec.authors     = ["اسمك"]
  spec.summary     = "أدوات معالجة نصوص عربية"
  spec.description = "مجموعة أدوات لتنظيف النصوص العربية وتحويلها"
  spec.homepage    = "https://github.com/you/text_utils"
  spec.license     = "MIT"
  spec.required_ruby_version = ">= 3.1.0"

  spec.files = Dir["lib/**/*.rb", "README.md", "LICENSE.txt"]
  spec.require_paths = ["lib"]

  spec.add_dependency "zeitwerk", "~> 2.6"
  spec.add_development_dependency "rspec", "~> 3.13"
end
`.trim() },
    { t: 'code', lang: 'bash', code: `
rake build                      # يبني pkg/text_utils-0.1.0.gem
gem install pkg/text_utils-0.1.0.gem   # اختبره محلياً
rake release                    # وسم Git + نشر على rubygems.org
`.trim() },

    { t: 'h2', text: 'RSpec — الاختبارات' },
    { t: 'p', text: 'إطار الاختبار الأشهر في Ruby، ولغته قريبة من اللغة الطبيعية بحيث يُقرأ ملف الاختبار كوصف للسلوك.' },
    { t: 'code', lang: 'bash', code: `
bundle add rspec --group development,test
bundle exec rspec --init        # ينشئ .rspec و spec/spec_helper.rb
bundle exec rspec               # تشغيل الكل
bundle exec rspec spec/cart_spec.rb:42   # اختبار واحد بسطره
bundle exec rspec --format doc  # مخرجات وصفية
`.trim() },
    { t: 'code', lang: 'ruby', code: `
# spec/shopping_cart_spec.rb
require "shopping_cart"

RSpec.describe ShoppingCart do
  # let كسول: يُنفَّذ عند أول استخدام في كل اختبار، وينسى بعده
  let(:cart)   { described_class.new }
  let(:laptop) { Product.new(name: "لابتوب", price: 4500) }
  let(:mouse)  { Product.new(name: "ماوس",   price: 120) }

  describe "#add" do
    it "يضيف منتجاً للسلّة" do
      cart.add(laptop)
      expect(cart.items.size).to eq(1)
    end

    it "يزيد الكمية عند إضافة نفس المنتج" do
      cart.add(laptop)
      cart.add(laptop)

      expect(cart.items.size).to eq(1)
      expect(cart.quantity_of(laptop)).to eq(2)
    end

    it "يُرجع السلّة للتسلسل" do
      expect(cart.add(laptop)).to be(cart)
    end

    context "عند كمية غير صالحة" do
      it "يرمي ArgumentError" do
        expect { cart.add(laptop, quantity: 0) }
          .to raise_error(ArgumentError, /الكمية/)
      end
    end
  end

  describe "#total" do
    context "عندما تكون السلّة فارغة" do
      it "يُرجع صفراً" do
        expect(cart.total).to be_zero
      end
    end

    context "مع منتجات" do
      before { cart.add(laptop).add(mouse, quantity: 2) }

      it "يجمع أسعار كل المنتجات مضروبة بكمياتها" do
        expect(cart.total).to eq(4500 + 240)
      end

      it "يطبّق الخصم عند تجاوز الحدّ" do
        expect(cart.total(discount: 0.1)).to be_within(0.01).of(4266.0)
      end
    end
  end

  describe "#empty?" do
    it { expect(cart).to be_empty }

    it "يصبح false بعد الإضافة" do
      cart.add(laptop)
      expect(cart).not_to be_empty
    end
  end
end
`.trim() },
    { t: 'h3', text: 'أهم المطابقات (Matchers)' },
    { t: 'code', lang: 'ruby', code: `
expect(x).to eq(5)                    # == مساواة قيمة
expect(x).to eql(5)                   # مساواة مع النوع
expect(x).to be(obj)                  # نفس الكائن
expect(x).to be_nil
expect(x).to be_truthy / be_falsey
expect(x).to be > 5
expect(x).to be_within(0.01).of(3.14)

expect(list).to include(3)
expect(list).to match_array([3, 1, 2])   # نفس العناصر بأي ترتيب
expect(list).to all(be_positive)
expect(list).to be_empty
expect(list.size).to eq(3)

expect(str).to match(/ruby/i)
expect(str).to start_with("مرحبا")

expect(hash).to include(name: "سارة")

expect(obj).to be_a(User)
expect(obj).to respond_to(:save)
expect(obj).to be_valid                # يستدعي valid?
expect(obj).to have_attributes(name: "سارة", age: 30)

expect { code }.to raise_error(ArgumentError)
expect { code }.to change { cart.total }.by(100)
expect { code }.to change { User.count }.from(0).to(1)
expect { code }.not_to change { list.size }
expect { code }.to output("مرحبا\\n").to_stdout
`.trim() },
    { t: 'h3', text: 'المضاعفات (Doubles) والتخيّل (Mocks)' },
    { t: 'code', lang: 'ruby', code: `
# double — كائن وهمي بسيط
let(:gateway) { double("PaymentGateway", charge: true) }

# instance_double — يتحقّق أن الدوال موجودة فعلاً في الصنف الحقيقي ✅
let(:gateway) { instance_double(PaymentGateway, charge: true) }

it "يستدعي البوّابة بالمبلغ الصحيح" do
  expect(gateway).to receive(:charge).with(4500).and_return(true)
  checkout.pay(gateway)
end

it "يعالج فشل الدفع" do
  allow(gateway).to receive(:charge).and_raise(PaymentError)
  expect(checkout.pay(gateway)).to be_falsey
end

# تثبيت الوقت
it "يسجّل وقت الإنشاء" do
  allow(Time).to receive(:now).and_return(Time.new(2026, 1, 1))
  expect(Order.new.created_at.year).to eq(2026)
end
`.trim() },
    { t: 'tip', text: 'فضّل `instance_double` على `double` دائماً: إن حذفت أو أعدت تسمية دالة في الصنف الحقيقي، يفشل الاختبار فوراً بدل أن يبقى أخضر كذباً.' },
    { t: 'warn', title: 'لا تفرط في المضاعفات', text: 'اختبار مليء بالـ mocks يختبر **تنفيذك** لا **سلوكك**، فيكسر عند كل إعادة هيكلة. استخدمها للحدود الخارجية فقط: الشبكة، قاعدة البيانات، الوقت، نظام الملفات.' },

    { t: 'h2', text: 'Minitest — البديل الأخفّ' },
    { t: 'code', lang: 'ruby', code: `
require "minitest/autorun"
require "shopping_cart"

class ShoppingCartTest < Minitest::Test
  def setup
    @cart   = ShoppingCart.new
    @laptop = Product.new(name: "لابتوب", price: 4500)
  end

  def test_adds_product
    @cart.add(@laptop)
    assert_equal 1, @cart.items.size
  end

  def test_raises_on_invalid_quantity
    assert_raises(ArgumentError) { @cart.add(@laptop, quantity: 0) }
  end

  def test_total
    @cart.add(@laptop)
    assert_in_delta 4500, @cart.total, 0.01
  end
end
`.trim() },
    { t: 'note', text: 'Minitest جزء من مكتبة Ruby القياسية، أسرع وأبسط. RSpec أغنى بالمطابقات وأكثر تعبيراً. المشاريع الجديدة تختار غالباً RSpec، وRails يأتي بـ Minitest افتراضياً — كلاهما خيار صحيح.' },

    { t: 'h2', text: 'RuboCop' },
    { t: 'code', lang: 'bash', code: `
bundle add rubocop --group development
bundle exec rubocop              # فحص
bundle exec rubocop -a           # إصلاح الآمن تلقائياً
bundle exec rubocop -A           # إصلاح الكل (راجع النتيجة!)
bundle exec rubocop --auto-gen-config   # يتجاهل المخالفات القائمة
`.trim() },
    { t: 'code', lang: 'text', code: `
# .rubocop.yml
AllCops:
  TargetRubyVersion: 3.3
  NewCops: enable
  Exclude:
    - "db/**/*"
    - "vendor/**/*"

Style/Documentation:
  Enabled: false

Metrics/MethodLength:
  Max: 20

Metrics/BlockLength:
  Exclude:
    - "spec/**/*"

Layout/LineLength:
  Max: 120
`.trim() },

    { t: 'h2', text: 'تغطية الاختبارات' },
    { t: 'code', lang: 'ruby', code: `
# spec/spec_helper.rb — يجب أن يكون في أول الملف
require "simplecov"
SimpleCov.start do
  add_filter "/spec/"
  add_group "Models",   "lib/models"
  add_group "Services", "lib/services"
  minimum_coverage 85
end
`.trim() },
    { t: 'warn', title: 'التغطية مؤشّر لا هدف', text: 'تغطية 100٪ لا تعني شيفرة صحيحة — تعني فقط أن كل سطر نُفِّذ مرة. ركّز على تغطية **الحالات الحدّية والمسارات الفاشلة**، لا على الرقم.' },

    { t: 'h2', text: 'مبادئ الاختبار الجيّد' },
    { t: 'steps', items: [
      '**اختبر السلوك لا التنفيذ**: «تحسب الإجمالي مع الضريبة» لا «تستدعي calculate_tax».',
      '**اختبار واحد = تأكيد واحد** قدر الإمكان — فشله يخبرك بالمشكلة فوراً.',
      '**اسم وصفي**: عند الفشل يجب أن يكفي الاسم لفهم ما انكسر.',
      '**رتّب بنمط AAA**: تهيئة (Arrange)، تنفيذ (Act)، تأكيد (Assert).',
      '**اختبر الحالات الحدّية**: صفر، فارغ، `nil`، سالب، أقصى حدّ.',
      '**اختبر المسارات الفاشلة** لا الناجحة فقط — هنا تختبئ الأخطاء.',
      '**اجعلها مستقلّة**: ترتيب التشغيل يجب ألا يؤثّر على النتيجة.',
      '**اجعلها سريعة**: مجموعة بطيئة لن تُشغَّل، ومجموعة لا تُشغَّل عديمة الفائدة.'
    ]},

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'gem مع مجموعة اختبارات كاملة',
      brief: 'ابنِ gem لتحويل الوحدات مع اختبارات RSpec شاملة وإعداد CI.',
      requirements: [
        'أنشئ gem باسم `unit_convert` بـ `bundle gem`.',
        'وحدة تحويل للأطوال والأوزان ودرجات الحرارة والعملات.',
        'واجهة قابلة للتسلسل: `UnitConvert.value(100).from(:cm).to(:m)`.',
        'ارمِ `UnitConvert::UnknownUnitError` لوحدة غير معروفة، و `IncompatibleUnitsError` عند خلط الفئات.',
        'اكتب اختبارات RSpec تغطّي: كل تحويل، الحالات الحدّية (صفر، سالب، أعداد ضخمة)، والأخطاء.',
        'استخدم `let` و `described_class` و `context` بشكل صحيح.',
        'استخدم `instance_double` لمزوّد أسعار العملات، ولا تلمس الشبكة في الاختبارات.',
        'اضبط SimpleCov بحدّ أدنى 90٪ للتغطية.',
        'اضبط RuboCop واجعله يمرّ بلا مخالفات.',
        'أضف ملف GitHub Actions يشغّل الاختبارات و RuboCop على ثلاثة إصدارات من Ruby.'
      ],
      hints: [
        'خزّن معاملات التحويل في Hash مجمّد: `{ length: { m: 1.0, cm: 0.01, km: 1000.0 } }`.',
        'حوّل دائماً إلى وحدة أساسية ثم إلى الهدف — يقلّل عدد المعاملات من N² إلى N.',
        'درجات الحرارة تحتاج معالجة خاصة (إزاحة لا ضرب فقط).',
        '`be_within(0.001).of(expected)` للمقارنات العشرية.'
      ],
      solution: { lang: 'ruby', code: `
# ═══════════════════════════════════════════════════
# lib/unit_convert.rb
# ═══════════════════════════════════════════════════
# frozen_string_literal: true

require_relative "unit_convert/version"
require_relative "unit_convert/errors"
require_relative "unit_convert/conversion"

module UnitConvert
  FACTORS = {
    length: { m: 1.0, cm: 0.01, mm: 0.001, km: 1000.0, mi: 1609.344, ft: 0.3048, in: 0.0254 },
    mass:   { kg: 1.0, g: 0.001, mg: 0.000001, t: 1000.0, lb: 0.45359237, oz: 0.028349523 }
  }.freeze

  TEMPERATURE_UNITS = %i[c f k].freeze

  module_function

  def value(number) = Conversion.new(number)

  def category_of(unit)
    return :temperature if TEMPERATURE_UNITS.include?(unit)

    FACTORS.each { |category, units| return category if units.key?(unit) }
    raise UnknownUnitError, unit
  end

  def units = FACTORS.values.flat_map(&:keys) + TEMPERATURE_UNITS
end

# ═══════════════════════════════════════════════════
# lib/unit_convert/errors.rb
# ═══════════════════════════════════════════════════
# frozen_string_literal: true

module UnitConvert
  class Error < StandardError; end

  class UnknownUnitError < Error
    attr_reader :unit

    def initialize(unit)
      @unit = unit
      super("وحدة غير معروفة: #{unit.inspect}")
    end
  end

  class IncompatibleUnitsError < Error
    attr_reader :from, :to

    def initialize(from, to)
      @from = from
      @to   = to
      super("لا يمكن التحويل من #{from} إلى #{to} — فئتان مختلفتان")
    end
  end

  class MissingSourceError < Error
    def initialize = super("استدعِ from قبل to")
  end
end

# ═══════════════════════════════════════════════════
# lib/unit_convert/conversion.rb
# ═══════════════════════════════════════════════════
# frozen_string_literal: true

module UnitConvert
  class Conversion
    attr_reader :number, :source

    def initialize(number)
      raise ArgumentError, "القيمة يجب أن تكون رقماً" unless number.is_a?(Numeric)

      @number = number.to_f
      @source = nil
    end

    def from(unit)
      UnitConvert.category_of(unit)   # يرمي إن كانت مجهولة
      @source = unit
      self
    end

    def to(unit, precision: 6)
      raise MissingSourceError unless source

      source_category = UnitConvert.category_of(source)
      target_category = UnitConvert.category_of(unit)
      raise IncompatibleUnitsError.new(source, unit) if source_category != target_category

      result =
        if source_category == :temperature
          convert_temperature(unit)
        else
          convert_linear(source_category, unit)
        end

      result.round(precision)
    end

    private

    def convert_linear(category, target)
      factors = UnitConvert::FACTORS.fetch(category)
      base    = number * factors.fetch(source)
      base / factors.fetch(target)
    end

    def convert_temperature(target)
      celsius =
        case source
        when :c then number
        when :f then (number - 32) * 5.0 / 9
        when :k then number - 273.15
        end

      case target
      when :c then celsius
      when :f then celsius * 9.0 / 5 + 32
      when :k then celsius + 273.15
      end
    end
  end
end

# ═══════════════════════════════════════════════════
# spec/spec_helper.rb
# ═══════════════════════════════════════════════════
# frozen_string_literal: true

require "simplecov"
SimpleCov.start do
  add_filter "/spec/"
  minimum_coverage 90
end

require "unit_convert"

RSpec.configure do |config|
  config.expect_with(:rspec) { |c| c.syntax = :expect }
  config.disable_monkey_patching!
  config.order = :random
  Kernel.srand config.seed
end

# ═══════════════════════════════════════════════════
# spec/unit_convert_spec.rb
# ═══════════════════════════════════════════════════
# frozen_string_literal: true

RSpec.describe UnitConvert do
  describe ".value" do
    it "يُرجع كائن تحويل" do
      expect(described_class.value(1)).to be_a(UnitConvert::Conversion)
    end

    it "يرفض القيم غير الرقمية" do
      expect { described_class.value("نصّ") }
        .to raise_error(ArgumentError, /رقماً/)
    end
  end

  describe ".category_of" do
    it { expect(described_class.category_of(:m)).to eq(:length) }
    it { expect(described_class.category_of(:kg)).to eq(:mass) }
    it { expect(described_class.category_of(:c)).to eq(:temperature) }

    it "يرمي للوحدة المجهولة" do
      expect { described_class.category_of(:parsec) }
        .to raise_error(UnitConvert::UnknownUnitError, /parsec/)
    end
  end
end

# ═══════════════════════════════════════════════════
# spec/unit_convert/conversion_spec.rb
# ═══════════════════════════════════════════════════
# frozen_string_literal: true

RSpec.describe UnitConvert::Conversion do
  subject(:convert) { UnitConvert.method(:value) }

  describe "الأطوال" do
    it "يحوّل السنتيمتر إلى متر" do
      expect(convert.call(100).from(:cm).to(:m)).to eq(1.0)
    end

    it "يحوّل الكيلومتر إلى ميل" do
      expect(convert.call(1).from(:km).to(:mi)).to be_within(0.0001).of(0.6214)
    end

    it "يحوّل القدم إلى بوصة" do
      expect(convert.call(1).from(:ft).to(:in)).to be_within(0.0001).of(12.0)
    end

    it "يُرجع القيمة نفسها لنفس الوحدة" do
      expect(convert.call(42.5).from(:m).to(:m)).to eq(42.5)
    end
  end

  describe "الأوزان" do
    it "يحوّل الغرام إلى كيلوغرام" do
      expect(convert.call(2500).from(:g).to(:kg)).to eq(2.5)
    end

    it "يحوّل الرطل إلى كيلوغرام" do
      expect(convert.call(10).from(:lb).to(:kg)).to be_within(0.001).of(4.536)
    end
  end

  describe "درجات الحرارة" do
    it "يحوّل المئوية إلى فهرنهايت" do
      expect(convert.call(100).from(:c).to(:f)).to eq(212.0)
    end

    it "يحوّل الفهرنهايت إلى مئوية" do
      expect(convert.call(98.6).from(:f).to(:c)).to be_within(0.01).of(37.0)
    end

    it "يحوّل المئوية إلى كلفن" do
      expect(convert.call(0).from(:c).to(:k)).to eq(273.15)
    end

    it "يتعامل مع الصفر المطلق" do
      expect(convert.call(0).from(:k).to(:c)).to eq(-273.15)
    end
  end

  describe "الحالات الحدّية" do
    it "يتعامل مع الصفر" do
      expect(convert.call(0).from(:km).to(:m)).to eq(0.0)
    end

    it "يتعامل مع القيم السالبة" do
      expect(convert.call(-40).from(:c).to(:f)).to eq(-40.0)
    end

    it "يتعامل مع الأعداد الضخمة" do
      expect(convert.call(1_000_000).from(:mm).to(:km)).to eq(1.0)
    end

    it "يحترم دقّة التقريب المطلوبة" do
      expect(convert.call(1).from(:m).to(:ft, precision: 2)).to eq(3.28)
    end
  end

  describe "الأخطاء" do
    it "يرمي عند خلط الفئات" do
      expect { convert.call(1).from(:m).to(:kg) }
        .to raise_error(UnitConvert::IncompatibleUnitsError, /فئتان/)
    end

    it "يرمي عند وحدة مصدر مجهولة" do
      expect { convert.call(1).from(:xyz) }
        .to raise_error(UnitConvert::UnknownUnitError)
    end

    it "يرمي عند استدعاء to قبل from" do
      expect { described_class.new(1).to(:m) }
        .to raise_error(UnitConvert::MissingSourceError, /from/)
    end
  end

  describe "التسلسل" do
    it "يُرجع self من from" do
      conversion = described_class.new(1)
      expect(conversion.from(:m)).to be(conversion)
    end
  end
end

# ═══════════════════════════════════════════════════
# .github/workflows/ci.yml
# ═══════════════════════════════════════════════════
# name: CI
#
# on: [push, pull_request]
#
# jobs:
#   test:
#     runs-on: ubuntu-latest
#     strategy:
#       matrix:
#         ruby: ["3.1", "3.2", "3.3"]
#     steps:
#       - uses: actions/checkout@v4
#       - uses: ruby/setup-ruby@v1
#         with:
#           ruby-version: \${{ matrix.ruby }}
#           bundler-cache: true
#       - run: bundle exec rspec
#       - run: bundle exec rubocop
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'ما الفرق بين `Gemfile` و `Gemfile.lock`؟', options: ['لا فرق', 'الأول يصف المدايات المقبولة والثاني يسجّل الإصدارات الدقيقة المثبّتة فعلاً', 'العكس', 'الثاني احتياطي'], answer: 1,
        explain: 'الـ lock هو ما يضمن أن ما يعمل على جهازك يعمل على الخادم بالضبط.' },
      { q: 'هل تلتزم `Gemfile.lock` في Git؟', options: ['دائماً', 'نعم للتطبيقات، ولا للمكتبات (gems)', 'أبداً', 'في الإنتاج فقط'], answer: 1,
        explain: 'المكتبة يجب أن تعمل مع مدى واسع من إصدارات اعتمادياتها، فتثبيتها يضرّ مستخدميها.' },
      { q: 'ماذا يعني `~> 1.2`؟', options: ['1.2 بالضبط', '>= 1.2 و < 2.0 — يسمح بتغيير آخر رقم', 'أي إصدار', '< 1.2'], answer: 1,
        explain: 'ويُسمّى العامل المتفائل؛ `~> 1.2.3` أضيق ويسمح بالتصحيحات فقط.' },
      { q: 'لماذا `bundle exec rspec` بدل `rspec`؟', options: ['أسرع', 'يضمن التشغيل بإصدارات المشروع المحدّدة في Gemfile.lock', 'أقصر', 'لا فرق'], answer: 1,
        explain: 'بدونه قد تُستخدم نسخة عالمية مختلفة تماماً عمّا يتوقّعه المشروع.' },
      { q: 'ما ميزة `instance_double` على `double`؟', options: ['أسرع', 'يتحقّق أن الدوال موجودة فعلاً في الصنف الحقيقي فيكسر الاختبار عند إعادة التسمية', 'أقصر', 'يقبل أي دالة'], answer: 1,
        explain: 'الـ `double` العادي يقبل أي دالة تخترعها فيبقى أخضر كذباً بعد إعادة الهيكلة.' },
      { q: 'ما الفرق بين `let` و `before`؟', options: ['لا فرق', '`let` كسول يُنفَّذ عند أول استخدام، و`before` يُنفَّذ قبل كل اختبار دائماً', 'العكس', '`let` أسرع'], answer: 1,
        explain: 'ولهذا `let` أنسب للبيانات و`before` للتهيئة ذات الأثر الجانبي.' },
      { q: 'هل تغطية 100٪ تعني شيفرة صحيحة؟', options: ['نعم', 'لا — تعني فقط أن كل سطر نُفِّذ مرة، لا أن الحالات الحدّية مُختبَرة', 'أحياناً', 'تعني خلوّها من الأخطاء'], answer: 1,
        explain: 'ركّز على المسارات الفاشلة والحالات الحدّية لا على الرقم.' }
    ]}
  ]
};
