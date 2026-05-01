# Frontend Component Documentation

## Stack

- Vite
- React
- TypeScript
- Tailwind
- React Query
- React Router
- Lucide icons

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
