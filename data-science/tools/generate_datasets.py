#!/usr/bin/env python3
"""
يولّد ملفات البيانات التعليمية في datasets/ بشكل قابل للتكرار (نفس البذرة = نفس الملف دائماً).

هذه بيانات **مولّدة لأغراض تعليمية** تحاكي متجراً إلكترونياً سعودياً خلال سنة 2025،
وليست بيانات شركة حقيقية. أُضيفت إليها أنماط واقعية يكتشفها الطالب أثناء التحليل:
  - ارتفاع مبيعات الأغذية والتمور في مارس (رمضان 2025).
  - قفزة الإلكترونيات والخصومات في نوفمبر (عروض الجمعة البيضاء).
  - هدوء نسبي في أشهر الصيف.
  - تقييمات مفقودة لنحو 12% من الطلبات (عميل لم يقيّم).

    python3 tools/generate_datasets.py
"""
import csv
import os
import random
from datetime import date, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'datasets')

PRODUCTS = {
    'إلكترونيات': [('سماعة لاسلكية', 149), ('شاحن سريع', 59), ('ساعة ذكية', 399), ('لوحة مفاتيح', 129)],
    'ملابس': [('قميص قطني', 79), ('حذاء رياضي', 249), ('جاكيت', 199)],
    'المنزل': [('مصباح مكتب', 89), ('طقم أواني', 299), ('وسادة طبية', 119)],
    'أغذية': [('قهوة مختصة', 65), ('تمر فاخر', 95), ('عسل سدر', 180)],
    'كتب': [('رواية', 45), ('كتاب برمجة', 120)],
}
CATEGORY_WEIGHTS = {'إلكترونيات': 0.26, 'ملابس': 0.22, 'المنزل': 0.18, 'أغذية': 0.22, 'كتب': 0.12}
CITIES = [('الرياض', 0.32), ('جدة', 0.25), ('الدمام', 0.15), ('مكة', 0.10), ('المدينة', 0.09), ('أبها', 0.09)]
PAYMENTS = [('بطاقة', 0.45), ('محفظة إلكترونية', 0.25), ('الدفع عند الاستلام', 0.20), ('تحويل بنكي', 0.10)]
MONTH_FACTOR = {1: 1.0, 2: 0.95, 3: 1.35, 4: 1.1, 5: 1.0, 6: 0.8, 7: 0.75, 8: 0.8, 9: 1.0, 10: 1.05, 11: 1.6, 12: 1.2}


def pick(rng, pairs):
    items, weights = zip(*pairs)
    return rng.choices(items, weights=weights, k=1)[0]


def store_sales(rng):
    rows = []
    order_no = 10001
    day = date(2025, 1, 1)
    while day.year == 2025:
        factor = MONTH_FACTOR[day.month] * (1.25 if day.weekday() in (3, 4) else 1.0)  # الخميس والجمعة
        n_orders = max(0, round(rng.gauss(4.2 * factor, 1.3)))
        for _ in range(n_orders):
            weights = dict(CATEGORY_WEIGHTS)
            if day.month == 3:
                weights['أغذية'] *= 2.2
            if day.month == 11:
                weights['إلكترونيات'] *= 2.0
            category = pick(rng, list(weights.items()))
            if category == 'أغذية' and day.month == 3:
                product, price = rng.choices(PRODUCTS[category], weights=[1, 3, 1], k=1)[0]
            else:
                product, price = rng.choice(PRODUCTS[category])
            quantity = rng.choices([1, 2, 3, 4], weights=[0.55, 0.28, 0.12, 0.05], k=1)[0]
            if category == 'أغذية':
                quantity = min(quantity + rng.choice([0, 0, 1]), 5)
            discount_weights = [0.35, 0.25, 0.25, 0.15] if day.month == 11 else [0.7, 0.15, 0.1, 0.05]
            discount = rng.choices([0, 0.05, 0.1, 0.2], weights=discount_weights, k=1)[0]
            rating = '' if rng.random() < 0.12 else rng.choices([1, 2, 3, 4, 5], weights=[0.04, 0.06, 0.15, 0.35, 0.40], k=1)[0]
            rows.append({
                'order_id': f'ORD-{order_no}',
                'order_date': day.isoformat(),
                'city': pick(rng, CITIES),
                'category': category,
                'product': product,
                'unit_price': price,
                'quantity': quantity,
                'discount': discount,
                'payment_method': pick(rng, PAYMENTS),
                'customer_type': 'عائد' if rng.random() < 0.58 else 'جديد',
                'rating': rating,
            })
            order_no += 1
        day += timedelta(days=1)
    return rows


def write_csv(name, rows):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name)
    with open(path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()), lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)
    print(f'{name}: {len(rows)} rows')


if __name__ == '__main__':
    write_csv('store_sales.csv', store_sales(random.Random(2025)))
