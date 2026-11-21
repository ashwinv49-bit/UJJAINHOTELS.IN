/**
 * Structured data for the homepage. Only facts we can stand behind:
 * the site's name and URL (WebSite) and the publishing organisation's
 * name, URL and logo (Organization). No LodgingBusiness / Hotel / Review
 * markup until real, verified listings exist.
 */
export default function homeSchema({ site }) {
  const base = site.url.replace(/\/$/, '');
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: `${base}/`,
        name: site.domainLabel,
        alternateName: site.name,
        inLanguage: site.lang,
        publisher: { '@id': `${base}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: site.domainLabel,
        url: `${base}/`,
        logo: `${base}/assets/icons/logo-512.png`,
      },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
}
