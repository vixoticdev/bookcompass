# BookCompass Documentation

This folder is the operating memory for BookCompass. Keep it current as the product moves through each release.

Start here for every new chat/session:

- `PROJECT_CONTEXT.md`: canonical project context, timeline, daily log, and mandatory update rules.

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
