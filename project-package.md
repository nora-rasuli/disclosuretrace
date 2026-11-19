# Weekly Project Package — FilingDelta

This is the implementation index and traceability source of truth. Read it with the linked brief and handoff. “FilingDelta” is a replaceable working title pending Nora's public-name decision.

## Package identity

- **Project:** FilingDelta (working title)
- **Implementation window / target ship date:** 2026-11-16 through 2026-11-22; maximum 30–40 focused hours
- **Package version:** 1.2.0 — recruiter-presentation scope amendment frozen 2026-11-15
- **Frozen brief:** [project-brief.md](./project-brief.md)
- **Research and source selection:** [research.md](./research.md)
- **Implementation contract:** [implementation-handoff.md](./implementation-handoff.md)
- **Implementation repository:** Not created; wait for Nora's public-name decision and repository authorization
- **Portfolio gap being closed:** Public, inspectable evidence of typed public-data ingestion, difficult document normalization/alignment, complex state/failure handling, accessible dense-document interaction, and disciplined release quality
- **Primary hiring signals (maximum four):**
  1. React and TypeScript product engineering
  2. APIs and complex data flow
  3. End-to-end product ownership
  4. Testing, accessibility, and release quality

## Product in 30 seconds

- **User:** A self-directed investor or research-oriented user updating a company note after an annual filing.
- **Painful moment:** Two very long 10-Ks are open, Item 1A repeats large amounts of text, and the user cannot tell which passage changed without losing source context.
- **Product promise:** “See what changed between annual filings, with every finding connected to the original SEC text.”
- **Golden-path result:** Review a CrowdStrike Item 1A wording change, navigate/filter changes, inspect both official source contexts, save a browser-local follow-up note, and export the current comparison's notes.
- **Concept disclosure:** “A self-directed concept project. The persona and research scenario are simulated; filing text and metadata come from SEC EDGAR.”
- **Demo entry state:** `/` lists exactly CRWD, ABNB, COST, DAL, and F with the frozen pair metadata; CrowdStrike opens `/compare/crwd/2024-2025?view=split&types=added,removed,modified`.
- **Interpretation boundary:** The product compares text. It does not decide materiality, risk direction, investment significance, or an action.

## Requirement map

Every implementation test, completion-report row, screenshot, and audit finding must reference these stable IDs. Status values on return are exactly `Shipped`, `Changed`, or `Cut`. A `Changed` or `Cut` must include reason, impact, and prior authorization; “approximately shipped” is not a status. `SH-01` and `SH-02` retain their stable IDs for traceability even though package versions 1.2 and 1.1 respectively promote them to Must/Never cut.

