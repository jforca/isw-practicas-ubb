import React from 'react';
import { TableHead } from '../atoms/table-head';

export const TableHeaderRow: React.FC = () => {
	return (
		<tr>
			<TableHead>ID</TableHead>
			<TableHead>Título</TableHead>
			<TableHead>Contenido</TableHead>
			<TableHead>Creado</TableHead>
			<TableHead>Actualizado</TableHead>
			<TableHead>Acciones</TableHead>
		</tr>
	);
};
