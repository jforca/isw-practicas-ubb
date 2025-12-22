import { Search } from 'lucide-react';

interface ISearchBarProps {
	placeholder?: string;
}

export function SearchBar({
	placeholder,
}: ISearchBarProps) {
	return (
		<label className="input w-full">
			<Search className="stroke-base-content/30" />
			<input
				type="search"
				required
				placeholder={placeholder || 'Buscar...'}
			/>
		</label>
	);
}
