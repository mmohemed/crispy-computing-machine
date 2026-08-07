/* التخزين المحلي: الإعدادات، موضع القراءة، العلامات المرجعية */
(function () {
  'use strict';

  var KEY = 'quran-app:v1';

  var DEFAULTS = {
    theme: 'light',
    fontScale: 100,
    view: 'flow',
    lastRead: null, // { surah, ayah, at }
    bookmarks: [] // [{ surah, ayah, at }]
  };

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return Object.assign({}, DEFAULTS);
      var parsed = JSON.parse(raw);
      var state = Object.assign({}, DEFAULTS, parsed);
      if (!Array.isArray(state.bookmarks)) state.bookmarks = [];
      return state;
    } catch (e) {
      // متصفح يمنع التخزين أو بيانات تالفة — نتابع بالإعدادات الافتراضية
      return Object.assign({}, DEFAULTS);
    }
  }

  var state = read();

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* التخزين غير متاح — التطبيق يظل يعمل داخل الجلسة الحالية */
    }
  }

  function sameAyah(a, surah, ayah) {
    return a.surah === surah && a.ayah === ayah;
  }

  var Store = {
    get: function (key) {
      return state[key];
    },

    set: function (key, value) {
      state[key] = value;
      persist();
    },

    setLastRead: function (surah, ayah) {
      state.lastRead = { surah: surah, ayah: ayah, at: Date.now() };
      persist();
    },

    getLastRead: function () {
      return state.lastRead;
    },

    getBookmarks: function () {
      return state.bookmarks.slice().sort(function (a, b) {
        return a.surah - b.surah || a.ayah - b.ayah;
      });
    },

    isBookmarked: function (surah, ayah) {
      return state.bookmarks.some(function (b) {
        return sameAyah(b, surah, ayah);
      });
    },

    /* يضيف الآية أو يزيلها، ويعيد true إن أصبحت مضافة */
    toggleBookmark: function (surah, ayah) {
      var idx = state.bookmarks.findIndex(function (b) {
        return sameAyah(b, surah, ayah);
      });
      if (idx >= 0) {
        state.bookmarks.splice(idx, 1);
        persist();
        return false;
      }
      state.bookmarks.push({ surah: surah, ayah: ayah, at: Date.now() });
      persist();
      return true;
    },

    removeBookmark: function (surah, ayah) {
      state.bookmarks = state.bookmarks.filter(function (b) {
        return !sameAyah(b, surah, ayah);
      });
      persist();
    }
  };

  window.Store = Store;
})();
