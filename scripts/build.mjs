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
    const key = camel(path.basename(file, '.json'));
    data[key] = JSON.parse(await readFile(file, 'utf8'));
  }
  return data;
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
  return [...fromCollections, ...(data.plannedPages ?? [])].filter((p) => p.path);
}

async function buildPages(data) {
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
    page.canonical = site.url.replace(/\/$/, '') + page.path;
    page.robots = page.noindex ? 'noindex, nofollow' : 'index, follow';
    page.ogImage = site.url.replace(/\/$/, '') + (page.ogImage || site.defaultOgImage);
    page.ogType = page.ogType || 'website';

    if (!page.title) warn(`${page.source}: missing title`);
    if (!page.description) warn(`${page.source}: missing description`);
    if (page.title && page.title.length > 65) warn(`${page.source}: title is ${page.title.length} chars (aim ≤ 60)`);
    if (page.description && page.description.length > 165)
      warn(`${page.source}: description is ${page.description.length} chars (aim ≤ 160)`);
    if (!page.stub) {
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

/** Put sha256 hashes of inline <script>s into the CSP in dist/_headers. */
async function injectCspHashes() {
  const headersFile = path.join(DIST, '_headers');
  if (!existsSync(headersFile)) return;
  const hashes = new Set();
  for (const file of await walk(DIST)) {
    if (!file.endsWith('.html')) continue;
    const html = await readFile(file, 'utf8');
    for (const m of html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)) {
      hashes.add(`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
    }
  }
  const headers = await readFile(headersFile, 'utf8');
  await writeFile(headersFile, headers.replace('{{INLINE_SCRIPT_HASHES}}', [...hashes].join(' ')));
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
      : `# ${site.domainLabel} — PROTOTYPE / PRE-LAUNCH\n# Indexing is switched off (data/site.json → "indexing": false).\n# Set it to true at launch to publish the production robots.txt.\nUser-agent: *\nDisallow: /\n\nSitemap: ${base}/sitemap.xml\n`;
  await writeFile(path.join(DIST, 'robots.txt'), robots);
  return indexable.length;
}

// ---------------------------------------------------------------- main
async function main() {
  const started = Date.now();
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const data = await loadData();
  if (!data.site?.url) throw new Error('data/site.json must define "url"');

  const pages = await buildPages(data);
  const hashes = await copyAssets();
  await versionAssetUrls(hashes);
  await injectCspHashes();
  const indexed = await writeSeoFiles(data.site, pages);

  const stubs = pages.filter((p) => p.stub).length;
  console.log(
    `Built ${pages.length} pages (${pages.length - stubs} real, ${stubs} planned stubs) → dist/ in ${Date.now() - started} ms`
  );
  console.log(`Indexing: ${data.site.indexing === true ? 'ON' : 'OFF (pre-launch)'} · sitemap entries: ${indexed}`);
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
