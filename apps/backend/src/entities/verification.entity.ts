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
	id: string;

	@Column({ type: 'text' })
	identifier: string;

	@Column({ type: 'text' })
	value: string;

	@Column({ type: 'timestamp' })
	expiresAt: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
