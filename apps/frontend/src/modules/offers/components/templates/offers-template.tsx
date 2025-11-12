import { useState } from 'react';
import { SearchBar } from '../molecules/search-bar';
import { FilterBar } from '../organisms/filter-bar';
import { OffersGrid } from '../organisms/offers-grid';
import { Briefcase } from 'lucide-react';

type TOffer = {
	id: number;
	title: string;
	description: string;
	deadline: string;
	status: 'published' | 'closed' | 'filled';
	internshipType: {
		id: number;
		name: string;
		isActive: boolean;
	};
	internshipCenter: {
		id: number;
		legalName: string;
		companyRut: string;
		email: string;
		phone: string;
	};
};

export function OffersTemplate() {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedStatus, setSelectedStatus] =
		useState('all');
	const [selectedType, setSelectedType] = useState('all');

	const offers: TOffer[] = [
		{
			id: 1,
			title: 'Práctica Desarrollo Frontend',
			description:
				'Apoya en el desarrollo de una SPA con React/Vite. Trabaja con tecnologías modernas y participa en el desarrollo de componentes reutilizables siguiendo Atomic Design.',
			deadline: '2025-12-12T00:00:00.000Z',
			status: 'published',
			internshipType: {
				id: 1,
				name: 'Práctica I',
				isActive: true,
			},
			internshipCenter: {
				id: 1,
				legalName: 'Empresa Alpha SpA',
				companyRut: '76.123.456-7',
				email: 'contacto@alpha.cl',
				phone: '+56222223333',
			},
		},
		{
			id: 2,
			title: 'Práctica QA y Automatización',
			description:
				'Diseño de pruebas E2E y CI/CD. Aprende sobre testing automatizado, integración continua y herramientas modernas de QA.',
			deadline: '2025-12-27T00:00:00.000Z',
			status: 'published',
			internshipType: {
				id: 2,
				name: 'Práctica II',
				isActive: true,
			},
			internshipCenter: {
				id: 2,
				legalName: 'Empresa Beta Ltda',
				companyRut: '77.987.654-3',
				email: 'rrhh@beta.cl',
				phone: '+56244445555',
			},
		},
		{
			id: 3,
			title: 'Desarrollo Backend Node.js',
			description:
				'Únete a nuestro equipo backend para desarrollar APIs RESTful con Node.js, Express y TypeORM. Experiencia con PostgreSQL es un plus.',
			deadline: '2025-11-30T00:00:00.000Z',
			status: 'closed',
			internshipType: {
				id: 1,
				name: 'Práctica I',
				isActive: true,
			},
			internshipCenter: {
				id: 1,
				legalName: 'Empresa Alpha SpA',
				companyRut: '76.123.456-7',
				email: 'contacto@alpha.cl',
				phone: '+56222223333',
			},
		},
		{
			id: 4,
			title: 'Práctica DevOps y Cloud',
			description:
				'Trabaja con infraestructura cloud (AWS/Azure), contenedores Docker, Kubernetes y pipelines CI/CD. Ideal para estudiantes interesados en operaciones.',
			deadline: '2026-01-15T00:00:00.000Z',
			status: 'filled',
			internshipType: {
				id: 2,
				name: 'Práctica II',
				isActive: true,
			},
			internshipCenter: {
				id: 2,
				legalName: 'Empresa Beta Ltda',
				companyRut: '77.987.654-3',
				email: 'rrhh@beta.cl',
				phone: '+56244445555',
			},
		},
	];

	const filteredOffers = offers.filter((offer) => {
		const matchesSearch = offer.title
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesStatus =
			selectedStatus === 'all' ||
			offer.status === selectedStatus;
		const matchesType =
			selectedType === 'all' ||
			offer.internshipType.id.toString() === selectedType;

		return matchesSearch && matchesStatus && matchesType;
	});

	const handleApply = (offerId: number) => {
		console.log(`Aplicar a oferta ID: ${offerId}`);
	};

	return (
		<section className="min-h-screen bg-base-200 p-6">
			<div className="max-w-7xl mx-auto">
				<header className="mb-6">
					<div className="flex items-center gap-3 mb-2">
						<div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white shadow-md">
							<Briefcase size={24} />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-base-content">
								Ofertas de Práctica
							</h1>
							<p className="text-sm text-base-content/60">
								Explora las oportunidades disponibles
							</p>
						</div>
					</div>
				</header>

				<div className="mb-4">
					<SearchBar
						value={searchTerm}
						onChange={setSearchTerm}
						placeholder="Buscar por título de oferta..."
					/>
				</div>

				<div className="mb-6">
					<FilterBar
						selectedStatus={selectedStatus}
						onStatusChange={setSelectedStatus}
						selectedType={selectedType}
						onTypeChange={setSelectedType}
					/>
				</div>

				<div className="mb-4">
					<p className="text-sm text-base-content/70">
						Mostrando{' '}
						<span className="font-semibold text-primary">
							{filteredOffers.length}
						</span>{' '}
						{filteredOffers.length === 1
							? 'oferta'
							: 'ofertas'}
					</p>
				</div>

				<OffersGrid
					offers={filteredOffers}
					onApply={handleApply}
					isLoading={false}
				/>
			</div>
		</section>
	);
}
