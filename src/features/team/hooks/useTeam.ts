import { useMemo } from 'react';
import { userService } from '@/services/userService';
import { useAppStore } from '@/store';
import type { TeamMember } from '@/types/user.types';
import { PRIORITY_HOURS } from '@/utils/constants';

export interface TeamMemberStats extends TeamMember, Record<string, unknown> {
  openTasks: number;
  activeProjects: number;
  utilization: number;
}

export function useTeam(): TeamMemberStats[] {
  const tasks = useAppStore(state => state.tasks);
  const projects = useAppStore(state => state.projects);

  return useMemo(
    () =>
      userService.list().map(member => {
        const openTasks = tasks.filter(
          task => task.assigneeId === member.id && task.status !== 'done',
        );
        const plannedHours = openTasks.reduce(
          (total, task) => total + PRIORITY_HOURS[task.priority],
          0,
        );
        const activeProjects = projects.filter(
          project =>
            project.status !== 'completed' &&
            (project.ownerId === member.id ||
              project.memberIds.includes(member.id)),
        ).length;

        return {
          ...member,
          openTasks: openTasks.length,
          activeProjects,
          utilization: Math.round((plannedHours / member.weeklyCapacity) * 100),
        };
      }),
    [tasks, projects],
  );
}
