import {
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class InternshipCenter {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 255 })
	legal_name: string;

	@Column({ type: 'varchar', length: 20, unique: true })
	company_rut: string;

	@Column({ type: 'varchar', length: 60 })
	email: string;

	@Column({ type: 'varchar', length: 20 })
	phone: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
