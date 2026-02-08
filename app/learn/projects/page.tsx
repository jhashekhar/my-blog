'use client';

import { useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/instantdb/client';
import { AddProjectDialog } from '@/components/learn/projects/add-project-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { calculateProjectCompletion } from '@/lib/actions/projects';
import { STATUS_COLORS, type ProjectStatus, type Project } from '@/lib/types/projects';
import { getTagColor } from '@/lib/utils/tag-colors';
import { FolderKanban, Github } from 'lucide-react';

export default function ProjectsPage() {
	const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

	const { data, isLoading, error } = db.useQuery({
		projects: {
			$: {
				order: { createdAt: 'desc' },
			},
			projectTasks: {
				$: {
					order: { order: 'asc' },
				},
			},
		},
	});

	const projects = (data?.projects || []) as (Project & { projectTasks: any[] })[];

	// Log query results for debugging
	console.log('Projects query:', {
		isLoading,
		error,
		projectCount: projects.length,
		projects: projects.map(p => ({ id: p.id, name: p.name, status: p.status }))
	});

	const filteredProjects =
		statusFilter === 'all'
			? projects
			: projects.filter((p) => p.status === statusFilter);

	const stats = {
		total: projects.length,
		idea: projects.filter((p) => p.status === 'idea').length,
		'in-progress': projects.filter((p) => p.status === 'in-progress').length,
		completed: projects.filter((p) => p.status === 'completed').length,
		'on-hold': projects.filter((p) => p.status === 'on-hold').length,
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Projects</h1>
						<p className="text-gray-600 dark:text-gray-400 mt-1">
							Track your side projects and implementations
						</p>
					</div>
				</div>
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Loading projects...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Projects</h1>
					<p className="text-gray-600 mt-1">
						Track your side projects and implementations
					</p>
				</div>
				<AddProjectDialog />
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">{stats.total}</div>
						<p className="text-xs text-gray-500">Total Projects</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">{stats.idea}</div>
						<p className="text-xs text-gray-500">Ideas</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">{stats['in-progress']}</div>
						<p className="text-xs text-gray-500">In Progress</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">{stats.completed}</div>
						<p className="text-xs text-gray-500">Completed</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">{stats['on-hold']}</div>
						<p className="text-xs text-gray-500">On Hold</p>
					</CardContent>
				</Card>
			</div>

			{/* Tabs */}
			<Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
				<TabsList>
					<TabsTrigger value="all">All ({stats.total})</TabsTrigger>
					<TabsTrigger value="idea">Ideas ({stats.idea})</TabsTrigger>
					<TabsTrigger value="in-progress">
						In Progress ({stats['in-progress']})
					</TabsTrigger>
					<TabsTrigger value="completed">
						Completed ({stats.completed})
					</TabsTrigger>
					<TabsTrigger value="on-hold">On Hold ({stats['on-hold']})</TabsTrigger>
				</TabsList>

				<TabsContent value={statusFilter} className="mt-6">
					{filteredProjects.length === 0 ? (
						<Card>
							<CardContent className="py-12 text-center">
								<FolderKanban className="mx-auto h-12 w-12 text-gray-400 mb-4" />
								<p className="text-gray-500">
									No projects found. Create your first project to get started!
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{filteredProjects.map((project) => {
								const tasks = project.projectTasks || [];
								const completion = calculateProjectCompletion(tasks);
								const statusLabel =
									{
										idea: 'Idea',
										'in-progress': 'In Progress',
										completed: 'Completed',
										'on-hold': 'On Hold',
									}[project.status] || project.status;

								return (
									<Link key={project.id} href={`/learn/projects/${project.id}`}>
										<Card className="hover:shadow-lg transition-shadow h-full">
											<CardHeader>
												<div className="flex items-start justify-between gap-2">
													<div className="flex-1 min-w-0">
														<CardTitle className="text-lg line-clamp-2">
															{project.name}
														</CardTitle>
													</div>
													<Badge className={STATUS_COLORS[project.status]}>
														{statusLabel}
													</Badge>
												</div>
											</CardHeader>
											<CardContent className="space-y-4">
												{/* Description */}
												{project.description && (
													<p className="text-sm text-gray-600 line-clamp-2">
														{project.description}
													</p>
												)}

												{/* Tasks Progress */}
												{tasks.length > 0 && (
													<div className="space-y-2">
														<div className="flex justify-between text-xs">
															<span className="text-gray-500">Progress</span>
															<span className="font-medium">{completion}%</span>
														</div>
														<Progress value={completion} className="h-2" />
														<p className="text-xs text-gray-500">
															{tasks.filter((t) => t.completed).length} of{' '}
															{tasks.length} tasks completed
														</p>
													</div>
												)}

												{/* Tags */}
												{project.tags && project.tags.length > 0 && (
													<div className="flex flex-wrap gap-1">
														{project.tags.slice(0, 3).map((tag) => (
															<Badge key={tag} className={`${getTagColor(tag)} text-xs`}>
																{tag}
															</Badge>
														))}
														{project.tags.length > 3 && (
															<Badge variant="secondary" className="text-xs">
																+{project.tags.length - 3}
															</Badge>
														)}
													</div>
												)}

												{/* GitHub Link */}
												{project.githubUrl && (
													<div className="flex items-center gap-1 text-xs text-gray-500">
														<Github className="h-3 w-3" />
														<span className="truncate">
															{project.githubUrl.replace('https://github.com/', '')}
														</span>
													</div>
												)}
											</CardContent>
										</Card>
									</Link>
								);
							})}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
