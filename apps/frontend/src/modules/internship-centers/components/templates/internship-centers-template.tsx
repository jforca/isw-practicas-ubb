import { InternshipCenterCard } from '@modules/internship-centers/components/organisms/internship-center-card';
import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';
import { Card } from '@common/components/card';
import { PenLine, Eye } from 'lucide-react';

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

				<Card className="hover:scale-102 transition-transform">
					<Card.Body>
						<Card.Title className="text-primary font-bold">
							Centros de Prácticas UBB
						</Card.Title>
						<Card.P className="text-base-content/60">
							Concepción, Chile
						</Card.P>

						<Card.P>
							Descripción breve o información adicional
							sobre el centro. Aquí Se muestran los datos de
							el centro de practicas
						</Card.P>

						<Card.P className="text-base-content/60">
							+56 9 1234 5678
						</Card.P>
						<Card.Actions className="justify-end">
							<Card.Button className="btn-primary">
								<PenLine size={16} /> Editar /
								<Eye size={16} />
								ver
							</Card.Button>
						</Card.Actions>
					</Card.Body>
				</Card>
			</div>
		</section>
	);
}
