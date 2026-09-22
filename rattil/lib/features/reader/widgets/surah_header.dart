import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/utils/arabic.dart';
import '../../../data/quran_repository.dart';

class SurahHeader extends StatelessWidget {
  const SurahHeader({super.key, required this.surah});

  final Surah surah;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final infoStyle = TextStyle(fontSize: 12, color: scheme.onSurfaceVariant);

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      decoration: BoxDecoration(
        color: scheme.primaryContainer.withValues(alpha: .5),
        border: Border.all(color: scheme.primary.withValues(alpha: .6)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Text(surah.isMakki ? 'مكية' : 'مدنية', style: infoStyle),
          Expanded(
            child: Text(
              'سورة ${surah.nameArabic}',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontFamily: AppTheme.quranFontFamily,
                fontSize: 22,
                color: scheme.onPrimaryContainer,
              ),
            ),
          ),
          Text('${toArabicDigits(surah.verseCount)} آية', style: infoStyle),
        ],
      ),
    );
  }
}
