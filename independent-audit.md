# Project Audit — DisclosureTrace

## Audit metadata

- **Frozen brief:** `project-package.md`, package 1.2.0; `project-brief.md`; frozen 2026-11-16
- **Repository/commit audited:** private `nora-rasuli/disclosuretrace`; baseline `ed00f764cf29895f3b2e3d956b24eeeda2f3fed0` plus the uncommitted repair set listed by `git status` on 2026-11-18
- **Live deployment audited:** none. A Vercel project identity is present locally, but the protected deployment was not accessible through the authorized account scope and protection was not weakened.
- **Audit date and environment:** 2026-11-18, America/Los_Angeles; macOS; Node 24.22.3; pnpm 10.21.0; local Next.js 16.4.6 production build; Chromium/Playwright and Lighthouse 13.6.0
- **Evidence supplied by implementation agent:** completion report, evidence register, screenshots, Lighthouse JSON, security/header records, fixture manifests, tests, GitHub Actions run 44458607088
- **Checks independently repeated:** source/code/fixture/test review; `pnpm quality`; production Playwright; desktop/390/320 browser flows; keyboard/focus/URL/note/reset/filter/failure behavior; local headers and v1 APIs; six fresh Lighthouse runs; compressed fixture sizes; private-repository/CI/branch settings; targeted secret scan; screenshot dimensions/hashes

## Decision

`Not ready`

**Release verdict: `BLOCKED`.** The local review experience is polished and its repaired working tree passes the available automated gates, but multiple Must/Never-cut release claims are either false as written or not independently verifiable. The corpus remains five curated partial comparisons without raw hashes or dated live-source verification; the documented alignment/determinism methods do not match the implementation; the protected deployment, rollback, logs, VoiceOver, 400% reflow, and final dependency audit were not verified. In addition, `originality-gate.md` records a separate `Pivot` decision that prohibits featuring this as an original portfolio product without a material workflow pivot.

### Control Room post-audit reconciliation — 2026-11-18

After the independent verdict was frozen, the Control Room corrected and verified the hosting boundary without changing the `BLOCKED` decision:

- Vercel Authentication is now scoped to `all` deployments, including the production alias.
- An unauthenticated request to `https://disclosuretrace.vercel.app` returns `302` to Vercel sign-in.
- Authenticated checks returned `200` for `/` and `/api/v1/catalog`; the temporary automation bypass created by the CLI was immediately revoked and the final bypass count is zero.
- GitHub remains private.
- `pnpm audit --prod` reports no known vulnerabilities.
- `pnpm quality` passes with 33 tests and `pnpm test:e2e` passes 10/10 on the repaired local working tree.

These checks resolve the accidental public-access issue and the missing dependency-audit evidence. They do not verify the repaired code on a deployed SHA and do not resolve the originality pivot, source/method integrity, manual accessibility, rollback, or observability blockers.

## Executive scorecard

| Area                                | Score | Evidence                                                                                                        | Blocking? |
| ----------------------------------- | ----: | --------------------------------------------------------------------------------------------------------------- | --------- |
| Golden path and problem coherence   |   3/3 | Browser walkthrough, 10 production E2E tests                                                                    | No        |
| Scope fidelity                      |   1/3 | Exact five pairs, but all comparison fixtures are curated partial passage sets                                  | Yes       |
| UX and visual craft                 |   3/3 | Desktop/mobile captures and manual review                                                                       | No        |
| Responsive behavior                 |   3/3 | 390px and 320px browser checks; no horizontal overflow                                                          | No        |
| Accessibility                       |   2/3 | Axe, Lighthouse, semantics, keyboard/focus pass; VoiceOver and 400% evidence absent                             | Yes       |
| Engineering architecture            |   2/3 | Strong typed fixture boundary; initial page bypasses public API and pipeline claims diverge                     | Yes       |
| Failure/recovery behavior           |   2/3 | Repaired 503 refresh, partial, note, route and filter recovery; required state matrix incomplete                | Yes       |
| Tests and CI                        |   2/3 | 33 tests and 10 E2E pass; baseline CI green; current repair set is uncommitted/unrun in CI                      | Yes       |
| Performance and observability       |   2/3 | Local median performance 100; deployment/runtime scan absent                                                    | Yes       |
| Repository/documentation            |   1/3 | Private repo is cleanly scoped; branch protection unavailable; method/claims mismatch                           | Yes       |
| Portfolio story and claim integrity |   1/3 | Concept boundary is honest; originality gate requires pivot and claims need correction                          | Yes       |
| Distinctive hiring signal           |   2/3 | Credible React/TypeScript, testing and accessibility signal; product concept substantially overlaps competitors | Yes       |

