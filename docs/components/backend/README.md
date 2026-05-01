# Backend Component Documentation

## Stack

- NestJS
- TypeScript
- MongoDB through Mongoose
- Redis planned for caching and queues
- JWT or Firebase Auth integration

## Current Baseline

- Config module is global.
- CORS is enabled for local web development.
- Validation pipe is enabled globally.
- Mongoose is wired through `MONGODB_URI`, with local MongoDB fallback.
- Health endpoint exists at `/health`.

## Planned Modules

```text
src/
  auth/
  users/
  profiles/
  books/
  authors/
  reading-events/
  dnf/
  recommendations/
  admin/
  analytics/
  billing/
```

## API Contract Style

- REST first for MVP.
- DTO validation on all write endpoints.
- Service methods should keep business logic outside controllers.
- Recommendation explanations should be generated from scoring signals, not free-form guesses.

## Documentation Rule

When adding or changing backend behavior, update this doc with:

- module created or changed
- endpoint list
- schema changes
- validation rules
- background jobs or cache behavior
