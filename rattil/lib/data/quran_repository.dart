import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:quran/quran.dart' as quran;

import '../core/utils/arabic.dart';

class Surah {
  const Surah({
    required this.number,
    required this.nameArabic,
    required this.nameEnglish,
    required this.verseCount,
    required this.isMakki,
    required this.startPage,
  });

  final int number;
  final String nameArabic;
  final String nameEnglish;
  final int verseCount;
  final bool isMakki;
  final int startPage;
}

/// A contiguous run of verses of one surah on a mushaf page.
class PageSegment {
  const PageSegment({required this.surah, required this.start, required this.end});

  final int surah;
  final int start;
  final int end;
}

class VerseRef {
  const VerseRef(this.surah, this.verse);

  final int surah;
  final int verse;

  @override
  bool operator ==(Object other) =>
      other is VerseRef && other.surah == surah && other.verse == verse;

  @override
  int get hashCode => Object.hash(surah, verse);
}

class SearchResult {
  const SearchResult(this.ref, this.text);

  final VerseRef ref;
  final String text;
}

/// Read-only access to the bundled Quran text (Tanzil, via the `quran` package).
class QuranRepository {
  QuranRepository();

  static const totalPages = quran.totalPagesCount;
  static const totalJuz = quran.totalJuzCount;
  /// Al-Fatihah 1:1, in the same orthography as the rest of the bundled text.
  static final basmala = quran.getVerse(1, 1);

  late final List<Surah> surahs = List.generate(quran.totalSurahCount, (i) {
    final n = i + 1;
    return Surah(
      number: n,
      nameArabic: quran.getSurahNameArabic(n),
      nameEnglish: quran.getSurahName(n),
      verseCount: quran.getVerseCount(n),
      isMakki: quran.getPlaceOfRevelation(n) == 'Makkah',
      startPage: quran.getPageNumber(n, 1),
    );
  }, growable: false);

  // Built on first search: normalized text of every verse.
  late final List<(VerseRef, String)> _searchIndex = [
    for (final s in surahs)
      for (var v = 1; v <= s.verseCount; v++)
        (VerseRef(s.number, v), normalizeArabic(verseText(s.number, v))),
  ];

  Surah surah(int number) => surahs[number - 1];

  List<PageSegment> pageSegments(int page) => [
        for (final m in quran.getPageData(page))
          PageSegment(surah: m['surah'] as int, start: m['start'] as int, end: m['end'] as int),
      ];

  /// The text of a verse. The source data prefixes verse 1 of every surah
  /// (except Al-Fatihah) with the basmala, which is not part of the verse,
  /// so it is stripped here and rendered separately above the surah.
  String verseText(int surah, int verse) {
    final text = quran.getVerse(surah, verse);
    if (surah != 1 && verse == 1 && text.startsWith('$basmala ')) {
      return text.substring(basmala.length + 1);
    }
    return text;
  }

  String verseEndSymbol(int verse) => quran.getVerseEndSymbol(verse);

  int pageOf(int surah, int verse) => quran.getPageNumber(surah, verse);

  int juzOf(int surah, int verse) => quran.getJuzNumber(surah, verse);

  VerseRef juzStart(int juz) {
    final verses = quran.getSurahAndVersesFromJuz(juz);
    final firstSurah = verses.keys.reduce((a, b) => a < b ? a : b);
    return VerseRef(firstSurah, verses[firstSurah]!.first);
  }

  /// Returns verses containing [query], ignoring diacritics and letter variants.
  List<SearchResult> search(String query, {int limit = 200}) {
    final q = normalizeArabic(query);
    if (q.length < 2) return const [];
    final results = <SearchResult>[];
    for (final (ref, text) in _searchIndex) {
      if (text.contains(q)) {
        results.add(SearchResult(ref, verseText(ref.surah, ref.verse)));
        if (results.length >= limit) break;
      }
    }
    return results;
  }
}

final quranRepositoryProvider = Provider<QuranRepository>((ref) => QuranRepository());
