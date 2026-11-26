/**
 * Partner (affiliate) booking links for area and category pages.
 *
 * Source: data/affiliate-areas.json — each booking partner's own page for an
 * Ujjain area, researched and dated. A link is shown ONLY when the owner has
 * added a tracking link (`trackedUrl`, generated in an affiliate network such
 * as EarnKaro or INRDeals) AND it passes the same safety check as hotel
 * affiliate links (scripts/lib/hotels.mjs → affiliateProblem): the partner is
 * enabled in data/affiliates.json, the link is https, and its host is listed
 * in that partner's `hosts`. Untracked research URLs are never shown.
 *
 * Owner's business model (25 Nov 2026): affiliate links are the income.
 */
import { affiliateProblem } from './hotels.mjs';

/** The research entry for a collection page: an area or category slug, or 'all' for /hotels/. */
function entryFor(slug, research) {
  if (slug === 'all') return research.categories?.all ?? {};
  return research.areas?.[slug] ?? research.categories?.[slug] ?? null;
}

/**
 * Returns [{ partner, name, url, scope: 'area' | 'city', subid }] in the
 * partner order of data/affiliates.json. For each partner, the area page is
 * used when it has a valid tracked link; otherwise the partner's Ujjain city
 * page (cityFallback), when that has one.
 */
export function partnerLinksFor(slug, data) {
  const research = data.affiliateAreas;
  const affiliates = data.affiliates;
  if (!research || !affiliates?.partners) return [];
  const entry = entryFor(slug, research);
  if (!entry) return [];

  const ok = (partner, trackedUrl) =>
    typeof trackedUrl === 'string' && trackedUrl !== '' && affiliateProblem({ partner, url: trackedUrl }, affiliates) === null;

  const out = [];
  for (const [partner, cfg] of Object.entries(affiliates.partners)) {
    const area = entry.links?.[partner];
    if (area?.url && ok(partner, area.trackedUrl)) {
      out.push({ partner, name: cfg.name, url: area.trackedUrl, scope: 'area', subid: entry.subid ?? null });
      continue;
    }
    const city = research.cityFallback?.[partner];
    if (city?.url && ok(partner, city.trackedUrl)) {
      out.push({ partner, name: cfg.name, url: city.trackedUrl, scope: 'city', subid: entry.subid ?? null });
    }
  }
  return out;
}

/**
 * Problems with tracked links that will NOT be shown (for build notices), so a
 * pasted link with a typo or an unlisted host doesn't fail silently.
 */
export function partnerLinkProblems(data) {
  const research = data.affiliateAreas;
  const affiliates = data.affiliates;
  if (!research || !affiliates) return [];
  const problems = [];
  const check = (where, partner, link) => {
    if (!link?.trackedUrl) return;
    const reason = affiliateProblem({ partner, url: link.trackedUrl }, affiliates);
    if (reason) problems.push(`data/affiliate-areas.json ${where} ${partner}: tracked link not shown — ${reason}`);
  };
  for (const [slug, e] of Object.entries({ ...(research.areas ?? {}), ...(research.categories ?? {}) }))
    for (const [partner, link] of Object.entries(e.links ?? {})) check(slug, partner, link);
  for (const [partner, link] of Object.entries(research.cityFallback ?? {})) check('cityFallback', partner, link);
  return problems;
}
