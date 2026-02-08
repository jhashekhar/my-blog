import { init, id as generateId } from '@instantdb/react';
import schema from '@/instant.schema';

// App ID from environment
const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID;

if (!APP_ID) {
	throw new Error('NEXT_PUBLIC_INSTANTDB_APP_ID is not defined');
}

/**
 * InstantDB client for learning tracker
 * Initialized with the schema for type safety
 */
export const db = init({
	appId: APP_ID,
	schema,
});

/**
 * Hook to access authentication state
 */
export function useAuth() {
	return db.useAuth();
}

/**
 * Send a magic code to the user's email
 */
export async function signInWithEmail(email: string) {
	return db.auth.sendMagicCode({ email });
}

/**
 * Verify magic code and sign in
 */
export async function verifyMagicCode(email: string, code: string) {
	return db.auth.signInWithMagicCode({ email, code });
}

/**
 * Sign out the current user
 */
export async function signOut() {
	return db.auth.signOut();
}

/**
 * Generate a unique ID for new entities
 * Re-export from InstantDB for convenience
 */
export const id = generateId;

/**
 * Helper to check if user is authenticated
 */
export function isAuthenticated(auth: ReturnType<typeof useAuth>) {
	return !!auth.user;
}
