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

### 6. Build approach and URL structure
- **Recommended:** keep the zero-dependency generator (`scripts/build.mjs`), with collections at `/hotels/<area-or-type>/`, hotels at `/hotels/<hotel-slug>/` and guides at `/guides/<slug>/`.
- Confirm before hotel pages are built, so URLs never need to change.

### 7. Area list and wording
The six areas (Mahakal Temple area, Ram Ghat & Shipra riverfront, Railway Station area, Freeganj, Nanakheda, Dewas Road) and their one-line descriptions are deliberately general. **Please check them with your local knowledge**, especially Freeganj, Nanakheda and Dewas Road, and add or replace areas if needed.

## B. Needed before launch

### 8. Contact and enquiry routing
- WhatsApp **business number** and contact email (`data/site.json → contact`).
- **Recommended:** route all enquiries to your number at first, so you can help travellers and measure demand. Add hotels' own numbers later, for paid featured listings.

### 9. Language
Many visitors, and your existing About page, are Hindi-first.
- **Recommended:** English-first, with Hindi versions of key pages (home, areas, Mahakal guide) using `hreflang`. This needs a Devanagari font (e.g. Noto Sans Devanagari) added to the design system.

### 10. Analytics and consent
- **Recommended:** a cookie-free analytics tool (e.g. Cloudflare Web Analytics, free; or Netlify's analytics add-on), so no consent banner is needed.
- Alternative: Google Analytics 4, which needs a cookie-consent banner and a privacy-policy update.

### 11. Affiliate programmes: plan ready → `docs/AFFILIATE-PLAN.md`
**Recommended:** phase 1 = MakeMyTrip + Goibibo through one Indian network (Cuelinks or vCommission; flat ₹ per booking, INR payouts), plus **Agoda Partners** once real area pages are live. Booking.com (via CJ), OYO and Expedia later. Decisions listed in the plan §8.

### 12. Paid listings and advertising
- Pricing model for **featured listings** (monthly or seasonal), and whether hotels can also pay for leads.
- Confirm the on-page label **"Featured · Paid"** (my recommendation: keep "Paid" visible; it builds trust).

### 13. Verification promise
The homepage says every listing *will show where its details came from and when they were last checked*. The hotel schema supports this (`verification.lastVerified`, `method`). **Confirm you're happy to operate this process**, or I'll soften the wording.

### 14. Legal pages
Privacy policy (DPDP Act 2023), terms of use and the final affiliate disclosure. Need: legal owner or entity name and address. **Recommended:** have a lawyer review them before launch.

### 15. Logo
The temple-spire mark is original working artwork. Keep it, refine it, or supply a professionally designed logo.

### 16. Merging this work
The work is on branch `ccr-db98cbba-h9x0d2`. Say when you'd like a pull request to `main`.
