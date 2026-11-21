import { icon } from './_lib.mjs';

/** Visible on every page while data/site.json → "prototype": true. */
export default function prototypeBar({ site }) {
  if (!site.prototype) return '';
  const text = site.showSamples
    ? 'listings shown are labelled samples, not real hotels.'
    : 'hotel listings are being added.';
  return `<div class="proto-bar" role="note">
  <div class="container">${icon('info')}<span><strong>Prototype preview:</strong> ${text}</span></div>
</div>`;
}
