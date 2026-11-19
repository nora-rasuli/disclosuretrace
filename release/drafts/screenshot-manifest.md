# DisclosureTrace screenshot manifest — private draft

## Existing captures

| File                                                   | Intended story                       | Publication status | Reason/action                                                              |
| ------------------------------------------------------ | ------------------------------------ | ------------------ | -------------------------------------------------------------------------- |
| `evidence/screenshots/01-index-desktop.png`            | Five-pair entry and disclosure       | Do not publish     | Audit recapture under DisclosureTrace; local uncommitted build only.       |
| `evidence/screenshots/02-comparison-split-desktop.png` | Provenance, ledger, split comparison | Do not publish     | Audit recapture; curated partial fixture and blocked release.              |
| `evidence/screenshots/03-comparison-unified-note.png`  | Unified view and note workflow       | Do not publish     | Audit recapture; persistence/export proof requires tests.                  |
| `evidence/screenshots/04-comparison-mobile-390.png`    | Responsive stacking at 390px         | Do not publish     | Genuine 390px audit recapture; final deployment still blocked.             |
| `evidence/screenshots/05-comparison-mobile-320.png`    | Narrow reflow at 320px               | Do not publish     | Genuine 320px audit recapture; 400% manual evidence still missing.         |
| `evidence/screenshots/06-comparison-refresh-error.png` | Recoverable API refresh failure      | Do not publish     | Explicitly mocked 503 after SSR-seeded comparison; metadata retained.      |
| `evidence/screenshots/metadata.json`                   | Capture provenance                   | Internal evidence  | Routes, viewports, browser, working-tree baseline, fixture/state metadata. |

## Required final capture set

| ID   | Route/state                                     | Viewport  | Required visible evidence                                           | Proposed public caption                                                                          |
| ---- | ----------------------------------------------- | --------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| S-01 | `/`                                             | 1440×1000 | DisclosureTrace name, promise, concept disclosure, five fixed pairs | “A fixed five-pair corpus makes the comparison boundary visible before the user opens a filing.” |
| S-02 | Canonical CRWD split route                      | 1440×1100 | Provenance, exact status, change ledger, filters, first comparison  | “The review starts with filing provenance and textual counts—not a risk score.”                  |
| S-03 | Canonical CRWD unified/modified with saved note | 1440×1100 | Modified wording, context, local-note saved state/export            | “Source-linked wording review and browser-local notes stay in one continuous flow.”              |
| S-04 | Canonical CRWD split route                      | 390×844   | Stacked prior/current passages and usable controls                  | “The same logical prior-then-current order becomes a single mobile document flow.”               |
| S-05 | Canonical CRWD split route                      | 320×800   | No page overflow, wrapped ledger, visible focus                     | “The review remains operable at the narrow reflow target.”                                       |
| S-06 | Intercepted 503 or approved partial state       | 1440×900  | Clear test-state label, retained issuer/filter state, Retry         | “Failure stays explicit and recoverable instead of becoming a fabricated empty result.”          |

## Capture metadata required for every final image

- route and query;
- viewport/zoom and browser version;
- date/time zone;
- commit SHA and deployment ID;
- fixture version and data status;
- whether the state is real, mocked, or network-intercepted;
- descriptive alt text and approved caption.
