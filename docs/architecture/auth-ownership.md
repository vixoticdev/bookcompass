# Auth and Ownership Decision

Date: 2026-05-03

## Decision

BookCompass will use JWT-backed authentication for the MVP API boundary. The likely production integration remains an external identity provider, but the backend contract should depend on verified identity claims rather than provider-specific SDK types.

Until signup/login is implemented in Phase 2, user-owned write DTOs keep an explicit `userId` field. This keeps Day 2 domain endpoints usable for local development, seeding, and API exploration without pretending auth exists.

## Ownership Contract

User-owned resources:

- reading profiles
- reading events
- DNF records
- recommendation sessions

Current contract:

- clients send `userId` explicitly
- DTOs validate `userId` as a Mongo ID
- services persist the user reference

Phase 2 contract:

- auth middleware/guards verify the access token
- controllers derive the owner from the authenticated request
- clients stop sending owner IDs for self-service user flows
- admin-only flows may keep explicit user selectors behind role checks

## Rationale

This avoids a partial auth implementation during foundation work while preserving clear ownership boundaries in schemas and indexes. The recommendation engine can already query behavior by user, and the future auth layer can replace the source of `userId` without changing the core data model.

## Consequences

- Day 3 endpoints are still development/admin-safe only.
- Public deployment must wait for auth guards and role policy.
- Tests added before Phase 2 should treat `userId` as an explicit contract; tests after Phase 2 should cover derived ownership.
