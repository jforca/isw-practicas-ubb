import React from 'react';

interface ILogbookManagementTemplateProps {
	header: React.ReactNode;
	content: React.ReactNode;
}

export const LogbookManagementTemplate: React.FC<
	ILogbookManagementTemplateProps
> = ({ header, content }) => {
	return (
		<div className="min-h-screen bg-base-200 p-8">
			<div className="max-w-7xl mx-auto">
				<header className="mb-6 card bg-base-100 p-6 shadow-xl">
					{header}
				</header>
				<main className="card bg-base-100 shadow-xl p-6">
					{content}
				</main>
			</div>
		</div>
	);
};
