/* ══════════════════════════════════════════════════════════════════
   刘松鸣 · 个人主页交互脚本
   原生 JavaScript，无任何依赖。
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root = document.documentElement;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. 深浅色主题 ───────────────────────────────────────────── */
  var THEME_KEY = 'theme';
  var themeBtn = document.querySelector('.theme-toggle');

  /* data-theme="auto"（或未设置）时跟随系统，否则固定为声明的主题 */
  var htmlTheme = root.getAttribute('data-theme');
  var followSystem = !htmlTheme || htmlTheme === 'auto';

  function syncThemeMeta() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#0b1a12' : '#eef8e6');
    if (themeBtn) {
      var label = isDark ? '切换到浅色主题' : '切换到深色主题';
      themeBtn.setAttribute('aria-label', label);
      themeBtn.setAttribute('title', label);
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 忽略 */ }
      syncThemeMeta();
    });
  }
  syncThemeMeta();

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (err) { /* 忽略 */ }
    if (saved || !followSystem) return;
    root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    syncThemeMeta();
  });

  /* ── 2. 轻提示 ───────────────────────────────────────────────── */
  var toast = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 2000);
  }

  /* ── 3. 移动端菜单 ───────────────────────────────────────────── */
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  function closeMenu() {
    if (!header) return;
    header.classList.remove('menu-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', '打开菜单');
    }
  }

  if (header && navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    });

    navMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 780) closeMenu();
    });
  }

  /* ── 4. 打字机 ───────────────────────────────────────────────── */
  var typedEl = document.getElementById('typed');
  var ROLES = ['山脉', '湖泊', '旅行', '猫'];

  if (typedEl) {
    if (prefersReduced) {
      typedEl.textContent = ROLES[0];
    } else {
      var roleIndex = 0;
      var charIndex = 0;
      var deleting = false;

      (function tick() {
        var word = ROLES[roleIndex];
        charIndex += deleting ? -1 : 1;
        typedEl.textContent = word.slice(0, charIndex);

        var delay = deleting ? 90 : 190;
        if (!deleting && charIndex === word.length) {
          deleting = true;
          delay = 1600;
        } else if (deleting && charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % ROLES.length;
          delay = 320;
        }
        window.setTimeout(tick, delay);
      })();
    }
  }

  /* ── 5. 滚动揭示 + 技能条 ───────────────────────────────────── */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReduced) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── 6. 导航高亮 / 顶栏 / 回到顶部 ──────────────────────────── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  var toTop = document.querySelector('.to-top');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('scrolled', y > 10);
    if (toTop) toTop.classList.toggle('show', y > 480);

    var current = null;
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= 130) current = sec.id;
    });

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + current;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });

  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ── 7. 复制邮箱 ─────────────────────────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach(function (el) {
    el.addEventListener('click', function () {
      var text = el.getAttribute('data-copy');

      function done() { showToast('已复制：' + text); }

      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); }
        catch (e) { showToast('复制失败，请手动选择：' + text); }
        document.body.removeChild(ta);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    });
  });

  /* ── 8. 彩蛋：点插画里的小猫 ────────────────────────────────── */
  var sceneFrame = document.querySelector('.scene-frame');
  if (sceneFrame) {
    sceneFrame.addEventListener('click', function () {
      if (navToggle && header.classList.contains('menu-open')) closeMenu();
      showToast('喵～ 它说：下次一起去山里吧');
    });
  }

  /* ── 9. 页脚年份 ─────────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
