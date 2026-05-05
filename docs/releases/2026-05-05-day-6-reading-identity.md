# Day 6: Reading Identity Hydration

Date: 2026-05-05

## Scope

Started Phase 2 reading identity work by adding authenticated current-profile access, profile updates, frontend session hydration, and first behavior signal capture.

## Apps and Packages Changed

- `apps/api`
- `apps/web`
- `docs`

## User-Visible Changes

- The app shell now shows the active reader when a stored bearer token can be hydrated through the API.
- `/onboarding` can update the current authenticated reader profile instead of only creating a new signup.
- `/onboarding` now captures disliked genres and reading speed.
- `/onboarding` can capture liked, disliked, completed, saved, and DNF signals for catalog books.

## Technical Changes

- Added `GET /profiles/me`.
- Added `PATCH /profiles/me`.
- Added `UpdateReadingProfileDto` without `userId` so profile ownership cannot be changed through updates.
- Added frontend API helpers and React Query hooks for current user, current profile, profile update, reading events, and DNF records.
- Reviewed `.local/catalog-smoke.jsonl`; source quality is useful for draft generation, but raw response caching should be added before the 1,000-book run.
- Manually promoted a curated subset of smoke candidates into the repeatable seed script.
- Expanded the local seed catalog to 25 authors and 27 books total.
- Added the provided BookCompass PNG as `public/bookcompass-icon.png`.
- Updated browser tab metadata to use the BookCompass icon and `BookCompass` title.

## Validation Performed

- `npm run build --workspace @bookcompass/api`
- `npm run build --workspace @bookcompass/web`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run check`
- `npm run test:e2e --workspace @bookcompass/api`
- `MONGODB_URI=mongodb://localhost:27017/bookcompass npm run seed --workspace @bookcompass/api`
- Live API smoke test for `GET /books?limit=3`
- Live API smoke test for `GET /authors?limit=3`
- `npm run build --workspace @bookcompass/web`

## Known Gaps

- Admin role policy is still missing.
- Reader-owned event/DNF history endpoints are not implemented yet.
- The onboarding route should be split into smaller route components as the identity flow grows.
- Full catalog ingestion should wait for raw response caching and keyed Google Books requests.
