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

export const READING_DEPTHS = ['quick', 'balanced', 'deep'] as const;
export const READING_EVENT_TYPES = [
  'started',
  'liked',
  'disliked',
  'completed',
  'abandoned',
  'saved',
] as const;
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
export const MOOD_KEYS = [
  'curious',
  'focused',
  'stressed',
  'tired',
  'reflective',
  'motivated',
  'open',
] as const;
export const ENERGY_LEVELS = ['low', 'medium', 'high'] as const;
export const FOCUS_LEVELS = ['low', 'medium', 'high'] as const;
export const BOOK_FORMATS = [
  'paperback',
  'hardcover',
  'ebook',
  'audiobook',
] as const;
export const BOOK_PACING = ['slow', 'moderate', 'fast'] as const;
export const BOOK_DIFFICULTY = ['easy', 'moderate', 'challenging'] as const;
