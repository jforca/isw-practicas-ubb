import { Modal } from '@common/components/modal';
import { CreateStudentForm } from '@modules/dashboard-encargado/components/molecules/create-student-form';

interface ICreateStudentModalProps {
	onSuccess?: () => void;
}

export function CreateStudentModal({
	onSuccess,
}: ICreateStudentModalProps) {
	const handleSuccess = () => {
		onSuccess?.();
	};

	return (
		<Modal>
			<Modal.Trigger className="btn btn-sm bg-blue-400">
				Nuevo alumno
			</Modal.Trigger>
			<Modal.Content
				className="max-w-2xl"
				showCloseButton={true}
			>
				<Modal.Header>
					<Modal.Title>Crear Nuevo Estudiante</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<CreateStudentForm onSuccess={handleSuccess} />
				</Modal.Body>
			</Modal.Content>
		</Modal>
	);
}
