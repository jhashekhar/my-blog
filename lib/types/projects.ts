/**
 * Type definitions for projects
 */

export type ProjectStatus = 'idea' | 'in-progress' | 'completed' | 'on-hold';

export interface Project {
	id: string;
	name: string;
	description?: string;
	status: ProjectStatus;
	githubUrl?: string;
	tags: string[];
	startDate?: number;
	endDate?: number;
	createdAt: number;
	updatedAt: number;
}

export interface ProjectTask {
	id: string;
	projectId: string;
	text: string;
	completed: boolean;
	order: number;
	createdAt: number;
}

export interface CreateProjectInput {
	name: string;
	description?: string;
	status: ProjectStatus;
	githubUrl?: string;
	tags?: string[];
	startDate?: number;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
	id: string;
}

export interface CreateProjectTaskInput {
	projectId: string;
	text: string;
	order: number;
}

export const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
	{ value: 'idea', label: 'Idea' },
	{ value: 'in-progress', label: 'In Progress' },
	{ value: 'completed', label: 'Completed' },
	{ value: 'on-hold', label: 'On Hold' },
];

export const STATUS_COLORS: Record<ProjectStatus, string> = {
	idea: 'bg-purple-100 text-purple-800',
	'in-progress': 'bg-blue-100 text-blue-800',
	completed: 'bg-green-100 text-green-800',
	'on-hold': 'bg-gray-100 text-gray-800',
};
