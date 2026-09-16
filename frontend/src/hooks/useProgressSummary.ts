import { useEffect, useState } from 'react';
import { getProgressSummary } from '../services/progress';
import type { ProgressSummary } from '../types/progress';

export function useProgressSummary() {
	const [summary, setSummary] = useState<ProgressSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isActive = true;

		async function loadProgressSummary() {
			setLoading(true);
			setError(null);

			try {
				const response = await getProgressSummary();
				if (isActive) setSummary(response);
			} catch (err) {
				if (isActive) {
					setSummary(null);
					setError(err instanceof Error ? err.message : 'Failed to load progress');
				}
			} finally {
				if (isActive) setLoading(false);
			}
		}

		loadProgressSummary();

		return () => {
			isActive = false;
		};
	}, []);

	return { summary, loading, error };
}
