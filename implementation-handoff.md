# Implementation Handoff — FilingDelta

You are implementing a one-week professional portfolio project for Nora Rasuli. “FilingDelta” is a private working title pending Nora's public-name choice. Treat this package as a product and audit contract, not inspiration.

The work will receive an independent audit against live behavior, repository code, the exact requirement IDs, source/provenance records, verification artifacts, and public claims. An implementation summary is not proof; return inspectable evidence.

## Read in this order

1. [project-package.md](./project-package.md) — IDs, frozen decisions, cuts, return artifacts, and gates.
2. [project-brief.md](./project-brief.md) — user, golden path, states, UX, architecture, data model, quality plan, and language boundaries.
3. [research.md](./research.md) — SEC rules, alternatives, parsing risks, exact filings, accessibility evidence, name collision, and source links.

Before writing code, turn every Must row in the package into an issue/checklist item with its stable ID. Do not create a different product backlog.

## What to build

Build one Next.js 16 / React 19 / strict-TypeScript application and one server-only TypeScript ingestion pipeline:

- a no-sign-up index listing exactly five frozen issuer/pair comparisons;
- a versioned read-only comparison API over committed generated fixtures;
- the canonical CrowdStrike comparison route and the four other frozen comparisons;
- deterministic SEC retrieval, Item 1A extraction, typed normalization, provenance, block alignment, and word diff generation;
- added, removed, and modified passage review in split and unified modes;
- filters, previous/next controls, URL-restorable active state, and keyboard/focus/live-region behavior;
- a compact semantic change ledger in the comparison header with exact Total/Added/Removed/Modified counts and a separate visible-result count after filtering;
- original prior/current context and official SEC filing links for every displayed change;
- safe per-change browser-local notes with validation, update/delete/reset, persistence failure behavior, and disclosure;
- a client-only Markdown export of saved notes for the current comparison, with provenance links/change locators and no filing passage text;
- the exact loading/empty/partial/failure/retry/success states from the brief;
- the editorial research-workspace design, responsive/reflow behavior, reduced motion, and non-color-only semantics;
- the frozen test, CI, deployment, security, observability, accessibility, performance, source-verification, and evidence package.

The canonical user path is:

`/` → `/compare/crwd/2024-2025?view=split&types=added,removed,modified` → filter Modified → next change by keyboard → inspect prior/current context and SEC links → save note → export current-comparison notes → reload with state/note restored.

## What not to build

Do not build or introduce:

- live public SEC fetching, ticker search, arbitrary issuer support, cron, queue, or background jobs;
- AI, embeddings, summaries, chat, RAG, confidence, scores, severity, rankings, predictions, recommendations, or buy/sell language;
- a claim that wording is material, newly risky, resolved, increased, decreased, or investment-significant;
- any form besides the exact ten `10-K` filings, any `10-K/A`, or any section besides Item 1A;
- auth, accounts, cookies for identity, server note storage, database, note import, cloud/cross-device sync, share links, rich text, PDF export, collaboration, billing, admin, analytics, watchlists, alerts, prices, or charts;
- issuer logos, SEC seals, copied competitor identity/copy/layout, or a generic dashboard/AI visual language;
- unstable SEC fragment-link promises or direct rendering of filing HTML;
- a public repository, domain purchase, or public brand under “FilingDelta” before Nora approves a distinct name;
- the final GitHub README or portfolio case study. Return technical implementation documentation and case-study source facts only.

If a tempting feature is not in the Must or Should rows, it is out of scope.

## Frozen implementation decisions

The following are already decided and must not be redesigned:

- exact five issuers, filing dates, accessions, primary documents, and pair years;
- Item 1A-only comparison and deterministic textual classifications;
- fixture-first public demo with zero runtime SEC requests;
- server-only ingestion CLI with a declared SEC User-Agent, one concurrency, ≤2 requests/second, cache, bounded retry/backoff, provenance, and fail-closed parsing;
- Next.js 16 App Router, React 19, Node 22, pnpm, strict TypeScript, CSS Modules/tokens, Zod, Cheerio, TanStack Query, Vitest/RTL/axe, Playwright, Vercel, and GitHub Actions;
- exact stable-ID scheme, URL keys, state ownership, local note contract, client-only note-export contract, read-only API shape, logging/privacy boundary, and security headers;
- exact alignment sequence: global exact hashes, heading partitions, deterministic sequence alignment, unmatched recovery, add/remove/modified classification, word spans;
- no AI and no public risk/materiality/significance interpretation;
- editorial visual direction, Source Serif 4 + IBM Plex Sans, non-color-only change semantics, logical DOM order, focus/live behavior, responsive stacking, and reduced motion;
- compact change-ledger presentation as one semantic `dl`: visible word labels and symbols, responsive wrapping, no cards/chart/score/trend/severity/risk meaning;
- cut order, quality targets, test matrix, disclosure/disclaimer, and safe/unsafe claims.

