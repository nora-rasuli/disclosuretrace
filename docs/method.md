# Method, correction, and retention notes

Disclosure Trace is an independent product for research and educational use. It retrieves the latest two annual 10-Ks for a requested ticker and compares Item 1A wording. Added, removed, and modified describe text operations, not risk direction, severity, materiality, or investment significance. Saved examples provide a deterministic fallback and test corpus.

## Deterministic method

1. Resolve the ticker through the SEC company directory and discover the latest two non-amended 10-Ks from submissions metadata.
2. Retrieve source documents server-side with an allowlisted SEC origin, declared contact-bearing User-Agent, bounded timeout, and one-hour revalidation.
3. Reject TOC/reference-only candidates; find the substantive Item 1A start and next-item boundary; normalize display text while preserving source block identity.
4. Match exact blocks first, then pair lightly edited blocks with deterministic token similarity and an ambiguity margin. Leave ambiguous material as explicit add/remove.
5. Emit schema-validated plain text, source references, stable IDs, counts, versions, and hashes. The application never renders filing HTML.

## Corrections and retention

Raw SEC HTML is processed server-side and is never rendered in the browser. Saved-example source HTML remains gitignored and local-cache only. Browser notes are localStorage data under a comparison-scoped key and can be deleted individually or reset together; the app has no server copy.

## Attribution

Source documents are from SEC EDGAR. Disclosure Trace is not affiliated with or endorsed by the U.S. Securities and Exchange Commission. Official filing and filing-index links are shown for verification.
