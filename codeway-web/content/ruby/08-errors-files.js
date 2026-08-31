'use strict';

module.exports = {
  slug: '08-errors-files',
  title: 'معالجة الأخطاء والملفات',
  summary: 'شجرة الاستثناءات، begin/rescue/ensure/retry، الأخطاء المخصّصة، وقراءة الملفات و JSON و CSV بكفاءة.',
  duration: 55,
  level: 'متوسط',
  tags: ['استثناءات', 'ملفات', 'JSON'],
  objectives: [
    'تفهم شجرة الاستثناءات ولماذا لا تلتقط `Exception` أبداً.',
    'تستخدم `rescue` و `ensure` و `retry` و `raise` في مواضعها.',
    'تعرّف أخطاءً مخصّصة تحمل سياقاً مفيداً.',
    'تقرأ الملفات وتكتبها بأمان دون تسريب موارد.',
    'تعالج الملفات الضخمة سطراً سطراً بلا استهلاك ذاكرة.',
    'تتعامل مع JSON و CSV باستخدام المكتبة القياسية.'
  ],
  quickRef: [
    { code: 'begin … rescue … end', desc: 'التقاط خطأ' },
    { code: 'rescue E => e', desc: 'ربط الخطأ' },
    { code: 'ensure', desc: 'ينفّذ دائماً' },
    { code: 'retry', desc: 'أعد المحاولة' },
    { code: 'raise E, "msg"', desc: 'رمي خطأ' },
    { code: 'File.foreach', desc: 'قراءة سطراً سطراً' },
    { code: 'JSON.parse(s)', desc: 'تحليل JSON' },
    { code: 'CSV.foreach', desc: 'قراءة CSV' }
  ],
  blocks: [
    { t: 'h2', text: 'شجرة الاستثناءات' },
    { t: 'code', lang: 'text', code: `
Exception                        ← الجذر — لا تلتقطه أبداً
├── NoMemoryError                ← لا ذاكرة
├── SystemExit                   ← استدعاء exit
├── SignalException              ← Ctrl+C
├── ScriptError
│   ├── LoadError                ← require فشل
│   ├── SyntaxError
│   └── NotImplementedError
└── StandardError                ← ✅ هذا ما تلتقطه
    ├── ArgumentError
    ├── IOError → EOFError
    ├── IndexError → KeyError, StopIteration
    ├── NameError → NoMethodError
    ├── RangeError → FloatDomainError
    ├── RuntimeError             ← raise "نصّ" الافتراضي
    ├── TypeError
    ├── ZeroDivisionError
    └── SystemCallError → Errno::ENOENT وأخواتها
`.trim() },
    { t: 'danger', title: 'لا تلتقط `Exception` أبداً', text: 'يلتقط `SystemExit` و `SignalException` و `NoMemoryError` — أي أن `Ctrl+C` لن يوقف برنامجك وقد يستمر بعد نفاد الذاكرة. `rescue` بلا نوع يلتقط `StandardError` فقط، وهذا هو الصحيح.' },
    { t: 'compare', lang: 'ruby', bad: {
      code: `begin
  risky_operation
rescue Exception => e     # ✗ يلتقط كل شيء
  puts "خطأ"              # ✗ يبتلع التفاصيل
end`,
      why: 'يلتقط إشارات النظام والخروج، ويبتلع الخطأ دون تسجيل نوعه ولا مكانه فيستحيل التنقيح.'
    }, good: {
      code: `begin
  risky_operation
rescue Net::ReadTimeout, Errno::ECONNREFUSED => e
  logger.warn("فشل الاتصال: #{e.class} — #{e.message}")
  fallback_value
rescue StandardError => e
  logger.error("#{e.class}: #{e.message}\\n#{e.backtrace.first(5).join("\\n")}")
  raise
end`,
      why: 'يلتقط الأخطاء المتوقّعة تحديداً ويعالجها، ويسجّل غير المتوقّع ثم يعيد رميه بدل إخفائه.'
    }},

    { t: 'h2', text: 'البنية الكاملة' },
    { t: 'code', lang: 'ruby', code: `
begin
  result = perform_operation
rescue ArgumentError => e
  puts "وسيط خاطئ: #{e.message}"
rescue IOError, SystemCallError => e
  puts "مشكلة إدخال/إخراج: #{e.message}"
rescue StandardError => e
  puts "خطأ غير متوقّع: #{e.class}"
  raise                          # أعد الرمي
else
  puts "نجح بلا أخطاء"           # ينفّذ عند عدم وقوع خطأ فقط
ensure
  cleanup                        # ينفّذ دائماً — نجح أو فشل
end
`.trim() },
    { t: 'table', head: ['الجزء', 'متى يُنفَّذ'], rows: [
      ['`begin`', 'دائماً — الشيفرة المحروسة'],
      ['`rescue`', 'عند وقوع خطأ من النوع المحدّد'],
      ['`else`', 'عند **عدم** وقوع أي خطأ'],
      ['`ensure`', '**دائماً** — حتى مع `return` أو `raise`']
    ]},
    { t: 'h3', text: 'rescue على مستوى الدالة' },
    { t: 'code', lang: 'ruby', code: `
def fetch_user(id)
  api.get("/users/#{id}")
rescue Net::HTTPError => e         # لا حاجة لـ begin
  logger.warn(e.message)
  nil
ensure
  api.close
end

# rescue بصيغة اللاحقة — للحالات البسيطة جداً
value = Integer(input) rescue 0
`.trim() },
    { t: 'warn', title: 'حذار من `rescue` اللاحقة', text: 'تلتقط **كل** `StandardError` دون تمييز، فقد تخفي أخطاءً لا علاقة لها بما توقّعت. استخدمها فقط حين يكون سطر التحويل بسيطاً وواضحاً — وفي شيفرة الإنتاج فضّل الصيغة الكاملة.' },

    { t: 'h2', text: 'رمي الأخطاء' },
    { t: 'code', lang: 'ruby', code: `
raise "رسالة"                       # RuntimeError
raise ArgumentError                 # بلا رسالة
raise ArgumentError, "العمر سالب"    # الشكل المعتاد
raise ArgumentError.new("العمر سالب")

# داخل rescue: أعد رمي الخطأ الحالي
rescue => e
  logger.error(e.message)
  raise                             # نفس الخطأ بنفس backtrace

# أو غلّفه بخطأ أوضح مع الحفاظ على السبب
rescue Net::OpenTimeout => e
  raise PaymentError, "تعذّر الوصول لبوّابة الدفع"
  # e يبقى متاحاً في e.cause تلقائياً
`.trim() },

    { t: 'h2', text: 'أخطاء مخصّصة' },
    { t: 'p', text: 'عرّف شجرة أخطاء لتطبيقك. الفائدة: يستطيع مستخدم شيفرتك التقاط فئة كاملة أو خطأً بعينه.' },
    { t: 'code', lang: 'ruby', code: `
module Payments
  class Error < StandardError; end

  class CardDeclined < Error
    attr_reader :code, :card_last4

    def initialize(code:, card_last4:)
      @code       = code
      @card_last4 = card_last4
      super("رُفضت البطاقة المنتهية بـ #{card_last4} (رمز #{code})")
    end

    def retryable? = %w[insufficient_funds try_again].include?(code)
  end

  class GatewayTimeout < Error
    def retryable? = true
  end

  class InvalidAmount < Error; end
end

# الاستخدام
begin
  charge(card, amount)
rescue Payments::CardDeclined => e
  if e.retryable?
    notify_user("حاول مرة أخرى")
  else
    notify_user("استخدم بطاقة أخرى")
  end
  audit_log(e.code, e.card_last4)
rescue Payments::Error => e          # يلتقط كل أخطاء الدفع
  alert_ops(e)
end
`.trim() },
    { t: 'tip', text: 'اجعل خطأك يحمل **بيانات** لا رسالة فقط. `e.code` و `e.retryable?` تسمحان بمعالجة ذكية، بينما تحليل نصّ الرسالة هشّ ويكسر عند أول تعديل.' },

    { t: 'h2', text: 'retry — إعادة المحاولة' },
    { t: 'code', lang: 'ruby', code: `
def fetch_with_retry(url, max: 3)
  attempts = 0

  begin
    attempts += 1
    HTTP.get(url)
  rescue Net::ReadTimeout, Errno::ECONNRESET => e
    if attempts < max
      sleep(2 ** attempts)          # تراجع أُسّي: 2، 4، 8 ثوانٍ
      retry
    end
    raise
  end
end
`.trim() },
    { t: 'danger', title: 'كل retry يحتاج عدّاداً', text: '`retry` بلا حدّ = حلقة لانهائية. وأعد المحاولة فقط على الأخطاء **العابرة** (مهلة، انقطاع شبكة). إعادة المحاولة على `ArgumentError` لن تنجح أبداً مهما كرّرت.' },

    { t: 'h2', text: 'ensure وتسريب الموارد' },
    { t: 'code', lang: 'ruby', code: `
# ✗ يسرّب الملف عند حدوث خطأ
file = File.open("data.txt")
process(file.read)
file.close                    # لا يُنفَّذ إن رمى process خطأ

# ✓ ensure يضمن الإغلاق
file = File.open("data.txt")
begin
  process(file.read)
ensure
  file.close
end

# ✓✓ الأفضل: الكتلة تغلق تلقائياً
File.open("data.txt") { |f| process(f.read) }
`.trim() },
    { t: 'warn', title: '`ensure` يبتلع القيم المُرجَعة', text: 'لا تكتب `return` أو `raise` داخل `ensure` — سيلغي الخطأ الأصلي أو القيمة المُرجَعة ويخفي المشكلة الحقيقية تماماً.' },

    { t: 'h2', text: 'قراءة الملفات' },
    { t: 'code', lang: 'ruby', code: `
# الملف كله كنصّ واحد
content = File.read("data.txt")

# كمصفوفة أسطر
lines = File.readlines("data.txt", chomp: true)

# ✅ سطراً سطراً — للملفات الضخمة
File.foreach("huge.log") do |line|
  puts line if line.include?("ERROR")
end

# مع كتلة — يغلق تلقائياً
File.open("data.txt", "r") do |f|
  f.each_line { |line| process(line) }
end
`.trim() },
    { t: 'danger', title: 'لا تقرأ ملفاً ضخماً كاملاً', text: '`File.read` على ملف بحجم 2 غيغابايت يحمّله كله في الذاكرة فينهار برنامجك. استخدم `File.foreach` أو `each_line` — تستهلك ذاكرة ثابتة مهما كان حجم الملف.' },
    { t: 'h3', text: 'الكتابة' },
    { t: 'code', lang: 'ruby', code: `
File.write("out.txt", "محتوى")              # يستبدل
File.write("log.txt", "سطر\\n", mode: "a")   # يُلحِق

File.open("report.txt", "w") do |f|
  f.puts "التقرير"
  f.puts "=" * 20
  data.each { |row| f.puts row.join(",") }
end
`.trim() },
    { t: 'table', head: ['الوضع', 'المعنى'], rows: [
      ['`"r"`', 'قراءة فقط (الافتراضي)'],
      ['`"w"`', 'كتابة — **يمسح المحتوى** أو ينشئ الملف'],
      ['`"a"`', 'إلحاق في النهاية'],
      ['`"r+"`', 'قراءة وكتابة من البداية'],
      ['`"w+"`', 'قراءة وكتابة مع المسح'],
      ['`"b"`', 'يُضاف للوضع للملفات الثنائية: `"rb"`']
    ]},
    { t: 'h3', text: 'المسارات والاختبارات' },
    { t: 'code', lang: 'ruby', code: `
File.exist?("data.txt")
File.file?("data.txt")
File.directory?("logs")
File.size("data.txt")            # بالبايت
File.extname("a/b/report.csv")   # => ".csv"
File.basename("a/b/report.csv")  # => "report.csv"
File.basename("a/b/report.csv", ".csv")  # => "report"
File.dirname("a/b/report.csv")   # => "a/b"
File.join("data", "2026", "x.csv")       # ✅ يعمل على كل الأنظمة
File.expand_path("~/data.txt")

Dir.glob("logs/**/*.log")        # بحث تعاودي
Dir.children("logs")
FileUtils.mkdir_p("out/reports") # ينشئ الشجرة كاملة
FileUtils.cp("a.txt", "b.txt")
FileUtils.rm_f("temp.txt")       # لا يخطئ إن لم يوجد
`.trim() },
    { t: 'tip', text: 'استخدم `File.join` لا الجمع بـ `"/"` — يستخدم الفاصل الصحيح لكل نظام تشغيل ويتجنّب الشرطات المزدوجة.' },
    { t: 'h3', text: 'أخطاء الملفات الشائعة' },
    { t: 'code', lang: 'ruby', code: `
begin
  data = File.read(path)
rescue Errno::ENOENT
  warn "الملف غير موجود: #{path}"
  data = ""
rescue Errno::EACCES
  warn "لا صلاحية للقراءة: #{path}"
  exit 1
rescue Errno::EISDIR
  warn "#{path} مجلّد لا ملف"
end
`.trim() },

    { t: 'h2', text: 'JSON' },
    { t: 'code', lang: 'ruby', code: `
require 'json'

# كائن ← نصّ
data = { name: "سارة", roles: ["admin"], active: true }
data.to_json                      # مضغوط
JSON.pretty_generate(data)        # منسّق للقراءة

# نصّ ← كائن
parsed = JSON.parse('{"name":"سارة"}')
parsed["name"]                    # مفاتيح نصّية

JSON.parse('{"name":"سارة"}', symbolize_names: true)
# => { name: "سارة" }             ← مفاتيح رموز

# من ملف وإليه
config = JSON.parse(File.read("config.json"), symbolize_names: true)
File.write("out.json", JSON.pretty_generate(config))

# التعامل مع JSON فاسد
begin
  JSON.parse(response.body)
rescue JSON::ParserError => e
  logger.error("استجابة غير صالحة: #{e.message}")
  {}
end
`.trim() },
    { t: 'note', text: '`symbolize_names: true` يحوّل المفاتيح إلى رموز فتكتب `data[:name]` بدل `data["name"]`. مريح، لكن **لا تستخدمه** مع JSON من مصدر غير موثوق: كل مفتاح جديد ينشئ رمزاً دائماً في الذاكرة (وإن كان Ruby الحديث يجمع الرموز الديناميكية).' },

    { t: 'h2', text: 'CSV' },
    { t: 'code', lang: 'ruby', code: `
require 'csv'

# القراءة مع رؤوس الأعمدة
CSV.foreach("sales.csv", headers: true) do |row|
  puts "#{row['product']}: #{row['total']}"
end

# كجدول قابل للاستعلام
table = CSV.read("sales.csv", headers: true)
table.by_col["total"].map(&:to_i).sum
table.select { |row| row["city"] == "الرياض" }

# مع تحويل الأنواع
CSV.foreach("sales.csv", headers: true, converters: :numeric) do |row|
  total = row["price"] * row["qty"]     # أعداد لا نصوص
end

# الكتابة
CSV.open("report.csv", "w", write_headers: true,
         headers: %w[المنتج الكمية الإجمالي]) do |csv|
  products.each { |p| csv << [p.name, p.qty, p.total] }
end

# تحليل نصّ CSV مباشرة
rows = CSV.parse("a,b\\n1,2", headers: true)
`.trim() },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'محلّل سجلّات مع تقرير',
      brief: 'اكتب أداة تقرأ ملف سجلّ ضخماً، تحلّله، وتنتج تقارير بصيغ متعدّدة — بمعالجة أخطاء متينة.',
      requirements: [
        'اقرأ ملف سجلّ نصّي بصيغة `[التاريخ] المستوى المسار زمن_الاستجابة الرسالة` سطراً سطراً بـ `File.foreach`.',
        'تجاهل السطور الفاسدة واحسبها، ولا تنهر البرنامج بسببها.',
        'عرّف خطأ `LogParseError` مخصّصاً يحمل رقم السطر ونصّه.',
        'أنتج إحصاءات: عدد كل مستوى، أبطأ خمسة مسارات، معدّل الأخطاء لكل ساعة.',
        'اكتب التقرير بثلاث صيغ: نصّية للطرفية، JSON، و CSV.',
        'استخدم `ensure` لضمان إغلاق كل الملفات المفتوحة.',
        'عالج غياب الملف وانعدام الصلاحية برسائل واضحة وأكواد خروج مناسبة.',
        'أضف وضع `--watch` يعيد التحليل كل خمس ثوانٍ (استخدم `retry` عند فشل مؤقّت).',
        'ولّد ملف سجلّ تجريبياً إن لم يوجد، ليعمل السكربت من أول تشغيل.'
      ],
      hints: [
        'تعبير نمطي واحد يلتقط كل الحقول: `/^\\[(.+?)\\] (\\w+) (\\S+) (\\d+)ms (.*)$/`.',
        '`Hash.new(0)` مثالي للعدّادات.',
        '`Time.parse` تحتاج `require "time"`.',
        '`ARGV.include?("--watch")` لقراءة وسائط سطر الأوامر.'
      ],
      solution: { lang: 'ruby', code: `
# frozen_string_literal: true
# log_analyzer.rb — محلّل سجلّات
require 'json'
require 'csv'
require 'time'
require 'fileutils'

# ===== الأخطاء =====
class AnalyzerError < StandardError; end

class LogParseError < AnalyzerError
  attr_reader :line_number, :raw

  def initialize(line_number:, raw:)
    @line_number = line_number
    @raw         = raw
    super("سطر #{line_number} غير قابل للتحليل: #{raw[0, 60]}…")
  end
end

# ===== المحلّل =====
class LogAnalyzer
  PATTERN = /^\\[(.+?)\\]\\s+(\\w+)\\s+(\\S+)\\s+(\\d+)ms\\s+(.*)$/
  LEVELS  = %w[DEBUG INFO WARN ERROR FATAL].freeze

  attr_reader :path, :entries, :malformed

  def initialize(path)
    @path      = path
    @entries   = []
    @malformed = []
  end

  def analyze!
    raise AnalyzerError, "الملف غير موجود: #{path}" unless File.exist?(path)
    raise AnalyzerError, "#{path} مجلّد لا ملف"      if File.directory?(path)

    @entries   = []
    @malformed = []

    File.foreach(path).with_index(1) do |line, number|
      line = line.strip
      next if line.empty? || line.start_with?("#")

      begin
        @entries << parse_line(line, number)
      rescue LogParseError => e
        @malformed << e
      end
    end

    self
  rescue Errno::EACCES
    raise AnalyzerError, "لا صلاحية لقراءة #{path}"
  rescue Errno::ENOENT
    raise AnalyzerError, "الملف اختفى أثناء القراءة: #{path}"
  end

  def stats
    {
      file:            path,
      generated_at:    Time.now.iso8601,
      total_lines:     entries.size + malformed.size,
      parsed:          entries.size,
      malformed:       malformed.size,
      by_level:        by_level,
      error_rate:      error_rate,
      avg_duration_ms: avg_duration,
      slowest_paths:   slowest_paths(5),
      errors_by_hour:  errors_by_hour,
      busiest_hour:    errors_by_hour.max_by { |_, v| v }&.first
    }
  end

  private

  def parse_line(line, number)
    match = PATTERN.match(line)
    raise LogParseError.new(line_number: number, raw: line) unless match

    timestamp, level, path, duration, message = match.captures
    raise LogParseError.new(line_number: number, raw: line) unless LEVELS.include?(level)

    {
      time:     safe_time(timestamp),
      level:,
      path:,
      duration: duration.to_i,
      message:
    }
  end

  def safe_time(string)
    Time.parse(string)
  rescue ArgumentError
    Time.now
  end

  def by_level
    entries.each_with_object(Hash.new(0)) { |e, h| h[e[:level]] += 1 }
           .sort_by { |level, _| LEVELS.index(level) }
           .to_h
  end

  def error_rate
    return 0.0 if entries.empty?
    errors = entries.count { |e| %w[ERROR FATAL].include?(e[:level]) }
    (errors.fdiv(entries.size) * 100).round(2)
  end

  def avg_duration
    return 0 if entries.empty?
    entries.sum { |e| e[:duration] }.fdiv(entries.size).round(1)
  end

  def slowest_paths(limit)
    entries.group_by { |e| e[:path] }
           .transform_values do |list|
             { calls: list.size, avg_ms: list.sum { |e| e[:duration] }.fdiv(list.size).round(1) }
           end
           .sort_by { |_, v| -v[:avg_ms] }
           .first(limit)
           .to_h
  end

  def errors_by_hour
    entries.select { |e| %w[ERROR FATAL].include?(e[:level]) }
           .each_with_object(Hash.new(0)) { |e, h| h[e[:time].strftime("%H:00")] += 1 }
           .sort.to_h
  end
end

# ===== المُصدِّرات =====
module Reporters
  module_function

  def text(stats, malformed)
    line = "─" * 58
    out  = []

    out << ""
    out << "╭#{line}╮"
    out << "│#{' 📊 تقرير تحليل السجلّات'.ljust(56)}│"
    out << "╰#{line}╯"
    out << ""
    out << "  الملف:            #{stats[:file]}"
    out << "  إجمالي السطور:    #{stats[:total_lines]}"
    out << "  حُلِّلت:            #{stats[:parsed]}"
    out << "  فاسدة:            #{stats[:malformed]}"
    out << "  معدّل الأخطاء:     #{stats[:error_rate]}٪"
    out << "  متوسّط الاستجابة:  #{stats[:avg_duration_ms]} مللي ثانية"
    out << ""
    out << "  ▸ حسب المستوى"
    stats[:by_level].each { |level, count| out << "    #{level.ljust(8)} #{count}" }

    out << ""
    out << "  ▸ أبطأ المسارات"
    stats[:slowest_paths].each do |path, info|
      out << "    #{path.ljust(28)} #{info[:avg_ms].to_s.rjust(8)} مللي · #{info[:calls]} طلب"
    end

    unless stats[:errors_by_hour].empty?
      out << ""
      out << "  ▸ الأخطاء حسب الساعة"
      max = stats[:errors_by_hour].values.max
      stats[:errors_by_hour].each do |hour, count|
        bar = "█" * ((count.fdiv(max) * 24).ceil)
        out << "    #{hour}  #{bar} #{count}"
      end
      out << ""
      out << "  ⚠️  أكثر ساعة أخطاءً: #{stats[:busiest_hour]}"
    end

    unless malformed.empty?
      out << ""
      out << "  ▸ أول خمسة سطور فاسدة"
      malformed.first(5).each { |e| out << "    #{e.message}" }
    end

    out << ""
    out.join("\\n")
  end

  def json(stats, path)
    File.write(path, JSON.pretty_generate(stats))
    path
  end

  def csv(stats, path)
    CSV.open(path, "w", write_headers: true,
             headers: %w[metric value]) do |csv|
      csv << ["file",            stats[:file]]
      csv << ["parsed",          stats[:parsed]]
      csv << ["malformed",       stats[:malformed]]
      csv << ["error_rate",      stats[:error_rate]]
      csv << ["avg_duration_ms", stats[:avg_duration_ms]]
      stats[:by_level].each      { |level, n| csv << ["level_#{level}", n] }
      stats[:slowest_paths].each { |p, info| csv << ["slow_#{p}", info[:avg_ms]] }
    end
    path
  end
end

# ===== توليد سجلّ تجريبي =====
def generate_sample(path)
  paths   = %w[/api/users /api/orders /api/products /login /health /api/reports]
  levels  = %w[INFO INFO INFO INFO DEBUG WARN ERROR ERROR FATAL]
  base    = Time.now - 6 * 3600

  FileUtils.mkdir_p(File.dirname(path))

  File.open(path, "w") do |f|
    f.puts "# سجلّ تجريبي وُلِّد في #{Time.now}"
    300.times do |i|
      time     = base + rand(6 * 3600)
      level    = levels.sample
      endpoint = paths.sample
      duration = endpoint == "/api/reports" ? rand(800..3000) : rand(5..400)
      f.puts "[#{time.strftime('%Y-%m-%d %H:%M:%S')}] #{level} #{endpoint} #{duration}ms طلب رقم #{i}"
    end
    5.times { |i| f.puts "سطر فاسد بلا بنية رقم #{i}" }
  end
end

# ===== التشغيل =====
LOG_PATH  = ARGV.find { |a| !a.start_with?("--") } || "logs/app.log"
WATCH     = ARGV.include?("--watch")
OUT_DIR   = "out"

generate_sample(LOG_PATH) unless File.exist?(LOG_PATH)
FileUtils.mkdir_p(OUT_DIR)

def run_once(path, out_dir)
  attempts = 0

  begin
    attempts += 1
    analyzer = LogAnalyzer.new(path).analyze!
    stats    = analyzer.stats

    puts Reporters.text(stats, analyzer.malformed)

    json_path = Reporters.json(stats, File.join(out_dir, "report.json"))
    csv_path  = Reporters.csv(stats,  File.join(out_dir, "report.csv"))
    puts "  💾 حُفِظ: #{json_path} و #{csv_path}"
    puts
    true
  rescue Errno::EAGAIN, Errno::EBUSY => e
    if attempts < 3
      sleep(2 ** attempts)
      retry
    end
    warn "❌ الملف مشغول بعد #{attempts} محاولات: #{e.message}"
    false
  rescue AnalyzerError => e
    warn "❌ #{e.message}"
    false
  rescue StandardError => e
    warn "💥 خطأ غير متوقّع: #{e.class} — #{e.message}"
    warn e.backtrace.first(3).join("\\n")
    false
  end
end

if WATCH
  puts "👀 وضع المراقبة — كل 5 ثوانٍ (Ctrl+C للإيقاف)"
  begin
    loop do
      system("clear") || system("cls")
      run_once(LOG_PATH, OUT_DIR)
      sleep 5
    end
  rescue Interrupt
    puts "\\n👋 توقّفت المراقبة."
  end
else
  ok = run_once(LOG_PATH, OUT_DIR)
  exit(ok ? 0 : 1)
end
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'لماذا لا نلتقط `Exception`؟', options: ['بطيء', 'يلتقط SystemExit و SignalException فيمنع Ctrl+C وإنهاء البرنامج', 'غير مسموح', 'لا فرق'], answer: 1,
        explain: '`rescue` بلا نوع يلتقط `StandardError` فقط، وهذا هو السلوك الصحيح.' },
      { q: 'متى يُنفَّذ `ensure`؟', options: ['عند النجاح', 'دائماً — نجح أو فشل، وحتى مع `return` أو `raise`', 'عند الفشل', 'إن لم يقع خطأ'], answer: 1,
        explain: 'ولهذا هو المكان الصحيح لإغلاق الموارد. `else` هو الذي يُنفَّذ عند عدم وقوع خطأ.' },
      { q: 'ما شرط استخدام `retry` بأمان؟', options: ['لا شروط', 'عدّاد يحدّ المحاولات، وأن يكون الخطأ عابراً لا منطقياً', 'أن يكون داخل حلقة', 'مع ensure'], answer: 1,
        explain: '`retry` بلا حدّ = حلقة لانهائية، وإعادة المحاولة على `ArgumentError` لن تنجح أبداً.' },
      { q: 'كيف تقرأ ملفاً بحجم 3 غيغابايت؟', options: ['`File.read`', '`File.foreach` أو `each_line` — ذاكرة ثابتة مهما كان الحجم', '`File.readlines`', 'تقسيمه يدوياً'], answer: 1,
        explain: '`File.read` يحمّل الملف كله في الذاكرة فينهار البرنامج.' },
      { q: 'ما ميزة الخطأ المخصّص الذي يحمل بيانات مثل `e.code`؟', options: ['أسرع', 'يسمح بمعالجة ذكية بدل تحليل نصّ الرسالة الهشّ', 'أقصر', 'إلزامي'], answer: 1,
        explain: 'وشجرة أخطاء مثل `Payments::Error` تسمح بالتقاط فئة كاملة أو خطأ بعينه.' },
      { q: 'ما خطر `value = risky rescue nil`؟', options: ['بطيء', 'يلتقط كل StandardError دون تمييز فيخفي أخطاءً غير متوقّعة', 'خطأ صياغي', 'لا خطر'], answer: 1,
        explain: 'استخدمه فقط في التحويلات البسيطة الواضحة، وفضّل الصيغة الكاملة في الإنتاج.' },
      { q: 'لماذا `File.join("a", "b")` أفضل من `"a" + "/" + "b"`؟', options: ['أقصر', 'يستخدم الفاصل الصحيح لكل نظام ويتجنّب الشرطات المزدوجة', 'أسرع', 'لا فرق'], answer: 1,
        explain: 'ويعمل بشكل صحيح مع المسارات القادمة من مصادر مختلفة.' }
    ]}
  ]
};
