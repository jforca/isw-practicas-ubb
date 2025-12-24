import { useEffect } from 'react';
import { InternshipCentersTemplate } from '@modules/internship-centers/components/templates/internship-centers-template';
import { UseFindManyInternshipCenter } from '@modules/internship-centers/hooks/find-many-internship-center.hook';

export function InternshipCentersPage() {
	const {
		data,
		pagination,
		isLoading,
		error,
		currentPage,
		totalPages,
		handleFindMany,
		goToPage,
		nextPage,
		prevPage,
		changeLimit,
	} = UseFindManyInternshipCenter();

	useEffect(() => {
		handleFindMany(0, 5);
	}, [handleFindMany]);

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
