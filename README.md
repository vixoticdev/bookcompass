# BookCompass

BookCompass is an intelligent reading decision engine for people who want a better answer than another generic list of popular books.

It helps a reader decide what to read next based on their goals, reading behavior, available time, mood, energy, focus, preferences, and abandonment patterns.

## The Problem

Most recommendation products optimize for similarity, popularity, or broad genre taste.

That misses the real reading decision:

> What should I read next, given who I am as a reader and what I can realistically finish right now?

Readers abandon books for reasons that ordinary recommendation lists rarely model: pacing mismatch, difficulty, wrong mood, low available time, overly dense writing, weak relevance to a current goal, or a bad fit with recent reading behavior.

BookCompass treats those signals as first-class product data.

## Product Vision

BookCompass is built around a simple promise:

> Recommend the book the reader is most likely to value and finish, then explain why.

The product is designed as a startup-grade SaaS platform with:

- reader identity capture
- behavior-aware catalog signals
- anti-abandonment logic
- explainable scoring
- current-context decision sessions
- admin controls for catalog quality, tuning, and analytics

## Core Capabilities

### Reading Identity

BookCompass captures durable reader preferences:

- favorite and disliked genres
- target outcomes
- preferred depth
- pacing and difficulty tolerance
- reading format preferences
- daily reading time
- estimated reading speed

### Behavior Signals

The system tracks actual reading behavior, not just stated taste:

- liked books
- disliked books
- completed books
- saved books
- abandoned books
- DNF reasons and stopped percentage

### Context-Aware Decisions

The recommendation flow is designed around the reader's current state:

- desired outcome
- mood
- energy
- focus
- available time
- preferred depth for this session

### Explainable Recommendations

The MVP recommendation engine is intentionally deterministic and inspectable. Every recommendation should eventually explain:

- why the book fits the selected outcome
- why it fits the reader's current context
- which behavior signals helped or hurt the match
- what abandonment risk was avoided or accepted

### Catalog Quality

The catalog is treated as recommendation infrastructure, not just inventory. Books carry metadata for:

- outcome tags
- pacing
- difficulty
- reading depth
- estimated reading time
- formats
- bibliographic enrichment
- future DNF risk signals

Imported catalog drafts remain review-gated before they can become recommendation-eligible.

## Current MVP Status

BookCompass currently includes:

- React web app with a warm, literary reading-desk interface
- NestJS API with MongoDB persistence
- local password signup/login with JWT session hydration
- authenticated reader profile create/read/update
- reader-owned reading event and DNF history
- guarded admin/global data access policy
- live catalog browsing
- repeatable seed catalog with Google Books enrichment
- cached 1,000-book draft ingestion pipeline
- MVP high-level and low-level design documentation

The deterministic recommendation scoring engine is the next major product milestone.

## Product Screens

Current surfaces include:

- reader signup and login
- reading preference setup
- behavior signal capture
- library/catalog browsing
- recommendation session placeholder
- recommendation history placeholder
- admin/catalog exploration surfaces

## Technical Highlights

BookCompass uses a pragmatic full-stack architecture:

- **Frontend:** React, TypeScript, Vite, Tailwind, React Query, React Router
- **Backend:** NestJS, TypeScript, Mongoose
- **Database:** MongoDB
- **Local infrastructure:** Docker MongoDB and Redis
- **Shared domain package:** common recommendation constants and validation values
- **Catalog ingestion:** Open Library discovery plus Google Books enrichment

The recommendation engine starts inside the API so the MVP remains easy to inspect, test, and explain. A separate AI/ML service can be introduced later after enough behavioral data and scoring contracts exist.

## Demo Locally

```bash
npm install
npm run infra:up
MONGODB_URI=mongodb://localhost:27017/bookcompass npm run seed --workspace @bookcompass/api
MONGODB_URI=mongodb://localhost:27017/bookcompass npm run dev:api
npm run dev:web
```

Open:

- Web app: `http://localhost:5173`
- API health: `http://localhost:3000/health`

## Design Direction

BookCompass should feel like an intelligent reading desk: warm, literary, focused, and premium.

The visual direction combines parchment-like surfaces, coffee/cream/sepia tones, restrained editorial typography, dark ink contrast, and modern SaaS usability. Admin areas should remain dense, calm, and operational.

## Roadmap

Near-term priorities:

- first-admin bootstrap flow
- admin catalog management
- recommendation input aggregation
- candidate generation
- weighted scoring
- anti-DNF penalty
- explanation generation
- recommendation feedback capture

Longer-term opportunities:

- semantic book embeddings
- DNF prediction
- reader segment clustering
- collaborative signals
- richer admin analytics
- production deployment and demo polish
