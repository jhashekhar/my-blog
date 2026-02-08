'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BookOpen, FileText, FolderKanban, CalendarDays, Route, LayoutDashboard, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

/**
 * Sidebar navigation for the learning tracker app
 * Shows main navigation links and highlights the active route
 * Mobile responsive with collapsible menu
 */

const navItems = [
	{
		title: 'Dashboard',
		href: '/learn',
		icon: LayoutDashboard,
	},
	{
		title: 'Papers',
		href: '/learn/papers',
		icon: BookOpen,
	},
	{
		title: 'Notes',
		href: '/learn/notes',
		icon: FileText,
	},
	{
		title: 'Projects',
		href: '/learn/projects',
		icon: FolderKanban,
	},
	{
		title: 'Journal',
		href: '/learn/journal',
		icon: CalendarDays,
	},
	{
		title: 'Tracks',
		href: '/learn/tracks',
		icon: Route,
	},
];

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
	const pathname = usePathname();

	return (
		<>
			{/* Mobile overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<div
				className={cn(
					'fixed lg:static inset-y-0 left-0 z-50 flex h-full w-64 flex-col gap-2 bg-gray-50 border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0',
					isOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				<div className="px-6 py-4 flex items-center justify-between">
					<Link href="/learn" className="flex items-center gap-2">
						<h2 className="text-xl font-bold tracking-tight">Learning Tracker</h2>
					</Link>
					<button
						onClick={onClose}
						className="lg:hidden p-1 hover:bg-gray-200 rounded"
						aria-label="Close menu"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				<Separator />
				<nav className="flex-1 space-y-1 px-3 py-2">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href || (item.href !== '/learn' && pathname?.startsWith(item.href));

						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={onClose}
								className={cn(
									'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
									isActive
										? 'bg-gray-200 text-gray-900'
										: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
								)}
							>
								<Icon className="h-5 w-5" />
								{item.title}
							</Link>
						);
					})}
				</nav>
			</div>
		</>
	);
}
