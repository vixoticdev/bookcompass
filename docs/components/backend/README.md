# Backend Component Documentation

## Stack

- NestJS
- TypeScript
- MongoDB through Mongoose
- Redis planned for caching and queues
- JWT-backed auth with local password signup/login for MVP

## Current Baseline

- Config module is global.
- CORS is enabled for local web development. By default the API allows `http://localhost:5173` and `http://127.0.0.1:5173`; set comma-separated `WEB_ORIGINS` to override.
- Validation pipe is enabled globally.
- Mongoose is wired through `MONGODB_URI`, with local MongoDB fallback.
- Health endpoint exists at `/health`.
- Domain modules now exist for auth, users, reading profiles, authors, books, reading events, DNF records, and recommendation sessions.
- Day 5 auth ownership is documented in `docs/architecture/auth-ownership.md`: self-service user-owned writes derive `userId` from verified JWT claims.
- Day 6 adds authenticated reader profile retrieval and update through `GET /profiles/me` and `PATCH /profiles/me`.
- Day 7 adds reusable role metadata/guarding and protects catalog mutations plus global user/profile/event/DNF/recommendation-session list endpoints behind admin role checks.
- Day 7 adds reader-owned behavior history reads through `GET /reading-events/me` and `GET /dnf-records/me`.
- Day 7 enriches the repeatable seed catalog with Google Books metadata and adds book fields for subtitles, publication year, language, Google Books volume ID, and thumbnail URL.
- Day 8 adds a controlled first-admin bootstrap script and focused backend tests for reader-owned history endpoints, admin role guarding, and admin-only catalog mutations.
- Day 8 prepares recommendation input aggregation inside `RecommendationsService` by loading profile, reading events, DNF records, and catalog candidates for a decision context.
- Day 9 adds first-pass deterministic recommendation scoring and reader-owned recommendation history through `GET /recommendation-sessions/me`.
- Day 10 adds authenticated candidate feedback capture through `POST /recommendation-sessions/:sessionId/feedback` and maps feedback into reading events for future scoring.
- Day 11 expands catalog CRUD with detail reads plus admin-only update and delete paths for authors and books.
- Day 13 adds `npm run smoke:day13` for live API coverage behind `/admin/authors`, catalog review queue states, recommendation feedback note/progress capture, and `/profile/history` hydration.
- Day 14 adds admin-only analytics through `GET /recommendation-sessions/admin/analytics`, combining catalog review counts with recorded recommendation candidate feedback outcomes.
- Initial catalog seed script exists at `npm run seed --workspace @bookcompass/api`.
- First admin bootstrap script exists at `npm run bootstrap:admin --workspace @bookcompass/api` and reads `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optional `ADMIN_DISPLAY_NAME`.
- The Day 6 manual catalog batch expands the repeatable seed to 25 authors and 27 books for local exploration.
- Catalog enrichment plan is documented in `docs/architecture/catalog-enrichment.md`.

## Module Status

```text
src/
  auth/                 implemented: local signup/login, JWT issuance, JWT guard, role guard
  users/                implemented: schema, DTO, service, reader create, admin list
  profiles/             implemented: schema, DTO, authenticated current-reader read/update, admin list
  books/                implemented: schema, DTO, service, catalog REST with admin mutations
  authors/              implemented: schema, DTO, service, catalog REST with admin mutations
  reading-events/       implemented: schema, DTO, service, reader create/history, admin list
  dnf/                  implemented: schema, DTO, service, reader create/history, admin list
  recommendations/      implemented: session schema, DTO, input aggregation, deterministic scoring, reader history, feedback capture, admin analytics, minimal REST
  admin/                implemented: first-admin bootstrap script; screens planned
  analytics/            planned
  billing/              planned
