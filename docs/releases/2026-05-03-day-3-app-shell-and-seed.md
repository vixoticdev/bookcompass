# 2026-05-03: Day 3 App Shell and Seed Data

## Scope

Implemented the Day 3 foundation slice: auth ownership decision, seed data strategy, initial seed script, catalog filters, and frontend app shell routes.

## Apps and Packages Changed

- `apps/api`
- `apps/web`
- `docs`

## Added

- Architecture decision note for MVP auth and user ownership.
- API seed script at `npm run seed --workspace @bookcompass/api`.
- Initial seed authors/books for outcome-aware MVP catalog exploration.
- Author list filters for text search, genre, and outcome.
- Book list filters for text search, author, genre, outcome, pacing, difficulty, depth, format, and maximum estimated minutes.
- Frontend routed app shell for:
  - `/onboarding`
  - `/library`
  - `/recommendations/new`
  - `/recommendations/history`
  - `/admin`
  - `/admin/books`

## Technical Notes

- User-owned DTOs still accept explicit `userId` until Phase 2 auth lands.
- The seed script boots a Nest application context and uses service-level upserts so repeated runs are idempotent by author name and book title/author.
- Frontend routes are placeholders with real product structure, not final forms or API wiring.

## Validation

- `npm run build --workspace @bookcompass/shared`
- `npm run build --workspace @bookcompass/api`
- `npm run build --workspace @bookcompass/web`
- `npm run check`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`
- `MONGODB_URI=mongodb://localhost:27017/bookcompass npm run seed --workspace @bookcompass/api`

Atlas rejected the current IP during seed validation, so local Docker MongoDB was used for the executed seed run.

## Known Gaps

- Auth guards, signup, login, and role enforcement are not implemented yet.
- Frontend routes do not consume API data yet.
- Recommendation scoring remains future work.
- Admin CRUD screens are placeholders only.
