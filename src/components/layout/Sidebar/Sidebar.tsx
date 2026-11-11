import { useState } from 'react';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Center } from '@astryxdesign/core/Center';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import {
  SideNav,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import {
  ArrowRightStartOnRectangleIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  Cog6ToothIcon as Cog6ToothSolidIcon,
  FolderIcon as FolderSolidIcon,
  HomeIcon as HomeSolidIcon,
  UsersIcon as UsersSolidIcon,
} from '@heroicons/react/24/solid';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { RouterLink } from '@/routes/RouterLink';
import { useAppStore } from '@/store';

export function Sidebar() {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const projects = useAppStore(state => state.projects);
  const tasks = useAppStore(state => state.tasks);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const activeProjects = projects.filter(
    project => project.status !== 'completed',
  ).length;
  const openTasks = tasks.filter(task => task.status !== 'done').length;

  const avatar = (
    <Avatar name={user?.name ?? 'Teammate'} size="sm" alt="" tooltip={false} />
  );

  const signOutButton = (
    <IconButton
      label="Sign out"
      tooltip="Sign out"
      icon={<Icon icon={ArrowRightStartOnRectangleIcon} size="sm" />}
      variant="ghost"
      size="sm"
      onClick={signOut}
    />
  );

  const identity = (
    <HStack gap={2} vAlign="center">
      {avatar}
      <VStack gap={0}>
        <Text type="supporting">{user?.name ?? 'Teammate'}</Text>
        <Text type="supporting" color="secondary">
          {user?.email ?? 'Not signed in'}
        </Text>
      </VStack>
    </HStack>
  );

  return (
    <>
      <SideNav
        collapsible={{
          isCollapsed,
          onCollapsedChange: setIsCollapsed,
          hasButton: false,
        }}
        footer={
          isCollapsed ? (
            <Center padding={2}>
              <VStack gap={1} hAlign="center">
                {avatar}
                {signOutButton}
              </VStack>
            </Center>
          ) : (
            <HStack gap={2} hAlign="between" padding={2} vAlign="center">
              {identity}
              {signOutButton}
            </HStack>
          )
        }
      >
        <SideNavSection title="Workspace" isHeaderHidden>
          <SideNavItem
            as={RouterLink}
            label="Overview"
            icon={HomeIcon}
            selectedIcon={HomeSolidIcon}
            href="/"
            isSelected={pathname === '/'}
          />
          <SideNavItem
            as={RouterLink}
            label="Projects"
            icon={FolderIcon}
            selectedIcon={FolderSolidIcon}
            href="/projects"
            isSelected={pathname === '/projects'}
            endContent={<Text type="supporting">{activeProjects}</Text>}
          />
          <SideNavItem
            as={RouterLink}
            label="Tasks"
            icon={CheckCircleIcon}
            selectedIcon={CheckCircleSolidIcon}
            href="/tasks"
            isSelected={pathname === '/tasks'}
            endContent={<Text type="supporting">{openTasks}</Text>}
          />
          <SideNavItem
            as={RouterLink}
            label="Team"
            icon={UsersIcon}
            selectedIcon={UsersSolidIcon}
            href="/team"
            isSelected={pathname === '/team'}
          />
        </SideNavSection>
        <SideNavSection title="Account">
          <SideNavItem
            as={RouterLink}
            label="Settings"
            icon={Cog6ToothIcon}
            selectedIcon={Cog6ToothSolidIcon}
            href="/settings"
            isSelected={pathname === '/settings'}
          />
        </SideNavSection>
      </SideNav>
      {isDesktop ? (
        <IconButton
          label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          tooltip={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          icon={
            <Icon
              icon={isCollapsed ? ChevronRightIcon : ChevronLeftIcon}
              size="sm"
            />
          }
          variant="secondary"
          size="sm"
          elevation="low"
          className={`app-sidebar-toggle ${
            isCollapsed
              ? 'app-sidebar-toggle--collapsed'
              : 'app-sidebar-toggle--expanded'
          }`}
          onClick={() => setIsCollapsed(current => !current)}
        />
      ) : null}
    </>
  );
}
