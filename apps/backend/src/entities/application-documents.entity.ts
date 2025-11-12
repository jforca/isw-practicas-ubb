import {
	Entity,
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

	@ManyToOne(() => Application)
	@JoinColumn({ name: 'application_id' })
	application: Application;

	@ManyToOne(() => Document)
	@JoinColumn({ name: 'document_id' })
	document: Document;
}
