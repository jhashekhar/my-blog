/**
 * Type definitions for papers
 */

export type PaperStatus = 'queue' | 'reading' | 'completed' | 'implemented';

export interface Paper {
	id: string;
	title: string;
	authors: string[];
	publicationYear?: number;
	venue?: string;
	pdfUrl?: string;
	pdfStorageId?: string;
	abstract?: string;
	keyContribution?: string;
	status: PaperStatus;
	rating?: number;
	tags: string[];
	createdAt: number;
	updatedAt: number;
}

export interface CreatePaperInput {
	title: string;
	authors: string[];
	publicationYear?: number;
	venue?: string;
	pdfUrl?: string;
	abstract?: string;
	keyContribution?: string;
	status: PaperStatus;
	rating?: number;
	tags?: string[];
}

export interface UpdatePaperInput extends Partial<CreatePaperInput> {
	id: string;
}

export const PAPER_STATUSES: { value: PaperStatus; label: string }[] = [
	{ value: 'queue', label: 'Queue' },
	{ value: 'reading', label: 'Reading' },
	{ value: 'completed', label: 'Completed' },
	{ value: 'implemented', label: 'Implemented' },
];

export const STATUS_COLORS: Record<PaperStatus, string> = {
	queue: 'bg-gray-100 text-gray-800',
	reading: 'bg-blue-100 text-blue-800',
	completed: 'bg-green-100 text-green-800',
	implemented: 'bg-purple-100 text-purple-800',
};
