#!/usr/bin/env node
/**
 * HotelsUjjain.in — zero-dependency static site builder.
 *
 *   node scripts/build.mjs            → builds src/ into dist/
 *
 * What it does
 *   1. Loads data/*.json into `data` (file names become camelCase keys).
 *   2. Renders every src/pages/**\/*.html through src/layouts/base.html.
 *      Pages start with a front-matter block (key: value lines between ---).
 *   3. Generates "coming soon" stub pages (noindex) for planned URLs that
 *      do not have a real page yet, so the site never ships broken links.
 *   4. Copies src/assets (inlining CSS @imports) and src/static into dist/.
 *   5. Writes sitemap.xml (indexable pages only) and robots.txt.
 *
 * Template syntax (deliberately tiny)
 *   {{ page.title }}              HTML-escaped value
 *   {{{ content }}}               raw value
 *   {{> component key="value" }}  src/components/<name>.mjs (default export
 *                                 (ctx, props) => html) or <name>.html
 */
import { readFile, writeFile, mkdir, rm, readdir, stat, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as H from './lib/hotels.mjs';
import { partnerLinksFor, partnerLinkProblems } from './lib/partner-links.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const DATA = path.join(ROOT, 'data');

const warnings = [];
const warn = (msg) => warnings.push(msg);

// ---------------------------------------------------------------- helpers
export const escapeHtml = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const camel = (s) => s.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
const get = (obj, dotted) => dotted.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

async function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^\s*([\w.-]+)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v === 'true') v = true;
    else if (v === 'false') v = false;
    meta[kv[1]] = v;
  }
  return { meta, body: raw.slice(m[0].length) };
}

function gitDate(file) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim() || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- templating
const componentCache = new Map();

async function loadComponent(name) {
  if (componentCache.has(name)) return componentCache.get(name);
  const mjs = path.join(SRC, 'components', `${name}.mjs`);
  const html = path.join(SRC, 'components', `${name}.html`);
  let fn;
  if (existsSync(mjs)) {
    fn = (await import(pathToFileURL(mjs).href)).default;
  } else if (existsSync(html)) {
    const tpl = await readFile(html, 'utf8');
    fn = (ctx, props) => render(tpl, { ...ctx, props });
  } else {
    throw new Error(`Unknown component "${name}"`);
  }
  componentCache.set(name, fn);
  return fn;
}

function parseProps(str) {
  const props = {};
  for (const m of str.matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)) props[camel(m[1])] = m[2];
  return props;
}

async function render(tpl, ctx) {
  // components first (they may emit {{ }} of their own, rendered recursively)
  const parts = [];
  let last = 0;
  for (const m of tpl.matchAll(/\{\{>\s*([\w-]+)([^}]*)\}\}/g)) {
    parts.push(tpl.slice(last, m.index));
    const fn = await loadComponent(m[1]);
    const out = await fn(ctx, parseProps(m[2]));
    parts.push(await render(out, ctx));
    last = m.index + m[0].length;
  }
  parts.push(tpl.slice(last));
  let html = parts.join('');
  html = html.replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_, k) => String(get(ctx, k) ?? ''));
  html = html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => {
    const v = get(ctx, k);
    if (v === undefined) warn(`Template variable "${k}" is undefined (${ctx.page?.source ?? 'unknown page'})`);
    return escapeHtml(v);
  });
  return html;
}

// ---------------------------------------------------------------- data
async function loadData() {
  const data = {};
  for (const file of await walk(DATA)) {
    if (!file.endsWith('.json')) continue;
    const rel = path.relative(DATA, file);
    if (rel.startsWith('schema')) continue; // JSON Schemas are documentation, not content
    if (rel.startsWith('hotels')) continue; // hotel records load separately (loadHotels) — never as flat keys
    const key = camel(path.basename(file, '.json'));
    data[key] = JSON.parse(await readFile(file, 'utf8'));
  }
  return data;
}

// ---------------------------------------------------------------- hotels
const HOTELS_DIR = path.join(DATA, 'hotels');
const PLACEHOLDER_DIR = path.join(DATA, 'hotels-placeholder');
const notices = [];