## Brief-to-build traceability

| Brief requirement            | Shipped?      | Evidence                                                        | Deviation and judgment                                                                                                                        |
| ---------------------------- | ------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Golden path step 1           | Yes, locally  | Index and canonical CRWD E2E/manual flow                        | No-sign-up local flow is clear; protected deployment was not inspectable.                                                                     |
| Golden path step 2           | Yes, locally  | Split/unified view, navigation, context, official-link controls | Initial SSR reads the fixture store directly rather than exercising browser → public API.                                                     |
| Durable output               | Yes, repaired | Local note CRUD/reset/export tests                              | Notes intentionally have no sync or backup.                                                                                                   |
| Required states              | Partial       | Component/E2E and failure screenshot                            | Frozen parser/amendment/broken-source state matrix is not exhaustive; initial loading/error states are unreachable on the canonical SSR path. |
| Quality targets              | Partial       | Fresh Lighthouse, quality, E2E, headers                         | Manual and deployment gates remain incomplete.                                                                                                |
| Explicit non-goals respected | Yes           | Code/copy/network review                                        | No AI, scores, auth, analytics, database, or browser SEC traffic found.                                                                       |

## Findings

### [P1] Source integrity is incomplete for every release fixture

- **Evidence/reproduction:** all five catalog items report `status: "partial"`; the source/provenance records retain null or pending raw-source hashes; `evidence/source-verification-status.md` says no dated live ten-link check or full ingestion was run.
- **Why it matters:** P-03, P-07, P-08, DATA-02–DATA-08, QA-06, and the core source-linked story depend on proving the exact SEC inputs, not only validating curated local JSON.
- **Smallest effective fix:** obtain explicit approval for the contact-bearing SEC User-Agent, perform one compliant full acquisition, preserve raw hashes, generate twice into clean staging directories, compare outputs, and record all ten live source results.
- **Acceptance check:** two clean runs have identical normalized/comparison hashes; every fixture resolves to recorded raw hashes and dated 200 responses; partial/excluded data is accurately labeled.

### [P1] The frozen comparison and determinism methods are not what the scripts execute

- **Evidence/reproduction:** `scripts/pipeline/align.ts` globally hash-matches exact blocks, then greedily token-set-pairs every remaining block. It does not partition by heading or run deterministic sequence alignment before unmatched recovery as documented. `scripts/check-determinism.ts` only re-hashes committed outputs against one manifest; it does not perform two clean generations.
- **Why it matters:** the current method and public draft can imply a stronger, independently regenerated alignment pipeline than exists. The mismatch undermines DOC-01, DOC-03 and DATA-06 even though focused alignment unit cases pass.
- **Smallest effective fix:** either implement the frozen staged algorithm and true two-clean-run check, or explicitly revise the package/method/claims with authorized `Changed` decisions and bounded algorithm wording.
- **Acceptance check:** the documented algorithm maps line-for-line to exercised code; CI creates two clean outputs and compares hashes; the claims ledger names only the implemented method.

### [P1] Release and protected deployment evidence is unavailable

- **Evidence/reproduction:** the private GitHub baseline CI run succeeded, but private-branch protection returns a plan/visibility 403. The Vercel connector cannot authorize the locally linked team/project; no deployment SHA, incognito run, rollback, or one-hour log scan was available. The current repairs are uncommitted and therefore not covered by the recorded CI run.
- **Why it matters:** REL-02–REL-04 are Must/Never-cut, and local success cannot establish the identity or behavior of a protected production deployment.
- **Smallest effective fix:** commit the audited repair set, run CI on that SHA, establish an approved private-branch control or document an authorized equivalent, grant audit-safe deployment access, then record deployment identity, clean-session behavior, rollback, and logs without making anything public.
- **Acceptance check:** one SHA connects source, green CI, protected deployment, rollback target, and dated runtime scan.

