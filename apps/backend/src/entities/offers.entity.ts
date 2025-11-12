import {
	Entity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';

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

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
