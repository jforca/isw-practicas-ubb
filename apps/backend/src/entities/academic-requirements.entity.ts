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
import { OffersType } from './offers-types.entity';
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

	@Column({ name: 'internship_type_id' })
	internship_type_id: number;

	@Column({ name: 'updated_by', nullable: true })
	updated_by: number;

	@ManyToOne(() => Student)
	@JoinColumn({ name: 'student_id' })
	student: Student;

	@ManyToOne(() => OffersType)
	@JoinColumn({ name: 'offer_type_id' })
	offerType: OffersType;

	@ManyToOne(() => Coordinator)
	@JoinColumn({ name: 'updated_by' })
	coordinator: Coordinator;

	@CreateDateColumn({ name: 'created_at' })
	created_at: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updated_at: Date;
}
