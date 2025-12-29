import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';

interface IPaginationProps {
	currentPage: number;
	totalPages: number;
	isLoading: boolean;
	onPageChange: (page: number) => void;
	onNextPage: () => void;
	onPrevPage: () => void;
}

export function Pagination({
	currentPage,
	totalPages,
	isLoading,
	onPageChange,
	onNextPage,
	onPrevPage,
}: IPaginationProps) {
	if (totalPages <= 1) return null;

	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			for (let i = 0; i < totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(0);

			if (currentPage > 2) {
				pages.push('...');
			}

			const start = Math.max(1, currentPage - 1);
			const end = Math.min(totalPages - 2, currentPage + 1);

			for (let i = start; i <= end; i++) {
				if (!pages.includes(i)) {
					pages.push(i);
				}
			}

			if (currentPage < totalPages - 3) {
				pages.push('...');
			}

			if (!pages.includes(totalPages - 1)) {
				pages.push(totalPages - 1);
			}
		}

		return pages;
	};

	return (
		<div className="flex justify-center mt-6">
			<div className="join">
				<button
					type="button"
					className="join-item btn btn-sm"
					onClick={() => onPageChange(0)}
					disabled={currentPage === 0 || isLoading}
				>
					<ChevronsLeft size={16} />
				</button>
				<button
					type="button"
					className="join-item btn btn-sm"
					onClick={onPrevPage}
					disabled={currentPage === 0 || isLoading}
				>
					<ChevronLeft size={16} />
				</button>

				{getPageNumbers().map((page, index) =>
					typeof page === 'string' ? (
						<button
							key={`ellipsis-${index === 1 ? 'start' : 'end'}`}
							type="button"
							className="join-item btn btn-sm btn-disabled"
						>
							{page}
						</button>
					) : (
						<button
							key={page}
							type="button"
							className={`join-item btn btn-sm ${
								currentPage === page ? 'btn-primary' : ''
							}`}
							onClick={() => onPageChange(page)}
							disabled={isLoading}
						>
							{page + 1}
						</button>
					),
				)}

				<button
					type="button"
					className="join-item btn btn-sm"
					onClick={onNextPage}
					disabled={
						currentPage === totalPages - 1 || isLoading
					}
				>
					<ChevronRight size={16} />
				</button>
				<button
					type="button"
					className="join-item btn btn-sm"
					onClick={() => onPageChange(totalPages - 1)}
					disabled={
						currentPage === totalPages - 1 || isLoading
					}
				>
					<ChevronsRight size={16} />
				</button>
			</div>
		</div>
	);
}
