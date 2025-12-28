import {
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	Unique,
} from 'typeorm';
import { Offer } from './offers.entity';
import { OffersType } from './offers-types.entity';

@Entity('offer_offer_type')
@Unique(['offer', 'offerType'])
export class OfferOfferType {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(
		() => Offer,
		(offer) => offer.offerOfferTypes,
		{
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({ name: 'offer_id' })
	offer: Offer;

	@ManyToOne(
		() => OffersType,
		(offerType) => offerType.offerOfferTypes,
		{
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({ name: 'offer_type_id' })
	offerType: OffersType;
}
