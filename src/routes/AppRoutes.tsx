import { Suspense, type ReactNode } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { Center } from '@astryxdesign/core/Center';
import { Spinner } from '@astryxdesign/core/Spinner';
import { AppShellLayout } from '@/components/layout/AppShellLayout';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { NotFound } from '@/pages/NotFound';
import { ProtectedRoute } from './ProtectedRoute';
import {
  LoginPage,
  OverviewPage,
  ProjectsPage,
  SettingsPage,
  TasksPage,
  TeamPage,
} from './lazyPages';

function Page({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}

/** Remounts Tasks when a deep link (task/project) changes its search params. */
function TasksRoute() {
  const [searchParams] = useSearchParams();
  return <TasksPage key={searchParams.toString()} />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense
            fallback={
              <Center height="100%" padding={6}>
                <Spinner size="lg" label="Loading sign in" />
              </Center>
            }
          >
            <LoginPage />
          </Suspense>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShellLayout />}>
          <Route
            index
            element={
              <Page>
                <OverviewPage />
              </Page>
            }
          />
          <Route
            path="projects"
            element={
              <Page>
                <ProjectsPage />
              </Page>
            }
          />
          <Route
            path="tasks"
            element={
              <Page>
                <TasksRoute />
              </Page>
            }
          />
          <Route
            path="team"
            element={
              <Page>
                <TeamPage />
              </Page>
            }
          />
          <Route
            path="settings"
            element={
              <Page>
                <SettingsPage />
              </Page>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
