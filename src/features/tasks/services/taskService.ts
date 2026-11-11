import { createId, storage } from '@/services/api';
import type {
  NewTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from '@/types/task.types';
import { isoDaysFromNow } from '@/utils/formatDate';

function nowIso(): string {
  return new Date().toISOString();
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

function seedTasks(): Task[] {
  return [
    {
      id: 'tsk_nav',
      title: 'Audit navigation information architecture',
      description:
        'Map the current nav tree, flag dead ends, and propose a shallower structure for the Atlas shell.',
      projectId: 'prj_atlas',
      assigneeId: 'tm_dana',
      status: 'review',
      priority: 'high',
      dueDate: isoDaysFromNow(2),
      createdAt: hoursAgo(120),
      updatedAt: hoursAgo(1),
    },
    {
      id: 'tsk_settings',
      title: 'Rebuild the settings shell',
      description:
        'Replace the legacy settings page with Astryx sections, shared form patterns, and a single save flow.',
      projectId: 'prj_atlas',
      assigneeId: 'tm_marcus',
      status: 'in-progress',
      priority: 'high',
      dueDate: isoDaysFromNow(9),
      createdAt: hoursAgo(96),
      updatedAt: hoursAgo(4),
    },
    {
      id: 'tsk_tokens',
      title: 'Migrate legacy color tokens',
      description:
        'Swap hardcoded colors for Astryx tokens and remove the old palette overrides.\n\n## Acceptance criteria\n\n- Every color maps to an Astryx token\n- No hardcoded hex values remain',
      projectId: 'prj_atlas',
      assigneeId: 'tm_priya',
      status: 'todo',
      priority: 'medium',
      dueDate: isoDaysFromNow(12),
      createdAt: hoursAgo(80),
      updatedAt: hoursAgo(22),
    },
    {
      id: 'tsk_a11y',
      title: 'QA keyboard and screen-reader flows',
      description:
        'Run keyboard-only and screen-reader passes across the redesigned shell and file blockers.',
      projectId: 'prj_atlas',
      assigneeId: 'tm_leo',
      status: 'todo',
      priority: 'medium',
      dueDate: isoDaysFromNow(15),
      createdAt: hoursAgo(70),
      updatedAt: hoursAgo(30),
    },
    {
      id: 'tsk_invoice',
      title: 'Ship invoice export endpoint',
      description:
        'Add CSV export for invoices with date filtering and a signed download URL.',
      projectId: 'prj_billing',
      assigneeId: 'tm_marcus',
      status: 'in-progress',
      priority: 'urgent',
      dueDate: isoDaysFromNow(1),
      createdAt: hoursAgo(150),
      updatedAt: hoursAgo(2),
    },
    {
      id: 'tsk_retry',
      title: 'Handle retries for failed charges',
      description:
        'Retry failed charges with exponential backoff and surface final failures to support.',
      projectId: 'prj_billing',
      assigneeId: 'tm_marcus',
      status: 'review',
      priority: 'urgent',
      dueDate: isoDaysFromNow(3),
      createdAt: hoursAgo(140),
      updatedAt: hoursAgo(6),
    },
    {
      id: 'tsk_catalog',
      title: 'Migrate the price catalog',
      description:
        'Move plans and add-ons into the new price catalog without changing billed amounts.',
      projectId: 'prj_billing',
      assigneeId: 'tm_leo',
      status: 'todo',
      priority: 'high',
      dueDate: isoDaysFromNow(5),
      createdAt: hoursAgo(130),
      updatedAt: hoursAgo(18),
    },
    {
      id: 'tsk_tax',
      title: 'Reconcile tax rules by region',
      description:
        'Audit regional tax rules and reconcile differences before the billing cutover.',
      projectId: 'prj_billing',
      assigneeId: 'tm_avery',
      status: 'todo',
      priority: 'medium',
      dueDate: isoDaysFromNow(8),
      createdAt: hoursAgo(110),
      updatedAt: hoursAgo(40),
    },
    {
      id: 'tsk_carousel',
      title: 'Write onboarding carousel copy',
      description:
        'Write the four first-run screens and align tone with the mobile launch brief.',
      projectId: 'prj_onboarding',
      assigneeId: 'tm_dana',
      status: 'done',
      priority: 'low',
      dueDate: isoDaysFromNow(-3),
      createdAt: hoursAgo(200),
      updatedAt: hoursAgo(50),
    },
    {
      id: 'tsk_apple',
      title: 'Add Sign in with Apple',
      description:
        'Add Apple sign-in to the mobile app and link existing accounts by verified email.',
      projectId: 'prj_onboarding',
      assigneeId: 'tm_priya',
      status: 'in-progress',
      priority: 'high',
      dueDate: isoDaysFromNow(10),
      createdAt: hoursAgo(90),
      updatedAt: hoursAgo(8),
    },
    {
      id: 'tsk_deeplink',
      title: 'Support Android deep links',
      description:
        'Wire deep links for onboarding, projects, and task detail in the Android app.',
      projectId: 'prj_onboarding',
      assigneeId: 'tm_marcus',
      status: 'todo',
      priority: 'medium',
      dueDate: isoDaysFromNow(20),
      createdAt: hoursAgo(60),
      updatedAt: hoursAgo(44),
    },
    {
      id: 'tsk_glossary',
      title: 'Define the metric glossary',
      description:
        'Define every metric name, formula, and owner for Insights v2.',
      projectId: 'prj_insights',
      assigneeId: 'tm_avery',
      status: 'in-progress',
      priority: 'medium',
      dueDate: isoDaysFromNow(14),
      createdAt: hoursAgo(48),
      updatedAt: hoursAgo(12),
    },
    {
      id: 'tsk_charts',
      title: 'Set a chart performance budget',
      description:
        'Set render and data budgets for dashboard charts and document the perf test.',
      projectId: 'prj_insights',
      assigneeId: 'tm_dana',
      status: 'todo',
      priority: 'low',
      dueDate: isoDaysFromNow(28),
      createdAt: hoursAgo(36),
      updatedAt: hoursAgo(36),
    },
    {
      id: 'tsk_macros',
      title: 'Launch the macro library',
      description:
        'Ship shared reply macros and usage guidance for the support team.',
      projectId: 'prj_support',
      assigneeId: 'tm_leo',
      status: 'done',
      priority: 'medium',
      dueDate: isoDaysFromNow(-12),
      createdAt: hoursAgo(400),
      updatedAt: hoursAgo(120),
    },
    {
      id: 'tsk_csat',
      title: 'Ship CSAT survey',
      description:
        'Add the post-resolution CSAT survey and route results into support reporting.',
      projectId: 'prj_support',
      assigneeId: 'tm_avery',
      status: 'done',
      priority: 'low',
      dueDate: isoDaysFromNow(-15),
      createdAt: hoursAgo(380),
      updatedAt: hoursAgo(130),
    },
    {
      id: 'tsk_sunset',
      title: 'Announce the v1 sunset',
      description:
        'Publish the deprecation timeline and migration guide for API v1 consumers.',
      projectId: 'prj_api',
      assigneeId: 'tm_priya',
      status: 'in-progress',
      priority: 'medium',
      dueDate: isoDaysFromNow(7),
      createdAt: hoursAgo(72),
      updatedAt: hoursAgo(16),
    },
    {
      id: 'tsk_instrument',
      title: 'Instrument remaining v1 traffic',
      description:
        'Tag remaining v1 endpoints and dashboards so the sunset can be verified.',
      projectId: 'prj_api',
      assigneeId: 'tm_marcus',
      status: 'todo',
      priority: 'low',
      dueDate: isoDaysFromNow(18),
      createdAt: hoursAgo(64),
      updatedAt: hoursAgo(52),
    },
  ];
}

function listTasks(): Task[] {
  return storage.read<Task[]>('tasks', seedTasks());
}

export const taskService = {
  list(): Task[] {
    return listTasks();
  },

  create(input: NewTaskInput): Task {
    const task: Task = {
      ...input,
      id: createId('tsk'),
      status: 'todo',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    storage.write('tasks', [task, ...listTasks()]);
    return task;
  },

  remove(id: string): Task[] {
    const next = listTasks().filter(task => task.id !== id);
    storage.write('tasks', next);
    return next;
  },

  update(id: string, patch: UpdateTaskInput): Task[] {
    const next = listTasks().map(task =>
      task.id === id ? { ...task, ...patch, updatedAt: nowIso() } : task,
    );
    storage.write('tasks', next);
    return next;
  },

  setStatus(id: string, status: TaskStatus): Task[] {
    const next = listTasks().map(task =>
      task.id === id ? { ...task, status, updatedAt: nowIso() } : task,
    );
    storage.write('tasks', next);
    return next;
  },
};
