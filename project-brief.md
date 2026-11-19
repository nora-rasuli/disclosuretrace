# Project Brief — FilingDelta

> **Working-title warning:** “FilingDelta” is a planning name, not a cleared public identity. Keep the display name replaceable and do not publish the repository, buy a domain, or create public brand assets under this name until Nora resolves the collision documented in [research.md](./research.md).

## Project framing

- **Type:** Self-directed concept project using real public SEC filings and a simulated persona/scenario.
- **Exact public disclosure:** “A self-directed concept project. The persona and research scenario are simulated; filing text and metadata come from SEC EDGAR.”
- **Scenario rule:** Fictional users, notes, and task context must be labeled simulated. The filing text, dates, accession numbers, URLs, retrieval dates, and measured implementation results must be real and verifiable.
- **Time boundary:** Seven calendar days; 30–40 focused implementation hours; target ship date 2026-11-22.
- **Product boundary:** Five issuers, one fixed consecutive 10-K pair per issuer, Item 1A only, English-language public demo, no sign-up, no live arbitrary-ticker ingestion.

## One-sentence pitch

FilingDelta is a focused research workspace for self-directed investors who need to see what changed between consecutive annual Risk Factors disclosures, with every added, removed, or modified passage connected to the original SEC text.

## Working product promise

> “See what changed between annual filings, with every finding connected to the original SEC text.”

“Changed” always means changed filing language. It never means that business risk, investment significance, or security value increased or decreased.

## Why this project

- **Primary hiring signals (maximum four):**
  1. React and TypeScript product engineering.
  2. APIs and complex data flow.
  3. End-to-end product ownership.
  4. Testing, accessibility, and release quality.
- **Secondary signals:** Performance, deterministic document intelligence, responsible financial-language boundaries, and design-system craft.
- **Portfolio gap it fills:** Nora's resume already describes AI interfaces, source/provenance-oriented workflows, geospatial data, and accessibility claims. FilingDelta adds inspectable public evidence of server-side public-data ingestion, difficult HTML normalization, deterministic alignment, URL/server/client state boundaries, failure handling, local persistence, release gates, and a keyboard-first dense reading experience. It deliberately does not repeat the “AI answer with citations” interaction from Nora's existing work.
- **Why the problem matters:** Risk Factors sections are long, annual documents repeat substantial language, and the manual workflow requires finding the same section in two large filings, distinguishing formatting/movement from edits, and returning to the source. Evidence and limitations are detailed in [research.md](./research.md).
- **Existing alternatives:** SEC EDGAR, manual side-by-side reading, generic diff tools, BamSEC, AlphaSense, RiskDiff, and cited-document AI tools. The project does not claim novelty; it demonstrates a narrower, accessible, deterministic workflow.
- **Why this is not a dashboard-shaped toy:** The user completes a concrete research task: select a verified pair, review a finite set of passage-level changes, inspect both source contexts, and save a follow-up note. The primary surface is a document review workspace, not metric cards or charts.

## User and job-to-be-done

- **Primary user:** Maya Chen, a simulated self-directed investor who maintains a small watchlist and updates company research notes after annual filings.
- **Situation:** A company on Maya's watchlist has published its next 10-K. She has read filings before but does not have institutional research software.
- **Pain today:** She must open both filings, locate the real Item 1A sections, scroll or copy text into another tool, filter formatting noise, and maintain source links and notes separately.
- **Desired outcome:** In one session, identify the passages whose wording changed, understand the exact old/new context, verify both filings, and leave a concise follow-up note without receiving a recommendation.
- **Accessibility/context constraints:** She may work on a laptop, zoom to 200–400%, use keyboard navigation, or use a screen reader. Dense text must remain readable and the change meaning cannot depend on red/green color.
- **Persona source:** Fictional persona informed by public product/workflow research; not a real interviewed user.
- **Simulated research inputs:** The pre-demo task, note text, and research questions are simulated. No quotes are presented as user research.

### Primary user story

`As a self-directed investor updating a company note after a new annual filing, I need to review the exact Item 1A wording changes against the prior 10-K so that I can decide what to investigate next without trusting an untraceable summary.`

### Scenario narrative

Maya is revisiting CrowdStrike after its next annual filing. Before she updates her research record, she wants to know how the company's Risk Factors language differs from the prior annual filing. She is not asking the product whether the company is safer, riskier, or investable. She needs a bounded review queue, source context, and a note such as “Check whether the modified service-disruption wording is discussed elsewhere in the filing.” That note and the persona are simulated; the two filings are real.

## Success criteria

By the end of the demo, a first-time evaluator can:

1. Open the no-sign-up demo and reach a meaningful CrowdStrike change within 30 seconds.
2. Filter and navigate added, removed, and modified passages; inspect prior/current context and official SEC links.
3. Save a per-change research note, refresh to see it restored from browser-local storage, and download a clearly labeled Markdown copy of the current comparison's notes.
4. Understand a realistic partial/error state and successfully retry or choose another verified comparison.

Technical success:

