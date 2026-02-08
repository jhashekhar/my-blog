import { db, id } from '@/lib/instantdb/client';
import type {
	CreateTrackInput,
	UpdateTrackInput,
	AddTrackItemInput,
} from '@/lib/types/tracks';

/**
 * Learning Track CRUD actions using InstantDB
 */

/**
 * Create a new learning track
 */
export async function createTrack(input: CreateTrackInput): Promise<string> {
	const trackId = id();
	const now = Date.now();

	await db.transact(
		db.tx.learningTracks[trackId].update({
			title: input.title,
			description: input.description,
			status: input.status,
			createdAt: now,
			updatedAt: now,
		})
	);

	return trackId;
}

/**
 * Update an existing track
 */
export async function updateTrack(input: UpdateTrackInput): Promise<void> {
	const { id: trackId, ...updates } = input;

	await db.transact(
		db.tx.learningTracks[trackId].update({
			...updates,
			updatedAt: Date.now(),
		})
	);
}

/**
 * Delete a track
 */
export async function deleteTrack(trackId: string): Promise<void> {
	await db.transact(db.tx.learningTracks[trackId].delete());
}

/**
 * Add an item to a track
 */
export async function addTrackItem(input: AddTrackItemInput): Promise<string> {
	const itemId = id();

	await db.transact(
		db.tx.trackItems[itemId].update({
			trackId: input.trackId,
			itemType: input.itemType,
			itemId: input.itemId,
			order: input.order,
			completed: false,
			createdAt: Date.now(),
		})
	);

	return itemId;
}

/**
 * Remove an item from a track
 */
export async function removeTrackItem(itemId: string): Promise<void> {
	await db.transact(db.tx.trackItems[itemId].delete());
}

/**
 * Toggle track item completion
 */
export async function toggleTrackItemComplete(itemId: string, completed: boolean): Promise<void> {
	await db.transact(
		db.tx.trackItems[itemId].update({
			completed,
		})
	);
}

/**
 * Reorder track items
 */
export async function reorderTrackItems(items: { id: string; order: number }[]): Promise<void> {
	const txs = items.map((item) =>
		db.tx.trackItems[item.id].update({
			order: item.order,
		})
	);

	await db.transact(txs);
}

/**
 * Calculate track progress
 */
export function calculateTrackProgress(trackItems: any[]): number {
	if (trackItems.length === 0) return 0;

	const completedCount = trackItems.filter((item) => item.completed).length;
	return Math.round((completedCount / trackItems.length) * 100);
}
