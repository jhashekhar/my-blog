'use client';

import { useState } from 'react';
import { AuthProvider } from '@/components/learn/auth/auth-provider';
import { Sidebar } from '@/components/learn/sidebar';
import { UserNav } from '@/components/learn/user-nav';
import { Menu } from 'lucide-react';
import 'katex/dist/katex.min.css';

/**
 * Layout for the /learn routes
 * Includes sidebar navigation, auth protection, and user menu
 * Mobile responsive with hamburger menu
 */
export default function LearnLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<AuthProvider>
			<div className="flex h-screen overflow-hidden">
				{/* Sidebar */}
				<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

				{/* Main content */}
				<div className="flex-1 flex flex-col overflow-hidden relative">
					{/* Header with hamburger and user nav */}
					<div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white border-b border-gray-200 lg:border-none lg:bg-transparent lg:p-0">
						{/* Hamburger menu button - only visible on mobile */}
						<button
							onClick={() => setSidebarOpen(true)}
							className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
							aria-label="Open menu"
						>
							<Menu className="h-6 w-6" />
						</button>

						{/* Spacer for desktop */}
						<div className="hidden lg:block" />

						{/* User navigation */}
						<div className="lg:absolute lg:top-4 lg:right-6 bg-white rounded-full shadow-sm">
							<UserNav />
						</div>
					</div>

					{/* Page content */}
					<main className="flex-1 overflow-y-auto bg-white pt-16 lg:pt-0">
						<div className="container mx-auto p-4 sm:p-6 max-w-7xl">{children}</div>
					</main>
				</div>
			</div>
		</AuthProvider>
	);
}
