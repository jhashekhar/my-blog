'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail, verifyMagicCode } from '@/lib/instantdb/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Login form component for InstantDB magic code authentication
 *
 * Flow:
 * 1. User enters email
 * 2. Magic code sent to email
 * 3. User enters code
 * 4. Verification and redirect
 */
export function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	const [step, setStep] = useState<'email' | 'code'>('email');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSendCode = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		// Restrict access to specific email only
		if (email.toLowerCase() !== 'shekhar09jha@gmail.com') {
			setError('Access restricted. This learning tracker is private.');
			setIsLoading(false);
			return;
		}

		try {
			await signInWithEmail(email);
			setStep('code');
		} catch (err) {
			setError('Failed to send magic code. Please try again.');
			console.error('Sign in error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			await verifyMagicCode(email, code);
			router.push('/learn');
			router.refresh();
		} catch (err) {
			setError('Invalid code. Please try again.');
			console.error('Verify error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		setStep('email');
		setCode('');
		setError('');
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Sign in to Learning Tracker</CardTitle>
				<CardDescription>
					{step === 'email'
						? 'Enter your email to receive a magic code'
						: 'Enter the code sent to your email'}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{step === 'email' ? (
					<form onSubmit={handleSendCode} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								autoFocus
							/>
						</div>
						{error && <p className="text-sm text-red-500">{error}</p>}
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? 'Sending...' : 'Send Magic Code'}
						</Button>
					</form>
				) : (
					<form onSubmit={handleVerifyCode} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="code">Magic Code</Label>
							<Input
								id="code"
								type="text"
								placeholder="Enter 6-digit code"
								value={code}
								onChange={(e) => setCode(e.target.value)}
								required
								autoFocus
								maxLength={6}
							/>
						</div>
						{error && <p className="text-sm text-red-500">{error}</p>}
						<div className="flex gap-2">
							<Button type="button" variant="outline" onClick={handleBack} className="flex-1">
								Back
							</Button>
							<Button type="submit" className="flex-1" disabled={isLoading}>
								{isLoading ? 'Verifying...' : 'Verify'}
							</Button>
						</div>
					</form>
				)}
			</CardContent>
		</Card>
	);
}
