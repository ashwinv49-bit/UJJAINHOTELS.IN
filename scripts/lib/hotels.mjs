/**
 * HotelsUjjain.in — hotel listing rules (single source of truth).
 * Used by scripts/build.mjs, scripts/hotels-report.mjs, scripts/test-hotels.mjs
 * and the hotel components.
 *
 * Core rule: a hotel is PUBLIC only if status === 'verified', the record passes
 * validation (including a complete verification block), and it is not a
 * placeholder — placeholders render only in local design builds.
 * Nothing here ever fills in a missing value: absent data stays absent.
 */

export const STATUSES = ['draft', 'contacted', 'verified'];
export const PRICE_BANDS = { budget: 'Budget', mid: 'Mid-range', premium: 'Premium' };
export const PROPERTY_TYPES = {
  hotel: 'Hotel',
  resort: 'Resort',
  'guest-house': 'Guest house',
  homestay: 'Homestay',
  dharamshala: 'Dharamshala',
  lodge: 'Lodge',
};
export const SUITABLE_FOR = { family: 'Families' };
export const VERIFY_METHODS = {
  'phone-call': 'by phone call with the property',
  'site-visit': 'by a visit to the property',
  'owner-submitted-and-confirmed': 'from details submitted by the owner and confirmed by us',
};
export const PHOTO_RIGHTS = ['own-photo', 'supplied-by-property-with-permission', 'licensed'];
export const STALE_DAYS = 180;
export const PLACEHOLDER_PHONE = '+910000000000';

const PHONE_RE = /^\+91[6-9][0-9]{9}$/;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PIN_RE = /^4560[0-9]{2}$/;
const DISTANCE_LABELS = {
  mahakalTempleKm: 'Mahakal Temple',
  ramGhatKm: 'Ram Ghat',
  railwayStationKm: 'Ujjain Junction railway station',
};

// ---------------------------------------------------------------- dates
/** Today's date in India (YYYY-MM-DD). */
export const todayIST = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

