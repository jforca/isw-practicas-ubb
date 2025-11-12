import { Request, Response } from 'express';
import { logbookEntriesService } from '@services/logbook-entries.service';
import {
	handleSuccess,
	handleErrorServer,
} from '@handlers/response.handler';
import type { TLogbookEntry } from '@services/logbook-entries.service';

/**
 * Obtiene todos los registros del libro de bitácora.
 * Se renombra a 'findAll' para seguir el patrón 'findMany' de tu ejemplo.
 */
async function findAll(_req: Request, res: Response) {
	try {
		// Llama al servicio para obtener los datos
		const data: TLogbookEntry[] =
			await logbookEntriesService.findAll();

		// Maneja la respuesta exitosa
		return handleSuccess(
			res,
			200,
			'Registros del libro de bitácora obtenidos con éxito',
			data,
		);
	} catch (err) {
		// En caso de error
		return handleErrorServer(
			res,
			500,
			'Error al obtener los registros del libro de bitácora',
			err,
		);
	}
}

// Opcional: Función findOne (dejada como placeholder si la necesitas)
// async function findOne(req: Request, res: Response) {
//     // ... lógica de findOne aquí
// }

// Se exporta el objeto constante que agrupa todas las funciones del controlador.
export const LogbookEntriesControllers = {
	findAll, // Renombrado de listLogbookEntries a findAll para este formato
	// findOne, // Si se implementa, se añadiría aquí
};
