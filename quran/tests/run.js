/*
 * فحوص التطبيق — تعمل بـ Node مباشرة بلا أي حزم خارجية:
 *   node quran/tests/run.js
 */
'use strict';

const path = require('path');

// ملفات المتصفح تعلّق نفسها على window، فنوفّر بديلاً بسيطاً
global.window = {};
require(path.join(__dirname, '../data/quran-data.js'));
require(path.join(__dirname, '../js/search.js'));

const DATA = global.window.QURAN_DATA;
const S = global.window.QuranSearch;

let failed = 0;

function check(label, condition, extra) {
  if (condition) {
    console.log('  ✓ ' + label);
  } else {
    failed++;
    console.log('  ✗ ' + label + (extra ? ' — ' + extra : ''));
  }
}

function group(title) {
  console.log('\n' + title);
}

/* ===== سلامة البيانات ===== */

group('بيانات المصحف');

check('١١٤ سورة', DATA.surahs.length === 114);
check(
  'مجموع الآيات ٦٢٣٦',
  DATA.surahs.reduce((sum, s) => sum + s.verses.length, 0) === 6236
);
check(
  'أرقام السور متسلسلة',
  DATA.surahs.every((s, i) => s.n === i + 1)
);
check(
  'لا توجد آية فارغة',
  DATA.surahs.every((s) => s.verses.every((v) => typeof v === 'string' && v.trim().length > 0))
);
check(
  'نوع كل سورة مكية أو مدنية',
  DATA.surahs.every((s) => s.type === 'مكية' || s.type === 'مدنية')
);

// عدد آيات سور مختارة، مرجع مستقل للتحقق من صحة النص
const EXPECTED_COUNTS = { 1: 7, 2: 286, 9: 129, 18: 110, 36: 83, 55: 78, 112: 4, 114: 6 };
check(
  'عدد آيات سور مختارة مطابق',
  Object.keys(EXPECTED_COUNTS).every((n) => DATA.surahs[n - 1].verses.length === EXPECTED_COUNTS[n])
);

// نقارن بعد التطبيع حتى لا يتأثر الفحص باختلاف ترتيب علامات التشكيل
const startsWithBasmala = (text) => S.normalize(text).indexOf('بسم الله') === 0;
check('الفاتحة تبدأ بالبسملة', startsWithBasmala(DATA.surahs[0].verses[0]));
check('التوبة لا تبدأ بالبسملة', !startsWithBasmala(DATA.surahs[8].verses[0]));
check(
  'البسملة ليست جزءاً من أول آية في بقية السور',
  DATA.surahs.slice(1).every((s) => !startsWithBasmala(s.verses[0]))
);

/* ===== الأجزاء ===== */

group('الأجزاء');

check('٣٠ جزءاً', DATA.juz.length === 30);
check('الجزء الأول يبدأ من الفاتحة ١', DATA.juz[0].surah === 1 && DATA.juz[0].ayah === 1);
check('الجزء الثلاثون يبدأ من النبأ ١', DATA.juz[29].surah === 78 && DATA.juz[29].ayah === 1);
check(
  'بدايات الأجزاء مرتّبة تصاعدياً',
  DATA.juz.every((j, i) => {
    if (i === 0) return true;
    const prev = DATA.juz[i - 1];
    return j.surah > prev.surah || (j.surah === prev.surah && j.ayah > prev.ayah);
  })
);
check(
  'كل بداية جزء آية موجودة فعلاً',
  DATA.juz.every((j) => j.ayah >= 1 && j.ayah <= DATA.surahs[j.surah - 1].verses.length)
);

/* ===== التطبيع والبحث ===== */

group('تطبيع النص');

check('حذف التشكيل', S.normalize('ٱلۡحَمۡدُ') === 'الحمد');
check('توحيد الهمزات', S.normalize('أإآٱ') === 'اااا');
check('التاء المربوطة هاءً', S.normalize('رحمة') === 'رحمه');
check('الألف المقصورة ياءً', S.normalize('على') === 'علي');
check('حذف التطويل', S.normalize('الرحـــمن') === 'الرحمن');
check('الألف الخنجرية تُحذف في الصيغة (ب)', S.normalize('ٱلرَّحۡمَٰنِ', 'b') === 'الرحمن');
check('الألف الخنجرية تُظهر ألفاً في الصيغة (أ)', S.normalize('ٱلرَّحۡمَٰنِ', 'a') === 'الرحمان');

