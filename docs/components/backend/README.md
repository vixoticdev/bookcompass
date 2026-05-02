# Backend Component Documentation

## Stack

- NestJS
- TypeScript
- MongoDB through Mongoose
- Redis planned for caching and queues
- JWT or Firebase Auth integration

## Current Baseline

- Config module is global.
- CORS is enabled for local web development.
- Validation pipe is enabled globally.
- Mongoose is wired through `MONGODB_URI`, with local MongoDB fallback.
- Health endpoint exists at `/health`.
- Domain modules now exist for users, reading profiles, authors, books, reading events, DNF records, and recommendation sessions.

## Module Status

```text
src/
  auth/                 planned
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

These endpoints are intentionally thin Day 2 write/read paths. They establish validated storage contracts before auth, ownership checks, filtering, pagination, admin policy, and full CRUD are added.

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

## Documentation Rule

When adding or changing backend behavior, update this doc with:

- module created or changed
- endpoint list
- schema changes
- validation rules
- background jobs or cache behavior
