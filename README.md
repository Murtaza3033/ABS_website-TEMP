# Align Business Systems website

Marketing site for **Align Business Systems** (BusinessFlo, PeopleNest, Field Force). It is a
single-page app in English and Arabic (RTL). Content comes from Sanity CMS, and a Vercel
serverless function handles the contact form and sales-bot leads.

## Stack

- **React 19** + **Vite 6**, with the React Compiler (Babel plugin, see `vite.config.js`)
- **react-router 7**: every page except Home is a `lazy()` route chunk
- **@tanstack/react-query** + **@sanity/client** for published CMS content (read-only in the browser)
- **react-helmet-async** for per-page SEO tags
- **Vercel**: static hosting plus `api/contact.js` (Node serverless function)
- **Sanity Studio** in `studio/` (a separate npm project)

## Folder structure

```
.
├── api/                  Vercel serverless functions
│   ├── contact.js        POST /api/contact (contact form + sales-bot leads)
│   └── _lib/             helpers (CORS, Turnstile, rate limit, email, Sanity write)
├── docs/                 guides, QA report, content sheets (see docs/README.md)
├── public/               static files served as-is (images, robots.txt, sitemap.xml)
├── src/
│   ├── main.jsx          entry: providers; waits for the Arabic dictionary if Arabic is stored
│   ├── App.jsx           routes + global CSS imports (order matters)
│   ├── assets/           bundled images
│   ├── components/       site shell and shared components (Header, Footer, SalesBot, SEO, ...)
│   ├── context/          LanguageContext (t(), lang, dir)
│   ├── hooks/useCms.js   react-query hooks for Sanity content
│   ├── i18n/
│   │   ├── ar.js         Arabic dictionary (English source string -> Arabic)
│   │   └── translator.js lazy dictionary loader, Arabic font, tr()
│   ├── lib/              Sanity client, GROQ queries, adapters, contact API client
│   ├── pages/<Page>/     one folder per route: <Page>.jsx, sub-components, <page>Data.(js|jsx)
│   │   └── Home/sections/hero/   per-product hero mockups
│   └── styles/           all CSS (one sheet per page + shared.css + i18n.css)
├── studio/               Sanity Studio + content scripts (see studio/README.md)
├── eslint.config.js
├── index.html
├── vercel.json           .html redirects + SPA rewrite
└── vite.config.js
```

All CSS is imported once, eagerly, in `src/App.jsx`. Page sheets share global class names, so
the import order decides the cascade: keep it as is, and keep `shared.css` and `i18n.css` last.
Don't import CSS from page components.

## Setup

Requires **Node.js 20 or newer** (`.nvmrc` pins 24, the version used in development).

```bash
npm install
cp .env.example .env      # then fill in values
npm run dev               # http://localhost:5173
```

The site runs without the API: in `npm run dev`, `/api/contact` isn't served, so form
submissions fail. Use `vercel dev` to run the function locally.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR on http://localhost:5173 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves `dist/` locally (http://localhost:4173) |
| `npm run lint` | ESLint (`src/`, `api/`, root config files; `studio/` has its own config) |

## Environment variables

Copy `.env.example` to `.env`. `VITE_*` values are compiled into the public bundle, so never put
a secret in one. The others are read only by `api/` and must also be set in Vercel.

