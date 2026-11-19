# Evidence Register — FilingDelta

This register inventories retained implementation evidence. It does not upgrade a `Changed` requirement to `Shipped`; the independent audit must reproduce the relevant result.

| Evidence ID | Requirement/claim | Artifact | Method/profile | Captured | Result | Limitations |
|---|---|---|---|---|---|---|
| E-001 | P-01, P-05, P-11, P-12, SH-02 | `e2e/filingdelta.spec.ts` and `evidence/test-results/playwright/index.html` | Playwright against `next start`, desktop Chromium and Pixel 5 profile | 2026-11-18 | 8/8 E2E tests pass | Local production server, not public deployment |
| E-002 | REL-01 | `evidence/completion-report.md` | `pnpm quality` on Node 24.22.3 | 2026-11-18 | Format, lint, strict types, 32 tests, deterministic fixture check, and build pass | CI/default-branch run remains unavailable |
| E-003 | QA-03, CMP-01–CMP-06 | `tests/unit/alignment.test.ts` | Deterministic unit cases for exact, reordered, light-edit, insert, remove, ambiguity, no-change, spans, and repeatability | 2026-11-18 | Pass | Full live-corpus generation remains consent-gated |
| E-004 | QA-04, NOTE-02, UX-01–UX-03 | `tests/component/workspace.test.tsx` | React Testing Library, Vitest, jest-axe | 2026-11-18 | Seven component/state tests pass | Does not exhaust every frozen state-table row |
| E-005 | DATA-06, DATA-07 | `data/generated/v1/version-manifest.json` | `pnpm fixtures:check` | 2026-11-18 | Five committed fixture hashes match | Fixtures remain curated partial data; raw source hashes pending |
| E-006 | P-02, P-03, P-08 | `data/corpus/five-pair-source-manifest.json` | Schema validation and fixture tests | 2026-11-18 | Exact five pairs and allowlisted SEC URLs pass | Dated live ten-source request is blocked pending consent |
| E-007 | P-01, UX-05, UX-07 | `evidence/screenshots/01-index-desktop.png` | Local production screenshot | 2026-11-17 | Index and guided entry visible | Pre-publication working title; no deployment ID |
| E-008 | P-05–P-08, SH-01 | `evidence/screenshots/02-comparison-split-desktop.png` | Local production screenshot | 2026-11-17 | Split comparison, source context, and ledger visible | Partial curated fixture |
| E-009 | P-06, P-11, SH-02 | `evidence/screenshots/03-comparison-unified-note.png` | Local production screenshot | 2026-11-17 | Unified view and note workflow visible | Screenshot alone does not prove persistence/export; pair with E-001 |
| E-010 | UX-06, A11Y-06 | `evidence/screenshots/04-comparison-mobile-390.png`, `05-comparison-mobile-320.png` | 390×844 and 320×800 local production captures | 2026-11-17 | Responsive stacking visible | Manual 400% browser zoom remains pending |
| E-011 | A11Y-04, A11Y-08 | `tests/component/workspace.test.tsx` | jest-axe on comparison success state | 2026-11-18 | No serious or critical violations | Automated check is not complete WCAG or screen-reader evidence |
| E-012 | PERF-01, PERF-02 | `evidence/performance/index-run-*.json`, `comparison-run-*.json` | Lighthouse mobile simulated throttling, three local production runs per route | 2026-11-17 | Median performance/accessibility 100/100 on both routes | One cold-font comparison outlier is disclosed; not a public deployment |
| E-013 | PERF-03 | `evidence/performance/payload-measurement.txt` | Local production network/build measurement | 2026-11-17 | Comparison API gzip 1,984 B; route scripts 192,866 B | Local measurement only |
| E-014 | SEC-01–SEC-04 | `evidence/security/audit-summary.txt`, `evidence/security/headers.txt` | Production dependency audit, targeted secret scan, header capture | 2026-11-17 | Recorded checks pass | Must be repeated against the public deployment |
| E-015 | P-08, QA-06 | `evidence/source-verification-status.md` | Manifest/schema/allowlist review | 2026-11-18 | Static URL boundary verified | Live SEC request was stopped before transmitting Nora's email without explicit consent |
| E-016 | DOC-01, DOC-02 | `docs/architecture/0001-fixture-first-sec-boundary.md`, `docs/method.md` | Architecture and method inspection | 2026-11-17 | Fixture-first, parsing, comparison, and limitation decisions documented | Independent audit not yet performed |
| E-017 | DOC-03, DOC-04 | `docs/claims-ledger.md` | Claim-to-evidence review | 2026-11-17 | Safe and prohibited claims recorded | Must be reconciled after deployment/audit |

## Open evidence gaps

- Explicit consent to send Nora's email address in the SEC User-Agent, followed by two clean ingestion runs, raw hashes, and a dated ten-source verification report.
- Manual VoiceOver + Safari smoke test and manual 400% browser-zoom record.
- GitHub Actions/default-branch evidence, protected-branch state, public deployment, rollback record, and post-deploy log scan.
- Independent audit and any required repair/re-audit evidence.
