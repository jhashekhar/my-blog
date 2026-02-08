/**
 * Type definitions for notes
 */

export interface Note {
	id: string;
	title: string;
	slug: string;
	content: any; // Tiptap JSON format
	tags: string[];
	folder?: string;
	createdAt: number;
	updatedAt: number;
}

export interface CreateNoteInput {
	title: string;
	slug: string;
	content?: any;
	tags?: string[];
	folder?: string;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {
	id: string;
}

export interface NoteLink {
	id: string;
	sourceNoteId: string;
	targetNoteId: string;
	createdAt: number;
}