### [P1] The originality gate independently prohibits featured publication

- **Evidence/reproduction:** `originality-gate.md` documents close overlap with FilingDelta, Filing Delta, RiskDiff, BamSEC, and AlphaSense and records `Pivot — retain the implementation as private technical work, but do not publish it as a featured original portfolio product`.
- **Why it matters:** passing technical checks would not override the Factory's product-originality decision or make novelty/product-validation claims safe.
- **Smallest effective fix:** materially change the primary user, trigger, desired outcome, and core workflow, then rerun competitor/originality review; a rename or extra feature is insufficient.
- **Acceptance check:** a new side-by-side originality gate explicitly permits featuring the revised concept.

### [P2] The canonical initial render does not exercise the claimed browser → API boundary

- **Evidence/reproduction:** `src/app/compare/[ticker]/[pair]/page.tsx` reads `loadComparison` on the server and passes `initialComparison`; the client public API runs only on manual refresh. The 503 test therefore starts with valid server-seeded content and fails a refresh, while initial loading/API-error components are not production-observable on that route.
- **Why it matters:** the end-to-end contract and recovery claim are narrower than described, and regressions in the initial public API path can escape the golden path.
- **Smallest effective fix:** document the actual SSR fixture-store boundary and test it explicitly, or make the canonical client load use `/api/v1/comparisons/...` and retain an accessible loading/error path.
- **Acceptance check:** architecture copy matches network behavior; tests independently cover initial load and refresh failure without mislabeled evidence.

### [P2] Required failure/accessibility/security evidence is incomplete

- **Evidence/reproduction:** there is no dedicated, exercised UI evidence for every parser failure, missing section, amendment, and broken-source row; no Safari/VoiceOver or manual 400% record exists. A fresh `pnpm audit --prod` was not run because the environment would transmit the private dependency graph to npm without explicit authorization; the earlier builder artifact is not independent proof.
- **Why it matters:** UX-03, A11Y-06, A11Y-08, SEC-04, QA-04, and QA-06 are frozen Must requirements.
- **Smallest effective fix:** add the missing typed states/tests, perform the two manual accessibility checks, and authorize or supply an offline/approved production dependency audit.
- **Acceptance check:** a dated matrix links each state to a test/capture; VoiceOver and 400% notes name environment and outcome; dependency report is tied to the final lockfile.

### [P3 — repaired] Reset, filter recovery, evidence capture, partial disclosure, and favicon defects

- **Evidence/reproduction:** reset previously cleared storage but left stale textarea text; filter-empty lacked a clear action; the 390/320 files were duplicate 1280px desktop captures due to `viewportSize`; the partial banner omitted aggregate exclusions; the index said “verified”; Lighthouse logged `/favicon.ico` 404.
- **Why it matters:** these defects weakened note correctness, recovery, responsive evidence, claim precision, and console quality.
- **Smallest effective fix:** applied in this audit: synchronize reset UI state, add Clear filters, use Playwright `viewport`, show excluded count/reasons, say “frozen,” and add an explicit SVG icon.
- **Acceptance check:** passed. Component/E2E tests pass; new 390/320 files have unique hashes and correct widths; the failure capture has metadata; `audit-comparison-repair.json` reports no console errors and `/favicon.svg` returns 200.

## Requirement-by-requirement verification

### Product

