import 'package:flutter_test/flutter_test.dart';
import 'package:rattil/core/utils/arabic.dart';
import 'package:rattil/data/quran_repository.dart';

void main() {
  final repo = QuranRepository();

  test('has 114 surahs with correct metadata', () {
    expect(repo.surahs, hasLength(114));
    final baqarah = repo.surah(2);
    expect(baqarah.nameArabic, 'البقرة');
    expect(baqarah.verseCount, 286);
    expect(baqarah.isMakki, isFalse);
    expect(baqarah.startPage, 2);
    expect(repo.surah(1).isMakki, isTrue);
  });

  test('pages cover all 6236 verses exactly once', () {
    var total = 0;
    for (var p = 1; p <= QuranRepository.totalPages; p++) {
      for (final s in repo.pageSegments(p)) {
        total += s.end - s.start + 1;
      }
    }
    expect(total, 6236);
  });

  test('verse 1 of surahs other than Al-Fatihah does not repeat the basmala', () {
    expect(normalizeArabic(repo.verseText(2, 1)), 'الم');
    expect(normalizeArabic(repo.verseText(9, 1)), startsWith('براءه'));
    expect(repo.verseText(1, 1), QuranRepository.basmala);
    for (var s = 2; s <= 114; s++) {
      expect(normalizeArabic(repo.verseText(s, 1)), isNot(startsWith('بسم الله')), reason: 'surah $s');
    }
  });

  test('juz start positions', () {
    expect(repo.juzStart(1), const VerseRef(1, 1));
    expect(repo.juzStart(2), const VerseRef(2, 142));
    expect(repo.juzStart(30), const VerseRef(78, 1));
  });

  test('search ignores diacritics', () {
    final results = repo.search('الرحمن الرحيم');
    expect(results.map((r) => r.ref), contains(const VerseRef(1, 3)));
    expect(repo.search('ا'), isEmpty);
  });

  test('arabic helpers', () {
    expect(toArabicDigits(604), '٦٠٤');
    expect(normalizeArabic('ذَٰلِكَ الْكِتَابُ'), 'ذلك الكتاب');
  });
}
