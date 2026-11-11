export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
}

export type NewNotificationInput = Pick<AppNotification, 'title' | 'body'>;
