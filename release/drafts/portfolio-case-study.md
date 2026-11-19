# DisclosureTrace — portfolio case study (private draft)

> **BLOCKED PRIVATE DRAFT.** The independent audit records `Not ready`, and the
> originality gate records `Pivot`. This must not be published or used to label
> the project `Portfolio-ready` without a material workflow pivot, new
> originality approval, technical remediation, and a publication-permitting
> re-audit.

## Card copy

- **One-line description:** Review year-over-year Item 1A wording changes with source-linked SEC context and browser-local research notes.
- **Role:** Product design and full-stack product engineering
- **Timeline:** One-week concept project, November 2026
- **Stack:** Next.js, React, TypeScript, Zod, Cheerio, Vitest, Playwright
- **Links:** Withheld pending material pivot, remediation, and a publication-permitting re-audit

## Hero

**Headline:** See what changed. Verify the source.

**Summary:** DisclosureTrace is a self-directed concept project for readers who
need to compare annual Risk Factors language without losing the connection to
the original filing. It turns a fixed set of real SEC filing pairs into a
deterministic review queue with source context, keyboard navigation, and
browser-local notes. The persona and research scenario are simulated; filing
text and metadata come from SEC EDGAR.

| Role                                              | Timeline | Stack                                                  | Project type                                   |
| ------------------------------------------------- | -------- | ------------------------------------------------------ | ---------------------------------------------- |
| Product design and full-stack product engineering | One week | Next.js, React, TypeScript, versioned partial fixtures | Private technical concept; publication blocked |

## The problem

A reader comparing annual 10-K Risk Factors must locate the substantive Item
1A section in two long documents, avoid table-of-contents duplicates, separate
formatting and movement from changed wording, return to both original sources,
and keep follow-up notes elsewhere. Existing products show that the workflow is
real, but this project does not claim novelty, user validation, or time saved.

### User story

> As a self-directed investor updating a company note after a new annual filing,
> I need to review exact Item 1A wording changes against the prior 10-K so that I
> can decide what to investigate next without trusting an untraceable summary.

### Starting scenario

The simulated user is revisiting CrowdStrike after its next annual filing. The
task is not to decide whether the company is safer, riskier, or investable. The
task is to find changed language, read both sides in context, verify the filing,
and record a follow-up question.

## Product approach

| Step | User intent                         | Interface response                                                                                                        | Design rationale                                                                   |
| ---- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1    | Choose a trustworthy comparison.    | The index lists exactly five fixed issuer/pair records with period and accession metadata.                                | A frozen corpus makes the promise concrete and inspectable.                        |
| 2    | Understand the review boundary.     | The workspace names Item 1A, both filings, source status, and exact text-change counts.                                   | Provenance appears before interpretation and prevents a dashboard-like risk score. |
| 3    | Review changed wording efficiently. | Filters, split/unified modes, previous/next controls, URL state, focus movement, and non-color labels organize the queue. | Dense document work needs continuity, keyboard use, and explicit semantics.        |
| 4    | Verify the evidence.                | Each change exposes prior/current passage context and official SEC filing/index links.                                    | A comparison is credible only when the reader can return to both sources.          |
| 5    | Carry the investigation forward.    | Plain-text notes save in the browser and export as Markdown without filing passage text.                                  | A useful no-account artifact completes the workflow without adding a note backend. |

### Screenshot sequence to publish after audit

1. Five-pair index with the approved name and exact corpus disclosure.
2. CrowdStrike split comparison with provenance and the compact change ledger.
3. Unified modified view with a saved browser-local note.
4. 390px and 320px stacked comparison showing responsive continuity.
5. A clearly labeled intercepted failure/partial state with Retry.

The audit recaptured these states under DisclosureTrace, but they remain local,
uncommitted, and blocked from publication.

## The hardest engineering decisions

### 1. Fixture-first instead of live public fetching

- **Constraint:** SEC retrieval needs a contact-bearing User-Agent, polite request behavior, structural validation, and protection from third-party outages.
- **Options considered:** Runtime fetching, a hybrid fallback, or a pre-generated corpus.
- **Choice and rationale:** Keep SEC access in an explicit server-side maintenance CLI and serve versioned fixtures at runtime.
- **Tradeoff:** The demo is reliable and inspectable, but source updates are deliberate release work and the current corpus must disclose partial/full status exactly.
- **Evidence/result:** Architecture ADR, ingestion code, network tests, fixture/version manifests, and final audit disposition.

### 2. Deterministic alignment without significance claims

