import {
	Entity,
	Column,
	ForeignKey,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Document {
	@PrimaryGeneratedColumn()
	id: number;
	@Column({ type: 'varchar', length: 255 })
	file_name: string;

	@Column({ type: 'varchar', length: 255 })
	file_path: string;

	@Column({ type: 'varchar', length: 255 })
	mime_type: string;

	@Column({ type: 'timestamp' })
	uploaded_at: Date;

	@Column({ type: 'text' })
	@ForeignKey(() => User)
	uploaded_by: string;
}
