import { Search } from 'lucide-react';
import { useState, useCallback } from 'react';

interface ISearchBarProps {
	placeholder?: string;
	onSearch?: (value: string) => void;
	debounceMs?: number;
}

export function SearchBar({
	placeholder,
	onSearch,
	debounceMs = 300,
}: ISearchBarProps) {
	const [value, setValue] = useState('');
	const [timeoutId, setTimeoutId] = useState<ReturnType<
		typeof setTimeout
	> | null>(null);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setValue(newValue);

			// Cancelar timeout anterior
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			// Debounce para evitar muchas llamadas
			if (onSearch) {
				const id = setTimeout(() => {
					onSearch(newValue);
				}, debounceMs);
				setTimeoutId(id);
			}
		},
		[onSearch, debounceMs, timeoutId],
	);

	return (
		<label className="input w-full">
			<Search className="stroke-base-content/30" />
			<input
				type="search"
				value={value}
				onChange={handleChange}
				placeholder={placeholder || 'Buscar...'}
			/>
		</label>
	);
}
