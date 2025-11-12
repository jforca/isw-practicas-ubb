import { Search } from 'lucide-react';

interface ISearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function SearchBar({
	value,
	onChange,
	placeholder = 'Buscar ofertas...',
}: ISearchBarProps) {
	return (
		<div className="form-control w-full">
			<div className="relative">
				<input
					type="text"
					placeholder={placeholder}
					className="input input-bordered w-full pl-10"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
				<Search
					size={20}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
				/>
			</div>
		</div>
	);
}
