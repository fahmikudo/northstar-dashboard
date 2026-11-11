import type { StateCreator } from 'zustand';
import type {
  AppNotification,
  NewNotificationInput,
} from '@/types/notification.types';
import { notificationService } from '../../features/notifications/services/notificationService';

export interface NotificationsSlice {
  notifications: AppNotification[];
  addNotification: (input: NewNotificationInput) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const createNotificationsSlice: StateCreator<
  NotificationsSlice,
  [],
  [],
  NotificationsSlice
> = (set, get) => ({
  notifications: notificationService.list(),

  addNotification(input) {
    const notification = notificationService.create(input);
    set({ notifications: [notification, ...get().notifications] });
  },

  markNotificationRead(id) {
    set({ notifications: notificationService.markRead(id) });
  },

  markAllNotificationsRead() {
    set({ notifications: notificationService.markAllRead() });
  },
});
