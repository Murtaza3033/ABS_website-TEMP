# Align Business Systems — Idiomatic React Decomposition Guide

## Context — what exists today

`Align_Business_Systems-react/` currently works, and matches the static
site pixel-for-pixel, but it is a **fidelity-first port**, not idiomatic
React:

- Each page component (`Home.jsx`, etc.) imports the page's exact markup
  as a **raw HTML string** (`index.body.html`, imported via `?raw`) and
  injects it into the DOM.
- Each page's interactivity is a **ported vanilla-JS runtime**
  (`index.runtime.js`, etc.) that runs inside a `useEffect`, manually
  wiring `querySelector`/`addEventListener`/DOM mutation — with a
  teardown function that cancels intervals/RAF/listeners on unmount.
- `lib/i18n.js` swaps English → Arabic text by **mutating the DOM
  directly** (`MutationObserver` + text replacement), not via
  React-rendered conditional content.
- `lib/salesBot.js` is a **self-contained imperative chat engine**
  mounted into the DOM by `SalesBot.jsx`, not React state.

This works, and was the right first step — it minimized risk while
proving the conversion. **This guide is the next phase**: converting
every page from raw-HTML-string + imperative-runtime into genuine,
idiomatic React — real JSX markup, real component state, zero direct DOM
manipulation.

**Rule #1: Preserve exact visual output and behavior.** This is a
structural refactor of *how* the UI is built, not a redesign of *what*
it looks like or does.

---

## 0. Scope decisions

1. **Styling stays plain CSS.** Do not introduce Tailwind or any CSS
   framework in this pass — keep the existing per-page `.css` files and
   `shared.css` tokens/keyframes as-is, just import them the same way
   idiomatic components already would. (If Tailwind is wanted later,
   that's a separate, deliberate future pass — flag it, don't do it here.)
2. **Enable React Compiler** for this project, per
   react.dev/learn/react-compiler/installation (`babel-plugin-react-compiler`
   + the Vite integration). Confirm it's active before starting page
   decomposition. Note: `React.StrictMode` is currently disabled because
   of the imperative runtimes double-invoking; once pages are properly
   idiomatic (real `useEffect` cleanup, no manual DOM scripts), re-evaluate
   whether `StrictMode` can be safely re-enabled — report your finding,
   don't silently change it either way without confirming.
3. **Do this in place**, in the existing `Align_Business_Systems-react/`
   folder — this is a refinement of an existing React codebase, not a
   format change, so a new sibling folder isn't needed. Instead, checkpoint
   via git before starting (see §1).
4. **Dynamically-built image paths stay served from `public/`** — do not
   convert these to bundled `import` statements. The README notes several
   page runtimes build image paths as strings at runtime
   (`'/assets/images/services/' + name + '.png'`), which cannot be
   import-bundled. Preserve this pattern even as the surrounding logic
   becomes real React state.

---

## 1. Checkpoint (do this first)

- Commit the current working state of `Align_Business_Systems-react/` as-is:
  `"Checkpoint: fidelity-port React build, before idiomatic decomposition"`.
  Report the commit hash.
- Copy the current `Align_Business_Systems-react/` folder into a sibling
  backup: `Align_Business_Systems-react-FIDELITY-PORT-BACKUP-[date]/`.

Confirm both before touching any page.

---

## 2. Component plan (present for approval before writing code)

For each page, propose a genuine component breakdown — not "keep the
raw HTML, just wrap it" — actually decomposing each page's markup and
runtime logic into components with real state. Present, and wait for
approval on:

