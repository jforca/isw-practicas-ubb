import { Router } from 'express';
import { ReportsController } from '@controllers/reports.controller';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

const uploadDir = path.join(
	__dirname,
	'..',
	'archives',
	'reports',
);
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, uploadDir);
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(
			null,
			uniqueSuffix + path.extname(file.originalname),
		);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 30 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		if (file.mimetype === 'application/pdf') {
			cb(null, true);
		} else {
			cb(null, false);
		}
	},
});

router.post(
	'/upload',
	upload.single('file'),
	ReportsController.uploadReport,
);
router.get('/', ReportsController.getReports);
router.delete('/:id', ReportsController.deleteReport);

export default router;