- Value is visible within 60 seconds from a fresh session.
- Lighthouse accessibility score is 100 on `/` and the CrowdStrike comparison route under the documented profile.
- Lighthouse performance is at least 90 on the same routes under mobile Slow 4G / 4× CPU throttling, median of three production runs.
- LCP is at most 2.5 seconds and CLS at most 0.1 under that profile; the implementation report records measured values, not promises.
- Primary workflow is completable with keyboard only, including company selection, filters, change navigation, source links, note save/delete/reset, and note export.
- Automated axe checks report no serious or critical violations; manual keyboard and VoiceOver smoke checks have no P1 blockers.
- Strict TypeScript, formatting, lint, types, unit/component tests, production build, and critical-path Playwright checks are green.
- No console errors, unhandled rejections, or broken links among the ten frozen SEC source URLs in the dated release check.
- Deterministic parser and comparison fixtures produce identical hashes on two clean runs.

## Golden path

1. **Entry:** Open `/` in a fresh session. The first viewport states the product promise, concept disclosure, five-company boundary, SEC source, and informational disclaimer. CrowdStrike is the guided-demo choice.
2. **Select:** Activate “Compare CrowdStrike.” The URL changes to `/compare/crwd/2024-2025`; a loading state identifies both filing periods rather than showing a generic spinner.
3. **Orient:** The comparison header shows issuer, form, Item 1A, both report periods, both filing dates, both accession numbers, retrieval date, comparison status, direct SEC links, and a compact textual-change ledger with Total/Added/Removed/Modified counts.
4. **Review:** The first changed passage is focused. The user sees the visible `+ Added`, `− Removed`, or `~ Modified` label, section-heading path, old/current context, and change position.
5. **Navigate:** The user filters to `Modified` and uses the next-change control or `Alt+ArrowDown`. The URL preserves `view`, `types`, and active `change`.
6. **Verify:** The user expands one block of context on each side and opens the official prior/current filing links. FilingDelta never claims a stable deep anchor inside SEC HTML; it provides an Item 1A locator label.
7. **Record:** The user writes a note of at most 2,000 characters and saves it. A non-intrusive status confirms “Saved in this browser.” Refresh restores the note and active URL state.
8. **Carry forward:** The user downloads all saved notes for the current comparison as a clearly labeled Markdown file containing provenance links and change locators, but no filing passage text.

### Canonical demo URL

`/compare/crwd/2024-2025?view=split&types=added,removed,modified`

The implementation may use an internal immutable comparison ID in the API, but the human-facing route and query keys above are frozen.

### Demo in 60 seconds

- **0–10 seconds:** Open `/`; read “See what changed…” and the “real SEC data / simulated persona” disclosure; select CrowdStrike.
- **10–25 seconds:** See exact filing provenance, the compact textual-change ledger, and a visible modified passage with prior/current wording.
- **25–40 seconds:** Filter to Modified, use next-change keyboard navigation, and hear/see “Change N of M, modified.”
- **40–52 seconds:** Expand source context and point to both official SEC filing links.
- **52–60 seconds:** Save “Check this wording against the service-disruption discussion” and download the current comparison's notes. Reload persistence is covered by the critical-path test and may be shown in the longer recording.
- **Failure/recovery moment worth showing separately:** Intercept the comparison request with a 503 or partial fixture, show the inline explanation and Retry action, then recover without losing selected issuer/filter state.

## MVP scope

### Must have

- Five exact seeded issuer/pair comparisons from [research.md](./research.md): CRWD 2024–2025, ABNB 2024–2025, COST 2025–2026, DAL 2024–2025, and F 2024–2025.
- Exact company name, ticker, CIK, form, period end, filing date, accession number, primary-document URL, index URL, retrieval timestamp, and source SHA-256 for all ten filings.
- Server-only ingestion CLI with declared User-Agent, caching, throttle, retry/backoff, hash/provenance manifest, and fail-closed parser validation.
- Item 1A DOM extraction that rejects TOC entries and handles heading variations, tables/layout divs, Inline XBRL wrappers, running headers, missing boundaries, and amendments.
- Typed normalized blocks and deterministic comparison fixtures.
- Added, removed, and modified classifications; identical reordered blocks are matched and not misreported as add/remove.
- Word-level spans for modified passages, with exact prior/current source references and at least one adjacent context block where available.
- Company-selection landing screen and comparison workspace.
- Split mode and unified mode. On narrow screens, split mode becomes stacked prior/current; it never creates horizontal page scrolling.
- Type filters, change counts, previous/next controls, documented keyboard shortcut, active-change URL state, and meaningful focus management.
- A compact semantic change ledger in the comparison header showing Total, Added, Removed, and Modified counts with visible word labels and symbols; it is not a chart, score, trend, or severity display.
- Per-change local research notes, validation, delete, reset-all-notes control, and client-only Markdown export for the current comparison; plain text only; 2,000-character maximum.
- Loading, no-matching-changes, no-meaningful-changes, parser failure, missing Item 1A, amendment detected, source-link unavailable, API/rate-limit unavailable, partial comparison, note validation, retry, and success behavior.
- Informational-product disclaimer and clear separation of textual comparison from interpretation.
- Responsive, keyboard, screen-reader, focus, zoom/reflow, and reduced-motion behavior defined below.
- Unit/component tests, deterministic fixtures, Playwright critical path, CI, deployment, observability, source-link verification, and dated evidence.

