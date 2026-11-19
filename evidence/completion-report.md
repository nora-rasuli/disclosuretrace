# FilingDelta completion report — local implementation

## Identity and deployment

| Field | Value | Evidence |
|---|---|---|
| Final/working name | FilingDelta, private replaceable working title; not approved for publication | Product config and persistent working-title label |
| Repository | Local project only; no standalone remote authorized | Project directory |
| Production URL | Not deployed; external action not authorized | Release gate |
| Commit/deployment | No standalone Git repository or deployment | Release gate |
| Fixture version | v1; manual-source-review-2026-11-17; normalizer 1.0.0; align 1.0.0 | `data/generated/v1/version-manifest.json` |

## Shipped summary

A deploy-ready Next.js 16/React 19 TypeScript application implements the exact five-pair, no-sign-up Item 1A review workflow. It has deterministic schema-validated fixtures, a read-only API, split/unified review, non-color change semantics, official SEC links, semantic counts, URL-restorable review state, browser-local note CRUD/reset, client-only Markdown export, explicit partial-data/provenance disclosures, recovery behavior, security headers, CI, tests, screenshots, and local production-mode performance evidence.

The persona/scenario is simulated. Displayed passages and metadata were manually verified against official SEC filings, but the fixtures are intentionally partial. Full-section extraction, live ten-link verification, and raw-source hashes remain gated on an authorized contact-bearing SEC User-Agent. No investment meaning or advice is claimed.

## Requirement ledger

