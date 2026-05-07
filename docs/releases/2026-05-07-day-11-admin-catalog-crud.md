# Day 11: Admin Catalog CRUD

Date: 2026-05-07

## Scope

Expanded catalog administration from create/list into first-pass CRUD for authors and books.

## Apps and Packages Changed

- `apps/api`
- `apps/web`
- `docs`

## User-Visible Changes

- `/admin/books` can now edit and delete authors from the catalog administration screen.
- `/admin/books` can now edit and delete books from the filtered catalog table.
- Edit mode reuses the existing create forms and can be cancelled without navigating away.

## Technical Changes

- Added `UpdateAuthorDto` and `UpdateBookDto` with optional fields and create-equivalent validation bounds.
- Added public detail reads:
  - `GET /authors/:authorId`
  - `GET /books/:bookId`
- Added admin-only catalog mutations:
  - `PATCH /authors/:authorId`
  - `DELETE /authors/:authorId`
  - `PATCH /books/:bookId`
  - `DELETE /books/:bookId`
- Catalog services now return `404` for missing detail, update, or delete targets.
- Added React Query mutations and cache invalidation for catalog update/delete operations.
- Added focused service tests for catalog lookup, update, delete, and missing-record failures.
- Expanded controller tests so create, update, and delete mutation paths remain admin guarded.

## Validation

- `npm run test --workspace @bookcompass/api -- books authors --runInBand`
- `npm run check`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`
- Live Docker MongoDB API smoke for admin login, author create/update/delete, and book create/update/detail/delete

## Known Gaps

- Author management still lives inside `/admin/books`; a dedicated `/admin/authors` route remains planned.
- Deleting an author currently does not enforce a no-books reference policy.
- Catalog review queues, recommendation eligibility controls, analytics, and tuning screens are not implemented yet.