### Should have only if every must-have and quality gate is green

- Copy a deep link to the active change.

This is the only approved secondary feature. It is cut first if the Day 3 trigger fires.

### Seeded/demo data

- Filing text and metadata: real SEC EDGAR data listed in [research.md](./research.md).
- Persona, task, and example note: simulated and disclosed.
- The production demo ships generated comparison JSON. It does not fetch SEC live.
- Parser failure/partial/empty/no-change/rate-limit fixtures are deterministic test data and must be labeled test scenarios in evidence, not real issuer outcomes.

## Product states

| State | Trigger | Required behavior |
|---|---|---|
| Initial loading | Comparison API pending | Skeleton uses the real issuer/period labels; no spinner-only page; status text is announced once |
| Success | Valid full comparison | Provenance, filters, current position, context, source links, and notes are available |
| Filter empty | Selected types yield zero visible changes | “No changes match these filters”; preserve counts and provide Clear filters |
| No meaningful textual changes | Valid comparison contains no configured added/removed/modified passages | Explain that the configured method found no meaningful wording changes; do not claim risk is unchanged; keep filing links |
| API unavailable / 429 / 5xx | Fixture API request fails | Inline alert, Retry, preserve URL/filter state, no fabricated cached success unless a valid prior response exists |
| Parser unrecognized | Section boundary validation failed | Do not show a diff; name the affected filing and validation reason; offer another company and source links |
| Item 1A unavailable | Missing/reference-only section | Explain unavailable/partial status; never map it to zero changes |
| Amendment detected | Metadata includes `10-K/A` instead of selected `10-K` | Exclude amendment, explain policy, and do not silently substitute |
| Partial comparison | Some blocks/source references fail validation | Show only validated changes, persistent partial-data banner, excluded count/reason, and no totalizing interpretation |
| Source link unavailable | Dated verification or user open fails | Keep stored passage, show last retrieval date and URL, allow copy/retry; release fails if known fixture links are broken |
| Note invalid | Empty after trim, over 2,000 chars, or storage quota/error | Inline error associated with field; retain draft; never log note contents |
| Note saved | Valid local write | Visible and polite “Saved in this browser,” timestamp, delete action |
| Local storage unavailable | Browser policy/quota blocks persistence | Note remains in-session, explain it will not persist, no repeated modal |
| Unknown route/change ID | Invalid company/pair/change query | Purpose-built not-found state with return to five verified comparisons |

## Explicit non-goals

- No stock predictions, scores, ratings, recommendations, valuation, sentiment, severity, “material change” labels, or buy/sell language.
- No claim that wording proves increased/decreased risk or that an added passage is a newly emerging risk.
- No AI summaries, embeddings, chat, RAG, or model provider in the MVP. AI is a post-audit idea only and must not displace deterministic comparison.
- No arbitrary ticker search, live ingestion from the public UI, crawler, background queue, or scheduled refresh.
- No 10-Q, 8-K, 20-F, 10-K/A comparison, no sections beyond Item 1A, and no more than the five frozen pairs.
- No authentication, accounts, cloud database, cross-device sync, collaboration, sharing permissions, billing, or admin dashboard.
- No proprietary market data, price chart, portfolio tracking, alerts, watchlists, or company ranking.
- No attempt to deep-link to unstable SEC DOM anchors.
- No copied identity, layout, terminology, scores, or copy from RiskDiff, BamSEC, AlphaSense, Filing Delta, or another financial product.
- No final public GitHub README or portfolio case study before implementation and independent audit.

## UX direction

### Information hierarchy

1. **Research question:** issuer + “What changed in Item 1A?”
2. **Provenance:** periods, filing/accession dates, retrieval date, comparison status, SEC links.
3. **Review controls:** type filters, view mode, previous/next, position.
4. **Active change:** explicit type, heading path, prior/current passage, word spans.
5. **Original context:** one preceding and one following typed block when available; expandable but never absent.
6. **Research note:** subordinate to the evidence, visibly browser-local.
7. **Method/disclaimer:** short, discoverable, not a wall of legal copy.

### Core screens

1. **Demo index (`/`):** product promise, disclosure/disclaimer, five issuer cards rendered as a reading list, pair metadata, and one primary “Compare” action per issuer. No market prices or KPI cards.
2. **Comparison workspace (`/compare/[ticker]/[pair]`):** provenance header, compact change ledger, restrained sticky review bar, change index, active passage comparison, source context, and note editor.
3. **Method/data drawer or section:** plain-language extraction/comparison limits, provenance manifest version, source/retrieval policy, and local-note privacy. This can be part of the comparison page; do not add a dashboard page.
4. **Purpose-built state surfaces:** inline/loading/error/partial/empty/not-found treatments using the same shell.

### Visual direction

