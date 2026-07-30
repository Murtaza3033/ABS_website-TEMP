#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from the site's static routes + Sanity
 * product slugs, and keeps public/robots.txt's `Sitemap:` line in sync.
 *
 * Safe by design:
 *  - Requires VITE_SITE_URL (root .env, same variable SEO.jsx reads for
 *    canonical/og:url). If it's not set, this exits without writing
 *    anything or guessing a domain — matches SEO.jsx's own fallback rule.
 *  - Uses the read-only public client (no token) — never sees drafts, so
 *    unpublished documents can never end up in the sitemap.
 *  - Only lists routes that actually exist in App.jsx today (no per-event
 *    or per-job detail pages — those are single list pages, not routed
 *    individually).
 *
 * Usage (from studio/):
 *   npm run generate:sitemap
 */
import {config as loadEnv} from 'dotenv'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import {createClient} from '@sanity/client'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STUDIO_DIR = path.join(__dirname, '..')
const PROJECT_ROOT = path.join(STUDIO_DIR, '..')

// VITE_SITE_URL / VITE_SANITY_* live in the root .env (the Vite frontend's
// config) — this script deliberately does not touch studio/.env or its
// write token, since generating a sitemap only ever reads published content.
loadEnv({path: path.join(PROJECT_ROOT, '.env')})

const SITE_URL = (process.env.VITE_SITE_URL || '').replace(/\/+$/, '')

if (!SITE_URL) {
  console.log('VITE_SITE_URL is not set in the root .env — skipping sitemap generation.')
  console.log('Nothing was written. Set VITE_SITE_URL=https://yourdomain.com once the')
  console.log('production domain is finalized, then re-run `npm run generate:sitemap`.')
  process.exit(0)
}

const projectId = process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const apiVersion = process.env.VITE_SANITY_API_VERSION || '2024-01-01'

if (!projectId) {
  throw new Error('Missing VITE_SANITY_PROJECT_ID in root .env')
}

const client = createClient({projectId, dataset, apiVersion, useCdn: false})

// Every static route currently mounted in src/App.jsx. Events/Careers are
// single list pages with no per-item detail route, so no per-event/per-job
// URLs are generated — adding them here would be inventing routes that
// don't exist.
const STATIC_ROUTES = [
  '/',
  '/about-us',
  '/our-team',
  '/our-advisors',
  '/our-partners',
  '/our-clients',
  '/industries',
  '/events',
  '/careers',
  '/contact-us',
  '/products',
]

function updateRobotsTxt(sitemapUrl) {
  const robotsPath = path.join(PROJECT_ROOT, 'public', 'robots.txt')
  if (!fs.existsSync(robotsPath)) return
  const current = fs.readFileSync(robotsPath, 'utf8')
  const withoutOldSitemapLines = current
    .split('\n')
    .filter((line) => !line.trim().toLowerCase().startsWith('sitemap:'))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+$/, '')
  const next = `${withoutOldSitemapLines}\n\nSitemap: ${sitemapUrl}\n`
  fs.writeFileSync(robotsPath, next, 'utf8')
  console.log('Updated public/robots.txt with the Sitemap line.')
}

async function main() {
  // The public client has no token, so drafts (which require authenticated
  // read access) are never returned — only published product slugs.
  const productSlugs = await client.fetch(
    `*[_type == "product" && defined(slug.current)] | order(order asc).slug.current`,
  )
  const productRoutes = productSlugs.map((slug) => `/products/${slug}`)
  const routes = [...STATIC_ROUTES, ...productRoutes]

  const today = new Date().toISOString().slice(0, 10)
  const urls = routes
    .map((route) => {
      const loc = `${SITE_URL}${route}`
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

  const outPath = path.join(PROJECT_ROOT, 'public', 'sitemap.xml')
  fs.writeFileSync(outPath, xml, 'utf8')

  console.log(
    `Wrote ${routes.length} URLs to public/sitemap.xml (${STATIC_ROUTES.length} static + ${productRoutes.length} product routes):`,
  )
  routes.forEach((r) => console.log(`  ${SITE_URL}${r}`))

  updateRobotsTxt(`${SITE_URL}/sitemap.xml`)
}

main().catch((err) => {
  console.error('Sitemap generation failed:')
  console.error(err.message || err)
  process.exit(1)
})