Use the stable supported patch versions available at implementation start and commit the lockfile. Do not upgrade the framework major or relax TypeScript/build checks for convenience.

## Decisions that may be reopened

Reopen a decision only under one of these conditions and record it before acting:

1. **Public name:** Nora approves a distinct name. Replace the centralized display value and related metadata only; do not alter product scope.
2. **Source correction/removal:** One frozen SEC filing is corrected, removed, or no longer represents the recorded content. Stop, show the exact source evidence, and request a package revision before substituting a pair.
3. **Security/support blocker:** A frozen dependency major has a current security or runtime incompatibility that prevents a supported deployment. Choose the nearest supported equivalent, preserve contracts, and document the exception.
4. **Parser evidence:** The selected filing cannot meet fail-closed extraction validation. Improve the bounded structural parser first. Do not add AI or swap issuers silently.
5. **Measured accessibility/performance blocker:** A frozen implementation detail such as side-by-side layout, font, or TanStack Query demonstrably prevents a Must target. Make the smallest contract-preserving change and document before/after evidence.

Cost, a new external account/service, a custom domain, a database, a model provider, or a public identity change requires Nora. Do not infer authorization.

## Source corpus contract

Use exactly the filing metadata and official URLs in [research.md](./research.md):

- CRWD: `0001535527-24-000007` → `0001535527-25-000009`
- ABNB: `0001559720-25-000010` → `0001559720-26-000004`
- COST: `0000909832-25-000101` → `0000909832-26-000093`
- DAL: `0000027904-25-000004` → `0000027904-26-000013`
- F: `0000037996-25-000013` → `0000037996-26-000015`

The research inspection found TOC duplicates in the corpus, repeated Item 1A running headers in Delta, em-dash heading variants in Costco, very long sections in Airbnb/CrowdStrike, and >5 MB source HTML in Ford. Your deterministic fixtures and tests must preserve those meaningful structures without committing or serving the entire raw filing set.

Raw HTML belongs in a gitignored cache. Commit small structural HTML fixtures, normalized/generated comparison data, a provenance manifest, and regeneration instructions. Record full source hashes in the returned ingestion report.

## Required build sequence

### Day 1 — contract and foundation

- Create the repository privately under a temporary neutral slug if Nora has not chosen the public name.
- Add requirement-ID issue/checklist mapping.
- Freeze schemas, stable IDs, URL contract, tokens/type, five-pair provenance manifest, fixture directories, CI skeleton, and first Vercel preview.
- Add the exact disclosure/disclaimer and working-name configuration.

### Day 2 — deterministic data pipeline

- Implement SEC retrieval/cache/provenance, Item 1A extraction/validation, normalization, alignment/diff, and CRWD generated fixture.
- Build parser/comparison deterministic fixtures before broad UI work.
- Never use live data to mask a failed committed fixture.

### Day 3 — hard checkpoint

By end of Day 3, the deployed preview must have:

- the canonical CrowdStrike path working end to end;
- all five pairs ingested and validated at least at the generated-data level;
- split comparison, type filters, previous/next + keyboard navigation, correct focus, source context/links, local note save/reload;
- loading and API error/retry shell;
- core parser/alignment/schema/note tests green.

If any item is missing, stop secondary work immediately and apply the package cut order. Record the trigger time and cuts. Do not trade away a Must requirement to preserve polish. If the Must scope cannot finish in 40 hours, return honestly incomplete.

### Days 4–7 — completeness and evidence

- Day 4: all five fixture QA, unified mode, compact change ledger, note export, remaining product states, responsive behavior.
- Day 5: accessibility, component/unit tests, Playwright, headers/privacy/logging.
- Day 6: performance profiling, source verification, screenshots, ADRs, evidence ledger.
- Day 7: production deploy, clean-session/manual audit, fixes, completion handoff.

## Cut protocol

Apply only this order:

1. `SH-03` copy-link convenience.
2. Firefox secondary smoke and nonessential transition polish.

Never silently cut a Must requirement. If a Must item changes or is incomplete, mark it `Changed` or `Cut` in the report, explain the user/hiring-signal impact, and do not describe the project as complete.

## Implementation rules