| ID | Requirement | Acceptance check | Expected evidence | Priority | Cut status |
|---|---|---|---|---|---|
| P-01 | No-sign-up guided golden path | Fresh session reaches a real CRWD change, source context, and note save within 60 seconds | Timed recording/script + Playwright + desktop screenshot | Must | Never cut |
| P-02 | Exact five-company corpus | Catalog contains only the frozen CRWD, ABNB, COST, DAL, and F pairs/accessions from the brief | Fixture manifest + catalog screenshot + schema test | Must | Never cut |
| P-03 | Complete filing provenance | Every pair shows legal name, ticker, CIK, form, period end, filed date, accession, retrieval date, source/index URLs, and source hash | Provenance screenshot + fixture JSON + unit test | Must | Never cut |
| P-04 | Focused Item 1A comparison | Workspace is explicitly Item 1A only and never implies full-filing comparison | UI screenshot + API fixture + copy review | Must | Never cut |
| P-05 | Added/removed/modified review | All three textual classifications are visible, filterable, and have explicit non-color labels | Component tests + screenshot + E2E | Must | Never cut |
| P-06 | Split and unified modes | Both modes preserve the same change/source meaning; split stacks on narrow screens | Desktop/mobile screenshots + component/E2E | Must | Never cut |
| P-07 | Original context for every change | Each displayed change has prior/current source passage and adjacent context where available, with an explicit unavailable label otherwise | Fixture validation + comparison screenshot | Must | Never cut |
| P-08 | Official source access | Every displayed change exposes both applicable official SEC filing links and an Item 1A locator label | Link tests + dated source report + E2E | Must | Never cut |
| P-09 | Text/interpretation boundary | UI says wording/text changed; no score, prediction, risk direction, “material” label, or recommendation | Copy scan + screenshot + claim ledger | Must | Never cut |
| P-10 | Concept disclosure/disclaimer | Exact concept disclosure and concise informational disclaimer appear on index and remain discoverable in workspace | Screenshots + copy test | Must | Never cut |
| P-11 | Research note workflow | Per-change note saves locally, reloads, updates, deletes, and supports reset-all with browser-local disclosure | E2E + storage unit tests + screenshot | Must | Never cut |
| P-12 | URL-restorable review state | Route, `view`, `types`, and `change` restore on reload/share; invalid values fall back safely | URL unit tests + E2E | Must | Never cut |
| DATA-01 | Server-only SEC boundary | Only ingestion CLI contacts SEC; browser/public API makes zero SEC requests | Architecture/code inspection + Playwright network trace | Must | Never cut |
| DATA-02 | SEC-compliant retrieval | Declared User-Agent, one concurrency, ≤2 req/s, `Retry-After`, bounded backoff, disk cache | Ingestion tests + config/code + run report | Must | Never cut |
| DATA-03 | Exact metadata acquisition | Submissions API selects exact `10-K`, rejects silent `10-K/A` substitution, constructs allowlisted URLs | Unit tests + provenance manifest | Must | Never cut |
| DATA-04 | Section-aware extraction | Parser rejects TOC candidates and handles variants, Inline XBRL, layout tables/divs, repeated headers, and next-item fallbacks | Deterministic HTML fixtures + parser test report | Must | Never cut |
| DATA-05 | Fail-closed validation | Unrecognized/missing/reference-only Item 1A produces typed unavailable/partial state and no fabricated empty diff | Parser fixtures + component/E2E state | Must | Never cut |
| DATA-06 | Deterministic generated fixtures | Two clean generation runs produce identical normalized/comparison hashes | CI deterministic check + hash report | Must | Never cut |
| DATA-07 | Provenance/version manifest | Parser, normalization, comparison, and fixture versions plus retrieval/hash/source fields are recorded | Manifest + ADR + schema test | Must | Never cut |
| DATA-08 | Correction/retention policy | Raw HTML stays gitignored; source mismatch is never overwritten silently; release recheck can withdraw/regenerate fixture | Repository inspection + method doc + test | Must | Never cut |
| CMP-01 | Exact and reordered alignment | Identical blocks match globally; reorder alone is `orderChanged` and not add/remove | Unit fixtures + comparison snapshot | Must | Never cut |
| CMP-02 | Light-edit alignment | Documented threshold deterministically pairs lightly edited passages as modified | Unit fixtures for threshold edges + ADR | Must | Never cut |
| CMP-03 | Insert/remove classification | Truly unmatched current/prior blocks become added/removed without significance language | Unit fixtures + UI example | Must | Never cut |
| CMP-04 | Word-level modified spans | Modified pairs expose deterministic old/new word spans without altering source display text | Unit snapshot + component screenshot | Must | Never cut |
| CMP-05 | Stable IDs/source references | Issuer, filing, section, block, comparison, change, and source IDs follow the frozen scheme and every change resolves | Schema/invariant tests + fixture excerpt | Must | Never cut |
| CMP-06 | Ambiguity behavior | Ambiguous matches prefer explicit add/remove or reviewed exclusion; no hidden semantic guess | Ambiguous fixture + method documentation | Must | Never cut |
| NOTE-01 | Safe note input | Notes are plain text, trimmed, max 2,000 chars, React-escaped, and never sent/logged | Unit/security tests + network/log inspection | Must | Never cut |
| NOTE-02 | Persistence failure | Quota/disabled storage preserves in-session draft and explains non-persistence | Component test + screenshot | Must | Never cut |
| UX-01 | Loading state | Loading names the selected issuer/periods and is announced once; no spinner-only screen | Component/E2E + screenshot | Must | Never cut |
| UX-02 | Empty states | Filter-empty and no-meaningful-change states are distinct and neither claims unchanged risk | Component tests + screenshots | Must | Never cut |
| UX-03 | Recovery states | API failure/429, parser failure, missing section, amendment, partial data, broken source, note error, unknown route, retry, and success follow the state table | Failure matrix + tests/screenshots | Must | Never cut |
| UX-04 | Filter/navigation continuity | Filters show counts; next/previous skip hidden changes; retry/navigation preserve issuer and valid URL state | Unit + E2E | Must | Never cut |
| UX-05 | Editorial visual system | Source Serif/IBM Plex, restrained paper/ink palette, readable measure, no dashboard/AI/stock-app clichés | Token/code review + five screenshot set | Must | Never cut |
| UX-06 | Responsive workflow | Golden path works at 390×844 and 320×800; split stacks; no page horizontal overflow or obscured focus | Mobile E2E + screenshots | Must | Never cut |
| UX-07 | Desktop density/readability | At desktop widths, passage columns remain readable and controls/context do not overwhelm the evidence | Desktop screenshots + manual QA | Must | Never cut |
| A11Y-01 | Keyboard completion | Index, modes, filters, change navigation, context, source links, note save/delete/reset all work without pointer | Manual checklist + Playwright | Must | Never cut |
| A11Y-02 | Change focus/navigation | Previous/next and `Alt+Arrow` move focus to active heading, update URL, and announce position/type once | Component/E2E + VoiceOver notes | Must | Never cut |
| A11Y-03 | Screen-reader structure | Landmarks/headings/list/articles and labeled prior/current regions create meaningful linear reading order | Semantic code review + VoiceOver notes | Must | Never cut |
| A11Y-04 | Change semantics beyond color | Visible words/symbols/borders plus hidden `<ins>/<del>` cues; color is supplementary | Screenshot + axe/manual review | Must | Never cut |
| A11Y-05 | Focus visibility/order | Focus is visible, logical, not obscured by sticky UI, and restored after context controls | Keyboard video/checklist | Must | Never cut |
| A11Y-06 | Reflow/zoom/contrast | 320px and 400% reflow, no horizontal page scroll, text 4.5:1 and UI indicators 3:1 minimum | Screenshots + contrast report | Must | Never cut |
| A11Y-07 | Reduced motion | Reduced-motion setting removes smooth scrolling/nonessential transitions; no flashing content | Unit/manual check | Must | Never cut |
| A11Y-08 | Automated/manual gates | Axe has no serious/critical violations; Lighthouse a11y 100 on audited routes; keyboard and VoiceOver smoke pass | Dated reports with environment/commit | Must | Never cut |
| PERF-01 | Lighthouse performance | Median of three production mobile runs is ≥90 on `/` and canonical comparison | Dated Lighthouse artifacts/profile | Must | Never cut |
| PERF-02 | Web performance targets | LCP ≤2.5s, CLS ≤0.1, no >200ms next-change long task under documented profile | Lighthouse/trace evidence | Must | Never cut |
| PERF-03 | Payload/JS budgets | One comparison compressed payload ≤350 KB and route client JS transfer ≤220 KB, or a documented measured exception before audit | Build analyzer/network evidence | Must | Never cut |
| SEC-01 | No unsafe HTML/URL | SEC HTML is never rendered; text is schema-validated; external URLs are HTTPS allowlisted SEC archive paths | Security unit tests + code review | Must | Never cut |
| SEC-02 | Privacy/no secrets | No auth/analytics/user DB; notes never leave browser; `SEC_USER_AGENT` absent from client bundle; no secrets in repo | Network/bundle/secret scan | Must | Never cut |
| SEC-03 | Security headers | CSP, frame/object/base/form restrictions, nosniff, and referrer policy are present and do not break demo | Header capture + E2E | Must | Never cut |
| SEC-04 | Dependency/repository review | Production dependency audit and secret scan are recorded; material findings are fixed or disclosed | Dated command output + issue ledger | Must | Never cut |
| QA-01 | Unit coverage of core logic | Metadata, parser, normalizer, comparison, IDs, schemas, URL, and notes have behavior-focused unit tests | Test list/results mapped to IDs | Must | Never cut |
| QA-02 | Deterministic parser fixtures | Fixtures cover selected structures plus TOC, missing/renamed headings, missing next item, amendment, Inline XBRL, tables, repeated headers | Fixture inventory + green tests | Must | Never cut |
| QA-03 | Deterministic comparison fixtures | Fixtures cover exact, reordered, modified, inserted, removed, ambiguous, and no-change cases | Fixture inventory + snapshots/hashes | Must | Never cut |
| QA-04 | Component/state tests | Success, loading, both empty states, partial, API/parser/source/note errors, modes, filters, and a11y are tested | Component test report | Must | Never cut |
| QA-05 | Critical Playwright coverage | Guided path, 503 retry, partial state, note reload, URL restore, and mobile reflow pass against production build | CI Playwright report/video/trace on failure | Must | Never cut |
| QA-06 | Console and source-link quality | Fresh-session golden path has no console errors/unhandled rejection; all ten source URLs pass dated release verification | Console capture + source report | Must | Never cut |
| REL-01 | Strict typed quality gates | Format, lint, strict typecheck, tests, deterministic check, and production build all exit zero | Exact commands + CI links/logs | Must | Never cut |
| REL-02 | CI/default branch | Protected main accepts only green GitHub Actions; lockfile is frozen; checks run on PR/push | Workflow + branch-settings evidence | Must | Never cut |
| REL-03 | Deployment/no-sign-up access | Vercel production URL works from incognito with no login/setup and supports rollback to known-good deployment | Live URL + clean-session video + deployment record | Must | Never cut |
| REL-04 | Logging/observability | Structured API logs omit passages/notes; error boundary works; one-hour post-deploy error scan recorded | Log schema/code + dated scan | Must | Never cut |
| DOC-01 | Architecture/method documentation | ADR explains fixture-first boundary, parser/alignment method, state ownership, rejected live/AI/database alternatives | ADR + file links | Must | Never cut |
| DOC-02 | Attribution/limitations | SEC, fonts, packages, retrieval dates, correction policy, parser coverage, and limitations are exact | Attribution inventory + method doc | Must | Never cut |
| DOC-03 | Public-claim integrity | Claims ledger contains only directly verifiable or dated measured claims; unsafe claims are listed | Completion report + copy scan | Must | Never cut |
| DOC-04 | Concept honesty | Simulated persona/scenario and real SEC data are consistently distinguished; no users/adoption/business impact invented | App copy + report + screenshot | Must | Never cut |
| DOC-05 | Audit-stage boundary | Return implementation report and case-study source facts, but no final public README or portfolio case study | Repository/file inspection | Must | Never cut |
| SH-01 | Compact textual-change ledger | Comparison header shows exact Total, Added, Removed, and Modified fixture counts in one semantic `dl`, each with a visible word label and symbol; filtered state separately reports N visible; no chart, score, severity, trend, or risk meaning | Desktop/mobile screenshots + invariant/component tests + semantic review | Must | Never cut |
| SH-02 | Note export | Saved notes for the current comparison download as client-generated UTF-8 Markdown labeled user-authored, with issuer/pair metadata, change IDs, timestamps, and official SEC URLs but no filing passage text | E2E + serialization unit test + sample export | Must | Never cut |
| SH-03 | Copy active-change link | Copies current URL including valid active change and gives accessible confirmation | Component/E2E | Should | Cut first |

