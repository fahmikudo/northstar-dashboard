import { useState } from 'react';
import { AlertDialog } from '@astryxdesign/core/AlertDialog';
import { Button } from '@astryxdesign/core/Button';
import { DateInput } from '@astryxdesign/core/DateInput';
import { Divider } from '@astryxdesign/core/Divider';
import { Icon } from '@astryxdesign/core/Icon';
import { Drawer, DrawerHeader } from '@astryxdesign/core/Drawer';
import { FormLayout } from '@astryxdesign/core/FormLayout';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { Markdown } from '@astryxdesign/core/Markdown';
import {
  MetadataList,
  MetadataListItem,
} from '@astryxdesign/core/MetadataList';
import { Selector } from '@astryxdesign/core/Selector';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';
import type { ISODateString } from '@astryxdesign/core/Calendar';
import { useAppStore } from '@/store';
import type { Priority } from '@/types/project.types';
import type { Task, TaskStatus } from '@/types/task.types';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { StatusBadge } from '@/components/common/StatusBadge';
import { userService } from '@/services/userService';
import {
  PRIORITIES,
  PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
} from '@/utils/constants';
import { formatRelativeTime } from '@/utils/formatDate';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useToast } from '@astryxdesign/core/Toast';

export function TaskDetailDrawer({
  taskId,
  isOpen,
  onOpenChange,
}: {
  taskId: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const tasks = useAppStore(state => state.tasks);
  const projects = useAppStore(state => state.projects);
  const updateTask = useAppStore(state => state.updateTask);
  const removeTask = useAppStore(state => state.removeTask);
  const toast = useToast();
  const setTaskStatus = useAppStore(state => state.setTaskStatus);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const foundTask = tasks.find(candidate => candidate.id === taskId) ?? null;
  // Keep the last task rendered while the drawer slides out after deletion.
  const [lastTask] = useState<Task | null>(foundTask);
  const task = foundTask ?? lastTask;

  if (!task) {
    return null;
  }

  const project = projects.find(candidate => candidate.id === task.projectId);
  const members = userService.list();

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        label="Task details"
        width={520}
      >
        <Layout
          header={
            <DrawerHeader
              title={task.title}
              subtitle={project?.name}
              onOpenChange={onOpenChange}
            />
          }
          content={
            <LayoutContent>
              <VStack gap={5}>
                <FormLayout>
                  <Selector
                    label="Status"
                    options={TASK_STATUSES.map(status => ({
                      value: status,
                      label: TASK_STATUS_LABELS[status],
                    }))}
                    value={task.status}
                    onChange={value =>
                      setTaskStatus(task.id, value as TaskStatus)
                    }
                  />
                  <Selector
                    label="Assignee"
                    options={members.map(member => ({
                      value: member.id,
                      label: member.name,
                      description: member.role,
                    }))}
                    value={task.assigneeId}
                    onChange={value =>
                      updateTask(task.id, { assigneeId: value })
                    }
                  />
                  <FormLayout direction="horizontal">
                    <Selector
                      label="Priority"
                      options={PRIORITIES.map(priority => ({
                        value: priority,
                        label: PRIORITY_LABELS[priority],
                      }))}
                      value={task.priority}
                      onChange={value =>
                        updateTask(task.id, { priority: value as Priority })
                      }
                    />
                    <DateInput
                      label="Due date"
                      value={task.dueDate as ISODateString}
                      onChange={value =>
                        updateTask(task.id, { dueDate: value ?? '' })
                      }
                    />
                  </FormLayout>
                </FormLayout>
                <Divider />
                <TaskDescription
                  key={task.id}
                  task={task}
                  onSave={description => {
                    updateTask(task.id, { description });
                    toast({
                      body: 'Description saved',
                      uniqueID: `description-${task.id}`,
                    });
                  }}
                />
                <Divider />
                <MetadataList title="Details" columns={2}>
                  <MetadataListItem label="Project">
                    {project?.name ?? 'Unknown project'}
                  </MetadataListItem>
                  <MetadataListItem label="Task key">
                    {task.id.replace('tsk_', '').toUpperCase()}
                  </MetadataListItem>
                  <MetadataListItem label="Created">
                    {formatRelativeTime(task.createdAt)}
                  </MetadataListItem>
                  <MetadataListItem label="Updated">
                    {formatRelativeTime(task.updatedAt)}
                  </MetadataListItem>
                </MetadataList>
              </VStack>
            </LayoutContent>
          }
          footer={
            <LayoutFooter>
              <HStack hAlign="between" vAlign="center">
                <StatusBadge status={task.status} />
                <HStack gap={2}>
                  <Button
                    label="Delete"
                    variant="destructive"
                    onClick={() => setIsDeleteOpen(true)}
                  />
                  <Button
                    label="Close"
                    variant="secondary"
                    onClick={() => onOpenChange(false)}
                  />
                  <Button
                    label={task.status === 'done' ? 'Reopen task' : 'Mark done'}
                    variant="primary"
                    onClick={() =>
                      setTaskStatus(
                        task.id,
                        task.status === 'done' ? 'todo' : 'done',
                      )
                    }
                  />
                </HStack>
              </HStack>
            </LayoutFooter>
          }
        />
      </Drawer>
      <AlertDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete this task?"
        description={`"${task.title}" will be permanently removed from ${
          project?.name ?? 'this project'
        }. This cannot be undone.`}
        actionLabel="Delete task"
        cancelLabel="Keep task"
        onAction={() => {
          setIsDeleteOpen(false);
          onOpenChange(false);
          removeTask(task.id);
          toast({
            body: 'Task deleted',
            uniqueID: `task-deleted-${task.id}`,
          });
        }}
      />
    </>
  );
}

function TaskDescription({
  task,
  onSave,
}: {
  task: Task;
  onSave: (description: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.description);

  if (isEditing) {
    return (
      <VStack gap={2}>
        <Heading level={3}>Description</Heading>
        <RichTextEditor
          value={draft}
          onChange={setDraft}
          label="Task description"
          onSubmit={() => {
            onSave(draft.trim());
            setIsEditing(false);
          }}
        />
        <HStack gap={2} hAlign="end">
          <Button
            label="Cancel"
            variant="secondary"
            size="sm"
            onClick={() => {
              setDraft(task.description);
              setIsEditing(false);
            }}
          />
          <Button
            label="Save"
            variant="primary"
            size="sm"
            onClick={() => {
              onSave(draft.trim());
              setIsEditing(false);
            }}
          />
        </HStack>
      </VStack>
    );
  }

  return (
    <VStack gap={2}>
      <HStack hAlign="between" vAlign="center">
        <Heading level={3}>Description</Heading>
        <Button
          label="Edit"
          variant="ghost"
          size="sm"
          icon={<Icon icon={PencilSquareIcon} size="sm" />}
          onClick={() => {
            setDraft(task.description);
            setIsEditing(true);
          }}
        />
      </HStack>
      {task.description.trim() ? (
        <Markdown headingLevelStart={4} density="compact">
          {task.description}
        </Markdown>
      ) : (
        <Text type="body" color="secondary">
          No description yet.
        </Text>
      )}
    </VStack>
  );
}
