import { useCallback, useState } from 'react';
import type { TStudent } from './create-student.hook';

type TUpdateStudentData = Partial<
	Omit<
		TStudent,
		'id' | 'createdAt' | 'updatedAt' | 'userRole'
	>
>;

export function UseUpdateOneStudent() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const [updatedStudent, setUpdatedStudent] =
		useState<TStudent | null>(null);

	const handleUpdateOne = useCallback(
		async (
			updatedStudentData: TUpdateStudentData,
			id: string,
		) => {
			setIsLoading(true);
			setError(null);
			setIsSuccess(false);

			try {
				const response = await fetch(
					`/api/students/update-one/${id}`,
					{
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(updatedStudentData),
					},
				);

				if (!response.ok) {
					const errorResult = await response.json();
					throw new Error(
						errorResult.message ||
							'Error al actualizar el estudiante',
					);
				}

				const result = await response.json();
				setUpdatedStudent(result.data);
				setIsSuccess(true);
				return result.data;
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: 'Se produjo un error desconocido';
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return {
		isLoading,
		error,
		isSuccess,
		updatedStudent,
		handleUpdateOne,
	};
}
