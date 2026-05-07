# BookCompass Project Context and Timeline

This is the canonical handoff file for BookCompass.

Every development session working on this project must read this file before making changes. The user may point new development sessions to this file so they can quickly understand the product, current status, timeline, and update rules.

Future implementation sessions must also read and follow the MVP HLD and LLD before changing product behavior, backend contracts, frontend route boundaries, catalog policy, recommendation logic, or admin access:

- `docs/architecture/mvp-high-level-design.md`
- `docs/architecture/mvp-low-level-design.md`

If a future change needs to diverge from those designs, update the relevant HLD/LLD section in the same change and document the reason in the release note.

## Mandatory Update Rule

This file must be updated every time any development session modifies the project.

Required update behavior:

1. Add a dated entry under `Daily Execution Log`.
2. Update `Current Project State` if the status changed.
3. Update `Immediate Next Steps` if priorities changed.
4. Update affected component docs under `docs/components/`.
5. Update or add a release note under `docs/releases/` for meaningful work.
6. Do not remove prior day notes unless they are factually wrong; append corrections instead.
7. Never commit secrets, connection strings, passwords, tokens, or `.env.local`.
8. Use multiple semantic commits for multi-part work instead of one large day-level commit. This applies even when all tasks happen inside a single development session. Group commits by coherent task or feature, such as design docs, access policy, frontend flow, catalog enrichment, tests, or runbook updates.
9. Record the branch used for the day's work when a new daily branch is created.

If a future development session changes code but does not update this file, treat that as incomplete work.

## Branch, Quality, Test, And Push Rules

Every development session starts from a new branch for that day before implementation work begins.

Branch naming convention:

```text
day<N>-YYYY-MM-DD-<short-scope>
```

Examples:

- `day9-2026-05-08-recommendation-scoring`
- `day10-2026-05-09-profile-history`

Do not continue feature work directly on a prior day's branch unless the user explicitly asks to finish that branch.

No sloppy code. Every meaningful code change must include unit tests that cover:

- expected successful behavior
- edge cases and boundary values
- validation failures
- ownership, authorization, and security boundaries
- regressions in previously developed behavior when that behavior is touched

Previously developed code is not exempt. When an old module is modified or relied on by new behavior, add or update tests for the old behavior before building on it.

Before marking work complete or pushing to GitHub:

1. Run relevant focused unit tests while developing.
2. Run affected test suites intensively before final validation, including repeated targeted runs when the change touches core logic, auth, recommendation scoring, catalog mutations, persistence, or frontend route behavior.
3. Run the full project validation gate:

```bash
npm run check
npm run test --workspace @bookcompass/api -- --runInBand
npm run test:e2e --workspace @bookcompass/api
```

4. Add live smoke checks when the change affects API contracts, database behavior, seed data, ingestion, auth/session flow, or frontend integration.
5. Fix every failing test, lint issue, type error, and known regression before pushing.

Push to GitHub only after all required validation succeeds and the working tree contains no unintended changes.

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

