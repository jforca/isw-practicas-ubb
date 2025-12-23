import { useId } from 'react';
import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';
import { Card, Modal } from '@common/components';
import {
	Eye,
	PenLine,
	Trash,
	FileText,
	IdCard,
	MapPin,
	Phone,
	Mail,
} from 'lucide-react';

export function InternshipCenterCards({
	data,
}: {
	data: TInternshipCenter[];
}) {
	const id = useId();

	return (
		<article className="section-sm">
			<p className="paragraph-1 text-base-content/60">
				Mostrando{' '}
				<span className="text-primary font-bold">
					{data.length}
				</span>{' '}
				centros de prácticas
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{data.map((c) => (
					<Card
						key={`${id}-${c.id}`}
						className="hover:scale-102 transition-transform"
					>
						<Card.Body>
							<Card.Container className="flex justify-between">
								<Card.Container>
									<Card.Title className="text-primary font-bold">
										{c.legal_name}
									</Card.Title>

									<Card.P className="paragraph-2 text-base-content/60">
										{c.address}
									</Card.P>
								</Card.Container>

								<Card.ToolTip
									dataTip="Convenio"
									className="tooltip-info"
								>
									<Card.Button className="btn-info btn-soft rounded-full size-10">
										<FileText className="scale-300" />
									</Card.Button>
								</Card.ToolTip>
							</Card.Container>

							<Card.P className="text-base-content/80">
								{c.description}
							</Card.P>

							<Card.Divider />

							<Card.Container className="flex justify-between items-center">
								<Card.Badge className="badge-soft badge-accent paragraph-2 font-medium">
									{c.email}
								</Card.Badge>

								<Card.Actions className="justify-end">
									<Modal>
										<Card.ToolTip
											dataTip="Ver"
											className="tooltip-primary"
										>
											<Modal.Trigger className="btn btn-primary btn-soft rounded-full size-10">
												<Eye className="scale-300" />
											</Modal.Trigger>
										</Card.ToolTip>

										<Modal.Content className="container">
											<Modal.Header className="text-primary title-2">
												{c.legal_name}
											</Modal.Header>

											<Modal.Body className="flex flex-col gap-4">
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													<div className="flex flex-col gap-2 text-base-content/80">
														<h3>
															<IdCard
																size={18}
																className="inline mr-2"
															/>
															Rut Empresa
														</h3>
														<p className="bg-gray-200 rounded-lg p-2">
															{c.company_rut}
														</p>
													</div>

													<div className="flex flex-col gap-2 text-base-content/80">
														<h3>
															<FileText
																size={18}
																className="inline mr-2"
															/>
															Numero Convenio
														</h3>
														<p className="bg-gray-200 rounded-lg p-2">
															{c.convention_document_id}
														</p>
													</div>

													<div className="flex flex-col gap-2 text-base-content/80">
														<h3>
															<Phone
																size={18}
																className="inline mr-2"
															/>
															Telefono
														</h3>
														<p className="bg-gray-200 rounded-lg p-2">
															{c.phone}
														</p>
													</div>

													<div className="flex flex-col gap-2 text-base-content/80">
														<h3>
															<Mail
																size={18}
																className="inline mr-2"
															/>
															Correo Electrónico
														</h3>
														<p className="bg-gray-200 rounded-lg p-2">
															{c.email}
														</p>
													</div>
												</div>

												<div className="flex flex-col gap-2 text-base-content/80">
													<h3>
														<MapPin
															size={18}
															className="inline mr-2"
														/>
														Dirección
													</h3>
													<p className="bg-gray-200 rounded-lg p-2">
														{c.address}
													</p>
												</div>

												<div className="flex flex-col gap-2 text-base-content/80 basis-1/2">
													<h3>Descripción</h3>
													<p className="bg-gray-200 rounded-lg p-2">
														{c.description}
													</p>
												</div>
											</Modal.Body>
											<Modal.Actions>
												<button
													type="button"
													className="btn btn-info"
												>
													<FileText size={18} />
													Ver Convenio
												</button>
												<button
													type="button"
													className="btn btn-success"
												>
													<PenLine size={18} />
													Editar
												</button>
												<button
													type="button"
													className="btn btn-error"
												>
													<Trash size={18} />
													Eliminar
												</button>
											</Modal.Actions>
										</Modal.Content>
									</Modal>

									<Modal>
										<Card.ToolTip
											dataTip="Editar"
											className="tooltip-success"
										>
											<Modal.Trigger className="btn btn-success btn-soft rounded-full size-10">
												<PenLine className="scale-300" />
											</Modal.Trigger>
										</Card.ToolTip>

										<Modal.Content className="container">
											<Modal.Header className="text-primary title-2">
												{c.legal_name}
											</Modal.Header>

											<Modal.Body className="flex flex-col gap-4">
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													<div className="flex flex-col gap-2 text-base-content/80">
														<h3>
															<IdCard
																size={18}
																className="inline mr-2"
															/>
															Rut Empresa
														</h3>

														<input
															type="text"
															defaultValue={c.company_rut}
															className="input w-full rounded-lg"
														/>
													</div>

													<div className="flex flex-col gap-2 text-base-content/80">
														<h3>
															<FileText
																size={18}
																className="inline mr-2"
															/>
															Numero Convenio
														</h3>

														<input
															type="number"
															className="input w-full rounded-lg"
															disabled
															defaultValue={
																c.convention_document_id
															}
														/>
													</div>

													<div className="flex flex-col gap-2 text-base-content/80">
														<h3>
															<Phone
																size={18}
																className="inline mr-2"
															/>
															Telefono
														</h3>

														<input
															type="tel"
															defaultValue={c.phone}
															className="input w-full rounded-lg"
														/>
													</div>

													<div className="flex flex-col gap-2 text-base-content/80">
														<h3>
															<Mail
																size={18}
																className="inline mr-2"
															/>
															Correo Electrónico
														</h3>

														<input
															type="email"
															defaultValue={c.email}
															className="input w-full rounded-lg"
														/>
													</div>
												</div>

												<div className="flex flex-col gap-2 text-base-content/80">
													<h3>
														<MapPin
															size={18}
															className="inline mr-2"
														/>
														Dirección
													</h3>

													<input
														type="text"
														defaultValue={c.address}
														className="input w-full rounded-lg"
													/>
												</div>

												<div className="flex flex-col gap-2 text-base-content/80 basis-1/2">
													<h3>Descripción</h3>

													<input
														type="text"
														defaultValue={c.description}
														className="input w-full rounded-lg"
													/>
												</div>
											</Modal.Body>
											<Modal.Actions>
												<button
													type="button"
													className="btn btn-info btn-soft"
												>
													<FileText size={18} />
													Subir Convenio
												</button>
												<button
													type="button"
													className="btn btn-error btn-soft"
												>
													<Trash size={18} />
													Cancelar
												</button>
												<button
													type="button"
													className="btn btn-success btn-soft"
												>
													<PenLine size={18} />
													Guardar Edición
												</button>
											</Modal.Actions>
										</Modal.Content>
									</Modal>

									<Modal>
										<Card.ToolTip
											dataTip="Eliminar"
											className="tooltip-error"
										>
											<Modal.Trigger className="btn btn-error btn-soft rounded-full size-10">
												<Trash className="scale-300" />
											</Modal.Trigger>
										</Card.ToolTip>

										<Modal.Content className="container">
											<Modal.Header className="text-error title-2">
												¿Estás seguro que deseas eliminar
												este centro de prácticas?
											</Modal.Header>

											<Modal.Body className="flex flex-col gap-4">
												<div className="bg-neutral/10 border-l-4 border-neutral rounded-lg p-4">
													<p className="font-bold text-neutral mb-2">
														Advertencia: Esta acción no se
														puede deshacer
													</p>
													<p className="text-base-content/80 text-sm">
														Se eliminará permanentemente:
													</p>
													<div className="mt-3 p-3 bg-base-100 rounded-lg">
														<p className="font-semibold text-primary">
															{c.legal_name}
														</p>
													</div>
												</div>
											</Modal.Body>
											<Modal.Actions>
												<button
													type="button"
													className="btn btn-neutral btn-soft"
												>
													Cancelar
												</button>
												<button
													type="button"
													className="btn btn-error btn-soft"
												>
													<Trash size={18} />
													Eliminar
												</button>
											</Modal.Actions>
										</Modal.Content>
									</Modal>
								</Card.Actions>
							</Card.Container>
						</Card.Body>
					</Card>
				))}
			</div>
		</article>
	);
}
