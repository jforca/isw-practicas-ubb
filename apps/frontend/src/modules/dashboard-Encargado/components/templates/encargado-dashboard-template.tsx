import { StatsOverview } from '@modules/dashboard-Encargado/components/molecules/stats-overview';
import { Toolbar } from '@modules/dashboard-Encargado/components/molecules/toolbar';
import { StudentsTable } from '@modules/dashboard-Encargado/components/organisms/students-table';
import { StudentPreviewPanel } from '@modules/dashboard-Encargado/components/organisms/student-preview-panel';
import type { TStudent } from '@modules/dashboard-Encargado/types';

const mockStudents: TStudent[] = [
	{
		id: '1',
		name: 'Ana Pérez',
		rut: '18.234.567-3',
		career: 'Ing. Informática',
		status: 'en_curso',
		requirements: ['P2'],
	},
	{
		id: '2',
		name: 'Bruno Díaz',
		rut: '20.987.654-1',
		career: 'Ing. Civil Industrial',
		status: 'revision',
		requirements: ['P2'],
	},
	{
		id: '3',
		name: 'Carla Muñoz',
		rut: '19.111.222-9',
		career: 'Ing. en Gestión',
		status: 'evaluacion',
		requirements: ['P2'],
	},
	{
		id: '4',
		name: 'Diego Rivas',
		rut: '21.333.444-5',
		career: 'Ing. Informática',
		status: 'sin_actividad',
		requirements: ['P1'],
	},
];

export function EncargadoDashboardTemplate() {
	const students = mockStudents;
	const counts = {
		total: students.length,
		inCourse: students.filter(
			(s) => s.status === 'en_curso',
		).length,
		review: students.filter((s) => s.status === 'revision')
			.length,
		evaluation: students.filter(
			(s) => s.status === 'evaluacion',
		).length,
	};

	return (
		<section className="p-4 container">
			<header className="flex items-start justify-between mb-4">
				<div>
					<h1 className="text-3xl font-bold">
						Gestión de Alumnos
					</h1>
					<p className="text-sm text-base-content/70">
						Administración CRUD, requisitos académicos y
						estado de prácticas.
					</p>
				</div>
			</header>

			<StatsOverview
				total={counts.total}
				inCourse={counts.inCourse}
				onReview={counts.review}
				onEvaluation={counts.evaluation}
			/>

			<div className="my-3" />

			<Toolbar />

			<div className="my-2" />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2">
					<StudentsTable students={students} />
				</div>
				<div className="lg:col-span-1">
					<StudentPreviewPanel />
				</div>
			</div>
		</section>
	);
}
