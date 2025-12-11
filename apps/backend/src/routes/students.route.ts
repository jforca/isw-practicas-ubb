import { Router } from 'express';
import { listStudents } from '@controllers/students.controller';

const router = Router();

// Lista todos los estudiantes (usuarios con rol student que están en students)
router.get('/', listStudents);

export default router;
