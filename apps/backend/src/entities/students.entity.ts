import {
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Student {
	@PrimaryColumn({ type: 'text' })

	@OneToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'id' })
	user: User;
}
