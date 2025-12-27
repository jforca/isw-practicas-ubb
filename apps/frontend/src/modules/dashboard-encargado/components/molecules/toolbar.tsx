import { SearchBar } from '@common/components';
import { CreateStudentModal } from '@modules/dashboard-encargado/components/organisms/create-student-modal';

type TProps = {
	onStudentCreated?: () => void;
	onSearch?: (value: string) => void;
};

export function Toolbar({
	onStudentCreated,
	onSearch,
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
				<CreateStudentModal onSuccess={onStudentCreated} />
				<button
					type="button"
					className="btn btn-sm bg-blue-300"
				>
					Exportar CSV
				</button>
			</div>
		</div>
	);
}
