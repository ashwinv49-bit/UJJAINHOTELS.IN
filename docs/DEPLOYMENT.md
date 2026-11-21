# Hosting and deployment: Netlify

> **Hosting decision: Netlify** (your separate Netlify account).
> **Nothing has been applied yet.** No Netlify project, DNS or domain changes have been made. Steps marked 🔒 need your approval or your own login.

---

## 1. What is already configured in the repo

| File | Purpose |
|---|---|
| `netlify.toml` | Build command `node scripts/build.mjs --strict`, publish folder `dist`, Node 22 |
| `src/static/_headers` → `dist/_headers` | Security headers (CSP with inline-script hashes injected at build, HSTS, nosniff, frame/referrer/permissions policies) and one-year caching for `/assets/*` |
| `dist/404.html` | Served by Netlify for unknown URLs |
| `scripts/build.mjs` | **Netlify safety rail:** any non-production build (Deploy Preview, branch deploy) is forced to `noindex`, even after launch, because Netlify's branch deploys are publicly crawlable |
| `.gitignore` | Ignores `.netlify/` (Netlify CLI link state) |

`--strict` means a build with SEO or template warnings (missing or long titles, duplicate descriptions, undefined variables) **fails instead of publishing**. A failed Netlify deploy never goes live; the previous deploy stays up.

The site needs no Netlify Functions, plugins or environment secrets. Builds take about one second.

---

## 2. Connect the repository (recommended: Git continuous deployment)

No tokens need to be shared. Netlify builds on every push and gives each pull request a preview URL.

1. 🔒 Log in to the Netlify account you want to host with.
2. **Add new project → Import an existing project → GitHub.** Authorise the Netlify GitHub App for `ashwinv49-bit/UJJAINHOTELS.IN`. (Netlify sometimes renames these menus.)
3. Netlify reads `netlify.toml`, so leave the build command and publish directory as they are.
4. **Branch to deploy:** GitHub currently treats `ccr-db98cbba-h9x0d2` (this prototype branch) as the repository's default, because it was the first branch pushed. There is no `main` yet. Either:
   - **Recommended:** create `main` from the reviewed work first (I can open a pull request), set `main` as GitHub's default branch, then choose `main` as Netlify's production branch; or
   - deploy the prototype branch now as production, and switch the production branch to `main` later (*Project configuration → Build & deploy → Branches and deploy contexts*).
5. Deploy. You get `https://<project-name>.netlify.app`. Rename the project (e.g. `hotelsujjain`) under *Project configuration → General → Project details*.
6. Optional: enable **branch deploys** for prototype branches (off by default) so each branch gets `https://<branch>--<project>.netlify.app`.

**Alternative (manual CLI deploy).** Run `npm run build`, then `npx netlify-cli deploy --dir=dist`. This needs your Netlify login or a personal access token, and a manual `--prod` deploy is replaced by the next Git push if the repo is also connected.

---

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
   - Change **CNAME `www` → `<project-name>.netlify.app`**.
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
- [ ] Netlify production deploy is live; HTTPS works on apex and www; www → apex 301
- [ ] Google Search Console: domain verified; `https://hotelsujjain.in/sitemap.xml` submitted
- [ ] Analytics/consent decision implemented (cookie-free options include Cloudflare Web Analytics or Netlify's own analytics add-on)

---

## Appendix: Hostinger (not chosen)

If you ever move hosting to Hostinger, upload the contents of `dist/` to `public_html/` together with `deploy/hostinger/.htaccess`. That file handles HTTPS, www → apex, pretty URLs, the 404 page, security headers and caching.
