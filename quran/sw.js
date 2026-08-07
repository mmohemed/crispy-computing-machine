/*
 * عامل الخدمة: يخزّن ملفات التطبيق كلها عند أول زيارة،
 * فيعمل التطبيق بعدها بدون إنترنت نهائياً.
 * عند تعديل أي ملف، غيّر رقم الإصدار أدناه ليحدّث المتصفح نسخته.
 */
const VERSION = 'quran-v1';

const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/store.js',
  './js/search.js',
  './js/app.js',
  './data/quran-data.js',
  './fonts/amiri-400.woff2',
  './fonts/amiri-700.woff2',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // التنقّل بين الصفحات: نُرجع الصفحة المخزّنة حتى بلا اتصال
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html', { ignoreSearch: true }))
    );
    return;
  }

  // بقية الملفات: من المخزن أولاً، ثم الشبكة مع حفظ نسخة
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
