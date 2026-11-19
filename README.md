# Disclosure Trace

Disclosure Trace helps research-oriented readers answer a focused question: **what changed in a public company’s annual Risk Factors disclosure?** Enter a ticker and the application retrieves the company’s two latest 10-K filings from SEC EDGAR, extracts Item 1A, and creates a source-linked wording review.

[Open Disclosure Trace](https://disclosuretrace.vercel.app) · [View Nora Rasuli’s portfolio](https://nora-rasuli.github.io)

![Disclosure Trace filing-comparison workspace](evidence/screenshots/02-comparison-split-desktop.png)

## The user problem

Annual filings are long, structurally inconsistent documents. A reader comparing two years has to find the correct section twice, keep both source contexts available, distinguish moved text from edited text, and preserve follow-up questions. A generic document diff shows changes, but it does not provide an SEC-aware review workflow.

Disclosure Trace turns that work into a repeatable sequence:

1. Enter a public-company ticker.
2. Retrieve the latest two annual 10-Ks from SEC EDGAR.
3. Review added, removed, and modified Item 1A passages.
4. Move between source context and the official filings.
5. Save browser-local notes and export the review as Markdown.

No account is required. Notes remain in the current browser.

## Product decisions

- **Live data is the primary path.** Ticker lookup, filing discovery, source retrieval, extraction, and comparison run on demand. The five saved comparisons are resilience and demonstration fallbacks, not the product boundary.
- **Evidence before interpretation.** The application classifies textual operations; it does not infer risk severity, materiality, direction, or investment significance.
- **Fail closed on uncertain structure.** If two annual filings or reliable Item 1A boundaries cannot be found, the application explains the failure instead of returning an empty or invented comparison.
- **Keep research portable without an account system.** Review state is URL-owned; notes are stored locally and export to Markdown.

## Architecture

```text
Ticker
  │
  ▼
SEC company directory → latest two 10-K submissions
  │
  ▼
source HTML → Item 1A boundary validation → normalized blocks
  │
  ▼
exact matching → deterministic alignment → typed comparison API
  │
  ▼
React review workspace → source verification → local notes/export

If SEC is unavailable: saved verified examples remain accessible
```

Server-side SEC requests use a descriptive contact-bearing User-Agent, allowlisted SEC origins, bounded timeouts, and one-hour revalidation. Filing HTML is parsed on the server and never injected into the browser. The client receives schema-validated plain text, source URLs, hashes, stable IDs, and comparison metadata.

## Engineering highlights

- Next.js server routes perform live SEC directory, submissions, and filing retrieval.
- Zod contracts validate filing metadata, provenance, comparison records, and response boundaries.
- Exact blocks are matched first; lightly edited passages use deterministic token similarity and ambiguity rules; unmatched passages remain explicit additions or removals.
- URL-owned filters, view mode, and active-change state make review positions recoverable and shareable.
- Keyboard navigation, DOM reading order, non-color status cues, focus management, reduced-motion support, and 320 px reflow are built into the core workflow.
- Loading, unavailable, partial, empty, malformed-source, refresh-failure, and local-storage failure states are explicit.
- Saved examples make the product inspectable when SEC EDGAR is temporarily unavailable and keep automated tests deterministic.

## Quality evidence

The release gate includes formatting, ESLint, strict TypeScript, unit and component tests, deterministic saved-example checks, a production build, Playwright desktop/mobile workflows, accessibility checks, and source-link validation. Evidence artifacts are retained under `evidence/`.

## Technology

- Next.js 16, React 19, and TypeScript
- SEC EDGAR public data
- Zod, Cheerio, and deterministic text alignment
- TanStack Query and browser-local storage
- Vitest, Testing Library, jest-axe, Playwright, GitHub Actions, and Vercel

## Run locally

Requirements: Node.js 22–24 and pnpm 10.21.0.

```bash
pnpm install --frozen-lockfile
pnpm quality
pnpm test:e2e
pnpm dev
```

`SEC_USER_AGENT` is optional locally because the application includes its public product identity and contact address. Set it to your own truthful application identity and contact email when operating a fork.

## Boundaries

- Live coverage depends on SEC EDGAR availability and the filing’s document structure.
- The parser supports bounded 10-K HTML patterns and deliberately rejects uncertain Item 1A boundaries.
- Results describe wording changes, not financial meaning or investment advice.
- Browser-local notes do not sync across devices and have no server backup.
- Disclosure Trace is not affiliated with or endorsed by the U.S. Securities and Exchange Commission.

Source documents are linked to SEC EDGAR. The application is licensed under the [MIT License](LICENSE).
