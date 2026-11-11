import { useState, type DragEvent } from 'react';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Badge } from '@astryxdesign/core/Badge';
import { Card } from '@astryxdesign/core/Card';
import { HStack, StackItem, VStack } from '@astryxdesign/core/Stack';
import { Text, Heading } from '@astryxdesign/core/Text';
import { ScrollableArea } from '@astryxdesign/core/ScrollableArea';
import { MoreMenu } from '@astryxdesign/core/MoreMenu';
import type { ComponentProps } from 'react';
import type { Priority } from '@/types/project.types';
import type { TaskStatus, TaskWithRelations } from '@/types/task.types';
import {
  PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
} from '@/utils/constants';
import { formatShortDate } from '@/utils/formatDate';

type BadgeVariant = ComponentProps<typeof Badge>['variant'];

const PRIORITY_VARIANTS: Record<Priority, BadgeVariant> = {
  low: 'teal',
  medium: 'warning',
  high: 'error',
  urgent: 'error',
};

function moveItems(
  task: TaskWithRelations,
  onMove: (id: string, status: TaskStatus) => void,
) {
  return [
    {
      type: 'section' as const,
      title: 'Move to',
      items: TASK_STATUSES.filter(status => status !== task.status).map(
        status => ({
          label: TASK_STATUS_LABELS[status],
          onClick: () => onMove(task.id, status),
        }),
      ),
    },
  ];
}

export function TaskBoard({
  tasks,
  onMove,
  onOpen,
}: {
  tasks: TaskWithRelations[];
  onMove: (id: string, status: TaskStatus) => void;
  onOpen: (id: string) => void;
}) {
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  return (
    <ScrollableArea axis="inline" label="Task board">
      <HStack gap={3} vAlign="start">
        {TASK_STATUSES.map(status => {
          const columnTasks = tasks.filter(task => task.status === status);
          return (
            <StackItem key={status}>
              <Card
                width={300}
                variant="muted"
                padding={3}
                className={
                  overStatus === status ? 'app-kanban-column--over' : undefined
                }
                onDragOver={(event: DragEvent<HTMLDivElement>) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'move';
                  setOverStatus(status);
                }}
                onDragLeave={(event: DragEvent<HTMLDivElement>) => {
                  if (
                    !event.currentTarget.contains(event.relatedTarget as Node)
                  ) {
                    setOverStatus(null);
                  }
                }}
                onDrop={(event: DragEvent<HTMLDivElement>) => {
                  event.preventDefault();
                  const id =
                    event.dataTransfer.getData('text/plain') || draggingId;
                  if (id) {
                    onMove(id, status);
                  }
                  setOverStatus(null);
                  setDraggingId(null);
                }}
              >
                <VStack gap={3}>
                  <HStack gap={2} vAlign="center">
                    <Heading level={3}>{TASK_STATUS_LABELS[status]}</Heading>
                    <Badge
                      variant="neutral"
                      label={String(columnTasks.length)}
                    />
                  </HStack>
                  {columnTasks.length === 0 ? (
                    <Text type="supporting" color="secondary">
                      Drop a task here
                    </Text>
                  ) : (
                    columnTasks.map(task => (
                      <Card
                        key={task.id}
                        padding={3}
                        draggable
                        className="app-kanban-card"
                        onClick={event => {
                          if ((event.target as HTMLElement).closest('button')) {
                            return;
                          }
                          onOpen(task.id);
                        }}
                        onDragStart={(event: DragEvent<HTMLDivElement>) => {
                          setDraggingId(task.id);
                          event.dataTransfer.effectAllowed = 'move';
                          event.dataTransfer.setData('text/plain', task.id);
                        }}
                        onDragEnd={() => {
                          setDraggingId(null);
                          setOverStatus(null);
                        }}
                      >
                        <VStack gap={2}>
                          <HStack hAlign="between" vAlign="start" gap={2}>
                            <Text type="body">{task.title}</Text>
                            <MoreMenu
                              label="Move task"
                              size="sm"
                              items={moveItems(task, onMove)}
                            />
                          </HStack>
                          <HStack gap={2} vAlign="center" wrap="wrap">
                            <Badge
                              variant={PRIORITY_VARIANTS[task.priority]}
                              label={PRIORITY_LABELS[task.priority]}
                            />
                            <Text type="supporting" color="secondary">
                              {task.projectName}
                            </Text>
                          </HStack>
                          <HStack hAlign="between" vAlign="center">
                            <HStack gap={1} vAlign="center">
                              <Avatar
                                name={task.assigneeName}
                                size="xsm"
                                alt=""
                                tooltip={false}
                              />
                              <Text type="supporting" color="secondary">
                                {task.assigneeName}
                              </Text>
                            </HStack>
                            <Text
                              type="supporting"
                              color={task.isOverdue ? 'accent' : 'secondary'}
                            >
                              {formatShortDate(task.dueDate)}
                            </Text>
                          </HStack>
                        </VStack>
                      </Card>
                    ))
                  )}
                </VStack>
              </Card>
            </StackItem>
          );
        })}
      </HStack>
    </ScrollableArea>
  );
}
