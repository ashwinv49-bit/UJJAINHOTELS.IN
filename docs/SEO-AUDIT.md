# SEO audit — HotelsUjjain.in (v2)

**Date:** 22 November 2026 · **Type:** read-only audit (no pages created, nothing published, no live files changed)
**Version 2:** merges the owner's OpenSEO research (keyword volumes, SERP samples, extra competitors) and two owner decisions made on 22 Nov 2026.

## How this audit was made — and what it does NOT contain

| Evidence | Source |
|---|---|
| Live site inventory | Automated crawl of https://hotelsujjain.in on 22 Nov 2026 (23 URLs), plus `robots.txt` and `sitemap.xml` |
| Pending changes | Pull request #2 (hotel system) — reviewed from the repository, **not live** |
| Competitors (own checks) | Pages fetched directly on 22 Nov 2026 (structure, headings, meta tags, structured-data types, link patterns, on-page terms). Where a site blocked automated access, only search snippets were available — marked **[snippet]** |
| **OpenSEO report** | "SEO Strategy & Keyword Research — Nov 22, 2026", generated in the owner's OpenSEO account ([shared link](https://app.openseo.so/s/fjlc_Thau_Ql0DfEdAMepsCQVvm5CVBN)). Method stated by OpenSEO: keyword seed discovery for "hotels in Ujjain" and "hotels near Mahakal temple" (India, English, location code 2356), Google SERP snapshots for 6 queries, competitor overlap across 8 queries. Figures from it are marked **[OpenSEO]** |

