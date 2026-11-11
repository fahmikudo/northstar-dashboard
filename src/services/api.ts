import { env } from '@/config/env';
import type { StoreKey } from '@/types/api.types';

function storageKey(key: StoreKey): string {
  return `${env.storagePrefix}.${key}`;
}

/**
 * Local JSON transport for the demo. Swap these three methods for an HTTP
 * client when a backend exists; feature services already speak this shape.
 */
export const storage = {
  read<T>(key: StoreKey, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(storageKey(key));
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },

  write<T>(key: StoreKey, value: T): void {
    try {
      window.localStorage.setItem(storageKey(key), JSON.stringify(value));
    } catch {
      // Private mode or a full quota: keep the in-memory session usable.
    }
  },

  remove(key: StoreKey): void {
    try {
      window.localStorage.removeItem(storageKey(key));
    } catch {
      // Nothing to clean up when storage is unavailable.
    }
  },
};

export function createId(prefix: string): string {
  const suffix =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_${suffix.slice(0, 8)}`;
}
