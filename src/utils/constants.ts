import type { Priority, ProjectStatus } from '@/types/project.types';
import type { TaskStatus } from '@/types/task.types';

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  'planning',
  'active',
  'at-risk',
  'completed',
];

export const TASK_STATUSES: readonly TaskStatus[] = [
  'todo',
  'in-progress',
  'review',
  'done',
];

export const PRIORITIES: readonly Priority[] = [
  'low',
  'medium',
  'high',
  'urgent',
];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: 'Planning',
  active: 'Active',
  'at-risk': 'At risk',
  completed: 'Completed',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  review: 'In review',
  done: 'Done',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

/** Planning weight used to estimate weekly utilization from open tasks. */
export const PRIORITY_HOURS: Record<Priority, number> = {
  low: 2,
  medium: 4,
  high: 6,
  urgent: 8,
};
