import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 30 })
	name: string;

	@Column({ type: 'varchar', length: 60, unique: true })
	email: string;

	@Column({ type: 'varchar', length: 255 })
	password: string;

	@Column({ type: 'boolean', default: false })
	is_verified: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
