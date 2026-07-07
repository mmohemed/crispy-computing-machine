// عناصر الواجهة
const modulesGrid = document.getElementById('modulesGrid');
const mainScreen = document.getElementById('mainScreen');
const contentScreen = document.getElementById('contentScreen');
const contentTitle = document.getElementById('contentTitle');
const contentIcon = document.getElementById('contentIcon');
const contentText = document.getElementById('contentText');
const breadcrumb = document.getElementById('breadcrumb');
const backBtn = document.getElementById('backBtn');
const homeBtn = document.getElementById('homeBtn');
const clock = document.getElementById('clock');

// بناء شبكة الوحدات الرئيسية — القوائم الفرعية مخفية حتى الضغط على الأيقونة الرئيسية
function buildGrid() {
  MODULES.forEach((mod) => {
    const card = document.createElement('div');
    card.className = 'module-card';
    card.style.setProperty('--accent', mod.color);

    const head = document.createElement('div');
    head.className = 'module-head';
    head.innerHTML = `
      <span class="module-icon">${mod.icon}</span>
      <span class="module-title">${mod.title}</span>
      <span class="module-count">${mod.items.length}</span>
      <span class="module-arrow">▼</span>
    `;
    head.addEventListener('click', () => toggleCard(card));

    const submenu = document.createElement('div');
    submenu.className = 'submenu';
    mod.items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'submenu-item';
      row.innerHTML = `<span class="sub-icon">${item.icon}</span><span>${item.title}</span>`;
      row.addEventListener('click', () => openContent(mod, item));
      submenu.appendChild(row);
    });

    card.appendChild(head);
    card.appendChild(submenu);
    modulesGrid.appendChild(card);
  });
}

// فتح/إغلاق القائمة الفرعية — بطاقة واحدة مفتوحة في كل مرة
function toggleCard(card) {
  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.module-card.open').forEach((c) => c.classList.remove('open'));
  if (!isOpen) {
    card.classList.add('open');
  }
}

// فتح شاشة العنصر الفرعي
function openContent(mod, item) {
  contentTitle.textContent = item.title;
  contentIcon.textContent = item.icon;
  contentText.textContent = `${mod.title} ← ${item.title}`;
  breadcrumb.innerHTML = `
    <span class="crumb-link" id="crumbHome">🏠 الرئيسية</span>
    <span class="sep">←</span>
    <span>${mod.icon} ${mod.title}</span>
    <span class="sep">←</span>
    <span>${item.icon} ${item.title}</span>
  `;
  document.getElementById('crumbHome').addEventListener('click', goHome);
  mainScreen.classList.add('hidden');
  contentScreen.classList.remove('hidden');
}

// العودة للشاشة الرئيسية
function goHome() {
  contentScreen.classList.add('hidden');
  mainScreen.classList.remove('hidden');
  breadcrumb.innerHTML = '<span class="crumb">🏠 الرئيسية</span>';
}

backBtn.addEventListener('click', goHome);
homeBtn.addEventListener('click', goHome);

// الساعة والتاريخ في الشريط العلوي
function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleDateString('ar', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) + ' — ' + now.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
}
updateClock();
setInterval(updateClock, 30000);

buildGrid();
