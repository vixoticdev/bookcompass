# Catalog Enrichment Plan

Date: 2026-05-03

## Goal

BookCompass needs a catalog that is useful for decision-making, not just display. Each book record should carry enough structured metadata for outcome fit, time fit, mood fit, and anti-DNF logic.

The first catalog population target is 1,000 popular books across mixed genres. The target should be broad enough to test recommendation behavior across user moods, outcomes, time budgets, and reading depth preferences, while still small enough for manual quality review.

## Initial 1,000-Book Population Plan

Source mix:

- Open Library: primary discovery source for broad popular candidates and open identifiers.
- Google Books: enrichment source for descriptions, page counts, categories, publication dates, thumbnails, and ratings where available.
- Scrapling: fallback later for allowed pages that lack structured APIs.

Operational note:

- Use `GOOGLE_BOOKS_API_KEY` for real Google Books enrichment runs. Unkeyed requests may be quota-limited.
- If Google Books enrichment fails for a candidate, keep the Open Library draft and mark it for review rather than dropping the book.

Genre mix:

- 20 lanes
- 50 accepted books per lane
- nonfiction, professional, literary, and genre-fiction coverage

Initial lanes:

- business
- self-help
- psychology
- productivity
- leadership
- technology
- science
- philosophy
- history
- biography
- memoir
- literary fiction
- classics
- fantasy
- science fiction
- mystery
- thriller
- romance
- health
- creativity

Popularity approximation:

- Open Library reading-log counts, rating counts, ratings average, and edition count when available.
- Google Books rating count and average rating when available.
- Deduplicate by ISBN first, then normalized title and author.

Review rule:

- Ingested books start as `needs-review`.
- Books become recommendation-eligible only after BookCompass semantic fields are checked.

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

## Ingestion Tooling

The initial ingestion scaffold lives in `tools/catalog-ingestion`.

```bash
npm run catalog:ingest -- --target 1000 --out .local/catalog-drafts.jsonl
```

Small smoke run:

```bash
npm run catalog:ingest -- --target 40 --per-genre 2 --out .local/catalog-smoke.jsonl
```

The output is JSONL draft data, not direct database writes.

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
- Run a 40-book ingestion smoke test and inspect quality.
- Add import-from-draft support only after the draft schema is accepted.
