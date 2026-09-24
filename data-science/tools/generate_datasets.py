#!/usr/bin/env python3
"""
يولّد ملفات البيانات التعليمية في datasets/ بشكل قابل للتكرار (نفس البذرة = نفس الملف دائماً).

هذه بيانات **مولّدة لأغراض تعليمية** تحاكي متجراً إلكترونياً سعودياً خلال سنة 2025،
وليست بيانات شركة حقيقية. أُضيفت إليها أنماط واقعية يكتشفها الطالب أثناء التحليل:
  - ارتفاع مبيعات الأغذية والتمور في مارس (رمضان 2025).
  - قفزة الإلكترونيات والخصومات في نوفمبر (عروض الجمعة البيضاء).
  - هدوء نسبي في أشهر الصيف.
  - تقييمات مفقودة لنحو 12% من الطلبات (عميل لم يقيّم).

ملف employees.csv فيه مشاكل جودة مقصودة للتدرب على التنظيف: أسماء أقسام بصيغ مختلفة،
رواتب كنصوص بفواصل وعملة، تواريخ بصيغتين، قيم مستحيلة، ومكررات. وملف students.csv
نظيف تقريباً ومناسب للتحليل الاستكشافي.

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


# ---------------------------------------------------------------- products.csv
def products():
    costs = {'سماعة لاسلكية': 88, 'شاحن سريع': 31, 'ساعة ذكية': 262, 'لوحة مفاتيح': 70, 'قميص قطني': 34,
             'حذاء رياضي': 132, 'جاكيت': 96, 'مصباح مكتب': 41, 'طقم أواني': 165, 'وسادة طبية': 52,
             'قهوة مختصة': 38, 'تمر فاخر': 49, 'عسل سدر': 118, 'رواية': 24, 'كتاب برمجة': 71}
    suppliers = {'إلكترونيات': 'مؤسسة التقنية الحديثة', 'ملابس': 'مصنع الأناقة', 'المنزل': 'بيت الخبرة',
                 'أغذية': 'مزارع الواحة', 'كتب': 'دار المعرفة'}
    rows = []
    for i, (category, items) in enumerate(PRODUCTS.items()):
        for j, (name, price) in enumerate(items):
            rows.append({'product': name, 'category': category, 'unit_cost': costs[name],
                         'supplier': suppliers[category], 'launch_year': 2019 + (i + j) % 6})
    return rows


# ---------------------------------------------------------------- employees.csv (بيانات فيها مشاكل مقصودة)
FIRST = ['محمد', 'أحمد', 'عبدالله', 'خالد', 'فهد', 'سعد', 'عمر', 'يوسف', 'ماجد', 'سلطان', 'نورة', 'سارة',
         'ريم', 'هند', 'لمى', 'منى', 'دانة', 'عبير', 'غادة', 'رهف']
LAST = ['العتيبي', 'القحطاني', 'الغامدي', 'الزهراني', 'الشمري', 'الدوسري', 'الحربي', 'المطيري', 'السبيعي', 'العمري']
DEPTS = {'المبيعات': (7000, 1500), 'التقنية': (12000, 2500), 'المالية': (10000, 2000),
         'الموارد البشرية': (8500, 1500), 'خدمة العملاء': (6500, 1000)}
DEPT_VARIANTS = {'المبيعات': [' المبيعات', 'مبيعات', 'Sales'], 'التقنية': ['تقنية المعلومات', 'IT', 'التقنية '],
                 'المالية': ['مالية', 'Finance'], 'الموارد البشرية': ['HR', 'موارد بشرية'],
                 'خدمة العملاء': ['خدمه العملاء', 'Customer Service']}


def employees(rng):
    rows = []
    for i in range(1, 401):
        dept = rng.choices(list(DEPTS), weights=[0.3, 0.22, 0.15, 0.1, 0.23])[0]
        female = rng.random() < 0.42
        first = rng.choice(FIRST[10:] if female else FIRST[:10])
        years = max(0, min(20, round(rng.expovariate(1 / 4.5))))
        hire = date(2025, 6, 30) - timedelta(days=years * 365 + rng.randint(0, 364))
        base, spread = DEPTS[dept]
        salary = round((base + years * 350 + rng.gauss(0, spread)) / 50) * 50
        perf = rng.choices([1, 2, 3, 4, 5], weights=[0.05, 0.12, 0.38, 0.3, 0.15])[0]
        satisfaction = min(10, max(0, round(rng.gauss(5 + (perf - 3) * 0.8 + (salary - base) / 2500, 1.8))))
        overtime = max(0, round(rng.gauss(10 if dept in ('المبيعات', 'خدمة العملاء') else 6, 5)))
        p_leave = 0.08 + (0.18 if satisfaction <= 3 else 0) + (0.08 if overtime > 15 else 0) + (0.06 if years < 2 else 0)
        left = rng.random() < p_leave
        row = {
            'emp_id': f'E{i:04d}',
            'name': f'{first} {rng.choice(LAST)}',
            'gender': 'أنثى' if female else 'ذكر',
            'department': dept,
            'city': rng.choices(['الرياض', 'جدة', 'الدمام'], weights=[0.55, 0.3, 0.15])[0],
            'hire_date': hire.isoformat(),
            'birth_year': str(2025 - (22 + years + max(0, round(rng.gauss(6, 5))))),
            'salary': str(salary),
            'performance': str(perf),
            'satisfaction': str(satisfaction),
            'overtime_hours': str(overtime),
            'left_company': 'نعم' if left else 'لا',
        }
        # ---- مشاكل مقصودة تشبه أخطاء الإدخال الحقيقية ----
        if rng.random() < 0.12:
            row['department'] = rng.choice(DEPT_VARIANTS[dept])
        r = rng.random()
        if r < 0.10:
            row['salary'] = f'{salary:,}'
        elif r < 0.15:
            row['salary'] = f'{salary} SAR'
        elif r < 0.19:
            row['salary'] = rng.choice(['', 'غير متوفر'])
        if rng.random() < 0.12:
            row['hire_date'] = date.fromisoformat(row['hire_date']).strftime('%d/%m/%Y')
        if rng.random() < 0.06:
            row['gender'] = {'أنثى': 'F', 'ذكر': 'M'}[row['gender']]
        if rng.random() < 0.08:
            row['left_company'] = {'نعم': 'Yes', 'لا': 'No'}[row['left_company']]
        if rng.random() < 0.07:
            row['satisfaction'] = ''
        if rng.random() < 0.03:
            row['city'] = row['city'] + ' '
        if rng.random() < 0.04:
            row['name'] = '  ' + row['name']
        rows.append(row)
    # قيم شاذة مستحيلة (أخطاء كتابة)
    rows[17]['salary'] = '98000000'
    rows[88]['salary'] = '120'
    rows[140]['birth_year'] = '1890'
    rows[205]['performance'] = '9'
    rows[260]['performance'] = '0'
    rows[311]['overtime_hours'] = '-4'
    rows[333]['hire_date'] = '2031-02-10'
    # مكررات: صفوف مكررة بالكامل + موظف مسجّل مرتين بقيمة راتب مختلفة
    for k in (5, 44, 97, 150, 222, 280, 301, 350, 377, 399):
        rows.append(dict(rows[k]))
    for k in (12, 190):
        dup = dict(rows[k])
        dup['salary'] = str(int(rows[k]['salary'].replace(',', '').replace(' SAR', '')) + 500) \
            if rows[k]['salary'].replace(',', '').replace(' SAR', '').isdigit() else '9500'
        rows.append(dup)
    rng.shuffle(rows)
    return rows


# ---------------------------------------------------------------- students.csv
def students(rng):
    rows = []
    for i in range(1, 601):
        female = rng.random() < 0.5
        school = rng.choices(['حكومية', 'أهلية'], weights=[0.72, 0.28])[0]
        parent = rng.choices(['ابتدائي', 'ثانوي', 'جامعي', 'دراسات عليا'], weights=[0.15, 0.35, 0.38, 0.12])[0]
        parent_bonus = {'ابتدائي': -3, 'ثانوي': 0, 'جامعي': 2, 'دراسات عليا': 4}[parent]
        study = max(0, round(rng.gauss(11 + (1.5 if female else 0), 5), 1))
        attendance = min(100, max(50, round(rng.gauss(88, 8), 1)))
        sleep = min(10, max(4, round(rng.gauss(7, 1.1), 1)))
        activities = rng.random() < 0.45
        internet = rng.random() < (0.93 if school == 'أهلية' else 0.8)
        ability = rng.gauss(0, 7)
        base = 48 + study * 1.25 + (attendance - 85) * 0.55 + (sleep - 7) * 1.8 + parent_bonus + (2 if internet else -2) + ability

        def subj(offset, noise):
            return min(100, max(0, round(base + offset + rng.gauss(0, noise))))

        row = {
            'student_id': f'S{i:04d}', 'gender': 'أنثى' if female else 'ذكر', 'school_type': school,
            'city': rng.choices(['الرياض', 'جدة', 'الدمام', 'أبها'], weights=[0.4, 0.3, 0.18, 0.12])[0],
            'parent_education': parent, 'study_hours': study, 'attendance': attendance, 'sleep_hours': sleep,
            'activities': 'نعم' if activities else 'لا', 'internet': 'نعم' if internet else 'لا',
            'math': subj(-3, 6), 'science': subj(0, 6), 'arabic': subj(5, 5),
            'english': subj(-1 if school == 'حكومية' else 5, 7),
        }
        if rng.random() < 0.04:
            row['study_hours'] = ''
        if rng.random() < 0.03:
            row['sleep_hours'] = ''
        rows.append(row)
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
    write_csv('products.csv', products())
    write_csv('employees.csv', employees(random.Random(7)))
    write_csv('students.csv', students(random.Random(11)))
