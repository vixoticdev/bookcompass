# BookCompass Project Context and Timeline

This is the canonical handoff file for BookCompass.

Every Codex/chat instance working on this project must read this file before making changes. The user may point new chat instances to this file so they can quickly understand the product, current status, timeline, and update rules.

## Mandatory Update Rule

This file must be updated every time any chat instance modifies the project.

Required update behavior:

1. Add a dated entry under `Daily Execution Log`.
2. Update `Current Project State` if the status changed.
3. Update `Immediate Next Steps` if priorities changed.
4. Update affected component docs under `docs/components/`.
5. Update or add a release note under `docs/releases/` for meaningful work.
6. Do not remove prior day notes unless they are factually wrong; append corrections instead.
7. Never commit secrets, connection strings, passwords, tokens, or `.env.local`.

If a future instance changes code but does not update this file, treat that as incomplete work.

## Product Definition

Product name: **BookCompass**

Repository/folder name: `bookcompass`

GitHub repo: `https://github.com/vixoticdev/bookcompass`

BookCompass is an intelligent reading decision engine. It is not a generic book recommendation app.

The product should answer:

> What should I read next based on my actual reading behavior, abandonment patterns, available time, emotional state, learning goals, and reading preferences?

Core differentiator:

- Outcome-based recommendations, not only genre/popularity.
- Anti-DNF logic that reduces recommendations users are likely to abandon.
- Mood, energy, focus, and time-aware decision sessions.
- Explainable scoring that tells users why a book was recommended.
- Admin controls for book metadata, tuning, analytics, and drop-off analysis.

Product positioning:

- Treat as a startup-worthy SaaS product.
- Avoid college-project shortcuts.
- Prefer deterministic, inspectable recommendation logic for MVP.
- Add AI/ML later when data and scoring contracts exist.

## Technical Strategy

Repository strategy: monorepo.

Current structure:

```text
bookcompass/
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

Stack:

- Frontend: Vite, React, TypeScript, Tailwind, React Query, React Router.
- Backend: NestJS, TypeScript, Mongoose.
- Database: MongoDB Atlas for cloud dev, local Docker MongoDB fallback.
- Cache/queue: Redis available locally through Docker; deeper usage later.
- Shared package: `@bookcompass/shared` for common domain constants and types.

## Frontend Visual Direction

The user wants BookCompass to have an antique retro look with a parchment-like feeling while keeping modern product functionality.

Design direction:

- Base palette: coffee, cream, sepia, beige, off-white, white.
- Use parchment and paper texture subtly.
- Use editorial/literary typography without sacrificing readability.
- Keep the interface modern, responsive, accessible, and SaaS-grade.
- Use dark ink/espresso text for contrast.
- Use muted forest green, aged brass, soft terracotta, or restrained charcoal as accents so the UI does not become a one-note beige surface.
- Admin views should stay dense, calm, and operational rather than decorative.

The app should feel like an intelligent reading desk: warm, literary, focused, and premium.

Current architecture decision:

- Recommendation engine starts inside `apps/api` as deterministic NestJS services/modules.
- Do not create a separate recommendation repo now.
- Future Python/FastAPI AI service is Phase 2/3 only, after enough behavioral data exists.

## Local Development

Primary folder:

```bash
cd /Users/vix/Documents/bookcompass
```

Install dependencies:

```bash
npm install
```

Start local infrastructure:

```bash
npm run infra:up
```

Start backend:

```bash
npm run dev:api
```

Start frontend in a second terminal:

```bash
npm run dev:web
```

Local URLs:

- Web: `http://localhost:5173`
- API: `http://localhost:3000`
- API health: `http://localhost:3000/health`

Validation:

```bash
npm run check
npm run test --workspace @bookcompass/api -- --runInBand
npm run test:e2e --workspace @bookcompass/api
```

Known local issue:

