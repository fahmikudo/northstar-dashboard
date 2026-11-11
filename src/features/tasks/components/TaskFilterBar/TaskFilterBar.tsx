import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import { Selector } from '@astryxdesign/core/Selector';
import { TextInput } from '@astryxdesign/core/TextInput';
import { HStack } from '@astryxdesign/core/Stack';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Project } from '@/types/project.types';
import type { TaskStatus } from '@/types/task.types';
import { TASK_STATUS_LABELS } from '@/utils/constants';

export function TaskFilterBar({
  status,
  onStatusChange,
  projectId,
  onProjectChange,
  query,
  onQueryChange,
  projects,
  showStatus = true,
}: {
  status: TaskStatus | 'all';
  onStatusChange: (status: TaskStatus | 'all') => void;
  projectId: string | 'all';
  onProjectChange: (projectId: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  projects: Project[];
  showStatus?: boolean;
}) {
  return (
    <HStack
      hAlign={showStatus ? 'between' : 'end'}
      vAlign="end"
      gap={3}
      wrap="wrap"
    >
      {showStatus ? (
        <SegmentedControl
          label="Filter tasks by status"
          value={status}
          onChange={value => onStatusChange(value as TaskStatus | 'all')}
          size="sm"
        >
          <SegmentedControlItem value="all" label="All" />
          <SegmentedControlItem value="todo" label={TASK_STATUS_LABELS.todo} />
          <SegmentedControlItem
            value="in-progress"
            label={TASK_STATUS_LABELS['in-progress']}
          />
          <SegmentedControlItem
            value="review"
            label={TASK_STATUS_LABELS.review}
          />
          <SegmentedControlItem value="done" label={TASK_STATUS_LABELS.done} />
        </SegmentedControl>
      ) : null}
      <HStack gap={2} vAlign="end" wrap="wrap">
        <Selector
          label="Project"
          isLabelHidden
          options={[
            { value: 'all', label: 'All projects' },
            ...projects.map(project => ({
              value: project.id,
              label: project.name,
            })),
          ]}
          value={projectId}
          onChange={onProjectChange}
          size="sm"
          width={190}
        />
        <TextInput
          label="Search tasks"
          isLabelHidden
          type="search"
          placeholder="Search tasks"
          value={query}
          onChange={onQueryChange}
          size="sm"
          width={220}
          startIcon={MagnifyingGlassIcon}
          hasClear
        />
      </HStack>
    </HStack>
  );
}
