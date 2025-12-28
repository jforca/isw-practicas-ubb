import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	Unique,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import type { InternshipEvaluation } from './internship-evaluation.entity';
import { EvaluationItem } from './evaluation-item.entity';

@Entity()
@Unique('uq_eval_item', ['evaluation', 'item'])
export class EvaluationResponse {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(
		() =>
			require('./internship-evaluation.entity')
				.InternshipEvaluation,
		(ev: InternshipEvaluation) => ev.responses,
		{
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({ name: 'evaluation_id' })
	evaluation: InternshipEvaluation;

	@ManyToOne(() => EvaluationItem, { eager: true })
	@JoinColumn({ name: 'item_id' })
	item: EvaluationItem;

	@Column({ type: 'varchar', length: 255 })
	selectedValue: string;

	@Column({
		type: 'numeric',
		precision: 7,
		scale: 2,
		default: 0,
	})
	numericValue: number;

	@Column({
		type: 'numeric',
		precision: 7,
		scale: 2,
		default: 0,
	})
	score: number;

	@Column({ type: 'varchar', length: 1024, nullable: true })
	comment: string | null;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
