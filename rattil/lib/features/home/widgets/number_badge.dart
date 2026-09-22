import 'package:flutter/material.dart';

import '../../../core/utils/arabic.dart';

/// Rotated-square badge showing a surah or juz number.
class NumberBadge extends StatelessWidget {
  const NumberBadge(this.number, {super.key});

  final int number;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return SizedBox.square(
      dimension: 40,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Transform.rotate(
            angle: 0.785398, // 45°
            child: Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                border: Border.all(color: scheme.primary, width: 1.5),
                borderRadius: BorderRadius.circular(6),
              ),
            ),
          ),
          Text(
            toArabicDigits(number),
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: scheme.primary),
          ),
        ],
      ),
    );
  }
}