- **Aesthetic:** Editorial research workspace: a calm paper-like canvas, strong document typography, dense but readable comparison, and metadata that resembles a well-edited research appendix rather than an admin panel.
- **Type:** Self-hosted open-source `Source Serif 4` for filing passages and `IBM Plex Sans` for controls/metadata; system fallbacks; `font-display: swap`. Do not use a generic oversized gradient hero.
- **Palette:** Warm off-white paper, charcoal ink, restrained blue links, green/brick/ochre change accents. Every accent must pass contrast and be paired with text/symbol/border treatment.
- **Change semantics:** `+ Added` with solid left rule; `− Removed` with strikethrough only on changed tokens plus distinct rule; `~ Modified` with labeled ochre rule and old/new token annotations. Never tint full long paragraphs so heavily that reading suffers.
- **Spacing/density:** 65–80 character passage measure in single/unified mode; split columns sized for readable lines; metadata uses tabular numerals.
- **Components:** Native buttons, checkboxes, links, `<article>`, `<ins>`, `<del>`, `<textarea>`; no generic card grid beyond the five-entry index.
- **Design inspiration:** Scholarly annotation, legal redlines, and editorial reading tools as interaction categories only. Do not reproduce any proprietary product screen.
- **Avoid:** Neon gradients, glassmorphism, chat bubbles, “AI sparkles,” floating metric cards, stock tickers, candlestick charts, sidebars full of icons, or fake activity feeds.

### Keyboard and focus behavior

- A skip link moves to the comparison heading.
- Tab order follows visual/reading order: provenance → filters/view → navigation → active change → source links/context → note.
- Previous/next are real buttons. `Alt+ArrowUp` and `Alt+ArrowDown` are optional accelerators and are disabled while a form control is active.
- Navigating a change updates `change=` in the URL, scrolls without animation when reduced motion is enabled, and moves focus to the active change heading (`tabIndex=-1`).
- A polite live region announces “Change 3 of 18, modified.” It does not reread the passage.
- Filtering announces the new count. If the active change disappears, select the nearest remaining change and move focus once; never trap focus.
- Opening/closing context returns focus to the triggering button. External SEC links clearly indicate a new tab if that behavior is used.
- No positive `tabindex`, roving grid, or keyboard-only hidden actions.

### Screen-reader semantics

- One `<main>` and clear heading hierarchy; landmarks for comparison controls, change list, passage review, and note.
- Change list is an ordered list; each result is an `article` with an accessible heading including type and position.
- Prior/current passages are labeled regions in DOM order, regardless of visual columns.
- `<ins>` and `<del>` spans include visually hidden “added text starts/ends” and “removed text starts/ends” cues because assistive technologies do not consistently announce them.
- Icons are decorative when adjacent text supplies meaning.
- Status banners use appropriate `role=status` or `role=alert` without repeated announcements.
- Filing dates and accession numbers are text, not tooltips.

### Responsive behavior

- **≥1200 px:** optional narrow change index + two readable passage columns + note aside; no pane requires independent horizontal scrolling.
- **768–1199 px:** change index becomes a compact disclosure; passage columns remain split when readable; note follows the passage.
- The change ledger is one inline semantic row at wide widths and wraps without reordering at narrow widths; do not turn it into a card grid or horizontally scrolling strip.
- **<768 px:** one document flow. Prior passage appears before current passage; review controls wrap; sticky elements do not cover focused content.
- At 320 CSS pixels and 400% zoom, no page-level horizontal scroll and no clipped controls. Long accession numbers/URLs wrap safely.
- Touch targets are at least 44×44 CSS pixels where space permits.

### Reduced-motion behavior

- Respect `prefers-reduced-motion: reduce` globally.
- No animated gradients, parallax, auto-advancing content, or flashing change highlights.
- Change navigation uses instant scroll under reduced motion and a static focus outline; default motion, if any, is under 150 ms and nonessential.

### Screenshot/evidence plan

1. Desktop CrowdStrike split comparison showing provenance, filters, modified passage, context, and visible change semantics.
2. Desktop unified view filtered to one type with the local note saved state.
3. Mobile/400% reflow view with prior/current stacked and controls wrapped.
4. Partial-data or API-unavailable state with Retry and preserved issuer context.
5. Five-company index with exact pair metadata and concept/disclaimer language.

Each screenshot record includes route, viewport, date, commit SHA, fixture version, and whether failure was network-intercepted test data.

## Architecture

### Frontend and TypeScript

