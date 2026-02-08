import { LoginForm } from '@/components/learn/auth/login-form';

/**
 * Login page for Learning Tracker
 * Uses InstantDB magic code authentication
 */
export default function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Learning Tracker</h1>
					<p className="text-gray-600 mt-2">
						Track papers, notes, and projects
					</p>
					<div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-700">
						<span>🔒</span>
						<span>Private Access Only</span>
					</div>
				</div>
				<LoginForm />
			</div>
		</div>
	);
}
