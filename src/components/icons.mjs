/**
 * Inline SVG sprite — original line icons, 24×24, stroke = currentColor.
 * Included once per page by the base layout; use with icon('name') from _lib.mjs.
 */
const ICONS = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.7v.1"/>',
  temple:
    '<path d="M12 2.5v2.6"/><path d="M12 2.6l2.8 1-2.8 1z"/><path d="M7.5 19v-4.4C7.5 11.2 9.6 8.3 12 5.4c2.4 2.9 4.5 5.8 4.5 9.2V19"/><path d="M8.3 12.4h7.4"/><path d="M10.6 19v-2.4a1.4 1.4 0 0 1 2.8 0V19"/><path d="M4 19h16M5.5 21.5h13"/>',
  wallet:
    '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h10A1.5 1.5 0 0 1 18 6.5V8"/><rect x="4" y="8" width="16.5" height="11" rx="2.5"/><path d="M20.5 11.5h-3.3a2 2 0 0 0 0 4h3.3"/>',
  family:
    '<circle cx="7.5" cy="6.3" r="2.2"/><circle cx="16.5" cy="6.3" r="2.2"/><circle cx="12" cy="12.4" r="1.7"/><path d="M4 20v-5.2A3.6 3.6 0 0 1 7.6 11.2"/><path d="M20 20v-5.2a3.6 3.6 0 0 0-3.6-3.6"/><path d="M9.6 20v-1.6a2.4 2.4 0 0 1 4.8 0V20"/>',
  sparkle:
    '<path d="M11 3.5l1.9 5.1 5.1 1.9-5.1 1.9L11 17.5l-1.9-5.1L4 10.5l5.1-1.9z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  train:
    '<rect x="6" y="3" width="12" height="14" rx="3"/><path d="M6 10h12M9.5 6h5"/><circle cx="9.2" cy="13.5" r=".6"/><circle cx="14.8" cy="13.5" r=".6"/><path d="m8.5 17-2 4M15.5 17l2 4M7.6 19.3h8.8"/>',
  whatsapp:
    '<path d="M4.3 20.2l1.2-4.3a8.2 8.2 0 1 1 3.1 3.1z"/><path fill="currentColor" stroke="none" d="M9.1 8.4c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c.5 1 1.3 1.8 2.3 2.3l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.5.8-.5.3-1.5.6-2.9 0a7.8 7.8 0 0 1-4.2-4.2c-.5-1.3-.2-2.3.1-2.8z"/>',
  'shield-check': '<path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  waves:
    '<path d="M3 8c1.5 0 1.5-1.4 3-1.4S7.5 8 9 8s1.5-1.4 3-1.4S13.5 8 15 8s1.5-1.4 3-1.4S19.5 8 21 8"/><path d="M3 12.5c1.5 0 1.5-1.4 3-1.4s1.5 1.4 3 1.4 1.5-1.4 3-1.4 1.5 1.4 3 1.4 1.5-1.4 3-1.4 1.5 1.4 3 1.4"/><path d="M3 17c1.5 0 1.5-1.4 3-1.4S7.5 17 9 17s1.5-1.4 3-1.4S13.5 17 15 17s1.5-1.4 3-1.4S19.5 17 21 17"/>',
  bed: '<path d="M3 19V6M3 15h18v4M21 15v-2.5A3.5 3.5 0 0 0 17.5 9H11v6"/><circle cx="7" cy="11.5" r="1.8"/>',
  walk: '<circle cx="13.5" cy="4.5" r="1.8"/><path d="M9.5 21l2.3-6.6 2.7 2.6V21"/><path d="M7.5 12l2.8-3.6 3.4 1.1 1.8 3 2.5 1"/><path d="M11.8 14.4l1.6-5"/>',
  building:
    '<path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5V21M15 10h3.5a1.5 1.5 0 0 1 1.5 1.5V21M2.5 21h19"/><path d="M7.5 8h1M10.5 8h1M7.5 12h1M10.5 12h1M7.5 16h1M10.5 16h1"/>',
  book: '<path d="M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2z"/><path d="M12 6.5v13"/>',
  chat: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17A1.5 1.5 0 0 1 4 15.5z"/>',
  tag: '<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.2 6.2a1.5 1.5 0 0 1-2.1 0z"/><circle cx="8" cy="8" r="1.4"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  map: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6zM9 4v14M15 6v14"/>',
  home: '<path d="M4 11 12 4l8 7M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
};

export default function icons() {
  const symbols = Object.entries(ICONS)
    .map(([name, body]) => `<symbol id="i-${name}" viewBox="0 0 24 24">${body}</symbol>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" class="icon-sprite" width="0" height="0" aria-hidden="true" focusable="false">${symbols}</svg>`;
}
