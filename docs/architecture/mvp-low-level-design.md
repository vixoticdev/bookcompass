# MVP Low-Level Design

Date: 2026-05-06

## Backend Modules

Auth:

- `POST /auth/signup`: creates a reader account, hashes password, returns JWT.
- `POST /auth/login`: validates password and returns JWT.
- `GET /auth/me`: returns the current public user from the bearer token.
- `JwtAuthGuard`: verifies token and attaches `{ id, email, role }`.
- `RolesGuard` and `@Roles(...)`: enforce admin-only paths.

Users:

- `POST /users`: legacy/public reader creation path; forces `role: reader`.
- `GET /users`: admin-only list endpoint.
- First-admin creation runs through `npm run bootstrap:admin --workspace @bookcompass/api` with `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optional `ADMIN_DISPLAY_NAME`; it is intentionally not exposed through a public endpoint.

Profiles:

- `POST /profiles`: authenticated self-service create; derives `userId` from JWT.
- `GET /profiles/me`: authenticated current-reader profile lookup.
- `PATCH /profiles/me`: authenticated current-reader preference update.
- `GET /profiles`: admin-only global list.

Reading events:

- `POST /reading-events`: authenticated self-service create; derives `userId`.
- `GET /reading-events/me`: authenticated current-reader timeline.
- `GET /reading-events`: admin-only global list.

DNF records:

- `POST /dnf-records`: authenticated self-service create; derives `userId`.
- `GET /dnf-records/me`: authenticated current-reader DNF history.
- `GET /dnf-records`: admin-only global list.

Catalog:

- `GET /authors`, `GET /books`: public list read paths for MVP exploration.
- `GET /authors/:authorId`, `GET /books/:bookId`: public catalog detail read paths.
- `POST /authors`, `POST /books`: admin-only catalog creation paths.
- `PATCH /authors/:authorId`, `PATCH /books/:bookId`: admin-only catalog update paths.
- `DELETE /authors/:authorId`, `DELETE /books/:bookId`: admin-only catalog deletion paths.
- Existing filters and pagination remain the query foundation for library, admin, and candidate generation.
- Book list filters include review metadata for `enrichmentStatus`, `recommendationEligible`, `styleTag`, and `riskTag`.
- Book records include `enrichmentStatus`, `recommendationEligible`, `styleTags`, and `riskTags` for admin review and anti-DNF tuning.

Recommendations:

- `POST /recommendation-sessions`: authenticated self-service create; derives `userId`, builds recommendation input, scores candidates, and persists the ranked session.
- `GET /recommendation-sessions/me`: authenticated current-reader recommendation history.
- `POST /recommendation-sessions/:sessionId/feedback`: authenticated current-reader feedback capture for a scored candidate.
- `GET /recommendation-sessions`: admin-only global list.
- `GET /recommendation-sessions/admin/analytics`: admin-only operational analytics for catalog review queue counts and candidate feedback outcomes.
- Current module can build recommendation input from profile, reading events, DNF records, and catalog candidates through `RecommendationsService.buildInput`.
- Current module scores candidates through deterministic outcome, profile, context, time, behavior, and anti-DNF signals.
- Current module records feedback only when the session belongs to the authenticated reader and the book id is present in the session candidates.

## Access Policy

Self-service reader endpoints:

- require `JwtAuthGuard`
- ignore client-supplied `userId`
- derive ownership from `request.user.id`
- return only current-reader records on `/me` endpoints

Admin endpoints:

- require `JwtAuthGuard`
- require `RolesGuard`
- declare `@Roles('admin')`
- should be used for global reads and all future catalog/admin mutations

Public endpoints:

- auth signup/login
- catalog reads during MVP
- health/root checks

## Frontend Route Design

Current Day 7 reading identity routes:

```text
/login
/onboarding/signup
/onboarding/preferences
/onboarding/signals
/profile/history
/library
/recommendations/new
/recommendations/history
/admin
/admin/authors
/admin/books
```

Route responsibilities:

- `/onboarding/signup`: account creation and initial JWT storage.
- `/onboarding/preferences`: current profile create/update through `/profiles/me` contracts.
- `/onboarding/signals`: event and DNF capture plus reader-owned history display.
- `/profile/history`: consolidated profile summary, behavior history, DNF history, and recommendation feedback.
- `/recommendations/new`: creates a scored recommendation session.
- `/recommendations/history`: reads current-reader scored recommendation history.
- `/admin/authors`: lists, creates, edits, and deletes authors through guarded admin endpoints.
- `/admin/books`: lists, creates, edits, and deletes books and review metadata through guarded admin endpoints.
- `/admin`: shows admin analytics for catalog review readiness and recommendation feedback outcomes.

React Query owns server state. Axios owns bearer token attachment from `localStorage`.

## Data Flow

Signup:

1. Web posts credentials to `POST /auth/signup`.
2. API creates a reader user and returns JWT.
3. Web stores JWT.
4. Web creates an empty profile through authenticated `POST /profiles`.

Preferences:

1. Web hydrates `GET /auth/me`.
2. Web attempts `GET /profiles/me`.
3. If profile exists, save uses `PATCH /profiles/me`.
4. If profile is missing, save uses authenticated `POST /profiles`.

Behavior capture:

1. Web lists catalog books.
2. Web posts selected event to `POST /reading-events` or `POST /dnf-records`.
3. API derives ownership from JWT.
4. Web refreshes `GET /reading-events/me` and `GET /dnf-records/me`.

Recommendation session:

1. Web posts decision context to `POST /recommendation-sessions`.
2. API derives ownership from JWT and builds input from profile, behavior, DNF records, and catalog candidates.
3. API persists the top ranked scored candidates with score breakdowns, signals, and explanation lines.
4. Web reads `GET /recommendation-sessions/me` for reader-owned history.

Recommendation feedback:

1. Web posts candidate feedback to `POST /recommendation-sessions/:sessionId/feedback`.
2. API verifies the session belongs to the authenticated reader and includes the candidate book.
3. API stores candidate-level feedback with status, optional progress/note, and timestamp.
4. API writes a reusable reading event: accepted becomes saved, rejected becomes disliked, and started/completed/abandoned map directly.

Admin analytics:

1. Web reads `GET /recommendation-sessions/admin/analytics` with an admin JWT.
2. API returns catalog review totals by enrichment status and recommendation eligibility.
3. API returns recorded recommendation candidate feedback totals grouped by feedback status.

Catalog ingestion:

1. Open Library candidate search by genre.
2. Google Books enrichment by ISBN or title/author.
3. Raw API JSON is cached under `.local/catalog-cache` by normalized URL hash.
4. Normalized JSONL drafts are written to `.local/catalog-drafts.jsonl`.
5. Drafts stay `needs-review` and `recommendationEligible: false`.

## Recommendation Engine Contract

The deterministic engine should consume:

- current reading profile
- reading events grouped by book and type
- DNF records and reasons
- catalog candidates with semantic metadata
- decision-session context: outcome, mood, energy, focus, time, depth

Day 8 aggregator baseline:

- load current reading profile by user id
- load current-reader reading events
- load current-reader DNF records
- load up to 50 catalog candidates filtered by selected outcome, preferred depth, available minutes, and `recommendationEligible: true`

The MVP scoring output persists:

- candidate book id
- final score
- score breakdown
- positive signals
- risk signals
- explanation lines
- candidate feedback after the reader acts on a suggestion

## Testing Priorities

- auth token behavior and role policy
- `/profiles/me` read/update ownership
- reader-owned event and DNF list endpoints
- recommendation scoring unit tests
- catalog filter and ingestion smoke tests
