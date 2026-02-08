/**
 * Type definitions for journal entries
 */

export interface JournalEntry {
	id: string;
	date: string; // ISO date string (YYYY-MM-DD)
	content: any; // Tiptap JSON format
	timeSpent?: number; // minutes
	mood?: string; // emoji
	tags: string[];
	createdAt: number;
	updatedAt: number;
}

export interface CreateJournalEntryInput {
	date: string;
	content?: any;
	timeSpent?: number;
	mood?: string;
	tags?: string[];
}

export interface UpdateJournalEntryInput extends Partial<CreateJournalEntryInput> {
	id: string;
}

export const MOOD_OPTIONS = [
	{ emoji: '😊', label: 'Great' },
	{ emoji: '😃', label: 'Good' },
	{ emoji: '😐', label: 'Okay' },
	{ emoji: '😔', label: 'Tired' },
	{ emoji: '😤', label: 'Frustrated' },
	{ emoji: '🔥', label: 'Productive' },
	{ emoji: '💪', label: 'Motivated' },
	{ emoji: '🎯', label: 'Focused' },
];
