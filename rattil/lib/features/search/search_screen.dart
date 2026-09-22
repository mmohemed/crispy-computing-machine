import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/app_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/arabic.dart';
import '../../data/quran_repository.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final repo = ref.watch(quranRepositoryProvider);
    final results = repo.search(_query);
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          autofocus: true,
          textInputAction: TextInputAction.search,
          decoration: const InputDecoration(
            hintText: 'ابحث عن كلمة في القرآن…',
            border: InputBorder.none,
          ),
          onChanged: (value) => setState(() => _query = value),
        ),
      ),
      body: switch ((normalizeArabic(_query).length < 2, results.isEmpty)) {
        (true, _) => _Hint(icon: Icons.search, text: 'اكتب حرفين على الأقل للبحث'),
        (false, true) => _Hint(icon: Icons.search_off, text: 'لا توجد نتائج'),
        _ => ListView.separated(
            itemCount: results.length + 1,
            separatorBuilder: (_, _) => const Divider(height: 1),
            itemBuilder: (context, i) {
              if (i == 0) {
                return Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    results.length >= 200
                        ? 'أول ${toArabicDigits(results.length)} نتيجة'
                        : '${toArabicDigits(results.length)} نتيجة',
                    style: TextStyle(color: scheme.onSurfaceVariant),
                  ),
                );
              }
              final r = results[i - 1];
              return ListTile(
                title: Text(
                  'سورة ${repo.surah(r.ref.surah).nameArabic} · آية ${toArabicDigits(r.ref.verse)}',
                  style: TextStyle(color: scheme.primary, fontSize: 14),
                ),
                subtitle: Text(
                  r.text,
                  style: TextStyle(
                    fontFamily: AppTheme.quranFontFamily,
                    fontSize: 19,
                    height: 1.8,
                    color: scheme.onSurface,
                  ),
                ),
                onTap: () => context.push(
                  AppRoutes.reader(repo.pageOf(r.ref.surah, r.ref.verse), highlight: r.ref),
                ),
              );
            },
          ),
      },
    );
  }
}

class _Hint extends StatelessWidget {
  const _Hint({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.onSurfaceVariant;
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 48, color: color),
          const SizedBox(height: 8),
          Text(text, style: TextStyle(color: color)),
        ],
      ),
    );
  }
}
