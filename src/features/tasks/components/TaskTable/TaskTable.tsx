import { useMemo } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { HStack } from '@astryxdesign/core/Stack';
import { EyeIcon } from '@heroicons/react/24/outline';
import {
  Table,
  pixel,
  proportional,
  type TableColumn,
} from '@astryxdesign/core/Table';
import { Text } from '@astryxdesign/core/Text';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { TaskWithRelations } from '@/types/task.types';
import { PRIORITY_LABELS } from '@/utils/constants';
import { formatShortDate } from '@/utils/formatDate';

export function TaskTable({
  tasks,
  onComplete,
  onOpen,
}: {
  tasks: TaskWithRelations[];
  onComplete: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const columns = useMemo<TableColumn<TaskWithRelations>[]>(
    () => [
      {
        key: 'title',
        header: 'Task',
        width: proportional(2),
        renderCell: task => <Text type="body">{task.title}</Text>,
      },
      { key: 'projectName', header: 'Project', width: pixel(160) },
      { key: 'assigneeName', header: 'Assignee', width: pixel(150) },
      {
        key: 'priority',
        header: 'Priority',
        width: pixel(100),
        renderCell: task => (
          <Text type="supporting" color="secondary">
            {PRIORITY_LABELS[task.priority]}
          </Text>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        width: pixel(120),
        renderCell: task => <StatusBadge status={task.status} />,
      },
      {
        key: 'dueDate',
        header: 'Due',
        width: pixel(110),
        renderCell: task => (
          <Text
            type="supporting"
            color={task.isOverdue ? 'accent' : 'secondary'}
          >
            {formatShortDate(task.dueDate)}
          </Text>
        ),
      },
      {
        key: 'actions',
        header: '',
        width: pixel(170),
        renderCell: task => (
          <HStack gap={1} vAlign="center">
            <IconButton
              label="Open task details"
              tooltip="Open task details"
              icon={<Icon icon={EyeIcon} size="sm" />}
              variant="ghost"
              size="sm"
              onClick={() => onOpen(task.id)}
            />
            {task.status === 'done' ? (
              <Text type="supporting" color="secondary">
                Completed
              </Text>
            ) : (
              <Button
                label="Mark done"
                variant="ghost"
                size="sm"
                onClick={() => onComplete(task.id)}
              />
            )}
          </HStack>
        ),
      },
    ],
    [onComplete, onOpen],
  );

  return (
    <Table<TaskWithRelations>
      data={tasks}
      columns={columns}
      idKey="id"
      density="compact"
      dividers="rows"
      hasHover
    />
  );
}
