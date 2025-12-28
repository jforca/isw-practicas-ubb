import { useState, useCallback, useEffect } from 'react';

export type TDashboardStats = {
	totalStudents: number;
	activeInternships: number;
	unapprovedInternships: number;
	pendingEvaluation: number;
};

export function useDashboardStats() {
	const [stats, setStats] = useState<TDashboardStats>({
		totalStudents: 0,
		activeInternships: 0,
		unapprovedInternships: 0,
		pendingEvaluation: 0,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchStats = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch('/api/students/stats');
			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.message || 'Error al obtener estadísticas',
				);
			}

			if (result.data) {
				setStats(result.data);
			} else {
				console.error(
					'Payload de estadísticas vacío:',
					result,
				);
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Error desconocido al obtener estadísticas';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	return {
		stats,
		isLoading,
		error,
		refetch: fetchStats,
	};
}
