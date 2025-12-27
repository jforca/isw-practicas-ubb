import {
	Entity,
	Column,
	JoinColumn,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	OneToOne,
	ManyToOne,
} from 'typeorm';
import { Document } from './documents.entity';
import { Coordinator } from './coordinators.entity';
import { Supervisor } from './supervisor.entity';
import { Application } from './application.entity';

export enum InternshipStatus {
	InProgress = 'in_progress',
	PendingEvaluation = 'pending_evaluation',
	Finished = 'finished',
}

@Entity()
export class Internship {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	start_date: Date;

	@CreateDateColumn()
	end_date: Date;

	@OneToOne(() => Document)
	@JoinColumn({ name: 'final_report_id' })
	final_report: Document;

	@ManyToOne(() => Coordinator)
	@JoinColumn({ name: 'coordinator_id' })
	coordinator: Coordinator;

	@ManyToOne(() => Supervisor)
	@JoinColumn({ name: 'supervisor_id' })
	supervisor: Supervisor;

	@OneToOne(() => Application, { nullable: true })
	@JoinColumn({ name: 'application_id' })
	application: Application | null;

	@Column({
		type: 'enum',
		enum: InternshipStatus,
		enumName: 'internship_status',
		default: InternshipStatus.InProgress,
	})
	status: InternshipStatus;
}
