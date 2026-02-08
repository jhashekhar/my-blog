import { db } from '@/lib/instantdb/client';
import { id } from '@instantdb/react';
import type {
	CreateProjectInput,
	UpdateProjectInput,
	CreateProjectTaskInput,
} from '@/lib/types/projects';

/**
 * Create a new project
 */
export async function createProject(
	input: CreateProjectInput
): Promise<string> {
	const projectId = id();
	const now = Date.now();

	await db.transact(
		db.tx.projects[projectId].update({
			name: input.name,
			description: input.description || '',
			status: input.status,
			githubUrl: input.githubUrl || '',
			tags: input.tags || [],
			startDate: input.startDate || null,
			endDate: null,
			createdAt: now,
			updatedAt: now,
		})
	);

	return projectId;
}

/**
 * Update an existing project
 */
export async function updateProject(input: UpdateProjectInput): Promise<void> {
	const updates: Record<string, any> = {
		updatedAt: Date.now(),
	};

	if (input.name !== undefined) updates.name = input.name;
	if (input.description !== undefined) updates.description = input.description;
	if (input.status !== undefined) updates.status = input.status;
	if (input.githubUrl !== undefined) updates.githubUrl = input.githubUrl;
	if (input.tags !== undefined) updates.tags = input.tags;
	if (input.startDate !== undefined) updates.startDate = input.startDate;

	await db.transact(db.tx.projects[input.id].update(updates));
}

/**
 * Delete a project and all its tasks
 */
export async function deleteProject(projectId: string): Promise<void> {
	await db.transact(db.tx.projects[projectId].delete());
}

/**
 * Add a task to a project
 */
export async function addProjectTask(
	input: CreateProjectTaskInput
): Promise<string> {
	const taskId = id();

	await db.transact(
		db.tx.projectTasks[taskId].update({
			projectId: input.projectId,
			text: input.text,
			completed: false,
			order: input.order,
			createdAt: Date.now(),
		})
	);

	return taskId;
}

/**
 * Toggle a task's completion status
 */
export async function toggleProjectTask(
	taskId: string,
	completed: boolean
): Promise<void> {
	await db.transact(db.tx.projectTasks[taskId].update({ completed }));
}

/**
 * Update a task's text
 */
export async function updateProjectTask(
	taskId: string,
	text: string
): Promise<void> {
	await db.transact(db.tx.projectTasks[taskId].update({ text }));
}

/**
 * Delete a task
 */
export async function deleteProjectTask(taskId: string): Promise<void> {
	await db.transact(db.tx.projectTasks[taskId].delete());
}

/**
 * Calculate project completion percentage
 */
export function calculateProjectCompletion(tasks: any[]): number {
	if (tasks.length === 0) return 0;
	const completed = tasks.filter((t) => t.completed).length;
	return Math.round((completed / tasks.length) * 100);
}

/**
 * Link a project to a paper
 */
export async function linkProjectToPaper(
	projectId: string,
	paperId: string
): Promise<void> {
	const linkId = id();
	await db.transact(
		db.tx.projectPapers[linkId].update({
			projectId,
			paperId,
			createdAt: Date.now(),
		})
	);
}

/**
 * Unlink a project from a paper
 */
export async function unlinkProjectFromPaper(
	projectId: string,
	paperId: string
): Promise<void> {
	// Query to find the link
	const { data } = await db.useQuery({
		projectPapers: {
			$: { where: { projectId, paperId } },
		},
	});

	if (data?.projectPapers?.[0]) {
		await db.transact(db.tx.projectPapers[data.projectPapers[0].id].delete());
	}
}

/**
 * Link a project to a note
 */
export async function linkProjectToNote(
	projectId: string,
	noteId: string
): Promise<void> {
	const linkId = id();
	await db.transact(
		db.tx.projectNotes[linkId].update({
			projectId,
			noteId,
			createdAt: Date.now(),
		})
	);
}

/**
 * Unlink a project from a note
 */
export async function unlinkProjectFromNote(
	projectId: string,
	noteId: string
): Promise<void> {
	// Query to find the link
	const { data } = await db.useQuery({
		projectNotes: {
			$: { where: { projectId, noteId } },
		},
	});

	if (data?.projectNotes?.[0]) {
		await db.transact(db.tx.projectNotes[data.projectNotes[0].id].delete());
	}
}
