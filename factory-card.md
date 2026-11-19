# Factory Card — DisclosureTrace

This card tracks production state. The frozen package and implementation report remain the detailed sources of truth.

## Identity

- **Project:** DisclosureTrace
- **Slug:** `disclosuretrace`
- **One-sentence seed:** See what changed between annual filings, with every finding connected to the original SEC text.
- **Primary hiring gap:** React and TypeScript product engineering with complex data flow, end-to-end ownership, testing, accessibility, and release quality.
- **Started:** 2026-11-16
- **Owner:** Nora Rasuli

## Current state

- **Station:** Independent audit complete; remediation/pivot gate
- **Status:** `Not ready` — release `BLOCKED`
- **Next action:** Decide whether to perform the material workflow pivot required by `originality-gate.md`; do not publish the current concept.
- **External blocker:** SEC contact-header consent and authorized protected-deployment audit access; technical blockers are recorded in `independent-audit.md`.

## Artifact index

| Artifact               | Path or URL                     | Version/date  | Status                      |
| ---------------------- | ------------------------------- | ------------- | --------------------------- |
| Release preflight      | `release-preflight.md`          | 2026-11-18    | Passed with external action |
| Research               | `research.md`                   | 2026-11-16    | Frozen                      |
| Project brief          | `project-brief.md`              | Package 1.2.0 | Frozen                      |
| Project package        | `project-package.md`            | Package 1.2.0 | Frozen                      |
| Implementation handoff | `implementation-handoff.md`     | Package 1.2.0 | Frozen                      |
| Implementation status  | `implementation-status.md`      | Active        | Active                      |
| Implementation report  | `evidence/completion-report.md` | 2026-11-18    | Complete                    |
| Evidence register      | `evidence/evidence-register.md` | 2026-11-18    | Complete with declared gaps |
| Independent audit      | `independent-audit.md`          | 2026-11-18    | Not ready / BLOCKED         |
| Hiring-manager review  | Not created                     | —             | Blocked                     |
| GitHub README          | Blocked until audit             | —             | Blocked                     |
| Portfolio case study   | Blocked until audit             | —             | Blocked                     |
| Live demo              | Local/deploy-ready only         | 2026-11-17    | External action blocked     |
| Post-launch check      | Not created                     | —             | Blocked                     |

## Gates

### Release preflight gate

- [x] Public-name collision and repository/domain implications are checked.
- [x] Data access, attribution, licenses, and privacy boundaries are explicit.
- [x] GitHub/Vercel readiness and the no-cost ceiling are verified.
- [ ] Explicit authorization to transmit the named email address to the U.S. SEC is recorded.

**Decision/date:** Passed with one owned external action, 2026-11-18.

### Package gate

- [x] Selection score is at least 14/20.
- [x] No zero in real problem, one-week scope, or distinctive evidence.
- [x] Golden path, exact demo, architecture, seeded data, requirement IDs, cut order, and quality targets are frozen.
- [x] Public-claim boundaries are explicit.

**Decision/date:** Passed and frozen, 2026-11-16.

### Implementation gate

- [x] Golden path is complete.
- [x] Every requirement is marked shipped, changed, or cut.
- [x] Required automated checks pass or limitations are recorded honestly.
- [x] Desktop, mobile, keyboard, failure, accessibility, performance, and provenance evidence are present.

**Decision/date:** Local implementation gate passed with Changed rows, 2026-11-17; external release and independent audit remain.

### Audit gate

- [ ] No unresolved P0 or P1 findings.
- [ ] Required claims and measurements were independently reproduced.
- [ ] Audit decision permits publishing.

**Decision/date:** `Not ready`; release `BLOCKED`, 2026-11-18. P1 findings remain for source integrity, method/determinism, release evidence, and originality.

### Publishing gate

- [ ] README and case study use only approved claims.
- [ ] Demo, repository, screenshots, dates, metrics, and limitations agree.
- [ ] Skill-coverage matrix and project registry are updated.

**Decision/date:** Blocked until audit.

## Cut log

| Date       | Requirement/item              | Decision                         | Reason                                                                     | Impact                                                 |
| ---------- | ----------------------------- | -------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| 2026-11-16 | AI-generated change summary   | Excluded from active MVP         | Deterministic comparison and provenance provide stronger one-week evidence | No loss to golden path; avoids untraceable output risk |
| 2026-11-16 | `SH-03` optional enhancement  | First cut if Day 3 trigger fires | Protect golden path and release gates                                      | Optional recruiter-facing polish only                  |
| 2026-11-17 | `SH-03` copy-link convenience | Cut                              | Frozen cut-first authorization; protect evidence work                      | URL restoration remains fully shipped                  |

## Factory learning

- **What accelerated production:** Frozen filing pairs, stable requirement IDs, fixture-first architecture, and explicit public-claim boundaries.
- **What caused rework:** Client-first fixture loading caused focus/persistence timing defects and a comparison LCP miss; server-seeding the initial fixture removed the wait while a manual refresh retained recovery testing.
- **Template/process improvement supported by evidence:** Treat contact-bearing source headers and external publication authority as explicit Day 1 gates, and keep local production/performance evidence separate from deployment claims.
