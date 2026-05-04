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

export function createReadingProfile(input: CreateReadingProfileInput) {
  return axiosInstance
    .post<ReadingProfile>('/profiles', input)
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw toApiError(error);
    });
}
