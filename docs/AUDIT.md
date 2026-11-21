# Existing project audit

**Date:** 21 November 2026 · **Scope:** repository, domains, DNS, SSL, live website · **Method:** read-only inspection. Nothing outside this repository was changed.

---

## 1. Summary

| Area | Finding | Risk |
|---|---|---|
| Repository | `ashwinv49-bit/UJJAINHOTELS.IN` was **empty** (public, created 21 Nov 2026, no commits, no files). No framework, build process or deployment existed. | — |
| hotelsujjain.in | Registered on **GoDaddy DNS**, parked. **HTTPS fails** (no certificate). No email records. DNS zone changed today (SOA serial `2026112100`). | Medium |
| ujjainhotels.in | **Live WordPress site on Hostinger** with a valid SSL certificate. Set up as a single-property **booking engine** (VikBooking), which conflicts with the new non-OTA business model. | High (business model, compliance) |
| Content to preserve | The owner's original **Hindi "About" text** on ujjainhotels.in. Everything else is template text, booking-specific, or empty. | Low |
| Backup | No repository files existed, so there was nothing to back up here. A **read-only snapshot** of the live site's public page content is saved in `docs/audit/live-site-snapshot/`. | — |

---

## 2. Repository

- Empty on arrival: no commits, branches or files; GitHub Pages not enabled.
- Development branch for this work: `ccr-db98cbba-h9x0d2`.
- **The repository is public.** Never commit secrets, API keys, customer data or unlicensed images.

---

## 3. Domains, DNS and SSL

Looked up through a public DNS-over-HTTPS resolver. No DNS records were changed.

| Record | hotelsujjain.in | ujjainhotels.in |
|---|---|---|
| Nameservers | `ns25` / `ns26.domaincontrol.com` (**GoDaddy**) | `lunar` / `solar.dns-parking.com` (**Hostinger**) |
| Apex A | `3.33.130.190`, `15.197.148.33` (GoDaddy parking/forwarding) | `84.32.84.248`, `88.222.222.176` (Hostinger) + 2 AAAA |
| www | CNAME → `hotelsujjain.in` | CNAME → `www.ujjainhotels.in.cdn.hstgr.net` (Hostinger CDN) |
| MX (email) | none | `mx1` / `mx2.hostinger.com` |
| SPF (TXT) | none | **none** ⚠ |
| DMARC | `p=quarantine` (GoDaddy default) | **none** ⚠ |
| CAA | none | none |
| HTTPS | ✗ **TLS fails** ("unrecognized name"): no certificate for the domain | ✓ Let's Encrypt (YE1), valid 22 Oct 2026 → 20 Jan 2027, covers apex + www (Hostinger renews it automatically) |
| www → apex | not testable (HTTPS fails) | ✓ `301` www → apex |
| HTTP/2, HTTP/3 | — | ✓ both |

**Not checkable from this environment:** plain-HTTP behaviour (the sandbox proxy only supports HTTPS) and the registrar's RDAP record (the `.in` RDAP host was unreachable). The nameservers already identify the DNS providers.

---

## 4. Live website: ujjainhotels.in

**Stack:** WordPress 7.1.5 · theme Twenty Twenty-Five · PHP 8.5.13 · Hostinger hPanel with `hcdn` CDN.
**Plugins detected in page source:** VikBooking (hotel booking engine), Google Site Kit 1.190.0, WP Content Copy Protector.
**Published content:** 6 pages, 1 post ("Hello world!"), 8 media files, 1 category, 1 author.

| Published URL | Status |
|---|---|
| `/` (page "Home", slug `book-now`) | VikBooking room search: dates, rooms, adults, children |
| `/about-ujjainhotels-in/` | Original Hindi text about the platform's purpose. **Worth keeping.** |
| `/privacy-policy/` | WordPress template text that still says "Suggested text:". **Not a real policy.** |
| `/terms-and-condition/` | Terms for a single property taking reservations (ID proof, check-in times) |
| `/cacellation-and-refund-policy/` | Refund rules for advance payments, including gateway fees (slug misspelt) |
| `/copyright-2026-ujjain-hotels-all-rights-reserved/` | **Empty page**, listed in the sitemap |
| `/hello-world/` | Default WordPress post, listed in the sitemap |

