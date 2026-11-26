import { esc, brandMark } from './_lib.mjs';

const list = (items) =>
  `<ul role="list">${items.map((i) => `<li><a href="${i.url}">${esc(i.label)}</a></li>`).join('')}</ul>`;

export default function footer({ site, data, year }) {
  const hotels = data.categories.map((c) => ({ label: c.title, url: c.url }));
  const areas = data.areas.map((a) => ({ label: a.title, url: a.url }));
  const company = [
    { label: 'About us', url: '/about/' },
    { label: 'Contact', url: '/contact/' },
    { label: 'Travel guides', url: '/guides/' },
    { label: 'For hotel owners', url: '/list-your-hotel/' },
  ];
  const legal = [
    { label: 'Privacy policy', url: '/privacy-policy/' },
    { label: 'Terms of use', url: '/terms/' },
    { label: 'Affiliate disclosure', url: '/affiliate-disclosure/' },
    { label: 'Photo credits', url: '/photo-credits/' },
  ];

  return `<footer class="site-footer on-dark">
  <div class="container site-footer__top">
    <div class="site-footer__intro">
      <a class="brand brand--light" href="/" aria-label="${esc(site.domainLabel)} — home">
        ${brandMark('light')}
        <span class="brand__text"><span class="brand__name">${esc(site.brand)}</span><span class="brand__tagline">${esc(site.tagline)}</span></span>
      </a>
      <p>A hotel discovery guide built only for Ujjain. We help you compare areas and types of stay, then check hotels on trusted booking sites. We do not take bookings or payments.</p>
    </div>
    <div class="footer-cols">
      <div class="footer-col"><h2>Hotels</h2>${list(hotels)}</div>
      <div class="footer-col"><h2>Areas</h2>${list(areas)}</div>
      <div class="footer-col"><h2>Company</h2>${list(company)}</div>
      <div class="footer-col"><h2>Legal</h2>${list(legal)}</div>
    </div>
  </div>
  <div class="container site-footer__disclosure">
    <p><strong>Affiliate disclosure:</strong> some links on ${esc(site.domainLabel)} are affiliate links. If you book through them we may earn a commission, at no extra cost to you. <a href="/affiliate-disclosure/">Read our full disclosure</a>.</p>
  </div>
  <div class="container site-footer__bottom">
    <p>© ${year} ${esc(site.domainLabel)}. All rights reserved.</p>
    <p>Ujjain, Madhya Pradesh, India</p>
  </div>
</footer>`;
}
