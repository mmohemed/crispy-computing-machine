import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/app_router.dart';
import 'widgets/bookmarks_tab.dart';
import 'widgets/juz_list.dart';
import 'widgets/last_read_card.dart';
import 'widgets/surah_list.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('رتّل', style: TextStyle(fontWeight: FontWeight.bold)),
          leading: IconButton(
            tooltip: 'الإعدادات',
            icon: const Icon(Icons.settings_outlined),
            onPressed: () => context.push(AppRoutes.settings),
          ),
          actions: [
            IconButton(
              tooltip: 'بحث',
              icon: const Icon(Icons.search),
              onPressed: () => context.push(AppRoutes.search),
            ),
          ],
        ),
        body: const Column(
          children: [
            LastReadCard(),
            TabBar(tabs: [Tab(text: 'السور'), Tab(text: 'الأجزاء'), Tab(text: 'العلامات')]),
            Expanded(child: TabBarView(children: [SurahList(), JuzList(), BookmarksTab()])),
          ],
        ),
      ),
    );
  }
}
