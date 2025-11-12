import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { Student } from './students.entity';
import { InternshipType } from './internship-types.entity';
import { Coordinator } from './coordinators.entity';

export enum AcademicRequirementStatus {
	Pending = 'pending',
	Approved = 'approved',
	Rejected = 'rejected',
}

@Entity('academic_requirements')
export class AcademicRequirement {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'enum',
		enum: AcademicRequirementStatus,
		default: AcademicRequirementStatus.Pending,
	})
	status: AcademicRequirementStatus;

	@Column({ name: 'student_id' })
	student_id: number;

	@Column({ name: 'practice_type_id' })
	practice_type_id: number;

	@Column({ name: 'updated_by', nullable: true })
	updated_by: number;

	@ManyToOne(() => Student)
	@JoinColumn({ name: 'student_id' })
	student: Student;

	@ManyToOne(() => InternshipType)
	@JoinColumn({ name: 'practice_type_id' })
	internshipType: InternshipType;

	@ManyToOne(() => Coordinator)
	@JoinColumn({ name: 'updated_by' })
	coordinator: Coordinator;

	@CreateDateColumn({ name: 'created_at' })
	created_at: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updated_at: Date;
}
