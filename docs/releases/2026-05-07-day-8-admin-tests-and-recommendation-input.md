# Day 8: Admin Tests and Recommendation Input

Date: 2026-05-07

## Scope

Tightened backend access-policy validation, added a controlled first-admin bootstrap path, prepared the recommendation engine input boundary, and updated the project operating rules.

## Apps and Packages Changed

- `apps/api`
- `docs`
- `.env.example`

## User-Visible Changes

- A local admin user can now be bootstrapped with:

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change-me npm run bootstrap:admin --workspace @bookcompass/api
```

The bootstrap path is a backend script, not a public API route.

## Technical Changes

- Added `UsersService.upsertAdminByEmail` for controlled admin account creation.
- Added `apps/api/src/admin/bootstrap-admin.ts`.
- Added `bootstrap:admin` workspace script.
- Added backend tests for:
  - `GET /reading-events/me` reader ownership behavior.
  - `GET /dnf-records/me` reader ownership behavior.
  - `RolesGuard` admin allow/reader deny behavior.
  - admin-only metadata on global reading event and DNF lists.
  - admin-only metadata on author/book catalog creation.
- Added `RecommendationsService.buildInput` to gather profile, reading events, DNF records, and catalog candidates for a decision context.
- Updated recommendation module imports so the input aggregator can use profile, behavior, DNF, and book services.
- Updated project workflow rules:
  - every development session starts on a new daily branch.
  - meaningful code changes require unit tests with normal-path, edge-case, validation-failure, ownership/security, and regression coverage.
  - previously developed behavior must receive tests when touched or relied on by new behavior.
  - GitHub pushes happen only after all required validation succeeds.
  - project-facing documentation must avoid internal tooling names.

## Validation

- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run build --workspace @bookcompass/api`
- `npm run check`

## Known Gaps

- Recommendation scoring is still not implemented.
- Admin CRUD screens are still placeholders.
- The bootstrap script should only be used from trusted local/deployment environments with secret values supplied through environment variables.
