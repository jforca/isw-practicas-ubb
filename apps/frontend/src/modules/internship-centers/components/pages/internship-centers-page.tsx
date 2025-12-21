import { InternshipCentersTemplate } from '@modules/internship-centers/components/templates/internship-centers-template';
import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';

export function InternshipCentersPage() {
	const centers: TInternshipCenter[] = [
		{
			company_rut: '76.123.456-7',
			createdAt: new Date(),
			updatedAt: new Date(),
			id: 1,
			legal_name: 'Centro de Prácticas UBB',
			email: '',
			phone: '+56 2 1234 5678',
		},
	];

	return <InternshipCentersTemplate centers={centers} />;
}
