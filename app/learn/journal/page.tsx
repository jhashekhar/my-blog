'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/instantdb/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { getTodayISO, formatDate } from '@/lib/actions/journal';
import type { JournalEntry } from '@/lib/types/journal';
import { getTagColor } from '@/lib/utils/tag-colors';
import { BookOpen, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';

export default function JournalPage() {
	const router = useRouter();
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

	const { data, isLoading } = db.useQuery({
		journalEntries: {
			$: {
				order: { date: 'desc' },
			},
		},
	});

	const entries = (data?.journalEntries || []) as JournalEntry[];

	// Get dates that have entries
	const entriesMap = new Map(entries.map((e) => [e.date, e]));

	// Get this week's entries
	const today = new Date();
	const weekAgo = new Date(today);
	weekAgo.setDate(weekAgo.getDate() - 7);
	const recentEntries = entries.filter((e) => {
		const entryDate = new Date(e.date);
		return entryDate >= weekAgo;
	});

	// Calculate stats
	const totalEntries = entries.length;
	const thisWeekEntries = recentEntries.length;
	const totalTimeSpent = entries.reduce((sum, e) => sum + (e.timeSpent || 0), 0);

	const handleDateSelect = (date: Date | undefined) => {
		if (!date) return;
		setSelectedDate(date);
		const isoDate = date.toISOString().split('T')[0];
		router.push(`/learn/journal/${isoDate}`);
	};

	const handleTodayClick = () => {
		const today = getTodayISO();
		router.push(`/learn/journal/${today}`);
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Journal</h1>
						<p className="text-gray-600 dark:text-gray-400 mt-1">
							Daily learning log
						</p>
					</div>
				</div>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Loading journal...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Journal</h1>
					<p className="text-gray-600 mt-1">
						Daily learning log
					</p>
				</div>
				<Button onClick={handleTodayClick}>
					<BookOpen className="mr-2 h-4 w-4" />
					Log Today
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-blue-100 rounded-lg">
								<BookOpen className="h-6 w-6 text-blue-600" />
							</div>
							<div>
								<div className="text-2xl font-bold">{totalEntries}</div>
								<p className="text-xs text-gray-500">Total Entries</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-green-100 rounded-lg">
								<TrendingUp className="h-6 w-6 text-green-600" />
							</div>
							<div>
								<div className="text-2xl font-bold">{thisWeekEntries}</div>
								<p className="text-xs text-gray-500">This Week</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-purple-100 rounded-lg">
								<CalendarIcon className="h-6 w-6 text-purple-600" />
							</div>
							<div>
								<div className="text-2xl font-bold">
									{Math.round(totalTimeSpent / 60)}h
								</div>
								<p className="text-xs text-gray-500">Total Time</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid lg:grid-cols-3 gap-6">
				{/* Calendar */}
				<Card>
					<CardHeader>
						<CardTitle>Calendar</CardTitle>
					</CardHeader>
					<CardContent>
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={handleDateSelect}
							className="rounded-md border"
							modifiers={{
								hasEntry: (date) => {
									const isoDate = date.toISOString().split('T')[0];
									return entriesMap.has(isoDate);
								},
							}}
							modifiersStyles={{
								hasEntry: {
									fontWeight: 'bold',
									textDecoration: 'underline',
								},
							}}
						/>
					</CardContent>
				</Card>

				{/* Recent Entries */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Recent Entries</CardTitle>
					</CardHeader>
					<CardContent>
						{entries.length === 0 ? (
							<div className="text-center py-12">
								<BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
								<p className="text-gray-500 mb-4">
									No journal entries yet. Start logging your learning journey!
								</p>
								<Button onClick={handleTodayClick} className="bg-black text-white hover:bg-gray-800">Create First Entry</Button>
							</div>
						) : (
							<div className="space-y-4">
								{entries.slice(0, 10).map((entry) => {
									const hasContent =
										entry.content?.content &&
										entry.content.content.length > 0;

									return (
										<Link
											key={entry.id}
											href={`/learn/journal/${entry.date}`}
											className="block"
										>
											<div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-2">
															<h3 className="font-medium">
																{formatDate(entry.date)}
															</h3>
															{entry.mood && (
																<span className="text-xl">{entry.mood}</span>
															)}
														</div>
														{hasContent && (
															<p className="text-sm text-gray-600 line-clamp-2">
																{/* Show first text node from Tiptap content */}
																{entry.content.content
																	.filter((n: any) => n.type === 'paragraph')
																	.map((n: any) =>
																		n.content
																			?.map((c: any) => c.text)
																			.join('')
																	)
																	.join(' ')}
															</p>
														)}
														{entry.tags && entry.tags.length > 0 && (
															<div className="flex flex-wrap gap-1 mt-2">
																{entry.tags.map((tag) => (
																	<Badge
																		key={tag}
																		className={`${getTagColor(tag)} text-xs`}
																	>
																		{tag}
																	</Badge>
																))}
															</div>
														)}
													</div>
													{entry.timeSpent && entry.timeSpent > 0 && (
														<Badge variant="outline">
															{entry.timeSpent} min
														</Badge>
													)}
												</div>
											</div>
										</Link>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
