# DisclosureTrace implementation status

**Package:** 1.2.0
**Started:** 2026-11-16
**Public name:** DisclosureTrace (adopted 2026-11-18; internal factory directory retains the original slug for continuity)
**Current milestone:** Local implementation and verification complete; external release gates open

## Frozen decisions

- Exactly five filing pairs: CRWD, ABNB, COST, DAL, and F.
- Form 10-K, Item 1A only; no amendments or silent substitutions.
- Fixture-first public application; only the ingestion CLI may contact SEC hosts.
- Deterministic comparison; no AI, scores, predictions, or investment interpretation.
- Notes stay in the browser and export client-side as Markdown.
- `SH-01` compact textual-change ledger and `SH-02` note export are Must/Never cut.
- Public repository and deployment preparation are authorized under the DisclosureTrace name; public visibility remains gated on audit.

## Requirement checklist

Status values during implementation: `pending`, `in_progress`, `shipped`, `changed`, `cut`.

| IDs             | Status  | Evidence / next action                                                                    |
| --------------- | ------- | ----------------------------------------------------------------------------------------- |
| P-01–P-12       | changed | Product complete; raw hashes/live source recheck gated                                    |
| DATA-01–DATA-08 | changed | Pipeline complete; authorized full generation pending                                     |
| CMP-01–CMP-06   | shipped | Deterministic alignment, labels, spans, IDs                                               |
| NOTE-01–NOTE-02 | shipped | Local CRUD/reset and client Markdown export                                               |
| UX-01–UX-07     | changed | Golden/recovery/responsive paths pass; full state matrix remains                          |
| A11Y-01–A11Y-08 | changed | Axe/Lighthouse/keyboard/320px reflow pass; VoiceOver/manual 400% pending                  |
| PERF-01–PERF-03 | shipped | Median production-mode profile and budgets pass                                           |
| SEC-01–SEC-04   | shipped | Headers, privacy boundary, dependency/secret scans pass                                   |
| QA-01–QA-06     | changed | 32 tests + 8 E2E pass; alignment matrix complete; live links/full UI-state matrix pending |
| REL-01–REL-04   | changed | Local gates/CI ready; external release not authorized                                     |
| DOC-01–DOC-05   | shipped | ADR, method, claims, screenshots, completion report                                       |
| SH-01–SH-02     | shipped | Never-cut ledger and note export pass                                                     |
| SH-03           | cut     | Frozen cut-first Should item                                                              |

## Decisions and assumptions

- Node 22 remains the declared production engine. Local initialization may use an available newer supported Node runtime; all results must name the actual version.
- The app uses a single centralized `PRODUCT_NAME` value so a future approved public name does not alter product scope.
- No public repository or Vercel resource will be created during local implementation.

## Commands and results

`pnpm quality`: pass on 2026-11-18. `pnpm test`: 32/32 pass. `pnpm test:e2e`: 8/8 pass. Lighthouse median performance/accessibility: 100/100 on both audited routes. See `evidence/completion-report.md`.

## Limitations / external gates

- Public name approval is outstanding.
- GitHub/Vercel creation and deployment are not authorized in this local run.
- Live URL, CI URL, branch protection, rollback, and post-deploy log evidence cannot be claimed until those external actions are authorized.
- Full fixture ingestion and ten-link verification require explicit consent to transmit Nora's email address in the contact-bearing `SEC_USER_AGENT`; the 2026-11-18 automated attempt was correctly stopped before disclosure.
- VoiceOver and manual 400% browser-zoom evidence remains follow-up; the automated 320 CSS-pixel reflow proxy passes.

## Next milestone

Obtain explicit consent for the contact-bearing SEC User-Agent and select the public name. Then regenerate full fixtures twice, verify all ten sources, finish VoiceOver/manual 400% checks, and create the repository/deployment.
