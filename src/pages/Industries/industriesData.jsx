/* Industries — data + icon helper (mirrors industries.runtime.js). */

const ICON_PATHS = {
  cup: <><path d="M6 2h12v3a6 6 0 0 1-12 0z" /><path d="M6 5H4a2 2 0 0 0 0 4h2" /><path d="M18 5h2a2 2 0 0 1 0 4h-2" /><path d="M8 15h8v5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" /></>,
  cross: <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />,
  bulb: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7c.5.4.8 1 .9 1.6h6.2c.1-.6.4-1.2.9-1.6A7 7 0 0 0 12 2z" /></>,
  building: <><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></>,
  chip: <><rect x="5" y="5" width="14" height="14" rx="2" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
};
export function Icon({ name, size = 20 }) {
  return <svg width={size} height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICON_PATHS[name]}</svg>;
}

export const IND = [
  { name: 'Food, Beverage & FMCG', short: 'FMCG', ico: 'cup', img: 'retail', insight: '5 FMCG & food brands served', focus: 'Production → Retail', modules: ['Inventory', 'Manufacturing', 'Distribution', 'Sales', 'Finance'], head: 'Keeping fast-moving goods moving.', para: 'From production runs to distribution and retail, we give food and FMCG businesses one connected view of inventory, orders and margins — so the shelves stay stocked and the numbers stay clean.', members: [['Dipitt', 'dipitt-logo'], ['Danpak', 'danpak-logo'], ['greenO', 'greeeno-logo'], ['FIPCo', null], ['Maxim', 'maxim-logo']] },
  { name: 'Pharmaceutical & Healthcare', short: 'Pharma & Health', ico: 'cross', img: 'pharma', insight: 'Trusted by pharma & healthcare teams', focus: 'Compliant & traceable', modules: ['Batch Tracking', 'Compliance', 'Inventory', 'Field Force', 'Finance'], head: 'Precision where it matters most.', para: 'We help pharmaceutical and healthcare organizations run compliant, traceable operations — from field teams to inventory — with the accuracy the sector demands.', members: [['Oncogen Pharma', 'oncogen-pharma-pakistan-logo'], ['NexTek HealthCare', 'nectek-logo']] },
  { name: 'Lighting & Electrical', short: 'Lighting', ico: 'bulb', img: 'manufacturing', insight: '3 lighting & electrical leaders', focus: 'Warehouse → Invoice', modules: ['Procurement', 'Inventory', 'Sales', 'Invoicing', 'Finance'], head: 'Powering the businesses that light rooms.', para: 'Lighting and electrical suppliers rely on us to tie procurement, stock and sales into one system — clear visibility from warehouse to invoice.', members: [['Coarts Lighting Solutions', 'coarts-lighting-solutin'], ['Clipsal', 'clipsal-logo'], ['Allied', 'allied-logo']] },
  { name: 'Construction, Building & Real Estate', short: 'Construction', ico: 'building', img: 'enterprise', insight: '4 construction & real estate firms', focus: 'On schedule, on budget', modules: ['Projects', 'Procurement', 'Assets', 'Payroll', 'Finance'], head: 'Structure for the businesses that build.', para: 'We bring order to complex builds — projects, procurement, assets and finance in one place — so construction and real estate teams stay on schedule and on budget.', members: [['Powerhouse Building Solutions', 'powerhouse-builiding-solution-logo'], ['Zamanat', 'zamanat-logo'], ['Hasco Steel', null], ['KG (King’s Group)', 'kg-logo']] },
  { name: 'Energy & Solar', short: 'Energy & Solar', ico: 'sun', img: 'distribution', insight: 'Powering solar & energy operations', focus: 'Pipeline → Field install', modules: ['Project Pipeline', 'Field Ops', 'Inventory', 'Service', 'Finance'], head: 'Systems for a cleaner grid.', para: 'From project pipelines to field installs, we help solar and energy operators manage the moving parts — keeping deployments organized and accountable.', members: [['PV360', null], ['VSolar', 'vsolar-logo']] },
  { name: 'Technology & Mobility', short: 'Tech & Mobility', ico: 'chip', img: 'services', insight: '3 tech & mobility innovators', focus: 'Built to scale', modules: ['CRM', 'Projects', 'Billing', 'HR', 'Finance'], head: 'Built for the businesses building tomorrow.', para: 'Technology and mobility innovators partner with us for systems that scale as fast as they do — flexible, connected and ready for what’s next.', members: [['BusCaro', 'buscaro-logo-original-scaled'], ['Techexons', 'techexons-logo'], ['Noon', 'noon-logo']] },
];

export const NODES = [
  ['FMCG', '5 brands', 'Production to shelf in one flow.', 'cup'],
  ['Pharma & Health', '2 organizations', 'Compliant, traceable operations.', 'cross'],
  ['Lighting', '3 leaders', 'Procurement to invoice, tied together.', 'bulb'],
  ['Construction', '4 firms', 'Projects, assets & finance in order.', 'building'],
  ['Energy & Solar', 'Field-ready', 'Pipelines to field installs, tracked.', 'sun'],
  ['Tech & Mobility', '3 innovators', 'Systems that scale as fast as they do.', 'chip'],
];
export const NODE_DURS = ['6.5s', '7.2s', '6.8s', '7.4s', '6.6s', '7s'];
export const NODE_DELS = ['0s', '.4s', '.8s', '.2s', '.6s', '1s'];
