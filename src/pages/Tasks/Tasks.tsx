import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Icon } from '@astryxdesign/core/Icon';
import { Pagination } from '@astryxdesign/core/Pagination';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { useToast } from '@astryxdesign/core/Toast';
import {
  PlusIcon,
  TableCellsIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/common/EmptyState';
import { PageBreadcrumbs } from '@/components/common/PageBreadcrumbs';
import { PageHeader } from '@/components/common/PageHeader';
import { TaskBoard } from '@/features/tasks/components/TaskBoard';
import { TaskDetailDrawer } from '@/features/tasks/components/TaskDetailDrawer';
import { TaskFilterBar } from '@/features/tasks/components/TaskFilterBar';
import { TaskFormDialog } from '@/features/tasks/components/TaskFormDialog';
import { TaskTable } from '@/features/tasks/components/TaskTable';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppStore } from '@/store';
import type { TaskStatus } from '@/types/task.types';

export function Tasks() {
  const [searchParams] = useSearchParams();
  const projectParam = searchParams.get('project') ?? 'all';
  const taskParam = searchParams.get('task');
  const [status, setStatus] = useState<TaskStatus | 'all'>('all');
  const [projectId, setProjectId] = useState(projectParam);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 250);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [view, setView] = useState<'board' | 'table'>('board');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    taskParam,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(Boolean(taskParam));
  const toast = useToast();
  const addNotification = useAppStore(state => state.addNotification);

  const { tasks, total, projects, setTaskStatus } = useTasks({
    status: view === 'board' ? 'all' : status,
    projectId,
    query: debouncedQuery,
  });

  const activeProject = projects.find(project => project.id === projectParam);
  const breadcrumbItems = activeProject
    ? [
        { label: 'Workspace', href: '/' },
        { label: 'Projects', href: '/projects' },
        { label: activeProject.name },
        { label: 'Tasks' },
      ]
    : [{ label: 'Workspace', href: '/' }, { label: 'Tasks' }];

  function clearFilters() {
    setStatus('all');
    setProjectId('all');
    setQuery('');
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(tasks.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedTasks = tasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function completeTask(id: string) {
    const task = tasks.find(candidate => candidate.id === id);
    if (!task) {
      return;
    }
    const previousStatus = task.status;
    setTaskStatus(id, 'done');
    addNotification({ title: 'Task completed', body: task.title });
    const dismiss = toast({
      body: 'Task completed',
      endContent: (
        <Button
          label="Undo"
          variant="ghost"
          size="sm"
          onClick={() => {
            setTaskStatus(id, previousStatus);
            dismiss();
          }}
        />
      ),
      isAutoHide: false,
      uniqueID: `task-done-${id}`,
    });
  }

  function openTask(id: string) {
    setSelectedTaskId(id);
    setIsDrawerOpen(true);
  }

  function moveTask(id: string, nextStatus: TaskStatus) {
    if (nextStatus === 'done') {
      completeTask(id);
      return;
    }
    setTaskStatus(id, nextStatus);
  }

  return (
    <VStack gap={6}>
      <PageHeader
        breadcrumbs={<PageBreadcrumbs items={breadcrumbItems} />}
        title="Tasks"
        description="Everything in flight, filterable by project, status, and assignee."
        actions={
          <HStack gap={3} vAlign="center">
            <SegmentedControl
              label="Task view"
              value={view}
              onChange={value => setView(value as 'board' | 'table')}
              size="sm"
            >
              <SegmentedControlItem
                value="board"
                label="Board"
                icon={<Icon icon={ViewColumnsIcon} size="sm" />}
              />
              <SegmentedControlItem
                value="table"
                label="Table"
                icon={<Icon icon={TableCellsIcon} size="sm" />}
              />
            </SegmentedControl>
            <Button
              label="New task"
              variant="primary"
              icon={<Icon icon={PlusIcon} size="sm" />}
              onClick={() => setIsDialogOpen(true)}
            />
          </HStack>
        }
      />
      <Card>
        <VStack gap={4}>
          <TaskFilterBar
            status={status}
            onStatusChange={value => {
              setStatus(value);
              setPage(1);
            }}
            projectId={projectId}
            onProjectChange={value => {
              setProjectId(value);
              setPage(1);
            }}
            query={query}
            onQueryChange={value => {
              setQuery(value);
              setPage(1);
            }}
            projects={projects}
            showStatus={view === 'table'}
          />
          <Text type="supporting" color="secondary">
            {tasks.length} of {total} tasks
          </Text>
          {view === 'board' ? (
            <TaskBoard tasks={tasks} onMove={moveTask} onOpen={openTask} />
          ) : pagedTasks.length > 0 ? (
            <VStack gap={4}>
              <TaskTable
                tasks={pagedTasks}
                onComplete={completeTask}
                onOpen={openTask}
              />
              {tasks.length > pageSize ? (
                <Pagination
                  page={currentPage}
                  onChange={setPage}
                  totalItems={tasks.length}
                  pageSize={pageSize}
                  pageSizeOptions={[8, 12, 20]}
                  onPageSizeChange={size => {
                    setPageSize(size);
                    setPage(1);
                  }}
                  variant="count"
                  size="sm"
                  label="Task pagination"
                />
              ) : null}
            </VStack>
          ) : (
            <EmptyState
              title="No tasks match these filters"
              description="Clear the search or choose another project to see more work."
              action={
                <Button
                  label="Clear filters"
                  variant="secondary"
                  onClick={clearFilters}
                />
              }
            />
          )}
        </VStack>
      </Card>
      <TaskFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultProjectId={projectParam === 'all' ? undefined : projectParam}
      />
      <TaskDetailDrawer
        key={selectedTaskId ?? 'none'}
        taskId={selectedTaskId}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </VStack>
  );
}
