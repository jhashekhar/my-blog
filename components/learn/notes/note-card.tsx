'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar } from 'lucide-react';
import type { Note } from '@/lib/types/notes';
import { format } from 'date-fns';
import { getTagColor } from '@/lib/utils/tag-colors';

interface NoteCardProps {
	note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
	return (
		<Link href={`/learn/notes/${note.slug}`}>
			<Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
				<CardHeader>
					<CardTitle className="text-lg flex items-start gap-2">
						<FileText className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
						<span className="line-clamp-2">{note.title}</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{/* Tags */}
					{note.tags && note.tags.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{note.tags.slice(0, 3).map((tag) => (
								<Badge key={tag} className={`${getTagColor(tag)} text-xs`}>
									{tag}
								</Badge>
							))}
							{note.tags.length > 3 && (
								<Badge variant="secondary" className="text-xs">
									+{note.tags.length - 3}
								</Badge>
							)}
						</div>
					)}

					{/* Metadata */}
					<div className="flex items-center gap-2 text-xs text-gray-500">
						<Calendar className="h-3 w-3" />
						<span>Updated {format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
