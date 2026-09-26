# Align Business Systems: Sanity Studio

CMS for the website in the repo root. Project `5knwlrie`, dataset `production`
(set in `sanity.config.js` and `sanity.cli.js`). The site reads published content only.

## Run the Studio

```bash
npm install
cp .env.example .env     # needed by the scripts below, not by the Studio itself
npm run dev              # http://localhost:3333
```

`npm run build` builds the Studio into `dist/`. `npm run deploy` publishes it to sanity.studio.

## Content model

- `schemaTypes/documents/`: one file per document type (pages, products, industries, clients,
  partners, team members, events, jobs, contact submissions, and more).
- `schemaTypes/objects/`: shared field types. `locale` holds `{en, ar}` text; `seo` holds page SEO.
- **Singletons**: `siteSettings`, `navigation` and `footer` each have exactly one document with a
  fixed `_id`, because the site queries them by that id. The Studio pins them in the sidebar and
  hides create, duplicate, delete and unpublish for them.
- `contactSubmission` documents are written by the site's `api/contact.js` (leads).

## Scripts

Scripts read `studio/.env`: `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` (required,
also for dry runs) and `SANITY_WRITE_TOKEN` (only for real writes; see the header of
`scripts/seed.mjs` for how to create an Editor token). Always run the dry run first.

| Command | What it does |
|---|---|
| `npm run seed:dry-run` | Lists every document the seed would write. No network, no token |
| `npm run seed` | Writes the site's built-in content to Sanity with fixed ids (`createOrReplace`, so re-runs update instead of duplicating). Arabic comes from `../src/i18n/ar.js` |
| `npm run upload-assets:dry-run` | Lists local images that would be uploaded. Writes nothing |
| `npm run upload-assets` | Uploads the images referenced by `*Path` fields and fills the matching image fields |
| `npm run generate:sitemap` | Writes `../public/sitemap.xml` and `../public/robots.txt` from published content. Reads the **root** `.env` (`VITE_SITE_URL`, `VITE_SANITY_*`); skips if `VITE_SITE_URL` is empty |

Environment variables can also be given on the command line, for example:

```bash
SANITY_STUDIO_PROJECT_ID=5knwlrie SANITY_STUDIO_DATASET=production node scripts/seed.mjs --dry-run
```

This folder has its own `eslint.config.mjs`; the root ESLint config ignores `studio/`.
