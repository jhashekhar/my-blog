import './globals.css';
import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';

const ibmPlex = IBM_Plex_Sans({
	weight: ['400', '500', '600'],
	subsets: ['latin']
});

export const metadata: Metadata = {
	title: 'Shekhar Jha',
	description: 'Software Engineer at Peak Energy',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={ibmPlex.className}>{children}</body>
		</html>
	);
}
