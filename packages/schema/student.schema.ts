import { z } from 'zod/v4';
import { UserSchema } from './user.schema';

export const StudentInternship = {
	practica1: 'Práctica 1',
	practica2: 'Práctica 2',
} as const;

export type TStudentInternship =
	(typeof StudentInternship)[keyof typeof StudentInternship];

const internshipValues = Object.values(
	StudentInternship,
) as [string, ...string[]];

export const StudentSchema = UserSchema.extend({
	user_role: z.literal('student'),
	currentInternship: z
		.enum(internshipValues)
		.optional()
		.default(StudentInternship.practica1),
});

export type TStudent = z.infer<typeof StudentSchema>;
