'use client';

import { useState, useMemo } from 'react';
import { db } from '@/lib/instantdb/client';
import { NoteCard } from '@/components/learn/notes/note-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import type { Note } from '@/lib/types/notes';

export default function NotesPage() {
	const [searchQuery, setSearchQuery] = useState('');

	const { data, isLoading } = db.useQuery({
		notes: {},
	});

	const notes = (data?.notes || []) as Note[];

	// Filter notes by search query
	const filteredNotes = useMemo(() => {
		if (!searchQuery) return notes;

		const query = searchQuery.toLowerCase();
		return notes.filter(
			(note) =>
				note.title.toLowerCase().includes(query) ||
				note.tags.some((tag) => tag.toLowerCase().includes(query))
		);
	}, [notes, searchQuery]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-start">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Notes</h1>
					<p className="text-gray-600 mt-2">
						Create rich-text notes with LaTeX and wiki-links.
					</p>
				</div>
				<Button asChild className="bg-black text-white hover:bg-gray-800">
					<Link href="/learn/notes/new">
						<Plus className="mr-2 h-4 w-4" />
						New Note
					</Link>
				</Button>
			</div>

			{/* Search */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
				<Input
					placeholder="Search notes by title or tags..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-10"
				/>
			</div>

			{/* Loading state */}
			{isLoading && (
				<Card>
					<CardContent className="py-8 text-center">
						<p className="text-gray-500">Loading notes...</p>
					</CardContent>
				</Card>
			)}

			{/* Empty state */}
			{!isLoading && notes.length === 0 && (
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500 mb-4">
							No notes yet. Create your first note to get started!
						</p>
						<Button asChild>
							<Link href="/learn/notes/new">
								<Plus className="mr-2 h-4 w-4" />
								Create Note
							</Link>
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Notes grid */}
			{!isLoading && notes.length > 0 && (
				<>
					<div className="text-sm text-gray-600">
						Showing {filteredNotes.length} of {notes.length} notes
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{filteredNotes.map((note) => (
							<NoteCard key={note.id} note={note} />
						))}
					</div>
				</>
			)}
		</div>
	);
}