- **Framework:** Next.js 16.x App Router, React 19, Node.js 22 LTS, `pnpm`, ESM.
- **TypeScript:** TypeScript 5.x with `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `useUnknownInCatchVariables`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, and `typedRoutes`; no relaxed build tsconfig.
- **Styling:** CSS Modules plus CSS custom-property tokens; no component-library dependency.
- **Validation:** Zod at ingestion output, API boundary, URL parsing, and local-note restore.
- **Server state:** TanStack Query v5 for the versioned comparison API; retries are explicit and bounded.
- **Tests:** Vitest, React Testing Library, `jest-axe`/`axe-core`, and Playwright.

Exact patch versions are chosen at implementation start, recorded in the lockfile and completion report, and must remain on stable supported releases.

### Server-side SEC ingestion boundary

- `scripts/ingest-sec.ts` is the only code allowed to contact `data.sec.gov` or `www.sec.gov`.
- It runs manually from a trusted local/CI maintenance environment, never in the browser and never during a user request.
- It requires `SEC_USER_AGENT="FilingDelta <contact-email>"`, one concurrent request, ≤2 requests/second, disk cache, conditional fetch when supported, `Retry-After`, exponential backoff with jitter, and a maximum attempt count.
- It writes gitignored raw HTML, a provenance manifest, normalized sections, comparison fixtures, and a human-readable ingestion report. Generated committed JSON is accepted only after schema validation and the ten manually verified section boundaries pass.
- The public build does not need `SEC_USER_AGENT` and has no SEC credential or contact email in client JavaScript.

### Public demo data policy

- **Choice:** Pre-ingested deterministic fixtures only. No hybrid live fallback.
- **Why:** It guarantees a fast no-sign-up demo, respects SEC fair access, makes tests deterministic, and prevents a third-party outage or parser surprise from breaking the portfolio artifact.
- **Inspectability:** The repository contains the ingestion/comparison code, small structural parser fixtures, normalized comparison fixtures, provenance manifests, algorithm versions, and regeneration commands.

### Filing retrieval and caching

- Raw cache key: accession number + primary document name.
- Record `ETag`, `Last-Modified`, retrieval time, status, content type, bytes, and SHA-256 when available.
- Never overwrite a hash mismatch silently. Write a new manifest version and require review.
- The deployed API serves immutable fixture version `v1`; responses include `ETag` and long-lived CDN cache headers keyed by comparison/fixture version.
- Before release, `pnpm sources:verify` performs polite GET checks for all ten SEC document URLs and writes a dated report. CI does not depend on live SEC availability.

### HTML normalization and section extraction

Use Cheerio for DOM parsing. Strip non-visible/unsafe nodes, unwrap visible Inline XBRL, retain typed block order, normalize only match text, and preserve display text. Candidate section detection and fallback/validation rules are frozen in [research.md](./research.md). Never use `dangerouslySetInnerHTML` for SEC text.

### Paragraph/block alignment and diff

- Exact normalized block hashes are matched globally first.
- Exact heading anchors partition the section.
- Deterministic sequence alignment within partitions uses token-set similarity and gap penalties.
- An unmatched recovery pass pairs moved/lightly edited blocks above a documented threshold.
- Identical reordered blocks are matched and carry `orderChanged=true`; movement alone is not a visible change classification.
- Lightly edited matches become `modified`; current-only blocks become `added`; prior-only blocks become `removed`.
- Modified blocks use deterministic word-level diff spans via the `diff` package.
- Thresholds and algorithm version live in one documented config and are covered by fixtures; changing them requires fixture regeneration and audit.
- The algorithm never infers investment significance, causality, severity, or direction.

### Stable identifiers

- Issuer: `issuer:{10-digit-cik}`.
- Filing: `filing:{accession-with-dashes}`.
- Section: `section:{accession}:item-1a`.
- Block: `block:{accession}:item-1a:{zero-padded-ordinal}:{first-12-of-display-text-sha256}`.
- Comparison: `cmp:{older-accession}:{newer-accession}:item-1a:{algorithm-version}`.
- Change: `chg:{comparison-id}:{kind}:{first-12-of-sha256(old-block-ids|new-block-ids)}`.
- Source reference: `src:{filing-id}:{first-block-id}:{last-block-id}`.
- Note: `note:{comparison-id}:{change-id}`.

IDs are deterministic for a fixture/algorithm version. Any parser or algorithm change that changes IDs increments the fixture version and runs note-migration/reset behavior explicitly.

### State ownership

- **URL state:** issuer/pair route; `view=split|unified`; `types=added,removed,modified`; active `change`. Unknown values are sanitized to documented defaults.
- **Server state:** comparison API response, loading/error/retry, fixture version, and source status through TanStack Query.
- **Client UI state:** expanded context and transient note draft in component state/reducer; no global state library.
- **Persistent client state:** notes and note schema version in `localStorage`; plain text; no server transmission. View/filter state remains in URL, not local storage.
- **Form state:** note draft, count, validation, save/delete status local to the note form.
- **Export:** browser-only serialization of saved notes for the current comparison to UTF-8 Markdown. Include issuer/pair metadata, comparison/change IDs, note timestamps, and official SEC URLs; exclude filing passage text. Use a sanitized `filingdelta-{ticker}-{pair}-notes-{YYYY-MM-DD}.md` filename and revoke the temporary object URL after download. Empty-note export is disabled with an accessible explanation.

### Read-only API

- `GET /api/v1/comparisons/{comparisonId}` returns one schema-validated generated fixture.
- `GET /api/v1/catalog` returns the five issuers and their pair/provenance summaries.
- Unknown IDs return a typed 404; corrupt fixtures return a typed 500 and structured server log, never partial JSON.
- No mutation API exists. Notes never leave the browser.

### Failure and retry model

- API reads: no retry for 4xx except 429; up to two retries for network/429/5xx with exponential backoff and user-visible manual Retry.
- Ingestion: up to three attempts; honor `Retry-After`; fail the issuer without blocking already valid cached fixtures; produce a nonzero exit and report.
- Parser/comparison: fail closed per filing/pair. Partial status is allowed only when every displayed change and source reference validates and exclusions are explicit.
- UI error boundaries isolate comparison content while preserving the shell and company navigation.
- Note persistence errors never erase the draft.

### Logging and observability

- Structured server logs: request ID, route, comparison ID, fixture version, status, latency, and error code. Never log filing passages or note contents.
- Client error boundary records a concise error code to the console in development; production shows a user-safe message. No noisy normal-operation logs.
- Vercel function logs and request metrics are the only runtime observability in MVP; no paid third-party service or secret.
- Release evidence includes a one-hour post-deploy error-log scan and a clean-browser console check.

### Deployment and CI/CD

- Host on Vercel using the existing authorized account, initially on a `vercel.app` URL; no custom domain purchase.
- GitHub repository with protected `main`; pull requests must pass GitHub Actions before merge. Vercel creates previews from branches and production from protected `main`.
- CI on Node 22 runs `pnpm install --frozen-lockfile`, format check, lint, strict types, unit/component tests, deterministic fixture check, production build, and Playwright critical path against the production build.
- Dependabot or equivalent update PRs are optional; `pnpm audit --prod` result is recorded for release, with findings assessed rather than blindly claimed as zero risk.
- Rollback is the previous known-good Vercel deployment; no database migration exists.

### Security, privacy, rate limit, and secrets

- No authentication, cookies, user database, analytics, or note transmission.
- Notes are plain text, escaped by React, capped at 2,000 characters, schema-validated, and stored under namespaced local keys. No `dangerouslySetInnerHTML`. Export serializes note content as literal Markdown code blocks so user text cannot become executable HTML in the generated document.
- SEC URLs are generated from validated metadata and allowlisted to `https://www.sec.gov/Archives/edgar/`; external links use safe `rel` values.
- Security headers: CSP limited to self and required Vercel assets, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `X-Content-Type-Options: nosniff`, and a strict referrer policy.
- `SEC_USER_AGENT` is a server/CLI environment value and never exposed through `NEXT_PUBLIC_*`. There are no API keys in the MVP.
- No raw SEC HTML is rendered or served. Only schema-validated plain text and typed diff spans reach React.

