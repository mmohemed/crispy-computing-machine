import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/storage/prefs_provider.dart';

class AppSettings {
  const AppSettings({this.themeMode = ThemeMode.system, this.quranFontSize = 26});

  static const minFontSize = 18.0;
  static const maxFontSize = 44.0;

  final ThemeMode themeMode;
  final double quranFontSize;

  AppSettings copyWith({ThemeMode? themeMode, double? quranFontSize}) => AppSettings(
        themeMode: themeMode ?? this.themeMode,
        quranFontSize: quranFontSize ?? this.quranFontSize,
      );
}

class SettingsController extends Notifier<AppSettings> {
  static const _themeKey = 'settings.themeMode';
  static const _fontSizeKey = 'settings.quranFontSize';

  @override
  AppSettings build() {
    final prefs = ref.watch(sharedPreferencesProvider);
    final themeIndex = prefs.getInt(_themeKey);
    return AppSettings(
      themeMode: themeIndex == null ? ThemeMode.system : ThemeMode.values[themeIndex],
      quranFontSize: prefs.getDouble(_fontSizeKey) ?? const AppSettings().quranFontSize,
    );
  }

  void setThemeMode(ThemeMode mode) {
    state = state.copyWith(themeMode: mode);
    ref.read(sharedPreferencesProvider).setInt(_themeKey, mode.index);
  }

  void setQuranFontSize(double size) {
    final clamped = size.clamp(AppSettings.minFontSize, AppSettings.maxFontSize).toDouble();
    state = state.copyWith(quranFontSize: clamped);
    ref.read(sharedPreferencesProvider).setDouble(_fontSizeKey, clamped);
  }
}

final settingsProvider = NotifierProvider<SettingsController, AppSettings>(SettingsController.new);
