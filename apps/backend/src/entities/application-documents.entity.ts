import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { Document } from './documents.entity';

@Entity()
export class ApplicationDocuments {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'integer' })
	application_id: number;

	@ManyToOne(() => Application)
	@JoinColumn({ name: 'application_id' })
	application: Application;

	@Column({ type: 'integer' })
	document_id: number;

	@ManyToOne(() => Document)
	@JoinColumn({ name: 'document_id' })
	document: Document;
}
