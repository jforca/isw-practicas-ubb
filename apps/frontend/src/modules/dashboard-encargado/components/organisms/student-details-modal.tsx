import { Modal } from '@common/components';
import { UseGetStudentDetails } from '@modules/dashboard-encargado/hooks/get-student-details.hook';
import { useEffect, useState } from 'react';
import {
	Loader2,
	FileText,
	Briefcase,
	User,
	Clock,
} from 'lucide-react';

interface IStudentDetailsModalProps {
	studentId: string;
}

export function StudentDetailsModal({
	studentId,
}: IStudentDetailsModalProps) {
	const {
		data,
		isLoading,
		error,
		handleGetStudentDetails,
	} = UseGetStudentDetails();
	const [activeTab, setActiveTab] = useState<
		'summary' | 'applications' | 'internship'
	>('summary');

	useEffect(() => {
		if (studentId) {
			handleGetStudentDetails(studentId);
		}
	}, [studentId, handleGetStudentDetails]);

	if (!studentId) return null;

	return (
		<Modal>
			<Modal.Trigger className="cursor-pointer hover:underline text-primary">
				Ver
			</Modal.Trigger>
			<Modal.Content
				className="max-w-4xl h-[80vh] overflow-y-auto"
				showCloseButton={true}
			>
				<Modal.Header>
					<Modal.Title>Detalles del Estudiante</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Loader2 className="animate-spin" size={32} />
						</div>
					) : error ? (
						<div className="alert alert-error">{error}</div>
					) : data ? (
						<div className="flex flex-col gap-6">
							{/* Tabs Header */}
							<div className="tabs tabs-boxed bg-base-200">
								<button
									type="button"
									role="tab"
									className={`tab ${
										activeTab === 'summary'
											? 'tab-active'
											: ''
									}`}
									onClick={() => setActiveTab('summary')}
								>
									Resumen
								</button>
								<button
									type="button"
									role="tab"
									className={`tab ${
										activeTab === 'applications'
											? 'tab-active'
											: ''
									}`}
									onClick={() =>
										setActiveTab('applications')
									}
								>
									Trayectoria
								</button>
								<button
									type="button"
									role="tab"
									className={`tab ${
										activeTab === 'internship'
											? 'tab-active'
											: ''
									}`}
									onClick={() => setActiveTab('internship')}
								>
									Práctica Activa
								</button>
							</div>

							{/* Tab Content: Summary */}
							{activeTab === 'summary' && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="card bg-base-100 shadow-sm border">
										<div className="card-body">
											<h3 className="card-title text-sm opacity-70">
												<User size={16} /> Información
												Personal
											</h3>
											<div className="divider my-1"></div>
											<p>
												<strong>Nombre:</strong>{' '}
												{data.user.name}
											</p>
											<p>
												<strong>RUT:</strong>{' '}
												{data.user.rut}
											</p>
											<p>
												<strong>Email:</strong>{' '}
												{data.user.email}
											</p>
											<p>
												<strong>Teléfono:</strong>{' '}
												{data.user.phone || 'No registrado'}
											</p>
										</div>
									</div>
									<div className="card bg-base-100 shadow-sm border">
										<div className="card-body">
											<h3 className="card-title text-sm opacity-70">
												<Briefcase size={16} /> Estado
												Académico
											</h3>
											<div className="divider my-1"></div>
											<p>
												<strong>Práctica Actual:</strong>{' '}
												{data.student?.currentInternship ||
													'No definida'}
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Tab Content: Applications */}
							{activeTab === 'applications' && (
								<div className="flex flex-col gap-4">
									<h3 className="font-bold text-lg">
										Historial de Postulaciones
									</h3>
									{data.applications.length === 0 ? (
										<p className="text-center opacity-50">
											No hay postulaciones registradas.
										</p>
									) : (
										data.applications.map((app) => (
											<div
												key={app.id}
												className="card bg-base-100 shadow-sm border p-4"
											>
												<div className="flex justify-between items-start">
													<div>
														<h4 className="font-bold">
															{app.offer?.title ||
																'Oferta eliminada'}
														</h4>
														<p className="text-sm opacity-70">
															{app.offer?.offerType?.name}
														</p>
													</div>
													<div
														className={`badge ${
															app.status === 'approved'
																? 'badge-success'
																: app.status === 'rejected'
																	? 'badge-error'
																	: 'badge-warning'
														}`}
													>
														{app.status}
													</div>
												</div>
												<div className="text-xs mt-2 opacity-50">
													Postulado el:{' '}
													{new Date(
														app.created_at,
													).toLocaleDateString()}
												</div>
											</div>
										))
									)}
								</div>
							)}

							{/* Tab Content: Internship Details */}
							{activeTab === 'internship' && (
								<div className="flex flex-col gap-6">
									{data.applications.find(
										(app) => app.internship,
									) ? (
										(() => {
											const internship =
												data.applications.find(
													(app) => app.internship,
												)?.internship;

											if (!internship) return null;

											return (
												<>
													{/* Info Práctica */}
													<div className="stats shadow w-full">
														<div className="stat">
															<div className="stat-title">
																Estado
															</div>
															<div className="stat-value text-primary text-lg">
																{(() => {
																	const statusMap: Record<
																		string,
																		string
																	> = {
																		in_progress:
																			'En proceso',
																		pending_evaluation:
																			'Evaluación pendiente',
																		finished: 'Finalizada',
																	};
																	return (
																		statusMap[
																			internship.status
																		] || internship.status
																	);
																})()}
															</div>
														</div>
														<div className="stat">
															<div className="stat-title">
																Inicio
															</div>
															<div className="stat-value text-secondary text-lg">
																{new Date(
																	internship.start_date,
																).toLocaleDateString()}
															</div>
														</div>
														<div className="stat">
															<div className="stat-title">
																Término
															</div>
															<div className="stat-value text-secondary text-lg">
																{new Date(
																	internship.end_date,
																).toLocaleDateString()}
															</div>
														</div>
													</div>

													{/* Evaluaciones */}
													<div className="card bg-base-100 shadow-sm border">
														<div className="card-body">
															<h3 className="card-title text-sm opacity-70">
																<FileText size={16} />{' '}
																Evaluaciones
															</h3>
															<div className="divider my-1"></div>
															{internship.evaluations ? (
																<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
																	<div>
																		<p className="text-xs font-bold">
																			Supervisor
																		</p>
																		<p className="text-xl">
																			{
																				internship
																					.evaluations
																					.supervisorGrade
																			}
																		</p>
																	</div>
																	<div>
																		<p className="text-xs font-bold">
																			Informe
																		</p>
																		<p className="text-xl">
																			{
																				internship
																					.evaluations
																					.reportGrade
																			}
																		</p>
																	</div>
																	<div>
																		<p className="text-xs font-bold">
																			Final
																		</p>
																		<p className="text-xl font-bold text-primary">
																			{
																				internship
																					.evaluations
																					.finalGrade
																			}
																		</p>
																	</div>
																</div>
															) : (
																<p className="text-sm opacity-50">
																	Sin evaluaciones
																	registradas.
																</p>
															)}
														</div>
													</div>

													{/* Bitácora */}
													<div className="card bg-base-100 shadow-sm border">
														<div className="card-body">
															<h3 className="card-title text-sm opacity-70">
																<Clock size={16} /> Bitácora
															</h3>
															<div className="divider my-1"></div>
															{internship.logbookEntries &&
															internship.logbookEntries
																.length > 0 ? (
																<ul className="steps steps-vertical">
																	{internship.logbookEntries.map(
																		(entry) => (
																			<li
																				key={entry.id}
																				className="step step-primary"
																			>
																				<div className="text-left ml-2">
																					<p className="font-bold">
																						{entry.title}
																					</p>
																					<p className="text-xs opacity-50">
																						{new Date(
																							entry.created_at,
																						).toLocaleDateString()}
																					</p>
																				</div>
																			</li>
																		),
																	)}
																</ul>
															) : (
																<p className="text-sm opacity-50">
																	No hay entradas en la
																	bitácora.
																</p>
															)}
														</div>
													</div>
												</>
											);
										})()
									) : (
										<div className="alert">
											<Briefcase />
											<span>
												El estudiante no tiene una práctica
												activa o registrada asociada a una
												postulación.
											</span>
										</div>
									)}
								</div>
							)}
						</div>
					) : null}
				</Modal.Body>
			</Modal.Content>
		</Modal>
	);
}