| Requirement ID | Status (`Shipped`/`Changed`/`Cut`) | Evidence | Difference/reason/impact |
|---|---|---|---|
| P-01 | Shipped | E2E P-01; screenshots 01–03 | CRWD path, keyboard navigation, context, note, export, reload pass. |
| P-02 | Shipped | Manifest; fixture test; index screenshot | Exactly five frozen pairs only. |
| P-03 | Changed | Provenance UI/JSON | All fields except raw source SHA-256; visibly pending because contact-bearing ingestion was not authorized. |
| P-04 | Shipped | UI/API/copy review | Item 1A-only boundary is explicit. |
| P-05 | Shipped | Component/E2E/screenshots | Three explicit labels and filters. |
| P-06 | Shipped | Screenshot set; mobile E2E | Split/unified preserve meaning; split stacks. |
| P-07 | Shipped | Fixture/schema tests; context UI | Every displayed passage resolves to source blocks/links; unavailable counterpart/context is explicit. |
| P-08 | Changed | E2E allowlist; source status | Official links exist; new live check of all ten needs authorized SEC contact data. |
| P-09 | Shipped | Copy/security tests; claims ledger | No score, advice, prediction, risk direction, or materiality. |
| P-10 | Shipped | Index/workspace screenshots | Concept disclosure and disclaimer are discoverable. |
| P-11 | Shipped | Notes unit tests; E2E | Local save/reload/update/delete/reset implementation and disclosure. |
| P-12 | Shipped | E2E; URL logic | Route/view/types/change restore with safe fallbacks. |
| DATA-01 | Shipped | ADR; network/security test | Runtime uses same-origin fixture APIs; SEC access is CLI-only. |
| DATA-02 | Shipped | SEC client code | Sequential 500ms throttle, User-Agent, cache, Retry-After, bounded retry. |
| DATA-03 | Shipped | Metadata pipeline; manifest | Exact 10-K/accession validation rejects amendment substitution. |
| DATA-04 | Shipped | Parser fixtures/tests | TOC, renamed/missing headings, missing boundary, Item 1B/1C/2, Inline XBRL, div/table layouts, page numbers, and repeated headers pass. |
| DATA-05 | Shipped | Parser tests; partial/error UI | Fails closed and never fabricates an empty complete diff. |
| DATA-06 | Changed | `pnpm fixtures:check` | Five committed hashes match; two clean live generations require SEC contact authorization. |
| DATA-07 | Changed | Version/provenance manifests; ADR | Versions/fixture hashes exist; raw source hashes pending. |
| DATA-08 | Shipped | Method; cache/hash code; gitignore | Raw HTML excluded, mismatch fails, release correction path documented. |
| UX-01 | Changed | Loading component | Issuer/period state exists; server-seeded production route no longer exposes a long loading state or screenshot. |
| UX-02 | Shipped | Component test and distinct UI copy | Filter-empty and no-meaningful-text states are distinct and neither claims unchanged risk. |
| UX-03 | Changed | 503 E2E; partial/error UI | Recovery works; entire package failure screenshot matrix was not produced. |
| UX-04 | Shipped | E2E; URL state | Counts, skip-hidden navigation, retry, continuity pass. |
| UX-05 | Shipped | CSS; screenshots | Self-hosted Source Serif/IBM Plex editorial system. |
| UX-06 | Shipped | 390/320 screenshots and E2E | No horizontal page overflow; split stacks. |
| UX-07 | Shipped | Desktop screenshots/browser audit | Readable columns and restrained controls. |
| A11Y-01 | Changed | Keyboard E2E/browser audit | Golden path passes; every secondary destructive action was not manually recorded. |
| A11Y-02 | Shipped | E2E/accessibility tree | Buttons/Alt+Arrow update URL, focus heading, announce position/type. |
| A11Y-03 | Shipped | Accessibility-tree audit | Meaningful landmarks/headings/list/articles/regions. |
| A11Y-04 | Shipped | Axe/screenshots | Visible labels/symbols/borders plus ins/del cues. |
| A11Y-05 | Changed | CSS/browser audit | Focus styling/order checked; no keyboard video. |
| A11Y-06 | Changed | 320 E2E; Lighthouse 100 | Reflow passes at 320; no separate 400% zoom/formal contrast worksheet. |
| A11Y-07 | Shipped | Reduced-motion CSS | Nonessential transitions removed under reduced motion. |
| A11Y-08 | Changed | Axe clean; Lighthouse a11y 100 | Automated gates pass; VoiceOver smoke not completed. |
| PERF-01 | Shipped | Six Lighthouse JSON reports | Local production mobile median 100 on both routes. |
| PERF-02 | Shipped | Lighthouse JSON | Median LCP 0.76s, CLS 0.024/0.056, TBT 22/27ms; one disclosed cold-font outlier. |
| PERF-03 | Shipped | Payload report/network log | Comparison API gzip 1,984B; comparison JS transfer 192,866B. |
| SEC-01 | Shipped | Security tests/scan/schema | No HTML injection; validated text; HTTPS SEC allowlist. |
| SEC-02 | Shipped | Audit summary; E2E | No auth/analytics/user DB; notes local; no client contact header. |
| SEC-03 | Shipped | Header capture; E2E | CSP/frame/object/base/form/nosniff/referrer headers pass. |
| SEC-04 | Shipped | Production audit; secret scan | Exit 0; no known vulnerabilities or scanned secret patterns. |
| QA-01 | Changed | 17 tests | Core IDs/parser/alignment/notes/security/schema covered; metadata/URL cases not exhaustive. |
| QA-02 | Shipped | Parser and metadata fixture tests | Requested TOC/boundary/heading/Inline-XBRL/table/repeated-header/amendment rejection cases pass. |
| QA-03 | Shipped | Alignment tests/hash manifest | Exact, reordered, modified, inserted, removed, ambiguous, no-change, word-span, and repeatability cases pass deterministically. |
| QA-04 | Changed | Component/axe tests | Success, loading, error, partial, both empty states, note persistence failure, and a11y are covered; the entire package state table is not exhaustively component-tested. |
| QA-05 | Shipped | Playwright 8/8 | Desktop/mobile guided path, 503 recovery, partial, reload, URL, reflow, source allowlist pass. |
| QA-06 | Changed | Zero-console screenshot run; E2E allowlist | Fresh flow clean; live ten-URL release verification awaits authorized header. |
| REL-01 | Shipped | `pnpm quality`; E2E | Format/lint/types/tests/determinism/build and browser tests exit zero. |
| REL-02 | Changed | CI workflow/lockfile | Workflow exists; no remote, protected main, or Actions run was authorized. |
| REL-03 | Changed | Local production E2E | Deploy-ready/no-sign-up locally; no public URL/rollback without authorization. |
| REL-04 | Changed | Structured log/error code | No one-hour post-deploy scan because there is no deployment. |
| SH-01 | Shipped | Semantic `dl`; screenshots/tests | Exact counts plus separately visible count; no chart/score. |
| SH-02 | Shipped | Export unit/E2E | User-authored Markdown has metadata/IDs/timestamps/URLs, no filing passage text. |
| SH-03 | Cut | Frozen package cut order | Explicit cut-first Should item; URL restoration remains. |

