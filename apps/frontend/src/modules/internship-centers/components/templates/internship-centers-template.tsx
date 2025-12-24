import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';
import type { TPagination } from '@modules/internship-centers/hooks/internship-center-hook';
import {
	InternshipCenterCards,
	InternshipCenterHeader,
} from '@modules/internship-centers/components/organisms';
import { SearchBar } from '@common/components';

type TInternshipCentersTemplateProps = {
	centers: TInternshipCenter[];
	pagination: TPagination;
	isLoading: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onNextPage: () => void;
	onPrevPage: () => void;
	onLimitChange: (limit: number) => void;
};

export function InternshipCentersTemplate({
	centers,
	pagination,
	isLoading,
	error,
	currentPage,
	totalPages,
	onPageChange,
	onNextPage,
	onPrevPage,
	onLimitChange,
}: TInternshipCentersTemplateProps) {
	return (
		<section className="section-base">
			<InternshipCenterHeader />
			<SearchBar placeholder="Buscar centros de práctica" />
			<InternshipCenterCards
				data={centers}
				pagination={pagination}
				isLoading={isLoading}
				error={error}
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={onPageChange}
				onNextPage={onNextPage}
				onPrevPage={onPrevPage}
				onLimitChange={onLimitChange}
			/>
		</section>
	);
}