### Why this is the smallest credible production architecture

It has one application, one read-only API boundary, one offline ingestion path, committed fixtures, and browser-local notes. It demonstrates real server/client/data boundaries without adding a database, auth service, queue, live third-party dependency, or model provider. A static-only site would hide the API/retry contract; a live-ingestion backend would create reliability, rate-limit, and schedule risk without improving the 60-second demo.

## Minimum data model

| Entity | Required fields |
|---|---|
| `Issuer` | `id`, `cik`, `ticker`, `legalName`, `displayName`, `comparisonIds` |
| `Filing` | `id`, `issuerId`, `accession`, `form`, `periodEnd`, `filedAt`, `primaryDocument`, `sourceUrl`, `indexUrl`, `retrievedAt`, `sha256`, `bytes`, `isAmendment`, `status` |
| `FilingSection` | `id`, `filingId`, `itemCode`, `canonicalTitle`, `sourceHeading`, `boundaryStrategy`, `status`, `blockIds`, `textSha256`, `parserVersion`, `validationMessages` |
| `NormalizedContentBlock` | `id`, `sectionId`, `ordinal`, `kind`, `displayText`, `matchText`, `headingPath`, `sourceLocatorLabel`, `displaySha256`, `normalizationFlags` |
| `Comparison` | `id`, `issuerId`, `olderFilingId`, `newerFilingId`, `sectionCode`, `algorithmVersion`, `fixtureVersion`, `generatedAt`, `status`, `counts`, `changeIds`, `exclusions` |
| `Change` | `id`, `comparisonId`, `kind`, `ordinal`, `oldBlockIds`, `newBlockIds`, `oldContextIds`, `newContextIds`, `wordSpans`, `alignmentReason`, `similarity`, `orderChanged`, `sourceReferenceIds` |
| `SourceReference` | `id`, `filingId`, `sectionId`, `blockIds`, `accession`, `sourceUrl`, `indexUrl`, `locatorLabel`, `excerptSha256` |
| `ResearchNote` | `id`, `comparisonId`, `changeId`, `body`, `createdAt`, `updatedAt`, `schemaVersion`, `storage='local'` |

`similarity` is internal alignment evidence, not a user-facing score. The UI may describe the method but must not turn similarity into severity.

## Quality plan

### Unit/component tests

- Metadata URL/accession construction and allowlist validation.
- Heading normalization, TOC rejection, next-item fallback, Inline XBRL unwrapping, table/list block conversion, running-header removal, and fail-closed validation.
- Deterministic fixtures for normal, missing Item 1A, renamed heading, no Item 1B, amendment, repeated headers, and unrecognized structure.
- Block IDs, exact/reordered matching, light-edit modification, insert/remove, ambiguous alignment, word spans, and deterministic output hashes.
- Zod API schemas and corrupt-fixture behavior.
- Change-ledger totals against fixture invariants, visible-result count after filtering, filter logic, URL serialization, focus target, view-mode semantics, note validation/storage errors, deterministic export serialization/filename/order, object-URL cleanup, and reduced-motion behavior.
- Component axe tests for index, success, empty, partial, and error states.

