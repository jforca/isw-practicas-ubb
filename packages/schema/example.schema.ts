import { z } from 'zod/v4';

export const UserSchema = z.object({
	id: z.coerce.number().positive(),
	name: z.string(),
	email: z.url().min(10).max(60),
	password: z.string().min(8).max(255),
	is_verified: z.boolean().default(false),
	created_at: z.date(),
	updated_at: z.date(),
});

export type TUser = z.infer<typeof UserSchema>;
