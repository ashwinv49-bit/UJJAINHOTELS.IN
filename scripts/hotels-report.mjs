#!/usr/bin/env node
/**
 * Hotel database report.
 *   npm run hotels                 → real records (data/hotels/)
 *   npm run hotels -- --placeholders  → also the placeholder/test records
 * Shows each record's status, whether it would be PUBLIC on the live site,
 * when it was last verified, and everything that still needs fixing.
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateHotel, isPublic, todayIST, daysBetween, STALE_DAYS } from './lib/hotels.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = async (p) => JSON.parse(await readFile(path.join(ROOT, p), 'utf8'));
const withPlaceholders = process.argv.includes('--placeholders');

const areas = await read('data/areas.json');
const categories = await read('data/categories.json');
const facilities = await read('data/facilities.json');
const affiliates = await read('data/affiliates.json');
const today = todayIST();
const ctx = {
  areas: new Set(areas.map((a) => a.slug)),
  facilities: new Set(facilities.map((f) => f.slug)),
  reservedSlugs: new Set([...areas.map((a) => a.slug), ...categories.map((c) => c.slug), 'sample-listing']),
  affiliates,
  today,
};

const dirs = [['data/hotels', false], ...(withPlaceholders ? [['data/hotels-placeholder', true]] : [])];
const rows = [];
const seen = new Map();
for (const [dir, isPlaceholderDir] of dirs) {
  const abs = path.join(ROOT, dir);
  if (!existsSync(abs)) continue;
  for (const f of (await readdir(abs)).filter((x) => x.endsWith('.json')).sort()) {
    const source = `${dir}/${f}`;
    let r;
    try {
      r = await read(source);
    } catch (e) {
      rows.push({ source, status: 'INVALID JSON', live: 'no', verified: '—', name: '', errors: [e.message], warnings: [], notices: [] });
      continue;
    }
    const { errors, warnings, notices } = validateHotel(r, ctx);
    if (isPlaceholderDir && r.placeholder !== true) errors.push('records here must have "placeholder": true');
    if (!isPlaceholderDir && r.placeholder === true) errors.push('placeholder records belong in data/hotels-placeholder/');
    if (seen.has(r.slug)) errors.push(`duplicate slug (also ${seen.get(r.slug)})`);
    seen.set(r.slug, source);
    const live = isPublic(r, { showSamples: false, errors }) ? 'YES' : 'no';
    // For draft/contacted: what is still missing before it can be marked verified
    const todo =
      r.status === 'verified'
        ? []
        : validateHotel({ ...r, status: 'verified' }, ctx).errors.filter((e) => !errors.includes(e));
    const lv = r.verification?.lastVerified;
    const age = lv ? daysBetween(lv, today) : null;
    rows.push({
      source,
      status: r.status ?? '?',
      live,
      verified: lv ? `${lv} (${age} d${age > STALE_DAYS ? ', re-check!' : ''})` : '—',
      name: r.name ?? '',
      errors,
      warnings,
      notices,
      todo,
    });
  }
}

if (!rows.length) {
  console.log('No hotel records yet. Create one with: npm run new-hotel -- "Exact Hotel Name"');
  process.exit(0);
}

const pad = (s, n) => String(s).padEnd(n).slice(0, n);
console.log(`${pad('STATUS', 10)} ${pad('LIVE', 5)} ${pad('LAST VERIFIED', 24)} NAME`);
console.log('-'.repeat(80));
for (const r of rows) console.log(`${pad(r.status, 10)} ${pad(r.live, 5)} ${pad(r.verified, 24)} ${r.name}`);

const needs = rows.filter((r) => r.errors.length || r.warnings.length || r.notices.length || r.todo?.length);
if (needs.length) {
  console.log('\nTo fix / to know:   ✗ error   ! check   · note   ○ needed before it can be verified');
  for (const r of needs) {
    console.log(`\n${r.source} [${r.status}]`);
    for (const e of r.errors) console.log(`  ✗ ${e}`);
    for (const w of r.warnings) console.log(`  ! ${w}`);
    for (const n of r.notices) console.log(`  · ${n}`);
    for (const t of r.todo ?? []) console.log(`  ○ ${t}`);
  }
}
const live = rows.filter((r) => r.live === 'YES').length;
console.log(`\n${rows.length} record(s), ${live} public on the live site. Only "verified" records with no ✗ items are published.`);
