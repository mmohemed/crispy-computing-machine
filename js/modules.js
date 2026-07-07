// هيكل وحدات النظام: الأيقونات الرئيسية وقوائمها الفرعية
const MODULES = [
  {
    id: 'settings',
    icon: '⚙️',
    title: 'الإعدادات والإدارة',
    color: '#607d8b',
    items: [
      { icon: '🏢', title: 'بيانات الشركة' },
      { icon: '🏪', title: 'الفروع' },
      { icon: '👥', title: 'المستخدمون' },
      { icon: '🔐', title: 'الصلاحيات' },
      { icon: '📅', title: 'الفترات المالية' },
      { icon: '💱', title: 'العملات' },
      { icon: '🧾', title: 'الضرائب' },
      { icon: '💾', title: 'النسخ الاحتياطي' },
      { icon: '📜', title: 'سجل العمليات' }
    ]
  },
  {
    id: 'accounting',
    icon: '💰',
    title: 'الحسابات العامة',
    color: '#2e7d32',
    items: [
      { icon: '📖', title: 'دليل الحسابات' },
      { icon: '✍️', title: 'القيود اليومية' },
      { icon: '🤖', title: 'القيود الآلية' },
      { icon: '📒', title: 'دفتر الأستاذ' },
      { icon: '📓', title: 'اليومية العامة' },
      { icon: '⚖️', title: 'ميزان المراجعة' },
      { icon: '🎯', title: 'مراكز التكلفة' },
      { icon: '📁', title: 'المشاريع' },
      { icon: '💱', title: 'العملات' },
      { icon: '🔒', title: 'إقفال السنة' },
      { icon: '📊', title: 'التقارير المالية' }
    ]
  },
  {
    id: 'treasury',
    icon: '🏦',
    title: 'الصندوق والبنوك',
    color: '#1565c0',
    items: [
      { icon: '💵', title: 'الصناديق' },
      { icon: '🏦', title: 'الحسابات البنكية' },
      { icon: '📥', title: 'سندات القبض' },
      { icon: '📤', title: 'سندات الصرف' },
      { icon: '🔄', title: 'التحويلات' },
      { icon: '🧮', title: 'التسويات البنكية' },
      { icon: '🎫', title: 'الشيكات' }
    ]
  },
  {
    id: 'sales',
    icon: '🛒',
    title: 'المبيعات والعملاء',
    color: '#e65100',
    items: [
      { icon: '🤝', title: 'العملاء' },
      { icon: '💬', title: 'عروض الأسعار' },
      { icon: '📋', title: 'أوامر البيع' },
      { icon: '🧾', title: 'فواتير المبيعات' },
      { icon: '↩️', title: 'مرتجعات المبيعات' },
      { icon: '💳', title: 'التحصيل' },
      { icon: '🖥️', title: 'نقاط البيع POS' },
      { icon: '📊', title: 'التقارير' }
    ]
  },
  {
    id: 'purchases',
    icon: '📦',
    title: 'المشتريات والموردون',
    color: '#6a1b9a',
    items: [
      { icon: '🚚', title: 'الموردون' },
      { icon: '📝', title: 'طلبات الشراء' },
      { icon: '📋', title: 'أوامر الشراء' },
      { icon: '🧾', title: 'فواتير الشراء' },
      { icon: '↩️', title: 'مرتجعات الشراء' },
      { icon: '💸', title: 'المدفوعات' },
      { icon: '📊', title: 'التقارير' }
    ]
  },
  {
    id: 'inventory',
    icon: '🏬',
    title: 'المخازن',
    color: '#00695c',
    items: [
      { icon: '🏭', title: 'المستودعات' },
      { icon: '📦', title: 'الأصناف' },
      { icon: '📏', title: 'وحدات القياس' },
      { icon: '🏷️', title: 'الباركود' },
      { icon: '🔍', title: 'الجرد' },
      { icon: '🔄', title: 'تحويل المخزون' },
      { icon: '🧮', title: 'التسويات' },
      { icon: '📊', title: 'التقارير' }
    ]
  },
  {
    id: 'manufacturing',
    icon: '🏭',
    title: 'التصنيع',
    color: '#4e342e',
    items: [
      { icon: '📦', title: 'المنتجات' },
      { icon: '🧱', title: 'المواد الخام' },
      { icon: '⚙️', title: 'أوامر الإنتاج' },
      { icon: '🔀', title: 'مراحل الإنتاج' },
      { icon: '💲', title: 'التكاليف' },
      { icon: '📊', title: 'التقارير' }
    ]
  },
  {
    id: 'assets',
    icon: '💵',
    title: 'الأصول الثابتة',
    color: '#827717',
    items: [
      { icon: '🗂️', title: 'سجل الأصول' },
      { icon: '📉', title: 'الإهلاك' },
      { icon: '🔄', title: 'نقل أصل' },
      { icon: '💰', title: 'بيع أصل' },
      { icon: '📊', title: 'التقارير' }
    ]
  },
  {
    id: 'hr',
    icon: '👨‍💼',
    title: 'الموارد البشرية',
    color: '#ad1457',
    items: [
      { icon: '👥', title: 'الموظفون' },
      { icon: '⏰', title: 'الحضور والانصراف' },
      { icon: '💵', title: 'الرواتب' },
      { icon: '🌴', title: 'الإجازات' },
      { icon: '🤲', title: 'السلف' },
      { icon: '📊', title: 'التقارير' }
    ]
  },
  {
    id: 'projects',
    icon: '📑',
    title: 'المشاريع والعقود',
    color: '#283593',
    items: [
      { icon: '📁', title: 'المشاريع' },
      { icon: '📜', title: 'العقود' },
      { icon: '🧾', title: 'المستخلصات' },
      { icon: '🚧', title: 'مراحل التنفيذ' },
      { icon: '📊', title: 'التقارير' }
    ]
  },
  {
    id: 'reports',
    icon: '📊',
    title: 'التقارير والتحليلات',
    color: '#c62828',
    items: [
      { icon: '💰', title: 'التقارير المالية' },
      { icon: '🛒', title: 'تقارير المبيعات' },
      { icon: '📦', title: 'تقارير المشتريات' },
      { icon: '🏬', title: 'تقارير المخزون' },
      { icon: '📈', title: 'مؤشرات الأداء' },
      { icon: '🧠', title: 'ذكاء الأعمال (BI)' }
    ]
  }
];
