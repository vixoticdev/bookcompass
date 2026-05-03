# Backend Component Documentation

## Stack

- NestJS
- TypeScript
- MongoDB through Mongoose
- Redis planned for caching and queues
- JWT-backed auth planned for Phase 2

## Current Baseline

- Config module is global.
- CORS is enabled for local web development. By default the API allows `http://localhost:5173` and `http://127.0.0.1:5173`; set comma-separated `WEB_ORIGINS` to override.
- Validation pipe is enabled globally.
- Mongoose is wired through `MONGODB_URI`, with local MongoDB fallback.
- Health endpoint exists at `/health`.
- Domain modules now exist for users, reading profiles, authors, books, reading events, DNF records, and recommendation sessions.
- Day 3 auth decision is documented in `docs/architecture/auth-ownership.md`: user-owned DTOs keep explicit `userId` until auth guards derive ownership from verified token claims.
- Initial catalog seed script exists at `npm run seed --workspace @bookcompass/api`.
- Catalog enrichment plan is documented in `docs/architecture/catalog-enrichment.md`.

## Module Status

```text
src/
  auth/                 decided: JWT-backed ownership contract, implementation planned
  users/                implemented: schema, DTO, service, minimal REST
  profiles/             implemented: schema, DTO, service, minimal REST
  books/                implemented: schema, DTO, service, minimal REST
  authors/              implemented: schema, DTO, service, minimal REST
  reading-events/       implemented: schema, DTO, service, minimal REST
  dnf/                  implemented: schema, DTO, service, minimal REST
  recommendations/      implemented: session schema, DTO, service, minimal REST
  admin/                planned
  analytics/            planned
  billing/              planned
```

## Current Endpoints

- `POST /users`, `GET /users`
- `POST /profiles`, `GET /profiles`
- `POST /authors`, `GET /authors`
- `POST /books`, `GET /books`
- `POST /reading-events`, `GET /reading-events`
- `POST /dnf-records`, `GET /dnf-records`
- `POST /recommendation-sessions`, `GET /recommendation-sessions`

These endpoints are intentionally thin foundation write/read paths. They establish validated storage contracts before auth, ownership checks, pagination, admin policy, and full CRUD are added.

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

- `User`: display name, unique indexed email, optional auth provider id, role.
- `ReadingProfile`: one profile per user with genres, target outcomes, depth, pacing/difficulty tolerance, formats, daily minutes, and estimated speed.
- `Author`: unique indexed name, bio, known genres, and outcome strengths.
- `Book`: title, author reference, ISBN, description, genres, outcome tags, pacing, difficulty, depth, formats, page count, and estimated minutes.
- `ReadingEvent`: user/book timeline events such as started, liked, completed, abandoned, and saved.
- `DnfRecord`: structured abandonment record with stopped percentage, reason, pacing/difficulty snapshot, and note.
- `RecommendationSession`: user context for selected outcome, mood, energy, focus, available time, depth, candidates, score breakdowns, signals, and explanations.

## Validation Rules

- All write DTOs use `class-validator`.
- Mongo references use `IsMongoId`.
- Shared domain constants from `@bookcompass/shared` validate outcomes, reading depth, event type, DNF reason, mood, energy, focus, book format, pacing, and difficulty.
- Numeric fields have explicit bounds for minutes, percentages, page counts, and reading speed.
- List query DTOs validate catalog filter values before they reach service queries.
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

## API Contract Style

- REST first for MVP.
- DTO validation on all write endpoints.
- Service methods should keep business logic outside controllers.
- Recommendation explanations should be generated from scoring signals, not free-form guesses.

## Seed Data

The initial seed script upserts a small nonfiction catalog for MVP recommendation exploration:

- James Clear / `Atomic Habits`
- Cal Newport / `Deep Work`
- Eric Ries / `The Lean Startup`
- Daniel Kahneman / `Thinking, Fast and Slow`
- Brene Brown / `Dare to Lead`

## Catalog Enrichment Direction

The catalog should grow in layers:

- bibliographic baseline: title, author, description, page count, formats, ISBN, publication year, language
- recommendation metadata: outcome tags, pacing, difficulty, depth, estimated minutes, style tags
- anti-DNF signals: slow-start risk, density risk, abstraction level, observed abandonment reasons
- external connectors: Google Books/Open Library imports with admin review before recommendation eligibility

## Documentation Rule

When adding or changing backend behavior, update this doc with:

- module created or changed
- endpoint list
- schema changes
- validation rules
- background jobs or cache behavior
