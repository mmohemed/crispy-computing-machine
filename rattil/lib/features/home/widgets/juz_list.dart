import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_router.dart';
import '../../../core/utils/arabic.dart';
import '../../../data/quran_repository.dart';
import 'number_badge.dart';

class JuzList extends ConsumerWidget {
  const JuzList({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final repo = ref.watch(quranRepositoryProvider);
    final muted = Theme.of(context).colorScheme.onSurfaceVariant;

    return ListView.separated(
      itemCount: QuranRepository.totalJuz,
      separatorBuilder: (_, _) => const Divider(height: 1, indent: 72),
      itemBuilder: (context, i) {
        final juz = i + 1;
        final start = repo.juzStart(juz);
        final page = repo.pageOf(start.surah, start.verse);
        return ListTile(
          leading: NumberBadge(juz),
          title: Text('الجزء ${toArabicDigits(juz)}'),
          subtitle: Text(
            'يبدأ من ${repo.surah(start.surah).nameArabic} · آية ${toArabicDigits(start.verse)}',
            style: TextStyle(color: muted),
          ),
          trailing: Text('ص ${toArabicDigits(page)}', style: TextStyle(color: muted)),
          onTap: () => context.push(AppRoutes.reader(page)),
        );
      },
    );
  }
}
