const PATHS = {
  home: '<path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"/>',
  grid: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
  spark: '<path d="M12 3l1.2 5.2L18 12l-4.8 1.8L12 21l-1.2-7.2L6 12l4.8-3.8L12 3z"/>',
  dress: '<path d="M9 4h6l2 4-3 2v10H10V10L7 8l2-4z"/>',
  shirt: '<path d="M8 5l4-2 4 2 3 2-2 3h-2v9H9V10H7L5 7l3-2z"/>',
  child: '<circle cx="12" cy="7" r="3"/><path d="M6 20c1.5-4 3.5-6 6-6s4.5 2 6 6"/>',
  chat: '<path d="M5 5h14v10H8l-3 3V5z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-3.2-3.2"/>',
  heart: '<path d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.6 12 20 12 20z"/>',
  compare: '<path d="M6 6h5v12H6zM13 10h5v8h-5z"/>',
  bag: '<path d="M6 8h12l-1 11H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  user: '<circle cx="12" cy="8" r="3.2"/><path d="M5 20c1.4-3.4 3.8-5 7-5s5.6 1.6 7 5"/>',
  truck: '<path d="M3 7h11v10H3z"/><path d="M14 10h4l3 3v4h-7"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/>',
  shield: '<path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z"/>',
  refresh: '<path d="M4 12a8 8 0 0 1 13.5-5.8M20 12a8 8 0 0 1-13.5 5.8"/><path d="M18 3v5h-5M6 21v-5h5"/>',
  tag: '<path d="M3 12l9-9h6v6l-9 9-6-6z"/><circle cx="16" cy="8" r="1.2"/>',
  star: '<path d="M12 3l2.4 5 5.6.8-4 4 1 5.6L12 16.5 6.9 18.4l1-5.6-4-4 5.6-.8L12 3z"/>',
  gift: '<rect x="4" y="9" width="16" height="11"/><path d="M12 9v11M4 13h16M12 9c-2-3-5-3-5-1s2 2 5 1c3 1 5 0 5-1s-3-2-5 1z"/>',
  check: '<path d="M5 12l5 5L19 7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  map: '<path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V6l5-2z"/><path d="M9 4v14M15 6v14"/>',
  phone: '<path d="M7 3h3l1 4-2 1a12 12 0 0 0 5 5l1-2 4 1v3a2 2 0 0 1-2 2A14 14 0 0 1 5 5a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="6" width="18" height="12"/><path d="M3 7l9 7 9-7"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/>',
  zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
  alert: '<path d="M12 4l9 16H3L12 4z"/><path d="M12 10v4M12 16.5h.01"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 14h4"/>',
  pix: '<path d="M8.5 5.5l-4 4a3 3 0 0 0 0 4.2l4 4M15.5 5.5l4 4a3 3 0 0 1 0 4.2l-4 4M9.5 12h5"/>',
  boleto: '<rect x="5" y="4" width="14" height="16" rx="1"/><path d="M8 8h.01M10 8h.01M12 8h.01M14 8h.01M8 11h.01M10 11h.01M12 11h.01M8 14h.01M10 14h.01M12 14h.01M14 14h.01"/>',
  cart: '<path d="M4 6h2l2.2 10h9.6L20 8H8"/><circle cx="10" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
  store: '<path d="M4 9l1.5-4h13L20 9M5 9v10h14V9"/><path d="M9 19v-6h6v6"/>',
  link: '<path d="M9 12a4 4 0 0 1 0-5.6l1.8-1.8a4 4 0 0 1 5.6 5.6L15 12"/><path d="M15 12a4 4 0 0 1 0 5.6l-1.8 1.8a4 4 0 1 1-5.6-5.6L9 12"/>',
  qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>',
  calendar: '<rect x="4" y="6" width="16" height="14" rx="2"/><path d="M8 4v4M16 4v4M4 11h16"/>',
  bot: '<rect x="6" y="8" width="12" height="10" rx="3"/><path d="M12 4v4M9 12h.01M15 12h.01M10 15h4"/>',
  chart: '<path d="M4 19h16"/><path d="M7 16V10M12 16V7M17 16v-4"/>',
  rocket: '<path d="M12 3c4 3 6 7 6 11l-3 1-2-2-2 2-3-1c0-4 2-8 6-11z"/><path d="M9 14l-3 5M15 14l3 5"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/>',
  layers: '<path d="M12 4l8 4-8 4-8-4 8-4z"/><path d="M4 12l8 4 8-4M4 16l8 4 8-4"/>',
  users: '<circle cx="9" cy="9" r="3"/><circle cx="16" cy="10" r="2.4"/><path d="M4 19c1.2-3 3.2-4.5 5-4.5S12.8 16 14 19M14 16c1.5.2 3 1.2 4 3"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
  unlink: '<path d="M8 12h8M5 8l-1 1a4 4 0 0 0 0 5.6L6 17M19 8l1 1a4 4 0 0 1 0 5.6L18 17"/>',
  database: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  wand: '<path d="M5 19L15 9M14 5l1.5 1.5L9.5 12.5 8 11z"/><path d="M16 4l1 1M19 7l1 1M18 3l.5 1.5L20 5"/>',
  megaphone: '<path d="M4 11v2l10 4V7L4 11z"/><path d="M14 9c2 .8 4 2 5 4M8 15v3a2 2 0 0 0 2 2h1"/>',
  package: '<path d="M12 3l8 4v10l-8 4-8-4V7l8-4z"/><path d="M12 7v14M4.5 9.5L12 13l7.5-3.5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M4.9 6.5l1.4 1.4M17.7 16.1l1.4 1.4M3 12h2M19 12h2M4.9 17.5l1.4-1.4M17.7 7.9l1.4-1.4"/>',
  layout: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 10v10"/>',
  share: '<circle cx="6" cy="12" r="2.2"/><circle cx="17" cy="7" r="2.2"/><circle cx="17" cy="17" r="2.2"/><path d="M8 11l7-3M8 13l7 3"/>',
  image: '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M4 16l4-4 3 3 3-4 6 5"/>',
  hash: '<path d="M9 5l-2 14M17 5l-2 14M5 9h15M4 15h15"/>',
  funnel: '<path d="M4 5h16l-6 7v5l-4 2v-7L4 5z"/>',
};

export function Icon({ name = "info", className = "icon", ...rest }) {
  const inner = PATHS[name] || PATHS.info;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: inner }}
      {...rest}
    />
  );
}
