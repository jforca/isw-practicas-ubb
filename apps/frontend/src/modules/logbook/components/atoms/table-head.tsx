import React from 'react';

interface ITableHeadProps
	extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {}

export const TableHead: React.FC<ITableHeadProps> = ({
	children,
	...props
}) => {
	return (
		<th
			scope="col"
			className="p-4 text-sm font-semibold text-gray-700 uppercase"
			{...props}
		>
			{children}
		</th>
	);
};
