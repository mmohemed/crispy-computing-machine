import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/utils/arabic.dart';
import '../../../data/quran_repository.dart';
import 'number_badge.dart';

class SurahList extends ConsumerWidget {
  const SurahList({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final surahs = ref.watch(quranRepositoryProvider).surahs;
    final muted = Theme.of(context).colorScheme.onSurfaceVariant;

    return ListView.separated(
      itemCount: surahs.length,
      separatorBuilder: (_, _) => const Divider(height: 1, indent: 72),
      itemBuilder: (context, i) {
        final s = surahs[i];
        return ListTile(
          leading: NumberBadge(s.number),
          title: Text(
            s.nameArabic,
            style: const TextStyle(fontFamily: AppTheme.quranFontFamily, fontSize: 20),
          ),
          subtitle: Text(
            '${s.isMakki ? 'مكية' : 'مدنية'} · ${toArabicDigits(s.verseCount)} آية',
            style: TextStyle(color: muted),
          ),
          trailing: Text('ص ${toArabicDigits(s.startPage)}', style: TextStyle(color: muted)),
          onTap: () => context.push(AppRoutes.reader(s.startPage)),
        );
      },
    );
  }
}