As of 2026-05-07:

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
- API seed script now includes Day 7 Google Books enrichment for 20 of the 27 seeded books, with 14 thumbnail-backed records.
- Frontend app shell routes exist for onboarding, library, recommendation start/history, and admin.
- Frontend has an API client and React Query hooks for books, authors, and reader identity creation.
- Frontend browser tab uses the BookCompass PNG icon at `apps/web/public/bookcompass-icon.png` and the page title is `BookCompass`.
- `/library` and `/admin/books` read live catalog data from the API.
- `/login` can create a temporary authenticated frontend session.
- `/onboarding` signs up a reader, stores the local JWT, and creates a linked reading profile from authenticated ownership.
- API CORS allows both `http://localhost:5173` and `http://127.0.0.1:5173` by default; override with comma-separated `WEB_ORIGINS`.
- Frontend API calls use a dedicated Axios instance in `apps/web/src/lib/axiosInstance.ts`.
- Backend exposes authenticated reader profile retrieval and update through `GET /profiles/me` and `PATCH /profiles/me`.
- Backend now has reusable `@Roles(...)` metadata and `RolesGuard` for admin-only endpoints.
- Catalog mutations and global user/profile/reading-event/DNF/recommendation-session list endpoints now require an admin JWT.
- Public `POST /users` forces `role: reader`; clients cannot self-create admins through that legacy endpoint.
- API has a controlled first-admin bootstrap script: `ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run bootstrap:admin --workspace @bookcompass/api`.
- Backend exposes reader-owned behavior history through `GET /reading-events/me` and `GET /dnf-records/me`.
- Backend exposes reader-owned recommendation history through `GET /recommendation-sessions/me`.
- `POST /recommendation-sessions` now builds recommendation input, scores catalog candidates deterministically, persists the top ranked candidates, and marks sessions `scored`.
- Recommendation candidates now support authenticated reader feedback for accepted, rejected, started, completed, and abandoned suggestions, and that feedback writes reusable reading events.
- Backend has focused tests covering reader-owned event/DNF history, `RolesGuard`, admin-only global list metadata, and admin-only catalog mutation metadata.
- Project workflow now requires a new daily branch for every development session, explicit unit tests with edge-case coverage, intensive validation before completion, and GitHub pushes only after all checks pass.
- Frontend session state hydrates from `GET /auth/me` when a local bearer token exists.
- `/onboarding` can now update an existing authenticated profile and capture first reading behavior signals for liked, disliked, completed, saved, and DNF patterns.
- Frontend reading identity is split across `/onboarding/signup`, `/onboarding/preferences`, and `/onboarding/signals`.
- `/onboarding/signals` now displays reader-owned reading event and DNF history.
- `/recommendations/new` now creates scored recommendation sessions from current decision context.
- `/recommendations/history` now displays authenticated reader recommendation sessions and explanation lines.
- `/recommendations/history` and newly scored session cards can capture recommendation feedback on the top candidates.
- `/admin/books` now has guarded author and book create forms backed by admin-only `POST /authors` and `POST /books`.
- Catalog enrichment plan is documented in `docs/architecture/catalog-enrichment.md`.
- MVP HLD and LLD are documented in `docs/architecture/mvp-high-level-design.md` and `docs/architecture/mvp-low-level-design.md`.
- Catalog ingestion scaffold exists in `tools/catalog-ingestion` for a 1,000-book mixed-genre draft catalog using Open Library discovery plus Google Books enrichment.
- Catalog ingestion now loads `.env.local`, caches successful raw source responses under `.local/catalog-cache` by normalized URL hash, and redacts API keys from failed request messages.
- A full Day 7 catalog draft ingestion wrote `.local/catalog-drafts.jsonl` with 1,000 review-gated drafts: 993 ISBNs, 843 Google Books volume IDs, 635 descriptions, 550 thumbnails, and zero recommendation-eligible records by design.
- Catalog smoke ingestion was run for 40 mixed-genre drafts and wrote `.local/catalog-smoke.jsonl` for local inspection.
- Google Books enrichment should use `GOOGLE_BOOKS_API_KEY` for real runs; unkeyed requests returned `429` during local smoke validation, while Open Library drafts still exported successfully.
- Day 6 catalog smoke review found 40 drafts, 40 ISBNs, 29 Google Books volume IDs, 18 thumbnails, all marked `needs-review`, and zero recommendation-eligible records by design.
- Local Docker MongoDB was seeded with the Day 7 enriched catalog batch and verified through `GET /books` and `GET /authors`.
- Frontend visual direction is antique retro/parchment-inspired with modern SaaS usability.
- Production identity provider integration is not implemented yet.
- Recommendation engine is documented; session storage, input aggregation, first-pass scoring/ranking, score breakdowns, signals, and explanation lines exist.
- Recommendation service can now build scoring input from profile, reading events, DNF records, and catalog candidates for a decision context.
- Admin dashboard is documented; first-pass author/book create screens exist inside `/admin/books`.
- Admin edit/delete screens and tuning controls are not implemented yet.
- CI/CD is not configured yet.

Important historical context:

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

Goal: establish continuity for multi-session development and implement backend domain foundation.

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
- Live Docker MongoDB API smoke for signup, profile creation, `POST /recommendation-sessions`, `POST /recommendation-sessions/:sessionId/feedback`, and `GET /reading-events/me`
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

### Day 7: 2026-05-06

Goal: document the MVP design, tighten access policy, expose reader-owned behavior history, split onboarding boundaries, and prepare catalog ingestion for larger cached runs.

Completed:

- Added MVP high-level and low-level design docs.
- Confirmed the current monorepo/NestJS/MongoDB deterministic-engine architecture remains the right MVP design.
- Added reusable `@Roles(...)` metadata and `RolesGuard`.
- Protected author/book creation and global user/profile/reading-event/DNF/recommendation-session list endpoints behind admin JWT checks.
- Forced public `POST /users` to create reader users only.
- Added `GET /reading-events/me` for the authenticated reader timeline.
- Added `GET /dnf-records/me` for authenticated reader DNF history.
- Added frontend API helpers and React Query hooks for current-reader behavior history.
- Split reading identity UI into:
  - `/onboarding/signup`
  - `/onboarding/preferences`
  - `/onboarding/signals`