| Variable | Used by | Purpose |
|---|---|---|
| `VITE_SANITY_PROJECT_ID` | frontend | Sanity project to read published content from |
| `VITE_SANITY_DATASET` | frontend | Dataset (default `production`) |
| `VITE_SANITY_API_VERSION` | frontend | Sanity API date (default `2024-01-01`) |
| `VITE_SITE_URL` | frontend, sitemap script | Canonical origin, no trailing slash. Empty = no canonical tags, sitemap skipped |
| `VITE_TURNSTILE_SITE_KEY` | frontend | Cloudflare Turnstile public key. Empty = widget not rendered |
| `VITE_WHATSAPP_NUMBER` | frontend | Sales-bot WhatsApp hand-off, digits only. Empty = hidden |
| `SANITY_PROJECT_ID`, `SANITY_DATASET` | API | Where leads are stored (fall back to `SANITY_STUDIO_*`) |
| `SANITY_WRITE_TOKEN` | API | **Secret.** Sanity token with write access |
| `ALLOWED_ORIGIN` | API | Production origin allowed to POST `/api/contact` (CORS) |
| `TURNSTILE_SECRET_KEY` | API | **Secret.** Turnstile verification. Empty = skipped |
| `RESEND_API_KEY` | API | **Secret.** Resend key for notification emails. Empty = no email (lead still stored) |
| `CONTACT_FROM_EMAIL` | API | Verified sender address |
| `SALES_EMAIL`, `TALENT_EMAIL`, `DEFAULT_NOTIFY_EMAIL` | API | Notification recipients (sales, careers, fallback) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | API | Per-IP rate limiting (token is secret). Empty = skipped |

## Sanity Studio

The CMS schema and content scripts live in `studio/` (project `5knwlrie`, dataset `production`).

```bash
cd studio
npm install
cp .env.example .env     # SANITY_STUDIO_PROJECT_ID / _DATASET, plus SANITY_WRITE_TOKEN for writes
npm run dev              # Studio on http://localhost:3333
```

| Command (in `studio/`) | What it does |
|---|---|
| `npm run seed:dry-run` | Shows the documents the seed would write. Writes nothing |
| `npm run seed` | Writes seed content to Sanity (needs `SANITY_WRITE_TOKEN`) |
| `npm run upload-assets:dry-run` | Shows which local images would be uploaded. Writes nothing |
| `npm run upload-assets` | Uploads images and patches documents (needs `SANITY_WRITE_TOKEN`) |
| `npm run generate:sitemap` | Writes `public/sitemap.xml` + `public/robots.txt` from the root `.env` (skips if `VITE_SITE_URL` is empty) |
| `npm run build` | Builds the Studio into `studio/dist/` |

See `studio/README.md` for details.

## Deployment (Vercel)

1. Import the repo in Vercel. Framework preset: **Vite** (build `npm run build`, output `dist`).
   Set the Node.js version to match `.nvmrc`.
2. Add every variable from the table above under **Project > Settings > Environment Variables**.
   Required for the contact form in production: `ALLOWED_ORIGIN`, `SANITY_WRITE_TOKEN`,
   `SANITY_PROJECT_ID`, `SANITY_DATASET`. Recommended: `VITE_TURNSTILE_SITE_KEY` +
   `TURNSTILE_SECRET_KEY` (bot protection), `RESEND_API_KEY` + `CONTACT_FROM_EMAIL` + recipient
   addresses (email alerts), and the Upstash pair (rate limiting).
3. `VITE_*` values are baked in at build time: redeploy after changing them.

`vercel.json` redirects the old `*.html` URLs and rewrites every non-file, non-API path to
`index.html` so client-side routes work on reload.

## i18n (Arabic)

- UI text is written in English and wrapped in `t()` from `useLanguage()`
  (`src/context/LanguageContext.jsx`). The English string itself is the key.
- **To add or change a translation**, add an entry to the `AR` object in `src/i18n/ar.js`:
  `'Exact English text': 'النص العربي',`. The key must match the English string exactly;
  missing keys fall back to English.
- `ar.js` is loaded on demand as its own file, so English visitors never download it. The
  choice is stored in `localStorage.alignLang`. RTL layout fixes live in `src/styles/i18n.css`.
- CMS content has its own `{en, ar}` fields, edited in the Studio.
- `studio/scripts/seed.mjs` also imports `src/i18n/ar.js` to seed Arabic fields.

## QA

The QA report (test cases, change log, owner actions) is `docs/qa/ABS-QA-Report.xlsx`.
See `docs/README.md` for the other documents.
