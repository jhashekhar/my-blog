'use client';

import Link from 'next/link';
import { db } from '@/lib/instantdb/client';
import { AddTrackDialog } from '@/components/learn/tracks/add-track-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { calculateTrackProgress } from '@/lib/actions/tracks';
import { STATUS_COLORS, TRACK_STATUSES, type LearningTrack } from '@/lib/types/tracks';
import { Route } from 'lucide-react';

export default function TracksPage() {
	const { data, isLoading } = db.useQuery({
		learningTracks: {
			trackItems: {},
		},
	});

	const tracks = (data?.learningTracks || []) as (LearningTrack & { trackItems: any[] })[];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-start">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Learning Tracks</h1>
					<p className="text-gray-600 mt-2">
						Create structured learning paths with papers, notes, and projects.
					</p>
				</div>
				<AddTrackDialog />
			</div>

			{/* Loading state */}
			{isLoading && (
				<Card>
					<CardContent className="py-8 text-center">
						<p className="text-gray-500">Loading tracks...</p>
					</CardContent>
				</Card>
			)}

			{/* Empty state */}
			{!isLoading && tracks.length === 0 && (
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500 mb-4">
							No learning tracks yet. Create your first track to get started!
						</p>
						<AddTrackDialog />
					</CardContent>
				</Card>
			)}

			{/* Tracks grid */}
			{!isLoading && tracks.length > 0 && (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{tracks.map((track) => {
						const progress = calculateTrackProgress(track.trackItems || []);
						const statusLabel =
							TRACK_STATUSES.find((s) => s.value === track.status)?.label ||
							track.status;

						return (
							<Link key={track.id} href={`/learn/tracks/${track.id}`}>
								<Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
									<CardHeader>
										<CardTitle className="text-lg flex items-start gap-2">
											<Route className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
											<span className="line-clamp-2">{track.title}</span>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										{/* Status badge */}
										<Badge className={STATUS_COLORS[track.status]}>
											{statusLabel}
										</Badge>

										{/* Description */}
										{track.description && (
											<p className="text-sm text-gray-600 line-clamp-2">
												{track.description}
											</p>
										)}

										{/* Progress */}
										<div className="space-y-2">
											<div className="flex justify-between text-xs text-gray-500">
												<span>Progress</span>
												<span>{progress}%</span>
											</div>
											<Progress value={progress} />
											<p className="text-xs text-gray-500">
												{track.trackItems?.length || 0} items
											</p>
										</div>
									</CardContent>
								</Card>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
