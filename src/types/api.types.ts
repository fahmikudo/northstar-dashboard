/** Keys the local API layer can store. Replace with server resources later. */
export type StoreKey = 'projects' | 'tasks' | 'session' | 'inbox';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
