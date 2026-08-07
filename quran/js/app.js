/* واجهة تطبيق القرآن الكريم: التنقل، القراءة، البحث، العلامات المرجعية */
(function () {
  'use strict';

  var DATA = window.QURAN_DATA;
  var SURAHS = DATA.surahs;
  var ar = window.QuranSearch.toArabicDigits;

  // كل نص قرآني معروض مأخوذ من ملف البيانات نفسه: البسملة هي أول آية من الفاتحة
  var BASMALA = SURAHS[0].verses[0];
  var MAX_RESULTS = 200;
  var FONT_MIN = 80;
  var FONT_MAX = 200;
  var FONT_STEP = 10;

  var view = document.getElementById('view');
  var searchForm = document.getElementById('searchForm');
  var searchInput = document.getElementById('searchInput');
  var settingsBtn = document.getElementById('settingsBtn');
  var settingsPanel = document.getElementById('settingsPanel');
  var fontValue = document.getElementById('fontValue');
  var ayahBar = document.getElementById('ayahBar');
  var ayahBarRef = document.getElementById('ayahBarRef');
  var toastEl = document.getElementById('toast');

  var selected = null; // { surah, ayah }
  var searchTimer = null;
  var toastTimer = null;
  var lastReadTimer = null;
  var visibleAyat = null; // مراقب الآيات الظاهرة لحفظ موضع القراءة

  /* ===== أدوات مساعدة ===== */

  function esc(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function surahOf(n) {
    return SURAHS[n - 1];
  }

  function ayahText(surah, ayah) {
    var s = surahOf(surah);
    return s && s.verses[ayah - 1] ? s.verses[ayah - 1] : '';
  }

  function refLabel(surah, ayah) {
    return 'سورة ' + surahOf(surah).name + ' — الآية ' + ar(ayah);
  }

  function toast(message) {
    toastEl.textContent = message;
    toastEl.hidden = false;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
      toastTimer = setTimeout(function () {
        toastEl.hidden = true;
      }, 250);
    }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          toast('تم نسخ الآية');
        },
        function () {
          legacyCopy(text);
        }
      );
      return;
    }
    legacyCopy(text);
  }

  function legacyCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(area);
    toast(ok ? 'تم نسخ الآية' : 'تعذّر النسخ من هذا المتصفح');
  }

  /* ===== الإعدادات ===== */

  function applySettings() {
    var theme = window.Store.get('theme');
    var scale = window.Store.get('fontScale');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--font-scale', scale / 100);
    fontValue.textContent = ar(scale) + '٪';

    markActive('#themeGroup button', 'themeValue', theme);
    markActive('#viewGroup button', 'viewValue', window.Store.get('view'));
  }

  function markActive(selector, datasetKey, value) {
    document.querySelectorAll(selector).forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset[datasetKey] === value);
    });
  }

  function changeFont(delta) {
    var next = Math.min(FONT_MAX, Math.max(FONT_MIN, window.Store.get('fontScale') + delta));
    window.Store.set('fontScale', next);
    applySettings();
  }

  /* ===== التوجيه ===== */

  /* عنوان مشوّه في شريط المتصفح يجب ألا يعطّل التطبيق */
  function safeDecode(value) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
      return '';
    }
  }

  function parseRoute() {
    var hash = location.hash.replace(/^#\/?/, '');
    var parts = hash.split('/').filter(Boolean);
    if (!parts.length) return { name: 'home' };
    if (parts[0] === 'juz') return { name: 'juz' };
    if (parts[0] === 'bookmarks') return { name: 'bookmarks' };
    if (parts[0] === 'search') return { name: 'search', query: safeDecode(parts[1] || '') };
    if (parts[0] === 'surah') {
      var n = Number(parts[1]);
      if (!(n >= 1 && n <= 114)) return { name: 'home' };
      var ayah = Number(parts[2]);
      var max = surahOf(n).verses.length;
      return { name: 'surah', surah: n, ayah: ayah >= 1 && ayah <= max ? ayah : null };
    }
    return { name: 'home' };
  }

  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  function render() {
    var route = parseRoute();
    hideAyahBar();
    disconnectObserver();

    document.querySelectorAll('.nav-link').forEach(function (link) {
      var key = link.dataset.nav;
      var active =
        (key === 'home' && (route.name === 'home' || route.name === 'surah')) ||
        (key === 'juz' && route.name === 'juz') ||
        (key === 'bookmarks' && route.name === 'bookmarks');
      link.classList.toggle('active', active);
    });

    if (route.name === 'surah') renderSurah(route.surah, route.ayah);
    else if (route.name === 'juz') renderJuz();
    else if (route.name === 'bookmarks') renderBookmarks();
    else if (route.name === 'search') renderSearch(route.query);
    else renderHome();

    if (route.name !== 'search' && searchInput.value && document.activeElement !== searchInput) {
      searchInput.value = '';
    }
  }

  /* ===== الصفحة الرئيسية: فهرس السور ===== */

  function renderHome() {
    var html = '<h1 class="page-title">فهرس السور</h1>';

    var last = window.Store.getLastRead();
    if (last && surahOf(last.surah)) {
      html +=
        '<a class="continue-card" href="#/surah/' + last.surah + '/' + last.ayah + '">' +
        '<span class="continue-label">📖 متابعة القراءة</span>' +
        '<span class="continue-ref">' + esc(refLabel(last.surah, last.ayah)) + '</span>' +
        '</a>';
    }

    html += '<div class="surah-grid">';
    for (var i = 0; i < SURAHS.length; i++) {
      var s = SURAHS[i];
      html +=
        '<a class="surah-card" href="#/surah/' + s.n + '">' +
        '<span class="surah-num">' + ar(s.n) + '</span>' +
        '<span class="surah-info">' +
        '<span class="surah-name">' + esc(s.name) + '</span>' +
        '<span class="surah-meta">' + esc(s.type) + '، ' + ar(s.verses.length) + ' آية</span>' +
        '</span>' +
        '</a>';
    }
    html += '</div>';

    view.innerHTML = html;
    window.scrollTo(0, 0);
  }

  /* ===== صفحة الأجزاء ===== */

  function renderJuz() {
    var html = '<h1 class="page-title">الأجزاء الثلاثون</h1><div class="juz-grid">';
    for (var i = 0; i < DATA.juz.length; i++) {
      var j = DATA.juz[i];
      var next = DATA.juz[i + 1];
      var endRef;
      if (!next) {
        endRef = 'حتى آخر سورة الناس';
      } else if (next.ayah > 1) {
        // ينتهي الجزء عند الآية السابقة لبداية الجزء التالي
        endRef = 'حتى ' + surahOf(next.surah).name + ' ' + ar(next.ayah - 1);
      } else {
        // الجزء التالي يبدأ بسورة جديدة، فهذا الجزء ينتهي بآخر السورة السابقة لها
        var prev = surahOf(next.surah - 1);
        endRef = 'حتى ' + prev.name + ' ' + ar(prev.verses.length);
      }
      html +=
        '<a class="juz-card" href="#/surah/' + j.surah + '/' + j.ayah + '">' +
        '<span class="juz-num">الجزء ' + ar(j.n) + '</span>' +
        '<span class="juz-start">يبدأ من ' + esc(surahOf(j.surah).name) + ' ' + ar(j.ayah) + '</span>' +
        '<span class="juz-end">' + esc(endRef) + '</span>' +
        '</a>';
    }
    html += '</div>';
    view.innerHTML = html;
    window.scrollTo(0, 0);
  }

  /* ===== شاشة القراءة ===== */

  function renderSurah(n, targetAyah) {
    var s = surahOf(n);
    var mode = window.Store.get('view');

    var html = '<article class="reader">';
    html +=
      '<header class="surah-header">' +
      '<div class="surah-header-name">سورة ' + esc(s.name) + '</div>' +
      '<div class="surah-header-meta">' +
      esc(s.type) + '، ' + ar(s.verses.length) + ' آية، ترتيبها ' + ar(s.n) +
      '</div>' +
      '</header>';

    if (n !== 1 && n !== 9) {
      html += '<div class="basmala">' + BASMALA + '</div>';
    }

    html += '<div class="ayat ' + (mode === 'lines' ? 'ayat-lines' : 'ayat-flow') + '">';
    for (var i = 0; i < s.verses.length; i++) {
      var num = i + 1;
      var marked = window.Store.isBookmarked(n, num) ? ' bookmarked' : '';
      html +=
        '<span class="ayah' + marked + '" data-ayah="' + num + '" tabindex="0" role="button" ' +
        'aria-label="الآية ' + ar(num) + '">' +
        '<span class="ayah-text">' + s.verses[i] + '</span>' +
        '<span class="ayah-num" aria-hidden="true">' + ar(num) + '</span>' +
        '</span> ';
    }
    html += '</div>';

    html += '<nav class="reader-nav">';
    html += n > 1
      ? '<a class="nav-btn" href="#/surah/' + (n - 1) + '">السابقة: ' + esc(surahOf(n - 1).name) + ' →</a>'
      : '<span class="nav-btn disabled">السابقة</span>';
    html += '<a class="nav-btn" href="#/">فهرس السور</a>';
    html += n < 114
      ? '<a class="nav-btn" href="#/surah/' + (n + 1) + '">← التالية: ' + esc(surahOf(n + 1).name) + '</a>'
      : '<span class="nav-btn disabled">التالية</span>';
    html += '</nav></article>';

    view.innerHTML = html;

    if (targetAyah) {
      var el = view.querySelector('.ayah[data-ayah="' + targetAyah + '"]');
      if (el) {
        el.classList.add('target');
        el.scrollIntoView({ block: 'center' });
        setTimeout(function () {
          el.classList.remove('target');
        }, 2600);
      }
      window.Store.setLastRead(n, targetAyah);
    } else {
      window.scrollTo(0, 0);
      window.Store.setLastRead(n, 1);
    }

    observeReading(n);
  }

  /* يحفظ آخر آية ظاهرة على الشاشة كموضع قراءة */
  function observeReading(surahNumber) {
    if (!('IntersectionObserver' in window)) return;
    var current = null;

    visibleAyat = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var num = Number(entry.target.dataset.ayah);
          if (current === null || num < current) current = num;
        });
        if (current === null) return;
        clearTimeout(lastReadTimer);
        var snapshot = current;
        current = null;
        lastReadTimer = setTimeout(function () {
          window.Store.setLastRead(surahNumber, snapshot);
        }, 1200);
      },
      { rootMargin: '-25% 0px -60% 0px' }
    );

    view.querySelectorAll('.ayah').forEach(function (el) {
      visibleAyat.observe(el);
    });
  }

  function disconnectObserver() {
    if (visibleAyat) {
      visibleAyat.disconnect();
      visibleAyat = null;
    }
    clearTimeout(lastReadTimer);
  }

  /* ===== شريط أدوات الآية ===== */

  function selectAyah(surah, ayah, element) {
    clearSelection();
    selected = { surah: surah, ayah: ayah };
    if (element) element.classList.add('selected');
    ayahBarRef.textContent = refLabel(surah, ayah);
    ayahBar.hidden = false;
    ayahBar.classList.add('show');
    updateBookmarkButton();
  }

  function clearSelection() {
    view.querySelectorAll('.ayah.selected').forEach(function (el) {
      el.classList.remove('selected');
    });
  }

  function hideAyahBar() {
    selected = null;
    clearSelection();
    ayahBar.classList.remove('show');
    ayahBar.hidden = true;
  }

  function updateBookmarkButton() {
    var btn = ayahBar.querySelector('[data-action="bookmark"]');
    if (!selected) return;
    var on = window.Store.isBookmarked(selected.surah, selected.ayah);
    btn.textContent = on ? '🔖 إزالة من المفضلة' : '🔖 المفضلة';
  }

  /* ===== نتائج البحث ===== */

  function renderSearch(query) {
    var q = query.trim();
    if (!q) {
      view.innerHTML = '<h1 class="page-title">البحث</h1><p class="empty">اكتب كلمة للبحث عنها في نص القرآن الكريم.</p>';
      return;
    }

    var ref = window.QuranSearch.parseReference(q);
    if (ref) {
      go('#/surah/' + ref.surah + '/' + ref.ayah);
      return;
    }

    var html = '<h1 class="page-title">نتائج البحث عن «' + esc(q) + '»</h1>';

    var nameHits = window.QuranSearch.matchSurahs(q);
    if (nameHits.length) {
      html += '<div class="result-group"><h2 class="result-group-title">سور مطابقة</h2><div class="surah-grid compact">';
      nameHits.slice(0, 12).forEach(function (n) {
        var s = surahOf(n);
        html +=
          '<a class="surah-card" href="#/surah/' + n + '">' +
          '<span class="surah-num">' + ar(n) + '</span>' +
          '<span class="surah-info"><span class="surah-name">' + esc(s.name) + '</span>' +
          '<span class="surah-meta">' + esc(s.type) + '، ' + ar(s.verses.length) + ' آية</span></span></a>';
      });
      html += '</div></div>';
    }

    var found = window.QuranSearch.searchText(q, MAX_RESULTS);
    if (!found.total) {
      html += nameHits.length ? '' : '<p class="empty">لا توجد نتائج مطابقة.</p>';
    } else {
      html +=
        '<div class="result-group"><h2 class="result-group-title">' +
        ar(found.total) + ' آية' + (found.total > found.results.length ? ' — تُعرض أول ' + ar(found.results.length) : '') +
        '</h2><div class="results">';
      found.results.forEach(function (r) {
        html +=
          '<a class="result" href="#/surah/' + r.surah + '/' + r.ayah + '">' +
          '<span class="result-ref">' + esc(refLabel(r.surah, r.ayah)) + '</span>' +
          '<span class="result-text">' + highlight(r.text, r.start, r.end) + '</span>' +
          '</a>';
      });
      html += '</div></div>';
    }

    view.innerHTML = html;
    window.scrollTo(0, 0);
  }

  /* النص من بيانات المصحف (موثوق) — نُحيط موضع المطابقة بوسم تمييز */
  function highlight(text, start, end) {
    return (
      text.slice(0, start) + '<mark>' + text.slice(start, end) + '</mark>' + text.slice(end)
    );
  }

  /* ===== العلامات المرجعية ===== */

  function renderBookmarks() {
    var items = window.Store.getBookmarks();
    var html = '<h1 class="page-title">المفضلة</h1>';

    if (!items.length) {
      html += '<p class="empty">لا توجد آيات محفوظة بعد. اضغط على أي آية أثناء القراءة ثم اختر «المفضلة».</p>';
    } else {
      html += '<div class="results">';
      items.forEach(function (b) {
        html +=
          '<div class="result bookmark-row">' +
          '<a class="bookmark-link" href="#/surah/' + b.surah + '/' + b.ayah + '">' +
          '<span class="result-ref">' + esc(refLabel(b.surah, b.ayah)) + '</span>' +
          '<span class="result-text">' + ayahText(b.surah, b.ayah) + '</span>' +
          '</a>' +
          '<button type="button" class="remove-bookmark" data-surah="' + b.surah + '" data-ayah="' + b.ayah + '" ' +
          'aria-label="إزالة من المفضلة">🗑️</button>' +
          '</div>';
      });
      html += '</div>';
    }

    view.innerHTML = html;
    window.scrollTo(0, 0);
  }

  /* ===== الأحداث ===== */

  view.addEventListener('click', function (event) {
    var remove = event.target.closest('.remove-bookmark');
    if (remove) {
      window.Store.removeBookmark(Number(remove.dataset.surah), Number(remove.dataset.ayah));
      toast('تمت الإزالة من المفضلة');
      renderBookmarks();
      return;
    }

    var ayah = event.target.closest('.ayah');
    if (!ayah) return;
    var route = parseRoute();
    if (route.name !== 'surah') return;
    var num = Number(ayah.dataset.ayah);
    if (selected && selected.ayah === num) hideAyahBar();
    else selectAyah(route.surah, num, ayah);
  });

  view.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    var ayah = event.target.closest('.ayah');
    if (!ayah) return;
    event.preventDefault();
    ayah.click();
  });

  ayahBar.addEventListener('click', function (event) {
    var btn = event.target.closest('button');
    if (!btn || !selected) return;
    var action = btn.dataset.action;

    if (action === 'close') {
      hideAyahBar();
    } else if (action === 'copy') {
      copyText(
        '﴿ ' + ayahText(selected.surah, selected.ayah) + ' ﴾\n[' + refLabel(selected.surah, selected.ayah) + ']'
      );
    } else if (action === 'bookmark') {
      var added = window.Store.toggleBookmark(selected.surah, selected.ayah);
      var el = view.querySelector('.ayah[data-ayah="' + selected.ayah + '"]');
      if (el) el.classList.toggle('bookmarked', added);
      updateBookmarkButton();
      toast(added ? 'أُضيفت إلى المفضلة' : 'أُزيلت من المفضلة');
    } else if (action === 'mark') {
      window.Store.setLastRead(selected.surah, selected.ayah);
      toast('حُفظ موضع القراءة');
    }
  });

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearTimeout(searchTimer);
    var q = searchInput.value.trim();
    if (q) go('#/search/' + encodeURIComponent(q));
  });

  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimer);
    var q = searchInput.value.trim();
    searchTimer = setTimeout(function () {
      if (q.length >= 2) go('#/search/' + encodeURIComponent(q));
      else if (parseRoute().name === 'search') go('#/');
    }, 300);
  });

  settingsBtn.addEventListener('click', function () {
    var open = settingsPanel.hidden;
    settingsPanel.hidden = !open;
    settingsBtn.setAttribute('aria-expanded', String(open));
  });

  settingsPanel.addEventListener('click', function (event) {
    var btn = event.target.closest('button');
    if (!btn) return;

    if (btn.dataset.themeValue) {
      window.Store.set('theme', btn.dataset.themeValue);
      applySettings();
    } else if (btn.dataset.viewValue) {
      window.Store.set('view', btn.dataset.viewValue);
      applySettings();
      if (parseRoute().name === 'surah') render();
    } else if (btn.id === 'fontPlus') {
      changeFont(FONT_STEP);
    } else if (btn.id === 'fontMinus') {
      changeFont(-FONT_STEP);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (!settingsPanel.hidden) {
        settingsPanel.hidden = true;
        settingsBtn.setAttribute('aria-expanded', 'false');
      }
      hideAyahBar();
      return;
    }

    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (event.key === '/' && !typing) {
      event.preventDefault();
      searchInput.focus();
      return;
    }
    if (typing || event.ctrlKey || event.metaKey || event.altKey) return;

    var route = parseRoute();
    if (route.name !== 'surah') return;
    // في الاتجاه من اليمين لليسار: السهم الأيسر يتقدّم، والأيمن يرجع
    if (event.key === 'ArrowLeft' && route.surah < 114) go('#/surah/' + (route.surah + 1));
    else if (event.key === 'ArrowRight' && route.surah > 1) go('#/surah/' + (route.surah - 1));
  });

  window.addEventListener('hashchange', render);

  /* ===== الإقلاع ===== */

  // آية التذييل: ﴿إنا نحن نزلنا الذكر وإنا له لحافظون﴾ — الحجر ٩
  document.getElementById('footerAyah').textContent = '﴿ ' + ayahText(15, 9) + ' ﴾';

  applySettings();
  render();

  /*
   * تسجيل عامل الخدمة ليعمل التطبيق بدون إنترنت وليصبح قابلاً للتثبيت على الجوال.
   * لا يعمل عند فتح الملف مباشرة من القرص (file://) وهذا متوقّع.
   */
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {
        /* التخزين للعمل دون اتصال غير متاح — التطبيق يعمل كالمعتاد */
      });
    });
  }
})();
