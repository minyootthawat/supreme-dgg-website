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

  // ---------- Project filter + pagination ----------
  // "ทั้งหมด" (all) matches every card; any other filter matches only the
  // cards tagged with it. The matching set is then sliced into pages of
  // PAGE_SIZE; pagination controls are (re)built to fit whatever the
  // current filter yields.
  var filterBar = document.getElementById('filter-bar');
  var paginationEl = document.getElementById('projects-pagination');
  var projectsSection = document.getElementById('projects');
  var projectCards = Array.prototype.slice.call(
    document.querySelectorAll('#projects-grid .project-card')
  );
  var PAGE_SIZE = 6;
  var currentFilter = 'ทั้งหมด';
  var currentPage = 1;

  function getFiltered() {
    return projectCards.filter(function (card) {
      return currentFilter === 'ทั้งหมด' || card.dataset.tag === currentFilter;
    });
  }

  function renderProjects() {
    var filtered = getFiltered();
    var totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    var start = (currentPage - 1) * PAGE_SIZE;
    var pageSet = filtered.slice(start, start + PAGE_SIZE);
    projectCards.forEach(function (card) {
      card.hidden = pageSet.indexOf(card) === -1;
    });
    renderPagination(totalPages);
  }

  function goToPage(page) {
    currentPage = page;
    renderProjects();
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderPagination(totalPages) {
    if (!paginationEl) return;
    paginationEl.innerHTML = '';
    if (totalPages <= 1) return;

    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.textContent = 'ก่อนหน้า';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', function () { goToPage(currentPage - 1); });
    paginationEl.appendChild(prevBtn);

    for (var i = 1; i <= totalPages; i++) {
      (function (page) {
        var pageBtn = document.createElement('button');
        pageBtn.type = 'button';
        pageBtn.textContent = String(page);
        if (page === currentPage) {
          pageBtn.classList.add('is-active');
          pageBtn.setAttribute('aria-current', 'page');
        } else {
          pageBtn.addEventListener('click', function () { goToPage(page); });
        }
        paginationEl.appendChild(pageBtn);
      })(i);
    }

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.textContent = 'ถัดไป';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', function () { goToPage(currentPage + 1); });
    paginationEl.appendChild(nextBtn);
  }

  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('is-active');
      });
      btn.classList.add('is-active');
      currentFilter = btn.dataset.filter;
      currentPage = 1;
      renderProjects();
    });
  }

  renderProjects();

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
