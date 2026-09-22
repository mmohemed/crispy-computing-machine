const _arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/// Converts Western digits (0-9) in [value] to Arabic-Indic digits.
String toArabicDigits(Object value) =>
    value.toString().replaceAllMapped(RegExp(r'\d'), (m) => _arabicDigits[int.parse(m[0]!)]);

// Harakat, Quranic annotation marks, superscript alef and tatweel.
final _diacritics = RegExp(r'[ؐ-ًؚ-ٰٟۖ-ۭـ]');
final _whitespace = RegExp(r'\s+');

/// Normalizes Arabic text for searching: strips diacritics and unifies
/// letter variants so that "الرَّحْمَـٰنِ" matches "الرحمن".
String normalizeArabic(String text) => text
    .replaceAll(_diacritics, '')
    .replaceAll(RegExp('[ٱأإآ]'), 'ا')
    .replaceAll('ى', 'ي')
    .replaceAll('ة', 'ه')
    .replaceAll('ؤ', 'و')
    .replaceAll('ئ', 'ي')
    .replaceAll(_whitespace, ' ')
    .trim();
