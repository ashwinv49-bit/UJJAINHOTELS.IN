#!/usr/bin/env node
/**
 * Hotel system tests (zero dependencies).
 *   node scripts/test-hotels.mjs           unit + integration tests
 *   node scripts/test-hotels.mjs --unit    unit tests only
 *
 * Integration tests build the site inside a throwaway copy of the repo (in the
 * OS temp folder) so they can add test records and inject leaks without ever
 * touching real files. Test fixture records exist only in memory / that copy
 * and are clearly named "Test Fixture …".
 */
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm, cp, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as H from './lib/hotels.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = async (p, base = ROOT) => JSON.parse(await readFile(path.join(base, p), 'utf8'));

let passed = 0;
const failures = [];
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failures.push(name);
    console.log(`  ✗ ${name}\n      ${String(e.message).split('\n').join('\n      ')}`);
  }
}

// ---------------------------------------------------------------- fixtures
const areas = await read('data/areas.json');
const categories = await read('data/categories.json');
const facilities = await read('data/facilities.json');
const realAffiliates = await read('data/affiliates.json');
const site = { ...(await read('data/site.json')), contact: { whatsapp: '', email: '' } };
const TODAY = '2026-11-22';
const ctx = {
  areas: new Set(areas.map((a) => a.slug)),
  facilities: new Set(facilities.map((f) => f.slug)),
  reservedSlugs: new Set([...areas.map((a) => a.slug), ...categories.map((c) => c.slug)]),
  affiliates: realAffiliates,
  today: TODAY,
};
const enabledAffiliates = {
  partners: { agoda: { name: 'Agoda', enabled: true, hosts: ['www.agoda.com'] }, oyo: { name: 'OYO', enabled: false, hosts: ['www.oyorooms.com'] } },
};
// In-memory test record only — never written to data/hotels/ or published.
const fixture = (over = {}) => ({
  slug: 'test-fixture-lodge',
  name: 'Test Fixture Lodge',
  status: 'verified',
  area: 'near-mahakal-temple',
  propertyType: 'lodge',
  priceBand: 'budget',
  suitableFor: ['family'],
  facilities: ['ac', 'parking'],
  summary: 'Test fixture record used only by the automated test suite.',
  address: { street: '1 Test Street', locality: 'Test Locality', postalCode: '456006' },
  contact: { phone: '+916000000000', whatsapp: '+916000000000' },
  verification: { lastVerified: '2026-11-20', method: 'phone-call', verifiedBy: 'Test suite' },
  ...over,
});
const errorsOf = (r, c = ctx) => H.validateHotel(r, c).errors;

console.log('\nUnit tests — validation');
await test('a complete verified record has no errors', () => assert.deepEqual(errorsOf(fixture()), []));
await test('draft records may be incomplete', () =>
  assert.deepEqual(errorsOf({ slug: 'test-fixture-draft', name: 'Test Fixture Draft', status: 'draft' }), []));
await test('bad phone number is rejected', () =>
  assert.ok(errorsOf(fixture({ contact: { phone: '12345' } })).some((e) => e.includes('contact.phone'))));
await test('unknown facility is rejected', () =>
  assert.ok(errorsOf(fixture({ facilities: ['helipad'] })).some((e) => e.includes('unknown facility'))));
await test('unknown area is rejected', () => assert.ok(errorsOf(fixture({ area: 'mars' })).some((e) => e.includes('unknown area'))));
await test('verified without verification block is rejected', () =>
  assert.ok(errorsOf(fixture({ verification: undefined })).some((e) => e.includes('verification block'))));
await test('verification date in the future is rejected', () =>
  assert.ok(errorsOf(fixture({ verification: { ...fixture().verification, lastVerified: '2027-01-01' } })).some((e) => e.includes('future'))));
await test('impossible date is rejected', () =>
  assert.ok(errorsOf(fixture({ verification: { ...fixture().verification, lastVerified: '2026-02-30' } })).length > 0));
await test('slug clashing with a category is rejected', () =>
  assert.ok(errorsOf(fixture({ slug: 'budget' })).some((e) => e.includes('clashes'))));
