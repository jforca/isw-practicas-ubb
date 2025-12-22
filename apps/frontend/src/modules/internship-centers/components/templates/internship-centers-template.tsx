import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';
import {
	InternshipCenterCards,
	InternshipCenterHeader,
} from '@modules/internship-centers/components/organisms';
import { SearchBar } from '@common/components/search-bar';
import { Modal } from '@common/components/modal';

export function InternshipCentersTemplate({
	centers,
}: {
	centers: TInternshipCenter[];
}) {
	return (
		<section className="section-base">
			<InternshipCenterHeader />
			<SearchBar placeholder="Buscar centros de práctica" />
			<InternshipCenterCards centers={centers} />
			<Modal>
				<Modal.Trigger className="btn btn-primary">
					Abrir Modal
				</Modal.Trigger>

				<Modal.Content>
					<Modal.Header>Título del Modal</Modal.Header>

					<Modal.Body>
						<p>Contenido del modal aquí...</p>
					</Modal.Body>
				</Modal.Content>
			</Modal>
		</section>
	);
}
