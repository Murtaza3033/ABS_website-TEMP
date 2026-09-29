/* Built-in Home page copy (English source strings; Arabic comes from the
   i18n dictionary). It is both the fallback the sections render while the
   CMS is pending / unreachable / empty and the seed for the "Home page"
   singleton, Service and Industry documents (so the two can't drift).
   Plain data only — no JSX — so the seed script can import it. */

export const HOME = {
  clientsHeading: 'The businesses that grow with',
  clientsHighlight: 'Align',
  clientsText: 'Manufacturers, pharma teams, retailers and service companies — running on our software every day.',

  benefitsEyebrow: 'Clients Benefits',
  benefitsHeading: 'Explore the advantages of partnering with us',
  benefits: [
    ['Tailored Solutions', 'Built around your needs.'],
    ['Expert Guidance', 'Seasoned professionals.'],
    ['Innovative Tech', 'React, .NET, SQL & more.'],
    ['Timely Support', 'Proactive, low downtime.'],
    ['Continuous Improvement', 'Always current practices.'],
    ['Partnership Approach', 'Collaborative & open.'],
  ],
  thinkEyebrow: 'How we think',
  thinkHeading: "We don't just automate — we orchestrate.",
  thinkText: 'Align Business Systems is one team behind one platform. We connect finance, people and field operations so your whole company runs on a single source of truth — not five disconnected tools stitched together.',
  thinkCards: [
    ['Operations', 'Every department, one system', 'Finance, HR, field and cross-functional work run on shared data instead of five separate tools that never talk to each other.'],
    ['Integration', 'Nothing lives in a silo', 'Payments, attendance, approvals and reporting connect natively — no middleware, no exports, no manual sync.'],
    ['Intelligence', 'Dashboards that decide, not just display', 'Live visibility into every process, with the context to act on it — not just a report to read after the fact.'],
  ],

  problemsHeading: 'One straight line from',
  problemsHighlight: 'chaos to aligned.',
  problemsText: 'Approvals, payroll, field visits, mismatched tools — the daily friction of a growing business. Watch what happens to that journey with Align, and without it.',
  problemsOnLine: 'A single, tracked path — every problem resolved in days.',
  problemsOffLine: 'Loops, dead-ends and manual rework — weeks lost, every week.',
  toggleOnLabel: 'Align ON',
  toggleOffLabel: 'Align OFF',
  startLabel: 'Your business',
  endOnLabel: 'Aligned & flourishing',
  endOffLabel: 'Stuck & frustrated',
  journey: [
    ['Approvals', 'One-tap approved', 'Stuck for days'],
    ['Payroll', 'Runs in hours', 'Weeks by hand'],
    ['Reporting', 'Live visibility', 'Flying blind'],
    ['Custom software', 'Built to fit', 'Fighting the tool'],
  ],
  problemsFootnote: "Every product we ship began as one of these knots inside a real client's business — and we straightened it.",
  problemsButton: 'Untangle your operations →',

  productsEyebrow: 'One platform',
  productsHeading: 'Every part of your business.',
  productsHighlight: 'One aligned way of working.',
  productsText: 'One login. One source of truth. Everything your teams do — finance, people, field operations, patient care — runs on a single Align platform instead of scattered across disconnected tools. We design, build and support all of it in-house, as one connected way of working.',
  // [label, title, text, product slug]
  productCards: [
    ['Finance & Operations', 'Run the whole operation', 'Finance, inventory, procurement and approvals — the whole operation in one connected flow.', 'businessflo'],
    ['People & Payroll', 'Manage every employee', 'Attendance, leave, payroll and people analytics — one place for managers and every employee.', 'peoplenest'],
    ['Field & Sales', 'See the field in real time', 'Field visits, samples, routes and live KPIs — full visibility over teams on the ground.', 'pharmafieldflo'],
    ['Hospital & Care', 'Run the whole hospital', 'OPD, admissions, beds, pharmacy, lab and billing — every patient tracked in one hospital system.', 'hmsflo'],
  ],

  servicesEyebrow: 'Why Align Business Systems',
  servicesHeading: 'Enterprise software, built around how you actually work.',
  servicesText: 'Align Business Systems is a product & software company. We design, build, deploy and support the systems that run your operations — one accountable team from first call to daily use.',
  servicesButton: 'Book a discovery call',
  // "{count}" = number of industries
  servicesStats: [
    ['Product + Services', 'one company'],
    ['{count} industries', 'served today'],
    ['One platform', 'every product'],
  ],
  // [hub name, title, text, image (public/assets/images/services/<img>.webp)]
  servicesSteps: [
    ['Discovery', 'Discovery & Fit', 'We map your process, teams, gaps and goals before building anything.', 'consulting'],
    ['Engineering', 'Product Engineering', 'We design and develop scalable software around your real workflows.', 'web'],
    ['Implementation', 'Implementation', 'We deploy, configure, train and launch with minimal disruption.', 'custom'],
    ['Support', 'Support & SLA', 'We stay involved with support, updates and managed service.', 'saas'],
    ['Insight', 'Insight & Optimization', 'We use feedback and analytics to continuously improve.', 'transform'],
  ],
  customEyebrow: "When off-the-shelf isn't enough",
  customHeading: 'We also build,',
  customHighlight: "what you can't buy.",
  customText: 'The team behind our products takes on custom builds — web, mobile and SaaS.',
  customPoints: ['Built around your workflow', 'Live fast, minimal disruption', 'One accountable team'],
  customButton: 'Explore solution →',
  serviceModalButton: 'Talk to us →',

  industriesEyebrow: 'Who runs on Align',
  industriesHeading: 'Different industries,',
  industriesHighlight: 'the same discipline.',
  industriesLink: 'All industries →',

  ctaHeading: 'Ready to run your business on one connected system?',
  ctaText: 'See Align in action and discover how we can transform your operations.',
  ctaButton: 'Book a Demo →',
};

