import { ApplicationCards } from '@modules/applications/components/organisms/application-cards';
import { ApplicationsHeader } from '@modules/applications/components/organisms/applications-header';
import { UseFindMyApplications } from '@modules/applications/hooks';
import { useEffect } from 'react';

export function ApplicationsTemplate() {
	const {
		data: applications,
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
		refresh,
	} = UseFindMyApplications();

	useEffect(() => {
		handleFindMany(0, pagination.limit);
	}, [handleFindMany, pagination.limit]);

	return (
		<section className="section-base">
			<ApplicationsHeader />

			<ApplicationCards
				data={applications}
				pagination={pagination}
				isLoading={isLoading}
				error={error}
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={goToPage}
				onNextPage={nextPage}
				onPrevPage={prevPage}
				onLimitChange={changeLimit}
				onRefresh={refresh}
			/>
		</section>
	);
}