| ID   | Classification               | Independent evidence / deviation                                                                                           |
| ---- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| P-01 | Verified shipped             | Local no-sign-up CRWD path completed by browser and E2E; deployment version unverified.                                    |
| P-02 | Verified shipped             | Catalog/schema contain only CRWD, ABNB, COST, DAL, F exact frozen pairs.                                                   |
| P-03 | Partially shipped            | UI metadata is present; raw source hashes/full retrieval proof are missing.                                                |
| P-04 | Verified shipped             | Item 1A boundary is explicit in copy, fixtures, routes, and API.                                                           |
| P-05 | Verified shipped             | Added/removed/modified labels, symbols, counts and filters pass.                                                           |
| P-06 | Verified shipped             | Split/unified meaning and narrow stacking pass.                                                                            |
| P-07 | Partially shipped            | Passage + explicit unavailable context render, but curated partial fixtures provide no credible adjacent-context coverage. |
| P-08 | Not independently verifiable | SEC controls/allowlist pass statically; ten official URLs were not live checked.                                           |
| P-09 | Verified shipped             | Copy scan found no prediction, materiality, risk-direction or recommendation language.                                     |
| P-10 | Verified shipped             | Concept disclosure/disclaimer are present and discoverable.                                                                |
| P-11 | Verified shipped             | Save/reload/update/delete/reset pass after stale-draft repair.                                                             |
| P-12 | Verified shipped             | Route/view/types/change restoration and invalid fallback pass.                                                             |

### Data and comparison

| ID      | Classification    | Independent evidence / deviation                                                                              |
| ------- | ----------------- | ------------------------------------------------------------------------------------------------------------- |
| DATA-01 | Verified shipped  | Browser/API code has no SEC fetch; only ingestion scripts contact SEC.                                        |
| DATA-02 | Partially shipped | Rate/retry/cache code and tests exist; no authorized acquisition run report.                                  |
| DATA-03 | Partially shipped | Exact metadata and amendment rejection tests pass; no live acquisition reproduction.                          |
| DATA-04 | Partially shipped | Deterministic parser fixtures pass; universal/live corpus behavior is unproven.                               |
| DATA-05 | Partially shipped | Typed partial/unavailable logic exists; full frozen state table is not surfaced/tested.                       |
| DATA-06 | Failed            | Manifest re-hash is not two clean generations.                                                                |
| DATA-07 | Partially shipped | Version/provenance fields exist; raw hashes and complete retrieval evidence do not.                           |
| DATA-08 | Partially shipped | Raw ignore/correction documentation exists; whole-corpus generation is not atomic and no release recheck ran. |
| CMP-01  | Verified shipped  | Exact/reorder unit cases pass.                                                                                |
| CMP-02  | Verified shipped  | Threshold-edge deterministic light-edit tests pass.                                                           |
| CMP-03  | Verified shipped  | Unmatched add/remove tests and neutral copy pass.                                                             |
| CMP-04  | Verified shipped  | Deterministic old/new spans pass snapshots/rendering.                                                         |
| CMP-05  | Verified shipped  | Stable ID/source invariants pass.                                                                             |
| CMP-06  | Verified shipped  | Ambiguity margin resolves to add/remove in tests; documentation still overstates the larger staged method.    |

### Notes, UX, and accessibility

| ID      | Classification    | Independent evidence / deviation                                                                |
| ------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| NOTE-01 | Verified shipped  | Plain-text validation, trimming, 2,000-char limit, React escaping and no network storage pass.  |
| NOTE-02 | Verified shipped  | Disabled/quota storage keeps in-session draft and displays warning.                             |
| UX-01   | Partially shipped | Accessible loading component exists/tested but canonical SSR seed makes it unreachable.         |
| UX-02   | Verified shipped  | Filter-empty now has Clear filters; no-meaningful-change is distinct and neutral.               |
| UX-03   | Failed            | 503/partial/note/unknown-route recovery exists; full frozen failure table does not.             |
| UX-04   | Verified shipped  | Counts, skip-hidden navigation, URL continuity, retry state pass.                               |
| UX-05   | Verified shipped  | Typography/paper-ink editorial system is coherent and avoids prohibited clichés.                |
| UX-06   | Verified shipped  | 390/320 flows stack with no page overflow or obscured focus in local Chromium.                  |
| UX-07   | Verified shipped  | Desktop measure/density and evidence hierarchy pass manual review.                              |
| A11Y-01 | Verified shipped  | Local keyboard walkthrough covers index, controls, navigation, context, sources and notes.      |
| A11Y-02 | Partially shipped | URL/focus/Alt+Arrow pass; VoiceOver announcement was not verified.                              |
| A11Y-03 | Partially shipped | Landmarks/headings/list/regions are semantic; no VoiceOver linear-reading smoke.                |
| A11Y-04 | Verified shipped  | Words/symbols/borders and `<ins>/<del>` semantics do not rely on color.                         |
| A11Y-05 | Verified shipped  | Manual keyboard focus order/visibility and active-heading focus pass.                           |
| A11Y-06 | Partially shipped | 320px reflow passes; manual 400% and dated contrast report are absent.                          |
| A11Y-07 | Verified shipped  | Reduced-motion CSS disables smooth/nonessential motion; no flashing content.                    |
| A11Y-08 | Partially shipped | Axe has no serious/critical issues and fresh Lighthouse a11y is 100; VoiceOver gate is missing. |

