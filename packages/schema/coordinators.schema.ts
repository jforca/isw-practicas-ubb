import { z } from 'zod/v4';

export const CoordinatorSchema = z.object({
	id: z.string(),
});
