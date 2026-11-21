# HOTELS UJJAIN — design system

**Find Your Right Stay.** A premium, calm, trustworthy Indian travel-discovery look: deep teal and warm gold on ivory, generous space, editorial serif headlines and a clean sans for everything you read.

Source of truth: `src/assets/css/_tokens.css`. Everything below maps to a CSS custom property.

---

## 1. Colour

### Brand palette (fixed)

| Token | Hex | Use |
|---|---|---|
| `--brand-teal` | `#172E35` | Primary text, dark surfaces, primary dark buttons |
| `--brand-gold` | `#D5A45A` | Accent fills, highlights on dark backgrounds, primary CTA fill |
| `--brand-ivory` | `#F7F5F0` | Page background, text on dark |
| `--brand-white` | `#FFFFFF` | Cards, search panel, form fields |

### Extended scales

| Token | Hex | Role |
|---|---|---|
| `--teal-950` | `#0F2025` | Footer, deepest surfaces |
| `--teal-800` | `#1E3B43` | Hover on dark buttons |
| `--teal-700` | `#2A505B` | Links in long text |
| `--gold-700` | `#8C6420` | **Gold text on light backgrounds** (eyebrows, area labels, icons) |
| `--gold-800` | `#7A5718` | Small text on gold-tinted notices |
| `--gold-200` / `--gold-100` | `#EBD3A8` / `#F5EAD6` | Tints: notices, icon discs, owner CTA band |
| `--ivory-200` | `#EFEBE2` | Alternate section background |
| `--sand-300` | `#E3DDD0` | Hairlines and card borders (decorative only) |
| `--slate-500` | `#4A5F65` | Muted body text |
| `--slate-400` | `#6F8285` | Form-field borders |
| `--color-whatsapp` | `#116B42` | WhatsApp enquiry buttons |

### Contrast rules (WCAG 2.2 AA, measured)

| Pairing | Ratio | Allowed for |
|---|---|---|
| Teal on ivory / white | 13.0 / 14.2 : 1 | All text |
| Gold `#D5A45A` on teal | 6.3 : 1 | All text on dark |
| Teal on gold (primary button) | 6.3 : 1 | Button labels |
| Gold-700 on ivory / white | 4.9 / 5.3 : 1 | Text on light |
| Slate-500 on ivory | 6.2 : 1 | Muted text |
| Ivory on WhatsApp green | 6.0 : 1 | Button labels |
| Slate-400 border on white | 4.0 : 1 | Form controls (≥ 3 : 1 non-text) |
| ⚠ **Gold `#D5A45A` on ivory** | **2.1 : 1** | **Never for text.** Decoration and fills only |

---

## 2. Typography

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display / headings (h1–h3) | **Playfair Display** | 600 (italic 500 for accent words) | `text-wrap: balance`, tracking −0.012em |
| Body, UI, labels | **Inter** | 400–750 | Metric-matched fallback avoids layout shift |

Both are self-hosted variable WOFF2 files (Latin subset, ~48 KB + ~38 KB), preloaded, with `font-display: swap`. Licence: SIL OFL 1.1 (files in `src/assets/fonts/`). No Google Fonts request, so there's no third-party call and no privacy issue.

### Fluid type scale (360 px → 1280 px viewport)

| Token | Size | Use |
|---|---|---|
| `--step-4` | 34 → 52 px | Hero / page H1 |
| `--step-3` | 28 → 36 px | Section H2 |
| `--step-2` | 22 → 26 px | Card titles |
| `--step-1` | 18 → 20 px | Lede, section intros |
| `--step-0` | 16 → 17 px | Body (line-height 1.65) |
| `--step--1` | 13 → 14 px | Meta, chips, notes |

**Eyebrow label:** Inter 650, 13–14 px, uppercase, tracking 0.14em, gold-700 with a short gold rule. Use one per section, above the H2.

---

## 3. Space, shape, depth

