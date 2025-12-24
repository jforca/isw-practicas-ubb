import {
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	RelationId,
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

	@Column({ type: 'varchar', length: 50 })
	address: string;

	@Column({ type: 'varchar', length: 70 })
	description: string;

	@OneToOne(() => Document, { nullable: true })
	@JoinColumn({ name: 'convention_document_id' })
	convention_document: Document | null;

	@RelationId(
		(it: InternshipCenter) => it.convention_document,
	)
	convention_document_id: number | null;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
