'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, signOut } from '@/lib/instantdb/client';

const ALLOWED_EMAIL = 'shekhar09jha@gmail.com';

/**
 * Authentication provider that protects the /learn routes
 * Redirects to /learn/login if user is not authenticated
 * Restricts access to specific email only
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const auth = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [isUnauthorized, setIsUnauthorized] = useState(false);

	useEffect(() => {
		// Check if user is on a protected route (not login page)
		const isProtectedRoute = pathname?.startsWith('/learn') && pathname !== '/learn/login';

		// If user is authenticated, verify they have the correct email
		if (!auth.isLoading && auth.user) {
			const userEmail = auth.user.email?.toLowerCase();

			if (userEmail !== ALLOWED_EMAIL) {
				// User is not authorized, sign them out
				setIsUnauthorized(true);
				signOut();
				router.push('/learn/login');
				return;
			}
		}

		// If on protected route and not loading and no user, redirect to login
		if (isProtectedRoute && !auth.isLoading && !auth.user) {
			router.push('/learn/login');
		}

		// If on login page and user is authenticated, redirect to dashboard
		if (pathname === '/learn/login' && !auth.isLoading && auth.user) {
			const userEmail = auth.user.email?.toLowerCase();
			if (userEmail === ALLOWED_EMAIL) {
				router.push('/learn');
			}
		}
	}, [auth.isLoading, auth.user, pathname, router]);

	// Show unauthorized message if user tried to access with wrong email
	if (isUnauthorized) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
				<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
					<div className="text-red-500 text-5xl mb-4">🔒</div>
					<h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
					<p className="text-gray-600 mb-4">
						This learning tracker is private and access is restricted.
					</p>
					<button
						onClick={() => {
							setIsUnauthorized(false);
							router.push('/learn/login');
						}}
						className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
					>
						Back to Login
					</button>
				</div>
			</div>
		);
	}

	// Show loading state while checking authentication
	if (auth.isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
