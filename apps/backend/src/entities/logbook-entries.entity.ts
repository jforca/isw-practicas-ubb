import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class LogbookEntries {
	@PrimaryColumn({ type: 'int' })
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

	/*
    @ManyToOne(() => Interships, intership => intership.reports)
    @JoinColumn({ name: 'internship_id' })
    internship: Interships;
    */
	/*
    @Column({ type: 'int' })
    internship_id: number; 
    */
}
