/* HotelsUjjain.in — progressive enhancement only.
   Every feature here has a no-JS fallback: the nav is visible, the search
   form submits as a normal GET request, and stub pages read fine. */
(function () {
  'use strict';

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.hidden = false;
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.setAttribute('data-open', String(open));
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
  }

  /* ---- Header shadow once the page scrolls ------------------------------ */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Discovery search: route to clean collection URLs ----------------- */
  // Static categories only. No live availability or prices are queried.
  var form = document.querySelector('[data-search-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      var area = form.elements.area.value;
      var type = form.elements.type.value;
      var url = '/hotels/';
      if (area) url = '/hotels/' + area + '/' + (type ? '?type=' + encodeURIComponent(type) : '');
      else if (type) url = '/hotels/' + type + '/';
      e.preventDefault();
      window.location.assign(url);
    });
  }

  /* ---- Stub pages: acknowledge what the visitor searched for ------------ */
  var echo = document.querySelector('[data-search-echo]');
  if (echo && window.location.search) {
    var params = new URLSearchParams(window.location.search);
    var labels = { budget: 'Budget', family: 'Family-friendly', luxury: 'Luxury' };
    var type = labels[params.get('type')];
    var areaSel = params.get('area');
    var parts = [];
    if (type) parts.push(type + ' stays');
    if (areaSel) parts.push('in the selected area');
    if (parts.length) {
      echo.textContent = 'You searched for: ' + parts.join(' ') + '. Listings for this search are not published yet.';
      echo.hidden = false;
    }
  }
})();
