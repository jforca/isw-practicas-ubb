export interface ILogbookEntry {
	id: number;
	title: string;
	content: string;

	createdAt: Date | string;
	updatedAt: Date | string;

	internshipId: number;
}
