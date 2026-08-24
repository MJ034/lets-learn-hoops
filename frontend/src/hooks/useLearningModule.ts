import { useEffect, useState } from 'react';
import { getLearningModule } from '../services/learning';
import type { LearningModuleDetail } from '../types/learning';

export function useLearningModule(slug?: string) {
  const [module, setModule] = useState<LearningModuleDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let isActive = true;
    const lessonSlug = slug;

    async function loadModule() {
      setLoading(true);
      setError(null);

      try {
        const response = await getLearningModule(lessonSlug);
        if (isActive) setModule(response);
      } catch (err) {
        if (isActive) {
          setModule(null);
          setError(err instanceof Error ? err.message : 'Failed to fetch learning module');
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadModule();

    return () => {
      isActive = false;
    };
  }, [slug]);

  if (!slug) return { module: null, loading: false, error: null };

  return { module, loading, error };
}