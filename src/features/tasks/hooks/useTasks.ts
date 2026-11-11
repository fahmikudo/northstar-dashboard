import { useMemo } from 'react';
import { useAppStore } from '@/store';
import { userService } from '@/services/userService';
import type { TaskStatus, TaskWithRelations } from '@/types/task.types';
import { isOverdue } from '@/utils/formatDate';

export interface TaskFilterState {
  status: TaskStatus | 'all';
  projectId: string | 'all';
  query: string;
}

export function useTasks(filters: TaskFilterState) {
  const tasks = useAppStore(state => state.tasks);
  const projects = useAppStore(state => state.projects);
  const setTaskStatus = useAppStore(state => state.setTaskStatus);
  const members = userService.list();

  const enrichedTasks = useMemo<TaskWithRelations[]>(
    () =>
      tasks.map(task => {
        const project = projects.find(item => item.id === task.projectId);
        const assignee = userService.find(task.assigneeId);
        return {
          ...task,
          projectName: project?.name ?? 'Unknown project',
          assigneeName: assignee?.name ?? 'Unassigned',
          isOverdue: task.status !== 'done' && isOverdue(task.dueDate),
        };
      }),
    [tasks, projects],
  );

  const visibleTasks = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return enrichedTasks.filter(task => {
      const matchesStatus =
        filters.status === 'all' || task.status === filters.status;
      const matchesProject =
        filters.projectId === 'all' || task.projectId === filters.projectId;
      const matchesQuery =
        query.length === 0 ||
        task.title.toLowerCase().includes(query) ||
        task.projectName.toLowerCase().includes(query) ||
        task.assigneeName.toLowerCase().includes(query);
      return matchesStatus && matchesProject && matchesQuery;
    });
  }, [enrichedTasks, filters.query, filters.status, filters.projectId]);

  return {
    tasks: visibleTasks,
    total: enrichedTasks.length,
    projects,
    members,
    setTaskStatus,
  };
}
