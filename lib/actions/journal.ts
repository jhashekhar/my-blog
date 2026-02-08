import { db } from '@/lib/instantdb/client';
import { id } from '@instantdb/react';
import type {
	CreateJournalEntryInput,
	UpdateJournalEntryInput,
} from '@/lib/types/journal';

/**
 * Get or create a journal entry for a specific date
 */
export async function getOrCreateJournalEntry(date: string): Promise<string> {
	// Query to check if entry exists
	const { data } = await db.useQuery({
		journalEntries: {
			$: { where: { date } },
		},
	});

	if (data?.journalEntries?.[0]) {
		return data.journalEntries[0].id;
	}

	// Create new entry
	const entryId = id();
	const now = Date.now();

	await db.transact(
		db.tx.journalEntries[entryId].update({
			date,
			content: { type: 'doc', content: [] }, // Empty Tiptap doc
			timeSpent: null,
			mood: null,
			tags: [],
			createdAt: now,
			updatedAt: now,
		})
	);

	return entryId;
}

/**
 * Create a new journal entry
 */
export async function createJournalEntry(
	input: CreateJournalEntryInput
): Promise<string> {
	const entryId = id();
	const now = Date.now();

	await db.transact(
		db.tx.journalEntries[entryId].update({
			date: input.date,
			content: input.content || { type: 'doc', content: [] },
			timeSpent: input.timeSpent || null,
			mood: input.mood || null,
			tags: input.tags || [],
			createdAt: now,
			updatedAt: now,
		})
	);

	return entryId;
}

/**
 * Update a journal entry
 */
export async function updateJournalEntry(
	input: UpdateJournalEntryInput
): Promise<void> {
	const updates: Record<string, any> = {
		updatedAt: Date.now(),
	};

	if (input.content !== undefined) updates.content = input.content;
	if (input.timeSpent !== undefined) updates.timeSpent = input.timeSpent;
	if (input.mood !== undefined) updates.mood = input.mood;
	if (input.tags !== undefined) updates.tags = input.tags;

	await db.transact(db.tx.journalEntries[input.id].update(updates));
}

/**
 * Delete a journal entry
 */
export async function deleteJournalEntry(entryId: string): Promise<void> {
	await db.transact(db.tx.journalEntries[entryId].delete());
}

/**
 * Link a journal entry to a paper
 */
export async function linkJournalToPaper(
	journalEntryId: string,
	paperId: string
): Promise<void> {
	const linkId = id();
	await db.transact(
		db.tx.journalPapers[linkId].update({
			journalEntryId,
			paperId,
			createdAt: Date.now(),
		})
	);
}

/**
 * Unlink a journal entry from a paper
 */
export async function unlinkJournalFromPaper(
	journalEntryId: string,
	paperId: string
): Promise<void> {
	// Query to find the link
	const { data } = await db.useQuery({
		journalPapers: {
			$: { where: { journalEntryId, paperId } },
		},
	});

	if (data?.journalPapers?.[0]) {
		await db.transact(db.tx.journalPapers[data.journalPapers[0].id].delete());
	}
}

/**
 * Get journal entries for a date range
 */
export function getEntriesInRange(
	entries: any[],
	startDate: string,
	endDate: string
): any[] {
	return entries.filter((entry) => {
		const date = entry.date;
		return date >= startDate && date <= endDate;
	});
}

/**
 * Format ISO date string to display format
 */
export function formatDate(isoDate: string): string {
	const date = new Date(isoDate);
	return date.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export function getTodayISO(): string {
	const date = new Date();
	return date.toISOString().split('T')[0];
}