export function isValidDate(s) {
  if (typeof s !== 'string' || !DATE_RE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

export function daysBetween(fromIso, toIso) {
  return Math.round((new Date(`${toIso}T00:00:00Z`) - new Date(`${fromIso}T00:00:00Z`)) / 86400000);
}

export function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// ---------------------------------------------------------------- validation
const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

/**
 * Validate one hotel record.
 * ctx: { areas: Set<slug>, facilities: Set<slug>, reservedSlugs: Set<slug>, affiliates: {partners}, today: 'YYYY-MM-DD' }
 * Returns { errors, warnings, notices }.
 *   errors   — block publication (a verified record with errors is NOT published)
 *   warnings — data that looks wrong (fail a --strict build)
 *   notices  — normal states worth knowing (stale date, partner disabled); never fail a build
 */
export function validateHotel(r, ctx) {
  const errors = [];
  const warnings = [];
  const notices = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);
  const note = (m) => notices.push(m);

  if (!r || typeof r !== 'object') return { errors: ['record is not an object'], warnings, notices };
  if (!nonEmpty(r.slug) || !SLUG_RE.test(r.slug)) err('slug must be lowercase words joined by hyphens');
  if (ctx.reservedSlugs?.has(r.slug)) err(`slug "${r.slug}" clashes with a category/area page`);
  if (!nonEmpty(r.name)) err('name is missing');
  if (!STATUSES.includes(r.status)) err(`status must be one of ${STATUSES.join(', ')}`);

  // Placeholders must be unmistakable; real records must never look like placeholders.
  const isPlaceholder = r.placeholder === true;
  if (isPlaceholder) {
    if (!String(r.name || '').startsWith('PLACEHOLDER')) err('placeholder record name must start with "PLACEHOLDER"');
    for (const k of ['phone', 'whatsapp']) {
      if (r.contact?.[k] && r.contact[k] !== PLACEHOLDER_PHONE) err(`placeholder ${k} must be ${PLACEHOLDER_PHONE}`);
    }
  } else {
    if (/placeholder/i.test(r.name || '')) err('real record name must not contain "placeholder"');
    for (const k of ['phone', 'whatsapp']) {
      if (r.contact?.[k] && !PHONE_RE.test(r.contact[k])) err(`contact.${k} must look like +91XXXXXXXXXX (10 digits, starting 6-9)`);
    }
  }

  if (r.area !== undefined && !ctx.areas?.has(r.area)) err(`unknown area "${r.area}" (see data/areas.json)`);
  if (r.priceBand !== undefined && !PRICE_BANDS[r.priceBand]) err(`priceBand must be one of ${Object.keys(PRICE_BANDS).join(', ')}`);
  if (r.propertyType !== undefined && !PROPERTY_TYPES[r.propertyType]) err(`unknown propertyType "${r.propertyType}"`);
  for (const s of r.suitableFor ?? []) if (!SUITABLE_FOR[s]) err(`unknown suitableFor "${s}"`);
  for (const f of r.facilities ?? []) if (!ctx.facilities?.has(f)) err(`unknown facility "${f}" (see data/facilities.json)`);
  if (r.summary && r.summary.length > 300) err('summary is longer than 300 characters');

  if (r.address) {
    if (r.address.postalCode && !PIN_RE.test(r.address.postalCode)) err('address.postalCode must be an Ujjain PIN (4560xx)');
  }
  if (r.geo) {
    const { lat, lng } = r.geo;
    if (typeof lat !== 'number' || typeof lng !== 'number') err('geo.lat and geo.lng must be numbers');
    else if (lat < 22.9 || lat > 23.4 || lng < 75.5 || lng > 76.1) warn('geo is outside the Ujjain area — check the map pin');
  }
  if (r.distances) {
    const measured = Object.keys(DISTANCE_LABELS).filter((k) => r.distances[k] !== undefined);
    for (const k of measured) if (typeof r.distances[k] !== 'number' || r.distances[k] < 0) err(`distances.${k} must be a positive number`);
    if (measured.length && !nonEmpty(r.distances.method)) err('distances.method is required when distances are given');
  }

  (r.photos ?? []).forEach((p, i) => {
    const at = `photos[${i}]`;
    if (!nonEmpty(p.src) || !p.src.startsWith('/assets/images/hotels/')) err(`${at}.src must be under /assets/images/hotels/`);
    if (!Number.isInteger(p.width) || !Number.isInteger(p.height)) err(`${at} needs integer width and height`);
    if (!nonEmpty(p.alt)) err(`${at}.alt is missing`);
    if (!PHOTO_RIGHTS.includes(p.rights)) err(`${at}.rights must be one of ${PHOTO_RIGHTS.join(', ')}`);
    if (p.rights && p.rights !== 'own-photo' && !nonEmpty(p.permissionRef)) err(`${at}.permissionRef is required for ${p.rights}`);
  });

  (r.affiliateLinks ?? []).forEach((l, i) => {
    const reason = affiliateProblem(l, ctx.affiliates);
    if (reason) note(`affiliateLinks[${i}] not shown: ${reason}`);
  });

  if (r.listing?.tier && !['free', 'featured'].includes(r.listing.tier)) err('listing.tier must be free or featured');
  if (r.listing?.featuredUntil !== undefined) {
    if (!isValidDate(r.listing.featuredUntil)) err('listing.featuredUntil must be YYYY-MM-DD');
    else if (ctx.today && r.listing.featuredUntil < ctx.today) note('featured period has ended — shown as a normal listing');
  }

  // Extra requirements before anything can be published as verified.
  if (r.status === 'verified') {
    if (!r.area) err('verified listing needs an area');
    if (!r.priceBand) err('verified listing needs a priceBand');
    if (!r.propertyType) err('verified listing needs a propertyType');
    if (!nonEmpty(r.summary)) err('verified listing needs a summary');
    if (!nonEmpty(r.address?.street) || !nonEmpty(r.address?.locality) || !r.address?.postalCode)
      err('verified listing needs a full address (street, locality, postalCode)');
    if (!r.contact?.phone) err('verified listing needs a confirmed phone number');
    const v = r.verification;
    if (!v) err('verified listing needs a verification block (lastVerified, method, verifiedBy)');
    else {
      if (!isValidDate(v.lastVerified)) err('verification.lastVerified must be a real date (YYYY-MM-DD)');
      else if (ctx.today && v.lastVerified > ctx.today) err('verification.lastVerified is in the future');
      else if (ctx.today && daysBetween(v.lastVerified, ctx.today) > STALE_DAYS)
        note(`last verified ${daysBetween(v.lastVerified, ctx.today)} days ago — please re-check with the property`);
      if (!VERIFY_METHODS[v.method]) err(`verification.method must be one of ${Object.keys(VERIFY_METHODS).join(', ')}`);
      if (!nonEmpty(v.verifiedBy)) err('verification.verifiedBy is missing');
    }
  }
  return { errors, warnings, notices };
}

/** Public = verified + valid + (real, or placeholder in a local design build). */
export function isPublic(r, { showSamples, errors }) {
  return r.status === 'verified' && errors.length === 0 && (r.placeholder !== true || showSamples === true);
}

// ---------------------------------------------------------------- affiliate links
/** Returns null when the link may be shown, otherwise the reason it may not. */
export function affiliateProblem(link, affiliates) {
  const partner = affiliates?.partners?.[link?.partner];
  if (!partner) return `unknown partner "${link?.partner}"`;
  if (partner.enabled !== true) return `${partner.name} is not enabled in data/affiliates.json`;
  let url;
  try {
    url = new URL(link.url);
  } catch {
    return 'not a valid URL';
  }
  if (url.protocol !== 'https:') return 'link must use https';
  if (!(partner.hosts ?? []).includes(url.hostname)) return `host ${url.hostname} is not an allowed ${partner.name} host`;
  return null;
}

export function validAffiliateLinks(r, affiliates) {
  return (r.affiliateLinks ?? [])
    .filter((l) => affiliateProblem(l, affiliates) === null)
    .map((l) => ({ partner: l.partner, name: affiliates.partners[l.partner].name, url: l.url }));
}

// ---------------------------------------------------------------- contact & maps links
export const telHref = (phone) => `tel:${phone}`;
export const phoneDisplay = (phone) => phone.replace(/^\+91(\d{5})(\d{5})$/, '+91 $1 $2');

export function waHref(number, message) {
  return `https://wa.me/${String(number).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

/**
 * WhatsApp enquiry target (owner decision): the hotel's own WhatsApp number;
 * if the hotel has none, the HotelsUjjain business number; if that isn't set
 * yet, the contact page.
 */
export function whatsappEnquiry(r, site) {
  const message = `Namaste! I found ${r.name} on ${site.domainLabel} and would like to enquire about a stay.`;
  if (r.contact?.whatsapp) return { href: waHref(r.contact.whatsapp, message), target: 'hotel' };
  if (site.contact?.whatsapp) return { href: waHref(site.contact.whatsapp, message), target: 'platform' };
  return { href: '/contact/', target: 'contact-page' };
}

/** Google Maps directions link (no API key). Null when there is nothing verified to point at. */
export function mapsHref(r) {
  let destination;
  if (r.geo && typeof r.geo.lat === 'number' && typeof r.geo.lng === 'number') destination = `${r.geo.lat},${r.geo.lng}`;
  else if (r.address?.street) {
    destination = [r.name, r.address.street, r.address.locality, `Ujjain ${r.address.postalCode ?? ''}`.trim()]
      .filter(Boolean)
      .join(', ');
  } else return null;
  let href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  if (r.googlePlaceId) href += `&destination_place_id=${encodeURIComponent(r.googlePlaceId)}`;
  return href;
}

// ---------------------------------------------------------------- view model
/**
 * Normalise a validated record for templates. Only copies what the record
 * actually contains — never fills gaps.
 */
export function toViewModel(r, { site, data, affiliates, today }) {
  const facilityIndex = new Map((data.facilities ?? []).map((f) => [f.slug, f]));
  const area = (data.areas ?? []).find((a) => a.slug === r.area);
  const featured =
    r.listing?.tier === 'featured' && (!r.listing.featuredUntil || !today || r.listing.featuredUntil >= today);
  const distances = Object.entries(DISTANCE_LABELS)
    .filter(([k]) => typeof r.distances?.[k] === 'number')
    .map(([k, label]) => ({ key: k, label, km: r.distances[k] }));
  const wa = whatsappEnquiry(r, site);
  const v = r.verification ?? {};
  return {
    slug: r.slug,
    name: r.name,
    url: `/hotels/${r.slug}/`,
    placeholder: r.placeholder === true,
    featured,
    area: r.area,
    areaTitle: area?.title ?? r.area,
    areaUrl: area?.url,
    propertyType: r.propertyType,
    propertyTypeLabel: PROPERTY_TYPES[r.propertyType] ?? '',
    priceBand: r.priceBand,
    priceBandLabel: PRICE_BANDS[r.priceBand] ?? '',
    suitableFor: r.suitableFor ?? [],
    facilities: (r.facilities ?? []).map((f) => facilityIndex.get(f)).filter(Boolean),
    summary: r.summary ?? '',
    address: r.address,
    addressLine: r.address
      ? [r.address.street, r.address.locality, `Ujjain ${r.address.postalCode ?? ''}`.trim(), 'Madhya Pradesh'].filter(Boolean).join(', ')
      : '',
    geo: r.geo,
    distances,
    distancesMethod: r.distances?.method ?? '',
    phone: r.contact?.phone,
    phoneDisplay: r.contact?.phone ? phoneDisplay(r.contact.phone) : '',
    telHref: r.contact?.phone ? telHref(r.contact.phone) : null,
    whatsappHref: wa.href,
    whatsappTarget: wa.target,
    mapsHref: mapsHref(r),
    website: r.contact?.website,
    photos: r.photos ?? [],
    affiliateLinks: validAffiliateLinks(r, affiliates),
    lastVerified: v.lastVerified,
    lastVerifiedLabel: v.lastVerified ? formatDate(v.lastVerified) : '',
    verifyMethodLabel: VERIFY_METHODS[v.method] ?? '',
  };
}

/** Does a hotel view model match a collection rule like { area } / { priceBand } / { suitableFor }? */
export function matchesRule(vm, rule = {}) {
  if (rule.area && vm.area !== rule.area) return false;
  if (rule.priceBand && vm.priceBand !== rule.priceBand) return false;
  if (rule.suitableFor && !vm.suitableFor.includes(rule.suitableFor)) return false;
  return true;
}

// ---------------------------------------------------------------- structured data
/**
 * schema.org Hotel for a verified, real listing — only facts present in the
 * record. Never ratings, reviews or prices. Returns null for placeholders.
 */
export function hotelJsonLd(vm, site) {
  if (vm.placeholder) return null;
  const base = site.url.replace(/\/$/, '');
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': `${base}${vm.url}#hotel`,
    name: vm.name,
    url: `${base}${vm.url}`,
  };
  if (vm.summary) ld.description = vm.summary;
  if (vm.address) {
    ld.address = {
      '@type': 'PostalAddress',
      streetAddress: vm.address.street,
      addressLocality: 'Ujjain',
      addressRegion: 'Madhya Pradesh',
      postalCode: vm.address.postalCode,
      addressCountry: 'IN',
    };
  }
  if (vm.phone) ld.telephone = vm.phone;
  if (vm.geo) ld.geo = { '@type': 'GeoCoordinates', latitude: vm.geo.lat, longitude: vm.geo.lng };
  if (vm.facilities.length) {
    ld.amenityFeature = vm.facilities.map((f) => ({ '@type': 'LocationFeatureSpecification', name: f.schema || f.label, value: true }));
  }
  if (vm.photos.length) ld.image = vm.photos.map((p) => `${base}${p.src}`);
  return ld;
}

/** schema.org BreadcrumbList from [{ name, path }]. */
export function breadcrumbJsonLd(items, site) {
  const base = site.url.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${base}${it.path}` })),
  };
}

export const jsonLdScript = (obj) =>
  obj ? `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>` : '';
