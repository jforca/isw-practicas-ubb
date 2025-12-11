import type {
	TStudent,
	TStudentStatus,
} from '@modules/dashboard-Encargado/types';

interface IStudentsTableProps {
	students: TStudent[];
}

function statusToLabel(s: TStudentStatus) {
	switch (s) {
		case 'en_curso':
			return 'En Curso';
		case 'revision':
			return 'Revisión Pendiente';
		case 'evaluacion':
			return 'Evaluación Pendiente';
		default:
			return 'Sin Actividad';
	}
}

function statusToBadge(s: TStudentStatus) {
	switch (s) {
		case 'en_curso':
			return 'badge-success';
		case 'revision':
			return 'badge-warning';
		case 'evaluacion':
			return 'badge-info';
		default:
			return 'badge-ghost';
	}
}

// Avatar visual: solo un círculo gris (sin iniciales ni foto)

export function StudentsTable({
	students,
}: IStudentsTableProps) {
	return (
		<div className="card bg-base-100 border border-base-200 shadow-sm">
			<div className="card-body p-0">
				<div className="overflow-x-auto">
					<table className="table">
						<thead>
							<tr>
								<th className="w-10"></th>
								<th>Alumno</th>
								<th>Carrera</th>
								<th>Estado</th>
								<th>Cursando</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{students.map((s) => (
								<tr key={s.id} className="hover">
									<td>
										<div className="avatar">
											<div className="w-8 h-8 rounded-full bg-base-300" />
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
									<td className="whitespace-nowrap">
										{s.career}
									</td>
									<td>
										<div
											className={`badge p-5 ${statusToBadge(s.status)} badge-outline`}
										>
											{statusToLabel(s.status)}
										</div>
									</td>
									<td className="space-x-1">
										{s.requirements.map((r) => (
											<span
												key={r}
												className="badge badge-sm badge-outline"
											>
												{r}
											</span>
										))}
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
