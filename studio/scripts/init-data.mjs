#!/usr/bin/env node
/**
 * Initial Data Population Script
 * Adds foundational content to Sanity CMS:
 * - Site Settings
 * - Products (BusinessFlo, PeopleNest, Field Force)
 * - Navigation
 * - Team Members (sample)
 */

import { config as loadEnv } from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createClient } from '@sanity/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, '..', '.env') });

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '5knwlrie';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('❌ ERROR: SANITY_WRITE_TOKEN not found in studio/.env');
  console.error('Please create studio/.env with your Sanity write token.');
  console.error('See studio/.env.example for instructions.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-01-01',
});

const documents = [
  // Site Settings
  {
    _id: 'site-settings',
    _type: 'siteSettings',
    companyName: 'Align Business Systems',
    tagline: 'Enterprise software, built for growing businesses',
    description: 'We build powerful systems that empower growing businesses.',
    phone: '+92 (300) XXX-XXXX',
    email: 'info@alignbsystems.com',
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/align-business-systems' },
      { platform: 'Twitter', url: 'https://twitter.com/alignbsystems' },
    ],
  },

  // Products
  {
    _id: 'product-businessflo',
    _type: 'product',
    title: 'BusinessFlo',
    slug: { current: 'businessflo' },
    description: 'Go 100% paperless. Transform your operations.',
    longDescription:
      'BusinessFlo moves approvals, workflows, finance, inventory and daily reporting off paper and into one connected ERP — every request routed, every action audited, every number live.',
    features: [
      'Approvals & Workflows',
      'Finance & Accounting',
      'Inventory Management',
      'Daily Reporting',
      'Audit Trail',
      'Real-time Analytics',
    ],
    category: 'ERP',
  },

  {
    _id: 'product-peoplenest',
    _type: 'product',
    title: 'PeopleNest',
    slug: { current: 'peoplenest' },
    description: 'One platform for all your workspace operations.',
    longDescription:
      'PeopleNest manages employees, attendance, leave, payroll, performance, documents and every HR workflow from one modern platform — with a self-service view for every employee.',
    features: [
      'Employee Management',
      'Attendance & Leave',
      'Payroll Processing',
      'Performance Analytics',
      'Document Management',
      'Self-Service Portal',
    ],
    category: 'HRIS',
  },

  {
    _id: 'product-field-force',
    _type: 'product',
    title: 'Field Force',
    slug: { current: 'pharmafieldflo' },
    description: 'Track every call. Empower your field force.',
    longDescription:
      'Field Force plans field visits, tracks calls, manages doctors and pharmacies, and turns territory activity into live field performance analytics — visible the moment it happens.',
    features: [
      'Territory Planning',
      'Call Tracking',
      'Visit Management',
      'Live Analytics',
      'Performance Dashboard',
      'Mobile App',
    ],
    category: 'Field Management',
  },

  // Navigation
  {
    _id: 'navigation',
    _type: 'navigation',
    items: [
      {
        _key: 'home',
        label: 'Home',
        href: '/',
      },
      {
        _key: 'company',
        label: 'Company',
        href: '#',
        submenu: [
          { label: 'About Us', href: '/about-us' },
          { label: 'Our Team', href: '/our-team' },
          { label: 'Our Advisors', href: '/our-advisors' },
          { label: 'Our Partners', href: '/our-partners' },
          { label: 'Our Clients', href: '/our-clients' },
        ],
      },
      {
        _key: 'products',
        label: 'Products',
        href: '/products',
        submenu: [
          { label: 'BusinessFlo', href: '/products/businessflo' },
          { label: 'PeopleNest', href: '/products/peoplenest' },
          { label: 'Field Force', href: '/products/pharmafieldflo' },
        ],
      },
      {
        _key: 'resources',
        label: 'Resources',
        href: '#',
        submenu: [
          { label: 'Events', href: '/events' },
          { label: 'Careers', href: '/careers' },
          { label: 'Blog', href: '/blog' },
        ],
      },
      {
        _key: 'industries',
        label: 'Industries',
        href: '/industries',
      },
      {
        _key: 'contact',
        label: 'Contact Us',
        href: '/contact-us',
      },
    ],
  },

  // Team Members (Sample)
  {
    _id: 'team-ceo',
    _type: 'teamMember',
    name: 'CEO Name',
    role: 'Chief Executive Officer',
    email: 'ceo@alignbsystems.com',
    bio: 'Visionary leader with 15+ years of experience in enterprise software.',
    department: 'Executive',
  },

  {
    _id: 'team-cto',
    _type: 'teamMember',
    name: 'CTO Name',
    role: 'Chief Technology Officer',
    email: 'cto@alignbsystems.com',
    bio: 'Tech innovator passionate about building scalable systems.',
    department: 'Engineering',
  },

  {
    _id: 'team-product-head',
    _type: 'teamMember',
    name: 'Product Head Name',
    role: 'VP Product',
    email: 'product@alignbsystems.com',
    bio: 'Customer-focused product leader with a track record of successful launches.',
    department: 'Product',
  },
];

async function seedData() {
  console.log('🌱 Starting data seeding...\n');

  try {
    for (const doc of documents) {
      console.log(`📝 Creating/updating: ${doc._id}...`);
      await client.createOrReplace(doc);
      console.log(`✅ ${doc._id}\n`);
    }

    console.log('🎉 Data seeding complete!');
    console.log('\n📊 Summary:');
    console.log('  ✓ Site Settings');
    console.log('  ✓ 3 Products (BusinessFlo, PeopleNest, Field Force)');
    console.log('  ✓ Navigation Menu');
    console.log('  ✓ 3 Sample Team Members');
    console.log('\n🚀 Next steps:');
    console.log('  1. Go to http://localhost:5173 and refresh');
    console.log('  2. Check if products and team members appear');
    console.log('  3. Add more team members, clients, and content via Sanity Studio');
  } catch (err) {
    console.error('❌ Error seeding data:', err.message);
    process.exit(1);
  }
}

seedData();
