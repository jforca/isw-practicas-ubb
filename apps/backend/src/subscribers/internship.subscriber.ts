import {
	EventSubscriber,
	EntitySubscriberInterface,
	InsertEvent,
} from 'typeorm';
import {
	Internship,
	InternshipEvaluation,
} from '@entities';

@EventSubscriber()
export class InternshipSubscriber
	implements EntitySubscriberInterface<Internship>
{
	listenTo() {
		return Internship;
	}

	async afterInsert(event: InsertEvent<Internship>) {
		try {
			const internship = await event.manager.findOne(
				Internship,
				{
					where: { id: event.entity.id },
					relations: [
						'supervisor',
						'coordinator',
						'application',
						'application.student',
					],
				},
			);

			if (
				!internship?.supervisor ||
				!internship?.coordinator ||
				!internship?.application?.student
			) {
				return;
			}

			const existing = await event.manager.findOne(
				InternshipEvaluation,
				{
					where: { internship: { id: internship.id } },
				},
			);

			if (existing) return;

			const evaluation = event.manager.create(
				InternshipEvaluation,
				{
					internship,
					supervisorGrade: null,
					reportGrade: null,
					finalGrade: null,
					completedAt: null,
					signature_document: null,
				},
			);

			await event.manager.save(evaluation);
		} catch (error) {
			console.error(
				`No se pudo auto-crear evaluación para internship ${event.entity?.id}:`,
				error,
			);
		}
	}
}
