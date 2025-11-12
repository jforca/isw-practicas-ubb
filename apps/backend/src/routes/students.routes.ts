import { Router } from 'express';
import { listStudents } from '@controllers/students.controllers';

export const studentsRouter = Router();

// Lista todos los estudiantes (usuarios con rol student que están en students)
studentsRouter.get('/', listStudents);
