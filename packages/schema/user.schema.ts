import { z } from 'zod/v4';
import {
	ChileanNumberRegex,
	ChileanRUTRegex,
} from '../utils/regex.utils';

export const UserSchema = z.object({
	id: z.string(),
	phone: z.string().regex(ChileanNumberRegex).nullable(),
	name: z.string(),
	email: z.email(),
	emailverified: z.boolean().default(false),
	image: z.url().nullable(),
	user_role: z.enum([
		'student',
		'supervisor',
		'coordinator',
	]),
	rut: z.string().regex(ChileanRUTRegex),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type TUser = z.infer<typeof UserSchema>;
