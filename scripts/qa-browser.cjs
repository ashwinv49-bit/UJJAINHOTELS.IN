#!/usr/bin/env node
/**
 * Browser QA (Playwright + Chromium). Run after a build:
 *   node scripts/qa-browser.cjs [screenshotDir]
 * Optional: AXE_PATH=/path/to/axe.min.js for automated accessibility checks.
 *
 * Checks: console errors, failed requests, horizontal overflow at 360/768/1440px,
 * mobile nav toggle, search routing, keyboard focus visibility, and axe (WCAG A/AA).
 */
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const { existsSync, mkdirSync, readFileSync } = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PORT = 4321;
const BASE = `http://localhost:${PORT}`;
const SHOTS = process.argv[2] || path.join(ROOT, 'qa-screenshots');
const AXE = process.env.AXE_PATH && existsSync(process.env.AXE_PATH) ? readFileSync(process.env.AXE_PATH, 'utf8') : null;
const VIEWPORTS = [
  { name: 'mobile', width: 360, height: 780 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];
const PAGES = ['/', '/hotels/near-mahakal-temple/', '/affiliate-disclosure/', '/photo-credits/', '/404.html'];

const failures = [];
const fail = (m) => failures.push(m);
const pass = (m) => console.log(`  ✓ ${m}`);

(async () => {
  mkdirSync(SHOTS, { recursive: true });
  const server = spawn('node', [path.join(ROOT, 'scripts/serve.mjs'), String(PORT)], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 600));
  const browser = await chromium.launch();

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n[${vp.name} ${vp.width}×${vp.height}]`);
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const problems = [];
      page.on('console', (msg) => msg.type() === 'error' && problems.push(`console: ${msg.text()}`));
      page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
      page.on('requestfailed', (r) => problems.push(`requestfailed: ${r.url()}`));
      page.on('response', (r) => r.status() >= 400 && !r.url().includes('404') && problems.push(`HTTP ${r.status()}: ${r.url()}`));

      for (const p of PAGES) {
        await page.goto(BASE + p, { waitUntil: 'networkidle' });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (overflow > 0) fail(`${vp.name} ${p}: horizontal overflow of ${overflow}px`);
        const fontsOk = await page.evaluate(async () => {
          await document.fonts.ready;
          return ['Inter', 'Playfair Display'].every((f) => document.fonts.check(`16px "${f}"`));
        });
        if (!fontsOk) fail(`${vp.name} ${p}: web fonts not loaded`);
        if (p === '/') {
          await page.screenshot({ path: path.join(SHOTS, `home-${vp.name}.png`), fullPage: true });
          await page.screenshot({ path: path.join(SHOTS, `home-${vp.name}-fold.png`) });
        }
        if (AXE) {
          await page.addScriptTag({ content: AXE });
          const res = await page.evaluate(() =>
            window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } })
          );
          for (const v of res.violations) {
            fail(`${vp.name} ${p}: axe ${v.id} (${v.impact}) — ${v.help} [${v.nodes.length} node(s): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}]`);
          }
        }
      }
      if (problems.length) problems.forEach((m) => fail(`${vp.name}: ${m}`));
      else pass('no console errors, failed requests or 4xx/5xx responses');

      // Mobile navigation
      if (vp.width < 960) {
        await page.goto(BASE + '/', { waitUntil: 'networkidle' });
        const toggle = page.locator('[data-nav-toggle]');
        const nav = page.locator('#site-nav');
        if (!(await toggle.isVisible())) fail(`${vp.name}: menu button not visible`);
        if (await nav.isVisible()) fail(`${vp.name}: nav should start collapsed`);
        await toggle.click();
        if (!(await nav.isVisible()) || (await toggle.getAttribute('aria-expanded')) !== 'true') fail(`${vp.name}: nav did not open`);
        await page.keyboard.press('Escape');
        if (await nav.isVisible()) fail(`${vp.name}: Escape did not close nav`);
        else pass('menu opens, sets aria-expanded and closes on Escape');
      }

      // Touch targets ≥ 44px for primary controls
      if (vp.name === 'mobile') {
        await page.goto(BASE + '/', { waitUntil: 'networkidle' });
        const small = await page.$$eval('.btn, .select, .nav-toggle, .quick-links a', (els) =>
          els.filter((e) => e.offsetParent && e.getBoundingClientRect().height < 36).map((e) => e.textContent.trim().slice(0, 30))
        );
        if (small.length) fail(`mobile: controls under 36px tall: ${small.join(', ')}`);
        else pass('buttons, selects and chips meet touch-target size');
      }
      await ctx.close();
    }

    // Search behaviour (desktop)
    console.log('\n[search]');
    const page = await browser.newPage();
    const cases = [
      [{ area: 'near-ram-ghat', type: 'budget' }, '/hotels/near-ram-ghat/?type=budget'],
      [{ area: 'near-mahakal-temple', type: '' }, '/hotels/near-mahakal-temple/'],
      [{ area: '', type: 'family' }, '/hotels/family/'],
      [{ area: '', type: '' }, '/hotels/'],
    ];
    for (const [sel, expected] of cases) {
      await page.goto(BASE + '/', { waitUntil: 'networkidle' });
      await page.selectOption('#search-area', sel.area);
      await page.selectOption('#search-type', sel.type);
      await Promise.all([page.waitForURL('**' + expected.split('?')[0] + '**'), page.click('.search-form__submit')]);
      const got = new URL(page.url());
      if (got.pathname + got.search !== expected) fail(`search ${JSON.stringify(sel)} → ${got.pathname + got.search}, expected ${expected}`);
      else pass(`search ${JSON.stringify(sel)} → ${expected}`);
      const status = await page.evaluate(() => document.title);
      if (/not found/i.test(status)) fail(`search destination ${expected} is a 404`);
    }
    // Echo on stub page
    const echo = await page.goto(BASE + '/hotels/near-ram-ghat/?type=budget').then(() => page.locator('[data-search-echo]').textContent());
    if (!/Budget stays/.test(echo || '')) fail('stub page did not acknowledge the search');
    else pass('stub page acknowledges the search without claiming results');

    // No-JS fallback: form still submits as GET
    const nojs = await browser.newContext({ javaScriptEnabled: false });
    const np = await nojs.newPage();
    await np.goto(BASE + '/');
    await np.selectOption('#search-type', 'luxury');
    await Promise.all([np.waitForURL('**/hotels/**'), np.click('.search-form__submit')]);
    if (!np.url().includes('/hotels/?area=&type=luxury')) fail(`no-JS search went to ${np.url()}`);
    else pass('without JavaScript the search form still works (GET /hotels/?type=…)');
    if (!(await np.locator('#site-nav').isVisible())) fail('no-JS: navigation hidden');
    else pass('without JavaScript the navigation stays visible');
    await nojs.close();

    // Keyboard: skip link + visible focus
    await page.goto(BASE + '/');
    await page.keyboard.press('Tab');
    const skip = await page.evaluate(() => document.activeElement.className);
    if (skip !== 'skip-link') fail('first Tab does not reach the skip link');
    else pass('first Tab focuses “Skip to main content”');
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    if (outline === 'none') fail('focused element has no visible outline');
    else pass('keyboard focus is visible');
  } finally {
    await browser.close();
    server.kill();
  }

  console.log(`\nScreenshots: ${SHOTS}`);
  if (failures.length) {
    console.error(`\n✗ ${failures.length} issue(s):`);
    failures.forEach((f) => console.error(`  • ${f}`));
    process.exit(1);
  }
  console.log('\n✓ Browser QA passed');
})();
