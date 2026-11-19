# Evidence Register — DisclosureTrace

This register inventories retained implementation evidence. It does not upgrade a `Changed` requirement to `Shipped`; the independent audit must reproduce the relevant result.

| Evidence ID | Requirement/claim | Artifact | Method/profile | Captured | Result | Limitations |
|---|---|---|---|---|---|---|
| E-001 | P-01, P-05, P-11, P-12, SH-02 | `e2e/filingdelta.spec.ts` and `evidence/test-results/playwright/index.html` | Playwright against `next start`, desktop Chromium and Pixel 5 profile | 2026-11-18 | Independent repair run: 10/10 E2E tests pass | Local production server, not protected deployment |
| E-002 | REL-01 | `evidence/completion-report.md`, `independent-audit.md` | `pnpm quality` on Node 24.22.3 | 2026-11-18 | Independent repair run: format, lint, strict types, 33 tests, committed-fixture hash check, and build pass | Hash check is not two clean generations; repairs are uncommitted and not in CI |
| E-003 | QA-03, CMP-01–CMP-06 | `tests/unit/alignment.test.ts` | Deterministic unit cases for exact, reordered, light-edit, insert, remove, ambiguity, no-change, spans, and repeatability | 2026-11-18 | Pass | Full live-corpus generation remains consent-gated |
| E-004 | QA-04, NOTE-02, UX-01–UX-03 | `tests/component/workspace.test.tsx` | React Testing Library, Vitest, jest-axe | 2026-11-18 | Independent repair run includes reset and filter-empty recovery | Does not exhaust every frozen state-table row |
| E-005 | DATA-06, DATA-07 | `data/generated/v1/version-manifest.json` | `pnpm fixtures:check` | 2026-11-18 | Five committed fixture hashes match | Fixtures remain curated partial data; raw source hashes pending |
| E-006 | P-02, P-03, P-08 | `data/corpus/five-pair-source-manifest.json` | Schema validation and fixture tests | 2026-11-18 | Exact five pairs and allowlisted SEC URLs pass | Dated live ten-source request is blocked pending consent |
| E-007 | P-01, UX-05, UX-07 | `evidence/screenshots/01-index-desktop.png`, `metadata.json` | Independent local production recapture | 2026-11-18 | DisclosureTrace index, disclosure, and first filing pairs visible | Working tree/local build; no deployment ID |
| E-008 | P-05–P-08, SH-01 | `evidence/screenshots/02-comparison-split-desktop.png`, `metadata.json` | Independent local production recapture | 2026-11-18 | Split comparison, source context, partial disclosure, and ledger visible | Partial curated fixture |
| E-009 | P-06, P-11, SH-02 | `evidence/screenshots/03-comparison-unified-note.png`, `metadata.json` | Independent local production recapture | 2026-11-18 | Unified view and note workflow visible | Screenshot alone does not prove persistence/export; pair with E-001 |
| E-010 | UX-06, A11Y-06 | `evidence/screenshots/04-comparison-mobile-390.png`, `05-comparison-mobile-320.png`, `metadata.json` | Genuine 390px and 320px viewport captures | 2026-11-18 | Unique hashes/dimensions; responsive stacking and no page overflow verified | Manual 400% browser zoom remains pending |
| E-011 | A11Y-04, A11Y-08 | `tests/component/workspace.test.tsx` | jest-axe on comparison success state | 2026-11-18 | No serious or critical violations | Automated check is not complete WCAG or screen-reader evidence |
| E-012 | PERF-01, PERF-02 | `evidence/performance/audit-index-run-*.json`, `audit-comparison-run-*.json` | Independent Lighthouse 13.6.0 mobile simulation, three local production runs per route | 2026-11-18 | Median performance/accessibility 100/100 on both routes; median LCP 756/763 ms | One comparison outlier: performance 86, LCP 2.94 s, CLS 0.193; captured before favicon repair; not a deployment |
| E-013 | PERF-03 | `evidence/performance/payload-measurement.txt` | Local production network/build measurement | 2026-11-17 | Comparison API gzip 1,984 B; route scripts 192,866 B | Local measurement only |
| E-014 | SEC-01–SEC-04 | `evidence/security/audit-summary.txt`, `evidence/security/headers.txt` | Production dependency audit, targeted secret scan, header capture | 2026-11-17 | Recorded checks pass | Must be repeated against the public deployment |
| E-015 | P-08, QA-06 | `evidence/source-verification-status.md` | Manifest/schema/allowlist review | 2026-11-18 | Static URL boundary verified | Live SEC request was stopped before transmitting Nora's email without explicit consent |
| E-016 | DOC-01, DOC-02 | `docs/architecture/0001-fixture-first-sec-boundary.md`, `docs/method.md` | Architecture and method inspection | 2026-11-17 | Fixture-first, parsing, comparison, and limitation decisions documented | Independent audit not yet performed |
| E-017 | DOC-03, DOC-04 | `docs/claims-ledger.md` | Claim-to-evidence review | 2026-11-17 | Safe and prohibited claims recorded | Must be reconciled after deployment/audit |
| E-018 | UX-03, QA-05 | `evidence/screenshots/06-comparison-refresh-error.png`, `metadata.json` | Local production fixture with explicitly mocked API 503 during refresh | 2026-11-18 | Preserves visible comparison and exposes retryable refresh error | Does not prove an initial API-failure state because SSR seeds the fixture |
| E-019 | SEC-03 | `/private/tmp/disclosuretrace-*-headers.txt`, summarized in `independent-audit.md` | Local production `curl` to `/` and `/api/v1/*` | 2026-11-18 | CSP, frame/object/base/form, nosniff, referrer, immutable API cache/ETag verified | Temporary raw capture; protected deployment not tested |
| E-020 | REL-02 | GitHub Actions run 44458607088; repository settings inspection | Private GitHub baseline SHA `ed00f764...` | 2026-11-18 | Baseline CI green; repository confirmed private | Private branch protection unavailable on current plan; repair set uncommitted |
| E-021 | Audit decision, all IDs | `independent-audit.md` | Independent source, browser, test, CI, performance, security and claim review | 2026-11-18 | `Not ready`; release `BLOCKED` | P1/P2 findings require repair and re-audit |
| E-022 | Portfolio originality | `originality-gate.md` | Side-by-side competitor gate | 2026-11-18 | `Pivot`; do not feature as an original portfolio product | Requires material workflow pivot, not a rename |
| E-023 | QA-06, PERF-01, favicon repair | `evidence/performance/audit-comparison-repair.json`, `public/favicon.svg` | Final repaired local production Lighthouse 13.6.0 run | 2026-11-18 | Performance/a11y 100, best practices 96, LCP 760 ms, CLS 0.052, TBT 8 ms, zero console errors; favicon 200 | Single repair-confirmation run; CSP inspector issue remains; protected deployment not tested |
| E-024 | REL-03, SEC-04 | Vercel project protection/API checks and `pnpm audit --prod` | Control Room post-audit verification | 2026-11-18 | All-deployment authentication; anonymous `302`; authenticated root/catalog `200`; zero bypasses; no known production dependency vulnerabilities | Deployed build predates the repair set; no rollback/log-duration evidence |

## Open evidence gaps

- Explicit consent to send Nora's email address in the SEC User-Agent, followed by two clean ingestion runs, raw hashes, and a dated ten-source verification report.
- Manual VoiceOver + Safari smoke test and manual 400% browser-zoom record.
- Final repair SHA/CI, protected-branch control, protected deployment access, rollback record, and post-deploy log scan.
- Corrected alignment/determinism implementation and claims, plus re-audit evidence.
- New originality gate after a material workflow pivot if the project is to be featured.