### Performance, security, QA, release, and documentation

| ID      | Classification               | Independent evidence / deviation                                                                                                 |
| ------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| PERF-01 | Verified shipped             | Fresh three-run local-production medians: performance 100 on `/` and CRWD.                                                       |
| PERF-02 | Partially shipped            | Median LCP/CLS pass; no independent next-change >200ms long-task trace.                                                          |
| PERF-03 | Partially shipped            | Fresh comparison JSON gzip is 1.5–2.2 KB; final repaired JS transfer was not remeasured.                                         |
| SEC-01  | Verified shipped             | No unsafe HTML path; schemas and HTTPS SEC archive allowlist pass.                                                               |
| SEC-02  | Verified shipped             | No auth/analytics/DB; note network review and targeted secret scan pass.                                                         |
| SEC-03  | Verified shipped             | Local CSP/frame/object/base/form/nosniff/referrer headers verified.                                                              |
| SEC-04  | Partially shipped            | Secret scan passes; fresh production dependency audit was not independently authorized.                                          |
| QA-01   | Partially shipped            | Core logic has behavior tests; some parser/state requirements lack full cases.                                                   |
| QA-02   | Partially shipped            | Parser fixtures cover many structures but release/live behavior and all UI mappings do not.                                      |
| QA-03   | Verified shipped             | Exact/reorder/modified/add/remove/ambiguity/no-change cases pass.                                                                |
| QA-04   | Failed                       | Success/loading/empty/partial/503/note states exist, but frozen parser/source/amendment matrix is incomplete.                    |
| QA-05   | Partially shipped            | 10 production-build E2E tests pass locally; 503 is refresh failure after SSR seed, not initial API failure.                      |
| QA-06   | Failed                       | Final repaired local Lighthouse has no console errors; ten live source URLs remain unchecked.                                    |
| REL-01  | Verified shipped             | Repeated local format/lint/typecheck/33 tests/hash check/build pass.                                                             |
| REL-02  | Failed                       | Baseline Actions is green and lockfile frozen, but protected private main is unavailable on current plan; repairs are not in CI. |
| REL-03  | Not independently verifiable | Protected Vercel production/anonymous access/rollback could not be inspected.                                                    |
| REL-04  | Failed                       | Error boundary exists; deployment log schema/one-hour scan do not.                                                               |
| DOC-01  | Failed                       | ADR boundary exists, but described alignment method does not match `align.ts`.                                                   |
| DOC-02  | Partially shipped            | Attribution/limitations exist; raw retrieval/parser coverage evidence remains incomplete.                                        |
| DOC-03  | Failed                       | Builder/draft claims overstate determinism/pipeline completion until corrected.                                                  |
| DOC-04  | Verified shipped             | Concept scenario and real SEC-derived data are consistently separated; no adoption claim.                                        |
| DOC-05  | Verified shipped             | No final public README/case study exists; private gated drafts are clearly labeled.                                              |
| SH-01   | Verified shipped             | Semantic exact textual-change ledger with visible words/symbols passes.                                                          |
| SH-02   | Verified shipped             | Client Markdown export contains user notes/metadata/URLs and no passage text.                                                    |
| SH-03   | Cut                          | Frozen cut-first authorization; URL-restorable state remains.                                                                    |

## Accessibility findings

