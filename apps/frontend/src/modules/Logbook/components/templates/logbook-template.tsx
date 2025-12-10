import React from 'react';

interface ILogbookManagementTemplateProps {
	header: React.ReactNode;
	content: React.ReactNode;
}

export const LogbookManagementTemplate: React.FC<
	ILogbookManagementTemplateProps
> = ({ header, content }) => {
	return (
		// Usamos bg-base-200 para el fondo (clase DaisyUI)
		<div className="min-h-screen bg-base-200 p-8">
			<div className="max-w-7xl mx-auto">
				<header className="mb-6 card bg-base-100 p-6 shadow-xl">
					{header}
				</header>
				{/* El contenido principal, usamos card para un estilo de contenedor */}
				<main className="card bg-base-100 shadow-xl p-6">
					{content}
				</main>
			</div>
		</div>
	);
};