group('البحث في النص');

const q1 = S.searchText('الحمد لله رب العالمين', 10);
check('«الحمد لله رب العالمين» يجد نتائج', q1.total >= 5, q1.total + ' نتيجة');
check('أول نتيجة هي الفاتحة ٢', q1.results[0].surah === 1 && q1.results[0].ayah === 2);
check(
  'موضع التمييز يطابق النص الأصلي بتشكيله',
  q1.results[0].text.slice(q1.results[0].start, q1.results[0].end) ===
    DATA.surahs[0].verses[1]
);

const q2 = S.searchText('الرحمن الرحيم', 10);
check('«الرحمن الرحيم» (بلا ألف) يجد نتائج', q2.total >= 5, q2.total + ' نتيجة');

const q3 = S.searchText('الله لا اله الا هو الحي القيوم', 5);
check('آية الكرسي بالكتابة الإملائية', q3.results.some((r) => r.surah === 2 && r.ayah === 255));

const q4 = S.searchText('إن الله على كل شيء قدير', 20);
check('«إن الله على كل شيء قدير» يجد نتائج', q4.total >= 5, q4.total + ' نتيجة');

check('الاستعلام القصير لا يُرجع شيئاً', S.searchText('ا', 10).total === 0);
check('نص غير موجود لا يُرجع نتائج', S.searchText('زقنبوتيات', 10).total === 0);
check(
  'الحد الأقصى للنتائج محترم',
  (() => {
    const r = S.searchText('الله', 5);
    return r.results.length === 5 && r.total > 5;
  })()
);

group('تحليل المراجع');

check('«2:255»', JSON.stringify(S.parseReference('2:255')) === JSON.stringify({ surah: 2, ayah: 255 }));
check('«٢:٢٥٥» بأرقام عربية', JSON.stringify(S.parseReference('٢:٢٥٥')) === JSON.stringify({ surah: 2, ayah: 255 }));
check('«18 10» بمسافة', JSON.stringify(S.parseReference('18 10')) === JSON.stringify({ surah: 18, ayah: 10 }));
check('«الكهف 10»', JSON.stringify(S.parseReference('الكهف 10')) === JSON.stringify({ surah: 18, ayah: 10 }));
check('«سورة الفاتحة»', JSON.stringify(S.parseReference('سورة الفاتحة')) === JSON.stringify({ surah: 1, ayah: 1 }));
check('«فاتحة» بلا أل التعريف', JSON.stringify(S.parseReference('فاتحة')) === JSON.stringify({ surah: 1, ayah: 1 }));
check('«112» رقم سورة', JSON.stringify(S.parseReference('112')) === JSON.stringify({ surah: 112, ayah: 1 }));
check('«2:9999» آية غير موجودة', S.parseReference('2:9999') === null);
check('«200» سورة غير موجودة', S.parseReference('200') === null);
check('نص عادي ليس مرجعاً', S.parseReference('الحمد لله') === null);

group('البحث في أسماء السور');

check('«البق» يقترح البقرة', S.matchSurahs('البق').indexOf(2) === 0);
check('«ناس» يقترح الناس', S.matchSurahs('ناس').indexOf(114) >= 0);
check('اسم غير موجود لا يقترح شيئاً', S.matchSurahs('زقنبوت').length === 0);

group('تحويل الأرقام');

check('١٢٣ ← عربية', S.toArabicDigits(123) === '١٢٣');
check('٢٥٥ ← لاتينية', S.toLatinDigits('٢٥٥') === '255');

console.log(
  '\n' + (failed ? '✗ فشل ' + failed + ' فحصاً' : '✓ نجحت كل الفحوص')
);
process.exit(failed ? 1 : 0);
