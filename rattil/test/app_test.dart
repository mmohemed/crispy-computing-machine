import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rattil/app.dart';
import 'package:rattil/core/storage/prefs_provider.dart';
import 'package:rattil/features/reader/last_read_controller.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<ProviderContainer> pumpApp(WidgetTester tester) async {
  SharedPreferences.setMockInitialValues({});
  final prefs = await SharedPreferences.getInstance();
  final container = ProviderContainer(
    overrides: [sharedPreferencesProvider.overrideWithValue(prefs)],
  );
  addTearDown(container.dispose);
  await tester.pumpWidget(
    UncontrolledProviderScope(container: container, child: const RattilApp()),
  );
  await tester.pumpAndSettle();
  return container;
}

void main() {
  testWidgets('home lists surahs and opening one saves the last-read page', (tester) async {
    final container = await pumpApp(tester);

    expect(find.text('رتّل'), findsOneWidget);
    expect(find.text('الفاتحة'), findsOneWidget);
    expect(find.text('تابع القراءة'), findsNothing);

    await tester.tap(find.text('البقرة'));
    await tester.pumpAndSettle();

    expect(find.text('سورة البقرة'), findsWidgets);
    expect(container.read(lastReadProvider), 2);
  });

  testWidgets('search finds verses', (tester) async {
    await pumpApp(tester);

    await tester.tap(find.byIcon(Icons.search));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextField), 'الحمد لله رب');
    await tester.pumpAndSettle();

    expect(find.textContaining('سورة الفاتحة'), findsOneWidget);
  });
}
