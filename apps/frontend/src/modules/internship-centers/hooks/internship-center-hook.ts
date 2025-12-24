//import type { TInternshipCenter } from '@packages/schema/internship-centers.schema';

export function UseInternshipCenter() {
	const findMany = async (
		offset: number,
		limit: number,
	) => {
		const response = await fetch(
			`/api/internship-centers/find-many?offset=${offset}&limit=${limit}`,
		);
		const data = await response.json();
		return data;
	};

	return {
		findMany,
	};
}
