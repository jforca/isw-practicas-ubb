import {
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryColumn,
} from 'typeorm';

@Entity()
export class Verification {
	@PrimaryColumn({ type: 'text' })
	id: string; // Better Auth

	@Column({ type: 'text' })
	identifier: string; // Better Auth

	@Column({ type: 'text' })
	value: string; // Better Auth

	@Column({ type: 'timestamp' })
	expiresAt: Date; // Better Auth

	@CreateDateColumn()
	createdAt: Date; // Better Auth

	@UpdateDateColumn()
	updatedAt: Date; // Better Auth
}
