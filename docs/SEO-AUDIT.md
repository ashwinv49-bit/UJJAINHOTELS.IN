# SEO audit — HotelsUjjain.in

**Date:** 22 November 2026 · **Type:** read-only audit (no pages created, nothing published, no live files changed)
**Prepared for:** owner, HotelsUjjain.in

## How this audit was made — and what it does NOT contain

| Evidence | Source |
|---|---|
| Live site inventory | Automated crawl of https://hotelsujjain.in on 22 Nov 2026 (23 URLs), plus `robots.txt` and `sitemap.xml` |
| Pending changes | Pull request #2 (hotel system) — reviewed from the repository, **not live** |
| Competitors | Pages fetched directly on 22 Nov 2026 (structure, headings, meta tags, structured-data types, link patterns, on-page terms). Where a site blocked automated access, only search-result snippets were available — marked **[snippet]** |

**Unknown — not invented anywhere in this report:**
- **Keyword search volumes and difficulty** — no keyword tool data was available. Priorities below are based on search intent and business fit, not volume.
- **Current rankings** — HotelsUjjain.in is deliberately blocked from indexing (pre-launch), so it has no rankings. Competitor rankings and traffic were not measured.
- **Search Console data** — the property was verified on 21 Nov 2026; no data exists yet.
- **MakeMyTrip, Goibibo and Agoda page content** — automated access was blocked (timeout / empty response / bot challenge). Only search snippets were seen.
- **Hotel facts** — no hotel data is asserted anywhere in this report.

---

## Executive summary

1. **The site is technically clean but has no indexable content yet.** All 23 live URLs are `noindex` and crawling is blocked by `robots.txt` (intentional pre-launch). Canonicals are correct on 23/23 pages. 17 of the 23 pages are "coming soon" stubs.
2. **The strongest competitor for our positioning is hotelsinujjain.in.** It already ranks hotels by *computed* walking time to Mahakal, marks facilities "confirmed" from hotel websites/booking listings, shows no prices or ratings, discloses affiliate links and publishes its method. **Our differentiation therefore cannot be "transparency" alone — it must be first-hand verification** (in-person or by phone with the property, dated), which no checked competitor offers.
3. **Cannibalisation risks exist today:** homepage vs `/hotels/` (both titled "Hotels in Ujjain…"), the homepage "Where to stay in Ujjain" section vs the planned guide, Freeganj vs Near Railway Station, and **your own older domain ujjainhotels.in**, which is indexable and titled "Ujjain hotels".
4. **Biggest content gaps in the market** (as far as our sample shows): in-person verification, family room capacity, lift/parking checked on site, early check-in and late-arrival policies confirmed with the property, walking routes walked in person (steps, lanes, night lighting for Bhasma Aarti), direct hotel contact, and full Hindi pages.
5. **30-day priority:** verify the first real hotels with the new data points, ship trust pages (About, Contact, How we verify, Privacy, Terms), resolve the domain and keyword-ownership decisions, then switch on indexing for only the pages that meet a quality threshold.

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
| `/` | Real | Hotels in Ujjain: Find Your Right Stay \| HotelsUjjain.in (56) | Find your right stay in Ujjain | 147 |
| `/hotels/` | Stub | Hotels in Ujjain by Area and Type (33) | Browse hotels in Ujjain | 130 — **same target as homepage** |
| `/hotels/near-mahakal-temple/` | Stub | Hotels near Mahakal Temple, Ujjain (34) | Hotels near Mahakal Temple | 130 — says "coming soon" |
| `/hotels/budget/` | Stub | Budget Hotels in Ujjain (23) | Budget Hotels | 124 — "coming soon" |
| `/hotels/family/` | Stub | Family Hotels in Ujjain (23) | Family Hotels | 118 — "coming soon" |
| `/hotels/luxury/` | Stub | Luxury Hotels and Resorts in Ujjain (35) | Luxury Hotels | 121 — renamed to `/hotels/premium/` in PR #2 (301) |
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
- Hotel stubs become **collection pages** (all `/hotels/…` categories and areas) with filters; `noindex` while they contain no verified real hotel.
- Hotel profile pages `/hotels/<slug>/` for verified listings, with `Hotel` + `BreadcrumbList` structured data from verified facts only.
- "Luxury" → "Premium" (`/hotels/luxury/` 301 → `/hotels/premium/`); collection titles gain the brand suffix; "coming soon" wording removed from category descriptions.

