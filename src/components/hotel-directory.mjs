import { esc, icon } from './_lib.mjs';
import { listingCard } from './featured-hotels.mjs';
import { partnerBlock } from './partner-links.mjs';

/**
 * Collection page body (/hotels/, categories, areas).
 * Current phase (owner, 25 Nov 2026): affiliate links only — every page shows
 * the partner booking block. Hotel listings are dormant: the hotel list below
 * only appears if verified hotel records are ever added again. Every matching
 * hotel is rendered into the HTML (works without JS, good for SEO); the filter
 * form is revealed by main.js and only hides/shows cards.
 */
export default function hotelDirectory({ page, data }) {
  const c = page.collection;
  const hotels = c.hotels;
  const crumbs = page.crumbs
    .map((x, i, all) =>
      i === all.length - 1 ? `<li><span aria-current="page">${esc(x.name)}</span></li>` : `<li><a href="${esc(x.path)}">${esc(x.name)}</a></li>`
    )
    .join('');

  const hero = `<section class="page-hero on-dark">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb"><ol>${crumbs}</ol></nav>
    <h1>${esc(c.heading)}</h1>
    ${c.intro ? `<p>${esc(c.intro)}</p>` : ''}
  </div>
</section>`;

  const partners = `<section class="section partner-section">
  <div class="container container--narrow">
    ${partnerBlock(c.partnerLinks ?? [], c)}
  </div>
</section>`;

  if (!hotels.length) return `${hero}\n${partners}`;

  // Only offer filters that can change the result on this page.
  const rule = c.rule ?? {};
  const areaOptions = (data.areas ?? []).filter((a) => hotels.some((h) => h.area === a.slug));
  const bandOptions = [
    ['budget', 'Budget'],
    ['mid', 'Mid-range'],
    ['premium', 'Premium'],
  ].filter(([v]) => hotels.some((h) => h.priceBand === v));
  const facilityOptions = (data.facilities ?? []).filter((f) => hotels.some((h) => h.facilities.some((x) => x.slug === f.slug)));
  const showFamily = !rule.suitableFor && hotels.some((h) => h.suitableFor.includes('family'));

  const locationField =
    !rule.area && areaOptions.length > 1
      ? `<div class="field">
      <label class="field__label" for="f-location">${icon('pin')}Location</label>
      <select class="select" id="f-location" name="location"><option value="">All areas</option>${areaOptions
        .map((a) => `<option value="${esc(a.slug)}">${esc(a.title)}</option>`)
        .join('')}</select>
    </div>`
      : '';
  const budgetField =
    !rule.priceBand && bandOptions.length > 1
      ? `<div class="field">
      <label class="field__label" for="f-budget">${icon('wallet')}Budget category</label>
      <select class="select" id="f-budget" name="budget"><option value="">Any budget</option>${bandOptions
        .map(([v, l]) => `<option value="${v}">${l}</option>`)
        .join('')}</select>
    </div>`
      : '';
  const checks = [
    ...(showFamily ? [['family', 'Good for families', 'family']] : []),
    ...facilityOptions.map((f) => [f.slug, f.label, 'facility']),
  ];
  const facilityField = checks.length
    ? `<fieldset class="filter-checks">
      <legend class="field__label">${icon('check-circle')}Facilities</legend>
      <div class="filter-checks__list">${checks
        .map(
          ([v, l, kind]) =>
            `<label class="check-chip"><input type="checkbox" name="${kind === 'family' ? 'family' : 'facility'}" value="${esc(v)}"><span>${esc(l)}</span></label>`
        )
        .join('')}</div>
    </fieldset>`
    : '';

  const hasFilters = locationField || budgetField || facilityField;
  const filters = hasFilters
    ? `<form class="hotel-filters" data-hotel-filters hidden aria-label="Filter hotels">
    <div class="hotel-filters__row">${locationField}${budgetField}</div>
    ${facilityField}
    <button class="btn btn--ghost btn--sm hotel-filters__reset" type="reset">Clear filters</button>
  </form>`
    : '';

  const word = (n) => `${n} verified hotel${n === 1 ? '' : 's'}`;
  return `${hero}
${partners}
<section class="section hotel-directory">
  <div class="container">
    ${filters}
    <h2 class="visually-hidden">Hotels</h2>
    <p class="hotel-results__count" data-results-count data-total="${hotels.length}" aria-live="polite">${word(hotels.length)}</p>
    <ul class="card-grid" role="list" data-hotel-list>${hotels.map((h) => `<li>${listingCard(h)}</li>`).join('')}</ul>
    <div class="coming-soon hotel-no-results" data-no-results hidden>
      <h2>No hotels match these filters</h2>
      <p>Try removing a filter. We only list hotels whose details we have checked with the property.</p>
      <div class="cluster"><button class="btn btn--dark" type="button" data-clear-filters>Clear filters</button></div>
    </div>
    <p class="hotel-note hotel-directory__note">${icon('info')}<span>Featured listings are paid placements and are always labelled. Prices and availability are confirmed directly with each hotel.</span></p>
  </div>
</section>`;
}
