import { Search } from 'lucide-react';

interface ISearchInputProps {
	value?: string;
	placeholder?: string;
	onChange?: (value: string) => void;
}

export function SearchInput({
	value,
	onChange,
	placeholder,
}: ISearchInputProps) {
	return (
		<label className="input input-bordered flex items-center gap-2 w-full max-w-xl">
			<Search size={16} className="opacity-60" />
			<input
				value={value}
				onChange={
					onChange
						? (e) => onChange(e.target.value)
						: undefined
				}
				type="text"
				className="grow"
				placeholder={placeholder ?? 'Buscar...'}
			/>
		</label>
	);
}