## Verification

| Check | Command/method | Date/environment | Result/exit code | Evidence |
|---|---|---|---|---|
| Format | `pnpm format:check` | 2026-11-17, Node 24.22.3 | Pass/0 | `pnpm quality` |
| Lint | `pnpm lint` | same | Pass/0, zero warnings | `pnpm quality` |
| Strict types | `pnpm typecheck` | same | Pass/0 | `pnpm quality` |
| Unit/component | `pnpm test` | 2026-11-18, Node 24.22.3 | 32/32 | terminal result |
| Component + axe | Vitest/jsdom/jest-axe | same | Pass; no serious/critical | suite |
| Deterministic fixtures | `pnpm fixtures:check` | same | 5/5 hashes | version manifest |
| Production build | `pnpm build` | Next 16.4.6 | Pass/0 | route table |
| Critical E2E | `pnpm test:e2e` | Chromium desktop + Pixel 5 | 8/8 | Playwright HTML report |
| Keyboard | Playwright + in-app browser | Chrome/Chromium | Golden path pass | P-01/accessibility-tree audit |
| VoiceOver | Not run | local | Changed | open issue |
| Lighthouse accessibility | 3 runs/route | Chrome for Testing 159 mobile profile | 100 all six | performance JSONs |
| Lighthouse performance | 3 sequential runs/route | same | median 100 both | raw JSONs |
| Mobile/reflow | Playwright 390/320 | production build | pass/no overflow | screenshots 04–05 |
| Security/privacy | audit/scans/headers | local | pass/0 | security evidence |
| SEC source links | API allowlist + manual CRWD inspection | local | partial | source status report |
| Console/log scan | screenshot browser run | five captures | zero errors | capture script |

## Filing and comparison ledger

| Pair | Accessions | Retrieval/hash evidence | Parser status | Change counts | Limitations |
|---|---|---|---|---|---|
| CRWD 2024–2025 | 0001535527-24-000007 → 0001535527-25-000009 | Retrieved 2026-11-17; fixture e6b5…2538; raw pending | Manual verified partial | 3 = 1/1/1 | Not full-section |
| ABNB 2024–2025 | 0001559720-25-000010 → 0001559720-26-000004 | Retrieved 2026-11-17; fixture cadf…ab0; raw pending | Manual verified partial | 1 = 0/0/1 | Not full-section |
| COST 2025–2026 | 0000909832-25-000101 → 0000909832-26-000093 | Retrieved 2026-11-17; fixture 68f0…fe2; raw pending | Manual verified partial | 1 = 0/0/1 | Not full-section |
| DAL 2024–2025 | 0000027904-25-000004 → 0000027904-26-000013 | Retrieved 2026-11-17; manifest; raw pending | Manual verified partial | 2 = 0/0/2 | Not full-section |
| F 2024–2025 | 0000037996-25-000013 → 0000037996-26-000015 | Retrieved 2026-11-17; manifest; raw pending | Manual verified partial | 3 = 1/1/1 | Not full-section |

