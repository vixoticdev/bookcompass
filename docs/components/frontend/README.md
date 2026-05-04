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

## API Contracts Consumed

- `GET /authors?limit=100`
- `GET /books?limit=25`
- `GET /books?limit=20&outcome=&q=`
- `POST /auth/signup`
- `POST /auth/login`
- `POST /profiles`

## Documentation Rule

When adding a frontend feature, update this doc with:

- route or component added
- API contract consumed
- state management approach
- loading/error/empty states
- any UX tradeoff worth remembering
