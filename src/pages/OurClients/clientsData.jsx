/* Our Clients — data + icon helper. */

const ICON_PATHS = {
  cup: <><path d="M6 2h12v3a6 6 0 0 1-12 0z" /><path d="M6 5H4a2 2 0 0 0 0 4h2" /><path d="M18 5h2a2 2 0 0 1 0 4h-2" /><path d="M8 15h8v5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" /></>,
  cross: <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />,
  bulb: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7c.5.4.8 1 .9 1.6h6.2c.1-.6.4-1.2.9-1.6A7 7 0 0 0 12 2z" /></>,
  building: <><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></>,
  chip: <><rect x="5" y="5" width="14" height="14" rx="2" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
  /* sector sub-area icons */
  bottle: <><path d="M10 2h4" /><path d="M10.5 2v4L8 9.5V20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9.5L13.5 6V2" /><path d="M8 13.5h8" /></>,
  box: <><path d="M21 8l-9-5-9 5v8l9 5 9-5z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v8" /><path d="M7.5 5.5l9 5" /></>,
  truck: <><path d="M1.5 4.5h13v11h-13z" /><path d="M14.5 8.5h4l3 3.5v3.5h-7" /><circle cx="5.5" cy="18" r="2" /><circle cx="17.5" cy="18" r="2" /></>,
  shelf: <><path d="M4 3v18M20 3v18M4 9h16M4 15h16M4 21h16" /><path d="M7 9V5.5h3V9M12.5 9V6.5h2.5V9M13 15v-3.5h4V15M7 21v-3.5h4V21" /></>,
  pill: <><path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z" /><path d="M8.5 8.5l7 7" /></>,
  hospital: <><path d="M4 21V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" /><path d="M2 21h20" /><path d="M12 8.5v5M9.5 11h5" /><path d="M10 21v-3.5h4V21" /></>,
  flask: <><path d="M9 3h6" /><path d="M10 3v6.5L4.6 18.6A1.6 1.6 0 0 0 6 21h12a1.6 1.6 0 0 0 1.4-2.4L14 9.5V3" /><path d="M7.2 15h9.6" /></>,
  pin: <><path d="M12 22s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  lamp: <><path d="M12 2v5" /><path d="M5.5 15a6.5 6.5 0 0 1 13 0z" /><path d="M10 18.5a2 2 0 0 0 4 0" /><path d="M4 20.5l-1 1M20 20.5l1 1" /></>,
  plug: <><path d="M9 2v5M15 2v5" /><path d="M6 7h12v4a6 6 0 0 1-12 0z" /><path d="M12 17v5" /></>,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  store: <><path d="M3 9l2-5h14l2 5" /><path d="M3 9h18" /><path d="M5 9v12h14V9" /><path d="M10 21v-5.5h4V21" /></>,
  hardhat: <><path d="M2 19h20" /><path d="M4 19v-3a8 8 0 0 1 16 0v3" /><path d="M10 8.5V5.5h4v3" /><path d="M8 12.5v2M16 12.5v2" /></>,
  beam: <><path d="M5 4h14v3H5zM5 17h14v3H5z" /><path d="M10 7h4v10h-4z" /></>,
  house: <><path d="M3 11l9-8 9 8" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 2h6v4H9z" /><path d="M9 12.5l2 2 4-4" /><path d="M9 18h6" /></>,
  panel: <><path d="M4.5 4h15l2 10h-19z" /><path d="M3.5 9h17M9 4l-.5 10M15 4l.5 10" /><path d="M12 14v5M8 21h8" /></>,
  battery: <><rect x="2" y="7" width="17" height="10" rx="2" /><path d="M22 10.5v3" /><path d="M11 9l-2 3h3l-2 3" /></>,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  pylon: <><path d="M8 22l4-20 4 20" /><path d="M5 7h14M6.5 12h11" /><path d="M9.3 15.5l5.4 4M14.7 15.5l-5.4 4" /></>,
  code: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M9.5 9.5L7 12l2.5 2.5M14.5 9.5L17 12l-2.5 2.5" /></>,
  swap: <><path d="M7 3L3 7l4 4" /><path d="M3 7h14" /><path d="M17 13l4 4-4 4" /><path d="M21 17H7" /></>,
  car: <><path d="M5 17H3v-5l2.2-5h11.3l3 5H21v5h-2" /><path d="M3.5 12h17" /><circle cx="7.5" cy="17" r="2" /><circle cx="16.5" cy="17" r="2" /><path d="M9.5 17h5" /></>,
  bag: <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
  check: <path d="M20 6L9 17l-5-5" />,
};
export function Icon({ name, size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{ICON_PATHS[name]}</svg>;
}

export const CLIENTS = [
  ['BusCaro', 'buscaro-logo-original-scaled'], ['Powerhouse Building Solutions', 'powerhouse-builiding-solution-logo'],
  ['Dipitt', 'dipitt-logo'], ['NexTek HealthCare', 'nectek-logo'], ['Allied', 'allied-logo'], ['Techexons', 'techexons-logo'],
  ['Coarts Lighting Solutions', 'coarts-lighting-solutin'], ['Oncogen Pharma', 'oncogen-pharma-pakistan-logo'],
  ['KG (King’s Group)', 'kg-logo'], ['Zamanat', 'zamanat-logo'], ['Danpak', 'danpak-logo'], ['Noon', 'noon-logo'],
  ['greenO', 'greeeno-logo'], ['PV360', null], ['Clipsal', 'clipsal-logo'], ['Maxim', 'maxim-logo'],
  ['FIPCo', null], ['Hasco Steel', null], ['VSolar', 'vsolar-logo'], ['Omega Enterprises', 'omega-enterprises-logo'],
];

export const DURS = ['6.5s', '7.4s', '6.9s', '8.1s', '7s', '6.2s', '7.8s', '6.6s'];
export const DELS = ['0s', '.5s', '.2s', '.8s', '1.1s', '.3s', '.7s', '1s', '.15s', '.6s', '.9s', '.35s'];

export const SECTORS = [
  ['Food, Beverage & FMCG', 'cup', ['Dipitt', 'Danpak', 'greenO', 'FIPCo', 'Maxim']],
  ['Pharmaceutical & Healthcare', 'cross', ['Oncogen Pharma', 'NexTek HealthCare']],
  ['Lighting & Electrical', 'bulb', ['Coarts Lighting Solutions', 'Clipsal', 'Allied']],
  ['Construction, Building & Real Estate', 'building', ['Powerhouse Building Solutions', 'Zamanat', 'Hasco Steel', 'KG (King’s Group)']],
  ['Energy & Solar', 'sun', ['PV360', 'VSolar']],
  ['Technology, Trading & Mobility', 'chip', ['BusCaro', 'Techexons', 'Noon', 'Omega Enterprises']],
];
/* Sector cards show what each industry covers (sub-areas), not which clients
   sit in it — index-aligned with SECTORS. [caption, icon] */
export const SECTOR_AREAS = [
  [['Beverages', 'bottle'], ['Packaged foods', 'box'], ['Distribution', 'truck'], ['Retail shelves', 'shelf']],
  [['Pharmaceuticals', 'pill'], ['Hospitals', 'hospital'], ['Laboratories', 'flask'], ['Field force', 'pin']],
  [['Lighting', 'lamp'], ['Wiring & switches', 'plug'], ['Solar-ready', 'bolt'], ['Dealers', 'store']],
  [['Construction sites', 'hardhat'], ['Steel & materials', 'beam'], ['Real estate', 'house'], ['Projects', 'clipboard']],
  [['Solar panels', 'panel'], ['Inverters & storage', 'battery'], ['Installations', 'wrench'], ['Grid & utilities', 'pylon']],
  [['Software', 'code'], ['Trading', 'swap'], ['Logistics & mobility', 'car'], ['E-commerce', 'bag']],
];
export const SHORT =['Food & FMCG', 'Pharma & Health', 'Lighting', 'Construction', 'Energy & Solar', 'Technology'];

export const INDOF = {};
SECTORS.forEach((s, si) => { s[2].forEach((m) => { INDOF[m] = si; }); });

/* The Industry documents' ids, index-aligned with SECTORS / SHORT. Only used
   by the built-in copy below; with the CMS up, each Client's own Industry
   reference decides where it filters. */
const IND_IDS = ['industry-food-beverage-fmcg', 'industry-pharmaceutical-healthcare', 'industry-lighting-electrical', 'industry-construction-building-real-estate', 'industry-energy-solar', 'industry-technology-mobility'];

/* Static CLIENTS reshaped to look like a Sanity `client` document list, so it
   can serve as both React Query's placeholderData (shown instantly, no
   loading gap) and the safe fallback if the CMS is unreachable or empty. */
export const FALLBACK_CLIENTS = CLIENTS.map(([name, file], i) => ({
  _id: `fallback-${i}`,
  name,
  logoPath: file ? `/assets/images/clients/${file}.webp` : undefined,
  industry: name in INDOF ? { _id: IND_IDS[INDOF[name]] } : null,
  order: i + 1,
}));

/* Built-in filter buttons (Our Clients page -> Industry filter buttons). */
export const FALLBACK_FILTERS = SHORT.map((label, i) => ({ label: { en: label }, industry: { _id: IND_IDS[i] } }));

export const NUMBERS = [[50, '+', 'Businesses served'], [6, '+', 'Industries served'], [100, '%', 'Built & supported in-house']];

/* Hero trust line — built-in copy; editable in Sanity ("Our Clients page"
   → Trust line, same keys). Reads "Trusted by 50+ businesses • across 6
   industries • 100% in-house". */
export const TRUSTLINE = {
  businessesBefore: 'Trusted by', businessesCount: 50, businessesAfter: '+ businesses',
  industriesBefore: 'across', industriesCount: 6, industriesAfter: 'industries',
  inhouseValue: '100%', inhouseAfter: 'in-house',
};
