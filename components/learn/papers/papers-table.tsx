'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PAPER_STATUSES, STATUS_COLORS, type Paper } from '@/lib/types/papers';
import { Search, ExternalLink } from 'lucide-react';

interface PapersTableProps {
	papers: Paper[];
}

export function PapersTable({ papers }: PapersTableProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [tagFilter, setTagFilter] = useState<string>('all');

	// Get unique tags from all papers
	const allTags = useMemo(() => {
		const tagsSet = new Set<string>();
		papers.forEach((paper) => {
			paper.tags.forEach((tag) => tagsSet.add(tag));
		});
		return Array.from(tagsSet).sort();
	}, [papers]);

	// Filter papers
	const filteredPapers = useMemo(() => {
		return papers.filter((paper) => {
			// Search filter
			const searchLower = searchQuery.toLowerCase();
			const matchesSearch =
				!searchQuery ||
				paper.title.toLowerCase().includes(searchLower) ||
				paper.authors.some((author) =>
					author.toLowerCase().includes(searchLower)
				) ||
				paper.venue?.toLowerCase().includes(searchLower);

			// Status filter
			const matchesStatus =
				statusFilter === 'all' || paper.status === statusFilter;

			// Tag filter
			const matchesTag =
				tagFilter === 'all' || paper.tags.includes(tagFilter);

			return matchesSearch && matchesStatus && matchesTag;
		});
	}, [papers, searchQuery, statusFilter, tagFilter]);

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-col md:flex-row gap-4">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search papers by title, authors, or venue..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>

				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-full md:w-[180px]">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Statuses</SelectItem>
						{PAPER_STATUSES.map((status) => (
							<SelectItem key={status.value} value={status.value}>
								{status.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{allTags.length > 0 && (
					<Select value={tagFilter} onValueChange={setTagFilter}>
						<SelectTrigger className="w-full md:w-[180px]">
							<SelectValue placeholder="Filter by tag" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Tags</SelectItem>
							{allTags.map((tag) => (
								<SelectItem key={tag} value={tag}>
									{tag}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</div>

			{/* Results count */}
			<div className="text-sm text-gray-600">
				Showing {filteredPapers.length} of {papers.length} papers
			</div>

			{/* Table */}
			<div className="border rounded-lg">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Authors</TableHead>
							<TableHead>Year</TableHead>
							<TableHead>Venue</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Tags</TableHead>
							<TableHead>Rating</TableHead>
							<TableHead>Link</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredPapers.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="text-center py-8 text-gray-500">
									No papers found. Try adjusting your filters.
								</TableCell>
							</TableRow>
						) : (
							filteredPapers.map((paper) => (
								<TableRow key={paper.id}>
									<TableCell className="font-medium">
										<Link
											href={`/learn/papers/${paper.id}`}
											className="hover:underline"
										>
											{paper.title}
										</Link>
									</TableCell>
									<TableCell className="max-w-[200px] truncate">
										{paper.authors.join(', ')}
									</TableCell>
									<TableCell>{paper.publicationYear || '-'}</TableCell>
									<TableCell className="max-w-[150px] truncate">
										{paper.venue || '-'}
									</TableCell>
									<TableCell>
										<Badge className={STATUS_COLORS[paper.status]}>
											{PAPER_STATUSES.find((s) => s.value === paper.status)?.label}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{paper.tags.slice(0, 2).map((tag) => (
												<Badge key={tag} variant="outline" className="text-xs">
													{tag}
												</Badge>
											))}
											{paper.tags.length > 2 && (
												<Badge variant="outline" className="text-xs">
													+{paper.tags.length - 2}
												</Badge>
											)}
										</div>
									</TableCell>
									<TableCell>
										{paper.rating ? `${paper.rating}/5` : '-'}
									</TableCell>
									<TableCell>
										{paper.pdfUrl ? (
											<Button
												variant="ghost"
												size="sm"
												asChild
											>
												<a
													href={paper.pdfUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													<ExternalLink className="h-4 w-4" />
												</a>
											</Button>
										) : (
											'-'
										)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
