import React from 'react';

interface ITableDataProps
	extends React.TdHTMLAttributes<HTMLTableDataCellElement> {}

export const TableData: React.FC<ITableDataProps> = ({
	children,
	...props
}) => {
	return (
		<td className="p-4" {...props}>
			{children}
		</td>
	);
};
