import { db, id } from '@/lib/instantdb/client';
import slugify from 'slugify';
import type { CreateNoteInput, UpdateNoteInput } from '@/lib/types/notes';

/**
 * Note CRUD actions using InstantDB
 */

/**
 * Generate a URL-safe slug from a title
 */
export function generateSlug(title: string): string {
	return slugify(title, {
		lower: true,
		strict: true,
		remove: /[*+~.()'"!:@]/g,
	});
}

/**
 * Create a new note
 */
export async function createNote(input: CreateNoteInput): Promise<string> {
	const noteId = id();
	const now = Date.now();

	await db.transact(
		db.tx.notes[noteId].update({
			title: input.title,
			slug: input.slug,
			content: input.content || { type: 'doc', content: [] },
			tags: input.tags || [],
			folder: input.folder,
			createdAt: now,
			updatedAt: now,
		})
	);

	return noteId;
}

/**
 * Update an existing note
 */
export async function updateNote(input: UpdateNoteInput): Promise<void> {
	const { id: noteId, ...updates } = input;

	await db.transact(
		db.tx.notes[noteId].update({
			...updates,
			updatedAt: Date.now(),
		})
	);
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<void> {
	// Delete the note
	await db.transact(db.tx.notes[noteId].delete());

	// Note: Related noteLinks will be handled separately if needed
}

/**
 * Extract wiki-links from Tiptap content
 * Looks for [[note-title]] patterns
 */
export function extractWikiLinks(content: any): string[] {
	const links: string[] = [];

	function traverse(node: any) {
		if (node.type === 'text' && node.text) {
			const regex = /\[\[([^\]]+)\]\]/g;
			let match;
			while ((match = regex.exec(node.text)) !== null) {
				links.push(match[1]);
			}
		}

		if (node.content && Array.isArray(node.content)) {
			node.content.forEach(traverse);
		}
	}

	if (content) {
		traverse(content);
	}

	return Array.from(new Set(links)); // Remove duplicates
}

/**
 * Update note links based on wiki-links in content
 */
export async function updateNoteLinks(
	noteId: string,
	content: any
): Promise<void> {
	// Extract wiki-links from content
	const wikiLinks = extractWikiLinks(content);

	if (wikiLinks.length === 0) {
		return;
	}

	// For each wiki-link, find the target note by title or slug
	// This is a simplified version - in production you'd want to batch these queries
	for (const linkText of wikiLinks) {
		const slug = generateSlug(linkText);

		// Find target note by slug
		const { data } = await db.useQuery({
			notes: {
				$: { where: { slug } },
			},
		});

		if (data?.notes && data.notes.length > 0) {
			const targetNoteId = data.notes[0].id;

			// Create link if it doesn't exist
			const linkId = id();
			await db.transact(
				db.tx.noteLinks[linkId].update({
					sourceNoteId: noteId,
					targetNoteId: targetNoteId,
					createdAt: Date.now(),
				})
			);
		}
	}
}

/**
 * Get backlinks for a note (notes that link to this note)
 */
export async function getBacklinks(noteId: string): Promise<any[]> {
	const { data } = await db.useQuery({
		noteLinks: {
			$: { where: { targetNoteId: noteId } },
			sourceNote: {}, // Get the source note details
		},
	});

	return data?.noteLinks || [];
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(
	slug: string,
	excludeNoteId?: string
): Promise<boolean> {
	const { data } = await db.useQuery({
		notes: {
			$: { where: { slug } },
		},
	});

	if (!data?.notes || data.notes.length === 0) {
		return true;
	}

	// If excluding a note ID, check if the only match is that note
	if (excludeNoteId && data.notes.length === 1) {
		return data.notes[0].id === excludeNoteId;
	}

	return false;
}
