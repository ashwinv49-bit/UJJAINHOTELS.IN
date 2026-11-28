import { esc, icon } from './_lib.mjs';

/** Prefilled WhatsApp message for hotel owners registering interest. */
export const OWNER_MESSAGE =
  'Namaste! I own a hotel / guest house / dharamshala in Ujjain and would like to register on HotelsUjjain.in. Hotel name: … Area: …';

/**
 * Hotel-owner onboarding call to action (owner's decision, 25 Nov 2026):
 * listings open later; owners register interest on WhatsApp.
 * The WhatsApp button appears only once the business number is set in
 * data/site.json → contact.whatsapp (format 91XXXXXXXXXX). Until then we say
 * registration opens soon — never a broken or placeholder link.
 * Props: learnMore="true" adds a link to /list-your-hotel/.
 */
export default function ownerCta({ site }, props = {}) {
  const number = site.contact?.whatsapp;
  const learnMore = props.learnMore === 'true' ? '<a class="btn btn--ghost" href="/list-your-hotel/">Learn more</a>' : '';
  const main = number
    ? `<a class="btn btn--whatsapp" href="https://wa.me/${esc(number)}?text=${encodeURIComponent(OWNER_MESSAGE)}" rel="noopener" target="_blank" data-owner-whatsapp>${icon('whatsapp')}Register on WhatsApp</a>`
    : `<p class="owner-cta__soon" data-owner-soon>${icon('info')}<span>Registration on WhatsApp opens soon.</span></p>`;
  return `<div class="cluster owner-cta">${main}${learnMore}</div>`;
}
