import { i } from '@instantdb/react';

/**
 * InstantDB Schema for Learning Tracker
 *
 * This schema defines all entities for the learning tracker app including:
 * - Papers: Academic papers with metadata
 * - Notes: Rich text notes with wiki-links
 * - Projects: Implementation projects
 * - Journal: Daily log entries
 * - Learning Tracks: Structured learning paths
 */

export const learnSchema = i.schema({
	entities: {
		// Papers - Academic papers and research articles
		papers: i.entity({
			title: i.string(),
			authors: i.json(), // Array of author names
			publicationYear: i.number().optional(),
			venue: i.string().optional(),
			pdfUrl: i.string().optional(),
			pdfStorageId: i.string().optional(), // InstantDB Storage ID
			abstract: i.string().optional(),
			keyContribution: i.string().optional(),
			status: i.string(), // 'queue' | 'reading' | 'completed' | 'implemented'
			rating: i.number().optional(),
			tags: i.json(), // Array of tag strings
			createdAt: i.number().indexed(),
			updatedAt: i.number().indexed(),
		}),

		// Notes - Rich text notes with Tiptap content
		notes: i.entity({
			title: i.string(),
			slug: i.string().indexed().unique(), // Unique slug for [[wiki-links]]
			content: i.json(), // Tiptap JSON format
			tags: i.json(), // Array of tag strings
			folder: i.string().optional(),
			createdAt: i.number().indexed(),
			updatedAt: i.number().indexed(),
		}),

		// Note Links - Bidirectional links between notes
		noteLinks: i.entity({
			sourceNoteId: i.string().indexed(),
			targetNoteId: i.string().indexed(),
			createdAt: i.number().indexed(),
		}),

		// Projects - Implementation and learning projects
		projects: i.entity({
			name: i.string(),
			description: i.string().optional(),
			status: i.string(), // 'idea' | 'in-progress' | 'completed' | 'on-hold'
			githubUrl: i.string().optional(),
			tags: i.json(), // Array of tag strings
			startDate: i.number().optional(),
			endDate: i.number().optional(),
			createdAt: i.number().indexed(),
			updatedAt: i.number().indexed(),
		}),

		// Project Tasks - Tasks within a project
		projectTasks: i.entity({
			projectId: i.string().indexed(),
			text: i.string(),
			completed: i.boolean(),
			order: i.number().indexed(),
			createdAt: i.number().indexed(),
		}),

		// Journal Entries - Daily learning log
		journalEntries: i.entity({
			date: i.string().indexed(), // ISO date string (YYYY-MM-DD)
			content: i.json(), // Tiptap JSON format
			timeSpent: i.number().optional(), // Minutes spent learning
			mood: i.string().optional(), // Emoji or mood indicator
			tags: i.json(), // Array of tag strings
			createdAt: i.number().indexed(),
			updatedAt: i.number().indexed(),
		}),

		// Learning Tracks - Structured learning paths
		learningTracks: i.entity({
			title: i.string(),
			description: i.string().optional(),
			status: i.string(), // 'planned' | 'in-progress' | 'completed'
			createdAt: i.number().indexed(),
			updatedAt: i.number().indexed(),
		}),

		// Track Items - Items (papers/notes/projects) in a learning track
		trackItems: i.entity({
			trackId: i.string().indexed(),
			itemType: i.string(), // 'paper' | 'note' | 'project'
			itemId: i.string().indexed(),
			order: i.number().indexed(),
			completed: i.boolean(),
			createdAt: i.number().indexed(),
		}),

		// Relation: Papers <-> Notes (many-to-many)
		paperNotes: i.entity({
			paperId: i.string().indexed(),
			noteId: i.string().indexed(),
			createdAt: i.number().indexed(),
		}),

		// Relation: Projects <-> Papers (many-to-many)
		projectPapers: i.entity({
			projectId: i.string().indexed(),
			paperId: i.string().indexed(),
			createdAt: i.number().indexed(),
		}),

		// Relation: Projects <-> Notes (many-to-many)
		projectNotes: i.entity({
			projectId: i.string().indexed(),
			noteId: i.string().indexed(),
			createdAt: i.number().indexed(),
		}),

		// Relation: Journal <-> Papers (many-to-many)
		journalPapers: i.entity({
			journalEntryId: i.string().indexed(),
			paperId: i.string().indexed(),
			createdAt: i.number().indexed(),
		}),
	},
	links: {
		// Project relationships
		projectTasks: {
			forward: {
				on: 'projectTasks',
				has: 'one',
				label: 'project',
			},
			reverse: {
				on: 'projects',
				has: 'many',
				label: 'projectTasks',
			},
		},
		projectPapers: {
			forward: {
				on: 'projectPapers',
				has: 'one',
				label: 'project',
			},
			reverse: {
				on: 'projects',
				has: 'many',
				label: 'projectPapers',
			},
		},
		projectNotes: {
			forward: {
				on: 'projectNotes',
				has: 'one',
				label: 'project',
			},
			reverse: {
				on: 'projects',
				has: 'many',
				label: 'projectNotes',
			},
		},
		// Paper relationships
		paperNotes: {
			forward: {
				on: 'paperNotes',
				has: 'one',
				label: 'paper',
			},
			reverse: {
				on: 'papers',
				has: 'many',
				label: 'paperNotes',
			},
		},
		paperProjects: {
			forward: {
				on: 'projectPapers',
				has: 'one',
				label: 'paper',
			},
			reverse: {
				on: 'papers',
				has: 'many',
				label: 'projectPapers',
			},
		},
		paperJournals: {
			forward: {
				on: 'journalPapers',
				has: 'one',
				label: 'paper',
			},
			reverse: {
				on: 'papers',
				has: 'many',
				label: 'journalPapers',
			},
		},
		// Note relationships
		noteLinks: {
			forward: {
				on: 'noteLinks',
				has: 'one',
				label: 'sourceNote',
			},
			reverse: {
				on: 'notes',
				has: 'many',
				label: 'outgoingLinks',
			},
		},
		noteLinkTargets: {
			forward: {
				on: 'noteLinks',
				has: 'one',
				label: 'targetNote',
			},
			reverse: {
				on: 'notes',
				has: 'many',
				label: 'incomingLinks',
			},
		},
		notePapers: {
			forward: {
				on: 'paperNotes',
				has: 'one',
				label: 'note',
			},
			reverse: {
				on: 'notes',
				has: 'many',
				label: 'paperNotes',
			},
		},
		noteProjects: {
			forward: {
				on: 'projectNotes',
				has: 'one',
				label: 'note',
			},
			reverse: {
				on: 'notes',
				has: 'many',
				label: 'projectNotes',
			},
		},
		// Journal relationships
		journalPapers: {
			forward: {
				on: 'journalPapers',
				has: 'one',
				label: 'journal',
			},
			reverse: {
				on: 'journalEntries',
				has: 'many',
				label: 'journalPapers',
			},
		},
		// Learning Track relationships
		trackItems: {
			forward: {
				on: 'trackItems',
				has: 'one',
				label: 'track',
			},
			reverse: {
				on: 'learningTracks',
				has: 'many',
				label: 'trackItems',
			},
		},
	},
});

// Export types for use in components
export type LearnSchema = typeof learnSchema;
