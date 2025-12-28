import type { TStudent } from '@packages/schema/student.schema';
import {
	Loader,
	Loader2,
	TriangleAlert,
} from 'lucide-react';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { UseDeleteStudent } from '@modules/dashboard-encargado/hooks/delete-one-student.hook';
import { UpdateStudentModal } from '@modules/dashboard-encargado/components/organisms/update-student';
import { StudentDetailsModal } from '@modules/dashboard-encargado/components/organisms/student-details-modal';

// Extender el tipo TStudent para incluir los campos de práctica
type TStudentWithInternship = TStudent & {
	internshipType?: string;
	internshipStatus?: string;
};

interface IStudentsTableProps {
	students: TStudentWithInternship[];
	isLoading: boolean;
	error: string | null;
	onStudentDeleted?: () => void;
}

export function StudentsTable({
	students,
	isLoading,
	error,
	onStudentDeleted,
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
								<th>Práctica</th>
								<th>Estado</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{students.map((student) => (
								<StudentRow
									key={student.id}
									student={student}
									onDeleted={onStudentDeleted}
								/>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

function StudentRow({
	student,
	onDeleted,
}: {
	student: TStudentWithInternship;
	onDeleted?: () => void;
}) {
	const deleteModalRef = useRef<HTMLDialogElement>(null);
	const {
		handleDelete,
		isLoading: isDeleting,
		error: deleteError,
	} = UseDeleteStudent();

	const handleConfirmDelete = async () => {
		const success = await handleDelete(student.id);
		if (success) {
			deleteModalRef.current?.close();
			onDeleted?.();
		}
	};

	return (
		<>
			<tr className="hover">
				<td>
					<div className="avatar">
						<div className="w-8 h-8 rounded-full bg-base-300">
							{student.image && (
								<img
									src={student.image}
									alt={student.name}
								/>
							)}
						</div>
					</div>
				</td>
				<td>
					<div className="font-semibold text-primary">
						{student.name}
					</div>
					<div className="text-xs text-base-content/70">
						{student.rut}
					</div>
				</td>
				<td>{student.email}</td>
				<td>
					<div className="badge badge-ghost badge-outline">
						{student.currentInternship}
					</div>
				</td>
				<td>
					<div className="badge badge-ghost badge-outline">
						{student.internshipStatus || 'No aprobada'}
					</div>
				</td>
				<td>
					<div className="flex gap-2 text-primary text-xs">
						<StudentDetailsModal studentId={student.id} />
						<UpdateStudentModal
							studentId={student.id}
							onSuccess={() => {
								window.location.reload();
							}}
						/>
						<button
							type="button"
							className="text-error cursor-pointer hover:underline"
							onClick={() =>
								deleteModalRef.current?.showModal()
							}
						>
							Eliminar
						</button>
					</div>
				</td>
			</tr>
			{createPortal(
				<dialog
					ref={deleteModalRef}
					className="modal backdrop-blur-sm"
				>
					<div className="modal-box max-w-md p-6 rounded-2xl shadow-xl">
						<form method="dialog">
							<button
								type="submit"
								className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-base-content/50 hover:text-base-content"
							>
								✕
							</button>
						</form>

						<div className="flex flex-col items-center text-center">
							<div className="w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center mb-4">
								<TriangleAlert size={32} />
							</div>

							<h3 className="text-xl font-bold text-base-content mb-2">
								¿Eliminar estudiante?
							</h3>

							<p className="text-base-content/60 mb-6 text-sm leading-relaxed max-w-xs">
								Esta acción eliminará permanentemente los
								datos del estudiante y no se puede deshacer.
							</p>

							<div className="w-full bg-base-100 border border-base-200 rounded-xl p-3 mb-6 flex items-center gap-3 text-left">
								<div className="avatar">
									<div className="w-10 h-10 rounded-full bg-base-300">
										{student.image && (
											<img
												src={student.image}
												alt={student.name}
											/>
										)}
									</div>
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-semibold text-base-content truncate">
										{student.name}
									</p>
									<p className="text-xs text-base-content/60 truncate">
										{student.email}
									</p>
								</div>
							</div>

							{deleteError && (
								<div className="alert alert-error mb-6 text-sm py-2">
									<span>{deleteError}</span>
								</div>
							)}

							<div className="grid grid-cols-2 gap-3 w-full">
								<button
									type="button"
									className="btn btn-ghost hover:bg-base-200 font-medium"
									onClick={() =>
										deleteModalRef.current?.close()
									}
									disabled={isDeleting}
								>
									Cancelar
								</button>
								<button
									type="button"
									className="btn btn-error text-white font-medium shadow-sm hover:shadow-md transition-all"
									onClick={handleConfirmDelete}
									disabled={isDeleting}
								>
									{isDeleting ? (
										<>
											<Loader2
												size={18}
												className="animate-spin"
											/>
											Eliminando...
										</>
									) : (
										'Sí, eliminar'
									)}
								</button>
							</div>
						</div>
					</div>
					<form method="dialog" className="modal-backdrop">
						<button type="submit">close</button>
					</form>
				</dialog>,
				document.body,
			)}
		</>
	);
}
