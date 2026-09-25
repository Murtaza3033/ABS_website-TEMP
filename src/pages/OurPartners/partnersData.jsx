/* Our Partners — data + icon helper. */

const ICON_PATHS = {
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20" /><path d="M12 2a15 15 0 0 0 0 20" /></>,
  megaphone: <><path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>,
  chip: <><rect x="5" y="5" width="14" height="14" rx="2" /><path d="M9 2v3" /><path d="M15 2v3" /><path d="M9 19v3" /><path d="M15 19v3" /><path d="M2 9h3" /><path d="M2 15h3" /><path d="M19 9h3" /><path d="M19 15h3" /></>,
  support: <path d="M18 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3z" />,
  trending: <><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></>,
  shield: <><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" /></>,
};
export function Icon({ name }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICON_PATHS[name]}</svg>;
}

export const BENEFITS = [
  ['01', 'Expanded Market Reach', 'Joining forces with Align opens doors to new markets and customer segments, expanding your reach and increasing brand visibility.', 'globe'],
  ['02', 'Co-Marketing Opportunities', 'Benefit from collaborative marketing, joint campaigns and co-branded materials that leverage the strengths of both businesses.', 'megaphone'],
  ['03', 'Access to Cutting-Edge Technology', 'Gain access to our advanced stack — React, ASP.NET, TypeScript, SQL Server, Crystal Reports — to deliver innovative, robust solutions.', 'chip'],
  ['04', 'Comprehensive Training & Support', 'Take advantage of training programs and dedicated support resources so you can excel at implementing and supporting our solutions.', 'support'],
  ['05', 'Joint Business Development', 'Collaborate on business development, joint proposals and strategic planning — leverage our expertise to accelerate growth.', 'trending'],
  ['06', 'Enhanced Competitive Advantage', 'Stand out with a complete suite of solutions backed by Align’s reputation as a leading ERP provider — and win more projects.', 'shield'],
];
