# Local Development Runbook

## Prerequisites

- Node.js 22+
- npm 10+
- Docker Desktop or compatible Docker runtime

## Install

```bash
npm install
```

## Start Infrastructure

```bash
npm run infra:up
```

This starts:

- MongoDB on `localhost:27017`
- Redis on `localhost:6379`

## Start API

```bash
npm run dev:api
```

API:

- root: `http://localhost:3000`
- health: `http://localhost:3000/health`

## Atlas Connection

Local secrets belong in `.env.local`, which is intentionally ignored by Git.

```env
MONGODB_URI=mongodb+srv://...
```

Use the `bookcompass` database name in the connection string. Keep local Docker MongoDB available as a fallback for offline development.

## Start Web

```bash
npm run dev:web
```

Web:

- `http://localhost:5173`

## Validate

```bash
npm run check
```

## Day 13 Live Smoke

With Docker MongoDB/API running and an admin bootstrapped, run:

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change-me npm run smoke:day13
```

The smoke script verifies the API contracts behind `/admin/authors`, imported book review queues, book eligibility toggles, recommendation feedback note/progress capture, and `/profile/history`.
