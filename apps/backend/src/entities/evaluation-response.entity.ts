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
import { InternshipEvaluation } from './internship-evaluation.entity';
import { EvaluationItem } from './evaluation-item.entity';

@Entity()
@Unique('uq_eval_item', ['evaluation', 'item'])
export class EvaluationResponse {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(
		() => InternshipEvaluation,
		(ev) => ev.responses,
		{
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({ name: 'evaluation_id' })
	evaluation: InternshipEvaluation;

	@ManyToOne(() => EvaluationItem, { eager: true })
	@JoinColumn({ name: 'item_id' })
	item: EvaluationItem;

	// Raw selected value (option key, text, or numeric as string)
	@Column({ type: 'varchar', length: 255 })
	selectedValue: string;

	// Parsed numeric value if applicable
	@Column({
		type: 'numeric',
		precision: 7,
		scale: 2,
		default: 0,
	})
	numericValue: number;

	// Computed score for the item (considering weight/maxScore)
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
