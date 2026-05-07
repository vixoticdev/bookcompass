# Admin Dashboard Documentation

## Purpose

The admin dashboard makes BookCompass operationally tunable. It should help the product owner understand what users are choosing, where recommendations fail, and which recommendation paths produce completed reads.

## Planned Areas

- Book management
- Author management
- Outcome tagging
- Recommendation tuning
- Drop-off analysis
- Popular recommendation paths
- User behavior analytics
- Subscription and monetization controls in later phases

## MVP Admin Screens

```text
/admin
/admin/books
/admin/authors
/admin/recommendation-tuning
/admin/analytics/dropoffs
/admin/analytics/recommendation-paths
```

## Day 3 Status

- `/admin` shell route exists in the frontend.
- `/admin/books` now reads live catalog records from the API.
- `/admin/books` supports title and outcome filters in the UI.
- Catalog list filters and pagination now exist in the API for seed/admin exploration.
- Full admin CRUD, analytics, role gates, and tuning controls are not implemented yet.

## Day 7 Access Policy

- Reusable API role guarding now exists through `@Roles('admin')` and `RolesGuard`.
- Global user/profile/reading-event/DNF list endpoints require an admin JWT.
- Author/book creation endpoints require an admin JWT.
- Public user creation is reader-only; clients cannot create admin accounts by passing `role: admin`.
- Full admin CRUD screens, analytics, and tuning controls are still not implemented.

## Day 8 Admin Bootstrap

- First-admin creation now exists as a backend script, not a public endpoint.
- Run `ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run bootstrap:admin --workspace @bookcompass/api` to upsert an admin user.
- The script also accepts optional `ADMIN_DISPLAY_NAME`.
- Admin CRUD screens should be added after logging in with an admin JWT can be exercised locally.

## Day 9 Admin Create Flows

- `/admin/books` now includes guarded author and book create forms.
- Author creation posts to admin-only `POST /authors`.
- Book creation posts to admin-only `POST /books`.
- The screen still lists filtered catalog records for review by title and outcome.
- Full edit/delete workflows, catalog review queues, and dedicated `/admin/authors` routing remain planned.
