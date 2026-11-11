import { useState } from 'react';
import type { ISODateString } from '@astryxdesign/core/Calendar';
import { Button } from '@astryxdesign/core/Button';
import { DateInput } from '@astryxdesign/core/DateInput';
import { FormLayout } from '@astryxdesign/core/FormLayout';
import { Selector } from '@astryxdesign/core/Selector';
import { HStack } from '@astryxdesign/core/Stack';
import { TextArea } from '@astryxdesign/core/TextArea';
import { TextInput } from '@astryxdesign/core/TextInput';
import { useToast } from '@astryxdesign/core/Toast';
import { Modal } from '@/components/common/Modal';
import { useAppStore } from '@/store';
import {
  useProjects,
  useTeamMembers,
} from '@/features/projects/hooks/useProjects';
import type { NewProjectInput, Priority } from '@/types/project.types';
import { PRIORITIES, PRIORITY_LABELS } from '@/utils/constants';
import { isoDaysFromNow } from '@/utils/formatDate';
import { hasErrors, validateProjectInput } from '@/utils/validators';
import type { FieldErrors } from '@/types/api.types';

const initialInput = (ownerId: string): NewProjectInput => ({
  name: '',
  description: '',
  ownerId,
  priority: 'medium',
  dueDate: isoDaysFromNow(21),
});

export function ProjectFormDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const members = useTeamMembers();
  const { addProject } = useProjects();
  const addNotification = useAppStore(state => state.addNotification);
  const toast = useToast();
  const [input, setInput] = useState<NewProjectInput>(() =>
    initialInput(members[0]?.id ?? ''),
  );
  const [errors, setErrors] = useState<FieldErrors<NewProjectInput>>({});

  function update<K extends keyof NewProjectInput>(
    key: K,
    value: NewProjectInput[K],
  ) {
    setInput(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const nextErrors = validateProjectInput(input);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }
    addProject(input);
    addNotification({ title: 'Project created', body: input.name });
    toast({ body: 'Project created', uniqueID: 'project-created' });
    setInput(initialInput(members[0]?.id ?? ''));
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="New project"
      subtitle="Set the owner and target date. You can refine details later."
      footer={
        <HStack gap={2} hAlign="end">
          <Button
            label="Cancel"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          />
          <Button
            label="Create project"
            variant="primary"
            type="submit"
            form="new-project-form"
          />
        </HStack>
      }
    >
      <form id="new-project-form" onSubmit={handleSubmit}>
        <FormLayout>
          <TextInput
            label="Project name"
            value={input.name}
            onChange={value => update('name', value)}
            isRequired
            status={
              errors.name ? { type: 'error', message: errors.name } : undefined
            }
          />
          <TextArea
            label="Description"
            value={input.description}
            onChange={value => update('description', value)}
            description="What outcome should this project deliver?"
            status={
              errors.description
                ? { type: 'error', message: errors.description }
                : undefined
            }
          />
          <Selector
            label="Owner"
            options={members.map(member => ({
              value: member.id,
              label: member.name,
              description: member.role,
            }))}
            value={input.ownerId}
            onChange={value => update('ownerId', value)}
            status={
              errors.ownerId
                ? { type: 'error', message: errors.ownerId }
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
              label="Target date"
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
