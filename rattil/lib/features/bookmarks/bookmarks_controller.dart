import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/storage/prefs_provider.dart';
import '../../data/quran_repository.dart';

class Bookmark {
  const Bookmark({required this.ref, required this.createdAt});

  factory Bookmark.fromJson(Map<String, dynamic> json) => Bookmark(
        ref: VerseRef(json['surah'] as int, json['verse'] as int),
        createdAt: DateTime.parse(json['createdAt'] as String),
      );

  final VerseRef ref;
  final DateTime createdAt;

  Map<String, dynamic> toJson() => {
        'surah': ref.surah,
        'verse': ref.verse,
        'createdAt': createdAt.toIso8601String(),
      };
}

/// Bookmarked verses, newest first.
class BookmarksController extends Notifier<List<Bookmark>> {
  static const _key = 'bookmarks';

  @override
  List<Bookmark> build() {
    final raw = ref.watch(sharedPreferencesProvider).getString(_key);
    if (raw == null) return const [];
    return [
      for (final item in jsonDecode(raw) as List) Bookmark.fromJson(item as Map<String, dynamic>),
    ];
  }

  bool contains(VerseRef verse) => state.any((b) => b.ref == verse);

  void toggle(VerseRef verse) {
    state = contains(verse)
        ? state.where((b) => b.ref != verse).toList()
        : [Bookmark(ref: verse, createdAt: DateTime.now()), ...state];
    _save();
  }

  void remove(VerseRef verse) {
    state = state.where((b) => b.ref != verse).toList();
    _save();
  }

  void _save() => ref
      .read(sharedPreferencesProvider)
      .setString(_key, jsonEncode([for (final b in state) b.toJson()]));
}

final bookmarksProvider =
    NotifierProvider<BookmarksController, List<Bookmark>>(BookmarksController.new);
