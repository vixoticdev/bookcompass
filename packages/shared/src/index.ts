export const BOOKCOMPASS_PRODUCT_NAME = 'BookCompass';

export const OUTCOME_KEYS = [
  'better-manager',
  'discipline',
  'startup-thinking',
  'persuasion',
  'emotional-resilience',
  'productivity',
  'leadership',
  'habit-building',
  'technical-learning',
] as const;

export type OutcomeKey = (typeof OUTCOME_KEYS)[number];

export type ReadingDepth = 'quick' | 'balanced' | 'deep';

export type RecommendationSignal = {
  key: string;
  label: string;
  scoreImpact: number;
};