- Added behavior history display on `/onboarding/signals`.
- Added raw Open Library/Google Books response caching to the catalog ingestion script.
- Added `.env.local` loading and API-key redaction to the catalog ingestion script.
- Added book metadata fields for `subtitle`, `publishedYear`, `language`, `googleBooksVolumeId`, and `thumbnailUrl`.
- Enriched 20 of the current 27 seeded catalog books with Google Books metadata and 14 with thumbnails.
- Ran the full 1,000-book cached draft ingestion to `.local/catalog-drafts.jsonl`.
- Added focused profile controller tests for `GET /profiles/me` and `PATCH /profiles/me`.
- Updated backend, frontend, admin, catalog ingestion, and release documentation.

Validation:

- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run build --workspace @bookcompass/api`
- `npm run check`
- `npm run build --workspace @bookcompass/web`
- `npm run check`
- `npm run test:e2e --workspace @bookcompass/api`
- `npm run catalog:ingest -- --target 1000 --delay 100 --out .local/catalog-drafts.jsonl`
- `MONGODB_URI=mongodb://localhost:27017/bookcompass npm run seed --workspace @bookcompass/api`
- Live Docker MongoDB API smoke checks for `/health`, `/books?limit=30`, and `/authors?limit=30`

Note:

- The Day 7 catalog draft run produced 1,000 review-gated records: 993 ISBNs, 843 Google Books volume IDs, 635 descriptions, 550 thumbnails, and zero recommendation-eligible records by design.
- Docker MongoDB validation returned 27 seeded books, 25 authors, 20 enriched books, and 14 thumbnail-backed books from the live API.

Recommended Day 8 implementation target:

- Add backend tests for reader-owned event and DNF `/me` list endpoints plus role-guarded global lists and catalog mutations.
- Add a guarded admin bootstrap path or script for creating the first admin user.
- Add admin CRUD screens only after the first-admin bootstrap path exists.
- Continue Phase 2 reading identity UX polish and add a dedicated profile/history page if the onboarding route becomes too dense.
- Prepare the recommendation engine input aggregator from profile, reading events, DNF records, and catalog candidates.

### Day 8: 2026-05-07

Goal: tighten backend access-policy coverage, add first-admin bootstrap, and prepare recommendation input aggregation.

Branch: `day8-2026-05-07-admin-tests-recommendation-input`

Completed:

- Added a controlled first-admin bootstrap script at `apps/api/src/admin/bootstrap-admin.ts`.
- Added `npm run bootstrap:admin --workspace @bookcompass/api`, backed by `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optional `ADMIN_DISPLAY_NAME`.
- Added `UsersService.upsertAdminByEmail` so the bootstrap script can create or rotate the first admin account without exposing public admin signup.
- Added backend tests for `GET /reading-events/me` and `GET /dnf-records/me` reader-owned service calls.
- Added backend tests for `RolesGuard` admin allow/reader deny behavior.
- Added backend tests that assert admin-only role metadata on global reading event/DNF lists and author/book catalog creation endpoints.
- Added `RecommendationsService.buildInput` to gather profile, reading events, DNF records, and catalog candidates for a recommendation decision context.
- Updated backend, admin dashboard, recommendation engine, MVP LLD, environment example, and release documentation.
- Updated the project operating rules to require a new daily branch for every development session, unit tests for new and touched existing behavior, edge-case coverage, intensive pre-completion validation, and GitHub pushes only after all required checks pass.
- Confirmed project-facing documentation should not mention internal tooling names.

Validation:

- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run build --workspace @bookcompass/api`
- `npm run check`

Recommended Day 9 implementation target:

- Use the Day 8 recommendation input boundary to implement first-pass deterministic candidate scoring and explanation lines.
- Add a reader-owned recommendation history endpoint before expanding the frontend history page.
- Add a dedicated profile/history page if onboarding continues to carry too much post-signup behavior UI.
- Start admin CRUD screens now that first-admin bootstrap exists, beginning with guarded author/book create flows.

### Day 9: 2026-05-07

Goal: implement first-pass recommendation scoring, reader recommendation history, and initial guarded admin catalog create flows.

Branch: `day9-2026-05-07-recommendation-scoring`

Completed:

