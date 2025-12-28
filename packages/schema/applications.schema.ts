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
	status: ApplicationStatusEnum.refine(
		(val) => val === 'approved' || val === 'rejected',
		{
			message: 'El estado debe ser approved o rejected',
		},
	),
});

export type TCreateApplication = z.infer<
	typeof CreateApplicationSchema
>;
export type TUpdateApplicationStatus = z.infer<
	typeof UpdateApplicationStatusSchema
>;
