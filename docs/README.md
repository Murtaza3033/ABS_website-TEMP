# Docs

Project documents that aren't source code.

| Path | What it is |
|---|---|
| `qa/ABS-QA-Report.xlsx` | QA report: test cases and results, change log, owner actions |
| `guides/ON-OFF-TOGGLE-ANIMATION-GUIDE.md` | How the Home "problems" on/off toggle animation works (`src/pages/Home/sections/ProblemsSection.jsx`, `HomeContext.jsx`) |
| `guides/REACT-IDIOMATIC-DECOMPOSITION-GUIDE.md` | Historical: the plan used to turn the static-HTML port into idiomatic React components. The work is done; kept for context |
| `content/ABS-Data-Sheet.csv` | Content-collection checklist (what content is needed per section, status, priority) |
| `content/align-translations-review.csv` | Export of the Arabic dictionary for human review. It predates the current dictionary: `src/i18n/ar.js` is the source of truth and has more entries |

Setup, scripts, environment variables and deployment are in the root `README.md`.
The CMS is documented in `studio/README.md`.
