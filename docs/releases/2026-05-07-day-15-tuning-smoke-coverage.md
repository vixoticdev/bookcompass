# Day 15: Tuning Surface And Smoke Coverage

Date: 2026-05-07

Branch: `day15-2026-05-07-tuning-smoke-coverage`

## Summary

Day 15 adds the first admin recommendation tuning surface and repeatable smoke coverage for the feedback, analytics, and paginated catalog review paths.

## Changes

- Added persisted recommendation tuning defaults for outcome fit, personal fit, context fit, time fit, behavior fit, anti-DNF risk, and max returned recommendations.
- Added admin-only `GET /recommendation-sessions/admin/tuning` and `PATCH /recommendation-sessions/admin/tuning`.
- Wired new recommendation sessions to apply the active tuning weights while preserving the existing default scoring behavior.
- Added `/admin/tuning` with slider controls, max recommendation count, a tuning note, and feedback outcome context.
- Added `npm run smoke:day15:web` for frontend contract smoke coverage around recommendation feedback note/progress controls, admin book pagination, and tuning route wiring.
- Added `npm run smoke:day15` for live API smoke coverage of admin analytics, admin tuning read/update/restore, and paginated `/books` review queues.

## Validation

- `npm run test --workspace @bookcompass/api -- recommendations --runInBand`
- `npm run build --workspace @bookcompass/api`
- `npm run build --workspace @bookcompass/web`
- `npm run check`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`
- `npm run smoke:day15:web`
- `ADMIN_EMAIL=day15-smoke-admin@bookcompass.local ADMIN_PASSWORD=<local-smoke-password> npm run smoke:day15`

## Notes

- Tuning is admin-only and affects newly created recommendation sessions; existing persisted sessions are not rescored.
- The live Day 15 API smoke requires `ADMIN_EMAIL` and `ADMIN_PASSWORD` for an existing admin and a running API.
