import { lazy } from 'react';

export const OverviewPage = lazy(() =>
  import('@/pages/Overview').then(module => ({ default: module.Overview })),
);

export const ProjectsPage = lazy(() =>
  import('@/pages/Projects').then(module => ({ default: module.Projects })),
);

export const TasksPage = lazy(() =>
  import('@/pages/Tasks').then(module => ({ default: module.Tasks })),
);

export const TeamPage = lazy(() =>
  import('@/pages/Team').then(module => ({ default: module.Team })),
);

export const SettingsPage = lazy(() =>
  import('@/pages/Settings').then(module => ({ default: module.Settings })),
);

export const LoginPage = lazy(() =>
  import('@/pages/Login').then(module => ({ default: module.Login })),
);
