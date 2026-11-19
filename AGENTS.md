# FilingDelta implementation instructions

These instructions apply to this directory and its descendants. FilingDelta is
a standalone portfolio-project implementation; the parent Joby job-application
workflow does not apply inside this subtree.

## Source of truth

Before changing implementation files, read these documents completely in this
order:

1. `project-package.md`
2. `project-brief.md`
3. `research.md`
4. `implementation-handoff.md`

Treat project package version 1.2.0 as the frozen product and audit contract.
Stable requirement IDs, the exact five filing pairs, the 40-hour ceiling, the
Day 3 checkpoint, the cut order, and the quality gates are binding.

## Working rules

- Do not redesign or expand the product. Ask before changing a frozen decision.
- Build only after the user explicitly asks for implementation. Workspace setup
  or review alone does not authorize implementation.
- Keep `SH-01` compact textual-change ledger and `SH-02` note export as
  Must/Never cut.
- Do not add AI, live public SEC fetching, arbitrary ticker support,
  authentication, a database, extra filing sections, scores, predictions,
  recommendations, or investment-significance claims.
- Do not publish a repository, purchase a domain, or publicly use the working
  name “FilingDelta” until Nora approves a distinct public name.
- Do not create the final GitHub README or portfolio case study before the
  implementation and independent audit are complete.
- Preserve strict TypeScript, deterministic fixtures, provenance, accessibility,
  responsive behavior, security/privacy boundaries, tests, CI, deployment, and
  evidence as MVP work.
- Reference requirement IDs in tests and completion evidence where practical.
- Never invent users, adoption, revenue, validation, performance results,
  accessibility results, filing facts, or business impact.

## Implementation workflow

Before coding, return a milestone plan mapped to requirement IDs, the proposed
file structure, the exact Day 3 checkpoint, and any contradiction or blocker.
If implementation is authorized and no blocker exists, work milestone by
milestone and maintain `implementation-status.md` with completed IDs, evidence,
commands and results, decisions, limitations, and the next milestone.

Pause for Nora only when a decision changes cost, public identity, external
accounts, or the central product concept, or when the frozen package explicitly
requires approval. Do not push, publish, deploy, or create external resources
without explicit authorization.
