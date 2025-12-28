import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useId } from 'react';

type TPaginationProps = {
	currentPage: number;
	totalPages: number;
	isLoading: boolean;
	onPageChange: (page: number) => void;
	onNextPage: () => void;
	onPrevPage: () => void;
};

export function Pagination({
	currentPage,
	totalPages,
	isLoading,
	onPageChange,
	onNextPage,
	onPrevPage,
}: TPaginationProps) {
	const id = useId();

	if (totalPages <= 1) return null;

	const getPageNumbers = () => {
		const pages: (number | 'start' | 'end')[] = [];

		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else if (currentPage <= 3) {
			pages.push(1, 2, 3, 4, 'end', totalPages);
		} else if (currentPage >= totalPages - 2) {
			pages.push(
				1,
				'start',
				totalPages - 3,
				totalPages - 2,
				totalPages - 1,
				totalPages,
			);
		} else {
			pages.push(
				1,
				'start',
				currentPage - 1,
				currentPage,
				currentPage + 1,
				'end',
				totalPages,
			);
		}

		return pages;
	};

	return (
		<div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
			<div className="join">
				<button
					type="button"
					className="join-item btn btn-sm"
					onClick={onPrevPage}
					disabled={currentPage === 1 || isLoading}
				>
					<ChevronLeft size={16} />
				</button>

				{getPageNumbers().map((page) =>
					typeof page === 'string' ? (
						<button
							type="button"
							key={`${id}-ellipsis-${page}`}
							className="join-item btn btn-sm btn-disabled"
						>
							...
						</button>
					) : (
						<button
							type="button"
							key={`${id}-page-${page}`}
							className={`join-item btn btn-sm ${
								currentPage === page ? 'btn-primary' : ''
							}`}
							onClick={() => onPageChange(page)}
							disabled={isLoading}
						>
							{page}
						</button>
					),
				)}

				<button
					type="button"
					className="join-item btn btn-sm"
					onClick={onNextPage}
					disabled={currentPage === totalPages || isLoading}
				>
					<ChevronRight size={16} />
				</button>
			</div>
		</div>
	);
}
