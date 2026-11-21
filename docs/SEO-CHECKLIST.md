# SEO and technical checklist

Status as of 21 November 2026 (Task 01: foundation + homepage prototype).
✅ done · 🟡 ready but switched off pre-launch · ⬜ pending (needs content or a decision)

## On-page

| Item | Status | Notes |
|---|---|---|
| Semantic HTML (header/nav/main/section/article/footer, lists) | ✅ | Landmarks + `aria-labelledby` on sections |
| One H1 per page, no skipped heading levels | ✅ | Enforced by `scripts/qa.mjs` |
| Unique title (≤ 60 chars) and meta description (≤ 160) | ✅ | Build warns on length and duplicates |
| Canonical URL (absolute) | ✅ | From `data/site.json → url` |
| Open Graph + Twitter card | ✅ | Default 1200×630 image `assets/images/og/og-default.jpg` |
| Descriptive image alt text | ✅ / ⬜ | All rendered images have alt; photo alt text to be checked once photos are added (`altVerified`) |
| `lang="en-IN"`, viewport, theme-color, manifest, favicons | ✅ | |
| Internal linking (categories, areas, guides, footer) | ✅ | 0 broken internal links (QA) |
| Breadcrumbs | ✅ (visual) | `BreadcrumbList` schema to add with the real inner pages |
| Hindi / bilingual pages (`hreflang`) | ⬜ | Decision 9 |

## Indexing controls

| Item | Status | Notes |
|---|---|---|
| `robots.txt` | 🟡 | Pre-launch: `Disallow: /`. Production version generated when `indexing: true` |
| Meta robots | 🟡 | Pre-launch: `noindex` everywhere. Production: real pages `index, follow`; stubs and 404 stay `noindex` |
| XML sitemap | ✅ | `sitemap.xml`, auto-generated, lists only real indexable pages with git `lastmod` |
| Custom 404 page | ✅ | `404.html` (noindex) |
| "Coming soon" stubs never indexed | ✅ | No thin pages in the index |

## Structured data

| Item | Status | Notes |
|---|---|---|
| `WebSite` + `Organization` (name, URL, logo) | ✅ | Homepage only; verifiable facts only |
| `Hotel` / `LodgingBusiness` | ⬜ | Only for real, verified listings |
| `Review` / `AggregateRating` | ❌ deliberately not used | We never show invented ratings or reviews, and self-serving review markup isn't eligible |
| `Article` for guides | ⬜ | With real guides |
| `BreadcrumbList` | ⬜ | With inner pages |

## Performance (Lighthouse 12, mobile emulation, local build)

| Metric | Result |
|---|---|
| Performance score | **99** |
| LCP / FCP | 2.0 s / 1.2 s (simulated slow 4G) |
| CLS | 0.006 |
| Total blocking time | 0 ms |
| Homepage weight | ~192 KB in total; critical path ~102 KB gzipped (HTML 8 KB, CSS 6.5 KB, JS 1.1 KB, two fonts 86 KB) |
| Accessibility / Best practices | **100 / 100** |
| SEO | **66 pre-launch** (only failing audit: intentional `noindex`) · **100 with indexing on** |

Techniques: no frameworks; one minified CSS file and one deferred 2.7 KB script; self-hosted preloaded variable fonts with a metric-matched fallback; AVIF/WebP/JPEG `<picture>` with explicit dimensions and lazy loading; hashed asset URLs with one-year immutable caching (`_headers` / `.htaccess`).

## Technical

| Item | Status |
|---|---|
| HTTPS + HSTS | 🟡 HSTS in `_headers`; Netlify issues the Let's Encrypt certificate when the domain is attached |
| www → apex 301 | 🟡 automatic on Netlify once `hotelsujjain.in` is the primary domain |
| Previews never indexed | ✅ Netlify adds `noindex` to Deploy Previews; our build also forces `noindex` on branch deploys |
| Security headers (CSP, nosniff, referrer, permissions, frame) | ✅ live on Netlify. CSP is same-origin only; on the Free plan it allows inline script/style for Netlify's required badge (strict hash mode available, see DEPLOYMENT.md). No console errors on the live site |
| Mobile-friendly at 360 / 768 / 1440 px, no horizontal scroll | ✅ Playwright QA |
| Works without JavaScript (nav, search form) | ✅ |
| Console errors / failed requests | ✅ none |
| Accessibility (axe-core, WCAG 2.2 A/AA) | ✅ 0 violations |
| Google Search Console + sitemap submission | ⬜ at launch |
| Analytics (privacy-friendly) + consent | ⬜ Decision 10 |

## Content (before launch)

- ⬜ Real hotel listings with a verification record (see `data/schema/hotel.schema.json`)
- ⬜ Area pages with original, locally checked text (distances measured, not guessed)
- ⬜ Guides: where to stay, Mahakal darshan and Bhasma Aarti, Simhastha 2028
- ⬜ About, contact, list-your-hotel, privacy policy, terms
