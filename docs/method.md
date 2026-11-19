# Method, correction, and retention notes

DisclosureTrace is a self-directed concept implementation for research and educational use. It compares only Item 1A wording in an exact five-pair 10-K corpus. Added, removed, and modified describe text operations, not risk direction, severity, materiality, or investment significance.

## Deterministic method

1. Verify the exact issuer, accession, period, filing date, form, and primary document against SEC submissions metadata.
2. Retrieve source documents sequentially with a declared contact-bearing User-Agent, a 500 ms request interval, bounded retry, `Retry-After`, and disk caching.
3. Reject TOC/reference-only candidates; find the substantive Item 1A start and next-item boundary; normalize display text while preserving source block identity.
4. Match exact blocks first, then pair lightly edited blocks with deterministic token similarity and an ambiguity margin. Leave ambiguous material as explicit add/remove.
5. Emit schema-validated plain text, source references, stable IDs, counts, versions, and hashes. The application never renders filing HTML.

## Corrections and retention

Raw SEC HTML is gitignored and local-cache only. A source/hash mismatch is never silently overwritten. Before a release, rerun source verification; if a filing is unavailable, amended, or changed, withdraw the affected fixture or regenerate it and rerun every quality gate. Browser notes are localStorage data under a comparison-scoped key and can be deleted individually or reset together; the app has no server copy.

## Attribution

Source documents are from SEC EDGAR. The concept is not affiliated with or endorsed by the U.S. Securities and Exchange Commission. Official filing and filing-index links are shown for verification.
