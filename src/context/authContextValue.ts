import { createContext } from 'react';
import type { SessionUser } from '@/types/user.types';

export interface AuthContextValue {
  user: SessionUser | null;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<Pick<SessionUser, 'name' | 'email'>>) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
