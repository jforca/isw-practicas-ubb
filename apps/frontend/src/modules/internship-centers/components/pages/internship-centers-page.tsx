import { useEffect, useCallback } from 'react';
import { InternshipCentersTemplate } from '@modules/internship-centers/components/templates/internship-centers-template';
import {
	UseFindManyInternshipCenter,
	type TFilters,
} from '@modules/internship-centers/hooks';

export function InternshipCentersPage() {
	const {
		data,
		pagination,
		filters,
		isLoading,
		error,
		currentPage,
		totalPages,
		handleFindMany,
		updateFilters,
		goToPage,
		nextPage,
		prevPage,
		changeLimit,
	} = UseFindManyInternshipCenter();

	useEffect(() => {
		handleFindMany(0, 5);
	}, [handleFindMany]);

	const handleRefresh = useCallback(() => {
		handleFindMany(pagination.offset, pagination.limit);
	}, [handleFindMany, pagination.offset, pagination.limit]);

	const handleSearch = useCallback(
		(search: string) => {
			updateFilters({ search });
		},
		[updateFilters],
	);

	const handleFilterConvention = useCallback(
		(hasConvention: TFilters['hasConvention']) => {
			updateFilters({ hasConvention });
		},
		[updateFilters],
	);

	return (
		<InternshipCentersTemplate
			centers={data}
			pagination={pagination}
			filters={filters}
			isLoading={isLoading}
			error={error}
			currentPage={currentPage}
			totalPages={totalPages}
			onPageChange={goToPage}
			onNextPage={nextPage}
			onPrevPage={prevPage}
			onLimitChange={changeLimit}
			onRefresh={handleRefresh}
			onSearch={handleSearch}
			onFilterConvention={handleFilterConvention}
		/>
	);
}
