/**
 * Type definitions for learning tracks
 */

export type TrackStatus = 'planned' | 'in-progress' | 'completed';
export type TrackItemType = 'paper' | 'note' | 'project';

export interface LearningTrack {
	id: string;
	title: string;
	description?: string;
	status: TrackStatus;
	createdAt: number;
	updatedAt: number;
}

export interface TrackItem {
	id: string;
	trackId: string;
	itemType: TrackItemType;
	itemId: string;
	order: number;
	completed: boolean;
	createdAt: number;
}

export interface CreateTrackInput {
	title: string;
	description?: string;
	status: TrackStatus;
}

export interface UpdateTrackInput extends Partial<CreateTrackInput> {
	id: string;
}

export interface AddTrackItemInput {
	trackId: string;
	itemType: TrackItemType;
	itemId: string;
	order: number;
}

export const TRACK_STATUSES: { value: TrackStatus; label: string }[] = [
	{ value: 'planned', label: 'Planned' },
	{ value: 'in-progress', label: 'In Progress' },
	{ value: 'completed', label: 'Completed' },
];

export const STATUS_COLORS: Record<TrackStatus, string> = {
	planned: 'bg-gray-100 text-gray-800',
	'in-progress': 'bg-blue-100 text-blue-800',
	completed: 'bg-green-100 text-green-800',
};
