import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createReadingProfile,
  createUser,
  listAuthors,
  listBooks,
  type CreateReadingProfileInput,
  type CreateUserInput,
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
      user: CreateUserInput;
      profile: Omit<CreateReadingProfileInput, 'userId'>;
    }) => {
      const user = await createUser(input.user);
      const profile = await createReadingProfile({
        ...input.profile,
        userId: user._id,
      });

      return { user, profile };
    },
  });
}
