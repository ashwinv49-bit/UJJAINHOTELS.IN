# Hosting and deployment

> **Nothing here has been applied.** No DNS, hosting or domain changes have been made. Each step marked 🔒 needs your approval first.

---

## 1. Recommendation

### ✅ Recommended: Cloudflare Pages (free plan) for HotelsUjjain.in

| Why | Detail |
|---|---|
| Cost | Free for static sites, including bandwidth. You only pay for the domain. |
| Speed in India | Global CDN with many edge locations in India, plus HTTP/3 and Brotli |
| Fits this repo | Connects to GitHub and runs `node scripts/build.mjs` on every push. No servers to maintain. |
| Safe reviews | Every branch gets its own **preview URL**, so prototypes can be shared without touching the live site |
| Security headers | Reads `dist/_headers` (CSP, HSTS, caching), which the build already generates |
| Room to grow | Pages Functions can later handle an enquiry form or listing submissions without changing hosts |

### Alternative: Hostinger (you already pay for it)

Hostinger serves static files well (LiteSpeed + CDN + free SSL) and already hosts ujjainhotels.in. Downsides: its Git deployment does not run a build step, and there are no preview deployments. You would upload the built `dist/` folder, or add a GitHub Action that builds and pushes it (section 4). Choose this if you prefer to keep everything in hPanel.

---

## 2. Before every deployment

```bash
npm run build      # node scripts/build.mjs  → dist/
npm run qa         # strict build + static QA (links, meta, alt text, JSON-LD)
node scripts/qa-browser.cjs   # optional: Playwright layout/a11y/search checks
```

The GitHub Action in `.github/workflows/ci.yml` runs the build and static QA on every push. It never deploys anything.

---

## 3. Cloudflare Pages setup

1. Create a free Cloudflare account.
2. **Workers & Pages → Create → Pages → Connect to Git** and authorise GitHub for `ashwinv49-bit/UJJAINHOTELS.IN`. (Cloudflare occasionally renames these menus.)
3. Build settings:
   - Production branch: `main`
   - Framework preset: *None*
   - Build command: `node scripts/build.mjs`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION = 22`
4. Deploy. You get `https://<project>.pages.dev`, plus a preview URL for each branch, such as this prototype branch.
5. 🔒 **Custom domain.** Choose one option.

   **Option A (recommended): move hotelsujjain.in's DNS to Cloudflare.** The domain stays registered at GoDaddy; only its nameservers change.
   1. Cloudflare → *Add a site* → `hotelsujjain.in` → Free plan.
   2. Cloudflare shows two nameservers. At GoDaddy → *Domain → DNS → Nameservers → Change → "I'll use my own nameservers"*, enter them. (Propagation usually takes minutes to a few hours.)
   3. Pages project → *Custom domains* → add `hotelsujjain.in` and `www.hotelsujjain.in`. Cloudflare creates the records and issues SSL certificates.
   4. Add a redirect rule: `www.hotelsujjain.in/*` → `https://hotelsujjain.in/$1` (301).
   5. Email: hotelsujjain.in has no mailbox today. If you add one later, add its MX, SPF and DMARC records in Cloudflare DNS.

   **Option B: keep DNS at GoDaddy.**
   - Add `CNAME www → <project>.pages.dev` in GoDaddy DNS and attach `www.hotelsujjain.in` in Pages.
   - GoDaddy cannot point the bare domain at Pages. Use GoDaddy *Forwarding* (`hotelsujjain.in` → `https://www.hotelsujjain.in`, 301), and change `data/site.json → url` to `https://www.hotelsujjain.in`.
   - This is less clean: the canonical URL becomes `www`, and forwarding of `https://hotelsujjain.in` depends on GoDaddy supporting HTTPS for it.

---

## 4. Hostinger setup (alternative)

1. 🔒 hPanel → *Websites → Add website* → `hotelsujjain.in` (check that your plan allows another website).
2. 🔒 Point the domain to Hostinger: at GoDaddy, change nameservers to the pair hPanel shows (e.g. `ns1/ns2.dns-parking.com`), or set the A record to the IP hPanel shows.
3. hPanel → *Security → SSL* → install the free certificate. Wait for it to be active before launch.
4. Upload the site, by either method:
   - **Manual:** run `npm run build` locally, then upload the **contents** of `dist/` to `public_html/`, plus `deploy/hostinger/.htaccess`.
   - **Automatic:** a GitHub Action builds `dist/` and pushes it to a `deploy` branch; hPanel → *Advanced → Git* deploys that branch into `public_html`. (Not set up yet; ask if you want it.)
5. `deploy/hostinger/.htaccess` handles the HTTPS and www → apex 301, pretty URLs, the 404 page, security headers and long-term caching. The Content-Security-Policy is only in `_headers` (Cloudflare/Netlify); on Hostinger, add it later if needed.

---

## 5. What to do with ujjainhotels.in (needs a decision)

See `DECISIONS.md` (decision 1). If you redirect it to HotelsUjjain.in:

1. 🔒 Take a full Hostinger backup of the WordPress site (files + database).
2. Map the old URLs with 301 redirects (in `.htaccess` on the old site, or with Hostinger's redirect tool):

   | Old URL (ujjainhotels.in) | New URL (hotelsujjain.in) |
   |---|---|
   | `/` | `/` |
   | `/about-ujjainhotels-in/` | `/about/` |
   | `/privacy-policy/` | `/privacy-policy/` |
   | `/terms-and-condition/` | `/terms/` |
   | `/cacellation-and-refund-policy/` | `/terms/` (no refunds apply to a directory) |
   | everything else | `/` |

3. In Google Search Console, add the new domain property and use *Change of address* from the old property.
4. Keep the ujjainhotels.in registration renewed so the redirects keep working (and nobody else can take the name).
5. 🔒 Add SPF and DMARC records to ujjainhotels.in DNS if its mailboxes stay in use.

---

## 6. Launch checklist (prototype → production)

- [ ] Final domain confirmed; `data/site.json → url` is correct
- [ ] Sample hotels removed (`data/sample-hotels.json` replaced by verified listings), or the featured section hidden
- [ ] `data/site.json → contact.whatsapp` and `contact.email` set
- [ ] Privacy policy, terms and full affiliate disclosure written and approved
- [ ] Photos added with credits, and `altVerified` set for each
- [ ] `data/site.json → "prototype": false` and `"indexing": true`
- [ ] `npm run qa` passes; browser QA passes
- [ ] Deployed; HTTPS works on apex and www; www → apex 301
- [ ] Google Search Console: domain verified, `https://hotelsujjain.in/sitemap.xml` submitted
- [ ] Analytics/consent decision implemented (if any)
