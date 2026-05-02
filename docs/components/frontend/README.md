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

## Documentation Rule

When adding a frontend feature, update this doc with:

- route or component added
- API contract consumed
- state management approach
- loading/error/empty states
- any UX tradeoff worth remembering
