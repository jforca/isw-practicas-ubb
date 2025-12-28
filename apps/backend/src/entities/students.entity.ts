import {
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
	Column,
} from 'typeorm';
import { User } from './user.entity';

import { StudentInternship } from '@packages/schema/student.schema';
import type { TStudentInternship } from '@packages/schema/student.schema';

@Entity()
export class Student {
	@PrimaryColumn({ type: 'text' })
	id: string;

	@OneToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'id' })
	user: User;

	@Column({
		type: 'enum',
		enum: StudentInternship,
		default: StudentInternship.practica1,
	})
	currentInternship: TStudentInternship;
}