1. Build the smallest complete golden path before secondary UI.
2. Every parser/comparison decision is deterministic, versioned, fixture-tested, and inspectable.
3. Never render SEC HTML or note HTML. Convert to typed plain-text blocks and React text nodes.
4. Never expose the SEC contact/User-Agent value in client code.
5. A partial result may show only validated passages and must keep a persistent partial banner with exclusion reasons/counts.
6. “No meaningful textual changes” is a successful algorithm result, not evidence that risk is unchanged.
7. Keep old and new passages in logical DOM order even when CSS places them side by side.
8. Do not use color as the only change cue. Preserve exact visible labels and screen-reader cues.
9. Notes never leave the browser and never appear in logs, error reports, analytics, or URLs.
10. Note export is generated entirely in the browser from saved current-comparison notes. Emit UTF-8 Markdown with a user-authored label, issuer/pair metadata, stable change IDs, saved timestamps, and official SEC URLs; include no filing passage text. Serialize notes as literal code blocks, sanitize the filename, disable empty export accessibly, and revoke the object URL.
11. Tests, accessibility, responsive behavior, performance, security, provenance, CI, deployment, and evidence are MVP work.
12. Performance/accessibility results are claims only after dated production measurement. Record failures as failures.
13. Use exact requirement IDs in test titles where practical, for example `test('CMP-01 matches reordered identical blocks', ...)`.
14. Do not manufacture commit history, test results, screenshots, source checks, metrics, or users.
15. The change ledger must read counts already present in the schema, never recompute business meaning, and pass fixture-count invariants. Keep it an editorial summary row, not a dashboard or visualization project.

## Exact outputs required on return

Return all of the following in one implementation completion package:

### Product and repository

- Repository URL, live URL, final approved display name (or working-name status), commit SHA, deployment ID/time, Node/pnpm versions.
- Concise final architecture and a file-tree overview.
- Setup, fixture regeneration, source verification, local production, test, and deployment commands.
- The exact five-pair catalog and a provenance manifest with full CIKs, forms, periods, filed dates, accessions, URLs, retrieval timestamps, byte counts, SHA-256s, parser/normalizer/comparator/fixture versions, statuses, and exclusions.
- Final generated counts by comparison, clearly labeled textual classifications—not business-risk counts.
- A sample Markdown note export from the canonical comparison and the unit/E2E evidence proving exact metadata, note ordering/content, keyboard activation, sanitized filename, download, and object-URL cleanup.

### Requirement traceability

- Copy every requirement ID from `project-package.md` into the completion table.
- For each ID use exactly one status: `Shipped`, `Changed`, or `Cut`.
- Link exact evidence: test name/report, route, screenshot, code/ADR, manifest row, log, or measured artifact.
- For `Changed`/`Cut`, include reason, authorization, user impact, hiring-signal impact, and smallest repair.
- Do not omit Should requirements; mark them Shipped or Cut according to the cut order.

### Screenshots and recording

- Index, desktop split with the change ledger visible, desktop unified + saved note, mobile/reflow with the ledger wrapped, and partial/API-error recovery screenshots.
- Each screenshot metadata: filename, route/query, viewport/zoom, browser, date/time zone, commit, deployment, fixture version, data state, and whether failure was mocked/intercepted.
- A 60–120 second recording or precise timestamped recording script following the canonical demo.

### Test and release evidence

- Exact commands, exit codes, and artifact links for format, lint, strict types, unit, component/axe, deterministic fixture check, production build, and Playwright.
- Test inventory mapping parser/comparison/state/failure fixtures to IDs.
- CI workflow URL and green default-branch run.
- Clean-incognito production check, console/unhandled rejection result, dated ten-source-link verification, and rollback target.
- One-hour post-deploy production error-log scan with date/window/result.

### Accessibility evidence

- Axe results and affected routes/states.
- Lighthouse accessibility results for `/` and canonical CRWD route, including date, commit, production URL, browser/Lighthouse version, profile, and raw artifacts.
- Manual keyboard checklist for the entire golden path.
- VoiceOver + Safari notes for landmarks/headings, filters, change navigation, prior/current labels, diff cues, note validation/save, and source links.
- Focus visibility/order/obscuring, 320px and 400% reflow, mobile touch, contrast, reduced-motion, and known limitations.

### Performance evidence

- Three production Lighthouse runs per audited route and the median; include cache state and profile.
- LCP, CLS, total blocking/long-task evidence, comparison payload transfer, route client-JS transfer, and next-change interaction trace.
- Any optimization before/after must identify the same route/profile/fixture; no “fast” claim without numbers.

