import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';
import { InternshipCenterCards } from '../organisms/internship-center-cards';
import { InternshipCenterHeader } from '../organisms/internship-center-header';

export function InternshipCentersTemplate({
	centers,
}: {
	centers: TInternshipCenter[];
}) {
	return (
		<section>
			<InternshipCenterHeader />
			<InternshipCenterCards centers={centers} />
		</section>
	);
}
