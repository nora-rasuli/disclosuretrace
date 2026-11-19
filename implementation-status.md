# DisclosureTrace implementation status

**Package:** 1.2.0
**Started:** 2026-11-16
**Public name:** DisclosureTrace (adopted 2026-11-18; internal factory directory retains the original slug for continuity)
**Current milestone:** Independent audit complete; release blocked pending remediation and material originality pivot

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

| IDs             | Status  | Evidence / next action                                                                     |
| --------------- | ------- | ------------------------------------------------------------------------------------------ |
| P-01–P-12       | changed | Local workflow passes; raw hashes/live source and deployment evidence remain incomplete    |
| DATA-01–DATA-08 | changed | Fixture boundary exists; full generation, atomicity, and true two-run determinism missing  |
| CMP-01–CMP-06   | changed | Focused tests pass; documented staged algorithm does not match implementation              |
| NOTE-01–NOTE-02 | shipped | Local CRUD/reset and client Markdown export                                                |
| UX-01–UX-07     | changed | Golden/recovery/responsive paths pass; initial API/loading and full state matrix remain    |
| A11Y-01–A11Y-08 | changed | Axe/Lighthouse/keyboard/320px reflow pass; VoiceOver/manual 400% pending                   |
| PERF-01–PERF-03 | changed | Fresh local medians pass; long-task/final JS/deployment measurements incomplete            |
| SEC-01–SEC-04   | changed | Headers/privacy/secret scan pass; fresh dependency and deployment review incomplete        |
| QA-01–QA-06     | changed | 33 tests + 10 E2E pass; live links/full UI-state matrix pending                            |
| REL-01–REL-04   | changed | Local gates and baseline CI pass; branch/deployment/rollback/log evidence fails or missing |
| DOC-01–DOC-05   | changed | Audit found alignment/determinism claim mismatch; final public docs remain blocked         |
| SH-01–SH-02     | shipped | Never-cut ledger and note export pass                                                      |
| SH-03           | cut     | Frozen cut-first Should item                                                               |

## Decisions and assumptions

- Node 22 remains the declared production engine. Local initialization may use an available newer supported Node runtime; all results must name the actual version.
- The app uses a single centralized `PRODUCT_NAME` value so a future approved public name does not alter product scope.
- No public repository or Vercel resource will be created during local implementation.

## Commands and results

Independent repair run on 2026-11-18: `pnpm quality` passed with 33/33 tests; `pnpm test:e2e` passed 10/10. Fresh local Lighthouse median performance/accessibility was 100/100 on both routes, with one comparison performance outlier at 86. See `independent-audit.md`.

## Limitations / external gates

- `originality-gate.md` records `Pivot`; featured publication is prohibited until a materially different workflow passes a new gate.
- The GitHub repository is private; protected Vercel deployment identity/behavior was not independently accessible. Visibility and protection remain unchanged.
- Live URL, CI URL, branch protection, rollback, and post-deploy log evidence cannot be claimed until those external actions are authorized.
- Full fixture ingestion and ten-link verification require explicit consent to transmit Nora's email address in the contact-bearing `SEC_USER_AGENT`; the 2026-11-18 automated attempt was correctly stopped before disclosure.
- VoiceOver and manual 400% browser-zoom evidence remains follow-up; the automated 320 CSS-pixel reflow proxy passes.

## Next milestone

Do not publish. First decide whether to perform the required material product pivot. If continuing, obtain explicit SEC contact-header consent, repair the alignment/determinism boundary, regenerate and verify full fixtures, finish manual accessibility/security gates, commit a final SHA, and re-audit its protected deployment.
