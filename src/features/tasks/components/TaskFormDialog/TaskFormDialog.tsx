import { useState } from 'react';
import type { ISODateString } from '@astryxdesign/core/Calendar';
import { Button } from '@astryxdesign/core/Button';
import { DateInput } from '@astryxdesign/core/DateInput';
import { FormLayout } from '@astryxdesign/core/FormLayout';
import { Selector } from '@astryxdesign/core/Selector';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { useToast } from '@astryxdesign/core/Toast';
import { Modal } from '@/components/common/Modal';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { useTeamMembers } from '@/features/projects/hooks/useProjects';
import { useAppStore } from '@/store';
import type { FieldErrors } from '@/types/api.types';
import type { Priority } from '@/types/project.types';
import type { NewTaskInput } from '@/types/task.types';
import { PRIORITIES, PRIORITY_LABELS } from '@/utils/constants';
import { isoDaysFromNow } from '@/utils/formatDate';
import { hasErrors, validateTaskInput } from '@/utils/validators';

const initialInput = (projectId: string, assigneeId: string): NewTaskInput => ({
  title: '',
  description: '',
  projectId,
  assigneeId,
  priority: 'medium',
  dueDate: isoDaysFromNow(7),
});

export function TaskFormDialog({
  isOpen,
  onOpenChange,
  defaultProjectId,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  defaultProjectId?: string;
}) {
  const projects = useAppStore(state => state.projects);
  const addTask = useAppStore(state => state.addTask);
  const addNotification = useAppStore(state => state.addNotification);
  const members = useTeamMembers();
  const toast = useToast();
  const [input, setInput] = useState<NewTaskInput>(() =>
    initialInput(
      defaultProjectId ?? projects[0]?.id ?? '',
      members[0]?.id ?? '',
    ),
  );
  const [errors, setErrors] = useState<FieldErrors<NewTaskInput>>({});
  const [editorKey, setEditorKey] = useState(0);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setInput(
        initialInput(
          defaultProjectId ?? projects[0]?.id ?? '',
          members[0]?.id ?? '',
        ),
      );
      setErrors({});
      setEditorKey(current => current + 1);
    }
    onOpenChange(open);
  }

  function update<K extends keyof NewTaskInput>(
    key: K,
    value: NewTaskInput[K],
  ) {
    setInput(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const nextInput = {
      ...input,
      projectId: defaultProjectId ?? input.projectId,
    };
    const nextErrors = validateTaskInput(nextInput);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }
    addTask(nextInput);
    addNotification({ title: 'Task created', body: nextInput.title });
    toast({ body: 'Task created', uniqueID: 'task-created' });
    handleOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title="New task"
      subtitle="Tasks start in To do and show up on the selected project."
      footer={
        <HStack gap={2} hAlign="end">
          <Button
            label="Cancel"
            variant="secondary"
            onClick={() => handleOpenChange(false)}
          />
          <Button
            label="Create task"
            variant="primary"
            type="submit"
            form="new-task-form"
          />
        </HStack>
      }
    >
      <form id="new-task-form" onSubmit={handleSubmit}>
        <FormLayout>
          <TextInput
            label="Task title"
            value={input.title}
            onChange={value => update('title', value)}
            isRequired
            status={
              errors.title
                ? { type: 'error', message: errors.title }
                : undefined
            }
          />
          <VStack gap={1}>
            <Text type="label">Description</Text>
            <RichTextEditor
              key={editorKey}
              value={input.description}
              onChange={value => update('description', value)}
              label="Task description"
            />
          </VStack>
          <Selector
            label="Project"
            options={projects.map(project => ({
              value: project.id,
              label: project.name,
            }))}
            value={defaultProjectId ?? input.projectId}
            onChange={value => update('projectId', value)}
            isDisabled={Boolean(defaultProjectId)}
            disabledMessage="This task is scoped to the project you are viewing."
          />
          <Selector
            label="Assignee"
            options={members.map(member => ({
              value: member.id,
              label: member.name,
              description: member.role,
            }))}
            value={input.assigneeId}
            onChange={value => update('assigneeId', value)}
            status={
              errors.assigneeId
                ? { type: 'error', message: errors.assigneeId }
                : undefined
            }
          />
          <FormLayout direction="horizontal">
            <Selector
              label="Priority"
              options={PRIORITIES.map(priority => ({
                value: priority,
                label: PRIORITY_LABELS[priority],
              }))}
              value={input.priority}
              onChange={value => update('priority', value as Priority)}
            />
            <DateInput
              label="Due date"
              value={input.dueDate as ISODateString}
              onChange={value => update('dueDate', value ?? '')}
              status={
                errors.dueDate
                  ? { type: 'error', message: errors.dueDate }
                  : undefined
              }
            />
          </FormLayout>
        </FormLayout>
      </form>
    </Modal>
  );
}
