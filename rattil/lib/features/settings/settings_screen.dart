import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_theme.dart';
import '../../data/quran_repository.dart';
import 'settings_controller.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);
    final controller = ref.read(settingsProvider.notifier);
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(title: const Text('الإعدادات')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('المظهر', style: textTheme.titleMedium),
          const SizedBox(height: 8),
          SegmentedButton<ThemeMode>(
            segments: const [
              ButtonSegment(value: ThemeMode.system, label: Text('تلقائي'), icon: Icon(Icons.brightness_auto)),
              ButtonSegment(value: ThemeMode.light, label: Text('فاتح'), icon: Icon(Icons.light_mode)),
              ButtonSegment(value: ThemeMode.dark, label: Text('داكن'), icon: Icon(Icons.dark_mode)),
            ],
            selected: {settings.themeMode},
            onSelectionChanged: (s) => controller.setThemeMode(s.first),
          ),
          const SizedBox(height: 24),
          Text('حجم خط المصحف', style: textTheme.titleMedium),
          Slider(
            value: settings.quranFontSize,
            min: AppSettings.minFontSize,
            max: AppSettings.maxFontSize,
            divisions: 13,
            label: settings.quranFontSize.round().toString(),
            onChanged: controller.setQuranFontSize,
          ),
          Card(
            elevation: 0,
            color: Theme.of(context).colorScheme.surfaceContainerHigh,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                QuranRepository.basmala,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: AppTheme.quranFontFamily,
                  fontSize: settings.quranFontSize,
                  height: 2,
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text('المصادر', style: textTheme.titleMedium),
          const ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(Icons.menu_book_outlined),
            title: Text('نص القرآن الكريم'),
            subtitle: Text('مشروع تنزيل Tanzil.net — منقول دون أي تعديل'),
          ),
          const ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(Icons.font_download_outlined),
            title: Text('خط أميري قرآن'),
            subtitle: Text('Amiri Quran — رخصة SIL Open Font License'),
          ),
        ],
      ),
    );
  }
}
