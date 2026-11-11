import { Avatar } from '@astryxdesign/core/Avatar';
import { Card } from '@astryxdesign/core/Card';
import { List, ListItem } from '@astryxdesign/core/List';
import { VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';
import type { DashboardActivity } from '@/features/dashboard/hooks/useDashboardData';

export function ActivityFeed({ activity }: { activity: DashboardActivity[] }) {
  return (
    <Card>
      <VStack gap={4}>
        <Heading level={2}>Recent activity</Heading>
        <List hasDividers density="compact">
          {activity.map(item => (
            <ListItem
              key={item.id}
              align="start"
              startContent={<Avatar name={item.actorName} size="sm" />}
              label={
                <Text type="body">
                  {item.actorName} {item.message}
                </Text>
              }
              description={
                <Text type="supporting" color="secondary">
                  {item.detail} · {item.timestamp}
                </Text>
              }
            />
          ))}
        </List>
      </VStack>
    </Card>
  );
}
