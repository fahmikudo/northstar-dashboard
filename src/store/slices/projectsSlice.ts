import type { StateCreator } from 'zustand';
import type {
  NewProjectInput,
  Project,
  ProjectStatus,
} from '@/types/project.types';
import { projectService } from '../../features/projects/services/projectService';

export interface ProjectsSlice {
  projects: Project[];
  addProject: (input: NewProjectInput) => Project;
  setProjectStatus: (id: string, status: ProjectStatus) => void;
}

export const createProjectsSlice: StateCreator<
  ProjectsSlice,
  [],
  [],
  ProjectsSlice
> = (set, get) => ({
  projects: projectService.list(),

  addProject(input) {
    const project = projectService.create(input);
    set({ projects: [project, ...get().projects] });
    return project;
  },

  setProjectStatus(id, status) {
    set({ projects: projectService.setStatus(id, status) });
  },
});
