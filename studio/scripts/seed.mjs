#!/usr/bin/env node
/**
 * Seed / import script — migrates the existing hard-coded website content
 * (src/pages/**\/*Data.jsx, src/i18n/ar.js, Header.jsx, Footer.jsx)
 * into Sanity as real CMS documents.
 *
 * Safe & idempotent: every document below has a fixed, deterministic `_id`
 * (e.g. "client-buscaro"), and the script writes them with `createOrReplace`,
 * so re-running it is a no-op / update rather than a duplicate-creator.
 *
 * ---------------------------------------------------------------------------
 * SETUP — creating a Sanity write token
 * ---------------------------------------------------------------------------
 * 1. Go to https://www.sanity.io/manage
 * 2. Open the project used by this Studio (project ID in studio/.env,
 *    currently "5knwlrie" / dataset "production").
 * 3. API -> Tokens -> "Add API token".
 * 4. Name it something like "local-seed-script".
 * 5. Permissions: "Editor" (read + write) is enough — do NOT use "Admin"
 *    unless you need it for something else.
 * 6. Copy the token immediately (Sanity only shows it once) and paste it
 *    into studio/.env as SANITY_WRITE_TOKEN=<token>.
 *
 * This token must NEVER go in the Vite frontend's .env and must NEVER be
 * committed — studio/.env is gitignored (root .gitignore + studio/.gitignore
 * both cover it).
 *
 * ---------------------------------------------------------------------------
 * USAGE
 * ---------------------------------------------------------------------------
 *   npm run seed:dry-run   # preview: prints every document that WOULD be
 *                          # written, no network calls, no token required
 *   npm run seed           # actually writes to Sanity (requires
 *                          # SANITY_WRITE_TOKEN in studio/.env)
 */

import {config as loadEnv} from 'dotenv'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {createClient} from '@sanity/client'
import {AR} from '../../src/i18n/ar.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
loadEnv({path: path.join(__dirname, '..', '.env')})

