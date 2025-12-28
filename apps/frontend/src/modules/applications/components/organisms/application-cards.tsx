import { Card } from '@common/components';
import { EmptyState } from '@modules/applications/components/atoms/empty-state';
import { ErrorState } from '@modules/applications/components/atoms/error-state';
import { Loader } from '@modules/applications/components/atoms/loader';
import { Pagination } from '@modules/applications/components/molecules/pagination';
import { PaginationInfo } from '@modules/applications/components/molecules/pagination-info';
import type {
	TApplication,
	TPagination,
} from '@modules/applications/hooks';
import {
	Building2,
	Calendar,
	CheckCircle,
	Clock,
	GraduationCap,
	XCircle,
} from 'lucide-react';
import { useId } from 'react';

const statusConfig = {
	pending: {
		label: 'Pendiente',
		badge: 'badge-warning',
		icon: Clock,
	},
	approved: {
		label: 'Aprobada',
		badge: 'badge-success',
		icon: CheckCircle,
	},
	rejected: {
		label: 'Rechazada',
		badge: 'badge-error',
		icon: XCircle,
	},
};

type TApplicationCardsProps = {
	data: TApplication[];
	pagination: TPagination;
	isLoading: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onNextPage: () => void;
	onPrevPage: () => void;
	onLimitChange: (limit: number) => void;
	onRefresh: () => void;
};

export function ApplicationCards({
	data,
	pagination,
	isLoading,
	error,
	currentPage,
	totalPages,
	onPageChange,
	onNextPage,
	onPrevPage,
	onLimitChange,
	onRefresh,
}: TApplicationCardsProps) {
	const id = useId();

	if (error) {
		return (
			<article className="section-sm">
				<ErrorState message={error} onRetry={onRefresh} />
			</article>
		);
	}

	return (
		<article className="section-sm">
			<PaginationInfo
				showing={data.length}
				total={pagination.total}
				limit={pagination.limit}
				isLoading={isLoading}
				onLimitChange={onLimitChange}
			/>

			{isLoading ? (
				<Loader />
			) : data.length === 0 ? (
				<EmptyState message="No tienes postulaciones aún" />
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{data.map((application) => (
						<ApplicationCard
							key={`${id}-${application.id}`}
							application={application}
						/>
					))}
				</div>
			)}

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				isLoading={isLoading}
				onPageChange={onPageChange}
				onNextPage={onNextPage}
				onPrevPage={onPrevPage}
			/>
		</article>
	);
}

function ApplicationCard({
	application,
}: {
	application: TApplication;
}) {
	const config = statusConfig[application.status];
	const StatusIcon = config.icon;

	return (
		<Card>
			<Card.Body>
				<div className="flex justify-between items-start gap-2">
					<Card.Title className="text-base">
						{application.offer.title}
					</Card.Title>
					<Card.Badge className={config.badge}>
						<StatusIcon className="w-3 h-3 mr-1" />
						{config.label}
					</Card.Badge>
				</div>

				<p className="text-sm text-base-content/70 line-clamp-2 mt-2">
					{application.offer.description}
				</p>

				<Card.Divider />

				<div className="flex flex-col gap-2 text-sm text-base-content/60">
					<div className="flex items-center gap-2">
						<Building2 className="w-4 h-4 shrink-0" />
						<span className="truncate">
							{
								application.offer.internshipCenter
									?.legal_name
							}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 shrink-0" />
						<span>
							Postulado:{' '}
							{new Date(
								application.created_at,
							).toLocaleDateString('es-CL')}
						</span>
					</div>
				</div>

				{application.offer.offerTypes &&
					application.offer.offerTypes.length > 0 && (
						<div className="flex flex-wrap gap-1 mt-3">
							{application.offer.offerTypes.map((type) => (
								<span
									key={type.id}
									className="badge badge-outline badge-sm gap-1"
								>
									<GraduationCap className="w-3 h-3" />
									{type.name}
								</span>
							))}
						</div>
					)}
			</Card.Body>
		</Card>
	);
}