await test('verified listing missing phone/address/summary is rejected', () => {
  const e = errorsOf(fixture({ contact: {}, address: undefined, summary: '' }));
  assert.ok(e.some((x) => x.includes('phone')) && e.some((x) => x.includes('address')) && e.some((x) => x.includes('summary')));
});
await test('real record named "placeholder" is rejected', () =>
  assert.ok(errorsOf(fixture({ name: 'Placeholder Inn' })).some((e) => e.includes('must not contain'))));
await test('placeholder record must use the zero phone number', () =>
  assert.ok(errorsOf(fixture({ placeholder: true, name: 'PLACEHOLDER X', contact: { phone: '+916000000000' } })).some((e) => e.includes('placeholder phone'))));
await test('photo without rights / permission is rejected', () => {
  const e = errorsOf(fixture({ photos: [{ src: '/assets/images/hotels/x/a.jpg', width: 800, height: 600, alt: 'Front', rights: 'supplied-by-property-with-permission' }] }));
  assert.ok(e.some((x) => x.includes('permissionRef')));
  assert.ok(errorsOf(fixture({ photos: [{ src: 'https://other.site/a.jpg', width: 1, height: 1, alt: 'x', rights: 'stolen' }] })).length >= 2);
});
await test('distances need a measurement method', () =>
  assert.ok(errorsOf(fixture({ distances: { mahakalTempleKm: 0.5 } })).some((e) => e.includes('distances.method'))));
await test('stale verification is a notice, not an error', () => {
  const r = H.validateHotel(fixture({ verification: { ...fixture().verification, lastVerified: '2026-01-01' } }), ctx);
  assert.deepEqual(r.errors, []);
  assert.ok(r.notices.some((n) => n.includes('re-check')));
});

console.log('\nUnit tests — what gets published');
for (const status of H.STATUSES) {
  for (const placeholder of [false, true]) {
    for (const showSamples of [false, true]) {
      const expected = status === 'verified' && (!placeholder || showSamples);
      await test(`${status}${placeholder ? ' placeholder' : ''} on ${showSamples ? 'local' : 'Netlify'} build → ${expected ? 'public' : 'hidden'}`, () =>
        assert.equal(H.isPublic({ status, placeholder }, { showSamples, errors: [] }), expected));
    }
  }
}
await test('verified record with errors is never public', () =>
  assert.equal(H.isPublic({ status: 'verified' }, { showSamples: true, errors: ['x'] }), false));

console.log('\nUnit tests — affiliate links');
await test('unknown partner is not shown', () => assert.ok(H.affiliateProblem({ partner: 'acme', url: 'https://acme.com' }, enabledAffiliates)));
await test('disabled partner is not shown', () => assert.ok(H.affiliateProblem({ partner: 'oyo', url: 'https://www.oyorooms.com/x' }, enabledAffiliates)));
await test('http link is not shown', () => assert.ok(H.affiliateProblem({ partner: 'agoda', url: 'http://www.agoda.com/x' }, enabledAffiliates)));
await test('wrong host is not shown', () => assert.ok(H.affiliateProblem({ partner: 'agoda', url: 'https://evil.example/agoda' }, enabledAffiliates)));
await test('valid enabled link is shown', () => assert.equal(H.affiliateProblem({ partner: 'agoda', url: 'https://www.agoda.com/x' }, enabledAffiliates), null));
await test('all partners are disabled in the real data/affiliates.json', () =>
  assert.ok(Object.values(realAffiliates.partners).every((p) => p.enabled === false)));

