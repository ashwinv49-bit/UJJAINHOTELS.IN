#!/usr/bin/env node
/**
 * Static QA for dist/ (no dependencies). Run after a build:
 *   node scripts/qa.mjs
 * Checks every HTML page for SEO/accessibility basics and every internal
 * link/asset reference for a matching file. Exits 1 on any error.
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const errors = [];
const notes = [];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function targetFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (clean.endsWith('/')) return path.join(DIST, clean, 'index.html');
  return path.join(DIST, clean);
}

const files = await walk(DIST);
// The site's own origin (from the sitemap) — absolute links to it are checked as internal.
const ORIGIN = (await readFile(path.join(DIST, 'sitemap.xml'), 'utf8')).match(/<loc>(https?:\/\/[^/<]+)/)?.[1] ?? null;
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const idsByPage = new Map();
const pendingAnchors = [];
const external = new Set();

for (const file of htmlFiles) {
  const rel = '/' + path.relative(DIST, file).replace(/\\/g, '/');
  const html = await readFile(file, 'utf8');
  const err = (m) => errors.push(`${rel}: ${m}`);

  if (!/<html[^>]+lang="[^"]+"/.test(html)) err('missing <html lang>');
  if (!/<meta name="viewport"/.test(html)) err('missing viewport meta');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) err('missing <title>');
  if (!/<meta name="description" content="[^"]{20,}"/.test(html)) err('missing/short meta description');
  if (!/<link rel="canonical" href="https:\/\/[^"]+"/.test(html)) err('missing absolute canonical');
  if (!/<meta property="og:image" content="https:\/\/[^"]+"/.test(html)) err('missing og:image');
  const ogImage = html.match(/<meta property="og:image" content="https?:\/\/[^/]+(\/[^"]+)"/)?.[1];
  if (ogImage && !existsSync(targetFile(ogImage))) err(`og:image file missing: ${ogImage}`);
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) err(`expected exactly one <h1>, found ${h1s.length}`);

  // heading order: no jumps of more than one level (h2 → h4)
  let prev = 0;
  for (const m of html.matchAll(/<h([1-6])[\s>]/g)) {
    const lvl = Number(m[1]);
    if (prev && lvl > prev + 1) err(`heading level jumps from h${prev} to h${lvl}`);
    prev = lvl;
  }

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(m[0])) err(`<img> without alt: ${m[0].slice(0, 80)}`);
    if (!/\bwidth="\d+"/.test(m[0]) || !/\bheight="\d+"/.test(m[0])) err(`<img> without width/height (CLS): ${m[0].slice(0, 80)}`);
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) err(`duplicate ids: ${[...new Set(dupes)].join(', ')}`);
  idsByPage.set(rel, new Set(ids));

  // aria-labelledby / aria-controls / label[for] must point at real ids
  for (const m of html.matchAll(/(?:aria-labelledby|aria-controls|for)="([^"]+)"/g)) {
    for (const id of m[1].split(/\s+/)) if (!ids.includes(id)) err(`reference to missing id "${id}"`);
  }
  // <use href="#i-..."> must exist in the sprite
  for (const m of html.matchAll(/<use href="#([^"]+)"/g)) {
    if (!ids.includes(m[1])) err(`icon "${m[1]}" not in sprite`);
  }

  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    let url = m[1];
    if (ORIGIN && url.startsWith(ORIGIN + '/')) url = url.slice(ORIGIN.length);
    if (/^(mailto:|tel:|data:)/.test(url)) continue;
    if (/^https?:\/\//.test(url)) {
      external.add(url);
      continue;
    }
    if (url.startsWith('#')) {
      if (url.length > 1) pendingAnchors.push([rel, rel, url.slice(1)]);
      continue;
    }
    if (!url.startsWith('/')) {
      err(`relative URL (use root-relative): ${url}`);
      continue;
    }
    if (!existsSync(targetFile(url))) err(`broken internal link/asset: ${url}`);
    const hash = url.split('#')[1];
    if (hash) pendingAnchors.push([rel, '/' + path.relative(DIST, targetFile(url)).replace(/\\/g, '/'), hash]);
  }
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url.startsWith('/') && !existsSync(targetFile(url))) err(`broken srcset entry: ${url}`);
    }
  }

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      err('invalid JSON-LD');
    }
  }
  // Every link that opens a new tab must carry rel="…noopener…" (attribute order doesn't matter)
  for (const m of html.matchAll(/<a\b[^>]*\btarget="_blank"[^>]*>/g)) {
    if (!/\brel="[^"]*\bnoopener\b[^"]*"/.test(m[0])) err(`target=_blank without rel=noopener: ${m[0].slice(0, 90)}`);
  }
}

for (const [from, page, id] of pendingAnchors) {
  if (!idsByPage.get(page)?.has(id)) errors.push(`${from}: link to missing anchor ${page}#${id}`);
}

// sitemap ↔ pages
const sitemap = await readFile(path.join(DIST, 'sitemap.xml'), 'utf8');
for (const m of sitemap.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)) {
  const f = targetFile(m[1]);
  if (!existsSync(f)) errors.push(`sitemap lists missing page ${m[1]}`);
  else if (/<meta name="robots" content="noindex/.test(await readFile(f, 'utf8')))
    notes.push(`sitemap page ${m[1]} is noindex (expected while pre-launch)`);
}
if (!existsSync(path.join(DIST, 'robots.txt'))) errors.push('robots.txt missing');

console.log(`Checked ${htmlFiles.length} HTML pages, ${files.length} files.`);
if (external.size) console.log(`External links (${external.size}):\n  ${[...external].join('\n  ')}`);
if (notes.length) console.log(`Notes: ${notes.length} (e.g. ${notes[0]})`);
if (errors.length) {
  console.error(`\n✗ ${errors.length} error(s):`);
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}
console.log('✓ No errors: links, assets, anchors, ids, headings, alt text, meta tags and JSON-LD all OK.');
