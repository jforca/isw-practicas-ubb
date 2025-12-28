import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinColumn,
	OneToOne,
	OneToMany,
	RelationId,
} from 'typeorm';
import { Internship } from './internship.entity';
import { EvaluationResponse } from './evaluation-response.entity';
import { Document } from './documents.entity';

@Entity()
export class InternshipEvaluation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'numeric', precision: 3, scale: 2 })
	supervisorGrade: number;

	@Column({ type: 'numeric', precision: 3, scale: 2 })
	reportGrade: number;

	@Column({ type: 'numeric', precision: 3, scale: 2 })
	finalGrade: number;

	@Column({ type: 'timestamp' })
	completedAt: Date;

	@Column({
		type: 'varchar',
		length: 1024,
		nullable: true,
	})
	supervisorComments: string | null;

	@Column({
		type: 'varchar',
		length: 1024,
		nullable: true,
	})
	reportComments: string | null;

	@OneToOne(() => Internship)
	@JoinColumn({ name: 'internship_id' })
	internship: Internship;

	@OneToMany(
		() => EvaluationResponse,
		(res) => res.evaluation,
		{
			cascade: true,
		},
	)
	responses: EvaluationResponse[];

	@OneToOne(() => Document, { nullable: true })
	@JoinColumn({ name: 'signature_document_id' })
	signature_document: Document | null;

	@RelationId(
		(it: InternshipEvaluation) => it.signature_document,
	)
	signature_document_id: number | null;
}