console.log('\nUnit tests — contact and directions links');
await test('tel link', () => assert.equal(H.telHref('+916000000000'), 'tel:+916000000000'));
await test('WhatsApp goes to the hotel number with an enquiry message', () => {
  const w = H.whatsappEnquiry(fixture(), site);
  assert.equal(w.target, 'hotel');
  assert.ok(w.href.startsWith('https://wa.me/916000000000?text=') && w.href.includes('HotelsUjjain.in'));
});
await test('WhatsApp falls back to business number, then contact page', () => {
  assert.equal(H.whatsappEnquiry(fixture({ contact: { phone: '+916000000000' } }), { ...site, contact: { whatsapp: '919000000000' } }).target, 'platform');
  assert.equal(H.whatsappEnquiry(fixture({ contact: { phone: '+916000000000' } }), site).href, '/contact/');
});
await test('directions use map pin when available, plus place id', () => {
  const href = H.mapsHref(fixture({ geo: { lat: 23.18, lng: 75.77 }, googlePlaceId: 'ChIJtest' }));
  assert.equal(href, 'https://www.google.com/maps/dir/?api=1&destination=23.18%2C75.77&destination_place_id=ChIJtest');
});
await test('directions fall back to name + address; none without either', () => {
  assert.ok(H.mapsHref(fixture()).includes('Test%20Fixture%20Lodge%2C%201%20Test%20Street'));
  assert.equal(H.mapsHref({ name: 'X' }), null);
});

console.log('\nUnit tests — view model and structured data');
const data = { areas, facilities };
const vm = (r, aff = realAffiliates) => H.toViewModel(r, { site, data, affiliates: aff, today: TODAY });
await test('view model never fills in missing data', () => {
  const v = vm(fixture({ distances: undefined, geo: undefined, photos: undefined }));
  assert.deepEqual(v.distances, []);
  assert.equal(v.geo, undefined);
  assert.deepEqual(v.photos, []);
  assert.deepEqual(v.affiliateLinks, []);
});
await test('featured period expiry turns featured off', () => {
  assert.equal(vm(fixture({ listing: { tier: 'featured', featuredUntil: '2026-12-31' } })).featured, true);
  assert.equal(vm(fixture({ listing: { tier: 'featured', featuredUntil: '2026-01-31' } })).featured, false);
});
await test('Hotel JSON-LD: only real facts, no ratings/reviews/prices', () => {
  const ld = H.hotelJsonLd(vm(fixture()), site);
  assert.equal(ld['@type'], 'Hotel');
  assert.equal(ld.telephone, '+916000000000');
  assert.equal(ld.geo, undefined);
  assert.equal(ld.amenityFeature.length, 2);
  for (const k of ['aggregateRating', 'review', 'priceRange', 'starRating', 'makesOffer']) assert.equal(ld[k], undefined);
});
await test('no JSON-LD for placeholders', () => assert.equal(H.hotelJsonLd({ ...vm(fixture()), placeholder: true }, site), null));

console.log('\nUnit tests — rendering');
const profile = (await import(pathToFileURL(path.join(ROOT, 'src/components/hotel-profile.mjs')).href)).default;
const { listingCard } = await import(pathToFileURL(path.join(ROOT, 'src/components/featured-hotels.mjs')).href);
const pageFor = (v) => ({ hotel: v, crumbs: [{ name: 'Home', path: '/' }, { name: v.name, path: v.url }] });
await test('profile shows Call, WhatsApp, Directions and last-verified date', () => {
  const html = profile({ page: pageFor(vm(fixture())) });
  assert.ok(html.includes('href="tel:+916000000000"'));
  assert.ok(html.includes('https://wa.me/916000000000'));
  assert.ok(html.includes('https://www.google.com/maps/dir/?api=1'));
  assert.ok(html.includes('Details last verified on 20 Nov 2026'));
});
await test('profile hides affiliate button when no valid link', () => {
  const html = profile({ page: pageFor(vm(fixture({ affiliateLinks: [{ partner: 'agoda', url: 'https://www.agoda.com/x' }] }))) });
  assert.ok(!html.includes('Check prices on'));
});
await test('profile shows labelled sponsored affiliate button for a valid link', () => {
  const html = profile({ page: pageFor(vm(fixture({ affiliateLinks: [{ partner: 'agoda', url: 'https://www.agoda.com/x' }] }), enabledAffiliates)) });
  assert.ok(html.includes('Check prices on Agoda'));
  assert.ok(html.includes('rel="sponsored nofollow noopener"'));
  assert.ok(html.includes('Partner link'));
});
await test('profile omits Call when no phone, Directions when nothing to point at', () => {
  const v = vm(fixture({ status: 'verified' }));
  const html = profile({ page: pageFor({ ...v, telHref: null, mapsHref: null }) });
  assert.ok(!html.includes('href="tel:') && !html.includes('Get directions'));
});
await test('card carries filter attributes', () => {
  const html = listingCard(vm(fixture()));
  for (const a of ['data-hotel="test-fixture-lodge"', 'data-area="near-mahakal-temple"', 'data-band="budget"', 'data-facilities="ac parking"', 'data-suitable="family"'])
    assert.ok(html.includes(a), a);
});

