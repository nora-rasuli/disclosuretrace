# SEC source verification status — 2026-11-18

- All ten primary-document URLs and all ten index URLs are schema-validated HTTPS `www.sec.gov/Archives/edgar/` paths in the frozen manifest.
- The browser E2E suite retrieved every comparison API fixture and asserted the ten primary source URLs against the allowlist.
- Official CRWD filing pages and the source passages used by the partial fixture were manually inspected in the browser.
- A new automated live check of all ten sources was not run because SEC policy requires a declared contact-bearing User-Agent and no contact value was authorized for this run. This is an explicit release blocker, not treated as success.

Repair: set an authorized `SEC_USER_AGENT`, run `pnpm sources:verify`, inspect `data/reports/source-verification.json`, regenerate full fixtures with `pnpm fixtures:generate`, and rerun all gates.

## 2026-11-18 release attempt

The release command was prepared with the required contact-bearing SEC User-Agent, but execution was stopped before the request because transmitting Nora's email address requires her explicit consent. No workaround or noncompliant anonymous automated retrieval was attempted.