## Frozen decisions

| Decision | Choice | Why | Reopen only if |
|---|---|---|---|
| Public identity | FilingDelta is a private working title stored in one config value | Active name collisions were found | Nora selects the distinct public name; this is required before public repo/brand |
| Scope | Five exact pairs; 10-K; Item 1A only | Fits one week and keeps a coherent corpus | A frozen source is removed/corrected beyond use; replacement requires Nora + package revision |
| Demo data | Pre-ingested deterministic fixtures; no live fallback | Reliability, reproducibility, SEC compliance | Never for this MVP; live retrieval is post-audit work |
| AI | None | Deterministic comparison is independently useful and fits the week | Only after MVP audit and only as secondary cited review aid |
| Frontend | Next.js 16 App Router + React 19 + strict TypeScript on Node 22 | Modern supported full-stack React with one deployable unit | Blocking compatibility/security issue documented by implementation agent |
| Styling | CSS Modules + CSS custom-property tokens; Source Serif 4 + IBM Plex Sans | Purposeful editorial craft with small dependency surface | Font/license or verified performance/accessibility blocker |
| API | Versioned read-only Next Route Handlers over generated fixtures | Demonstrates async/retry/data contract without a database | Framework blocker; static endpoint replacement must preserve contract and evidence |
| Ingestion | Server-only Node/TS CLI using Cheerio + Zod | Inspectable, same-language pipeline, no browser scraping | Selected filing cannot be parsed credibly; stop and report before changing parser family |
| Comparison | Exact hash → heading partitions → deterministic sequence alignment → unmatched recovery → word diff | Handles reorder/edit/insert/remove without semantic claims | Fixture evidence shows systematic false pairings; threshold/algorithm change requires version bump and regeneration |
| IDs | Deterministic accession/ordinal/hash IDs from the brief | Deep links, fixtures, tests, notes, and audits need stability | Parser/algorithm version changes; migration/reset behavior must be explicit |
| URL state | Route + `view`, `types`, `change` query keys | Reload/shareable review state | Accessibility or Next routing blocker with equivalent state contract |
| Server state | TanStack Query v5 | Explicit async/retry/partial behavior | Bundle/performance measurement shows material harm; native fetch replacement preserves behavior/tests |
| Client state | Local component state/reducer; no global store | Smallest credible ownership boundary | State coupling becomes demonstrably unmaintainable, documented in ADR |
| Notes | Plain text localStorage, per change, 2,000 chars, no network | No sign-up/privacy/cost | Browser storage proves unusable for golden path; no server persistence may be added without Nora |
| Note export | Client-only UTF-8 Markdown for current-comparison notes; metadata/IDs/timestamps/SEC URLs, no filing passages; sanitized filename; temporary object URL revoked | Portable research artifact for about one hour of work and no backend | Browser download is inaccessible or insecure; use an equivalent client-only text download and document it—do not add a service |
| Hosting | Vercel on temporary `vercel.app`; no custom domain | Smallest Next deployment and preview flow | Existing account unavailable; Nora must authorize another host/account |
| CI/CD | GitHub Actions required before protected-main merge; Vercel previews/production from Git | Green checks before production with minimal secret handling | Git provider/host constraint; equivalent gates required |
| Observability | Structured server logs + Vercel logs/metrics; no paid vendor | Runtime is small and read-only | Untraceable production failure appears during build/audit |
| Visual direction | Editorial research workspace, dense readable document comparison, restrained non-color-only semantics | Matches task and avoids dashboard/AI clichés | Accessibility/usability evidence requires a bounded visual adjustment |
| Public claims | Text comparison only; no materiality/risk direction/advice/novelty | Financial credibility and truthfulness | Never; only exact filing quotations may use those words in source context |

