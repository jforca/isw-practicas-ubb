import {
	Entity,
	Column,
	JoinColumn,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	OneToOne,
	ManyToOne,
	AfterInsert,
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

	@AfterInsert()
	async createEvaluationAfterInsert() {
		const { AppDataSource } = await import(
			'../config/db.config.js'
		);
		const { InternshipEvaluation } = await import(
			'./internship-evaluation.entity.js'
		);

		try {
			const internship = await AppDataSource.getRepository(
				Internship,
			).findOne({
				where: { id: this.id },
				relations: [
					'supervisor',
					'coordinator',
					'application',
					'application.student',
				],
			});

			if (
				!internship?.supervisor ||
				!internship?.coordinator ||
				!internship?.application?.student
			) {
				return;
			}

			const existing = await AppDataSource.getRepository(
				InternshipEvaluation,
			).findOne({
				where: { internship: { id: this.id } },
			});

			if (existing) return;

			const evaluation = new InternshipEvaluation();
			evaluation.internship = internship;
			evaluation.supervisorGrade = null;
			evaluation.reportGrade = null;
			evaluation.finalGrade = null;
			evaluation.completedAt = null;
			evaluation.signature_document = null;

			await AppDataSource.getRepository(
				InternshipEvaluation,
			).save(evaluation);
		} catch (error) {
			console.error(
				`No se pudo auto-crear evaluación para internship ${this.id}:`,
				error,
			);
		}
	}
}