### E2E critical paths

1. **`P-01` guided demo:** fresh session → CrowdStrike → filter Modified → keyboard next → source context/link → save note → export current-comparison notes → reload restores note.
2. **Recovery:** intercept comparison API with 503, verify error and retained state, Retry to success.
3. **Partial data:** load partial fixture, ensure banner/exclusions and only validated content.
4. **Responsive:** mobile viewport completes the same workflow with stacked passages and no horizontal overflow.
5. **Source links:** all ten generated URLs have correct host/path; dated live verification is a separate release command.

### Accessibility verification

- Automated: axe in component tests and Playwright; no serious/critical violations.
- Lighthouse accessibility 100 on `/` and canonical comparison route in production.
- Manual keyboard-only run of the entire golden path.
- Manual macOS VoiceOver + Safari smoke test: landmarks/headings, filter announcements, change position/type, old/current labels, note error/status, external link names.
- 200% and 400% zoom/reflow; 320 CSS-pixel viewport; contrast checks for every token/state; reduced-motion inspection.
- Record date, OS, browser/version, assistive technology/version, route, fixture, commit, and limitations.

### Performance verification

- Production Vercel deployment, logged out/incognito, cache state documented.
- Lighthouse mobile Slow 4G / 4× CPU, three runs, median reported for `/` and canonical comparison.
- Targets: performance ≥90, LCP ≤2.5 s, CLS ≤0.1, no long task >200 ms during next-change interaction.
- One comparison payload at a time; Brotli/gzip transfer target ≤350 KB; route client JavaScript transfer target ≤220 KB. If missed, profile before claiming success.
- Render only the change list and bounded context, not the entire Item 1A DOM. Prefer semantic DOM and `content-visibility` for long lists; add virtualization only if measured and only with an accessible fallback.

### Security/privacy verification

- Check response headers/CSP, no secrets in client bundle, no source host outside allowlist, no raw HTML rendering, no note text in logs/network, max-length and quota errors, dependency audit, and repository secret scan.
- Verify the demo works with local storage disabled and does not imply note persistence.

### Browser/device matrix

- Desktop: current Chrome and Safari on macOS.
- Keyboard/screen reader: Safari + VoiceOver on macOS.
- Mobile emulation: Playwright Chromium at 390×844 and 320×800.
- Secondary smoke: current Firefox desktop if time remains after all must-have gates.

## Realistic failure tests

| Failure | Test method | Pass condition |
|---|---|---|
| SEC rate-limited/unavailable | Ingestion HTTP fixture returns 429 + `Retry-After`, then 503 | Throttle/backoff occurs; command exits nonzero after cap; existing fixture is not corrupted |
| Filing structure unrecognized | HTML fixture lacks credible Item boundaries | Parser returns typed failure; no comparison emitted |
| Item 1A missing/changed | Reference-only and renamed-heading fixtures | Missing is unavailable; recognized variant extracts; uncertainty never becomes empty success |
| One filing is an amendment | Metadata form `10-K/A` | Pair rejected with `amendment_detected` |
| No meaningful textual changes | Identical/reordered-only pair | Success empty state; wording explicitly says this is not proof of unchanged risk |
| Source link unavailable | Release checker gets 404/503; UI source-status fixture | Release fails for 404; UI preserves passage and shows dated warning/retry/copy URL |
| Invalid/oversized note | Whitespace, 2,001 chars, quota exception, script-like text | Inline error or safe plain-text persistence; no execution, no lost draft, no network/log leak |
| Comparison partially available | One source reference fails validation | Only validated changes render; persistent partial banner and exclusion reason/count |
| API request fails | Playwright intercept 503 then recovery | Retry succeeds; issuer/filter selection remains |

## One-week plan and cut line

### Day-by-day

| Day | Frozen outcome |
|---|---|
| 1 | Repo, schemas, visual tokens, five-pair provenance manifest, parser fixtures, deployment preview |
| 2 | SEC ingestion/normalization, Item 1A extraction, deterministic alignment, generated CRWD fixture |
| 3 | **Checkpoint:** deployed CRWD golden path end to end; all five pairs ingest and validate; split review, filters, keyboard navigation, source context/links, local note, loading/error shell; parser/comparison tests green |
| 4 | Remaining fixture QA, unified mode, compact change ledger, note export, all product states, responsive behavior |
| 5 | Accessibility pass, unit/component tests, critical Playwright, security headers/logging |
| 6 | Performance profiling, source verification, screenshots/evidence, ADR and implementation report |
| 7 | Production deploy, clean-session audit, fixes, handoff—no final public README/case study yet |

### Day 3 checkpoint and trigger