- **Spacing scale (4 px base):** `--space-1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 24 · `6` 32 · `7` 48 · `8` 64 · `9` 96 px
- **Section rhythm:** `--section-space` 56 → 104 px vertical padding
- **Container:** 1200 px max; gutter 16 px (phone) → 32 px (desktop)
- **Radii:** `--radius-sm` 6 · `--radius-md` 12 (inputs) · `--radius-lg` 20 (cards, panels) · pill (buttons, chips)
- **Shadows:** teal-tinted and soft. `--shadow-md` for card hover, `--shadow-lg` for the floating search panel.

---

## 4. Layout and breakpoints

Mobile-first. Two breakpoints, plus the navigation switch:

| Width | Behaviour |
|---|---|
| < 720 px | Single column; category cards become compact rows; hotel and guide cards become a swipeable rail |
| ≥ 720 px | Two-column grids; search fields sit in one row |
| ≥ 960 px | Full desktop navigation (hamburger hidden) |
| ≥ 1080 px | Five category columns; three hotel/guide columns; editorial area grid |

---

## 5. Components

| Component | Source | Notes |
|---|---|---|
| Header + navigation | `components/header.mjs` | Sticky; collapsible on mobile (`aria-expanded`, Escape closes); visible without JS |
| Prototype bar | `components/prototype-bar.mjs` | Shown while `site.prototype` is true |
| Search panel | `components/search-form.mjs` | Area + type of stay; routes to collection pages; honest note about prices |
| Category card | `components/category-grid.mjs` | Gold icon disc, serif title, whole card clickable |
| **Hotel card** | `components/featured-hotels.mjs → hotelCard()` | Reusable; badges for **Sample** and **Featured · Paid**; WhatsApp + details actions; "No live prices shown" |
| Area card / tile | `components/area-grid.mjs` | Photo card when a licensed photo exists, compact tile otherwise |
| Guide card | `components/guide-grid.mjs` | Photo or patterned placeholder; "Coming soon" badge |
| Buttons | `.btn--primary` (gold), `.btn--dark`, `.btn--ghost`, `.btn--ghost-light`, `.btn--whatsapp`, `.btn--sm` | Min height 44–48 px |
| Badges & chips | `.badge--sample`, `.badge--featured`, `.badge--soft`, `.chip` | |
| Notice | `.notice` | Gold-tint informational note |
| Photo credit | `photoCredit()` | On-image attribution linked to `/photo-credits/` |
| Footer | `components/footer.mjs` | Category/area/company/legal links and an affiliate disclosure statement |

**Icons:** an original 24 px line set (1.6 px stroke, round caps), shipped as one inline SVG sprite. Brand mark: an original temple spire over ghat steps, in gold on a teal tile.

---

## 6. Imagery

- **Hero and places:** real photographs of Ujjain only. Use your own, or openly licensed photos with full credit.
- **Hotels:** only photos that are your own or supplied by the property with written permission. Never copy photos from OTAs, Google Maps or competitors.
- **No photo yet?** Use the patterned teal/gold placeholder ("Photo coming soon"), never a stock photo that could be mistaken for the hotel.
- **Delivery:** AVIF → WebP → JPEG via `<picture>`, widths 480–2000, explicit `width`/`height`, `loading="lazy"` except the hero (`fetchpriority="high"`). Pipeline: `scripts/images.py`.

---

## 7. Content and honesty rules (part of the design)

1. Never invent hotel names, prices, ratings, amenities, availability or reviews.
2. Sample content always carries a visible **Sample** badge and a section notice, and appears **only in local design builds**. On every Netlify URL (the live site and Deploy Previews), the featured section shows a "Hotel listings coming soon" card instead.
3. Paid placements are always labelled **Featured · Paid**. Affiliate links use `rel="sponsored noopener"` and a disclosure.
4. Never imply live availability or price search. Say "Price on enquiry" or "Confirm with the hotel".
5. Write plainly and warmly, for pilgrims, families and first-time visitors. Short sentences; Indian English spelling.

---

## 8. Accessibility and motion

- Skip link; visible 3 px gold focus ring; one H1 per page; no skipped heading levels.
- All controls have labels; decorative icons are `aria-hidden`; touch targets ≥ 44 px.
- Motion is limited to small hovers (≤ 180 ms) and is switched off under `prefers-reduced-motion`.
- Verified with axe-core (WCAG 2.2 A/AA): **0 violations** at 360, 768 and 1440 px.