- If API fails with `EADDRINUSE` on port `3000`, find and kill the older process:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
kill <PID>
```

Atlas note:

- `.env.local` contains the local `MONGODB_URI`.
- `.env.local` is ignored by Git and must stay uncommitted.
- If Atlas rejects connection, update Atlas Network Access with the current public IP.

## Current Project State

As of 2026-05-05:

- Monorepo exists and is pushed to GitHub.
- Frontend and backend can run locally.
- Docker Desktop works locally.
- Local Docker MongoDB and Redis are available.
- MongoDB Atlas project/cluster exists and connectivity was verified.
- Atlas database name in URI should be `bookcompass`.
- Backend has global config, CORS, validation pipe, health endpoint, and Mongoose connection.
- Backend domain modules are implemented for users, auth, reading profiles, authors, books, reading events, DNF records, and recommendation sessions.
- MVP auth is scaffolded with local password signup/login, bcryptjs password hashing, JWT issuance, `GET /auth/me`, and a reusable JWT guard.
- User-owned self-service write endpoints for profiles, reading events, DNF records, and recommendation sessions now derive `userId` from the authenticated request.
- Shared package contains core domain constants used by backend DTO validation.
- Backend catalog list endpoints now support basic filters for seed/admin exploration.
- Backend catalog list endpoints now return paginated page objects with `items`, `total`, `limit`, and `offset`.
- API seed script exists for authors/books: `npm run seed --workspace @bookcompass/api`.
- API seed script now includes a manually reviewed Day 6 catalog expansion with 25 authors and 27 books total for local exploration.
- Frontend app shell routes exist for onboarding, library, recommendation start/history, and admin placeholders.
- Frontend has an API client and React Query hooks for books, authors, and reader identity creation.
- Frontend browser tab uses the BookCompass PNG icon at `apps/web/public/bookcompass-icon.png` and the page title is `BookCompass`.
- `/library` and `/admin/books` read live catalog data from the API.
- `/login` can create a temporary authenticated frontend session.
- `/onboarding` signs up a reader, stores the local JWT, and creates a linked reading profile from authenticated ownership.
- API CORS allows both `http://localhost:5173` and `http://127.0.0.1:5173` by default; override with comma-separated `WEB_ORIGINS`.
- Frontend API calls use a dedicated Axios instance in `apps/web/src/lib/axiosInstance.ts`.
- Backend exposes authenticated reader profile retrieval and update through `GET /profiles/me` and `PATCH /profiles/me`.
- Frontend session state hydrates from `GET /auth/me` when a local bearer token exists.
- `/onboarding` can now update an existing authenticated profile and capture first reading behavior signals for liked, disliked, completed, saved, and DNF patterns.
- Catalog enrichment plan is documented in `docs/architecture/catalog-enrichment.md`.
- Catalog ingestion scaffold exists in `tools/catalog-ingestion` for a 1,000-book mixed-genre draft catalog using Open Library discovery plus Google Books enrichment.
- Catalog smoke ingestion was run for 40 mixed-genre drafts and wrote `.local/catalog-smoke.jsonl` for local inspection.
- Google Books enrichment should use `GOOGLE_BOOKS_API_KEY` for real runs; unkeyed requests returned `429` during local smoke validation, while Open Library drafts still exported successfully.
- Day 6 catalog smoke review found 40 drafts, 40 ISBNs, 29 Google Books volume IDs, 18 thumbnails, all marked `needs-review`, and zero recommendation-eligible records by design.
- Local Docker MongoDB was seeded with the Day 6 manual catalog batch and verified through `GET /books` and `GET /authors`.
- Frontend visual direction is antique retro/parchment-inspired with modern SaaS usability.
- Auth role policy and production identity provider integration are not implemented yet.
- Recommendation engine is documented; session storage exists, but scoring/candidate generation is not implemented yet.
- Admin dashboard is documented but not implemented yet.
- Admin role policy is still not implemented; avoid exposing admin mutations until guards are added.
- CI/CD is not configured yet.

Important uncommitted context:

- `docs/components/recommendation-engine/README.md` had research/data reference additions before this file was created. Do not overwrite those changes accidentally.

## Daily Execution Log

### Day 1: 2026-05-01

Goal: finish setup.

Completed:

- Created BookCompass monorepo.
- Set local folder back to `/Users/vix/Documents/bookcompass`.
- Initialized Git on `main`.
- Created and pushed GitHub repo `vixoticdev/bookcompass`.
- Added root npm workspace.
- Created `apps/web` Vite React TypeScript app.
- Created `apps/api` NestJS app.
- Created `packages/shared`.
- Added Docker Compose for local MongoDB and Redis.
- Added `.env.example`.
- Added initial documentation system under `docs/`.
- Wired API baseline:
  - global config
  - CORS
  - global validation pipe
  - `/`
  - `/health`
- Wired Mongoose to use `MONGODB_URI`.
- Verified Atlas connectivity.
- Rotated exposed Atlas password and verified new local `.env.local`.
- Confirmed frontend and backend both run locally.

Commits:

- `204efb7 chore: initialize BookCompass monorepo`
- `119e9b3 chore: wire api database configuration`

Validation:

- `npm run check`
- API unit tests
- API e2e tests
- Atlas ping against `bookcompass`

### Day 2: 2026-05-02

Goal: establish continuity for multi-chat development and implement backend domain foundation.

