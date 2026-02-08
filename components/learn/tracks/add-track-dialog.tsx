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
import { createTrack } from '@/lib/actions/tracks';
import { TRACK_STATUSES } from '@/lib/types/tracks';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const trackSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	status: z.enum(['planned', 'in-progress', 'completed']),
});

type TrackFormData = z.infer<typeof trackSchema>;

export function AddTrackDialog() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<TrackFormData>({
		resolver: zodResolver(trackSchema),
		defaultValues: {
			title: '',
			description: '',
			status: 'planned',
		},
	});

	const onSubmit = async (data: TrackFormData) => {
		setIsSubmitting(true);

		try {
			const trackId = await createTrack({
				title: data.title,
				description: data.description || undefined,
				status: data.status,
			});

			form.reset();
			setOpen(false);
			router.push(`/learn/tracks/${trackId}`);
		} catch (error) {
			console.error('Error creating track:', error);
			alert('Failed to create track. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-black text-white hover:bg-gray-800">
					<Plus className="mr-2 h-4 w-4" />
					New Track
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl bg-white">
				<DialogHeader>
					<DialogTitle>Create Learning Track</DialogTitle>
					<DialogDescription>
						Create a structured learning path with papers, notes, and projects.
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
										<Input placeholder="RUL Prediction Fundamentals" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe the learning track and its goals..."
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										What will you learn from this track?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status *</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent position="popper" sideOffset={4} className="z-[100] bg-white">
											{TRACK_STATUSES.map((status) => (
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

						<div className="flex justify-end gap-2">
							<Button type="button" variant="outline" onClick={() => setOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting} className="bg-black text-white hover:bg-gray-800">
								{isSubmitting ? 'Creating...' : 'Create Track'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