/** Read every hotel record (real + placeholder) with its source file. */
async function loadHotels() {
  const out = [];
  for (const [dir, inPlaceholderDir] of [[HOTELS_DIR, false], [PLACEHOLDER_DIR, true]]) {
    for (const file of await walk(dir)) {
      if (!file.endsWith('.json')) continue;
      const source = path.relative(ROOT, file);
      let record;
      try {
        record = JSON.parse(await readFile(file, 'utf8'));
      } catch (e) {
        throw new Error(`${source}: invalid JSON — ${e.message}`);
      }
      out.push({ record, source, inPlaceholderDir });
    }
  }
  return out;
}

/**
 * Validate all records and decide what is public. Only verified, valid
 * records are published; placeholders only in local design builds.
 * Problems with VERIFIED records are build warnings (fatal with --strict);
 * draft/contacted records are reported by `npm run hotels`, not here.
 */
function prepareHotels(data, loaded) {
  const site = data.site;
  const today = H.todayIST();
  const ctx = {
    areas: new Set((data.areas ?? []).map((a) => a.slug)),
    facilities: new Set((data.facilities ?? []).map((f) => f.slug)),
    reservedSlugs: new Set([...(data.categories ?? []).map((c) => c.slug), ...(data.areas ?? []).map((a) => a.slug), 'sample-listing']),
    affiliates: data.affiliates,
    today,
  };
  const seen = new Map();
  const results = loaded.map(({ record, source, inPlaceholderDir }) => {
    const { errors, warnings, notices: recNotices } = H.validateHotel(record, ctx);
    if (inPlaceholderDir && record.placeholder !== true) errors.push('records in data/hotels-placeholder/ must have "placeholder": true');
    if (!inPlaceholderDir && record.placeholder === true) errors.push('placeholder records belong in data/hotels-placeholder/, not data/hotels/');
    if (seen.has(record.slug)) errors.push(`duplicate slug "${record.slug}" (also in ${seen.get(record.slug)})`);
    seen.set(record.slug, source);
    const isPublic = H.isPublic(record, { showSamples: site.showSamples, errors });
    const relevant = !record.placeholder || site.showSamples; // placeholders don't matter on Netlify builds
    if (relevant && record.status === 'verified') {
      for (const e of errors) warn(`${source}: NOT PUBLISHED — ${e}`);
      for (const w of warnings) warn(`${source}: ${w}`);
      for (const n of recNotices) notices.push(`${source}: ${n}`);
    }
    return { record, source, errors, isPublic };
  });

  data.hotelRecords = results;
  data.publicHotels = results
    .filter((r) => r.isPublic)
    .map((r) => H.toViewModel(r.record, { site, data, affiliates: data.affiliates, today }))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  data.featuredHotels = data.publicHotels.filter((h) => h.featured);
}

const BRAND = ' | HotelsUjjain.in';
const withBrand = (title) => (title.length + BRAND.length <= 60 ? title + BRAND : title);

function metaDescription(text, fallback) {
  let d = (text || '').trim();
  if (d.length > 155) d = `${d.slice(0, 152).replace(/\s+\S*$/, '')}…`;
  if (d.length < 50) d = `${d} ${fallback}`.trim();
  return d;
}

