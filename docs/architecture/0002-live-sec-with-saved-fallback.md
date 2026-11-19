# ADR 0002: live SEC retrieval with saved fallback

**Status:** Accepted on 2026-11-18  
**Supersedes:** ADR 0001 as the production data path

## Context

The core user outcome is comparing current annual disclosures for a company the user chooses. A fixed catalog made the interface reliable but did not complete that product outcome.

## Decision

The production application resolves a ticker through the SEC company directory, discovers the latest two non-amended 10-Ks, retrieves both filing documents server-side, validates Item 1A boundaries, and generates the comparison on demand.

Requests use allowlisted SEC origins, a descriptive contact-bearing User-Agent, bounded timeouts, and one-hour revalidation. Filing HTML stays server-side. The browser receives validated plain-text passages, source references, hashes, and comparison metadata.

The existing saved comparisons remain available as:

- a fallback when SEC EDGAR is slow or unavailable;
- a deterministic automated-test corpus;
- examples that let a reviewer inspect the workflow immediately.

## Consequences

- The primary workflow now supports arbitrary tickers present in the SEC directory when two compatible annual filings exist.
- Runtime success depends on SEC availability and document structure, so retrieval and extraction failures must be explicit.
- Serverless caching reduces repeated SEC traffic but means “live” represents an on-demand request with up to one hour of revalidation.
- Saved examples are a resilience mechanism, not a claim of complete market coverage.
