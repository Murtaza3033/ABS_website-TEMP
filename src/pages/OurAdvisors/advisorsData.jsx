/* Our Advisors — data + icon helper. */

const ICON_PATHS = {
  compass: <><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2.9 6.4-6.4 2.9 2.9-6.4 6.4-2.9z" /></>,
  trending: <><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></>,
  layers: <><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  shield: <><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" /></>,
  tag: <><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6z" /><path d="M7 7h.01" /></>,
  scale: <><path d="M12 3v18" /><path d="M5 7h14" /><path d="M5 7l-3 6h6l-3-6z" /><path d="M19 7l-3 6h6l-3-6z" /><path d="M8 21h8" /></>,
  map: <><path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" /><path d="M9 3v15" /><path d="M15 6v15" /></>,
  lightbulb: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7c.5.4.8 1 .9 1.6h6.2c.1-.6.4-1.2.9-1.6A7 7 0 0 0 12 2z" /></>,
};
export function Icon({ name, size = 22, sw = 1.8 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{ICON_PATHS[name]}</svg>;
}

export const AREAS = [
  ['Strategy & Direction', 'Helping set where Align focuses next — which markets, which products, which bets are worth making.', 'compass'],
  ['Growth & Go-to-Market', 'Sharpening how we reach and win the businesses that need what we build.', 'trending'],
  ['Product & Platform', 'A second read on the roadmap — what to build in-house, what to leave, what to connect.', 'layers'],
  ['Scaling the Team', 'Growing headcount and structure without losing the quality that defines the work.', 'users'],
  ['Governance & Risk', 'Keeping decisions sound as the company and its responsibilities grow.', 'shield'],
  ['Pricing & Positioning', 'How Align is valued and framed against the alternatives businesses consider.', 'tag'],
];

export const PILLARS = [
  ['Big calls, pressure-tested', 'A trusted voice to challenge the decisions that are hard to reverse.', 'scale'],
  ['A wider map', 'Perspective from beyond the day-to-day that keeps the long view in focus.', 'map'],
  ['Experience on tap', 'Lessons already learned elsewhere, so we don’t learn them the slow way.', 'lightbulb'],
];

export const TL = [
  ['Year TBD', 'Early career', 'Placeholder — foundational roles and the industries where the advisor built their expertise.', '#1a56db', 'lightbulb'],
  ['Year TBD', 'Leadership role', 'Placeholder — a senior position that shaped their view on building and scaling software teams.', '#4b8bff', 'users'],
  ['Year TBD', 'Notable milestone', 'Placeholder — a defining achievement or venture worth highlighting once confirmed.', '#1a56db', 'trending'],
  ['Year TBD', 'Advisory work', 'Placeholder — advising companies and founders, the experience Align now draws on.', '#1a9d55', 'compass'],
  ['Today', 'Advising Align', 'Placeholder — the perspective and guidance brought to Align Business Systems today.', '#0f1729', 'shield'],
];
