#!/usr/bin/env node
/**
 * Minimal local preview server for dist/ (no dependencies).
 *   node scripts/serve.mjs [port]     → http://localhost:4173
 * Mirrors Netlify: /about/ → about/index.html, unknown paths → 404.html, and the
 * rules in dist/_headers (CSP etc.) are applied so QA catches header problems.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.argv[2] || process.env.PORT || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

/** Parse dist/_headers (Netlify syntax) so local previews send the same headers. */
async function loadHeaderRules() {
  try {
    const rules = [];
    let current = null;
    for (const line of (await readFile(path.join(DIST, '_headers'), 'utf8')).split(/\r?\n/)) {
      if (!line.trim() || line.trim().startsWith('#')) continue;
      if (!/^\s/.test(line)) {
        current = { pattern: line.trim(), headers: {} };
        rules.push(current);
      } else if (current) {
        const i = line.indexOf(':');
        current.headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
      }
    }
    return rules;
  } catch {
    return [];
  }
}
const matches = (pattern, urlPath) =>
  pattern.endsWith('*') ? urlPath.startsWith(pattern.slice(0, -1)) : urlPath === pattern;

async function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  let file = path.join(DIST, clean);
  if (!file.startsWith(DIST)) return null;
  try {
    const s = await stat(file);
    if (s.isDirectory()) {
      if (!urlPath.endsWith('/')) return { redirect: `${urlPath}/` };
      file = path.join(file, 'index.html');
      await stat(file);
    }
    return { file };
  } catch {
    return null;
  }
}

const headerRules = await loadHeaderRules();

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  for (const rule of headerRules) {
    if (!matches(rule.pattern, url.pathname)) continue;
    for (const [k, v] of Object.entries(rule.headers)) {
      // HSTS and upgrade-insecure-requests would break plain-http localhost
      if (k === 'Strict-Transport-Security') continue;
      res.setHeader(k, k === 'Content-Security-Policy' ? v.replace(/;\s*upgrade-insecure-requests/, '') : v);
    }
  }
  const hit = await resolveFile(url.pathname);
  if (hit?.redirect) {
    res.writeHead(301, { Location: hit.redirect + url.search });
    return res.end();
  }
  const file = hit?.file ?? path.join(DIST, '404.html');
  try {
    const body = await readFile(file);
    res.writeHead(hit ? 200 : 404, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}).listen(PORT, () => console.log(`Serving dist/ at http://localhost:${PORT}`));
