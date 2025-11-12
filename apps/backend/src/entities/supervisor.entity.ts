import {
	Entity,
	PrimaryColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { InternshipCenter } from './internship-centers.entity';

@Entity()
export class Supervisor {
	@PrimaryColumn()
	userId: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user: User;

	@Column({ type: 'varchar', length: 255 })
	position: string;

	@ManyToOne(() => InternshipCenter)
	@JoinColumn({ name: 'internshipCenterId' })
	internshipCenter: InternshipCenter;

	@Column()
	internshipCenterId: number;
}
