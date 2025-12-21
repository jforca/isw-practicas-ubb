import { InternshipCenterCard } from '@modules/internship-centers/components/organisms/internship-center-card';
import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';

export function InternshipCentersTemplate({
	centers,
}: {
	centers: TInternshipCenter[];
}) {
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
						name={c.legal_name}
						rut={c.company_rut}
						businessName={c.legal_name}
						email={c.email}
						phone={c.phone}
					/>
				))}
			</div>
		</section>
	);
}
