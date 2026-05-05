import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createReadingProfile,
  createDnfRecord,
  createReadingEvent,
  getCurrentUser,
  getMyReadingProfile,
  login,
  listAuthors,
  listBooks,
  signup,
  updateMyReadingProfile,
  type AuthInput,
  type CreateReadingProfileInput,
  type DnfRecordInput,
  type ReadingEventInput,
  type SignupInput,
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
  return useMutation({
    mutationFn: (input: ReadingEventInput) => createReadingEvent(input),
  });
}

export function useCreateDnfRecord() {
  return useMutation({
    mutationFn: (input: DnfRecordInput) => createDnfRecord(input),
  });
}
