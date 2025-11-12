import React from 'react';

interface ITableDataProps
	extends React.TdHTMLAttributes<HTMLTableDataCellElement> {}

export const TableData: React.FC<ITableDataProps> = ({
	children,
	...props
}) => {
	// DaisyUI usa clases de padding y color por defecto, solo aseguramos el truncado
	return (
		<td className="p-4" {...props}>
			{children}
		</td>
	);
};