const DRY_RUN = process.argv.includes('--dry-run')

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID in studio/.env')
}
if (!DRY_RUN && !token) {
  throw new Error(
    'Missing SANITY_WRITE_TOKEN in studio/.env. See the header comment in ' +
      'studio/scripts/seed.mjs for how to create one, or run with --dry-run ' +
      'to preview without a token.',
  )
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// ---------------------------------------------------------------------------
// Bilingual + Portable Text helpers
// ---------------------------------------------------------------------------

/** English -> Arabic via the site's own src/i18n/ar.js dictionary, exact-key
 *  match only (mirrors tr()'s lookup). Falls back to English when missing. */
function arFor(en) {
  return Object.prototype.hasOwnProperty.call(AR, en) ? AR[en] : en
}

/** {en, ar} plain-string pair, for localeString / localeText fields. */
function bi(en) {
  return {en, ar: arFor(en)}
}

function ptBlock(text, opts = {}) {
  return {
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', text, marks: []}],
    ...opts,
  }
}

/** {en, ar} Portable Text single-paragraph pair, for localeBlock fields. */
function biBlock(en) {
  return {en: [ptBlock(en)], ar: [ptBlock(arFor(en))]}
}

/** {en, ar} Portable Text bullet-list pair, for localeBlock fields. */
function biBulletList(items) {
  return {
    en: items.map((t) => ptBlock(t, {listItem: 'bullet', level: 1})),
    ar: items.map((t) => ptBlock(arFor(t), {listItem: 'bullet', level: 1})),
  }
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function slugField(current) {
  return {_type: 'slug', current}
}

function refTo(id) {
  return {_type: 'reference', _ref: id}
}

// ---------------------------------------------------------------------------
// siteSettings (singleton) — from Footer.jsx
// ---------------------------------------------------------------------------

const siteSettingsDoc = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  // logoPath / faviconPath: placeholder string fields carrying the existing
  // public asset path, until real image-asset upload is implemented (Phase 2
  // deliberately does not upload images — see script header / chat summary).
  siteTitle: bi('Align Business Systems'),
  siteDescription: bi(
    'We build the ERP, HR and field-force platforms growing businesses run their operations on — designed, built and supported in-house.',
  ),
  logoPath: '/assets/images/logos/logo-1783092411267.png',
  email: 'info@alignbsystems.com',
  phone: '+92 21 111 254 265',
  address: bi('Karachi, Pakistan'),
  socialLinks: [
    {
      _type: 'socialLink',
      _key: 'linkedin',
      platform: 'linkedin',
      url: 'https://www.linkedin.com/company/align-business-systems',
    },
    {_type: 'socialLink', _key: 'facebook', platform: 'facebook', url: 'https://facebook.com'},
    {_type: 'socialLink', _key: 'instagram', platform: 'instagram', url: 'https://instagram.com'},
    {_type: 'socialLink', _key: 'youtube', platform: 'youtube', url: 'https://youtube.com'},
  ],
}

// ---------------------------------------------------------------------------
// navigation (singleton) — from Header.jsx nav-desktop + mega menus
// ---------------------------------------------------------------------------

const navigationDoc = {
  _id: 'navigation',
  _type: 'navigation',
  title: 'Main navigation',
  items: [
    {_type: 'navItem', _key: 'home', label: bi('Home'), href: '/index.html'},
    {
      _type: 'navItem',
      _key: 'company',
      label: bi('Company'),
      href: '#',
      children: [
        {_type: 'navSubItem', _key: 'about-us', label: bi('About Us'), href: '/about-us.html'},
        {_type: 'navSubItem', _key: 'our-team', label: bi('Our Team'), href: '/our-team.html'},
        {
          _type: 'navSubItem',
          _key: 'our-advisors',
          label: bi('Our Advisors'),
          href: '/our-advisors.html',
        },
        {
          _type: 'navSubItem',
          _key: 'our-partners',
          label: bi('Our Partners'),
          href: '/our-partners.html',
        },
        {
          _type: 'navSubItem',
          _key: 'our-clients',
          label: bi('Our Clients'),
          href: '/our-clients.html',
        },
      ],
    },
    {
      _type: 'navItem',
      _key: 'products',
      label: bi('Products'),
      href: '#',
      children: [
        {
          _type: 'navSubItem',
          _key: 'businessflo',
          label: bi('BusinessFlo'),
          href: 'https://businessflo.co',
        },
        {
          _type: 'navSubItem',
          _key: 'peoplenest',
          label: bi('PeopleNest'),
          href: 'https://peoplenest.co',
        },
        {
          _type: 'navSubItem',
          _key: 'field-force',
          label: bi('Field Force'),
          href: 'https://pharmafieldflo.co',
        },
      ],
    },
    {
      _type: 'navItem',
      _key: 'resources',
      label: bi('Resources'),
      href: '#',
      children: [
        {_type: 'navSubItem', _key: 'events', label: bi('Events'), href: '/events.html'},
        {_type: 'navSubItem', _key: 'careers', label: bi('Careers'), href: '/careers.html'},
        {
          _type: 'navSubItem',
          _key: 'case-studies',
          label: bi('Case Studies'),
          href: '/our-clients.html',
        },
        {
          _type: 'navSubItem',
          _key: 'help-center',
          label: bi('Help Center'),
          href: '/contact-us.html',
        },
      ],
    },
    {
      _type: 'navItem',
      _key: 'our-presence',
      label: bi('Our Presence'),
      href: '/industries.html',
    },
    {_type: 'navItem', _key: 'clients-flat', label: bi('Clients'), href: '/our-clients.html'},
    {
      _type: 'navItem',
      _key: 'contact-us-flat',
      label: bi('Contact Us'),
      href: '/contact-us.html',
    },
  ],
}

// ---------------------------------------------------------------------------
// footer (singleton) — from Footer.jsx
// ---------------------------------------------------------------------------

const footerDoc = {
  _id: 'footer',
  _type: 'footer',
  title: 'Footer',
  columns: [
    {
      _type: 'footerColumn',
      _key: 'company',
      heading: bi('Company'),
      links: [
        {_type: 'footerLink', _key: 'our-team', label: bi('Our Team'), href: '/our-team.html'},
        {
          _type: 'footerLink',
          _key: 'our-advisors',
          label: bi('Our Advisors'),
          href: '/our-advisors.html',
        },
        {
          _type: 'footerLink',
          _key: 'our-partners',
          label: bi('Our Partners'),
          href: '/our-partners.html',
        },
        {_type: 'footerLink', _key: 'careers', label: bi('Careers'), href: '/careers.html'},
        {_type: 'footerLink', _key: 'about-us', label: bi('About Us'), href: '/about-us.html'},
        {
          _type: 'footerLink',
          _key: 'contact-us',
          label: bi('Contact Us'),
          href: '/contact-us.html',
        },
      ],
    },
    {
      _type: 'footerColumn',
      _key: 'products',
      heading: bi('Products'),
      links: [
        {
          _type: 'footerLink',
          _key: 'businessflo',
          label: bi('BusinessFlo'),
          href: 'https://businessflo.co',
        },
        {
          _type: 'footerLink',
          _key: 'peoplenest',
          label: bi('PeopleNest'),
          href: 'https://peoplenest.co',
        },
        {
          _type: 'footerLink',
          _key: 'field-force',
          label: bi('Field Force'),
          href: 'https://pharmafieldflo.co',
        },
      ],
    },
    {
      _type: 'footerColumn',
      _key: 'resources',
      heading: bi('Resources'),
      links: [
        {_type: 'footerLink', _key: 'events', label: bi('Events'), href: '/events.html'},
        {_type: 'footerLink', _key: 'insights', label: bi('Insights'), href: '#'},
        {
          _type: 'footerLink',
          _key: 'case-studies',
          label: bi('Case Studies'),
          href: '/our-clients.html',
        },
        {_type: 'footerLink', _key: 'blog', label: bi('Blog'), href: '#'},
        {
          _type: 'footerLink',
          _key: 'help-center',
          label: bi('Help Center'),
          href: '/contact-us.html',
        },
      ],
    },
  ],
  copyrightText: bi('© 2026 Align Business Systems. All rights reserved.'),
}

// ---------------------------------------------------------------------------
// products — from aboutData.jsx (PRODMETA) + Header.jsx mega-menu copy +
// src/i18n/ar.js (full descriptions)
// ---------------------------------------------------------------------------

const productDocs = [
  {
    _id: 'product-businessflo',
    _type: 'product',
    name: bi('BusinessFlo'),
    slug: slugField('businessflo'),
    tagline: bi('Automate approvals, workflows and operations.'),
    description: biBlock(
      'BusinessFlo moves approvals, workflows, finance, inventory and daily reporting off paper and into one connected ERP — every request routed, every action audited, every number live.',
    ),
    logoPath: '/assets/images/logos/businessflo-logo-6e685b87.png',
    order: 1,
  },
  {
    _id: 'product-peoplenest',
    _type: 'product',
    name: bi('PeopleNest'),
    slug: slugField('peoplenest'),
    tagline: bi('Streamline HR, payroll and employees.'),
    description: biBlock(
      'PeopleNest manages employees, attendance, leave, payroll, performance, documents and every HR workflow from one modern platform — with a self-service view for every employee.',
    ),
    logoPath: '/assets/images/logos/people-nest-logo.png',
    order: 2,
  },
  {
    _id: 'product-pharmafieldflo',
    _type: 'product',
    name: bi('PharmaFieldFlo'),
    slug: slugField('pharmafieldflo'),
    tagline: bi('Plan, track and optimize field activities in real time.'),
    description: biBlock(
      'Field Force plans field visits, tracks calls, manages doctors and pharmacies, and turns territory activity into live field performance analytics — visible the moment it happens.',
    ),
    // no dash-pharmafieldflo product-logo asset exists in public/assets/images/logos —
    // only the About-page dashboard screenshot (dash-pharmafieldflo.webp) does.
    logoPath: '/assets/images/about/dash-pharmafieldflo.webp',
    order: 3,
  },
]

// ---------------------------------------------------------------------------
// teamMember — from teamData.jsx (LEADERS)
// ---------------------------------------------------------------------------

const LEADERS = [
  {
    name: 'Muhammad Shamsheer',
    role: 'Chief Executive Officer',
    photo: 'p-5818',
    quote:
      "We don't ship software — we hand businesses the way they'll run for the next decade.",
  },
  {
    name: 'Ebad ur Rehman',
    role: 'Director Technical',
    photo: 'p-5733',
    quote: "If it isn't rock-solid at 2 AM, it isn't done.",
  },
  {
    name: 'Hadi Shamsheer',
    role: 'Manager, Innovation & Strategy',
    photo: 'p-5850',
    quote:
      'Every great feature begins as a simple question: what would make this effortless?',
  },
  {
    name: 'Sadiq',
    role: 'Implementation Manager',
    photo: 'p-5649',
    quote: "Go-live isn't the finish line — it's the day we start earning your trust.",
  },
]

const teamMemberDocs = LEADERS.map((leader, i) => ({
  _id: `teamMember-${slugify(leader.name)}`,
  _type: 'teamMember',
  name: bi(leader.name),
  role: bi(leader.role),
  bio: bi(leader.quote),
  photoPath: `/assets/images/team/${leader.photo}.webp`,
  order: i + 1,
}))

// ---------------------------------------------------------------------------
// industry — from industriesData.jsx (IND)
// ---------------------------------------------------------------------------

const INDUSTRIES = [
  {
    slug: 'food-beverage-fmcg',
    name: 'Food, Beverage & FMCG',
    head: 'Keeping fast-moving goods moving.',
    para: 'From production runs to distribution and retail, we give food and FMCG businesses one connected view of inventory, orders and margins — so the shelves stay stocked and the numbers stay clean.',
    img: 'retail',
  },
  {
    slug: 'pharmaceutical-healthcare',
    name: 'Pharmaceutical & Healthcare',
    head: 'Precision where it matters most.',
    para: 'We help pharmaceutical and healthcare organizations run compliant, traceable operations — from field teams to inventory — with the accuracy the sector demands.',
    img: 'pharma',
  },
  {
    slug: 'lighting-electrical',
    name: 'Lighting & Electrical',
    head: 'Powering the businesses that light rooms.',
    para: 'Lighting and electrical suppliers rely on us to tie procurement, stock and sales into one system — clear visibility from warehouse to invoice.',
    img: 'manufacturing',
  },
  {
    slug: 'construction-building-real-estate',
    name: 'Construction, Building & Real Estate',
    head: 'Structure for the businesses that build.',
    para: 'We bring order to complex builds — projects, procurement, assets and finance in one place — so construction and real estate teams stay on schedule and on budget.',
    img: 'enterprise',
  },
  {
    slug: 'energy-solar',
    name: 'Energy & Solar',
    head: 'Systems for a cleaner grid.',
    para: 'From project pipelines to field installs, we help solar and energy operators manage the moving parts — keeping deployments organized and accountable.',
    img: 'distribution',
  },
  {
    slug: 'technology-mobility',
    name: 'Technology & Mobility',
    head: 'Built for the businesses building tomorrow.',
    para: 'Technology and mobility innovators partner with us for systems that scale as fast as they do — flexible, connected and ready for what’s next.',
    img: 'services',
  },
]

const industryDocs = INDUSTRIES.map((ind, i) => ({
  _id: `industry-${ind.slug}`,
  _type: 'industry',
  name: bi(ind.name),
  slug: slugField(ind.slug),
  description: bi(`${ind.head} ${ind.para}`),
  illustrationPath: `/assets/images/industries/${ind.img}.webp`,
  order: i + 1,
}))

// ---------------------------------------------------------------------------
// client — from clientsData.jsx (CLIENTS + SECTORS/INDOF)
// ---------------------------------------------------------------------------

const CLIENTS = [
  ['BusCaro', 'buscaro-logo-original-scaled'],
  ['Powerhouse Building Solutions', 'powerhouse-builiding-solution-logo'],
  ['Dipitt', 'dipitt-logo'],
  ['NexTek HealthCare', 'nectek-logo'],
  ['Allied', 'allied-logo'],
  ['Techexons', 'techexons-logo'],
  ['Coarts Lighting Solutions', 'coarts-lighting-solutin'],
  ['Oncogen Pharma', 'oncogen-pharma-pakistan-logo'],
  ['KG (King’s Group)', 'kg-logo'],
  ['Zamanat', 'zamanat-logo'],
  ['Danpak', 'danpak-logo'],
  ['Noon', 'noon-logo'],
  ['greenO', 'greeeno-logo'],
  ['PV360', null],
  ['Clipsal', 'clipsal-logo'],
  ['Maxim', 'maxim-logo'],
  ['FIPCo', null],
  ['Hasco Steel', null],
  ['VSolar', 'vsolar-logo'],
  ['Omega Enterprises', 'omega-enterprises-logo'],
]

// Mirrors clientsData.jsx's SECTORS -> INDOF derivation (client name -> industry slug).
const CLIENT_INDUSTRY = {
  Dipitt: 'food-beverage-fmcg',
  Danpak: 'food-beverage-fmcg',
  greenO: 'food-beverage-fmcg',
  FIPCo: 'food-beverage-fmcg',
  Maxim: 'food-beverage-fmcg',
  'Oncogen Pharma': 'pharmaceutical-healthcare',
  'NexTek HealthCare': 'pharmaceutical-healthcare',
  'Coarts Lighting Solutions': 'lighting-electrical',
  Clipsal: 'lighting-electrical',
  Allied: 'lighting-electrical',
  'Powerhouse Building Solutions': 'construction-building-real-estate',
  Zamanat: 'construction-building-real-estate',
  'Hasco Steel': 'construction-building-real-estate',
  'KG (King’s Group)': 'construction-building-real-estate',
  PV360: 'energy-solar',
  VSolar: 'energy-solar',
  BusCaro: 'technology-mobility',
  Techexons: 'technology-mobility',
  Noon: 'technology-mobility',
  'Omega Enterprises': 'technology-mobility',
}

const clientDocs = CLIENTS.map(([name, logoSlug], i) => {
  const industrySlug = CLIENT_INDUSTRY[name]
  return {
    _id: `client-${slugify(name)}`,
    _type: 'client',
    name,
    ...(industrySlug ? {industry: refTo(`industry-${industrySlug}`)} : {}),
    ...(logoSlug ? {logoPath: `/assets/images/clients/${logoSlug}.webp`} : {}),
    order: i + 1,
  }
})

// ---------------------------------------------------------------------------
// event — from eventsData.jsx (FACTS). Only one concrete event exists in the
// current site content: ITCN Asia 2023.
// ---------------------------------------------------------------------------

const eventDocs = [
  {
    _id: 'event-itcn-asia-2023',
    _type: 'event',
    title: bi('ITCN Asia 2023'),
    slug: slugField('itcn-asia-2023'),
    location: bi('Karachi Expo Centre, Pakistan'),
    description: biBlock(
      "Align Business Systems exhibited at ITCN Asia 2023, Pakistan's leading IT & telecom expo, at Hall 1 · Booth A-30, Karachi Expo Centre.",
    ),
    coverImagePath: '/assets/images/about/itcn-wall.webp',
    galleryPaths: [
      '/assets/images/about/itcn-wall.webp',
      '/assets/images/about/booth-team.webp',
      '/assets/images/about/booth-demo.webp',
      '/assets/images/about/brochure.webp',
    ],
  },
]

// ---------------------------------------------------------------------------
// job — from careersData.jsx (ROLES)
// ---------------------------------------------------------------------------

const ROLES = [
  {
    title: '.NET Developer',
    loc: 'Karachi, Pakistan',
    dept: 'Engineering',
    type: 'Full-time',
    desc: 'Join the team building and maintaining the core ERP platform — working across the modules that businesses run their finance, inventory and operations on every day.',
    reqs: [
      'Strong hands-on experience with .NET / C#',
      'Comfortable with SQL Server and data-driven applications',
      'Ability to work directly with product and support teams',
    ],
  },
  {
    title: 'ERP Sales Executive',
    loc: 'Karachi, Pakistan',
    dept: 'Sales',
    type: 'Full-time',
    desc: 'Own the conversation with growing businesses evaluating Align — understanding their operations and showing them how our platform fits.',
    reqs: [
      'Experience selling B2B software or ERP solutions',
      'Comfortable running product demos and discovery calls',
      'Strong communication in English and Urdu',
    ],
  },
]

const jobDocs = ROLES.map((role, i) => ({
  _id: `job-${slugify(role.title)}`,
  _type: 'job',
  title: bi(role.title),
  slug: slugField(slugify(role.title)),
  department: role.dept,
  location: bi(role.loc),
  employmentType: slugify(role.type),
  description: biBlock(role.desc),
  requirements: biBulletList(role.reqs),
  applyEmail: 'talent@alignbsystems.com',
  isActive: true,
  order: i + 1,
}))

// ---------------------------------------------------------------------------
// page — one per route. heroTitle/heroSubtitle sourced from Header.jsx's
// mega-menu item copy where available; `body` intentionally left unset (no
// clean flowing prose exists in the data files to migrate without inventing
// content — see chat summary "Limitations").
// ---------------------------------------------------------------------------

const PAGES = [
  {
    slug: 'home',
    title: 'Home',
    heroTitle: 'Transform your operations.',
    heroSubtitle: 'Enterprise software, built around how you actually work.',
  },
  {
    slug: 'about-us',
    title: 'About Us',
    heroTitle: 'About Us',
    heroSubtitle: 'Enterprise software, built in-house.',
  },
  {
    slug: 'our-team',
    title: 'Our Team',
    heroTitle: 'Our Team',
    heroSubtitle: 'Meet the people behind Align.',
  },
  {
    slug: 'our-advisors',
    title: 'Our Advisors',
    heroTitle: 'Our Advisors',
    heroSubtitle: 'Industry experts guiding our vision.',
  },
  {
    slug: 'our-partners',
    title: 'Our Partners',
    heroTitle: 'Our Partners',
    heroSubtitle: 'Trusted collaborations that scale.',
  },
  {
    slug: 'our-clients',
    title: 'Our Clients',
    heroTitle: 'Our Clients',
    heroSubtitle: 'Businesses that grow with Align.',
  },
  {
    slug: 'industries',
    title: 'Our Presence',
    heroTitle: 'Our Presence',
    heroSubtitle: null,
  },
  {
    slug: 'events',
    title: 'Events',
    heroTitle: 'Events',
    heroSubtitle: 'Where Align shows up in the industry.',
  },
  {
    slug: 'careers',
    title: 'Careers',
    heroTitle: 'Careers',
    heroSubtitle: 'Build the systems businesses run on.',
  },
  {
    slug: 'contact-us',
    title: 'Contact Us',
    heroTitle: 'Contact Us',
    heroSubtitle: 'Guidance and support when you need it.',
  },
]

const pageDocs = PAGES.map((p) => ({
  _id: `page-${p.slug}`,
  _type: 'page',
  title: bi(p.title),
  slug: slugField(p.slug),
  heroTitle: bi(p.heroTitle),
  ...(p.heroSubtitle ? {heroSubtitle: bi(p.heroSubtitle)} : {}),
}))

// ---------------------------------------------------------------------------
// Assemble + write
// ---------------------------------------------------------------------------

const documents = [
  siteSettingsDoc,
  navigationDoc,
  footerDoc,
  ...productDocs,
  ...teamMemberDocs,
  ...industryDocs,
  ...clientDocs,
  ...eventDocs,
  ...jobDocs,
  ...pageDocs,
]

function summarizeByType(docs) {
  const counts = {}
  for (const doc of docs) counts[doc._type] = (counts[doc._type] || 0) + 1
  return counts
}

async function main() {
  const counts = summarizeByType(documents)

  console.log(`${DRY_RUN ? '[dry run] ' : ''}Seeding ${documents.length} documents:`)
  for (const [type, count] of Object.entries(counts)) {
    console.log(`  ${type}: ${count}`)
  }
  console.log('  advisor: 0 (no named advisors in advisorsData.jsx — see Limitations)')
  console.log('  partner: 0 (no named partners in partnersData.jsx — see Limitations)')

  if (DRY_RUN) {
    console.log('\nDocument _ids that would be written:')
    for (const doc of documents) console.log(`  ${doc._type.padEnd(12)} ${doc._id}`)
    console.log('\nDry run complete — nothing was written to Sanity.')
    return
  }

  let tx = client.transaction()
  for (const doc of documents) tx = tx.createOrReplace(doc)

  console.log('\nCommitting transaction...')
  const result = await tx.commit()
  console.log(`Done. ${result.results.length} documents written.`)
}

main().catch((err) => {
  console.error('\nSeed script failed:')
  console.error(err.message || err)
  process.exit(1)
})
