import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinColumn,
	OneToOne,
	//	ForeignKey,
} from 'typeorm';
import { Internship } from './internship.entity';

@Entity()
export class InternshipEvaluation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'numeric', precision: 3, scale: 2 })
	supervisorGrade: number;

	@Column({ type: 'varchar', length: 2048 })
	supervisorComments: string;

	@Column({ type: 'numeric', precision: 3, scale: 2 })
	reportGrade: number;

	@Column({ type: 'varchar', length: 2048 })
	reportComments: string;

	@Column({ type: 'numeric', precision: 3, scale: 2 })
	finalGrade: number;

	@Column({ type: 'timestamp' })
	completedAt: Date;

	@OneToOne(() => Internship)
	@JoinColumn({ name: 'internship_id' })
	internship: Internship;
}
