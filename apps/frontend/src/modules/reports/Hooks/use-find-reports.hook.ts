import { useState, useCallback } from 'react';

export interface IReport {
	id: number;
	title: string;
	filePath: string;
	uploadedAt: string;
	internship: {
		id: number;
	};
}

interface IRawReport {
	id: number;
	title: string;
	// biome-ignore lint/style/useNamingConvention: Backend response uses snake_case
	file_path: string;
	// biome-ignore lint/style/useNamingConvention: Backend response uses snake_case
	uploaded_at: string;
	internship: {
		id: number;
	};
}

export function UseFindReports() {
	const [data, setData] = useState<IReport[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const findReports = useCallback(
		async (internshipId: number, search?: string) => {
			setIsLoading(true);
			setError(null);

			try {
				let url = `/api/reports?internshipId=${internshipId}`;
				if (search) {
					url += `&title=${encodeURIComponent(search)}`;
				}

				const response = await fetch(url, {
					cache: 'no-store',
				});

				if (!response.ok) {
					throw new Error('Error al obtener los informes');
				}

				const result = await response.json();
				if (result?.data) {
					const mappedData = result.data.map(
						(item: IRawReport) => ({
							id: item.id,
							title: item.title,
							filePath: item.file_path,
							uploadedAt: item.uploaded_at,
							internship: item.internship,
						}),
					);
					setData(mappedData);
				} else {
					setData([]);
				}
			} catch (err) {
				console.error(err);
				setError(
					err instanceof Error
						? err.message
						: 'Error desconocido',
				);
				setData([]);
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Standard setState pattern
	const removeReport = useCallback((id: number) => {
		setData((prev) =>
			prev.filter((report) => report.id !== id),
		);
	}, []);

	return {
		data,
		isLoading,
		error,
		findReports,
		removeReport,
	};
}
