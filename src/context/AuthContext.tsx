import { useMemo, useState, type ReactNode } from 'react';
import { authService } from '@/services/authService';
import type { SessionUser } from '@/types/user.types';
import { AuthContext, type AuthContextValue } from './authContextValue';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() =>
    authService.getSession(),
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signIn(email, password) {
        setUser(authService.signIn(email, password));
      },
      signOut() {
        authService.signOut();
        setUser(null);
      },
      updateProfile(patch) {
        setUser(authService.updateSession(patch));
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
