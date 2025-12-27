import type { TStudent } from '@packages/schema/student.schema';
import { Loader } from 'lucide-react';

interface IStudentsTableProps {
	students: TStudent[];
	isLoading: boolean;
	error: string | null;
}

export function StudentsTable({
	students,
	isLoading,
	error,
}: IStudentsTableProps) {
	if (isLoading) {
		return (
			<div className="flex justify-center p-10">
				<Loader className="animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="alert alert-error">
				<span>{error}</span>
			</div>
		);
	}

	return (
		<div className="card bg-base-100 border border-base-200 shadow-sm">
			<div className="card-body p-0">
				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th className="w-10"></th>
								<th>Alumno</th>
								<th>Email</th>
								<th>Rol</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{students.map((s) => (
								<tr key={s.id} className="hover">
									<td>
										<div className="avatar">
											<div className="w-8 h-8 rounded-full bg-base-300">
												{s.image && (
													<img src={s.image} alt={s.name} />
												)}
											</div>
										</div>
									</td>
									<td>
										<div className="font-semibold text-primary">
											{s.name}
										</div>
										<div className="text-xs text-base-content/70">
											{s.rut}
										</div>
									</td>
									<td>{s.email}</td>
									<td>
										<div className="badge badge-ghost badge-outline">
											{s.user_role}
										</div>
									</td>
									<td>
										<div className="flex gap-2 text-primary text-xs">
											<span className="cursor-default">
												Ver
											</span>
											<span className="cursor-default">
												Editar
											</span>
											<span className="text-error cursor-default">
												Eliminar
											</span>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
