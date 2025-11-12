import { Request, Response } from 'express';
import { logbookEntriesService } from '@services/logbook-entries.service';
import {
	handleSuccess,
	handleErrorServer,
} from '@handlers/response.handler';
import type { TLogbookEntry } from '@services/logbook-entries.service';

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

export const LogbookEntriesControllers = {
	findAll,
};
