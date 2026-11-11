import { createContext } from 'react';
import type { ThemeMode } from '@/styles/theme';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(
  null,
);
