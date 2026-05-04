# Auth and Ownership Decision

Date: 2026-05-03

Updated: 2026-05-04

## Decision

BookCompass will use JWT-backed authentication for the MVP API boundary. The likely production integration remains an external identity provider, but the backend contract should depend on verified identity claims rather than provider-specific SDK types.

Day 5 implemented the first local JWT auth boundary. Signup/login are now available through the API, and self-service user-owned writes derive ownership from the authenticated request.

## Ownership Contract

User-owned resources:

- reading profiles
- reading events
- DNF records
- recommendation sessions

Current self-service contract:

- auth guards verify the access token
- controllers derive the owner from the authenticated request
- clients stop sending owner IDs for self-service user flows
- admin-only flows may keep explicit user selectors behind role checks

## Rationale

This preserves clear ownership boundaries in schemas and indexes while making the MVP safer for self-service flows. The recommendation engine can already query behavior by user, and future external identity provider work can replace token issuance without changing the core data model.

## Consequences

- Catalog reads and current list endpoints are still development/admin-friendly.
- Public deployment still needs stronger role policy, production JWT secret management, and admin authorization.
- Tests for user-owned writes should cover derived ownership from JWT claims.
