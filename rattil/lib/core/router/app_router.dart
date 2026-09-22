import 'package:go_router/go_router.dart';

import '../../data/quran_repository.dart';
import '../../features/home/home_screen.dart';
import '../../features/reader/reader_screen.dart';
import '../../features/search/search_screen.dart';
import '../../features/settings/settings_screen.dart';

abstract final class AppRoutes {
  static const home = '/';
  static const search = '/search';
  static const settings = '/settings';

  /// Opens the reader on [page], optionally highlighting [highlight].
  static String reader(int page, {VerseRef? highlight}) => Uri(
        path: '/reader',
        queryParameters: {
          'page': '$page',
          if (highlight != null) 'surah': '${highlight.surah}',
          if (highlight != null) 'verse': '${highlight.verse}',
        },
      ).toString();
}

GoRouter createRouter() => GoRouter(
      routes: [
        GoRoute(path: AppRoutes.home, builder: (context, state) => const HomeScreen()),
        GoRoute(
          path: '/reader',
          builder: (context, state) {
            final params = state.uri.queryParameters;
            final page = int.tryParse(params['page'] ?? '') ?? 1;
            final surah = int.tryParse(params['surah'] ?? '');
            final verse = int.tryParse(params['verse'] ?? '');
            return ReaderScreen(
              initialPage: page.clamp(1, QuranRepository.totalPages),
              highlight: surah != null && verse != null ? VerseRef(surah, verse) : null,
            );
          },
        ),
        GoRoute(path: AppRoutes.search, builder: (context, state) => const SearchScreen()),
        GoRoute(path: AppRoutes.settings, builder: (context, state) => const SettingsScreen()),
      ],
    );
