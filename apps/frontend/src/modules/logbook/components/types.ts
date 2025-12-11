// Se utiliza la I al principio para seguir reglas de biome
export interface ILogbookEntry {
	id: number;
	title: string;
	content: string;

	// Se cambia snake_case a camelCase para Biome
	createdAt: Date | string;
	updatedAt: Date | string;

	internshipId: number;
}
