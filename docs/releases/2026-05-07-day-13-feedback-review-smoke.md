# Day 13: Feedback Detail, Review Queues, Smoke Coverage

Date: 2026-05-07

Branch: `day13-2026-05-07-feedback-review-smoke`

## Summary

Exposed recommendation feedback note/progress capture in the frontend, added catalog review queue controls for imported draft records, and added repeatable live smoke coverage for the Day 13 route contracts.

## Frontend

- Recommendation cards now include optional progress percentage and feedback note controls.
- Feedback actions now post status, note, and progress to `POST /recommendation-sessions/:sessionId/feedback`.
- Existing feedback note/progress values hydrate back into recommendation history cards.
- `/admin/books` now includes queue presets for imported drafts, needs-review drafts, and reviewed eligible records.
- `/admin/books` now includes style-tag, risk-tag, eligible-only, and draft-only filters.
- Book rows now expose quick saved review states for draft, needs review, approved, and excluded catalog records.

## Tooling

- Added `npm run smoke:day13`.
- The smoke creates temporary reader/catalog records and verifies `/admin/authors` backing list behavior, imported draft filters, eligibility toggles, recommendation feedback note/progress persistence, and `/profile/history` backing reads.

## Documentation

- Updated project context, frontend, backend, admin dashboard, recommendation engine, local development runbook, and release documentation.

## Validation

- `npm run check`
- `npm run test --workspace @bookcompass/api -- recommendations books --runInBand`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`
- `ADMIN_EMAIL=<local-day13-admin> ADMIN_PASSWORD=<local-smoke-password> npm run smoke:day13`

The live smoke pass used a temporary bootstrapped local admin and verified author administration contracts, imported draft review queues, eligibility approval filtering, recommendation feedback note/progress persistence, and profile-history backing reads.
