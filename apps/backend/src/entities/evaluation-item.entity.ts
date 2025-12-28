import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

export type TEvaluationType = 'SUPERVISOR' | 'REPORT';

@Entity()
export class EvaluationItem {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'enum', enum: ['SUPERVISOR', 'REPORT'] })
	evaluationType: TEvaluationType;

	@Column({ type: 'varchar', length: 255 })
	label: string;

	@Column({ type: 'varchar', length: 100, nullable: true })
	section: string | null;

	@Column({ type: 'int', default: 0 })
	order: number;

	@Column({ type: 'boolean', default: true })
	isActive: boolean;

	@Column({
		type: 'numeric',
		precision: 5,
		scale: 2,
		default: 1,
	})
	weight: number;

	@Column({
		type: 'numeric',
		precision: 5,
		scale: 2,
		default: 1,
	})
	maxScore: number;

	@Column({ type: 'text', nullable: true })
	optionsSchema: string | null;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
