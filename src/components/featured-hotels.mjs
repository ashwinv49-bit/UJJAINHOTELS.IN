import { esc, icon, whatsappHref, whatsappRel } from './_lib.mjs';

/**
 * Shared hotel card markup. `m` is a card model:
 * { name, url, areaLine, summary, chips[], metaIcon, metaText, priceStrong, priceSub,
 *   featured, badge ('sample'|'placeholder'|null), tone, photo, telHref, phoneLabel,
 *   whatsappHref, whatsappExternal, attrs{} }
 * The whole card links to the profile (card__link); Call/WhatsApp sit above that link.
 */
function renderCard(m) {
  const badges = [
    m.badge === 'sample' ? '<span class="badge badge--sample">Sample</span>' : '',
    m.badge === 'placeholder' ? '<span class="badge badge--sample">Placeholder</span>' : '',
    m.featured ? '<span class="badge badge--featured">Featured · Paid</span>' : '',
  ].join('');
  const tone = m.tone && m.tone !== 'teal' ? ` placeholder-art--${m.tone}` : '';
  const media = m.photo
    ? `<img src="${esc(m.photo.src)}" alt="${esc(m.photo.alt)}" width="${m.photo.width}" height="${m.photo.height}" loading="lazy" decoding="async">`
    : `<div class="placeholder-art${tone}"><span class="placeholder-art__label">${icon('bed')}Photo coming soon</span></div>`;
  const chips = (m.chips ?? []).map((x) => `<li class="chip">${esc(x)}</li>`).join('');
  const attrs = Object.entries(m.attrs ?? {})
    .map(([k, v]) => ` ${k}="${esc(v)}"`)
    .join('');
  const rel = m.whatsappExternal ? ' rel="noopener" target="_blank"' : '';
  return `<article class="card hotel-card card--interactive"${attrs}>
  <div class="media hotel-card__media">
    ${media}
    <div class="hotel-card__badges">${badges}</div>
  </div>
  <div class="hotel-card__body">
    <p class="hotel-card__area">${icon('pin')}${esc(m.areaLine)}</p>
    <h3 class="hotel-card__name"><a class="card__link" href="${esc(m.url)}">${esc(m.name)}</a></h3>
    ${m.summary ? `<p class="hotel-card__summary">${esc(m.summary)}</p>` : ''}
    ${chips ? `<ul class="chip-list" role="list" aria-label="Facilities">${chips}</ul>` : ''}
    ${m.metaText ? `<p class="hotel-card__meta">${icon(m.metaIcon)}${esc(m.metaText)}</p>` : ''}
    <div class="hotel-card__footer">
      <p class="hotel-card__price"><strong>${esc(m.priceStrong)}</strong>${esc(m.priceSub)}</p>
      <div class="hotel-card__actions">
        ${m.telHref ? `<a class="btn btn--dark btn--sm" href="${esc(m.telHref)}" aria-label="Call ${esc(m.name)}">${icon('phone')}Call</a>` : ''}
        <a class="btn btn--whatsapp btn--sm" href="${esc(m.whatsappHref)}"${rel} aria-label="WhatsApp ${esc(m.name)}">${icon('whatsapp')}WhatsApp</a>
      </div>
    </div>
  </div>
</article>`;
}

/** Card for a published hotel (view model from scripts/lib/hotels.mjs → toViewModel). */
export function listingCard(vm) {
  const chips = vm.facilities.slice(0, 4).map((f) => f.label);
  if (vm.facilities.length > 4) chips.push(`+${vm.facilities.length - 4} more`);
  return renderCard({
    name: vm.name,
    url: vm.url,
    areaLine: [vm.areaTitle, vm.propertyTypeLabel].filter(Boolean).join(' · '),
    summary: vm.summary,
    chips,
    metaIcon: 'check-circle',
    metaText: vm.lastVerifiedLabel ? `Details verified ${vm.lastVerifiedLabel}` : '',
    priceStrong: vm.priceBandLabel || 'Price on enquiry',
    priceSub: 'Price on enquiry · no live prices shown',
    featured: vm.featured,
    badge: vm.placeholder ? 'placeholder' : null,
    photo: vm.photos[0],
    telHref: vm.telHref,
    whatsappHref: vm.whatsappHref,
    whatsappExternal: vm.whatsappHref.startsWith('https://'),
    attrs: {
      'data-hotel': vm.slug,
      'data-area': vm.area,
      'data-band': vm.priceBand,
      'data-facilities': vm.facilities.map((f) => f.slug).join(' '),
      'data-suitable': vm.suitableFor.join(' '),
      ...(vm.placeholder ? { 'data-placeholder': 'true' } : {}),
    },
  });
}

/** Design-only sample card (data/sample-hotels.json) — rendered in local builds only. */
export function hotelCard(site, h) {
  const message = `Namaste! I found ${h.name} on ${site.domainLabel} and would like to enquire about a stay.`;
  return renderCard({
    name: h.name,
    url: h.url,
    areaLine: `${h.area} · ${h.type}`,
    summary: h.summary,
    chips: h.highlights,
    metaIcon: 'walk',
    metaText: h.distanceNote,
    priceStrong: h.priceNote,
    priceSub: 'No live prices shown',
    featured: h.featured,
    badge: h.sample ? 'sample' : null,
    tone: h.tone,
    whatsappHref: whatsappHref(site, message),
    whatsappExternal: Boolean(whatsappRel(site)),
    attrs: h.sample ? { 'data-sample': 'true' } : {},
  });
}

/**
 * Homepage "Featured stays" body:
 *  1. verified featured (paid) listings, when any exist;
 *  2. otherwise, local design builds show labelled samples;
 *  3. otherwise (every Netlify build) an honest "coming soon" card.
 */
export default function featuredHotels({ site, data }) {
  const featured = data.featuredHotels ?? [];
  if (featured.length) {
    return `<ul class="card-grid card-grid--rail" role="list">${featured.map((vm) => `<li>${listingCard(vm)}</li>`).join('')}</ul>`;
  }
  if (!site.showSamples) {
    return `<div class="coming-soon featured-empty">
  <span class="badge badge--soft">Coming soon</span>
  <h3>Hotel listings coming soon</h3>
  <p>We check each hotel’s details with the property before listing it. Verified hotels will appear here.</p>
  <div class="cluster">
    <a class="btn btn--dark" href="/list-your-hotel/">List your hotel</a>
    <a class="btn btn--ghost" href="/#areas">Explore areas</a>
  </div>
</div>`;
  }
  const cards = data.sampleHotels.map((h) => `<li>${hotelCard(site, h)}</li>`).join('');
  return `<p class="notice section-notice" role="note">${icon('info')}<span><strong>Sample listings.</strong> These cards preview how hotels will be presented. They are not real hotels, and their details are placeholders.</span></p>
<ul class="card-grid card-grid--rail" role="list">${cards}</ul>`;
}
