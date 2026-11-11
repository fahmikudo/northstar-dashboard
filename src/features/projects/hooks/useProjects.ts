import { useCallback, useMemo } from 'react';
import { useAppStore } from '@/store';
import { userService } from '@/services/userService';
import { isOverdue } from '@/utils/formatDate';
import type {
  NewProjectInput,
  Project,
  ProjectWithStats,
} from '@/types/project.types';

export interface ProjectsView {
  projects: ProjectWithStats[];
  addProject: (input: NewProjectInput) => Project;
  completeProject: (id: string) => void;
}

export function useProjects(): ProjectsView {
  const projects = useAppStore(state => state.projects);
  const tasks = useAppStore(state => state.tasks);
  const addProject = useAppStore(state => state.addProject);
  const setProjectStatus = useAppStore(state => state.setProjectStatus);
  const addNotification = useAppStore(state => state.addNotification);

  const projectsWithStats = useMemo(
    () =>
      projects.map(project => {
        const projectTasks = tasks.filter(
          task => task.projectId === project.id,
        );
        const tasksDone = projectTasks.filter(
          task => task.status === 'done',
        ).length;
        const progress =
          projectTasks.length === 0
            ? 0
            : Math.round((tasksDone / projectTasks.length) * 100);

        return {
          ...project,
          tasksTotal: projectTasks.length,
          tasksDone,
          progress,
          isOverdue: isOverdue(project.dueDate),
        };
      }),
    [projects, tasks],
  );

  const completeProject = useCallback(
    (id: string) => {
      setProjectStatus(id, 'completed');
      const project = projects.find(candidate => candidate.id === id);
      if (project) {
        addNotification({ title: 'Project completed', body: project.name });
      }
    },
    [addNotification, projects, setProjectStatus],
  );

  return {
    projects: projectsWithStats,
    addProject,
    completeProject,
  };
}

export function useTeamMembers() {
  return userService.list();
}
