import { db, id } from '@/lib/instantdb/client';
import type { CreatePaperInput, UpdatePaperInput } from '@/lib/types/papers';

/**
 * Paper CRUD actions using InstantDB
 */

/**
 * Create a new paper
 */
export async function createPaper(input: CreatePaperInput): Promise<string> {
	const paperId = id();
	const now = Date.now();

	await db.transact(
		db.tx.papers[paperId].update({
			title: input.title,
			authors: input.authors,
			publicationYear: input.publicationYear,
			venue: input.venue,
			pdfUrl: input.pdfUrl,
			abstract: input.abstract,
			keyContribution: input.keyContribution,
			status: input.status,
			rating: input.rating,
			tags: input.tags || [],
			createdAt: now,
			updatedAt: now,
		})
	);

	return paperId;
}

/**
 * Update an existing paper
 */
export async function updatePaper(input: UpdatePaperInput): Promise<void> {
	const { id: paperId, ...updates } = input;

	await db.transact(
		db.tx.papers[paperId].update({
			...updates,
			updatedAt: Date.now(),
		})
	);
}

/**
 * Delete a paper
 */
export async function deletePaper(paperId: string): Promise<void> {
	await db.transact(db.tx.papers[paperId].delete());
}

/**
 * Upload PDF to InstantDB Storage
 */
export async function uploadPaperPDF(
	file: File,
	paperId: string
): Promise<string> {
	try {
		// Upload to InstantDB Storage
		const storagePath = `paper-pdfs/${paperId}/${file.name}`;
		const uploadResult = await db.storage.upload(storagePath, file);

		// Update paper with storage ID
		await db.transact(
			db.tx.papers[paperId].update({
				pdfStorageId: storagePath,
				updatedAt: Date.now(),
			})
		);

		return storagePath;
	} catch (error) {
		console.error('Error uploading PDF:', error);
		throw new Error('Failed to upload PDF');
	}
}

/**
 * Get PDF download URL
 */
export async function getPaperPDFUrl(storageId: string): Promise<string> {
	return await db.storage.getDownloadUrl(storageId);
}

/**
 * Delete PDF from storage
 */
export async function deletePaperPDF(storageId: string): Promise<void> {
	try {
		await db.storage.delete(storageId);
	} catch (error) {
		console.error('Error deleting PDF:', error);
		throw new Error('Failed to delete PDF');
	}
}

/**
 * Link a paper to a note
 */
export async function linkPaperToNote(
	paperId: string,
	noteId: string
): Promise<void> {
	const linkId = id();

	await db.transact(
		db.tx.paperNotes[linkId].update({
			paperId,
			noteId,
			createdAt: Date.now(),
		})
	);
}

/**
 * Unlink a paper from a note
 */
export async function unlinkPaperFromNote(
	paperId: string,
	noteId: string
): Promise<void> {
	// Query to find the link
	const { data } = await db.useQuery({
		paperNotes: {
			$: {
				where: {
					paperId,
					noteId,
				},
			},
		},
	});

	// Delete all matching links
	if (data?.paperNotes) {
		const txs = data.paperNotes.map((link) =>
			db.tx.paperNotes[link.id].delete()
		);
		await db.transact(txs);
	}
}
