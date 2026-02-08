/**
 * Generate consistent colors for tags
 * Same tag always gets the same color
 */

const TAG_COLORS = [
	'bg-red-100 text-red-800',
	'bg-orange-100 text-orange-800',
	'bg-amber-100 text-amber-800',
	'bg-yellow-100 text-yellow-800',
	'bg-lime-100 text-lime-800',
	'bg-green-100 text-green-800',
	'bg-emerald-100 text-emerald-800',
	'bg-teal-100 text-teal-800',
	'bg-cyan-100 text-cyan-800',
	'bg-sky-100 text-sky-800',
	'bg-blue-100 text-blue-800',
	'bg-indigo-100 text-indigo-800',
	'bg-violet-100 text-violet-800',
	'bg-purple-100 text-purple-800',
	'bg-fuchsia-100 text-fuchsia-800',
	'bg-pink-100 text-pink-800',
	'bg-rose-100 text-rose-800',
];

/**
 * Simple string hash function
 */
function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return Math.abs(hash);
}

/**
 * Get color class for a tag
 * Same tag always returns the same color
 */
export function getTagColor(tag: string): string {
	const hash = hashString(tag.toLowerCase());
	const index = hash % TAG_COLORS.length;
	return TAG_COLORS[index];
}
