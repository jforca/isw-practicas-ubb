import { useId } from 'react';
import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';
import { Card } from '@common/components/card';
import {
	Eye,
	PenLine,
	Trash,
	FileText,
} from 'lucide-react';

export function InternshipCenterCards({
	centers,
}: {
	centers: TInternshipCenter[];
}) {
	const id = useId();

	return (
		<article className="section-sm">
			<p className="paragraph-1 text-base-content/60">
				Mostrando{' '}
				<span className="text-primary font-bold">
					{centers.length}
				</span>{' '}
				centros de prácticas
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{centers.map((c) => (
					<Card
						key={`${id}-${c.id}`}
						className="hover:scale-102 transition-transform"
					>
						<Card.Body>
							<Card.Container className="flex justify-between">
								<Card.Container>
									<Card.Title className="text-primary font-bold">
										{c.legal_name}
									</Card.Title>

									<Card.P className="paragraph-2 text-base-content/60">
										{c.address}
									</Card.P>
								</Card.Container>

								<Card.ToolTip
									dataTip="Convenio"
									className="tooltip-info"
								>
									<Card.Button className="btn-info btn-soft rounded-full size-10">
										<FileText className="scale-300" />
									</Card.Button>
								</Card.ToolTip>
							</Card.Container>

							<Card.P className="text-base-content/80">
								Descripción breve o información adicional
								sobre el centro. Aquí Se muestran los datos
								de el centro de practicas
							</Card.P>

							<Card.Divider />

							<Card.Container className="flex justify-between items-center">
								<Card.Badge className="badge-soft badge-accent paragraph-2 font-medium">
									{c.email}
								</Card.Badge>

								<Card.Actions className="justify-end">
									<Card.ToolTip
										dataTip="Ver"
										className="tooltip-primary"
									>
										<Card.Button className="btn-primary btn-soft rounded-full size-10">
											<Eye className="scale-300" />
										</Card.Button>
									</Card.ToolTip>
									<Card.ToolTip
										dataTip="Editar"
										className="tooltip-success"
									>
										<Card.Button className="btn-success btn-soft rounded-full size-10">
											<PenLine className="scale-300" />
										</Card.Button>
									</Card.ToolTip>
									<Card.ToolTip
										dataTip="Eliminar"
										className="tooltip-error"
									>
										<Card.Button className="btn-error btn-soft rounded-full size-10">
											<Trash className="scale-300" />
										</Card.Button>
									</Card.ToolTip>
								</Card.Actions>
							</Card.Container>
						</Card.Body>
					</Card>
				))}
			</div>
		</article>
	);
}
