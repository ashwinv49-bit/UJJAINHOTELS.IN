#!/usr/bin/env node
/**
 * Create a new DRAFT hotel record.
 *   npm run new-hotel -- "Exact Hotel Name" [--area near-mahakal-temple]
 * Writes data/hotels/<slug>.json with status "draft" and empty fields to fill in
 * after speaking to the property. Nothing is published until status is
 * "verified" and the verification block is complete (see docs/HOTELS.md).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { todayIST } from './lib/hotels.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const areaIdx = args.indexOf('--area');
const area = areaIdx >= 0 ? args[areaIdx + 1] : undefined;
const name = args.filter((a, i) => areaIdx < 0 || (i !== areaIdx && i !== areaIdx + 1)).join(' ').trim();

if (!name) {
  console.error('Usage: npm run new-hotel -- "Exact Hotel Name" [--area <area-slug>]');
  process.exit(1);
}
if (/placeholder/i.test(name)) {
  console.error('Real hotel names must not contain "placeholder".');
  process.exit(1);
}

const slug = name
  .toLowerCase()
  .replace(/&/g, ' and ')
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const areas = JSON.parse(await readFile(path.join(ROOT, 'data/areas.json'), 'utf8'));
const categories = JSON.parse(await readFile(path.join(ROOT, 'data/categories.json'), 'utf8'));
const reserved = new Set([...areas.map((a) => a.slug), ...categories.map((c) => c.slug), 'sample-listing']);
if (!slug) {
  console.error('Could not make a URL slug from that name — use Latin letters/numbers.');
  process.exit(1);
}
if (reserved.has(slug)) {
  console.error(`"${slug}" is reserved for a category/area page. Use a more specific name.`);
  process.exit(1);
}
if (area && !areas.some((a) => a.slug === area)) {
  console.error(`Unknown area "${area}". Choose one of: ${areas.map((a) => a.slug).join(', ')}`);
  process.exit(1);
}

const file = path.join(ROOT, 'data/hotels', `${slug}.json`);
if (existsSync(file)) {
  console.error(`${path.relative(ROOT, file)} already exists — edit it instead.`);
  process.exit(1);
}

const today = todayIST();
const record = {
  slug,
  name,
  status: 'draft',
  ...(area ? { area } : {}),
  propertyType: 'hotel',
  suitableFor: [],
  facilities: [],
  summary: '',
  address: { street: '', locality: '', postalCode: '' },
  contact: {},
  photos: [],
  affiliateLinks: [],
  listing: { tier: 'free' },
  history: [{ date: today, status: 'draft', note: 'Record created' }],
};
await writeFile(file, `${JSON.stringify(record, null, 2)}\n`);
console.log(`Created ${path.relative(ROOT, file)} (status: draft — not public).`);
console.log('Next: contact the property, fill in only confirmed details, then follow docs/HOTELS.md to verify and publish.');