Completed:

- Created this canonical project context/timeline file.
- Added mandatory rule that every future modifying instance must update this file.
- Added shared domain constants for recommendation outcomes, reading depth, reading events, reading statuses, DNF reasons, mood, energy, focus, book formats, pacing, and difficulty.
- Created backend modules, schemas, DTOs, services, and minimal create/list controllers for:
  - users
  - reading profiles
  - authors
  - books
  - reading events
  - DNF records
  - recommendation sessions
- Added indexes for obvious lookup paths:
  - unique users by email
  - one reading profile per user
  - unique authors by name
  - unique books by title and author
  - user reading event timelines
  - unique DNF record per user/book
  - user recommendation session history
- Updated backend component documentation.
- Added Day 2 domain foundation release note.
- Captured frontend visual direction: antique retro, parchment-like, coffee/cream/sepia/beige/off-white palette with modern usability.

Validation:

- `npm run build --workspace @bookcompass/shared`
- `npm run build --workspace @bookcompass/api`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`

Recommended Day 3 implementation target:

- Decide MVP auth approach and wire user ownership assumptions into backend contracts.
- Add seed data strategy and initial seed script for authors/books/outcome metadata.
- Add basic frontend app shell routes for onboarding, library, recommendations, and admin placeholders.
- Start filtering/list endpoints only where needed by the seed/admin flow.

### Day 3: 2026-05-03

Goal: implement auth ownership decision, seed data foundation, catalog filters, and frontend shell routes.

Completed:

- Added `docs/architecture/auth-ownership.md` documenting the MVP JWT ownership strategy and explicit `userId` transition plan.
- Added author list filters for search, genre, and outcome.
- Added book list filters for search, author, genre, outcome, pacing, difficulty, depth, format, and max estimated minutes.
- Added idempotent API seed script using the Nest application context:
  - James Clear / `Atomic Habits`
  - Cal Newport / `Deep Work`
  - Eric Ries / `The Lean Startup`
  - Daniel Kahneman / `Thinking, Fast and Slow`
  - Brene Brown / `Dare to Lead`
- Replaced the Day 1 frontend splash screen with routed shell surfaces:
  - `/onboarding`
  - `/library`
  - `/recommendations/new`
  - `/recommendations/history`
  - `/admin`
  - `/admin/books`
- Updated backend, frontend, admin dashboard docs, and added the Day 3 release note.

Validation:

- `npm run build --workspace @bookcompass/shared`
- `npm run build --workspace @bookcompass/api`
- `npm run build --workspace @bookcompass/web`
- `npm run check`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`
- `MONGODB_URI=mongodb://localhost:27017/bookcompass npm run seed --workspace @bookcompass/api`

Note:

- Atlas rejected the current IP during seed validation, so the seed script was verified against local Docker MongoDB.

Recommended Day 4 implementation target:

- Add focused API tests for catalog filters and seed upsert behavior.
- Start reader identity form wiring on the frontend against reading profile contracts.
- Add API client helpers and React Query data hooks for catalog/admin routes.
- Decide whether local Day 4 should prioritize auth scaffolding or onboarding UX depth before Phase 2 begins.

### Day 4: 2026-05-03

Goal: complete the first frontend-to-backend slice for catalog browsing and reader identity capture.

Completed:

- Added shared backend catalog pagination helpers and safe regex escaping.
- Added `limit` and `offset` validation to author/book list query DTOs.
- Changed `GET /authors` and `GET /books` to return paginated page objects.
- Added focused unit tests for author filters, book filters, and pagination normalization.
- Added typed frontend API helpers for authors, books, users, and reading profiles.
- Added React Query hooks for catalog reads and reader identity creation.
- Wired `/library` to live books/authors data.
- Wired `/admin/books` to live book filtering by title and outcome.
- Wired `/onboarding` to create a user and then create a linked reading profile.
- Fixed local CORS for both `localhost:5173` and `127.0.0.1:5173`.
- Replaced the frontend fetch wrapper with a dedicated Axios instance.
- Added catalog enrichment plan covering bibliographic metadata, recommendation metadata, anti-DNF signals, external connectors, and admin review workflow.
- Added a 1,000-book catalog population plan and ingestion scaffold that exports reviewable JSONL drafts.

Validation:

- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run build --workspace @bookcompass/api`
- `npm run build --workspace @bookcompass/web`
- `npm run check`
- `npm run test:e2e --workspace @bookcompass/api`
- Live API smoke test for `GET /books?outcome=productivity&limit=2`
- Live API smoke test for `GET /authors?limit=2`
- Live API smoke test for `POST /users` followed by `POST /profiles`
- Live CORS header smoke test from `Origin: http://127.0.0.1:5173`

