import { z } from 'zod/v4';

export const StudentSchema = z.object({
	id: z.string(),
});

export type TStudent = z.infer<typeof StudentSchema>;
