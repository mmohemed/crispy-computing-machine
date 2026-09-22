import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/utils/arabic.dart';
import '../../../data/quran_repository.dart';
import '../../bookmarks/bookmarks_controller.dart';

Future<void> showVerseActionsSheet(BuildContext context, VerseRef verse) => showModalBottomSheet(
      context: context,
      showDragHandle: true,
      isScrollControlled: true,
      builder: (_) => _VerseActionsSheet(verse),
    );

class _VerseActionsSheet extends ConsumerWidget {
  const _VerseActionsSheet(this.verse);

  final VerseRef verse;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final repo = ref.watch(quranRepositoryProvider);
    final isBookmarked = ref.watch(bookmarksProvider).any((b) => b.ref == verse);
    final surahName = repo.surah(verse.surah).nameArabic;
    final text = repo.verseText(verse.surah, verse.verse);
    final reference = '$surahName: ${toArabicDigits(verse.verse)}';

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('سورة $reference',
                textAlign: TextAlign.center, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            ConstrainedBox(
              constraints: const BoxConstraints(maxHeight: 180),
              child: SingleChildScrollView(
                child: Text(
                  text,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                      fontFamily: AppTheme.quranFontFamily, fontSize: 22, height: 1.9),
                ),
              ),
            ),
            const Divider(height: 24),
            ListTile(
              leading: Icon(isBookmarked ? Icons.bookmark_remove : Icons.bookmark_add_outlined),
              title: Text(isBookmarked ? 'إزالة العلامة' : 'حفظ علامة'),
              onTap: () {
                ref.read(bookmarksProvider.notifier).toggle(verse);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.copy),
              title: const Text('نسخ الآية'),
              onTap: () async {
                final messenger = ScaffoldMessenger.of(context);
                final navigator = Navigator.of(context);
                await Clipboard.setData(ClipboardData(text: '﴿$text﴾ [$reference]'));
                navigator.pop();
                messenger.showSnackBar(const SnackBar(content: Text('تم نسخ الآية')));
              },
            ),
          ],
        ),
      ),
    );
  }
}
