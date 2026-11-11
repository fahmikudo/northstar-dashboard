import { useMemo } from 'react';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { userService } from '@/services/userService';
import { useAppStore } from '@/store';
import { TASK_STATUS_LABELS } from '@/utils/constants';
import { daysUntil, formatRelativeTime } from '@/utils/formatDate';
import type { ProjectWithStats } from '@/types/project.types';

export interface DashboardKpis {
  activeProjects: number;
  openTasks: number;
  dueSoon: number;
  completionRate: number;
}

export interface DashboardWorkload {
  name: string;
  openTasks: number;
}

export interface DashboardActivity {
  id: string;
  actorName: string;
  message: string;
  detail: string;
  timestamp: string;
}

const ACTIVITY_VERBS: Record<string, string> = {
  todo: 'queued',
  'in-progress': 'started',
  review: 'sent for review',
  done: 'completed',
};

export function useDashboardData() {
  const tasks = useAppStore(state => state.tasks);
  const { projects } = useProjects();
  const members = userService.list();

  return useMemo(() => {
    const openTasks = tasks.filter(task => task.status !== 'done');
    const completedTasks = tasks.length - openTasks.length;
    const dueSoon = openTasks.filter(task => {
      const days = daysUntil(task.dueDate);
      return days >= 0 && days <= 7;
    }).length;

    const kpis: DashboardKpis = {
      activeProjects: projects.filter(project => project.status !== 'completed')
        .length,
      openTasks: openTasks.length,
      dueSoon,
      completionRate:
        tasks.length === 0
          ? 0
          : Math.round((completedTasks / tasks.length) * 100),
    };

    const workload: DashboardWorkload[] = members
      .map(member => ({
        name: member.name.split(' ')[0],
        openTasks: openTasks.filter(task => task.assigneeId === member.id)
          .length,
      }))
      .sort((left, right) => right.openTasks - left.openTasks);

    const activity: DashboardActivity[] = [...tasks]
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, 6)
      .map(task => {
        const assignee = userService.find(task.assigneeId);
        const project = projects.find(item => item.id === task.projectId);
        const statusLabel =
          TASK_STATUS_LABELS[task.status]?.toLowerCase() ?? task.status;
        return {
          id: task.id,
          actorName: assignee?.name ?? 'Teammate',
          message: `${ACTIVITY_VERBS[task.status] ?? 'updated'} "${task.title}"`,
          detail: `${project?.name ?? 'Unknown project'} · ${statusLabel}`,
          timestamp: formatRelativeTime(task.updatedAt),
        };
      });

    const portfolio: ProjectWithStats[] = [...projects]
      .filter(project => project.status !== 'completed')
      .sort((left, right) => left.dueDate.localeCompare(right.dueDate))
      .slice(0, 5);

    return { kpis, workload, activity, portfolio };
  }, [tasks, projects, members]);
}
