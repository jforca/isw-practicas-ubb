import { useEffect } from 'react';
import { InternshipCentersTemplate } from '@modules/internship-centers/components/templates/internship-centers-template';
import { UseInternshipCenter } from '@modules/internship-centers/hooks/internship-center-hook';

export function InternshipCentersPage() {
	const {
		data,
		pagination,
		isLoading,
		error,
		currentPage,
		totalPages,
		findMany,
		goToPage,
		nextPage,
		prevPage,
		changeLimit,
	} = UseInternshipCenter();

	useEffect(() => {
		findMany(0, 5);
	}, [findMany]);

	return (
		<InternshipCentersTemplate
			centers={data}
			pagination={pagination}
			isLoading={isLoading}
			error={error}
			currentPage={currentPage}
			totalPages={totalPages}
			onPageChange={goToPage}
			onNextPage={nextPage}
			onPrevPage={prevPage}
			onLimitChange={changeLimit}
		/>
	);
}
