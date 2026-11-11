function readEnv(key: string, fallback: string): string {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

export const env = {
  appName: readEnv('VITE_APP_NAME', 'Northstar'),
  storagePrefix: readEnv('VITE_STORAGE_PREFIX', 'northstar'),
  isDevelopment: import.meta.env.DEV,
} as const;
