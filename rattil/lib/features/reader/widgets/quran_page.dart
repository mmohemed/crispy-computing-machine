import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/utils/arabic.dart';
import '../../../data/quran_repository.dart';
import '../../bookmarks/bookmarks_controller.dart';
import '../../settings/settings_controller.dart';
import 'surah_header.dart';

/// One mushaf page: surah headers, basmala and tappable verses.
class QuranPage extends ConsumerStatefulWidget {
  const QuranPage({super.key, required this.page, required this.onVerseTap, this.selected});

  final int page;
  final VerseRef? selected;
  final ValueChanged<VerseRef> onVerseTap;

  @override
  ConsumerState<QuranPage> createState() => _QuranPageState();
}

class _QuranPageState extends ConsumerState<QuranPage> {
  // Recognizers from the previous build are disposed after the next frame,
  // once the rebuilt text no longer references them.
  List<TapGestureRecognizer> _recognizers = [];

  @override
  void dispose() {
    _disposeAll(_recognizers);
    super.dispose();
  }

  void _disposeAll(List<TapGestureRecognizer> recognizers) {
    for (final r in recognizers) {
      r.dispose();
    }
  }

  @override
  Widget build(BuildContext context) {
    final old = _recognizers;
    _recognizers = [];
    if (old.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _disposeAll(old));
    }

    final repo = ref.watch(quranRepositoryProvider);
    final fontSize = ref.watch(settingsProvider.select((s) => s.quranFontSize));
    final bookmarked = {for (final b in ref.watch(bookmarksProvider)) b.ref};
    final scheme = Theme.of(context).colorScheme;

    final verseStyle = TextStyle(
      fontFamily: AppTheme.quranFontFamily,
      fontSize: fontSize,
      height: 2.1,
      color: scheme.onSurface,
    );

    final children = <Widget>[];
    for (final segment in repo.pageSegments(widget.page)) {
      if (segment.start == 1) {
        children.add(SurahHeader(surah: repo.surah(segment.surah)));
        // Al-Fatihah's first verse is the basmala itself; At-Tawbah has none.
        if (segment.surah != 1 && segment.surah != 9) {
          children.add(Text(
            QuranRepository.basmala,
            textAlign: TextAlign.center,
            style: verseStyle.copyWith(fontSize: fontSize * 0.95),
          ));
        }
      }

      children.add(Text.rich(
        TextSpan(children: [
          for (var v = segment.start; v <= segment.end; v++)
            ..._verseSpans(repo, VerseRef(segment.surah, v), bookmarked, scheme),
        ]),
        textAlign: TextAlign.justify,
        style: verseStyle,
      ));
    }

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
      children: [
        ...children,
        const SizedBox(height: 16),
        Center(
          child: Text(
            toArabicDigits(widget.page),
            style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 14),
          ),
        ),
      ],
    );
  }

  List<InlineSpan> _verseSpans(
    QuranRepository repo,
    VerseRef verse,
    Set<VerseRef> bookmarked,
    ColorScheme scheme,
  ) {
    final recognizer = TapGestureRecognizer()..onTap = () => widget.onVerseTap(verse);
    _recognizers.add(recognizer);
    final isSelected = verse == widget.selected;

    return [
      TextSpan(
        text: repo.verseText(verse.surah, verse.verse),
        recognizer: recognizer,
        style: isSelected ? TextStyle(backgroundColor: scheme.primaryContainer) : null,
      ),
      TextSpan(
        text: ' ${repo.verseEndSymbol(verse.verse)} ',
        recognizer: recognizer,
        style: TextStyle(color: bookmarked.contains(verse) ? scheme.tertiary : scheme.primary),
      ),
    ];
  }
}
