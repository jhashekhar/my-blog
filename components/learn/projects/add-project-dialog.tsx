'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createProject } from '@/lib/actions/projects';
import { db } from '@/lib/instantdb/client';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { PROJECT_STATUSES, type ProjectStatus } from '@/lib/types/projects';

const projectSchema = z.object({
	name: z.string().min(1, 'Project name is required'),
	description: z.string().optional(),
	status: z.enum(['idea', 'in-progress', 'completed', 'on-hold']),
	githubUrl: z.string().optional(),
	tags: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export function AddProjectDialog() {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<ProjectFormData>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			status: 'idea',
		},
	});

	const status = watch('status');

	// Query to check if the project appears
	const { data: projectsData } = db.useQuery({ projects: {} });

	// Wait for the project to appear in the query before closing
	useEffect(() => {
		if (lastCreatedId && projectsData?.projects) {
			const projectExists = projectsData.projects.some((p: any) => p.id === lastCreatedId);
			if (projectExists) {
				console.log('Project appeared in query, closing dialog');
				setOpen(false);
				setLastCreatedId(null);
				setIsSubmitting(false);
				reset();
			}
		}
	}, [lastCreatedId, projectsData, reset]);

	const onSubmit = async (data: ProjectFormData) => {
		setIsSubmitting(true);

		try {
			const projectId = await createProject({
				name: data.name,
				description: data.description,
				status: data.status as ProjectStatus,
				githubUrl: data.githubUrl,
				tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
			});

			// Wait for project to appear in the query before closing dialog
			setLastCreatedId(projectId);
		} catch (error: any) {
			console.error('Error creating project:', error);
			alert(`Failed to create project: ${error?.message || 'Unknown error'}`);
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-black text-white hover:bg-gray-800">
					<Plus className="mr-2 h-4 w-4" />
					New Project
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
				<DialogHeader>
					<DialogTitle>Create New Project</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Name */}
					<div className="space-y-2">
						<Label htmlFor="name">
							Project Name <span className="text-red-500">*</span>
						</Label>
						<Input
							id="name"
							placeholder="My awesome project"
							{...register('name')}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="What is this project about?"
							rows={4}
							{...register('description')}
						/>
						{errors.description && (
							<p className="text-sm text-red-500">
								{errors.description.message}
							</p>
						)}
					</div>

					{/* Status */}
					<div className="space-y-2">
						<Label htmlFor="status">
							Status <span className="text-red-500">*</span>
						</Label>
						<Select value={status} onValueChange={(val) => setValue('status', val as ProjectStatus)}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent position="popper" sideOffset={4} className="z-[100] bg-white">
								{PROJECT_STATUSES.map((s) => (
									<SelectItem key={s.value} value={s.value}>
										{s.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.status && (
							<p className="text-sm text-red-500">{errors.status.message}</p>
						)}
					</div>

					{/* GitHub URL */}
					<div className="space-y-2">
						<Label htmlFor="githubUrl">GitHub URL</Label>
						<Input
							id="githubUrl"
							type="url"
							placeholder="https://github.com/username/repo"
							{...register('githubUrl')}
						/>
						{errors.githubUrl && (
							<p className="text-sm text-red-500">{errors.githubUrl.message}</p>
						)}
					</div>

					{/* Tags */}
					<div className="space-y-2">
						<Label htmlFor="tags">Tags</Label>
						<Input
							id="tags"
							placeholder="ml, web, research"
							{...register('tags')}
						/>
						<p className="text-xs text-gray-500">
							Separate tags with commas
						</p>
						{errors.tags && (
							<p className="text-sm text-red-500">{errors.tags.message}</p>
						)}
					</div>

					{/* Actions */}
					<div className="flex gap-2 justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting} className="bg-black text-white hover:bg-gray-800">
							{isSubmitting ? 'Creating...' : 'Create Project'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
