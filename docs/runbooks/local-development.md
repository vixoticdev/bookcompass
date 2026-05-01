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
