# Catalog Enrichment Plan

Date: 2026-05-03

## Goal

BookCompass needs a catalog that is useful for decision-making, not just display. Each book record should carry enough structured metadata for outcome fit, time fit, mood fit, and anti-DNF logic.

## Enrichment Layers

### Layer 1: Bibliographic Baseline

Required before broad catalog growth:

- title
- author
- description
- page count
- formats
- genres
- ISBN when available
- publication year
- language

Primary use:

- search
- admin review
- duplicate detection
- user-facing book detail pages

### Layer 2: Recommendation Metadata

Required for MVP scoring:

- outcome tags
- pacing
- difficulty
- reading depth
- estimated reading minutes
- practical vs reflective orientation
- narrative vs instructional style
- prerequisite knowledge level

Primary use:

- outcome fit
- time fit
- user preference matching
- explanation generation

### Layer 3: Anti-DNF Signals

Required before serious recommendation tuning:

- slow-start risk
- density risk
- abstraction level
- chapter length pattern
- examples/case-study frequency
- common abandonment reasons observed from users

Primary use:

- DNF risk penalties
- "why this may not fit" explanations
- admin drop-off analysis

### Layer 4: External Data Connectors

Candidate sources:

- Google Books API for bibliographic metadata and descriptions
- Open Library for open catalog metadata
- manual admin edits for product-specific outcome metadata
- later: embeddings from descriptions and notes for semantic matching

External data should not directly overwrite product metadata. Imported records should enter a reviewable draft state or update only fields marked as externally sourced.

## Data Model Direction

Add these fields to `Book` in staged migrations:

- `subtitle`
- `publishedYear`
- `language`
- `sourceIds`
- `enrichmentStatus`: `seeded`, `imported`, `reviewed`, `needs-review`
- `styleTags`
- `riskTags`
- `metadataSources`

Keep outcome, pacing, difficulty, depth, and estimated minutes as first-class fields because the recommendation engine depends on them directly.

## Admin Workflow

1. Import or seed candidate books.
2. Deduplicate by ISBN first, then normalized title and author.
3. Mark imported records as `needs-review`.
4. Admin reviews outcome tags, pacing, difficulty, depth, and risk tags.
5. Reviewed records become recommendation-eligible.

## Day 5 Candidate Work

- Add book detail endpoint and admin detail view.
- Extend `Book` schema with `publishedYear`, `language`, `styleTags`, `riskTags`, and `enrichmentStatus`.
- Add validation constants for enrichment status and style/risk tags.
- Add a small manual enrichment patch for the current five seeded books.
- Keep external API import as a separate task after manual enrichment fields stabilize.
