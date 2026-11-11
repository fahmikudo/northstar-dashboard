import { useMemo, type ReactNode } from 'react';
import { Theme } from '@astryxdesign/core/theme';
import { defaultThemeSlug, themes } from '../astryx-themes';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  isThemeMode,
  THEME_MODE_STORAGE_KEY,
  type ThemeMode,
} from '@/styles/theme';
import {
  ThemeModeContext,
  type ThemeModeContextValue,
} from './themeContextValue';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [storedMode, setStoredMode] = useLocalStorage<string>(
    THEME_MODE_STORAGE_KEY,
    'system',
  );
  const mode: ThemeMode = isThemeMode(storedMode) ? storedMode : 'system';

  const value = useMemo<ThemeModeContextValue>(
    () => ({ mode, setMode: setStoredMode }),
    [mode, setStoredMode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <Theme theme={themes[defaultThemeSlug]} mode={mode}>
        {children}
      </Theme>
    </ThemeModeContext.Provider>
  );
}