console.log('\nUnit tests — partner area links (affiliate-only phase)');
const PL = await import(pathToFileURL(path.join(ROOT, 'scripts/lib/partner-links.mjs')).href);
const { partnerBlock } = await import(pathToFileURL(path.join(ROOT, 'src/components/partner-links.mjs')).href);
const realResearch = await read('data/affiliate-areas.json');
// Test-only research data: a fake tracking host, never written to disk.
const TRACK = 'https://track.test-fixture.example/go?u=';
const research = {
  areas: {
    'near-ram-ghat': {
      subid: 'area-near-ram-ghat',
      links: {
        goibibo: { url: 'https://www.goibibo.com/hotels/hotels-in-ujjain/near-ram-ghat-lh/', trackedUrl: TRACK + 'ramghat' },
        makemytrip: { url: 'https://www.makemytrip.com/hotels/ujjain-hotels-near-ram_ghat.html', trackedUrl: '' },
        agoda: { url: null },
      },
    },
  },
  categories: { all: { subid: 'cat-all' } },
  cityFallback: { agoda: { url: 'https://www.agoda.com/en-in/city/ujjain-in.html', trackedUrl: TRACK + 'agoda-city' } },
};
const partnersOn = (...keys) => ({
  partners: Object.fromEntries(
    Object.entries(realAffiliates.partners).map(([k, p]) => [k, { ...p, enabled: keys.includes(k), hosts: [...p.hosts, 'track.test-fixture.example'] }])
  ),
});
const plData = (affiliates, r = research) => ({ affiliateAreas: r, affiliates });

await test('real data: no partner link is shown while nothing is tracked (all partners off)', () => {
  for (const slug of ['all', ...Object.keys(realResearch.areas), 'budget', 'family', 'premium'])
    assert.deepEqual(PL.partnerLinksFor(slug, { affiliateAreas: realResearch, affiliates: realAffiliates }), [], slug);
});
await test('real data: every researched link has an (empty) trackedUrl slot', () => {
  const links = [
    ...Object.values(realResearch.areas).flatMap((e) => Object.values(e.links)),
    ...Object.values(realResearch.categories).flatMap((e) => Object.values(e.links ?? {})),
    ...Object.values(realResearch.cityFallback),
  ].filter((l) => l.url);
  assert.ok(links.length > 0);
  for (const l of links) assert.equal(typeof l.trackedUrl, 'string', l.url);
});
await test('no button for a disabled partner, even with a tracked link', () => {
  assert.deepEqual(PL.partnerLinksFor('near-ram-ghat', plData(partnersOn())), []);
});
await test('enabled partner with a tracked link → area button; empty trackedUrl → nothing', () => {
  const out = PL.partnerLinksFor('near-ram-ghat', plData(partnersOn('goibibo', 'makemytrip')));
  assert.deepEqual(out.map((l) => [l.partner, l.scope, l.url]), [['goibibo', 'area', TRACK + 'ramghat']]);
});
await test('partner without an area page falls back to its tracked city page', () => {
  const out = PL.partnerLinksFor('near-ram-ghat', plData(partnersOn('agoda')));
  assert.deepEqual(out.map((l) => [l.partner, l.scope]), [['agoda', 'city']]);
  assert.deepEqual(PL.partnerLinksFor('all', plData(partnersOn('agoda'))).map((l) => l.scope), ['city']);
});
await test('tracked link on a host not listed for the partner is blocked and reported', () => {
  const bad = structuredClone(research);
  bad.areas['near-ram-ghat'].links.goibibo.trackedUrl = 'https://evil.example/x';
  assert.deepEqual(PL.partnerLinksFor('near-ram-ghat', plData(partnersOn('goibibo'), bad)), []);
  assert.ok(PL.partnerLinkProblems(plData(partnersOn('goibibo'), bad)).some((p) => p.includes('evil.example')));
});
await test('partner block: labelled sponsored button, disclosure, no price, no "Book now"', () => {
  const html = partnerBlock(PL.partnerLinksFor('near-ram-ghat', plData(partnersOn('goibibo'))), { searchLabel: 'Near Ram Ghat' });
  assert.ok(html.includes('Check prices on Goibibo'));
  assert.ok(html.includes('rel="sponsored nofollow noopener" target="_blank"'));
  assert.ok(html.includes('Partner link') && html.includes('/affiliate-disclosure/'));
  assert.ok(html.includes('Near Ram Ghat'));
  assert.ok(!/book now/i.test(html) && !html.includes('₹'));
});
await test('partner block with no links says "coming soon" and has no external links', () => {
  const html = partnerBlock([], { kind: 'area' });
  assert.ok(html.includes('Booking partner links are coming soon'));
  assert.ok(!html.includes('https://'));
});

