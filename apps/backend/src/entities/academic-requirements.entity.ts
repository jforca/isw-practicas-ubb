import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Coordinator } from './coordinators.entity';
import { OffersType } from './offers-types.entity';
import { Student } from './students.entity';

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

	@Column({ name: 'student_id', type: 'text' })
	student_id: string;

	@Column({ name: 'internship_type_id', type: 'int' })
	internship_type_id: number;

	@Column({ name: 'updated_by', type: 'int' })
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