```

## Current Endpoints

- `POST /auth/signup`, `POST /auth/login`, `GET /auth/me`
- `POST /users`, admin-only `GET /users`
- `POST /profiles`, `GET /profiles/me`, `PATCH /profiles/me`, admin-only `GET /profiles`
- admin-only `POST /authors`, `PATCH /authors/:authorId`, `DELETE /authors/:authorId`, public `GET /authors`, public `GET /authors/:authorId`
- admin-only `POST /books`, `PATCH /books/:bookId`, `DELETE /books/:bookId`, public `GET /books`, public `GET /books/:bookId`
- `POST /reading-events`, `GET /reading-events/me`, admin-only `GET /reading-events`
- `POST /dnf-records`, `GET /dnf-records/me`, admin-only `GET /dnf-records`
- `POST /recommendation-sessions`, `GET /recommendation-sessions/me`, `POST /recommendation-sessions/:sessionId/feedback`, admin-only `GET /recommendation-sessions`, admin-only `GET /recommendation-sessions/admin/analytics`

These endpoints are intentionally thin foundation write/read paths. Self-service write endpoints for profiles, reading events, DNF records, and recommendation sessions require a bearer token and derive ownership from the authenticated request. Catalog reads remain open for local MVP exploration; catalog mutations and global reader data lists now require an admin role.

Profile ownership:

- `POST /profiles` derives `userId` from the bearer token.
- `GET /profiles/me` returns only the authenticated reader profile.
- `PATCH /profiles/me` updates only the authenticated reader profile and does not accept `userId`.
- Missing current profiles return `404` so the frontend can create the first profile for an authenticated user.
- `GET /reading-events/me` and `GET /dnf-records/me` return only the authenticated reader's behavior history.
- `GET /recommendation-sessions/me` returns only the authenticated reader's scored recommendation sessions.
- `POST /recommendation-sessions/:sessionId/feedback` updates only candidates inside the authenticated reader's own session and writes a reusable reading event from the feedback status.
- Recommendation feedback accepts optional `progressPercent` and `note`; those values are persisted on the candidate feedback and copied into the derived reading event.
- Public `POST /users` forces `role: reader`; admin creation must not be exposed through self-service signup.

Catalog filters added on Day 3 and paginated on Day 4:

- `GET /authors?q=&genre=&outcome=&limit=&offset=`
- `GET /books?q=&authorId=&genre=&outcome=&pacing=&difficulty=&depth=&format=&maxEstimatedMinutes=&limit=&offset=`

Catalog list response shape:

```json
{
  "items": [],
  "total": 0,
  "limit": 25,
  "offset": 0
}
```

## Schema Notes

- `User`: display name, unique indexed email, optional auth provider id, hidden password hash, role.
- `ReadingProfile`: one profile per user with genres, target outcomes, depth, pacing/difficulty tolerance, formats, daily minutes, and estimated speed.
- `Author`: unique indexed name, bio, known genres, and outcome strengths.
- `Book`: title, author reference, ISBN, subtitle, description, publication year, language, genres, outcome tags, pacing, difficulty, depth, formats, page count, estimated minutes, Google Books volume ID, and thumbnail URL.
- `ReadingEvent`: user/book timeline events such as started, liked, completed, abandoned, and saved.
- `DnfRecord`: structured abandonment record with stopped percentage, reason, pacing/difficulty snapshot, and note.
- `RecommendationSession`: user context for selected outcome, mood, energy, focus, available time, depth, candidates, score breakdowns, signals, explanations, and optional candidate feedback.

## Validation Rules

- All write DTOs use `class-validator`.
- Auth DTOs validate email and password length before hashing or credential checks.
- Current profile updates use a dedicated DTO without ownership fields.
- Mongo references use `IsMongoId`.
- Shared domain constants from `@bookcompass/shared` validate outcomes, reading depth, event type, DNF reason, mood, energy, focus, book format, pacing, and difficulty.
- Numeric fields have explicit bounds for minutes, percentages, page counts, and reading speed.
- List query DTOs validate catalog filter values before they reach service queries.
- Catalog update DTOs keep all fields optional but preserve the same validation bounds as create DTOs.
- Catalog pagination is validated and normalized to a maximum page size of 100.
- Catalog text search escapes regex metacharacters before querying MongoDB.

## Indexes

- `User.email` is unique and indexed.
- `ReadingProfile.userId` is unique and indexed.
- `Author.name` is unique and indexed.
- `Book.title + authorId` is unique; title, author, genres, and outcome tags are indexed.
- `ReadingEvent.userId + occurredAt` supports user timelines.
- `DnfRecord.userId + bookId` is unique and supports anti-DNF lookups.
- `RecommendationSession.userId + createdAt` supports recent session retrieval.
- `Book.enrichmentStatus`, `Book.recommendationEligible`, `Book.styleTags`, and `Book.riskTags` support catalog review, recommendation eligibility, and anti-DNF tuning.

## API Contract Style

- REST first for MVP.
- DTO validation on all write endpoints.
- Service methods should keep business logic outside controllers.
- Recommendation explanations should be generated from scoring signals, not free-form guesses.

## Auth Notes

- Local passwords are hashed with `bcryptjs`.
- JWTs are signed with `JWT_SECRET` or a local development fallback.
- `GET /auth/me` returns the current public user from a valid bearer token.
- `@Roles('admin')` plus `RolesGuard` protects catalog mutations and global reader-data list endpoints.
- Frontend self-service clients should not send `userId` for profile, event, DNF, or recommendation session creation.
- Admin ownership override and production identity provider integration are still planned.
- First-admin bootstrap uses local environment variables and upserts an admin user directly through the API application context; it is not exposed as a public HTTP endpoint.

## Seed Data

The seed script upserts the current repeatable local exploration catalog. Day 7 enriched 20 of the 27 seeded books with Google Books volume IDs/publication metadata and 14 with thumbnails.

Original MVP nonfiction seeds:

- James Clear / `Atomic Habits`
- Cal Newport / `Deep Work`
- Eric Ries / `The Lean Startup`
- Daniel Kahneman / `Thinking, Fast and Slow`
- Brene Brown / `Dare to Lead`

Day 6 manual catalog expansion adds 22 more books across self-help, psychology, business, philosophy, biography, literary fiction, fantasy, science fiction, mystery, classics, mental health, and creativity. Local validation after seeding returned 25 authors and 27 books.

## Catalog Enrichment Direction

The catalog should grow in layers:

- bibliographic baseline: title, author, description, page count, formats, ISBN, publication year, language
- recommendation metadata: outcome tags, pacing, difficulty, depth, estimated minutes, style tags
- anti-DNF signals: slow-start risk, density risk, abstraction level, observed abandonment reasons
- external connectors: Google Books/Open Library imports with admin review before recommendation eligibility

Day 12 catalog review fields:

- Books now store `enrichmentStatus` as `seeded`, `imported`, `reviewed`, or `needs-review`.
- Books now store `recommendationEligible`, `styleTags`, and `riskTags`.
- `GET /books` can filter by `enrichmentStatus`, `recommendationEligible`, `styleTag`, and `riskTag`.
- Recommendation input generation requests only `recommendationEligible: true` candidates.

Day 13 live smoke:

- `npm run smoke:day13` expects `ADMIN_EMAIL` and `ADMIN_PASSWORD` for an existing admin.
- The script creates a temporary reader, author, and imported draft book; verifies author listing, imported draft filtering, eligibility approval filtering, feedback note/progress persistence, profile-history backing reads, and then deletes the temporary catalog records.

Day 14 admin analytics:

- `BooksService.getReviewAnalytics` summarizes total catalog records, recommendation eligibility, and enrichment-status queue counts.
- `RecommendationsService.getAdminAnalytics` aggregates recorded candidate feedback statuses across recommendation sessions.
- The analytics endpoint is admin guarded and intended as a lightweight operational snapshot, not a public reader contract.

## Documentation Rule

When adding or changing backend behavior, update this doc with:

- module created or changed
- endpoint list
- schema changes
- validation rules
- background jobs or cache behavior
