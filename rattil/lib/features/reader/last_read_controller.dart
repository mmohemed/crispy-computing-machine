import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/storage/prefs_provider.dart';

/// The mushaf page the user last opened, or null before the first read.
class LastReadController extends Notifier<int?> {
  static const _key = 'lastRead.page';

  @override
  int? build() => ref.watch(sharedPreferencesProvider).getInt(_key);

  void save(int page) {
    if (state == page) return;
    state = page;
    ref.read(sharedPreferencesProvider).setInt(_key, page);
  }
}

final lastReadProvider = NotifierProvider<LastReadController, int?>(LastReadController.new);
