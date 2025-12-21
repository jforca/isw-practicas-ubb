import { InternshipCenterCard } from '@modules/internship-centers/components/organisms/internship-center-card';

type TCenter = {
	id: string;
	name: string;
	rut: string;
	businessName: string;
	email?: string;
	phone?: string;
};

export function InternshipCentersTemplate() {
	const centers: TCenter[] = [
		{
			id: '1',
			name: 'Centro de Prácticas UBB',
			rut: '76.123.456-7',
			businessName: 'Centro de Prácticas Universidad B',
			email: 'contacto@centropracticas.cl',
			phone: '+56 9 1234 5678',
		},
		{
			id: '2',
			name: 'Empresa Ejemplo S.A.',
			rut: '76.987.654-3',
			businessName: 'Empresa Ejemplo Sociedad Anónima',
			email: 'rrhh@empresa-ejemplo.cl',
		},
		{
			id: '3',
			name: 'Fundación Talento',
			rut: '77.555.444-2',
			businessName: 'Fundación de Desarrollo del Talento',
			phone: '+56 2 2345 6789',
		},
	];

	return (
		<section>
			<header className="mb-4">
				<h2 className="title-2 font-bold">
					Centros de práctica
				</h2>
				<p className="subtitle-2 text-muted text-base-content/60">
					Listado simple de centros con contacto
				</p>
			</header>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{centers.map((c) => (
					<InternshipCenterCard
						key={c.id}
						name={c.name}
						rut={c.rut}
						businessName={c.businessName}
						email={c.email}
						phone={c.phone}
					/>
				))}
			</div>
		</section>
	);
}
