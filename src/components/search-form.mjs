import { esc, icon } from './_lib.mjs';

/**
 * Hotel discovery search. Static categories only — it routes to collection
 * pages; it never queries live prices or availability.
 * Without JS the form GETs /hotels/?area=…&type=…; with JS (main.js) it routes
 * to clean URLs such as /hotels/near-ram-ghat/?type=budget.
 */
export default function searchForm({ data }) {
  const areaOptions = data.areas
    .map((a) => `<option value="${esc(a.slug)}">${esc(a.searchLabel)}</option>`)
    .join('');
  const typeOptions = data.stayTypes.map((t) => `<option value="${esc(t.value)}">${esc(t.label)}</option>`).join('');
  const quick = data.categories
    .map((c) => `<a href="${c.url}">${esc(c.short)}</a>`)
    .join('');

  return `<div class="search-panel" role="search">
  <h2 class="search-panel__title" id="search-title">Where would you like to stay?</h2>
  <form class="search-form" action="/hotels/" method="get" aria-labelledby="search-title" data-search-form>
    <div class="field">
      <label class="field__label" for="search-area">${icon('pin')}Area</label>
      <select class="select" id="search-area" name="area">
        <option value="">Anywhere in Ujjain</option>${areaOptions}
      </select>
    </div>
    <div class="field">
      <label class="field__label" for="search-type">${icon('bed')}Type of stay</label>
      <select class="select" id="search-type" name="type">
        <option value="">Any type</option>${typeOptions}
      </select>
    </div>
    <button class="btn btn--dark search-form__submit" type="submit">${icon('search')}Find stays</button>
  </form>
  <p class="search-panel__note">${icon('info')}<span>We help you discover and compare places to stay. Prices and availability are always confirmed directly with the hotel or booking partner.</span></p>
</div>
<nav class="quick-links" aria-label="Popular searches"><span class="quick-links__label">Popular:</span>${quick}</nav>`;
}
