import { ChileanNumberRegex } from '../utils/regex.utils';
import { z } from 'zod/v4';

export const InternshipCentersSchema = z.object({
	id: z.coerce.number(),
	legal_name: z.string().max(255),
	company_rut: z.string().max(20),
	email: z.email(),
	phone: z.string().regex(ChileanNumberRegex),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type TInternshipCenter = z.infer<
	typeof InternshipCentersSchema
>;
