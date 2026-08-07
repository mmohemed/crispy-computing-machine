/* البحث: تطبيع النص العربي، فهرس الآيات، وتحليل المراجع مثل ٢:٢٥٥ */
(function () {
  'use strict';

  var ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

  var DAGGER_ALIF = 0x0670;

  /*
   * الرسم العثماني يكتب بعض الألفات ألفاً خنجرية (ٰ)، وهي في الإملاء المعاصر
   * تُكتب ألفاً أحياناً (ٱلۡعَٰلَمِينَ ← العالمين) وتُحذف أحياناً (ٱلرَّحۡمَٰن ← الرحمن).
   * لذلك نبني صيغتين للنص: «a» تُظهر الألف الخنجرية ألفاً، و«b» تحذفها.
   */
  function isRemovable(code, mode) {
    if (code === DAGGER_ALIF) return mode === 'b';
    return (
      (code >= 0x0610 && code <= 0x061a) || // علامات قرآنية
      (code >= 0x064b && code <= 0x065f) || // الحركات والتنوين والمدّة
      (code >= 0x06d6 && code <= 0x06ed) || // علامات الوقف والسكون الصغير
      code === 0x0640 // التطويل
    );
  }

  var LETTER_MAP = {
    'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ٰ': 'ا',
    'ى': 'ي', 'ئ': 'ي',
    'ؤ': 'و',
    'ة': 'ه'
  };

  /* يحوّل الأرقام العربية-الهندية إلى أرقام لاتينية */
  function toLatinDigits(text) {
    return text.replace(/[٠-٩]/g, function (d) {
      return String(ARABIC_DIGITS.indexOf(d));
    });
  }

  /* يحوّل الأرقام اللاتينية إلى أرقام عربية-هندية للعرض */
  function toArabicDigits(value) {
    return String(value).replace(/\d/g, function (d) {
      return ARABIC_DIGITS[Number(d)];
    });
  }

  /* النص المطبَّع: بلا تشكيل، وبألف/ياء/هاء موحّدة */
  function normalize(text, mode) {
    var out = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (isRemovable(ch.charCodeAt(0), mode || 'b')) continue;
      out += LETTER_MAP[ch] || ch;
    }
    return out.replace(/\s+/g, ' ').trim();
  }

  /* خريطة من مواضع النص المطبَّع إلى مواضع النص الأصلي (تُبنى عند الحاجة فقط) */
  function buildIndexMap(text, mode) {
    var map = [];
    var spaceIdx = -1;
    var started = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (isRemovable(ch.charCodeAt(0), mode)) continue;
      if (/\s/.test(ch)) {
        if (started && spaceIdx < 0) spaceIdx = i;
        continue;
      }
      if (spaceIdx >= 0) {
        map.push(spaceIdx); // المسافة المدمجة تقابل أول فراغ في الأصل
        spaceIdx = -1;
      }
      map.push(i);
      started = true;
    }
    map.push(text.length); // حارس النهاية
    return map;
  }

  var index = null; // [{ surah, ayah, a, b }] — b تساوي null إن تطابقت الصيغتان
  var surahNorm = null; // أسماء السور مطبَّعة

  function buildIndex() {
    if (index) return;
    index = [];
    surahNorm = [];
    var surahs = window.QURAN_DATA.surahs;
    for (var s = 0; s < surahs.length; s++) {
      surahNorm.push(normalize(surahs[s].name));
      var verses = surahs[s].verses;
      for (var v = 0; v < verses.length; v++) {
        var withAlif = normalize(verses[v], 'a');
        var withoutAlif = normalize(verses[v], 'b');
        index.push({
          surah: surahs[s].n,
          ayah: v + 1,
          a: withAlif,
          b: withAlif === withoutAlif ? null : withoutAlif
        });
      }
    }
  }

  /* يحاول قراءة الاستعلام كمرجع: «٢:٢٥٥»، «2 255»، «البقرة ٢٥٥»، «سورة الكهف» */
  function parseReference(query) {
    var q = toLatinDigits(query).replace(/[،,]/g, ' ').trim();
    var surahs = window.QURAN_DATA.surahs;

    var numeric = q.match(/^(\d{1,3})\s*[:：\-\s]\s*(\d{1,3})$/);
    if (numeric) {
      var sn = Number(numeric[1]);
      var an = Number(numeric[2]);
      if (sn >= 1 && sn <= 114 && an >= 1 && an <= surahs[sn - 1].verses.length) {
        return { surah: sn, ayah: an };
      }
      return null;
    }

    if (/^\d{1,3}$/.test(q)) {
      var only = Number(q);
      if (only >= 1 && only <= 114) return { surah: only, ayah: 1 };
      return null;
    }

    buildIndex();
    var named = q.match(/^(?:سوره\s+|سورة\s+)?(.+?)(?:\s+(\d{1,3}))?$/);
    if (!named) return null;
    var nameNorm = normalize(named[1]).replace(/^ال/, '');
    if (!nameNorm) return null;

    for (var i = 0; i < surahNorm.length; i++) {
      var candidate = surahNorm[i].replace(/^ال/, '');
      if (candidate === nameNorm) {
        var ayah = named[2] ? Number(named[2]) : 1;
        if (ayah < 1 || ayah > surahs[i].verses.length) ayah = 1;
        return { surah: i + 1, ayah: ayah };
      }
    }
    return null;
  }

  /* سور يطابق اسمها الاستعلام جزئياً */
  function matchSurahs(query) {
    buildIndex();
    var q = normalize(query).replace(/^ال/, '');
    if (!q) return [];
    var hits = [];
    for (var i = 0; i < surahNorm.length; i++) {
      if (surahNorm[i].replace(/^ال/, '').indexOf(q) === 0) hits.push(i + 1);
    }
    return hits;
  }

  /* بحث نصي في كل الآيات، مع تحديد موضع المطابقة في النص الأصلي */
  function searchText(query, limit) {
    buildIndex();
    var q = normalize(query);
    if (q.length < 2) return { total: 0, results: [] };

    var surahs = window.QURAN_DATA.surahs;
    var results = [];
    var total = 0;

    for (var i = 0; i < index.length; i++) {
      // نجرّب الصيغتين: بإظهار الألف الخنجرية ثم بحذفها
      var mode = 'a';
      var pos = index[i].a.indexOf(q);
      if (pos < 0 && index[i].b) {
        pos = index[i].b.indexOf(q);
        mode = 'b';
      }
      if (pos < 0) continue;
      total++;
      if (results.length >= limit) continue;

      var original = surahs[index[i].surah - 1].verses[index[i].ayah - 1];
      var map = buildIndexMap(original, mode);
      var start = map[pos];
      var end = map[Math.min(pos + q.length, map.length - 1)];
      results.push({
        surah: index[i].surah,
        ayah: index[i].ayah,
        text: original,
        start: start,
        end: end
      });
    }

    return { total: total, results: results };
  }

  window.QuranSearch = {
    normalize: normalize,
    toArabicDigits: toArabicDigits,
    toLatinDigits: toLatinDigits,
    parseReference: parseReference,
    matchSurahs: matchSurahs,
    searchText: searchText
  };
})();
