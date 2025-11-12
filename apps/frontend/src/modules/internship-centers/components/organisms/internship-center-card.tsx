import { Mail, Building, Phone } from 'lucide-react';

interface IInternshipCenterCardProps {
	name: string;
	rut: string;
	businessName: string;
	email?: string;
	phone?: string;
}

export function InternshipCenterCard({
	name,
	rut,
	businessName,
	email,
	phone,
}: IInternshipCenterCardProps) {
	return (
		<article className="group relative overflow-hidden cursor-pointer rounded-xl bg-base-100 border border-base-200 shadow-sm transition-transform duration-200 ease-out hover:scale-102 hover:shadow-lg motion-reduce:transition-none">
			{/* header */}
			<div className="flex items-center gap-4 p-4 ">
				<div className="shrink-0">
					<div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white shadow-md">
						<Building />
					</div>
				</div>

				<div className="min-w-0">
					<h3 className="truncate text-lg font-semibold text-primary group-hover:text-primary">
						{name}
					</h3>
					<p className="text-xs text-muted">
						{businessName}
					</p>
				</div>

				<div className="ml-auto flex items-start gap-2">
					<span className="inline-block rounded-full bg-linear-to-br from-primary to-accent text-primary-content px-2 py-1 text-xs font-medium">
						RUT {rut}
					</span>
				</div>
			</div>

			{/* body */}
			<div className="p-4">
				<p className="text-sm text-muted mb-2">
					Descripción breve o información adicional sobre el
					centro. Aquí Se muestran los datos de el centro de
					practicas
				</p>

				{(email || phone) && (
					<div className="mt-2 flex flex-col gap-2">
						{email && (
							<p className="inline-flex items-center gap-2 text-sm text-primary">
								<Mail size={16} />
								<span className="truncate">{email}</span>
							</p>
						)}

						{phone && (
							<p className="inline-flex items-center gap-2 text-sm text-primary">
								<Phone size={16} />
								<span>{phone}</span>
							</p>
						)}
					</div>
				)}
			</div>
		</article>
	);
}
