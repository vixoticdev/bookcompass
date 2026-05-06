# Day 7: MVP Design and Access Policy

Date: 2026-05-06

## Scope

Added explicit MVP HLD/LLD documentation, tightened the reader/admin access boundary, exposed reader-owned behavior history, split onboarding into smaller route steps, added catalog source response caching, and enriched the repeatable seed catalog with Google Books metadata.

## Apps and Packages Changed

- `apps/api`
- `apps/web`
- `tools/catalog-ingestion`
- `docs`

## User-Visible Changes

- Reading identity is now split into signup, preferences, and behavior signal routes.
- Behavior signals page can show the current reader's reading events and DNF records.
- Admin/global user/profile/event/DNF list endpoints now require an admin JWT.
- Author/book creation endpoints now require an admin JWT.
- Current seeded catalog records now expose Google Books metadata where matched, including volume IDs, publication years, subtitles, and thumbnails.

## Technical Changes

- Added reusable `@Roles(...)` metadata and `RolesGuard`.
- Protected author/book creation and global recommendation-session list endpoints behind admin JWT checks.
- Forced legacy `POST /users` to create reader users only.
- Added `GET /reading-events/me`.
- Added `GET /dnf-records/me`.
- Added frontend API helpers and React Query hooks for reader-owned event and DNF history.
- Added raw source response caching to `tools/catalog-ingestion/ingest.mjs`.
- Added `.env.local` loading for catalog ingestion so the Google Books key can be used without shell-exporting it.
- Redacted API keys from catalog ingestion failure messages.
- Added book fields for `subtitle`, `publishedYear`, `language`, `googleBooksVolumeId`, and `thumbnailUrl`.
- Enriched 20 of the current 27 seeded books with Google Books metadata and 14 with thumbnails.
- Ran the 1,000-book cached draft ingestion.
- Added MVP high-level and low-level design docs.
- Added focused profile controller tests for `GET /profiles/me` and `PATCH /profiles/me`.

## Validation Performed

- `npm run build --workspace @bookcompass/api`
- `npm run build --workspace @bookcompass/web`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run check`
- `npm run test:e2e --workspace @bookcompass/api`
- `npm run catalog:ingest -- --target 1000 --delay 100 --out .local/catalog-drafts.jsonl`
- `MONGODB_URI=mongodb://localhost:27017/bookcompass npm run seed --workspace @bookcompass/api`
- Live Docker MongoDB API smoke checks for `/health`, `/books?limit=30`, and `/authors?limit=30`

The 1,000-book draft run produced 1,000 review-gated drafts: 993 ISBNs, 843 Google Books volume IDs, 635 descriptions, 550 thumbnails, 1,000 `needs-review`, and zero recommendation-eligible drafts by design.

Docker MongoDB validation returned 27 seeded books, 25 authors, 20 enriched books, and 14 thumbnail-backed books from the live API.

## Known Gaps

- Admin CRUD screens are still not implemented.
- Recommendation scoring is still planned for Phase 4.
- Production identity provider integration is not implemented.
- CI/CD is not configured yet.
