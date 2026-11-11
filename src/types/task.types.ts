import type { Priority } from './project.types';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export type NewTaskInput = Pick<
  Task,
  'title' | 'description' | 'projectId' | 'assigneeId' | 'priority' | 'dueDate'
>;

export type UpdateTaskInput = Partial<
  Pick<Task, 'description' | 'assigneeId' | 'priority' | 'dueDate'>
>;

export interface TaskWithRelations extends Task, Record<string, unknown> {
  projectName: string;
  assigneeName: string;
  isOverdue: boolean;
}
