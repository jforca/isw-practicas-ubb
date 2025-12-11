import {
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryColumn,
} from 'typeorm';

export type TUserRole =
	| 'student'
	| 'supervisor'
	| 'coordinator';

@Entity()
export class User {
	@PrimaryColumn({ type: 'text' })
	id: string; // Better Auth

	@Column({ type: 'varchar', length: 13, unique: true })
	rut: string;

	@Column({ type: 'varchar', length: 12, nullable: true })
	phone: string;

	@Column({ type: 'text' })
	name: string; // Better Auth

	@Column({ type: 'text', unique: true })
	email: string; // Better Auth

	@Column({ type: 'bool', default: false })
	emailVerified: boolean; // Better Auth

	@Column({ type: 'text', nullable: true })
	image: string; // Better Auth

	@Column({
		type: 'enum',
		enum: ['student', 'supervisor', 'coordinator'],
	})
	user_role: TUserRole;

	@CreateDateColumn()
	createdAt: Date; // Better Auth

	@UpdateDateColumn()
	updatedAt: Date; // Better Auth
}
