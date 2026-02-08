'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/instantdb/client';
import {
	deleteProject,
	updateProject,
	addProjectTask,
	toggleProjectTask,
	deleteProjectTask,
	calculateProjectCompletion,
} from '@/lib/actions/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { STATUS_COLORS, PROJECT_STATUSES, type Project, type ProjectStatus } from '@/lib/types/projects';
import { ArrowLeft, Trash2, Plus, Github, Save } from 'lucide-react';

interface ProjectDetailPageProps {
	params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
	const { id } = use(params);
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [newTaskText, setNewTaskText] = useState('');

	const { data, isLoading } = db.useQuery({
		projects: {
			$: { where: { id } },
			projectTasks: {
				$: {
					order: { order: 'asc' },
				},
			},
		},
	});

	const project = data?.projects?.[0] as Project & { projectTasks: any[] };
	const tasks = project?.projectTasks || [];

	const [name, setName] = useState(project?.name || '');
	const [description, setDescription] = useState(project?.description || '');
	const [status, setStatus] = useState<ProjectStatus>(project?.status || 'idea');
	const [githubUrl, setGithubUrl] = useState(project?.githubUrl || '');
	const [tags, setTags] = useState(project?.tags?.join(', ') || '');

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this project?')) {
			return;
		}

		setIsDeleting(true);
		try {
			await deleteProject(id);
			router.push('/learn/projects');
		} catch (error) {
			console.error('Error deleting project:', error);
			alert('Failed to delete project. Please try again.');
			setIsDeleting(false);
		}
	};

	const handleSave = async () => {
		if (!project) return;

		setIsSaving(true);
		try {
			await updateProject({
				id,
				name,
				description,
				status,
				githubUrl,
				tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
			});
		} catch (error) {
			console.error('Error updating project:', error);
			alert('Failed to save changes. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	const handleAddTask = async () => {
		if (!newTaskText.trim()) return;

		try {
			await addProjectTask({
				projectId: id,
				text: newTaskText.trim(),
				order: tasks.length,
			});
			setNewTaskText('');
		} catch (error) {
			console.error('Error adding task:', error);
			alert('Failed to add task. Please try again.');
		}
	};

	const handleToggleTask = async (taskId: string, completed: boolean) => {
		try {
			await toggleProjectTask(taskId, !completed);
		} catch (error) {
			console.error('Error toggling task:', error);
		}
	};

	const handleDeleteTask = async (taskId: string) => {
		if (!confirm('Delete this task?')) return;

		try {
			await deleteProjectTask(taskId);
		} catch (error) {
			console.error('Error deleting task:', error);
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" asChild>
						<Link href="/learn/projects">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Projects
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Loading project...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!project) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" asChild>
						<Link href="/learn/projects">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Projects
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Project not found.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const completion = calculateProjectCompletion(tasks);
	const statusLabel = PROJECT_STATUSES.find((s) => s.value === project.status)?.label || project.status;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<Button variant="ghost" asChild>
					<Link href="/learn/projects">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Projects
					</Link>
				</Button>
				<Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
					<Trash2 className="mr-2 h-4 w-4" />
					Delete Project
				</Button>
			</div>

			{/* Project Info */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1 space-y-4">
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="text-2xl font-bold border-none p-0 focus-visible:ring-0"
								placeholder="Project name"
							/>
							<div className="flex items-center gap-2">
								<Select value={status} onValueChange={(val) => setStatus(val as ProjectStatus)}>
									<SelectTrigger className="w-[180px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{PROJECT_STATUSES.map((s) => (
											<SelectItem key={s.value} value={s.value}>
												{s.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Description */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Description</label>
						<Textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="What is this project about?"
							rows={4}
						/>
					</div>

					{/* GitHub URL */}
					<div className="space-y-2">
						<label className="text-sm font-medium">GitHub URL</label>
						<div className="flex gap-2">
							<Input
								type="url"
								value={githubUrl}
								onChange={(e) => setGithubUrl(e.target.value)}
								placeholder="https://github.com/username/repo"
							/>
							{githubUrl && (
								<Button variant="outline" size="icon" asChild>
									<a href={githubUrl} target="_blank" rel="noopener noreferrer">
										<Github className="h-4 w-4" />
									</a>
								</Button>
							)}
						</div>
					</div>

					{/* Tags */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Tags</label>
						<Input
							value={tags}
							onChange={(e) => setTags(e.target.value)}
							placeholder="ml, web, research"
						/>
						<p className="text-xs text-gray-500">Separate tags with commas</p>
					</div>

					{/* Save Button */}
					<Button onClick={handleSave} disabled={isSaving} className="bg-black text-white hover:bg-gray-800">
						<Save className="mr-2 h-4 w-4" />
						{isSaving ? 'Saving...' : 'Save Changes'}
					</Button>

					{/* Progress */}
					{tasks.length > 0 && (
						<div className="space-y-2 pt-4 border-t">
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Progress</span>
								<span className="font-medium">{completion}%</span>
							</div>
							<Progress value={completion} className="h-3" />
							<p className="text-sm text-gray-500">
								{tasks.filter((t) => t.completed).length} of {tasks.length} tasks completed
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Tasks */}
			<Card>
				<CardHeader>
					<CardTitle>Tasks</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Task List */}
					{tasks.length === 0 ? (
						<p className="text-gray-500 text-center py-8">
							No tasks yet. Add your first task below.
						</p>
					) : (
						<div className="space-y-2">
							{tasks.map((task, index) => (
								<div
									key={task.id}
									className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
								>
									<span className="text-sm text-gray-500 w-6">{index + 1}.</span>
									<Checkbox
										checked={task.completed}
										onCheckedChange={() => handleToggleTask(task.id, task.completed)}
									/>
									<span
										className={`flex-1 ${
											task.completed ? 'line-through text-gray-500' : ''
										}`}
									>
										{task.text}
									</span>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleDeleteTask(task.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					)}

					{/* Add Task */}
					<div className="flex gap-2 pt-4 border-t">
						<Input
							value={newTaskText}
							onChange={(e) => setNewTaskText(e.target.value)}
							placeholder="Add a new task..."
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									handleAddTask();
								}
							}}
						/>
						<Button onClick={handleAddTask} disabled={!newTaskText.trim()}>
							<Plus className="mr-2 h-4 w-4" />
							Add
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Related Papers & Notes (placeholder) */}
			<div className="grid md:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Related Papers</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-500 text-center py-8">
							Link papers to this project (coming soon)
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Related Notes</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-500 text-center py-8">
							Link notes to this project (coming soon)
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
