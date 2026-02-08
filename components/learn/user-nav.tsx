'use client';

import { useAuth, signOut } from '@/lib/instantdb/client';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

/**
 * User navigation dropdown
 * Shows user email and provides sign out functionality
 */
export function UserNav() {
	const auth = useAuth();
	const router = useRouter();

	const handleSignOut = async () => {
		await signOut();
		router.push('/learn/login');
		router.refresh();
	};

	if (!auth.user) {
		return null;
	}

	// Get initials from email (first 2 characters before @)
	const email = auth.user.email || 'User';
	const initials = email.split('@')[0].slice(0, 2).toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-10 w-10 rounded-full">
					<Avatar className="h-10 w-10">
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">Account</p>
						<p className="text-xs leading-none text-gray-500">{email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
					<LogOut className="mr-2 h-4 w-4" />
					<span>Sign out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
