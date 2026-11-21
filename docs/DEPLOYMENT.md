# Hosting and deployment: Netlify

> **Hosting decision: Netlify** (your separate Netlify account, Free plan).
> Steps marked 🔒 need your approval or your own login. **hotelsujjain.in is live on Netlify** (nameservers switched 21 Nov 2026, 13:39 UTC).

## Current status (21 Nov 2026)

| | |
|---|---|
| Live prototype | **https://hotels-ujjain.netlify.app** (noindex; prototype bar shown). **No sample hotels on any Netlify build**: the homepage shows "Hotel listings coming soon" until verified listings exist |
| Netlify project | `hotels-ujjain` (site ID `cac53e78-de6b-4f83-b28f-50d840bd97d4`), created by you today and empty until this deploy |
| How it deploys | ✅ **Continuous deployment from GitHub**: every push to **`main`** builds and publishes automatically (`node scripts/build.mjs --strict` → `dist/`). The first deploys were manual API uploads with `scripts/deploy-netlify.py` |
| Verified live | All pages 200, unknown URLs 404, `/about` → `/about/` 301, CSP/HSTS/security headers served, assets cached for 1 year, no console errors at 390 px and 1440 px |
| Git link | ✅ GitHub `ashwinv49-bit/UJJAINHOTELS.IN` via the Netlify GitHub App. Production branch **`main`** (created 21 Nov 2026 at the reviewed commit). Work branches reach production through pull requests into `main`, and PRs get Deploy Previews |
| Custom domain | ✅ **https://hotelsujjain.in** (primary). `www.hotelsujjain.in` → 301 → apex. DNS: Netlify DNS (zone `6b017c1e3f225b0b4994582d`); nameservers `dns1`–`dns4.p06.nsone.net`, set at GoDaddy (registrar) |
| HTTPS | ✅ Let's Encrypt certificate for `hotelsujjain.in` + `*.hotelsujjain.in`, issued 21 Nov 2026, auto-renews (current expiry 19 Feb 2027). HSTS header served |
| Verified on the domain | Home and inner pages 200, unknown URL 404, `www` → apex 301, security headers + `noindex` (pre-launch) served, canonical `https://hotelsujjain.in/`, no browser console errors |

### Netlify Free-plan badge
On the Free plan, Netlify injects a **"Powered by Netlify"** badge (bottom-right) on published sites, and it cannot be hidden on that plan. Because the badge renders with inline script and style, `data/site.json → hosting.netlifyFreePlanBadge: true` makes the build:
- allow `'unsafe-inline'` for scripts and styles in the CSP (everything else stays locked to same-origin), and
- add space under the footer so the badge never covers it.

On a paid plan that lets you hide the badge, set `netlifyFreePlanBadge` to `false`. The build then switches back to the strict policy (hash-allowlisted inline script, no inline styles).

## 1. What is already configured in the repo

| File | Purpose |
|---|---|
| `netlify.toml` | Build command `node scripts/build.mjs --strict`, publish folder `dist`, Node 22 |
| `src/static/_headers` → `dist/_headers` | Security headers (CSP filled in at build time: see the badge note above; HSTS, nosniff, frame/referrer/permissions policies) and one-year caching for `/assets/*` |
| `scripts/deploy-netlify.py` | Manual API deploy of `dist/` (until GitHub is linked): `NETLIFY_AUTH_TOKEN=… python3 scripts/deploy-netlify.py <site-id> [--draft]` |
| `dist/404.html` | Served by Netlify for unknown URLs |
| `scripts/build.mjs` | **Netlify safety rail:** any non-production build (Deploy Preview, branch deploy) is forced to `noindex`, even after launch, because Netlify's branch deploys are publicly crawlable |
| `.gitignore` | Ignores `.netlify/` (Netlify CLI link state) |

`--strict` means a build with SEO or template warnings (missing or long titles, duplicate descriptions, undefined variables) **fails instead of publishing**. A failed Netlify deploy never goes live; the previous deploy stays up.

The site needs no Netlify Functions, plugins or environment secrets. Builds take about one second.

---

## 2. Link the GitHub repository (continuous deployment) 🔒

Do this once in the Netlify UI (it needs your GitHub authorisation). Every push then builds and deploys automatically, and pull requests get preview URLs.

1. Netlify → project **hotels-ujjain** → *Project configuration → Build & deploy → Continuous deployment → Repository → Manage repository → Link to a different repository* (menu names change occasionally).
2. Choose **GitHub**, authorise the Netlify GitHub App for `ashwinv49-bit/UJJAINHOTELS.IN`, and select it.
3. Leave the build command and publish directory empty: `netlify.toml` provides them.
4. **Production branch:** there is no `main` yet; GitHub treats `ccr-db98cbba-h9x0d2` (this prototype branch) as the default. **Recommended:** create `main` through a pull request first, make it GitHub's default branch, and set it as Netlify's production branch. Otherwise use the prototype branch for now and switch later.
5. Optional: enable **branch deploys** (off by default) for `https://<branch>--hotels-ujjain.netlify.app` previews. These are always `noindex` thanks to the build's safety rail.

