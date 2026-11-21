# Hotel listings: how to add, update and publish

The hotel database is a set of JSON files, one per hotel, in `data/hotels/`. The website builds every hotel page, category page and filter automatically from these files.

**Golden rule:** never invent anything. If you haven't confirmed a detail with the property, leave it out. The site is designed to work with missing information.

---

## 1. The three statuses

| Status | Meaning | On the website? |
|---|---|---|
| `draft` | You've heard of the hotel and started a record | **No** |
| `contacted` | You've reached the property; details not yet confirmed | **No** |
| `verified` | Every published detail has been confirmed with the property, and the verification block is filled in | **Yes** |

The build **refuses to publish** a "verified" hotel that is missing required details (area, budget band, type, summary, full address, confirmed phone, verification date/method/person). It also **fails the deploy** if a draft or contacted hotel ever appears on a page.

---

## 2. Add a new hotel

**Easiest: send Claude the details.** For example: *"Add Hotel X, near Ram Ghat, phone …, contacted today."* Claude creates the record as `draft` or `contacted` and opens a preview for you.

**Or yourself (on a computer):**
```bash
npm run new-hotel -- "Exact Hotel Name" --area near-mahakal-temple
```
This creates `data/hotels/exact-hotel-name.json` with status `draft`. Valid areas: `near-mahakal-temple`, `near-ram-ghat`, `near-railway-station`, `freeganj`, `nanakheda`, `dewas-road`.

**Or copy the template:** `data/schema/hotel.template.json` → `data/hotels/<slug>.json`.

---

## 3. Verify a hotel (checklist)

Call or visit the property and confirm **each** of these. Only write down what they confirm.

- [ ] Exact name (as on their signboard / registration)
- [ ] Full address and PIN code; area
- [ ] Phone number: call it. Confirm the WhatsApp number too, if they want WhatsApp enquiries.
- [ ] Property type and budget band (Budget / Mid-range / Premium). No prices.
- [ ] Facilities, only from the list in `data/facilities.json`
- [ ] Whether it suits families (family rooms or extra beds)
- [ ] Map pin (latitude/longitude) or Google Maps place ID, for accurate directions
- [ ] Photos: only your own, or photos the owner gives you **with written permission** (note where that permission is kept)
- [ ] Distances: only if you measured them yourself on a map, with the method noted

Then fill in the verification block:
```json
"verification": {
  "lastVerified": "2026-11-21",
  "method": "phone-call",
  "verifiedBy": "Your name",
  "notes": "Spoke to the manager; all details confirmed."
}
```
`method` is one of `phone-call`, `site-visit`, `owner-submitted-and-confirmed`.

---

## 4. Publish a verified listing

1. Set `"status": "verified"` and complete the verification block.
2. Check the record: `npm run hotels`. The hotel must show **LIVE: YES**, with no ✗ items.
3. Run the checks: `npm run qa`.
4. Open a pull request into `main`. Netlify makes a **preview link**, and Claude sends it with screenshots.
5. After the owner says **"go"**, merge. The hotel appears on hotelsujjain.in within about a minute.

What appears automatically:
- the profile page `/hotels/<slug>/`,
- a card in the matching category and area pages and in `/hotels/`,
- a place in the filters and the sitemap,
- schema.org `Hotel` data using only the confirmed facts.

---

## 5. Update a hotel

- Change only what the property confirmed.
- **Update `lastVerified` only when you have re-checked the details.** Never change the date just to make a listing look fresh.
- If you can't reach the property any more, change the status back to `contacted`. The listing disappears from the site at the next deploy.
- Records last verified more than **180 days** ago are flagged by `npm run hotels` and the build ("re-check!").

**Remove a hotel:** set the status to `draft`, or delete its file. Then open a PR as usual.

---

## 6. Field reference

| Field | Example | Notes |
|---|---|---|
| `slug` | `hotel-shiv-darshan` | Becomes the URL `/hotels/hotel-shiv-darshan/` |
| `name` | `Hotel Shiv Darshan` | Exact trading name |
| `status` | `verified` | `draft` / `contacted` / `verified` |
| `area` | `near-mahakal-temple` | From `data/areas.json` |
| `propertyType` | `hotel` | hotel, resort, guest-house, homestay, dharamshala, lodge |
| `priceBand` | `budget` | budget / mid / premium (never a price) |
| `suitableFor` | `["family"]` | Only if confirmed |
| `facilities` | `["ac", "parking"]` | Slugs from `data/facilities.json` |
| `summary` | Short factual text | Written by us, ≤ 300 characters, never copied |
| `address` | `{ "street", "locality", "postalCode": "456006" }` | Ujjain PIN 4560xx |
| `geo` | `{ "lat": 23.18, "lng": 75.77 }` | From the verified map pin |
| `googlePlaceId` | | Optional; improves directions |
| `distances` | `{ "mahakalTempleKm": 0.6, "method": "Road distance, Google Maps, 21 Nov 2026" }` | Only measured values |
| `contact` | `{ "phone": "+91XXXXXXXXXX", "whatsapp": "+91XXXXXXXXXX" }` | WhatsApp button goes to the hotel's own number |
| `photos` | `[{ "src": "/assets/images/hotels/<slug>/front.jpg", "width": 1600, "height": 1200, "alt": "…", "rights": "own-photo" }]` | Rights required |
| `affiliateLinks` | `[{ "partner": "agoda", "url": "https://www.agoda.com/…" }]` | Shown only if the partner is enabled (below) |
| `listing` | `{ "tier": "featured", "featuredUntil": "2027-03-31" }` | Featured = paid, always labelled |
| `history` | `[{ "date", "status", "note" }]` | Private notes, never published |

---

## 7. Affiliate links

An affiliate button ("Check prices on Agoda ↗", labelled **Partner link**) appears **only when all of these are true**:
1. the partner is `"enabled": true` in `data/affiliates.json`,
2. the link starts with `https://`,
3. the link's domain is in that partner's `hosts` list.

All partners are disabled until you have an approved affiliate account and real tracking links (see `docs/AFFILIATE-PLAN.md`).

## 8. Featured (paid) listings
Set `"listing": { "tier": "featured", "featuredUntil": "YYYY-MM-DD" }`. Featured hotels:
- carry a **Featured · Paid** label,
- appear first in lists and on the homepage "Featured stays" section,
- automatically become normal listings after `featuredUntil`.

## 9. Placeholder records
`data/hotels-placeholder/` holds clearly fake test records (`PLACEHOLDER Hotel A…`, phone `+910000000000`). They appear **only in local design builds**. Netlify builds (the live site and previews) never include them, and the build fails if one slips through.
