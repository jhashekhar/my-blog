'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createPaper } from '@/lib/actions/papers';
import { PAPER_STATUSES } from '@/lib/types/papers';
import { Plus } from 'lucide-react';

const paperSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	authors: z.string().min(1, 'At least one author is required'),
	publicationYear: z.string().optional(),
	venue: z.string().optional(),
	pdfUrl: z.string().url().optional().or(z.literal('')),
	abstract: z.string().optional(),
	keyContribution: z.string().optional(),
	status: z.enum(['queue', 'reading', 'completed', 'implemented']),
	rating: z.string().optional(),
	tags: z.string().optional(),
});

type PaperFormData = z.infer<typeof paperSchema>;

export function AddPaperDialog() {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<PaperFormData>({
		resolver: zodResolver(paperSchema),
		defaultValues: {
			title: '',
			authors: '',
			publicationYear: '',
			venue: '',
			pdfUrl: '',
			abstract: '',
			keyContribution: '',
			status: 'queue',
			rating: '',
			tags: '',
		},
	});

	const onSubmit = async (data: PaperFormData) => {
		setIsSubmitting(true);

		try {
			await createPaper({
				title: data.title,
				authors: data.authors.split(',').map((a) => a.trim()),
				publicationYear: data.publicationYear ? parseInt(data.publicationYear) : undefined,
				venue: data.venue || undefined,
				pdfUrl: data.pdfUrl || undefined,
				abstract: data.abstract || undefined,
				keyContribution: data.keyContribution || undefined,
				status: data.status,
				rating: data.rating ? parseInt(data.rating) : undefined,
				tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
			});

			// Reset form and close dialog
			form.reset();
			setOpen(false);
		} catch (error) {
			console.error('Error creating paper:', error);
			alert('Failed to create paper. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-black text-white hover:bg-gray-800">
					<Plus className="mr-2 h-4 w-4" />
					Add Paper
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
				<DialogHeader>
					<DialogTitle>Add New Paper</DialogTitle>
					<DialogDescription>
						Add a new academic paper to your library.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title *</FormLabel>
									<FormControl>
										<Input placeholder="Paper title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="authors"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Authors *</FormLabel>
									<FormControl>
										<Input placeholder="John Doe, Jane Smith" {...field} />
									</FormControl>
									<FormDescription>
										Separate multiple authors with commas
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="publicationYear"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Year</FormLabel>
										<FormControl>
											<Input type="number" placeholder="2024" {...field} />
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
											<Input placeholder="Conference/Journal" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

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
									<FormDescription>
										Link to the paper PDF (arXiv, DOI, etc.)
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="abstract"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Abstract</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Paper abstract..."
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="keyContribution"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Key Contribution</FormLabel>
									<FormControl>
										<Textarea
											placeholder="What's the main contribution of this paper?"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status *</FormLabel>
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
										<FormLabel>Rating</FormLabel>
										<FormControl>
											<Input
												type="number"
												min="1"
												max="5"
												placeholder="1-5"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<Input placeholder="machine-learning, nlp, transformers" {...field} />
									</FormControl>
									<FormDescription>
										Separate multiple tags with commas
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting} className="bg-black text-white hover:bg-gray-800">
								{isSubmitting ? 'Creating...' : 'Create Paper'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
