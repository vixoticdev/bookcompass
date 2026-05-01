# BookCompass

BookCompass is an intelligent reading decision engine that helps users decide what to read next based on goals, reading behavior, mood, available time, and abandonment patterns.

The product is being built as a SaaS platform, not a tutorial recommendation app. The month-one target is a production-shaped MVP with an explainable scoring engine, user reading identity, book catalog, recommendation sessions, and an admin foundation.

## Repository Strategy

BookCompass uses a monorepo:

- `apps/web`: Vite, React, TypeScript, Tailwind, React Query.
- `apps/api`: NestJS API.
- `packages/shared`: shared domain types and constants.
- `docs`: release notes, component docs, architecture decisions, and runbooks.

The recommendation engine starts inside `apps/api` for speed and observability. A separate Python AI/ML service will be added later only after enough behavioral data exists to justify a model boundary.

## Local Setup

```bash
npm install
npm run infra:up
npm run dev:api
npm run dev:web
```

Default URLs:

- Web: `http://localhost:5173`
- API: `http://localhost:3000`
- API health: `http://localhost:3000/health`

## Project Cadence

Every meaningful release should update:

- `docs/releases/`
- the relevant file under `docs/components/`
- architecture docs when a technical decision changes

Day 1 goal: repository setup, project structure, local runtime baseline, and documentation system.