### Architecture, security, and provenance

- ADR(s) covering fixture-first architecture, ingestion boundary, parser/normalizer, alignment, state ownership, local notes, API/caching, failure model, and rejected live/AI/database alternatives.
- Security-header capture; allowed external hosts; secret scan; client-bundle env review; note network/log privacy check; production dependency audit and disposition.
- Exact third-party packages, fonts/assets, licenses, SEC attribution, correction/retention behavior, and no-affiliation language.
- Known limitations and parser coverage stated narrowly.

### Publication facts—not final publication copy

- Claims safe to publish, each linked to direct or measured evidence.
- Claims not supported or explicitly prohibited.
- Case-study source facts: problem evidence, frozen constraints, hard decisions, measured results, limitations, and next-step ideas.
- Do **not** write the final GitHub README, portfolio case study, launch post, customer quote, or adoption narrative. Those follow independent audit.

## Completion report format

Use this exact structure.

### Identity and deployment

| Field | Value | Evidence |
|---|---|---|
| Final/working name | | |
| Repository | | |
| Production URL | | |
| Commit/deployment | | |
| Fixture version | | |

### Shipped summary

State only what is demonstrably working. Distinguish simulated persona/scenario from real SEC data.

### Requirement ledger

| Requirement ID | Status (`Shipped`/`Changed`/`Cut`) | Evidence | Difference/reason/impact |
|---|---|---|---|
| P-01 | | | |

Include every ID; do not use “N/A” unless the package itself marks a Should item cut.

### Verification

| Check | Command/method | Date/environment | Result/exit code | Evidence |
|---|---|---|---|---|
| Format | | | | |
| Lint | | | | |
| Strict types | | | | |
| Unit | | | | |
| Component + axe | | | | |
| Deterministic fixtures | | | | |
| Production build | | | | |
| Critical E2E | | | | |
| Keyboard | | | | |
| VoiceOver | | | | |
| Lighthouse accessibility | | | | |
| Lighthouse performance | | | | |
| Mobile/reflow | | | | |
| Security/privacy | | | | |
| SEC source links | | | | |
| Console/log scan | | | | |

### Filing and comparison ledger

| Pair | Accessions | Retrieval/hash evidence | Parser status | Change counts | Limitations |
|---|---|---|---|---|---|
| CRWD 2024–2025 | | | | | |
| ABNB 2024–2025 | | | | | |
| COST 2025–2026 | | | | | |
| DAL 2024–2025 | | | | | |
| F 2024–2025 | | | | | |

### Scope differences and cuts

List every departure, Day 3 cut trigger, authorization, consequence, and repair path. “None” is valid only if the ledger proves it.

### Accessibility and performance evidence

Summarize dated results and link raw artifacts; include failures/limitations.

### Security, privacy, attribution, and retention

Document headers, secrets, notes, external requests, licenses, SEC attribution, source correction behavior, and audit results.

### Claims safe to publish

Only measured or directly verifiable statements, each with an evidence pointer.

### Claims not supported or prohibited

Include accuracy, materiality/risk direction, advice, time saved, users/adoption, universal support, AI, novelty, and SEC endorsement unless directly and legitimately supported—which this package does not expect.

### Open issues

| Severity | Issue | Affected requirement/user | Reproduction/evidence | Smallest next action |
|---|---|---|---|---|
| | | | | |

### Case-study source facts

Facts and verified metrics only; no polished case study prose.

## Audit failure conditions

Any of these fails the implementation audit regardless of visual polish:

- unsupported performance/accessibility/accuracy/time-saved metrics;
- fake users, quotes, adoption, customers, revenue, validation, or business impact;
- financial recommendations, risk direction, scores/ratings, or unqualified “material change” language;
- untraceable AI or any AI dependency hidden behind deterministic-looking output;
- a comparison that cannot resolve every displayed change to exact source blocks and filing links;
- silent parser fallback, amendment substitution, partial-data omission, or changed corpus;
- raw SEC HTML injection, note leakage, secrets/client User-Agent exposure, or broken required source links;
- keyboard-incomplete golden path, color-only semantics, serious/critical axe violations, or missing manual evidence;
- red/green CI failures, console errors, broken production route, fabricated screenshots/logs, or missing requirement statuses;
- copying another financial product's identity, layout, copy, scoring, or name in a way that implies affiliation;
- publishing under “FilingDelta” before Nora resolves the documented identity collision;
- writing final public README/case-study claims before independent audit.

When uncertain, report the limitation. Honest incomplete evidence is repairable; invented certainty is not.
