# Recommendation Engine Documentation

## MVP Strategy

The MVP recommendation engine is deterministic and explainable. It will live inside the NestJS API until the product has enough data to justify a Python AI/ML service.

## Current Backend Foundation

Day 2 added `apps/api/src/recommendations` with `RecommendationSession` storage. It records the user's decision context and reserves structure for candidates, score breakdowns, scoring signals, and explanation lines.

Day 8 adds the first recommendation input aggregator in `RecommendationsService.buildInput`. It gathers the authenticated reader profile, reading events, DNF records, and catalog candidates filtered by selected outcome, preferred depth, and available minutes. The method deliberately does not score candidates yet; it creates the service boundary the deterministic engine will consume next.

Day 9 adds first-pass deterministic scoring. `POST /recommendation-sessions` now builds the Day 8 input, scores up to 50 filtered catalog candidates, persists the top 10 ranked candidates, and stores explanation lines. `GET /recommendation-sessions/me` returns the authenticated reader's history.

Day 10 adds the first feedback loop. `POST /recommendation-sessions/:sessionId/feedback` records accepted, rejected, started, completed, or abandoned status on a candidate in the authenticated reader's own session, then writes a reading event so later scoring can reuse the outcome.

## Inputs

- reading profile
- liked books
- disliked books
- completed books
- abandoned books
- selected outcome
- mood
- energy level
- focus level
- available time
- preferred depth
- recommendation feedback from prior suggestions through derived reading events

Current candidate filter baseline:

- `outcome = selectedOutcome`
- `depth = preferredDepth`
- `estimatedMinutes <= availableMinutes`
- maximum 50 catalog candidates per aggregation call

## Scoring Layers

```text
finalScore =
  outcomeFit
  + personalFit
  + contextFit
  + timeFit
  + behaviorFit
  - dnfRisk
```

Implemented Day 9 scoring signals:

- outcome fit: selected outcome and profile target outcome matches
- personal fit: favorite/disliked genre overlap, depth, pacing, difficulty, and format fit
- context fit: mood, energy, focus, requested depth, and difficulty/depth suitability
- time fit: selected available minutes and weekly reading capacity from the profile
- behavior fit: saved/completed/disliked/abandoned history for the same book
- anti-DNF risk: direct prior DNF is heavily penalized; pacing/difficulty pattern matches receive a smaller penalty; candidates without a matching DNF pattern receive a small positive signal

Day 12 candidate eligibility:

- Recommendation input generation now requests only catalog records with `recommendationEligible: true`.
- Admin book metadata now includes `enrichmentStatus`, `styleTags`, and `riskTags`, giving the review workflow explicit fields for future anti-DNF tuning.

## Explainability Requirement

Every recommendation must include:

- why it matched the selected outcome
- why it fits the user's current context
- which behavior signals influenced the score
- what DNF risk was avoided or accepted

Feedback capture must preserve:

- which candidate book received feedback
- whether the reader accepted, rejected, started, completed, or abandoned it
- when feedback was recorded
- enough behavior-event data for later scoring and analytics

Example:

> Recommended because you selected discipline, completed Deep Work, prefer practical nonfiction, have 30 minutes per day, and tend to abandon slow-paced books after 30%.

## Research and Data References

Potential references for future recommendation engine research, dataset exploration, and model evaluation:

- Reading habits and mood impact dataset: http://kaggle.com/datasets/hanaksoy/reading-habits-and-mood-impact-dataset
- MDPI Data paper, volume 6, issue 8, article 83: https://www.mdpi.com/2306-5729/6/8/83
- Goodreads book datasets, 10M: https://www.kaggle.com/datasets/bahramjannesarr/goodreads-book-datasets-10m

## Phase 2 AI/ML Extension

Future Python service responsibilities:

- embeddings for book summaries and outcome mapping
- collaborative filtering
- DNF prediction
- reader segment clustering
- semantic similarity between books, goals, and user notes
