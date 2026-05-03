# Catalog Ingestion

Goal: produce the first 1,000-book BookCompass catalog across mixed genres with enough semantic metadata for recommendation scoring.

This is an API-first ingestion pipeline. It uses Open Library for broad discovery/popularity signals and Google Books for bibliographic enrichment. Scrapling is reserved for later fallback crawlers where no structured API or data dump exists.

## Strategy

1. Pull candidate books by genre from Open Library.
2. Enrich each candidate with Google Books data by ISBN or title/author query.
3. Normalize and deduplicate candidates.
4. Generate BookCompass semantic metadata from source metadata and deterministic heuristics.
5. Export reviewable drafts to JSONL.
6. Import only reviewed records into the live catalog.

## Target Mix

The initial target is 1,000 books:

- 20 genre lanes
- 50 accepted books per lane
- mixed fiction, nonfiction, professional, literary, and genre-fiction coverage

Genre quotas live in `sources.json`.

## Semantic Fields

Each draft should include:

- bibliographic fields: title, subtitle, authors, ISBNs, description, page count, publication year, language, categories
- source fields: Open Library IDs, Google Books IDs, source URLs, source confidence
- recommendation fields: outcome tags, pacing, difficulty, reading depth, estimated minutes, style tags, risk tags
- workflow fields: enrichment status, review notes, duplicate key

## Usage

```bash
node tools/catalog-ingestion/ingest.mjs --target 1000 --out .local/catalog-drafts.jsonl
```

Useful smaller run:

```bash
node tools/catalog-ingestion/ingest.mjs --target 40 --per-genre 2 --out .local/catalog-smoke.jsonl
```

## API Notes

Open Library:

- Use APIs or data dumps, not HTML scraping.
- Include a `User-Agent`.
- Keep calls low and cached.
- For serious bulk import, prefer monthly data dumps.

Google Books:

- Use public volume search/detail data for enrichment.
- Keep requests cached and rate limited.
- Set `GOOGLE_BOOKS_API_KEY` for real ingestion runs. Unkeyed requests can return `429 Too Many Requests`.
- If Google Books is unavailable for a candidate, the script keeps the Open Library draft and logs the skipped enrichment.

## Scrapling Role

Scrapling can be useful later for:

- publisher pages with allowed crawling
- public reading lists with no API
- author bibliography pages
- enrichment gaps not covered by Open Library/Google Books

Scrapling should not be the primary source for book identity or bulk catalog population.
