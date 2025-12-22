import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';
import {
	InternshipCenterCards,
	InternshipCenterHeader,
} from '@modules/internship-centers/components/organisms';
import { SearchBar } from '@common/components/search-bar';

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
		</section>
	);
}
