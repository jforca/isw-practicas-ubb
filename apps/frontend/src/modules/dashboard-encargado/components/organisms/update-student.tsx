import { Modal } from '@common/components';
import { CreateStudentForm } from '@modules/dashboard-encargado/components/molecules/create-student-form';

interface IUpdateStudentProps {
	studentId: string;
	onSuccess?: () => void;
}

export function UpdateStudentModal({
	studentId,
	onSuccess,
}: IUpdateStudentProps) {
	return (
		<Modal>
			<Modal.Trigger className="cursor-pointer hover:underline">
				Editar
			</Modal.Trigger>
			<Modal.Content
				className="max-w-2xl"
				showCloseButton={true}
			>
				<Modal.Header>
					<Modal.Title>Editar Estudiante</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<CreateStudentForm
						studentId={studentId}
						onSuccess={onSuccess}
					/>
				</Modal.Body>
			</Modal.Content>
		</Modal>
	);
}