/* Service cards + pop-ups (Service documents). */
export const SERVICES = [
  { slug: 'web-development', img: 'web', title: 'Web Development', tag: 'Web Development', short: 'Built to spec', desc: 'Fast, scalable web applications built around your real workflows.', feats: ['Responsive', 'Scalable', 'Secure'] },
  { slug: 'mobile-app-development', img: 'mobile', title: 'Mobile App Development', tag: 'Mobile Apps', short: 'iOS + Android', desc: 'Native-quality iOS and Android apps for teams on the move.', feats: ['iOS', 'Android', 'Offline-ready'] },
  { slug: 'saas-development', img: 'saas', title: 'SaaS Development', tag: 'SaaS', short: 'Idea to product', desc: 'Multi-tenant products engineered to scale securely.', feats: ['Multi-tenant', 'Cloud', 'APIs'] },
  { slug: 'custom-software', img: 'custom', title: 'Custom Software', tag: 'Custom Software', short: 'Around your workflow', desc: 'Bespoke systems for the problems off-the-shelf tools cannot solve.', feats: ['Bespoke', 'Integrated', 'In-house'] },
  { slug: 'technology-consulting', img: 'consulting', title: 'Technology Consulting', tag: 'Consulting', short: 'Architecture & strategy', desc: 'We map your process, gaps and goals before building anything.', feats: ['Architecture', 'Strategy', 'Roadmap'] },
  { slug: 'digital-transformation', img: 'transform', title: 'Digital Transformation', tag: 'Digital Transformation', short: 'Legacy → modern', desc: 'Modernize operations end-to-end with one connected platform.', feats: ['Legacy to modern', 'End-to-end', 'Measurable'] },
];

/* The six industries (Industry documents) — fallback for the home Industries
   section. `img` = public/assets/images/industries/<img>.webp (same pairing
   as the Industries page's fallback). */
export const INDUSTRIES = [
  { slug: 'food-beverage-fmcg', name: 'Food, Beverage & FMCG', summary: 'Keeping fast-moving goods moving.', img: 'retail' },
  { slug: 'pharmaceutical-healthcare', name: 'Pharmaceutical & Healthcare', summary: 'Precision where it matters most.', img: 'pharma' },
  { slug: 'lighting-electrical', name: 'Lighting & Electrical', summary: 'Powering the businesses that light rooms.', img: 'manufacturing' },
  { slug: 'construction-building-real-estate', name: 'Construction, Building & Real Estate', summary: 'Structure for the businesses that build.', img: 'enterprise' },
  { slug: 'energy-solar', name: 'Energy & Solar', summary: 'Systems for a cleaner grid.', img: 'distribution' },
  { slug: 'technology-mobility', name: 'Technology & Mobility', summary: 'Built for the businesses building tomorrow.', img: 'services' },
];

/* Client logo mosaic fallback: [name, public/assets/images/clients/<file>.webp]. */
export const LOGOS = [
  ['Dipitt', 'dipitt-logo'], ['Danpak', 'danpak-logo'], ['Noon', 'noon-logo'],
  ['Nectek', 'nectek-logo'], ['Zamanat', 'zamanat-logo'], ['Greeeno', 'greeeno-logo'],
  ['Allied', 'allied-logo'], ['Oncogen', 'oncogen-pharma-pakistan-logo'], ['Clipsal', 'clipsal-logo'],
  ['Maxim', 'maxim-logo'], ['TechExons', 'techexons-logo'], ['Omega', 'omega-enterprises-logo'],
  ['VSolar', 'vsolar-logo'], ['Coarts', 'coarts-lighting-solutin'], ['Powerhouse', 'powerhouse-builiding-solution-logo'],
  ['KG', 'kg-logo'], ['Buscaro', 'buscaro-logo-original-scaled'],
];
