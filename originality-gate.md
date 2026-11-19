# Originality Gate — DisclosureTrace

**Review date:** 2026-11-18
**Applied retroactively:** Yes. The project entered implementation before the Factory required an originality gate.

## Problem origin

The underlying difficulty—reviewing changes between long SEC filings while retaining source context—is real. However, the package was approved after competitor research had already identified several products with the same primary job-to-be-done. Technical interest and portfolio evidence were incorrectly allowed to substitute for product originality.

## Close-product evidence

| Existing product    | Overlap                                                                | Evidence                                                                                                                                                    |
| ------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FilingDelta         | Same original working name and source-linked SEC filing-change service | [FilingDelta API listing](https://x402-list.com/services/filingdelta), [FilingDelta MCP listing](https://mcpcentral.io/servers/xyz.filingdelta/filingdelta) |
| Filing Delta        | Source-linked filing research and change summaries                     | [Filing Delta](https://www.filing-delta.com/en)                                                                                                             |
| RiskDiff            | Year-over-year Item 1A comparison, source citations, and change review | [RiskDiff](https://riskdiff.com/), [methodology](https://www.riskdiff.compare/methodology)                                                                  |
| BamSEC / AlphaSense | Filing comparison and change-marking inside broader research products  | Links and comparison are recorded in `research.md`                                                                                                          |

## Clone-rejection result

- The original `FilingDelta` identity was an exact name/service collision.
- The renamed `DisclosureTrace` golden path still substantially overlaps existing filing-comparison products.
- Deterministic fixtures, accessibility, local notes, a different stack, and visual design are valuable engineering decisions but do not make the central product concept original.
- The project must not be described as unique, novel, entrepreneurial validation, or an original market concept.

## Decision

`Pivot` — retain the implementation as private technical work, but do not publish it as a featured original portfolio product. Publication requires a materially different primary user, triggering moment, desired outcome, and core workflow that passes a new side-by-side competitor review. A rename or added feature is insufficient.

**Decision/date:** Pivot, 2026-11-18.
