import { useAppStore } from '@/store';

export function useNotifications() {
  const notifications = useAppStore(state => state.notifications);
  const markNotificationRead = useAppStore(state => state.markNotificationRead);
  const markAllNotificationsRead = useAppStore(
    state => state.markAllNotificationsRead,
  );

  return {
    notifications,
    unreadCount: notifications.filter(notification => !notification.isRead)
      .length,
    markNotificationRead,
    markAllNotificationsRead,
  };
}
