// SUPREME DGG — Homepage interactions
// Reimplements the state logic from the original .dc.html canvas
// (header scroll state, mobile menu, system stage picker, project filter,
// reveal-on-scroll, contact form fake-submit) in plain JS.

(function () {
  'use strict';

  // ---------- Header scroll state ----------
  var header = document.getElementById('site-header');
  function onScroll() {
    var scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobile-menu');
  function setMenu(open) {
    mobileMenu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    header.classList.toggle('is-menu-open', open);
  }
  burger.addEventListener('click', function () {
    setMenu(mobileMenu.hidden);
  });
  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1140) setMenu(false);
  });

  // ---------- Reveal on scroll ----------
  var revealTargets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Complete-system stage picker ----------
  var stagePicker = document.getElementById('stage-picker');
  var stageStepEl = document.getElementById('stage-step');
  var stageLabelEl = document.getElementById('stage-label');
  var stageDetailEl = document.getElementById('stage-detail-text');
  if (stagePicker) {
    stagePicker.addEventListener('click', function (e) {
      var btn = e.target.closest('.stage-btn');
      if (!btn) return;
      stagePicker.querySelectorAll('.stage-btn').forEach(function (b) {
        b.classList.remove('is-active');
      });
      btn.classList.add('is-active');
      var index = parseInt(btn.dataset.index, 10) + 1;
      stageStepEl.textContent = 'STEP ' + String(index).padStart(2, '0');
      stageLabelEl.textContent = btn.dataset.label;
      stageDetailEl.textContent = btn.dataset.detail;
    });
  }

  // ---------- Project filter ----------
  // Matches the source design: "ทั้งหมด" (all) shows only the first three
  // cards, any other filter shows the cards tagged with that filter.
  var filterBar = document.getElementById('filter-bar');
  var projectCards = Array.prototype.slice.call(
    document.querySelectorAll('#projects-grid .project-card')
  );
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('is-active');
      });
      btn.classList.add('is-active');
      var filter = btn.dataset.filter;
      projectCards.forEach(function (card, i) {
        var show = filter === 'ทั้งหมด' ? i < 3 : card.dataset.tag === filter;
        card.hidden = !show;
      });
    });
  }

  // ---------- Contact form (no backend — local success state only) ----------
  var form = document.getElementById('project-form');
  var successPanel = document.getElementById('form-success');
  var resetBtn = document.getElementById('form-reset');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.hidden = true;
      successPanel.hidden = false;
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      successPanel.hidden = true;
      form.hidden = false;
    });
  }
})();
