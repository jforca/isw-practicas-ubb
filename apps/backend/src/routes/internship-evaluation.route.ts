import { Router } from 'express';
import {
	findOneController,
	findManyController,
	createController,
	updateController,
	deleteController,
	rubricController,
	getResponsesController,
	submitResponsesController,
	attachSignatureController,
	uploadSignatureController,
	viewSignatureController,
} from '@controllers/internship-evaluation.controller';
import { uploadSignature } from '@config/multer.config';

const router = Router();

router.post('/', createController);
router.get('/find-many', findManyController);
router.get('/find-one/:id', findOneController);
router.get(
	'/find-one/:id/responses',
	getResponsesController,
);
router.get('/rubric/:type', rubricController);
router.post('/submit/:id/:type', submitResponsesController);
router.post(
	'/attach-signature/:id/:documentId',
	attachSignatureController,
);
router.post(
	'/upload-signature/:id',
	uploadSignature.single('file'),
	uploadSignatureController,
);
router.get('/view-signature/:id', viewSignatureController);
router.patch('/update/:id', updateController);
router.delete('/delete/:id', deleteController);

export default router;
