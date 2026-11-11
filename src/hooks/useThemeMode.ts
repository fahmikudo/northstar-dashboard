import { useContext } from 'react';
import { ThemeModeContext } from '@/context/themeContextValue';

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
}
