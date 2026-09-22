import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/utils/arabic.dart';
import '../../../data/quran_repository.dart';
import '../../bookmarks/bookmarks_controller.dart';

class BookmarksTab extends ConsumerWidget {
  const BookmarksTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookmarks = ref.watch(bookmarksProvider);
    final repo = ref.watch(quranRepositoryProvider);
    final scheme = Theme.of(context).colorScheme;

    if (bookmarks.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.bookmark_border, size: 56, color: scheme.outline),
              const SizedBox(height: 12),
              Text(
                'لا توجد علامات بعد\nاضغط على أي آية أثناء القراءة لحفظها',
                textAlign: TextAlign.center,
                style: TextStyle(color: scheme.onSurfaceVariant),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      itemCount: bookmarks.length,
      separatorBuilder: (_, _) => const Divider(height: 1),
      itemBuilder: (context, i) {
        final verse = bookmarks[i].ref;
        return Dismissible(
          key: ValueKey(verse),
          background: Container(
            color: scheme.errorContainer,
            alignment: AlignmentDirectional.centerEnd,
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Icon(Icons.delete_outline, color: scheme.onErrorContainer),
          ),
          direction: DismissDirection.endToStart,
          onDismissed: (_) => ref.read(bookmarksProvider.notifier).remove(verse),
          child: ListTile(
            leading: Icon(Icons.bookmark, color: scheme.primary),
            title: Text(
              'سورة ${repo.surah(verse.surah).nameArabic} · آية ${toArabicDigits(verse.verse)}',
            ),
            subtitle: Text(
              repo.verseText(verse.surah, verse.verse),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontFamily: AppTheme.quranFontFamily, fontSize: 17),
            ),
            onTap: () => context.push(
              AppRoutes.reader(repo.pageOf(verse.surah, verse.verse), highlight: verse),
            ),
          ),
        );
      },
    );
  }
}
