const DAY_MS = 86_400_000;

const shortDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const longDate = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

/** Parses a YYYY-MM-DD string as local midnight, avoiding UTC date shifts. */
export function parseIsoDate(iso: string): Date {
  return new Date(`${iso.slice(0, 10)}T00:00:00`);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** ISO date (YYYY-MM-DD) `days` away from today, pinned to local noon. */
export function isoDaysFromNow(days: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysUntil(iso: string, now: Date = new Date()): number {
  return Math.round(
    (startOfDay(parseIsoDate(iso)).getTime() - startOfDay(now).getTime()) /
      DAY_MS,
  );
}

export function isOverdue(iso: string, now: Date = new Date()): boolean {
  return daysUntil(iso, now) < 0;
}

export function formatShortDate(iso: string): string {
  return shortDate.format(parseIsoDate(iso));
}

export function formatLongDate(iso: string): string {
  return longDate.format(parseIsoDate(iso));
}

/** Human due-date label: Today, Tomorrow, In 6 days, 3 days ago. */
export function formatDueDate(iso: string, now: Date = new Date()): string {
  const days = daysUntil(iso, now);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 1) return `In ${days} days`;
  return `${Math.abs(days)} days ago`;
}

/** Relative timestamp for activity feeds. */
export function formatRelativeTime(
  isoDateTime: string,
  now: Date = new Date(),
): string {
  const elapsed = now.getTime() - new Date(isoDateTime).getTime();
  const minutes = Math.max(0, Math.floor(elapsed / 60_000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return shortDate.format(new Date(isoDateTime));
}
