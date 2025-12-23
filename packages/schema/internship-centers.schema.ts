import { ChileanNumberRegex } from '../utils/regex.utils';
import { z } from 'zod/v4';

export const InternshipCentersSchema = z.object({
	id: z.coerce.number().int().positive(),
	legal_name: z.string().max(255),
	company_rut: z.string().max(20),
	email: z.email(),
	phone: z.string().regex(ChileanNumberRegex),
	address: z.string().max(50),
	description: z.string().max(70),
	convention_document_id: z.coerce
		.number()
		.int()
		.positive()
		.nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type TInternshipCenter = z.infer<
	typeof InternshipCentersSchema
>;
