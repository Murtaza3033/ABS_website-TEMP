/* Our Team — data + icon helper (mirrors our-team.runtime.js). */

const ICON_PATHS = {
  spark: <><path d="M12 3v4" /><path d="M12 17v4" /><path d="M3 12h4" /><path d="M17 12h4" /><path d="M5.6 5.6l2.8 2.8" /><path d="M15.6 15.6l2.8 2.8" /><path d="M18.4 5.6l-2.8 2.8" /><path d="M8.4 15.6l-2.8 2.8" /></>,
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />,
};
export function Icon({ name, size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{ICON_PATHS[name]}</svg>;
}

export const HERO = [['12', '+', 'Years of Excellence'], ['150', '+', 'Enterprise Clients'], ['250', '+', 'Team Members'], ['20', '+', 'Products & Solutions']];

export const DESC = {
  Strategy: 'Setting direction and the bets worth making.', Vision: 'Where Align is headed next.',
  Leadership: 'Steering the team and the culture.', Growth: 'Scaling the company sustainably.',
  '.NET': 'Core ERP platform engineering.', React: 'Modern, responsive product UI.',
  DevOps: 'CI/CD, reliability and releases.', Cloud: 'Scalable cloud infrastructure.',
  SQL: 'Data modelling and SQL Server.', Innovation: 'Turning new ideas into roadmap.',
  AI: 'Applied intelligence across the platform.', Product: 'Shaping what we build and why.',
  Implementation: 'Deploying Align into live operations.', 'Project Management': 'Delivery, on time and on scope.',
  ERP: 'End-to-end business systems.', 'Client Success': 'Onboarding and long-term support.',
};

export const LEADERS = [
  { num: '01', role: 'Chief Executive Officer', name: 'Muhammad Shamsheer', photo: 'p-5818', caption: 'Reviewing company strategy from the executive floor, where direction for the whole Align platform comes together.', quote: "We don't ship software — we hand businesses the way they'll run for the next decade.", tags: ['Strategy', 'Vision', 'Leadership', 'Growth'], c1: ['Company Overview', 'Active Clients', 150, ['40%', '58%', '48%', '74%', '66%', '90%']], c2: ['Solutions', 'LIVE', 'Deployed', 20], c3: ['Revenue growth', '↑ steady climb'] },
  { num: '02', role: 'Director Technical', name: 'Ebad ur Rehman', photo: 'p-5733', caption: 'Mid production fix — laptop in hand, pointing at a live API issue while the monitors run debugging in the background.', quote: "If it isn't rock-solid at 2 AM, it isn't done.", tags: ['.NET', 'React', 'DevOps', 'Cloud', 'SQL'], c1: ['Build Health', 'Uptime', 99, ['70%', '84%', '60%', '92%', '78%', '96%']], c2: ['Issue Detected', 'FIXING', 'Live API errors', 3], c3: ['Latency (ms)', '↓ trending down'] },
  { num: '03', role: 'Manager, Innovation & Strategy', name: 'Hadi Shamsheer', photo: 'p-5850', caption: "Sketching a strategy flow on the glass board, with Align's connected ecosystem — finance, people, field ops, reporting — mapped around the workflow.", quote: 'Every great feature begins as a simple question: what would make this effortless?', tags: ['Innovation', 'AI', 'Strategy', 'Product'], c1: ['Ideas in Progress', 'This month', 12, ['44%', '56%', '66%', '72%', '84%', '92%']], c2: ['Alignment', 'ON TRACK', 'Cross-functional', 82], c3: ['Projects in motion', '↑ +25% this month'] },
  { num: '04', role: 'Implementation Manager', name: 'Sadiq', photo: 'p-5649', caption: 'Walking a client through go-live — configuration and deployment boards mid-update, checklist ticking off as modules come online.', quote: "Go-live isn't the finish line — it's the day we start earning your trust.", tags: ['Implementation', 'Project Management', 'ERP', 'Client Success'], c1: ['Go-Live Board', 'Modules live', 18, ['50%', '62%', '74%', '80%', '88%', '100%']], c2: ['Deployment', 'SUCCESS', 'Completion', 100], c3: ['Rollout pace', '↑ on schedule'] },
];

export const WAY = [
  ['01', 'Curiosity first', 'spark', 'We hire for the questions people ask — not just the answers they already have.'],
  ['02', 'Ship, then sharpen', 'zap', 'Momentum beats perfection. We release early, gather real feedback, and refine fast.'],
  ['03', 'Own the outcome', 'target', "One team is accountable — from the first line of code to a client's live go-live."],
  ['04', 'Teach as you build', 'heart', 'Every project leaves the whole team a little sharper than it found them.'],
];

export const SEN = [
  ['SE', 'Senior Software Engineer', 'Owns core platform modules.'],
  ['HR', 'Senior HR Executive', 'People, culture and hiring.'],
  ['FO', 'Senior Finance Officer', 'Keeps the numbers honest.'],
  ['SU', 'Senior Support Engineer', 'Clients, unblocked.'],
  ['BA', 'Senior Business Analyst', 'Turns needs into specs.'],
];

export const ROLES = ['Engineer', 'Consultant', 'QA', 'Designer', 'Support', 'Sales', 'Analyst', 'DevOps', 'PM', 'Onboarding', 'SQL Admin', 'Ops'];
export const PAL = [['#eef4ff', '#1a56db'], ['#0f1729', '#9fc0ff'], ['#e8effc', '#1a56db'], ['#dbe6ff', '#1a56db']];
