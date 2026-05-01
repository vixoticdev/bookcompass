# Recommendation Engine Documentation

## MVP Strategy

The MVP recommendation engine is deterministic and explainable. It will live inside the NestJS API until the product has enough data to justify a Python AI/ML service.

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

## Scoring Layers

```text
finalScore =
  outcomeFit
  + personalFit
  + moodFit
  + timeFit
  + collaborativeFit
  - dnfRisk
```

## Explainability Requirement

Every recommendation must include:

- why it matched the selected outcome
- why it fits the user's current context
- which behavior signals influenced the score
- what DNF risk was avoided or accepted

Example:

> Recommended because you selected discipline, completed Deep Work, prefer practical nonfiction, have 30 minutes per day, and tend to abandon slow-paced books after 30%.

## Phase 2 AI/ML Extension

Future Python service responsibilities:

- embeddings for book summaries and outcome mapping
- collaborative filtering
- DNF prediction
- reader segment clustering
- semantic similarity between books, goals, and user notes
