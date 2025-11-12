import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { Internship } from './internship.entity';

@Entity()
export class LogbookEntries {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 155 })
	title: string;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	created_at: Date;

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
		onUpdate: 'CURRENT_TIMESTAMP',
	})
	updated_at: Date;

	@ManyToOne(() => Internship)
	@JoinColumn({ name: 'internship_id' })
	internship: Internship;
}
