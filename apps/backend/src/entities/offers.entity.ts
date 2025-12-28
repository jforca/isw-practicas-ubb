import {
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	OneToMany,
} from 'typeorm';
import { Coordinator } from './coordinators.entity';
import { InternshipCenter } from './internship-centers.entity';
import { OfferOfferType } from './offer-offer-type.entity';

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

	@OneToMany(
		() => OfferOfferType,
		(oot) => oot.offer,
		{
			cascade: true,
		},
	)
	offerOfferTypes: Promise<OfferOfferType[]>;

	@ManyToOne(() => Coordinator)
	@JoinColumn({ name: 'created_by' })
	coordinator: Promise<Coordinator>;

	@ManyToOne(() => InternshipCenter)
	@JoinColumn({ name: 'internship_center_id' })
	internshipCenter: Promise<InternshipCenter>;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