/** Profile + collection pages generated from the hotel data. */
function hotelPages(data) {
  const site = data.site;
  const pages = [];

  for (const h of data.publicHotels) {
    const crumbs = [
      { name: 'Home', path: '/' },
      { name: 'Hotels', path: '/hotels/' },
      ...(h.areaUrl ? [{ name: h.areaTitle, path: h.areaUrl }] : []),
      { name: h.name, path: h.url },
    ];
    let title = `${h.name}, ${h.areaTitle}, Ujjain${BRAND}`;
    if (title.length > 60) title = `${h.name}, Ujjain${BRAND}`;
    if (title.length > 60) title = `${h.name}${BRAND}`;
    pages.push({
      path: h.url,
      title,
      description: metaDescription(h.summary, `${h.propertyTypeLabel || 'Stay'} in ${h.areaTitle}, Ujjain. Call or WhatsApp the hotel directly.`),
      hotel: h,
      crumbs,
      noindex: h.placeholder,
      ogImage: h.photos[0]?.src,
      lastmod: h.lastVerified,
      bodyClass: 'page page--hotel',
      structuredData: H.jsonLdScript(H.hotelJsonLd(h, site)) + H.jsonLdScript(H.breadcrumbJsonLd(crumbs, site)),
      source: `hotel profile (${h.slug})`,
      body: '{{> hotel-profile }}',
    });
  }

  const all = (data.plannedPages ?? []).find((p) => p.collection === 'all');
  const collections = [
    ...(all ? [{ ...all, url: all.path, rule: {}, kind: 'all' }] : []),
    ...(data.categories ?? []).map((c) => ({ ...c, rule: c.match, kind: 'category' })),
    ...(data.areas ?? []).map((a) => ({ ...a, rule: { area: a.slug }, kind: 'area' })),
  ];
  // Affiliate partner links: only tracked, enabled, host-checked links are shown.
  for (const p of partnerLinkProblems(data)) notices.push(p);
  const done = new Set();
  for (const c of collections) {
    if (!c.url || done.has(c.url)) continue; // categories win over areas with the same URL
    done.add(c.url);
    const hotels = data.publicHotels.filter((h) => H.matchesRule(h, c.rule));
    const heading = c.heading ?? c.title;
    const crumbs = [{ name: 'Home', path: '/' }, ...(c.kind === 'all' ? [] : [{ name: 'Hotels', path: '/hotels/' }]), { name: heading, path: c.url }];
    const realCount = hotels.filter((h) => !h.placeholder).length;
    pages.push({
      path: c.url,
      title: withBrand(c.pageTitle ?? c.title),
      description: c.description ?? c.summary,
      collection: { ...c, heading, intro: c.intro ?? c.summary, hotels, partnerLinks: partnerLinksFor(c.kind === 'all' ? 'all' : c.slug, data) },
      crumbs,
      // Empty (or placeholder-only) collections are thin content: keep them out of search.
      noindex: realCount === 0,
      lastmod: hotels.map((h) => h.lastVerified).filter(Boolean).sort().at(-1) ?? null,
      bodyClass: 'page page--collection',
      structuredData: H.jsonLdScript(H.breadcrumbJsonLd(crumbs, site)),
      source: `collection (${c.url})`,
      body: '{{> hotel-directory }}',
    });
  }
  return pages;
}

// ---------------------------------------------------------------- pages
function urlPathFor(relFile) {
  // index.html → /, about.html → /about/, hotels/index.html → /hotels/, 404.html → /404.html
  const noExt = relFile.replace(/\\/g, '/').replace(/\.html$/, '');
  if (noExt === '404') return '/404.html';
  if (noExt === 'index') return '/';
  if (noExt.endsWith('/index')) return `/${noExt.slice(0, -'index'.length)}`;
  return `/${noExt}/`;
}

function outFileFor(urlPath) {
  if (urlPath.endsWith('.html')) return path.join(DIST, urlPath);
  return path.join(DIST, urlPath, 'index.html');
}

/** Planned URLs that get a noindex "coming soon" page until a real page exists. */
function plannedPages(data) {
  const fromCollections = [
    ...(data.categories ?? []),
    ...(data.areas ?? []),
    ...(data.guides ?? []),
  ].map((item) => ({
    path: item.url,
    title: item.pageTitle ?? item.title,
    heading: item.heading ?? item.title,
    description: item.description ?? item.summary,
    intro: item.summary,
  }));
  return [...fromCollections, ...(data.plannedPages ?? [])]
    .filter((p) => p.path)
    // previewOnly pages (e.g. /hotels/sample-listing/) exist only where sample content is shown
    .filter((p) => !(p.previewOnly && !data.site.showSamples));
}

