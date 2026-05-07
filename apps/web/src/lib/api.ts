import { AxiosError } from 'axios';
import { axiosInstance } from './axiosInstance';

export type CatalogPage<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export type Author = {
  _id: string;
  name: string;
  bio?: string;
  knownForGenres: string[];
  outcomeStrengths: string[];
};

export type Book = {
  _id: string;
  title: string;
  authorId: string;
  description?: string;
  subtitle?: string;
  publishedYear?: number;
  language?: string;
  genres: string[];
  outcomeTags: string[];
  pacing: string;
  difficulty: string;
  depth: string;
  formats: string[];
  pageCount?: number;
  estimatedMinutes?: number;
  googleBooksVolumeId?: string;
  thumbnailUrl?: string;
};

export type CreateAuthorInput = {
  name: string;
  bio?: string;
  knownForGenres?: string[];
  outcomeStrengths?: string[];
};

export type CreateBookInput = {
  title: string;
  authorId: string;
  isbn?: string;
  subtitle?: string;
  description?: string;
  publishedYear?: number;
  language?: string;
  genres?: string[];
  outcomeTags?: string[];
  pacing?: string;
  difficulty?: string;
  depth?: string;
  formats?: string[];
  pageCount?: number;
  estimatedMinutes?: number;
  googleBooksVolumeId?: string;
  thumbnailUrl?: string;
};

export type CreateUserInput = {
  displayName: string;
  email: string;
};

export type User = CreateUserInput & {
  _id: string;
  role: 'reader' | 'admin';
};

export type AuthInput = {
  email: string;
  password: string;
};

export type SignupInput = AuthInput & {
  displayName: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type CreateReadingProfileInput = {
  userId?: string;
  favoriteGenres?: string[];
  dislikedGenres?: string[];
  targetOutcomes?: string[];
  preferredDepth?: string;
  pacingTolerance?: string;
  difficultyTolerance?: string;
  preferredFormats?: string[];
  dailyReadingMinutes?: number;
  estimatedWordsPerMinute?: number;
};

export type ReadingProfile = CreateReadingProfileInput & {
  _id: string;
};

export type ReadingEventInput = {
  bookId: string;
  eventType: 'started' | 'liked' | 'disliked' | 'completed' | 'abandoned' | 'saved';
  progressPercent?: number;
  minutesRead?: number;
  note?: string;
};

export type ReadingEvent = ReadingEventInput & {
  _id: string;
  userId: string;
  occurredAt: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DnfRecordInput = {
  bookId: string;
  stoppedAtPercent: number;
  reason:
    | 'too-slow'
    | 'too-difficult'
    | 'not-relevant'
    | 'wrong-mood'
    | 'poor-writing-style'
    | 'too-long'
    | 'lost-interest'
    | 'other';
  pacingSnapshot?: string;
  difficultySnapshot?: string;
  note?: string;
};

export type DnfRecord = DnfRecordInput & {
  _id: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RecommendationContext = {
  selectedOutcome: string;
  mood: string;
  energyLevel: string;
  focusLevel: string;
  availableMinutes: number;
  preferredDepth: string;
};

export type RecommendationSignal = {
  key: string;
  label: string;
  scoreImpact: number;
};

export type RecommendationCandidate = {
  bookId: string;
  finalScore: number;
  scoreBreakdown: Record<string, number>;
  signals: RecommendationSignal[];
  explanation: string[];
};

export type RecommendationSession = {
  _id: string;
  userId: string;
  context: RecommendationContext;
  candidates: RecommendationCandidate[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function cleanParams(params: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
  );
}

function toApiError(error: unknown) {
  if (error instanceof AxiosError) {
    const message =
      typeof error.response?.data === 'string'
        ? error.response.data
        : error.message;

    return new ApiError(message, error.response?.status ?? 0);
  }

  return error;
}

export function listAuthors(params: {
  q?: string;
  genre?: string;
  outcome?: string;
  limit?: number;
  offset?: number;
} = {}) {
  return axiosInstance
    .get<CatalogPage<Author>>('/authors', { params: cleanParams(params) })
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function listBooks(params: {
  q?: string;
  authorId?: string;
  genre?: string;
  outcome?: string;
  pacing?: string;
  difficulty?: string;
  depth?: string;
  format?: string;
  maxEstimatedMinutes?: number;
  limit?: number;
  offset?: number;
} = {}) {
  return axiosInstance
    .get<CatalogPage<Book>>('/books', { params: cleanParams(params) })
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function createAuthor(input: CreateAuthorInput) {
  return axiosInstance
    .post<Author>('/authors', input)
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function createBook(input: CreateBookInput) {
  return axiosInstance
    .post<Book>('/books', input)
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function createUser(input: CreateUserInput) {
  return axiosInstance
    .post<User>('/users', input)
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function signup(input: SignupInput) {
  return axiosInstance
    .post<AuthResponse>('/auth/signup', input)
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function login(input: AuthInput) {
  return axiosInstance
    .post<AuthResponse>('/auth/login', input)
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function getCurrentUser() {
  return axiosInstance
    .get<User>('/auth/me')
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function createReadingProfile(input: CreateReadingProfileInput) {
  return axiosInstance
    .post<ReadingProfile>('/profiles', input)
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function getMyReadingProfile() {
  return axiosInstance
    .get<ReadingProfile>('/profiles/me')
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function updateMyReadingProfile(input: CreateReadingProfileInput) {
  return axiosInstance
    .patch<ReadingProfile>('/profiles/me', input)
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function createReadingEvent(input: ReadingEventInput) {
  return axiosInstance
    .post<ReadingEvent>('/reading-events', input)
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function createDnfRecord(input: DnfRecordInput) {
  return axiosInstance
    .post<DnfRecord>('/dnf-records', input)
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function listMyReadingEvents() {
  return axiosInstance
    .get<ReadingEvent[]>('/reading-events/me')
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function listMyDnfRecords() {
  return axiosInstance
    .get<DnfRecord[]>('/dnf-records/me')
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function createRecommendationSession(input: {
  context: RecommendationContext;
}) {
  return axiosInstance
    .post<RecommendationSession>('/recommendation-sessions', input)
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}

export function listMyRecommendationSessions() {
  return axiosInstance
    .get<RecommendationSession[]>('/recommendation-sessions/me')
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}
