import { describe, expect, it } from 'vitest';
import {
  hasErrors,
  isEmail,
  validateProjectInput,
  validateSignIn,
  validateTaskInput,
} from './validators';

describe('isEmail', () => {
  it('accepts ordinary addresses', () => {
    expect(isEmail('avery@northstar.dev')).toBe(true);
    expect(isEmail('  priya.raman@example.co.uk ')).toBe(true);
  });

  it('rejects malformed addresses', () => {
    expect(isEmail('avery@')).toBe(false);
    expect(isEmail('avery northstar.dev')).toBe(false);
  });
});

describe('validateSignIn', () => {
  it('reports both fields when empty', () => {
    const errors = validateSignIn('', '');
    expect(hasErrors(errors)).toBe(true);
    expect(errors.email).toBe('Enter your email address.');
    expect(errors.password).toBe('Use at least 6 characters.');
  });

  it('accepts a valid email and long enough password', () => {
    expect(validateSignIn('avery@northstar.dev', 'demo1234')).toEqual({});
  });
});

describe('validateProjectInput', () => {
  it('requires a name, a real description, an owner, and a date', () => {
    const errors = validateProjectInput({
      name: 'A',
      description: 'short',
      ownerId: '',
      priority: 'medium',
      dueDate: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'description',
      'dueDate',
      'name',
      'ownerId',
    ]);
  });
});

describe('validateTaskInput', () => {
  it('accepts a complete task', () => {
    expect(
      validateTaskInput({
        title: 'Ship invoice export',
        description: 'Add CSV export.',
        projectId: 'prj_billing',
        assigneeId: 'tm_marcus',
        priority: 'urgent',
        dueDate: '2026-12-01',
      }),
    ).toEqual({});
  });

  it('requires an assignee and a project', () => {
    const errors = validateTaskInput({
      title: 'Draft the brief',
      description: '',
      projectId: '',
      assigneeId: '',
      priority: 'low',
      dueDate: '2026-12-01',
    });
    expect(errors.projectId).toBe('Choose a project.');
    expect(errors.assigneeId).toBe('Choose an assignee.');
  });
});
