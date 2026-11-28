import { esc, icon } from './_lib.mjs';

/**
 * "Check hotels on trusted booking sites" block for area/category pages.
 * links: from scripts/lib/partner-links.mjs → partnerLinksFor() — only tracked,
 * enabled, host-checked partner links ever reach this component.
 * Rules (CLAUDE.md): "Check prices on [Partner]" wording, a visible
 * "Partner link" label, rel="sponsored nofollow noopener", disclosure beside
 * the buttons, never a price and never "Book now".
 */
export function partnerBlock(links, c = {}) {
  const scopeLabel = c.searchLabel ?? c.short ?? (c.kind === 'all' ? 'All Ujjain' : c.heading ?? '');

  if (!links.length) {
    const second =
      c.kind === 'all'
        ? ''
        : '<a class="btn btn--ghost" href="/hotels/">All hotel pages</a>';
    return `<div class="coming-soon partner-block partner-block--soon" data-partner-soon>
  <span class="badge badge--soft">Coming soon</span>
  <h2>Booking partner links are coming soon</h2>
  <p>We are setting up links to trusted booking sites, so you can compare rooms, photos and prices for this part of Ujjain. Meanwhile, explore the other areas.</p>
  <div class="cluster">
    <a class="btn btn--dark" href="/#areas">Explore areas</a>
    ${second}
  </div>
</div>`;
  }

  const items = links
    .map(
      (l) => `<li class="partner-item">
      <a class="btn btn--ghost btn--block" href="${esc(l.url)}" rel="sponsored nofollow noopener" target="_blank" data-partner="${esc(l.partner)}">Check prices on ${esc(l.name)} ${icon('external')}<span class="partner-label">Partner link</span></a>
      <span class="partner-item__scope">${l.scope === 'area' && scopeLabel ? esc(scopeLabel) : 'All Ujjain hotels'}</span>
    </li>`
    )
    .join('');

  return `<div class="partner-block" data-partner-block>
  <h2>Check hotels on trusted booking sites</h2>
  <p>Compare rooms, photos, guest reviews and prices on these booking sites. You book and pay there, not with us.</p>
  <ul class="partner-list" role="list">${items}</ul>
  <p class="hotel-note">${icon('info')}<span>Partner links: if you book through them we may earn a commission, at no extra cost to you. Prices and availability are shown on the partner’s site. <a href="/affiliate-disclosure/">Disclosure</a></span></p>
</div>`;
}

/** Template use: {{> partner-links }} on a collection page. */
export default function partnerLinks({ page }) {
  const c = page.collection ?? {};
  return partnerBlock(c.partnerLinks ?? [], c);
}