1. **Per-page component tree.** E.g.:
   - `Home.jsx` → `ProductSwitcher.jsx` (owns `activeTab` state + the
     live clock `useEffect`/`setInterval`), `ServicesOrbit.jsx` (owns
     carousel index state), `ServiceModal.jsx` (open/close state),
     `ClientMosaic.jsx`, etc.
   - `OurTeam.jsx` → `ParticleCanvas.jsx` (owns the canvas `useRef` +
     `requestAnimationFrame` loop with cleanup), `ScrollSpine.jsx`,
     `LeadershipScene.jsx` (repeated per leader), `CultureBand.jsx`.
   - `OurPartners.jsx` → `ConstellationCanvas.jsx`, `DragCarousel.jsx`
     (owns autoplay progress + drag state), etc.
   - `ContactUs.jsx` → a state machine (`useReducer`) for the four-state
     flow (guided chat / classic form / done), `PhoneField.jsx` (owns
     country-code + per-country digit validation), `PresenceMap.jsx`.
   - `Events.jsx` → `Gallery.jsx` + `Lightbox.jsx` (owns open-image-index
     state, keyboard/click nav).
   - `Careers.jsx` → `RolesAccordion.jsx` (owns filter + open/closed
     state per item).
   - (Break down every page similarly — this list is illustrative, not
     exhaustive; account for every feature listed in the current
     README's page table.)
2. **Shared/reusable components** — identify genuine repeats across
   pages (e.g. a `Carousel` pattern used by Home/About/Partners, a
   `SectionHeading`, a `Card`, a `ScrollReveal` wrapper) and build them
   once, used everywhere the pattern repeats, instead of duplicating
   logic per page.
3. **i18n rework plan** — replace `lib/i18n.js`'s DOM-mutation approach
   with a proper React pattern: components read the current language
   from `LanguageContext` and render the correct string directly (e.g.
   a `t('key')` translation function returning JSX-safe strings, or a
   dictionary keyed by component), rather than rendering English then
   mutating it to Arabic after the fact. `dir="rtl"`/`lang="ar"` on
   `<html>` and the Cairo font loading can stay as they are (those are
   fine, not DOM-mutation-of-content issues) — only the text-swapping
   mechanism needs to become React-driven.
4. **Sales bot rework plan** — convert `lib/salesBot.js`'s imperative
   engine into a `useReducer`-driven conversation state machine
   (state: current menu/step, captured lead fields, message history),
   rendered as real JSX, with `localStorage` persistence handled via a
   `useEffect` synced to that reducer state — not a separately mounted
   script.
5. **Naming/folder conventions** for all new component files.

Do not begin decomposing any page until this plan is approved.

---

## 3. Decompose pages (one at a time — do not batch)

For each page, in this order — Home, Contact Us, About Us, Our Team,
Our Advisors, Our Partners, Our Clients, Industries, Events, Careers —
do the following, then STOP and report back before starting the next:

1. Replace the raw-HTML-string import (`[page].body.html`) with real
   JSX matching the approved component tree for that page.
2. Replace the imperative runtime (`[page].runtime.js`) with real
   component state (`useState`/`useReducer`/`useContext`) and, where
   genuinely needed for imperative concerns (canvas drawing, RAF loops),
   `useRef` + `useEffect` with full cleanup — but driven by React state,
   not manual `querySelector`/`innerHTML` DOM mutation for anything that
   can be expressed as conditional rendering instead.
3. Delete the now-unused `.body.html` and `.runtime.js` files for that
   page once its replacement is verified working.
4. Verify against the CURRENT React build (not just the original static
   site) — identical layout, all animations firing correctly, the page's
   specific interactive features (per the README's page table) fully
   functional, no console errors, no leaked intervals/RAF loops/listeners.
5. Report: what was decomposed, confirmation it passed verification, any
   judgment call made, and the next page. Wait for my go-ahead.

---

## 4. i18n and sales bot rework

Do these as their own explicit steps (can be done alongside or after
page decomposition, but must be reported on separately):

- **i18n:** implement the React-driven translation approach from §2.3.
  Verify Arabic/RTL still works identically across every page — layout
  mirroring, font swap, arrow-glyph flipping — but now via React
  rendering instead of DOM mutation after the fact.
- **Sales bot:** implement the `useReducer`-driven chat engine from
  §2.4. Verify the full conversation flow still works: greeting → main
  menu → product menu → FAQ → lead capture → human-handoff panel, with
  `localStorage` persistence intact.

---

## 5. Completeness sweep (run once everything above is done)

Confirm and report explicitly:

1. **No `.body.html` or `.runtime.js` files remain** anywhere in
   `src/pages/` — every page is genuine JSX + component state.
2. **No raw DOM manipulation remains** anywhere in `src/` — no
   `document.querySelector`, `.innerHTML =`, `.classList.add/remove`, or
   manually attached `addEventListener` outside a properly cleaned-up
   `useEffect`/`useRef` for genuinely imperative concerns (canvas only).
3. **`lib/i18n.js`'s `MutationObserver`/text-swap approach is gone**,
   replaced by React-rendered translations.
4. **`lib/salesBot.js`'s imperative engine is gone**, replaced by
   `useReducer`-driven state.
5. Every interactive feature from the README's page table confirmed
   working as real React state — list each page/component explicitly:
   "fully React state-driven, zero imperative DOM script, verified."
6. Confirm React Compiler is active and the build still runs cleanly.
7. Confirm whether `React.StrictMode` can now be safely re-enabled (per
   §0.2) — report your finding either way.

A page that still imports a `.body.html`/`.runtime.js` file, or still
relies on DOM-mutation-based i18n or the old sales bot script, does NOT
satisfy this decomposition — even if it looks and behaves correctly.

---

## 6. Final report

Report: what was decomposed per page, the i18n and sales-bot rework
status, React Compiler status, the `StrictMode` finding, and overall
confirmation that `Align_Business_Systems-react/` is now a fully
idiomatic React application with zero remaining fidelity-port artifacts.