- **Constraint:** Reordered or lightly edited passages should not become misleading add/remove noise, but semantic interpretation would exceed the product boundary.
- **Options considered:** A raw line diff, model-generated summaries, or deterministic block alignment.
- **Implemented choice:** Match exact hashes globally, then greedily pair lightly edited blocks by token-set similarity and an ambiguity margin; leave the rest as explicit add/remove.
- **Tradeoff:** Focused test cases are repeatable, but the implementation does not perform the heading-partitioned sequence alignment previously described and has not been proven by two clean full-corpus generations.
- **Evidence/result:** Alignment fixtures, stable IDs, word spans, and the independent audit's method discrepancy finding.

### 3. Useful notes without an account system

- **Constraint:** The workflow needs a durable output but the one-week scope excludes authentication and a database.
- **Choice and rationale:** Store validated plain-text notes locally and export current-comparison notes as client-generated Markdown.
- **Tradeoff:** Privacy and no-sign-up access improve, while cross-device sync and collaboration remain out of scope.
- **Evidence/result:** Note validation/storage/export tests and browser-network inspection.

## Quality as a product feature

- **Accessibility:** Logical prior/current DOM order, visible change words and symbols beyond color, focus-moving change navigation, live position announcements, reduced-motion behavior, and responsive stacking. Final public results require the missing manual checks and a publication-permitting re-audit.
- **Performance:** The implementation has dated local Lighthouse and payload artifacts, including a disclosed cold-font outlier. Publish only a future re-audit-approved profile, median, limitations, and raw links tied to the final SHA/deployment.
- **Reliability:** Versioned fixtures remove a live SEC dependency from the user path; explicit 503, partial, empty, and not-found states fail closed.
- **Testing:** Core parser/alignment/notes behavior has unit coverage, UI states have component/axe coverage, and the golden path has desktop/mobile production-mode browser tests. Final counts await audit reconciliation.

## Scope and iteration

The project deliberately excludes arbitrary tickers, additional filing sections,
live ingestion, authentication, a database, cloud notes, analytics, AI,
predictions, recommendations, and risk scoring. `SH-03` copy-link convenience
was cut first under the frozen cut order so the golden path and evidence work
remained intact.

The most important implementation correction was moving the initial comparison
away from a client-first loading dependency so the document content, focus
target, and measured loading behavior were available immediately while manual
refresh still exercised recovery.

With real users, the next validation question would be whether the change queue,
context depth, and note export match an actual annual research update—not
whether a new feature can be added.

## Outcome

This project currently demonstrates a bounded, source-linked document review
workflow and an inspectable technical system. It does not claim real users,
adoption, time saved, business impact, universal filing support, or investment
insight.

### Results ledger (release audit blocked)

| Result                                               | Type               | Method/source                                                                   |
| ---------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------- |
| Exact five fixed filing pairs and ten source records | Verified artifact  | Corpus manifest and catalog schema tests                                        |
| Committed fixture hashes match one manifest          | Verified artifact  | Version manifest check; not two clean generations                               |
| Unit/component and browser-test counts               | Measured technical | Final-SHA CI and publication-permitting re-audit required                       |
| Accessibility and Lighthouse results                 | Measured technical | Final deployed profile/raw reports and publication-permitting re-audit required |
| Payload and route-script transfer                    | Measured technical | Final deployed network/build evidence required                                  |
| Persona and note scenario                            | Simulated scenario | Frozen brief; not user research                                                 |

## What I would do next

1. Complete or retain the exact source-ingestion status required by the audit and keep the partial/full boundary visible.
2. Test the workflow with real filing readers before changing information density or claiming efficiency.
3. Expand parser coverage only through additional frozen fixtures, provenance, and regression evidence—never silent universal support.

## Interview version (60 seconds)

“I built DisclosureTrace for a reader comparing annual 10-K Risk Factors. The
main flow turns five fixed SEC filing pairs into a source-linked queue of added,
removed, and modified Item 1A wording, then lets the reader save and export a
browser-local note. The hardest decision was keeping the demo deterministic and
reliable without hiding the ingestion work, so I separated an explicit SEC
maintenance pipeline from versioned runtime fixtures and documented partial
data honestly. I treated accessibility and provenance as product behavior:
keyboard navigation moves focus and preserves URL state, change meaning does not
depend on color, and every displayed result returns to official filing context.
I kept the one-week scope credible by excluding live search, AI, auth, a
database, and risk interpretation. Next I would validate the review flow with
real filing readers before expanding the corpus.”