If the exact Day 3 checkpoint above is not working in a deployed preview by the end of Day 3, stop secondary work and apply the cut order. Do not add AI, another issuer/section, a database, animation, or extra landing content. If any of the five chosen filings still lacks a validated Item 1A fixture, the implementation agent must report the blocker; it may not silently substitute another issuer or pair because the corpus is frozen.

### Strict cut order

1. Cut deep-link copy convenience (URL state itself remains).
2. Cut Firefox secondary smoke and nonessential transition polish.
3. If still behind, stop and return an incomplete report rather than cutting a frozen issuer, source provenance/context, compact change ledger, local note workflow or export, keyboard completion, responsive behavior, required states, deployment, critical tests, or factual documentation.

AI, live ingestion, arbitrary search, extra sections, auth, and a database are non-goals, not contingency features; never start them.

## Deliverables

- [ ] Authorized private/public GitHub repository under the final approved name.
- [ ] Live no-sign-up Vercel demo on a temporary `vercel.app` URL.
- [ ] Five generated comparison fixtures and provenance manifest.
- [ ] Inspectable ingestion, parser, normalization, and comparison code.
- [ ] Architecture decision record(s), method/limitations document, and implementation completion report.
- [ ] Green CI: format, lint, strict types, unit/component, deterministic fixtures, build, and critical E2E.
- [ ] Desktop/mobile and non-happy-state screenshots with evidence metadata.
- [ ] Accessibility, performance, source-link, console, and post-deploy log evidence with dates/environments.
- [ ] 60–120 second recording or precise recording script.
- [ ] Attribution/license inventory and safe/unsafe claims ledger.
- [ ] Case-study source facts only. **Do not write the final public README or portfolio case study before independent audit.**

## Truth and provenance

- **Public/seeded data source:** The ten official SEC EDGAR filing documents and submissions metadata listed in [research.md](./research.md).
- **Third-party assets/licenses:** Self-hosted Source Serif 4 and IBM Plex Sans under the SIL Open Font License; package licenses captured in the implementation inventory. No issuer logos are required.
- **AI model/provider:** None in the MVP.
- **Claims that must be measured before publication:** Performance/Lighthouse scores, accessibility results, payload/bundle sizes, test counts, deterministic hashes, source-link status, console/log cleanliness, and any statement about supported parser fixtures.
- **Claims that must not be made:** Accuracy percentage, universal filing support, materiality, risk direction, investment outcome, time saved, users/customers/adoption, SEC approval, or AI capability.
- **Fictional elements:** Maya, her watchlist, trigger, note, and workflow scenario. Show the exact disclosure in the app/about and later public materials.
- **Attribution language:** “Source documents: SEC EDGAR. FilingDelta is not affiliated with or endorsed by the U.S. Securities and Exchange Commission.”
- **Disclaimer:** “FilingDelta compares filing text for research and educational use. It does not assess investment significance or provide investment advice. Verify passages in the linked SEC filings.”

## Safe and unsafe UI language

| Safe | Unsafe |
|---|---|
| “Text added in the newer filing” | “New material risk” |
| “Wording modified” | “Risk increased” |
| “No meaningful textual changes found by this method” | “No change in risk” |
| “Removed passage” | “Risk resolved” |
| “Similarity used for alignment only” | “Change severity score” |
| “Research note saved in this browser” | “Saved to your account” |

## Selection rubric

| Criterion | Score | Reason |
|---|---:|---|
| Real user problem | 2/2 | Specific user, annual-filing trigger, documented manual workflow, and bounded outcome |
| One-week scope | 2/2 | Five preverified pairs, one section, fixture-first demo, explicit non-goals and cuts |
| Distinctive evidence | 2/2 | Parser/alignment, provenance, complex state, accessibility, testing, and release evidence beyond Nora's existing demos |
| Product depth | 2/2 | Complete selection → review → verify → note → restore/recover workflow |
| Engineering depth | 2/2 | Difficult HTML normalization, deterministic alignment, caching, typed API, failure model |
| Visual craft | 2/2 | Purposeful editorial system and dense document-specific interaction semantics |
| Accessibility | 2/2 | DOM order, non-color semantics, focus/live behavior, reflow, screen-reader plan shape the design |
| Testability | 2/2 | Stable IDs, deterministic fixtures, failure matrix, component/E2E gates |
| Demo clarity | 2/2 | Exact guided path with value visible in under 60 seconds |
| Portfolio story | 2/2 | Strong problem/constraints/tradeoffs and honest evidence boundary |
| **Total** | **20/20** | No zero; scope is frozen at the minimum that preserves the story |

The 20/20 is a **selection score for the frozen plan**, not proof of implementation quality. The finished project must still pass independent audit.

## Open decisions for Nora

1. **Public project name:** Current web research shows direct “FilingDelta” / “Filing Delta” collisions. Before public repository creation or deployment branding, Nora must approve a distinct name. This does not reopen the product concept, architecture, corpus, or requirements. Until then, use one replaceable `PRODUCT_NAME` value and private working title only.

No other product decision is open. Connecting Nora's GitHub/Vercel accounts and making the eventual repository public are later authorization steps, not permission for the implementation agent to change scope.