## Cut order

1. **Cut first:** `SH-03` copy-link convenience. URL restoration remains required.
2. **Cut second:** Firefox secondary smoke and nonessential transition polish (not represented as a shipped requirement).
3. **Stop instead of cutting:** Any Must requirement, any issuer/pair, provenance/context, compact change ledger, local notes or export, keyboard/reflow, relevant states, deployment, tests, CI, or factual evidence.

Do not start AI, live ingestion, arbitrary search, additional filings/sections, auth, database, analytics, billing, or a public-name/domain effort as “extra” work.

## Required artifacts on return

- [ ] Authorized repository URL and live no-sign-up Vercel URL; commit SHA and deployment ID.
- [ ] Completed requirement table containing every ID above with `Shipped`, `Changed`, or `Cut`, exact evidence links, and tests referencing IDs.
- [ ] Five-pair catalog/provenance manifest and parser/comparison/fixture version ledger.
- [ ] Sample current-comparison note export plus unit/E2E evidence for contents, keyboard activation, filename, download, and object-URL cleanup.
- [ ] Ingestion report with source URLs, retrieval dates, full hashes, parser validation, exclusions, and generated comparison counts.
- [ ] Desktop split with compact change ledger, desktop unified/note, mobile/reflow with wrapped ledger, index, and partial/error screenshots with route/viewport/date/commit/fixture metadata.
- [ ] Architecture ADR(s), rejected alternatives, final file tree, setup/regeneration commands, and state/data-flow explanation.
- [ ] Green CI link/logs and exact local commands/results for format, lint, types, unit/component, deterministic fixtures, build, and Playwright.
- [ ] Failure-test matrix with actual results for SEC 429/unavailable, unrecognized structure, missing/renamed Item 1A, amendment, no change, source unavailable, invalid/oversized note, API retry, and partial comparison.
- [ ] Accessibility evidence: axe, Lighthouse 100 target, keyboard checklist, VoiceOver notes, focus/reflow/zoom/contrast/reduced-motion results, all dated/environment-scoped.
- [ ] Performance evidence: three-run Lighthouse medians, LCP/CLS, payload and JS transfer, interaction trace, date/profile/route/commit/cache state.
- [ ] Security/privacy evidence: headers, source allowlist, client-bundle env review, network/log note privacy, secret scan, dependency audit.
- [ ] Release evidence: incognito demo, no console errors, dated ten-link SEC verification, one-hour production error-log scan, rollback target.
- [ ] Attribution/license inventory, limitations, disclosure/disclaimer copy, and safe/unsafe claims ledger.
- [ ] 60–120 second recording or exact recording script tied to the canonical demo.
- [ ] Case-study source facts and measured result ledger only. No final public README or portfolio case study before independent audit.

