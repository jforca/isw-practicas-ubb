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

	@Column({ name: 'practice_type_id' })
	internship_type_id: number;

	@ManyToOne(() => InternshipType)
	@JoinColumn({ name: 'practice_type_id' })
	internshipType: InternshipType;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
