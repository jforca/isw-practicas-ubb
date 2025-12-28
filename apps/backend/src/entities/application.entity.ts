import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Offer } from './offers.entity';

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

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'student_id' })
	student: User;

	@ManyToOne(() => Offer)
	@JoinColumn({ name: 'offer_id' })
	offer: Offer;
}