- Fresh Lighthouse accessibility scores are 100 on all six local production samples.
- Jest-axe reports no serious/critical violation in the comparison success state.
- Manual Chromium keyboard review verified skip link, logical controls, visible focus, `Alt+Arrow`, active-heading focus, source controls, note CRUD/reset, and filter recovery.
- 390px and 320px layouts have no page horizontal overflow and preserve prior-then-current reading order.
- This evidence does **not** establish WCAG conformance. Safari/VoiceOver, manual 400% zoom, and a dated contrast worksheet remain required.

## Performance findings and test profile

Profile: Lighthouse 13.6.0, local Next.js production server, simulated mobile defaults, headless Chromium, 2026-11-18. Three runs per route:

| Route                     | Performance median | A11y median | LCP median | CLS median | TBT median |
| ------------------------- | -----------------: | ----------: | ---------: | ---------: | ---------: |
| `/`                       |                100 |         100 |     756 ms |      0.023 |       8 ms |
| `/compare/crwd/2024-2025` |                100 |         100 |     763 ms |      0.057 |       9 ms |

One comparison run scored 86 with LCP 2.94 s and CLS 0.193; the median passes, but the outlier must be disclosed with any performance statement. Fresh comparison fixture gzip sizes range from 1,517 to 2,218 bytes. Best-practices scores were 96 on index and 92 on comparison before the favicon repair. The final repaired comparison run scored 100 performance/accessibility, 96 best practices, LCP 760 ms, CLS 0.052, TBT 8 ms, and reported no console errors; the remaining best-practices deduction is a CSP inspector issue.

## Test and CI evidence

- `pnpm quality`: pass on Node 24.22.3 after repairs; 33 Vitest tests, format, lint, strict types, committed-fixture hash check, and production build.
- `pnpm test:e2e`: 10/10 pass against local production build across desktop and mobile projects.
- GitHub Actions run 44458607088: green for baseline SHA `ed00f764cf29895f3b2e3d956b24eeeda2f3fed0`.
- The final audit repair set is uncommitted, so the baseline CI result cannot be represented as verification of these repairs.

## Source, attribution, privacy, and claim integrity

- The UI links only to HTTPS SEC archive/index URLs and does not render SEC HTML.
- The browser made no SEC request during audited flows. Notes remained local; no auth, analytics, user database, or note/passage logging was found.
- SEC and concept disclaimers are visible. Fonts/packages and fixture-first limitations are documented.
- Live SEC verification and raw-source hashes are missing; the audit did not transmit Nora's email address without explicit consent.
- The repository remained private and deployment protection was not altered.
- The private README/case-study drafts must not be published under this decision.

## Claim verification

| Proposed public claim                                                         | Status       | Evidence/method                            | Approved wording or correction                                                                                               |
| ----------------------------------------------------------------------------- | ------------ | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Exactly five frozen company filing pairs                                      | Verified     | Catalog/manifest/schema                    | “The private demo contains five fixed, curated Item 1A filing pairs.”                                                        |
| Reviews added, removed and modified Item 1A wording with SEC links            | Qualified    | UI/fixtures/tests                          | Add “textual classification,” “curated partial fixtures,” and no materiality/risk meaning.                                   |
| Browser makes no live SEC request                                             | Verified     | Code/network inspection                    | “Runtime reads versioned local fixtures; source maintenance is an offline CLI concern.”                                      |
| Notes remain browser-local and export to Markdown                             | Verified     | Unit/E2E/network inspection                | Add “no sync or backup.”                                                                                                     |
| 33 tests and 10 browser tests pass                                            | Qualified    | Independent local run                      | Only for the audited uncommitted working tree; not final SHA/CI.                                                             |
| Local median Lighthouse performance/accessibility is 100                      | Qualified    | Six fresh JSON artifacts                   | Include tool/profile/date/routes and the 86-performance outlier; do not imply public-production results or WCAG conformance. |
| Deterministic heading-partitioned sequence alignment                          | Contradicted | `align.ts` inspection                      | Withhold until code/docs agree.                                                                                              |
| Two clean generations are identical                                           | Unsupported  | `check-determinism.ts` inspection          | Withhold until actual two-run generation evidence exists.                                                                    |
| Full verified source corpus                                                   | Unsupported  | Partial fixtures/null hashes/no live check | Withhold.                                                                                                                    |
| Unique/novel/original product concept                                         | Contradicted | `originality-gate.md`                      | Withhold; gate requires material pivot.                                                                                      |
| User time savings, adoption, production use, SEC approval, investment insight | Unsupported  | No primary evidence / prohibited scope     | Withhold.                                                                                                                    |

