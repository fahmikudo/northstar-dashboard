import { useEffect, useState } from 'react';

/** JSON-backed state that survives reloads and degrades to memory if blocked. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable in private mode; state still works.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
