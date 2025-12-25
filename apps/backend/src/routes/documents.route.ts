import { Router } from 'express';
import { DocumentControllers } from '@controllers/documents.controller';
import { uploadConvention } from '@config/multer.config';

const router = Router();

// Subir convenio para un centro de prácticas
router.post(
	'/convention/:id',
	uploadConvention.single('file'),
	DocumentControllers.uploadConvention,
);

// Descargar convenio de un centro de prácticas
router.get(
	'/convention/:id/download',
	DocumentControllers.downloadConvention,
);

// Ver convenio de un centro de prácticas (inline)
router.get(
	'/convention/:id/view',
	DocumentControllers.viewConvention,
);

// Eliminar convenio de un centro de prácticas
router.delete(
	'/convention/:id',
	DocumentControllers.deleteConvention,
);

export default router;
