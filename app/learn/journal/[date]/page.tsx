'use client';

import { use, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/instantdb/client';
import { id } from '@instantdb/react';
import {
	updateJournalEntry,
	deleteJournalEntry,
	formatDate,
	getTodayISO,
} from '@/lib/actions/journal';
import { NoteEditor } from '@/components/learn/notes/note-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { JournalEntry } from '@/lib/types/journal';
import { MOOD_OPTIONS } from '@/lib/types/journal';
import { ArrowLeft, Trash2, Save, Calendar, Clock } from 'lucide-react';

interface JournalEntryPageProps {
	params: Promise<{ date: string }>;
}

export default function JournalEntryPage({ params }: JournalEntryPageProps) {
	const { date } = use(params);
	const router = useRouter();

	const { data, isLoading } = db.useQuery({
		journalEntries: {
			$: { where: { date } },
		},
	});

	const entry = data?.journalEntries?.[0] as JournalEntry | undefined;

	// Track if we've initialized to prevent flickering from reactive updates
	const hasInitialized = useRef(false);

	const [content, setContent] = useState(entry?.content);
	const [timeSpent, setTimeSpent] = useState(entry?.timeSpent?.toString() || '');
	const [mood, setMood] = useState(entry?.mood || '');
	const [tags, setTags] = useState(entry?.tags?.join(', ') || '');
	const [isSaving, setIsSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);

	// Create entry if it doesn't exist
	useEffect(() => {
		if (!isLoading && !entry) {
			// Create new entry
			const createEntry = async () => {
				const entryId = id();
				await db.transact(
					db.tx.journalEntries[entryId].update({
						date,
						content: { type: 'doc', content: [] },
						timeSpent: null,
						mood: null,
						tags: [],
						createdAt: Date.now(),
						updatedAt: Date.now(),
					})
				);
			};
			createEntry();
		}
	}, [isLoading, entry, date]);

	// Initialize local state only once when entry first loads
	useEffect(() => {
		if (entry && !hasInitialized.current) {
			setContent(entry.content);
			setTimeSpent(entry.timeSpent?.toString() || '');
			setMood(entry.mood || '');
			setTags(entry.tags?.join(', ') || '');
			hasInitialized.current = true;
		}
	}, [entry]);

	// Auto-save content (debounced)
	useEffect(() => {
		if (!entry || !content) return;

		const timer = setTimeout(async () => {
			setIsSaving(true);
			try {
				await updateJournalEntry({
					id: entry.id,
					content,
				});
				setLastSaved(new Date());
			} catch (error) {
				console.error('Auto-save error:', error);
			} finally {
				setIsSaving(false);
			}
		}, 3000);

		return () => clearTimeout(timer);
	}, [content, entry]);

	const handleDelete = async () => {
		if (!entry || !confirm('Are you sure you want to delete this journal entry?')) {
			return;
		}

		try {
			await deleteJournalEntry(entry.id);
			router.push('/learn/journal');
		} catch (error) {
			console.error('Error deleting entry:', error);
			alert('Failed to delete entry. Please try again.');
		}
	};

	const handleSaveMetadata = async () => {
		if (!entry) return;

		setIsSaving(true);
		try {
			await updateJournalEntry({
				id: entry.id,
				timeSpent: timeSpent ? parseInt(timeSpent, 10) : undefined,
				mood: mood || undefined,
				tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
			});
			setLastSaved(new Date());
		} catch (error) {
			console.error('Error saving metadata:', error);
			alert('Failed to save changes. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	const isToday = date === getTodayISO();

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" asChild>
						<Link href="/learn/journal">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Journal
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Loading journal entry...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<Button variant="ghost" asChild>
					<Link href="/learn/journal">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Journal
					</Link>
				</Button>
				<div className="flex items-center gap-2">
					{isSaving && <span className="text-sm text-gray-500">Saving...</span>}
					{lastSaved && !isSaving && (
						<span className="text-sm text-gray-500">
							Saved {lastSaved.toLocaleTimeString()}
						</span>
					)}
					{entry && (
						<Button variant="destructive" onClick={handleDelete}>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</Button>
					)}
				</div>
			</div>

			<div className="grid lg:grid-cols-3 gap-6">
				{/* Main Editor */}
				<div className="lg:col-span-2 space-y-4">
					{/* Date Header */}
					<Card className="border-none shadow-sm bg-gradient-to-br from-gray-50 to-white">
						<CardContent className="pt-6">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-white rounded-lg shadow-sm">
									<Calendar className="h-5 w-5 text-gray-700" />
								</div>
								<div>
									<h1 className="text-2xl font-bold text-gray-900">{formatDate(date)}</h1>
									{isToday && (
										<Badge className="mt-1 bg-blue-500 text-white hover:bg-blue-600">
											Today
										</Badge>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Editor */}
					<NoteEditor content={content} onChange={setContent} />
				</div>

				{/* Sidebar */}
				<div className="space-y-4">
					{/* Metadata */}
					<Card className="border-none shadow-md">
						<CardHeader className="pb-3">
							<CardTitle className="text-lg font-semibold">Metadata</CardTitle>
						</CardHeader>
						<CardContent className="space-y-5">
							{/* Time Spent */}
							<div className="space-y-2">
								<Label htmlFor="timeSpent" className="flex items-center gap-2 text-sm font-medium">
									<Clock className="h-4 w-4 text-gray-500" />
									Time Spent (minutes)
								</Label>
								<Input
									id="timeSpent"
									type="number"
									min="0"
									value={timeSpent}
									onChange={(e) => setTimeSpent(e.target.value)}
									placeholder="120"
									className="text-base"
								/>
							</div>

							{/* Mood */}
							<div className="space-y-3">
								<Label className="text-sm font-medium">Mood</Label>
								<div className="grid grid-cols-4 gap-2">
									{MOOD_OPTIONS.map((option) => (
										<button
											key={option.emoji}
											type="button"
											onClick={() => setMood(option.emoji)}
											className={`p-3 border-2 rounded-xl text-2xl transition-all hover:scale-105 ${
												mood === option.emoji
													? 'border-blue-500 bg-blue-50 shadow-sm'
													: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
											}`}
											title={option.label}
										>
											{option.emoji}
										</button>
									))}
								</div>
								{mood && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setMood('')}
										className="w-full text-xs"
									>
										Clear Mood
									</Button>
								)}
							</div>

							{/* Tags */}
							<div className="space-y-2">
								<Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
								<Input
									id="tags"
									value={tags}
									onChange={(e) => setTags(e.target.value)}
									placeholder="learning, research, coding"
									className="text-base"
								/>
								<p className="text-xs text-gray-500">Separate tags with commas</p>
							</div>

							{/* Save Button */}
							<Button
								onClick={handleSaveMetadata}
								disabled={isSaving}
								className="w-full bg-black text-white hover:bg-gray-800 shadow-sm"
							>
								<Save className="mr-2 h-4 w-4" />
								Save Metadata
							</Button>
						</CardContent>
					</Card>

					{/* Related Papers */}
					<Card className="border-none shadow-md bg-gradient-to-br from-gray-50 to-white">
						<CardHeader className="pb-3">
							<CardTitle className="text-lg font-semibold">Related Papers</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-500 text-center py-4">
								Link papers to this entry (coming soon)
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
