'use client';

import { db } from '@/lib/instantdb/client';
import { PapersTable } from '@/components/learn/papers/papers-table';
import { AddPaperDialog } from '@/components/learn/papers/add-paper-dialog';
import { Card, CardContent } from '@/components/ui/card';
import type { Paper } from '@/lib/types/papers';

export default function PapersPage() {
	const { data, isLoading } = db.useQuery({
		papers: {},
	});

	const papers = (data?.papers || []) as Paper[];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-start">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Papers</h1>
					<p className="text-gray-600 mt-2">
						Track academic papers and research articles.
					</p>
				</div>
				<AddPaperDialog />
			</div>

			{/* Loading state */}
			{isLoading && (
				<Card>
					<CardContent className="py-8 text-center">
						<p className="text-gray-500">Loading papers...</p>
					</CardContent>
				</Card>
			)}

			{/* Empty state */}
			{!isLoading && papers.length === 0 && (
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500 mb-4">
							No papers yet. Add your first paper to get started!
						</p>
						<AddPaperDialog />
					</CardContent>
				</Card>
			)}

			{/* Papers table */}
			{!isLoading && papers.length > 0 && <PapersTable papers={papers} />}
		</div>
	);
}
