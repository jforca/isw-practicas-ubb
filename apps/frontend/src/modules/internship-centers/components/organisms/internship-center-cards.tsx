import { useId } from 'react';
import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';
import { Card } from '@common/components/card';
import { PenLine, Eye } from 'lucide-react';

export function InternshipCenterCards({
	centers,
}: {
	centers: TInternshipCenter[];
}) {
	const id = useId();

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{centers.map((c) => (
				<Card
					key={`${id}-${c.id}`}
					className="hover:scale-102 transition-transform"
				>
					<Card.Body>
						<Card.Title className="text-primary font-bold">
							{c.legal_name}
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
							{c.phone}
						</Card.P>
						<Card.P className="text-base-content/60">
							{c.email}
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
			))}
		</div>
	);
}
