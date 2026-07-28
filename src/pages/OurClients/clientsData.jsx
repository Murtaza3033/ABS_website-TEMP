/* Our Clients — data + icon helper (mirrors our-clients.runtime.js). */

const ICON_PATHS = {
  cup: <><path d="M6 2h12v3a6 6 0 0 1-12 0z" /><path d="M6 5H4a2 2 0 0 0 0 4h2" /><path d="M18 5h2a2 2 0 0 1 0 4h-2" /><path d="M8 15h8v5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" /></>,
  cross: <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />,
  bulb: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7c.5.4.8 1 .9 1.6h6.2c.1-.6.4-1.2.9-1.6A7 7 0 0 0 12 2z" /></>,
  building: <><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></>,
  chip: <><rect x="5" y="5" width="14" height="14" rx="2" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
};
export function Icon({ name }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICON_PATHS[name]}</svg>;
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
export const SHORT = ['Food & FMCG', 'Pharma & Health', 'Lighting', 'Construction', 'Energy & Solar', 'Technology'];

export const INDOF = {};
SECTORS.forEach((s, si) => { s[2].forEach((m) => { INDOF[m] = si; }); });

export const NUMBERS = [[35, '+', 'Businesses served'], [6, '+', 'Industries served'], [100, '%', 'Built & supported in-house']];
