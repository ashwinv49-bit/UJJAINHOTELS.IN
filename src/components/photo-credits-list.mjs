import { esc } from './_lib.mjs';

/** Full TASL attribution (Title, Author, Source, Licence) for every photo in data/photos.json. */
export default function photoCreditsList({ data }) {
  const photos = Object.entries(data.photos ?? {});
  if (!photos.length) {
    return '<p>No third-party photographs are currently used on this site.</p>';
  }
  const items = photos
    .map(([key, p]) => {
      const c = p.credit;
      const thumb = `${p.src}-${p.widths[0]}.jpg`;
      const changes = c.modified ? ' Resized, cropped and compressed for the web.' : '';
      return `<li class="credit-item" id="${esc(key)}">
  <img src="${thumb}" alt="" width="96" height="72" loading="lazy" decoding="async">
  <div>
    <h2>${esc(c.title)}</h2>
    <p>By ${esc(c.author)} · <a href="${esc(c.source)}" rel="noopener">Source</a> · Licence: <a href="${esc(c.licenceUrl)}" rel="noopener license">${esc(c.licence)}</a>.${changes}</p>
  </div>
</li>`;
    })
    .join('');
  return `<ul class="credits-list" role="list">${items}</ul>`;
}
