import { Card } from '@astryxdesign/core/Card';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import { VStack } from '@astryxdesign/core/Stack';
import { Switch } from '@astryxdesign/core/Switch';
import { Heading, Text } from '@astryxdesign/core/Text';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { THEME_MODES, THEME_MODE_LABELS, type ThemeMode } from '@/styles/theme';

interface NotificationPrefs {
  weeklyDigest: boolean;
  riskAlerts: boolean;
  mentions: boolean;
}

const defaultPrefs: NotificationPrefs = {
  weeklyDigest: true,
  riskAlerts: true,
  mentions: false,
};

export function PreferencesForm() {
  const { mode, setMode } = useThemeMode();
  const [prefs, setPrefs] = useLocalStorage<NotificationPrefs>(
    'northstar.notification-prefs',
    defaultPrefs,
  );

  return (
    <Card>
      <VStack gap={4}>
        <VStack gap={1}>
          <Heading level={2}>Preferences</Heading>
          <Text type="supporting" color="secondary">
            Appearance and notifications save automatically.
          </Text>
        </VStack>
        <VStack gap={1}>
          <Text type="label">Appearance</Text>
          <SegmentedControl
            label="Color theme"
            value={mode}
            onChange={value => setMode(value as ThemeMode)}
          >
            {THEME_MODES.map(themeMode => (
              <SegmentedControlItem
                key={themeMode}
                value={themeMode}
                label={THEME_MODE_LABELS[themeMode]}
              />
            ))}
          </SegmentedControl>
        </VStack>
        <VStack gap={3}>
          <Switch
            label="Weekly digest"
            description="A Monday summary of delivery health and upcoming due dates."
            value={prefs.weeklyDigest}
            onChange={value =>
              setPrefs(current => ({ ...current, weeklyDigest: value }))
            }
          />
          <Switch
            label="Risk alerts"
            description="Email me when a project is marked at risk or misses its target date."
            value={prefs.riskAlerts}
            onChange={value =>
              setPrefs(current => ({ ...current, riskAlerts: value }))
            }
          />
          <Switch
            label="Mentions"
            description="Notify me when a teammate mentions me in a task or comment."
            value={prefs.mentions}
            onChange={value =>
              setPrefs(current => ({ ...current, mentions: value }))
            }
          />
        </VStack>
      </VStack>
    </Card>
  );
}
