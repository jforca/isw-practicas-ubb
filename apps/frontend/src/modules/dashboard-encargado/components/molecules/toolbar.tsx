import { SearchBar } from '@common/components';
import { CreateStudentModal } from '@modules/dashboard-encargado/components/organisms/create-student-modal';
import { FilterMenu } from './filter-menu';
import type { TFilters } from '@modules/dashboard-encargado/hooks/find-many-student.hook';

type TProps = {
	onStudentCreated?: () => void;
	onSearch?: (value: string) => void;
	currentFilters: TFilters;
	onFiltersChange: (filters: Partial<TFilters>) => void;
};

export function Toolbar({
	onStudentCreated,
	onSearch,
	currentFilters,
	onFiltersChange,
}: TProps) {
	return (
		<div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
			<div className="flex gap-3 items-center w-full">
				<SearchBar
					placeholder="Buscar por nombre, RUT, email..."
					onSearch={onSearch}
				/>
			</div>

			<div className="flex items-center gap-3 self-end lg:self-auto text-sm pr-2 lg:pr-20">
				<FilterMenu
					selectedFilters={currentFilters}
					onChange={onFiltersChange}
				/>
				<CreateStudentModal onSuccess={onStudentCreated} />
			</div>
		</div>
	);
}
