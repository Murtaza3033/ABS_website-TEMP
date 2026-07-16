# Align Business Systems — Website (React + Vite)

The marketing website for **Align Business Systems** — a Pakistan‑based company that builds
the ERP, HR and field‑force platforms (BusinessFlo, PeopleNest, Field Force) that growing
businesses run their day‑to‑day operations on.

This is the **React (Vite) build** of the site. It was converted, page for page, from a
hand‑authored static HTML/CSS/JS version (kept at `../Align_Business_Systems/`) with the goal
of **identical appearance, animation and behavior** — a faithful structural port, not a redesign.

- **11 routes** (Home + 10 pages), a persistent site shell (nav, footer, sales‑bot), and a
  full **English ⇄ Arabic (RTL)** toggle.
- Live dev preview: `npm run dev` → **http://localhost:5173**

---

## Table of contents
1. [Tech stack](#tech-stack)
2. [Running locally](#running-locally)
3. [Brand system](#brand-system)
4. [Pages](#pages)
5. [Shared shell (Header / Footer / Sales‑bot / Language)](#shared-shell)
6. [Bilingual / RTL](#bilingual--rtl)
7. [Sales chatbot](#sales-chatbot)
8. [Project structure](#project-structure)
9. [How the conversion works (architecture)](#how-the-conversion-works-architecture)
10. [Assets & images](#assets--images)
11. [Notable decisions & gotchas](#notable-decisions--gotchas)
12. [Relationship to the other folders](#relationship-to-the-other-folders)
13. [Follow‑ups / roadmap](#follow-ups--roadmap)

---

## Tech stack
| | |
|---|---|
| **Framework** | React 19 |
| **Build tool** | Vite 6 (`@vitejs/plugin-react`) — esbuild (dev) + Rollup (build) |
| **Routing** | `react-router-dom` 7 (`BrowserRouter`) |
| **Language/RTL** | React Context + a small i18n layer (no external i18n lib) |
| **Styling** | Plain CSS (per‑page stylesheets + one shared stylesheet), no CSS framework |
| **Fonts** | Google Fonts — Outfit + Caveat (Latin), Cairo (loaded at runtime for Arabic) |
| **Dependencies** | **Only** `react`, `react-dom`, `react-router-dom` at runtime |

> **Toolchain note:** `create-vite` currently scaffolds the bleeding‑edge Vite 8 (Rolldown),
> whose Windows native binary failed to load here. This project is intentionally pinned to the
> **stable Vite 6 + `@vitejs/plugin-react` 4**.

## Running locally
```bash
npm install          # install dependencies
npm run dev          # start the dev server → http://localhost:5173
npm run build        # production build → dist/
npm run preview      # serve the production build locally
```
No environment variables or backend are required — it's a fully static front‑end.

## Brand system
**Fonts** — Outfit (UI/body & headings), Caveat (handwritten accents), Cairo (Arabic, runtime‑loaded).

**Colors**

| Token | Value | Use |
|---|---|---|
| Primary Blue | `rgb(26, 86, 219)` | primary actions, links, accents |
| Dark Slate | `rgb(15, 23, 41)` | dark sections, ink text |
| Light Tint | `rgb(247, 250, 255)` | soft section backgrounds |
| Pure White | `#ffffff` | base background |

Tokens live as CSS custom properties (`--blue`, `--slate`, `--tint`, …) in the shared stylesheet
and are reused across every page.

## Pages
All routes match the original site's URLs.

| Route | Page | Highlights |
|---|---|---|
| `/` | **Home** | Live product switcher (BusinessFlo / PeopleNest / Field Force) with per‑product dashboard mockups + live clock; client mosaic; "How we think"; problems→aligned; product tabs; services orbit + carousel + modal; industry tabs; CTA |
| `/contact-us` | **Contact Us** | Four‑state reach‑us flow (quick chat ↔ classic form ↔ done); country‑code phone with per‑country digit validation; pan/zoom presence map; contact cards |
| `/about-us` | **About Us** | Journey milestones, stats, recognition gallery, sliding "what we build" carousel, network hub |
| `/our-team` | **Our Team** | Dark theme; particle‑network canvas backdrop; scroll‑drawn spine + spine nav; four leadership scenes; count‑up stats; "The Align Way" culture |
| `/our-advisors` | **Our Advisors** | Aurora hero + word‑reveal; orbiting‑hub avatar; six Areas of Guidance (3D tilt + index numbers); dark "why" band; scroll‑drawn timeline |
| `/our-partners` | **Our Partners** | Network‑constellation canvas hero; "value flowing both ways" duotone card; featured partner; 6‑benefit drag carousel with autoplay progress |
| `/our-clients` | **Our Clients** | Dot‑field hero + word‑reveal + count‑up; floating logo wall with **industry filter**; six‑industry convergence graphic; dark by‑the‑numbers band |
| `/industries` | **Industries** — *nav label "Our Presence"* | Photo‑montage hero; 6‑tab auto‑rotating showcase (Ken‑Burns + parallax, per‑industry modules/stats); clickable convergence map |
| `/events` | **Events** | Photo‑montage hero; interactive gallery + full‑screen lightbox (keyboard/click nav); "why we show up" cards; upcoming band |
| `/careers` | **Careers** | Word‑reveal hero + live "open roles" stat; culture cards; filterable open‑roles accordion; "how hiring works" timeline |

> **Naming note:** the file/route is `industries` but its nav label is **"Our Presence."** The
> filename is kept as‑is (renaming would touch every internal link) — documented rather than renamed.

## Shared shell
Rendered once in `App.jsx`, **outside** `<Routes>`, so they persist across navigation without
re‑mounting:

- **`Header`** — logo, the three mega‑menu dropdowns (Company / Products / Resources), the
  top‑level links (Our Presence, About Us, Clients, Contact Us), the apps icon, the language
  toggle, and "Book a Demo"; plus a mobile burger + slide‑in menu, an `is‑scrolled` state, and
  active‑link highlighting.
- **`Footer`** — brand + contact block, Company / Products / Resources link columns, feature
  row, socials, legal; scroll‑reveal on view.
- **`SalesBot`** — the floating "Align Assistant" chat widget.
- **`LanguageToggle`** — the EN / عربي pill.
- **`SmartLink`** — routing helper: internal `.html`‑style hrefs → React Router `<Link>`
  (with the nav active‑highlight), external / `mailto:` / `tel:` / `#` → plain `<a>`.
- **`ScrollToTop`** — the back‑to‑top button.

## Bilingual / RTL
`LanguageContext` holds the current language, persists it to `localStorage`, and drives a small
i18n layer that:
- sets `dir="rtl"` / `lang="ar"` on `<html>` so the **whole app mirrors** (not just the nav),
- loads the **Cairo** Arabic font on demand,
- injects an RTL CSS layer (e.g. the sales‑bot moves to the bottom‑left in Arabic),
- swaps known English strings → Arabic (a placeholder dictionary — see roadmap) and flips
  directional arrow glyphs,
- re‑applies across route changes / React re‑renders via a `MutationObserver`.

The toggle state is global (Context), so it persists as you navigate between pages.

## Sales chatbot
A self‑contained assistant with a full conversation engine: greeting → main menu → product menu,
a 10‑item FAQ, lead capture (name / company / email / company‑size), and a human‑handoff panel
with email / call / WhatsApp / careers channels and socials. Open/close state + captured details
persist in `localStorage`.

## Project structure
```
Align_Business_Systems-react/
├── index.html                 # #root + Outfit/Caveat font links
├── vite.config.js
├── package.json
├── public/
│   └── assets/images/         # logos/ icons/ clients/ team/ about/ industries/ services/ careers/ contact/ events/
└── src/
    ├── main.jsx               # createRoot → <BrowserRouter><App/></BrowserRouter>
    ├── App.jsx                # LanguageProvider + Header + <Routes> + Footer + SalesBot
    ├── context/
    │   └── LanguageContext.jsx
    ├── lib/
    │   ├── i18n.js            # Arabic dictionary + dir/RTL layer + text swap
    │   └── salesBot.js        # the chat engine (mounted by SalesBot.jsx)
    ├── components/
    │   ├── Header.jsx  Footer.jsx  SalesBot.jsx  LanguageToggle.jsx  SmartLink.jsx
    ├── pages/
    │   ├── Home.jsx           # each page = component + its extracted markup + ported runtime
    │   ├── index.body.html    #   (the exact page markup, imported ?raw)
    │   ├── index.runtime.js   #   (the page's interactions, ported with full teardown)
    │   ├── ContactUs.jsx / contact-us.body.html / contact-us.runtime.js
    │   ├── AboutUs.jsx / …    ├── OurTeam.jsx / … ├── OurAdvisors.jsx / …
    │   ├── OurPartners.jsx / …├── OurClients.jsx / … ├── Industries.jsx / …
    │   ├── Events.jsx / …     └── Careers.jsx / …
    └── styles/
        ├── shared.css         # brand tokens, base reset, nav/footer/bot styles, keyframes
        └── home.css / contact-us.css / about-us.css / … (one per page)
```

## How the conversion works (architecture)
This build prioritizes **exact fidelity** to the static original. Each page is a thin React
component that:

1. **renders the page's exact markup** (extracted from the static HTML and imported as a raw
   string), and
2. **runs the page's ported interaction runtime inside a `useEffect`**, returning a **teardown**
   that cancels *every* `setInterval` / `setTimeout` / `requestAnimationFrame` / event listener it
   created — so navigating away leaves nothing running (no leaks, no duplicate animation loops).

The obsolete static‑only `fetch('/shared-assets.html')` include was removed — the shell is real
React components now. This yields byte‑identical visuals and behavior for the intricate pieces
(the product dashboards, the particle/constellation canvases, the contact state‑machine, the
gallery/lightbox) without the risk of re‑implementing them from scratch.

A couple of small, general mechanisms make this robust in a single‑page app:
- **Per‑route `<body>` background.** Page CSS `html,body{background:…}` rules are global in an SPA,
  so each page sets its own body background on mount and restores it on unmount (this is why
  Our Team is correctly dark while the rest are light).
- **Full‑content extraction.** Some pages wrap `<main>` in decorative backdrops (Our Team's dark
  wrapper + particle canvas + spine; Events' lightbox) that live *outside* `<main>`; the whole
  page content between the shell placeholders is captured, not just `<main>`.

> A fully **component‑decomposed, idiomatic** rebuild (Home → `ProductSwitcher`/`ServicesOrbit`/…,
> Our Team → `ParticleCanvas`/`LeadershipScene`/…, shared `Card`/`Carousel`/`useScrollReveal`, etc.)
> is planned as a separate effort. See roadmap.

## Assets & images
All imagery is served from `public/assets/images/` under stable folders — `logos/`, `icons/`,
`clients/`, `team/`, `about/`, `industries/`, `services/`, `careers/`, `contact/`, `events/`.
Serving from `public/` (rather than per‑image `import`s) keeps every path working unchanged —
including the many paths the page runtimes build **dynamically in JavaScript**
(e.g. `'/assets/images/services/' + name + '.png'`), which can't be import‑bundled.

## Notable decisions & gotchas
- **No `React.StrictMode`.** Its dev‑only double‑invoke would double‑initialize the imperative
  page runtimes (dashboards, canvases). Effects still clean up fully; only the dev double‑mount
  behavior is affected.
- **Vite pinned to 6.x** (see toolchain note above).
- **Headless screenshots of the canvas pages** (Our Team, Our Partners) are flaky because of their
  continuous `requestAnimationFrame` loops — a tooling quirk, not a site issue.
- **CRA default assets dropped.** The generic React `favicon`/`logo` placeholders are not real
  Align branding (see roadmap).

## Relationship to the other folders
- `../Align_Business_Systems/` — the **static HTML/CSS/JS** site this build was converted from
  (source of truth for markup, styles and behavior; served with its own `static-server.js`).
- `../Align_Business_Systems-react/` — **this** React build.
- (A legacy Create‑React‑App scaffold from an earlier, abandoned attempt was archived separately
  and is unrelated to this build.)

## Follow‑ups / roadmap
- **Arabic translations** — the current AR dictionary is a **placeholder**; replace with
  professional translations (brand/product names, emails, phone numbers and the tech stack are
  intentionally left in Latin script).
- **Real favicon / icons** to replace the dropped CRA placeholders.
- **Idiomatic component decomposition** — break each page into small reusable components with
  `useState`/`useReducer`/custom hooks (a full plan exists), if a more maintainable architecture is
  wanted over the current fidelity‑first port.
- **Wire the chatbot lead capture** to a real CRM/endpoint (currently flagged `TODO` in the UI).

---

*Built for identical parity with the static original — same look, same motion, same behavior,
now on React + Vite.*
