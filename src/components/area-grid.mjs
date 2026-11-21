import { esc, icon, picture, photoCredit } from './_lib.mjs';

const chips = (list) =>
  `<ul class="chip-list" role="list" aria-label="Good for">${list.map((g) => `<li class="chip">${esc(g)}</li>`).join('')}</ul>`;

export default function areaGrid({ data }) {
  const photos = data.photos ?? {};
  const withPhoto = data.areas.filter((a) => a.photo && photos[a.photo]);
  const without = data.areas.filter((a) => !(a.photo && photos[a.photo]));

  const cards = withPhoto
    .map(
      (a, i) => `<li><article class="card area-card">
  <div class="media">${picture(photos[a.photo], {
    sizes: i === 0 ? '(min-width: 1080px) 40vw, (min-width: 720px) 90vw, 100vw' : '(min-width: 1080px) 28vw, (min-width: 720px) 45vw, 100vw',
  })}</div>
  ${photoCredit(photos[a.photo], a.photo)}
  <div class="area-card__body">
    <h3 class="area-card__title"><a class="card__link" href="${a.url}">${esc(a.title)}</a></h3>
    <p class="area-card__summary">${esc(a.summary)}</p>
    ${chips(a.goodFor)}
  </div>
</article></li>`
    )
    .join('');

  const tiles = without
    .map(
      (a) => `<li><article class="card card--interactive area-tile">
  <span class="area-tile__icon">${icon('pin')}</span>
  <div>
    <h3 class="area-tile__title"><a class="card__link" href="${a.url}">${esc(a.title)}</a></h3>
    <p class="area-tile__summary">${esc(a.summary)}</p>
    ${chips(a.goodFor)}
  </div>
</article></li>`
    )
    .join('');

  return `${cards ? `<ul class="area-grid area-grid--photos" role="list">${cards}</ul>` : ''}
${tiles ? `<ul class="area-grid area-grid--tiles" role="list">${tiles}</ul>` : ''}`;
}
