import { useMutation, useQuery } from '@tanstack/react-query';
import {
  login,
  createReadingProfile,
  listAuthors,
  listBooks,
  signup,
  type AuthInput,
  type CreateReadingProfileInput,
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
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (input: AuthInput) => {
      const auth = await login(input);
      window.localStorage.setItem('bookcompass.accessToken', auth.accessToken);

      return auth;
    },
  });
}
