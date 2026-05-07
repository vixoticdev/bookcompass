# Frontend Component Documentation

## Stack

- Vite
- React
- TypeScript
- Tailwind
- React Query
- React Router
- Lucide icons

## Visual Direction

BookCompass should have an antique retro reading-room feel with modern SaaS ergonomics.

Target atmosphere:

- parchment-like surfaces
- coffee, cream, sepia, beige, off-white, and white as the base palette
- tactile paper/card texture used subtly, not as noisy decoration
- typography that feels editorial and literary without hurting scanability
- quiet, focused layouts that feel like a premium reading/productivity tool

Modern product requirements:

- strong contrast for body text and controls
- clear hover, focus, loading, error, and empty states
- responsive layouts that work on mobile and desktop
- dense but calm admin screens
- accessible forms and buttons
- avoid making the whole app a flat one-note beige wash

Suggested accent colors:

- dark ink/espresso for primary text and headers
- muted forest green for success/active states
- aged brass or soft terracotta for highlights
- restrained charcoal for admin and analytics data

The product should feel like an intelligent reading desk, not a fantasy theme, bookstore landing page, or generic purple SaaS dashboard.

## App Responsibilities

The frontend owns:

- onboarding and reading identity capture
- recommendation decision flow
- recommendation explanation display
- reading event capture
- admin dashboard UI
- subscription and roadmap surfaces in later phases

## Planned Route Structure

```text
/
/login
/signup
/onboarding
/onboarding/signup
/onboarding/preferences
/onboarding/signals
/dashboard
/recommendations/new
/recommendations/history
/books/:bookId
/library
/admin
/admin/books
/admin/recommendation-tuning
/admin/analytics
```

## Implemented Day 3 Shell

Routes now mounted in the Vite app:

- `/login`: temporary local reader session form.
- `/onboarding`: placeholder reader identity capture surface.
- `/library`: placeholder catalog/library table using seeded book examples.
- `/recommendations/new`: placeholder decision-session entry flow.
- `/recommendations/history`: empty state for saved recommendation sessions.
- `/admin`: placeholder operational dashboard.
- `/admin/books`: placeholder catalog admin notes tied to Day 3 API filters.

State management:

- React Router owns route switching.
- React Query provider is installed in `main.tsx`.
- `src/lib/axiosInstance.ts` owns the configured Axios instance and base URL.
- `src/lib/api.ts` owns typed HTTP calls to the backend.
- `src/lib/queries.ts` owns catalog and reader identity hooks.
- Book API types include Day 7 enrichment fields for subtitle, publication year, language, Google Books volume ID, and thumbnail URL.

Loading/error/empty states:

- Recommendation history includes an empty state.
- `/library` shows loading/error states for catalog reads.
- `/admin/books` shows loading/error/empty states for filtered catalog reads.
- `/onboarding` shows success/error states for reader identity creation.
- `/login` shows success/error states for local session creation.

Day 5 session boundary:

- `/onboarding` now signs up the reader, stores the local access token in `localStorage`, and creates the reading profile through authenticated ownership.
- Axios attaches the stored bearer token to API calls.
- This is an MVP session boundary, not final production session management.

Day 6 reading identity flow:

- The app shell hydrates the current reader from `GET /auth/me` when a stored bearer token exists.
- `/onboarding` reads the current profile from `GET /profiles/me`.
- `/onboarding` can create a profile for an authenticated reader without one or update an existing profile through `PATCH /profiles/me`.
- The profile form now captures disliked genres and estimated reading speed in addition to outcomes, favorite genres, format, depth, pacing, difficulty, and daily minutes.
- The same route can capture first behavior signals through `POST /reading-events` and `POST /dnf-records`.
- Behavior capture currently writes signals but does not yet display the reader-owned event/DNF history.

Day 7 route split:

- `/onboarding/signup` handles local reader account creation and JWT storage.
- `/onboarding/preferences` handles reading profile create/update.
- `/onboarding/signals` handles reading event and DNF capture.
- `/onboarding/signals` reads `GET /reading-events/me` and `GET /dnf-records/me` to show the current reader's captured behavior history.

Day 9 recommendation and admin routes:

- `/recommendations/new` now creates a scored recommendation session from outcome, mood, energy, focus, available minutes, and depth.
- `/recommendations/history` reads `GET /recommendation-sessions/me` and displays the latest scored candidates with explanation lines.
- `/admin/books` now includes first-pass guarded create forms for authors and books, backed by admin-only `POST /authors` and `POST /books`.

Day 10 recommendation feedback:

- Recommendation session cards now expose one-click feedback controls for accepted, rejected, started, completed, and abandoned suggestions.
- Feedback posts to `POST /recommendation-sessions/:sessionId/feedback`.
- Successful feedback refreshes recommendation history and reader-owned behavior history queries.

Day 11 admin catalog CRUD:

- `/admin/books` now supports inline edit/delete controls for authors and books.
- Author edits post to admin-only `PATCH /authors/:authorId`; deletes use `DELETE /authors/:authorId`.
- Book edits post to admin-only `PATCH /books/:bookId`; deletes use `DELETE /books/:bookId`.
- Successful catalog mutations refresh the relevant React Query catalog caches.

Day 12 profile history and admin split:

- `/profile/history` consolidates the current reader session, profile summary, reading events, DNF records, and recommendation feedback.
- `/admin/authors` now owns author create, edit, delete, and list operations.
- `/admin/books` now focuses on book create, edit, delete, and review metadata.
- Book admin controls now include enrichment status, recommendation eligibility, style tags, and risk tags.
- Book list filters now include enrichment status and an eligible-only toggle.

Day 13 feedback detail and review queues:

- Recommendation session cards now capture optional feedback progress percentage and a note before posting accepted, rejected, started, completed, or abandoned feedback.
- Existing candidate feedback progress/note values hydrate into the card controls when history is reloaded.
- `/admin/books` now has queue presets for imported drafts, needs-review drafts, and reviewed eligible records.
- `/admin/books` now supports style-tag, risk-tag, eligible-only, and draft-only filter combinations.
- Book rows now include quick saved review states for draft, needs review, approved, and excluded records, backed by `PATCH /books/:bookId`.

Day 14 admin analytics and pagination:

- `/admin` now reads `GET /recommendation-sessions/admin/analytics` and displays catalog review readiness counts plus recommendation feedback outcome counts.
- `/admin/books` now passes `limit` and `offset` to the catalog query and exposes previous/next pagination controls for review queues.
- Changing queue filters resets the book review queue to the first page so admins do not land on an empty later offset.

Browser metadata:

- The browser tab favicon uses `public/bookcompass-icon.png`.
- The document title is `BookCompass`.

## API Contracts Consumed

- `GET /authors?limit=100`
- `GET /books?limit=25`
- `GET /books?limit=20&outcome=&q=`
- `GET /books?limit=20&offset=&outcome=&q=&enrichmentStatus=&recommendationEligible=&styleTag=&riskTag=`
- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `POST /profiles`
- `GET /profiles/me`
- `PATCH /profiles/me`
- `POST /reading-events`
- `GET /reading-events/me`
- `POST /dnf-records`
- `GET /dnf-records/me`
- `POST /recommendation-sessions`
- `GET /recommendation-sessions/me`
- `POST /recommendation-sessions/:sessionId/feedback`
- admin-only `GET /recommendation-sessions/admin/analytics`
- admin-only `POST /authors`
- admin-only `POST /books`
- admin-only `PATCH /authors/:authorId`
- admin-only `DELETE /authors/:authorId`
- admin-only `PATCH /books/:bookId`
- admin-only `DELETE /books/:bookId`

## Documentation Rule

When adding a frontend feature, update this doc with:

- route or component added
- API contract consumed
- state management approach
- loading/error/empty states
- any UX tradeoff worth remembering