## Publication gates

- **Identity gate:** Nora has approved a distinct public name; no collision-prone FilingDelta repository/domain/brand is made public.
- **Demo gate:** A new evaluator gets source-grounded value in under 60 seconds with no account or setup.
- **Scope gate:** Exactly the frozen five pairs and Item 1A; no hidden live dependency or unapproved substitution.
- **Credibility gate:** No placeholder/broken source, fabricated users/adoption, unsupported metric, financial conclusion, SEC-affiliation implication, or untraceable output.
- **Data gate:** All ten official URLs, dates/accessions/hashes, retrieval dates, parser validations, and generated fixtures are inspectable.
- **Accessibility gate:** Keyboard golden path passes; no P1 manual issue; no serious/critical axe issue; Lighthouse accessibility target is met on audited routes.
- **Quality gate:** Default-branch CI is green, production build/E2E pass, required states work, console is clean, and source links pass the dated check.
- **Performance gate:** Documented Lighthouse/performance/payload targets pass or the project is not portfolio-ready.
- **Story gate:** App, implementation report, later README, and later case study use the same user, promise, corpus, limitations, and measured results.

## Open decisions for Nora

1. **Choose the public project name.** “FilingDelta” / “Filing Delta” is already used by active financial products. The implementation may proceed privately with a replaceable `PRODUCT_NAME`, but repository publication, public deployment branding, social preview, and domain work wait for Nora's choice.

No other product decision is delegated to Nora. Account connection and public-repository/deployment actions will require normal authorization when implementation begins, but they do not reopen this package.
