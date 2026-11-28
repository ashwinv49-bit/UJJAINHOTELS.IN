# Area booking links — research results

**Checked:** 22 November 2026 · **Data:** `data/affiliate-areas.json` · **Website:** not changed (all partners still switched off)

## 0. Update 25 Nov 2026: where deep links work

A deep link goes straight to an area page (e.g. "Hotels near Ram Ghat"). This table comes from each network's or partner's own pages, found via search. **Confirm in each dashboard.**

| Booking site | Deep links ✅ via | Terms shown | Not via |
|---|---|---|---|
| **Goibibo** | **EarnKaro** | ₹120 per booking above ₹1,000 · 30-day cookie · web only | Cuelinks |
| **MakeMyTrip** | **INRDeals** ("MakeMyTrip (Domestic Hotels)") | up to ₹180 · 30-day cookie · no app traffic | Cuelinks, EarnKaro (vCommission unclear) |
| Cleartrip | EarnKaro | up to 4.5% hotels | — |
| EaseMyTrip | EarnKaro | 3.4% | — |
| Trip.com | Direct programme ("Custom Link", any page) | 30-day cookie | — |
| Expedia / Hotels.com | Travel Creator (any page) | 7-day cookie | — |
| Agoda | unclear: Agoda Partners text links go to the city or a hotel | ~4–5% | Cuelinks, EarnKaro |
| Booking.com | unclear: now only via CJ (Booking approves) | — | — |

**Plan:**
1. EarnKaro → Goibibo for Ram Ghat, Station, Freeganj and Dewas Road.
2. INRDeals → MakeMyTrip for Ram Ghat, Mahakal Lok, Nanakheda and Dewas Road.
3. Agoda, Booking.com and Trip.com later, once the site has real content.

**How the website uses your links:**
1. Paste the tracking link into `trackedUrl` for that area in `data/affiliate-areas.json`.
2. Add the network's link domain to that partner's `hosts` in `data/affiliates.json`.
3. Switch the partner on.

The site then shows a labelled "Check prices on Goibibo ↗ · Partner link" button on that area's page. Each change gets a preview and your "go" first.

## The short version (22 Nov)
1. **Every area has a matching page on at least one booking site.** Example: MakeMyTrip and Goibibo both have a "Hotels near Ram Ghat" page.
2. **⚠️ Cuelinks says "Deeplink: No"** for MakeMyTrip Hotels, Goibibo and Agoda (read directly on Cuelinks' campaign pages, 22 Nov 2026). This means Cuelinks may **only pay for links to the partner's main page**, not to an area page like "near Ram Ghat".
3. **Please check this in your Cuelinks dashboard** (or ask Cuelinks support, message below) before we build any buttons.

---

## 1. Cuelinks rules (from Cuelinks' own campaign pages)

| Campaign | Deep links | Cookie | Shown payout | Social media | Notes |
|---|---|---|---|---|---|
| **MakeMyTrip (Hotels)** | **No** | 30 days | up to ₹135 / sale | Allowed | India only; new **and** repeat users paid; no minimum booking stated |
| **Goibibo (Hotels)** | **No** | 30 days | up to ₹252 / sale | **Not allowed** | No brand bidding / PPC / Meta ads |
| **Agoda** (via Cuelinks) | **No** ("Deeplinking – Forbidden") | **1 day** | up to 5.4% | Allowed | Page contradicts itself on text links |
| **OYO** (via Cuelinks) | — | — | — | — | **Paused by OYO** |

Other points:
- "Payout up to" is Cuelinks' headline figure; real rates show after login.
- Payments come after validation, roughly **2–5 months** after the booking.
- **Instagram:** Goibibo links are **not allowed on social media**. MakeMyTrip links are allowed (with an "Ad / Affiliate" label, per ASCI).

---

## 2. Area pages on each booking site

✅ = we opened it and the title matches · 🔎 = found in Google search; the site blocks automated checks, so **please test it on your phone** · ❌ = doesn't exist · — = none found (use the site's main Ujjain page)

