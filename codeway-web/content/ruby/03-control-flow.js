'use strict';

module.exports = {
  slug: '03-control-flow',
  title: 'الشروط والتكرار',
  summary: 'if و unless و case/in، والحلقات بأسلوب Ruby: times و each و loop، ومتى تتخلّى عن for نهائياً.',
  duration: 50,
  level: 'مبتدئ',
  tags: ['شروط', 'حلقات', 'case'],
  objectives: [
    'تكتب شروطاً بصيغة Ruby الاصطلاحية بما فيها صيغة اللاحقة.',
    'تستخدم `unless` في موضعه الصحيح وتتجنّب إساءة استخدامه.',
    'تتقن `case` بكل أشكاله بما فيها مطابقة الأنماط `case/in`.',
    'تختار الحلقة المناسبة وتفهم لماذا لا يستخدم أحد `for` في Ruby.',
    'تتحكّم بمسار الحلقة عبر `next` و `break` و `redo`.',
    'تستخدم عوامل `&&=` و `||=` و العامل الثلاثي بوعي.'
  ],
  quickRef: [
    { code: 'if / elsif / else / end', desc: 'شرط كامل' },
    { code: 'puts x if cond', desc: 'صيغة اللاحقة' },
    { code: 'unless cond', desc: 'إن لم' },
    { code: 'case x when …', desc: 'تفريع' },
    { code: 'case x in …', desc: 'مطابقة أنماط' },
    { code: '5.times { }', desc: 'كرّر 5 مرات' },
    { code: '(1..10).each { }', desc: 'مرّ على مدى' },
    { code: 'next / break', desc: 'تخطّى / اخرج' }
  ],
  blocks: [
    { t: 'h2', text: 'الشرط تعبير له قيمة' },
    { t: 'p', text: 'في Ruby `if` ليس جملة بل **تعبير يُرجع قيمة**. هذا يغيّر أسلوب الكتابة كثيراً.' },
    { t: 'code', lang: 'ruby', code: `
score = 85

# الأسلوب المألوف
if score >= 90
  grade = "ممتاز"
elsif score >= 80
  grade = "جيد جداً"
elsif score >= 60
  grade = "مقبول"
else
  grade = "راسب"
end

# أسلوب Ruby — الشرط نفسه يُرجع القيمة
grade =
  if    score >= 90 then "ممتاز"
  elsif score >= 80 then "جيد جداً"
  elsif score >= 60 then "مقبول"
  else                   "راسب"
  end
`.trim() },
    { t: 'note', text: 'لاحظ أن الاسم `grade` كُتب مرة واحدة بدل أربع. هذا ليس تجميلاً فقط: نسيان أحد الفروع في الأسلوب الأول يترك `grade` مساوياً لـ `nil` بصمت، بينما الأسلوب الثاني يجعل النقص واضحاً.' },

    { t: 'h2', text: 'صيغة اللاحقة (Modifier)' },
    { t: 'p', text: 'لو كان الجسم سطراً واحداً، اكتب الشرط بعده. تُقرأ كجملة إنجليزية.' },
    { t: 'code', lang: 'ruby', code: `
puts "مرحباً" if logged_in?
raise "مبلغ غير صالح" unless amount.positive?
return [] if items.empty?

# مثالية لـ «الحرّاس» في بداية الدالة
def process(order)
  return :empty    if order.items.empty?
  return :unpaid   unless order.paid?
  return :expired  if order.expired?

  # المنطق الفعلي هنا، بلا تداخل
  ship(order)
end
`.trim() },
    { t: 'compare', lang: 'ruby', bad: {
      code: `def process(order)
  if !order.items.empty?
    if order.paid?
      if !order.expired?
        ship(order)
      else
        :expired
      end
    else
      :unpaid
    end
  else
    :empty
  end
end`,
      why: 'تداخل بأربعة مستويات — يُسمّى «هرم الهلاك». المنطق الفعلي مدفون في العمق.'
    }, good: {
      code: `def process(order)
  return :empty   if order.items.empty?
  return :unpaid  unless order.paid?
  return :expired if order.expired?

  ship(order)
end`,
      why: 'الحرّاس يخرجون مبكّراً، فيبقى المسار الطبيعي في المستوى الأول واضحاً.'
    }},
    { t: 'warn', title: 'حدّ الاستخدام', text: 'صيغة اللاحقة للأسطر **القصيرة** فقط. إن تجاوز السطر ~80 حرفاً أو احتاج الجسم أكثر من عبارة، عد للصيغة الكاملة.' },

    { t: 'h2', text: 'unless' },
    { t: 'p', text: '`unless x` تعني `if !x`. تستخدمها حين يكون النفي هو **الحالة الطبيعية** في الجملة.' },
    { t: 'code', lang: 'ruby', code: `
unless user.admin?
  redirect_to root_path
end

# أوضح بصيغة اللاحقة
redirect_to root_path unless user.admin?
`.trim() },
    { t: 'danger', title: 'ثلاث حالات لا تستخدم فيها unless', text: '**(1)** مع `else` — `unless … else` لغز ذهني. **(2)** مع شرط منفيّ — `unless !x` نفي مزدوج. **(3)** مع شرط مركّب — `unless a && b` يصعب فكّه ذهنياً. في هذه الحالات الثلاث استخدم `if`.' },
    { t: 'code', lang: 'ruby', code: `
# ✗ سيئ
unless !list.empty?      then puts "فارغة" end
unless user.admin? && user.active? then deny end
unless ok then a else b end

# ✓ جيد
if list.empty?           then puts "فارغة" end
if !(user.admin? && user.active?) then deny end
if ok then b else a end
`.trim() },

    { t: 'h2', text: 'العوامل المنطقية والمقارنة' },
    { t: 'code', lang: 'ruby', code: `
5 == 5      # => true    مساواة قيمة
5 != 3      # => true
5 <=> 3     # => 1       عامل «المركبة الفضائية»: -1 / 0 / 1
5.eql?(5.0) # => false   يقارن النوع أيضاً
5.equal?(5) # => true    نفس الكائن بالضبط

a && b      # و
a || b      # أو
!a          # ليس

# and / or لهما أولوية أدنى — للتحكّم بالتدفّق لا للشروط
do_something or raise "فشل"
`.trim() },
    { t: 'tip', text: 'استخدم `&&` و `||` في الشروط دائماً، واحفظ `and` و `or` لسطور التحكّم مثل `x = compute or raise`. الخلط بينهما بسبب اختلاف الأولوية مصدر أخطاء خفية.' },
    { t: 'h3', text: 'الإسناد الشرطي' },
    { t: 'code', lang: 'ruby', code: `
name ||= "زائر"      # أسند إن كانت nil أو false
count &&= count + 1  # زد فقط إن لم تكن nil

# مفيد جداً للتخزين المؤقّت
def expensive_result
  @result ||= perform_heavy_calculation
end

# العامل الثلاثي — لتعبير قصير فقط
status = age >= 18 ? "بالغ" : "قاصر"
`.trim() },
    { t: 'warn', title: 'انتبه لـ `||=` مع القيم الكاذبة', text: '`x ||= true` لن يعمل كما تتوقّع إن كانت `x` تساوي `false` — سيُعاد إسنادها. حين تكون `false` قيمة مشروعة استخدم `x = true if x.nil?`.' },

    { t: 'h2', text: 'case — التفريع الذكي' },
    { t: 'p', text: '`case` في Ruby أقوى بكثير من `switch` في اللغات الأخرى، لأنه يستخدم العامل `===` الذي يعني «هل ينطبق عليه» لا «هل يساويه».' },
    { t: 'code', lang: 'ruby', code: `
def describe(x)
  case x
  when Integer      then "عدد صحيح"           # فحص نوع
  when 1..10        then "في المدى 1–10"       # فحص مدى
  when /^\\d+$/      then "نصّ رقمي"            # تعبير نمطي
  when "نعم", "أجل" then "موافقة"              # قيم متعدّدة
  when ->(v) { v.respond_to?(:each) } then "قابل للتكرار"  # دالة مجهولة
  when nil          then "لا شيء"
  else                   "غير معروف"
  end
end
`.trim() },
    { t: 'code', lang: 'ruby', code: `
# case بلا موضوع — بديل أنيق لـ if/elsif الطويل
grade =
  case
  when score >= 90 then "ممتاز"
  when score >= 80 then "جيد جداً"
  when score >= 60 then "مقبول"
  else                  "راسب"
  end
`.trim() },
    { t: 'note', text: 'خلافاً لـ C و Java، لا حاجة لـ `break` في Ruby — لا يوجد «تسرّب» بين الفروع.' },

    { t: 'h2', text: 'مطابقة الأنماط — case/in' },
    { t: 'p', text: 'أُضيفت في Ruby 3.0 وهي من أقوى مزايا اللغة الحديثة: تفكّك البنى المعقّدة وتربط قيمها بمتغيّرات في خطوة واحدة.' },
    { t: 'code', lang: 'ruby', code: `
response = { status: 200, body: { user: { name: "سارة", role: "admin" } } }

case response
in { status: 200, body: { user: { name: String => name, role: "admin" } } }
  puts "أهلاً بالمشرفة #{name}"

in { status: 200, body: { user: { name: String => name } } }
  puts "أهلاً #{name}"

in { status: 404 }
  puts "غير موجود"

in { status: Integer => code } if code >= 500
  puts "خطأ خادم #{code}"

else
  puts "استجابة غير متوقّعة"
end
`.trim() },
    { t: 'code', lang: 'ruby', code: `
# مع المصفوفات
case [1, 2, 3, 4, 5]
in [first, *rest]
  puts "الأول #{first}، والباقي #{rest.size} عنصراً"
end

# مع القيم المرجعية
expected = 200
case status
in ^expected then puts "كما توقّعنا"
end
`.trim() },
    { t: 'tip', text: 'مطابقة الأنماط ممتازة لتحليل استجابات JSON من واجهات برمجية. بدل عشرات الاختبارات المتداخلة، تصف الشكل المتوقّع مرة واحدة.' },

    { t: 'h2', text: 'الحلقات بأسلوب Ruby' },
    { t: 'danger', title: 'لا تستخدم `for` في Ruby', text: 'موجودة في اللغة لكن **لا أحد يستخدمها**، ولها عيب حقيقي: متغيّر العدّاد يتسرّب خارج الحلقة. استخدم `each` دائماً.' },
    { t: 'compare', lang: 'ruby', bad: {
      code: `for i in 1..5
  puts i
end
puts i    # => 5  ← تسرّب! المتغيّر ما زال موجوداً

for item in items
  puts item
end`,
      why: '`for` لا تنشئ نطاقاً جديداً، فيتسرّب `i` ويصطدم بمتغيّرات أخرى.'
    }, good: {
      code: `(1..5).each { |i| puts i }
puts i    # ✗ NameError  ← لا تسرّب، وهذا مطلوب

items.each { |item| puts item }`,
      why: 'الكتلة تنشئ نطاقاً خاصاً بها، وهذا أسلوب Ruby المتّبع في كل الشيفرة الحقيقية.'
    }},
    { t: 'h3', text: 'أشكال التكرار' },
    { t: 'code', lang: 'ruby', code: `
# عدد ثابت من المرات
3.times { puts "مرحباً" }
3.times { |i| puts "التكرار #{i}" }      # 0, 1, 2

# مدى
(1..5).each   { |n| print n }            # 12345
(1...5).each  { |n| print n }            # 1234   ← حصري
1.upto(5)     { |n| print n }            # 12345
5.downto(1)   { |n| print n }            # 54321
1.step(10, 3) { |n| print n, " " }       # 1 4 7 10

# مجموعة
%w[أحمد سارة خالد].each { |name| puts name }
{ a: 1, b: 2 }.each { |key, value| puts "#{key}=#{value}" }

# مع الفهرس
%w[أ ب ج].each_with_index { |ch, i| puts "#{i}: #{ch}" }

# شرطية
i = 0
while i < 5
  i += 1
end

until queue.empty?
  process(queue.shift)
end

# لانهائية مع خروج صريح
loop do
  input = gets.chomp
  break if input == "خروج"
  puts "أدخلت: #{input}"
end
`.trim() },
    { t: 'table', head: ['تريد أن…', 'استخدم'], rows: [
      ['تكرّر عدداً معروفاً من المرات', '`n.times`'],
      ['تمرّ على عناصر مجموعة', '`each`'],
      ['تبني مجموعة جديدة من القديمة', '`map` (الدرس الخامس)'],
      ['تكرّر حتى يتحقّق شرط', '`while` / `until`'],
      ['تكرّر بلا حدّ معروف', '`loop do … break`'],
      ['تعدّ تنازلياً', '`n.downto(m)`'],
      ['تقفز بخطوة', '`start.step(stop, by)`']
    ]},

    { t: 'h2', text: 'التحكّم بمسار الحلقة' },
    { t: 'code', lang: 'ruby', code: `
(1..10).each do |n|
  next if n.odd?        # تخطّى هذا التكرار وأكمل
  break if n > 8        # اخرج من الحلقة كلياً
  puts n                # 2, 4, 6, 8
end

# break تستطيع إرجاع قيمة
found = [3, 7, 12, 5].each do |n|
  break n if n > 10
end
found   # => 12

# التداخل: break تخرج من الحلقة الداخلية فقط
(1..3).each do |i|
  (1..3).each do |j|
    break if j == 2
    print "#{i}#{j} "
  end
end
# 11 21 31
`.trim() },
    { t: 'tip', text: 'للخروج من حلقات متداخلة دفعة واحدة، استخدم `throw`/`catch` أو — أفضل — انقل الحلقة الداخلية إلى دالة مستقلة تستخدم `return`.' },

    { t: 'h2', text: 'الحلقة اللانهائية بأمان' },
    { t: 'code', lang: 'ruby', code: `
MAX_ATTEMPTS = 5
attempts = 0

loop do
  attempts += 1
  result = try_connect

  break result if result
  raise "فشل الاتصال بعد #{MAX_ATTEMPTS} محاولات" if attempts >= MAX_ATTEMPTS

  sleep(2 ** attempts)   # تراجع أُسّي
end
`.trim() },
    { t: 'warn', title: 'كل حلقة لانهائية تحتاج مخرجين', text: 'مخرج النجاح ومخرج الفشل. لو نسيت الثاني فسيعلق برنامجك للأبد عند أول حالة غير متوقّعة.' },

    { t: 'h2', text: 'تمرين' },
    { t: 'exercise',
      title: 'لعبة تخمين الرقم',
      brief: 'اكتب لعبة كاملة تجمع كل ما تعلّمته في هذا الدرس.',
      requirements: [
        'يختار البرنامج رقماً عشوائياً بين 1 و 100.',
        'يطلب من اللاعب التخمين ويخبره «أكبر» أو «أصغر».',
        'يحدّ المحاولات بعشر محاولات، ويعرض المتبقّي بعد كل تخمين.',
        'يقبل الأمر `تلميح` فيخبر اللاعب إن كان الرقم زوجياً أو فردياً (يستهلك محاولة).',
        'يقبل الأمر `خروج` لإنهاء اللعبة فوراً.',
        'يتجاهل المدخلات غير الرقمية دون استهلاك محاولة، ودون أن ينهار.',
        'عند الفوز يعرض رتبة حسب عدد المحاولات باستخدام `case`.',
        'يسأل في النهاية عن إعادة اللعب، ويكرّر إن وافق اللاعب.'
      ],
      hints: [
        '`rand(1..100)` يولّد رقماً عشوائياً ضمن المدى.',
        'استخدم `loop do` مع `break` للحلقة الرئيسية.',
        '`next` تتخطّى التكرار دون احتساب محاولة.',
        'استخدم `case` بلا موضوع لتحديد الرتبة.'
      ],
      solution: { lang: 'ruby', code: `
# frozen_string_literal: true
# guess.rb — لعبة تخمين الرقم

MAX_ATTEMPTS = 10
RANGE        = (1..100)

def rank_for(attempts)
  case
  when attempts <= 3 then "🏆 أسطوري"
  when attempts <= 5 then "🥇 ممتاز"
  when attempts <= 7 then "🥈 جيد"
  else                    "🥉 نجحت بالكاد"
  end
end

def play_round
  secret   = rand(RANGE)
  attempts = 0

  puts "\\n🎯 خمّن رقماً بين #{RANGE.first} و #{RANGE.last} — لديك #{MAX_ATTEMPTS} محاولات."
  puts "   اكتب «تلميح» لتلميح (يستهلك محاولة) أو «خروج» للإنهاء.\\n\\n"

  loop do
    remaining = MAX_ATTEMPTS - attempts

    if remaining.zero?
      puts "💀 انتهت المحاولات! الرقم كان #{secret}."
      return false
    end

    print "المحاولة #{attempts + 1}/#{MAX_ATTEMPTS} (متبقٍّ #{remaining}) ← "
    input = gets.chomp.strip

    case input
    when "خروج"
      puts "👋 إلى اللقاء! الرقم كان #{secret}."
      exit
    when "تلميح"
      attempts += 1
      puts "  💡 الرقم #{secret.even? ? 'زوجي' : 'فردي'}."
      next
    end

    guess =
      begin
        Integer(input)
      rescue ArgumentError
        puts "  ⚠️  اكتب رقماً صحيحاً — لم تُحتسب محاولة."
        next
      end

    unless RANGE.cover?(guess)
      puts "  ⚠️  خارج المدى — لم تُحتسب محاولة."
      next
    end

    attempts += 1

    case guess <=> secret
    when -1 then puts "  ⬆️  أكبر من ذلك."
    when  1 then puts "  ⬇️  أصغر من ذلك."
    when  0
      puts "\\n🎉 أحسنت! الرقم هو #{secret}."
      puts "   عدد المحاولات: #{attempts} — رتبتك: #{rank_for(attempts)}"
      return true
    end
  end
end

# ===== الحلقة الرئيسية =====
wins = 0
games = 0

loop do
  games += 1
  wins += 1 if play_round

  print "\\nهل تريد اللعب مجدداً؟ (نعم/لا) "
  answer = gets.chomp.strip
  break unless %w[نعم ن y yes].include?(answer.downcase)
end

puts "\\n📊 لعبت #{games} جولة وفزت بـ #{wins} منها. شكراً للعب!"
`.trim() }
    },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'لماذا يتجنّب مبرمجو Ruby حلقة `for`؟', options: ['بطيئة', 'لأنها لا تنشئ نطاقاً جديداً فيتسرّب متغيّر العدّاد خارجها', 'محذوفة من اللغة', 'لا تعمل مع المصفوفات'], answer: 1,
        explain: '`each` تستخدم كتلة لها نطاقها الخاص، وهي الأسلوب المتّبع في كل شيفرة Ruby حقيقية.' },
      { q: 'متى لا يجب استخدام `unless`؟', options: ['أبداً', 'مع `else`، أو مع شرط منفيّ، أو مع شرط مركّب', 'مع الأعداد', 'في الحلقات'], answer: 1,
        explain: 'في هذه الحالات الثلاث يصبح النفي المزدوج أو المركّب لغزاً ذهنياً — استخدم `if`.' },
      { q: 'ما الذي يميّز `case` في Ruby عن `switch` في لغات أخرى؟', options: ['أسرع', 'يستخدم `===` فيقارن بالأنواع والمدايات والتعابير النمطية لا بالمساواة فقط', 'يحتاج break', 'يقبل عدداً واحداً'], answer: 1,
        explain: 'ولهذا يمكنك كتابة `when Integer` أو `when 1..10` أو `when /regex/`.' },
      { q: 'ما فائدة `case/in` (مطابقة الأنماط)؟', options: ['أسرع من case', 'تطابق بنية معقّدة وتربط قيمها بمتغيّرات في خطوة واحدة', 'تعمل مع الأعداد فقط', 'بديل عن الحلقات'], answer: 1,
        explain: 'أُضيفت في Ruby 3.0 وهي مثالية لتحليل استجابات JSON المتداخلة.' },
      { q: 'ماذا تفعل `next` داخل حلقة؟', options: ['تخرج من الحلقة', 'تتخطّى بقيّة التكرار الحالي وتنتقل للتالي', 'تعيد التكرار نفسه', 'ترمي خطأ'], answer: 1,
        explain: '`break` هي التي تخرج من الحلقة كلياً، و`next` تتخطّى تكراراً واحداً.' },
      { q: 'ما معنى `name ||= "زائر"`؟', options: ['أسند دائماً', 'أسند القيمة فقط إن كانت `name` تساوي nil أو false', 'قارن', 'احذف'], answer: 1,
        explain: 'اختصار شائع للقيم الافتراضية والتخزين المؤقّت `@cache ||= compute`.' },
      { q: 'لماذا نستخدم الحرّاس (`return … if`) في بداية الدالة؟', options: ['أسرع', 'لتجنّب التداخل العميق وإبقاء المنطق الأساسي في المستوى الأول', 'إلزامي', 'لتقليل الذاكرة'], answer: 1,
        explain: 'يُسمّى النمط المضادّ الذي يعالجه «هرم الهلاك» — تداخل شروط بعدة مستويات.' }
    ]}
  ]
};
