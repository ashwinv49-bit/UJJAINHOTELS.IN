#!/usr/bin/env node
/**
 * Renders brand PNGs from the SVG mark, plus the default Open Graph image.
 * Requires Playwright + Chromium (dev machine only; output is committed).
 *   node scripts/render-brand-assets.cjs
 * Then: python3 scripts/finish-brand-assets.py   (JPEG/ICO conversion)
 */
const { chromium } = require('playwright');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const svg = readFileSync(`${root}/src/assets/icons/icon.svg`, 'utf8');
const heroArt = readFileSync(`${root}/src/components/hero-media.mjs`, 'utf8').match(/<svg viewBox="0 0 1440 720"[\s\S]*?<\/svg>/)[0];
// Fonts are inlined as data URIs (file:// URLs are blocked from about:blank pages)
const font = (f) => `url(data:font/woff2;base64,${readFileSync(`${root}/src/assets/fonts/${f}`).toString('base64')})`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const [size, out] of [[180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'logo-512.png'], [32, 'favicon-32.png'], [16, 'favicon-16.png']]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{width:${size}px;height:${size}px;display:block}</style>${svg}`);
    await page.screenshot({ path: `${root}/src/assets/icons/${out}`, omitBackground: true });
  }
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`<!doctype html><style>
@font-face{font-family:Inter;src:${font('inter-latin-var.woff2')};font-weight:100 900}
@font-face{font-family:Playfair;src:${font('playfair-display-latin-var.woff2')};font-weight:400 900}
@font-face{font-family:Playfair;font-style:italic;src:${font('playfair-display-latin-var-italic.woff2')};font-weight:400 900}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:linear-gradient(180deg,#1E3B43,#0F2025);font-family:Inter}
.art{position:absolute;top:0;bottom:0;left:300px;right:-40px}.art svg{width:100%;height:100%}
.scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(15,32,37,.92) 0%,rgba(15,32,37,.6) 55%,rgba(15,32,37,0) 85%)}
.c{position:absolute;left:80px;top:76px;right:300px;color:#F7F5F0}
.brand{display:flex;align-items:center;gap:18px}.brand svg{width:64px;height:64px}
.name{font-weight:750;letter-spacing:.2em;font-size:24px}
h1{font-family:Playfair;font-weight:600;font-size:74px;line-height:1.05;margin:64px 0 0;color:#fff;max-width:680px}
h1 em{font-weight:500;color:#D5A45A}
p{font-size:25px;line-height:1.4;color:#cfd8d6;margin:26px 0 0;max-width:720px}
.dom{position:absolute;left:80px;bottom:60px;display:flex;align-items:center;gap:16px;font-size:22px;letter-spacing:.06em;color:#D5A45A;font-weight:600}
.dom::before{content:"";width:48px;height:2px;background:#D5A45A}
</style><div class="art">${heroArt.replace('xMaxYMax slice', 'xMaxYMid slice')}</div><div class="scrim"></div>
<div class="c"><div class="brand">${svg}<span class="name">HOTELS UJJAIN</span></div>
<h1>Find your right stay in <em>Ujjain</em></h1><p>Hotels near Mahakal Temple, Ram Ghat and the station.</p></div>
<div class="dom">HotelsUjjain.in</div>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${root}/src/assets/images/og/og-default.png` });
  await browser.close();
  console.log('Rendered icons and OG image');
})();
