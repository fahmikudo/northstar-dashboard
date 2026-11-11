import { useState } from 'react';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { List, ListItem } from '@astryxdesign/core/List';
import { Popover } from '@astryxdesign/core/Popover';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';
import { BellAlertIcon, BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { formatRelativeTime } from '@/utils/formatDate';

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const panel = (
    <VStack gap={0}>
      <HStack hAlign="between" vAlign="center" padding={3}>
        <HStack gap={2} vAlign="center">
          <Heading level={3}>Notifications</Heading>
          {unreadCount > 0 ? (
            <Badge variant="blue" label={`${unreadCount} new`} />
          ) : null}
        </HStack>
        <Button
          label="Mark all read"
          variant="ghost"
          size="sm"
          isDisabled={unreadCount === 0}
          onClick={markAllNotificationsRead}
        />
      </HStack>
      <Divider />
      {notifications.length === 0 ? (
        <VStack gap={1} padding={4}>
          <Text type="body">You are all caught up.</Text>
          <Text type="supporting" color="secondary">
            New task and project activity will show up here.
          </Text>
        </VStack>
      ) : (
        <List density="compact" hasDividers className="app-notification-list">
          {notifications.map(notification => (
            <ListItem
              key={notification.id}
              align="start"
              startContent={
                <Icon
                  icon={notification.isRead ? BellIcon : BellAlertIcon}
                  size="sm"
                  color={notification.isRead ? 'secondary' : 'accent'}
                />
              }
              onClick={() => markNotificationRead(notification.id)}
              label={
                <Text
                  type="body"
                  weight={notification.isRead ? 'normal' : 'medium'}
                >
                  {notification.title}
                </Text>
              }
              description={
                <VStack gap={0}>
                  <Text type="supporting" color="secondary">
                    {notification.body}
                  </Text>
                  <Text type="supporting" color="disabled">
                    {formatRelativeTime(notification.createdAt)}
                  </Text>
                </VStack>
              }
            />
          ))}
        </List>
      )}
    </VStack>
  );

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      label="Notifications"
      placement="below"
      alignment="end"
      width={380}
      padding={0}
      presentation="adaptive"
      content={panel}
    >
      <HStack className="app-notification-trigger">
        <IconButton
          label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : 'Notifications'
          }
          tooltip="Notifications"
          icon={<Icon icon={BellIcon} size="sm" />}
          variant="ghost"
        />
        {unreadCount > 0 ? (
          <Badge
            variant="error"
            label={unreadCount > 9 ? '9+' : String(unreadCount)}
            className="app-notification-badge"
          />
        ) : null}
      </HStack>
    </Popover>
  );
}
