import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

// Directorio base para archivos
const ARCHIVES_BASE_PATH = path.join(
	__dirname,
	'..',
	'archives',
);

// Directorio específico para convenios
const CONVENTION_PATH = path.join(
	ARCHIVES_BASE_PATH,
	'convention',
);

// Asegurar que el directorio existe
if (!fs.existsSync(CONVENTION_PATH)) {
	fs.mkdirSync(CONVENTION_PATH, { recursive: true });
}

// Configuración de almacenamiento para convenios
const conventionStorage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, CONVENTION_PATH);
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const ext = path.extname(file.originalname);
		cb(null, `convention-${uniqueSuffix}${ext}`);
	},
});

// Filtro para aceptar solo PDFs
const pdfFilter = (
	_req: Express.Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) => {
	if (file.mimetype === 'application/pdf') {
		cb(null, true);
	} else {
		cb(new Error('Solo se permiten archivos PDF'));
	}
};

// Configuración de multer para convenios
export const uploadConvention = multer({
	storage: conventionStorage,
	fileFilter: pdfFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB máximo
	},
});

export { CONVENTION_PATH, ARCHIVES_BASE_PATH };