## Scope differences and cuts

- Full SEC generation was gated before sending personal contact data. Consequence: all fixtures are `partial`, raw hashes are pending, and full-section completeness is not claimed. Repair is documented in the source status report.
- Public naming, repository creation, deployment, branch protection, rollback, and monitoring were not authorized. Configuration is ready; external facts are not fabricated.
- SH-03 was cut under the frozen cut-first authorization. No Must item was intentionally removed; Must rows are `Changed` where evidence/completeness is missing.

## Accessibility and performance evidence

Axe found no serious/critical violations. Lighthouse accessibility is 100 on all six runs. The accessibility tree was inspected for index/workspace; next-change focus, URL change, live announcement, unified mode, and expandable source context were observed. The automated 320 CSS-pixel reflow proxy passes without horizontal overflow; VoiceOver and manual 400% browser zoom remain open.

Default Lighthouse mobile simulated throttling ran against `next start`. Index median: performance 100, LCP 0.757s, CLS 0.024, TBT 22ms. Comparison median: performance 100, LCP 0.756s, CLS 0.056, TBT 27ms. Raw evidence includes a cold-font comparison outlier (86, LCP 2.969s, CLS 0.193).

## Security, privacy, attribution, and retention

The app renders validated text, never SEC HTML. Links are HTTPS SEC archive paths. CSP restricts runtime sources and blocks frames/objects/base changes/external form actions. Notes stay in localStorage; export is client-side. Production audit and targeted secret/header scans are clean. Raw HTML is cache-only/gitignored and mismatches fail. SEC EDGAR attribution/non-endorsement is persistent.

## Claims safe to publish

- Exact five-pair, Item 1A-only local research workflow — manifest/catalog.
- 8/8 desktop/mobile production browser tests pass locally — Playwright report.
- Local mobile Lighthouse median 100 performance and 100 accessibility on both audited routes — six raw reports, with profile/outlier disclosure.
- Browser-local notes and client-only Markdown export — code/unit/E2E.
- Deterministic committed comparison hashes match manifest — fixture check.

## Claims not supported or prohibited

Do not claim full filing coverage, risk direction, materiality, advice, prediction, scoring, accuracy beyond reviewed passages, time saved, real users/adoption, customers, revenue, business impact, universal support, AI use, novelty, SEC endorsement, production uptime, or public availability. Do not publish the working name before identity resolution.

## Open issues

| Severity | Issue | Affected requirement/user | Reproduction/evidence | Smallest next action |
|---|---|---|---|---|
| High | Full raw ingestion/hashes not run | P-03, DATA-06/07 | Partial banner/null SHA | Authorize `SEC_USER_AGENT`; generate twice; review hashes |
| High | No live ten-link release check | P-08, QA-06 | Source status | Run `pnpm sources:verify` with authorized header |
| High | No deployment/rollback proof | REL-02/03/04 | Identity table | Resolve name; authorize repo/Vercel; deploy/monitor |
| Medium | VoiceOver/400% evidence absent | A11Y-06/08 | Verification table | Record manual smoke/reflow checklist |
| Medium | UI state matrix is not exhaustive | QA-04 | Test inventory | Add only the remaining state-table component cases required by the independent audit |
| Low | Cold-font Lighthouse outlier | PERF-01/02 | comparison-run-2.json | Preload/subset critical fonts and rerun |

## Case-study source facts

- 5 exact pairs; 10 filings; 10 index links.
- 10 displayed partial changes: 2 added, 2 removed, 6 modified.
- 32 passing unit/component tests; 8 passing desktop/mobile E2E tests.
- 5 screenshots; 6 Lighthouse reports; accessibility 100 on every report.
- Comparison API gzip 1,984 bytes; route script transfer 192,866 bytes.
- No AI, auth, analytics, user database, or server-side note storage.
