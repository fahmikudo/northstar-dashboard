import { create } from 'zustand';
import {
  createProjectsSlice,
  type ProjectsSlice,
} from './slices/projectsSlice';
import {
  createNotificationsSlice,
  type NotificationsSlice,
} from './slices/notificationsSlice';
import { createTasksSlice, type TasksSlice } from './slices/tasksSlice';

export type AppState = ProjectsSlice & TasksSlice & NotificationsSlice;

export const useAppStore = create<AppState>()((...args) => ({
  ...createProjectsSlice(...args),
  ...createTasksSlice(...args),
  ...createNotificationsSlice(...args),
}));
