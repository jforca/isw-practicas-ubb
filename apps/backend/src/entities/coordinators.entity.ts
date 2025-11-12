import { Entity, ForeignKey, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Coordinator {
	@PrimaryColumn({ type: 'text' })
	@ForeignKey(() => User)
	id: string;
}
