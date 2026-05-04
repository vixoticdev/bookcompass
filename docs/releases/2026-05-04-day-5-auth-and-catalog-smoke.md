# Day 5 Auth and Catalog Smoke

Date: 2026-05-04

## Summary

Day 5 added the first real auth boundary for BookCompass and validated the catalog ingestion scaffold with a 40-book smoke run.

## Backend

- Added `apps/api/src/auth` with:
  - `POST /auth/signup`
  - `POST /auth/login`
  - `GET /auth/me`
  - reusable JWT guard
  - current-user request extraction
- Added bcryptjs password hashing.
- Added hidden `passwordHash` storage on users.
- Added duplicate email conflict handling.
- Changed self-service writes for profiles, reading events, DNF records, and recommendation sessions to derive ownership from the bearer token.

## Frontend

- Added `/login` for temporary local session creation.
- Updated `/onboarding` to sign up a reader, store the access token, and create the reading profile without sending `userId`.
- Added Axios bearer token attachment from local storage.

## Catalog

- Ran:

```bash
npm run catalog:ingest -- --target 40 --per-genre 2 --out .local/catalog-smoke.jsonl
```

- The run produced 40 reviewable drafts across the configured genre lanes.
- Initial inspection showed enriched records from Open Library and Google Books with `enrichmentStatus: "needs-review"` and `recommendationEligible: false`.

## Validation

- `npm run build --workspace @bookcompass/api`
- `npm run build --workspace @bookcompass/web`
- `npm run check`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`
- Live API smoke test for `POST /auth/signup` followed by authenticated `POST /profiles`
