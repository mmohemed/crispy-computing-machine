import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/utils/arabic.dart';
import '../../data/quran_repository.dart';
import 'last_read_controller.dart';
import 'widgets/quran_page.dart';
import 'widgets/verse_actions_sheet.dart';

/// Swipeable mushaf reader; in RTL the next page is revealed by swiping right.
class ReaderScreen extends ConsumerStatefulWidget {
  const ReaderScreen({super.key, required this.initialPage, this.highlight});

  final int initialPage;
  final VerseRef? highlight;

  @override
  ConsumerState<ReaderScreen> createState() => _ReaderScreenState();
}

class _ReaderScreenState extends ConsumerState<ReaderScreen> {
  late final PageController _controller = PageController(initialPage: widget.initialPage - 1);
  late int _page = widget.initialPage;
  late VerseRef? _selected = widget.highlight;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) ref.read(lastReadProvider.notifier).save(_page);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onPageChanged(int index) {
    setState(() => _page = index + 1);
    ref.read(lastReadProvider.notifier).save(_page);
  }

  Future<void> _onVerseTap(VerseRef verse) async {
    setState(() => _selected = verse);
    await showVerseActionsSheet(context, verse);
    if (mounted) setState(() => _selected = null);
  }

  @override
  Widget build(BuildContext context) {
    final repo = ref.watch(quranRepositoryProvider);
    final first = repo.pageSegments(_page).first;
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.colorScheme.surfaceContainerLowest,
      appBar: AppBar(
        backgroundColor: theme.colorScheme.surfaceContainerLowest,
        title: Column(
          children: [
            Text('سورة ${repo.surah(first.surah).nameArabic}'),
            Text(
              'الجزء ${toArabicDigits(repo.juzOf(first.surah, first.start))}',
              style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
            ),
          ],
        ),
      ),
      body: PageView.builder(
        controller: _controller,
        itemCount: QuranRepository.totalPages,
        onPageChanged: _onPageChanged,
        itemBuilder: (context, index) => QuranPage(
          page: index + 1,
          selected: _selected,
          onVerseTap: _onVerseTap,
        ),
      ),
    );
  }
}
