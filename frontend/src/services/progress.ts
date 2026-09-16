import type { ProgressSummary } from '../types/progress';
import { apiPath } from '../config/api';

export async function getProgressSummary(): Promise<ProgressSummary> {
  const res = await fetch(apiPath('/progress/summary'), {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to load progress');

  return res.json();
}

export async function markLessonComplete(moduleId: string): Promise<void> {
  const res = await fetch(apiPath(`/progress/module/${moduleId}`), {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to mark lesson complete');
}