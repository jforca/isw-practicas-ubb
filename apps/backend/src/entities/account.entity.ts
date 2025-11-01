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
	id: string;

	@Column({ type: 'text' })
	accountId: string;

	@Column({ type: 'text' })
	providerId: string;

	@Column({ type: 'text' })
	@ForeignKey(() => User)
	userId: string;

	@Column({ type: 'text', nullable: true })
	accessToken: string;

	@Column({ type: 'text', nullable: true })
	refreshToken: string;

	@Column({ type: 'text', nullable: true })
	idToken: string;

	@Column({ type: 'timestamp', nullable: true })
	accessTokenExpiresAt: Date;

	@Column({ type: 'timestamp', nullable: true })
	refreshTokenExpiresAt: Date;

	@Column({ type: 'text', nullable: true })
	scope: string;

	@Column({ type: 'text', nullable: true })
	password: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