async function buildPages(data, generatedPages = []) {
  const site = data.site;
  const layout = await readFile(path.join(SRC, 'layouts', 'base.html'), 'utf8');
  const stubTpl = await readFile(path.join(SRC, 'layouts', 'stub.html'), 'utf8');
  const pages = [];

  for (const file of await walk(path.join(SRC, 'pages'))) {
    if (!file.endsWith('.html')) continue;
    const rel = path.relative(path.join(SRC, 'pages'), file);
    const { meta, body } = parseFrontMatter(await readFile(file, 'utf8'));
    pages.push({ ...meta, path: urlPathFor(rel), source: path.relative(ROOT, file), body, lastmod: gitDate(file) });
  }
  // Hotel profiles and collections replace any "coming soon" stub at the same URL
  for (const g of generatedPages) {
    if (pages.some((p) => p.path === g.path)) throw new Error(`Generated page ${g.path} clashes with src/pages`);
    pages.push(g);
  }

  const realPaths = new Set(pages.map((p) => p.path));
  const seenPlanned = new Set();
  for (const p of plannedPages(data)) {
    if (realPaths.has(p.path) || seenPlanned.has(p.path)) continue;
    seenPlanned.add(p.path);
    pages.push({ ...p, stub: true, noindex: true, source: 'planned page (stub)', body: stubTpl });
  }

  const titles = new Map();
  const descriptions = new Map();
  for (const page of pages) {
    // intrinsic: stubs, 404 and pages that opt out. Pre-launch (site.indexing=false) adds noindex everywhere.
    page.excludeFromSitemap = page.noindex === true || page.path === '/404.html';
    page.noindex = page.excludeFromSitemap || site.indexing !== true;
    page.bodyClass = page.bodyClass || (page.stub ? 'page page--stub' : 'page');
    // Netlify's free-plan badge is fixed bottom-right: leave room so it never covers the footer
    if (site.hosting?.netlifyFreePlanBadge) page.bodyClass += ' has-host-badge';
    page.canonical = site.url.replace(/\/$/, '') + page.path;
    page.robots = page.noindex ? 'noindex, nofollow' : 'index, follow';
    page.ogImage = site.url.replace(/\/$/, '') + (page.ogImage || site.defaultOgImage);
    page.ogType = page.ogType || 'website';

    if (!page.title) warn(`${page.source}: missing title`);
    if (!page.description) warn(`${page.source}: missing description`);
    if (page.title && page.title.length > 65) warn(`${page.source}: title is ${page.title.length} chars (aim ≤ 60)`);
    if (page.description && page.description.length > 165)
      warn(`${page.source}: description is ${page.description.length} chars (aim ≤ 160)`);
    if (!page.stub && !page.excludeFromSitemap) {
      if (titles.has(page.title)) warn(`Duplicate title "${page.title}" (${titles.get(page.title)}, ${page.source})`);
      if (descriptions.has(page.description)) warn(`Duplicate description on ${page.source}`);
      titles.set(page.title, page.source);
      descriptions.set(page.description, page.source);
    }
  }

  for (const page of pages) {
    const ctx = { site, data, page, pages, year: new Date().getFullYear() };
    const content = await render(page.body, ctx);
    const html = await render(layout, { ...ctx, content });
    const out = outFileFor(page.path);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, html);
  }
  return pages;
}

// ---------------------------------------------------------------- assets
async function inlineCssImports(file, seen = new Set()) {
  if (seen.has(file)) return '';
  seen.add(file);
  const css = await readFile(file, 'utf8');
  const parts = [];
  let last = 0;
  for (const m of css.matchAll(/@import\s+(?:url\()?["']([^"')]+)["']\)?\s*;/g)) {
    parts.push(css.slice(last, m.index));
    parts.push(await inlineCssImports(path.resolve(path.dirname(file), m[1]), seen));
    last = m.index + m[0].length;
  }
  parts.push(css.slice(last));
  return parts.join('');
}

const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();

