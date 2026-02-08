'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNote, generateSlug } from '@/lib/actions/notes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewNotePage() {
	const router = useRouter();
	const [title, setTitle] = useState('');
	const [tags, setTags] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	const handleCreate = async () => {
		if (!title.trim()) {
			alert('Please enter a note title');
			return;
		}

		setIsCreating(true);

		try {
			const slug = generateSlug(title);
			await createNote({
				title: title.trim(),
				slug,
				tags: tags
					? tags.split(',').map((t) => t.trim())
					: [],
			});

			router.push(`/learn/notes/${slug}`);
		} catch (error) {
			console.error('Error creating note:', error);
			alert('Failed to create note. Please try again.');
			setIsCreating(false);
		}
	};

	return (
		<div className="space-y-6 max-w-2xl mx-auto">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" asChild>
					<Link href="/learn/notes">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Notes
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Create New Note</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title *</Label>
						<Input
							id="title"
							placeholder="Note title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							autoFocus
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="tags">Tags</Label>
						<Input
							id="tags"
							placeholder="tag1, tag2, tag3"
							value={tags}
							onChange={(e) => setTags(e.target.value)}
						/>
						<p className="text-xs text-gray-500">Separate tags with commas</p>
					</div>

					<div className="flex gap-2">
						<Button onClick={handleCreate} disabled={isCreating || !title.trim()} className="bg-black text-white hover:bg-gray-800">
							{isCreating ? 'Creating...' : 'Create Note'}
						</Button>
						<Button variant="outline" asChild>
							<Link href="/learn/notes">Cancel</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
