'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { updatePaper } from '@/lib/actions/papers';
import { PAPER_STATUSES, type Paper } from '@/lib/types/papers';
import { Edit } from 'lucide-react';

// Validation schema
const paperSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	authors: z.string().min(1, 'At least one author is required'),
	publicationYear: z.string().optional(),
	venue: z.string().optional(),
	pdfUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
	abstract: z.string().optional(),
	keyContribution: z.string().optional(),
	status: z.enum(['queue', 'reading', 'completed', 'implemented']),
	rating: z.string().optional(),
	tags: z.string().optional(),
});

type PaperFormData = z.infer<typeof paperSchema>;

interface EditPaperDialogProps {
	paper: Paper;
	onSuccess?: () => void;
}

export function EditPaperDialog({ paper, onSuccess }: EditPaperDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<PaperFormData>({
		resolver: zodResolver(paperSchema),
		defaultValues: {
			title: paper.title,
			authors: paper.authors.join(', '),
			publicationYear: paper.publicationYear?.toString() || '',
			venue: paper.venue || '',
			pdfUrl: paper.pdfUrl || '',
			abstract: paper.abstract || '',
			keyContribution: paper.keyContribution || '',
			status: paper.status,
			rating: paper.rating?.toString() || '',
			tags: paper.tags.join(', '),
		},
	});

	// Reset form when dialog opens
	useEffect(() => {
		if (open) {
			form.reset({
				title: paper.title,
				authors: paper.authors.join(', '),
				publicationYear: paper.publicationYear?.toString() || '',
				venue: paper.venue || '',
				pdfUrl: paper.pdfUrl || '',
				abstract: paper.abstract || '',
				keyContribution: paper.keyContribution || '',
				status: paper.status,
				rating: paper.rating?.toString() || '',
				tags: paper.tags.join(', '),
			});
		}
	}, [open, paper, form]);

	const onSubmit = async (data: PaperFormData) => {
		setIsSubmitting(true);
		try {
			// Parse authors from comma-separated string
			const authors = data.authors
				.split(',')
				.map((author) => author.trim())
				.filter(Boolean);

			// Parse tags from comma-separated string
			const tags = data.tags
				? data.tags
						.split(',')
						.map((tag) => tag.trim())
						.filter(Boolean)
				: [];

			// Parse publicationYear and rating
			const publicationYear = data.publicationYear
				? parseInt(data.publicationYear, 10)
				: undefined;
			const rating = data.rating ? parseInt(data.rating, 10) : undefined;

			await updatePaper({
				id: paper.id,
				title: data.title,
				authors,
				publicationYear,
				venue: data.venue || undefined,
				pdfUrl: data.pdfUrl || undefined,
				abstract: data.abstract || undefined,
				keyContribution: data.keyContribution || undefined,
				status: data.status,
				rating,
				tags,
			});

			setOpen(false);
			form.reset();
			onSuccess?.();
		} catch (error) {
			console.error('Error updating paper:', error);
			alert('Failed to update paper. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
					title="Edit paper"
				>
					<Edit className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
				<DialogHeader>
					<DialogTitle>Edit Paper</DialogTitle>
					<DialogDescription>
						Update the paper details below.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Title */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Title <span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input placeholder="Attention is all you need" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Authors */}
						<FormField
							control={form.control}
							name="authors"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Authors <span className="text-red-500">*</span>
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Vaswani, Shazeer, Parmar"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Comma-separated list of authors
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Publication Year and Venue */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="publicationYear"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Publication Year</FormLabel>
										<FormControl>
											<Input type="number" placeholder="2017" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="venue"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Venue</FormLabel>
										<FormControl>
											<Input placeholder="NeurIPS" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* PDF URL */}
						<FormField
							control={form.control}
							name="pdfUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>PDF URL</FormLabel>
									<FormControl>
										<Input
											type="url"
											placeholder="https://arxiv.org/pdf/..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Status and Rating */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Status <span className="text-red-500">*</span>
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent position="popper" sideOffset={4} className="z-[100] bg-white">
												{PAPER_STATUSES.map((status) => (
													<SelectItem key={status.value} value={status.value}>
														{status.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="rating"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Rating (1-5)</FormLabel>
										<FormControl>
											<Input
												type="number"
												min="1"
												max="5"
												placeholder="5"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Tags */}
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<Input
											placeholder="transformer, deep learning, nlp"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Comma-separated list of tags
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Key Contribution */}
						<FormField
							control={form.control}
							name="keyContribution"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Key Contribution</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Brief summary of the paper's main contribution..."
											className="min-h-[80px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Abstract */}
						<FormField
							control={form.control}
							name="abstract"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Abstract</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Paper abstract..."
											className="min-h-[120px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Form Actions */}
						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting} className="bg-black text-white hover:bg-gray-800">
								{isSubmitting ? 'Updating...' : 'Update Paper'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
