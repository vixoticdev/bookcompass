# Day 10: Recommendation Feedback

Date: 2026-05-07

## Scope

Added the first recommendation feedback loop so scored suggestions can become reusable behavior signals.

## Apps and Packages Changed

- `apps/api`
- `apps/web`
- `packages/shared`
- `docs`

## User-Visible Changes

- Recommendation cards now let readers mark top candidates as accepted, rejected, started, completed, or abandoned.
- Saved feedback appears on the candidate card after recommendation history refreshes.

## Technical Changes

- Added shared recommendation feedback statuses.
- Added candidate-level feedback storage on recommendation sessions.
- Added authenticated `POST /recommendation-sessions/:sessionId/feedback`.
- The feedback endpoint verifies reader ownership by session id and candidate book id.
- Feedback writes derived reading events for future scoring:
  - accepted -> saved
  - rejected -> disliked
  - started -> started
  - completed -> completed
  - abandoned -> abandoned
- Added focused backend tests for feedback persistence, behavior-event creation, and ownership-boundary rejection.

## Validation

- `npm run test --workspace @bookcompass/api -- recommendations --runInBand`
- `npm run check`
- `npm run test --workspace @bookcompass/api -- --runInBand`
- `npm run test:e2e --workspace @bookcompass/api`
- `MONGODB_URI=mongodb://localhost:27017/bookcompass npm run seed --workspace @bookcompass/api`
- Live Docker MongoDB API smoke for signup, profile creation, recommendation creation, feedback capture, and derived reading-event history

## Known Gaps

- Feedback note/progress capture is supported by the API but not yet exposed in the frontend controls.
- Admin edit/delete workflows and dedicated author management are not implemented yet.
