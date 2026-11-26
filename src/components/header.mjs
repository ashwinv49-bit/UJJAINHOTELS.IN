import { esc, icon, brandMark } from './_lib.mjs';

const NAV = [
  { label: 'Hotels', href: '/hotels/' },
  { label: 'Areas', href: '/#areas' },
  { label: 'Travel guides', href: '/guides/' },
  { label: 'For hotel owners', href: '/list-your-hotel/' },
  { label: 'About', href: '/about/' },
];

export default function header({ site, page }) {
  const items = NAV.map((item) => {
    const current = item.href === page.path ? ' aria-current="page"' : '';
    return `<li><a class="site-nav__link" href="${item.href}"${current}>${esc(item.label)}</a></li>`;
  }).join('');

  return `<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="brand" href="/" aria-label="${esc(site.domainLabel)} — home">
      ${brandMark()}
      <span class="brand__text"><span class="brand__name">${esc(site.brand)}</span><span class="brand__tagline">${esc(site.tagline)}</span></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle hidden>
      <span class="icon-open">${icon('menu')}</span><span class="icon-close">${icon('close')}</span>
      <span>Menu</span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Main" data-open="false">
      <ul class="site-nav__list" role="list">${items}</ul>
      <a class="btn btn--primary btn--sm site-nav__cta" href="/hotels/">${icon('search')}Find hotels</a>
    </nav>
  </div>
</header>`;
}
