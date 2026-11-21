# CLAUDE.md: HotelsUjjain.in project rules

Read this before doing any work in this repository. These are the owner's standing instructions from the original brief (Task 01). They apply to **every** task, and the owner has asked that they always be followed.

## What we are building
- **HotelsUjjain.in** (brand **HOTELS UJJAIN**, tagline **"Find Your Right Stay."**): a premium, mobile-first **hotel discovery** platform for Ujjain, Madhya Pradesh, India.
- **It is NOT an online travel agency.** Never build payment processing, booking inventory, room availability or reservation management.
- Revenue: hotel **affiliate commissions**, **paid hotel listings** (always labelled), **direct WhatsApp enquiries**, **local advertising**.
- Platform: custom HTML, CSS and JavaScript with a small zero-dependency build (`scripts/build.mjs`). No frameworks without the owner's approval.

## Non-negotiable rules
1. **Never invent** hotel names, prices, ratings, amenities, availability, distances or reviews.
2. Sample content is allowed **only for design prototypes**, and it must be **clearly labelled** (visible "Sample" badges plus a notice).
3. **Never publish fake hotel listings.** Real listings need a verification record (`data/schema/hotel.schema.json → verification`).
4. Never claim live prices or availability are being searched. Say "Check prices on [Partner]" or "Confirm with the hotel".
5. **Never copy competitor websites** (text, layout or assets).
6. **Never use unlicensed photos.** Hotel photos only if they are the owner's own or supplied by the property with written permission; place photos only with a licence and full credit on `/photo-credits/`.
7. **No unnecessary paid APIs or services.**
8. **No irreversible production, DNS or domain changes without the owner's explicit approval.** Ask first and explain the impact.
9. **Don't overwrite or delete existing files without permission.** Back up before modifying existing content.
10. **Stay within the task's scope.** Stop when the requested task is complete; don't build the next phase (e.g. all hotel pages) unless asked.
11. **Label paid placements** ("Featured · Paid") and **disclose affiliate links** (`rel="sponsored nofollow noopener"`, "Partner link" label, ASCI-compliant wording).
12. Use **structured data only when the underlying information is accurate and eligible** (no Review/Rating markup for invented content).

## Design system (summary: full version in `docs/DESIGN-SYSTEM.md`)
- Colours: deep teal `#172E35`, warm gold `#D5A45A`, ivory `#F7F5F0`, white `#FFFFFF`. Gold is never used as text on light backgrounds (use `--gold-700` `#8C6420`).
- Fonts: **Playfair Display** (headings) and **Inter** (body), self-hosted.
- Premium Indian travel feel: clean layouts, generous spacing, readable, accessible. No clutter, no heavy animation, no generic travel-template look.
- Accessibility: WCAG 2.2 AA, touch targets ≥ 44 px, visible focus, works without JavaScript.

## How we work
- **Plan before push (owner's rule):** before anything goes live, write a plan and get the owner's approval. Then share the Netlify **Deploy Preview** link and screenshots, and publish to `main` **only after the owner says "go"**.
- **Development branch:** commit on the working branch, then open a **pull request into `main`** when the owner asks. **`main` is production**: every push to it deploys live via Netlify.
- **Sample content never goes public:** sample hotels render only in local design builds. Every Netlify build (live site and Deploy Previews) hides them (`site.showSamples`, set in `scripts/build.mjs`), and the build fails if sample markup leaks.
- **Before every hand-off:** `npm run qa` (strict build + static QA) and `node scripts/qa-browser.cjs` (layouts, console errors, accessibility).
- **Pre-launch safety:** `data/site.json → "indexing": false` and `"prototype": true` until the owner approves launch. Non-production Netlify builds are always `noindex`.
- Report honestly: say what was verified and what wasn't.
- The owner reads on a phone and prefers short, simple explanations.

## Hosting and domains (current state)
- **Live:** https://hotelsujjain.in, on Netlify project `hotels-ujjain`, auto-deploying from GitHub `main`. Free plan, so Netlify's required badge is shown (see `docs/DEPLOYMENT.md`).
- **DNS:** Netlify DNS (nameservers `dns1–4.p06.nsone.net`); domain registered at GoDaddy.
- **ujjainhotels.in:** the owner's older WordPress site on Hostinger. **Don't touch it without approval** (see `docs/AUDIT.md`).

## Key docs
`docs/AUDIT.md` · `docs/DESIGN-SYSTEM.md` · `docs/DEPLOYMENT.md` · `docs/SEO-CHECKLIST.md` · `docs/DECISIONS.md` (open questions) · `docs/AFFILIATE-PLAN.md`
