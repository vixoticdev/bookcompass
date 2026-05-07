import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAuthor,
  createBook,
  deleteAuthor,
  deleteBook,
  createRecommendationSession,
  createReadingProfile,
  createDnfRecord,
  createReadingEvent,
  getCurrentUser,
  getAdminAnalytics,
  getRecommendationTuning,
  getMyReadingProfile,
  listMyDnfRecords,
  listMyRecommendationSessions,
  listMyReadingEvents,
  login,
  recordRecommendationFeedback,
  listAuthors,
  listBooks,
  signup,
  updateAuthor,
  updateBook,
  updateRecommendationTuning,
  updateMyReadingProfile,
  type AuthInput,
  type CreateAuthorInput,
  type CreateBookInput,
  type CreateReadingProfileInput,
  type DnfRecordInput,
  type RecommendationContext,
  type RecordRecommendationFeedbackInput,
  type ReadingEventInput,
  type SignupInput,
  type UpdateAuthorInput,
  type UpdateBookInput,
  type UpdateRecommendationTuningInput,
} from './api';

export function useAuthors(params: Parameters<typeof listAuthors>[0] = {}) {
  return useQuery({
    queryKey: ['authors', params],
    queryFn: () => listAuthors(params),
  });
}

export function useBooks(params: Parameters<typeof listBooks>[0] = {}) {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => listBooks(params),
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: getAdminAnalytics,
    enabled:
      typeof window !== 'undefined' &&
      Boolean(window.localStorage.getItem('bookcompass.accessToken')),
    retry: false,
  });
}

export function useRecommendationTuning() {
  return useQuery({
    queryKey: ['admin', 'recommendation-tuning'],
    queryFn: getRecommendationTuning,
    enabled:
      typeof window !== 'undefined' &&
      Boolean(window.localStorage.getItem('bookcompass.accessToken')),
    retry: false,
  });
}

export function useUpdateRecommendationTuning() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateRecommendationTuningInput) =>
      updateRecommendationTuning(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'recommendation-tuning'],
      });
    },
  });
}

export function useCreateReadingIdentity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      user: SignupInput;
      profile: Omit<CreateReadingProfileInput, 'userId'>;
    }) => {
      const auth = await signup(input.user);
      window.localStorage.setItem('bookcompass.accessToken', auth.accessToken);
      const profile = await createReadingProfile(input.profile);

      return { user: auth.user, profile };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      void queryClient.invalidateQueries({ queryKey: ['profiles', 'me'] });
    },
  });
}

export function useCreateMyReadingProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReadingProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profiles', 'me'] });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AuthInput) => {
      const auth = await login(input);
      window.localStorage.setItem('bookcompass.accessToken', auth.accessToken);

      return auth;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      void queryClient.invalidateQueries({ queryKey: ['profiles', 'me'] });
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentUser,
    enabled:
      typeof window !== 'undefined' &&
      Boolean(window.localStorage.getItem('bookcompass.accessToken')),
    retry: false,
  });
}

export function useMyReadingProfile() {
  return useQuery({
    queryKey: ['profiles', 'me'],
    queryFn: getMyReadingProfile,
    enabled:
      typeof window !== 'undefined' &&
      Boolean(window.localStorage.getItem('bookcompass.accessToken')),
    retry: false,
  });
}

export function useUpdateMyReadingProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyReadingProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profiles', 'me'] });
    },
  });
}

export function useCreateReadingEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReadingEventInput) => createReadingEvent(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reading-events', 'me'] });
    },
  });
}

export function useCreateDnfRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DnfRecordInput) => createDnfRecord(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['dnf-records', 'me'] });
    },
  });
}

export function useCreateRecommendationSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (context: RecommendationContext) =>
      createRecommendationSession({ context }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['recommendation-sessions', 'me'],
      });
    },
  });
}

export function useMyRecommendationSessions() {
  return useQuery({
    queryKey: ['recommendation-sessions', 'me'],
    queryFn: listMyRecommendationSessions,
    enabled:
      typeof window !== 'undefined' &&
      Boolean(window.localStorage.getItem('bookcompass.accessToken')),
    retry: false,
  });
}

export function useRecordRecommendationFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RecordRecommendationFeedbackInput) =>
      recordRecommendationFeedback(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['recommendation-sessions', 'me'],
      });
      void queryClient.invalidateQueries({ queryKey: ['reading-events', 'me'] });
    },
  });
}

export function useCreateAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAuthorInput) => createAuthor(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
  });
}

export function useUpdateAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { authorId: string; body: UpdateAuthorInput }) =>
      updateAuthor(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['authors'] });
      void queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useDeleteAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (authorId: string) => deleteAuthor(authorId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['authors'] });
      void queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBookInput) => createBook(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['books'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { bookId: string; body: UpdateBookInput }) =>
      updateBook(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['books'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      void queryClient.invalidateQueries({
        queryKey: ['recommendation-sessions', 'me'],
      });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => deleteBook(bookId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['books'] });
      void queryClient.invalidateQueries({ queryKey: ['admin', 'analytics'] });
      void queryClient.invalidateQueries({
        queryKey: ['recommendation-sessions', 'me'],
      });
    },
  });
}

export function useMyReadingEvents() {
  return useQuery({
    queryKey: ['reading-events', 'me'],
    queryFn: listMyReadingEvents,
    enabled:
      typeof window !== 'undefined' &&
      Boolean(window.localStorage.getItem('bookcompass.accessToken')),
    retry: false,
  });
}

export function useMyDnfRecords() {
  return useQuery({
    queryKey: ['dnf-records', 'me'],
    queryFn: listMyDnfRecords,
    enabled:
      typeof window !== 'undefined' &&
      Boolean(window.localStorage.getItem('bookcompass.accessToken')),
    retry: false,
  });
}
