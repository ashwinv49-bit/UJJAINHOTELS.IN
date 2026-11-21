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

export default function featuredHotels({ site, data }) {
  const cards = data.sampleHotels.map((h) => `<li>${hotelCard(site, h)}</li>`).join('');
  return `<ul class="card-grid card-grid--rail" role="list">${cards}</ul>`;
}
