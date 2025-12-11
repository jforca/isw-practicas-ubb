import {
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	OneToOne,
} from 'typeorm';

import { Document } from './documents.entity';

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

	@OneToOne(
		() => Document,
		(document) => document.id,
	)
	@Column({ type: 'varchar', length: 255 })
	convention_document_id: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
