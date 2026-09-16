import type { LearningModuleDetail, LearningModuleResponse, LearningModulesResponse } from '../types/learning';
import { apiPath } from '../config/api';

const BASE_URL = apiPath('/learning-modules');

export async function getLearningModules(category?: string): Promise<LearningModulesResponse> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);

  const url = params.size > 0 ? `${BASE_URL}?${params.toString()}` : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch learning modules');
  return res.json();
}

export async function getLearningModule(slug: string): Promise<LearningModuleDetail | null> {
  const res = await fetch(`${BASE_URL}/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch learning module');

  const data: LearningModuleResponse = await res.json();
  return data.module;
}