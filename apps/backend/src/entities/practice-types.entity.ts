import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
} from 'typeorm';

@Entity('practice_types')
export class PracticeType {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 150 })
	name: string;

	@Column({ type: 'boolean', default: true })
	is_active: boolean;
}
