import {
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryColumn,
	ForeignKey,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Session {
	@PrimaryColumn({ type: 'text' })
	id: string; // Better Auth

	@Column({ type: 'timestamp' })
	expiresAt: Date; // Better Auth

	@Column({ type: 'text', unique: true })
	token: string; // Better Auth

	@Column({ type: 'text', nullable: true })
	ipAddress: string; // Better Auth

	@Column({ type: 'text', nullable: true })
	userAgent: string; // Better Auth

	@Column({ type: 'text' })
	@ForeignKey(() => User)
	userId: string; // Better Auth

	@CreateDateColumn()
	createdAt: Date; // Better Auth

	@UpdateDateColumn()
	updatedAt: Date; // Better Auth
}
