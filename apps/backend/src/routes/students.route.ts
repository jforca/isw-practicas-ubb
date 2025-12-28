import { Router } from 'express';
import {
	listStudents,
	getStudent,
	createNewStudent,
	updateStudentData,
	deleteStudentData,
	getStudentDetailsData,
	getStats,
} from '@controllers/students.controller';

const router = Router();

router.get('/stats', getStats);
router.get('/find-many', listStudents);
router.get('/find-one/:id', getStudent);
router.get('/details/:id', getStudentDetailsData);

router.post('/create-one/', createNewStudent);
router.patch('/update-one/:id', updateStudentData);
router.delete('/delete-one/:id', deleteStudentData);
export default router;
