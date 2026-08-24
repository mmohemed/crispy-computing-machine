/* ==========================================================================
   CodeWay Web — سكربت عام: الثيم، القائمة، البحث، التقدّم، زر الأعلى
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- تخزين آمن (قد يكون معطّلاً في بعض المتصفحات) ---------- */
  var store = {
    get: function (k, fallback) {
      try {
        var v = localStorage.getItem(k);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); return true; }
      catch (e) { return false; }
    }
  };
  window.CW = window.CW || {};
  window.CW.store = store;

  /* ---------- الثيم ---------- */
  var THEME_KEY = 'cw:theme';
  function applyTheme(t) {
    if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }
  applyTheme(store.get(THEME_KEY, null));

  function currentTheme() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr) return attr;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store.set(THEME_KEY, next);
    btn.setAttribute('aria-label', next === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن');
  });

  /* ---------- قائمة الجوال ---------- */
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('.nav-toggle');
    var nav = document.querySelector('.main-nav');
    if (!nav) return;
    if (toggle) {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    } else if (!e.target.closest('.main-nav')) {
      nav.classList.remove('open');
      var t = document.querySelector('.nav-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- تقدّم المتعلّم ---------- */
  var PROGRESS_KEY = 'cw:progress';
  var progress = store.get(PROGRESS_KEY, {});

  var Progress = {
    all: function () { return progress; },
    isDone: function (id) { return !!progress[id]; },
    set: function (id, done) {
      if (done) progress[id] = Date.now();
      else delete progress[id];
      store.set(PROGRESS_KEY, progress);
    },
    countIn: function (track) {
      var n = 0;
      for (var k in progress) if (Object.prototype.hasOwnProperty.call(progress, k) && k.indexOf(track + '/') === 0) n++;
      return n;
    },
    reset: function () { progress = {}; store.set(PROGRESS_KEY, progress); }
  };
  window.CW.progress = Progress;

  /* ---------- تمييز الدروس المكتملة في صفحة المسار ---------- */
  var lessonCards = document.querySelectorAll('[data-lesson-id]');
  lessonCards.forEach(function (card) {
    if (Progress.isDone(card.getAttribute('data-lesson-id'))) card.classList.add('is-done');
  });

  /* ---------- شريط تقدّم المسار ---------- */
  document.querySelectorAll('[data-track-progress]').forEach(function (el) {
    var track = el.getAttribute('data-track-progress');
    var total = parseInt(el.getAttribute('data-total'), 10) || 0;
    var done = Progress.countIn(track);
    var pct = total ? Math.round((done / total) * 100) : 0;
    var fill = el.querySelector('.progress-bar-fill');
    var label = el.querySelector('[data-progress-label]');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = 'أكملت ' + done + ' من ' + total + ' درساً (' + pct + '%)';
  });

  /* ---------- البحث داخل الشبكات ---------- */
  document.querySelectorAll('[data-search-for]').forEach(function (input) {
    var scope = document.querySelector(input.getAttribute('data-search-for'));
    if (!scope) return;
    var empty = document.querySelector('.no-results');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var visible = 0;
      scope.querySelectorAll('[data-search-text]').forEach(function (item) {
        var hit = !q || item.getAttribute('data-search-text').toLowerCase().indexOf(q) !== -1;
        item.style.display = hit ? '' : 'none';
        if (hit) visible++;
      });
      if (empty) empty.style.display = visible ? 'none' : 'block';
    });
  });

  /* ---------- زر العودة للأعلى ---------- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
  }

  /* ---------- سنة الفوتر ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
