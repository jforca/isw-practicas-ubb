/**
 * Conversión de calificaciones letra (A-F) a escala numérica (1-7)
 * A: 7.0 (Sobresaliente)
 * B: 6.0 (Bueno)
 * C: 5.0 (Moderado)
 * D: 4.0 (Suficiente)
 * E: 2.0 (Insuficiente)
 * F: 1.0 (No aplica)
 */
export type TEvalLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

const LETTER_TO_SCORE: Record<TEvalLetter, number> = {
	A: 7.0,
	B: 6.0,
	C: 5.0,
	D: 4.0,
	E: 2.0,
	F: 1.0,
};

/**
 * Convierte una letra de evaluación a su valor numérico
 */
export function letterToScore(
	letter: TEvalLetter | null,
): number {
	if (!letter) return 0;
	return LETTER_TO_SCORE[letter] || 0;
}

/**
 * Calcula el promedio de evaluaciones en escala 1-7
 * @param evaluations Array de evaluaciones con valores A-F y sus valores numéricos correspondientes
 * @returns Promedio redondeado a 2 decimales
 */
export function calculateAverageGrade(
	evaluations: { value: TEvalLetter | null }[],
): number {
	if (evaluations.length === 0) return 0;

	const scores = evaluations
		.map((ev) => letterToScore(ev.value))
		.filter((score) => score > 0);

	if (scores.length === 0) return 0;

	const sum = scores.reduce((acc, score) => acc + score, 0);
	const average = sum / scores.length;

	return Math.round(average * 100) / 100;
}
