import { OfferCard } from '../molecules/offer-card';
import { Inbox } from 'lucide-react';

interface IOffer {
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
}

interface IOffersGridProps {
	offers: IOffer[];
	onApply?: (offerId: number) => void;
	isLoading?: boolean;
}

export function OffersGrid({
	offers,
	onApply,
	isLoading = false,
}: IOffersGridProps) {
	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		);
	}

	if (offers.length === 0) {
		return (
			<div className="card bg-base-100 border border-base-300">
				<div className="card-body items-center text-center py-12">
					<Inbox
						size={48}
						className="text-base-content/30 mb-4"
					/>
					<h3 className="text-lg font-semibold text-base-content/70">
						No hay ofertas disponibles
					</h3>
					<p className="text-sm text-base-content/50">
						No se encontraron ofertas que coincidan con los
						filtros aplicados
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{offers.map((offer) => (
				<OfferCard
					key={offer.id}
					id={offer.id}
					title={offer.title}
					description={offer.description}
					deadline={offer.deadline}
					status={offer.status}
					internshipType={offer.internshipType}
					internshipCenter={offer.internshipCenter}
					onApply={onApply}
				/>
			))}
		</div>
	);
}
