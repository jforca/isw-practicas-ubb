import {
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { OffersType } from './offers-types.entity';
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

	@ManyToOne(() => OffersType)
	@JoinColumn({ name: 'offer_type_id' })
	offerType: OffersType;

	@ManyToOne(() => Coordinator)
	@JoinColumn({ name: 'created_by' })
	coordinator: Coordinator;

	@ManyToOne(() => InternshipCenter)
	@JoinColumn({ name: 'internship_center_id' })
	internshipCenter: InternshipCenter;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
