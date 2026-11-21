import { esc, icon } from './_lib.mjs';

export default function categoryGrid({ data }) {
  const items = data.categories
    .map(
      (c) => `<li><article class="card card--interactive category-card">
  <span class="category-card__icon">${icon(c.icon)}</span>
  <div>
    <h3 class="category-card__title"><a class="card__link" href="${c.url}">${esc(c.title)}</a></h3>
    <p class="category-card__summary">${esc(c.summary)}</p>
  </div>
  <span class="category-card__arrow">${icon('arrow-right')}</span>
</article></li>`
    )
    .join('');
  return `<ul class="category-grid" role="list">${items}</ul>`;
}
