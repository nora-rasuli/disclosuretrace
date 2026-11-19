# DisclosureTrace deployment verification plan

This plan is executable only after the audit gate permits release. It separates
protected pre-release verification from public post-release verification and
does not authorize a deployment, promotion, protection change, or repository
visibility change.

## Preconditions

- [ ] Independent audit verdict is `PASS`.
- [ ] No unresolved P0/P1 findings remain.
- [ ] Final release commit SHA is recorded.
- [ ] Default-branch CI is green for that SHA.
- [ ] Final deployment ID, URL, created time, and rollback target are recorded.
- [ ] README, case study, metadata, screenshots, and claims ledger reference the same SHA and fixture version.
- [ ] Nora has authorized the exact external publication actions.

## Protected pre-release verification

| Check               | Method                                                                                                                                 | Required result                                                                                                     | Evidence to retain                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Deployment identity | Inspect project/deployment metadata without changing protection.                                                                       | Deployment SHA matches the release SHA.                                                                             | Deployment ID, URL, SHA, created time.    |
| Root route          | Open `/` in a fresh authenticated/protected session.                                                                                   | Product promise, concept disclosure, exact five-pair boundary, SEC attribution, and disclaimer render.              | Timestamped screenshot and HTTP status.   |
| Canonical demo      | Open `/compare/crwd/2024-2025?view=split&types=added,removed,modified`.                                                                | Provenance, partial/full status, ledger, source links, comparison, and note workflow render without console errors. | Screenshot, console capture, route.       |
| Golden path         | Filter Modified, navigate by keyboard, expand context, save/reload a note, and export Markdown.                                        | State, focus, URL, persistence, and export behavior match the final audit.                                          | Short recording or Playwright trace.      |
| Failure recovery    | Exercise the approved 503/partial scenario.                                                                                            | The UI explains the state, preserves context, and retries without fabricated success.                               | Screenshot/trace with mocked-state label. |
| API contract        | Request catalog and canonical comparison endpoints.                                                                                    | Schema-valid response, expected cache/security headers, no live SEC dependency.                                     | Header/body digest and status.            |
| Responsive/keyboard | Run 390×844, 320×800, keyboard-only, reduced-motion, and final manual accessibility checks.                                            | No blocking reflow/focus/semantics defect.                                                                          | Dated checklist and captures.             |
| Source integrity    | Run the final approved source verifier.                                                                                                | All required URLs and recorded source facts satisfy the audit's release criteria.                                   | Dated raw report.                         |
| Privacy/security    | Inspect network, headers, client bundle, note behavior, and production logs.                                                           | No note transmission, secret/contact-header exposure, raw HTML rendering, or unexpected external request.           | Header/network/log evidence.              |
| Rollback            | Identify the previous known-good deployment and rehearse the documented rollback decision path without rolling back a healthy release. | A concrete rollback target and owner exist.                                                                         | Deployment ID and procedure.              |

## Authorized publication sequence

1. Promote or designate the audited deployment only after explicit authorization.
2. Keep the repository private until Nora separately authorizes public visibility.
3. Apply the approved repository description, homepage, topics, and social preview.
4. Make the repository public only if the audited commit and required public files are present.
5. Update the portfolio only after the public repository and demo pass the fresh-session checks below.
6. Pin or promote the repository only after the hiring-manager review passes.

## Fresh public-session verification

Run from an incognito/logged-out session with no Vercel or GitHub account state:

- [ ] Production root returns a successful response and has no authentication wall.
- [ ] Canonical comparison opens directly and completes the no-sign-up golden path.
- [ ] GitHub README links resolve to the intended public demo, case study, method, and evidence.
- [ ] Repository description, homepage, topics, license status, and social preview match the approved release record.
- [ ] Portfolio card/case study links resolve and use the same claims, metrics, dates, limitations, and screenshots.
- [ ] Browser console and production error logs show no release-blocking error.
- [ ] The rollback target remains available.

## Stop/rollback triggers

Stop promotion or unfeature/rollback if the public session reveals a broken root
or canonical route, authentication barrier, note leakage, unexpected external
request, serious/critical accessibility regression, source/provenance mismatch,
unsupported public claim, missing attribution, or a P0/P1 regression.