**About the OpenSEO numbers (OpenSEO's own caveats, kept here):** they are **India-wide estimates**, not Ujjain-only searches; close variants share one demand bucket and must **not be added together**; a keyword difficulty of 0 does **not** mean "easy" (sampled results show strong OTAs). OpenSEO rates its confidence **medium** for national volumes and **low** for extrapolating to city demand or traffic.

**Still unknown — not invented anywhere in this report:**
- **Ujjain-only search volumes** and **volumes for:** dharamshalas in Ujjain, hotels with parking, senior-friendly accommodation, hotels near Ram Ghat, where to stay in Ujjain — not in the OpenSEO data.
- **Hindi keyword volumes** — not researched yet.
- **Rankings** — HotelsUjjain.in is deliberately blocked from indexing (pre-launch); competitor rankings beyond OpenSEO's SERP samples were not measured.
- **Search Console data** — property verified 21 Nov 2026 but **not connected to the OpenSEO project** (per OpenSEO); no performance data yet.
- **Competitor domain/backlink metrics** — not available in the OpenSEO run or our checks.
- **MakeMyTrip, Goibibo and Agoda page content** — our automated access was blocked; their SERP presence is per OpenSEO.
- **Hotel facts** — none asserted anywhere in this report.

---

## Executive summary

1. **The site is technically clean but has no indexable content yet.** All 23 live URLs are `noindex` and crawling is blocked (intentional pre-launch). Canonicals are correct on 23/23 pages; 17 pages are "coming soon" stubs.
2. **Demand is concentrated in a few clusters** [OpenSEO, India, directional]: "hotels near Mahakal temple" family (33,100, shared bucket), "hotels in Ujjain" (27,100), "book hotels in Ujjain" (9,900), "best hotels in Ujjain" set (8,100), "near Ujjain railway station" set (2,400). Budget (720), luxury (720) and family (390) are smaller. Sampled results are **dominated by OTAs**.
3. **Owner decisions (22 Nov 2026):**
   - **`/hotels/` will own "Hotels in Ujjain"** — the homepage becomes the welcome/discovery page (reverses v1's C1).
   - **Affiliate-first:** the partner booking button is primary on hotel cards/profiles, Call/WhatsApp the hotel secondary. *(A future UI task — not built here.)*
4. **Our edge stays first-hand, dated facts.** hotelsinujjain.in already owns *computed* walking times and source-linked facilities; OpenSEO independently advises not to imitate that angle. We differentiate on facts checked with the property: room fit/capacity, lift/parking, late arrival/early check-in, walked routes, with "confirmed / not confirmed / not offered" and a date.
5. **Cannibalisation risks:** homepage vs `/hotels/` (now decided), homepage "Where to stay" heading vs the guide, Freeganj vs station page, "Premium" naming vs "luxury" searches, and **your older domain ujjainhotels.in**, which is indexable.
6. **30-day priority:** connect Search Console to OpenSEO; apply to one affiliate programme and test one hotel deep link; verify the first 10–15 hotels with the new data points; ship trust pages; then switch on indexing only for pages that qualify.

---

## 1. Existing page inventory

### 1.1 Site-level status (live, 22 Nov 2026)

| Item | Finding |
|---|---|
| `robots.txt` | `Disallow: /` for all agents (pre-launch); `Sitemap:` line present |
| Meta robots | `noindex, nofollow` on all 23 pages |
| `sitemap.xml` | 3 URLs: `/`, `/affiliate-disclosure/`, `/photo-credits/` (lastmod 2026-11-21) |
| Canonical tags | Present and self-referencing on 23/23 pages |
| HTTPS / host | HTTPS with HSTS; `www` → apex 301 |
| Structured data | Homepage only: `WebSite` + `Organization` |
| Internal links | Every page links to ~20 internal URLs (header + footer); the 3 guide pages receive only 2 internal links each |
| Language | English only (`en-IN`); no Hindi pages, no `hreflang` |
| Performance | Previously measured Lighthouse mobile 99 / accessibility 100 (not re-measured today) |

### 1.2 Page inventory (live)

| URL | Type | Title (chars) | H1 | Meta description (chars) / note |
|---|---|---|---|---|
| `/` | Real | Hotels in Ujjain: Find Your Right Stay \| HotelsUjjain.in (56) | Find your right stay in Ujjain | 147 — **to be retitled (decision: `/hotels/` owns K1)** |
| `/hotels/` | Stub | Hotels in Ujjain by Area and Type (33) | Browse hotels in Ujjain | 130 — **becomes the K1 hub** |
| `/hotels/near-mahakal-temple/` | Stub | Hotels near Mahakal Temple, Ujjain (34) | Hotels near Mahakal Temple | 130 — says "coming soon" |
| `/hotels/budget/` | Stub | Budget Hotels in Ujjain (23) | Budget Hotels | 124 — "coming soon" |
| `/hotels/family/` | Stub | Family Hotels in Ujjain (23) | Family Hotels | 118 — "coming soon" |
| `/hotels/luxury/` | Stub | Luxury Hotels and Resorts in Ujjain (35) | Luxury Hotels | 121 — renamed `/hotels/premium/` in PR #2 (301); see C11 |
| `/hotels/near-railway-station/` | Stub | Hotels near Ujjain Railway Station (34) | Hotels near Railway Station | 129 |
| `/hotels/near-ram-ghat/` | Stub | Hotels near Ram Ghat, Ujjain (28) | Ram Ghat & Shipra riverfront | 107 — **H1 lacks "hotels"** |
| `/hotels/freeganj/` | Stub | Hotels in Freeganj, Ujjain (26) | Freeganj | 125 — **H1 lacks "hotels"** |
| `/hotels/nanakheda/` | Stub | Hotels in Nanakheda, Ujjain (27) | Nanakheda | 131 |
| `/hotels/dewas-road/` | Stub | Hotels on Dewas Road, Ujjain (28) | Dewas Road | 129 |
| `/guides/` | Stub | Ujjain Travel Guides (20) | Ujjain travel guides | 132 |
| `/guides/where-to-stay-in-ujjain/` | Stub | Where to Stay in Ujjain: Choosing the Right Area (48) | Where to stay in Ujjain: choosing the right area | 119 |
| `/guides/mahakal-darshan-bhasma-aarti/` | Stub | Planning Mahakal Darshan and Bhasma Aarti (41) | Planning Mahakal darshan and Bhasma Aarti | 131 |
| `/guides/simhastha-2028-accommodation/` | Stub | Simhastha 2028 Ujjain: Planning Your Accommodation (50) | Simhastha 2028: plan your stay early | 120 |
| `/about/` | Stub | About HotelsUjjain.in (21) | About HotelsUjjain.in | 69 |
| `/contact/` | Stub | Contact HotelsUjjain.in (23) | Contact us | 87 |
| `/list-your-hotel/` | Stub | List Your Hotel on HotelsUjjain.in (34) | List your hotel | 94 |
| `/advertise/` | Stub | Advertise with HotelsUjjain.in (30) | Advertise with us | 102 |
| `/privacy-policy/` | Stub | Privacy Policy (14) | Privacy policy | 49 |
| `/terms/` | Stub | Terms of Use (12) | Terms of use | 33 |
| `/affiliate-disclosure/` | Real (draft text) | Affiliate Disclosure \| HotelsUjjain.in (38) | Affiliate disclosure | 146 |
| `/photo-credits/` | Real | Photo Credits and Licences \| HotelsUjjain.in (44) | Photo credits and licences | 84 |

### 1.3 Pending (PR #2, not live)
- Hotel stubs become **collection pages** (categories and areas) with filters; `noindex` while they hold no verified real hotel.
- Hotel profiles `/hotels/<slug>/` for verified listings, with `Hotel` + `BreadcrumbList` structured data from verified facts only.
- "Luxury" → "Premium" (`/hotels/luxury/` 301 → `/hotels/premium/`); brand suffix on collection titles; "coming soon" wording removed from descriptions.

### 1.4 Your other domain — ujjainhotels.in (WordPress, Hostinger)
- **Indexable**, own sitemap with 6 pages, homepage title "Ujjain hotels", **no meta description**; describes a booking/refund model that conflicts with the brief.
- **Risk:** two sites you own compete for the same searches (C8).

---

## 2. Competitor gap analysis

### 2.1 Overview

| Competitor | What it is | Evidence | Structure / data shown | Trust signals | Weakness → our opportunity |
|---|---|---|---|---|---|
| **hotelsinujjain.in** | Affiliate directory (~25 hotels) + blog | Own check (full) | Audience chooser → stay-finder quiz → hotels ranked by **computed** walking time (OpenStreetMap routing) → booking-site comparison → method → areas → FAQs. Facility status sourced from hotel sites / booking listings; Hindi labels; no prices/ratings | Method page, open dataset, affiliate disclosure, re-check date | **Desk research only** (no visits/calls); many facilities "not confirmed"; no direct hotel contact. *Don't imitate the measured-walk angle* (also OpenSEO's advice) |
| **ujjainhotel.in** | Thin single-page app + hotelier portal | Own check (partial); OpenSEO: appears for broad and Mahakal searches | ~190 visible words; hotels, dharamshalas, dormitories, direct contacts (per OpenSEO) | "Verified" claim; religious-ownership positioning | Thin indexable content; **don't imitate** the positioning; offer clear partner choices and consistent structured data |
| **ujjainhotels.net** | Large template aggregator ("1,397 properties") | Own check (full) | Filter hubs (type, star, theme, district), landmark pages, generic city text; km distances, ratings, "couple-friendly" | Few; "lowest rates" claims | Generic, unverified; learn from its landmark/filter structure (not copy) |
| **yatradham.org** | Pilgrim stay marketplace taking bookings | Own check (full); OpenSEO agrees | Ujjain hub: list → price table → group stays → booking how-to → temple timings → stay types → by attraction/area/price. Detail pages: room capacity, distances, check-in/out, amenities, reviews, starting prices | Reviews, policies, FAQs | Booking-led; pilgrim-focused. We cover **all travellers** with neutral comparisons |
| **MakeMyTrip** | Indian OTA | Own check blocked; **OpenSEO: ranks prominently** for broad Ujjain and railway-station searches | Inventory, offers, booking UX (per OpenSEO) | Brand, reviews | Don't compete on breadth; help visitors decide before the click |
| **Agoda** | OTA / affiliate partner | Own check blocked (bot challenge); **OpenSEO: strong positions** in sampled hotel, station and where-to-stay results | — | — | Potential affiliate destination; differentiate before the outbound click |
| **Goibibo / Booking.com** | OTAs | Own check: Goibibo blocked; Booking.com city page structure only. **OpenSEO: appear on hotel, temple and station terms** | Booking.com: title "10 Best Ujjain Hotels…", H1 "Search hotels in Ujjain", breadcrumb | Reviews | Compare suitability and route/amenity facts, then send to partner pages |
| Tirthtrails | Pilgrimage stay directory | **Reported by OpenSEO, not independently checked** | Claims verified stays; filters by type/budget/amenities | "Verified" claim | Avoid a pilgrim-only identity |
| WelcomeUjjain | Local accommodation / enquiry site | **Reported by OpenSEO, not independently checked** | Stay categories, sample rate bands, WhatsApp quote funnel | — | Show date-dependent partner prices rather than static rates |
| Ujjain.nic.in | Official district "Where to Stay" directory | **Reported by OpenSEO, not independently checked** | Lists MP Tourism and commercial properties | Government source | Use to **cross-check property identity** (never copy listings) |
| Simhastha.org.in / travel publishers | Editorial | **Reported by OpenSEO, not independently checked** | Where-to-stay and Simhastha content | — | Careful, dated planning guides; no speculative rates or event logistics |

### 2.2 What the market already does well (don't compete head-on)
Inventory breadth and live prices (OTAs); computed walking times with sources (hotelsinujjain.in); dharamshala catalogue with booking (yatradham.org).

### 2.3 Gaps to own (own checks + OpenSEO gaps A–E)
1. **First-hand verification** — checked with the property by phone or visit; date, method, what was checked.
2. **Room suitability** — verified 2/3/4/6-person configurations, extra mattress terms, connected rooms, child policy (never inferred from names or OTA snippets).
3. **Arrival and accessibility** — lift, stairs, step-free entry, parking type, reception hours, check-in policy, luggage storage, late-arrival acceptance.
4. **Routes walked in person** — real minutes, steps, lanes, lighting for 3–4 a.m. Bhasma Aarti starts, elder suitability; driving access and parking.
5. **Price transparency without stale claims** — no "from ₹" without date/room basis/taxes/source; send to date-prefilled partner pages and say final price is confirmed there.
6. **All-traveller decision support** — paths for families, groups, couples, solo, seniors, car travellers and train arrivals (not pilgrim-only).
7. **Neutral, disclosed affiliate recommendations** — ordering never driven by commission; disclosure beside comparison tables and buttons; paid placements labelled.
8. **Full Hindi pages** — closest competitor has Hindi labels only.

### 2.4 Do NOT copy
Keyword-stuffed names, "best/cheapest/verified/nearby/available" claims without method and evidence, religious-ownership positioning, competitor text/data/photos/prices/reviews, or mass AI-generated pages that only swap a hotel name.

---

## 3. Keyword-to-page map

*Volumes: OpenSEO, India, English, 22 Nov 2026 — directional estimates, not Ujjain-only; shared buckets are not additive. "Unknown" = not in the OpenSEO data.*

| # | Keyword (primary) | Intent | Volume [OpenSEO] | Primary page | Today | Supporting pages / notes |
|---|---|---|---|---|---|---|
| K1 | Hotels in Ujjain | Commercial, broad | 27,100 | **`/hotels/` hub** (owner decision) | Stub → collection (PR #2) | Homepage links in; hub also serves "book hotels in Ujjain" (9,900), "best/top/good hotels" (8,100 set), "hotels in Ujjain with price" (590), "3-star" (1,300) as sections/filters |
| K2 | Hotels near Mahakal Temple (+ Mahakaleshwar / Mahakal Mandir) | Commercial, local | 33,100 (shared bucket) | `/hotels/near-mahakal-temple/` | Stub → collection | One page for all wording variants; darshan guide links here |
| K3 | Budget hotels in Ujjain (+ cheap / affordable) | Commercial | 720 (shared) | `/hotels/budget/` | Stub → collection | "Under ₹1,000" (170) and "near temple under ₹1,000" (170) as **sections**, not pages; never show unverified prices |
| K4 | Family hotels in Ujjain | Commercial | 390 ("best hotels in Ujjain for family") | `/hotels/family/` | Stub → collection | Room capacity is the unique value; senior section (C5) |
| K5 | Hotels near (Ujjain) railway station | Commercial, transit | 2,400 (variant set) | `/hotels/near-railway-station/` | Stub → collection | Late arrival / early check-in facts; Freeganj section (C3) |
| K6 | Dharamshalas in Ujjain | Commercial/informational | **Unknown** | Proposed `/hotels/dharamshalas/` | Not built | yatradham.org strong; needs schema fields (rules, booking method) |
| K7 | Hotels with parking | Commercial, facility | **Unknown** | Proposed `/hotels/with-parking/` — **gated** | Filter only | OpenSEO also suggests a parking *guide* later |
| K8 | Senior-friendly accommodation | Commercial, accessibility | **Unknown** | Section of family page → page **gated** | Not built | Accessibility claims only when seen on visit |
| K9 | Hotels near Ram Ghat | Commercial, local | **Unknown** | `/hotels/near-ram-ghat/` | Stub → collection | Fix H1 |
| K10 | Where to stay in Ujjain | Informational | **Unknown** | `/guides/where-to-stay-in-ujjain/` | Stub | Neutral area comparison (Mahakal vs Freeganj vs station…) |
| K11 | Luxury hotels in Ujjain / 4-star hotels | Commercial | 720 / 1,600 | `/hotels/premium/` | Stub → collection | See C11 — put "Luxury" in title/H1 |
| K12 | Pet-friendly hotels in Ujjain | Commercial | 170 | Filter; page only after verified inventory (P3) | — | Gated |

### 3.1 Cannibalisation flags and consolidation

| ID | Conflict | Recommendation |
|---|---|---|
| **C1** ✅ decided | Homepage vs `/hotels/` both titled "Hotels in Ujjain…" | **`/hotels/` owns K1** (owner, 22 Nov). Homepage title/H1 move to brand + discovery wording (e.g. "HotelsUjjain.in — Find Your Right Stay") and link prominently to `/hotels/`; `/hotels/` title/H1 lead with "Hotels in Ujjain" |
| C2 | Near Mahakal category vs Mahakal area | ✅ Already one URL; guide must not target the same query |
| C3 | Near Railway Station vs Freeganj | Consolidate Freeganj into the station page (section + filter) until distinct inventory; keep Freeganj `noindex` |
| C4 | Budget vs Dharamshalas | Separate intents; cross-link; label property type |
| C5 | Family vs Senior-friendly | Start as a section of the family page |
| C6 | Facility pages vs filter URLs | Canonical to clean URL ✅; no parameter URLs in navigation; facility pages only when gated criteria are met |
| C7 | Homepage H2 "Where to stay in Ujjain" vs the guide | Rename homepage H2 (e.g. "Popular areas to stay") and link to the guide |
| C8 | **ujjainhotels.in vs hotelsujjain.in** | Decide the domain plan; 301 the old site page-by-page at launch |
| C9 | Close variants ("near Mahakal / Mahakaleshwar / Mahakal Mandir"; "budget / cheap / affordable") | **One page per cluster** (OpenSEO agrees) — never one page per wording |
| C10 | Thin area pages (Nanakheda, Dewas Road, Freeganj) | `noindex` until distinct verified inventory (threshold, T6) |
| **C11** new | "Premium" page name vs searches for "luxury" (720) and "4-star" (1,600) | Keep `/hotels/premium/`; title/H1 like **"Luxury & Premium Hotels in Ujjain"**; mention 4-star where verified — *owner decision* |
| **C12** new | URL style: OpenSEO suggests flat keyword URLs (`/hotels-in-ujjain/`, `/hotels-near-mahakal/` …) | **Recommend keeping** the current `/hotels/…` structure: built and tested, keyword-bearing slugs, URL keywords are a minor factor. Nothing is indexed yet, so switching remains cheap if you prefer — *owner decision* |

---

## 4. Differentiation recommendation

**Positioning (only once operationally true):** *"Every detail was checked with the property — in person or by phone — and dated."*

**Data standard (merged with OpenSEO's profile standard):** every fact is shown as **confirmed / not confirmed / not offered**, with **source** (visit, phone, owner-submitted, official site) and **checked date**.

| Pillar | Data points to collect | How it shows | Rule |
|---|---|---|---|
| Locally verified information | Method, date, verifier, checklist of fields confirmed, re-check due | "Verified on [date] by [visit/phone]" + per-field status | Re-check every 90–180 days; unconfirmed fields say so |
| Walking and driving routes | Walked minutes to a named Mahakal entry point, steps/slopes/lanes/lighting, elder flag, early-morning note; car reach to door, nearest parking; route link | "Walked on [date]: 9 min, 1 flight of steps" | Walk with a timer; label walking vs driving separately with method |
| Room fit / family capacity | Per room type: adults + children, beds, extra mattress terms, connected rooms, child policy | Capacity table | Confirmed by the property; never inferred |
| Parking and lift | Lift (floors, backup power), step-free entry, ground-floor rooms; parking type, rough capacity, covered, coach access | "Seen on visit" vs "stated by property" | Accessibility claims only when seen |
| Arrival policies | Reception hours, early check-in, late-arrival acceptance, luggage storage, ID documents required | Policy box | Phone-confirmed and dated; no amounts unless confirmed |
| Transparent affiliate & enquiry | Approved partner, **hotel-specific deep link**, subID, link-test date | **Partner button first** (affiliate-first), Call/WhatsApp second; disclosure beside buttons and tables; "Featured · Paid" labels | Ordering never driven by commission; explain how lists are ordered |

*Requires new optional schema fields and profile sections — a separate planned task.*

---

## 5. Content quality — page specifications

**Global gate (recommended):** a collection is indexable only with **≥3 verified real hotels** (PR #2 currently uses ≥1 — T6). **Conversion model (owner decision):** partner outbound click first where a valid partner link exists; Call/WhatsApp the hotel second (and primary when no valid partner link exists).

### 5.1 `/hotels/` — hub for "Hotels in Ujjain" (K1)
- **Intent / visitor:** commercial comparison; everyone planning a stay.
- **Unique info:** all verified hotels with filters (area, budget band, room fit, facilities); short area comparison; how we verify; how the list is ordered.
- **Headings:** H1 Hotels in Ujjain · H2 Verified hotels (list + filters) · H2 Compare by area · H2 Compare by budget and room size · H2 Booking: check prices with our partners · H2 How we verify and order this list.
- **Internal links:** all collections, where-to-stay guide, profiles.
- **Conversion:** partner outbound click → booking; Call/WhatsApp secondary.
- **Verify:** every listed hotel's record; partner deep links tested and dated.

### 5.2 Homepage `/` — discovery (no longer K1)
- **Intent / visitor:** brand and first navigation.
- **Headings:** H1 Find your right stay (brand wording) · H2 Where would you like to stay? · H2 Browse by need · H2 Verified places to stay · H2 Popular areas to stay (C7) · H2 How we verify · H2 Plan your visit.
- **Internal links:** `/hotels/` prominently, collections, guide.
- **Conversion:** click into `/hotels/` or a collection.

### 5.3 `/hotels/near-mahakal-temple/` (K2)
- **Visitor:** darshan/Bhasma Aarti visitors, families, elders, groups.
- **Unique info:** walked routes to a named entry point, early check-in/late arrival, lift/parking, room fit.
- **Headings:** H1 Hotels near Mahakal Temple, Ujjain · H2 Verified hotels · H2 Walking to the temple: what we found · H2 Staying for Bhasma Aarti · H2 Travelling with elders · H2 Parking near the temple area · H2 How we verify.
- **Links:** darshan guide, family, budget, profiles. **Conversion:** partner click; Call/WhatsApp.
- **Verify:** each walk (date, timer), entry-point name as signposted, policies by phone, lift/parking on site; official timings only from the official temple source, dated — or omitted.

### 5.4 `/hotels/budget/` (K3)
- **Visitor:** price-sensitive pilgrims, students, short stays.
- **Unique info:** budget band explained; essentials confirmed (hot water, 24-hour desk, ID rules); "under ₹1,000" and "near temple" **sections**; total-price caveats.
- **Headings:** H1 Budget hotels in Ujjain · H2 Verified budget hotels · H2 Budget stays near the temple · H2 What to check before booking · H2 Budget hotels or dharamshalas? · H2 How we verify.
- **Conversion:** partner click (date-prefilled where supported); Call/WhatsApp.
- **Verify:** band agreed with property; **no static prices** unless confirmed with date, room basis and taxes.

### 5.5 `/hotels/family/` (K4)
- **Unique info:** room capacity per type, extra mattresses, connected rooms, child policy, lift.
- **Headings:** H1 Family hotels in Ujjain · H2 Verified family-friendly hotels · H2 Room sizes and capacity · H2 Travelling with elders (C5) · H2 How we verify.
- **Verify:** capacity per room type, extra beds, lift, step-free access.

### 5.6 `/hotels/near-railway-station/` (K5)
- **Unique info:** minutes to station entrance (walked/driven), reception hours, early check-in, luggage storage; Freeganj section.
- **Headings:** H1 Hotels near Ujjain Railway Station · H2 Verified hotels near Ujjain Junction · H2 Arriving late or leaving early · H2 Getting to Mahakal from the station area · H2 Freeganj · H2 How we verify.
- **Verify:** reception hours, late-arrival acceptance, early check-in, routes (dated).

### 5.7 Proposed `/hotels/dharamshalas/` (K6)
- **Unique info:** operator (trust/samaj, as confirmed), booking method, house rules, facilities, group capacity.
- **Headings:** H1 Dharamshalas in Ujjain · H2 Verified dharamshalas · H2 How booking works · H2 House rules to expect (per property) · H2 Group stays · H2 How we verify.
- **Conversion:** usually direct call (dharamshalas are rarely on partner sites — *unknown, to be checked per property*).
- **Verify:** operator, booking method, rules, contact — directly with the property. Needs schema fields.

### 5.8 Proposed `/hotels/with-parking/` (K7, gated)
- **Unique info:** parking type, rough capacity, car access, coach access.
- **Headings:** H1 Hotels with parking in Ujjain · H2 Verified hotels with parking · H2 Driving near the temple area · H2 How we verify parking.
- **Gate:** ≥3 qualifying verified hotels.

### 5.9 Proposed `/hotels/senior-friendly/` (K8, gated; starts as family-page section)
- **Unique info:** lift, step-free entry, ground-floor rooms, route difficulty, grab rails (only if seen).
- **Headings:** H1 Senior-friendly hotels in Ujjain · H2 Verified options · H2 What we check for elders · H2 Getting to the temple with elders.
- **Verify:** accessibility features **seen on visit**.

### 5.10 `/hotels/near-ram-ghat/` (K9)
- **Headings:** H1 Hotels near Ram Ghat, Ujjain (fix) · H2 Verified hotels · H2 Getting around from Ram Ghat · H2 How we verify.
- **Verify:** routes walked and dated; car access.

### 5.11 `/hotels/premium/` (K11)
- **Headings:** H1 Luxury & Premium Hotels in Ujjain (C11) · H2 Verified premium hotels · H2 What "premium" means here · H2 How we verify.
- **Verify:** star category only if officially classified/confirmed; facilities per data standard.

### 5.12 `/guides/where-to-stay-in-ujjain/` (K10)
- **Unique info:** neutral area comparison from our own visits; decision paths by visitor type.
- **Headings:** H1 Where to stay in Ujjain: choosing the right area · H2 Quick answer · H2 Near Mahakal Temple · H2 Ram Ghat & riverfront · H2 Railway station & Freeganj · H2 Nanakheda & Dewas Road · H2 By traveller type (families, groups, seniors, car, train) · H2 Staying for Bhasma Aarti · H2 Simhastha 2028 note.
- **Conversion:** click into an area collection.
- **Verify:** every area claim from visits; dated; no event/timing claims without an official source.

---

## 6. Technical SEO issues

| ID | Issue | Severity | Recommendation | When |
|---|---|---|---|---|
| T1 | Site-wide `Disallow: /` + `noindex` | Intentional | Switch both together at launch; submit sitemap | Launch |
| T2 | ujjainhotels.in indexable, no meta description, conflicting model | **High** | Decide domain plan; 301 page-by-page | Before launch |
| T3 | Homepage vs `/hotels/` target the same query | High → **decided** | Retitle homepage; `/hotels/` leads with "Hotels in Ujjain" | Before launch |
| T4 | 17 stubs linked sitewide with `noindex, nofollow` | Medium | Remove stubs from navigation or use `noindex, follow`; publish real trust pages | Before launch |
| T5 | "Coming soon" descriptions; brandless titles | Low | Fixed in PR #2 | PR #2 |
| T6 | Collection indexable with only 1 verified hotel (PR #2) | Medium | Raise to **≥3** | Before launch |
| T7 | Sitemap lists 3 URLs | Expected | Expands automatically (PR #2) | Launch |
| T8 | Filter parameter URLs | Low | Canonical to clean URL ✅; keep parameters out of navigation | — |
| T9 | No Hindi / `hreflang` | **High (audience)** | Hindi versions of core pages + Hindi keyword research | Month 2 |
| T10 | Organization data minimal; FAQ rich results limited | Low | Add `ContactPoint` when contacts exist; since Aug 2023 Google shows FAQ rich results mainly for government/health sites | Launch |
| T11 | Trust pages are stubs (About/editorial method, Contact/corrections, Privacy, Terms, How we verify) | **High** | Publish real pages (OpenSEO lists the same) | Before launch |
| T12 | No photography | Medium | Own/permissioned photos; captions never imply a room type that isn't shown | Weeks 2–4 |
| T13 | Guides are stubs | Medium | Where-to-stay first | Week 3 |
| T14 | Navigation-only internal linking | Medium | Contextual hub ↔ collection ↔ guide ↔ profile links | Weeks 3–4 |
| T15 | Area H1s lack "hotels" | Low | Update area titles in data | Before launch |
| T16 | Canonicals, HTTPS, www→apex, 404 | OK | Keep | — |
| **T17** new | Search Console **not connected to the OpenSEO project** (per OpenSEO) | Medium | Connect it in OpenSEO to get first-party queries/pages | Week 1 |
| **T18** new | No outbound-click measurement for partner links (needed for affiliate-first) | Medium | Needs the analytics decision: GA4 events require cookie consent; cookie-free tools generally can't report per-partner clicks. Partner dashboards with subIDs cover bookings either way | Weeks 1–2 (decision) |

---

## 7. Prioritised 30-day action plan

*Every site change follows plan → preview → "go". Owner = you; Claude = implementation.*

| Days | Action | Owner | Done when |
|---|---|---|---|
| 1–3 | Decide C8 (domain plan), C11 (Luxury wording), C12 (URL style), T18 (analytics/consent) | You | Recorded in `docs/DECISIONS.md` |
| 1–3 | **Connect Search Console to the OpenSEO project** (T17); optionally connect the OpenSEO connector to Claude | You | OpenSEO shows GSC connected |
| 1–7 | Apply to **one** affiliate programme first (see `docs/AFFILIATE-PLAN.md`) | You | Account approved (terms not guaranteed) |
| 2–10 | Verify the first **10–15 hotels** with the data standard (§4): room fit, lift/parking, arrival policies, walked routes, photos with permission; aim ≥3 per core collection | You | Records `verified` in `npm run hotels` |
| 4–10 | Trust pages: About/editorial method, Contact/corrections, How we verify, Privacy (DPDP), Terms | You (facts) + Claude (drafts) | Approved via preview |
| 5–12 | Implement (separate planned tasks): **affiliate-first button order**, hub/homepage retitle (C1), homepage H2 (C7), Premium/Luxury wording (C11), threshold ≥3 (T6), area H1s (T15), stubs out of navigation (T4), schema fields for §4 | Claude | Preview approved, then "go" |
| 8–14 | Build and **test one hotel-specific Ujjain deep link** (mobile attribution) before adding more | You + Claude | Test booking path documented |
| 10–20 | Publish verified listings + collections meeting the gate | Claude after "go" | Pages live; indexable only when qualified |
| 12–20 | Where-to-stay guide from your visits | You + Claude | Approved |
| 20–25 | Launch indexing (remove `Disallow` + `noindex`), submit sitemap, inspect key URLs | Claude after "go" | Sitemap submitted |
| 20–25 | 301 the old domain (if approved) | You + Claude | Old URLs redirect |
| 25–30 | Review GSC/OpenSEO queries; plan Hindi pages, dharamshala page, Hindi keyword research | Claude + you | Month-2 plan agreed |

**Beyond 30 days (from OpenSEO's 90-day roadmap, adapted):** grow to 25–30 verified hotels; add filters for room capacity; earn legitimate local links (tourism resources, transport guides, local publishers, hotel partners — no paid link schemes); review low-CTR pages; prune or consolidate thin pages; measure completed stays, not clicks.

---

## Sources (22 Nov 2026)
- **OpenSEO report (owner's account):** https://app.openseo.so/s/fjlc_Thau_Ql0DfEdAMepsCQVvm5CVBN — also cites Agoda's partner FAQ, Booking.com partner terms and Google Search Central guidance (spam policies, helpful content, SEO Starter Guide), "cited by OpenSEO"
- HotelsUjjain.in live crawl: https://hotelsujjain.in/ (23 URLs), robots.txt, sitemap.xml
- ujjainhotels.in: https://ujjainhotels.in/
- hotelsinujjain.in: https://hotelsinujjain.in/ · /how-we-measure-walking-time · /hotels/near-mahakal-temple · /hotels/dharamshala · /hotel/hotel-prakasham
- ujjainhotel.in: https://ujjainhotel.in/
- ujjainhotels.net: https://www.ujjainhotels.net/en/ · /en/near-mahakaleshwar-jyotirlinga-414283/
- yatradham.org: https://yatradham.org/yatradham-destinations/madhya-pradesh/ujjain.html · https://yatradham.org/ujjain-yadav-dharamshala.html
- Booking.com: https://www.booking.com/city/in/ujjain.html (server HTML only)
- MakeMyTrip / Goibibo / Agoda: automated access blocked; search snippets only (e.g. https://ae.makemytrip.global/hotels-international/en-ae/india/ujjain-hotels/mahakal_lok.html)
- Context only: https://en.hoteles.com/en/de10663925/hotels-near-shri-mahakaleshwar-temple-ujjain-india · https://au.trip.com/hotels/ujjain-mahakaleshwar/hotels-c62646m39913959
