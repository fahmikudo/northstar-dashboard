import { describe, expect, it } from 'vitest';
import {
  daysUntil,
  formatDueDate,
  formatRelativeTime,
  isOverdue,
  parseIsoDate,
} from './formatDate';

const now = new Date('2026-11-11T09:00:00');

describe('parseIsoDate', () => {
  it('reads the date at local midnight', () => {
    const date = parseIsoDate('2026-11-11');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(10);
    expect(date.getDate()).toBe(11);
    expect(date.getHours()).toBe(0);
  });
});

describe('daysUntil', () => {
  it('counts calendar days forward and backward', () => {
    expect(daysUntil('2026-11-11', now)).toBe(0);
    expect(daysUntil('2026-11-14', now)).toBe(3);
    expect(daysUntil('2026-11-09', now)).toBe(-2);
  });
});

describe('isOverdue', () => {
  it('treats today as on time', () => {
    expect(isOverdue('2026-11-11', now)).toBe(false);
    expect(isOverdue('2026-11-10', now)).toBe(true);
  });
});

describe('formatDueDate', () => {
  it('uses named days near today', () => {
    expect(formatDueDate('2026-11-11', now)).toBe('Today');
    expect(formatDueDate('2026-11-12', now)).toBe('Tomorrow');
    expect(formatDueDate('2026-11-10', now)).toBe('Yesterday');
  });

  it('uses counts further out', () => {
    expect(formatDueDate('2026-11-18', now)).toBe('In 7 days');
    expect(formatDueDate('2026-11-04', now)).toBe('7 days ago');
  });
});

describe('formatRelativeTime', () => {
  it('describes recent activity', () => {
    expect(formatRelativeTime('2026-11-11T08:59:30', now)).toBe('Just now');
    expect(formatRelativeTime('2026-11-11T08:45:00', now)).toBe('15 min ago');
    expect(formatRelativeTime('2026-11-11T06:00:00', now)).toBe('3 hr ago');
    expect(formatRelativeTime('2026-11-10T09:00:00', now)).toBe('Yesterday');
    expect(formatRelativeTime('2026-11-08T09:00:00', now)).toBe('3 days ago');
  });
});
