import type { StateCreator } from 'zustand';
import type {
  NewTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from '@/types/task.types';
import { taskService } from '../../features/tasks/services/taskService';

export interface TasksSlice {
  tasks: Task[];
  addTask: (input: NewTaskInput) => Task;
  updateTask: (id: string, patch: UpdateTaskInput) => void;
  removeTask: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
}

export const createTasksSlice: StateCreator<TasksSlice, [], [], TasksSlice> = (
  set,
  get,
) => ({
  tasks: taskService.list(),

  addTask(input) {
    const task = taskService.create(input);
    set({ tasks: [task, ...get().tasks] });
    return task;
  },

  removeTask(id) {
    set({ tasks: taskService.remove(id) });
  },

  updateTask(id, patch) {
    set({ tasks: taskService.update(id, patch) });
  },

  setTaskStatus(id, status) {
    set({ tasks: taskService.setStatus(id, status) });
  },
});