### 1.4 Your other domain — ujjainhotels.in (WordPress, Hostinger)
- **Indexable** (no `noindex`), own sitemap with 6 pages, homepage title "Ujjain hotels", **no meta description**.
- Content describes a booking/refund model that conflicts with the HotelsUjjain.in brief (see `docs/AUDIT.md`).
- **SEO risk:** two sites owned by you compete for the same searches and split signals. See cannibalisation item C8.

---

## 2. Competitor gap analysis

### 2.1 Overview

| Competitor | What it is (as observed) | Access | Landing-page structure | Hotel data shown | Trust signals | Main weakness / our opportunity |
|---|---|---|---|---|---|---|
| **hotelsinujjain.in** | Affiliate directory, ~25 hotels, plus blog | Full | Audience chooser → "stay finder" quiz → hotels ranked by walking time → price/booking-site comparison → method → areas → best time → dharamshala note → FAQs | Computed walking minutes (OpenStreetMap routing), facility status with source (hotel site / booking listing), Hindi facility labels, links to booking sites; **no prices or ratings** | Published method page, open dataset, affiliate disclosure, "last re-check" date, corrections invited | **Desk research only** — no visits/calls; positions partly from booking-site pins; facilities often "not confirmed"; no direct hotel contact; dharamshalas not covered in depth |
| **ujjainhotel.in** | Thin single-page app + hotelier submission / partner portal | Partial (little server HTML) | One H1, no H2s; ~190 visible words | Not visible in server HTML | Claims "verified" and "direct contact, zero commission"; positions on owners' religion | Very thin indexable content; religious-ownership positioning (**we should not imitate**) |
| **ujjainhotels.net** | Large template aggregator ("1,397 properties"), `/en/` paths | Full | Search → "top searches" → property list → filter hubs (type, star rating, theme, district) → landmark pages → generic city text | Distance in km to landmarks, ratings/reviews, "couple-friendly" emphasis | Few; generic "lowest rates" claims; no structured data on homepage | Generic, non-local copy; unverifiable price claims; no verification; good **landmark/filter URL structure** to learn from (not copy) |
| **yatradham.org** | Pilgrim stay marketplace (dharamshalas, hotels, homestays) taking bookings | Full | Ujjain hub: list → price table → group stays → booking how-to → temple timings & facts → stay types → by attraction → by area → by price → nearby route stays | Prices, room types, amenities, policies & rules, distances, FAQs; `Hotel` + price structured data on listings | Reviews section, policies, FAQs | Strong on **dharamshala** queries; data quality varies between listings; booking-led (not independent); room for **verified, dated** dharamshala info and direct contact |
| **Booking.com** | Global OTA | Partial (listing grid loads by JavaScript) | City page: title "10 Best Ujjain Hotels…(From US$12)", H1 "Search hotels in Ujjain", breadcrumb, site search | Not visible in server HTML | Reviews, brand trust; `BreadcrumbList`, `WebSite`/`SearchAction` | Some property names are keyword-stuffed **[from a listing URL in search results]**; generic city copy; no local verification |
| **MakeMyTrip** | Indian OTA | **Blocked** (timeout) | **[snippet]** UAE site shows a Mahakal Lok landmark page and a "stays near temple" collection; hotel pages state distance to the temple | **[snippet]** distances, reviews | Brand, reviews | Unknown in detail — cannot verify |
| **Goibibo** | Indian OTA | **Blocked** (empty response) | Unknown | Unknown | Unknown | Unknown — cannot verify |
| **Agoda** | OTA | **Blocked** (bot challenge) | Unknown | Unknown | Unknown | Unknown — cannot verify |

Also seen in search results (not in your list, for context only): Hotels.com and Trip.com have "hotels near Shri Mahakaleshwar Temple" landmark pages **[snippet]**.

### 2.2 What the market already does well (don't compete head-on)
- **Inventory breadth and live prices** — OTAs and large aggregators (hundreds of properties, live rates, reviews). We should not try to out-list them.
- **Computed walking times and source transparency** — hotelsinujjain.in owns this angle today.
- **Dharamshala catalogue with booking** — yatradham.org.

