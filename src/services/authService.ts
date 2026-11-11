import type { SessionUser } from '@/types/user.types';
import { isEmail, MIN_PASSWORD_LENGTH } from '@/utils/validators';
import { createId, storage } from './api';
import { userService } from './userService';

function nameFromEmail(email: string): string {
  return email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

export const authService = {
  getSession(): SessionUser | null {
    return storage.read<SessionUser | null>('session', null);
  },

  /**
   * Demo authentication: the password is only length-checked, no credential
   * store exists. Replace with a real request when a backend is available.
   */
  signIn(email: string, password: string): SessionUser {
    const normalized = email.trim().toLowerCase();
    if (!isEmail(normalized)) {
      throw new Error('Enter a valid email address.');
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
    }
    const member = userService
      .list()
      .find(candidate => candidate.email.toLowerCase() === normalized);
    const user: SessionUser = member
      ? { id: member.id, name: member.name, email: member.email }
      : {
          id: createId('user'),
          name: nameFromEmail(normalized) || 'Teammate',
          email: normalized,
        };
    storage.write('session', user);
    return user;
  },

  signOut(): void {
    storage.remove('session');
  },

  updateSession(
    patch: Partial<Pick<SessionUser, 'name' | 'email'>>,
  ): SessionUser {
    const current = authService.getSession();
    if (!current) {
      throw new Error('No active session.');
    }
    const next: SessionUser = { ...current, ...patch };
    storage.write('session', next);
    return next;
  },
};
