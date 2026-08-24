import { useEffect, useState } from 'react';
import { getLearningModules } from '../services/learning';
import type { LearningModule } from '../types/learning';

type UseLearningModulesOptions = {
  enabled?: boolean;
};

export function useLearningModules(category?: string, { enabled = true }: UseLearningModulesOptions = {}) {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let isActive = true;

    async function loadModules() {
      setLoading(true);
      setError(null);

      try {
        const response = await getLearningModules(category);
        if (isActive) setModules(response.modules);
      } catch (err) {
        if (isActive) {
          setModules([]);
          setError(err instanceof Error ? err.message : 'Failed to fetch learning modules');
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadModules();

    return () => {
      isActive = false;
    };
  }, [category, enabled]);

  if (!enabled) return { modules: [], loading: false, error: null };

  return { modules, loading, error };
}