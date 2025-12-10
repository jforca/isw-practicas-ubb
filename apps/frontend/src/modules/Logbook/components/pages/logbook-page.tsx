import React, { useState, useCallback } from 'react';
import type { ILogbookEntry } from '../types';
import { LogbookTable } from '../organism/logbook-table-component';
import { LogbookManagementTemplate } from '../templates/logbook-template';
import { Button } from '../atoms/button';

// Datos para probar la visualización de la tabla
const mockData: ILogbookEntry[] = [
	{
		id: 1,
		title: 'Primer Reporte de la Pasantía',
		content:
			'Detalles del inicio de la pasantía, objetivos iniciales y primeras tareas asignadas. Se estableció contacto con el supervisor y el coordinador.',
		createdAt: new Date('2025-10-01'),
		updatedAt: new Date('2025-10-01'),
		internshipId: 10,
	},
	{
		id: 2,
		title:
			'Avance en el Desarrollo del Módulo de Autenticación',
		content:
			'Implementación de las rutas de login y registro. Integración inicial con TypeORM para la gestión de usuarios y roles.',
		createdAt: new Date('2025-10-08'),
		updatedAt: new Date('2025-10-09'),
		internshipId: 10,
	},
	{
		id: 3,
		title: 'Reunión Semanal con el Supervisor',
		content:
			'Revisión del progreso de la semana. Discusión sobre los desafíos técnicos encontrados en la configuración de la base de datos PostgreSQL.',
		createdAt: new Date('2025-10-15'),
		updatedAt: new Date('2025-10-15'),
		internshipId: 10,
	},
	{
		id: 4,
		title: 'Configuración del Entorno de Desarrollo',
		content:
			'Instalación de Node.js, pnpm y TypeORM. Configuración de ESLint y Prettier para mantener un código limpio.',
		createdAt: new Date('2025-09-28'),
		updatedAt: new Date('2025-09-29'),
		internshipId: 11,
	},
	{
		id: 5,
		title:
			'Análisis de Requisitos para el Módulo de Pasantías',
		content:
			'Levantamiento de información con el equipo para definir las entidades `Interships` y `Report`. Diseño de la base de datos.',
		createdAt: new Date('2025-09-25'),
		updatedAt: new Date('2025-09-26'),
		internshipId: 11,
	},
];

export const LogbookPage: React.FC = () => {
	// Cargar los datos
	const [entries, setEntries] =
		useState<ILogbookEntry[]>(mockData);

	// Lógica de Manejo (solo con fines evaluativos)
	const handleEdit = useCallback((id: number) => {
		alert(
			`Solo para simular conexion con backend. Intentando editar registro con ID: ${id}`,
		);
		console.log(`Simulando edición de ${id}`);
	}, []);

	const handleDelete = useCallback((id: number) => {
		if (
			window.confirm(
				`Solo para simular conexion con backend. ¿Simular eliminación del registro con ID ${id}?`,
			)
		) {
			setEntries((prev) =>
				prev.filter((entry) => entry.id !== id),
			);
			console.log(`Simulando eliminación de ${id}`);
		}
	}, []);

	const handleNewEntry = () => {
		alert(
			'Solo para simular conexion con backend. Intentando crear nuevo registro',
		);
		console.log('Simulando creación de nuevo registro');
	};

	const pageHeader = (
		<div className="flex justify-between items-center">
			<h1 className="text-2xl font-bold text-base-content">
				Gestión de Registros del Logbook
			</h1>
			<Button onClick={handleNewEntry} variant="primary">
				+ Nuevo Registro
			</Button>
		</div>
	);

	return (
		<LogbookManagementTemplate
			header={pageHeader}
			content={
				<LogbookTable
					entries={entries}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			}
		/>
	);
};
