import {
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Coordinator {
	@PrimaryColumn({ type: 'text' })
	id: string;

	@OneToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'id' })
	user: User;
}