## GitHub/repository audit

- [ ] Description, topics, live URL, social preview, and license are present. Description exists privately; the rest remain gated drafts or absent.
- [ ] README communicates value and demo path above the fold. Only a private draft exists and contains claims requiring correction.
- [ ] Local setup works from documented steps. No final audited root README/setup handoff exists.
- [x] `.env.example` is safe; `.env.local` is ignored; targeted tracked-file scan found no known secret pattern or personal data.
- [ ] Default branch CI is green and branch/release state is understandable. Baseline CI is green; branch protection and repair-SHA CI are not.
- [ ] Screenshots, architecture, tests, limitations, provenance, and attribution are accurate. Captures were repaired; method/provenance remain blocked.
- [x] Generated/vendor artifacts are excluded from authored source as configured; the private release draft directory is clearly gated.
- [x] Limitations are recorded as release blockers rather than aspirational feature padding.

## Portfolio presentation audit

- [x] Draft card/case-study copy explains the source-linked wording-review problem.
- [x] Draft narrative emphasizes decisions, constraints, accessibility and evidence.
- [x] Repaired screenshots cover index, split, unified/note, 390, 320 and 503 recovery.
- [ ] Stack/metrics are not yet tied to a final committed/deployed SHA.
- [x] The one-week scope is framed as prioritization.
- [ ] The project does not pass the Factory originality/distinctiveness gate.

### Realism check for concept projects

- [x] The simulated research persona has a concrete filing-review trigger and evidence constraint.
- [x] The five fixtures support one coherent annual-filing comparison scenario.
- [x] The golden path ends in a durable browser-local note/export.
- [x] Concept status is disclosed without inventing customers.
- [x] Measured technical results are separated from scenario outcomes.

## Repair package

### Must fix before featuring

1. Honor the `Pivot` originality decision: materially redesign the primary workflow and pass a new originality gate.
2. Generate the complete authorized source corpus twice, retain raw hashes, live-check all ten sources, and reconcile every provenance field.
3. Make alignment/method/determinism code, tests, and claims agree.
4. Commit the repairs, run CI on that SHA, and verify the protected deployment, clean-session access, rollback and runtime logs without changing visibility/protection.
5. Complete the frozen failure-state matrix, Safari/VoiceOver, manual 400% reflow, and final dependency audit; repeat the already-clean console/Lighthouse check on the final deployed SHA.

### Important follow-up

1. Decide explicitly whether the canonical initial boundary is SSR fixture-store or browser API, then align architecture copy and failure tests.
2. Add a safe license only if/when publication is authorized.
3. Replace all provisional draft counts/algorithm language with final-SHA evidence.

### Do not expand into

- AI summaries, risk scores, investment interpretation, live browser SEC retrieval, accounts, a database, collaboration, or a generalized filing platform.
- Public repository/deployment changes before the release and originality gates permit them.

## Re-audit results

- **Commit/deployment rechecked:** baseline private commit and baseline CI only; no accessible protected Vercel deployment
- **Findings resolved:** note reset stale text, filter-empty recovery, genuine mobile captures, failure capture/metadata, partial exclusion disclosure, “frozen” copy, favicon declaration
- **Findings remaining/disclosed:** all P1/P2 findings above
- **Final decision:** `Not ready` / release `BLOCKED`

## Skill coverage update

- **Verified:** React/TypeScript UI implementation; typed fixture contracts; local state/persistence; responsive design; keyboard/focus behavior; component/unit/E2E testing; local production performance; privacy-aware fixture-first architecture.
- **Needs evidence:** live source ingestion/provenance; true clean-run determinism; full failure matrix; screen-reader/400% accessibility; protected deployment/release/observability; final-SHA CI; dependency audit.
- **Not demonstrated:** original product discovery, real-user validation/adoption, production usage, universal filing extraction, materiality/risk analysis, public operational ownership.
