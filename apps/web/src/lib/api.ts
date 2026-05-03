const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

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
  genres: string[];
  outcomeTags: string[];
  pacing: string;
  difficulty: string;
  depth: string;
  formats: string[];
  pageCount?: number;
  estimatedMinutes?: number;
};

export type CreateUserInput = {
  displayName: string;
  email: string;
  role?: 'reader' | 'admin';
};

export type User = CreateUserInput & {
  _id: string;
};

export type CreateReadingProfileInput = {
  userId: string;
  favoriteGenres?: string[];
  targetOutcomes?: string[];
  preferredDepth?: string;
  pacingTolerance?: string;
  difficultyTolerance?: string;
  preferredFormats?: string[];
  dailyReadingMinutes?: number;
};

export type ReadingProfile = CreateReadingProfileInput & {
  _id: string;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function toQueryString(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(body || response.statusText, response.status);
  }

  return response.json() as Promise<T>;
}

export function listAuthors(params: {
  q?: string;
  genre?: string;
  outcome?: string;
  limit?: number;
  offset?: number;
} = {}) {
  return request<CatalogPage<Author>>(`/authors${toQueryString(params)}`);
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
  return request<CatalogPage<Book>>(`/books${toQueryString(params)}`);
}

export function createUser(input: CreateUserInput) {
  return request<User>('/users', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}

export function createReadingProfile(input: CreateReadingProfileInput) {
  return request<ReadingProfile>('/profiles', {
    body: JSON.stringify(input),
    method: 'POST',
  });
}