console.log('\nUnit tests — hotel-owner onboarding');
const ownerCta = (await import(pathToFileURL(path.join(ROOT, 'src/components/owner-cta.mjs')).href)).default;
await test('owner CTA without a WhatsApp number: "opens soon", no link', () => {
  const html = ownerCta({ site }, {});
  assert.ok(html.includes('Registration on WhatsApp opens soon'));
  assert.ok(!html.includes('wa.me') && !html.includes('href="/contact/"'));
});
await test('owner CTA with a number: WhatsApp link with prefilled owner message', () => {
  const html = ownerCta({ site: { ...site, contact: { whatsapp: '919000000000' } } }, { learnMore: 'true' });
  assert.ok(html.includes('https://wa.me/919000000000?text=Namaste!%20I%20own%20a%20hotel'));
  assert.ok(html.includes('Register on WhatsApp') && html.includes('href="/list-your-hotel/"'));
});

// ---------------------------------------------------------------- integration
if (!process.argv.includes('--unit')) {
  console.log('\nIntegration tests — real builds in a throwaway copy');
  const tmp = await mkdtemp(path.join(os.tmpdir(), 'hu-hotels-'));
  const copy = async (name) => {
    const dir = path.join(tmp, name);
    await cp(ROOT, dir, { recursive: true, filter: (src) => !/[/\\](\.git|dist|node_modules)([/\\]|$)/.test(src.slice(ROOT.length)) });
    return dir;
  };
  const build = (dir, env = {}, strict = true) =>
    spawnSync('node', ['scripts/build.mjs', ...(strict ? ['--strict'] : [])], {
      cwd: dir,
      env: { ...process.env, NETLIFY: '', CONTEXT: '', ...env },
      encoding: 'utf8',
    });
  const LIVE = { NETLIFY: 'true', CONTEXT: 'production' };
  const html = (dir, p) => readFile(path.join(dir, 'dist', p), 'utf8');
  const count = (s, needle) => s.split(needle).length - 1;

  try {
    const base = await copy('base');
    await test('local build publishes verified placeholders A/B/C, never draft D / contacted E', async () => {
      const r = build(base);
      assert.equal(r.status, 0, r.stderr || r.stdout);
      for (const s of ['a', 'b', 'c']) assert.ok(existsSync(path.join(base, `dist/hotels/placeholder-hotel-${s}/index.html`)), s);
      for (const s of ['d', 'e']) assert.ok(!existsSync(path.join(base, `dist/hotels/placeholder-hotel-${s}`)), s);
    });
    await test('collections list exactly the matching hotels', async () => {
      const expect = { budget: 1, premium: 1, family: 2, 'near-mahakal-temple': 1, 'near-railway-station': 1, 'dewas-road': 1, 'near-ram-ghat': 0, '': 3 };
      for (const [slug, n] of Object.entries(expect)) {
        const page = await html(base, slug ? `hotels/${slug}/index.html` : 'hotels/index.html');
        assert.equal(count(page, 'data-hotel="'), n, `/hotels/${slug} expected ${n}`);
      }
    });
    await test('live-mode build: no placeholders, empty collections are noindex + out of sitemap', async () => {
      const r = build(base, LIVE);
      assert.equal(r.status, 0, r.stderr || r.stdout);
      assert.ok(!existsSync(path.join(base, 'dist/hotels/placeholder-hotel-a')));
      const budget = await html(base, 'hotels/budget/index.html');
      // Affiliate-only phase: empty collections show the partner block ("coming soon" until links are tracked).
      assert.ok(budget.includes('Booking partner links are coming soon') && budget.includes('noindex'));
      assert.ok(!budget.includes('rel="sponsored'), 'no partner button without a tracked link');
      const sitemap = await html(base, 'sitemap.xml');
      assert.ok(!sitemap.includes('/hotels/'));
      assert.ok((await readFile(path.join(base, 'dist/_redirects'), 'utf8')).includes('/hotels/luxury/   /hotels/premium/   301'));
    });

    const withReal = await copy('real');
    await writeFile(path.join(withReal, 'data/hotels/test-fixture-lodge.json'), JSON.stringify(fixture(), null, 2));
    await test('a complete verified real record is published live with Hotel JSON-LD', async () => {
      const r = build(withReal, LIVE);
      assert.equal(r.status, 0, r.stderr || r.stdout);
      const page = await html(withReal, 'hotels/test-fixture-lodge/index.html');
      assert.ok(page.includes('href="tel:+916000000000"') && page.includes('"@type":"Hotel"') && page.includes('"@type":"BreadcrumbList"'));
      assert.ok(!/aggregateRating|priceRange|"review"/.test(page));
      assert.ok(page.includes('<link rel="canonical" href="https://hotelsujjain.in/hotels/test-fixture-lodge/">'));
      const sitemap = await html(withReal, 'sitemap.xml');
      assert.ok(sitemap.includes('/hotels/test-fixture-lodge/') && sitemap.includes('/hotels/near-mahakal-temple/') && sitemap.includes('<lastmod>2026-11-20</lastmod>'));
      const near = await html(withReal, 'hotels/near-mahakal-temple/index.html');
      assert.ok(near.includes('data-hotel="test-fixture-lodge"') && !near.includes('No verified hotels here yet'));
    });

    const badVerified = await copy('bad-verified');
    await writeFile(
      path.join(badVerified, 'data/hotels/test-fixture-incomplete.json'),
      JSON.stringify(fixture({ slug: 'test-fixture-incomplete', name: 'Test Fixture Incomplete', verification: undefined }), null, 2)
    );
    await test('verified record without verification is NOT published and fails a strict build', async () => {
      const strict = build(badVerified, LIVE);
      assert.notEqual(strict.status, 0);
      assert.ok((strict.stdout + strict.stderr).includes('NOT PUBLISHED'));
      const loose = build(badVerified, LIVE, false);
      assert.equal(loose.status, 0, loose.stderr);
      assert.ok(!existsSync(path.join(badVerified, 'dist/hotels/test-fixture-incomplete')));
    });

    const leakPlaceholder = await copy('leak-placeholder');
    await appendFile(path.join(leakPlaceholder, 'src/pages/index.html'), '\n<p>PLACEHOLDER Hotel A (not a real hotel)</p>\n');
    await test('safety rail: placeholder text in a Netlify build fails the build', () => {
      const r = build(leakPlaceholder, LIVE);
      assert.notEqual(r.status, 0);
      assert.ok((r.stdout + r.stderr).includes('placeholder content found'.replace('placeholder', 'Sample/placeholder')));
    });

    const leakDraft = await copy('leak-draft');
    await writeFile(
      path.join(leakDraft, 'data/hotels/test-fixture-draft.json'),
      JSON.stringify({ slug: 'test-fixture-draft', name: 'Test Fixture Draft', status: 'draft' }, null, 2)
    );
    await appendFile(path.join(leakDraft, 'src/pages/index.html'), '\n<a href="/hotels/test-fixture-draft/">x</a>\n');
    await test('safety rail: a link to a draft listing fails every build', () => {
      const r = build(leakDraft, {}, false);
      assert.notEqual(r.status, 0);
      assert.ok((r.stdout + r.stderr).includes('Unpublished hotel listing found'));
    });
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
