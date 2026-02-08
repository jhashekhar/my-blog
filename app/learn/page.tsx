'use client';

import { db } from '@/lib/instantdb/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, FolderKanban, CalendarDays, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { calculateTrackProgress } from '@/lib/actions/tracks';
import { STATUS_COLORS } from '@/lib/types/tracks';

/**
 * Dashboard page for Learning Tracker
 * Shows active tracks, quick stats, and quick actions
 */
export default function DashboardPage() {
	// Query all entities including tracks with their items
	const { data, isLoading } = db.useQuery({
		papers: {},
		notes: {},
		projects: {},
		journalEntries: {},
		learningTracks: {
			trackItems: {
				$: {
					order: { order: 'asc' },
				},
			},
		},
	});

	const stats = [
		{
			title: 'Papers',
			value: data?.papers?.length || 0,
			description: 'Academic papers tracked',
			icon: BookOpen,
			href: '/learn/papers',
		},
		{
			title: 'Notes',
			value: data?.notes?.length || 0,
			description: 'Notes created',
			icon: FileText,
			href: '/learn/notes',
		},
		{
			title: 'Projects',
			value: data?.projects?.length || 0,
			description: 'Active projects',
			icon: FolderKanban,
			href: '/learn/projects',
		},
		{
			title: 'Journal Entries',
			value: data?.journalEntries?.length || 0,
			description: 'Days logged',
			icon: CalendarDays,
			href: '/learn/journal',
		},
	];

	// Filter active tracks (in-progress status)
	const activeTracks = (data?.learningTracks || []).filter(
		(track: any) => track.status === 'in-progress'
	);

	// Helper to get next incomplete item in a track
	const getNextItem = (trackItems: any[]) => {
		return trackItems.find((item) => !item.completed);
	};

	// Helper to get item title from papers/notes/projects
	const getItemTitle = (item: any) => {
		if (!item) return 'Unknown Item';

		const allPapers = data?.papers || [];
		const allNotes = data?.notes || [];
		const allProjects = data?.projects || [];

		if (item.itemType === 'paper') {
			const paper = allPapers.find((p: any) => p.id === item.itemId);
			return paper?.title || 'Unknown Paper';
		} else if (item.itemType === 'note') {
			const note = allNotes.find((n: any) => n.id === item.itemId);
			return note?.title || 'Unknown Note';
		} else {
			const project = allProjects.find((p: any) => p.id === item.itemId);
			return project?.name || 'Unknown Project';
		}
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-gray-600 mt-2">
					Welcome back! Here&apos;s your learning progress overview.
				</p>
			</div>

			{/* Active Tracks Section */}
			{!isLoading && (
				<div>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-2xl font-semibold">My Active Tracks</h2>
						<Link href="/learn/tracks">
							<Button variant="ghost" size="sm">
								{activeTracks.length > 0 ? 'View All' : 'Create Track'}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
					{activeTracks.length === 0 ? (
						<Card className="border-dashed">
							<CardContent className="py-12 text-center">
								<Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
								<p className="text-gray-600 mb-2">No active tracks yet</p>
								<p className="text-sm text-gray-500 mb-4">
									Create a learning track to organize your papers, notes, and projects
								</p>
								<Link href="/learn/tracks">
									<Button className="bg-black text-white hover:bg-gray-800">
										Create Your First Track
									</Button>
								</Link>
							</CardContent>
						</Card>
					) : (
					<div className="grid gap-4 md:grid-cols-2">
						{activeTracks.map((track: any) => {
							const trackItems = track.trackItems || [];
							const progress = calculateTrackProgress(trackItems);
							const completedCount = trackItems.filter((i: any) => i.completed).length;
							const nextItem = getNextItem(trackItems);

							return (
								<Card key={track.id} className="hover:shadow-md transition-shadow">
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<CardTitle className="text-lg">{track.title}</CardTitle>
												{track.description && (
													<CardDescription className="mt-1">
														{track.description}
													</CardDescription>
												)}
											</div>
											<Badge className={STATUS_COLORS[track.status as keyof typeof STATUS_COLORS]}>
												In Progress
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										{/* Progress */}
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span className="text-gray-600">Progress</span>
												<span className="font-medium">{progress}%</span>
											</div>
											<Progress value={progress} className="h-2" />
											<p className="text-xs text-gray-500">
												{completedCount} of {trackItems.length} items completed
											</p>
										</div>

										{/* Next Item */}
										{nextItem && (
											<div className="pt-2 border-t">
												<p className="text-xs text-gray-500 mb-1">Next up:</p>
												<p className="text-sm font-medium text-gray-700 line-clamp-2">
													{nextItem.itemType === 'paper' && '📄 '}
													{nextItem.itemType === 'note' && '📝 '}
													{nextItem.itemType === 'project' && '📁 '}
													{getItemTitle(nextItem)}
												</p>
											</div>
										)}

										{/* Continue Button */}
										<Link href={`/learn/tracks/${track.id}`}>
											<Button className="w-full bg-black text-white hover:bg-gray-800">
												Continue
												<ArrowRight className="ml-2 h-4 w-4" />
											</Button>
										</Link>
									</CardContent>
								</Card>
							);
						})}
					</div>
					)}
				</div>
			)}

			{/* Stats Grid */}
			<div>
				<h2 className="text-xl font-semibold mb-4">Your Resources</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<Link key={stat.title} href={stat.href}>
							<Card className="hover:bg-gray-50 transition-colors cursor-pointer">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
									<Icon className="h-4 w-4 text-gray-600" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{isLoading ? '...' : stat.value}
									</div>
									<p className="text-xs text-gray-600 mt-1">
										{stat.description}
									</p>
								</CardContent>
							</Card>
						</Link>
					);
				})}
				</div>
			</div>

			{/* Quick Actions */}
			<div>
				<h2 className="text-xl font-semibold mb-4">Add Resources</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Add Paper</CardTitle>
							<CardDescription>Track a new academic paper</CardDescription>
						</CardHeader>
						<CardContent>
							<Link href="/learn/papers">
								<Button className="w-full bg-black text-white hover:bg-gray-800">Go to Papers</Button>
							</Link>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">New Note</CardTitle>
							<CardDescription>Create a new note</CardDescription>
						</CardHeader>
						<CardContent>
							<Link href="/learn/notes">
								<Button className="w-full bg-black text-white hover:bg-gray-800">Go to Notes</Button>
							</Link>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">Log Today</CardTitle>
							<CardDescription>Write in your journal</CardDescription>
						</CardHeader>
						<CardContent>
							<Link href="/learn/journal">
								<Button className="w-full bg-black text-white hover:bg-gray-800">Go to Journal</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Getting Started */}
			{!isLoading && data &&
				data.papers.length === 0 &&
				data.notes.length === 0 &&
				data.projects.length === 0 && (
				<Card className="bg-blue-50 border-blue-200">
					<CardHeader>
						<CardTitle>Welcome to Learning Tracker!</CardTitle>
						<CardDescription className="text-blue-900">
							Get started by adding your first paper, creating a note, or starting a project.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 text-sm text-blue-900">
						<p>• <strong>Papers:</strong> Track academic papers you&apos;re reading</p>
						<p>• <strong>Notes:</strong> Take rich-text notes with LaTeX and wiki-links</p>
						<p>• <strong>Projects:</strong> Manage implementation projects</p>
						<p>• <strong>Journal:</strong> Log daily learning progress</p>
						<p>• <strong>Tracks:</strong> Create structured learning paths</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
