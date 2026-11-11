import { createId, storage } from '@/services/api';
import type {
  AppNotification,
  NewNotificationInput,
} from '@/types/notification.types';

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

function seedNotifications(): AppNotification[] {
  return [
    {
      id: 'ntf_invoice',
      title: "Marcus completed 'Ship invoice export endpoint'",
      body: 'Billing migration · moved to Done',
      createdAt: hoursAgo(1),
      isRead: false,
    },
    {
      id: 'ntf_billing',
      title: 'Billing migration flagged at risk',
      body: 'Due in 6 days — Marcus Webb owns the remaining work.',
      createdAt: hoursAgo(2),
      isRead: false,
    },
    {
      id: 'ntf_review',
      title: 'Priya moved a task to In review',
      body: 'Add Sign in with Apple · Mobile onboarding',
      createdAt: hoursAgo(4),
      isRead: false,
    },
    {
      id: 'ntf_a11y',
      title: "Leo finished 'QA keyboard and screen-reader flows'",
      body: 'Atlas redesign · four blockers filed',
      createdAt: hoursAgo(7),
      isRead: false,
    },
    {
      id: 'ntf_brief',
      title: 'Dana updated the Atlas redesign brief',
      body: 'Navigation audit findings are ready for review.',
      createdAt: hoursAgo(12),
      isRead: true,
    },
    {
      id: 'ntf_carousel',
      title: 'Dana completed onboarding copy',
      body: 'Write onboarding carousel copy · Mobile onboarding',
      createdAt: hoursAgo(26),
      isRead: true,
    },
    {
      id: 'ntf_digest',
      title: 'Weekly digest is ready',
      body: 'Three projects changed status this week.',
      createdAt: hoursAgo(50),
      isRead: true,
    },
    {
      id: 'ntf_added',
      title: 'Avery added you to Insights v2',
      body: 'You are now a member of the Insights v2 project.',
      createdAt: hoursAgo(72),
      isRead: true,
    },
    {
      id: 'ntf_mobile',
      title: 'Mobile onboarding moved to Active',
      body: 'Dana Okafor is the owner; 3 tasks are in flight.',
      createdAt: hoursAgo(96),
      isRead: true,
    },
    {
      id: 'ntf_support',
      title: 'Support workflows completed',
      body: 'All four tasks are done; the project wrapped up early.',
      createdAt: hoursAgo(120),
      isRead: true,
    },
    {
      id: 'ntf_api',
      title: 'API deprecation timeline announced',
      body: 'The v1 sunset is six weeks out. Migration guide attached.',
      createdAt: hoursAgo(144),
      isRead: true,
    },
    {
      id: 'ntf_backlog',
      title: '12 tasks were added to the backlog',
      body: 'Import finished from the legacy tracker.',
      createdAt: hoursAgo(192),
      isRead: true,
    },
    {
      id: 'ntf_settings',
      title: 'Workspace settings updated',
      body: 'Billing owner and default project changed.',
      createdAt: hoursAgo(240),
      isRead: true,
    },
  ];
}

function listNotifications(): AppNotification[] {
  const stored = storage.read<unknown>('inbox', null);
  return Array.isArray(stored)
    ? (stored as AppNotification[])
    : seedNotifications();
}

export const notificationService = {
  list(): AppNotification[] {
    return listNotifications();
  },

  create(input: NewNotificationInput): AppNotification {
    const notification: AppNotification = {
      ...input,
      id: createId('ntf'),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    storage.write('inbox', [notification, ...listNotifications()]);
    return notification;
  },

  markRead(id: string): AppNotification[] {
    const next = listNotifications().map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification,
    );
    storage.write('inbox', next);
    return next;
  },

  markAllRead(): AppNotification[] {
    const next = listNotifications().map(notification => ({
      ...notification,
      isRead: true,
    }));
    storage.write('inbox', next);
    return next;
  },
};
