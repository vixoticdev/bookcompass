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

export const READING_DEPTHS = ['quick', 'balanced', 'deep'] as const;
export type ReadingDepth = (typeof READING_DEPTHS)[number];

export const READING_EVENT_TYPES = [
  'started',
  'liked',
  'disliked',
  'completed',
  'abandoned',
  'saved',
] as const;
export type ReadingEventType = (typeof READING_EVENT_TYPES)[number];

export const READING_STATUSES = [
  'want-to-read',
  'reading',
  'completed',
  'dnf',
  'paused',
] as const;
export type ReadingStatus = (typeof READING_STATUSES)[number];

export const DNF_REASONS = [
  'too-slow',
  'too-difficult',
  'not-relevant',
  'wrong-mood',
  'poor-writing-style',
  'too-long',
  'lost-interest',
  'other',
] as const;
export type DnfReason = (typeof DNF_REASONS)[number];

export const MOOD_KEYS = [
  'curious',
  'focused',
  'stressed',
  'tired',
  'reflective',
  'motivated',
  'open',
] as const;
export type MoodKey = (typeof MOOD_KEYS)[number];

export const ENERGY_LEVELS = ['low', 'medium', 'high'] as const;
export type EnergyLevel = (typeof ENERGY_LEVELS)[number];

export const FOCUS_LEVELS = ['low', 'medium', 'high'] as const;
export type FocusLevel = (typeof FOCUS_LEVELS)[number];

export const BOOK_FORMATS = ['paperback', 'hardcover', 'ebook', 'audiobook'] as const;
export type BookFormat = (typeof BOOK_FORMATS)[number];

export const BOOK_PACING = ['slow', 'moderate', 'fast'] as const;
export type BookPacing = (typeof BOOK_PACING)[number];

export const BOOK_DIFFICULTY = ['easy', 'moderate', 'challenging'] as const;
export type BookDifficulty = (typeof BOOK_DIFFICULTY)[number];

export type RecommendationSignal = {
  key: string;
  label: string;
  scoreImpact: number;
};
