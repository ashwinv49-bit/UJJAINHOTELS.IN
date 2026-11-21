# Affiliate business model: HotelsUjjain.in

**Status:** plan for approval · researched 21 Nov 2026
**Important:** commission figures below come mostly from third-party listings and conflict with each other. Treat them as ranges and confirm the live rate inside each partner dashboard before relying on it.

---

## 1. How affiliate income works

1. A visitor reads our page (for example *Hotels near Mahakal Temple*) and taps **"Check prices on Agoda ↗"**, a link carrying our partner ID.
2. They book on the partner's site. The partner shows the live price and availability, never us.
3. After the guest **completes the stay**, the partner pays us a commission. Cancelled bookings and no-shows pay nothing.

Key facts:
- **Cookies are short.** Booking.com is described as same-session or about 24 hours, Agoda about 24 hours, and Expedia 7 days (official). If the visitor comes back days later on their own, we usually earn nothing.
- **Payment arrives late.** Money comes after the stay plus a validation period, often 1–3 months after the click.
- **Approval is needed.** Each programme reviews the website before accepting us (see §5).

---

## 2. Which programmes fit Ujjain

Ujjain's visitors are mostly **domestic pilgrims and families** booking **budget and mid-range rooms**. That shapes the choice.

| Programme | How we join | How it pays (reported) | Why it fits | Phase |
|---|---|---|---|---|
| **MakeMyTrip + Goibibo** | Through an Indian affiliate network (Cuelinks, vCommission or INRDeals) | **Flat fee per hotel booking**, reported around ₹120–₹250 domestic (varies by network and month) | The OTAs most Indian domestic travellers already use; INR payouts to an Indian bank | **1** |
| **Agoda** | Direct: partners.agoda.com (website required) | Progressive share of Agoda's margin; third parties report about 4–7% of booking value | Good India hotel coverage, deep links to individual hotels | **1** |
| **OYO** | Indian networks, or OYO's own *OYO Circle* programme | Reported 5–10% (unconfirmed) | Strong in budget rooms in pilgrim towns | 2 |
| **Booking.com** | Now through **CJ Affiliate** (choose your region on Booking.com's affiliate page) | A share (reported 25–40%) of Booking.com's own commission; same-session tracking | International visitors; brand trust | 2 |
| **Expedia / Hotels.com** | Expedia Travel Creator programme | Up to 4% (official), 7-day cookie, paid after completed stays | Backup; international audience | 3 |

**Why start with MakeMyTrip/Goibibo plus Agoda:**
- **Budget rooms favour flat fees.** At a reported flat ₹140 per booking versus about 4%, the flat fee pays more on any room under roughly ₹3,500. Above that, the percentage pays more. *(Example using reported rates, not a forecast.)*
- **Coverage.** One Indian network account gives access to MakeMyTrip, Goibibo and often OYO and Cleartrip together, with INR payouts.
- **Agoda** gives hotel-level deep links and a second inventory source for mid-range and luxury stays.
- Two or three programmes are enough at first. Every extra one means another approval, dashboard and set of links to maintain.

---

## 3. Where affiliate links appear on the site

| Page | Affiliate placement | Needs real hotel data? |
|---|---|---|
| **Area pages** (near Mahakal, Ram Ghat, railway station…) | "Compare live prices for stays in this area" → partner search results for Ujjain | **No**: works before we have verified listings |
| **Category pages** (budget, family, luxury) | Partner search filtered to Ujjain (by price where the partner supports it) | No |
| **Hotel pages** | "Check prices on Agoda ↗" / "MakeMyTrip ↗" deep links to *that* hotel, beside "Ask the hotel on WhatsApp" | Yes (verified listing) |
| **Guides** (Mahakal darshan, Simhastha 2028) | Contextual "where to stay" blocks linking to area pages and partner searches | No |
| **Instagram / WhatsApp sharing** | Short links like `hotelsujjain.in/go/mahakal-area` (see §4) | No |

**Rules on every page (already in the design system):**
- Buttons say **"Check prices on [Partner] ↗"**, never "Book now" and never a price we made up.
- A small **"Partner link"** label sits next to each button, and a disclosure line appears on the page.
- Links carry `rel="sponsored nofollow noopener"`.

---

## 4. Technical plan (for me to build: Task 03a)

1. **`data/affiliates.json`:** one place for partner IDs, on/off switches and URL patterns. Changing an ID updates every link on the site.
2. **Clean redirect links:** `/go/<page-or-hotel>/<partner>` generated into Netlify `_redirects` (302). Benefits:
   - short links you can share on Instagram and WhatsApp,
   - one place to swap a partner if rates change,
   - our page is never cluttered with long tracking URLs.
3. **Sub-IDs:** each link carries a tag such as `area-mahakal` or `hotel-xyz`, so partner dashboards show **which page earned the booking**.
4. **Click counting** (optional, later): a tiny Netlify Function logging clicks per link, so we can compare clicks with bookings.
5. **Hotel schema:** `affiliateLinks` already exists in `data/schema/hotel.schema.json`.
6. **Disclosure page** updated with the partner names once approved.

Partners that are switched off simply render no button, so the site never shows a broken or untracked link.

---

## 5. Getting approved: order matters

Partner programmes check the site before approving. Right now hotelsujjain.in is a **prototype** with sample listings, "coming soon" pages and `noindex`, which **risks rejection**. Booking.com's network is described as requiring published, real content.

**Recommended order:**
1. **Now:** sign up to **one Indian network** (Cuelinks or vCommission). These are usually easier to join. You'll need **PAN, bank account and address**. Compare MakeMyTrip/Goibibo/OYO rates inside the dashboard before choosing.
2. **Me (next):** build the affiliate link system plus real **area pages** and the **"Where to stay in Ujjain"** guide, then remove the prototype bar from pages that are real.
3. **Then:** apply to **Agoda Partners** with real pages live.
4. **Later:** Booking.com (CJ), then Expedia, once traffic exists.

Rules to respect: no domain or brand misuse (Booking.com forbids domains containing its brand names; ours is fine), and **no paid ads bidding on partner brand names**.

---

## 6. Compliance (India)

- **Disclosure (ASCI):** affiliate arrangements count as a material connection and must be **labelled clearly and upfront** ("affiliate", "partner", "ad"). This applies on the site **and on any Instagram post or reel** that shares these links; a platform's built-in label alone may not be enough.
- **Honesty rules (ours):** never show prices or availability we don't have, never invent reviews or ratings, and always label paid placements.
- **Tax:** affiliate commission is business income. Networks ask for PAN and may deduct TDS, and foreign partners (Agoda, Booking.com) pay by international transfer. **Ask a CA** about GST registration and how to account for foreign payouts.

---

## 7. What to expect (honest view)

- **Revenue = visitors × % who click to a partner × % who book × commission per booking.** Each factor starts small. Search traffic takes months to build after indexing is switched on.
- **In a budget-heavy pilgrim town, affiliate income per booking is small** (often ₹100–₹300). It is a good **baseline** but unlikely to be the biggest earner on its own.
- **The hybrid model matters:** paid **featured listings** and **WhatsApp leads** sold to hotels can earn more per visitor locally, while affiliates monetise everyone else.
- **Simhastha 2028 is the big opportunity.** Demand will peak and rooms will sell out. Pages ranking well **during 2027** will capture it, so the content work starts now.

---

## 8. Decisions needed from you

1. **Indian network:** Cuelinks or vCommission? (I suggest opening Cuelinks first; compare rates in its dashboard.)
2. **Agoda:** apply once real area pages and the first guide are live? (Recommended.)
3. **Instagram:** will you share these links on your social accounts? If yes, I'll add short `/go/` links and an ASCI-compliant caption line to the plan.
4. **Button priority on hotel pages:** partner price button first, or WhatsApp-the-hotel first?

---

### Sources (checked 21 Nov 2026; mostly third-party, confirm in dashboards)
- Agoda official FAQ (website required, progressive commission): https://partners.agoda.com/en-us/faq.html
- Agoda rates reported by third parties: https://getlasso.co/affiliate/agoda/ · https://www.cuelinks.com/campaigns/agoda-affiliate-program
- Booking.com affiliate page (register via CJ): https://booking.com/affiliate-program/v2/index.html · https://track360.io/blog/booking-com-affiliate-partner-program-operator-teardown-2026
- MakeMyTrip via Indian networks: https://linkmydeals.com/affiliate-programs/info/makemytrip.com/ · https://www.vcommission.com/blog/publishers/how-to-scale-travel-affiliate-revenue-with-makemytrip-offers/
- Goibibo hotels: https://inrdeals.com/campaigns/goibibo-hotels-affiliate-program · https://www.cuelinks.com/campaigns/goibibo-affiliate-program
- OYO: https://www.cuelinks.com/campaigns/oyo-rooms-affiliate-program · https://earnkaro.com/blog/how-to-earn-money-by-becoming-an-oyo-affiliate/
- Expedia Travel Creator (official): https://partner.expediagroup.com/en-us/solutions/explore-our-affiliate-program · https://help.creator.expediagroup.com/hc/en-us
- ASCI influencer/affiliate disclosure: https://www.ascionline.in/wp-content/uploads/2025/04/Press-Release_Influencer-Guidelines-Update.pdf · https://khaitanco.com/thought-leadership/ASCI-updates-its-Code-for-Self-Regulation-in-Advertising
