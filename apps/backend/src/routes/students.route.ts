import { Router } from 'express';
import {
	listStudents,
	getStudent,
	createNewStudent,
	updateStudentData,
	deleteStudentData,
} from '@controllers/students.controller';

const router = Router();

router.get('/find-many', listStudents);
router.get('/find-one/:id', getStudent);

router.post('/create-one/', createNewStudent);
router.patch('/update-one/:id', updateStudentData);
router.delete('/delete-one/:id', deleteStudentData);
export default router;
