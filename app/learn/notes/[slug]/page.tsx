'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/instantdb/client';
import { updateNote, deleteNote } from '@/lib/actions/notes';
import { NoteEditor } from '@/components/learn/notes/note-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2, Save, FileText } from 'lucide-react';
import Link from 'next/link';
import type { Note } from '@/lib/types/notes';
import { getTagColor } from '@/lib/utils/tag-colors';

interface NoteDetailPageProps {
	params: Promise<{ slug: string }>;
}

export default function NoteDetailPage({ params }: NoteDetailPageProps) {
	const { slug } = use(params);
	const router = useRouter();

	const { data, isLoading } = db.useQuery({
		notes: {
			$: { where: { slug } },
		},
	});

	const note = data?.notes?.[0] as Note | undefined;
	const [content, setContent] = useState(note?.content);
	const [title, setTitle] = useState(note?.title || '');
	const [tags, setTags] = useState<string[]>(note?.tags || []);
	const [isSaving, setIsSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);

	// Update local state when note loads
	useEffect(() => {
		if (note) {
			setContent(note.content);
			setTitle(note.title);
			setTags(note.tags);
		}
	}, [note]);

	// Auto-save content (debounced)
	useEffect(() => {
		if (!note || !content) return;

		const timer = setTimeout(async () => {
			setIsSaving(true);
			try {
				await updateNote({
					id: note.id,
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
	}, [content, note]);

	const handleDelete = async () => {
		if (!note || !confirm('Are you sure you want to delete this note?')) {
			return;
		}

		try {
			await deleteNote(note.id);
			router.push('/learn/notes');
		} catch (error) {
			console.error('Error deleting note:', error);
			alert('Failed to delete note. Please try again.');
		}
	};

	const handleSaveMetadata = async () => {
		if (!note) return;

		setIsSaving(true);
		try {
			await updateNote({
				id: note.id,
				title,
				tags,
			});
			setLastSaved(new Date());
		} catch (error) {
			console.error('Error saving metadata:', error);
			alert('Failed to save changes. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" asChild>
						<Link href="/learn/notes">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Notes
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Loading note...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!note) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" asChild>
						<Link href="/learn/notes">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Notes
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Note not found.</p>
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
					<Link href="/learn/notes">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Notes
					</Link>
				</Button>
				<div className="flex items-center gap-2">
					{isSaving && <span className="text-sm text-gray-500">Saving...</span>}
					{lastSaved && !isSaving && (
						<span className="text-sm text-gray-500">
							Saved {lastSaved.toLocaleTimeString()}
						</span>
					)}
					<Button variant="destructive" onClick={handleDelete}>
						<Trash2 className="mr-2 h-4 w-4" />
						Delete
					</Button>
				</div>
			</div>

			<div className="grid lg:grid-cols-3 gap-6">
				{/* Main Editor */}
				<div className="lg:col-span-2 space-y-4">
					{/* Title and Tags */}
					<Card>
						<CardContent className="pt-6 space-y-4">
							<div>
								<Input
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="text-2xl font-bold border-none p-0 focus-visible:ring-0"
									placeholder="Note title"
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								{tags.map((tag) => (
									<Badge key={tag} className={getTagColor(tag)}>
										{tag}
									</Badge>
								))}
							</div>
							<Button size="sm" onClick={handleSaveMetadata} disabled={isSaving}>
								<Save className="mr-2 h-4 w-4" />
								Save Title & Tags
							</Button>
						</CardContent>
					</Card>

					{/* Editor */}
					<NoteEditor content={content} onChange={setContent} />
				</div>

				{/* Sidebar */}
				<div className="space-y-4">
					{/* Backlinks */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Backlinks
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-500">
								Notes that link to this note (coming soon)
							</p>
						</CardContent>
					</Card>

					{/* Metadata */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Info</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm">
							<div>
								<span className="text-gray-500">Created:</span>{' '}
								{new Date(note.createdAt).toLocaleDateString()}
							</div>
							<div>
								<span className="text-gray-500">Updated:</span>{' '}
								{new Date(note.updatedAt).toLocaleDateString()}
							</div>
							<div>
								<span className="text-gray-500">Slug:</span> {note.slug}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
