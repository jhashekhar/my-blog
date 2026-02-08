'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/instantdb/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { deletePaper } from '@/lib/actions/papers';
import { STATUS_COLORS, PAPER_STATUSES, type Paper } from '@/lib/types/papers';
import { getTagColor } from '@/lib/utils/tag-colors';
import {
	ArrowLeft,
	ExternalLink,
	FileText,
	Trash2,
	Star,
	Calendar,
	Users,
	Building2,
} from 'lucide-react';
import Link from 'next/link';
import { EditPaperDialog } from '@/components/learn/papers/edit-paper-dialog';

interface PaperDetailPageProps {
	params: Promise<{ id: string }>;
}

export default function PaperDetailPage({ params }: PaperDetailPageProps) {
	const { id } = use(params);
	const router = useRouter();

	const { data, isLoading } = db.useQuery({
		papers: {
			$: { where: { id } },
			paperNotes: {
				note: {},
			},
		},
	});

	const paper = data?.papers?.[0] as Paper | undefined;
	const linkedNotes = (data?.papers?.[0] as any)?.paperNotes?.map((pn: any) => pn.note).filter(Boolean) || [];

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this paper?')) {
			return;
		}

		try {
			await deletePaper(id);
			router.push('/learn/papers');
		} catch (error) {
			console.error('Error deleting paper:', error);
			alert('Failed to delete paper. Please try again.');
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" asChild>
						<Link href="/learn/papers">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Papers
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Loading paper...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!paper) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" asChild>
						<Link href="/learn/papers">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Papers
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Paper not found.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const statusLabel =
		PAPER_STATUSES.find((s) => s.value === paper.status)?.label || paper.status;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<Button variant="ghost" asChild>
					<Link href="/learn/papers">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Papers
					</Link>
				</Button>
				<div className="flex gap-1">
					<EditPaperDialog paper={paper} />
					<Button
						variant="ghost"
						size="icon"
						onClick={handleDelete}
						className="h-9 w-9 text-gray-600 hover:text-red-600 hover:bg-red-50"
						title="Delete paper"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Main Paper Info */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<CardTitle className="text-2xl">{paper.title}</CardTitle>
							<div className="flex flex-wrap items-center gap-2 mt-3">
								<Badge className={STATUS_COLORS[paper.status]}>
									{statusLabel}
								</Badge>
								{paper.rating && (
									<Badge variant="outline" className="gap-1">
										<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
										{paper.rating}/5
									</Badge>
								)}
							</div>
						</div>
						{paper.pdfUrl && (
							<Button asChild>
								<a
									href={paper.pdfUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLink className="mr-2 h-4 w-4" />
									View PDF
								</a>
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Metadata */}
					<div className="grid md:grid-cols-2 gap-4">
						<div className="flex items-center gap-2 text-sm">
							<Users className="h-4 w-4 text-gray-500" />
							<span className="text-gray-600">
								{paper.authors.join(', ')}
							</span>
						</div>
						{paper.venue && (
							<div className="flex items-center gap-2 text-sm">
								<Building2 className="h-4 w-4 text-gray-500" />
								<span className="text-gray-600">
									{paper.venue}
								</span>
							</div>
						)}
						{paper.publicationYear && (
							<div className="flex items-center gap-2 text-sm">
								<Calendar className="h-4 w-4 text-gray-500" />
								<span className="text-gray-600">
									{paper.publicationYear}
								</span>
							</div>
						)}
					</div>

					{/* Tags */}
					{paper.tags.length > 0 && (
						<div>
							<h3 className="text-sm font-medium mb-2">Tags</h3>
							<div className="flex flex-wrap gap-2">
								{paper.tags.map((tag) => (
									<Badge key={tag} className={getTagColor(tag)}>
										{tag}
									</Badge>
								))}
							</div>
						</div>
					)}

					<Separator />

					{/* Key Contribution */}
					{paper.keyContribution && (
						<div>
							<h3 className="text-sm font-medium mb-2">Key Contribution</h3>
							<p className="text-gray-700">
								{paper.keyContribution}
							</p>
						</div>
					)}

					{/* Abstract */}
					{paper.abstract && (
						<div>
							<h3 className="text-sm font-medium mb-2">Abstract</h3>
							<p className="text-gray-700 whitespace-pre-wrap">
								{paper.abstract}
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Linked Notes */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Linked Notes ({linkedNotes.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					{linkedNotes.length === 0 ? (
						<p className="text-gray-500 text-sm">
							No notes linked to this paper yet.
						</p>
					) : (
						<div className="space-y-2">
							{linkedNotes.map((note: any) => (
								<Link
									key={note.id}
									href={`/learn/notes/${note.slug}`}
									className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
								>
									<p className="font-medium">{note.title}</p>
								</Link>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