Recommended Day 5 implementation target:

- Add auth module scaffolding: password hashing, signup/login endpoints, JWT issuance, and request user extraction.
- Replace self-service explicit `userId` writes with authenticated ownership where possible.
- Add frontend auth screens or a temporary session boundary before expanding onboarding.
- Add route-level loading/error polish and read-only catalog detail pages.
- Start catalog enrichment fields and manual admin-reviewed metadata for the current seeded books.
- Run `npm run catalog:ingest -- --target 40 --per-genre 2 --out .local/catalog-smoke.jsonl` to inspect source quality before scaling to 1,000 drafts.
- Before running the full 1,000-book pass, set `GOOGLE_BOOKS_API_KEY` and decide whether to cache raw source responses under `.local/catalog-cache`.

### Day 5: 2026-05-04

Goal: add the first authenticated ownership boundary and validate catalog ingestion source quality.

Completed:

- Added `apps/api/src/auth` with signup, login, `GET /auth/me`, JWT issuance, and a reusable JWT guard.
- Added bcryptjs password hashing and a hidden `passwordHash` field on users.
- Added duplicate email conflict handling in `UsersService`.
- Changed self-service writes for reading profiles, reading events, DNF records, and recommendation sessions to derive `userId` from the bearer token.
- Kept catalog reads and current list/admin exploration endpoints unguarded for MVP development.
- Added frontend `/login`.
- Updated `/onboarding` to sign up the reader, store the local access token, and create the reading profile through authenticated ownership instead of sending a user ID.
- Added an Axios request interceptor that attaches the local bearer token.
- Added focused auth service tests for signup hashing and invalid login rejection.
- Ran catalog smoke ingestion for 40 drafts across the configured genre lanes.

Validation:

- `npm run build --workspace @bookcompass/api`
- `npm run build --workspace @bookcompass/web`
- `npm run check`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`
- `npm run catalog:ingest -- --target 40 --per-genre 2 --out .local/catalog-smoke.jsonl`
- Live API smoke test for `POST /auth/signup` followed by authenticated `POST /profiles`

Recommended Day 6 implementation target:

- Add `GET /profiles/me` and profile update support for the authenticated reader.
- Add authenticated frontend session hydration from `GET /auth/me` instead of only local token storage.
- Start the reading identity depth flow for preferences, liked/disliked/completed books, and DNF capture.
- Add role policy before exposing admin mutations.
- Review `.local/catalog-smoke.jsonl` for source quality and decide whether to add raw response caching before the 1,000-book draft run.

### Day 6: 2026-05-05

Goal: start the reading identity phase with authenticated profile hydration, profile updates, and behavior signal capture.

Completed:

- Added `GET /profiles/me` for the authenticated reader.
- Added `PATCH /profiles/me` with validated profile preference updates.
- Added a profile update DTO that prevents clients from changing profile ownership through the update path.
- Added frontend API helpers and React Query hooks for:
  - current user hydration through `GET /auth/me`
  - current profile retrieval through `GET /profiles/me`
  - current profile updates through `PATCH /profiles/me`
  - reading event capture
  - DNF record capture
- Added a session status panel to the app shell using hydrated auth state.
- Expanded `/onboarding` into a richer reading identity flow:
  - profile creation for a new signup
  - profile creation for an already authenticated user without a profile
  - profile update for an authenticated user with a profile
  - favorite and disliked genre capture
  - target outcome, format, depth, pacing, difficulty, daily minutes, and reading speed capture
  - liked, disliked, completed, saved, and DNF signal capture against catalog books
- Reviewed `.local/catalog-smoke.jsonl`:
  - 40 drafts exported
  - 40 records have ISBNs
  - 29 records have Google Books volume IDs
  - 18 records have thumbnails
  - all 40 records remain `needs-review`
  - zero records are recommendation eligible, which matches the admin-review-first catalog plan
- Manually promoted a curated subset of smoke candidates into `apps/api/src/seed/seed.ts`.
- Expanded the repeatable local seed catalog to 25 authors and 27 books total.
- Seeded local Docker MongoDB with the expanded catalog.
- Verified `GET /books` returns 27 records and `GET /authors` returns 25 records from the local API.
- Replaced the browser tab favicon with the provided BookCompass icon PNG.
- Updated the browser tab title from `web` to `BookCompass`.

Validation:

- `npm run build --workspace @bookcompass/api`
- `npm run build --workspace @bookcompass/web`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run check`
- `npm run test:e2e --workspace @bookcompass/api`
- `MONGODB_URI=mongodb://localhost:27017/bookcompass npm run seed --workspace @bookcompass/api`
- Live API smoke test for `GET /books?limit=3`
- Live API smoke test for `GET /authors?limit=3`
- `npm run build --workspace @bookcompass/web`

