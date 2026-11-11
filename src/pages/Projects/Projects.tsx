import { useMemo, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Grid } from '@astryxdesign/core/Grid';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import { VStack } from '@astryxdesign/core/Stack';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Icon } from '@astryxdesign/core/Icon';
import { EmptyState } from '@/components/common/EmptyState';
import { PageBreadcrumbs } from '@/components/common/PageBreadcrumbs';
import { PageHeader } from '@/components/common/PageHeader';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { ProjectFormDialog } from '@/features/projects/components/ProjectFormDialog';
import { useProjects } from '@/features/projects/hooks/useProjects';
import type { ProjectStatus } from '@/types/project.types';
import { PROJECT_STATUS_LABELS } from '@/utils/constants';

type StatusFilter = ProjectStatus | 'all';

const FILTERS: readonly { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'planning', label: PROJECT_STATUS_LABELS.planning },
  { value: 'active', label: PROJECT_STATUS_LABELS.active },
  { value: 'at-risk', label: PROJECT_STATUS_LABELS['at-risk'] },
  { value: 'completed', label: PROJECT_STATUS_LABELS.completed },
];

export function Projects() {
  const { projects, completeProject } = useProjects();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const visibleProjects = useMemo(
    () =>
      status === 'all'
        ? projects
        : projects.filter(project => project.status === status),
    [projects, status],
  );

  return (
    <VStack gap={6}>
      <PageHeader
        breadcrumbs={
          <PageBreadcrumbs
            items={[{ label: 'Workspace', href: '/' }, { label: 'Projects' }]}
          />
        }
        title="Projects"
        description="Every initiative in the workspace, with delivery progress and owners."
        actions={
          <Button
            label="New project"
            variant="primary"
            icon={<Icon icon={PlusIcon} size="sm" />}
            onClick={() => setIsDialogOpen(true)}
          />
        }
      />
      <SegmentedControl
        label="Filter projects by status"
        value={status}
        onChange={value => setStatus(value as StatusFilter)}
        size="sm"
      >
        {FILTERS.map(filter => (
          <SegmentedControlItem
            key={filter.value}
            value={filter.value}
            label={filter.label}
          />
        ))}
      </SegmentedControl>
      {visibleProjects.length > 0 ? (
        <Grid columns={{ minWidth: 320, max: 3, repeat: 'fit' }} gap={4}>
          {visibleProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onComplete={completeProject}
            />
          ))}
        </Grid>
      ) : (
        <EmptyState
          title="No projects in this view"
          description="Switch the filter, or start a project to give the team something to rally around."
          action={
            <Button
              label="New project"
              variant="primary"
              icon={<Icon icon={PlusIcon} size="sm" />}
              onClick={() => setIsDialogOpen(true)}
            />
          }
        />
      )}
      <ProjectFormDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </VStack>
  );
}
