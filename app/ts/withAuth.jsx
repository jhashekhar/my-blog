'use client';

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from './context';

export default function withAuth(Component) {
	return function ProtectedRoute(props) {
		// const { isLoggedIn } = useContext(AuthContext);
		const router = useRouter();

		React.useEffect(() => {
			console.log('Value of isLoggedIn: ', isLoggedIn);
			if (true) {
				// If user is not logged in, redirect to login page
				router.replace('/login');
			}
		}); // Dependency array includes isLoggedIn to rerun effect when it changes

		// If user is logged in, return the original component
		return <Component {...props} />;
	};
}
