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

Browser metadata:

- The browser tab favicon uses `public/bookcompass-icon.png`.
- The document title is `BookCompass`.

## API Contracts Consumed

- `GET /authors?limit=100`
- `GET /books?limit=25`
- `GET /books?limit=20&outcome=&q=`
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

## Documentation Rule

When adding a frontend feature, update this doc with:

- route or component added
- API contract consumed
- state management approach
- loading/error/empty states
- any UX tradeoff worth remembering
