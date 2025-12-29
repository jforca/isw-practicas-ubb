import { z } from 'zod/v4';

export const ApplicationStatusEnum = z.enum([
	'pending',
	'approved',
	'rejected',
]);

export const CreateApplicationSchema = z.object({
	offerId: z.coerce.number().int().positive({
		message:
			'El ID de la oferta debe ser un número positivo',
	}),
});

export const UpdateApplicationStatusSchema = z.object({
	status: ApplicationStatusEnum,
});

export type TCreateApplication = z.infer<
	typeof CreateApplicationSchema
>;
export type TUpdateApplicationStatus = z.infer<
	typeof UpdateApplicationStatusSchema
>;
