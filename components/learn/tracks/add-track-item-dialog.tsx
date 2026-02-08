'use client';

import { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { addTrackItem } from '@/lib/actions/tracks';
import { Plus } from 'lucide-react';
import { db } from '@/lib/instantdb/client';

const trackItemSchema = z.object({
	itemType: z.enum(['paper', 'note', 'project']),
	itemId: z.string().min(1, 'Please select an item'),
});

type TrackItemFormData = z.infer<typeof trackItemSchema>;

interface AddTrackItemDialogProps {
	trackId: string;
	currentItemsCount: number;
}

export function AddTrackItemDialog({
	trackId,
	currentItemsCount,
}: AddTrackItemDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [lastCreatedItemId, setLastCreatedItemId] = useState<string | null>(null);

	const form = useForm<TrackItemFormData>({
		resolver: zodResolver(trackItemSchema),
		defaultValues: {
			itemType: 'paper',
			itemId: '',
		},
	});

	const itemType = form.watch('itemType');

	// Fetch items based on type
	const { data } = db.useQuery({
		papers: {},
		notes: {},
		projects: {},
		trackItems: {
			$: { where: { trackId } },
		},
	});

	// Wait for the track item to appear in the query before closing
	useEffect(() => {
		console.log('Waiting for track item:', {
			lastCreatedItemId,
			hasTrackItems: !!data?.trackItems,
			trackItemsCount: data?.trackItems?.length,
			trackItemIds: data?.trackItems?.map((i: any) => i.id),
		});

		if (lastCreatedItemId && data?.trackItems) {
			const itemExists = data.trackItems.some(
				(item: any) => item.id === lastCreatedItemId
			);
			if (itemExists) {
				console.log('Track item appeared in query, closing dialog');
				setOpen(false);
				setLastCreatedItemId(null);
				setIsSubmitting(false);
				form.reset();
			}
		}
	}, [lastCreatedItemId, data, form]);

	const getAvailableItems = () => {
		if (!data) return [];

		if (itemType === 'paper') {
			return (data.papers || []).map((paper: any) => ({
				id: paper.id,
				label: paper.title,
			}));
		} else if (itemType === 'note') {
			return (data.notes || []).map((note: any) => ({
				id: note.id,
				label: note.title,
			}));
		} else {
			return (data.projects || []).map((project: any) => ({
				id: project.id,
				label: project.name,
			}));
		}
	};

	const availableItems = getAvailableItems();

	const onSubmit = async (formData: TrackItemFormData) => {
		setIsSubmitting(true);

		try {
			const itemId = await addTrackItem({
				trackId,
				itemType: formData.itemType,
				itemId: formData.itemId,
				order: currentItemsCount,
			});

			console.log('Track item created with ID:', itemId);
			// Wait for track item to appear in the query before closing dialog
			setLastCreatedItemId(itemId);
		} catch (error: any) {
			console.error('Error adding track item:', error);
			alert(`Failed to add item to track: ${error?.message || 'Unknown error'}`);
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-black text-white hover:bg-gray-800">
					<Plus className="mr-2 h-4 w-4" />
					Add Item
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg bg-white">
				<DialogHeader>
					<DialogTitle>Add Item to Track</DialogTitle>
					<DialogDescription>
						Add a paper, note, or project to this learning track.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="itemType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Item Type *</FormLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											form.setValue('itemId', '');
										}}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select item type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent position="popper" sideOffset={4} className="z-[100] max-h-[300px] w-[var(--radix-select-trigger-width)] bg-white">
											<SelectItem value="paper">Paper</SelectItem>
											<SelectItem value="note">Note</SelectItem>
											<SelectItem value="project">Project</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="itemId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Select Item *</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={
														availableItems.length === 0
															? `No ${itemType}s available`
															: 'Select an item'
													}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent position="popper" sideOffset={4} className="z-[100] max-h-[300px] w-[var(--radix-select-trigger-width)] bg-white">
											{availableItems.length === 0 ? (
												<div className="px-2 py-4 text-sm text-gray-500 text-center">
													No {itemType}s found. Create one first.
												</div>
											) : (
												availableItems.map((item) => (
													<SelectItem key={item.id} value={item.id}>
														{item.label}
													</SelectItem>
												))
											)}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting || availableItems.length === 0}
								className="bg-black text-white hover:bg-gray-800"
							>
								{isSubmitting ? 'Adding...' : 'Add to Track'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
