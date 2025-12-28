import { AppDataSource } from '../../config/db.config';
import { Document, User } from '@entities';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export async function seedSignatureDocuments() {
	const docRepo = AppDataSource.getRepository(Document);
	const userRepo = AppDataSource.getRepository(User);

	const count = await docRepo.count();
	if (count > 0) {
		console.log('Documents ya existen — saltando seed.');
		return;
	}

	try {
		// Intentar varias rutas posibles para el PDF
		const possiblePaths = [
			path.join(
				__dirname,
				'../../../../firmaISWprueba.pdf',
			),
			path.join(process.cwd(), 'firmaISWprueba.pdf'),
			'c:\\Users\\Usuario\\OneDrive\\Documentos\\firmaISWprueba.pdf',
		];

		let pdfBuffer: Buffer | null = null;
		let resolvedPath = '';

		for (const pdfPath of possiblePaths) {
			if (fs.existsSync(pdfPath)) {
				pdfBuffer = fs.readFileSync(pdfPath);
				resolvedPath = pdfPath;
				console.log(`✓ PDF encontrado en: ${pdfPath}`);
				break;
			}
		}

		if (!pdfBuffer) {
			console.log(
				'⚠️  Archivo PDF no encontrado en:',
				possiblePaths.join(', '),
			);
			return;
		}

		// Obtén un usuario para el uploader (generalmente el sistema)
		let systemUser = await userRepo.findOne({
			where: { email: 'system@example.com' },
		});

		if (!systemUser) {
			console.log(
				'Creando usuario del sistema para uploader...',
			);
			systemUser = new User();
			systemUser.id = randomUUID();
			systemUser.rut = '99999999-9';
			systemUser.email = 'system@example.com';
			systemUser.name = 'Sistema';
			systemUser.user_role = 'coordinator';
			systemUser.emailVerified = true;
			systemUser = await userRepo.save(systemUser);
		}

		const fileName = 'firmaISWprueba.pdf';
		const filePath = resolvedPath;
		const mimeType = 'application/pdf';

		// Crea el documento
		const doc = new Document();
		doc.file_name = fileName;
		doc.file_path = filePath;
		doc.mime_type = mimeType;
		doc.uploaded_at = new Date();
		doc.uploader = systemUser;

		const savedDoc = await docRepo.save(doc);

		console.log(
			`✓ Documento de firma creado (ID: ${savedDoc.id}, ${pdfBuffer.length} bytes)`,
		);
	} catch (error) {
		console.error(
			'Error al seedear documentos de firma:',
			error,
		);
		throw error;
	}
}