Until this is done, deploy manually with `scripts/deploy-netlify.py`.

## 3. Custom domain: hotelsujjain.in 🔒

Currently: DNS at **GoDaddy**, apex pointing at GoDaddy parking (`3.33.130.190`, `15.197.148.33`), no HTTPS.

In Netlify: *Domain management → Add a domain → `hotelsujjain.in`* and make it the **primary domain**. Netlify then redirects `www` to the apex automatically. Then choose one DNS option.

### Option A (recommended): Netlify DNS
1. Netlify offers to set up Netlify DNS and shows **four nameservers** (`dns1…dns4.p0X.nsone.net`).
2. At GoDaddy: *My Products → hotelsujjain.in → DNS → Nameservers → Change → "I'll use my own nameservers"*, and enter the four. The domain stays registered at GoDaddy.
3. Netlify creates the apex and `www` records and issues the Let's Encrypt certificate automatically. Propagation usually takes minutes to a few hours.
4. Email: hotelsujjain.in has no mailbox today. If you add one later, add its MX, SPF and DMARC records in Netlify DNS.

### Option B: keep DNS at GoDaddy
1. At GoDaddy DNS:
   - **Delete both parking A records** (`3.33.130.190` and `15.197.148.33`). If either remains, the site loads only some of the time.
   - Add **A `@` → the load-balancer IP shown in Netlify's domain instructions** (documented as `75.2.60.5` at the time of writing; use whatever Netlify shows).
   - Change **CNAME `www` → `hotels-ujjain.netlify.app`**.
   - Turn off any GoDaddy *Forwarding* for the domain.
2. Netlify → *Domain management → HTTPS → Verify DNS configuration*. The certificate is issued automatically.

After either option, check that `https://hotelsujjain.in` loads with a valid certificate and that `https://www.hotelsujjain.in` 301-redirects to it.

---

## 4. Before every deployment

```bash
npm run build                  # → dist/
npm run qa                     # strict build + static QA (links, meta, alt text, JSON-LD)
node scripts/qa-browser.cjs    # optional: Playwright layout/a11y/search checks
```

The local preview server (`npm run serve`) applies `dist/_headers` the way Netlify does, so browser QA also catches Content-Security-Policy problems. GitHub Actions (`.github/workflows/ci.yml`) runs the build and static QA on every push; it never deploys.

---

## 5. What to do with ujjainhotels.in (needs a decision)

See `DECISIONS.md`, decision 1. If you retire the WordPress site and redirect it to HotelsUjjain.in:

1. 🔒 Take a full Hostinger backup of the WordPress site (files + database).
2. Either keep it on Hostinger with 301 rules in its `.htaccess`, or add `ujjainhotels.in` to the Netlify project as a **domain alias** and add domain-level rules to a `_redirects` file:

   | Old URL (ujjainhotels.in) | New URL (hotelsujjain.in) |
   |---|---|
   | `/` | `/` |
   | `/about-ujjainhotels-in/` | `/about/` |
   | `/privacy-policy/` | `/privacy-policy/` |
   | `/terms-and-condition/` | `/terms/` |
   | `/cacellation-and-refund-policy/` | `/terms/` |
   | everything else | `/` |

3. Google Search Console: add the new domain and use *Change of address* from the old property.
4. Keep the ujjainhotels.in registration renewed so the redirects keep working.
5. 🔒 If its Hostinger mailboxes stay in use, add SPF and DMARC records to ujjainhotels.in.

---

## 6. Launch checklist (prototype → production)

- [ ] Final domain confirmed; `data/site.json → url` is correct
- [ ] Sample hotels replaced by verified listings, or the featured section hidden
- [ ] `data/site.json → contact.whatsapp` and `contact.email` set
- [ ] Privacy policy, terms and full affiliate disclosure written and approved
- [ ] Photos added with credits; `altVerified` set for each
- [ ] `data/site.json → "prototype": false` and `"indexing": true`
- [ ] `npm run qa` and browser QA pass
- [ ] GitHub linked for continuous deployment; production branch set
- [ ] Netlify production deploy is live; HTTPS works on apex and www; www → apex 301
- [ ] Google Search Console: domain verified; `https://hotelsujjain.in/sitemap.xml` submitted
- [ ] Analytics/consent decision implemented (cookie-free options include Cloudflare Web Analytics or Netlify's own analytics add-on)

---

## Appendix: Hostinger (not chosen)

If you ever move hosting to Hostinger, upload the contents of `dist/` to `public_html/` together with `deploy/hostinger/.htaccess`. That file handles HTTPS, www → apex, pretty URLs, the 404 page, security headers and caching.
