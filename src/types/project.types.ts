export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type ProjectStatus = 'planning' | 'active' | 'at-risk' | 'completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  ownerId: string;
  memberIds: string[];
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export type NewProjectInput = Pick<
  Project,
  'name' | 'description' | 'priority' | 'ownerId' | 'dueDate'
>;

export interface ProjectWithStats extends Project, Record<string, unknown> {
  tasksTotal: number;
  tasksDone: number;
  progress: number;
  isOverdue: boolean;
}