async function copyAssets() {
  const assetsSrc = path.join(SRC, 'assets');
  const hashes = {};
  for (const file of await walk(assetsSrc)) {
    const rel = path.relative(assetsSrc, file);
    // CSS partials (files starting with _) are inlined into main.css, not shipped
    if (rel.startsWith(`css${path.sep}_`)) continue;
    const out = path.join(DIST, 'assets', rel);
    await mkdir(path.dirname(out), { recursive: true });
    if (file.endsWith('.css')) {
      const css = minifyCss(await inlineCssImports(file));
      await writeFile(out, css);
      hashes[`/assets/${rel.replace(/\\/g, '/')}`] = createHash('sha256').update(css).digest('hex').slice(0, 10);
    } else {
      await copyFile(file, out);
      if (file.endsWith('.js')) {
        hashes[`/assets/${rel.replace(/\\/g, '/')}`] = createHash('sha256').update(await readFile(file)).digest('hex').slice(0, 10);
      }
    }
  }
  for (const file of await walk(path.join(SRC, 'static'))) {
    const out = path.join(DIST, path.relative(path.join(SRC, 'static'), file));
    await mkdir(path.dirname(out), { recursive: true });
    await copyFile(file, out);
  }
  return hashes;
}

/** Append ?v=<hash> to CSS/JS references so they can be cached for a year. */
async function versionAssetUrls(hashes) {
  for (const file of await walk(DIST)) {
    if (!file.endsWith('.html')) continue;
    let html = await readFile(file, 'utf8');
    html = html.replace(/(href|src)="(\/assets\/[^"?#]+\.(?:css|js))"/g, (m, attr, url) =>
      hashes[url] ? `${attr}="${url}?v=${hashes[url]}"` : m
    );
    await writeFile(file, html);
  }
}

/**
 * Fill the CSP placeholders in dist/_headers.
 * Strict mode: sha256 hashes of our inline <script>s, no inline styles.
 * Netlify free plan: Netlify injects its required "Hosted on Netlify" badge,
 * which renders with inline script/style (content varies by viewport and by
 * Netlify release, so hashes would break silently) → allow 'unsafe-inline'.
 * Hashes must be omitted in that mode: browsers ignore 'unsafe-inline' when a hash is present.
 */
