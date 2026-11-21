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
    var labels = { budget: 'Budget', family: 'Family-friendly', premium: 'Premium', luxury: 'Premium' };
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

  /* ---- Hotel directory filters (collection pages) ------------------------ */
  // All matching hotels are already in the HTML; this only hides/shows cards.
  var filterForm = document.querySelector('[data-hotel-filters]');
  var hotelList = document.querySelector('[data-hotel-list]');
  if (filterForm && hotelList) {
    filterForm.hidden = false;
    var items = Array.prototype.slice.call(hotelList.children);
    var total = items.length;
    var countEl = document.querySelector('[data-results-count]');
    var noResults = document.querySelector('[data-no-results]');
    var q = new URLSearchParams(window.location.search);
    // Filters requested in the URL for which this page has no control (e.g. one budget band only)
    var extra = { budget: '', family: false };

    var control = function (name) {
      return filterForm.elements.namedItem(name);
    };
    var setSelect = function (name, value) {
      var s = control(name);
      if (!value) return false;
      if (!s || !s.options) return false;
      for (var i = 0; i < s.options.length; i++) {
        if (s.options[i].value === value) {
          s.value = value;
          return true;
        }
      }
      return false;
    };
    var checkboxes = function (name) {
      return Array.prototype.slice.call(filterForm.querySelectorAll('input[type="checkbox"][name="' + name + '"]'));
    };

    var read = function () {
      var location = control('location') ? control('location').value : '';
      var budgetCtl = control('budget');
      var familyBox = checkboxes('family')[0];
      return {
        location: location,
        budget: budgetCtl ? budgetCtl.value : extra.budget,
        family: familyBox ? familyBox.checked : extra.family,
        facilities: checkboxes('facility')
          .filter(function (c) { return c.checked; })
          .map(function (c) { return c.value; })
      };
    };

    var apply = function (updateUrl) {
      var f = read();
      var shown = 0;
      items.forEach(function (li) {
        var card = li.querySelector('[data-hotel]');
        var have = (card.getAttribute('data-facilities') || '').split(' ');
        var suitable = (card.getAttribute('data-suitable') || '').split(' ');
        var ok =
          (!f.location || card.getAttribute('data-area') === f.location) &&
          (!f.budget || card.getAttribute('data-band') === f.budget) &&
          (!f.family || suitable.indexOf('family') !== -1) &&
          f.facilities.every(function (x) { return have.indexOf(x) !== -1; });
        li.hidden = !ok;
        if (ok) shown++;
      });
      countEl.textContent =
        shown === total
          ? total + ' verified hotel' + (total === 1 ? '' : 's')
          : 'Showing ' + shown + ' of ' + total + ' verified hotels';
      noResults.hidden = shown !== 0;
      if (updateUrl && window.history && window.history.replaceState) {
        var p = new URLSearchParams();
        if (f.location) p.set('location', f.location);
        if (f.budget) p.set('budget', f.budget);
        if (f.family) p.set('family', '1');
        if (f.facilities.length) p.set('facility', f.facilities.join(','));
        var qs = p.toString();
        window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
      }
    };

    // Initial state from the URL. Also understands the homepage search's ?type=.
    var type = q.get('type') === 'luxury' ? 'premium' : q.get('type');
    setSelect('location', q.get('location') || q.get('area'));
    var wantBudget = q.get('budget') || (type === 'budget' || type === 'premium' ? type : '');
    if (wantBudget && !setSelect('budget', wantBudget) && !control('budget')) extra.budget = wantBudget;
    if (q.get('family') === '1' || type === 'family') {
      if (checkboxes('family')[0]) checkboxes('family')[0].checked = true;
      else extra.family = true;
    }
    (q.get('facility') || '').split(',').forEach(function (v) {
      checkboxes('facility').forEach(function (c) { if (c.value === v) c.checked = true; });
    });

    filterForm.addEventListener('change', function () { apply(true); });
    filterForm.addEventListener('reset', function () {
      extra = { budget: '', family: false };
      window.setTimeout(function () { apply(true); }, 0);
    });
    var clearBtn = document.querySelector('[data-clear-filters]');
    if (clearBtn) clearBtn.addEventListener('click', function () { filterForm.reset(); });
    apply(false);
  }
})();
