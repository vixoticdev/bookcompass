# Day 12: Admin Authors, Catalog Review Metadata, Profile History

Date: 2026-05-07

Branch: `day12-2026-05-07-admin-authors-profile-history`

## Summary

Split author administration out of the combined catalog screen, added first-class book review metadata for recommendation eligibility and anti-DNF tuning, and added a consolidated reader profile/history view.

## Backend

- Added shared catalog enrichment statuses: `seeded`, `imported`, `reviewed`, and `needs-review`.
- Added book fields for `enrichmentStatus`, `recommendationEligible`, `styleTags`, and `riskTags`.
- Added book list filters for enrichment status, eligibility, style tag, and risk tag.
- Recommendation input now filters candidates to `recommendationEligible: true`.
- Expanded focused tests for review metadata filters and recommendation candidate query behavior.

## Frontend

- Added `/profile/history` for current reader profile summary, reading events, DNF records, and recommendation feedback.
- Added dedicated `/admin/authors` route for author create, edit, delete, and list operations.
- Narrowed `/admin/books` to book operations and review metadata controls.
- Added book admin controls for enrichment status, recommendation eligibility, style tags, and risk tags.
- Added book admin filters for review status and eligible-only records.

## Documentation

- Updated project context, backend, frontend, admin dashboard, recommendation engine, and MVP LLD documentation.

## Validation

- `npm run build --workspace @bookcompass/shared`
- `npm run check`
- `npm run test --workspace @bookcompass/api -- books recommendations --runInBand`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`
- Live Docker MongoDB API smoke for admin author/book review metadata filters, eligibility updates, reader profile creation, recommendation candidate eligibility, and recommendation history retrieval

The smoke pass verified that ineligible books are excluded from recommendation candidates.
