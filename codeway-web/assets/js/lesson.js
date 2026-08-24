/* ==========================================================================
   CodeWay Web — سكربت صفحة الدرس: نسخ الكود، الاختبار، الفهرس، التقدّم
   ========================================================================== */
(function () {
  'use strict';

  var CW = window.CW || {};

  /* ---------- نسخ الكود ---------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;
    var block = btn.closest('.code-block');
    var code = block && block.querySelector('pre');
    if (!code) return;

    var text = code.innerText;
    var done = function () {
      var original = btn.innerHTML;
      btn.classList.add('done');
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> تم النسخ';
      setTimeout(function () { btn.classList.remove('done'); btn.innerHTML = original; }, 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }

    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (err) { /* تجاهل */ }
      document.body.removeChild(ta);
    }
  });

  /* ---------- الاختبار ---------- */
  document.querySelectorAll('.quiz').forEach(function (quiz) {
    var items = quiz.querySelectorAll('.q-item');
    var checkBtn = quiz.querySelector('[data-quiz-check]');
    var resetBtn = quiz.querySelector('[data-quiz-reset]');
    var result = quiz.querySelector('.quiz-result');
    if (!checkBtn) return;

    checkBtn.addEventListener('click', function () {
      var score = 0, unanswered = 0;

      items.forEach(function (item) {
        var chosen = item.querySelector('input:checked');
        if (!chosen) { unanswered++; return; }
        item.classList.add('answered');
        item.querySelectorAll('.q-option').forEach(function (opt) {
          var input = opt.querySelector('input');
          if (input.value === 'correct') opt.classList.add('correct');
          else if (input.checked) opt.classList.add('wrong');
        });
        if (chosen.value === 'correct') score++;
      });

      if (unanswered === items.length) {
        result.className = 'quiz-result show fail';
        result.textContent = 'اختر إجابة واحدة على الأقل قبل التحقق.';
        return;
      }

      var total = items.length;
      var pct = Math.round((score / total) * 100);
      result.className = 'quiz-result show ' + (pct >= 70 ? 'pass' : 'fail');
      result.textContent = pct >= 70
        ? '🎉 ممتاز! أجبت بشكل صحيح على ' + score + ' من ' + total + ' (' + pct + '٪).'
        : 'أجبت على ' + score + ' من ' + total + ' (' + pct + '٪). راجع الشرح أعلاه ثم أعد المحاولة.';
      result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        items.forEach(function (item) {
          item.classList.remove('answered');
          item.querySelectorAll('.q-option').forEach(function (o) { o.classList.remove('correct', 'wrong'); });
          item.querySelectorAll('input').forEach(function (i) { i.checked = false; });
        });
        result.className = 'quiz-result';
        result.textContent = '';
      });
    }
  });

  /* ---------- فهرس الدرس: تمييز القسم الحالي ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    var targets = [];
    tocLinks.forEach(function (a) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) { map[el.id] = a; targets.push(el); }
    });

    var visible = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });
      var firstVisible = targets.find(function (t) { return visible.has(t.id); });
      if (!firstVisible) return;
      tocLinks.forEach(function (a) { a.classList.remove('active'); });
      map[firstVisible.id].classList.add('active');
    }, { rootMargin: '-90px 0px -70% 0px', threshold: 0 });

    targets.forEach(function (t) { observer.observe(t); });
  }

  /* ---------- شريط تقدّم القراءة ---------- */
  var bar = document.querySelector('.read-progress');
  if (bar) {
    var update = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? window.scrollY / h : 0;
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)) + ')';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- تعليم الدرس كمكتمل ---------- */
  var markBtn = document.querySelector('.mark-done');
  if (markBtn && CW.progress) {
    var id = markBtn.getAttribute('data-lesson-id');
    var labelDone = 'تم إكمال هذا الدرس ✓';
    var labelTodo = 'تعليم الدرس كمكتمل';

    var render = function () {
      var done = CW.progress.isDone(id);
      markBtn.classList.toggle('is-done', done);
      markBtn.querySelector('[data-label]').textContent = done ? labelDone : labelTodo;
      markBtn.setAttribute('aria-pressed', String(done));
    };
    render();

    markBtn.addEventListener('click', function () {
      CW.progress.set(id, !CW.progress.isDone(id));
      render();
      renderRing();
    });
  }

  /* ---------- حلقة تقدّم المسار في الشريط الجانبي ---------- */
  function renderRing() {
    var ring = document.querySelector('[data-ring]');
    if (!ring || !CW.progress) return;
    var track = ring.getAttribute('data-track');
    var total = parseInt(ring.getAttribute('data-total'), 10) || 1;
    var done = CW.progress.countIn(track);
    var pct = Math.round((done / total) * 100);

    var circle = ring.querySelector('.ring-fg');
    var r = circle.r.baseVal.value;
    var c = 2 * Math.PI * r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c * (1 - pct / 100);

    var label = ring.querySelector('.ring-label');
    if (label) label.textContent = pct + '٪';
    var text = ring.parentNode.querySelector('[data-ring-text]');
    if (text) text.textContent = 'أكملت ' + done + ' من ' + total + ' درساً';
  }
  renderRing();

  /* ---------- ضبط ارتفاع إطارات العرض الحي ----------
     الإطار معزول (sandbox) فلا يمكن قراءة مستنده مباشرة،
     لذا يرسل هو ارتفاعه عبر postMessage ونستقبله هنا. */
  var frames = Array.prototype.slice.call(document.querySelectorAll('.demo iframe'));
  if (frames.length) {
    window.addEventListener('message', function (e) {
      if (!e.data || typeof e.data.cwHeight !== 'number') return;
      for (var i = 0; i < frames.length; i++) {
        if (frames[i].contentWindow === e.source) {
          frames[i].style.height = Math.max(60, e.data.cwHeight + 4) + 'px';
          return;
        }
      }
    });
  }
})();