async function injectCsp(site) {
  const headersFile = path.join(DIST, '_headers');
  if (!existsSync(headersFile)) return;
  let scriptSrc;
  let styleSrc = '';
  if (site.hosting?.netlifyFreePlanBadge) {
    scriptSrc = "'unsafe-inline'";
    styleSrc = " 'unsafe-inline'";
  } else {
    const hashes = new Set();
    for (const file of await walk(DIST)) {
      if (!file.endsWith('.html')) continue;
      const html = await readFile(file, 'utf8');
      for (const m of html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)) {
        hashes.add(`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
      }
    }
    scriptSrc = [...hashes].join(' ');
  }
  const headers = await readFile(headersFile, 'utf8');
  await writeFile(
    headersFile,
    headers.replace('{{INLINE_SCRIPT_HASHES}}', scriptSrc).replace('{{STYLE_SRC_EXTRA}}', styleSrc)
  );
}

// ---------------------------------------------------------------- sitemap & robots
async function writeSeoFiles(site, pages) {
  const base = site.url.replace(/\/$/, '');
  // Lists every page that will be indexable once data/site.json → "indexing" is true.
  const indexable = pages.filter((p) => !p.excludeFromSitemap).sort((a, b) => a.path.localeCompare(b.path));
  const urls = indexable
    .map((p) => `  <url>\n    <loc>${base}${p.path}</loc>${p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ''}\n  </url>`)
    .join('\n');
  await writeFile(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );

  const robots =
    site.indexing === true
      ? `# ${site.domainLabel}\nUser-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`
      : `# ${site.domainLabel} — PROTOTYPE / PRE-LAUNCH\n# Indexing is off: pre-launch (data/site.json → "indexing": false)\n# or a non-production Netlify build (Deploy Preview / branch deploy).\nUser-agent: *\nDisallow: /\n\nSitemap: ${base}/sitemap.xml\n`;
  await writeFile(path.join(DIST, 'robots.txt'), robots);
  return indexable.length;
}

/**
 * Safety rail: when samples must be hidden, fail the build if any sample
 * marker reaches dist/. A failed Netlify build never publishes, so sample
 * hotels can't go live by accident.
 */
async function assertNoSamples(data) {
  const placeholders = (data.hotelRecords ?? []).filter((r) => r.record.placeholder === true);
  const markers = [
    'data-sample="true"',
    'data-placeholder="true"',
    '/hotels/sample-listing/',
    'PLACEHOLDER Hotel',
    ...(data.sampleHotels ?? []).map((h) => h.name),
    ...placeholders.flatMap((r) => [r.record.name, `/hotels/${r.record.slug}/`]),
  ];
  const leaks = await findInDist(markers);
  if (leaks.length) {
    throw new Error(`Sample/placeholder content found in a build where it must be hidden:\n  • ${leaks.join('\n  • ')}`);
  }
}

/**
 * Safety rail (every build): hotels that are not public — draft, contacted,
 * or verified-but-invalid — must never get a page, a link or a card.
 */
async function assertNoPrivateListings(data) {
  const hidden = (data.hotelRecords ?? []).filter((r) => !r.isPublic && r.record.slug);
  const markers = hidden.flatMap((r) => [`/hotels/${r.record.slug}/`, `data-hotel="${r.record.slug}"`]);
  const leaks = await findInDist(markers);
  if (leaks.length) {
    throw new Error(`Unpublished hotel listing found in the build (only verified listings may appear):\n  • ${leaks.join('\n  • ')}`);
  }
}

async function findInDist(markers) {
  const leaks = [];
  for (const file of await walk(DIST)) {
    if (!file.endsWith('.html')) continue;
    const html = await readFile(file, 'utf8');
    for (const m of markers) if (m && html.includes(m)) leaks.push(`${path.relative(DIST, file)} contains "${m}"`);
  }
  return leaks;
}

// ---------------------------------------------------------------- main
async function main() {
  const started = Date.now();
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const data = await loadData();
  if (!data.site?.url) throw new Error('data/site.json must define "url"');

  // On Netlify, only the production context may ever be indexable: branch
  // deploys are publicly crawlable by default, so force noindex there.
  if (process.env.NETLIFY === 'true' && process.env.CONTEXT !== 'production' && data.site.indexing) {
    data.site.indexing = false;
    console.log(`Netlify context "${process.env.CONTEXT}": indexing forced OFF`);
  }

  // Sample hotels are design-only content (owner's rule: never publish fake listings).
  // Every Netlify build — the live site AND Deploy Previews — hides them, so the
  // preview the owner approves looks exactly like what goes live. Local builds
  // show them for design work; SHOW_SAMPLES=0 simulates the live result locally.
  const onNetlify = process.env.NETLIFY === 'true';
  data.site.showSamples = onNetlify ? false : process.env.SHOW_SAMPLES !== '0';

  prepareHotels(data, await loadHotels());
  const pages = await buildPages(data, hotelPages(data));
  if (!data.site.showSamples) await assertNoSamples(data);
  await assertNoPrivateListings(data);
  const hashes = await copyAssets();
  await versionAssetUrls(hashes);
  await injectCsp(data.site);
  const indexed = await writeSeoFiles(data.site, pages);

  const stubs = pages.filter((p) => p.stub).length;
  console.log(
    `Built ${pages.length} pages (${pages.length - stubs} real, ${stubs} planned stubs) → dist/ in ${Date.now() - started} ms`
  );
  console.log(`Indexing: ${data.site.indexing === true ? 'ON' : 'OFF (pre-launch)'} · sitemap entries: ${indexed}`);
  console.log(`Sample listings: ${data.site.showSamples ? 'SHOWN (local design build)' : 'HIDDEN (live / preview mode)'}`);
  const recs = data.hotelRecords;
  const real = recs.filter((r) => !r.record.placeholder);
  const count = (s) => real.filter((r) => r.record.status === s).length;
  console.log(
    `Hotels: ${real.length} real record(s) — ${count('verified')} verified, ${count('contacted')} contacted, ${count('draft')} draft · ` +
      `published: ${data.publicHotels.filter((h) => !h.placeholder).length} real` +
      (data.site.showSamples ? ` + ${data.publicHotels.filter((h) => h.placeholder).length} placeholder (local only)` : '')
  );
  if (notices.length) {
    console.log(`\n${notices.length} notice(s) (not errors):`);
    for (const n of notices) console.log(`  · ${n}`);
  }
  if (warnings.length) {
    console.warn(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.warn(`  • ${w}`);
    if (process.argv.includes('--strict')) process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
