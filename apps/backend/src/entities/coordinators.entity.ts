import {
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Internship } from './internship.entity';

@Entity()
export class Coordinator {
	@PrimaryColumn({ type: 'text' })
	id: string;

	@OneToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'id' })
	user: User;

	@OneToMany(
		() => Internship,
		(internship) => internship.coordinator,
	)
	internships: Internship[];
}
