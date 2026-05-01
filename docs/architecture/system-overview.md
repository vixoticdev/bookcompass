# System Overview

## Product Goal

BookCompass answers:

> What should I read next based on my behavior, goals, mood, available time, and likelihood of finishing?

The differentiator is not a list of popular books. The differentiator is a decision engine with explainable reasons.

## Current Architecture

```text
React Web App
  -> NestJS API
      -> MongoDB
      -> Redis
      -> Recommendation Engine Module
  -> Future Python AI/ML Service
```

## Core Backend Modules

Planned NestJS modules:

- `AuthModule`
- `UsersModule`
- `ProfilesModule`
- `BooksModule`
- `AuthorsModule`
- `ReadingEventsModule`
- `DnfModule`
- `RecommendationsModule`
- `AdminModule`
- `AnalyticsModule`
- `BillingModule`

## Recommendation Flow

1. Candidate generation from outcome, genre, language, and availability.
2. Personal-fit scoring from profile and behavior.
3. Mood/time fit scoring from the current decision session.
4. Anti-DNF penalty from abandonment patterns.
5. Explainability layer from the strongest positive and negative scoring signals.
6. Feedback capture after user accepts, rejects, starts, completes, or abandons.

## Data Stores

- MongoDB: user profiles, books, reading events, recommendation sessions, admin tuning.
- Redis: cached recommendation sessions, future background jobs and rate limiting.

## First-Month Bias

Prefer deterministic, inspectable logic over opaque AI calls. The product should be credible in interviews because the scoring logic, data model, and tradeoffs can be explained clearly.