### Issues found

1. **Business-model conflict.** The booking search, refund policy and terms describe taking reservations and payments. The new brief says HotelsUjjain.in is *not* an OTA.
2. **Privacy compliance.** The privacy policy is unedited template text. A real policy is needed before collecting any personal data (WhatsApp enquiries, analytics), in line with India's DPDP Act 2023.
3. **Indexed junk.** "Hello world!", an empty copyright page and an author archive are in the XML sitemap.
4. **Username exposure.** The author sitemap reveals the WordPress login name, which makes brute-force login attempts easier.
5. **Performance.** Every page sets a PHP session cookie and a VikBooking cookie, and returns `Cache-Control: no-store`. The CDN therefore cannot cache anything (`x-hcdn-cache-status: DYNAMIC`); observed origin time was 0.5–1.0 s per request.
6. **Basic SEO.** The homepage title is just "Ujjain hotels" and there is no meta description.
7. **Accessibility/UX.** The copy-protection plugin blocks text selection and right-click.
8. **Media rights.** `images.jpeg` and a Google Maps screenshot look like third-party images with unknown licences, so do not reuse them. `1000000031*.jpg` look like phone photos: reuse them only if they are yours.
9. **Email security.** ujjainhotels.in receives mail through Hostinger but publishes no SPF or DMARC record, so the domain is easy to spoof.
10. **Search Console / Analytics.** Site Kit suggests Google Search Console and/or Analytics are connected to ujjainhotels.in. Note this before any migration.

---

## 5. Hosting compatibility

The new site builds to plain static files (HTML, CSS, JS, images). It needs **no PHP, database or server runtime**, so it runs on any static host or CDN:

- **Cloudflare Pages / Netlify / GitHub Pages:** builds straight from GitHub, deploy previews, free SSL.
- **Hostinger (current host):** static files are served by LiteSpeed with free SSL. Git deployment is possible, but it does not run a build step (see `DEPLOYMENT.md`).

Server features not currently needed: PHP, MySQL, cron. They become relevant only if we later add server-side enquiry forms or an owner dashboard.

---

## 6. Missing information

- **Primary domain:** the brief says HotelsUjjain.in, but the repository and live site are ujjainhotels.in.
- Business **WhatsApp number**, contact email, and the legal name of the owner or entity (needed for the contact page, privacy policy and Organization schema).
- **Logo:** none supplied. A working mark has been created and can be replaced.
- **Photography:** none supplied (see section 8).
- Chosen **affiliate programmes**, and the **pricing model for paid listings**.
- **Analytics** preference and cookie-consent approach.
- **Language:** English only, or English + Hindi.

---

## 7. Technical risks

| Risk | Mitigation |
|---|---|
| Two domains serving similar content (duplicate content, split authority) | Pick one canonical domain; 301-redirect the other page by page (see `DECISIONS.md`) |
| hotelsujjain.in has no HTTPS | Fixed automatically when the domain is attached to the new host (free certificate) |
| Spoofed email from ujjainhotels.in | Add SPF and DMARC records in Hostinger DNS (owner approval needed) |
| Inaccurate hotel facts (prices, amenities, distances change) | Hotel schema requires a verification record (date, method, source) per listing; no live prices shown |
| Photo licensing | Only own, owner-supplied or openly licensed photos; full attribution on `/photo-credits/` |
| Traffic spikes around Simhastha 2028 | Static files on a CDN scale without extra cost |
| Sample content leaking into search results | Indexing is off site-wide (`noindex` + `robots.txt Disallow`) until `data/site.json → indexing: true` |

---

## 8. Environment notes from this session

- A personal cloud environment, **"ujjainhotels.in"**, was created (with your approval) so this session could reach the domains, a public DNS resolver and Wikimedia Commons.
- **Wikimedia Commons refused image downloads** from this cloud network (HTTP 429, rate limiting). A licence-checked shortlist of Commons photos is in `assets-src/photos/manifest.json`; download them from a normal connection, or use your own photos (see `DECISIONS.md`).
