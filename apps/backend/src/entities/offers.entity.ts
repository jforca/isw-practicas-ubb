import {
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { InternshipType } from './internship-types.entity';
import { Coordinator } from './coordinators.entity';
import { InternshipCenter } from './internship-centers.entity';

export enum OfferStatus {
	Published = 'published',
	Closed = 'closed',
	Filled = 'filled',
}

@Entity()
export class Offer {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 155 })
	title: string;

	@Column({ type: 'varchar', length: 255 })
	description: string;

	@Column({ type: 'date' })
	deadline: Date;

	@Column({
		type: 'enum',
		enum: OfferStatus,
		enumName: 'offer_status',
		default: OfferStatus.Published,
	})
	status: OfferStatus;

	@Column({ name: 'internship_type_id' })
	internship_type_id: number;

	@ManyToOne(() => InternshipType)
	@JoinColumn({ name: 'internship_type_id' })
	internshipType: InternshipType;

	@Column({ type: 'text' })
	created_by: string;

	@ManyToOne(() => Coordinator)
	@JoinColumn({ name: 'created_by' })
	coordinator: Coordinator;

	@Column({ type: 'int' })
	internship_center_id: number;

	@ManyToOne(() => InternshipCenter)
	@JoinColumn({ name: 'internship_center_id' })
	internshipCenter: InternshipCenter;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
