import { esc, icon, picture, photoCredit } from './_lib.mjs';

export default function guideGrid({ data }) {
  const photos = data.photos ?? {};
  const items = data.guides
    .map((g) => {
      const photo = photos[g.photo];
      return `<li><article class="card card--interactive guide-card">
  <div class="media guide-card__media">${photo ? picture(photo, { sizes: '(min-width: 1080px) 380px, (min-width: 720px) 45vw, 100vw' }) : `<div class="placeholder-art placeholder-art--deep"><span class="placeholder-art__label">${icon('book')}</span></div>`}${photoCredit(photo, g.photo)}</div>
  <div class="guide-card__body">
    <p class="guide-card__label"><span>${esc(g.label)}</span><span class="badge badge--soft">Coming soon</span></p>
    <h3 class="guide-card__title"><a class="card__link" href="${g.url}">${esc(g.title)}</a></h3>
    <p class="guide-card__summary">${esc(g.summary)}</p>
    <span class="link-arrow guide-card__more" aria-hidden="true">Read the guide ${icon('arrow-right')}</span>
  </div>
</article></li>`;
    })
    .join('');
  return `<ul class="card-grid card-grid--rail" role="list">${items}</ul>`;
}
