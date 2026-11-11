import type { FieldErrors } from '@/types/api.types';
import type { NewProjectInput } from '@/types/project.types';
import type { NewTaskInput } from '@/types/task.types';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 6;

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function validateSignIn(
  email: string,
  password: string,
): FieldErrors<{ email: string; password: string }> {
  const errors: FieldErrors<{ email: string; password: string }> = {};
  if (!email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!isEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return errors;
}

export function validateProjectInput(
  input: NewProjectInput,
): FieldErrors<NewProjectInput> {
  const errors: FieldErrors<NewProjectInput> = {};
  if (input.name.trim().length < 3) {
    errors.name = 'Use at least 3 characters.';
  }
  if (input.description.trim().length < 10) {
    errors.description = 'Add a short description (10+ characters).';
  }
  if (!input.ownerId) {
    errors.ownerId = 'Choose an owner.';
  }
  if (!input.dueDate) {
    errors.dueDate = 'Choose a target date.';
  }
  return errors;
}

export function validateTaskInput(
  input: NewTaskInput,
): FieldErrors<NewTaskInput> {
  const errors: FieldErrors<NewTaskInput> = {};
  if (input.title.trim().length < 3) {
    errors.title = 'Use at least 3 characters.';
  }
  if (!input.projectId) {
    errors.projectId = 'Choose a project.';
  }
  if (!input.assigneeId) {
    errors.assigneeId = 'Choose an assignee.';
  }
  if (!input.dueDate) {
    errors.dueDate = 'Choose a due date.';
  }
  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
