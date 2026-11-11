import { describe, expect, it } from 'vitest';
import { projectService } from '@/features/projects/services/projectService';
import { taskService } from '@/features/tasks/services/taskService';

describe('project and task workflow', () => {
  it('creates a planning project and reads it back from storage', () => {
    const project = projectService.create({
      name: 'Release readiness',
      description: 'Coordinate the launch checklist across teams.',
      priority: 'high',
      ownerId: 'tm_avery',
      dueDate: '2026-12-04',
    });

    expect(project.status).toBe('planning');
    expect(project.memberIds).toEqual(['tm_avery']);
    expect(projectService.list()[0]).toMatchObject({
      id: project.id,
      name: 'Release readiness',
    });
  });

  it('creates a task and persists a status change', () => {
    const task = taskService.create({
      title: 'Draft the launch brief',
      description: 'Cover goals, scope, and launch risks.',
      projectId: 'prj_atlas',
      assigneeId: 'tm_avery',
      priority: 'medium',
      dueDate: '2026-12-01',
    });

    expect(task.status).toBe('todo');
    taskService.setStatus(task.id, 'done');
    expect(
      taskService.list().find(candidate => candidate.id === task.id)?.status,
    ).toBe('done');
  });

  it('keeps project status changes across reloads', () => {
    projectService.setStatus('prj_atlas', 'at-risk');
    expect(
      projectService.list().find(project => project.id === 'prj_atlas')?.status,
    ).toBe('at-risk');
  });

  it('updates editable task fields and timestamps the change', () => {
    const [updated] = taskService.update('tsk_nav', {
      assigneeId: 'tm_marcus',
      description: 'Updated briefing for the navigation audit.',
    });
    expect(updated.assigneeId).toBe('tm_marcus');
    expect(updated.description).toBe(
      'Updated briefing for the navigation audit.',
    );
    expect(
      taskService.list().find(task => task.id === 'tsk_nav')?.assigneeId,
    ).toBe('tm_marcus');
  });

  it('deletes a task from storage', () => {
    taskService.remove('tsk_nav');
    expect(taskService.list().some(task => task.id === 'tsk_nav')).toBe(false);
  });
});