### 2.3 Gaps nobody in our sample fills (our opportunity)
1. **First-hand verification** — details checked with the property **by phone or visit**, with date, method and what was checked.
2. **Routes walked in person** — real minutes on foot, steps, slopes, lane width, night lighting and safety for 3–4 a.m. Bhasma Aarti departures, elder suitability; *computed routes cannot see these*.
3. **Family room capacity** — how many adults/children per room type, extra beds/mattresses, interconnected rooms.
4. **Lift and parking checked on site** — lift present / floors served / power backup; parking on-site or nearby, rough capacity, car access to the door, coach/tempo-traveller access.
5. **Early check-in, late arrival and reception policies** — confirmed with the property (important for overnight trains and Bhasma Aarti).
6. **Direct contact with the hotel** — Call/WhatsApp to the property; competitors push users to OTAs or to themselves.
7. **Full Hindi pages** — the closest competitor only has Hindi labels.
8. **Dharamshala information with independent verification** — not booking-led.

### 2.4 Do NOT copy
Keyword-stuffed names, "best/lowest price" claims we can't prove, religious-ownership positioning, competitor text, data or photos, and any price or rating we haven't verified.

---

## 3. Keyword-to-page map

*Search volumes: **unknown** for every keyword (no keyword data available). Collect them with Google Keyword Planner and, after launch, Search Console — then revisit priorities.*

