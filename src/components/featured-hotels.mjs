import { esc, icon, whatsappHref, whatsappRel } from './_lib.mjs';

/**
 * Reusable hotel card. Renders real listings later (data/hotels/*.json);
 * today it renders data/sample-hotels.json, which is always labelled SAMPLE.
 */
export function hotelCard(site, h) {
  const badges = [
    h.sample ? '<span class="badge badge--sample">Sample</span>' : '',
    h.featured ? '<span class="badge badge--featured">Featured · Paid</span>' : '',
  ].join('');
  const tone = h.tone && h.tone !== 'teal' ? ` placeholder-art--${h.tone}` : '';
  const highlights = (h.highlights ?? []).map((x) => `<li class="chip">${esc(x)}</li>`).join('');
  const label = h.sample ? `${h.name} (sample listing)` : h.name;
  const message = `Namaste! I found ${h.name} on ${site.domainLabel} and would like to enquire about a stay.`;

  return `<article class="card hotel-card"${h.sample ? ' data-sample="true"' : ''}>
  <div class="media hotel-card__media">
    <div class="placeholder-art${tone}"><span class="placeholder-art__label">${icon('bed')}Photo coming soon</span></div>
    <div class="hotel-card__badges">${badges}</div>
  </div>
  <div class="hotel-card__body">
    <p class="hotel-card__area">${icon('pin')}${esc(h.area)} · ${esc(h.type)}</p>
    <h3 class="hotel-card__name">${esc(h.name)}</h3>
    <p class="hotel-card__summary">${esc(h.summary)}</p>
    <ul class="chip-list" role="list" aria-label="Highlights">${highlights}</ul>
    <p class="hotel-card__meta">${icon('walk')}${esc(h.distanceNote)}</p>
    <div class="hotel-card__footer">
      <p class="hotel-card__price"><strong>${esc(h.priceNote)}</strong>No live prices shown</p>
      <div class="hotel-card__actions">
        <a class="btn btn--whatsapp btn--sm" href="${whatsappHref(site, message)}"${whatsappRel(site)} aria-label="Enquire about ${esc(label)} on WhatsApp">${icon('whatsapp')}Enquire</a>
        <a class="btn btn--ghost btn--sm" href="${h.url}" aria-label="View details: ${esc(label)}">Details</a>
      </div>
    </div>
  </div>
</article>`;
}

/**
 * Featured section body. Sample cards appear only in local design builds
 * (site.showSamples, set by scripts/build.mjs). On every Netlify URL, the live
 * site and Deploy Previews, an honest "coming soon" card is shown instead.
 */
export default function featuredHotels({ site, data }) {
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