- Added deterministic recommendation scoring to `RecommendationsService.create`.
- Scoring now uses outcome fit, profile fit, current context, time fit, behavior history, and anti-DNF risk.
- Persisted ranked recommendation candidates with final score, score breakdown, scoring signals, and explanation lines.
- Added reader-owned `GET /recommendation-sessions/me`.
- Added focused recommendation service tests for ranked scoring, explanation output, direct DNF penalty behavior, and reader-owned history.
- Added recommendation controller tests for `/me` reader ownership and admin-only global list metadata.
- Wired `/recommendations/new` to create scored sessions from live decision context.
- Wired `/recommendations/history` to display the authenticated reader's scored sessions and explanation lines.
- Added first-pass guarded author/book create forms to `/admin/books`.
- Updated backend, frontend, admin dashboard, recommendation engine, and MVP LLD documentation.

Validation:

- `npm run test --workspace @bookcompass/api -- recommendations --runInBand`
- `npm run check`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`
- `MONGODB_URI=mongodb://localhost:27017/bookcompass npm run seed --workspace @bookcompass/api`
- Live Docker MongoDB API smoke for signup, profile creation, `POST /recommendation-sessions`, and `GET /recommendation-sessions/me`

Recommended Day 10 implementation target:

- Add recommendation feedback capture for accepted/rejected/started/completed/abandoned suggestions.
- Expand admin catalog operations with edit/delete and a dedicated author management route.
- Add a dedicated reader profile/history route if onboarding remains too dense.

### Day 10: 2026-05-07

Goal: add the first recommendation feedback loop.

Branch: `day10-2026-05-07-recommendation-feedback`

Completed:

- Added shared recommendation feedback statuses for accepted, rejected, started, completed, and abandoned suggestions.
- Added candidate-level recommendation feedback storage with status, progress, note, and recorded timestamp.
- Added authenticated reader-owned `POST /recommendation-sessions/:sessionId/feedback`.
- Feedback updates are scoped by current reader, session id, and candidate book id.
- Feedback writes reusable reading events so accepted maps to saved, rejected maps to disliked, and started/completed/abandoned map to matching behavior events.
- Added focused recommendation service tests for feedback persistence, behavior-event creation, and ownership-boundary rejection.
- Added controller coverage for authenticated feedback routing.
- Wired frontend recommendation cards with feedback controls for the top scored candidates.
- Updated backend, frontend, recommendation engine, and MVP LLD documentation.

Validation:

- `npm run test --workspace @bookcompass/api -- recommendations --runInBand`
- `npm run check`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`

Recommended Day 11 implementation target:

- Expand admin catalog operations with edit/delete and a dedicated author management route.
- Add a dedicated reader profile/history page that consolidates profile preferences, behavior signals, DNF records, and recommendation feedback.
- Add richer catalog metadata review fields for anti-DNF tuning.

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

1. Expand admin catalog operations with edit/delete and a dedicated author management route.
2. Add a dedicated profile/history page that consolidates profile preferences, behavior signals, DNF records, and recommendation feedback.
3. Add richer catalog metadata review fields for anti-DNF tuning.
4. Keep larger catalog draft ingestion behind `GOOGLE_BOOKS_API_KEY` and cached source responses.
5. Add frontend polish around feedback notes/progress when recommendation outcomes need more detail than one-click status.

## Engineering Rules For Future Development Sessions

- Read this file first.
- Check `git status --short --branch` before editing.
- Create or switch to that day's new branch before implementation work begins, using `day<N>-YYYY-MM-DD-<short-scope>` unless the user gives a different name.
- Do not overwrite user changes or unrelated dirty files.
- Use `rg`/`rg --files` for search.
- Use `apply_patch` for manual edits.
- Keep secrets out of Git.
- Update docs as part of the same change.
- Add or update unit tests for every meaningful change, including edge cases and touched existing behavior.
- Run focused validation during development, then run the full validation gate before completion.
- Push to GitHub only after all required tests, builds, lint checks, and relevant smoke checks succeed.
- For future multi-part work, make semantic commits as each coherent task is completed and validated, even within a single development session. Avoid bundling an entire day of unrelated backend, frontend, tooling, and documentation changes into one commit.
- Keep the product SaaS-grade: schemas, validation, explanations, and admin operations matter.

## Key Product Concepts to Preserve

- Reading identity: stable user preference and behavior profile.
- Decision session: one recommendation request with current outcome, mood, energy, focus, and time.
- Anti-DNF engine: reduce books likely to be abandoned.
- Explainability: every recommendation must include concrete reasons based on scoring signals.
- Admin tuning: recommendation weights and metadata must be operationally adjustable.
- Future AI/ML: planned, but not a substitute for MVP scoring clarity.
