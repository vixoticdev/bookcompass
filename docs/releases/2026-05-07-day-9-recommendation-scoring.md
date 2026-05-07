# Day 9: Recommendation Scoring

Date: 2026-05-07

## Scope

Implemented first-pass deterministic recommendation scoring, reader-owned recommendation history, live frontend recommendation session views, and initial guarded admin catalog create forms.

## Apps and Packages Changed

- `apps/api`
- `apps/web`
- `docs`

## User-Visible Changes

- `/recommendations/new` can create a scored recommendation session from outcome, mood, energy, focus, available minutes, and preferred depth.
- `/recommendations/history` displays the authenticated reader's scored recommendation sessions and explanation lines.
- `/admin/books` includes guarded author and book create forms for admin sessions.

## Technical Changes

- `POST /recommendation-sessions` now builds recommendation input and persists ranked candidates with:
  - final score
  - score breakdown
  - scoring signals
  - explanation lines
- Added `GET /recommendation-sessions/me` for reader-owned recommendation history.
- Added deterministic scoring layers for outcome fit, profile fit, context fit, time fit, behavior fit, and anti-DNF risk.
- Direct prior DNF records receive a stronger penalty than reusable pacing/difficulty risk patterns.
- Added frontend API calls and React Query hooks for recommendation sessions and guarded catalog creates.
- Added focused backend tests for scoring order, explanations, DNF penalty behavior, reader-owned history, and admin-only recommendation list metadata.

## Validation

- `npm run test --workspace @bookcompass/api -- recommendations --runInBand`
- `npm run check`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`
- `MONGODB_URI=mongodb://localhost:27017/bookcompass npm run seed --workspace @bookcompass/api`
- Live Docker MongoDB API smoke for signup, profile creation, `POST /recommendation-sessions`, and `GET /recommendation-sessions/me`

## Known Gaps

- Recommendation feedback capture is not implemented yet.
- Admin edit/delete workflows and dedicated author management are not implemented yet.
