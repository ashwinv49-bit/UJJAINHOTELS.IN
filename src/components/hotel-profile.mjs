import { esc, icon } from './_lib.mjs';

/**
 * Hotel profile page body. page.hotel is a view model from
 * scripts/lib/hotels.mjs → toViewModel(); only facts present in the verified
 * record are shown — missing data is simply left out, never filled in.
 */
export default function hotelProfile({ page }) {
  const h = page.hotel;
  const crumbs = page.crumbs
    .map((c, i, all) =>
      i === all.length - 1 ? `<li><span aria-current="page">${esc(c.name)}</span></li>` : `<li><a href="${esc(c.path)}">${esc(c.name)}</a></li>`
    )
    .join('');
  const externalWa = h.whatsappHref.startsWith('https://');

  const placeholderBanner = h.placeholder
    ? `<div class="placeholder-banner" role="note" data-placeholder="true"><div class="container"><strong>PLACEHOLDER — not a real hotel.</strong> This test page exists only in local design builds and never appears on the live website.</div></div>`
    : '';

  const badges = [
    h.featured ? '<span class="badge badge--featured">Featured · Paid</span>' : '',
    h.priceBandLabel ? `<span class="badge badge--dark-outline">${esc(h.priceBandLabel)}</span>` : '',
    h.lastVerifiedLabel ? `<span class="badge badge--verified">${icon('check-circle')}Verified ${esc(h.lastVerifiedLabel)}</span>` : '',
  ].join('');

  const affiliate = h.affiliateLinks.length
    ? `<div class="hotel-actions__partners">
    ${h.affiliateLinks
      .map(
        (l) =>
          `<a class="btn btn--ghost btn--block" href="${esc(l.url)}" rel="sponsored nofollow noopener" target="_blank">Check prices on ${esc(l.name)} ${icon('external')}<span class="partner-label">Partner link</span></a>`
      )
      .join('')}
    <p class="hotel-actions__fine">Partner links: if you book through them we may earn a commission, at no extra cost to you. <a href="/affiliate-disclosure/">Disclosure</a></p>
  </div>`
    : '';

  const actions = `<aside class="hotel-actions" aria-labelledby="contact-title">
  <h2 class="hotel-actions__title" id="contact-title">Contact the hotel</h2>
  ${h.telHref ? `<a class="btn btn--dark btn--block" href="${esc(h.telHref)}">${icon('phone')}Call ${esc(h.phoneDisplay)}</a>` : ''}
  <a class="btn btn--whatsapp btn--block" href="${esc(h.whatsappHref)}"${externalWa ? ' rel="noopener" target="_blank"' : ''}>${icon('whatsapp')}${h.whatsappTarget === 'hotel' ? 'WhatsApp the hotel' : 'Ask us on WhatsApp'}</a>
  ${h.mapsHref ? `<a class="btn btn--ghost btn--block" href="${esc(h.mapsHref)}" rel="noopener" target="_blank">${icon('directions')}Get directions</a>` : ''}
  ${affiliate}
  <p class="hotel-actions__fine">Prices and availability are confirmed directly with the hotel. We don’t take bookings or payments.</p>
  ${
    h.lastVerifiedLabel
      ? `<div class="verify-panel">${icon('shield-check')}<p><strong>Details last verified on ${esc(h.lastVerifiedLabel)}</strong> ${esc(h.verifyMethodLabel)}. <a href="/contact/">Report a correction</a></p></div>`
      : ''
  }
</aside>`;

  const gallery = h.photos.length
    ? `<div class="hotel-gallery">${h.photos
        .map(
          (p) =>
            `<figure><img src="${esc(p.src)}" alt="${esc(p.alt)}" width="${p.width}" height="${p.height}" loading="lazy" decoding="async">${p.credit ? `<figcaption>Photo: ${esc(p.credit)}</figcaption>` : ''}</figure>`
        )
        .join('')}</div>`
    : `<div class="media hotel-gallery__empty"><div class="placeholder-art"><span class="placeholder-art__label">${icon('bed')}Photos coming soon</span></div></div>`;

  const facilities = h.facilities.length
    ? `<ul class="chip-list facility-list" role="list">${h.facilities.map((f) => `<li class="chip">${icon('check-circle')}${esc(f.label)}</li>`).join('')}</ul>
       <p class="hotel-note">Facilities confirmed by the property. Please re-confirm anything essential when you enquire.</p>`
    : '<p class="hotel-note">Facilities have not been listed yet. Ask the hotel directly.</p>';

  const goodFor = h.suitableFor.includes('family') ? '<p class="hotel-goodfor">Good for: <strong>Families</strong></p>' : '';

  const distances = h.distances.length
    ? `<ul class="hotel-distances" role="list">${h.distances
        .map((d) => `<li>${icon('walk')}<span>${esc(d.km)} km to ${esc(d.label)}</span></li>`)
        .join('')}</ul>${h.distancesMethod ? `<p class="hotel-note">${esc(h.distancesMethod)}</p>` : ''}`
    : '';

  return `${placeholderBanner}
<section class="page-hero on-dark hotel-hero">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb"><ol>${crumbs}</ol></nav>
    <p class="eyebrow">${esc([h.areaTitle, h.propertyTypeLabel].filter(Boolean).join(' · '))}</p>
    <h1>${esc(h.name)}</h1>
    <div class="cluster hotel-hero__badges">${badges}</div>
  </div>
</section>

<section class="section hotel-profile">
  <div class="container hotel-profile__grid">
    ${actions}
    <div class="hotel-main">
      ${gallery}
      <section class="hotel-section" aria-labelledby="about-title">
        <h2 id="about-title">About this stay</h2>
        ${h.summary ? `<p>${esc(h.summary)}</p>` : ''}
        ${goodFor}
        <p class="hotel-price"><strong>${esc(h.priceBandLabel || 'Price')}</strong> · Price on enquiry. We never show live prices or availability.</p>
      </section>
      <section class="hotel-section" aria-labelledby="facilities-title">
        <h2 id="facilities-title">Facilities</h2>
        ${facilities}
      </section>
      <section class="hotel-section" aria-labelledby="location-title">
        <h2 id="location-title">Location</h2>
        ${h.addressLine ? `<p class="hotel-address">${icon('pin')}<span>${esc(h.addressLine)}</span></p>` : ''}
        ${distances}
        ${h.mapsHref ? `<a class="link-arrow" href="${esc(h.mapsHref)}" rel="noopener" target="_blank">Open directions in Google Maps ${icon('external')}</a>` : ''}
      </section>
      ${h.areaUrl ? `<p class="hotel-more"><a class="link-arrow" href="${esc(h.areaUrl)}">More stays in ${esc(h.areaTitle)} ${icon('arrow-right')}</a></p>` : ''}
    </div>
  </div>
</section>`;
}
