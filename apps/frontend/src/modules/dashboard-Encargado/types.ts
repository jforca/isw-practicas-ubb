export type TStudentStatus =
	| 'en_curso'
	| 'revision'
	| 'evaluacion'
	| 'sin_actividad';

export type TStudent = {
	id: string;
	name: string;
	rut: string;
	career: string;
	status: TStudentStatus;
	requirements: Array<'P1' | 'P2'>;
};
