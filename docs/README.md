# BookCompass Documentation

This folder is the operating memory for BookCompass. Keep it current as the product moves through each release.

Start here for every new chat/session:

- `PROJECT_CONTEXT.md`: canonical project context, timeline, daily log, and mandatory update rules.
- `architecture/mvp-high-level-design.md` and `architecture/mvp-low-level-design.md`: required MVP design baseline. Future implementation sessions must follow these HLD/LLD docs unless they intentionally update the design docs in the same change.

## Documentation Map

- `architecture/`: decisions that shape the system.
  - `mvp-high-level-design.md`: MVP system HLD.
  - `mvp-low-level-design.md`: MVP API/data/route LLD.
- `components/`: frontend, backend, recommendation engine, and admin documentation.
- `releases/`: release notes and day-by-day project logs.
- `roadmap/`: month-one build plan and phase split.
- `runbooks/`: repeatable setup, deployment, and operations instructions.

## Documentation Rule

For every release:

1. Add or update a release note in `docs/releases`.
2. Update any component doc touched by the release.
3. Add an architecture decision note if the release changes repo structure, data model, scoring strategy, deployment, security, or infrastructure.

## Commit Rule

Future multi-part sessions should use multiple semantic commits instead of one broad day-level commit. Commit by coherent task or feature, for example:

- design docs
- access policy
- frontend route flow
- catalog enrichment
- tests
- runbook or release documentation

Each semantic commit should leave the repo in a reasonable state and include focused validation where practical.

## MVP Design Rule

Before changing product behavior, backend contracts, frontend route boundaries, catalog policy, recommendation logic, or admin access, read the MVP HLD and LLD:

- `docs/architecture/mvp-high-level-design.md`
- `docs/architecture/mvp-low-level-design.md`

If implementation needs to diverge from those documents, update the relevant HLD/LLD section and mention the reason in the release note.