| # | Keyword (primary) | Intent | Primary page | Today | Supporting pages | Notes |
|---|---|---|---|---|---|---|
| K1 | Hotels in Ujjain | Commercial, broad | **`/` homepage** (recommended) | Live, noindex | `/hotels/` (directory), all collections | See C1 — `/hotels/` should target "list of verified hotels in Ujjain" instead |
| K2 | Hotels near Mahakal Temple | Commercial, local | `/hotels/near-mahakal-temple/` | Stub → collection (PR #2) | Mahakal darshan guide, profiles in area | Highest local intent; needs walked routes + Bhasma Aarti notes |
| K3 | Budget hotels in Ujjain | Commercial, price-sensitive | `/hotels/budget/` | Stub → collection | Dharamshala page, Near Mahakal | Never show prices we can't verify — use "Budget band" |
| K4 | Family hotels in Ujjain | Commercial | `/hotels/family/` | Stub → collection | Senior-friendly section (C5) | Needs verified room capacity |
| K5 | Hotels near railway station (Ujjain Junction) | Commercial, transit | `/hotels/near-railway-station/` | Stub → collection | Freeganj (C3), early check-in info | Late-arrival / early check-in policies are key |
| K6 | Dharamshalas in Ujjain | Commercial/informational, trust | **Proposed** `/hotels/dharamshalas/` | Not built | Budget page, Near Mahakal | Different property type; yatradham.org is strong here |
| K7 | Hotels with parking (in Ujjain) | Commercial, facility | **Proposed** `/hotels/with-parking/` — **gated** | Filter only (`?facility=parking`) | Dewas Road, family | Create only when enough hotels have parking verified on site (see T6) |
| K8 | Senior-friendly accommodation (Ujjain) | Commercial, accessibility | **Proposed** `/hotels/senior-friendly/` — **gated** | Not built | Family page section | Start as a section of the family page (C5) |
| K9 | Hotels near Ram Ghat | Commercial, local | `/hotels/near-ram-ghat/` | Stub → collection | Where-to-stay guide | Fix H1 to include "Hotels near Ram Ghat" |
| K10 | Where to stay in Ujjain | Informational (planning) | `/guides/where-to-stay-in-ujjain/` | Stub | All area pages, homepage | See C7 — homepage H2 currently uses the same phrase |

### 3.1 Cannibalisation flags and consolidation

| ID | Conflict | Evidence | Recommendation |
|---|---|---|---|
| **C1** | Homepage vs `/hotels/` both target "Hotels in Ujjain" | Titles "Hotels in Ujjain: Find Your Right Stay" vs "Hotels in Ujjain by Area and Type" | Homepage owns K1. Retitle `/hotels/` around "all verified hotels in Ujjain — filter by area, budget and facilities"; keep distinct H1 |
| **C2** | "Hotels near Mahakal Temple" (category) vs "Mahakal Temple area" (area) | Same URL already | ✅ Already consolidated — keep one URL; Mahakal darshan guide must link to it, not target the same query |
| **C3** | Near Railway Station vs Freeganj (adjacent area) | Separate URLs, likely overlapping hotels | **Consolidate** Freeganj into the station page (section + filter) until it has distinct verified inventory; keep `/hotels/freeganj/` `noindex` meanwhile |
| **C4** | Budget hotels vs Dharamshalas | Overlapping visitors | Separate pages, different intent; budget page links to dharamshala page; label property type clearly |
| **C5** | Family vs Senior-friendly | Overlapping needs | **Consolidate initially** as a "Travelling with elders" section on the family page; split out only with enough verified data |
| **C6** | Facility pages vs filter URLs (`?facility=parking`) | Filter state on `/hotels/` | Canonical already points to the clean URL ✅; never link to parameter URLs in navigation; create facility pages only when gated criteria are met |
| **C7** | Homepage section "Where to stay in Ujjain" vs the guide | Homepage H2 uses the exact phrase | Rename homepage H2 (e.g. "Popular areas to stay") and link to the guide |
| **C8** | **ujjainhotels.in vs hotelsujjain.in** | Old site indexable, title "Ujjain hotels" | Decide the domain plan (DECISIONS #1–2); at launch **301 the old site page-by-page** (mapping in `docs/DEPLOYMENT.md` §5) |
| **C9** | "Luxury" vs "Premium" | Renamed in PR #2 | Keep 301; mention "luxury" naturally in Premium copy so the term isn't lost |
| **C10** | Thin area pages (Nanakheda, Dewas Road, Freeganj) | No inventory | Keep `noindex` until they have distinct, verified hotels (PR #2 does this at 0 hotels — raise to a threshold, T6) |

---

## 4. Differentiation recommendation

**Positioning (use only once operationally true):** *"Every detail on HotelsUjjain.in was checked with the property — in person or by phone — and dated."*

| Pillar | What to collect per hotel (proposed data points) | How it shows on the page | Verification rule |
|---|---|---|---|
| **Locally verified property information** | Verification method (site visit / phone), date, verifier, checklist of what was confirmed; re-check due date | "Verified on [date] by [visit/phone]: name, address, phone, rooms, facilities" | Only fields confirmed in that check are published; re-check every 90–180 days |
| **Practical walking and driving routes** | Walked minutes to a named Mahakal entry point (as signposted on the day), route notes (steps, slopes, narrow lanes, lighting, shade), elder-suitability flag, early-morning note; car reach to the door, nearest parking, auto/e-rickshaw drop point | "Walked by our team on [date]: 9 min, 1 flight of steps, lane too narrow for cars" | Walk it with a timer; record date; note festival diversions as unknown |
| **Family room capacity** | Per room type: max adults + children, extra bed/mattress availability, number of family rooms, interconnected rooms | Capacity table per room type | Confirmed by the property; no guessing from photos |
| **Parking and lift verification** | Lift yes/no, floors served, works on power backup?; step-free entrance; ground-floor rooms; parking on-site/nearby, rough car capacity, covered, coach access | "Lift: yes, floors G–4 (seen on visit)" · "Parking: on-site, about 6 cars (owner, phone)" | Distinguish *seen on visit* vs *stated by property* |
| **Early check-in and reception policies** | Reception hours, early check-in (allowed / on request / not allowed; charged yes/no), late-night arrival accepted, luggage storage, ID documents the hotel asks for | Policy box | Confirmed by phone and dated; no amounts unless confirmed |
| **Transparent enquiry and affiliate disclosure** | — | Every button says who you contact ("Call the hotel", "WhatsApp the hotel", "Partner link"); disclosure next to partner links; "Featured · Paid" labels; "How we verify" and correction links on every profile | Already built into the design (PR #2); extend with a public **"How we verify"** methodology page |

**Implementation note (for approval later):** these require new optional fields in `data/schema/hotel.schema.json` and profile sections — a separate, planned task.

---

## 5. Content quality — proposed page specifications

**Global publication gate (recommended):** a collection page becomes indexable only when it lists **at least 3 verified real hotels** (currently 1 in PR #2 — see T6). Every fact below must be verified and dated before publication.

### 5.1 Homepage `/` — "Hotels in Ujjain"
- **Intent / visitor:** broad planning and comparison; first-time pilgrims and families.
- **Unique info:** how verification works (1–2 lines + link), area chooser, featured verified stays, direct-contact promise.
- **Headings:** H1 Find your right stay in Ujjain · H2 Where would you like to stay? · H2 Browse by need · H2 Verified places to stay · H2 Popular areas to stay (renamed, C7) · H2 How we verify · H2 Plan your visit.
- **Internal links:** all five core collections, `/hotels/`, where-to-stay guide, How we verify.
- **Conversion:** click into a collection → call/WhatsApp a hotel.
- **Verify before publishing:** every featured hotel's verification; any area description.

### 5.2 `/hotels/near-mahakal-temple/`
- **Intent / visitor:** stay within walking distance for darshan/Bhasma Aarti; families, elders, groups.
- **Unique info:** walked minutes to a named entry point, route notes (steps/lanes/lighting), early check-in/late-arrival policy, lift and parking status, family capacity.
- **Headings:** H1 Hotels near Mahakal Temple, Ujjain · H2 Verified hotels (list + filters) · H2 Walking to the temple: what we found · H2 Staying for Bhasma Aarti · H2 Travelling with elders · H2 Parking near the temple area · H2 How we verify.
- **Internal links:** Mahakal darshan guide, family, senior section, budget, profiles.
- **Conversion:** call/WhatsApp hotel; partner link when valid.
- **Verify:** each walk (date, timer), entry point name as signposted, policies by phone, lift/parking on site. Official darshan/aarti timings must come from the official temple source and be dated — or omitted.

### 5.3 `/hotels/budget/`
- **Intent / visitor:** lowest-cost acceptable stay; pilgrims, students, short stays.
- **Unique info:** what "budget" means here (band, not price), basics verified (hot water, 24-hour desk, ID rules), comparison with dharamshalas.
- **Headings:** H1 Budget hotels in Ujjain · H2 Verified budget hotels · H2 What to check before booking a budget room · H2 Budget hotels or dharamshalas? · H2 How we verify.
- **Internal links:** dharamshalas, near Mahakal, near railway station.
- **Conversion:** call/WhatsApp.
- **Verify:** band agreed with the property; basics confirmed; **no prices unless confirmed and dated** (recommendation: keep "price on enquiry").

### 5.4 `/hotels/family/`
- **Intent / visitor:** families with children/elders.
- **Unique info:** room capacity per type, extra beds, lift, food options (only as confirmed), quiet location notes.
- **Headings:** H1 Family hotels in Ujjain · H2 Verified family-friendly hotels · H2 Room sizes and capacity · H2 Travelling with elders (C5 section) · H2 How we verify.
- **Internal links:** near Mahakal, parking, senior section, premium.
- **Conversion:** call/WhatsApp to confirm room configuration.
- **Verify:** capacity per room type, lift, step-free access, extra beds.

### 5.5 `/hotels/near-railway-station/`
- **Intent / visitor:** arriving late / leaving early by train; transit stays.
- **Unique info:** walked/driven minutes to the station entrance, 24-hour reception, early check-in and luggage storage, Freeganj section (C3).
- **Headings:** H1 Hotels near Ujjain Railway Station · H2 Verified hotels near Ujjain Junction · H2 Arriving late or leaving early · H2 Getting to Mahakal from the station area · H2 Freeganj · H2 How we verify.
- **Internal links:** near Mahakal, budget, Freeganj (until consolidated).
- **Conversion:** call/WhatsApp.
- **Verify:** reception hours, late-arrival acceptance, early check-in policy, route to station (walked/driven, dated).

### 5.6 Proposed `/hotels/dharamshalas/`
- **Intent / visitor:** low-cost or community-run stays; pilgrim groups.
- **Unique info:** who runs it (trust/samaj, as confirmed), booking method (walk-in/phone/advance), house rules (timings, food, ID), facilities verified, group capacity.
- **Headings:** H1 Dharamshalas in Ujjain · H2 Verified dharamshalas · H2 How booking works at dharamshalas · H2 House rules to expect (as confirmed per property) · H2 Group stays · H2 How we verify.
- **Internal links:** budget, near Mahakal, near Ram Ghat.
- **Conversion:** call the dharamshala (direct).
- **Verify:** operator, booking method, rules, contact number — all directly with the property. **Requires a schema change** (`propertyType: dharamshala` exists; rules/booking-method fields don't yet).

### 5.7 Proposed `/hotels/with-parking/` (gated)
- **Intent / visitor:** self-drive families/groups.
- **Unique info:** parking type, rough capacity, car access to door, coach access.
- **Headings:** H1 Hotels with parking in Ujjain · H2 Verified hotels with parking · H2 Driving near the temple area · H2 How we verify parking.
- **Internal links:** Dewas Road, family, near Mahakal.
- **Conversion:** call to reserve/confirm parking.
- **Verify:** parking seen on visit or confirmed by phone, with date. **Do not create until ≥3 verified hotels qualify.**

### 5.8 Proposed `/hotels/senior-friendly/` (gated; start as a section of the family page)
- **Intent / visitor:** travellers with elderly parents or limited mobility.
- **Unique info:** lift, step-free entrance, ground-floor rooms, walking route difficulty, bathroom grab rails (only if seen).
- **Headings:** H1 Senior-friendly hotels in Ujjain · H2 Verified options · H2 What we check for elders · H2 Getting to the temple with elders.
- **Internal links:** family, near Mahakal, parking.
- **Conversion:** call to request ground-floor/lift-access rooms.
- **Verify:** every accessibility feature seen on visit (phone confirmation alone is not enough for accessibility claims — recommended rule).

### 5.9 `/hotels/near-ram-ghat/`
- **Intent / visitor:** stay near the ghats and evening aarti.
- **Unique info:** walked minutes to Ram Ghat, lane access for cars, noise notes, distance to Mahakal.
- **Headings:** H1 Hotels near Ram Ghat, Ujjain (fix current H1) · H2 Verified hotels · H2 Getting around from Ram Ghat · H2 How we verify.
- **Internal links:** near Mahakal, where-to-stay guide, dharamshalas.
- **Conversion:** call/WhatsApp.
- **Verify:** routes walked and dated; car access.

### 5.10 `/guides/where-to-stay-in-ujjain/`
- **Intent / visitor:** first planning step; comparing areas.
- **Unique info:** area-by-area comparison from our own visits: walking minutes to Mahakal, car access, noise, suits whom; links into each collection.
- **Headings:** H1 Where to stay in Ujjain: choosing the right area · H2 Quick answer · H2 Near Mahakal Temple · H2 Ram Ghat & riverfront · H2 Railway station & Freeganj · H2 Nanakheda & Dewas Road · H2 Staying for Bhasma Aarti · H2 Travelling with elders · H2 Simhastha 2028 note.
- **Internal links:** every area/collection page, darshan guide, Simhastha guide.
- **Conversion:** click into an area collection.
- **Verify:** every area claim from owner's local knowledge/visits; dated; no claims about events or timings without an official source.

---

## 6. Technical SEO issues

| ID | Issue | Severity | Evidence | Recommendation | When |
|---|---|---|---|---|---|
| T1 | Site-wide `Disallow: /` + `noindex` | Intentional (pre-launch) | robots.txt, meta robots | At launch switch both together; then submit sitemap in Search Console | Launch |
| T2 | Old domain ujjainhotels.in indexable, no meta description, conflicting business model | **High** | Live check 22 Nov | Decide domain plan; 301 page-by-page at launch | Before launch |
| T3 | Homepage vs `/hotels/` target the same query (C1) | High | Titles | Retitle `/hotels/` | Before launch |
| T4 | 17 stub pages linked sitewide (header/footer) with `noindex, nofollow` | Medium | Crawl: ~20 links per page to stubs | At launch: stubs not in navigation, or `noindex, follow`; publish real trust pages | Before launch |
| T5 | Live category descriptions say "coming soon"; brandless short titles | Low | Crawl | Fixed in PR #2 | PR #2 |
| T6 | Collection indexable with only **1** verified hotel (PR #2) | Medium | PR #2 rule | Raise threshold to **≥3** verified real hotels | Before launch |
| T7 | Sitemap lists 3 URLs | Low (expected) | sitemap.xml | Auto-expands with verified profiles/collections (PR #2) | Launch |
| T8 | Filter parameter URLs | Low | `/hotels/?facility=…` | Canonical to clean URL already ✅; keep parameters out of navigation | — |
| T9 | No Hindi pages / `hreflang` | **High (audience gap)** | `lang=en-IN` only | Plan `/hi/` versions of core pages with `hreflang` en-IN/hi-IN | Month 2 |
| T10 | Organization data minimal; FAQ rich results limited | Low | Homepage JSON-LD | Add `ContactPoint` once phone/email exist. Note: since Aug 2023 Google shows FAQ rich results mainly for government/health sites — FAQ markup is optional, not a priority | Launch |
| T11 | Trust pages are stubs (About, Contact, Privacy, Terms, How we verify) | **High** | Crawl | Publish real pages with owner identity, contact, method | Before launch |
| T12 | No photography (line-art hero, placeholder cards) | Medium | Crawl | Own photos with descriptive file names/alt; per-hotel photos with permission | Weeks 2–4 |
| T13 | Guides are stubs with 2 inbound links each | Medium | Crawl | Write where-to-stay first; link from homepage/collections | Week 3 |
| T14 | Internal linking is navigation-only; breadcrumbs only after PR #2 | Medium | Crawl | Add contextual area↔category↔guide links | Weeks 3–4 |
| T15 | H1s on area pages lack "hotels" (Ram Ghat, Freeganj, Nanakheda, Dewas Road) | Low | Crawl | Use "Hotels near Ram Ghat, Ujjain" etc. (PR #2 headings come from data — update area titles) | Before launch |
| T16 | Canonicals, HTTPS, www→apex, 404 | OK | Crawl | Keep | — |

---

## 7. Prioritised 30-day action plan

*No page is published without the plan → preview → "go" process. Owner = you; Claude = implementation.*

| Days | Action | Owner | Depends on | Done when |
|---|---|---|---|---|
| 1–3 | Decide: domain plan for ujjainhotels.in (C8); homepage owns "Hotels in Ujjain" (C1); consolidate Freeganj and Senior sections (C3, C5) | You | — | Decisions recorded in `docs/DECISIONS.md` |
| 1–3 | Approve the new verification data points (§4) | You | — | Field list approved |
| 1–7 | Get keyword data: Google Keyword Planner volumes for the 10 keywords (+ Hindi variants) | You (account) / Claude (analysis) | Ads account | Volumes recorded — replace "unknown" in §3 |
| 2–10 | Field verification of the first hotels: aim for **≥3 per core collection** (near Mahakal, station, budget, family) with walked routes, capacity, lift/parking, policies, photos with permission | You | Field list | Records reach `verified` in `npm run hotels` |
| 4–10 | Write trust pages: About (who runs it), Contact (WhatsApp/email), **How we verify**, Privacy (DPDP), Terms | You (facts) + Claude (draft) | Contact details | Pages approved via preview |
| 5–12 | Implement: schema fields + profile sections for §4; collection threshold ≥3 (T6); retitle `/hotels/` (C1); homepage H2 rename (C7); area H1 fixes (T15); stubs out of navigation (T4) | Claude | Approvals | PR preview approved |
| 10–20 | Publish first verified listings and the collections that meet the threshold | Claude after "go" | Verified records | Pages live, indexable only when qualified |
| 12–20 | Write "Where to stay in Ujjain" guide from your visits | You (facts) + Claude | Area visits | Guide approved |
| 20–25 | Launch indexing: remove `Disallow` + `noindex` together; submit sitemap; inspect key URLs in Search Console | Claude after "go" | Trust pages + ≥1 qualified collection | Sitemap submitted, coverage report clean |
| 20–25 | 301 the old domain page-by-page (if approved) | You (Hostinger access) / Claude (rules) | C8 decision | Old URLs redirect correctly |
| 25–30 | Review Search Console coverage and queries; plan Hindi pages and the dharamshala page | Claude + you | Launch | Month-2 plan agreed |

---

## Sources (fetched or searched 22 Nov 2026)
- HotelsUjjain.in live crawl: https://hotelsujjain.in/ (23 URLs), robots.txt, sitemap.xml
- ujjainhotels.in: https://ujjainhotels.in/
- hotelsinujjain.in: https://hotelsinujjain.in/ · /how-we-measure-walking-time · /hotels/near-mahakal-temple · /hotels/dharamshala · /hotel/hotel-prakasham
- ujjainhotel.in: https://ujjainhotel.in/
- ujjainhotels.net: https://www.ujjainhotels.net/en/ · /en/near-mahakaleshwar-jyotirlinga-414283/
- yatradham.org: https://yatradham.org/yatradham-destinations/madhya-pradesh/ujjain.html · https://yatradham.org/ujjain-yadav-dharamshala.html
- Booking.com: https://www.booking.com/city/in/ujjain.html (server HTML only)
- MakeMyTrip / Goibibo / Agoda: automated access blocked; search snippets only (e.g. https://ae.makemytrip.global/hotels-international/en-ae/india/ujjain-hotels/mahakal_lok.html)
- Context only: https://en.hoteles.com/en/de10663925/hotels-near-shri-mahakaleshwar-temple-ujjain-india · https://au.trip.com/hotels/ujjain-mahakaleshwar/hotels-c62646m39913959
