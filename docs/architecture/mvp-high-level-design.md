# MVP High-Level Design

Date: 2026-05-06

## Product Boundary

BookCompass MVP is a behavior-aware reading decision engine. It captures who the reader is, what they want from reading, how they actually behave with books, and later uses deterministic scoring to answer what they should read next.

The MVP should not become a generic catalog browser. Catalog browsing is supporting infrastructure; the core product is the explainable decision session.

## Architecture

```text
React Web App
  -> NestJS API
      -> MongoDB
      -> deterministic recommendation services
      -> catalog ingestion drafts
  -> Redis later for cache, queues, and rate limiting
  -> Python AI/ML service later after scoring contracts and user data exist
```

## Current Progress Assessment

The current monorepo design is still the right MVP architecture.

Reasons:

- The domain is still contract-heavy and data-light, so deterministic TypeScript services are easier to inspect, test, and explain.
- The current NestJS module boundaries match the core domain: auth, users, profiles, catalog, reading events, DNF records, and recommendation sessions.
- A separate recommendation or AI service would add deployment and data-contract overhead before the product has enough behavioral data.
- MongoDB remains a good MVP fit because catalog metadata, reading profiles, behavior events, and recommendation sessions are document-friendly.

Required redesigns before expanding features:

- Treat reader-owned self-service data and admin/global data as separate access paths.
- Keep admin writes behind a reusable role policy.
- Keep imported catalog drafts out of recommendation eligibility until reviewed.
- Split large frontend onboarding into route-level steps so identity capture can grow without creating a fragile form.

## System Responsibilities

Frontend:

- reader signup/login
- profile preference capture
- reading behavior and DNF capture
- library/catalog read views
- recommendation session entry and explanation views
- admin operational screens after role gates exist

API:

- JWT authentication and current-user hydration
- role-based admin policy
- reader-owned profile, event, DNF, and recommendation session writes
- catalog read/filter endpoints
- future admin catalog mutation endpoints
- deterministic recommendation candidate generation, scoring, and explanation

MongoDB:

- users
- reading profiles
- authors and books
- reading events
- DNF records
- recommendation sessions
- future admin tuning configuration

Catalog ingestion:

- produce JSONL drafts from Open Library and Google Books
- cache raw source responses locally
- mark imported drafts as `needs-review`
- require admin review before recommendation eligibility

## MVP Milestones

1. Reading identity: signup/login, profile preferences, behavior signals, DNF patterns.
2. Catalog readiness: sufficient reviewed books, semantic metadata, admin-gated mutations.
3. Decision engine: candidate generation, weighted scoring, anti-DNF penalty, explanation lines.
4. Feedback loop: reader accepts/rejects/starts/completes/abandons recommendations.
5. Admin operations: catalog review, recommendation tuning, drop-off analytics.

## Non-Goals For MVP

- no opaque AI-only recommendation path
- no separate Python recommendation service
- no public admin creation from self-service endpoints
- no unreviewed catalog draft in recommendation results
- no billing implementation before the decision engine works
