# Outstanding decisions requiring your approval

Each decision lists my recommendation first. Nothing below has been actioned.

## A. Needed before the next task

### 1. Primary domain
The brief names **HotelsUjjain.in**, but the repository and live WordPress site use **ujjainhotels.in**.
- **Recommended:** make **hotelsujjain.in** canonical (it matches the brand and tagline). Once the new site is live, 301-redirect ujjainhotels.in to it page by page. Keep both registered.
- Alternative: build on ujjainhotels.in, which already has SSL and about one month of history. Either way the SEO history to lose is negligible.
- Changing it later is one line: `data/site.json → url`.

### 2. Future of the WordPress site on ujjainhotels.in
It currently takes bookings (VikBooking) and has a refund policy and terms built around payments, which conflicts with the non-OTA model.
- **Recommended:** leave it untouched until the new site launches, then back it up and 301-redirect it (mapping in `DEPLOYMENT.md` §5). In the meantime, consider switching off the VikBooking search so no one tries to book.
- Please confirm you own **both** domains and that the WordPress site is yours to change.

### 3. Hosting: ✅ Netlify, live at https://hotelsujjain.in
GitHub is linked; `main` is the production branch and every push to it deploys automatically. Remaining:
- 🔒 **GitHub default branch → `main`** (GitHub → Settings → General → Default branch). This environment can't change repository settings.
- 🔒 **Revoke the Netlify personal access token** used for the first manual deploys. Continuous deployment doesn't need it.
- **Free-plan badge:** Netlify shows a "Powered by Netlify" badge that can't be hidden on the Free plan, and the CSP is relaxed slightly to let it render. A paid plan removes both trade-offs; this is your call before launch.

### 4. DNS for hotelsujjain.in: ✅ done
Netlify DNS is active (nameservers switched at GoDaddy 21 Nov 2026), HTTPS certificate issued, `www` redirects to the apex.
- ✅ **Email anti-spoofing records added** (approved): SPF `v=spf1 -all` and DMARC `v=DMARC1; p=reject; adkim=s; aspf=s`. **If you later add a mailbox on this domain**, update both to your email provider's values first.
- ✅ **Google Search Console verification TXT record added** (21 Nov 2026). Keep it permanently: Google re-checks it.

### 5. Photography
No licensed photos are in the site yet. Commons downloads were blocked from this cloud environment.
- **Recommended:** your **own photos** of Mahakal Temple, Ram Ghat, the station area and city streets. They're unique, need no attribution, and can be reused on social media. Five or six landscape shots of at least 2000 px wide are enough to start.
- Alternative: the licence-checked Wikimedia Commons shortlist in `assets-src/photos/manifest.json` (CC BY / CC BY-SA). This requires visible credit, and CC BY-SA images keep that licence. Download them from a normal connection, then run `python3 scripts/images.py`.
- Hotel photos: only from the property with written permission.

### 6. Build approach and URL structure: ✅ implemented (Task 02)
- Zero-dependency generator (`scripts/build.mjs`): collections at `/hotels/<area-or-type>/`, hotels at `/hotels/<hotel-slug>/`, guides later at `/guides/<slug>/`.
- "Luxury" renamed **"Premium"** (`/hotels/premium/`; the old `/hotels/luxury/` 301-redirects).
- WhatsApp enquiries go to the **hotel's own number**; only **verified** listings are public. See `docs/HOTELS.md`.
- **Next:** collect and verify the first real hotels.

### 7. Area list and wording
The six areas (Mahakal Temple area, Ram Ghat & Shipra riverfront, Railway Station area, Freeganj, Nanakheda, Dewas Road) and their one-line descriptions are deliberately general. **Please check them with your local knowledge**, especially Freeganj, Nanakheda and Dewas Road, and add or replace areas if needed.

## B. Needed before launch

