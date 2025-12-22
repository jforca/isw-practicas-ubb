import { InternshipCentersTemplate } from '@modules/internship-centers/components/templates/internship-centers-template';
import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';

export function InternshipCentersPage() {
	const centers: TInternshipCenter[] = [
		{
			id: 1,
			company_rut: '76.123.456-7',
			createdAt: new Date(),
			updatedAt: new Date(),
			legal_name: 'Centro de Prácticas UBB',
			email: 'practicas@ubb.cl',
			phone: '+56 2 1234 5678',
			address: 'Av. Collao 1202, Concepción',
			convention_document_id: 101,
			description:
				'Centro de prácticas para estudiantes de la UBB',
		},
		{
			id: 2,
			company_rut: '71.783.355-1',
			createdAt: new Date(),
			updatedAt: new Date(),
			legal_name: 'Practicas 123',
			email: '123@practicas.cl',
			phone: '+56 2 1234 5678',
			address: 'Av. Siempre Viva 742, Springfield',
			convention_document_id: 102,
			description:
				'Centro de prácticas para estudiantes de diversas carreras',
		},
		{
			id: 3,
			company_rut: '76.987.654-3',
			createdAt: new Date(),
			updatedAt: new Date(),
			legal_name: 'Instituto Tecnológico del Sur',
			email: 'contacto@itsur.cl',
			phone: '+56 41 322 3344',
			address: 'Calle Falsa 123, Concepción',
			convention_document_id: 103,
			description:
				'Centro colaborador para prácticas profesionales en ingeniería y tecnología',
		},
	];

	return <InternshipCentersTemplate centers={centers} />;
}