Recommended Day 7 implementation target:

- Add an admin role guard/policy before any admin mutations.
- Add reader-owned list endpoints for reading events and DNF records so the profile page can show captured behavior history.
- Improve onboarding state boundaries by separating signup, profile preferences, and behavior capture into smaller route components.
- Add focused backend tests for `GET /profiles/me` and `PATCH /profiles/me`.
- Add raw source response caching before running the full 1,000-book catalog draft ingestion.

## Month-One Timeline

### Phase 1: Foundation

Target: Days 1-5

Objectives:

- Repository and documentation foundation.
- Local dev environment.
- Auth decision.
- Mongo schemas and backend modules.
- Basic frontend app shell.
- Seed data strategy.

Status:

- Day 1 setup complete.
- Day 2 backend domain modeling complete.
- Day 3 app shell, auth ownership decision, seed script, and catalog filters complete.
- Day 4 API integration and onboarding data flow complete.
- Day 5 auth ownership scaffold and catalog smoke ingestion complete.

### Phase 2: Reading Identity

Target: Days 6-10

Objectives:

- Signup/login.
- Reading onboarding.
- Preferences:
  - genres
  - authors
  - languages
  - fiction vs nonfiction
  - book length
  - pacing tolerance
  - writing style
  - available reading time
  - reading speed estimate
- User library signals:
  - liked
  - disliked
  - completed
  - abandoned

Output:

- User can create a reading identity that recommendation logic can consume.

### Phase 3: Book Catalog and Behavior Events

Target: Days 11-15

Objectives:

- Book CRUD.
- Author CRUD.
- Outcome tagging.
- Style, pacing, difficulty, emotional tone metadata.
- Reading events:
  - started
  - liked
  - disliked
  - completed
  - abandoned
  - saved/bookmarked
- DNF records:
  - stopped percentage
  - reason
  - style/pacing/difficulty snapshot

Output:

- System has enough structured data to make deterministic recommendations.

### Phase 4: Decision Engine MVP

Target: Days 16-22

Objectives:

- Candidate generation.
- Weighted scoring.
- Outcome-fit score.
- Personal-fit score.
- Mood/energy/time-fit score.
- Anti-DNF risk penalty.
- Explanation generator.
- Recommendation session persistence.
- Feedback capture.

Output:

- User can ask "what should I read next?" and receive ranked, explainable recommendations.

### Phase 5: Admin Dashboard and Analytics

Target: Days 23-27

Objectives:

- Admin book management.
- Admin author management.
- Recommendation tuning weights.
- Drop-off analytics.
- Popular recommendation paths.
- Recommendation conversion metrics.

Output:

- Product owner can tune and inspect the decision engine.

### Phase 6: Deployment and Demo Readiness

Target: Days 28-30

Objectives:

- Production env setup.
- Deployment docs.
- Seed/demo data.
- Recruiter-facing README.
- Demo script.
- Interview talking points.
- CI/CD if time allows.

Output:

- Credible full-stack SaaS demo with explainable architecture and operational story.

## Immediate Next Steps

1. Add authenticated profile read/update endpoints and frontend session hydration.
2. Expand onboarding into the Phase 2 reading identity flow.
3. Add liked/disliked/completed/DNF capture against authenticated ownership.
4. Add role policy before admin mutations are exposed.
5. Review `.local/catalog-smoke.jsonl` and decide raw source caching before the 1,000-book draft run.

## Engineering Rules for Future Instances

- Read this file first.
- Check `git status --short --branch` before editing.
- Do not overwrite user changes or unrelated dirty files.
- Use `rg`/`rg --files` for search.
- Use `apply_patch` for manual edits.
- Keep secrets out of Git.
- Update docs as part of the same change.
- Run focused validation after changes.
- Commit and push when the user asks, or when the work clearly needs to be shared across chat instances.
- Keep the product SaaS-grade: schemas, validation, explanations, and admin operations matter.

## Key Product Concepts to Preserve

- Reading identity: stable user preference and behavior profile.
- Decision session: one recommendation request with current outcome, mood, energy, focus, and time.
- Anti-DNF engine: reduce books likely to be abandoned.
- Explainability: every recommendation must include concrete reasons based on scoring signals.
- Admin tuning: recommendation weights and metadata must be operationally adjustable.
- Future AI/ML: planned, but not a substitute for MVP scoring clarity.
