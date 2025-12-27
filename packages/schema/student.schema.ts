import { z } from 'zod/v4';
import { UserSchema } from './user.schema';

// Currently, a Student is just a User with a specific role.
// We extend the UserSchema to ensure consistency.
// If specific student fields are added later, they should be added here.
export const StudentSchema = UserSchema.extend({
	user_role: z.literal('student'),
});

export type TStudent = z.infer<typeof StudentSchema>;
