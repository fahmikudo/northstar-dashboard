import { AppShell } from '@astryxdesign/core/AppShell';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export function AppShellLayout() {
  return (
    <AppShell contentPadding={6} topNav={<Header />} sideNav={<Sidebar />}>
      <Outlet />
    </AppShell>
  );
}
