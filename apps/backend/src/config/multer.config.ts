import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

// Directorio base para archivos
// En desarrollo (ej. ts-node) __dirname apunta a src/config,
// en producción (build) __dirname suele apuntar a dist.
// Detectar si estamos ejecutando el bundle desde `dist/main.js`.
// Varias señales: __dirname contiene 'dist', el primer argumento de node (process.argv[1]) contiene 'dist',
// o NODE_ENV está en 'production'. Usamos `process.cwd()` para construir rutas determinísticas
// relativas al paquete (apps/backend).
const runningFromDist =
	__dirname.split(path.sep).includes('dist') ||
	(typeof process.argv[1] === 'string' &&
		process.argv[1].includes(
			`${path.sep}dist${path.sep}`,
		)) ||
	process.env.NODE_ENV === 'production';

const ARCHIVES_BASE_PATH = runningFromDist
	? path.join(process.cwd(), 'dist', 'archives')
	: path.join(process.cwd(), 'src', 'archives');

// Directorio específico para convenios
const CONVENTION_PATH = path.join(
	ARCHIVES_BASE_PATH,
	'convention',
);

// Directorio específico para firmas
const SIGNATURE_PATH = path.join(
	ARCHIVES_BASE_PATH,
	'signature',
);

// Asegurar que el directorio existe
if (!fs.existsSync(CONVENTION_PATH)) {
	fs.mkdirSync(CONVENTION_PATH, { recursive: true });
}

if (!fs.existsSync(SIGNATURE_PATH)) {
	fs.mkdirSync(SIGNATURE_PATH, { recursive: true });
}

// Copiar plantilla de convenio al directorio runtime (dist/archives/convention o src/archives/convention)
try {
	const templateName = 'convenio_practica_plantilla.pdf';
	const destPath = path.join(CONVENTION_PATH, templateName);

	if (!fs.existsSync(destPath)) {
		const candidates = [
			path.join(
				process.cwd(),
				'apps',
				'backend',
				'src',
				'archives',
				'convention',
				templateName,
			),
			path.join(
				process.cwd(),
				'apps',
				'backend',
				'archives',
				'convention',
				templateName,
			),
			path.join(
				process.cwd(),
				'src',
				'archives',
				'convention',
				templateName,
			),
			path.join(
				process.cwd(),
				'archives',
				'convention',
				templateName,
			),
		];

		let found: string | null = null;
		for (const c of candidates) {
			if (fs.existsSync(c)) {
				found = c;
				break;
			}
		}

		if (found) {
			fs.mkdirSync(CONVENTION_PATH, { recursive: true });
			fs.copyFileSync(found, destPath);
			// eslint-disable-next-line no-console
			console.log('✓ Plantilla copiada a:', destPath);
		} else {
			// eslint-disable-next-line no-console
			console.warn(
				'Plantilla de convenio no encontrada en rutas candidatas, no se copió.',
			);
		}
	}
} catch (err) {
	// eslint-disable-next-line no-console
	console.warn(
		'Error asegurando plantilla en archives:',
		err instanceof Error ? err.message : String(err),
	);
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

// Configuración de almacenamiento para firmas
const signatureStorage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, SIGNATURE_PATH);
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const ext = path.extname(file.originalname);
		cb(null, `signature-${uniqueSuffix}${ext}`);
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

export const uploadSignature = multer({
	storage: signatureStorage,
	fileFilter: pdfFilter,
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
});

export {
	CONVENTION_PATH,
	SIGNATURE_PATH,
	ARCHIVES_BASE_PATH,
};
