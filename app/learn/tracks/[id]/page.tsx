'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/instantdb/client';
import {
	deleteTrack,
	toggleTrackItemComplete,
	removeTrackItem,
	calculateTrackProgress,
} from '@/lib/actions/tracks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { STATUS_COLORS, TRACK_STATUSES, type LearningTrack } from '@/lib/types/tracks';
import { ArrowLeft, Trash2, BookOpen, FileText, FolderKanban } from 'lucide-react';
import { AddTrackItemDialog } from '@/components/learn/tracks/add-track-item-dialog';

interface TrackDetailPageProps {
	params: Promise<{ id: string }>;
}

export default function TrackDetailPage({ params }: TrackDetailPageProps) {
	const { id } = use(params);
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);

	const { data, isLoading } = db.useQuery({
		learningTracks: {
			$: { where: { id } },
		},
		trackItems: {
			$: {
				where: { trackId: id },
				order: { order: 'asc' },
			},
		},
		papers: {},
		notes: {},
		projects: {},
	});

	const track = data?.learningTracks?.[0] as LearningTrack;
	const trackItems = data?.trackItems || [];

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this track?')) {
			return;
		}

		setIsDeleting(true);
		try {
			await deleteTrack(id);
			router.push('/learn/tracks');
		} catch (error) {
			console.error('Error deleting track:', error);
			alert('Failed to delete track. Please try again.');
			setIsDeleting(false);
		}
	};

	const handleToggleComplete = async (itemId: string, completed: boolean) => {
		try {
			await toggleTrackItemComplete(itemId, !completed);
		} catch (error) {
			console.error('Error toggling item:', error);
		}
	};

	const handleRemoveItem = async (itemId: string) => {
		if (!confirm('Remove this item from the track?')) {
			return;
		}

		try {
			await removeTrackItem(itemId);
		} catch (error) {
			console.error('Error removing item:', error);
		}
	};

	const getItemDetails = (item: any) => {
		const allPapers = data?.papers || [];
		const allNotes = data?.notes || [];
		const allProjects = data?.projects || [];

		if (item.itemType === 'paper') {
			const paper = allPapers.find((p: any) => p.id === item.itemId);
			return {
				title: paper?.title || 'Unknown Paper',
				href: `/learn/papers/${item.itemId}`,
				icon: BookOpen,
			};
		} else if (item.itemType === 'note') {
			const note = allNotes.find((n: any) => n.id === item.itemId);
			return {
				title: note?.title || 'Unknown Note',
				href: `/learn/notes/${note?.slug || item.itemId}`,
				icon: FileText,
			};
		} else {
			const project = allProjects.find((p: any) => p.id === item.itemId);
			return {
				title: project?.name || 'Unknown Project',
				href: `/learn/projects/${item.itemId}`,
				icon: FolderKanban,
			};
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" asChild>
						<Link href="/learn/tracks">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Tracks
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Loading track...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!track) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" asChild>
						<Link href="/learn/tracks">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Tracks
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Track not found.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const progress = calculateTrackProgress(trackItems);
	const statusLabel = TRACK_STATUSES.find((s) => s.value === track.status)?.label || track.status;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<Button variant="ghost" asChild>
					<Link href="/learn/tracks">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Tracks
					</Link>
				</Button>
				<Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
					<Trash2 className="mr-2 h-4 w-4" />
					Delete Track
				</Button>
			</div>

			{/* Track Info */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<CardTitle className="text-2xl">{track.title}</CardTitle>
							<div className="flex items-center gap-2 mt-3">
								<Badge className={STATUS_COLORS[track.status]}>{statusLabel}</Badge>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Description */}
					{track.description && (
						<p className="text-gray-700">{track.description}</p>
					)}

					{/* Progress */}
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-gray-600">Progress</span>
							<span className="font-medium">{progress}%</span>
						</div>
						<Progress value={progress} className="h-3" />
						<p className="text-sm text-gray-500">
							{trackItems.filter((i) => i.completed).length} of {trackItems.length} items
							completed
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Track Items */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Track Items</CardTitle>
						<AddTrackItemDialog trackId={id} currentItemsCount={trackItems.length} />
					</div>
				</CardHeader>
				<CardContent>
					{trackItems.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-gray-500 mb-4">
								No items in this track yet. Add papers, notes, or projects to get
								started!
							</p>
							<AddTrackItemDialog trackId={id} currentItemsCount={0} />
						</div>
					) : (
						<div className="space-y-2">
							{trackItems.map((item, index) => {
								const details = getItemDetails(item);
								const Icon = details.icon;

								return (
									<div
										key={item.id}
										className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
									>
										<Checkbox
											checked={item.completed}
											onCheckedChange={() =>
												handleToggleComplete(item.id, item.completed)
											}
										/>
										<Icon className="h-4 w-4 text-gray-500" />
										<Link
											href={details.href}
											className="flex-1 hover:underline"
										>
											<span
												className={
													item.completed ? 'line-through text-gray-500' : ''
												}
											>
												{details.title}
											</span>
										</Link>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRemoveItem(item.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								);
							})}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
