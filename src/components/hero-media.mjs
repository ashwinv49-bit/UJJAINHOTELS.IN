import { picture, photoCredit } from './_lib.mjs';

/**
 * Hero background. Uses the photo keyed "hero" in data/photos.json when present;
 * otherwise an original line-art illustration (temple spires over the Shipra ghats),
 * so the page never depends on a third-party photo.
 */
export default function heroMedia({ data }) {
  const photo = data.photos?.hero;
  if (photo) {
    return `<div class="hero__media">${picture(photo, { sizes: '100vw', priority: true, alt: photo.alt })}</div>
${photoCredit(photo, 'hero')}`;
  }
  return `<div class="hero__media hero__media--art" aria-hidden="true">
  <svg viewBox="0 0 1440 720" preserveAspectRatio="xMaxYMax slice" focusable="false">
    <defs>
      <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E3B43"/><stop offset="1" stop-color="#0F2025"/></linearGradient>
      <radialGradient id="hero-glow" cx="0.72" cy="0.42" r="0.5"><stop offset="0" stop-color="#D5A45A" stop-opacity="0.32"/><stop offset="1" stop-color="#D5A45A" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1440" height="720" fill="url(#hero-sky)"/>
    <rect width="1440" height="720" fill="url(#hero-glow)"/>
    <circle cx="1036" cy="250" r="64" fill="none" stroke="#D5A45A" stroke-opacity="0.55" stroke-width="1.5"/>
    <g fill="none" stroke="#D5A45A" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke-opacity="0.75">
      <path d="M1036 150v34"/><path d="M1036 151l26 9-26 9z" fill="#D5A45A" fill-opacity="0.75"/>
      <path d="M956 520V420c0-80 40-150 80-236 40 86 80 156 80 236v100"/>
      <path d="M968 360h136M962 420h148M990 300h92"/>
      <path d="M1012 520v-44a24 24 0 0 1 48 0v44"/>
      <path d="M836 520v-62c0-46 22-86 46-128 24 42 46 82 46 128v62"/><path d="M882 330v-22"/>
      <path d="M1144 520v-62c0-46 22-86 46-128 24 42 46 82 46 128v62"/><path d="M1190 330v-22"/>
      <path d="M760 520v-30c0-22 12-40 24-58 12 18 24 36 24 58v30M1264 520v-30c0-22 12-40 24-58 12 18 24 36 24 58v30"/>
    </g>
    <g fill="none" stroke="#D5A45A" stroke-opacity="0.45" stroke-width="1.5">
      <path d="M640 520h800M680 548h760M720 576h720M760 604h680"/>
    </g>
    <g fill="none" stroke="#F7F5F0" stroke-opacity="0.18" stroke-width="1.5" stroke-linecap="round">
      <path d="M0 640c40 0 40-10 80-10s40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10"/>
      <path d="M0 676c40 0 40-10 80-10s40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10 40-10 80-10 40 10 80 10"/>
    </g>
  </svg>
</div>`;
}
