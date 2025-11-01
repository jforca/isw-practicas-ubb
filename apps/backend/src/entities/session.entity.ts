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
	id: string;

	@Column({ type: 'timestamp' })
	expiresAt: Date;

	@Column({ type: 'text', unique: true })
	token: string;

	@Column({ type: 'text', nullable: true })
	ipAddress: string;

	@Column({ type: 'text', nullable: true })
	userAgent: string;

	@Column({ type: 'text' })
	@ForeignKey(() => User)
	userId: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
