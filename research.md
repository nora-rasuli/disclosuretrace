# FilingDelta research

**Research date:** 2026-11-15
**Scope:** Product, SEC data, parsing, comparison, accessibility, feasibility, and public-identity research for a one-week concept project.
**Evidence boundary:** This file uses public research and direct inspection of official SEC filings. No user interviews, adoption, revenue, or customer validation occurred. The proposed persona and scenario are simulated and must be labeled that way.

## Executive conclusion

FilingDelta is feasible in 30–40 focused hours only if the public demo is fixture-first: five pre-ingested, manually verified pairs of consecutive Form 10-K filings, Item 1A only, with no live ticker search and no AI dependency. The technically credible story is the inspectable ingestion and deterministic comparison pipeline behind those fixtures, not a promise of universal filing support.

The user problem is real but already served by products ranging from SEC EDGAR to BamSEC, AlphaSense, RiskDiff, and a currently operating product called Filing Delta. The concept remains portfolio-worthy because it can demonstrate a different, tightly bounded artifact: an accessible research workspace whose deterministic changes, provenance, recovery behavior, and local notes are inspectable. It must not claim market novelty or copy any existing product's identity, scoring, layout, copy, or AI behavior.

One public-identity decision is unresolved: **“FilingDelta” is not clear for public use.** Current search results show an operating [Filing Delta research service](https://www.filing-delta.com/en), a [FilingDelta API](https://filingdelta.xyz/), and `filingdelta.com` listed for sale. Treat FilingDelta as a working title, centralize the display name in one configuration value, and do not purchase a domain or publish a repository under that name until Nora chooses a distinct public name.

## User problem and current workflow

### Primary user and moment

The primary user is a self-directed investor or research-oriented individual who already knows how to find a 10-K and is updating a company research note after the next annual filing. Their job is not to receive a prediction. It is to locate which Risk Factors passages changed, read the old and new wording in context, verify the source, and record follow-up questions.

### Evidence for the problem

- The SEC describes Item 1A as the section containing the risk factors applicable to the registrant and requires the discussion under the “Risk Factors” caption; the SEC's investor guide likewise identifies Item 1A as the place to find the significant risks described by the company. See the official [Form 10-K instructions](https://www.sec.gov/files/form10-k.pdf) and [How to Read a 10-K](https://www.sec.gov/answers/reada10k.htm).
- The SEC's EDGAR interface provides free search, filing metadata, and original documents, but its public search feature is organized around finding filings and keywords rather than reviewing a year-over-year section diff. See [SEC Search Filings](https://www.sec.gov/search-filings).
- Product copy from BamSEC explicitly frames the incumbent manual workflow as opening individual filings, using Ctrl-F, and scrolling documents side by side; its comparison feature marks additions and removals. This is vendor evidence, not independent validation, but it confirms a recognized workflow problem. See the [BamSEC getting-started guide](https://help.bamsec.com/hc/en-us/articles/45645740053011-Getting-Started-Guide).
- An SEC commissioner stated in 2026 that Risk Factors is, on average, one of the longest sections of a 10-K. See the [Texas A&M remarks](https://www.sec.gov/newsroom/speeches-statements/atkins-02-17-2026-remarks-texas-am-school-law-corporate-law-symposium).
- Public community discussions describe manually opening two filings, finding Item 1A headings, marking PDFs, and comparing disclosure headings. These anecdotes are directional research only and are not customer validation. See [Differences in 10-Ks from Year-to-Year](https://www.reddit.com/r/ValueInvesting/comments/vvmxmx) and [Anyone else lose hours of their life comparing 10-Ks?](https://www.reddit.com/r/ValueInvesting/comments/1pwyb7p/anyone_else_lose_hours_of_their_life_comparing/).

### Current manual workflow

1. Find an issuer in EDGAR and identify two annual 10-K filings.
2. Confirm that the forms, reporting periods, filing dates, and issuer match.
3. Open both large HTML documents or PDFs.
4. Find the real Item 1A section in each document, avoiding table-of-contents references.
5. Scroll side by side or copy text into a separate diff tool.
6. Distinguish real edits from pagination, formatting, moved paragraphs, and renamed headings.
7. Reopen the filings to verify context and record a note elsewhere.

The most costly steps are locating trustworthy section boundaries, aligning moved or lightly edited blocks, and maintaining the connection from a change back to both original passages.

## Existing alternatives and gaps

| Alternative | What it does well | Gap relative to this frozen concept | Evidence |
|---|---|---|---|
| SEC EDGAR | Free, authoritative filings, metadata, full-text search, stable accession numbers | No focused Item 1A comparison workspace or note workflow; users still assemble the comparison | [SEC Search Filings](https://www.sec.gov/search-filings), [Accessing EDGAR Data](https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data) |
| Browser/PDF + Ctrl-F + generic diff | Available and flexible | Loses filing structure and provenance; formatting noise and moved paragraphs create misleading output | Directional manual-workflow evidence above |
| BamSEC | Document search, links to text, and filing comparison | Comparison is a feature within a broader paid research product; current Pro price is shown as $69/month billed annually | [Guide](https://help.bamsec.com/hc/en-us/articles/45645740053011-Getting-Started-Guide), [pricing](https://www.bamsec.com/pricing) |
| AlphaSense | Blackline/show changes, section search, tables, broader research corpus | Broad professional platform rather than a no-sign-up, five-company public demo; FilingDelta must not imitate its identity or layout | [SEC filings overview](https://help.alpha-sense.com/hc/en-us/articles/41887692936083-SEC-Filings-Content-Overview) |
| RiskDiff | Directly compares annual Item 1A disclosures, cites filings, and labels the boundary between wording change and risk interpretation | Very close concept; it uses AI-assisted matching/summaries and a scoring vocabulary. FilingDelta must differentiate through deterministic fixtures, accessibility, review navigation, local notes, and no scoring | [RiskDiff methodology](https://www.riskdiff.compare/methodology), [product](https://riskdiff.com/) |
| Search+ or generic cited-document AI | Lets a user upload two reports and ask cited questions | Conversational answers are not a deterministic review surface; users may not know what was omitted | [10-K comparison guide](https://www.searchplus.ai/documents/10-k/compare/) |
| Filing Delta / FilingDelta services | Current source-linked filing research or paid API cards | Name and conceptual collision; the portfolio project must use a different public identity and cannot claim originality | [Filing Delta](https://www.filing-delta.com/en), [FilingDelta API listing](https://x402-list.com/services/filingdelta) |

### Defensible differentiation

FilingDelta should not claim to invent filing comparison. Its distinctive portfolio evidence is the combination of:

- a transparent, deterministic comparison that stays useful with no AI;
- precise provenance for every fixture, passage, and change;
- keyboard-first long-document review and screen-reader semantics;
- explicit partial/failure states instead of silent extraction;
- a small browser-local research-note workflow; and
- an implementation small enough to inspect end to end.

## SEC EDGAR technical findings

### Public APIs and document access

- `data.sec.gov` provides unauthenticated JSON APIs for company submissions and XBRL data. The submissions API is the correct metadata source for accession number, filing date, report date, form, and primary document. The narrative text of Item 1A must still be retrieved from the primary filing document. See [EDGAR APIs](https://www.sec.gov/search-filings/edgar-application-programming-interfaces).
- Filing documents use the SEC archive path pattern `/Archives/edgar/data/{CIK without leading zeroes}/{accession without dashes}/{primaryDocument}`. The accession number is the unique accepted-submission identifier. See [Accessing EDGAR Data](https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data).
- Inline XBRL is a human- and machine-readable layer embedded in filing HTML, but the structured XBRL APIs are primarily for tagged financial facts. They do not replace DOM extraction of narrative Item 1A text. See [SEC Inline XBRL](https://www.sec.gov/data-research/structured-data/inline-xbrl).

### Access policy frozen for the implementation

- Automated requests must send a descriptive `User-Agent` containing an application identity and contact email.
- SEC guidance currently caps access at 10 requests per second in aggregate and may temporarily limit an IP that exceeds the threshold. The implementation will use one concurrent request and at most two requests per second, honor `Retry-After`, and back off on 429 and 5xx responses.
- Download only the ten frozen primary documents and their metadata; do not crawl indexes or make browser-originated SEC requests.
- The public demo makes **zero live SEC requests**. SEC access happens only through the explicit local ingestion command.

Sources: [SEC fair access and User-Agent guidance](https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data), [SEC privacy and security policy](https://www.sec.gov/about/privacy-information), and [Webmaster FAQ](https://www.sec.gov/about/webmaster-frequently-asked-questions).

### Attribution, reuse, and retention

- The SEC says government-created content and EDGAR public filing content are free to access and reuse, while asking users to cite the SEC and prohibiting use of SEC seals or trademarks in a way that implies affiliation. FilingDelta will say “Source: SEC EDGAR,” link to the filings, and state that it is not affiliated with or endorsed by the SEC. See [SEC Privacy Information — Website Dissemination](https://www.sec.gov/about/privacy-information) and the [Webmaster FAQ](https://www.sec.gov/about/webmaster-frequently-asked-questions).
- Filings can later be corrected or, rarely, removed. Each fixture therefore records retrieval date and SHA-256, and the release checklist rechecks all ten source URLs. If a source is corrected or removed, regenerate or withdraw the fixture rather than implying it is current. See [Accessing EDGAR Data — post-acceptance corrections](https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data) and [Correct or Delete a Filing](https://www.sec.gov/submit-filings/filer-support-resources/how-do-i-guides/correct-or-delete-filing).
- Raw downloaded HTML stays in a gitignored local cache. The repository commits provenance manifests, normalized fixture JSON, and small structural parser fixtures, not full mirrored filings. The deployed app serves only the exact passages and context required for the comparison.

## Locating and extracting Item 1A

### Frozen extraction strategy

1. Retrieve filing metadata from the submissions API and require `form === "10-K"`; do not silently substitute `10-K/A`.
2. Download the primary HTML document with the declared User-Agent and record HTTP metadata, retrieval timestamp, source URL, and SHA-256.
3. Parse as a DOM, remove non-content nodes (`script`, `style`, Inline XBRL hidden headers, metadata), and preserve visible block order.
4. Convert visible content into typed blocks: `heading`, `paragraph`, `list_item`, and `table_row`. Preserve display text separately from normalized match text.
5. Generate all heading-like candidates tolerant of case, non-breaking spaces, punctuation, en/em dashes, and headings split across inline elements.
6. Score Item 1A candidates structurally: Part I context, heading styling, plausible content length, later next-item boundary, and distance from adjacent table-of-contents entries. Reject candidates immediately followed by Item 1B or another TOC row.
7. End at the first credible Item 1B. If it is absent, fall back in order to Item 1C and Item 2. Do not extract past Part I.
8. Remove repeated running headers, isolated page numbers, and exact consecutive duplicates while preserving an audit trail of removed blocks.
9. Validate minimum section length, block count, heading order, and text hash. Emit `review_required` or `failed`; never manufacture an empty comparison from an uncertain extraction.

The SEC form order supports Item 1A followed by 1B, 1C, and Item 2, but real filings require fallback logic. The official order is shown in the [Form 10-K instructions](https://www.sec.gov/files/form10-k.pdf). Public parsing research likewise uses visual/DOM clues and the next major item boundary; see this [Item 1A extraction dissertation summary](https://ninercommons.charlotte.edu/record/1333/files/Binkley_uncc_0694D_12721.pdf) and the open-source [sec-parser guide](https://sec-parser.readthedocs.io/en/stable/notebooks/user_guide.html).

### Parsing risks and required behavior

| Risk | Why it occurs | Required handling |
|---|---|---|
| Table-of-contents duplicate | “Item 1A” appears near the front before the real section | Candidate scoring; reject short span to the next item; test all ten selected filings |
| Heading variants | Case, punctuation, dash, spacing, nested spans, or renamed captions vary | Normalize only for detection; preserve original visible heading text |
| Missing Item 1B | Some forms omit or label the next item differently | Fallback to Item 1C, Item 2, or Part II; fail closed if no credible boundary |
| Missing or reference-only Item 1A | Smaller reporting companies may not be required to provide Item 1A; some sections may point elsewhere | Show `section_unavailable` or `partial`; do not call it “no changes” |
| Amendment (`10-K/A`) | An amendment is not necessarily a complete replacement annual filing | Exclude by default; surface `amendment_detected`; require an explicit future product decision before comparing amendments |
| Inline XBRL wrappers | Narrative text is interleaved with `ix:*` elements and hidden headers | Strip hidden metadata, unwrap visible Inline XBRL text, never render source HTML directly |
| Tables/layout divs | Some filing generators use tables or thousands of styled divs for layout | Preserve visible cell order as typed blocks and use DOM order, not tag names alone |
| Running headers/page numbers | Pagination artifacts repeat “Item 1A. Risk Factors” | Identify repeated short blocks and page markers; retain removal log |
| Incorporated content or exhibits | A filing may refer to another document | Do not chase external incorporated documents in the MVP; mark the section partial and explain why |
| Corrected or removed filing | SEC metadata can change after acceptance | Store hash/retrieval date, verify before release, regenerate or withdraw on mismatch |
| Source URL unavailable | Temporary SEC failure or later correction | Keep fixture readable, label source-link failure, allow retry/copy URL, and never report link success without a dated check |

## Exact seeded filing corpus

All ten documents were retrieved and inspected on **2026-11-15**. Selection criteria were exact consecutive 10-K availability, clean official HTML, reliable real Item 1A boundaries, useful variation in section length and layout, and industry diversity. Popularity was not a selection criterion.

| Issuer | CIK | Older filing | Newer filing | Why selected |
|---|---:|---|---|---|
| CrowdStrike Holdings, Inc. (`CRWD`) | 0001535527 | Filed 2024-03-07; period 2024-01-31; accession `0001535527-24-000007`; [filing](https://www.sec.gov/Archives/edgar/data/1535527/000153552724000007/crwd-20240131.htm) | Filed 2025-03-10; period 2025-01-31; accession `0001535527-25-000009`; [filing](https://www.sec.gov/Archives/edgar/data/1535527/000153552725000009/crwd-20250131.htm) | Long cybersecurity/software section; useful modified/inserted text; clean real headings plus TOC decoy |
| Airbnb, Inc. (`ABNB`) | 0001559720 | Filed 2025-02-13; period 2024-12-31; accession `0001559720-25-000010`; [filing](https://www.sec.gov/Archives/edgar/data/1559720/000155972025000010/abnb-20241231.htm) | Filed 2026-02-12; period 2025-12-31; accession `0001559720-26-000004`; [filing](https://www.sec.gov/Archives/edgar/data/1559720/000155972026000004/abnb-20251231.htm) | Marketplace, travel, regulation, and international variation; very long section tests navigation and payload budgets |
| Costco Wholesale Corporation (`COST`) | 0000909832 | Filed 2025-10-08; period 2025-08-31; accession `0000909832-25-000101`; [filing](https://www.sec.gov/Archives/edgar/data/909832/000090983225000101/cost-20250831.htm) | Filed 2026-10-07; period 2026-08-30; accession `0000909832-26-000093`; [filing](https://www.sec.gov/Archives/edgar/data/909832/000090983226000093/cost-20260830.htm) | Shorter, clean retail section; non-calendar fiscal dates; counterweight to very long tech filings |
| Delta Air Lines, Inc. (`DAL`) | 0000027904 | Filed 2025-02-11; period 2024-12-31; accession `0000027904-25-000004`; [filing](https://www.sec.gov/Archives/edgar/data/27904/000002790425000004/dal-20241231.htm) | Filed 2026-02-11; period 2025-12-31; accession `0000027904-26-000013`; [filing](https://www.sec.gov/Archives/edgar/data/27904/000002790426000013/dal-20251231.htm) | Operational, fuel, labor, safety, and macro exposure; repeated page headers test artifact removal |
| Ford Motor Company (`F`) | 0000037996 | Filed 2025-02-06; period 2024-12-31; accession `0000037996-25-000013`; [filing](https://www.sec.gov/Archives/edgar/data/37996/000003799625000013/f-20241231.htm) | Filed 2026-02-11; period 2025-12-31; accession `0000037996-26-000015`; [filing](https://www.sec.gov/Archives/edgar/data/37996/000003799626000015/f-20251231.htm) | Large industrial filing, long paragraphs, tables/layout complexity, EV/supply-chain/regulatory vocabulary |

Metadata is reproducible from the official submissions endpoints: [CrowdStrike](https://data.sec.gov/submissions/CIK0001535527.json), [Airbnb](https://data.sec.gov/submissions/CIK0001559720.json), [Costco](https://data.sec.gov/submissions/CIK0000909832.json), [Delta](https://data.sec.gov/submissions/CIK0000027904.json), and [Ford](https://data.sec.gov/submissions/CIK0000037996.json).

### Local structural inspection results

This was a planning check, not the final parser. A temporary DOM-aware extractor removed script/style/Inline-XBRL header content, found heading-like candidates, rejected TOC candidates by span, and measured the real Item 1A-to-Item 1B range.

| Filing | HTML bytes | Approx. Item 1A visible characters | Notable structure |
|---|---:|---:|---|
| ABNB 2024 | 2,185,178 | 170,594 | TOC duplicate; long section |
| ABNB 2025 | 2,131,409 | 167,280 | TOC duplicate; long section |
| COST 2025 | 1,439,081 | 42,190 | Em-dash heading variant |
| COST 2026 | 1,456,603 | 44,181 | Em-dash heading variant |
| CRWD 2024 | 2,314,747 | 164,428 | Uppercase heading; TOC duplicate |
| CRWD 2025 | 2,384,698 | 174,733 | Uppercase heading; TOC duplicate |
| DAL 2024 | 2,595,903 | 49,441 | Ten repeated Item 1A running headers |
| DAL 2025 | 2,534,165 | 51,018 | Ten repeated Item 1A running headers |
| F 2024 | 5,505,901 | 86,844 | Largest source document; long blocks |
| F 2025 | 5,281,621 | 93,405 | Largest source document; long blocks |

The final ingestion report must replace approximate counts with parser-versioned block counts and full SHA-256 values.

## Comparison method

The comparison reports textual change, never business significance.

1. Normalize match text with Unicode NFKC, whitespace collapse, case-preserving tokenization, and punctuation normalization. Keep exact display text separately.
2. Match identical block hashes globally first. This prevents an unchanged paragraph that moved from being reported as one removal plus one addition.
3. Use exact heading anchors to form local groups.
4. Within each group, use deterministic sequence alignment with token-set similarity and gap penalties.
5. Run a second pass over unmatched blocks to recover high-similarity moved or lightly edited passages.
6. Classify unmatched current blocks as `added`, unmatched prior blocks as `removed`, and matched non-identical blocks above the documented threshold as `modified`.
7. Generate word-level spans for modified blocks using a deterministic word diff.
8. Record `orderChanged: true` when an otherwise matched block moved; do not present movement alone as a risk change.
9. If similarity is ambiguous, prefer two explicit add/remove records over a false modified pairing and mark the internal alignment reason for review.

The UI must say “text added,” “text removed,” and “wording modified.” It must not say a risk is new, resolved, increased, decreased, important, or material unless that exact characterization is present in the filing passage.

## Accessibility research and implications

Long-document comparison creates several predictable barriers:

- split panes can produce a confusing screen-reader order;
- repeated diff fragments create excessive tab stops;
- color-only red/green semantics exclude users who cannot distinguish the colors;
- filtering can move or remove the current item without explaining what happened;
- sticky toolbars can obscure focus;
- animated scroll-to-change behavior can be disorienting; and
- horizontal two-column layouts can become unusable at zoom or mobile widths.

Required implications:

- DOM order is prior passage then current passage for every change; CSS may place them side by side on wide screens.
- Each change is an `article` with a heading, visible type word, icon/symbol, and accessible label.
- Add/remove/modified never depends on color. Use `+ Added`, `− Removed`, and `~ Modified` text, distinct borders/patterns, and appropriate `<ins>`/`<del>` markup with screen-reader-only labels.
- Provide previous/next buttons plus documented `Alt+ArrowUp` and `Alt+ArrowDown` shortcuts. On navigation, focus the active change heading and announce position/type through a polite live region.
- Use real buttons, checkboxes, links, headings, and landmarks; avoid an ARIA grid.
- At narrow widths, stack prior above current and preserve the same DOM order; no horizontal page scroll at 320 CSS pixels or 400% zoom.
- Respect `prefers-reduced-motion`: no smooth scroll or animated highlight transitions.

W3C requires that color not be the only visual means of conveying information and that focus order preserve meaning and operation. See [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) and [Understanding Focus Order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order).

## One-week technical feasibility

### Frozen architecture implication

Use Next.js 16 App Router with strict TypeScript, a read-only versioned API route over committed deterministic comparison fixtures, and a separate Node/TypeScript ingestion CLI. Next.js 16 is currently Active LTS, and its App Router supports Server and Client Components; see the [Next.js support policy](https://nextjs.org/support-policy) and [App Router docs](https://nextjs.org/docs/app). Vercel Functions are sufficient for the small read-only API and require no database or always-on service; see [Vercel Functions](https://vercel.com/docs/functions).

### Estimated focused hours

| Work | Hours |
|---|---:|
| Repository, tokens, shell, fixture schemas | 4 |
| SEC retrieval, extraction, normalization, provenance | 7 |
| Alignment/diff implementation and deterministic fixtures | 6 |
| Comparison workspace, change ledger, filters, modes, source context | 8 |
| Local notes, client-only export, and recovery states | 4 |
| Accessibility, responsive behavior, performance | 5 |
| Unit/component/E2E/CI/deploy evidence | 6 |
| **Total** | **40** |

This estimate is credible only because live arbitrary-company ingestion, authentication, a database, AI, every 10-K section, and cross-device notes are excluded.

### Scope amendment 1: highest product-utility cut restored

The highest-return item from the original cut list is a **client-only export of saved notes for the current comparison**. It completes the no-account research workflow with a portable, recoverable artifact and strengthens the end-to-end product story without adding an API, database, identity, SEC request, or external service. The bounded implementation is a UTF-8 Markdown download generated in the browser from already-loaded note records, with issuer/pair metadata, change IDs, saved timestamps, and official SEC URLs; it includes no filing passage text. Notes are serialized as literal user-authored content, the filename is sanitized, and the temporary object URL is revoked. Estimated cost is one focused hour, moving the plan from 38 to 39 hours while remaining inside the 30–40-hour boundary.

This promotion does **not** authorize note import, cloud sync, collaboration, share links, rich text, PDF export, or cross-device persistence. Those remain out of scope.

### Scope amendment 2: highest recruiter-presentation cut restored

The highest-return cut for recruiter appeal is the **compact textual-change overview**, implemented as an editorial “change ledger” rather than dashboard cards or a chart. The comparison response already contains the required counts, so the bounded work is presentation and verification: one semantic row showing Total, Added, Removed, and Modified counts, each with a word label and symbol; a separate “N visible” result after filters; responsive wrapping; and invariant tests against the fixture. It gives the first comparison viewport and portfolio screenshot an immediate, legible data story while reinforcing React/TypeScript UI craft and accessibility.

This adds at most one focused hour and moves the estimate from 39 to the hard ceiling of 40 hours. It is the final safe scope restoration. It does **not** authorize charts, trends, severity, scores, animation, business-risk interpretation, or additional metrics; those would add ambiguity and dashboard styling without strengthening the core evidence.

## Product truth and disclaimer guidance

Use one concise persistent footer/about statement and one contextual note near the comparison header:

> FilingDelta compares filing text for research and educational use. It does not assess investment significance or provide investment advice. Verify passages in the linked SEC filings.

Safe public claims after implementation evidence exists:

- compares the named filing pairs and Item 1A fixtures;
- links each change to the exact prior/current passage and official filing;
- uses deterministic extraction/comparison for the shipped fixtures;
- works without sign-up;
- stores notes only in the current browser;
- measured accessibility/performance/test results with date and method.

Unsafe claims:

- “finds material changes,” “identifies new risks,” or “detects increased risk”;
- comprehensive or universal 10-K parsing;
- investment insight, alpha, prediction, recommendation, ranking, score, or buy/sell language;
- “AI-powered” when AI is not shipped;
- users, customers, adoption, hours saved, accuracy percentages, or business impact without real evidence;
- SEC affiliation, approval, or endorsement.

## Research limitations

- No primary interviews or usability studies were conducted.
- Competitor capabilities and prices are dated 2026-11-15 and may change.
- The ten filings were structurally inspected, but the final parser and comparison outputs do not yet exist.
- The project name has not been cleared legally or commercially; web search already shows direct collisions.
- Accessibility requirements are design targets until independently tested in the implementation.

## Recommended portfolio-system improvements

These recommendations are recorded here only; the global templates were not modified.

1. Add a **public-name collision check** to the project-framing template before repository or domain creation.
2. Add a **source-retention and correction policy** field for projects that cache public documents whose origin can later change or disappear.
3. Expand the requirement-map template columns to include **priority** and **cut status** by default; this request needed both for audit traceability.
4. Add a standard **data-corpus manifest** section for projects with seeded real-world fixtures: source URL, accession/version, retrieval date, hash, license/reuse note, and verification status.
5. Add a **high-stakes language checklist** for financial, medical, legal, and safety-adjacent concepts so wording boundaries are frozen before UI copy is written.
