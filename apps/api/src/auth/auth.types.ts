import { Request } from 'express';

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: 'reader' | 'admin';
};

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};
