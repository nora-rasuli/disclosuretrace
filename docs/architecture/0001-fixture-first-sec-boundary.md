# ADR 0001: fixture-first SEC boundary

**Status:** Accepted locally on 2026-11-17
**Package:** 1.2.0

## Decision

The browser and read-only application API use versioned local JSON fixtures only. SEC hosts may be contacted only by the explicit server-side ingestion and source-verification commands. The public runtime has no credentials, user database, analytics, authentication, or AI dependency.

The ingestion pipeline verifies exact 10-K metadata, rejects amendments and unexpected accessions, retrieves sequentially at no more than two requests per second, honors `Retry-After`, applies bounded retry, caches raw responses outside versioned data, hashes sources, extracts Item 1A with fail-closed boundaries, and emits deterministic normalized fixtures.

## Current local corpus status

The five committed comparisons are deliberately marked `partial`. They contain manually verified official SEC passages, official filing and index URLs, accession metadata, deterministic IDs, and fixture hashes. Raw filing SHA-256 values are `null` and visibly labeled pending because a compliant live run requires an authorized contact-bearing `SEC_USER_AGENT`. No missing passage is represented as an empty or complete comparison.

## Consequences

- Browser requests cannot leak a contact header or send notes to SEC or any backend.
- Fixture output is stable and reviewable; a release can be withdrawn or regenerated when source metadata changes.
- Full-section completeness and raw source hashes must not be claimed until an authorized ingestion run replaces the partial fixtures and all gates are rerun.
