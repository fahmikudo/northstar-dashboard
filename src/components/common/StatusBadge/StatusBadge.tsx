import { Badge } from '@astryxdesign/core/Badge';
import type { ComponentProps } from 'react';
import type { ProjectStatus } from '@/types/project.types';
import type { TaskStatus } from '@/types/task.types';
import { PROJECT_STATUS_LABELS, TASK_STATUS_LABELS } from '@/utils/constants';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

const STATUS_VARIANTS: Record<ProjectStatus | TaskStatus, BadgeVariant> = {
  planning: 'neutral',
  active: 'blue',
  'at-risk': 'warning',
  completed: 'green',
  todo: 'neutral',
  'in-progress': 'blue',
  review: 'purple',
  done: 'green',
};

const STATUS_LABELS: Record<ProjectStatus | TaskStatus, string> = {
  ...PROJECT_STATUS_LABELS,
  ...TASK_STATUS_LABELS,
};

export function StatusBadge({
  status,
}: {
  status: ProjectStatus | TaskStatus;
}) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} label={STATUS_LABELS[status]} />
  );
}
