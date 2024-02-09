import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: 'Credentials',

			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
				password: { label: 'Password', type: 'password' },
			},

			async authorize(credentials, req) {
				const user = { id: 1, password: '1418', username: 'tulsi' };

				if (user) {
					return user;
				} else {
					return null;
				}
			},
		}),
	],
});

export { handler as GET, handler as POST };
