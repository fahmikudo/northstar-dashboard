import { Avatar } from '@astryxdesign/core/Avatar';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { NavIcon } from '@astryxdesign/core/NavIcon';
import { HStack } from '@astryxdesign/core/Stack';
import { TopNav, TopNavHeading } from '@astryxdesign/core/TopNav';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import logoUrl from '@/assets/icons/logo.svg';
import { appConfig } from '@/config/appConfig';
import { useAuth } from '@/hooks/useAuth';
import { useThemeMode } from '@/hooks/useThemeMode';
import { RouterLink } from '@/routes/RouterLink';
import { NotificationBell } from '@/features/notifications';
import { GlobalSearch } from '@/features/search';

export function Header() {
  const { user } = useAuth();
  const { mode, setMode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <TopNav
      label="Product navigation"
      heading={
        <TopNavHeading
          as={RouterLink}
          headingHref="/"
          heading={appConfig.name}
          subheading={appConfig.tagline}
          logo={
            <NavIcon
              icon={<img src={logoUrl} alt="" width={16} height={16} />}
            />
          }
        />
      }
      endContent={
        <HStack gap={2} vAlign="center">
          <GlobalSearch />
          <IconButton
            label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            tooltip={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            icon={<Icon icon={isDark ? SunIcon : MoonIcon} size="sm" />}
            variant="ghost"
            onClick={() => setMode(isDark ? 'light' : 'dark')}
          />
          <NotificationBell />
          <Avatar name={user?.name ?? 'Teammate'} size="sm" />
        </HStack>
      }
    />
  );
}
