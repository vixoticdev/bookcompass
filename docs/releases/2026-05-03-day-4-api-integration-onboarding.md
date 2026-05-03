# 2026-05-03: Day 4 API Integration and Onboarding

## Scope

Started the first end-to-end product slice by connecting frontend routes to live backend data and adding a working reader identity form.

## Apps and Packages Changed

- `apps/api`
- `apps/web`
- `docs`

## Added

- Paginated catalog list response contract:
  - `items`
  - `total`
  - `limit`
  - `offset`
- `limit` and `offset` query validation for author and book list endpoints.
- Shared catalog query helpers for pagination and safe text-search regex escaping.
- Focused API unit tests for author/book filter construction and pagination normalization.
- Frontend API client with typed catalog, user, and profile calls.
- React Query hooks for authors, books, and reader identity creation.
- `/library` route now reads books and authors from the API.
- `/admin/books` route now filters API-backed catalog records by title and outcome.
- `/onboarding` route now creates a user and then creates the linked reading profile.
- Local CORS now accepts both `http://localhost:5173` and `http://127.0.0.1:5173`.

## Technical Notes

- Catalog list endpoints now return page objects instead of raw arrays.
- The onboarding flow still uses the explicit Day 3 `userId` ownership contract because auth is not implemented yet.
- The frontend defaults to `http://localhost:3000` and can be pointed elsewhere with `VITE_API_URL`.

## Validation

- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run build --workspace @bookcompass/api`
- `npm run build --workspace @bookcompass/web`
- `npm run check`
- `npm run test:e2e --workspace @bookcompass/api`
- Live API smoke test for `GET /books?outcome=productivity&limit=2`
- Live API smoke test for `GET /authors?limit=2`
- Live API smoke test for `POST /users` followed by `POST /profiles`
- Live CORS header smoke test from `Origin: http://127.0.0.1:5173`

## Known Gaps

- Auth guards and signup/login are still pending.
- Catalog UI is read-only.
- Onboarding has basic controls, not the final multi-step reader identity experience.
- Frontend route tests are not implemented yet.
