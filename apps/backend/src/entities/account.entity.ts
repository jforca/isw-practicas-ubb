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
export class Account {
	@PrimaryColumn({ type: 'text' })
	id: string; // Better Auth

	@Column({ type: 'text' })
	accountId: string; // Better Auth

	@Column({ type: 'text' })
	providerId: string; // Better Auth

	@Column({ type: 'text' })
	@ForeignKey(() => User)
	userId: string; // Better Auth

	@Column({ type: 'text', nullable: true })
	accessToken: string; // Better Auth

	@Column({ type: 'text', nullable: true })
	refreshToken: string; // Better Auth

	@Column({ type: 'text', nullable: true })
	idToken: string; // Better Auth

	@Column({ type: 'timestamp', nullable: true })
	accessTokenExpiresAt: Date; // Better Auth

	@Column({ type: 'timestamp', nullable: true })
	refreshTokenExpiresAt: Date; // Better Auth

	@Column({ type: 'text', nullable: true })
	scope: string; // Better Auth

	@Column({ type: 'text', nullable: true })
	password: string; // Better Auth

	@CreateDateColumn()
	createdAt: Date; // Better Auth

	@UpdateDateColumn()
	updatedAt: Date; // Better Auth
}
