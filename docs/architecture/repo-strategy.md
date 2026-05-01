# Repository Strategy

## Decision

BookCompass will use a monorepo for the first production build.

## Structure

```text
BookCompass/
  apps/
    web/
    api/
  packages/
    shared/
  docs/
    architecture/
    components/
    releases/
    roadmap/
    runbooks/
```

## Why Monorepo

The first month requires speed, consistency, and tight coordination across frontend, backend, and recommendation logic. A monorepo gives us:

- one source of truth for issues, scripts, CI, and documentation
- shared TypeScript types between API and web
- easier refactoring while schemas and scoring contracts evolve
- simpler onboarding and local setup
- less process overhead during the MVP build

## Why Not Dual Repo Now

A separate frontend and backend repo would add coordination cost before the domain model stabilizes. It is useful when teams are independently deploying at different cadences, but that is not the current constraint.

## Recommendation Service Boundary

The recommendation engine starts as a NestJS module inside `apps/api`.

Planned path:

1. MVP: deterministic weighted scoring in NestJS.
2. Phase 2: persist feature vectors and recommendation sessions.
3. Phase 2/3: add Python FastAPI service for embeddings, collaborative filtering, and DNF prediction.
4. Later: split AI/ML service into its own repo only if it has a separate deployment cadence, model lifecycle, or team ownership.

## Rule

Do not create a separate recommendation repo until at least one of these is true:

- model training/deployment has an independent lifecycle
- Python dependencies become operationally heavy
- recommendation traffic needs isolated scaling
- another team owns AI/ML delivery
- the API needs to call multiple model versions behind a service contract
