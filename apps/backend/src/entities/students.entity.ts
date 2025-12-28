import {
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
	Column,
} from 'typeorm';
import { User } from './user.entity';

export enum StudentInternship {
	Practica1 = 'Práctica 1',
	Practica2 = 'Práctica 2',
}

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
		default: StudentInternship.Practica1,
	})
	currentInternship: StudentInternship;
}
