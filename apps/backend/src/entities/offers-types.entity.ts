import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
} from 'typeorm';
import { OfferOfferType } from './offer-offer-type.entity';

@Entity()
export class OffersType {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 150 })
	name: string;

	@Column({ type: 'boolean', default: true })
	is_active: boolean;

	@OneToMany(
		() => OfferOfferType,
		(oot) => oot.offerType,
	)
	offerOfferTypes: OfferOfferType[];
}