| Area | MakeMyTrip | Goibibo | Agoda | Booking.com |
|---|---|---|---|---|
| **Mahakal Mandir** | 🔎 [Near Mahakal Lok](https://www.makemytrip.com/hotels/ujjain-hotels-near-mahakal_lok.html) | 🔎 [Budget near Mahakal](https://www.goibibo.com/hotels/budget-hotels-near-mahakal-temple_ujjain-lc/) (budget only) | 🔎 [Near Mahakaleshwar](https://www.agoda.com/en-in/hotels-near-mahakaleshwar-temple/attractions/ujjain-in.html) | ✅ [Near Mahakaleshwar](https://www.booking.com/landmark/in/mahakaleshwar-jyotirlinga.html) |
| **Ram Ghat** | 🔎 [Near Ram Ghat](https://www.makemytrip.com/hotels/ujjain-hotels-near-ram_ghat.html) | 🔎 [Near Ram Ghat](https://www.goibibo.com/hotels/hotels-in-ujjain/near-ram-ghat-lh/) | ❌ | ❌ |
| **Railway Station** | — | 🔎 [Near Ujjain Junction](https://www.goibibo.com/hotels/hotels-in-ujjain/near-ujjain-junction-railway-station-lh/) | 🔎 [Near Railway Station](https://www.agoda.com/en-in/hotels-near-ujjain-railway-station/attractions/ujjain-in.html) | ✅ [Near Ujjain Junction](https://www.booking.com/landmark/in/ujjain-junction-station.html) |
| **Freeganj** | — | 🔎 [Near Free Ganj](https://www.goibibo.com/hotels/hotels-in-ujjain/near-free-ganj-lh/) | ❌ | — |
| **Nanakheda** | 🔎 [In Nanakheda](https://www.makemytrip.com/hotels/hotels-in-nanakheda-ujjain.html) | 🔎 [Budget near bus stand](https://www.goibibo.com/hotels/budget-hotels-near-nana-kheda-bus-stand_ujjain-lc/) (budget only) | 🔎 [Nanakheda](https://www.agoda.com/en-in/nanakheda/maps/ujjain-in.html) | — |
| **Dewas Road** | 🔎 [In Dewas Road](https://www.makemytrip.com/hotels/hotels-in-dewas_road-ujjain.html) (very few hotels) | 🔎 [In Dewas Road](https://www.goibibo.com/hotels/hotels-in-ujjain/dewas-road-ah/) | — | — |
| **All Ujjain** | 🔎 [Ujjain hotels](https://www.makemytrip.com/hotels/ujjain-hotels.html) | 🔎 [Ujjain hotels](https://www.goibibo.com/hotels/hotels-in-ujjain-ct/) | 🔎 [Ujjain](https://www.agoda.com/en-in/city/ujjain-in.html) | ✅ [Ujjain](https://www.booking.com/city/in/ujjain.html) |

**Categories (Booking.com, all ✅):**
- [Budget](https://www.booking.com/budget/city/in/ujjain.html)
- [Family](https://www.booking.com/family/city/in/ujjain.html)
- [Luxury](https://www.booking.com/luxury/city/in/ujjain.html) / [4-star](https://www.booking.com/fourstars/city/in/ujjain.html)
- Agoda budget: 🔎 [Budget hotels](https://www.agoda.com/en-in/theme/cheap-hotels/city/ujjain-in.html)

**Best match per area:**
- **Mahakal:** Booking.com or Agoda
- **Ram Ghat:** MakeMyTrip or Goibibo
- **Station:** Goibibo, Booking.com or Agoda
- **Freeganj:** Goibibo
- **Nanakheda:** MakeMyTrip or Agoda
- **Dewas Road:** Goibibo

Each area also has a **sub-ID** ready (e.g. `area-near-ram-ghat`). Cuelinks allows up to 5 sub-IDs, so its reports will show which area page earned a booking.

---

## 3. Your to-do list

1. **Cuelinks dashboard:**
   - Open the **MakeMyTrip (Hotels)** and **Goibibo** campaigns, apply if needed, and read "Deeplink" and "Important information" (your logged-in view may differ from the public page).
   - Note the real payout per domestic hotel booking.
2. **Test one link:**
   - In Cuelinks "Generate Link", paste the **MakeMyTrip Ram Ghat** link above.
   - Open the result on your phone. Does it land on the Ram Ghat page, or the MakeMyTrip home page?
   - Send me the generated link. It's a public tracking link, not a password.
3. **Ask Cuelinks support** (copy-paste):
   > "I run hotelsujjain.in, a hotel guide for Ujjain. If I create a tracking link to `https://www.makemytrip.com/hotels/ujjain-hotels-near-ram_ghat.html` (or the Goibibo Ram Ghat page), will bookings made after that click be tracked and paid, given the campaign says Deeplink: No?"
4. **Phone test:** tap each 🔎 link above and tell me any that don't open the right area.

## 4. What I recommend next
- **If Cuelinks says area links are paid:** I add "See hotels near Ram Ghat on MakeMyTrip ↗ · Partner link" buttons to each area page. This is a separate plan → preview → your "go".
- **If not:**
  - **Now:** Cuelinks buttons go to the partner's **main Ujjain page**. They still earn if the visitor books within the 30-day cookie.
  - **Later:** join **Booking.com (via CJ)** and **Agoda Partners (direct)** once the site has real content, and use their area pages (Mahakal, Station, Nanakheda).
- Either way: we never show prices, never say "Book now", and label every button "Partner link".

## 5. Still unknown
- Whether Cuelinks tracks area links despite "Deeplink: No" (your test and support will answer this).
- Your real payout rates (visible after login).
- Whether Agoda's or Booking.com's direct programmes allow area links (confirm at signup).
- Whether MakeMyTrip, Goibibo and Agoda pages open correctly for you (they block our checks).

## 6. Digital PDF products: research (25 Nov 2026, decision pending)

- **Demand:** a 50-page "Bhasma Aarti booking guide" PDF is already sold on Topmate, and many free blog guides exist. A paid guide must be clearly better: accurate, dated, from official sources.
- **Product ideas** (original; facts only from official sources such as the temple portal and MP Tourism, dated, checked by you):
  1. Mahakal darshan & Bhasma Aarti planner.
  2. Ujjain 1–2 day itinerary + where to stay by area.
  3. Simhastha 2028 stay planner, only once official arrangements are published.
- **Where to sell.** We never process payments ourselves; the site links to a hosted checkout. Fees are as reported by third-party comparisons; check the pricing pages.

| Platform | Reported fee | UPI | Note |
|---|---|---|---|
| **Topmate** | ~7–10% + GST | ✅ | No monthly fee; instant download |
| **Instamojo** | 2%+₹3 to 10%+₹3 by plan | ✅ | Payment links |
| Razorpay Payment Pages | 2% + GST | ✅ | PDF auto-delivery unconfirmed |
| Payhip | 5% (free plan) | — | Foreign buyers |
| Gumroad | 10% + $0.50 | — | Costly for ₹ prices |

- **Tax:** ask a CA about GST and income tax on digital sales.

## 7. Which booking apps people use (research, 28 Nov 2026)

**India overall** (directional; consultancy guides, Similarweb snapshots, company reports):
- **MakeMyTrip + Goibibo (one company)** lead online hotel bookings, with estimates of 55–60% or more (not audited).
- **Booking.com** is a clear #2 and very strong on Google. **Agoda** is growing. **OYO** is big in budget rooms.
- **Android usage rank** (Similarweb, India travel apps, 9 Nov): MakeMyTrip #9 · Booking.com #21 · OYO #22 · ixigo #31 · Cleartrip #45.
- **Pilgrim trips** (MakeMyTrip, FY25): stays up 19%, and about **2 in 3 booked within a week of travel**.

**Ujjain: Google searches "brand + Ujjain"** (OpenSEO, India, monthly, directional):

| Search | Per month |
|---|---|
| airbnb ujjain | 2,900 |
| oyo ujjain (+ "oyo hotels in ujjain" 390) | 1,000 |
| booking.com ujjain | 590 |
| agoda ujjain | 480 |
| treebo ujjain | 260 |
| goibibo ujjain | 110 |
| makemytrip ujjain | 50 |
| mp tourism ujjain hotel booking | 20 |

**Caveats:**
- MakeMyTrip/Goibibo users mostly search **inside the app**, so Google undercounts them.
- Our visitors come **from Google**, and among them OYO, Booking.com and Agoda are strong.

**Affiliate availability:**
- **Airbnb:** public programme **ended in 2021**; Airbnb's help page says "select partners only". **Skip.**
- **OYO:** EarnKaro reports **10% per booking**, status unconfirmed (Cuelinks OYO paused).
- **Treebo:** not researched.

**Partner priority:**
1. Goibibo (EarnKaro, now)
2. MakeMyTrip (INRDeals)
3. OYO (EarnKaro, if active and "Make Link" accepts an OYO Ujjain page)
4. Booking.com (CJ) + Agoda, once the site has real content
5. No Airbnb

**⚠️ App test:** EarnKaro tracks Goibibo on **web/mobile web only**. Tap the Ram Ghat profit link on your phone and note whether it opens the browser or the Goibibo app. An app booking might not be paid; check EarnKaro reports after a test.

## Sources (22 Nov 2026)
- Cuelinks campaign pages: [MakeMyTrip (Hotels)](https://www.cuelinks.com/campaigns/makemytrip-homestays-affiliate-program) · [Goibibo](https://www.cuelinks.com/campaigns/goibibo-affiliate-program) · [Agoda](https://www.cuelinks.com/campaigns/agoda-affiliate-program) · [OYO](https://www.cuelinks.com/campaigns/oyo-rooms-affiliate-program)
- Partner pages: the links in the table (found via web search and an OpenSEO Google check, India, 22 Nov 2026; about 20 OpenSEO credits used)
- Agoda text links (older help article): https://affiliates.support.agoda.com/kb/s/article/How-to-create-a-Text-Link
