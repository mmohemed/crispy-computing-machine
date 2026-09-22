import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_router.dart';
import '../../../core/utils/arabic.dart';
import '../../../data/quran_repository.dart';
import '../../reader/last_read_controller.dart';

class LastReadCard extends ConsumerWidget {
  const LastReadCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final page = ref.watch(lastReadProvider);
    if (page == null) return const SizedBox.shrink();

    final repo = ref.watch(quranRepositoryProvider);
    final first = repo.pageSegments(page).first;
    final surah = repo.surah(first.surah);
    final scheme = Theme.of(context).colorScheme;

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
      child: Card(
        color: scheme.primaryContainer,
        elevation: 0,
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () => context.push(AppRoutes.reader(page)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(Icons.menu_book_rounded, size: 36, color: scheme.onPrimaryContainer),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('تابع القراءة',
                          style: TextStyle(color: scheme.onPrimaryContainer.withValues(alpha: .8))),
                      const SizedBox(height: 4),
                      Text(
                        'سورة ${surah.nameArabic} · صفحة ${toArabicDigits(page)}',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              color: scheme.onPrimaryContainer,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.arrow_back_ios_new, size: 18, color: scheme.onPrimaryContainer),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
