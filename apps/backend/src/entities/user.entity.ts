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

	@Column({ length: 30 })
	name: string;

	@Column({ length: 60, unique: true })
	email: string;

	@Column({ length: 255 })
	password: string;

	@Column({ default: false })
	is_verified: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
