import { createId, storage } from '@/services/api';
import type {
  NewProjectInput,
  Project,
  ProjectStatus,
} from '@/types/project.types';
import { isoDaysFromNow } from '@/utils/formatDate';

function nowIso(): string {
  return new Date().toISOString();
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

function seedProjects(): Project[] {
  return [
    {
      id: 'prj_atlas',
      name: 'Atlas redesign',
      description:
        'Refresh navigation, settings, and the core workspace shell for the Atlas suite.',
      status: 'active',
      priority: 'high',
      ownerId: 'tm_priya',
      memberIds: ['tm_priya', 'tm_dana', 'tm_marcus'],
      dueDate: isoDaysFromNow(18),
      createdAt: hoursAgo(720),
      updatedAt: hoursAgo(3),
    },
    {
      id: 'prj_billing',
      name: 'Billing migration',
      description:
        'Move invoices, tax rules, and failed-charge retries onto the new billing service.',
      status: 'at-risk',
      priority: 'urgent',
      ownerId: 'tm_marcus',
      memberIds: ['tm_marcus', 'tm_leo'],
      dueDate: isoDaysFromNow(6),
      createdAt: hoursAgo(960),
      updatedAt: hoursAgo(5),
    },
    {
      id: 'prj_onboarding',
      name: 'Mobile onboarding',
      description:
        'Rebuild first-run onboarding and sign-in for the iOS and Android apps.',
      status: 'active',
      priority: 'medium',
      ownerId: 'tm_dana',
      memberIds: ['tm_dana', 'tm_priya'],
      dueDate: isoDaysFromNow(33),
      createdAt: hoursAgo(600),
      updatedAt: hoursAgo(26),
    },
    {
      id: 'prj_insights',
      name: 'Insights v2',
      description:
        'Ship the next generation of usage, retention, and capacity reporting.',
      status: 'planning',
      priority: 'medium',
      ownerId: 'tm_avery',
      memberIds: ['tm_avery', 'tm_dana', 'tm_leo'],
      dueDate: isoDaysFromNow(45),
      createdAt: hoursAgo(240),
      updatedAt: hoursAgo(48),
    },
    {
      id: 'prj_support',
      name: 'Support workflows',
      description:
        'Macros, CSAT surveys, and stale-ticket automation for the support team.',
      status: 'completed',
      priority: 'low',
      ownerId: 'tm_leo',
      memberIds: ['tm_leo', 'tm_avery'],
      dueDate: isoDaysFromNow(-9),
      createdAt: hoursAgo(1440),
      updatedAt: hoursAgo(96),
    },
    {
      id: 'prj_api',
      name: 'API deprecation',
      description:
        'Retire API v1 and move active integrations onto the v2 contract.',
      status: 'active',
      priority: 'low',
      ownerId: 'tm_marcus',
      memberIds: ['tm_marcus', 'tm_priya'],
      dueDate: isoDaysFromNow(24),
      createdAt: hoursAgo(480),
      updatedAt: hoursAgo(72),
    },
  ];
}

function listProjects(): Project[] {
  return storage.read<Project[]>('projects', seedProjects());
}

export const projectService = {
  list(): Project[] {
    return listProjects();
  },

  create(input: NewProjectInput): Project {
    const project: Project = {
      ...input,
      id: createId('prj'),
      status: 'planning',
      memberIds: [input.ownerId],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    storage.write('projects', [project, ...listProjects()]);
    return project;
  },

  setStatus(id: string, status: ProjectStatus): Project[] {
    const next = listProjects().map(project =>
      project.id === id ? { ...project, status, updatedAt: nowIso() } : project,
    );
    storage.write('projects', next);
    return next;
  },
};