### 8. Contact and enquiry routing
- ⏸ **Traveller WhatsApp enquiries paused (25 Nov 2026, #21).** Your WhatsApp number is now needed only for the **hotel-owner registration** button.
- WhatsApp **business number** and contact email (`data/site.json → contact`).
- **Recommended:** route all enquiries to your number at first, so you can help travellers and measure demand. Add hotels' own numbers later, for paid featured listings.

### 9. Language
Many visitors, and your existing About page, are Hindi-first.
- **Recommended:** English-first, with Hindi versions of key pages (home, areas, Mahakal guide) using `hreflang`. This needs a Devanagari font (e.g. Noto Sans Devanagari) added to the design system.

### 10. Analytics and consent
- **Recommended:** a cookie-free analytics tool (e.g. Cloudflare Web Analytics, free; or Netlify's analytics add-on), so no consent banner is needed.
- Alternative: Google Analytics 4, which needs a cookie-consent banner and a privacy-policy update.
- **New (22 Nov):** with affiliate-first (decision 17), we'll want to count clicks on partner buttons. GA4 can do this but needs consent; cookie-free tools generally can't report clicks per partner. Partner dashboards (with sub-IDs) report bookings either way. See `docs/SEO-AUDIT.md` T18.

### 11. Affiliate programmes: plan ready → `docs/AFFILIATE-PLAN.md`
**Recommended:** phase 1 = MakeMyTrip + Goibibo through one Indian network (Cuelinks or vCommission; flat ₹ per booking, INR payouts), plus **Agoda Partners** once real area pages are live. Booking.com (via CJ), OYO and Expedia later. Decisions listed in the plan §8.
- ✅ **Joined Cuelinks (22 Nov 2026).** Area booking links researched → `docs/AFFILIATE-LINKS.md`.
- ⚠️ Cuelinks' campaign pages say **"Deeplink: No"** for MakeMyTrip Hotels, Goibibo and Agoda. **Pending:** check in your dashboard or with Cuelinks support whether links to area pages (e.g. "near Ram Ghat") are paid, and send me one generated test link.
- **25 Nov:** trying **EarnKaro** (Goibibo deep links: Yes) and **INRDeals** (MakeMyTrip Domestic Hotels deep links: Yes). Full table → `docs/AFFILIATE-LINKS.md` §0.

### 12. Paid listings and advertising
⏸ **Paused (25 Nov 2026, #21).** Revisit when hotel listings restart.
- Pricing model for **featured listings** (monthly or seasonal), and whether hotels can also pay for leads.
- Confirm the on-page label **"Featured · Paid"** (my recommendation: keep "Paid" visible; it builds trust).

### 13. Verification promise
⏸ **Paused with hotel listings (25 Nov 2026, #21).** The homepage no longer makes this promise.
Previously: the homepage said every listing *will show where its details came from and when they were last checked*. The hotel schema supports this (`verification.lastVerified`, `method`). **Confirm you're happy to operate this process**, or I'll soften the wording.

### 14. Legal pages
Privacy policy (DPDP Act 2023), terms of use and the final affiliate disclosure. Need: legal owner or entity name and address. **Recommended:** have a lawyer review them before launch.

### 15. Logo
The temple-spire mark is original working artwork. Keep it, refine it, or supply a professionally designed logo.

### 16. Merging this work
The work is on branch `ccr-db98cbba-h9x0d2`. Say when you'd like a pull request to `main`.

## C. SEO (from `docs/SEO-AUDIT.md` v2, 22 Nov 2026)

### 17. Decided by you (22 Nov 2026): ✅
- **`/hotels/` owns "Hotels in Ujjain".** The homepage becomes the welcome/discovery page and links to `/hotels/`.
- **Affiliate-first.** On hotel cards and profiles, the partner booking button comes first and Call/WhatsApp the hotel second. Where a hotel has no valid partner link, Call/WhatsApp stays the main button.
- Both are **future site changes**, each with its own plan → preview → "go". Nothing has been built yet.

### 18. "Premium" page vs "luxury" searches (audit C11)
People search "luxury hotels in Ujjain" (720) and "4-star hotels in Ujjain" (1,600) (OpenSEO, India, directional).
- **Recommended:** keep the `/hotels/premium/` address but title the page **"Luxury & Premium Hotels in Ujjain"**. Mention 4-star only where the star category is confirmed.

### 19. URL style (audit C12)
OpenSEO suggests flat addresses like `/hotels-in-ujjain/` and `/hotels-near-mahakal/`.
- **Recommended:** keep the current `/hotels/near-mahakal-temple/`-style addresses. They're built and tested, they already contain the keywords, and keywords in addresses matter little.
- Nothing is indexed yet, so switching now would still be cheap if you prefer.

### 20. Connect Search Console to OpenSEO: ✅ done
Connected (checked 23 Nov 2026). It shows 0 searches so far, as expected while the site is hidden from Google before launch.

## D. Business model (25 Nov 2026)

### 21. Affiliate-only phase: ✅ decided by you
- **Now:** income is affiliate links only. Visitors choose an area here, then go to booking sites through labelled partner links.
- **Hotel owners:** a "For hotel owners" page with a **Register on WhatsApp** button. Listings open later; registering is free and promises nothing.
- **Paused** until you restart them: hotel listings, paid "Featured" placements, traveller WhatsApp enquiries, advertising (#8, #12, #13).
- The hotel-listing code stays in place, dormant. It shows nothing until verified hotels are added again.
- **Your to-dos:**
  1. Send your WhatsApp business number (it will be public on the site).
  2. Send tracked area links (EarnKaro → Goibibo; INRDeals → MakeMyTrip). Partner buttons switch on only with your tracked links.

### 22. Digital PDF products: decision pending
Research summary is in the plan of 25 Nov (also `docs/AFFILIATE-LINKS.md` §6). **Recommended first product:** a "Mahakal darshan & Bhasma Aarti planner" built only from official sources and checked by you, sold through a hosted checkout (Topmate or Instamojo; we never process payments ourselves). **You decide:** product, platform and price. Then I prepare a separate plan.
