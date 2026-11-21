/**
 * Shared helpers for components. Files starting with "_" are not templates.
 */

export const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Inline icon from the sprite (see icons.mjs). Decorative by default. */
export const icon = (name, cls = '') =>
  `<svg class="icon${cls ? ` ${cls}` : ''}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

/**
 * WhatsApp enquiry link. Until a business number is configured in
 * data/site.json (contact.whatsapp, format 91XXXXXXXXXX), links go to /contact/.
 */
export function whatsappHref(site, message) {
  const number = site.contact?.whatsapp;
  if (!number) return '/contact/';
  return `https://wa.me/${number}?text=${encodeURIComponent(message || site.contact.enquiryMessage)}`;
}
export const whatsappRel = (site) => (site.contact?.whatsapp ? ' rel="noopener" target="_blank"' : '');

/** Brand mark (original artwork: temple spire over ghat steps). */
export function brandMark(variant = 'dark') {
  const tile = variant === 'light' ? '#1E3B43' : '#172E35';
  return `<svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="10" fill="${tile}"/><g fill="none" stroke="#D5A45A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7.2v3.3"/><path d="M20 7.3l3.4 1.2L20 9.7z" fill="#D5A45A"/><path d="M13.6 28.6v-6.2c0-4.4 2.9-8.3 6.4-11.9 3.5 3.6 6.4 7.5 6.4 11.9v6.2"/><path d="M14.5 19.6h11"/><path d="M17.9 28.6v-3a2.1 2.1 0 0 1 4.2 0v3"/><path d="M9.2 28.6h21.6M11.4 32.2h17.2"/></g></svg>`;
}

/**
 * Responsive <picture> for an optimised photo described in data/photos.json.
 * Files live at <src>-<width>.<avif|webp|jpg>.
 */
export function picture(photo, { sizes = '100vw', loading = 'lazy', priority = false, alt, cls = '' } = {}) {
  if (!photo) return '';
  const set = (ext) => photo.widths.map((w) => `${photo.src}-${w}.${ext} ${w}w`).join(', ');
  const fallbackW = photo.widths.find((w) => w >= 800) ?? photo.widths.at(-1);
  const h = Math.round((photo.height / photo.width) * photo.widths.at(-1));
  return `<picture>
  <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
  <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
  <img src="${photo.src}-${fallbackW}.jpg" srcset="${set('jpg')}" sizes="${sizes}" width="${photo.widths.at(-1)}" height="${h}" alt="${esc(alt ?? photo.alt)}"${cls ? ` class="${cls}"` : ''} ${priority ? 'fetchpriority="high" loading="eager"' : `loading="${loading}"`} decoding="async">
</picture>`;
}

/** Short on-image attribution, linking to the full credit (licence compliance). */
export function photoCredit(photo, key) {
  if (!photo?.credit) return '';
  return `<p class="photo-credit">Photo: ${esc(photo.credit.author)} · <a href="/photo-credits/#${esc(key)}">${esc(photo.credit.licence)}</a></p>`;
}
