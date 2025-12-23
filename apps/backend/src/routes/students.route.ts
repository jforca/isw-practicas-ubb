import { Router } from 'express';
import {
	listStudents,
	getStudent,
	createNewStudent,
	updateStudentData,
	deleteStudentData,
} from '@controllers/students.controller';

const router = Router();

router.get('/', listStudents);
router.get('/:id', getStudent);

router.post('/', createNewStudent);
router.put('/:id', updateStudentData);
router.delete('/:id', deleteStudentData);
export default router;
