import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ApplicationStatus {
	Pending = 'pending',
	Approved = 'approved',
	Rejected = 'rejected',
}

@Entity()
export class Application {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created_at: Date;

	@Column({
		type: 'enum',
		enum: ApplicationStatus,
		default: ApplicationStatus.Pending,
	})
	status: ApplicationStatus;

	@Column({ type: 'text' })
	student_id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'student_id' })
	student: User;

	@Column({ type: 'integer' })
	offer_id: number;

	// @ManyToOne(() => Offer)
	// @JoinColumn({ name: 'offer_id' })
	// offer: Offer;
}
